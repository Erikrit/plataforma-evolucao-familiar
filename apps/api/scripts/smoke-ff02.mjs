/**
 * Smoke FF-02: ACE-01, ACE-02, ACE-09 (cadastro só com nome; sem conta).
 */
import { IDS_SEED, resolverPessoa } from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const email = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senha = process.env.PEF_ADMIN_SENHA ?? "admin-local";

async function json(resposta) {
  const texto = await resposta.text();
  try {
    return { status: resposta.status, corpo: JSON.parse(texto) };
  } catch {
    return { status: resposta.status, corpo: texto };
  }
}

const resultados = [];

function registrar(nome, ok, detalhe) {
  resultados.push({ nome, ok, detalhe });
}

try {
  const login = await fetch(`${base}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const loginJson = await json(login);
  if (login.status !== 201 && login.status !== 200) {
    throw new Error(`login falhou: ${login.status} ${JSON.stringify(loginJson.corpo)}`);
  }
  const token = loginJson.corpo.token;
  const familiaId = loginJson.corpo.usuario.pessoa.familiaId;
  registrar("login-admin", true, { familiaId });

  const headers = {
    "content-type": "application/json",
    "x-sessao-token": token,
  };

  const stamp = Date.now();
  const nomeA = `FF02-A-${stamp}`;
  const nomeB = `FF02-B-${stamp}`;
  const pessoaA = await fetch(`${base}/familias/${familiaId}/pessoas`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nome: nomeA }),
  });
  const pessoaAJson = await json(pessoaA);
  registrar(
    "ACE-01",
    pessoaA.status < 300 &&
      pessoaAJson.corpo?.nome === nomeA &&
      !pessoaAJson.corpo?.possuiConta,
    pessoaAJson.corpo,
  );

  const pessoaB = await fetch(`${base}/familias/${familiaId}/pessoas`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nome: nomeB }),
  });
  const pessoaBJson = await json(pessoaB);
  registrar(
    "ACE-02",
    pessoaB.status < 300 &&
      pessoaBJson.corpo?.nome === nomeB &&
      !pessoaBJson.corpo?.possuiConta,
    pessoaBJson.corpo,
  );

  const vovoCanon = await resolverPessoa(base, headers, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });
  const laurinhaCanon = await resolverPessoa(base, headers, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });
  registrar("seed-vovo-laurinha", !!vovoCanon?.id && !!laurinhaCanon?.id, {
    vovoId: vovoCanon?.id,
    laurinhaId: laurinhaCanon?.id,
  });

  const semNome = await fetch(`${base}/familias/${familiaId}/pessoas`, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });
  registrar("ACE-09-rejeita-sem-nome", semNome.status >= 400, {
    status: semNome.status,
  });

  const lista = await fetch(`${base}/familias/${familiaId}/pessoas`, { headers });
  const listaJson = await json(lista);
  const pessoas = listaJson.corpo ?? [];
  const nomes = pessoas.map((p) => p.nome);
  const ids = pessoas.map((p) => p.id);
  registrar(
    "listar-pessoas",
    lista.status < 300 &&
      nomes.includes(nomeA) &&
      nomes.includes(nomeB) &&
      ids.includes(vovoCanon.id) &&
      ids.includes(laurinhaCanon.id),
    { nomes, ids },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (erro) {
  console.error(
    JSON.stringify({
      ok: false,
      mensagem: erro instanceof Error ? erro.message : String(erro),
      resultados,
    }),
  );
  process.exit(1);
}
