import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
import {
  chaveOcorrencia,
  ehSituacaoDose,
  type SituacaoDose,
} from "./permissoes-cuidados";

type EntradaMetadadosProgramacao = {
  horarios?: string[];
  frequencia?: string;
  /** CUI-F01 v1.3 */
  primeiroHorario?: string;
  dosesPorDia?: number;
  duracaoTipo?: "continua" | "dias" | string;
  duracaoDias?: number | null;
  horariosConferidos?: boolean;
  /** Opcional: só para auxiliar sugestão matemática quando a prescrição traz intervalo explícito. */
  intervaloHoras?: number | null;
};

type EntradaMedicamento = EntradaMetadadosProgramacao & {
  nome?: string;
  instrucoes?: string;
  anexoIds?: string[];
  ativar?: boolean;
};

type MetadadosProgramacaoResolvidos = {
  horarios: string[];
  frequencia: string;
  primeiroHorario: string;
  dosesPorDia: number;
  duracaoTipo: "continua" | "dias";
  duracaoDias: number | null;
  horariosConferidos: boolean;
  intervaloHoras: number | null;
  vigenciaFim: Date | null;
};

@Injectable()
export class ServicoMedicamentos {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async listar(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirPessoaVisivel(pessoaId, usuario);
    const podeAnexos = await this.autorizacoes.podeConsultarAnexosCuidados(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    const lista = await this.prisma.medicamento.findMany({
      where: { pessoaId: pessoa.id },
      orderBy: { criadoEm: "desc" },
      include: {
        programacoes: { orderBy: { vigenciaInicio: "desc" } },
        anexos: { select: { anexoId: true } },
      },
    });
    if (podeAnexos) return lista;
    return lista.map(({ anexos: _anexos, ...resto }) => ({
      ...resto,
      anexos: [],
    }));
  }

  async cadastrar(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    entrada: EntradaMedicamento,
  ) {
    const pessoa = await this.exigirPessoaVisivel(pessoaId, usuario);
    const pode = await this.autorizacoes.podeAlterarProgramacaoCuidados(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException(
        "Colaboradora não altera prescrição por padrão (CUI-F04/ACE-C07).",
      );
    }

    const nome = (entrada.nome ?? "").trim();
    if (!nome) throw new BadRequestException("Nome do medicamento é obrigatório.");

    const ativar = Boolean(entrada.ativar);
    const agora = new Date();
    const meta = this.resolverMetadadosProgramacao(entrada, {
      exigirConferencia: ativar,
      vigenciaInicio: agora,
    });

    const medicamento = await this.prisma.$transaction(async (tx) => {
      const criado = await tx.medicamento.create({
        data: {
          pessoaId: pessoa.id,
          nome,
          instrucoes: entrada.instrucoes?.trim() || null,
          status: ativar ? "ativo" : "rascunho",
          criadoPorId: usuario.id,
          ativadoEm: ativar ? agora : null,
          programacoes: {
            create: {
              horarios: meta.horarios,
              frequencia: meta.frequencia,
              primeiroHorario: meta.primeiroHorario,
              dosesPorDia: meta.dosesPorDia,
              duracaoTipo: meta.duracaoTipo,
              duracaoDias: meta.duracaoDias,
              horariosConferidos: meta.horariosConferidos,
              intervaloHoras: meta.intervaloHoras,
              vigenciaInicio: agora,
              vigenciaFim: meta.vigenciaFim,
              criadoPorId: usuario.id,
            },
          },
        },
        include: {
          programacoes: true,
          anexos: true,
        },
      });

      const anexoIds = [...new Set((entrada.anexoIds ?? []).filter(Boolean))];
      for (const anexoId of anexoIds) {
        const anexo = await tx.anexo.findFirst({
          where: {
            id: anexoId,
            familiaId: pessoa.familiaId,
            revogadoEm: null,
          },
        });
        if (!anexo) {
          throw new NotFoundException(`Anexo ${anexoId} não encontrado.`);
        }
        await tx.medicamentoAnexo.create({
          data: { medicamentoId: criado.id, anexoId },
        });
      }

      return tx.medicamento.findUniqueOrThrow({
        where: { id: criado.id },
        include: {
          programacoes: { orderBy: { vigenciaInicio: "desc" } },
          anexos: { select: { anexoId: true } },
        },
      });
    });

    return {
      ...medicamento,
      conferido: ativar,
      aviso: ativar
        ? "Lembretes ativos a partir da conferência."
        : "Rascunho: confira e ative para gerar lembretes (CUI-F01).",
    };
  }

  async ativar(medicamentoId: string, usuario: UsuarioAutenticado) {
    const med = await this.carregarMedicamentoGerenciavel(medicamentoId, usuario);
    if (med.status === "ativo") return this.formatar(med.id);
    if (med.status === "encerrado") {
      throw new BadRequestException("Medicamento encerrado não pode ser reativado neste fluxo.");
    }
    const programacao = await this.prisma.programacaoMedicamento.findFirst({
      where: { medicamentoId: med.id, vigenciaFim: null },
      orderBy: { vigenciaInicio: "desc" },
    });
    if (!programacao) {
      throw new BadRequestException("Não há programação vigente para ativar.");
    }
    const legadoPreV13 =
      programacao.primeiroHorario == null && programacao.dosesPorDia == null;
    if (!programacao.horariosConferidos && !legadoPreV13) {
      throw new BadRequestException(
        "Confira os horários com a orientação vigente antes de ativar.",
      );
    }
    if (!programacao.horariosConferidos && legadoPreV13) {
      await this.prisma.programacaoMedicamento.update({
        where: { id: programacao.id },
        data: { horariosConferidos: true },
      });
    }
    await this.prisma.medicamento.update({
      where: { id: med.id },
      data: { status: "ativo", ativadoEm: new Date(), suspensoEm: null },
    });
    return this.formatar(med.id);
  }

  async alterarProgramacao(
    medicamentoId: string,
    usuario: UsuarioAutenticado,
    entrada: EntradaMetadadosProgramacao,
  ) {
    const med = await this.carregarMedicamentoGerenciavel(medicamentoId, usuario);
    const agora = new Date();
    const meta = this.resolverMetadadosProgramacao(entrada, {
      // Programação vigente alimenta lembretes; exige conferência salvo legado só-horarios.
      exigirConferencia: true,
      vigenciaInicio: agora,
    });
    await this.prisma.$transaction(async (tx) => {
      await tx.programacaoMedicamento.updateMany({
        where: {
          medicamentoId: med.id,
          vigenciaFim: null,
        },
        data: { vigenciaFim: agora },
      });
      await tx.programacaoMedicamento.create({
        data: {
          medicamentoId: med.id,
          horarios: meta.horarios,
          frequencia: meta.frequencia,
          primeiroHorario: meta.primeiroHorario,
          dosesPorDia: meta.dosesPorDia,
          duracaoTipo: meta.duracaoTipo,
          duracaoDias: meta.duracaoDias,
          horariosConferidos: meta.horariosConferidos,
          intervaloHoras: meta.intervaloHoras,
          vigenciaInicio: agora,
          vigenciaFim: meta.vigenciaFim,
          criadoPorId: usuario.id,
        },
      });
    });
    return this.formatar(med.id);
  }

  async encerrarOuSuspender(
    medicamentoId: string,
    usuario: UsuarioAutenticado,
    acao: "suspender" | "encerrar",
  ) {
    const med = await this.carregarMedicamentoGerenciavel(medicamentoId, usuario);
    const agora = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.programacaoMedicamento.updateMany({
        where: { medicamentoId: med.id, vigenciaFim: null },
        data: { vigenciaFim: agora },
      });
      await tx.medicamento.update({
        where: { id: med.id },
        data:
          acao === "suspender"
            ? { status: "suspenso", suspensoEm: agora }
            : { status: "encerrado", encerradoEm: agora },
      });
    });
    return this.formatar(med.id);
  }

  async registrarDose(
    medicamentoId: string,
    usuario: UsuarioAutenticado,
    entrada: {
      data?: string;
      horario?: string;
      situacao?: string;
      horarioEfetivo?: string | null;
    },
  ) {
    const med = await this.prisma.medicamento.findUnique({
      where: { id: medicamentoId },
      include: { pessoa: true },
    });
    if (!med || med.pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new NotFoundException("Medicamento não encontrado.");
    }
    const pode = await this.autorizacoes.podeRegistrarRelatoCuidados(
      med.pessoa.familiaId,
      med.pessoaId,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException("Sem permissão para registrar dose.");
    }
    if (med.status !== "ativo") {
      throw new BadRequestException("Só medicamentos ativos aceitam registro de dose.");
    }

    const situacaoBruta = (entrada.situacao ?? "").trim();
    if (!ehSituacaoDose(situacaoBruta)) {
      throw new BadRequestException(
        "Situação deve ser tomou_conforme_informacao ou informou_nao_tomou.",
      );
    }
    const situacao: SituacaoDose = situacaoBruta;
    const dataIso = (entrada.data ?? new Date().toISOString().slice(0, 10)).trim();
    const horario = (entrada.horario ?? "").trim();
    if (!/^\d{2}:\d{2}$/.test(horario)) {
      throw new BadRequestException("Horário da ocorrência no formato HH:MM.");
    }

    const ocorrencia = chaveOcorrencia(med.id, dataIso, horario);
    const ativo = await this.prisma.registroDose.findFirst({
      where: { ocorrenciaChave: ocorrencia, versaoAtiva: true },
    });
    if (ativo) {
      throw new BadRequestException(
        "Já existe registro ativo para esta ocorrência; use correção (PATCH).",
      );
    }

    return this.prisma.registroDose.create({
      data: {
        medicamentoId: med.id,
        ocorrenciaChave: ocorrencia,
        situacao,
        horarioEfetivo: entrada.horarioEfetivo
          ? new Date(entrada.horarioEfetivo)
          : null,
        registradoPorId: usuario.id,
      },
      select: {
        id: true,
        ocorrenciaChave: true,
        situacao: true,
        horarioEfetivo: true,
        registradoPorId: true,
        registradoEm: true,
        versaoAtiva: true,
      },
    });
  }

  async corrigirDose(
    registroId: string,
    usuario: UsuarioAutenticado,
    entrada: { situacao?: string; horarioEfetivo?: string | null },
  ) {
    const atual = await this.prisma.registroDose.findUnique({
      where: { id: registroId },
      include: { medicamento: { include: { pessoa: true } } },
    });
    if (
      !atual ||
      !atual.versaoAtiva ||
      atual.medicamento.pessoa.familiaId !== usuario.pessoa.familiaId
    ) {
      throw new NotFoundException("Registro ativo não encontrado.");
    }
    const pode = await this.autorizacoes.podeRegistrarRelatoCuidados(
      atual.medicamento.pessoa.familiaId,
      atual.medicamento.pessoaId,
      usuario,
    );
    if (!pode) throw new ForbiddenException("Sem permissão para corrigir dose.");

    const situacaoBruta = (entrada.situacao ?? atual.situacao).trim();
    if (!ehSituacaoDose(situacaoBruta)) {
      throw new BadRequestException("Situação inválida.");
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.registroDose.update({
        where: { id: atual.id },
        data: { versaoAtiva: false },
      });
      return tx.registroDose.create({
        data: {
          medicamentoId: atual.medicamentoId,
          ocorrenciaChave: atual.ocorrenciaChave,
          situacao: situacaoBruta,
          horarioEfetivo:
            entrada.horarioEfetivo === undefined
              ? atual.horarioEfetivo
              : entrada.horarioEfetivo
                ? new Date(entrada.horarioEfetivo)
                : null,
          registradoPorId: usuario.id,
          substituiId: atual.id,
        },
        select: {
          id: true,
          ocorrenciaChave: true,
          situacao: true,
          horarioEfetivo: true,
          registradoPorId: true,
          registradoEm: true,
          versaoAtiva: true,
          substituiId: true,
        },
      });
    });
  }

  async rotinaHoje(pessoaId: string, usuario: UsuarioAutenticado, dataRef?: string) {
    const pessoa = await this.exigirPessoaVisivel(pessoaId, usuario);
    const dia = (dataRef ?? new Date().toISOString().slice(0, 10)).trim();
    const medicamentos = await this.prisma.medicamento.findMany({
      where: { pessoaId: pessoa.id, status: "ativo" },
      include: {
        programacoes: {
          where: {
            vigenciaInicio: { lte: new Date(`${dia}T23:59:59.999Z`) },
            OR: [{ vigenciaFim: null }, { vigenciaFim: { gt: new Date(`${dia}T00:00:00.000Z`) } }],
          },
          orderBy: { vigenciaInicio: "desc" },
          take: 1,
        },
      },
    });

    const cartoes: Array<{
      tipo: "medicamento";
      medicamentoId: string;
      nome: string;
      horario: string;
      situacao: string;
      registroId: string | null;
      confirmaAoTocar: false;
    }> = [];

    for (const med of medicamentos) {
      const prog = med.programacoes[0];
      if (!prog) continue;
      const horarios = Array.isArray(prog.horarios)
        ? (prog.horarios as string[])
        : [];
      for (const horario of horarios) {
        const chave = chaveOcorrencia(med.id, dia, horario);
        const registro = await this.prisma.registroDose.findFirst({
          where: { ocorrenciaChave: chave, versaoAtiva: true },
        });
        cartoes.push({
          tipo: "medicamento",
          medicamentoId: med.id,
          nome: med.nome,
          horario,
          situacao: registro?.situacao ?? "sem_confirmacao",
          registroId: registro?.id ?? null,
          confirmaAoTocar: false,
        });
      }
    }

    cartoes.sort((a, b) => a.horario.localeCompare(b.horario));
    const proximo = cartoes.find((c) => c.situacao === "sem_confirmacao") ?? null;

    const consultas = await this.prisma.consulta.findMany({
      where: {
        pessoaId: pessoa.id,
        status: "agendada",
        dataHora: {
          gte: new Date(`${dia}T00:00:00.000Z`),
          lt: new Date(`${dia}T23:59:59.999Z`),
        },
      },
      orderBy: { dataHora: "asc" },
    });

    const atividades = await this.prisma.registroAtividade.findMany({
      where: {
        pessoaId: pessoa.id,
        concluidaEm: {
          gte: new Date(`${dia}T00:00:00.000Z`),
          lt: new Date(`${dia}T23:59:59.999Z`),
        },
      },
      orderBy: { concluidaEm: "desc" },
    });

    return {
      pessoaId: pessoa.id,
      data: dia,
      proximoCuidado: proximo,
      secoes: {
        medicamentos: cartoes,
        consultas,
        atividadesApoio: atividades,
      },
      regra: "Ausência de registro não equivale a não tomada (CUI-F02).",
    };
  }

  private async formatar(id: string) {
    return this.prisma.medicamento.findUniqueOrThrow({
      where: { id },
      include: {
        programacoes: { orderBy: { vigenciaInicio: "desc" } },
        anexos: { select: { anexoId: true } },
      },
    });
  }

  private resolverMetadadosProgramacao(
    entrada: EntradaMetadadosProgramacao,
    opcoes: { exigirConferencia: boolean; vigenciaInicio: Date },
  ): MetadadosProgramacaoResolvidos {
    const horarios = this.normalizarHorarios(entrada.horarios);
    if (horarios.length === 0) {
      throw new BadRequestException("Informe ao menos um horário.");
    }

    const primeiroHorario = this.normalizarUmHorario(
      entrada.primeiroHorario ?? horarios[0],
    );
    if (!primeiroHorario) {
      throw new BadRequestException("Informe o primeiro horário.");
    }

    const dosesPorDia =
      entrada.dosesPorDia !== undefined && entrada.dosesPorDia !== null
        ? Number(entrada.dosesPorDia)
        : horarios.length;
    if (!Number.isInteger(dosesPorDia) || dosesPorDia < 1 || dosesPorDia > 24) {
      throw new BadRequestException("Quantidade de doses ao dia inválida.");
    }
    if (horarios.length !== dosesPorDia) {
      throw new BadRequestException(
        "Confira os horários: a quantidade deve coincidir com as doses ao dia.",
      );
    }
    if (horarios[0] !== primeiroHorario) {
      throw new BadRequestException(
        "O primeiro horário conferido deve ser o mesmo informado no cadastro.",
      );
    }

    const duracaoTipo = entrada.duracaoTipo === "dias" ? "dias" : "continua";
    let duracaoDias: number | null = null;
    if (duracaoTipo === "dias") {
      duracaoDias = Number(entrada.duracaoDias);
      if (!Number.isInteger(duracaoDias) || duracaoDias < 1) {
        throw new BadRequestException(
          "Informe a quantidade de dias da programação.",
        );
      }
    }

    const intervaloHoras =
      entrada.intervaloHoras === undefined || entrada.intervaloHoras === null
        ? null
        : Number(entrada.intervaloHoras);
    if (
      intervaloHoras !== null &&
      (!Number.isInteger(intervaloHoras) ||
        intervaloHoras < 1 ||
        intervaloHoras > 24)
    ) {
      throw new BadRequestException("Intervalo em horas inválido.");
    }

    const legadoSemMetadados =
      entrada.dosesPorDia === undefined &&
      entrada.primeiroHorario === undefined &&
      entrada.duracaoTipo === undefined;
    const horariosConferidos = legadoSemMetadados
      ? true
      : Boolean(entrada.horariosConferidos);
    if (opcoes.exigirConferencia && !horariosConferidos) {
      throw new BadRequestException(
        "Confira os horários com a orientação vigente antes de ativar.",
      );
    }

    let vigenciaFim: Date | null = null;
    if (duracaoTipo === "dias" && duracaoDias) {
      vigenciaFim = new Date(opcoes.vigenciaInicio);
      vigenciaFim.setUTCDate(vigenciaFim.getUTCDate() + duracaoDias);
    }

    return {
      horarios,
      frequencia: (entrada.frequencia ?? "diaria").trim() || "diaria",
      primeiroHorario,
      dosesPorDia,
      duracaoTipo,
      duracaoDias,
      horariosConferidos,
      intervaloHoras,
      vigenciaFim,
    };
  }

  private normalizarUmHorario(valor?: string | null): string | null {
    if (!valor) return null;
    const limpo = String(valor).trim();
    return /^\d{2}:\d{2}$/.test(limpo) ? limpo : null;
  }

  private normalizarHorarios(horarios?: string[]): string[] {
    if (!Array.isArray(horarios)) return [];
    const vistos = new Set<string>();
    const limpos: string[] = [];
    for (const h of horarios) {
      const limpo = this.normalizarUmHorario(h);
      if (!limpo || vistos.has(limpo)) continue;
      vistos.add(limpo);
      limpos.push(limpo);
    }
    return limpos;
  }

  private async exigirPessoaVisivel(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id: pessoaId } });
    if (!pessoa || pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new NotFoundException("Pessoa não encontrada.");
    }
    const pode = await this.autorizacoes.podeVerCuidados(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException("Acesso negado aos cuidados desta pessoa.");
    }
    return pessoa;
  }

  private async carregarMedicamentoGerenciavel(
    medicamentoId: string,
    usuario: UsuarioAutenticado,
  ) {
    const med = await this.prisma.medicamento.findUnique({
      where: { id: medicamentoId },
      include: { pessoa: true },
    });
    if (!med || med.pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new NotFoundException("Medicamento não encontrado.");
    }
    const pode = await this.autorizacoes.podeAlterarProgramacaoCuidados(
      med.pessoa.familiaId,
      med.pessoaId,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException(
        "Colaboradora não altera programação (CUI-F04/ACE-C07).",
      );
    }
    return med;
  }
}
