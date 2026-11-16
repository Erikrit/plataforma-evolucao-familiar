import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";

@Injectable()
export class ServicoPessoas {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async listar(familiaId: string, usuario: UsuarioAutenticado) {
    await this.garantirFamiliaDoUsuario(familiaId, usuario);
    const visao = await this.autorizacoes.idsPessoasVisiveis(
      familiaId,
      usuario,
    );
    const pessoas = await this.prisma.pessoa.findMany({
      where:
        visao.ids === "todas"
          ? { familiaId }
          : { familiaId, id: { in: [...visao.ids] } },
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

  async obter(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ) {
    await this.garantirFamiliaDoUsuario(familiaId, usuario);
    const pode = await this.autorizacoes.podeVerPessoa(
      familiaId,
      pessoaId,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException(
        "Acesso negado a esta pessoa (FAM-R06/FAM-R10).",
      );
    }
    const pessoa = await this.prisma.pessoa.findFirst({
      where: { id: pessoaId, familiaId },
      select: {
        id: true,
        nome: true,
        vinculo: true,
        dataNascimento: true,
        criadaEm: true,
        usuario: { select: { id: true, email: true } },
      },
    });
    if (!pessoa) throw new NotFoundException("Pessoa não encontrada.");
    const cuidados = await this.autorizacoes.podeVerCuidados(
      familiaId,
      pessoaId,
      usuario,
    );
    const desenvolvimento = await this.autorizacoes.podeVerDesenvolvimento(
      familiaId,
      pessoaId,
      usuario,
    );
    return {
      id: pessoa.id,
      nome: pessoa.nome,
      vinculo: pessoa.vinculo,
      dataNascimento: pessoa.dataNascimento,
      criadaEm: pessoa.criadaEm,
      possuiConta: Boolean(pessoa.usuario),
      emailConta: pessoa.usuario?.email ?? null,
      areas: [
        { id: "cuidados", rotulo: "Cuidados", disponivel: cuidados },
        {
          id: "desenvolvimento",
          rotulo: "Desenvolvimento",
          disponivel: desenvolvimento,
        },
        {
          id: "historico",
          rotulo: "Histórico",
          disponivel: cuidados || desenvolvimento,
        },
        {
          id: "resumo",
          rotulo: "Resumo",
          disponivel: cuidados || desenvolvimento,
        },
      ],
    };
  }

  async atualizarPerfil(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: { vinculo?: string; dataNascimento?: string | null },
  ) {
    await this.garantirFamiliaDoUsuario(familiaId, usuario);
    const pode = await this.autorizacoes.podeVerPessoa(
      familiaId,
      pessoaId,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException("Acesso negado a esta pessoa.");
    }
    const admin = await this.autorizacoes.podeGerirPessoas(familiaId, usuario);
    const propria = usuario.pessoa.id === pessoaId;
    if (!admin && !propria) {
      throw new ForbiddenException("Sem permissão para editar este perfil.");
    }

    const dataNascimento =
      entrada.dataNascimento === undefined
        ? undefined
        : entrada.dataNascimento
          ? new Date(entrada.dataNascimento)
          : null;

    return this.prisma.pessoa.update({
      where: { id: pessoaId },
      data: {
        vinculo:
          entrada.vinculo === undefined
            ? undefined
            : entrada.vinculo.trim() || null,
        dataNascimento,
      },
      select: {
        id: true,
        nome: true,
        vinculo: true,
        dataNascimento: true,
      },
    });
  }

  async criar(
    familiaId: string,
    usuario: UsuarioAutenticado,
    entrada: { nome?: string; vinculo?: string },
  ) {
    await this.garantirFamiliaDoUsuario(familiaId, usuario);
    const pode = await this.autorizacoes.podeGerirPessoas(familiaId, usuario);
    if (!pode) {
      throw new ForbiddenException(
        "Cadastro de pessoas exige autorização de administrador (FAM-R11).",
      );
    }

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
