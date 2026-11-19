import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";

@Injectable()
export class ServicoRecompensas {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async listar(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    filtro?: { disponibilidade?: "disponiveis" | "resgatadas" },
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const recompensas = await this.prisma.recompensa.findMany({
      where: {
        pessoaId: pessoa.id,
        ativa: true,
        ...(filtro?.disponibilidade === "disponiveis"
          ? { disponivelParaResgate: true }
          : filtro?.disponibilidade === "resgatadas"
            ? { disponivelParaResgate: false }
            : {}),
      },
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        nome: true,
        custo: true,
        ativa: true,
        disponivelParaResgate: true,
        geracaoDisponibilidade: true,
        criadoEm: true,
        resgates: {
          orderBy: { resgatadoEm: "desc" },
          take: 1,
          select: {
            id: true,
            custoAplicado: true,
            resgatadoEm: true,
            geracaoDisponibilidade: true,
          },
        },
        _count: { select: { resgates: true } },
      },
    });

    return {
      pessoaId: pessoa.id,
      total: recompensas.length,
      recompensas: recompensas.map((r) => {
        const ultimo = r.resgates[0] ?? null;
        return {
          id: r.id,
          nome: r.nome,
          custo: r.custo,
          ativa: r.ativa,
          disponivelParaResgate: r.disponivelParaResgate,
          geracaoDisponibilidade: r.geracaoDisponibilidade,
          estadoDisponibilidade: r.disponivelParaResgate
            ? ("disponiveis" as const)
            : ("resgatadas" as const),
          criadoEm: r.criadoEm,
          totalResgates: r._count.resgates,
          ultimoResgate: ultimo
            ? {
                id: ultimo.id,
                custoAplicado: ultimo.custoAplicado,
                resgatadoEm: ultimo.resgatadoEm,
                geracaoDisponibilidade: ultimo.geracaoDisponibilidade,
              }
            : null,
        };
      }),
    };
  }

  /** DEV-F06 — só nome e custo. */
  async criar(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: { nome?: string; custo?: number },
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const nome = (entrada.nome ?? "").trim();
    if (!nome) throw new BadRequestException("Nome da recompensa é obrigatório.");
    const custo = entrada.custo;
    if (
      custo === undefined ||
      custo === null ||
      !Number.isInteger(custo) ||
      custo <= 0
    ) {
      throw new BadRequestException("Custo deve ser um inteiro positivo.");
    }

    const criada = await this.prisma.recompensa.create({
      data: {
        pessoaId: pessoa.id,
        nome,
        custo,
        ativa: true,
        disponivelParaResgate: true,
        geracaoDisponibilidade: 0,
      },
      select: {
        id: true,
        nome: true,
        custo: true,
        ativa: true,
        disponivelParaResgate: true,
        geracaoDisponibilidade: true,
        criadoEm: true,
      },
    });
    return {
      ...criada,
      estadoDisponibilidade: "disponiveis" as const,
    };
  }

  async alterar(
    recompensaId: string,
    usuario: UsuarioAutenticado,
    entrada: { nome?: string; custo?: number; ativa?: boolean },
  ) {
    const atual = await this.prisma.recompensa.findUnique({
      where: { id: recompensaId },
    });
    if (!atual) throw new NotFoundException("Recompensa não encontrada.");
    await this.exigirDesenvolvimento(atual.pessoaId, usuario);

    const data: { nome?: string; custo?: number; ativa?: boolean } = {};
    if (entrada.nome !== undefined) {
      const nome = entrada.nome.trim();
      if (!nome) throw new BadRequestException("Nome não pode ser vazio.");
      data.nome = nome;
    }
    if (entrada.custo !== undefined) {
      if (!Number.isInteger(entrada.custo) || entrada.custo <= 0) {
        throw new BadRequestException("Custo deve ser um inteiro positivo.");
      }
      data.custo = entrada.custo;
    }
    if (entrada.ativa !== undefined) data.ativa = Boolean(entrada.ativa);

    const atualizada = await this.prisma.recompensa.update({
      where: { id: atual.id },
      data,
      select: {
        id: true,
        nome: true,
        custo: true,
        ativa: true,
        disponivelParaResgate: true,
        geracaoDisponibilidade: true,
        criadoEm: true,
      },
    });
    return {
      ...atualizada,
      estadoDisponibilidade: atualizada.disponivelParaResgate
        ? ("disponiveis" as const)
        : ("resgatadas" as const),
    };
  }

  /**
   * CT-20261119-002 / ADR-013 — reabre Disponíveis sem estorno.
   */
  async disponibilizarNovamente(
    pessoaId: string,
    recompensaId: string,
    usuario: UsuarioAutenticado,
  ) {
    const pessoa = await this.exigirOrganizacaoDesenvolvimento(
      pessoaId,
      usuario,
    );
    const recompensa = await this.prisma.recompensa.findFirst({
      where: { id: recompensaId, pessoaId: pessoa.id, ativa: true },
    });
    if (!recompensa) {
      throw new NotFoundException("Recompensa não encontrada.");
    }
    if (recompensa.disponivelParaResgate) {
      return {
        id: recompensa.id,
        pessoaId: pessoa.id,
        disponivelParaResgate: true,
        geracaoDisponibilidade: recompensa.geracaoDisponibilidade,
        estadoDisponibilidade: "disponiveis" as const,
        jaEstavaDisponivel: true,
      };
    }

    const atualizada = await this.prisma.recompensa.update({
      where: { id: recompensa.id },
      data: {
        disponivelParaResgate: true,
        geracaoDisponibilidade: recompensa.geracaoDisponibilidade + 1,
      },
      select: {
        id: true,
        disponivelParaResgate: true,
        geracaoDisponibilidade: true,
      },
    });

    return {
      id: atualizada.id,
      pessoaId: pessoa.id,
      disponivelParaResgate: true,
      geracaoDisponibilidade: atualizada.geracaoDisponibilidade,
      estadoDisponibilidade: "disponiveis" as const,
      jaEstavaDisponivel: false,
    };
  }

  /**
   * Resgate com custo histórico congelado + um resgate por geração (ADR-013).
   * Isolamento Serializable + unique (recompensaId, geracao) evitam débito duplicado.
   */
  async resgatar(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: { recompensaId?: string; solicitacaoChave?: string },
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const recompensaId = (entrada.recompensaId ?? "").trim();
    if (!recompensaId) {
      throw new BadRequestException("recompensaId é obrigatório.");
    }
    const solicitacaoChave =
      (entrada.solicitacaoChave ?? "").trim() || randomUUID();

    const existentePorChave = await this.prisma.resgateRecompensa.findUnique({
      where: { solicitacaoChave },
      include: { recompensa: { select: { nome: true, custo: true } } },
    });
    if (existentePorChave) {
      if (
        existentePorChave.pessoaId !== pessoa.id ||
        existentePorChave.recompensaId !== recompensaId
      ) {
        throw new ConflictException(
          "solicitacaoChave já usada em outro contexto.",
        );
      }
      const saldoAtual = await this.saldoAtual(pessoa.id);
      return this.formatarResgate(existentePorChave, {
        idempotente: true,
        saldoApos: saldoAtual,
        recompensaNome: existentePorChave.recompensa.nome,
        custoAtualCatalogo: existentePorChave.recompensa.custo,
      });
    }

    const maxTentativas = 3;
    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const recompensa = await tx.recompensa.findFirst({
              where: {
                id: recompensaId,
                pessoaId: pessoa.id,
                ativa: true,
              },
            });
            if (!recompensa) {
              throw new NotFoundException("Recompensa não encontrada.");
            }
            if (!recompensa.disponivelParaResgate) {
              throw new ConflictException(
                "Recompensa em Resgatadas. Disponibilize novamente antes de um novo resgate.",
              );
            }

            const ultimo = await tx.movimentoEstrelas.findFirst({
              where: { pessoaId: pessoa.id },
              orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
            });
            const saldoAntes = ultimo?.saldoApos ?? 0;
            if (saldoAntes < recompensa.custo) {
              throw new ConflictException(
                "Saldo insuficiente para este resgate.",
              );
            }

            const custoAplicado = recompensa.custo;
            const saldoApos = saldoAntes - custoAplicado;
            const geracao = recompensa.geracaoDisponibilidade;

            const resgate = await tx.resgateRecompensa.create({
              data: {
                recompensaId: recompensa.id,
                pessoaId: pessoa.id,
                custoAplicado,
                geracaoDisponibilidade: geracao,
                solicitacaoChave,
                resgatadoPorId: usuario.id,
              },
            });

            await tx.movimentoEstrelas.create({
              data: {
                pessoaId: pessoa.id,
                tipo: "debito_resgate",
                quantidade: -custoAplicado,
                saldoApos,
                resgateId: resgate.id,
              },
            });

            await tx.recompensa.update({
              where: { id: recompensa.id },
              data: { disponivelParaResgate: false },
            });

            return this.formatarResgate(resgate, {
              idempotente: false,
              saldoApos,
              recompensaNome: recompensa.nome,
              custoAtualCatalogo: recompensa.custo,
            });
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            maxWait: 5000,
            timeout: 10000,
          },
        );
      } catch (erro: unknown) {
        if (
          erro instanceof ConflictException ||
          erro instanceof NotFoundException ||
          erro instanceof BadRequestException
        ) {
          throw erro;
        }
        const codigo =
          erro && typeof erro === "object" && "code" in erro
            ? String((erro as { code?: string }).code)
            : "";
        if (codigo === "P2002") {
          const deNovo = await this.prisma.resgateRecompensa.findUnique({
            where: { solicitacaoChave },
            include: { recompensa: { select: { nome: true, custo: true } } },
          });
          if (deNovo && deNovo.pessoaId === pessoa.id) {
            return this.formatarResgate(deNovo, {
              idempotente: true,
              saldoApos: await this.saldoAtual(pessoa.id),
              recompensaNome: deNovo.recompensa.nome,
              custoAtualCatalogo: deNovo.recompensa.custo,
            });
          }
          throw new ConflictException(
            "Resgate já realizado para esta disponibilização.",
          );
        }
        // P2034 = write conflict / serialization failure
        if (codigo === "P2034" && tentativa < maxTentativas) {
          continue;
        }
        throw erro;
      }
    }
    throw new ConflictException(
      "Não foi possível concluir o resgate sob concorrência. Tente de novo.",
    );
  }

  private formatarResgate(
    resgate: {
      id: string;
      pessoaId: string;
      recompensaId: string;
      custoAplicado: number;
      geracaoDisponibilidade: number;
      solicitacaoChave: string | null;
      resgatadoPorId: string;
      resgatadoEm: Date;
    },
    extra: {
      idempotente: boolean;
      saldoApos: number;
      recompensaNome: string;
      custoAtualCatalogo: number;
    },
  ) {
    return {
      id: resgate.id,
      pessoaId: resgate.pessoaId,
      recompensaId: resgate.recompensaId,
      recompensaNome: extra.recompensaNome,
      custoAplicado: resgate.custoAplicado,
      custoAtualCatalogo: extra.custoAtualCatalogo,
      geracaoDisponibilidade: resgate.geracaoDisponibilidade,
      solicitacaoChave: resgate.solicitacaoChave,
      saldoApos: extra.saldoApos,
      resgatadoPorId: resgate.resgatadoPorId,
      resgatadoEm: resgate.resgatadoEm,
      idempotente: extra.idempotente,
      estadoDisponibilidade: "resgatadas" as const,
    };
  }

  private async saldoAtual(pessoaId: string): Promise<number> {
    const ultimo = await this.prisma.movimentoEstrelas.findFirst({
      where: { pessoaId },
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    });
    return ultimo?.saldoApos ?? 0;
  }

  private async exigirOrganizacaoDesenvolvimento(
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
        "É necessário ser responsável de desenvolvimento para disponibilizar novamente.",
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
