/** Utilitário compartilhado dos smokes: concede responsabilidade clínica explícita. */

export const IDS_SEED = {
  vovo: "pessoa_vovo_seed",
  laurinha: "pessoa_laurinha_seed",
};

export async function json(r) {
  const t = await r.text();
  try {
    return { status: r.status, corpo: JSON.parse(t) };
  } catch {
    return { status: r.status, corpo: t };
  }
}

/** Prefere pessoa canônica do seed (id fixo) para não duplicar nomes na UI local. */
export async function resolverPessoa(
  base,
  headers,
  familiaId,
  { idSeed, nome },
) {
  const lista = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas`, { headers }),
  );
  const pessoas = Array.isArray(lista.corpo) ? lista.corpo : [];
  const porId = pessoas.find((p) => p.id === idSeed);
  if (porId) return porId;
  const porNome = pessoas.find((p) => p.nome === nome);
  if (porNome) return porNome;
  const criada = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas`, {
      method: "POST",
      headers,
      body: JSON.stringify({ nome }),
    }),
  );
  if (criada.status >= 300) {
    throw new Error(`criar pessoa ${nome}: ${JSON.stringify(criada.corpo)}`);
  }
  return criada.corpo;
}

export async function garantirResponsavelCuidados(
  base,
  headers,
  familiaId,
  usuarioId,
  pessoaAlvoId,
) {
  const r = await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      usuarioId,
      responsabilidade: "responsavel_cuidados",
      pessoaAlvoId,
    }),
  });
  const texto = await r.text();
  let corpo;
  try {
    corpo = JSON.parse(texto);
  } catch {
    corpo = texto;
  }
  if (r.status >= 300) {
    throw new Error(
      `falha ao conceder responsavel_cuidados: ${JSON.stringify(corpo)}`,
    );
  }
  return corpo;
}

export async function garantirResponsavelDesenvolvimento(
  base,
  headers,
  familiaId,
  usuarioId,
  pessoaAlvoId,
) {
  const r = await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      usuarioId,
      responsabilidade: "responsavel_desenvolvimento",
      // M01 §16: data fictícia exigida para Desenvolvimento.
      dataNascimentoAlvo: "2018-05-10",
      pessoaAlvoId,
    }),
  });
  const texto = await r.text();
  let corpo;
  try {
    corpo = JSON.parse(texto);
  } catch {
    corpo = texto;
  }
  if (r.status >= 300) {
    throw new Error(
      `falha ao conceder responsavel_desenvolvimento: ${JSON.stringify(corpo)}`,
    );
  }
  return corpo;
}

export async function login(base, email, senha, familiaSlug = "oliveira") {
  const r = await fetch(`${base}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha, familiaSlug }),
  });
  const texto = await r.text();
  let corpo;
  try {
    corpo = JSON.parse(texto);
  } catch {
    corpo = texto;
  }
  if (r.status >= 300) {
    throw new Error(`login: ${JSON.stringify(corpo)}`);
  }
  return corpo;
}
