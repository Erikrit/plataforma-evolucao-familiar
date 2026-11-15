/** Smoke CV-01: ACE-C01 cadastro sem OCR; ACE-C02 anexo compartilhado. */
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

  const anexo = await json(
    await fetch(`${base}/familias/${familiaId}/anexos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        pessoaId: vovo.id,
        nomeArquivo: "receita-ficticia.pdf",
        mimeTipo: "application/pdf",
        conteudoBase64: Buffer.from("%PDF-fake-receita").toString("base64"),
      }),
    }),
  );
  reg("criar-anexo", anexo.status < 300 && !!anexo.corpo?.id, anexo.corpo);

  const med1 = await json(
    await fetch(`${base}/pessoas/${vovo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: "Losartana",
        horarios: ["08:00"],
        anexoIds: [anexo.corpo.id],
        ativar: false,
      }),
    }),
  );
  reg(
    "ACE-C01-rascunho-sem-ocr",
    med1.status < 300 &&
      med1.corpo?.status === "rascunho" &&
      !med1.corpo?.instrucoes?.includes("OCR"),
    med1.corpo,
  );

  const ativacao = await json(
    await fetch(`${base}/medicamentos/${med1.corpo.id}/ativacao`, {
      method: "POST",
      headers: h,
    }),
  );
  reg("conferencia-ativar", ativacao.status < 300 && ativacao.corpo?.status === "ativo", ativacao.corpo);

  const med2 = await json(
    await fetch(`${base}/pessoas/${vovo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: "AAS",
        horarios: ["20:00"],
        anexoIds: [anexo.corpo.id],
        ativar: true,
      }),
    }),
  );

  const vinculo = await json(
    await fetch(`${base}/anexos/${anexo.corpo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        medicamentoIds: [med1.corpo.id, med2.corpo.id],
      }),
    }),
  );
  reg(
    "ACE-C02-anexo-multiplos",
    vinculo.status < 300 && (vinculo.corpo?.length ?? 0) >= 2,
    vinculo.corpo,
  );

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
