/** Smoke DL-01: biblioteca DEV-F01 + authz desenvolvimento (admin puro/colab negados). */
import {
  garantirResponsavelDesenvolvimento,
  resolverPessoa,
  IDS_SEED,
} from "./lib-authz-smoke.mjs";

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

  const adminPuro = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, { headers: h }),
  );
  reg("admin-puro-negado-biblioteca", adminPuro.status === 403, {
    status: adminPuro.status,
  });

  const perfilAntes = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas/${laurinha.id}`, {
      headers: h,
    }),
  );
  const areaAntes = perfilAntes.corpo?.areas?.find(
    (a) => a.id === "desenvolvimento",
  );
  reg(
    "perfil-desenvolvimento-indisponivel-sem-auth",
    perfilAntes.status < 300 && areaAntes?.disponivel === false,
    areaAntes,
  );

  await garantirResponsavelDesenvolvimento(
    base,
    h,
    familiaId,
    admin.usuario.id,
    laurinha.id,
  );

  const lista = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, { headers: h }),
  );
  const catalogo = (lista.corpo?.desafios ?? []).filter(
    (d) => d.origem === "catalogo",
  );
  reg(
    "DEV-F01-biblioteca-listada",
    lista.status < 300 &&
      catalogo.length >= 6 &&
      catalogo.every((d) => d.nome && d.dificuldade),
    { total: lista.corpo?.total, catalogo: catalogo.length, amostra: catalogo[0] },
  );

  const filtro = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?categoria=linguagem`,
      { headers: h },
    ),
  );
  reg(
    "DEV-F01-filtro-categoria",
    filtro.status < 300 &&
      (filtro.corpo?.desafios?.length ?? 0) >= 1 &&
      filtro.corpo.desafios.every((d) => d.categoria === "linguagem"),
    { total: filtro.corpo?.total },
  );

  const viaQuery = await json(
    await fetch(`${base}/desafios?pessoaId=${laurinha.id}`, { headers: h }),
  );
  reg(
    "GET-desafios-com-pessoaId",
    viaQuery.status < 300 && (viaQuery.corpo?.total ?? 0) >= 6,
    { total: viaQuery.corpo?.total },
  );

  const perfilDepois = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas/${laurinha.id}`, {
      headers: h,
    }),
  );
  const areaDepois = perfilDepois.corpo?.areas?.find(
    (a) => a.id === "desenvolvimento",
  );
  reg(
    "perfil-desenvolvimento-disponivel",
    perfilDepois.status < 300 && areaDepois?.disponivel === true,
    areaDepois,
  );

  const inicio = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: h }),
  );
  const cartaoLaurinha = inicio.corpo?.cartoes?.find(
    (c) => c.pessoaId === laurinha.id,
  );
  reg(
    "cartao-area-desenvolvimento",
    !!cartaoLaurinha?.areasAutorizadas?.desenvolvimento,
    cartaoLaurinha?.areasAutorizadas,
  );

  const email = `colab.dl01.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora DL01",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colaboradora DL01" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };

  const colabNegado = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, { headers: hc }),
  );
  reg("colab-negado-biblioteca-laurinha", colabNegado.status === 403, {
    status: colabNegado.status,
  });

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
