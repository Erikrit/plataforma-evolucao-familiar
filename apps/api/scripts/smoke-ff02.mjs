/**
 * Smoke FF-02: ACE-01, ACE-02, ACE-09 (cadastro só com nome; sem conta).
 */
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

  const vovo = await fetch(`${base}/familias/${familiaId}/pessoas`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nome: "Vovó" }),
  });
  const vovoJson = await json(vovo);
  registrar(
    "ACE-01",
    vovo.status < 300 && vovoJson.corpo?.nome === "Vovó" && !vovoJson.corpo?.possuiConta,
    vovoJson.corpo,
  );

  const laurinha = await fetch(`${base}/familias/${familiaId}/pessoas`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nome: "Laurinha" }),
  });
  const laurinhaJson = await json(laurinha);
  registrar(
    "ACE-02",
    laurinha.status < 300 &&
      laurinhaJson.corpo?.nome === "Laurinha" &&
      !laurinhaJson.corpo?.possuiConta,
    laurinhaJson.corpo,
  );

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
  const nomes = (listaJson.corpo ?? []).map((p) => p.nome);
  registrar(
    "listar-pessoas",
    lista.status < 300 && nomes.includes("Vovó") && nomes.includes("Laurinha"),
    { nomes },
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
