/** Smoke CV-03: ACE-C06 vigência/correção; ACE-C07 colaboradora negada. */
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

  const med = await json(
    await fetch(`${base}/pessoas/${vovo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Med-CV03-${Date.now()}`,
        horarios: ["10:00"],
        ativar: true,
      }),
    }),
  );

  const progAntes = med.corpo.programacoes?.length ?? 0;
  const novaProg = await json(
    await fetch(`${base}/medicamentos/${med.corpo.id}/programacao`, {
      method: "PUT",
      headers: h,
      body: JSON.stringify({ horarios: ["10:00", "22:00"] }),
    }),
  );
  reg(
    "ACE-C06-vigencia",
    novaProg.status < 300 &&
      (novaProg.corpo.programacoes?.length ?? 0) > progAntes,
    {
      antes: progAntes,
      depois: novaProg.corpo.programacoes?.length,
      fimAnterior: novaProg.corpo.programacoes?.find((p) => p.vigenciaFim),
    },
  );

  const hoje = new Date().toISOString().slice(0, 10);
  const dose = await json(
    await fetch(`${base}/medicamentos/${med.corpo.id}/doses/registros`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        data: hoje,
        horario: "10:00",
        situacao: "tomou_conforme_informacao",
      }),
    }),
  );
  const correcao = await json(
    await fetch(`${base}/registros-doses/${dose.corpo.id}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ situacao: "informou_nao_tomou" }),
    }),
  );
  reg(
    "ACE-C06-correcao",
    correcao.status < 300 &&
      correcao.corpo?.substituiId === dose.corpo.id &&
      correcao.corpo?.situacao === "informou_nao_tomou",
    correcao.corpo,
  );

  const encerrar = await json(
    await fetch(`${base}/medicamentos/${med.corpo.id}/encerramento`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ acao: "encerrar" }),
    }),
  );
  reg(
    "ACE-C06-encerramento",
    encerrar.status < 300 && encerrar.corpo?.status === "encerrado",
    encerrar.corpo,
  );

  const email = `colab.cv03.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora CV03",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colaboradora CV03" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };

  const medNovo = await json(
    await fetch(`${base}/pessoas/${vovo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Med-Colab-${Date.now()}`,
        horarios: ["11:00"],
        ativar: true,
      }),
    }),
  );

  const negadoProg = await json(
    await fetch(`${base}/medicamentos/${medNovo.corpo.id}/programacao`, {
      method: "PUT",
      headers: hc,
      body: JSON.stringify({ horarios: ["12:00"] }),
    }),
  );
  reg("ACE-C07-negado-programacao", negadoProg.status === 403, {
    status: negadoProg.status,
  });

  const negadoLaurinha = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/cuidados/hoje`, { headers: hc }),
  );
  reg("ACE-C07-negado-laurinha", negadoLaurinha.status === 403, {
    status: negadoLaurinha.status,
  });

  const relatoOk = await json(
    await fetch(`${base}/medicamentos/${medNovo.corpo.id}/doses/registros`, {
      method: "POST",
      headers: hc,
      body: JSON.stringify({
        data: hoje,
        horario: "11:00",
        situacao: "tomou_conforme_informacao",
      }),
    }),
  );
  reg("colab-pode-relato", relatoOk.status < 300, relatoOk.corpo);

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
