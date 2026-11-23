import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { createHash, randomBytes } from "node:crypto";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { verificarSenha } from "../comum/senha";
import { normalizarSlugFamilia } from "../comum/slug-familia";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";

const DURACAO_SESSAO_MS = 12 * 60 * 60 * 1000;
export const NOME_COOKIE_SESSAO = "pef_sessao";

export function hashTokenSessao(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

@Injectable()
export class ServicoSessao {
  constructor(private readonly prisma: ServicoPrisma) {}

  async entrar(email: string, senha: string, familiaSlug: string) {
    const slug = normalizarSlugFamilia(familiaSlug);
    const familia = await this.prisma.familia.findUnique({
      where: { slug },
      select: { id: true, nome: true, slug: true },
    });
    if (!familia) {
      throw new NotFoundException("Endereço de família não encontrado.");
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: { pessoa: true },
    });
    const credenciaisOk =
      !!usuario && verificarSenha(senha, usuario.senhaHash);
    const mesmaFamilia =
      !!usuario && usuario.pessoa.familiaId === familia.id;

    if (!credenciaisOk || !mesmaFamilia) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashTokenSessao(token);
    const sessao = await this.prisma.sessaoProvisoria.create({
      data: {
        token: tokenHash,
        usuarioId: usuario.id,
        expiraEm: new Date(Date.now() + DURACAO_SESSAO_MS),
      },
    });

    return {
      token,
      expiraEm: sessao.expiraEm.toISOString(),
      autenticacao: "sessao_mvp",
      familia: {
        id: familia.id,
        nome: familia.nome,
        slug: familia.slug,
      },
      usuario: {
        id: usuario.id,
        email: usuario.email,
        pessoa: {
          id: usuario.pessoa.id,
          nome: usuario.pessoa.nome,
          familiaId: usuario.pessoa.familiaId,
        },
      },
    };
  }

  async obterFamiliaPorSlug(familiaSlug: string) {
    const slug = normalizarSlugFamilia(familiaSlug);
    const familia = await this.prisma.familia.findUnique({
      where: { slug },
      select: { id: true, nome: true, slug: true },
    });
    if (!familia) {
      throw new NotFoundException("Endereço de família não encontrado.");
    }
    return familia;
  }

  async obterFamiliaPorId(familiaId: string) {
    const familia = await this.prisma.familia.findUnique({
      where: { id: familiaId },
      select: { id: true, nome: true, slug: true },
    });
    if (!familia) {
      throw new NotFoundException("Família da sessão não encontrada.");
    }
    return familia;
  }

  async obterUsuarioPorToken(
    token: string | undefined,
  ): Promise<UsuarioAutenticado> {
    if (!token) {
      throw new UnauthorizedException("Sessão ausente.");
    }

    const tokenHash = hashTokenSessao(token);
    const sessao = await this.prisma.sessaoProvisoria.findUnique({
      where: { token: tokenHash },
      include: { usuario: { include: { pessoa: true } } },
    });

    if (!sessao || sessao.expiraEm.getTime() < Date.now()) {
      if (sessao) {
        await this.prisma.sessaoProvisoria.delete({ where: { id: sessao.id } });
      }
      throw new UnauthorizedException("Sessão inválida ou expirada.");
    }

    return sessao.usuario;
  }

  async sair(token: string | undefined) {
    if (!token) return { ok: true };
    await this.prisma.sessaoProvisoria.deleteMany({
      where: { token: hashTokenSessao(token) },
    });
    return { ok: true };
  }

  async invalidarSessoesDoUsuario(usuarioId: string) {
    const resultado = await this.prisma.sessaoProvisoria.deleteMany({
      where: { usuarioId },
    });
    return { invalidadas: resultado.count };
  }

  async limparExpiradas() {
    const resultado = await this.prisma.sessaoProvisoria.deleteMany({
      where: { expiraEm: { lt: new Date() } },
    });
    return { removidas: resultado.count };
  }
}
