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
    },
  ) {
    await this.autorizacoes.exigirAdministrador(familiaId, admin);

    const email = (entrada.email ?? "").trim().toLowerCase();
    const responsabilidadeBruta = (entrada.responsabilidade ?? "").trim();
    if (!email) {
      throw new BadRequestException("E-mail e responsabilidade válidos são obrigatórios.");
    }
    if (!ehResponsabilidadeConcedivel(responsabilidadeBruta)) {
      throw new BadRequestException(
        "Responsabilidade não concedível por convite (ADR-014). Use apenas as combinações contextuais previstas.",
      );
    }
    const responsabilidade = responsabilidadeBruta;
    if (escopoFamilia(responsabilidade as Responsabilidade)) {
      throw new BadRequestException(
        "Convite de administrador da família não é suportado no MVP.",
      );
    }
    const pessoaAlvoId = (entrada.pessoaAlvoId ?? "").trim();
    if (!pessoaAlvoId) {
      throw new BadRequestException("Convite contextual exige pessoa-alvo.");
    }
    const alvo = await this.prisma.pessoa.findFirst({
      where: { id: pessoaAlvoId, familiaId },
    });
    if (!alvo) throw new NotFoundException("Pessoa-alvo não encontrada.");

    const token = randomBytes(24).toString("hex");
    const convite = await this.prisma.convite.create({
      data: {
        token,
        familiaId,
        email,
        nomeConvidado: entrada.nomeConvidado?.trim() || null,
        responsabilidade,
        pessoaAlvoId,
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
      include: { pessoaAlvo: true },
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

    const nome =
      (entrada.nome ?? "").trim() ||
      convite.nomeConvidado?.trim() ||
      convite.email.split("@")[0];

    const resultado = await this.prisma.$transaction(async (tx) => {
      const pessoa = await tx.pessoa.create({
        data: {
          familiaId: convite.familiaId,
          nome,
          vinculo: "colaboradora",
        },
      });
      const usuario = await tx.usuario.create({
        data: {
          pessoaId: pessoa.id,
          email: convite.email,
          senhaHash: gerarHashSenha(senha),
        },
      });
      await tx.autorizacao.create({
        data: {
          familiaId: convite.familiaId,
          usuarioId: usuario.id,
          responsabilidade: convite.responsabilidade,
          pessoaAlvoId: convite.pessoaAlvoId,
        },
      });
      await tx.convite.update({
        where: { id: convite.id },
        data: { usadoEm: new Date() },
      });
      return { pessoa, usuario };
    });

    return {
      ok: true,
      email: resultado.usuario.email,
      pessoaId: resultado.pessoa.id,
      familiaId: convite.familiaId,
      pessoaAlvoId: convite.pessoaAlvoId,
      responsabilidade: convite.responsabilidade,
    };
  }
}
