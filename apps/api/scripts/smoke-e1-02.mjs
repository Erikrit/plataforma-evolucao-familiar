/**
 * Smoke E1-02: destinoEntrada/links com slug; sessão A em família B sem dados (API+início).
 * Requer API em API_URL e famílias provisionáveis.
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

try {
  const slugA = `nav-a-${stamp}`;
  const slugB = `nav-b-${stamp}`;
  const emailA = `nav.a.${stamp}@pef.local`;
  const senhaA = `nav-a-${stamp}-segura`;
  const emailB = `nav.b.${stamp}@pef.local`;
  const senhaB = `nav-b-${stamp}-segura`;

  const famA = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Nav A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Nav Admin A ${stamp}`,
    emailAdmin: emailA,
    senhaAdmin: senhaA,
  });
  await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Nav B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Nav Admin B ${stamp}`,
    emailAdmin: emailB,
    senhaAdmin: senhaB,
  });

  const sessA = await login(emailA, senhaA, slugA);
  reg(
    "E1-ACE-04-login-A",
    sessA.status < 300 && sessA.corpo?.familia?.slug === slugA,
    { status: sessA.status },
  );

  const hA = { "x-sessao-token": sessA.corpo.token };
  const inicioA = await json(
    await fetch(
      `${base}/familias/${famA.familia.id}/inicio`,
      { headers: hA },
    ),
  );
  const destino = inicioA.corpo?.destinoEntrada ?? "";
  const contextos = inicioA.corpo?.contextos ?? [];
  const hrefsOk =
    (typeof destino === "string" &&
      (destino === "" || destino.startsWith(`/f/${slugA}`))) &&
    contextos.every((c) => String(c.href).startsWith(`/f/${slugA}`));
  reg(
    "E1-ACE-04-destino-e-hrefs-com-slug",
    inicioA.status < 300 &&
      inicioA.corpo?.familiaSlug === slugA &&
      hrefsOk &&
      (destino === `/f/${slugA}/gerenciar-familia` ||
        destino === `/f/${slugA}` ||
        destino.startsWith(`/f/${slugA}/pessoas/`)),
    {
      destino,
      familiaSlug: inicioA.corpo?.familiaSlug,
      nContextos: contextos.length,
    },
  );

  const cruzado = await login(emailA, senhaA, slugB);
  reg(
    "E1-ACE-03-sessao-A-url-B-auth",
    cruzado.status === 401,
    { status: cruzado.status },
  );

  const ctxB = await json(await fetch(`${base}/familias/contexto/${slugB}`));
  const ctxA = await json(await fetch(`${base}/familias/contexto/${slugA}`));
  reg(
    "E1-ACE-03-contexto-publico-sem-dados-privados",
    ctxA.status === 200 &&
      ctxB.status === 200 &&
      !("cartoes" in (ctxA.corpo ?? {})) &&
      !("pessoas" in (ctxB.corpo ?? {})),
    { ctxA: ctxA.corpo, ctxB: ctxB.corpo },
  );

  const seed = await login(
    process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local",
    process.env.PEF_ADMIN_SENHA ?? "admin-local",
    "oliveira",
  );
  const hSeed = { "x-sessao-token": seed.corpo.token };
  const inicioSeed = await json(
    await fetch(
      `${base}/familias/${seed.corpo.usuario.pessoa.familiaId}/inicio`,
      { headers: hSeed },
    ),
  );
  const destSeed = String(inicioSeed.corpo?.destinoEntrada ?? "");
  reg(
    "E1-ACE-04-seed-oliveira-links",
    seed.status < 300 &&
      inicioSeed.status < 300 &&
      destSeed.startsWith("/f/oliveira") &&
      (inicioSeed.corpo?.contextos ?? []).every((c) =>
        String(c.href).startsWith("/f/oliveira"),
      ),
    { destino: destSeed, n: (inicioSeed.corpo?.contextos ?? []).length },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (erro) {
  console.error(
    JSON.stringify({
      ok: false,
      erro: erro instanceof Error ? erro.message : String(erro),
      resultados,
    }),
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
