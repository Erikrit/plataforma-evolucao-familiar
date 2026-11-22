/**
 * Smoke authz crítico pós-E1: admin puro, concessão contextual e isolamento.
 * Provisiona famílias fictícias — não depende do seed legado.
 */
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";
import {
  garantirResponsavelCuidados,
  json,
} from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const prisma = new PrismaClient();
const stamp = Date.now();
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

async function login(email, senha, familiaSlug) {
  const r = await json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, senha, familiaSlug }),
    }),
  );
  if (r.status >= 300) {
    throw new Error(`login: ${JSON.stringify(r.corpo)}`);
  }
  return r.corpo;
}

function headers(token) {
  return {
    "content-type": "application/json",
    "x-sessao-token": token,
  };
}

try {
  const slugA = `authz-a-${stamp}`;
  const slugB = `authz-b-${stamp}`;
  const emailA = `authz.a.${stamp}@pef.local`;
  const emailB = `authz.b.${stamp}@pef.local`;
  const senhaA = `authz-a-${stamp}-segura`;
  const senhaB = `authz-b-${stamp}-segura`;

  const famA = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Authz A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Authz Admin A ${stamp}`,
    emailAdmin: emailA,
    senhaAdmin: senhaA,
  });
  const famB = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Authz B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Authz Admin B ${stamp}`,
    emailAdmin: emailB,
    senhaAdmin: senhaB,
  });

  const sessA = await login(emailA, senhaA, slugA);
  const sessB = await login(emailB, senhaB, slugB);
  const hA = headers(sessA.token);
  const hB = headers(sessB.token);

  const pessoaA = await json(
    await fetch(`${base}/familias/${famA.familia.id}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Alvo Authz A ${stamp}` }),
    }),
  );
  const pessoaB = await json(
    await fetch(`${base}/familias/${famB.familia.id}/pessoas`, {
      method: "POST",
      headers: hB,
      body: JSON.stringify({ nome: `Alvo Authz B ${stamp}` }),
    }),
  );
  reg(
    "cria-pessoas",
    pessoaA.status < 300 && pessoaB.status < 300,
    { a: pessoaA.corpo?.id, b: pessoaB.corpo?.id },
  );
  const idA = pessoaA.corpo.id;
  const idB = pessoaB.corpo.id;

  const adminNegado = await json(
    await fetch(`${base}/pessoas/${idA}/cuidados/hoje`, { headers: hA }),
  );
  reg("admin-puro-negado-rotina", adminNegado.status === 403, {
    status: adminNegado.status,
  });

  const pdfNegado = await json(
    await fetch(
      `${base}/pessoas/${idA}/relatorio.pdf?de=${encodeURIComponent(new Date(0).toISOString())}&ate=${encodeURIComponent(new Date().toISOString())}`,
      { headers: hA },
    ),
  );
  reg("admin-puro-negado-pdf", pdfNegado.status === 403, {
    status: pdfNegado.status,
  });

  await garantirResponsavelCuidados(
    base,
    hA,
    famA.familia.id,
    famA.usuario.id,
    idA,
  );

  const adminOk = await json(
    await fetch(`${base}/pessoas/${idA}/cuidados/hoje`, { headers: hA }),
  );
  reg("admin-com-concessao-ok", adminOk.status < 300, {
    status: adminOk.status,
  });

  const cruzado = await json(
    await fetch(`${base}/pessoas/${idB}/cuidados/hoje`, { headers: hA }),
  );
  reg("sessao-A-pessoa-B-404", cruzado.status === 404, {
    status: cruzado.status,
  });

  const gestaoA = await json(
    await fetch(`${base}/familias/${famA.familia.id}/acessos`, { headers: hA }),
  );
  reg("admin-gestao-ok", gestaoA.status < 300, { status: gestaoA.status });

  const gestaoCruz = await json(
    await fetch(`${base}/familias/${famB.familia.id}/acessos`, { headers: hA }),
  );
  reg("admin-gestao-familia-B-negada", gestaoCruz.status === 403, {
    status: gestaoCruz.status,
  });

  const semSlug = await json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: emailA, senha: senhaA }),
    }),
  );
  reg(
    "login-sem-familiaSlug-recusado",
    semSlug.status >= 400,
    { status: semSlug.status },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (erro) {
  console.error(erro);
  console.log(
    JSON.stringify(
      {
        ok: false,
        erro: erro instanceof Error ? erro.message : String(erro),
        resultados,
      },
      null,
      2,
    ),
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
