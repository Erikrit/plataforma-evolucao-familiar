/** Smoke DL-03: DEV-F04/F05 participação + estrelas automáticas (ADR-008). */
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

  const desafioId = "desafio_cat_contar_passos"; // simples
  // Seed pode já ter deixado a brincadeira em Executadas (ADR-013).
  await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios/${desafioId}/disponibilizar`,
      { method: "POST", headers: h },
    ),
  );
  const chave1 = `dl03-${randomUUID()}`;

  const p1 = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "concluiu",
        execucaoChave: chave1,
      }),
    }),
  );
  reg(
    "DEV-F05-concluiu-simples-5",
    p1.status < 300 &&
      p1.corpo?.estrelasConcedidas === 5 &&
      p1.corpo?.dificuldadeAplicada === "simples" &&
      p1.corpo?.idempotente === false,
    p1.corpo,
  );

  const reenvio = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "concluiu",
        execucaoChave: chave1,
      }),
    }),
  );
  reg(
    "idempotencia-mesma-execucao",
    reenvio.status < 300 &&
      reenvio.corpo?.idempotente === true &&
      reenvio.corpo?.id === p1.corpo?.id &&
      reenvio.corpo?.saldoAtual === p1.corpo?.saldoAtual,
    { id: reenvio.corpo?.id, saldo: reenvio.corpo?.saldoAtual },
  );

  const reabrir = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios/${desafioId}/disponibilizar`,
      { method: "POST", headers: h },
    ),
  );
  reg(
    "disponibilizar-antes-nova-participacao",
    reabrir.status < 300 &&
      reabrir.corpo?.disponivelParaNovaParticipacao === true,
    reabrir.corpo,
  );

  const p2 = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "participou",
        observacao: "Tentou com apoio",
        execucaoChave: `dl03-${randomUUID()}`,
      }),
    }),
  );
  reg(
    "DEV-F04-participou-simples-3-obs",
    p2.status < 300 &&
      p2.corpo?.estrelasConcedidas === 3 &&
      p2.corpo?.observacao === "Tentou com apoio" &&
      p2.corpo?.saldoAtual === (p1.corpo?.saldoAtual ?? 0) + 3,
    p2.corpo,
  );

  const personalizada = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Desafiadora DL03 ${Date.now()}`,
        dificuldade: "desafiadora",
      }),
    }),
  );
  const p3 = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId: personalizada.corpo.id,
        resultado: "concluiu",
        execucaoChave: `dl03-${randomUUID()}`,
      }),
    }),
  );
  reg(
    "DEV-F05-desafiadora-concluiu-15",
    p3.status < 300 && p3.corpo?.estrelasConcedidas === 15,
    p3.corpo,
  );

  const snapshotAntes = p3.corpo?.estrelasConcedidas;
  await json(
    await fetch(`${base}/desafios/${personalizada.corpo.id}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ dificuldade: "simples" }),
    }),
  );
  const estrelas = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/estrelas`, { headers: h }),
  );
  const movimentoP3 = estrelas.corpo?.movimentosRecentes?.find(
    (m) => m.participacaoId === p3.corpo?.id,
  );
  reg(
    "snapshot-nao-reescreve-passado",
    estrelas.status < 300 &&
      snapshotAntes === 15 &&
      movimentoP3?.quantidade === 15,
    { snapshotAntes, movimento: movimentoP3 },
  );

  const correcao = await json(
    await fetch(`${base}/participacoes/${p2.corpo.id}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ resultado: "concluiu" }),
    }),
  );
  reg(
    "correcao-ajusta-estrelas",
    correcao.status < 300 &&
      correcao.corpo?.estrelasConcedidas === 5 &&
      correcao.corpo?.substituiId === p2.corpo?.id &&
      correcao.corpo?.saldoAtual ===
        (p2.corpo?.saldoAtual ?? 0) + 2 + 15,
    // p2 tinha +3; após p3 +15; correção +2 (3→5) => saldo p2+15+2
    {
      saldo: correcao.corpo?.saldoAtual,
      esperado: (p2.corpo?.saldoAtual ?? 0) + 17,
    },
  );

  const rejeitaEstrelasCliente = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "nao_realizou",
        execucaoChave: `dl03-${randomUUID()}`,
      }),
    }),
  );
  reg(
    "DEV-F04-rejeita-nao-realizou",
    rejeitaEstrelasCliente.status === 400,
    { status: rejeitaEstrelasCliente.status },
  );

  const email = `colab.dl03.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora DL03",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ senha: "colab-local", nome: "Colaboradora DL03" }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };
  const colabNegado = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: hc,
      body: JSON.stringify({
        desafioId,
        resultado: "participou",
        execucaoChave: `dl03-${randomUUID()}`,
      }),
    }),
  );
  reg("colab-negado-participacao", colabNegado.status === 403, {
    status: colabNegado.status,
  });

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
