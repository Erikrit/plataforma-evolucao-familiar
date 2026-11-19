/** Smoke INC-DL-REC-02: Disponíveis/Resgatadas + novo débito (CT-20261119-002 / ADR-013). */
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

  // Garante saldo suficiente
  const desafio = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Saldo REC ${Date.now()}`,
        dificuldade: "desafiadora",
      }),
    }),
  );
  await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId: desafio.corpo.id,
        resultado: "concluiu",
        execucaoChave: `dl-rec-${randomUUID()}`,
      }),
    }),
  );

  const rec = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/recompensas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Premio REC ${Date.now()}`,
        custo: 5,
      }),
    }),
  );
  const recompensaId = rec.corpo?.id;
  reg(
    "criar-recompensa-disponivel",
    rec.status < 300 &&
      rec.corpo?.disponivelParaResgate === true &&
      rec.corpo?.estadoDisponibilidade === "disponiveis",
    rec.corpo,
  );

  const chave = `sol-rec-${randomUUID()}`;
  const r1 = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ recompensaId, solicitacaoChave: chave }),
    }),
  );
  reg(
    "primeiro-resgate",
    r1.status < 300 &&
      r1.corpo?.idempotente === false &&
      r1.corpo?.custoAplicado === 5 &&
      r1.corpo?.estadoDisponibilidade === "resgatadas",
    r1.corpo,
  );

  const retry = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ recompensaId, solicitacaoChave: chave }),
    }),
  );
  reg(
    "idempotencia-solicitacaoChave",
    retry.status < 300 &&
      retry.corpo?.idempotente === true &&
      retry.corpo?.id === r1.corpo?.id,
    retry.corpo,
  );

  const bloqueado = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        recompensaId,
        solicitacaoChave: `sol-rec-${randomUUID()}`,
      }),
    }),
  );
  reg("bloqueia-segunda-geracao", bloqueado.status === 409, {
    status: bloqueado.status,
  });

  const disponiveis = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/recompensas?disponibilidade=disponiveis`,
      { headers: h },
    ),
  );
  const resgatadas = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/recompensas?disponibilidade=resgatadas`,
      { headers: h },
    ),
  );
  reg(
    "abas-mutuamente-exclusivas",
    !disponiveis.corpo?.recompensas?.some((r) => r.id === recompensaId) &&
      resgatadas.corpo?.recompensas?.some(
        (r) =>
          r.id === recompensaId &&
          r.estadoDisponibilidade === "resgatadas" &&
          r.ultimoResgate?.id === r1.corpo?.id,
      ),
    {
      disponiveis: disponiveis.corpo?.total,
      resgatadas: resgatadas.corpo?.total,
    },
  );

  const saldoAntesReabrir = (
    await json(
      await fetch(`${base}/pessoas/${laurinha.id}/estrelas`, { headers: h }),
    )
  ).corpo?.saldoDisponivel;

  const reabrir = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/recompensas/${recompensaId}/disponibilizar`,
      { method: "POST", headers: h },
    ),
  );
  const saldoAposReabrir = (
    await json(
      await fetch(`${base}/pessoas/${laurinha.id}/estrelas`, { headers: h }),
    )
  ).corpo?.saldoDisponivel;
  reg(
    "disponibilizar-sem-estorno",
    reabrir.status < 300 &&
      reabrir.corpo?.disponivelParaResgate === true &&
      reabrir.corpo?.geracaoDisponibilidade === 1 &&
      saldoAposReabrir === saldoAntesReabrir,
    { reabrir: reabrir.corpo, saldoAntesReabrir, saldoAposReabrir },
  );

  // Credita mais se necessário para segundo resgate
  let saldo = saldoAposReabrir ?? 0;
  if (saldo < 5) {
    const d2 = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          nome: `Saldo2 REC ${Date.now()}`,
          dificuldade: "simples",
        }),
      }),
    );
    const p2 = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          desafioId: d2.corpo.id,
          resultado: "concluiu",
          execucaoChave: `dl-rec-${randomUUID()}`,
        }),
      }),
    );
    saldo = p2.corpo?.saldoAtual ?? saldo;
  }

  const r2 = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        recompensaId,
        solicitacaoChave: `sol-rec-${randomUUID()}`,
      }),
    }),
  );
  reg(
    "segundo-resgate-novo-debito",
    r2.status < 300 &&
      r2.corpo?.idempotente === false &&
      r2.corpo?.id !== r1.corpo?.id &&
      r2.corpo?.geracaoDisponibilidade === 1 &&
      r2.corpo?.custoAplicado === 5,
    r2.corpo,
  );

  const email = `colab.dlrec.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora DL Rec",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  await json(
    await fetch(`${base}/convites/${convite.corpo.token}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        senha: "colab-local",
        nome: "Colaboradora DL Rec",
      }),
    }),
  );
  const colab = await login(email, "colab-local");
  // Reabre de novo para testar authz
  await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/recompensas/${recompensaId}/disponibilizar`,
      { method: "POST", headers: h },
    ),
  );
  const colabNegado = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/recompensas/${recompensaId}/disponibilizar`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-sessao-token": colab.token,
        },
      },
    ),
  );
  reg("colab-negado-disponibilizar-recompensa", colabNegado.status === 403, {
    status: colabNegado.status,
  });

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
