import {
  RESPONSABILIDADE_DESENVOLVIMENTO,
  resolverDataParaDesenvolvimento,
} from "../pessoas/data-nascimento";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { ServicoPrisma } from "../prisma/servico-prisma";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import {
  ehResponsabilidadeConcedivel,
  escopoFamilia,
  type Responsabilidade,
} from "../autorizacoes/responsabilidades";
import { gerarHashSenha } from "../comum/senha";
import { normalizarSlugFamilia } from "../comum/slug-familia";

const DURACAO_CONVITE_MS = 7 * 24 * 60 * 60 * 1000;

export type EstadoConvite = "pendente" | "expirado" | "ativado";

function estadoDoConvite(convite: {
  usadoEm: Date | null;
  expiraEm: Date;
}): EstadoConvite {
  if (convite.usadoEm) return "ativado";
  if (convite.expiraEm.getTime() < Date.now()) return "expirado";
  return "pendente";
}

@Injectable()
export class ServicoConvites {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async listar(familiaId: string, admin: UsuarioAutenticado) {
    await this.autorizacoes.exigirAdministrador(familiaId, admin);

    const convites = await this.prisma.convite.findMany({
      where: { familiaId },
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        email: true,
        nomeConvidado: true,
        responsabilidade: true,
        pessoaAlvoId: true,
        pessoaContaId: true,
        expiraEm: true,
        usadoEm: true,
        criadoEm: true,
        pessoaAlvo: { select: { id: true, nome: true } },
        pessoaConta: { select: { id: true, nome: true } },
      },
    });

