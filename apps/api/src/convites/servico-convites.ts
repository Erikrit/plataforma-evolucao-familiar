import {
  BadRequestException,
  GoneException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

const DURACAO_CONVITE_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ServicoConvites {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async criar(
    familiaId: string,
    admin: UsuarioAutenticado,
    entrada: {
      email?: string;
      nomeConvidado?: string;
      responsabilidade?: string;
      pessoaAlvoId?: string;
      pessoaContaId?: string;
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
    };
  }

  async ativar(
    token: string,
    entrada: { senha?: string; nome?: string },
  ) {
    const convite = await this.prisma.convite.findUnique({
      where: { token },
      include: {
        pessoaAlvo: true,
        pessoaConta: { include: { usuario: { select: { id: true } } } },
      },
    });
    if (!convite) throw new NotFoundException("Convite não encontrado.");
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

    const resultado = await this.prisma.$transaction(async (tx) => {
      let pessoaId: string;
      if (convite.pessoaContaId) {
        pessoaId = convite.pessoaContaId;
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

      await tx.convite.update({
        where: { id: convite.id },
        data: { usadoEm: new Date() },
      });

      return { pessoaId, usuario };
    });

    return {
      ok: true,
      email: resultado.usuario.email,
      pessoaId: resultado.pessoaId,
      familiaId: convite.familiaId,
      pessoaAlvoId: convite.pessoaAlvoId,
      pessoaContaId: convite.pessoaContaId,
      responsabilidade: convite.responsabilidade,
      reutilizouPessoa: Boolean(convite.pessoaContaId),
    };
  }
}
