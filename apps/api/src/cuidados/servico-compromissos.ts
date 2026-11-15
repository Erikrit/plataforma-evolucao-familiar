import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";

@Injectable()
export class ServicoCompromissos {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async listarConsultas(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    return this.prisma.consulta.findMany({
      where: { pessoaId: pessoa.id },
      orderBy: { dataHora: "desc" },
    });
  }

  async criarConsulta(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: {
      dataHora?: string;
      especialidadeOuDescricao?: string;
      profissional?: string;
      local?: string;
      observacao?: string;
    },
  ) {
    const pessoa = await this.exigirOrganizacao(pessoaId, usuario);
    const dataHora = entrada.dataHora ? new Date(entrada.dataHora) : null;
    const descricao = (entrada.especialidadeOuDescricao ?? "").trim();
    if (!dataHora || Number.isNaN(dataHora.getTime())) {
      throw new BadRequestException("dataHora é obrigatória.");
    }
    if (!descricao) {
      throw new BadRequestException("especialidadeOuDescricao é obrigatória.");
    }
    return this.prisma.consulta.create({
      data: {
        pessoaId: pessoa.id,
        dataHora,
        especialidadeOuDescricao: descricao,
        profissional: entrada.profissional?.trim() || null,
        local: entrada.local?.trim() || null,
        observacao: entrada.observacao?.trim() || null,
        criadoPorId: usuario.id,
      },
    });
  }

  async atualizarConsulta(
    consultaId: string,
    usuario: UsuarioAutenticado,
    entrada: {
      status?: "agendada" | "realizada" | "cancelada";
      profissional?: string;
      local?: string;
      observacao?: string;
      dataHora?: string;
      especialidadeOuDescricao?: string;
    },
  ) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id: consultaId },
      include: { pessoa: true },
    });
    if (!consulta) throw new NotFoundException("Consulta não encontrada.");
    await this.exigirOrganizacao(consulta.pessoaId, usuario);

    return this.prisma.consulta.update({
      where: { id: consultaId },
      data: {
        status: entrada.status,
        profissional:
          entrada.profissional === undefined
            ? undefined
            : entrada.profissional.trim() || null,
        local:
          entrada.local === undefined ? undefined : entrada.local.trim() || null,
        observacao:
          entrada.observacao === undefined
            ? undefined
            : entrada.observacao.trim() || null,
        dataHora: entrada.dataHora ? new Date(entrada.dataHora) : undefined,
        especialidadeOuDescricao:
          entrada.especialidadeOuDescricao === undefined
            ? undefined
            : entrada.especialidadeOuDescricao.trim(),
      },
    });
  }

  async criarExame(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: {
      descricao?: string;
      data?: string | null;
      consultaId?: string | null;
      anexoId?: string | null;
    },
  ) {
    const pessoa = await this.exigirOrganizacao(pessoaId, usuario);
    const descricao = (entrada.descricao ?? "").trim();
    if (!descricao) throw new BadRequestException("Descrição do exame é obrigatória.");

    if (entrada.anexoId) {
      const anexo = await this.prisma.anexo.findFirst({
        where: {
          id: entrada.anexoId,
          familiaId: pessoa.familiaId,
          revogadoEm: null,
        },
      });
      if (!anexo) throw new NotFoundException("Anexo do exame não encontrado.");
    }

    return this.prisma.exame.create({
      data: {
        pessoaId: pessoa.id,
        descricao,
        data: entrada.data ? new Date(entrada.data) : null,
        consultaId: entrada.consultaId || null,
        anexoId: entrada.anexoId || null,
        criadoPorId: usuario.id,
      },
    });
  }

  async listarExames(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    return this.prisma.exame.findMany({
      where: { pessoaId: pessoa.id },
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        descricao: true,
        data: true,
        consultaId: true,
        anexoId: true,
        criadoEm: true,
      },
    });
  }

  async registrarAtividade(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: { descricao?: string; observacao?: string },
  ) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const pode = await this.autorizacoes.podeRegistrarRelatoCuidados(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException("Sem permissão para registrar atividade de apoio.");
    }
    const descricao = (entrada.descricao ?? "").trim();
    if (!descricao) {
      throw new BadRequestException("Descrição da atividade é obrigatória.");
    }
    return this.prisma.registroAtividade.create({
      data: {
        pessoaId: pessoa.id,
        descricao,
        observacao: entrada.observacao?.trim() || null,
        registradoPorId: usuario.id,
      },
    });
  }

  async listarAtividades(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    return this.prisma.registroAtividade.findMany({
      where: { pessoaId: pessoa.id },
      orderBy: { concluidaEm: "desc" },
    });
  }

  private async exigirVisao(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id: pessoaId } });
    if (!pessoa) throw new NotFoundException("Pessoa não encontrada.");
    if (pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new ForbiddenException("Pessoa fora da família.");
    }
    const pode = await this.autorizacoes.podeVerCuidados(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!pode) throw new ForbiddenException("Acesso negado.");
    return pessoa;
  }

  private async exigirOrganizacao(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const pode = await this.autorizacoes.podeOrganizarConsultasExames(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException(
        "Colaboradora não organiza consultas/exames por padrão (ACE-C07).",
      );
    }
    return pessoa;
  }
}
