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
  CATEGORIAS_BIBLIOTECA,
  LIMITE_ATIVAS_POR_CATEGORIA,
  LIMITE_CATALOGO_ATIVO,
  LIMITE_RENOVAR_SUGESTOES,
  LIMITE_SUGESTOES_PESSOA,
  MENSAGEM_LIMITE_ATIVAS,
  MENSAGEM_SEM_NOVAS_SUGESTOES,
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

const SELECT_DESAFIO = {
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
} as const;

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
   * Lista só as candidatas atuais. Não gera oferta nem grava exposição.
   * E4-ACE-02/09 — descoberta sob demanda.
   */
  async listarParaPessoa(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const linhas = await this.carregarCandidatas(pessoa.id);
    return {
      pessoaId: pessoa.id,
      limite: LIMITE_SUGESTOES_PESSOA,
      total: linhas.length,
      mensagem: null as string | null,
      sugestoes: linhas.map((l) => this.formatarItem(l)),
    };
  }

  /**
   * Monta ou renova até duas candidatas elegíveis.
   * E4-ACE-02/03 — reposição apenas sob ação explícita.
   */
  async renovar(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    filtro?: { categoria?: string },
  ) {
    const pessoa = await this.exigirOrganizacao(pessoaId, usuario);
    const categoriaFiltro = filtro?.categoria?.trim() || undefined;

    try {
      const resultado = await this.prisma.$transaction(
        async (tx) => {
          const atuais = await tx.sugestaoDesafioPessoa.findMany({
            where: { pessoaId: pessoa.id, candidata: true, escolhida: false },
            include: { desafio: { select: SELECT_DESAFIO } },
            orderBy: [{ criadoEm: "asc" }, { id: "asc" }],
          });

          const idsAtuais = new Set(atuais.map((s) => s.desafioId));
          const candidatos = await this.buscarCandidatos(tx, {
            pessoaId: pessoa.id,
            familiaId: pessoa.familiaId,
            dataNascimento: pessoa.dataNascimento,
            excluirIds: idsAtuais,
            limite: LIMITE_RENOVAR_SUGESTOES,
            categoriaFiltro,
          });

          if (candidatos.length === 0) {
            const elegiveisAtuais = await this.filtrarAindaElegiveis(
              tx,
              pessoa.id,
              pessoa.familiaId,
              atuais,
              categoriaFiltro,
            );
            if (elegiveisAtuais.length === 0 && atuais.length > 0) {
              await tx.sugestaoDesafioPessoa.updateMany({
                where: { id: { in: atuais.map((s) => s.id) } },
                data: { candidata: false, atualizadoPorId: usuario.id },
              });
            }
            return {
              trocadas: 0,
              mensagem: MENSAGEM_SEM_NOVAS_SUGESTOES,
              preservadas: elegiveisAtuais.length,
            };
          }

          const aRemover = atuais.slice(0, candidatos.length);
          if (aRemover.length > 0) {
            await tx.sugestaoDesafioPessoa.updateMany({
              where: { id: { in: aRemover.map((s) => s.id) } },
              data: {
                candidata: false,
                exposta: true,
                atualizadoPorId: usuario.id,
              },
            });
          }

          for (const c of candidatos) {
            await tx.sugestaoDesafioPessoa.upsert({
              where: {
                pessoaId_desafioId: {
                  pessoaId: pessoa.id,
                  desafioId: c.id,
                },
              },
              create: {
                pessoaId: pessoa.id,
                desafioId: c.id,
                escolhida: false,
                candidata: true,
                exposta: true,
                retiradaSemParticipacao: false,
                atualizadoPorId: usuario.id,
              },
              update: {
                escolhida: false,
                candidata: true,
                exposta: true,
                retiradaSemParticipacao: false,
                atualizadoPorId: usuario.id,
              },
            });
          }

          return {
            trocadas: candidatos.length,
            mensagem:
              candidatos.length < LIMITE_RENOVAR_SUGESTOES && atuais.length > 0
                ? "Renovamos o que havia de novo; algumas opções foram mantidas."
                : null,
            preservadas: Math.max(0, atuais.length - aRemover.length),
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      const listagem = await this.listarParaPessoa(pessoa.id, usuario);
      return {
        pessoaId: pessoa.id,
        ...resultado,
        mensagem: resultado.mensagem ?? listagem.mensagem,
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

  /**
   * Move candidata (ou desafio elegível) para Ativas após confirmação do servidor.
   * E4-ACE-04/05/08 — limite 10/categoria, idempotência e concorrência.
   */
  async escolher(
    pessoaId: string,
    desafioId: string,
    usuario: UsuarioAutenticado,
  ) {
    const pessoa = await this.exigirOrganizacao(pessoaId, usuario);
    const id = desafioId.trim();

    try {
      const resultado = await this.prisma.$transaction(
        async (tx) => {
          const desafio = await tx.desafio.findFirst({
            where: {
              id,
              ativo: true,
              OR: [
                { origem: "catalogo", familiaId: null },
                { familiaId: pessoa.familiaId },
              ],
            },
            select: SELECT_DESAFIO,
          });
          if (!desafio) {
            throw new NotFoundException("Sugestão não encontrada para esta pessoa.");
          }

          const linha = await tx.sugestaoDesafioPessoa.findUnique({
            where: {
              pessoaId_desafioId: { pessoaId: pessoa.id, desafioId: id },
            },
          });

          if (linha?.escolhida) {
            return {
              escolhida: true as const,
              jaEstavaEscolhida: true,
              categoria: desafio.categoria,
              atualizadoEm: linha.atualizadoEm,
            };
          }

          const disponivel = await this.estaDisponivel(
            tx,
            pessoa.id,
            desafio.id,
          );
          if (!disponivel) {
            throw new ConflictException(
              "Brincadeira em Executadas. Disponibilize novamente antes de escolher.",
            );
          }

          if (desafio.categoria) {
            const contagem = await this.contarAtivasNaCategoria(
              tx,
              pessoa.id,
              pessoa.familiaId,
              desafio.categoria,
            );
            if (contagem >= LIMITE_ATIVAS_POR_CATEGORIA) {
              throw new ConflictException({
                codigo: "LIMITE_ATIVAS_CATEGORIA",
                message: MENSAGEM_LIMITE_ATIVAS,
                mensagem: MENSAGEM_LIMITE_ATIVAS,
                categoria: desafio.categoria,
              });
            }
          }

          const atualizado = await tx.sugestaoDesafioPessoa.upsert({
            where: {
              pessoaId_desafioId: { pessoaId: pessoa.id, desafioId: id },
            },
            create: {
              pessoaId: pessoa.id,
              desafioId: id,
              escolhida: true,
              candidata: false,
              exposta: true,
              retiradaSemParticipacao: false,
              atualizadoPorId: usuario.id,
            },
            update: {
              escolhida: true,
              candidata: false,
              exposta: true,
              retiradaSemParticipacao: false,
              atualizadoPorId: usuario.id,
            },
          });

          return {
            escolhida: true as const,
            jaEstavaEscolhida: false,
            categoria: desafio.categoria,
            atualizadoEm: atualizado.atualizadoEm,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      const listagem = await this.listarParaPessoa(pessoa.id, usuario);
      return {
        pessoaId: pessoa.id,
        desafioId: id,
        ...resultado,
        sugestoes: listagem.sugestoes,
      };
    } catch (erro: unknown) {
      if (this.ehConflitoSerializacao(erro)) {
        throw new ConflictException(
          "Outra escolha está em andamento. Tente novamente.",
        );
      }
      throw erro;
    }
  }

  /**
   * Retira das ativas: libera vaga, preserva saldo/histórico, sem Executadas.
   * E4-ACE-09 — reenvio idempotente.
   */
  async retirar(
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
    });

    if (!linha || !linha.escolhida) {
      return {
        pessoaId: pessoa.id,
        desafioId: id,
        escolhida: false,
        jaEstavaRetirada: true,
        sugestoes: (await this.listarParaPessoa(pessoa.id, usuario)).sugestoes,
      };
    }

    const teveParticipacao = await this.prisma.participacaoDesafio.findFirst({
      where: { pessoaId: pessoa.id, desafioId: id, versaoAtiva: true },
      select: { id: true },
    });

    const atualizado = await this.prisma.sugestaoDesafioPessoa.update({
      where: { id: linha.id },
      data: {
        escolhida: false,
        candidata: false,
        retiradaSemParticipacao: !teveParticipacao,
        atualizadoPorId: usuario.id,
      },
    });

    return {
      pessoaId: pessoa.id,
      desafioId: id,
      escolhida: false,
      jaEstavaRetirada: false,
      atualizadoEm: atualizado.atualizadoEm,
      sugestoes: (await this.listarParaPessoa(pessoa.id, usuario)).sugestoes,
    };
  }

  private async contarAtivasNaCategoria(
    tx: Prisma.TransactionClient | ServicoPrisma,
    pessoaId: string,
    familiaId: string,
    categoria: string,
  ): Promise<number> {
    const escolhidas = await tx.sugestaoDesafioPessoa.findMany({
      where: {
        pessoaId,
        escolhida: true,
        desafio: {
          ativo: true,
          categoria,
          OR: [
            { origem: "catalogo", familiaId: null },
            { familiaId },
          ],
        },
      },
      select: { desafioId: true },
    });
    if (escolhidas.length === 0) return 0;

    const ids = escolhidas.map((e) => e.desafioId);
    const disponibilidades = await tx.disponibilidadeDesafio.findMany({
      where: { pessoaId, desafioId: { in: ids } },
      select: { desafioId: true, disponivelParaNovaParticipacao: true },
    });
    const mapaDisp = new Map(
      disponibilidades.map((d) => [d.desafioId, d.disponivelParaNovaParticipacao]),
    );
    const participacoes = await tx.participacaoDesafio.findMany({
      where: { pessoaId, desafioId: { in: ids }, versaoAtiva: true },
      select: { desafioId: true },
      distinct: ["desafioId"],
    });
    const comParticipacao = new Set(participacoes.map((p) => p.desafioId));

    let total = 0;
    for (const id of ids) {
      const row = mapaDisp.get(id);
      const disponivel = row !== undefined ? row : !comParticipacao.has(id);
      if (disponivel) total += 1;
    }
    return total;
  }

  private async buscarCandidatos(
    tx: Prisma.TransactionClient,
    opts: {
      pessoaId: string;
      familiaId: string;
      dataNascimento: Date | null;
      excluirIds: Set<string>;
      limite: number;
      categoriaFiltro?: string;
    },
  ): Promise<DesafioCatalogo[]> {
    const escolhidas = await tx.sugestaoDesafioPessoa.findMany({
      where: { pessoaId: opts.pessoaId, escolhida: true },
      select: { desafioId: true },
    });
    const idsEscolhidos = new Set(escolhidas.map((e) => e.desafioId));

    const contagemPorCategoria = new Map<string, number>();
    if (!opts.categoriaFiltro) {
      for (const cat of CATEGORIAS_BIBLIOTECA) {
        contagemPorCategoria.set(
          cat,
          await this.contarAtivasNaCategoria(
            tx,
            opts.pessoaId,
            opts.familiaId,
            cat,
          ),
        );
      }
    } else {
      contagemPorCategoria.set(
        opts.categoriaFiltro,
        await this.contarAtivasNaCategoria(
          tx,
          opts.pessoaId,
          opts.familiaId,
          opts.categoriaFiltro,
        ),
      );
    }

    const catalogo = await tx.desafio.findMany({
      where: {
        origem: "catalogo",
        familiaId: null,
        ativo: true,
        ...(opts.categoriaFiltro ? { categoria: opts.categoriaFiltro } : {}),
        ...(opts.excluirIds.size || idsEscolhidos.size
          ? {
              id: {
                notIn: [...new Set([...opts.excluirIds, ...idsEscolhidos])],
              },
            }
          : {}),
      },
      select: SELECT_DESAFIO,
      orderBy: [{ categoria: "asc" }, { nome: "asc" }, { id: "asc" }],
    });

    const historico = await tx.sugestaoDesafioPessoa.findMany({
      where: { pessoaId: opts.pessoaId },
      select: {
        desafioId: true,
        exposta: true,
        retiradaSemParticipacao: true,
      },
    });
    const expostas = new Set(
      historico.filter((h) => h.exposta).map((h) => h.desafioId),
    );
    const retiradas = new Set(
      historico
        .filter((h) => h.retiradaSemParticipacao)
        .map((h) => h.desafioId),
    );

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
      const disponivel = row !== undefined ? row : !comParticipacao.has(d.id);
      if (!disponivel) return false;
      if (comParticipacao.has(d.id)) return false;
      if (d.categoria) {
        const qtd = contagemPorCategoria.get(d.categoria) ?? 0;
        if (qtd >= LIMITE_ATIVAS_POR_CATEGORIA) return false;
      }
      return true;
    });

    // DEV-CAT-P09 (D1/D2): primeiro as atividades da faixa da pessoa; depois as demais elegíveis.
    const faixa = this.faixaDaPessoa(opts.dataNascimento);
    const daFaixa = faixa ? elegiveis.filter((d) => this.combinaFaixa(d, faixa)) : elegiveis;
    const base = [...daFaixa, ...elegiveis.filter((d) => !daFaixa.includes(d))];

    const ineditas = base.filter((d) => !expostas.has(d.id));
    const retornos = base.filter(
      (d) => retiradas.has(d.id) && expostas.has(d.id),
    );
    const demais = base.filter(
      (d) => !ineditas.includes(d) && !retornos.includes(d),
    );
    const ordenados = [...ineditas, ...retornos, ...demais];

    return this.diversificarPorCategoria(ordenados, opts.limite);
  }

  private async filtrarAindaElegiveis(
    tx: Prisma.TransactionClient,
    pessoaId: string,
    familiaId: string,
    atuais: Array<{ desafioId: string; desafio: DesafioCatalogo & { ativo: boolean } }>,
    categoriaFiltro?: string,
  ) {
    const elegiveis: typeof atuais = [];
    for (const item of atuais) {
      if (!item.desafio.ativo) continue;
      if (categoriaFiltro && item.desafio.categoria !== categoriaFiltro) continue;
      if (item.desafio.categoria) {
        const qtd = await this.contarAtivasNaCategoria(
          tx,
          pessoaId,
          familiaId,
          item.desafio.categoria,
        );
        if (qtd >= LIMITE_ATIVAS_POR_CATEGORIA) continue;
      }
      const disponivel = await this.estaDisponivel(tx, pessoaId, item.desafioId);
      const participou = await tx.participacaoDesafio.findFirst({
        where: { pessoaId, desafioId: item.desafioId, versaoAtiva: true },
        select: { id: true },
      });
      if (disponivel && !participou) elegiveis.push(item);
    }
    return elegiveis;
  }

  private async estaDisponivel(
    tx: Prisma.TransactionClient,
    pessoaId: string,
    desafioId: string,
  ): Promise<boolean> {
    const row = await tx.disponibilidadeDesafio.findUnique({
      where: { pessoaId_desafioId: { pessoaId, desafioId } },
      select: { disponivelParaNovaParticipacao: true },
    });
    if (row) return row.disponivelParaNovaParticipacao;
    const temParticipacao = await tx.participacaoDesafio.findFirst({
      where: { pessoaId, desafioId, versaoAtiva: true },
      select: { id: true },
    });
    return !temParticipacao;
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

  /** A faixa da atividade se sobrepõe à faixa da pessoa. */
  private combinaFaixa(
    d: { faixaEtariaMin: number | null; faixaEtariaMax: number | null },
    faixa: readonly [number, number],
  ): boolean {
    const min = d.faixaEtariaMin ?? 0;
    const max = d.faixaEtariaMax ?? 200;
    return min <= faixa[1] && max >= faixa[0];
  }

  /** D1 (2026-11-26): Pequenos 5–6, Médios 7–9, Grandes 10–12; sem data, sem prioridade. */
  private faixaDaPessoa(dataNascimento: Date | null): readonly [number, number] | null {
    const idade = this.idadeEmAnos(dataNascimento);
    if (idade === null) return null;
    if (idade <= 6) return [5, 6];
    if (idade <= 9) return [7, 9];
    return [10, 12];
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

  private async carregarCandidatas(pessoaId: string) {
    return this.prisma.sugestaoDesafioPessoa.findMany({
      where: {
        pessoaId,
        candidata: true,
        escolhida: false,
        desafio: { ativo: true },
      },
      include: { desafio: { select: SELECT_DESAFIO } },
      orderBy: [{ criadoEm: "asc" }, { id: "asc" }],
      take: LIMITE_SUGESTOES_PESSOA,
    });
  }

  private formatarItem(
    linha: Awaited<ReturnType<ServicoSugestoes["carregarCandidatas"]>>[number],
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
