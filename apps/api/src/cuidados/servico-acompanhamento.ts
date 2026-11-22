import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
import { CATALOGO_JOGOS } from "../desenvolvimento/jogos/catalogo-jogos";
import { chaveOcorrencia } from "./permissoes-cuidados";

@Injectable()
export class ServicoAcompanhamento {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async historico(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    periodo?: { de?: string; ate?: string; dominio?: string },
  ) {
    const { pessoa, cuidados: podeCuidados, desenvolvimento: podeDesenvolvimento } =
      await this.obterVisao(pessoaId, usuario);
    const filtroDominio = (periodo?.dominio ?? "").trim().toLowerCase();
    const de = periodo?.de ? this.inicioDoPeriodo(periodo.de) : new Date(0);
    const ate = periodo?.ate
      ? this.fimDoPeriodo(periodo.ate)
      : new Date();

    type EventoHistorico = {
      tipo: string;
      dominio: "cuidados" | "desenvolvimento";
      quando: Date;
      resumo: string;
      origemId: string;
      versaoAtiva?: boolean;
      anexoId?: string;
      categoria?: string | null;
      detalhe?: string;
    };

    const eventos: EventoHistorico[] = [];

    if (podeCuidados && filtroDominio !== "desenvolvimento") {
      const podeAnexos = await this.autorizacoes.podeConsultarAnexosCuidados(
        pessoa.familiaId, pessoa.id, usuario,
      );
      const [doses, programacoes, consultas, exames, atividades, medicamentos] =
        await Promise.all([
          this.prisma.registroDose.findMany({
            where: {
              medicamento: { pessoaId: pessoa.id },
              registradoEm: { gte: de, lte: ate },
            },
            orderBy: { registradoEm: "desc" },
            include: { medicamento: { select: { id: true, nome: true } } },
          }),
          this.prisma.programacaoMedicamento.findMany({
            where: {
              medicamento: { pessoaId: pessoa.id },
              criadoEm: { gte: de, lte: ate },
            },
            orderBy: { criadoEm: "desc" },
            include: { medicamento: { select: { id: true, nome: true } } },
          }),
          this.prisma.consulta.findMany({
            where: { pessoaId: pessoa.id, criadoEm: { gte: de, lte: ate } },
            orderBy: { dataHora: "desc" },
          }),
          this.prisma.exame.findMany({
            where: { pessoaId: pessoa.id, criadoEm: { gte: de, lte: ate } },
            orderBy: { criadoEm: "desc" },
          }),
          this.prisma.registroAtividade.findMany({
            where: { pessoaId: pessoa.id, criadoEm: { gte: de, lte: ate } },
            orderBy: { concluidaEm: "desc" },
          }),
          this.prisma.medicamento.findMany({
            where: {
              pessoaId: pessoa.id,
              OR: [
                { encerradoEm: { gte: de, lte: ate } },
                { suspensoEm: { gte: de, lte: ate } },
              ],
            },
          }),
        ]);

      eventos.push(
        ...doses.map((d) => ({
          tipo: d.substituiId ? "correcao_dose" : "registro_dose",
          dominio: "cuidados" as const,
          quando: d.registradoEm,
          resumo: `${d.medicamento.nome}: ${this.rotuloSituacaoDose(d.situacao)}`,
          origemId: d.id,
          versaoAtiva: d.versaoAtiva,
          detalhe: d.substituiId
            ? "Este relato substitui uma informação anterior."
            : undefined,
        })),
        ...programacoes.map((p) => ({
          tipo: "programacao",
          dominio: "cuidados" as const,
          quando: p.criadoEm,
          resumo: `${p.medicamento.nome}: horários ${this.formatarHorarios(p.horarios)}`,
          origemId: p.id,
          detalhe: `Vigência a partir de ${this.formatarQuandoLocal(p.vigenciaInicio)}${
            p.vigenciaFim
              ? ` até ${this.formatarQuandoLocal(p.vigenciaFim)}`
              : ""
          }.`,
        })),
        ...consultas.map((c) => ({
          tipo: "consulta",
          dominio: "cuidados" as const,
          quando: c.dataHora,
          resumo: `${c.especialidadeOuDescricao} (${this.rotuloStatusConsulta(c.status)})`,
          origemId: c.id,
          detalhe: [
            c.profissional ? `Profissional: ${c.profissional}` : null,
            c.local ? `Local: ${c.local}` : null,
          ]
            .filter(Boolean)
            .join(" · ") || undefined,
        })),
        ...exames.map((e) => ({
          tipo: "exame",
          dominio: "cuidados" as const,
          quando: e.criadoEm,
          resumo: e.descricao,
          origemId: e.id,
          ...(podeAnexos && e.anexoId ? { anexoId: e.anexoId } : {}),
          detalhe:
            podeAnexos && e.anexoId
              ? "Há documento anexado (visível só com permissão)."
              : undefined,
        })),
        ...atividades.map((a) => ({
          tipo: "atividade_apoio",
          dominio: "cuidados" as const,
          quando: a.concluidaEm,
          resumo: a.descricao,
          origemId: a.id,
          detalhe: (a.observacao ?? "").trim() || undefined,
        })),
        ...medicamentos.map((m) => ({
          tipo: m.encerradoEm ? "encerramento" : "suspensao",
          dominio: "cuidados" as const,
          quando: (m.encerradoEm ?? m.suspensoEm)!,
          resumo: `${m.nome}: ${this.rotuloStatusMedicamento(m.status)}`,
          origemId: m.id,
        })),
      );
    }

    if (podeDesenvolvimento && filtroDominio !== "cuidados") {
      const [participacoes, resgates, conclusoesJogos] = await Promise.all([
        this.prisma.participacaoDesafio.findMany({
          where: {
            pessoaId: pessoa.id,
            versaoAtiva: true,
            registradoEm: { gte: de, lte: ate },
          },
          orderBy: { registradoEm: "desc" },
          include: {
            desafio: {
              select: { nome: true, categoria: true, origem: true },
            },
          },
        }),
        this.prisma.resgateRecompensa.findMany({
          where: {
            pessoaId: pessoa.id,
            resgatadoEm: { gte: de, lte: ate },
          },
          orderBy: { resgatadoEm: "desc" },
          include: { recompensa: { select: { nome: true } } },
        }),
        this.prisma.progressoFaseJogo.findMany({
          where: {
            familiaId: pessoa.familiaId,
            pessoaId: pessoa.id,
            concluidaEm: { gte: de, lte: ate },
          },
          select: {
            jogoId: true, fase: true, concluidaEm: true,
            versaoConclusao: true, nomeNaConclusao: true, categoriaNaConclusao: true,
          },
        }),
      ]);

      eventos.push(
        ...participacoes.map((p) => {
          const verbo =
            p.resultado === "concluiu" ? "Concluiu" : "Participou";
          const obs = p.observacao ? ` — ${p.observacao}` : "";
          const nome = p.nomeAplicado ?? p.desafio.nome;
          const categoria = p.categoriaAplicada ?? p.desafio.categoria;
          return {
            tipo: p.substituiId
              ? "correcao_participacao"
              : "participacao",
            dominio: "desenvolvimento" as const,
            quando: p.registradoEm,
            resumo: `${verbo}: ${nome} (+${p.estrelasConcedidas} estrelas)${obs}`,
            origemId: p.id,
            versaoAtiva: p.versaoAtiva,
            categoria,
            detalhe: p.substituiId
              ? "Correção de registro anterior de brincadeira."
              : undefined,
          };
        }),
        ...resgates.map((r) => ({
          tipo: "resgate_recompensa",
          dominio: "desenvolvimento" as const,
          quando: r.resgatadoEm,
          resumo: `Resgate: ${r.recompensa.nome} (−${r.custoAplicado} estrelas)`,
          origemId: r.id,
        })),
      );
      for (const conclusao of conclusoesJogos) {
        if (!conclusao.concluidaEm) continue;
        eventos.push({
          tipo: "conclusao_fase_jogo",
          dominio: "desenvolvimento",
          quando: conclusao.concluidaEm,
          resumo: `${conclusao.nomeNaConclusao ?? "Jogo digital"} · Fase ${conclusao.fase} concluída`,
          origemId: `${conclusao.jogoId}/${conclusao.fase}`,
          categoria: conclusao.categoriaNaConclusao,
          detalhe: conclusao.versaoConclusao ? `Versão do jogo: ${conclusao.versaoConclusao}.` : undefined,
        });
      }
    }

    eventos.sort((a, b) => b.quando.getTime() - a.quando.getTime());

    return {
      pessoaId: pessoa.id,
      derivadoDeRegistrosOrigem: true,
      dominios: {
        cuidados: podeCuidados,
        desenvolvimento: podeDesenvolvimento,
      },
      filtro: {
        de: periodo?.de ?? null,
        ate: periodo?.ate ?? null,
        dominio: filtroDominio || null,
      },
      eventos,
    };
  }

