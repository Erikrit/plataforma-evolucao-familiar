/**
 * Diagnóstico EST-03: isolamento Histórico/Resumo/PDF, anexos, paridade prévia/PDF, cache.
 * Dados fictícios; requer API em API_URL.
 */
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";

const base = (process.env.API_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const prisma = new PrismaClient();
const stamp = Date.now().toString(36);
const resultados = [];

function reg(nome, ok, detalhe) {
  resultados.push({ nome, ok: Boolean(ok), detalhe });
}

async function json(res) {
  const bruto = await res.text();
  let corpo = null;
  try {
    corpo = bruto ? JSON.parse(bruto) : null;
  } catch {
    corpo = null;
  }
  return { status: res.status, corpo, bruto, headers: res.headers };
}

function headers(token) {
  return {
    "content-type": "application/json",
    "x-sessao-token": token,
  };
}

async function login(email, senha, familiaSlug) {
  return json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, senha, familiaSlug }),
    }),
  );
}

function isoDia(offset = 0) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function cachePrivado(res) {
  const v = String(res.headers.get("cache-control") ?? "").toLowerCase();
  return v.includes("private") && v.includes("no-store");
}

try {
  const slugA = `est03-a-${stamp}`;
  const slugB = `est03-b-${stamp}`;
  const emailA = `admin-a-${stamp}@example.test`;
  const emailB = `admin-b-${stamp}@example.test`;
  const emailColab = `colab-${stamp}@example.test`;
  const senhaA = `Est03-A-${stamp}`;
  const senhaB = `Est03-B-${stamp}`;
  const senhaColab = `Est03-C-${stamp}`;

  const famA = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `EST03 A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Admin A ${stamp}`,
    emailAdmin: emailA,
    senhaAdmin: senhaA,
  });
  const famB = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `EST03 B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Admin B ${stamp}`,
    emailAdmin: emailB,
    senhaAdmin: senhaB,
  });

  const sessA = await login(emailA, senhaA, slugA);
  const sessB = await login(emailB, senhaB, slugB);
  const hA = headers(sessA.corpo.token);
  const hB = headers(sessB.corpo.token);
  reg("login-admins", sessA.status < 300 && sessB.status < 300, {
    a: sessA.status,
    b: sessB.status,
  });

  const alvoA = await json(
    await fetch(`${base}/familias/${famA.familia.id}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Alvo A ${stamp}` }),
    }),
  );
  const outroA = await json(
    await fetch(`${base}/familias/${famA.familia.id}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Outro A ${stamp}` }),
    }),
  );
  const pessoaAlvoId = alvoA.corpo.id;
  const pessoaOutroId = outroA.corpo.id;

  await json(
    await fetch(`${base}/familias/${famA.familia.id}/autorizacoes`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        usuarioId: famA.usuario.id,
        responsabilidade: "responsavel_cuidados",
        pessoaAlvoId,
      }),
    }),
  );
  await json(
    await fetch(`${base}/familias/${famA.familia.id}/autorizacoes`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        usuarioId: famA.usuario.id,
        responsabilidade: "responsavel_desenvolvimento",
        // M01 §16: data fictícia exigida para Desenvolvimento.
        dataNascimentoAlvo: "2018-05-10",
        pessoaAlvoId,
      }),
    }),
  );

  const marca = `EST03-MARK-${stamp}`;
  const anexo = await json(
    await fetch(`${base}/familias/${famA.familia.id}/anexos`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        pessoaId: pessoaAlvoId,
        nomeArquivo: `exame-${stamp}.pdf`,
        mimeTipo: "application/pdf",
        conteudoBase64: Buffer.from(
          `%PDF-1.4\n${marca}\n%%EOF`,
          "utf8",
        ).toString("base64"),
      }),
    }),
  );
  await json(
    await fetch(`${base}/pessoas/${pessoaAlvoId}/exames`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        categoria: "sangue",
        descricao: `Exame EST03 ${stamp}`,
        anexoId: anexo.corpo.id,
      }),
    }),
  );

  const de = isoDia(-3);
  const ate = isoDia(0);

  const histA = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/historico?de=${de}&ate=${ate}`,
      { headers: hA },
    ),
  );
  const exameHist = (histA.corpo?.eventos ?? []).find((e) => e.tipo === "exame");
  reg(
    "historico-origem-exame",
    histA.status === 200 &&
      exameHist &&
      exameHist.anexoId === anexo.corpo.id &&
      String(exameHist.resumo).includes("Exame EST03"),
    {
      status: histA.status,
      eventos: (histA.corpo?.eventos ?? []).length,
      anexoId: exameHist?.anexoId ?? null,
    },
  );
  reg("historico-cache-privado", cachePrivado(histA), {
    cache: histA.headers.get("cache-control"),
  });

  const histCruzado = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/historico?de=${de}&ate=${ate}`,
      { headers: hB },
    ),
  );
  reg(
    "isolamento-historico-familia",
    histCruzado.status === 404 || histCruzado.status === 403,
    { status: histCruzado.status },
  );

  const pessoaColab = await json(
    await fetch(`${base}/familias/${famA.familia.id}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Colab EST03 ${stamp}` }),
    }),
  );
  const convite = await json(
    await fetch(`${base}/familias/${famA.familia.id}/convites`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        email: emailColab,
        nomeConvidado: `Colab EST03 ${stamp}`,
        pessoaContaId: pessoaColab.corpo.id,
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId,
      }),
    }),
  );
  await json(
    await fetch(
      `${base}/convites/${encodeURIComponent(convite.corpo.token)}/ativar`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ senha: senhaColab, familiaSlug: slugA }),
      },
    ),
  );
  const sessColab = await login(emailColab, senhaColab, slugA);
  const hColab = headers(sessColab.corpo.token);

  const histColabAlvo = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/historico?de=${de}&ate=${ate}`,
      { headers: hColab },
    ),
  );
  const exameColab = (histColabAlvo.corpo?.eventos ?? []).find(
    (e) => e.tipo === "exame",
  );
  reg(
    "colab-historico-sem-anexoId",
    histColabAlvo.status === 200 &&
      exameColab &&
      exameColab.anexoId == null,
    {
      status: histColabAlvo.status,
      anexoId: exameColab?.anexoId ?? null,
      detalhe: exameColab?.detalhe ?? null,
    },
  );

  const histColabOutro = await json(
    await fetch(
      `${base}/pessoas/${pessoaOutroId}/historico?de=${de}&ate=${ate}`,
      { headers: hColab },
    ),
  );
  reg(
    "isolamento-historico-pessoa",
    histColabOutro.status === 403 || histColabOutro.status === 404,
    { status: histColabOutro.status },
  );

  const previa = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/resumo-previa?de=${de}&ate=${ate}`,
      { headers: hA },
    ),
  );
  const pdf = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/relatorio.pdf?de=${de}&ate=${ate}`,
      { headers: hA },
    ),
  );
  const resumo = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/resumo-cuidados?de=${de}&ate=${ate}`,
      { headers: hA },
    ),
  );

  reg("previa-cache-privado", cachePrivado(previa), {
    cache: previa.headers.get("cache-control"),
  });
  reg("pdf-cache-privado", cachePrivado(pdf), {
    cache: pdf.headers.get("cache-control"),
  });
  reg("resumo-cuidados-cache-privado", cachePrivado(resumo), {
    cache: resumo.headers.get("cache-control"),
  });

  const pdfBin = pdf.corpo?.pdfBase64
    ? Buffer.from(pdf.corpo.pdfBase64, "base64")
    : Buffer.alloc(0);
  const pdfTxt = pdfBin.toString("utf8") + pdfBin.toString("latin1");
  const vazouMarca = pdfTxt.includes(marca);
  const examesPrevia = previa.corpo?.cuidados?.exames ?? [];
  const examesResumo = resumo.corpo?.exames ?? [];
  const temExamePrevia = examesPrevia.some((e) =>
    String(e.descricao).includes("Exame EST03"),
  );
  const temExameResumo = examesResumo.some((e) =>
    String(e.descricao).includes("Exame EST03"),
  );
  const temExamePdf = pdfTxt.includes(`Exame EST03 ${stamp}`);
  const docFlag =
    examesPrevia.find((e) => String(e.descricao).includes("Exame EST03"))
      ?.temDocumento === true;

  reg(
    "paridade-origem-resumo-previa-pdf",
    previa.status === 200 &&
      pdf.status === 200 &&
      resumo.status === 200 &&
      temExamePrevia &&
      temExameResumo &&
      temExamePdf &&
      docFlag === true &&
      previa.corpo?.anexosIncluidos === false &&
      pdf.corpo?.anexosIncluidos === false &&
      !vazouMarca,
    {
      previa: previa.status,
      pdf: pdf.status,
      resumo: resumo.status,
      temExamePrevia,
      temExameResumo,
      temExamePdf,
      docFlag,
      anexosIncluidos: {
        previa: previa.corpo?.anexosIncluidos,
        pdf: pdf.corpo?.anexosIncluidos,
      },
      vazouMarca,
    },
  );

  const pdfColab = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/relatorio.pdf?de=${de}&ate=${ate}`,
      { headers: hColab },
    ),
  );
  reg(
    "colab-sem-export-pdf",
    pdfColab.status === 403 || pdfColab.status === 404,
    { status: pdfColab.status },
  );

  const downloadColab = await json(
    await fetch(`${base}/anexos/${anexo.corpo.id}`, { headers: hColab }),
  );
  reg(
    "colab-sem-download-anexo",
    downloadColab.status === 403 || downloadColab.status === 404,
    { status: downloadColab.status },
  );

  const downloadCruzado = await json(
    await fetch(`${base}/anexos/${anexo.corpo.id}`, { headers: hB }),
  );
  reg(
    "isolamento-anexo-familia",
    downloadCruzado.status === 403 || downloadCruzado.status === 404,
    { status: downloadCruzado.status },
  );

  const resumoColab = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/resumo-cuidados?de=${de}&ate=${ate}`,
      { headers: hColab },
    ),
  );
  const previaColab = await json(
    await fetch(
      `${base}/pessoas/${pessoaAlvoId}/resumo-previa?de=${de}&ate=${ate}`,
      { headers: hColab },
    ),
  );
  const exameResumoColab = (resumoColab.corpo?.exames ?? []).find((e) =>
    String(e.descricao).includes("Exame EST03"),
  );
  const examePreviaColab = (previaColab.corpo?.cuidados?.exames ?? []).find(
    (e) => String(e.descricao).includes("Exame EST03"),
  );
  reg(
    "colab-resumo-sem-flag-documento",
    resumoColab.status === 200 &&
      exameResumoColab &&
      exameResumoColab.temDocumento === false,
    {
      status: resumoColab.status,
      temDocumento: exameResumoColab?.temDocumento,
    },
  );
  reg(
    "colab-previa-sem-flag-documento",
    previaColab.status === 200 &&
      examePreviaColab &&
      examePreviaColab.temDocumento === false,
    {
      status: previaColab.status,
      temDocumento: examePreviaColab?.temDocumento,
    },
  );

  for (const r of resultados) {
    console.log(
      `${r.ok ? "PASS" : "FAIL"} ${r.nome}${
        r.detalhe ? ` — ${JSON.stringify(r.detalhe)}` : ""
      }`,
    );
  }
  const falhas = resultados.filter((r) => !r.ok);
  if (falhas.length) {
    console.error(`\nsmoke-est-03-docs: ${falhas.length} falha(s)`);
    process.exitCode = 1;
  } else {
    console.log(`\nsmoke-est-03-docs: ${resultados.length} checagens OK`);
  }
} catch (e) {
  console.error("smoke-est-03-docs erro fatal:", e);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
