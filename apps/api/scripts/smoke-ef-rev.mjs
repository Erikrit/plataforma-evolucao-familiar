/** Smoke EVO-REV: totais integros, PDF multipágina, podeExportar, observações. */
import {
  garantirResponsavelCuidados,
  garantirResponsavelDesenvolvimento,
  resolverPessoa,
  IDS_SEED,
} from "./lib-authz-smoke.mjs";
import { randomUUID } from "node:crypto";

const base = process.env.API_URL ?? "http://localhost:3001";
const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";

async function json(r) {
  const t = await r.text();
  try {
    return { status: r.status, corpo: JSON.parse(t) };
  } catch {
    return { status: r.status, corpo: t };
  }
}

async function login(email, senha) {
  const r = await fetch(`${base}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const d = await json(r);
  if (r.status >= 300) throw new Error(`login: ${JSON.stringify(d.corpo)}`);
  return d.corpo;
}

function isoOffset(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function decodificarPdf(base64) {
  return Buffer.from(base64, "base64").toString("latin1");
}

const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

try {
  const admin = await login(emailAdmin, senhaAdmin);
  const familiaId = admin.usuario.pessoa.familiaId;
  const h = {
    "content-type": "application/json",
    "x-sessao-token": admin.token,
  };

  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Helena",
  });
  const laurinha = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });

  await garantirResponsavelCuidados(
    base,
    h,
    familiaId,
    admin.usuario.id,
    vovo.id,
  );
  await garantirResponsavelDesenvolvimento(
    base,
    h,
    familiaId,
    admin.usuario.id,
    laurinha.id,
  );

  const de70 = isoOffset(-69);
  const ate = isoOffset(0);

  const med = await json(
    await fetch(`${base}/pessoas/${vovo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `EF-REV med ${Date.now()}`,
        horarios: ["08:00"],
        primeiroHorario: "08:00",
        dosesPorDia: 1,
        duracaoTipo: "continua",
        horariosConferidos: true,
        ativar: true,
      }),
    }),
  );
  const medicamentoId = med.corpo?.id;
  if (!medicamentoId) throw new Error(`sem medicamento: ${JSON.stringify(med.corpo)}`);

  // Retroage vigência para cobrir >62 dias (EVO-REV-05).
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    await prisma.programacaoMedicamento.updateMany({
      where: { medicamentoId },
      data: { vigenciaInicio: new Date(`${de70}T00:00:00.000`) },
    });
  } finally {
    await prisma.$disconnect();
  }

  await json(
    await fetch(`${base}/pessoas/${vovo.id}/atividades-apoio`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        descricao: `Observação apoio EF-REV ${Date.now()}`,
        observacao: "detalhe apoio",
      }),
    }),
  );

  const resumoLongo = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/resumo-cuidados?de=${de70}&ate=${ate}`,
      { headers: h },
    ),
  );
  const previstos = resumoLongo.corpo?.doses?.previstos;
  reg(
    "EVO-REV-05-totais-periodo-gt-62",
    resumoLongo.status < 300 &&
      typeof previstos === "number" &&
      previstos >= 70 &&
      resumoLongo.corpo?.diasNoPeriodo >= 70 &&
      Array.isArray(resumoLongo.corpo?.observacoes) &&
      resumoLongo.corpo.observacoes.length >= 1 &&
      Array.isArray(resumoLongo.corpo?.mudancasProgramacao),
    {
      status: resumoLongo.status,
      previstos,
      dias: resumoLongo.corpo?.diasNoPeriodo,
      obs: resumoLongo.corpo?.observacoes?.length,
      prog: resumoLongo.corpo?.mudancasProgramacao?.length,
    },
  );

  const textoLongo =
    "Linha longa de observação com acentos: ação, coração, informação, situação. ".repeat(
      4,
    );
  for (let i = 0; i < 30; i += 1) {
    const criado = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          nome: `EF-REV exp ${i} ${Date.now()}`,
          dificuldade: "simples",
        }),
      }),
    );
    const desafioId = criado.corpo?.id;
    if (!desafioId) throw new Error("sem desafio");
    await json(
      await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          desafioId,
          resultado: "concluiu",
          observacao: `${textoLongo} #${i}`,
          execucaoChave: `smoke-ef-rev-${randomUUID()}`,
        }),
      }),
    );
  }

  const previa = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/resumo-previa?de=${ate}&ate=${ate}`,
      { headers: h },
    ),
  );
  reg(
    "EVO-REV-06-podeExportar-previa",
    previa.status < 300 &&
      previa.corpo?.podeExportar === true &&
      typeof previa.corpo?.pessoaNome === "string" &&
      previa.corpo.pessoaNome.length > 0,
    {
      status: previa.status,
      podeExportar: previa.corpo?.podeExportar,
      pessoaNome: previa.corpo?.pessoaNome,
    },
  );

  const pdf = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/relatorio.pdf?de=${ate}&ate=${ate}`,
      { headers: h },
    ),
  );
  const pdfTexto = typeof pdf.corpo?.pdfBase64 === "string"
    ? decodificarPdf(pdf.corpo.pdfBase64)
    : "";
  const countPages = (pdfTexto.match(/\/Type\s*\/Page[^s]/g) || []).length;
  const linhasStream = (pdfTexto.match(/Tj ET/g) || []).length;
  reg(
    "EVO-REV-04-pdf-multipagina-completo",
    pdf.status < 300 &&
      pdf.corpo?.previa?.pessoaId === laurinha.id &&
      (pdf.corpo?.paginas ?? 0) >= 2 &&
      countPages >= 2 &&
      linhasStream > 55 &&
      pdfTexto.includes("WinAnsiEncoding"),
    {
      status: pdf.status,
      paginasCampo: pdf.corpo?.paginas,
      countPages,
      linhasStream,
    },
  );

  const mesmaSelecao =
    JSON.stringify(pdf.corpo?.previa?.desenvolvimento?.experiencias?.length) ===
      JSON.stringify(previa.corpo?.desenvolvimento?.experiencias?.length) &&
    pdf.corpo?.previa?.dominios?.desenvolvimento ===
      previa.corpo?.dominios?.desenvolvimento;
  reg("EVO-REV-03-previa-igual-pdf", mesmaSelecao, {
    previaN: previa.corpo?.desenvolvimento?.experiencias?.length,
    pdfN: pdf.corpo?.previa?.desenvolvimento?.experiencias?.length,
  });

  const pessoa = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas/${laurinha.id}`, {
      headers: h,
    }),
  );
  reg(
    "EVO-REV-06-podeExportar-pessoa",
    pessoa.status < 300 && pessoa.corpo?.podeExportar === true,
    { status: pessoa.status, podeExportar: pessoa.corpo?.podeExportar },
  );

  const falhas = resultados.filter((r) => !r.ok);
  console.log(JSON.stringify({ ok: falhas.length === 0, resultados }, null, 2));
  process.exit(falhas.length === 0 ? 0 : 1);
} catch (e) {
  console.error(e);
  console.log(JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2));
  process.exit(1);
}
