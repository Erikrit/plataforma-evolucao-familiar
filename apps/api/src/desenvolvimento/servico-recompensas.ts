import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";

@Injectable()
export class ServicoRecompensas {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async listar(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const recompensas = await this.prisma.recompensa.findMany({
      where: { pessoaId: pessoa.id, ativa: true },
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        nome: true,
        custo: true,
        ativa: true,
        criadoEm: true,
      },
    });
    return { pessoaId: pessoa.id, total: recompensas.length, recompensas };
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
      },
      select: {
        id: true,
        nome: true,
        custo: true,
        ativa: true,
        criadoEm: true,
      },
    });
    return criada;
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

    return this.prisma.recompensa.update({
      where: { id: atual.id },
      data,
      select: {
        id: true,
        nome: true,
        custo: true,
        ativa: true,
        criadoEm: true,
      },
    });
  }

  /**
   * Resgate com custo histórico congelado.
   * Isolamento Serializable + checagem de saldo evitam saldo negativo sob concorrência.
   */
  async resgatar(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: { recompensaId?: string },
  ) {
    const pessoa = await this.exigirDesenvolvimento(pessoaId, usuario);
    const recompensaId = (entrada.recompensaId ?? "").trim();
    if (!recompensaId) {
      throw new BadRequestException("recompensaId é obrigatório.");
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

            const resgate = await tx.resgateRecompensa.create({
              data: {
                recompensaId: recompensa.id,
                pessoaId: pessoa.id,
                custoAplicado,
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

            return {
              id: resgate.id,
              pessoaId: pessoa.id,
              recompensaId: recompensa.id,
              recompensaNome: recompensa.nome,
              custoAplicado,
              custoAtualCatalogo: recompensa.custo,
              saldoApos,
              resgatadoPorId: usuario.id,
              resgatadoEm: resgate.resgatadoEm,
            };
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            maxWait: 5000,
            timeout: 10000,
          },
        );
      } catch (erro: unknown) {
        if (erro instanceof ConflictException || erro instanceof NotFoundException) {
          throw erro;
        }
        const codigo =
          erro && typeof erro === "object" && "code" in erro
            ? String((erro as { code?: string }).code)
            : "";
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
