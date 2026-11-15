/** Smoke FF-04: ACE-03 convite colaboradora→Vovó; ACE-04 negar Laurinha (URL). */
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
  if (r.status >= 300) throw new Error(`login ${email}: ${JSON.stringify(d.corpo)}`);
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

  async function pessoa(nome) {
    const lista = await json(
      await fetch(`${base}/familias/${familiaId}/pessoas`, { headers: h }),
    );
    const achada = (lista.corpo ?? []).find((p) => p.nome === nome);
    if (achada) return achada;
    return (
      await json(
        await fetch(`${base}/familias/${familiaId}/pessoas`, {
          method: "POST",
          headers: h,
          body: JSON.stringify({ nome }),
        }),
      )
    ).corpo;
  }

  const vovo = await pessoa("Vovó");
  const laurinha = await pessoa("Laurinha");
  const email = `colab.ff04.${Date.now()}@pef.local`;

  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora FF04",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  reg("criar-convite", convite.status < 300 && !!convite.corpo?.token, convite.corpo);

  const ativacao = await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colaboradora FF04" }),
    }),
  );
  reg("ACE-03-ativar", ativacao.status < 300, ativacao.corpo);

  const colab = await login(email, "colab-local");
  const inicio = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, {
      headers: { "x-sessao-token": colab.token },
    }),
  );
  const nomes = (inicio.corpo?.cartoes ?? []).map((c) => c.nome);
  reg(
    "ACE-03-escopo",
    nomes.includes("Vovó") && !nomes.includes("Laurinha"),
    { nomes },
  );

  const negado = await json(
    await fetch(
      `${base}/familias/${familiaId}/pessoas/${laurinha.id}`,
      { headers: { "x-sessao-token": colab.token } },
    ),
  );
  reg("ACE-04", negado.status === 403, { status: negado.status });

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (e) {
  console.error(JSON.stringify({ ok: false, mensagem: String(e?.message ?? e), resultados }));
  process.exit(1);
}
