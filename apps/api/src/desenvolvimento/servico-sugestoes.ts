import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
import {
  LIMITE_CATALOGO_ATIVO,
  LIMITE_RENOVAR_SUGESTOES,
  LIMITE_SUGESTOES_PESSOA,
} from "./constantes-desenvolvimento";

type DesafioCatalogo = {
  id: string;
  nome: string;
  instrucao: string | null;
  categoria: string | null;
  dificuldade: string;
  materiais: string | null;
  duracaoMinutos: number | null;
  faixaEtariaMin: number | null;
  faixaEtariaMax: number | null;
  origemConteudo: string | null;
  versaoConteudo: number;
  adaptacoes: string | null;
  supervisao: string | null;
  origem: string;
};

@Injectable()
export class ServicoSugestoes {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  /** E4-ACE-01 — teto de modelos ativos do catálogo global. */
  async contarCatalogoAtivo(): Promise<number> {
    return this.prisma.desafio.count({
      where: { origem: "catalogo", familiaId: null, ativo: true },
    });
  }

  async garantirEspacoNoCatalogo(quantidadeNova = 1) {
    const ativos = await this.contarCatalogoAtivo();
    if (ativos + quantidadeNova > LIMITE_CATALOGO_ATIVO) {
      throw new ConflictException(
        `Catálogo ativo limitado a ${LIMITE_CATALOGO_ATIVO} modelos publicados.`,
      );
    }
  }

  /**
   * Lista sugestões da pessoa; se vazio, monta até 6 elegíveis e persiste.
   * E4-ACE-02/04 — sem exigir novos dados pessoais.
   */
  async listarParaPessoa(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    let linhas = await this.carregarLinhas(pessoa.id);
    if (linhas.length === 0) {
      await this.gerarSelecaoInicial(pessoa.id, usuario.id, pessoa.dataNascimento);
      linhas = await this.carregarLinhas(pessoa.id);
    }

    const mensagem =
      linhas.length === 0
        ? "Não há sugestões elegíveis no momento."
        : linhas.length < LIMITE_SUGESTOES_PESSOA
          ? "Poucas opções elegíveis agora; mostramos as disponíveis."
          : null;

    return {
      pessoaId: pessoa.id,
      limite: LIMITE_SUGESTOES_PESSOA,
      total: linhas.length,
      mensagem,
      sugestoes: linhas.map((l) => this.formatarItem(l)),
    };
  }

  /**
   * Marca escolha explícita (não é guardado legado nem participação).
   * E4-ACE-04/05 — exige organização de desenvolvimento.
   */
  async escolher(
    pessoaId: string,
    desafioId: string,
    usuario: UsuarioAutenticado,
  ) {
    const pessoa = await this.exigirOrganizacao(pessoaId, usuario);
    const id = desafioId.trim();
    const linha = await this.prisma.sugestaoDesafioPessoa.findUnique({
      where: {
        pessoaId_desafioId: { pessoaId: pessoa.id, desafioId: id },
      },
      include: { desafio: true },
    });
    if (!linha || !linha.desafio.ativo) {
      throw new NotFoundException("Sugestão não encontrada para esta pessoa.");
    }
    if (linha.escolhida) {
      return {
        pessoaId: pessoa.id,
        desafioId: id,
        escolhida: true,
        jaEstavaEscolhida: true,
        sugestoes: (await this.listarParaPessoa(pessoa.id, usuario)).sugestoes,
      };
    }

    const atualizado = await this.prisma.sugestaoDesafioPessoa.update({
      where: { id: linha.id },
      data: { escolhida: true, atualizadoPorId: usuario.id },
    });

    return {
      pessoaId: pessoa.id,
      desafioId: id,
      escolhida: true,
      jaEstavaEscolhida: false,
      atualizadoEm: atualizado.atualizadoEm,
      sugestoes: (await this.listarParaPessoa(pessoa.id, usuario)).sugestoes,
    };
  }

