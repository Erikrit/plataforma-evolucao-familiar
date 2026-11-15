/** Smoke CV-04: ACE-C08 consultas/exames/apoio com poucos campos. */
import { garantirResponsavelCuidados, resolverPessoa, IDS_SEED } from "./lib-authz-smoke.mjs";

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

  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });

  await garantirResponsavelCuidados(
    base,
    h,
    familiaId,
    admin.usuario.id,
    vovo.id,
  );

  const consulta = await json(
    await fetch(`${base}/pessoas/${vovo.id}/consultas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        dataHora: new Date().toISOString(),
        especialidadeOuDescricao: "Clínico geral",
      }),
    }),
  );
  reg(
    "ACE-C08-consulta",
    consulta.status < 300 && !!consulta.corpo?.id,
    consulta.corpo,
  );

  const realizada = await json(
    await fetch(`${base}/consultas/${consulta.corpo.id}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ status: "realizada" }),
    }),
  );
  reg("consulta-realizada", realizada.status < 300 && realizada.corpo?.status === "realizada", realizada.corpo);

  const exame = await json(
    await fetch(`${base}/pessoas/${vovo.id}/exames`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        descricao: "Hemograma",
        consultaId: consulta.corpo.id,
      }),
    }),
  );
  reg("ACE-C08-exame", exame.status < 300 && !!exame.corpo?.id, exame.corpo);

  const apoio = await json(
    await fetch(`${base}/pessoas/${vovo.id}/atividades-apoio`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ descricao: "Companhia no almoço" }),
    }),
  );
  reg("ACE-C08-apoio", apoio.status < 300 && !!apoio.corpo?.id, apoio.corpo);

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
