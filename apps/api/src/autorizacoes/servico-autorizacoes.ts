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
  areaApresentacao,
  ehResponsabilidadeConcedivel,
  escopoFamilia,
  papelApresentacao,
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

  /**
   * Metadados mínimos de acesso (CT-20261116-001 / FUN-04 / FUN-07).
   * Admin: quem acompanha quem na família. Pessoa com conta: só quem acessa os próprios dados.
   * Não expõe matriz de operações nem dados clínicos/infantis.
   */
  async listarAcessos(familiaId: string, usuario: UsuarioAutenticado) {
    await this.garantirFamilia(familiaId, usuario);
    const adminFamilia = await this.ehAdministradorFamilia(familiaId, usuario);
    const onde = adminFamilia
      ? { familiaId, ativa: true }
      : {
          familiaId,
          ativa: true,
          pessoaAlvoId: usuario.pessoa.id,
        };

    const linhas = await this.prisma.autorizacao.findMany({
      where: onde,
      orderBy: [{ concedidaEm: "asc" }],
      select: {
        id: true,
        responsabilidade: true,
        pessoaAlvoId: true,
        ativa: true,
        pessoaAlvo: { select: { id: true, nome: true } },
        usuario: {
          select: {
            id: true,
            pessoa: { select: { id: true, nome: true } },
          },
        },
      },
    });

    return {
      modo: adminFamilia ? ("administracao" as const) : ("proprios_dados" as const),
      somenteLeitura: !adminFamilia,
      itens: linhas.map((linha) => ({
        id: linha.id,
        participanteNome: linha.usuario.pessoa.nome,
        participantePessoaId: linha.usuario.pessoa.id,
        participanteUsuarioId: linha.usuario.id,
        papel: papelApresentacao(linha.responsabilidade),
        area: areaApresentacao(linha.responsabilidade),
        pessoaAcompanhadaNome: linha.pessoaAlvo?.nome ?? null,
        pessoaAcompanhadaId: linha.pessoaAlvoId,
        ativo: linha.ativa,
      })),
    };
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
    if (!usuarioId) {
      throw new BadRequestException("Usuário e responsabilidade válidos são obrigatórios.");
    }
    if (!ehResponsabilidadeConcedivel(responsabilidadeBruta)) {
      throw new BadRequestException(
        "Responsabilidade não concedível pelo fluxo genérico (ADR-014). Use apenas Cuidados/Desenvolvimento nas combinações previstas.",
      );
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

  async ehAdministradorFamilia(
    familiaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    if (usuario.pessoa.familiaId !== familiaId) return false;
    const admin = await this.prisma.autorizacao.findFirst({
      where: {
        familiaId,
        usuarioId: usuario.id,
        responsabilidade: "administrador",
        pessoaAlvoId: null,
        ativa: true,
      },
    });
    return Boolean(admin);
  }

  /**
   * Pessoas visíveis na gestão/cadastro.
   * Administrador vê todas para convites/cadastro; isso NÃO libera dados clínicos.
   */
  async idsPessoasVisiveis(
    familiaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<{ adminFamilia: boolean; ids: Set<string> | "todas" }> {
    const adminFamilia = await this.ehAdministradorFamilia(familiaId, usuario);
    if (adminFamilia) {
      return { adminFamilia: true, ids: "todas" };
    }

    const autorizacoes = await this.prisma.autorizacao.findMany({
      where: { familiaId, usuarioId: usuario.id, ativa: true },
    });
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
    return this.ehAdministradorFamilia(familiaId, usuario);
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

    const resultado = await this.prisma.$transaction(async (tx) => {
      const autorizacao = await tx.autorizacao.findFirst({
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
          usuarioId: autorizacao.usuarioId,
          jaInativa: true as const,
        };
      }

      if (
        autorizacao.responsabilidade === "administrador" &&
        autorizacao.pessoaAlvoId == null
      ) {
        const outrosAdmins = await tx.autorizacao.count({
          where: {
            familiaId,
            responsabilidade: "administrador",
            pessoaAlvoId: null,
            ativa: true,
            id: { not: autorizacao.id },
          },
        });
        if (outrosAdmins === 0) {
          throw new BadRequestException(
            "Não é possível remover o último administrador da família (ADR-014).",
          );
        }
      }

      const atualizada = await tx.autorizacao.update({
        where: { id: autorizacao.id },
        data: { ativa: false, revogadaEm: new Date() },
      });
      return {
        id: atualizada.id,
        ativa: atualizada.ativa,
        revogadaEm: atualizada.revogadaEm,
        usuarioId: autorizacao.usuarioId,
        jaInativa: false as const,
      };
    });

    if (resultado.jaInativa) {
      return {
        id: resultado.id,
        ativa: false,
        revogadaEm: resultado.revogadaEm,
        sessoesInvalidadas: 0,
        historicoPreservado: true,
      };
    }

    const sessoes = await this.sessoes.invalidarSessoesDoUsuario(
      resultado.usuarioId,
    );

    return {
      id: resultado.id,
      ativa: resultado.ativa,
      revogadaEm: resultado.revogadaEm,
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

  /**
   * Rotina/cuidados: responsabilidade clínica contextual ou a própria pessoa.
   * Administrador sozinho NÃO herda acesso clínico.
   */
  async podeVerCuidados(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    if (usuario.pessoa.familiaId !== familiaId) return false;
    if (usuario.pessoa.id === pessoaId) return true;
    return this.temResponsabilidadeSobrePessoa(familiaId, pessoaId, usuario, [
      "responsavel_cuidados",
      "colaboradora_cuidados",
    ]);
  }

  /**
   * Desenvolvimento da criança: só responsável de desenvolvimento (ou a própria pessoa).
   * Admin puro e colaboradora de cuidados NÃO acessam (DEV / FAM-R03/R06).
   */
  async podeVerDesenvolvimento(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    if (usuario.pessoa.familiaId !== familiaId) return false;
    if (usuario.pessoa.id === pessoaId) return true;
    return this.temResponsabilidadeSobrePessoa(familiaId, pessoaId, usuario, [
      "responsavel_desenvolvimento",
    ]);
  }

  /** Documentos/anexos sensíveis: responsável de cuidados ou a própria pessoa. */
  async podeConsultarAnexosCuidados(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    if (usuario.pessoa.familiaId !== familiaId) return false;
    if (usuario.pessoa.id === pessoaId) return true;
    return this.temResponsabilidadeSobrePessoa(familiaId, pessoaId, usuario, [
      "responsavel_cuidados",
    ]);
  }

  /** Registrar relato de dose ou atividade. */
  async podeRegistrarRelatoCuidados(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    if (usuario.pessoa.id === pessoaId) return true;
    return this.temResponsabilidadeSobrePessoa(familiaId, pessoaId, usuario, [
      "responsavel_cuidados",
      "colaboradora_cuidados",
    ]);
  }

  /** Cadastrar/alterar programação — colaboradora e admin puro NÃO (CUI-F04). */
  async podeAlterarProgramacaoCuidados(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    return this.temResponsabilidadeSobrePessoa(familiaId, pessoaId, usuario, [
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

  /**
   * PDF completo: responsável de cuidados ou de desenvolvimento.
   * Colaboradora e admin puro não exportam (EVO-R05 / CUI).
   */
  async podeExportarRelatorio(
    familiaId: string,
    pessoaId: string,
    usuario: UsuarioAutenticado,
  ): Promise<boolean> {
    const [cuidados, desenvolvimento] = await Promise.all([
      this.podeExportarRelatorioCuidados(familiaId, pessoaId, usuario),
      this.temResponsabilidadeSobrePessoa(familiaId, pessoaId, usuario, [
        "responsavel_desenvolvimento",
      ]),
    ]);
    return cuidados || desenvolvimento;
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
      if (!permitidas.includes(a.responsabilidade as Responsabilidade)) {
        continue;
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
    const acessos = await this.listarAcessos(familiaId, usuario);

    const cartoes = [];
    const idsCuidados: string[] = [];
    const idsDesenvolvimento: string[] = [];
    for (const p of pessoas) {
      const cuidados = await this.podeVerCuidados(familiaId, p.id, usuario);
      const desenvolvimento = await this.podeVerDesenvolvimento(
        familiaId,
        p.id,
        usuario,
      );
      if (cuidados) idsCuidados.push(p.id);
      if (desenvolvimento) idsDesenvolvimento.push(p.id);
      cartoes.push({
        pessoaId: p.id,
        nome: p.nome,
        vinculo: p.vinculo,
        possuiConta: Boolean(p.usuario),
        ...(visao.adminFamilia && p.usuario
          ? { usuarioId: p.usuario.id }
          : {}),
        resumo: p.vinculo ? `Vínculo: ${p.vinculo}` : "Pessoa da família",
        areasAutorizadas: {
          cuidados,
          desenvolvimento,
          historico: cuidados || desenvolvimento,
        },
      });
    }

    const destaques = await this.montarDestaquesInicio(
      pessoas.map((p) => ({ id: p.id, nome: p.nome })),
      idsCuidados,
      idsDesenvolvimento,
    );

    const contextos: {
      pessoaId: string;
      nome: string;
      area: "cuidados" | "desenvolvimento";
      href: string;
    }[] = [];
    for (const cartao of cartoes) {
      if (cartao.areasAutorizadas.cuidados) {
        contextos.push({
          pessoaId: cartao.pessoaId,
          nome: cartao.nome,
          area: "cuidados",
          href: `/pessoas/${cartao.pessoaId}/cuidados`,
        });
      }
      if (cartao.areasAutorizadas.desenvolvimento) {
        contextos.push({
          pessoaId: cartao.pessoaId,
          nome: cartao.nome,
          area: "desenvolvimento",
          href: `/pessoas/${cartao.pessoaId}/desenvolvimento`,
        });
      }
    }

    let destinoEntrada: string | null = null;
    if (contextos.length === 1) {
      destinoEntrada = contextos[0].href;
    } else if (contextos.length === 0 && visao.adminFamilia) {
      destinoEntrada = "/gerenciar-familia";
    }

    return {
      familiaId,
      cartoes,
      destaques,
      autorizacoes,
      acessos,
      contextos,
      destinoEntrada,
      filtradoPorAutorizacao: visao.ids !== "todas",
      adminSemAcessoClinicoAutomatico: true,
    };
  }

  /**
   * Poucos destaques autorizados na home (EVO-R04/R09/R12).
   * Sem feed, ranking, contagens privadas ou mensagens de cobrança.
   */
  private async montarDestaquesInicio(
    pessoas: { id: string; nome: string }[],
    idsCuidados: string[],
    idsDesenvolvimento: string[],
  ) {
    const nomePorId = new Map(pessoas.map((p) => [p.id, p.nome]));
    type Destaque = {
      tipo: "consulta_proxima" | "experiencia_recente";
      pessoaId: string;
      pessoaNome: string;
      titulo: string;
      quando: Date;
    };
    const candidatos: Destaque[] = [];
    const agora = new Date();
    const limite = 3;

    if (idsCuidados.length > 0) {
      const consultas = await this.prisma.consulta.findMany({
        where: {
          pessoaId: { in: idsCuidados },
          status: "agendada",
          dataHora: { gte: agora },
        },
        orderBy: { dataHora: "asc" },
        take: limite,
        select: {
          pessoaId: true,
          especialidadeOuDescricao: true,
          dataHora: true,
        },
      });
      for (const c of consultas) {
        candidatos.push({
          tipo: "consulta_proxima",
          pessoaId: c.pessoaId,
          pessoaNome: nomePorId.get(c.pessoaId) ?? "Pessoa",
          titulo: `Consulta: ${c.especialidadeOuDescricao}`,
          quando: c.dataHora,
        });
      }
    }

    if (idsDesenvolvimento.length > 0) {
      const desde = new Date(agora.getTime() - 7 * 864e5);
      const participacoes = await this.prisma.participacaoDesafio.findMany({
        where: {
          pessoaId: { in: idsDesenvolvimento },
          versaoAtiva: true,
          resultado: "concluiu",
          registradoEm: { gte: desde, lte: agora },
        },
        orderBy: { registradoEm: "desc" },
        take: limite,
        include: { desafio: { select: { nome: true } } },
      });
      for (const p of participacoes) {
        candidatos.push({
          tipo: "experiencia_recente",
          pessoaId: p.pessoaId,
          pessoaNome: nomePorId.get(p.pessoaId) ?? "Pessoa",
          titulo: `Conquista: ${p.desafio.nome}`,
          quando: p.registradoEm,
        });
      }
    }

    candidatos.sort((a, b) => {
      if (a.tipo !== b.tipo) {
        return a.tipo === "consulta_proxima" ? -1 : 1;
      }
      if (a.tipo === "consulta_proxima") {
        return a.quando.getTime() - b.quando.getTime();
      }
      return b.quando.getTime() - a.quando.getTime();
    });

    return candidatos.slice(0, limite).map((d) => ({
      tipo: d.tipo,
      pessoaId: d.pessoaId,
      pessoaNome: d.pessoaNome,
      titulo: d.titulo,
      quando: d.quando.toISOString(),
    }));
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
