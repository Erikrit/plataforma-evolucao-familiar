import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
import {
  ehCategoriaBiblioteca,
  ehDificuldade,
  type Dificuldade,
} from "./constantes-desenvolvimento";

type EntradaDesafioPersonalizado = {
  nome?: string;
  instrucao?: string | null;
  categoria?: string | null;
  dificuldade?: string;
  materiais?: string | null;
  duracaoMinutos?: number | null;
};

type EntradaAlteracaoDesafio = {
  nome?: string;
  instrucao?: string | null;
  categoria?: string | null;
  dificuldade?: string;
  materiais?: string | null;
  duracaoMinutos?: number | null;
};

@Injectable()
export class ServicoDesafios {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  /**
   * Biblioteca curada + personalizadas da família (DEV-F01).
   * Inclui flag `guardado` por pessoa (DEV-F03).
   */
  async listarParaPessoa(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    filtro?: { categoria?: string; apenasGuardados?: boolean },
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const categoria = filtro?.categoria?.trim();
    if (categoria && !ehCategoriaBiblioteca(categoria)) {
      return { pessoaId: pessoa.id, total: 0, desafios: [] as const };
    }

    const guardados = await this.prisma.desafioGuardado.findMany({
      where: { pessoaId: pessoa.id },
      select: { desafioId: true },
    });
    const idsGuardados = new Set(guardados.map((g) => g.desafioId));

    const desafios = await this.prisma.desafio.findMany({
      where: {
        ativo: true,
        AND: [
          {
            OR: [
              { origem: "catalogo", familiaId: null },
              { familiaId: pessoa.familiaId },
            ],
          },
          categoria ? { categoria } : {},
          filtro?.apenasGuardados
            ? { id: { in: [...idsGuardados] } }
            : {},
        ],
      },
      orderBy: [{ origem: "asc" }, { nome: "asc" }],
      select: {
        id: true,
        nome: true,
        instrucao: true,
        categoria: true,
        dificuldade: true,
        materiais: true,
        duracaoMinutos: true,
        origem: true,
        familiaId: true,
      },
    });

    const lista = desafios.map((d) => ({
      ...d,
      guardado: idsGuardados.has(d.id),
    }));

    return {
      pessoaId: pessoa.id,
      total: lista.length,
      desafios: lista,
    };
  }

  /** Catálogo global; exige pessoaId para aplicar autorização contextual. */
  async listarCatalogo(
    usuario: UsuarioAutenticado,
    filtro: {
      pessoaId?: string;
      categoria?: string;
      apenasGuardados?: boolean;
    },
  ) {
    const pessoaId = (filtro.pessoaId ?? "").trim();
    if (!pessoaId) {
      throw new ForbiddenException(
        "Informe pessoaId para consultar a biblioteca com autorização.",
      );
    }
    return this.listarParaPessoa(pessoaId, usuario, {
      categoria: filtro.categoria,
      apenasGuardados: filtro.apenasGuardados,
    });
  }

  /** DEV-F02 — nome obrigatório; dificuldade padrão simples. */
  async criarPersonalizado(
    familiaId: string,
    usuario: UsuarioAutenticado,
    entrada: EntradaDesafioPersonalizado,
    pessoaContextoId?: string,
  ) {
    if (usuario.pessoa.familiaId !== familiaId) {
      throw new ForbiddenException("Família fora da sessão.");
    }
    if (pessoaContextoId) {
      await this.exigirDesenvolvimento(pessoaContextoId, usuario);
    } else {
      await this.exigirAlgumDesenvolvimentoNaFamilia(familiaId, usuario);
    }

    const nome = (entrada.nome ?? "").trim();
    if (!nome) {
      throw new BadRequestException("Nome da brincadeira é obrigatório.");
    }

    const dificuldade = this.resolverDificuldade(entrada.dificuldade, "simples");
    const categoria = this.resolverCategoriaOpcional(entrada.categoria);

    const criado = await this.prisma.desafio.create({
      data: {
        familiaId,
        nome,
        instrucao: this.textoOpcional(entrada.instrucao),
        categoria,
        dificuldade,
        materiais: this.textoOpcional(entrada.materiais),
        duracaoMinutos: this.numeroOpcional(entrada.duracaoMinutos),
        origem: "personalizada",
        ativo: true,
        criadoPorId: usuario.id,
      },
      select: {
        id: true,
        nome: true,
        instrucao: true,
        categoria: true,
        dificuldade: true,
        materiais: true,
        duracaoMinutos: true,
        origem: true,
        familiaId: true,
        criadoEm: true,
      },
    });

    return criado;
  }

  async criarPersonalizadoParaPessoa(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: EntradaDesafioPersonalizado,
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    return this.criarPersonalizado(
      pessoa.familiaId,
      usuario,
      entrada,
      pessoa.id,
    );
  }

