import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";

@Injectable()
export class ServicoPessoas {
  constructor(private readonly prisma: ServicoPrisma) {}

  async listar(familiaId: string, usuario: UsuarioAutenticado) {
    await this.garantirFamiliaDoUsuario(familiaId, usuario);
    const pessoas = await this.prisma.pessoa.findMany({
      where: { familiaId },
      orderBy: { criadaEm: "asc" },
      select: {
        id: true,
        nome: true,
        vinculo: true,
        dataNascimento: true,
        criadaEm: true,
        usuario: { select: { id: true, email: true } },
      },
    });
    return pessoas.map((pessoa) => ({
      id: pessoa.id,
      nome: pessoa.nome,
      vinculo: pessoa.vinculo,
      dataNascimento: pessoa.dataNascimento,
      criadaEm: pessoa.criadaEm,
      possuiConta: Boolean(pessoa.usuario),
      emailConta: pessoa.usuario?.email ?? null,
    }));
  }

  async criar(
    familiaId: string,
    usuario: UsuarioAutenticado,
    entrada: { nome?: string; vinculo?: string },
  ) {
    await this.garantirFamiliaDoUsuario(familiaId, usuario);
    const nome = (entrada.nome ?? "").trim();
    if (!nome) {
      throw new BadRequestException("Nome é suficiente e obrigatório.");
    }

    const pessoa = await this.prisma.pessoa.create({
      data: {
        familiaId,
        nome,
        vinculo: entrada.vinculo?.trim() || null,
      },
      select: {
        id: true,
        nome: true,
        vinculo: true,
        dataNascimento: true,
        criadaEm: true,
        usuario: { select: { id: true } },
      },
    });

    return {
      ...pessoa,
      possuiConta: Boolean(pessoa.usuario),
    };
  }

  private async garantirFamiliaDoUsuario(
    familiaId: string,
    usuario: UsuarioAutenticado,
  ) {
    if (usuario.pessoa.familiaId !== familiaId) {
      throw new ForbiddenException("Família fora do alcance da sessão.");
    }
    const familia = await this.prisma.familia.findUnique({
      where: { id: familiaId },
    });
    if (!familia) {
      throw new NotFoundException("Família não encontrada.");
    }
  }
}
