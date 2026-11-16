/** Smoke DL-04: DEV-F06 saldo/movimentos + recompensas/resgate sem saldo negativo. */
import {
  garantirResponsavelDesenvolvimento,
  resolverPessoa,
  IDS_SEED,
} from "./lib-authz-smoke.mjs";
import { randomUUID } from "node:crypto";

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

  const laurinha = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });
  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });

  await garantirResponsavelDesenvolvimento(
    base,
    h,
    familiaId,
    admin.usuario.id,
    laurinha.id,
  );

  // Garante saldo conhecido: crédito 15 (desafiadora concluiu)
  const desafio = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Saldo DL04 ${Date.now()}`,
        dificuldade: "desafiadora",
      }),
    }),
  );
  const credito = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId: desafio.corpo.id,
        resultado: "concluiu",
        execucaoChave: `dl04-cred-${randomUUID()}`,
      }),
    }),
  );
  const saldoAntes = credito.corpo?.saldoAtual;
  reg("credito-base", credito.status < 300 && saldoAntes >= 15, {
    saldoAntes,
  });

  const recompensa = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/recompensas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ nome: "Passeio no parque", custo: 10 }),
    }),
  );
  reg(
    "DEV-F06-criar-recompensa",
    recompensa.status < 300 &&
      recompensa.corpo?.nome === "Passeio no parque" &&
      recompensa.corpo?.custo === 10,
    recompensa.corpo,
  );

  const lista = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/recompensas`, { headers: h }),
  );
  reg(
    "listar-recompensas",
    lista.status < 300 &&
      (lista.corpo?.recompensas ?? []).some((r) => r.id === recompensa.corpo.id),
    { total: lista.corpo?.total },
  );

  const resgate = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ recompensaId: recompensa.corpo.id }),
    }),
  );
  reg(
    "DEV-F06-resgate",
    resgate.status < 300 &&
      resgate.corpo?.custoAplicado === 10 &&
      resgate.corpo?.saldoApos === saldoAntes - 10,
    resgate.corpo,
  );

  const custoNovo = await json(
    await fetch(`${base}/recompensas/${recompensa.corpo.id}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ custo: 99 }),
    }),
  );
  const estrelas = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/estrelas`, { headers: h }),
  );
  const resgateHist = estrelas.corpo?.resgatesRecentes?.find(
    (r) => r.id === resgate.corpo?.id,
  );
  const movDebito = estrelas.corpo?.movimentosRecentes?.find(
    (m) => m.resgateId === resgate.corpo?.id,
  );
  reg(
    "custo-historico-preservado",
    custoNovo.status < 300 &&
      custoNovo.corpo?.custo === 99 &&
      resgateHist?.custoAplicado === 10 &&
      resgateHist?.custoAtualCatalogo === 99 &&
      movDebito?.quantidade === -10,
    { custoNovo: custoNovo.corpo, resgateHist, movDebito },
  );
  reg(
    "saldo-e-movimentos",
    estrelas.status < 300 &&
      estrelas.corpo?.saldoDisponivel === saldoAntes - 10 &&
      movDebito?.tipo === "debito_resgate",
    { saldo: estrelas.corpo?.saldoDisponivel },
  );

  const cara = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/recompensas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Cara demais ${Date.now()}`,
        custo: saldoAntes + 1000,
      }),
    }),
  );
  const insuficiente = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ recompensaId: cara.corpo.id }),
    }),
  );
  reg("saldo-insuficiente", insuficiente.status === 409, {
    status: insuficiente.status,
  });

  // Concorrência: duas tentativas no limite do saldo restante
  const saldoAtual = (
    await json(
      await fetch(`${base}/pessoas/${laurinha.id}/estrelas`, { headers: h }),
    )
  ).corpo.saldoDisponivel;

  // Credita se saldo zerado/baixo para ter algo a resgatar em concorrência
  let s = saldoAtual;
  if (s < 5) {
    const d = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          nome: `Conc ${Date.now()}`,
          dificuldade: "simples",
        }),
      }),
    );
    const p = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          desafioId: d.corpo.id,
          resultado: "concluiu",
          execucaoChave: `dl04-c-${randomUUID()}`,
        }),
      }),
    );
    s = p.corpo.saldoAtual;
  }

  const premio = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/recompensas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Conc premio ${Date.now()}`,
        custo: s,
      }),
    }),
  );

  const [r1, r2] = await Promise.all([
    fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ recompensaId: premio.corpo.id }),
    }).then(json),
    fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ recompensaId: premio.corpo.id }),
    }).then(json),
  ]);
  const okCount = [r1, r2].filter((r) => r.status < 300).length;
  const failCount = [r1, r2].filter((r) => r.status === 409).length;
  const aposConc = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/estrelas`, { headers: h }),
  );
  reg(
    "concorrencia-sem-saldo-negativo",
    okCount === 1 &&
      failCount === 1 &&
      aposConc.corpo.saldoDisponivel === 0 &&
      aposConc.corpo.saldoDisponivel >= 0,
    {
      okCount,
      failCount,
      saldo: aposConc.corpo.saldoDisponivel,
      s1: r1.status,
      s2: r2.status,
    },
  );

  const email = `colab.dl04.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora DL04",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colaboradora DL04" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };
  const colabNegado = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/recompensas`, {
      method: "POST",
      headers: hc,
      body: JSON.stringify({ nome: "x", custo: 1 }),
    }),
  );
  reg("colab-negado-recompensa", colabNegado.status === 403, {
    status: colabNegado.status,
  });

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