    return convites.map((convite) => ({
      id: convite.id,
      email: convite.email,
      nomeConvidado: convite.nomeConvidado,
      responsabilidade: convite.responsabilidade,
      pessoaAlvoId: convite.pessoaAlvoId,
      pessoaAlvoNome: convite.pessoaAlvo?.nome ?? null,
      pessoaContaId: convite.pessoaContaId,
      pessoaContaNome: convite.pessoaConta?.nome ?? null,
      expiraEm: convite.expiraEm.toISOString(),
      usadoEm: convite.usadoEm?.toISOString() ?? null,
      criadoEm: convite.criadoEm.toISOString(),
      estado: estadoDoConvite(convite),
    }));
  }

  async criar(
    familiaId: string,
    admin: UsuarioAutenticado,
    entrada: {
      email?: string;
      nomeConvidado?: string;
      responsabilidade?: string;
      pessoaAlvoId?: string;
      pessoaContaId?: string;
      /** M01 §16: data informada no mesmo fluxo para convite de Desenvolvimento. */
      dataNascimentoAlvo?: string | null;
    },
  ) {
    await this.autorizacoes.exigirAdministrador(familiaId, admin);

    const email = (entrada.email ?? "").trim().toLowerCase();
    if (!email) {
      throw new BadRequestException("E-mail é obrigatório para o convite.");
    }

    const pessoaContaId = (entrada.pessoaContaId ?? "").trim() || null;
    const responsabilidadeBruta = (entrada.responsabilidade ?? "").trim();
    const pessoaAlvoId = (entrada.pessoaAlvoId ?? "").trim() || null;

    if (pessoaContaId) {
      const pessoaConta = await this.prisma.pessoa.findFirst({
        where: { id: pessoaContaId, familiaId },
        include: { usuario: { select: { id: true } } },
      });
      if (!pessoaConta) {
        throw new NotFoundException("Pessoa da conta não encontrada.");
      }
      if (pessoaConta.usuario) {
        throw new BadRequestException(
          "Esta pessoa já possui conta. Use concessão de acesso para quem já entra.",
        );
      }
    }

    let responsabilidade: string | null = null;
    if (responsabilidadeBruta) {
      if (!ehResponsabilidadeConcedivel(responsabilidadeBruta)) {
        throw new BadRequestException(
          "Responsabilidade não concedível por convite (ADR-014). Use apenas as combinações contextuais previstas.",
        );
      }
      if (escopoFamilia(responsabilidadeBruta as Responsabilidade)) {
        throw new BadRequestException(
          "Convite de administrador da família não é suportado no MVP.",
        );
      }
      if (!pessoaAlvoId) {
        throw new BadRequestException("Convite contextual exige pessoa-alvo.");
      }
      const alvo = await this.prisma.pessoa.findFirst({
        where: { id: pessoaAlvoId, familiaId },
      });
      if (!alvo) throw new NotFoundException("Pessoa-alvo não encontrada.");
      if (responsabilidadeBruta === RESPONSABILIDADE_DESENVOLVIMENTO) {
        const dataNova = resolverDataParaDesenvolvimento(alvo, entrada.dataNascimentoAlvo);
        if (dataNova) {
          await this.prisma.pessoa.updateMany({
            where: { id: alvo.id, familiaId, dataNascimento: null },
            data: { dataNascimento: dataNova },
          });
        }
      }
      responsabilidade = responsabilidadeBruta;
    } else if (!pessoaContaId) {
      throw new BadRequestException(
        "Informe a responsabilidade contextual ou a pessoa cuja conta será habilitada.",
      );
    }

    const token = randomBytes(24).toString("hex");
    const convite = await this.prisma.convite.create({
      data: {
        token,
        familiaId,
        email,
        nomeConvidado: entrada.nomeConvidado?.trim() || null,
        responsabilidade,
        pessoaAlvoId,
        pessoaContaId,
        criadoPorId: admin.id,
        expiraEm: new Date(Date.now() + DURACAO_CONVITE_MS),
      },
    });

    return {
      id: convite.id,
      token: convite.token,
      email: convite.email,
      responsabilidade: convite.responsabilidade,
      pessoaAlvoId: convite.pessoaAlvoId,
      pessoaContaId: convite.pessoaContaId,
      expiraEm: convite.expiraEm.toISOString(),
      usadoEm: null,
      estado: "pendente" as const,
    };
  }

  async ativar(
    token: string,
    entrada: { senha?: string; nome?: string; familiaSlug?: string },
  ) {
    const slugInformado = (entrada.familiaSlug ?? "").trim();
    if (!slugInformado) {
      throw new BadRequestException(
        "Informe o endereço da família para ativar o convite.",
      );
    }
    const slug = normalizarSlugFamilia(slugInformado);

    const convite = await this.prisma.convite.findUnique({
      where: { token },
      include: {
        familia: { select: { id: true, slug: true } },
        pessoaAlvo: true,
        pessoaConta: { include: { usuario: { select: { id: true } } } },
      },
    });
    if (!convite) throw new NotFoundException("Convite não encontrado.");
    if (!convite.familia?.slug || convite.familia.slug !== slug) {
      throw new ForbiddenException(
        "Convite não é válido neste contexto familiar.",
      );
    }
    if (convite.usadoEm) {
      throw new GoneException("Convite já utilizado.");
    }
    if (convite.expiraEm.getTime() < Date.now()) {
      throw new GoneException("Convite expirado.");
    }

    const senha = entrada.senha ?? "";
    if (senha.length < 6) {
      throw new BadRequestException("Senha deve ter ao menos 6 caracteres.");
    }

    const existente = await this.prisma.usuario.findUnique({
      where: { email: convite.email },
    });
    if (existente) {
      throw new BadRequestException("E-mail já possui conta.");
    }

    if (convite.pessoaContaId) {
      if (!convite.pessoaConta) {
        throw new NotFoundException("Pessoa da conta não encontrada.");
      }
      if (convite.pessoaConta.usuario) {
        throw new BadRequestException(
          "A pessoa indicada no convite já possui conta.",
        );
      }
    }

    const nome =
      (entrada.nome ?? "").trim() ||
      convite.nomeConvidado?.trim() ||
      convite.pessoaConta?.nome ||
      convite.email.split("@")[0];

    try {
      const resultado = await this.prisma.$transaction(async (tx) => {
        const atual = await tx.convite.findUnique({
          where: { id: convite.id },
          select: { usadoEm: true, expiraEm: true },
        });
        if (!atual || atual.usadoEm) {
          throw new GoneException("Convite já utilizado.");
        }
        if (atual.expiraEm.getTime() < Date.now()) {
          throw new GoneException("Convite expirado.");
        }

        let pessoaId: string;
        if (convite.pessoaContaId) {
          const pessoaConta = await tx.pessoa.findFirst({
            where: { id: convite.pessoaContaId, familiaId: convite.familiaId },
            include: { usuario: { select: { id: true } } },
          });
          if (!pessoaConta) {
            throw new NotFoundException("Pessoa da conta não encontrada.");
          }
          if (pessoaConta.usuario) {
            throw new BadRequestException(
              "A pessoa indicada no convite já possui conta.",
            );
          }
          pessoaId = pessoaConta.id;
        } else {
          const pessoa = await tx.pessoa.create({
            data: {
              familiaId: convite.familiaId,
              nome,
              vinculo: "colaboradora",
            },
          });
          pessoaId = pessoa.id;
        }

        const usuario = await tx.usuario.create({
          data: {
            pessoaId,
            email: convite.email,
            senhaHash: gerarHashSenha(senha),
          },
        });

        if (convite.responsabilidade && convite.pessoaAlvoId) {
          await tx.autorizacao.create({
            data: {
              familiaId: convite.familiaId,
              usuarioId: usuario.id,
              responsabilidade: convite.responsabilidade,
              pessoaAlvoId: convite.pessoaAlvoId,
            },
          });
        }

        const marcado = await tx.convite.updateMany({
          where: { id: convite.id, usadoEm: null },
          data: { usadoEm: new Date() },
        });
        if (marcado.count !== 1) {
          throw new GoneException("Convite já utilizado.");
        }

        return { pessoaId, usuario };
      });

      return {
        ok: true,
        email: resultado.usuario.email,
        pessoaId: resultado.pessoaId,
        familiaId: convite.familiaId,
        familiaSlug: convite.familia.slug,
        pessoaAlvoId: convite.pessoaAlvoId,
        pessoaContaId: convite.pessoaContaId,
        responsabilidade: convite.responsabilidade,
        reutilizouPessoa: Boolean(convite.pessoaContaId),
        destinoEntrada: `/f/${convite.familia.slug}/entrar`,
      };
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === "P2002"
      ) {
        throw new ConflictException(
          "Não foi possível ativar: conta ou e-mail já existentes.",
        );
      }
      throw erro;
    }
  }
}