  async lembretesDerivados(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    dataRef?: string,
  ) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id: pessoaId } });
    if (!pessoa || pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new NotFoundException("Pessoa não encontrada.");
    }
    if (!(await this.autorizacoes.podeVerCuidados(pessoa.familiaId, pessoa.id, usuario))) {
      throw new ForbiddenException("Acesso negado aos lembretes de cuidados.");
    }
    const dia = (dataRef ?? new Date().toISOString().slice(0, 10)).trim();
    const medicamentos = await this.prisma.medicamento.findMany({
      where: { pessoaId: pessoa.id, status: "ativo" },
      include: {
        programacoes: {
          where: { vigenciaFim: null },
          orderBy: { vigenciaInicio: "desc" },
          take: 1,
        },
      },
    });

    const itens: Array<{
      tipo: string;
      medicamentoId?: string;
      consultaId?: string;
      titulo: string;
      horario: string;
      estado: string;
      insistente: false;
    }> = [];

    const ocorrencias = medicamentos.flatMap((med) => {
      const prog = med.programacoes[0];
      const horarios = Array.isArray(prog?.horarios)
        ? (prog.horarios as string[])
        : [];
      return horarios.map((horario) => ({
        med, horario, chave: chaveOcorrencia(med.id, dia, horario),
      }));
    });
    const chaves = [...new Set(ocorrencias.map(({ chave }) => chave))];
    const registros = chaves.length ? await this.prisma.registroDose.findMany({
      where: { ocorrenciaChave: { in: chaves }, versaoAtiva: true },
      select: { ocorrenciaChave: true, situacao: true },
    }) : [];
    const situacaoPorChave = new Map<string, string>();
    const chavesDuplicadas = new Set<string>();
    for (const { ocorrenciaChave, situacao } of registros) {
      if (situacaoPorChave.has(ocorrenciaChave)) chavesDuplicadas.add(ocorrenciaChave);
      situacaoPorChave.set(ocorrenciaChave, situacao);
    }
    // Dados antigos podem ter duas versões ativas. Nesses casos, preserve a leitura anterior.
    for (const chave of chavesDuplicadas) {
      const registro = await this.prisma.registroDose.findFirst({
        where: { ocorrenciaChave: chave, versaoAtiva: true },
      });
      if (registro) situacaoPorChave.set(chave, registro.situacao);
      else situacaoPorChave.delete(chave);
    }
    for (const { med, horario, chave } of ocorrencias) {
      itens.push({
        tipo: "medicamento",
        medicamentoId: med.id,
        titulo: med.nome,
        horario,
        estado: situacaoPorChave.get(chave) ?? "sem_confirmacao_apenas_informativo",
        insistente: false,
      });
    }

    const consultas = await this.prisma.consulta.findMany({
      where: {
        pessoaId: pessoa.id,
        status: "agendada",
        dataHora: {
          gte: new Date(`${dia}T00:00:00.000Z`),
          lt: new Date(`${dia}T23:59:59.999Z`),
        },
      },
    });
    for (const c of consultas) {
      itens.push({
        tipo: "consulta",
        consultaId: c.id,
        titulo: c.especialidadeOuDescricao,
        horario: c.dataHora.toISOString().slice(11, 16),
        estado: "agendada",
        insistente: false,
      });
    }

    return {
      pessoaId: pessoa.id,
      data: dia,
      canalUnicoSeguranca: false,
      limitacoesDispositivosReais: true,
      notaAceC12:
        "Lembretes derivados via API; push/PWA em aparelhos reais permanece PENDING (DECISOES.md).",
      itens: itens.sort((a, b) => a.horario.localeCompare(b.horario)),
    };
  }

  async resumo(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    periodo: { de: string; ate: string },
  ) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const podeCuidados = await this.autorizacoes.podeVerCuidados(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!podeCuidados) {
      throw new ForbiddenException(
        "Acesso negado ao resumo de cuidados desta pessoa.",
      );
    }
    const podeAnexos = await this.autorizacoes.podeConsultarAnexosCuidados(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );

    const de = this.inicioDoPeriodo(periodo.de);
    const ate = this.fimDoPeriodo(periodo.ate);
    if (Number.isNaN(de.getTime()) || Number.isNaN(ate.getTime()) || de > ate) {
      throw new BadRequestException("Período inválido para o resumo.");
    }

    // Totais cobrem o período inteiro (EVO-REV-05); listagens podem ser limitadas com sinalização.
    const dias = this.listarDiasIso(de, ate);
    const medicamentos = await this.prisma.medicamento.findMany({
      where: { pessoaId: pessoa.id },
      include: {
        programacoes: {
          where: {
            vigenciaInicio: { lte: ate },
            OR: [{ vigenciaFim: null }, { vigenciaFim: { gt: de } }],
          },
          orderBy: { vigenciaInicio: "desc" },
        },
      },
    });

    const chavesPrevistas: string[] = [];
    for (const med of medicamentos) {
      for (const dia of dias) {
        const inicioDia = this.inicioDoPeriodo(dia);
        const fimDia = this.fimDoPeriodo(dia);
        const prog = med.programacoes.find(
          (p) =>
            p.vigenciaInicio <= fimDia &&
            (p.vigenciaFim === null || p.vigenciaFim > inicioDia),
        );
        if (!prog) continue;
        const horarios = Array.isArray(prog.horarios)
          ? (prog.horarios as string[])
          : [];
        for (const horario of horarios) {
          chavesPrevistas.push(chaveOcorrencia(med.id, dia, horario));
        }
      }
    }

    const filtroAtivo = { medicamento: { pessoaId: pessoa.id }, versaoAtiva: true };
    const selecaoDose = { ocorrenciaChave: true, situacao: true } as const;
    const chavesUnicas = [...new Set(chavesPrevistas)];
    const situacaoPorChave = new Map<string, string>();
    let encontrouDuplicata = false;
    for (let inicio = 0; inicio < chavesUnicas.length; inicio += 1000) {
      const registros = await this.prisma.registroDose.findMany({
        where: { ...filtroAtivo, ocorrenciaChave: { in: chavesUnicas.slice(inicio, inicio + 1000) } },
        select: selecaoDose,
      });
      for (const registro of registros) {
        if (situacaoPorChave.has(registro.ocorrenciaChave)) encontrouDuplicata = true;
        situacaoPorChave.set(registro.ocorrenciaChave, registro.situacao);
      }
    }
    if (encontrouDuplicata) {
      // Preserve a seleção legada para ocorrências com mais de uma versão ativa.
      const registros = await this.prisma.registroDose.findMany({ where: filtroAtivo, select: selecaoDose });
      situacaoPorChave.clear();
      for (const registro of registros) situacaoPorChave.set(registro.ocorrenciaChave, registro.situacao);
    }

    const previstos = chavesPrevistas.length;
    let tomadas = 0;
    let naoTomadas = 0;
    for (const chave of chavesPrevistas) {
      const situacao = situacaoPorChave.get(chave);
      if (situacao === "tomou_conforme_informacao") tomadas += 1;
      else if (situacao === "informou_nao_tomou") naoTomadas += 1;
    }
    const semConfirmacao = previstos - tomadas - naoTomadas;

    // Listagens completas no contrato de prévia/PDF (EVO-REV-03/04/05); sem corte silencioso.
    const [doses, consultas, exames, atividades, programacoesPeriodo] =
      await Promise.all([
        this.prisma.registroDose.findMany({
          where: {
            medicamento: { pessoaId: pessoa.id },
            versaoAtiva: true,
            registradoEm: { gte: de, lte: ate },
          },
          include: { medicamento: { select: { nome: true } } },
          orderBy: { registradoEm: "desc" },
        }),
        this.prisma.consulta.findMany({
          where: { pessoaId: pessoa.id, dataHora: { gte: de, lte: ate } },
          orderBy: { dataHora: "desc" },
        }),
        this.prisma.exame.findMany({
          where: { pessoaId: pessoa.id, criadoEm: { gte: de, lte: ate } },
          orderBy: { criadoEm: "desc" },
        }),
        this.prisma.registroAtividade.findMany({
          where: {
            pessoaId: pessoa.id,
            concluidaEm: { gte: de, lte: ate },
          },
          orderBy: { concluidaEm: "desc" },
        }),
        this.prisma.programacaoMedicamento.findMany({
          where: {
            medicamento: { pessoaId: pessoa.id },
            criadoEm: { gte: de, lte: ate },
          },
          include: { medicamento: { select: { nome: true } } },
          orderBy: { criadoEm: "desc" },
        }),
      ]);
    const totalRegistros = doses.length;
    const totalConsultas = consultas.length;
    const totalExames = exames.length;
    const totalAtividades = atividades.length;
    const totalProgramacoes = programacoesPeriodo.length;

    return {
      pessoaId: pessoa.id,
      pessoaNome: pessoa.nome,
      tipo: "cuidados",
      periodo: { de: periodo.de, ate: periodo.ate },
      diasNoPeriodo: dias.length,
      doses: {
        previstos,
        tomadasInformadas: tomadas,
        naoTomadasInformadas: naoTomadas,
        semConfirmacao,
        // aliases legados
        tomadas,
        naoTomadas,
        naoConfirmadas: semConfirmacao,
      },
      esclarecimento:
        "Sem confirmação não significa dose não tomada. Relatos familiares, sem inferência clínica.",
      registros: doses.map((d) => ({
        medicamento: d.medicamento.nome,
        situacao: d.situacao,
        quando: d.registradoEm,
      })),
      listagens: {
        registros: {
          totalNoPeriodo: totalRegistros,
          exibidos: doses.length,
          limitada: totalRegistros > doses.length,
        },
        consultas: {
          totalNoPeriodo: totalConsultas,
          exibidos: consultas.length,
          limitada: totalConsultas > consultas.length,
        },
        exames: {
          totalNoPeriodo: totalExames,
          exibidos: exames.length,
          limitada: totalExames > exames.length,
        },
        observacoes: {
          totalNoPeriodo: totalAtividades,
          exibidos: atividades.length,
          limitada: totalAtividades > atividades.length,
        },
        mudancasProgramacao: {
          totalNoPeriodo: totalProgramacoes,
          exibidos: programacoesPeriodo.length,
          limitada: totalProgramacoes > programacoesPeriodo.length,
        },
      },
      consultas: consultas.map((c) => ({
        id: c.id,
        especialidadeOuDescricao: c.especialidadeOuDescricao,
        dataHora: c.dataHora,
        status: c.status,
      })),
      exames: exames.map((e) => ({
        id: e.id,
        descricao: e.descricao,
        data: e.data,
        criadoEm: e.criadoEm,
        temDocumento: podeAnexos && Boolean(e.anexoId),
      })),
      observacoes: atividades.map((a) => ({
        id: a.id,
        descricao: a.descricao,
        observacao: a.observacao,
        concluidaEm: a.concluidaEm,
      })),
      mudancasProgramacao: programacoesPeriodo.map((p) => ({
        id: p.id,
        medicamento: p.medicamento.nome,
        horarios: this.formatarHorarios(p.horarios),
        vigenciaInicio: p.vigenciaInicio,
        vigenciaFim: p.vigenciaFim,
        criadoEm: p.criadoEm,
      })),
      inferenciaClinica: false,
      previa: true,
    };
  }

  async resumoDesenvolvimento(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    periodo: { de: string; ate: string },
    opcoes: { incluirJogos?: boolean } = {},
  ) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const podeDesenvolvimento = await this.autorizacoes.podeVerDesenvolvimento(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!podeDesenvolvimento) {
      throw new ForbiddenException(
        "Acesso negado ao resumo de desenvolvimento desta pessoa.",
      );
    }

    const de = this.inicioDoPeriodo(periodo.de);
    const ate = this.fimDoPeriodo(periodo.ate);
    if (Number.isNaN(de.getTime()) || Number.isNaN(ate.getTime()) || de > ate) {
      throw new BadRequestException("Período inválido para o resumo.");
    }

    const filtroParticipacao = {
      pessoaId: pessoa.id,
      versaoAtiva: true,
      registradoEm: { gte: de, lte: ate },
    } as const;

    const [todasParticipacoes, jogos] = await Promise.all([
      this.prisma.participacaoDesafio.findMany({
        where: filtroParticipacao,
        orderBy: { registradoEm: "desc" },
        include: {
          desafio: {
            select: { nome: true, categoria: true, origem: true },
          },
        },
      }),
      opcoes.incluirJogos ? this.resumoJogos(pessoa.familiaId, pessoa.id, de, ate) : undefined,
    ]);

    const mapear = (
      p: (typeof todasParticipacoes)[number],
    ) => {
      const categoriaBruta = (
        p.categoriaAplicada ??
        p.desafio.categoria ??
        ""
      ).trim();
      const categoria =
        categoriaBruta.length > 0 ? categoriaBruta : "nao_classificada";
      return {
        id: p.id,
        nome: p.nomeAplicado ?? p.desafio.nome,
        categoria,
        origem: p.desafio.origem,
        resultado: p.resultado,
        estrelasConcedidas: p.estrelasConcedidas,
        observacao: p.observacao,
        registradoEm: p.registradoEm,
      };
    };

    const experienciasTotais = todasParticipacoes.map(mapear);
    const experiencias = experienciasTotais;

    const contagemCategorias = new Map<string, number>();
    for (const e of experienciasTotais) {
      contagemCategorias.set(
        e.categoria,
        (contagemCategorias.get(e.categoria) ?? 0) + 1,
      );
    }
    const categoriasExploradas = [...contagemCategorias.entries()]
      .map(([categoria, quantidade]) => ({ categoria, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade || a.categoria.localeCompare(b.categoria));

    const estrelasConcedidasNoPeriodo = experienciasTotais.reduce(
      (acc, e) => acc + e.estrelasConcedidas,
      0,
    );

    const observacoesTotais = experienciasTotais
      .filter((e) => (e.observacao ?? "").trim().length > 0)
      .map((e) => ({
        experienciaId: e.id,
        nome: e.nome,
        texto: e.observacao as string,
        registradoEm: e.registradoEm,
      }));
    const observacoes = observacoesTotais;

    return {
      pessoaId: pessoa.id,
      pessoaNome: pessoa.nome,
      tipo: "desenvolvimento",
      periodo: { de: periodo.de, ate: periodo.ate },
      ...(jogos ? { jogos } : {}),
      experiencias,
      categoriasExploradas,
      estrelas: {
        concedidasNoPeriodo: estrelasConcedidasNoPeriodo,
        esclarecimento:
          "Estrelas são um incentivo lúdico da família — não medem inteligência, nível clínico nem comparam crianças.",
      },
      observacoes,
      listagens: {
        experiencias: {
          totalNoPeriodo: experienciasTotais.length,
          exibidos: experiencias.length,
          limitada: experienciasTotais.length > experiencias.length,
        },
        observacoes: {
          totalNoPeriodo: observacoesTotais.length,
          exibidos: observacoes.length,
          limitada: observacoesTotais.length > observacoes.length,
        },
      },
      inferenciaClinica: false,
      ranking: false,
      previa: true,
    };
  }

  private async resumoJogos(familiaId: string, pessoaId: string, de: Date, ate: Date) {
    const fases = await this.prisma.progressoFaseJogo.findMany({
      where: { familiaId, pessoaId, primeiraExploracaoEm: { lte: ate } },
      select: { jogoId: true, primeiraExploracaoEm: true, concluidaEm: true, nomeNaConclusao: true },
      orderBy: { primeiraExploracaoEm: "asc" },
    });
    const jogos = new Map<string, {
      id: string;
      nome: string;
      totalFases: number | null;
      concluidasAte: number;
      concluidasNoPeriodo: number;
      experimentadoNoPeriodo: boolean;
    }>();

    for (const fase of fases) {
      let jogo = jogos.get(fase.jogoId);
      if (!jogo) {
        const catalogo = CATALOGO_JOGOS.find((item) => item.id === fase.jogoId);
        jogo = {
          id: fase.jogoId,
          nome: catalogo?.nome ?? fase.nomeNaConclusao ?? "Jogo digital arquivado",
          totalFases: catalogo?.fases.length ?? null,
          concluidasAte: 0,
          concluidasNoPeriodo: 0,
          experimentadoNoPeriodo: false,
        };
        jogos.set(fase.jogoId, jogo);
      }
      if (fase.primeiraExploracaoEm >= de) jogo.experimentadoNoPeriodo = true;
      if (fase.concluidaEm && fase.concluidaEm <= ate) {
        jogo.concluidasAte += 1;
        if (fase.concluidaEm >= de) jogo.concluidasNoPeriodo += 1;
      }
    }
    return [...jogos.values()];
  }

  /**
   * Prévia do resumo com os mesmos domínios autorizados do PDF (EVO-R05/R10).
   * Não inclui anexos sensíveis.
   */
  async previaResumo(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    periodo: { de: string; ate: string },
  ) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const [podeCuidados, podeDesenvolvimento, podeExportar] = await Promise.all([
      this.autorizacoes.podeVerCuidados(
        pessoa.familiaId,
        pessoa.id,
        usuario,
      ),
      this.autorizacoes.podeVerDesenvolvimento(
        pessoa.familiaId,
        pessoa.id,
        usuario,
      ),
      this.autorizacoes.podeExportarRelatorio(
        pessoa.familiaId,
        pessoa.id,
        usuario,
      ),
    ]);

    const cuidados = podeCuidados
      ? await this.resumo(pessoaId, usuario, periodo)
      : null;
    const desenvolvimento = podeDesenvolvimento
      ? await this.resumoDesenvolvimento(pessoaId, usuario, periodo)
      : null;

    return {
      pessoaId: pessoa.id,
      pessoaNome: pessoa.nome,
      periodo: { de: periodo.de, ate: periodo.ate },
      geradoEm: new Date().toISOString(),
      dominios: {
        cuidados: podeCuidados,
        desenvolvimento: podeDesenvolvimento,
      },
      podeExportar,
      cuidados,
      desenvolvimento,
      anexosIncluidos: false,
      inferenciaClinica: false,
      avisoPrivacidade:
        "A família deve cuidar da privacidade ao compartilhar o arquivo exportado. Anexos sensíveis não entram no PDF por padrão.",
      previa: true,
    };
  }

  async gerarPdfTexto(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    periodo: { de: string; ate: string },
  ) {
    await this.exigirExportacao(pessoaId, usuario);
    const previa = await this.previaResumo(pessoaId, usuario, periodo);
    const linhas = this.linhasRelatorio(previa);
    return {
      previa,
      pdfBase64: Buffer.from(this.montarPdfCompleto(linhas)).toString("base64"),
      mimeTipo: "application/pdf",
      anexosIncluidos: false,
      paginas: Math.max(1, Math.ceil(this.quebrarLinhasPdf(linhas).length / 50)),
    };
  }

  private linhasRelatorio(previa: {
    pessoaId: string;
    pessoaNome?: string;
    periodo: { de: string; ate: string };
    geradoEm: string;
    cuidados: Awaited<ReturnType<ServicoAcompanhamento["resumo"]>> | null;
    desenvolvimento: Awaited<
      ReturnType<ServicoAcompanhamento["resumoDesenvolvimento"]>
    > | null;
    avisoPrivacidade: string;
  }): string[] {
    const nome = previa.pessoaNome?.trim() || previa.pessoaId;
    const linhas: string[] = [
      "Resumo familiar (sem inferência clínica)",
      `Pessoa: ${nome}`,
      `Período: ${this.formatarDataLocal(previa.periodo.de)} a ${this.formatarDataLocal(previa.periodo.ate)}`,
      `Gerado em: ${this.formatarQuandoLocal(previa.geradoEm)}`,
      "Anexos sensíveis: não incluídos",
      previa.avisoPrivacidade,
      "",
    ];

    if (previa.cuidados) {
      const c = previa.cuidados;
      linhas.push(
        "--- Cuidados ---",
        `${c.doses.previstos} doses previstas`,
        `${c.doses.tomadasInformadas} tomadas informadas`,
        `${c.doses.naoTomadasInformadas} não tomadas informadas`,
        `${c.doses.semConfirmacao} sem confirmação`,
        c.esclarecimento,
        "",
        "Registros informados:",
        ...(c.registros.length === 0
          ? ["- Nenhum neste período."]
          : c.registros.map(
              (r) =>
                `- ${r.medicamento}: ${this.rotuloSituacaoDose(r.situacao)} · ${this.formatarQuandoLocal(r.quando)}`,
            )),
      );
      if (c.listagens.registros.limitada) {
        linhas.push(
          `(Listagem: ${c.listagens.registros.exibidos} de ${c.listagens.registros.totalNoPeriodo} no período; totais acima cobrem o período inteiro.)`,
        );
      }
      linhas.push(
        "",
        "Consultas:",
        ...(c.consultas.length === 0
          ? ["- Nenhuma neste período."]
          : c.consultas.map(
              (x) =>
                `- ${x.especialidadeOuDescricao} · ${this.formatarQuandoLocal(x.dataHora)} (${this.rotuloStatusConsulta(x.status)})`,
            )),
      );
      if (c.listagens.consultas.limitada) {
        linhas.push(
          `(Listagem: ${c.listagens.consultas.exibidos} de ${c.listagens.consultas.totalNoPeriodo}.)`,
        );
      }
      linhas.push(
        "",
        "Exames (sem anexos embutidos):",
        ...(c.exames.length === 0
          ? ["- Nenhum neste período."]
          : c.exames.map((e) => {
              const quando =
                e.data != null
                  ? this.formatarQuandoLocal(e.data)
                  : this.formatarQuandoLocal(e.criadoEm);
              const doc = e.temDocumento
                ? " · documento disponível no app (não incluído)"
                : "";
              return `- ${e.descricao} · ${quando}${doc}`;
            })),
      );
      if (c.listagens.exames.limitada) {
        linhas.push(
          `(Listagem: ${c.listagens.exames.exibidos} de ${c.listagens.exames.totalNoPeriodo}.)`,
        );
      }
      linhas.push(
        "",
        "Observações de apoio:",
        ...(c.observacoes.length === 0
          ? ["- Nenhuma neste período."]
          : c.observacoes.map((o) => {
              const extra = (o.observacao ?? "").trim();
              return `- ${o.descricao}${extra ? ` — ${extra}` : ""} · ${this.formatarQuandoLocal(o.concluidaEm)}`;
            })),
      );
      if (c.listagens.observacoes.limitada) {
        linhas.push(
          `(Listagem: ${c.listagens.observacoes.exibidos} de ${c.listagens.observacoes.totalNoPeriodo}.)`,
        );
      }
      linhas.push(
        "",
        "Mudanças de programação:",
        ...(c.mudancasProgramacao.length === 0
          ? ["- Nenhuma neste período."]
          : c.mudancasProgramacao.map(
              (p) =>
                `- ${p.medicamento}: horários ${p.horarios} · ${this.formatarQuandoLocal(p.criadoEm)}`,
            )),
      );
      if (c.listagens.mudancasProgramacao.limitada) {
        linhas.push(
          `(Listagem: ${c.listagens.mudancasProgramacao.exibidos} de ${c.listagens.mudancasProgramacao.totalNoPeriodo}.)`,
        );
      }
      linhas.push("");
    }

    if (previa.desenvolvimento) {
      const d = previa.desenvolvimento;
      linhas.push(
        "--- Desenvolvimento ---",
        `Estrelas no período: ${d.estrelas.concedidasNoPeriodo}`,
        d.estrelas.esclarecimento,
        "",
        "Experiências:",
        ...(d.experiencias.length === 0
          ? ["- Nenhuma neste período."]
          : d.experiencias.map(
              (e) =>
                `- ${e.resultado}: ${e.nome} [${e.categoria}] (+${e.estrelasConcedidas}) · ${this.formatarQuandoLocal(e.registradoEm)}`,
            )),
      );
      if (d.listagens.experiencias.limitada) {
        linhas.push(
          `(Listagem: ${d.listagens.experiencias.exibidos} de ${d.listagens.experiencias.totalNoPeriodo}; totais de estrelas/categorias cobrem o período.)`,
        );
      }
      linhas.push(
        "",
        "Categorias:",
        ...(d.categoriasExploradas.length === 0
          ? ["- Nenhuma neste período."]
          : d.categoriasExploradas.map(
              (c) => `- ${c.categoria}: ${c.quantidade}`,
            )),
        "",
        "Observações:",
        ...(d.observacoes.length === 0
          ? ["- Nenhuma neste período."]
          : d.observacoes.map((o) => `- ${o.nome}: ${o.texto}`)),
        "",
      );
    }

    return linhas;
  }

  /** Quebra linhas longas sem truncar conteúdo (EVO-REV-04). */
  private quebrarLinhasPdf(linhas: string[], maxChars = 90): string[] {
    const saida: string[] = [];
    for (const linha of linhas) {
      const texto = linha.length === 0 ? " " : linha;
      if (texto.length <= maxChars) {
        saida.push(texto);
        continue;
      }
      let resto = texto;
      while (resto.length > maxChars) {
        let corte = resto.lastIndexOf(" ", maxChars);
        if (corte < Math.floor(maxChars * 0.5)) corte = maxChars;
        saida.push(resto.slice(0, corte).trimEnd());
        resto = resto.slice(corte).trimStart();
      }
      if (resto.length > 0) saida.push(resto);
    }
    return saida;
  }

  private escaparTextoPdf(texto: string): string {
    const mapa: Record<string, string> = {
      "\\": "\\\\",
      "(": "\\(",
      ")": "\\)",
      á: "\\341",
      à: "\\340",
      â: "\\342",
      ã: "\\343",
      ä: "\\344",
      Á: "\\301",
      À: "\\300",
      Â: "\\302",
      Ã: "\\303",
      é: "\\351",
      è: "\\350",
      ê: "\\352",
      ë: "\\353",
      É: "\\311",
      È: "\\310",
      Ê: "\\312",
      í: "\\355",
      ì: "\\354",
      î: "\\356",
      ï: "\\357",
      Í: "\\315",
      ó: "\\363",
      ò: "\\362",
      ô: "\\364",
      õ: "\\365",
      ö: "\\366",
      Ó: "\\323",
      Ô: "\\324",
      Õ: "\\325",
      ú: "\\372",
      ù: "\\371",
      û: "\\373",
      ü: "\\374",
      Ú: "\\332",
      ç: "\\347",
      Ç: "\\307",
      ñ: "\\361",
      Ñ: "\\321",
      "—": "-",
      "–": "-",
      "“": '"',
      "”": '"',
      "‘": "'",
      "’": "'",
      "…": "...",
    };
    let out = "";
    for (const ch of texto) {
      out += mapa[ch] ?? (/^[\x20-\x7E]$/.test(ch) ? ch : "?");
    }
    return out;
  }

  private montarPdfCompleto(linhasFonte: string[]): Buffer {
    const linhas = this.quebrarLinhasPdf(linhasFonte);
    const linhasPorPagina = 50;
    const paginas: string[][] = [];
    for (let i = 0; i < linhas.length; i += linhasPorPagina) {
      paginas.push(linhas.slice(i, i + linhasPorPagina));
    }
    if (paginas.length === 0) paginas.push([" "]);

    const fontObjNum = 3;
    const pagesObjNum = 2;
    const catalogObjNum = 1;
    const contentObjNums: number[] = [];
    const pageObjNums: number[] = [];
    let nextObj = 4;
    for (let p = 0; p < paginas.length; p++) {
      contentObjNums.push(nextObj++);
      pageObjNums.push(nextObj++);
    }

    const objetos = new Map<number, string>();
    objetos.set(
      catalogObjNum,
      `<< /Type /Catalog /Pages ${pagesObjNum} 0 R >>`,
    );
    objetos.set(
      pagesObjNum,
      `<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(" ")}] /Count ${paginas.length} >>`,
    );
    objetos.set(
      fontObjNum,
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    );

    for (let p = 0; p < paginas.length; p++) {
      const comandos = paginas[p]
        .map((linha, i) => {
          const y = 750 - i * 14;
          return `BT /F1 10 Tf 40 ${y} Td (${this.escaparTextoPdf(linha)}) Tj ET`;
        })
        .join("\n");
      const stream = `${comandos}\n`;
      objetos.set(
        contentObjNums[p],
        `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}endstream`,
      );
      objetos.set(
        pageObjNums[p],
        `<< /Type /Page /Parent ${pagesObjNum} 0 R /MediaBox [0 0 612 792] /Contents ${contentObjNums[p]} 0 R /Resources<< /Font<< /F1 ${fontObjNum} 0 R >> >> >>`,
      );
    }

    const ordem = [
      catalogObjNum,
      pagesObjNum,
      fontObjNum,
      ...paginas.flatMap((_, i) => [contentObjNums[i], pageObjNums[i]]),
    ];

    let corpo = "%PDF-1.4\n";
    const offsets = [0];
    for (const num of ordem) {
      offsets[num] = Buffer.byteLength(corpo, "utf8");
      corpo += `${num} 0 obj\n${objetos.get(num)}\nendobj\n`;
    }
    const startxref = Buffer.byteLength(corpo, "utf8");
    const maxObj = Math.max(...ordem);
    corpo += `xref\n0 ${maxObj + 1}\n`;
    corpo += "0000000000 65535 f \n";
    for (let i = 1; i <= maxObj; i++) {
      const off = offsets[i] ?? 0;
      corpo += `${String(off).padStart(10, "0")} 00000 n \n`;
    }
    corpo += `trailer<< /Size ${maxObj + 1} /Root ${catalogObjNum} 0 R >>\nstartxref\n${startxref}\n%%EOF`;
    return Buffer.from(corpo, "utf8");
  }

  private formatarDataLocal(valor: string) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor.trim());
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return this.formatarQuandoLocal(valor);
  }

  private formatarQuandoLocal(valor: string | Date) {
    const data = valor instanceof Date ? valor : new Date(valor);
    if (Number.isNaN(data.getTime())) return String(valor);
    return data.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  private rotuloSituacaoDose(situacao: string) {
    if (situacao === "tomou_conforme_informacao") return "informou que tomou";
    if (situacao === "informou_nao_tomou") return "informou que não tomou";
    return situacao.replaceAll("_", " ");
  }

  private rotuloStatusConsulta(status: string) {
    const mapa: Record<string, string> = {
      agendada: "agendada",
      realizada: "realizada",
      cancelada: "cancelada",
    };
    return mapa[status] ?? status.replaceAll("_", " ");
  }

  private rotuloStatusMedicamento(status: string) {
    const mapa: Record<string, string> = {
      ativo: "ativo",
      rascunho: "rascunho",
      suspenso: "suspenso",
      encerrado: "encerrado",
    };
    return mapa[status] ?? status.replaceAll("_", " ");
  }

  private formatarHorarios(horarios: unknown) {
    const lista = Array.isArray(horarios)
      ? horarios.filter((h): h is string => typeof h === "string")
      : [];
    return lista.length > 0 ? lista.join(", ") : "sem horários";
  }

  /** Data só com dia (YYYY-MM-DD) como data civil local (evita deslocamento UTC). */
  private inicioDoPeriodo(valor: string) {
    const bruto = valor.trim();
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(bruto);
    if (m) {
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0);
    }
    return new Date(bruto);
  }

  private fimDoPeriodo(valor: string) {
    const bruto = valor.trim();
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(bruto);
    if (m) {
      return new Date(
        Number(m[1]),
        Number(m[2]) - 1,
        Number(m[3]),
        23,
        59,
        59,
        999,
      );
    }
    return new Date(bruto);
  }

  private listarDiasIso(de: Date, ate: Date): string[] {
    const dias: string[] = [];
    const y = de.getFullYear();
    const m = de.getMonth();
    const d0 = de.getDate();
    const yF = ate.getFullYear();
    const mF = ate.getMonth();
    const dF = ate.getDate();
    let cursor = new Date(y, m, d0);
    const limite = new Date(yF, mF, dF);
    while (cursor <= limite) {
      const yy = cursor.getFullYear();
      const mm = String(cursor.getMonth() + 1).padStart(2, "0");
      const dd = String(cursor.getDate()).padStart(2, "0");
      dias.push(`${yy}-${mm}-${dd}`);
      cursor = new Date(yy, cursor.getMonth(), cursor.getDate() + 1);
    }
    return dias;
  }

  private async exigirVisao(pessoaId: string, usuario: UsuarioAutenticado) {
    return (await this.obterVisao(pessoaId, usuario)).pessoa;
  }

  private async obterVisao(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id: pessoaId } });
    if (!pessoa || pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new NotFoundException("Pessoa não encontrada.");
    }
    const [cuidados, desenvolvimento] = await Promise.all([
      this.autorizacoes.podeVerCuidados(
        pessoa.familiaId,
        pessoa.id,
        usuario,
      ),
      this.autorizacoes.podeVerDesenvolvimento(
        pessoa.familiaId,
        pessoa.id,
        usuario,
      ),
    ]);
    if (!cuidados && !desenvolvimento) {
      throw new ForbiddenException("Acesso negado ao histórico.");
    }
    return { pessoa, cuidados, desenvolvimento };
  }

  private async exigirExportacao(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const pode = await this.autorizacoes.podeExportarRelatorio(
      pessoa.familiaId,
      pessoa.id,
      usuario,
    );
    if (!pode) {
      throw new ForbiddenException(
        "Sem permissão para exportar o PDF completo desta pessoa.",
      );
    }
    return pessoa;
  }
}
