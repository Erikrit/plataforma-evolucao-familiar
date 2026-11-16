/** Smoke DL-02: DEV-F02 personalizada; DEV-F03 guardar/retirar. */
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

  await garantirResponsavelDesenvolvimento(
    base,
    h,
    familiaId,
    admin.usuario.id,
    laurinha.id,
  );

  const soNome = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ nome: `Brincadeira DL02 ${Date.now()}` }),
    }),
  );
  reg(
    "DEV-F02-so-nome-dificuldade-simples",
    soNome.status < 300 &&
      soNome.corpo?.origem === "personalizada" &&
      soNome.corpo?.dificuldade === "simples" &&
      soNome.corpo?.categoria == null,
    soNome.corpo,
  );

  const comDiff = await json(
    await fetch(`${base}/familias/${familiaId}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Media DL02 ${Date.now()}`,
        dificuldade: "media",
        pessoaId: laurinha.id,
      }),
    }),
  );
  reg(
    "DEV-F02-dificuldade-alteravel",
    comDiff.status < 300 && comDiff.corpo?.dificuldade === "media",
    comDiff.corpo,
  );

  const semNome = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({}),
    }),
  );
  reg("DEV-F02-nome-obrigatorio", semNome.status === 400, {
    status: semNome.status,
  });

  const catalogoId = "desafio_cat_desenho_livre";
  const guardar = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios/${catalogoId}/guardar`,
      { method: "POST", headers: h },
    ),
  );
  reg(
    "DEV-F03-guardar",
    guardar.status < 300 && guardar.corpo?.guardado === true,
    guardar.corpo,
  );

  const listaGuardados = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?guardados=true`,
      { headers: h },
    ),
  );
  reg(
    "DEV-F03-listar-guardados",
    listaGuardados.status < 300 &&
      (listaGuardados.corpo?.desafios?.length ?? 0) >= 1 &&
      listaGuardados.corpo.desafios.every((d) => d.guardado === true) &&
      listaGuardados.corpo.desafios.some((d) => d.id === catalogoId),
    { total: listaGuardados.corpo?.total },
  );

  const listaGeral = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, { headers: h }),
  );
  const item = listaGeral.corpo?.desafios?.find((d) => d.id === catalogoId);
  const personalizada = listaGeral.corpo?.desafios?.find(
    (d) => d.id === soNome.corpo?.id,
  );
  reg(
    "lista-marca-guardado-e-personalizada",
    item?.guardado === true && personalizada?.origem === "personalizada",
    { item, personalizadaId: personalizada?.id },
  );

  const patch = await json(
    await fetch(`${base}/desafios/${soNome.corpo.id}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({
        dificuldade: "desafiadora",
        categoria: "criatividade",
      }),
    }),
  );
  reg(
    "alterar-metadados-futuros",
    patch.status < 300 &&
      patch.corpo?.dificuldade === "desafiadora" &&
      patch.corpo?.categoria === "criatividade",
    patch.corpo,
  );

  const retirar = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios/${catalogoId}/guardar`,
      { method: "DELETE", headers: h },
    ),
  );
  reg(
    "DEV-F03-retirar",
    retirar.status < 300 && retirar.corpo?.guardado === false,
    retirar.corpo,
  );

  const aposRetirar = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?guardados=true`,
      { headers: h },
    ),
  );
  reg(
    "DEV-F03-sem-prazo-nem-pendencia",
    aposRetirar.status < 300 &&
      !(aposRetirar.corpo?.desafios ?? []).some((d) => d.id === catalogoId),
    { total: aposRetirar.corpo?.total },
  );

  const email = `colab.dl02.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora DL02",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colaboradora DL02" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };

  const colabCriar = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: hc,
      body: JSON.stringify({ nome: "Tentativa colab" }),
    }),
  );
  reg("colab-negado-criar", colabCriar.status === 403, {
    status: colabCriar.status,
  });

  const colabGuardar = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios/${catalogoId}/guardar`,
      { method: "POST", headers: hc },
    ),
  );
  reg("colab-negado-guardar", colabGuardar.status === 403, {
    status: colabGuardar.status,
  });

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
