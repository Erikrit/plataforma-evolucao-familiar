import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";
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
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const [podeCuidados, podeDesenvolvimento, podeAnexos] = await Promise.all([
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
      this.autorizacoes.podeConsultarAnexosCuidados(
        pessoa.familiaId,
        pessoa.id,
        usuario,
      ),
    ]);
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
    };

    const eventos: EventoHistorico[] = [];

    if (podeCuidados) {
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
        })),
        ...programacoes.map((p) => ({
          tipo: "programacao",
          dominio: "cuidados" as const,
          quando: p.criadoEm,
          resumo: `${p.medicamento.nome}: horários ${this.formatarHorarios(p.horarios)}`,
          origemId: p.id,
        })),
        ...consultas.map((c) => ({
          tipo: "consulta",
          dominio: "cuidados" as const,
          quando: c.dataHora,
          resumo: `${c.especialidadeOuDescricao} (${this.rotuloStatusConsulta(c.status)})`,
          origemId: c.id,
        })),
        ...exames.map((e) => ({
          tipo: "exame",
          dominio: "cuidados" as const,
          quando: e.criadoEm,
          resumo: e.descricao,
          origemId: e.id,
          ...(podeAnexos && e.anexoId ? { anexoId: e.anexoId } : {}),
        })),
        ...atividades.map((a) => ({
          tipo: "atividade_apoio",
          dominio: "cuidados" as const,
          quando: a.concluidaEm,
          resumo: a.descricao,
          origemId: a.id,
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

    if (podeDesenvolvimento) {
      const [participacoes, resgates] = await Promise.all([
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
      ]);

      eventos.push(
        ...participacoes.map((p) => {
          const verbo =
            p.resultado === "concluiu" ? "Concluiu" : "Participou";
          const obs = p.observacao ? ` — ${p.observacao}` : "";
          return {
            tipo: p.substituiId
              ? "correcao_participacao"
              : "participacao",
            dominio: "desenvolvimento" as const,
            quando: p.registradoEm,
            resumo: `${verbo}: ${p.desafio.nome} (+${p.estrelasConcedidas} estrelas)${obs}`,
            origemId: p.id,
            versaoAtiva: p.versaoAtiva,
            categoria: p.desafio.categoria,
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
    }

    const filtroDominio = (periodo?.dominio ?? "").trim().toLowerCase();
    const eventosFiltrados =
      filtroDominio === "cuidados" || filtroDominio === "desenvolvimento"
        ? eventos.filter((e) => e.dominio === filtroDominio)
        : eventos;

    eventosFiltrados.sort((a, b) => b.quando.getTime() - a.quando.getTime());

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
      eventos: eventosFiltrados,
    };
  }

  async lembretesDerivados(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    dataRef?: string,
  ) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
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
        itens.push({
          tipo: "medicamento",
          medicamentoId: med.id,
          titulo: med.nome,
          horario,
          estado: registro
            ? registro.situacao
            : "sem_confirmacao_apenas_informativo",
          insistente: false,
        });
      }
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

    const de = this.inicioDoPeriodo(periodo.de);
    const ate = this.fimDoPeriodo(periodo.ate);
    if (Number.isNaN(de.getTime()) || Number.isNaN(ate.getTime()) || de > ate) {
      throw new BadRequestException("Período inválido para o resumo.");
    }

    const dias = this.listarDiasIso(de, ate, 62);
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

    let previstos = 0;
    let tomadas = 0;
    let naoTomadas = 0;
    let semConfirmacao = 0;

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
          previstos += 1;
          const chave = chaveOcorrencia(med.id, dia, horario);
          const registro = await this.prisma.registroDose.findFirst({
            where: { ocorrenciaChave: chave, versaoAtiva: true },
          });
          if (!registro) {
            semConfirmacao += 1;
          } else if (registro.situacao === "tomou_conforme_informacao") {
            tomadas += 1;
          } else if (registro.situacao === "informou_nao_tomou") {
            naoTomadas += 1;
          } else {
            semConfirmacao += 1;
          }
        }
      }
    }

    const doses = await this.prisma.registroDose.findMany({
      where: {
        medicamento: { pessoaId: pessoa.id },
        versaoAtiva: true,
        registradoEm: { gte: de, lte: ate },
      },
      include: { medicamento: { select: { nome: true } } },
      orderBy: { registradoEm: "desc" },
      take: 50,
    });

    const consultas = await this.prisma.consulta.findMany({
      where: { pessoaId: pessoa.id, dataHora: { gte: de, lte: ate } },
      orderBy: { dataHora: "desc" },
      take: 20,
    });
    const exames = await this.prisma.exame.findMany({
      where: { pessoaId: pessoa.id, criadoEm: { gte: de, lte: ate } },
      orderBy: { criadoEm: "desc" },
      take: 20,
    });

    return {
      pessoaId: pessoa.id,
      tipo: "cuidados",
      periodo: { de: periodo.de, ate: periodo.ate },
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
      consultas: consultas.map((c) => ({
        id: c.id,
        especialidadeOuDescricao: c.especialidadeOuDescricao,
        dataHora: c.dataHora,
        status: c.status,
      })),
      exames: exames.map((e) => ({
        id: e.id,
        descricao: e.descricao,
        criadoEm: e.criadoEm,
      })),
      inferenciaClinica: false,
      previa: true,
    };
  }

  async resumoDesenvolvimento(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    periodo: { de: string; ate: string },
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

    const participacoes = await this.prisma.participacaoDesafio.findMany({
      where: {
        pessoaId: pessoa.id,
        versaoAtiva: true,
        registradoEm: { gte: de, lte: ate },
      },
      orderBy: { registradoEm: "desc" },
      take: 40,
      include: {
        desafio: {
          select: { nome: true, categoria: true, origem: true },
        },
      },
    });

    const experiencias = participacoes.map((p) => {
      const categoriaBruta = (p.desafio.categoria ?? "").trim();
      const categoria =
        categoriaBruta.length > 0 ? categoriaBruta : "nao_classificada";
      return {
        id: p.id,
        nome: p.desafio.nome,
        categoria,
        origem: p.desafio.origem,
        resultado: p.resultado,
        estrelasConcedidas: p.estrelasConcedidas,
        observacao: p.observacao,
        registradoEm: p.registradoEm,
      };
    });

    const contagemCategorias = new Map<string, number>();
    for (const e of experiencias) {
      contagemCategorias.set(
        e.categoria,
        (contagemCategorias.get(e.categoria) ?? 0) + 1,
      );
    }
    const categoriasExploradas = [...contagemCategorias.entries()]
      .map(([categoria, quantidade]) => ({ categoria, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade || a.categoria.localeCompare(b.categoria));

    const estrelasConcedidasNoPeriodo = experiencias.reduce(
      (acc, e) => acc + e.estrelasConcedidas,
      0,
    );

    const observacoes = experiencias
      .filter((e) => (e.observacao ?? "").trim().length > 0)
      .map((e) => ({
        experienciaId: e.id,
        nome: e.nome,
        texto: e.observacao as string,
        registradoEm: e.registradoEm,
      }));

    return {
      pessoaId: pessoa.id,
      tipo: "desenvolvimento",
      periodo: { de: periodo.de, ate: periodo.ate },
      experiencias,
      categoriasExploradas,
      estrelas: {
        concedidasNoPeriodo: estrelasConcedidasNoPeriodo,
        esclarecimento:
          "Estrelas são um incentivo lúdico da família — não medem inteligência, nível clínico nem comparam crianças.",
      },
      observacoes,
      inferenciaClinica: false,
      ranking: false,
      previa: true,
    };
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
    const [podeCuidados, podeDesenvolvimento] = await Promise.all([
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

    const cuidados = podeCuidados
      ? await this.resumo(pessoaId, usuario, periodo)
      : null;
    const desenvolvimento = podeDesenvolvimento
      ? await this.resumoDesenvolvimento(pessoaId, usuario, periodo)
      : null;

    return {
      pessoaId: pessoa.id,
      periodo: { de: periodo.de, ate: periodo.ate },
      geradoEm: new Date().toISOString(),
      dominios: {
        cuidados: podeCuidados,
        desenvolvimento: podeDesenvolvimento,
      },
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
    const texto = linhas.join("\n");
    return {
      previa,
      pdfBase64: Buffer.from(this.montarPdfMinimo(texto)).toString("base64"),
      mimeTipo: "application/pdf",
      anexosIncluidos: false,
    };
  }

  private linhasRelatorio(previa: {
    pessoaId: string;
    periodo: { de: string; ate: string };
    geradoEm: string;
    cuidados: Awaited<ReturnType<ServicoAcompanhamento["resumo"]>> | null;
    desenvolvimento: Awaited<
      ReturnType<ServicoAcompanhamento["resumoDesenvolvimento"]>
    > | null;
    avisoPrivacidade: string;
  }): string[] {
    const linhas: string[] = [
      "Resumo familiar (sem inferencia clinica)",
      `Pessoa: ${previa.pessoaId}`,
      `Periodo: ${previa.periodo.de} a ${previa.periodo.ate}`,
      `Gerado em: ${previa.geradoEm}`,
      "Anexos sensiveis: nao incluidos",
      previa.avisoPrivacidade,
      "",
    ];

    if (previa.cuidados) {
      const c = previa.cuidados;
      linhas.push(
        "--- Cuidados ---",
        `Previstos: ${c.doses.previstos}`,
        `Tomadas informadas: ${c.doses.tomadasInformadas}`,
        `Nao tomadas informadas: ${c.doses.naoTomadasInformadas}`,
        `Sem confirmacao: ${c.doses.semConfirmacao}`,
        c.esclarecimento,
        "",
        "Registros:",
        ...c.registros.map(
          (r) =>
            `- ${r.medicamento}: ${r.situacao} @ ${new Date(r.quando).toISOString()}`,
        ),
        "",
        "Consultas:",
        ...c.consultas.map(
          (x) =>
            `- ${x.especialidadeOuDescricao} ${new Date(x.dataHora).toISOString()} (${x.status})`,
        ),
        "",
        "Exames (sem anexos):",
        ...c.exames.map((e) => `- ${e.descricao}`),
        "",
      );
    }

    if (previa.desenvolvimento) {
      const d = previa.desenvolvimento;
      linhas.push(
        "--- Desenvolvimento ---",
        `Estrelas no periodo: ${d.estrelas.concedidasNoPeriodo}`,
        d.estrelas.esclarecimento,
        "",
        "Experiencias:",
        ...d.experiencias.map(
          (e) =>
            `- ${e.resultado}: ${e.nome} [${e.categoria}] (+${e.estrelasConcedidas})`,
        ),
        "",
        "Categorias:",
        ...d.categoriasExploradas.map(
          (c) => `- ${c.categoria}: ${c.quantidade}`,
        ),
        "",
        "Observacoes:",
        ...d.observacoes.map((o) => `- ${o.nome}: ${o.texto}`),
        "",
      );
    }

    return linhas;
  }

  private montarPdfMinimo(texto: string): Buffer {
    const escapado = texto
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .split("\n")
      .slice(0, 55)
      .map((linha, i) => `BT /F1 10 Tf 40 ${750 - i * 14} Td (${linha.slice(0, 90)}) Tj ET`)
      .join("\n");
    const stream = escapado;
    const objs = [
      "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj",
      "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj",
      "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj",
      `4 0 obj<< /Length ${stream.length} >>stream\n${stream}\nendstream endobj`,
      "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj",
    ];
    let corpo = "%PDF-1.4\n";
    const offsets = [0];
    for (const o of objs) {
      offsets.push(Buffer.byteLength(corpo, "utf8"));
      corpo += o + "\n";
    }
    const xref = offsets.length - 1;
    const startxref = Buffer.byteLength(corpo, "utf8");
    corpo += `xref\n0 ${xref + 1}\n`;
    corpo += "0000000000 65535 f \n";
    for (let i = 1; i <= xref; i++) {
      corpo += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }
    corpo += `trailer<< /Size ${xref + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;
    return Buffer.from(corpo, "utf8");
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

  private listarDiasIso(de: Date, ate: Date, maxDias: number): string[] {
    const dias: string[] = [];
    const y = de.getFullYear();
    const m = de.getMonth();
    const d0 = de.getDate();
    const yF = ate.getFullYear();
    const mF = ate.getMonth();
    const dF = ate.getDate();
    let cursor = new Date(y, m, d0);
    const limite = new Date(yF, mF, dF);
    while (cursor <= limite && dias.length < maxDias) {
      const yy = cursor.getFullYear();
      const mm = String(cursor.getMonth() + 1).padStart(2, "0");
      const dd = String(cursor.getDate()).padStart(2, "0");
      dias.push(`${yy}-${mm}-${dd}`);
      cursor = new Date(yy, cursor.getMonth(), cursor.getDate() + 1);
    }
    return dias;
  }

  private async exigirVisao(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id: pessoaId } });
    if (!pessoa) throw new NotFoundException("Pessoa não encontrada.");
    if (pessoa.familiaId !== usuario.pessoa.familiaId) {
      throw new ForbiddenException("Pessoa fora da família.");
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
    return pessoa;
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
        "Colaboradora não exporta PDF completo por padrão.",
      );
    }
    return pessoa;
  }
}
