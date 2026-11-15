/** Smoke CV-05: ACE-C09 anexos privados; ACE-C10 histórico derivado. */
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

  const anexo = await json(
    await fetch(`${base}/familias/${familiaId}/anexos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        pessoaId: vovo.id,
        nomeArquivo: "exame.pdf",
        mimeTipo: "application/pdf",
        conteudoBase64: Buffer.from("conteudo-privado").toString("base64"),
      }),
    }),
  );

  const privado = await json(
    await fetch(`${base}/anexos/${anexo.corpo.id}`, { headers: h }),
  );
  reg(
    "ACE-C09-admin-ok",
    privado.status < 300 && privado.corpo?.acesso === "privado_autenticado",
    privado.corpo,
  );

  const email = `colab.cv05.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colab CV05",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: laurinha.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colab CV05" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const negado = await json(
    await fetch(`${base}/anexos/${anexo.corpo.id}`, {
      headers: { "x-sessao-token": colab.token },
    }),
  );
  reg("ACE-C09-negado-outra-pessoa", negado.status === 403, {
    status: negado.status,
  });

  const hist = await json(
    await fetch(`${base}/pessoas/${vovo.id}/historico`, { headers: h }),
  );
  reg(
    "ACE-C10-historico-derivado",
    hist.status < 300 &&
      hist.corpo?.derivadoDeRegistrosOrigem === true &&
      Array.isArray(hist.corpo?.eventos),
    { total: hist.corpo?.eventos?.length },
  );

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
