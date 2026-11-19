/** Smoke EF-06: destaques discretos na home (autorizados; sem ranking/cobrança). */
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

  const amanha = new Date(Date.now() + 864e5);
  const consulta = await json(
    await fetch(`${base}/pessoas/${vovo.id}/consultas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        especialidadeOuDescricao: `EF06 consulta ${Date.now()}`,
        dataHora: amanha.toISOString(),
      }),
    }),
  );
  reg("consulta-proxima-criada", consulta.status < 300, {
    status: consulta.status,
    id: consulta.corpo?.id,
  });

  const criado = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `EF06 ${Date.now()}`,
        dificuldade: "simples",
      }),
    }),
  );
  const desafioId = criado.corpo?.id;
  if (!desafioId) throw new Error("sem desafio no catálogo");
  const part = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "concluiu",
        execucaoChave: `smoke-ef06-${randomUUID()}`,
      }),
    }),
  );
  reg("conquista-criada", part.status < 300, { status: part.status });

  const inicio = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: h }),
  );
  const destaques = inicio.corpo?.destaques ?? [];
  const temConsulta = destaques.some(
    (d) => d.tipo === "consulta_proxima" && d.pessoaId === vovo.id,
  );
  const temConquista = destaques.some(
    (d) => d.tipo === "experiencia_recente" && d.pessoaId === laurinha.id,
  );
  reg(
    "destaques-autorizados-poucos",
    inicio.status < 300 &&
      Array.isArray(destaques) &&
      destaques.length >= 1 &&
      destaques.length <= 3 &&
      temConsulta &&
      temConquista &&
      destaques.every(
        (d) =>
          typeof d.titulo === "string" &&
          typeof d.pessoaNome === "string" &&
          typeof d.quando === "string",
      ),
    {
      status: inicio.status,
      total: destaques.length,
      tipos: destaques.map((d) => d.tipo),
    },
  );

  const email = `colab.ef06.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colab EF06",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colab EF06" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };
  const inicioColab = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: hc }),
  );
  const destColab = inicioColab.corpo?.destaques ?? [];
  reg(
    "colab-destaques-sem-laurinha",
    inicioColab.status < 300 &&
      !destColab.some((d) => d.pessoaId === laurinha.id) &&
      destColab.every((d) => d.pessoaId === vovo.id),
    {
      status: inicioColab.status,
      destaques: destColab,
    },
  );

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