  /**
   * Altera metadados futuros. Não toca participações/pontos já gravados
   * (estes usam snapshot em DEV-F04/F05).
   */
  async alterar(
    desafioId: string,
    usuario: UsuarioAutenticado,
    entrada: EntradaAlteracaoDesafio,
  ) {
    const desafio = await this.prisma.desafio.findUnique({
      where: { id: desafioId },
    });
    if (!desafio || !desafio.ativo) {
      throw new NotFoundException("Brincadeira não encontrada.");
    }
    if (desafio.origem !== "personalizada" || !desafio.familiaId) {
      throw new ForbiddenException(
        "Somente brincadeiras personalizadas podem ser alteradas.",
      );
    }
    if (desafio.familiaId !== usuario.pessoa.familiaId) {
      throw new ForbiddenException("Brincadeira fora da família da sessão.");
    }
    await this.exigirAlgumDesenvolvimentoNaFamilia(
      desafio.familiaId,
      usuario,
    );

    const data: {
      nome?: string;
      instrucao?: string | null;
      categoria?: string | null;
      dificuldade?: Dificuldade;
      materiais?: string | null;
      duracaoMinutos?: number | null;
    } = {};

    if (entrada.nome !== undefined) {
      const nome = entrada.nome.trim();
      if (!nome) throw new BadRequestException("Nome não pode ser vazio.");
      data.nome = nome;
    }
    if (entrada.instrucao !== undefined) {
      data.instrucao = this.textoOpcional(entrada.instrucao);
    }
    if (entrada.categoria !== undefined) {
      data.categoria = this.resolverCategoriaOpcional(entrada.categoria);
    }
    if (entrada.dificuldade !== undefined) {
      data.dificuldade = this.resolverDificuldade(entrada.dificuldade);
    }
    if (entrada.materiais !== undefined) {
      data.materiais = this.textoOpcional(entrada.materiais);
    }
    if (entrada.duracaoMinutos !== undefined) {
      data.duracaoMinutos = this.numeroOpcional(entrada.duracaoMinutos);
    }

    return this.prisma.desafio.update({
      where: { id: desafio.id },
      data,
      select: {
        id: true,
        nome: true,
        instrucao: true,
        categoria: true,
        dificuldade: true,
        materiais: true,
        duracaoMinutos: true,
        origem: true,
        familiaId: true,
      },
    });
  }

  /** DEV-F03 — marcar como guardada, sem prazo. */
  async guardar(
    pessoaId: string,
    desafioId: string,
    usuario: UsuarioAutenticado,
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    await this.exigirDesafioVisivel(desafioId, pessoa.familiaId);

    const existente = await this.prisma.desafioGuardado.findUnique({
      where: {
        pessoaId_desafioId: { pessoaId: pessoa.id, desafioId },
      },
    });
    if (existente) {
      return {
        pessoaId: pessoa.id,
        desafioId,
        guardado: true,
        guardadoEm: existente.guardadoEm,
        jaEstavaGuardado: true,
      };
    }

    const criado = await this.prisma.desafioGuardado.create({
      data: { pessoaId: pessoa.id, desafioId },
    });
    return {
      pessoaId: pessoa.id,
      desafioId,
      guardado: true,
      guardadoEm: criado.guardadoEm,
      jaEstavaGuardado: false,
    };
  }

  /** DEV-F03 — retirar da lista guardada. */
  async retirarGuardado(
    pessoaId: string,
    desafioId: string,
    usuario: UsuarioAutenticado,
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    await this.prisma.desafioGuardado.deleteMany({
      where: { pessoaId: pessoa.id, desafioId },
    });
    return {
      pessoaId: pessoa.id,
      desafioId,
      guardado: false,
    };
  }

  private async exigirDesafioVisivel(desafioId: string, familiaId: string) {
    const desafio = await this.prisma.desafio.findFirst({
      where: {
        id: desafioId,
        ativo: true,
        OR: [
          { origem: "catalogo", familiaId: null },
          { familiaId },
        ],
      },
    });
    if (!desafio) {
      throw new NotFoundException("Brincadeira não encontrada.");
    }
    return desafio;
  }

  private async exigirAlgumDesenvolvimentoNaFamilia(
    familiaId: string,
    usuario: UsuarioAutenticado,
  ) {
    if (usuario.pessoa.familiaId !== familiaId) {
      throw new ForbiddenException("Família fora da sessão.");
    }
    const autorizacoes = await this.prisma.autorizacao.findMany({
      where: {
        familiaId,
        usuarioId: usuario.id,
        ativa: true,
        responsabilidade: "responsavel_desenvolvimento",
      },
    });
    if (autorizacoes.length === 0) {
      throw new ForbiddenException(
        "É necessário ser responsável de desenvolvimento.",
      );
    }
  }

  private resolverDificuldade(
    valor: string | undefined,
    padrao?: Dificuldade,
  ): Dificuldade {
    if (valor === undefined || valor === null || valor === "") {
      if (padrao) return padrao;
      throw new BadRequestException("Dificuldade inválida.");
    }
    const normalizado = valor.trim().toLowerCase();
    if (!ehDificuldade(normalizado)) {
      throw new BadRequestException(
        "Dificuldade deve ser simples, media ou desafiadora.",
      );
    }
    return normalizado;
  }

  private resolverCategoriaOpcional(
    valor: string | null | undefined,
  ): string | null {
    if (valor === undefined || valor === null || valor.trim() === "") {
      return null;
    }
    const normalizado = valor.trim();
    if (!ehCategoriaBiblioteca(normalizado)) {
      throw new BadRequestException("Categoria inválida.");
    }
    return normalizado;
  }

  private textoOpcional(valor: string | null | undefined): string | null {
    if (valor === undefined || valor === null) return null;
    const t = valor.trim();
    return t.length ? t : null;
  }

  private numeroOpcional(valor: number | null | undefined): number | null {
    if (valor === undefined || valor === null) return null;
    if (!Number.isFinite(valor) || valor <= 0) {
      throw new BadRequestException("Duração inválida.");
    }
    return Math.floor(valor);
  }

  private async exigirDesenvolvimento(
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ) {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id: pessoaId },
    });
    if (!pessoa) throw new NotFoundException("Pessoa não encontrada.");
    if (pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new ForbiddenException("Pessoa fora da família da sessão.");
    }
    const pode = await this.autorizacoes.podeVerDesenvolvimento(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException(
        "Acesso negado ao desenvolvimento desta pessoa.",
      );
    }
    return pessoa;
  }
}