  /**
   * Substitui até 3 não escolhidas. Preserva escolhidas/personalizadas/histórico.
   * E4-ACE-03/05 — sem pontos nem reabertura de Executadas.
   */
  async renovar(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirOrganizacao(pessoaId, usuario);

    try {
      const resultado = await this.prisma.$transaction(
        async (tx) => {
          const atuais = await tx.sugestaoDesafioPessoa.findMany({
            where: { pessoaId: pessoa.id },
            include: {
              desafio: {
                select: {
                  id: true,
                  nome: true,
                  instrucao: true,
                  categoria: true,
                  dificuldade: true,
                  materiais: true,
                  duracaoMinutos: true,
                  faixaEtariaMin: true,
                  faixaEtariaMax: true,
                  origemConteudo: true,
                  versaoConteudo: true,
                  adaptacoes: true,
                  supervisao: true,
                  origem: true,
                  ativo: true,
                },
              },
            },
            orderBy: [{ escolhida: "desc" }, { criadoEm: "asc" }, { id: "asc" }],
          });

          const substituiveis = atuais
            .filter((s) => !s.escolhida)
            .slice(0, LIMITE_RENOVAR_SUGESTOES);
          if (substituiveis.length === 0) {
            return {
              trocadas: 0,
              mensagem:
                atuais.length === 0
                  ? "Não há sugestões para renovar."
                  : "Não há novas sugestões disponíveis no momento",
              preservadas: atuais.filter((s) => s.escolhida).length,
            };
          }

          const idsAtuais = new Set(atuais.map((s) => s.desafioId));
          const candidatos = await this.buscarCandidatos(tx, {
            pessoaId: pessoa.id,
            dataNascimento: pessoa.dataNascimento,
            excluirIds: idsAtuais,
            limite: substituiveis.length,
          });

          if (candidatos.length === 0) {
            return {
              trocadas: 0,
              mensagem: "Não há novas sugestões disponíveis no momento",
              preservadas: atuais.filter((s) => s.escolhida).length,
            };
          }

          const aRemover = substituiveis.slice(0, candidatos.length);
          await tx.sugestaoDesafioPessoa.deleteMany({
            where: { id: { in: aRemover.map((s) => s.id) } },
          });
          await tx.sugestaoDesafioPessoa.createMany({
            data: candidatos.map((c) => ({
              pessoaId: pessoa.id,
              desafioId: c.id,
              escolhida: false,
              atualizadoPorId: usuario.id,
            })),
          });

          return {
            trocadas: candidatos.length,
            mensagem:
              candidatos.length < aRemover.length
                ? "Renovamos o que havia de novo; algumas opções foram mantidas."
                : null,
            preservadas: atuais.filter((s) => s.escolhida).length,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      const listagem = await this.listarParaPessoa(pessoa.id, usuario);
      return {
        pessoaId: pessoa.id,
        ...resultado,
        sugestoes: listagem.sugestoes,
      };
    } catch (erro: unknown) {
      if (this.ehConflitoSerializacao(erro)) {
        throw new ConflictException(
          "Outra renovação está em andamento. Tente novamente.",
        );
      }
      throw erro;
    }
  }

  private async gerarSelecaoInicial(
    pessoaId: string,
    usuarioId: string,
    dataNascimento: Date | null,
  ) {
    await this.prisma.$transaction(
      async (tx) => {
        const existentes = await tx.sugestaoDesafioPessoa.count({
          where: { pessoaId },
        });
        if (existentes > 0) return;

        const candidatos = await this.buscarCandidatos(tx, {
          pessoaId,
          dataNascimento,
          excluirIds: new Set(),
          limite: LIMITE_SUGESTOES_PESSOA,
        });
        if (candidatos.length === 0) return;

        await tx.sugestaoDesafioPessoa.createMany({
          data: candidatos.map((c) => ({
            pessoaId,
            desafioId: c.id,
            escolhida: false,
            atualizadoPorId: usuarioId,
          })),
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  private async buscarCandidatos(
    tx: Prisma.TransactionClient,
    opts: {
      pessoaId: string;
      dataNascimento: Date | null;
      excluirIds: Set<string>;
      limite: number;
    },
  ): Promise<DesafioCatalogo[]> {
    const catalogo = await tx.desafio.findMany({
      where: {
        origem: "catalogo",
        familiaId: null,
        ativo: true,
        ...(opts.excluirIds.size
          ? { id: { notIn: [...opts.excluirIds] } }
          : {}),
      },
      select: {
        id: true,
        nome: true,
        instrucao: true,
        categoria: true,
        dificuldade: true,
        materiais: true,
        duracaoMinutos: true,
        faixaEtariaMin: true,
        faixaEtariaMax: true,
        origemConteudo: true,
        versaoConteudo: true,
        adaptacoes: true,
        supervisao: true,
        origem: true,
      },
      orderBy: [{ categoria: "asc" }, { nome: "asc" }, { id: "asc" }],
    });

    const disponibilidades = await tx.disponibilidadeDesafio.findMany({
      where: { pessoaId: opts.pessoaId },
      select: { desafioId: true, disponivelParaNovaParticipacao: true },
    });
    const mapaDisp = new Map(
      disponibilidades.map((d) => [d.desafioId, d.disponivelParaNovaParticipacao]),
    );
    const participacoes = await tx.participacaoDesafio.findMany({
      where: { pessoaId: opts.pessoaId, versaoAtiva: true },
      select: { desafioId: true },
      distinct: ["desafioId"],
    });
    const comParticipacao = new Set(participacoes.map((p) => p.desafioId));

    const elegiveis = catalogo.filter((d) => {
      const row = mapaDisp.get(d.id);
      if (row !== undefined) return row;
      return !comParticipacao.has(d.id);
    });

    const idade = this.idadeEmAnos(opts.dataNascimento);
    const preferidos =
      idade === null
        ? elegiveis
        : elegiveis.filter((d) => this.combinaFaixa(d, idade));
    const base = preferidos.length > 0 ? preferidos : elegiveis;

    return this.diversificarPorCategoria(base, opts.limite);
  }

  private diversificarPorCategoria(
    itens: DesafioCatalogo[],
    limite: number,
  ): DesafioCatalogo[] {
    const porCategoria = new Map<string, DesafioCatalogo[]>();
    for (const item of itens) {
      const chave = item.categoria ?? "sem_categoria";
      const lista = porCategoria.get(chave) ?? [];
      lista.push(item);
      porCategoria.set(chave, lista);
    }
    const filas = [...porCategoria.values()];
    const escolhidos: DesafioCatalogo[] = [];
    let indice = 0;
    while (escolhidos.length < limite && filas.some((f) => f.length > 0)) {
      const fila = filas[indice % filas.length];
      if (fila.length > 0) {
        escolhidos.push(fila.shift()!);
      }
      indice += 1;
    }
    return escolhidos;
  }

  private combinaFaixa(
    d: { faixaEtariaMin: number | null; faixaEtariaMax: number | null },
    idade: number,
  ): boolean {
    const min = d.faixaEtariaMin ?? 0;
    const max = d.faixaEtariaMax ?? 200;
    return idade >= min && idade <= max;
  }

  private idadeEmAnos(dataNascimento: Date | null): number | null {
    if (!dataNascimento) return null;
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade -= 1;
    }
    return idade >= 0 ? idade : null;
  }

  private async carregarLinhas(pessoaId: string) {
    return this.prisma.sugestaoDesafioPessoa.findMany({
      where: { pessoaId, desafio: { ativo: true } },
      include: {
        desafio: {
          select: {
            id: true,
            nome: true,
            instrucao: true,
            categoria: true,
            dificuldade: true,
            materiais: true,
            duracaoMinutos: true,
            faixaEtariaMin: true,
            faixaEtariaMax: true,
            origemConteudo: true,
            versaoConteudo: true,
            adaptacoes: true,
            supervisao: true,
            origem: true,
          },
        },
      },
      orderBy: [{ escolhida: "desc" }, { criadoEm: "asc" }, { id: "asc" }],
    });
  }

  private formatarItem(
    linha: Awaited<ReturnType<ServicoSugestoes["carregarLinhas"]>>[number],
  ) {
    const d = linha.desafio;
    return {
      id: d.id,
      nome: d.nome,
      instrucao: d.instrucao,
      categoria: d.categoria,
      dificuldade: d.dificuldade,
      materiais: d.materiais,
      duracaoMinutos: d.duracaoMinutos,
      faixaEtariaMin: d.faixaEtariaMin,
      faixaEtariaMax: d.faixaEtariaMax,
      origemConteudo: d.origemConteudo,
      versaoConteudo: d.versaoConteudo,
      adaptacoes: d.adaptacoes,
      supervisao: d.supervisao,
      origem: d.origem,
      escolhida: linha.escolhida,
      atualizadoEm: linha.atualizadoEm,
    };
  }

  private ehConflitoSerializacao(erro: unknown): boolean {
    if (!erro || typeof erro !== "object") return false;
    const codigo = "code" in erro ? String((erro as { code?: string }).code) : "";
    return codigo === "P2034";
  }

  private async exigirOrganizacao(
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const auth = await this.prisma.autorizacao.findFirst({
      where: {
        familiaId: pessoa.familiaId,
        usuarioId: usuario.id,
        ativa: true,
        responsabilidade: "responsavel_desenvolvimento",
        OR: [{ pessoaAlvoId: pessoa.id }, { pessoaAlvoId: null }],
      },
    });
    if (!auth) {
      throw new ForbiddenException(
        "É necessário ser responsável de desenvolvimento para escolher ou renovar sugestões.",
      );
    }
    return pessoa;
  }

  private async exigirDesenvolvimento(
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ) {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id: pessoaId },
    });
    if (!pessoa || pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new NotFoundException("Pessoa não encontrada.");
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
