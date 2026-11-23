/**
 * EST-02 — checagens pontuais de sessão/cookie/CORS/expiração/logout.
 * Não redesenha auth; complementa smoke:e1-01/e1-03/e2/authz.
 */
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const base = process.env.API_URL ?? "http://localhost:3001";
const web = process.env.WEB_ORIGIN ?? "http://localhost:3000";
const stamp = Date.now();
const prisma = new PrismaClient();
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

async function json(res) {
  const bruto = await res.text();
  let corpo = null;
  try {
    corpo = bruto ? JSON.parse(bruto) : null;
  } catch {
    corpo = bruto;
  }
  return { status: res.status, headers: res.headers, corpo, bruto };
}

function cookiesDe(res) {
  if (typeof res.headers.getSetCookie === "function") {
    const lista = res.headers.getSetCookie();
    if (lista?.length) return lista;
  }
  const unico = res.headers.get("set-cookie");
  return unico ? [unico] : [];
}

try {
  const slug = `est02-${stamp}`;
  const email = `est02.${stamp}@pef.local`;
  const senha = `Est02-${stamp}-segura`;

  const criar = await json(
    await fetch(`${base}/familias`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nomeFamilia: `EST02 ${stamp}`,
        slug,
        nomeTitular: `Admin EST02 ${stamp}`,
        email,
        senha,
      }),
    }),
  );
  reg(
    "provisionar-familia",
    criar.status === 201 || criar.status === 200,
    { status: criar.status, slug: criar.corpo?.familia?.slug, msg: criar.corpo?.message },
  );

  const loginRes = await fetch(`${base}/sessoes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: web,
    },
    body: JSON.stringify({ email, senha, familiaSlug: slug }),
  });
  const loginJ = await json(loginRes);
  const cookieJoin = cookiesDe(loginRes).join(" | ");
  reg(
    "login-valido",
    loginJ.status < 300 && !!loginJ.corpo?.token,
    { status: loginJ.status },
  );
  reg(
    "cookie-httponly",
    /pef_sessao=/i.test(cookieJoin) && /HttpOnly/i.test(cookieJoin),
    { sample: cookieJoin.slice(0, 240) },
  );
  reg("cookie-samesite-lax", /SameSite=Lax/i.test(cookieJoin), {});
  const secureEnv = process.env.COOKIE_SECURE === "true";
  reg(
    "cookie-secure-coerente-com-env",
    secureEnv ? /Secure/i.test(cookieJoin) : !/(^|[|\s;])Secure/i.test(cookieJoin),
    {
      COOKIE_SECURE: process.env.COOKIE_SECURE ?? "(unset)",
      temSecure: /Secure/i.test(cookieJoin),
    },
  );

  const token = loginJ.corpo?.token;
  const h = { "content-type": "application/json", "x-sessao-token": token };
  const meOk = await json(await fetch(`${base}/me`, { headers: h }));
  reg("me-com-sessao", meOk.status === 200, { status: meOk.status });
  const meSem = await json(await fetch(`${base}/me`));
  reg("me-sem-sessao-401", meSem.status === 401, { status: meSem.status });

  const cors = await fetch(`${base}/saude`, {
    method: "OPTIONS",
    headers: {
      origin: web,
      "access-control-request-method": "GET",
    },
  });
  reg(
    "cors-permite-web-origin",
    cors.headers.get("access-control-allow-origin") === web &&
      cors.headers.get("access-control-allow-credentials") === "true",
    { acao: cors.headers.get("access-control-allow-origin") },
  );

  const sair = await json(
    await fetch(`${base}/sessoes`, { method: "DELETE", headers: h }),
  );
  reg("logout-ok", sair.status < 300 && sair.corpo?.ok === true, sair.corpo);
  const aposLogout = await json(await fetch(`${base}/me`, { headers: h }));
  reg("apos-logout-401", aposLogout.status === 401, { status: aposLogout.status });

  const login2 = await json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, senha, familiaSlug: slug }),
    }),
  );
  const token2 = login2.corpo?.token;
  const hash = createHash("sha256").update(token2, "utf8").digest("hex");
  await prisma.sessaoProvisoria.updateMany({
    where: { token: hash },
    data: { expiraEm: new Date(Date.now() - 60_000) },
  });
  const meExp = await json(
    await fetch(`${base}/me`, { headers: { "x-sessao-token": token2 } }),
  );
  reg("sessao-expirada-401", meExp.status === 401, {
    status: meExp.status,
    msg: meExp.corpo?.message,
  });
  const restante = await prisma.sessaoProvisoria.count({ where: { token: hash } });
  reg("sessao-expirada-removida", restante === 0, { restante });

  let bloqueou = false;
  let ultimo = 0;
  for (let i = 0; i < 30; i += 1) {
    const r = await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        senha: `errada-${i}`,
        familiaSlug: slug,
      }),
    });
    ultimo = r.status;
    if (r.status === 429) {
      bloqueou = true;
      break;
    }
  }
  reg("login-invalido-401", ultimo === 401, { ultimo });
  reg("INFO-rate-limit-login", true, {
    presente: bloqueou,
    nota: bloqueou
      ? "429 presente"
      : "AUSENTE — risco residual / critério bloqueante para uso real",
  });

  const criticos = resultados.filter((r) => !r.nome.startsWith("INFO-"));
  const ok = criticos.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (erro) {
  console.error(erro);
  console.log(
    JSON.stringify({
      ok: false,
      erro: erro instanceof Error ? erro.message : String(erro),
      resultados,
    }, null, 2),
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
