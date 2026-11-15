/** Smoke FF-05: ACE-06 revogação+sessão; ACE-10 isolamento entre famílias. */
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { IDS_SEED, resolverPessoa } from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";
const prisma = new PrismaClient();

function hash(s) {
  const sal = randomBytes(16).toString("hex");
  return `${sal}:${scryptSync(s, sal, 64).toString("hex")}`;
}

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
  if (r.status >= 300) throw new Error(`login ${email}`);
  return d.corpo;
}

const resultados = [];
const reg = (n, ok, d) => resultados.push({ nome: n, ok, detalhe: d });

try {
  const admin = await login(emailAdmin, senhaAdmin);
  const familiaId = admin.usuario.pessoa.familiaId;
  const h = {
    "content-type": "application/json",
    "x-sessao-token": admin.token,
  };

  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });

  const email = `revogar.${Date.now()}@pef.local`;
  const convite = (
    await json(
      await fetch(`${base}/familias/${familiaId}/convites`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          email,
          nomeConvidado: "Temp Revogar",
          responsabilidade: "colaboradora_cuidados",
          pessoaAlvoId: vovo.id,
        }),
      }),
    )
  ).corpo;
  await fetch(`${base}/convites/${convite.token}/ativar`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ senha: "temp-local", nome: "Temp Revogar" }),
  });
  const temp = await login(email, "temp-local");
  const authTemp = (
    await json(
      await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
        headers: { "x-sessao-token": temp.token },
      }),
    )
  ).corpo?.[0];

  const adminAuths = await json(
    await fetch(`${base}/familias/${familiaId}/autorizacoes`, { headers: h }),
  );
  // Admin lista só as próprias; precisa buscar auth do temp via prisma
  const authDb = await prisma.autorizacao.findFirst({
    where: { usuarioId: temp.usuario.id, ativa: true },
  });

  const revogar = await json(
    await fetch(
      `${base}/familias/${familiaId}/autorizacoes/${authDb.id}`,
      { method: "DELETE", headers: h },
    ),
  );
  reg(
    "ACE-06-revogar",
    revogar.status < 300 &&
      revogar.corpo?.ativa === false &&
      revogar.corpo?.historicoPreservado === true &&
      revogar.corpo?.sessoesInvalidadas >= 1,
    revogar.corpo,
  );

  const sessaoApos = await fetch(`${base}/familias/${familiaId}/inicio`, {
    headers: { "x-sessao-token": temp.token },
  });
  reg("ACE-06-sessao-morta", sessaoApos.status === 401, {
    status: sessaoApos.status,
  });

  const authAindaExiste = await prisma.autorizacao.findUnique({
    where: { id: authDb.id },
  });
  reg("ACE-06-historico", !!authAindaExiste && authAindaExiste.ativa === false, {
    id: authDb.id,
  });

  // Isolamento: segunda família
  const outra = await prisma.familia.upsert({
    where: { id: "familia_isolada_seed" },
    update: { nome: "Família Isolada" },
    create: { id: "familia_isolada_seed", nome: "Família Isolada" },
  });
  const pessoaOutra = await prisma.pessoa.upsert({
    where: { id: "pessoa_isolada_admin" },
    update: { familiaId: outra.id, nome: "Admin Isolado" },
    create: {
      id: "pessoa_isolada_admin",
      familiaId: outra.id,
      nome: "Admin Isolado",
    },
  });
  const emailOutra = "admin.isolado@pef.local";
  const userOutra = await prisma.usuario.upsert({
    where: { email: emailOutra },
    update: {
      pessoaId: pessoaOutra.id,
      senhaHash: hash("isolado-local"),
    },
    create: {
      id: "usuario_isolado_seed",
      pessoaId: pessoaOutra.id,
      email: emailOutra,
      senhaHash: hash("isolado-local"),
    },
  });
  const authOutra = await prisma.autorizacao.findFirst({
    where: {
      usuarioId: userOutra.id,
      responsabilidade: "administrador",
      ativa: true,
    },
  });
  if (!authOutra) {
    await prisma.autorizacao.create({
      data: {
        familiaId: outra.id,
        usuarioId: userOutra.id,
        responsabilidade: "administrador",
        pessoaAlvoId: null,
      },
    });
  }

  const isolado = await login(emailOutra, "isolado-local");
  const vazamento = await fetch(`${base}/familias/${familiaId}/inicio`, {
    headers: { "x-sessao-token": isolado.token },
  });
  reg("ACE-10", vazamento.status === 403, { status: vazamento.status });

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados, authTemp }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (e) {
  console.error(
    JSON.stringify({
      ok: false,
      mensagem: e instanceof Error ? e.message : String(e),
      resultados,
    }),
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
