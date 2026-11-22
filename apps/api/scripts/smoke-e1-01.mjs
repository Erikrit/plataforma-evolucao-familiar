/**
 * Smoke E1-01: provisionamento privado + login contextual (E1-ACE-01/02).
 * Requer API em API_URL (default http://localhost:3001) e banco local.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const prisma = new PrismaClient();
const raizApi = join(dirname(fileURLToPath(import.meta.url)), "..");
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

async function postSessao(corpo) {
  return json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    }),
  );
}

function contemSegredo(texto, senha) {
  if (!senha) return false;
  return String(texto).toLowerCase().includes(String(senha).toLowerCase());
}

try {
  const slugA = `fam-a-${stamp}`;
  const slugB = `fam-b-${stamp}`;
  const emailA = `admin.a.${stamp}@pef.local`;
  const emailB = `admin.b.${stamp}@pef.local`;
  const senhaA = `senha-a-${stamp}-segura`;
  const senhaB = `senha-b-${stamp}-segura`;

  const famA = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Família A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Admin A ${stamp}`,
    emailAdmin: emailA,
    senhaAdmin: senhaA,
  });
  const famB = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Família B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Admin B ${stamp}`,
    emailAdmin: emailB,
    senhaAdmin: senhaB,
  });
  reg("E1-ACE-01-provisionar-A-B", !!famA.familia.id && !!famB.familia.id, {
    slugA: famA.familia.slug,
    slugB: famB.familia.slug,
  });

  let colisaoSlugOk = false;
  let familiasAposColisaoSlug = 0;
  try {
    await provisionarFamiliaComAdmin(prisma, {
      nomeFamilia: "Colisão slug",
      slug: slugA,
      nomeAdmin: "Outro",
      emailAdmin: `colisao.slug.${stamp}@pef.local`,
      senhaAdmin: "senha-colisao-1",
    });
  } catch (e) {
    colisaoSlugOk = e?.codigo === "COLISAO";
  }
  familiasAposColisaoSlug = await prisma.familia.count({
    where: { slug: slugA },
  });
  reg(
    "E1-ACE-01-colisao-slug-sem-parcial",
    colisaoSlugOk && familiasAposColisaoSlug === 1,
    { familiasAposColisaoSlug },
  );

  let colisaoEmailOk = false;
  const usuariosAntes = await prisma.usuario.count({ where: { email: emailA } });
  try {
    await provisionarFamiliaComAdmin(prisma, {
      nomeFamilia: "Colisão email",
      slug: `colisao-email-${stamp}`,
      nomeAdmin: "Outro",
      emailAdmin: emailA,
      senhaAdmin: "senha-colisao-2",
    });
  } catch (e) {
    colisaoEmailOk = e?.codigo === "COLISAO";
  }
  const usuariosDepois = await prisma.usuario.count({ where: { email: emailA } });
  const familiaColisaoEmail = await prisma.familia.findUnique({
    where: { slug: `colisao-email-${stamp}` },
  });
  reg(
    "E1-ACE-01-colisao-email-sem-parcial",
    colisaoEmailOk &&
      usuariosAntes === 1 &&
      usuariosDepois === 1 &&
      !familiaColisaoEmail,
    { usuariosAntes, usuariosDepois, familiaCriada: !!familiaColisaoEmail },
  );

  const cli = spawnSync(
    process.execPath,
    [
      join(raizApi, "scripts", "provisionar-familia.mjs"),
      "--nome",
      `Família CLI ${stamp}`,
      "--slug",
      `cli-${stamp}`,
      "--admin",
      `Admin CLI ${stamp}`,
      "--email",
      `cli.${stamp}@pef.local`,
    ],
    {
      cwd: raizApi,
      encoding: "utf8",
      env: {
        ...process.env,
        PEF_PROVISION_SENHA: `cli-senha-${stamp}-segura`,
      },
    },
  );
  const cliOut = `${cli.stdout ?? ""}${cli.stderr ?? ""}`;
  let cliJson = null;
  try {
    cliJson = JSON.parse((cli.stdout ?? "").trim() || "{}");
  } catch {
    cliJson = null;
  }
  reg(
    "E1-ACE-01-cli-provision",
    cli.status === 0 &&
      cliJson?.ok === true &&
      !contemSegredo(cliOut, `cli-senha-${stamp}-segura`),
    { status: cli.status, ok: cliJson?.ok },
  );

  const semSlug = await postSessao({ email: emailA, senha: senhaA });
  reg(
    "E1-ACE-01-login-sem-slug-recusado",
    semSlug.status === 400,
    { status: semSlug.status, msg: semSlug.corpo?.message },
  );

  const ctxA = await json(await fetch(`${base}/familias/contexto/${slugA}`));
  const ctxInvalido = await json(
    await fetch(`${base}/familias/contexto/nao-existe-${stamp}`),
  );
  reg(
    "E1-ACE-02-contexto-slug",
    ctxA.status === 200 &&
      ctxA.corpo?.slug === slugA &&
      ctxInvalido.status === 404,
    { ctxA: ctxA.status, ctxInvalido: ctxInvalido.status },
  );

  const loginOk = await postSessao({
    email: emailA,
    senha: senhaA,
    familiaSlug: slugA,
  });
  reg(
    "E1-ACE-02-login-A-em-A",
    loginOk.status < 300 &&
      loginOk.corpo?.usuario?.email === emailA &&
      loginOk.corpo?.familia?.slug === slugA &&
      !contemSegredo(loginOk.bruto, senhaA),
    {
      status: loginOk.status,
      familia: loginOk.corpo?.familia?.slug,
    },
  );

  const loginCruzado = await postSessao({
    email: emailA,
    senha: senhaA,
    familiaSlug: slugB,
  });
  const loginSenhaRuim = await postSessao({
    email: emailA,
    senha: "senha-errada-xyz",
    familiaSlug: slugA,
  });
  const loginEmailInexistente = await postSessao({
    email: `sumido.${stamp}@pef.local`,
    senha: senhaA,
    familiaSlug: slugA,
  });
  const msgCruzado = String(loginCruzado.corpo?.message ?? "");
  const msgSenha = String(loginSenhaRuim.corpo?.message ?? "");
  const msgEmail = String(loginEmailInexistente.corpo?.message ?? "");
  reg(
    "E1-ACE-02-login-A-em-B-recusado",
    loginCruzado.status === 401 && msgCruzado === "Credenciais inválidas.",
    { status: loginCruzado.status, msg: msgCruzado },
  );
  reg(
    "E1-ACE-02-auth-invalida-uniforme",
    loginSenhaRuim.status === 401 &&
      loginEmailInexistente.status === 401 &&
      msgSenha === msgEmail &&
      msgSenha === "Credenciais inválidas.",
    { msgSenha, msgEmail },
  );

  const slugRuim = await postSessao({
    email: emailA,
    senha: senhaA,
    familiaSlug: `nao-existe-${stamp}`,
  });
  reg(
    "E1-ACE-02-slug-invalido",
    slugRuim.status === 404,
    { status: slugRuim.status, msg: slugRuim.corpo?.message },
  );

  const seedLogin = await postSessao({
    email: process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local",
    senha: process.env.PEF_ADMIN_SENHA ?? "admin-local",
    familiaSlug: "oliveira",
  });
  reg(
    "E1-ACE-02-seed-oliveira",
    seedLogin.status < 300 && seedLogin.corpo?.familia?.slug === "oliveira",
    { status: seedLogin.status },
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
