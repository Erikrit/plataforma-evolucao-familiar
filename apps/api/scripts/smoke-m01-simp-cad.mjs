/** Smoke M01 v1.5 §11: cadastro + conta sem duplicar pessoa; entrada contextual; autoacompanhamento. */
import { IDS_SEED, resolverPessoa } from "./lib-authz-smoke.mjs";

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
  if (r.status >= 300) {
    throw new Error(`login ${email}: ${JSON.stringify(d.corpo)}`);
  }
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

  const stamp = Date.now();
  const nomePessoa = `Pessoa SIMP ${stamp}`;
  const emailConta = `simp.conta.${stamp}@pef.local`;

  const criada = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ nome: nomePessoa }),
    }),
  );
  reg(
    "M01-SIMP-CAD-criar-pessoa",
    criada.status < 300 && !!criada.corpo?.id && !criada.corpo?.possuiConta,
    criada.corpo,
  );
  const pessoaId = criada.corpo?.id;

  const conviteConta = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email: emailConta,
        nomeConvidado: nomePessoa,
        pessoaContaId: pessoaId,
      }),
    }),
  );
  reg(
    "M01-SIMP-CONTA-convite",
    conviteConta.status < 300 &&
      conviteConta.corpo?.pessoaContaId === pessoaId &&
      !conviteConta.corpo?.responsabilidade,
    conviteConta.corpo,
  );

  const ativacao = await json(
    await fetch(`${base}/convites/${conviteConta.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "simp-local-1" }),
    }),
  );
  reg(
    "M01-SIMP-CONTA-ativar-mesmo-id",
    ativacao.status < 300 &&
      ativacao.corpo?.pessoaId === pessoaId &&
      ativacao.corpo?.reutilizouPessoa === true,
    ativacao.corpo,
  );

  const sessao = await login(emailConta, "simp-local-1");
  const hConta = { "x-sessao-token": sessao.token };
  const pessoaApos = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas/${pessoaId}`, {
      headers: hConta,
    }),
  );
  reg(
    "M01-SIMP-AUTO-ver-proprio",
    pessoaApos.status < 300 &&
      pessoaApos.corpo?.id === pessoaId &&
      Array.isArray(pessoaApos.corpo?.areas),
    { status: pessoaApos.status, areas: pessoaApos.corpo?.areas },
  );

  const cuidadosProprio = await json(
    await fetch(`${base}/pessoas/${pessoaId}/cuidados/hoje`, {
      headers: hConta,
    }),
  );
  reg(
    "M01-SIMP-AUTO-consultar-cuidados",
    cuidadosProprio.status < 300,
    { status: cuidadosProprio.status },
  );

  const progNegada = await json(
    await fetch(`${base}/pessoas/${pessoaId}/medicamentos`, {
      method: "POST",
      headers: {
        ...hConta,
        "content-type": "application/json",
      },
      body: JSON.stringify({ nome: "Med SIMP bloqueada" }),
    }),
  );
  reg(
    "M01-SIMP-AUTO-sem-programacao-automatica",
    progNegada.status === 403,
    { status: progNegada.status, corpo: progNegada.corpo },
  );

  const inicioConta = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: hConta }),
  );
  const contextos = inicioConta.corpo?.contextos ?? [];
  const dest = inicioConta.corpo?.destinoEntrada ?? null;
  const soPropria =
    contextos.length >= 1 &&
    contextos.every((c) => c.pessoaId === pessoaId);
  reg(
    "M01-SIMP-ENTRADA-contextos-proprios",
    inicioConta.status < 300 &&
      Array.isArray(contextos) &&
      soPropria &&
      (contextos.length === 1
        ? typeof dest === "string" && dest.includes(pessoaId)
        : contextos.length !== 1 || dest == null),
    { contextos, destinoEntrada: dest },
  );

  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });
  const emailExt = `simp.ext.${stamp}@pef.local`;
  const conviteExt = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email: emailExt,
        nomeConvidado: "Externo SIMP",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  const ativExt = await json(
    await fetch(`${base}/convites/${conviteExt.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "simp-ext-1", nome: "Externo SIMP" }),
    }),
  );
  reg(
    "M01-SIMP-CONTA-externo-cria-pessoa",
    ativExt.status < 300 &&
      ativExt.corpo?.reutilizouPessoa === false &&
      ativExt.corpo?.pessoaId &&
      ativExt.corpo.pessoaId !== vovo.id,
    ativExt.corpo,
  );

  const inicioAdmin = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, {
      headers: { "x-sessao-token": admin.token },
    }),
  );
  reg(
    "M01-SIMP-ENTRADA-admin-campos",
    inicioAdmin.status < 300 &&
      Array.isArray(inicioAdmin.corpo?.contextos) &&
      ("destinoEntrada" in (inicioAdmin.corpo ?? {})),
    {
      nContextos: inicioAdmin.corpo?.contextos?.length,
      destinoEntrada: inicioAdmin.corpo?.destinoEntrada,
    },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (e) {
  console.error(
    JSON.stringify({
      ok: false,
      mensagem: String(e?.message ?? e),
      resultados,
    }),
  );
  process.exit(1);
}
