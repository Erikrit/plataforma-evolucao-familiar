/** Smoke INC-DL-EXEC-01: Explorar/Executadas + disponibilizar (CT-20261119-001 / ADR-013). */
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

  const criado = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `Exec ADR013 ${Date.now()}`,
        dificuldade: "simples",
      }),
    }),
  );
  const desafioId = criado.corpo?.id;
  reg("criar-desafio-teste", criado.status < 300 && !!desafioId, criado.corpo);

  const explorarAntes = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?disponibilidade=explorar`,
      { headers: h },
    ),
  );
  reg(
    "explorar-contem-novo",
    explorarAntes.status < 300 &&
      explorarAntes.corpo?.desafios?.some((d) => d.id === desafioId),
    { total: explorarAntes.corpo?.total },
  );

  const chave = `dl-exec-${randomUUID()}`;
  const part = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "concluiu",
        execucaoChave: chave,
      }),
    }),
  );
  reg(
    "participacao-fecha-disponibilidade",
    part.status < 300 && part.corpo?.idempotente === false,
    part.corpo,
  );

  const explorarDepois = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?disponibilidade=explorar`,
      { headers: h },
    ),
  );
  const executadas = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?disponibilidade=executadas`,
      { headers: h },
    ),
  );
  const itemExec = executadas.corpo?.desafios?.find((d) => d.id === desafioId);
  reg(
    "sai-explorar-entra-executadas",
    !explorarDepois.corpo?.desafios?.some((d) => d.id === desafioId) &&
      itemExec?.estadoDisponibilidade === "executadas" &&
      itemExec?.disponivelParaNovaParticipacao === false &&
      itemExec?.ultimaParticipacao?.id === part.corpo?.id,
    { itemExec },
  );

  const bloqueada = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "participou",
        execucaoChave: `dl-exec-${randomUUID()}`,
      }),
    }),
  );
  reg("bloqueia-sem-reativar", bloqueada.status === 409, {
    status: bloqueada.status,
  });

  const reenvio = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "concluiu",
        execucaoChave: chave,
      }),
    }),
  );
  reg(
    "idempotencia-mesmo-com-executada",
    reenvio.status < 300 &&
      reenvio.corpo?.idempotente === true &&
      reenvio.corpo?.id === part.corpo?.id,
    reenvio.corpo,
  );

  const email = `colab.dlexec.${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email,
        nomeConvidado: "Colaboradora DL Exec",
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
        nome: "Colaboradora DL Exec",
      }),
    }),
  );
  const colab = await login(email, "colab-local");
  const hc = {
    "content-type": "application/json",
    "x-sessao-token": colab.token,
  };
  const colabNegado = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios/${desafioId}/disponibilizar`,
      { method: "POST", headers: hc },
    ),
  );
  reg("colab-negado-disponibilizar", colabNegado.status === 403, {
    status: colabNegado.status,
  });

  const reabrir = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios/${desafioId}/disponibilizar`,
      { method: "POST", headers: h },
    ),
  );
  reg(
    "disponibilizar-reabre-explorar",
    reabrir.status < 300 &&
      reabrir.corpo?.disponivelParaNovaParticipacao === true &&
      reabrir.corpo?.jaEstavaDisponivel === false,
    reabrir.corpo,
  );

  const explorarReaberta = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?disponibilidade=explorar`,
      { headers: h },
    ),
  );
  reg(
    "aparece-em-explorar-apos-reativar",
    explorarReaberta.corpo?.desafios?.some((d) => d.id === desafioId),
    { total: explorarReaberta.corpo?.total },
  );

  const nova = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        desafioId,
        resultado: "participou",
        execucaoChave: `dl-exec-${randomUUID()}`,
      }),
    }),
  );
  reg(
    "nova-participacao-apos-reativar",
    nova.status < 300 &&
      nova.corpo?.idempotente === false &&
      nova.corpo?.id !== part.corpo?.id &&
      nova.corpo?.estrelasConcedidas === 3,
    nova.corpo,
  );

  const guardados = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios?guardados=1`, {
      headers: h,
    }),
  );
  reg("endpoint-guardados-ainda-responde", guardados.status < 300, {
    status: guardados.status,
    total: guardados.corpo?.total,
  });

  const falhou = resultados.some((r) => !r.ok);
  console.log(JSON.stringify({ ok: !falhou, resultados }, null, 2));
  if (falhou) process.exitCode = 1;
} catch (erro) {
  console.error(JSON.stringify({ ok: false, erro: String(erro) }));
  process.exitCode = 1;
}
