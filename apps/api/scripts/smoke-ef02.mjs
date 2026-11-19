/** Smoke EF-02: filtros periodo/dominio no histórico. */
import {
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
  await garantirResponsavelDesenvolvimento(
    base,
    h,
    familiaId,
    admin.usuario.id,
    laurinha.id,
  );

  const criado = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `EF02 ${Date.now()}`,
        dificuldade: "simples",
      }),
    }),
  );
  const desafioId = criado.corpo?.id;
  await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "participou",
        execucaoChave: `smoke-ef02-${randomUUID()}`,
      }),
    }),
  );

  const filtrado = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/historico?dominio=desenvolvimento`,
      { headers: h },
    ),
  );
  reg(
    "filtro-dominio-desenvolvimento",
    filtrado.status < 300 &&
      (filtrado.corpo?.eventos ?? []).every(
        (e) => e.dominio === "desenvolvimento",
      ) &&
      (filtrado.corpo?.eventos?.length ?? 0) >= 1,
    {
      status: filtrado.status,
      total: filtrado.corpo?.eventos?.length,
      filtro: filtrado.corpo?.filtro,
    },
  );

  const soCuidados = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/historico?dominio=cuidados`, {
      headers: h,
    }),
  );
  reg(
    "filtro-dominio-cuidados-vazio-sem-auth",
    soCuidados.status < 300 &&
      (soCuidados.corpo?.eventos?.length ?? 0) === 0,
    { status: soCuidados.status, total: soCuidados.corpo?.eventos?.length },
  );

  const futuro = "2099-01-01";
  const periodoVazio = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/historico?de=${futuro}&ate=${futuro}`,
      { headers: h },
    ),
  );
  reg(
    "filtro-periodo-vazio-neutro",
    periodoVazio.status < 300 &&
      (periodoVazio.corpo?.eventos?.length ?? 0) === 0,
    { status: periodoVazio.status, filtro: periodoVazio.corpo?.filtro },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error(e);
  console.log(JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2));
  process.exitCode = 1;
}
