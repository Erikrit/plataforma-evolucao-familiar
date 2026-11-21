/** Smoke EF-05: prévia e PDF com mesmos dados autorizados; sem anexos; colab sem export. */
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

const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

try {
  const admin = await login(emailAdmin, senhaAdmin);
  const familiaId = admin.usuario.pessoa.familiaId;
  const h = {
    "content-type": "application/json",
    "x-sessao-token": admin.token,
  };

  const laurinha = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });
  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });

  await garantirResponsavelDesenvolvimento(
    base,
    h,
    familiaId,
    admin.usuario.id,
    laurinha.id,
  );
  await garantirResponsavelCuidados(
    base,
    h,
    familiaId,
    admin.usuario.id,
    vovo.id,
  );

  const hoje = new Date().toISOString().slice(0, 10);
  const criado = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `EF05 ${Date.now()}`,
        dificuldade: "simples",
      }),
    }),
  );
  const desafioId = criado.corpo?.id;
  if (!desafioId) throw new Error("sem desafio no catálogo");
  await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "concluiu",
        observacao: `EF05 ${Date.now()}`,
        execucaoChave: `smoke-ef05-${randomUUID()}`,
      }),
    }),
  );

  const previaLaurinha = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/resumo-previa?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  reg(
    "previa-laurinha-so-desenvolvimento",
    previaLaurinha.status < 300 &&
      previaLaurinha.corpo?.dominios?.desenvolvimento === true &&
      previaLaurinha.corpo?.dominios?.cuidados === false &&
      previaLaurinha.corpo?.desenvolvimento != null &&
      previaLaurinha.corpo?.cuidados == null &&
      previaLaurinha.corpo?.anexosIncluidos === false &&
      typeof previaLaurinha.corpo?.avisoPrivacidade === "string",
    {
      status: previaLaurinha.status,
      dominios: previaLaurinha.corpo?.dominios,
      anexos: previaLaurinha.corpo?.anexosIncluidos,
    },
  );

  const pdfLaurinha = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/relatorio.pdf?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  const previaPdf = pdfLaurinha.corpo?.previa;
  const textoPdf = pdfLaurinha.corpo?.pdfBase64
    ? Buffer.from(pdfLaurinha.corpo.pdfBase64, "base64").toString("latin1")
    : "";
  reg(
    "pdf-igual-previa-autorizada",
    pdfLaurinha.status < 300 &&
      !!pdfLaurinha.corpo?.pdfBase64 &&
      pdfLaurinha.corpo?.mimeTipo === "application/pdf" &&
      pdfLaurinha.corpo?.anexosIncluidos === false &&
      previaPdf?.dominios?.desenvolvimento === true &&
      previaPdf?.dominios?.cuidados === false &&
      (previaPdf?.desenvolvimento?.experiencias?.length ?? 0) ===
        (previaLaurinha.corpo?.desenvolvimento?.experiencias?.length ?? -1) &&
      (textoPdf.includes("Anexos") &&
        (textoPdf.includes("incluidos") ||
          textoPdf.includes("inclu") ||
          textoPdf.includes("sensiveis") ||
          textoPdf.includes("sens\\355veis") ||
          textoPdf.includes("sens"))),
    {
      status: pdfLaurinha.status,
      mime: pdfLaurinha.corpo?.mimeTipo,
      dominiosPdf: previaPdf?.dominios,
      expPrevia: previaLaurinha.corpo?.desenvolvimento?.experiencias?.length,
      expPdf: previaPdf?.desenvolvimento?.experiencias?.length,
    },
  );

  const pdfVovo = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/relatorio.pdf?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  const examesJson = JSON.stringify(pdfVovo.corpo?.previa?.cuidados?.exames ?? []);
  reg(
    "pdf-vovo-cuidados-sem-anexos",
    pdfVovo.status < 300 &&
      pdfVovo.corpo?.previa?.dominios?.cuidados === true &&
      pdfVovo.corpo?.anexosIncluidos === false &&
      !examesJson.includes("anexoId"),
    {
      status: pdfVovo.status,
      dominios: pdfVovo.corpo?.previa?.dominios,
    },
  );

  const email = `colab.ef05.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colab EF05",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colab EF05" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };
  const colabPdf = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/relatorio.pdf?de=${hoje}&ate=${hoje}`,
      { headers: hc },
    ),
  );
  reg("colaboradora-sem-export-completo", colabPdf.status === 403, {
    status: colabPdf.status,
  });

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error(e);
  console.log(
    JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2),
  );
  process.exitCode = 1;
}
