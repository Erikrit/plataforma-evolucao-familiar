import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
import {
  ehDificuldade,
  ehResultadoParticipacao,
  estrelasPara,
  type Dificuldade,
  type ResultadoParticipacao,
} from "./constantes-desenvolvimento";

type EntradaParticipacao = {
  desafioId?: string;
  resultado?: string;
  observacao?: string | null;
  /** Identidade da execução; reenvio com a mesma chave não duplica. */
  execucaoChave?: string;
};

@Injectable()
export class ServicoParticipacoes {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  /**
   * DEV-F04/F05 + ADR-008: participação + movimento de estrelas atômicos.
   * Frontend não envia quantidade de estrelas.
   */
  async registrar(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: EntradaParticipacao,
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const desafioId = (entrada.desafioId ?? "").trim();
    if (!desafioId) {
      throw new BadRequestException("desafioId é obrigatório.");
    }

    const resultadoBruto = (entrada.resultado ?? "").trim().toLowerCase();
    if (!ehResultadoParticipacao(resultadoBruto)) {
      throw new BadRequestException(
        "Resultado deve ser concluiu ou participou.",
      );
    }
    const resultado: ResultadoParticipacao = resultadoBruto;

    const desafio = await this.prisma.desafio.findFirst({
      where: {
        id: desafioId,
        ativo: true,
        OR: [
          { origem: "catalogo", familiaId: null },
          { familiaId: pessoa.familiaId },
        ],
      },
    });
    if (!desafio) {
      throw new NotFoundException("Brincadeira não encontrada.");
    }
    if (!ehDificuldade(desafio.dificuldade)) {
      throw new ConflictException("Dificuldade do desafio inválida.");
    }
    const dificuldadeAplicada: Dificuldade = desafio.dificuldade;
    const estrelas = estrelasPara(dificuldadeAplicada, resultado);
    const observacao = this.textoOpcional(entrada.observacao);
    const execucaoChave =
      (entrada.execucaoChave ?? "").trim() || randomUUID();

    const existente = await this.prisma.participacaoDesafio.findUnique({
      where: { execucaoChave },
      include: {
        movimentos: { orderBy: { criadoEm: "asc" }, take: 1 },
      },
    });
    if (existente) {
      if (
        existente.pessoaId !== pessoa.id ||
        existente.desafioId !== desafio.id
      ) {
        throw new ConflictException(
          "execucaoChave já usada em outro contexto.",
        );
      }
      return this.formatarParticipacao(existente, {
        idempotente: true,
        saldoAtual: await this.saldoAtual(pessoa.id),
      });
    }

    try {
      const criado = await this.prisma.$transaction(async (tx) => {
        const ultimo = await tx.movimentoEstrelas.findFirst({
          where: { pessoaId: pessoa.id },
          orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
        });
        const saldoAntes = ultimo?.saldoApos ?? 0;
        const saldoApos = saldoAntes + estrelas;

        const participacao = await tx.participacaoDesafio.create({
          data: {
            pessoaId: pessoa.id,
            desafioId: desafio.id,
            resultado,
            observacao,
            execucaoChave,
            dificuldadeAplicada,
            estrelasConcedidas: estrelas,
            registradoPorId: usuario.id,
            versaoAtiva: true,
          },
        });

        await tx.movimentoEstrelas.create({
          data: {
            pessoaId: pessoa.id,
            tipo: "credito_participacao",
            quantidade: estrelas,
            saldoApos,
            participacaoId: participacao.id,
          },
        });

        return participacao;
      });

      return this.formatarParticipacao(criado, {
        idempotente: false,
        saldoAtual: await this.saldoAtual(pessoa.id),
      });
    } catch (erro: unknown) {
      const codigo =
        erro && typeof erro === "object" && "code" in erro
          ? String((erro as { code?: string }).code)
          : "";
      if (codigo === "P2002") {
        const deNovo = await this.prisma.participacaoDesafio.findUnique({
          where: { execucaoChave },
        });
        if (deNovo) {
          return this.formatarParticipacao(deNovo, {
            idempotente: true,
            saldoAtual: await this.saldoAtual(pessoa.id),
          });
        }
      }
      throw erro;
    }
  }

