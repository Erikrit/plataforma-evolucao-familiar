/** Smoke CV-02: ACE-C03 rotina; ACE-C04 sem auto-registro; ACE-C05 autoria. */
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

  let vovo = (
    await json(await fetch(`${base}/familias/${familiaId}/pessoas`, { headers: h }))
  ).corpo.find((p) => p.nome === "Vovó");
  if (!vovo) {
    vovo = (
      await json(
        await fetch(`${base}/familias/${familiaId}/pessoas`, {
          method: "POST",
          headers: h,
          body: JSON.stringify({ nome: "Vovó" }),
        }),
      )
    ).corpo;
  }

  const med = await json(
    await fetch(`${base}/pessoas/${vovo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Vitamina-CV02-${Date.now()}`,
        horarios: ["09:00", "21:00"],
        ativar: true,
      }),
    }),
  );
  reg("medicamento-ativo", med.status < 300, med.corpo);

  const hoje = new Date().toISOString().slice(0, 10);
  const rotinaAntes = await json(
    await fetch(`${base}/pessoas/${vovo.id}/cuidados/hoje?data=${hoje}`, {
      headers: h,
    }),
  );
  const cartoes = rotinaAntes.corpo?.secoes?.medicamentos ?? [];
  const alvo = cartoes.find((c) => c.medicamentoId === med.corpo.id);
  reg(
    "ACE-C03-rotina",
    rotinaAntes.status < 300 &&
      alvo?.situacao === "sem_confirmacao" &&
      alvo?.confirmaAoTocar === false,
    { alvo, regra: rotinaAntes.corpo?.regra },
  );
  reg(
    "ACE-C04-sem-auto",
    alvo?.confirmaAoTocar === false && alvo?.registroId === null,
    alvo,
  );

  const dose = await json(
    await fetch(`${base}/medicamentos/${med.corpo.id}/doses/registros`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        data: hoje,
        horario: "09:00",
        situacao: "tomou_conforme_informacao",
      }),
    }),
  );
  reg(
    "ACE-C05-autoria",
    dose.status < 300 &&
      dose.corpo?.registradoPorId === admin.usuario.id &&
      dose.corpo?.situacao === "tomou_conforme_informacao",
    dose.corpo,
  );

  const dup = await json(
    await fetch(`${base}/medicamentos/${med.corpo.id}/doses/registros`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        data: hoje,
        horario: "09:00",
        situacao: "informou_nao_tomou",
      }),
    }),
  );
  reg("ACE-C05-sem-duplicata", dup.status >= 400, { status: dup.status });

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
