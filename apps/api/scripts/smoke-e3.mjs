/**
 * Smoke DEM-E3: download autorizado de exames + resumo por área/PDF (E3-EX / E3-RES).
 * Requer API em API_URL e banco local. Homologação humana (E3-HOM) é separada.
 */
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const prisma = new PrismaClient();
const stamp = Date.now();
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

async function json(r) {
  const t = await r.text();
  try {
    return { status: r.status, corpo: JSON.parse(t), bruto: t };
  } catch {
    return { status: r.status, corpo: t, bruto: t };
  }
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

function headers(token) {
  return {
    "content-type": "application/json",
    "x-sessao-token": token,
  };
}

function isoDia(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}

try {
  const slugA = `e3-a-${stamp}`;
  const slugB = `e3-b-${stamp}`;
  const emailAdminA = `e3.admin.a.${stamp}@pef.local`;
  const senhaAdminA = `E3-AdminA-${stamp}`;
  const emailAdminB = `e3.admin.b.${stamp}@pef.local`;
  const senhaAdminB = `E3-AdminB-${stamp}`;
  const emailColab = `e3.colab.${stamp}@pef.local`;
  const senhaColab = `E3-Colab-${stamp}`;

  const famA = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `E3 Fam A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Admin E3 A ${stamp}`,
    emailAdmin: emailAdminA,
    senhaAdmin: senhaAdminA,
  });
  const famB = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `E3 Fam B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Admin E3 B ${stamp}`,
    emailAdmin: emailAdminB,
    senhaAdmin: senhaAdminB,
  });

  const sessA = await login(emailAdminA, senhaAdminA, slugA);
  const sessB = await login(emailAdminB, senhaAdminB, slugB);
  reg("login-admins", sessA.status < 300 && sessB.status < 300, {
    a: sessA.status,
    b: sessB.status,
  });
  const hA = headers(sessA.corpo.token);
  const hB = headers(sessB.corpo.token);
  const idFamA = famA.familia.id;
  const idFamB = famB.familia.id;
  const adminAUsuarioId = sessA.corpo.usuario?.id ?? sessA.corpo.usuarioId;

  const pessoaA = await json(
    await fetch(`${base}/familias/${idFamA}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Pessoa Cuidados E3 ${stamp}` }),
    }),
  );
  reg("cria-pessoa-A", pessoaA.status < 300 && pessoaA.corpo?.id, {
    status: pessoaA.status,
  });
  const pessoaAId = pessoaA.corpo.id;

  const authAdminCuidados = await json(
    await fetch(`${base}/familias/${idFamA}/autorizacoes`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        usuarioId: adminAUsuarioId,
        responsabilidade: "responsavel_cuidados",
        pessoaAlvoId: pessoaAId,
      }),
    }),
  );
  reg("admin-como-responsavel-cuidados", authAdminCuidados.status < 300, {
    status: authAdminCuidados.status,
  });

  const pdfBytes = Buffer.from(
    "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\nE3-smoke",
  );
  const anexoOk = await json(
    await fetch(`${base}/familias/${idFamA}/anexos`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        pessoaId: pessoaAId,
        nomeArquivo: `exame-e3-${stamp}.pdf`,
        mimeTipo: "application/pdf",
        conteudoBase64: pdfBytes.toString("base64"),
      }),
    }),
  );
  reg("cria-anexo-exame", anexoOk.status < 300 && anexoOk.corpo?.id, {
    status: anexoOk.status,
    id: anexoOk.corpo?.id,
  });
  const anexoId = anexoOk.corpo.id;

  const exame = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/exames`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        descricao: `Hemograma E3 ${stamp}`,
        data: new Date(`${isoDia(0)}T12:00:00`).toISOString(),
        anexoId,
      }),
    }),
  );
  reg("cria-exame-com-anexo", exame.status < 300 && exame.corpo?.id, {
    status: exame.status,
  });

  const exameSemAnexo = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/exames`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        descricao: `Exame sem arquivo ${stamp}`,
      }),
    }),
  );
  reg("cria-exame-sem-anexo", exameSemAnexo.status < 300, {
    status: exameSemAnexo.status,
  });

  const downloadOk = await json(
    await fetch(`${base}/anexos/${anexoId}`, { headers: hA }),
  );
  const bytesOk =
    typeof downloadOk.corpo?.conteudoBase64 === "string" &&
    downloadOk.corpo.conteudoBase64.length > 0 &&
    downloadOk.corpo.nomeArquivo === `exame-e3-${stamp}.pdf` &&
    downloadOk.corpo.mimeTipo === "application/pdf";
  reg("E3-EX-01-download-integro", downloadOk.status < 300 && bytesOk, {
    status: downloadOk.status,
    nome: downloadOk.corpo?.nomeArquivo,
    mime: downloadOk.corpo?.mimeTipo,
  });

  const semSessao = await json(await fetch(`${base}/anexos/${anexoId}`));
  reg(
    "E3-EX-03-sem-sessao",
    semSessao.status === 401 || semSessao.status === 403,
    { status: semSessao.status },
  );

  const cruzado = await json(
    await fetch(`${base}/anexos/${anexoId}`, { headers: hB }),
  );
  reg(
    "E3-EX-03-familia-cruzada",
    cruzado.status === 404 || cruzado.status === 403,
    { status: cruzado.status },
  );

  // Integrante/colaboradora: cria conta com colaboradora_cuidados (sem anexos)
  const pessoaColab = await json(
    await fetch(`${base}/familias/${idFamA}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Colab E3 ${stamp}` }),
    }),
  );
  const conviteColab = await json(
    await fetch(`${base}/familias/${idFamA}/convites`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        email: emailColab,
        nomeConvidado: `Colab E3 ${stamp}`,
        pessoaContaId: pessoaColab.corpo.id,
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: pessoaAId,
      }),
    }),
  );
  const tokenColab = conviteColab.corpo?.token;
  const ativarColab = await json(
    await fetch(
      `${base}/convites/${encodeURIComponent(tokenColab)}/ativar`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          senha: senhaColab,
          familiaSlug: slugA,
        }),
      },
    ),
  );
  const sessColab = await login(emailColab, senhaColab, slugA);
  const hColab = headers(sessColab.corpo.token);
  const downloadColab = await json(
    await fetch(`${base}/anexos/${anexoId}`, { headers: hColab }),
  );
  reg(
    "E3-EX-03-colaboradora-sem-anexo",
    ativarColab.status < 300 &&
      sessColab.status < 300 &&
      (downloadColab.status === 403 || downloadColab.status === 404),
    { status: downloadColab.status, ativar: ativarColab.status },
  );

  await json(
    await fetch(`${base}/sessoes`, { method: "DELETE", headers: hA }),
  );
  const downloadRevogado = await json(
    await fetch(`${base}/anexos/${anexoId}`, { headers: hA }),
  );
  reg(
    "E3-EX-03-sessao-revogada",
    downloadRevogado.status === 401 || downloadRevogado.status === 403,
    { status: downloadRevogado.status },
  );

  // Relogar admin A para resumo/PDF
  const sessA2 = await login(emailAdminA, senhaAdminA, slugA);
  const hA2 = headers(sessA2.corpo.token);
  reg("relogin-admin-A", sessA2.status < 300, { status: sessA2.status });

  const de = isoDia(-7);
  const ate = isoDia(0);
  const resumoCuid = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/resumo-cuidados?de=${de}&ate=${ate}`,
      { headers: hA2 },
    ),
  );
  const examesResumo = Array.isArray(resumoCuid.corpo?.exames)
    ? resumoCuid.corpo.exames
    : [];
  const exameComDoc = examesResumo.find((e) => e.temDocumento === true);
  const exameSemDoc = examesResumo.find((e) => e.temDocumento === false);
  reg(
    "E3-RES-02-exames-factuais",
    resumoCuid.status < 300 &&
      exameComDoc &&
      exameSemDoc &&
      typeof exameComDoc.descricao === "string",
    {
      status: resumoCuid.status,
      comDoc: Boolean(exameComDoc),
      semDoc: Boolean(exameSemDoc),
      doses: resumoCuid.corpo?.doses,
    },
  );

  const resumoCruzado = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/resumo-cuidados?de=${de}&ate=${ate}`,
      { headers: hB },
    ),
  );
  reg(
    "E3-RES-04-isolamento-resumo",
    resumoCruzado.status === 404 || resumoCruzado.status === 403,
    { status: resumoCruzado.status },
  );

  const previa = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/resumo-previa?de=${de}&ate=${ate}`,
      { headers: hA2 },
    ),
  );
  const pdf = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/relatorio.pdf?de=${de}&ate=${ate}`,
      { headers: hA2 },
    ),
  );
  const pdfBin = pdf.corpo?.pdfBase64
    ? Buffer.from(pdf.corpo.pdfBase64, "base64")
    : Buffer.alloc(0);
  const pdfLatin = pdfBin.toString("latin1");
  const pdfUtf = pdfBin.toString("utf8");
  const marcaAnexo =
    pdfLatin.includes("Anexos sens") ||
    pdfUtf.includes("Anexos sens") ||
    pdfLatin.includes("sem anexos") ||
    pdfUtf.includes("sem anexos") ||
    pdfLatin.includes("n\u00e3o inclu") ||
    pdfUtf.includes("não inclu") ||
    (typeof previa.corpo?.avisoPrivacidade === "string" &&
      previa.corpo.avisoPrivacidade.length > 0 &&
      previa.corpo.anexosIncluidos === false);
  const vazouBytesAnexo = pdfLatin.includes("E3-smoke") || pdfUtf.includes("E3-smoke");
  reg(
    "E3-RES-05-previa-pdf",
    previa.status < 300 &&
      pdf.status < 300 &&
      previa.corpo?.anexosIncluidos === false &&
      pdf.corpo?.anexosIncluidos === false &&
      !vazouBytesAnexo &&
      marcaAnexo,
    {
      previa: previa.status,
      pdf: pdf.status,
      anexosPrevia: previa.corpo?.anexosIncluidos,
      anexosPdf: pdf.corpo?.anexosIncluidos,
      marcaAnexo,
      vazouBytesAnexo,
      mime: pdf.corpo?.mimeTipo,
    },
  );

  const pdfColab = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/relatorio.pdf?de=${de}&ate=${ate}`,
      { headers: hColab },
    ),
  );
  reg(
    "E3-RES-05-colab-sem-export",
    pdfColab.status === 403 || pdfColab.status === 404,
    { status: pdfColab.status },
  );

  // Anexo vazio / indisponível: criar registro sem conteúdo
  const anexoVazio = await prisma.anexo.create({
    data: {
      familiaId: idFamA,
      pessoaId: pessoaAId,
      chavePrivada: `priv_e3_vazio_${stamp}`,
      nomeArquivo: `vazio-${stamp}.pdf`,
      mimeTipo: "application/pdf",
      tamanhoBytes: 0,
      conteudoBase64: null,
      criadoPorId: adminAUsuarioId,
    },
  });
  const downloadVazio = await json(
    await fetch(`${base}/anexos/${anexoVazio.id}`, { headers: hA2 }),
  );
  reg(
    "E3-EX-04-arquivo-indisponivel",
    downloadVazio.status < 300 &&
      (downloadVazio.corpo?.conteudoBase64 == null ||
        String(downloadVazio.corpo.conteudoBase64).trim() === ""),
    { status: downloadVazio.status },
  );

  const falhas = resultados.filter((r) => !r.ok);
  for (const r of resultados) {
    console.log(
      `${r.ok ? "PASS" : "FAIL"} ${r.nome}${
        r.detalhe ? ` — ${JSON.stringify(r.detalhe)}` : ""
      }`,
    );
  }
  if (falhas.length) {
    console.error(`\nsmoke-e3: ${falhas.length} falha(s)`);
    process.exitCode = 1;
  } else {
    console.log(`\nsmoke-e3: ${resultados.length} checagens OK`);
  }
} catch (e) {
  console.error("smoke-e3 erro fatal:", e);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