  /**
   * Correção com rastreabilidade: nova versão ativa, ajusta saldo pela diferença.
   */
  async corrigir(
    participacaoId: string,
    usuario: UsuarioAutenticado,
    entrada: { resultado?: string; observacao?: string | null },
  ) {
    const atual = await this.prisma.participacaoDesafio.findUnique({
      where: { id: participacaoId },
      include: { pessoa: true },
    });
    if (!atual || !atual.versaoAtiva) {
      throw new NotFoundException("Participação não encontrada.");
    }
    await this.exigirDesenvolvimento(atual.pessoaId, usuario);

    const resultadoBruto = (entrada.resultado ?? atual.resultado)
      .trim()
      .toLowerCase();
    if (!ehResultadoParticipacao(resultadoBruto)) {
      throw new BadRequestException(
        "Resultado deve ser concluiu ou participou.",
      );
    }
    if (!ehDificuldade(atual.dificuldadeAplicada)) {
      throw new ConflictException("Snapshot de dificuldade inválido.");
    }
    const dificuldadeAplicada: Dificuldade = atual.dificuldadeAplicada;
    const resultado: ResultadoParticipacao = resultadoBruto;
    const novasEstrelas = estrelasPara(dificuldadeAplicada, resultado);
    const delta = novasEstrelas - atual.estrelasConcedidas;
    const observacao =
      entrada.observacao !== undefined
        ? this.textoOpcional(entrada.observacao)
        : atual.observacao;

    const corrigida = await this.prisma.$transaction(async (tx) => {
      await tx.participacaoDesafio.update({
        where: { id: atual.id },
        data: { versaoAtiva: false },
      });

      const nova = await tx.participacaoDesafio.create({
        data: {
          pessoaId: atual.pessoaId,
          desafioId: atual.desafioId,
          resultado,
          observacao,
          execucaoChave: `${atual.execucaoChave}:correcao:${randomUUID()}`,
          dificuldadeAplicada,
          estrelasConcedidas: novasEstrelas,
          registradoPorId: usuario.id,
          versaoAtiva: true,
          substituiId: atual.id,
        },
      });

      if (delta !== 0) {
        const ultimo = await tx.movimentoEstrelas.findFirst({
          where: { pessoaId: atual.pessoaId },
          orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
        });
        const saldoAntes = ultimo?.saldoApos ?? 0;
        await tx.movimentoEstrelas.create({
          data: {
            pessoaId: atual.pessoaId,
            tipo: "ajuste_correcao",
            quantidade: delta,
            saldoApos: saldoAntes + delta,
            participacaoId: nova.id,
          },
        });
      }

      return nova;
    });

    return this.formatarParticipacao(corrigida, {
      idempotente: false,
      saldoAtual: await this.saldoAtual(atual.pessoaId),
      substituiId: atual.id,
    });
  }

  async consultarEstrelas(pessoaId: string, usuario: UsuarioAutenticado) {
    await this.exigirDesenvolvimento(pessoaId, usuario);
    const movimentos = await this.prisma.movimentoEstrelas.findMany({
      where: { pessoaId },
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
      take: 30,
      select: {
        id: true,
        tipo: true,
        quantidade: true,
        saldoApos: true,
        participacaoId: true,
        resgateId: true,
        criadoEm: true,
      },
    });
    const saldo = movimentos[0]?.saldoApos ?? 0;
    const creditos = await this.prisma.movimentoEstrelas.aggregate({
      where: { pessoaId, quantidade: { gt: 0 } },
      _sum: { quantidade: true },
    });
    const debitos = await this.prisma.movimentoEstrelas.aggregate({
      where: { pessoaId, quantidade: { lt: 0 } },
      _sum: { quantidade: true },
    });
    const resgates = await this.prisma.resgateRecompensa.findMany({
      where: { pessoaId },
      orderBy: { resgatadoEm: "desc" },
      take: 10,
      select: {
        id: true,
        recompensaId: true,
        custoAplicado: true,
        resgatadoEm: true,
        recompensa: { select: { nome: true, custo: true } },
      },
    });
    return {
      pessoaId,
      saldoDisponivel: saldo,
      totalConquistado: creditos._sum.quantidade ?? 0,
      totalResgatado: Math.abs(debitos._sum.quantidade ?? 0),
      movimentosRecentes: movimentos,
      resgatesRecentes: resgates.map((r) => ({
        id: r.id,
        recompensaId: r.recompensaId,
        nome: r.recompensa.nome,
        custoAplicado: r.custoAplicado,
        custoAtualCatalogo: r.recompensa.custo,
        resgatadoEm: r.resgatadoEm,
      })),
    };
  }

  private formatarParticipacao(
    p: {
      id: string;
      pessoaId: string;
      desafioId: string;
      resultado: string;
      observacao: string | null;
      execucaoChave: string;
      dificuldadeAplicada: string;
      estrelasConcedidas: number;
      registradoPorId: string;
      registradoEm: Date;
      versaoAtiva: boolean;
      substituiId?: string | null;
    },
    extra: {
      idempotente: boolean;
      saldoAtual: number;
      substituiId?: string;
    },
  ) {
    return {
      id: p.id,
      pessoaId: p.pessoaId,
      desafioId: p.desafioId,
      resultado: p.resultado,
      observacao: p.observacao,
      execucaoChave: p.execucaoChave,
      dificuldadeAplicada: p.dificuldadeAplicada,
      estrelasConcedidas: p.estrelasConcedidas,
      registradoPorId: p.registradoPorId,
      registradoEm: p.registradoEm,
      versaoAtiva: p.versaoAtiva,
      substituiId: extra.substituiId ?? p.substituiId ?? null,
      idempotente: extra.idempotente,
      saldoAtual: extra.saldoAtual,
    };
  }

  private async saldoAtual(pessoaId: string): Promise<number> {
    const ultimo = await this.prisma.movimentoEstrelas.findFirst({
      where: { pessoaId },
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    });
    return ultimo?.saldoApos ?? 0;
  }

  private textoOpcional(valor: string | null | undefined): string | null {
    if (valor === undefined || valor === null) return null;
    const t = valor.trim();
    return t.length ? t : null;
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
