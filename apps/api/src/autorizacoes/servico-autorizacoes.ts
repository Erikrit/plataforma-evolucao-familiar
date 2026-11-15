import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
import { ServicoSessao } from "../auth/servico-sessao";
import {
  ehResponsabilidade,
  escopoFamilia,
  type Responsabilidade,
} from "./responsabilidades";

@Injectable()
export class ServicoAutorizacoes {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly sessoes: ServicoSessao,
  ) {}

  async listarDoUsuario(familiaId: string, usuario: UsuarioAutenticado) {
    await this.garantirFamilia(familiaId, usuario);
    return this.prisma.autorizacao.findMany({
      where: { familiaId, usuarioId: usuario.id, ativa: true },
      orderBy: { concedidaEm: "asc" },
      select: {
        id: true,
        responsabilidade: true,
        pessoaAlvoId: true,
        ativa: true,
        concedidaEm: true,
        pessoaAlvo: { select: { id: true, nome: true } },
      },
    });
  }

  async conceder(
    familiaId: string,
    concedente: UsuarioAutenticado,
    entrada: {
      usuarioId?: string;
      responsabilidade?: string;
      pessoaAlvoId?: string | null;
    },
  ) {
    await this.garantirFamilia(familiaId, concedente);
    await this.exigirAdministrador(familiaId, concedente);

    const usuarioId = (entrada.usuarioId ?? "").trim();
    const responsabilidadeBruta = (entrada.responsabilidade ?? "").trim();
    if (!usuarioId || !ehResponsabilidade(responsabilidadeBruta)) {
      throw new BadRequestException("Usuário e responsabilidade válidos são obrigatórios.");
    }
    const responsabilidade = responsabilidadeBruta;

    const alvo = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, pessoa: { familiaId } },
    });
    if (!alvo) {
      throw new NotFoundException("Usuário alvo não encontrado na família.");
    }

    let pessoaAlvoId: string | null = entrada.pessoaAlvoId ?? null;
    if (escopoFamilia(responsabilidade)) {
      pessoaAlvoId = null;
    } else if (!pessoaAlvoId) {
      throw new BadRequestException(
        "Responsabilidade contextual exige pessoa-alvo (FAM-R05).",
      );
    } else {
      const pessoa = await this.prisma.pessoa.findFirst({
        where: { id: pessoaAlvoId, familiaId },
      });
      if (!pessoa) {
        throw new NotFoundException("Pessoa-alvo não encontrada.");
      }
    }

    const existente = await this.prisma.autorizacao.findFirst({
      where: {
        familiaId,
        usuarioId,
        responsabilidade,
        pessoaAlvoId,
        ativa: true,
      },
    });
    if (existente) {
      return this.formatar(existente.id);
    }

    const criada = await this.prisma.autorizacao.create({
      data: {
        familiaId,
        usuarioId,
        responsabilidade,
        pessoaAlvoId,
      },
    });
    return this.formatar(criada.id);
  }

  async idsPessoasVisiveis(
    familiaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<{ adminFamilia: boolean; ids: Set<string> | "todas" }> {
    const autorizacoes = await this.prisma.autorizacao.findMany({
      where: { familiaId, usuarioId: usuario.id, ativa: true },
    });

    if (
      autorizacoes.some(
        (a) =>
          a.responsabilidade === "administrador" && a.pessoaAlvoId === null,
      )
    ) {
      return { adminFamilia: true, ids: "todas" };
    }

    const ids = new Set<string>();
    ids.add(usuario.pessoa.id);
    for (const a of autorizacoes) {
      if (a.pessoaAlvoId) ids.add(a.pessoaAlvoId);
    }
    return { adminFamilia: false, ids };
  }

  async podeGerirPessoas(
    familiaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    const visao = await this.idsPessoasVisiveis(familiaId, usuario);
    return visao.adminFamilia;
  }

  async exigirAdministrador(
    familiaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<void> {
    const ok = await this.podeGerirPessoas(familiaId, usuario);
    if (!ok) {
      throw new ForbiddenException(
        "Somente administrador da família pode conceder autorizações (FAM-R11).",
      );
    }
  }

  async revogar(
    familiaId: string,
    autorizacaoId: string,
    admin: UsuarioAutenticado,
  ) {
    await this.garantirFamilia(familiaId, admin);
    await this.exigirAdministrador(familiaId, admin);

    const autorizacao = await this.prisma.autorizacao.findFirst({
      where: { id: autorizacaoId, familiaId },
    });
    if (!autorizacao) {
      throw new NotFoundException("Autorização não encontrada.");
    }
    if (!autorizacao.ativa) {
      return {
        id: autorizacao.id,
        ativa: false,
        revogadaEm: autorizacao.revogadaEm,
        sessoesInvalidadas: 0,
        historicoPreservado: true,
      };
    }

    const atualizada = await this.prisma.autorizacao.update({
      where: { id: autorizacao.id },
      data: { ativa: false, revogadaEm: new Date() },
    });
    const sessoes = await this.sessoes.invalidarSessoesDoUsuario(
      autorizacao.usuarioId,
    );

    return {
      id: atualizada.id,
      ativa: atualizada.ativa,
      revogadaEm: atualizada.revogadaEm,
      sessoesInvalidadas: sessoes.invalidadas,
      historicoPreservado: true,
    };
  }

  async podeVerPessoa(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    const visao = await this.idsPessoasVisiveis(familiaId, usuario);
    if (visao.ids === "todas") return true;
    return visao.ids.has(pessoaId);
  }

  /** Visualizar rotina/cuidados da pessoa-alvo. */
  async podeVerCuidados(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    return this.podeVerPessoa(familiaId, pessoaId, usuario);
  }

  /** Registrar relato de dose ou atividade (responsável ou colaboradora autorizada). */
  async podeRegistrarRelatoCuidados(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    return this.temResponsabilidadeSobrePessoa(familiaId, pessoaId, usuario, [
      "administrador",
      "responsavel_cuidados",
      "colaboradora_cuidados",
    ]);
  }

  /** Cadastrar/alterar programação — colaboradora NÃO por padrão (CUI-F04). */
  async podeAlterarProgramacaoCuidados(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    return this.temResponsabilidadeSobrePessoa(familiaId, pessoaId, usuario, [
      "administrador",
      "responsavel_cuidados",
    ]);
  }

  async podeOrganizarConsultasExames(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    return this.podeAlterarProgramacaoCuidados(familiaId, pessoaId, usuario);
  }

  async podeExportarRelatorioCuidados(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    return this.podeAlterarProgramacaoCuidados(familiaId, pessoaId, usuario);
  }

  private async temResponsabilidadeSobrePessoa(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
    permitidas: Responsabilidade[],
  ): Promise<boolean> {
    if (usuario.pessoa.familiaId !== familiaId) return false;
    const autorizacoes = await this.prisma.autorizacao.findMany({
      where: { familiaId, usuarioId: usuario.id, ativa: true },
    });
    for (const a of autorizacoes) {
      if (!permitidas.includes(a.responsabilidade as Responsabilidade)) continue;
      if (a.responsabilidade === "administrador" && a.pessoaAlvoId === null) {
        return true;
      }
      if (a.pessoaAlvoId === pessoaId) return true;
    }
    return false;
  }

  async cartoesInicio(familiaId: string, usuario: UsuarioAutenticado) {
    await this.garantirFamilia(familiaId, usuario);
    const visao = await this.idsPessoasVisiveis(familiaId, usuario);
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
        usuario: { select: { id: true } },
      },
    });

    const autorizacoes = await this.listarDoUsuario(familiaId, usuario);

    return {
      familiaId,
      cartoes: pessoas.map((p) => ({
        pessoaId: p.id,
        nome: p.nome,
        vinculo: p.vinculo,
        possuiConta: Boolean(p.usuario),
        resumo: p.vinculo ? `Vínculo: ${p.vinculo}` : "Pessoa da família",
      })),
      autorizacoes,
      filtradoPorAutorizacao: visao.ids !== "todas",
    };
  }

  private async formatar(id: string) {
    return this.prisma.autorizacao.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        responsabilidade: true,
        pessoaAlvoId: true,
        ativa: true,
        concedidaEm: true,
        pessoaAlvo: { select: { id: true, nome: true } },
        usuario: { select: { id: true, email: true } },
      },
    });
  }

  private async garantirFamilia(
    familiaId: string,
    usuario: UsuarioAutenticado,
  ) {
    if (usuario.pessoa.familiaId !== familiaId) {
      throw new ForbiddenException("Família fora do alcance da sessão.");
    }
    const familia = await this.prisma.familia.findUnique({
      where: { id: familiaId },
    });
    if (!familia) throw new NotFoundException("Família não encontrada.");
  }
}

export type { Responsabilidade };
