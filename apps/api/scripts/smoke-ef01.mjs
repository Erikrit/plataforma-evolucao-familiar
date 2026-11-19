/** Smoke EF-01: histórico unificado cuidados + desenvolvimento com authz por domínio. */
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

  const desafios = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?disponibilidade=explorar`,
      { headers: h },
    ),
  );
  let desafioId = desafios.corpo?.desafios?.[0]?.id;
  if (!desafioId) {
    const criado = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          nome: `EF01 ${Date.now()}`,
          dificuldade: "simples",
        }),
      }),
    );
    desafioId = criado.corpo?.id;
  }
  if (!desafioId) throw new Error("sem desafio no catálogo");

  const part = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "concluiu",
        observacao: "Smoke EF-01",
        execucaoChave: `smoke-ef01-${randomUUID()}`,
      }),
    }),
  );
  reg("participacao-criada", part.status < 300, {
    status: part.status,
    id: part.corpo?.id,
  });

  const histLaurinha = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/historico`, { headers: h }),
  );
  const eventosDev = (histLaurinha.corpo?.eventos ?? []).filter(
    (e) => e.dominio === "desenvolvimento",
  );
  const eventosCuidLaurinha = (histLaurinha.corpo?.eventos ?? []).filter(
    (e) => e.dominio === "cuidados",
  );
  reg(
    "historico-laurinha-com-participacao",
    histLaurinha.status < 300 &&
      histLaurinha.corpo?.dominios?.desenvolvimento === true &&
      eventosDev.some((e) => e.tipo === "participacao"),
    {
      status: histLaurinha.status,
      dominios: histLaurinha.corpo?.dominios,
      totalDev: eventosDev.length,
      amostra: eventosDev[0],
    },
  );
  reg(
    "historico-laurinha-sem-cuidados-sem-auth",
    histLaurinha.corpo?.dominios?.cuidados === false &&
      eventosCuidLaurinha.length === 0,
    {
      dominios: histLaurinha.corpo?.dominios,
      totalCuid: eventosCuidLaurinha.length,
    },
  );

  const histVovo = await json(
    await fetch(`${base}/pessoas/${vovo.id}/historico`, { headers: h }),
  );
  reg(
    "historico-vovo-dominio-cuidados",
    histVovo.status < 300 && histVovo.corpo?.dominios?.cuidados === true,
    {
      status: histVovo.status,
      dominios: histVovo.corpo?.dominios,
      total: histVovo.corpo?.eventos?.length,
    },
  );

  const email = `colab.ef01.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colab EF01",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colab EF01" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };

  const colabLaurinha = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/historico`, { headers: hc }),
  );
  reg(
    "colab-negado-historico-laurinha",
    colabLaurinha.status === 403,
    { status: colabLaurinha.status },
  );

  const colabVovo = await json(
    await fetch(`${base}/pessoas/${vovo.id}/historico`, { headers: hc }),
  );
  const colabDev = (colabVovo.corpo?.eventos ?? []).filter(
    (e) => e.dominio === "desenvolvimento",
  );
  reg(
    "colab-vovo-sem-eventos-desenvolvimento",
    colabVovo.status < 300 &&
      colabVovo.corpo?.dominios?.desenvolvimento === false &&
      colabDev.length === 0,
    {
      status: colabVovo.status,
      dominios: colabVovo.corpo?.dominios,
      totalDev: colabDev.length,
    },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error(e);
  console.log(JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2));
  process.exitCode = 1;
}
