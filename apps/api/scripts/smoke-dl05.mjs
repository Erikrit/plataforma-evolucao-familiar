/** Smoke DL-05/06: regressão UI-contratos — saldo, recompensas, histórico via M04, authz. */
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

  const perfil = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas/${laurinha.id}`, {
      headers: h,
    }),
  );
  const areaDev = perfil.corpo?.areas?.find((a) => a.id === "desenvolvimento");
  const areaHist = perfil.corpo?.areas?.find((a) => a.id === "historico");
  reg(
    "perfil-areas-desenvolvimento-e-historico",
    areaDev?.disponivel === true && areaHist?.disponivel === true,
    { areaDev, areaHist },
  );

  const desafios = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/desafios?disponibilidade=explorar`,
      { headers: h },
    ),
  );
  reg(
    "lista-desafios-ok",
    desafios.status < 300 && Array.isArray(desafios.corpo?.desafios),
    { status: desafios.status, total: desafios.corpo?.total },
  );

  let desafioId = desafios.corpo?.desafios?.[0]?.id;
  if (!desafioId) {
    const criado = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          nome: `DL05 ${Date.now()}`,
          dificuldade: "simples",
        }),
      }),
    );
    desafioId = criado.corpo?.id;
  }
  if (desafioId) {
    const part = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/participacoes`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          desafioId,
          resultado: "participou",
          execucaoChave: `smoke-dl05-${randomUUID()}`,
        }),
      }),
    );
    reg(
      "participacao-credita-estrelas",
      part.status < 300 &&
        typeof part.corpo?.estrelasConcedidas === "number" &&
        part.corpo.estrelasConcedidas > 0,
      { status: part.status, estrelas: part.corpo?.estrelasConcedidas },
    );
  } else {
    reg("participacao-credita-estrelas", false, "sem desafio no catálogo");
  }

  const estrelas = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/estrelas`, { headers: h }),
  );
  reg(
    "saldo-estrelas-ok",
    estrelas.status < 300 &&
      typeof estrelas.corpo?.saldoDisponivel === "number",
    {
      status: estrelas.status,
      saldo: estrelas.corpo?.saldoDisponivel,
    },
  );

  const nomeRec = `Smoke DL05 ${Date.now()}`;
  const custo = 1;
  const criada = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/recompensas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ nome: nomeRec, custo }),
    }),
  );
  reg(
    "criar-recompensa",
    criada.status < 300 && criada.corpo?.id,
    { status: criada.status, id: criada.corpo?.id },
  );

  if (criada.corpo?.id && (estrelas.corpo?.saldoDisponivel ?? 0) >= custo) {
    const resgate = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/resgates`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({ recompensaId: criada.corpo.id }),
      }),
    );
    reg(
      "resgatar-recompensa",
      resgate.status < 300,
      { status: resgate.status, corpo: resgate.corpo },
    );
  } else {
    reg("resgatar-recompensa", false, {
      motivo: "saldo insuficiente ou recompensa sem id",
      saldo: estrelas.corpo?.saldoDisponivel,
    });
  }

  const historico = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/historico`, { headers: h }),
  );
  reg(
    "historico-m04-com-auth-desenvolvimento",
    historico.status < 300 && Array.isArray(historico.corpo?.eventos),
    { status: historico.status, total: historico.corpo?.eventos?.length },
  );

  const emailColab = `colab-dl05-${Date.now()}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        email: emailColab,
        nomeConvidado: "Colab DL05",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  if (convite.status >= 300 || !convite.corpo?.token) {
    reg("colab-setup", false, convite);
  } else {
    const ativado = await json(
      await fetch(
        `${base}/convites/${encodeURIComponent(convite.corpo.token)}/ativar`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ senha: "colab-local-1", nome: "Colab DL05" }),
        },
      ),
    );
    const colab = await login(emailColab, "colab-local-1");
    const hColab = {
      "content-type": "application/json",
      "x-sessao-token": colab.token,
    };

    const negadoDesafios = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
        headers: hColab,
      }),
    );
    const negadoEstrelas = await json(
      await fetch(`${base}/pessoas/${laurinha.id}/estrelas`, {
        headers: hColab,
      }),
    );
    reg(
      "colaboradora-cuidados-negada-desenvolvimento",
      negadoDesafios.status === 403 && negadoEstrelas.status === 403,
      {
        desafios: negadoDesafios.status,
        estrelas: negadoEstrelas.status,
        ativado: ativado.status,
      },
    );
  }

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error(e);
  console.log(JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2));
  process.exitCode = 1;
}
