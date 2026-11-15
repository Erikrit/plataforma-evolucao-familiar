import {
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
    periodo?: { de?: string; ate?: string },
  ) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const de = periodo?.de ? new Date(periodo.de) : new Date(0);
    const ate = periodo?.ate ? new Date(periodo.ate) : new Date();

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

    const eventos = [
      ...doses.map((d) => ({
        tipo: d.substituiId ? "correcao_dose" : "registro_dose",
        quando: d.registradoEm,
        resumo: `${d.medicamento.nome}: ${d.situacao}`,
        origemId: d.id,
        versaoAtiva: d.versaoAtiva,
      })),
      ...programacoes.map((p) => ({
        tipo: "programacao",
        quando: p.criadoEm,
        resumo: `Programação ${p.medicamento.nome}: ${JSON.stringify(p.horarios)}`,
        origemId: p.id,
      })),
      ...consultas.map((c) => ({
        tipo: "consulta",
        quando: c.dataHora,
        resumo: `${c.especialidadeOuDescricao} (${c.status})`,
        origemId: c.id,
      })),
      ...exames.map((e) => ({
        tipo: "exame",
        quando: e.criadoEm,
        resumo: e.descricao,
        origemId: e.id,
        anexoId: e.anexoId,
      })),
      ...atividades.map((a) => ({
        tipo: "atividade_apoio",
        quando: a.concluidaEm,
        resumo: a.descricao,
        origemId: a.id,
      })),
      ...medicamentos.map((m) => ({
        tipo: m.encerradoEm ? "encerramento" : "suspensao",
        quando: (m.encerradoEm ?? m.suspensoEm)!,
        resumo: `${m.nome} → ${m.status}`,
        origemId: m.id,
      })),
    ].sort((a, b) => b.quando.getTime() - a.quando.getTime());

    return {
      pessoaId: pessoa.id,
      derivadoDeRegistrosOrigem: true,
      eventos,
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
    const pessoa = await this.exigirExportacao(pessoaId, usuario);
    const de = new Date(periodo.de);
    const ate = new Date(periodo.ate);

    const doses = await this.prisma.registroDose.findMany({
      where: {
        medicamento: { pessoaId: pessoa.id },
        versaoAtiva: true,
        registradoEm: { gte: de, lte: ate },
      },
      include: { medicamento: { select: { nome: true } } },
    });

    const contagem = {
      tomadas: doses.filter((d) => d.situacao === "tomou_conforme_informacao")
        .length,
      naoTomadas: doses.filter((d) => d.situacao === "informou_nao_tomou")
        .length,
      naoConfirmadas: 0,
    };

    const consultas = await this.prisma.consulta.findMany({
      where: { pessoaId: pessoa.id, dataHora: { gte: de, lte: ate } },
    });
    const exames = await this.prisma.exame.findMany({
      where: { pessoaId: pessoa.id, criadoEm: { gte: de, lte: ate } },
    });

    return {
      pessoaId: pessoa.id,
      periodo: { de: periodo.de, ate: periodo.ate },
      doses: contagem,
      registros: doses.map((d) => ({
        medicamento: d.medicamento.nome,
        situacao: d.situacao,
        quando: d.registradoEm,
      })),
      consultas,
      exames,
      inferenciaClinica: false,
      previa: true,
    };
  }

  async gerarPdfTexto(
    pessoaId: string,
    usuario: UsuarioAutenticado,
    periodo: { de: string; ate: string },
  ) {
    const dados = await this.resumo(pessoaId, usuario, periodo);
    const linhas = [
      "Relatorio de cuidados (sem inferencia clinica)",
      `Pessoa: ${dados.pessoaId}`,
      `Periodo: ${periodo.de} a ${periodo.ate}`,
      `Tomadas informadas: ${dados.doses.tomadas}`,
      `Nao tomadas informadas: ${dados.doses.naoTomadas}`,
      "",
      "Registros:",
      ...dados.registros.map(
        (r) => `- ${r.medicamento}: ${r.situacao} @ ${r.quando.toISOString()}`,
      ),
      "",
      "Consultas:",
      ...dados.consultas.map(
        (c) =>
          `- ${c.especialidadeOuDescricao} ${c.dataHora.toISOString()} (${c.status})`,
      ),
      "",
      "Exames:",
      ...dados.exames.map((e) => `- ${e.descricao}`),
    ];
    const texto = linhas.join("\n");
    return {
      previa: dados,
      pdfBase64: Buffer.from(this.montarPdfMinimo(texto)).toString("base64"),
      mimeTipo: "application/pdf",
    };
  }

  private montarPdfMinimo(texto: string): Buffer {
    const escapado = texto
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .split("\n")
      .slice(0, 40)
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
    if (!pode) throw new ForbiddenException("Acesso negado ao histórico.");
    return pessoa;
  }

  private async exigirExportacao(pessoaId: string, usuario: UsuarioAutenticado) {
    const pessoa = await this.exigirVisao(pessoaId, usuario);
    const pode = await this.autorizacoes.podeExportarRelatorioCuidados(
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
