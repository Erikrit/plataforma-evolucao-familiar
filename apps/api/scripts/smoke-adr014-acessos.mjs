/**
 * Smoke ADR-014 / CT-20261119-003: catálogo fechado, área na listagem,
 * recusa de administrador/participante_limitado e preservação do último admin.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { IDS_SEED, json, resolverPessoa } from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";
const prisma = new PrismaClient();

const resultados = [];
const reg = (n, ok, d) => resultados.push({ nome: n, ok, detalhe: d });

function hash(s) {
  const sal = randomBytes(16).toString("hex");
  return `${sal}:${scryptSync(s, sal, 64).toString("hex")}`;
}

async function login(email, senha) {
  const r = await fetch(`${base}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const d = await json(r);
  if (r.status >= 300) {
    throw new Error(`login ${email}: ${JSON.stringify(d.corpo)}`);
  }
  return d.corpo;
}

try {
  const admin = await login(emailAdmin, senhaAdmin);
  const familiaId = admin.usuario.pessoa.familiaId;
  const hAdmin = {
    "content-type": "application/json",
    "x-sessao-token": admin.token,
  };

  const vovo = await resolverPessoa(base, hAdmin, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });
  const laurinha = await resolverPessoa(base, hAdmin, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });

  const recusaAdmin = await json(
    await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
      method: "POST",
      headers: hAdmin,
      body: JSON.stringify({
        usuarioId: admin.usuario.id,
        responsabilidade: "administrador",
        pessoaAlvoId: null,
      }),
    }),
  );
  reg(
    "recusa_conceder_administrador",
    recusaAdmin.status === 400,
    { status: recusaAdmin.status, corpo: recusaAdmin.corpo },
  );

  const recusaLimitado = await json(
    await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
      method: "POST",
      headers: hAdmin,
      body: JSON.stringify({
        usuarioId: admin.usuario.id,
        responsabilidade: "participante_limitado",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  reg(
    "recusa_conceder_participante_limitado",
    recusaLimitado.status === 400,
    { status: recusaLimitado.status },
  );

  const emailAlvo = `adr014.alvo.${Date.now()}@pef.local`;
  const convite = (
    await json(
      await fetch(`${base}/familias/${familiaId}/convites`, {
        method: "POST",
        headers: hAdmin,
        body: JSON.stringify({
          email: emailAlvo,
          nomeConvidado: "Alvo ADR014",
          responsabilidade: "colaboradora_cuidados",
          pessoaAlvoId: vovo.id,
        }),
      }),
    )
  ).corpo;
  await fetch(`${base}/convites/${convite.token}/ativar`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ senha: "temp-local", nome: "Alvo ADR014" }),
  });
  const alvo = await login(emailAlvo, "temp-local");

  const concedeCuidadosResp = await json(
    await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
      method: "POST",
      headers: hAdmin,
      body: JSON.stringify({
        usuarioId: alvo.usuario.id,
        responsabilidade: "responsavel_cuidados",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  reg(
    "concede_cuidados_responsavel",
    concedeCuidadosResp.status < 300,
    { status: concedeCuidadosResp.status },
  );

  const concedeDesenv = await json(
    await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
      method: "POST",
      headers: hAdmin,
      body: JSON.stringify({
        usuarioId: alvo.usuario.id,
        responsabilidade: "responsavel_desenvolvimento",
        pessoaAlvoId: laurinha.id,
      }),
    }),
  );
  reg(
    "concede_desenvolvimento_responsavel",
    concedeDesenv.status < 300,
    { status: concedeDesenv.status },
  );

  const conviteAdmin = await json(
    await fetch(`${base}/familias/${familiaId}/convites`, {
      method: "POST",
      headers: hAdmin,
      body: JSON.stringify({
        email: `adr014.admin.${Date.now()}@pef.local`,
        responsabilidade: "administrador",
        pessoaAlvoId: vovo.id,
      }),
    }),
  );
  reg(
    "recusa_convite_administrador",
    conviteAdmin.status === 400,
    { status: conviteAdmin.status },
  );

  const acessos = await json(
    await fetch(`${base}/familias/${familiaId}/acessos`, { headers: hAdmin }),
  );
  const itens = Array.isArray(acessos.corpo?.itens) ? acessos.corpo.itens : [];
  const itemColab = itens.find(
    (i) =>
      i.participanteNome === "Alvo ADR014" &&
      i.pessoaAcompanhadaId === vovo.id &&
      i.papel === "Colaborador",
  );
  const itemRespCuid = itens.find(
    (i) =>
      i.participanteNome === "Alvo ADR014" &&
      i.pessoaAcompanhadaId === vovo.id &&
      i.papel === "Responsável" &&
      i.area === "Cuidados",
  );
  const itemDesenv = itens.find(
    (i) =>
      i.participanteNome === "Alvo ADR014" &&
      i.pessoaAcompanhadaId === laurinha.id &&
      i.area === "Desenvolvimento",
  );
  const itemAdmin = itens.find((i) => i.papel === "Administrador");
  reg("listagem_tem_area_cuidados", itemRespCuid?.area === "Cuidados", itemRespCuid);
  reg(
    "listagem_tem_area_desenvolvimento",
    itemDesenv?.area === "Desenvolvimento",
    itemDesenv,
  );
  reg("listagem_admin_area_null", itemAdmin?.area == null, itemAdmin?.area);
  reg("listagem_integrante_area_cuidados", itemColab?.area === "Cuidados", itemColab);
  reg(
    "listagem_tem_participanteUsuarioId",
    typeof itemRespCuid?.participanteUsuarioId === "string" &&
      itemRespCuid.participanteUsuarioId.length > 0,
    itemRespCuid?.participanteUsuarioId,
  );

  // AC-05/AC-06: dois vínculos; retirar só Cuidados; após novo login mantém Desenvolvimento.
  const hAlvoAntesRevoga = {
    "content-type": "application/json",
    "x-sessao-token": alvo.token,
  };
  const rotinaAntes = await json(
    await fetch(`${base}/pessoas/${vovo.id}/cuidados/hoje`, {
      headers: hAlvoAntesRevoga,
    }),
  );
  const desenvAntes = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      headers: hAlvoAntesRevoga,
    }),
  );
  reg(
    "ac05_alvo_acessa_cuidados_e_desenvolvimento",
    rotinaAntes.status < 300 && desenvAntes.status < 300,
    { rotina: rotinaAntes.status, desenv: desenvAntes.status },
  );

  const cuidadosDoAlvoNaVovo = itens.filter(
    (i) =>
      i.participanteUsuarioId === alvo.usuario.id &&
      i.area === "Cuidados" &&
      i.pessoaAcompanhadaId === vovo.id &&
      i.ativo,
  );
  let revogasOk = cuidadosDoAlvoNaVovo.length > 0;
  for (const item of cuidadosDoAlvoNaVovo) {
    const rev = await json(
      await fetch(`${base}/familias/${familiaId}/autorizacoes/${item.id}`, {
        method: "DELETE",
        headers: hAdmin,
      }),
    );
    if (!(rev.status < 300 && rev.corpo?.ativa === false)) revogasOk = false;
  }
  reg("ac06_revoga_apenas_cuidados_da_vovo", revogasOk, {
    qtd: cuidadosDoAlvoNaVovo.length,
  });

  const sessaoAposRevoga = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      headers: hAlvoAntesRevoga,
    }),
  );
  reg(
    "ac06_sessao_invalidada_apos_revoga",
    sessaoAposRevoga.status === 401,
    { status: sessaoAposRevoga.status },
  );

  const alvoNovo = await login(emailAlvo, "temp-local");
  const hAlvoNovo = {
    "content-type": "application/json",
    "x-sessao-token": alvoNovo.token,
  };
  const desenvDepois = await json(
    await fetch(`${base}/pessoas/${laurinha.id}/desafios`, {
      headers: hAlvoNovo,
    }),
  );
  const rotinaDepois = await json(
    await fetch(`${base}/pessoas/${vovo.id}/cuidados/hoje`, {
      headers: hAlvoNovo,
    }),
  );
  const acessosApos = await json(
    await fetch(`${base}/familias/${familiaId}/acessos`, { headers: hAdmin }),
  );
  const itensApos = Array.isArray(acessosApos.corpo?.itens)
    ? acessosApos.corpo.itens
    : [];
  const aindaTemDesenv = itensApos.some(
    (i) =>
      i.participanteUsuarioId === alvo.usuario.id &&
      i.area === "Desenvolvimento" &&
      i.pessoaAcompanhadaId === laurinha.id &&
      i.ativo,
  );
  const aindaTemCuidadosVovo = itensApos.some(
    (i) =>
      i.participanteUsuarioId === alvo.usuario.id &&
      i.area === "Cuidados" &&
      i.pessoaAcompanhadaId === vovo.id &&
      i.ativo,
  );
  reg(
    "ac06_desenvolvimento_permanece_apos_novo_login",
    desenvDepois.status < 300 && aindaTemDesenv,
    { status: desenvDepois.status, aindaTemDesenv },
  );
  reg(
    "ac06_cuidados_negado_apos_revoga",
    (rotinaDepois.status === 403 || rotinaDepois.status === 401) &&
      !aindaTemCuidadosVovo,
    { status: rotinaDepois.status, aindaTemCuidadosVovo },
  );

  // Atualiza token do alvo para checagens seguintes de cartões.
  alvo.token = alvoNovo.token;

  const inicio = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: hAdmin }),
  );
  const cartaoComConta = (inicio.corpo?.cartoes ?? []).find(
    (c) => c.possuiConta && c.usuarioId,
  );
  reg(
    "inicio_admin_recebe_usuarioId",
    Boolean(cartaoComConta?.usuarioId),
    cartaoComConta?.usuarioId ? "presente" : "ausente",
  );

  const hAlvo = { "x-sessao-token": alvo.token };
  const inicioAlvo = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: hAlvo }),
  );
  const cartoesAlvo = inicioAlvo.corpo?.cartoes ?? [];
  reg(
    "nao_admin_sem_usuarioId_nos_cartoes",
    cartoesAlvo.every((c) => !("usuarioId" in c) || c.usuarioId == null),
    cartoesAlvo.map((c) => ({ nome: c.nome, usuarioId: c.usuarioId })),
  );

  const adminAuth = await prisma.autorizacao.findFirst({
    where: {
      familiaId,
      usuarioId: admin.usuario.id,
      responsabilidade: "administrador",
      pessoaAlvoId: null,
      ativa: true,
    },
  });
  reg("admin_seed_encontrado", Boolean(adminAuth), adminAuth?.id);

  if (adminAuth) {
    const revogaUltimo = await json(
      await fetch(
        `${base}/familias/${familiaId}/autorizacoes/${adminAuth.id}`,
        { method: "DELETE", headers: hAdmin },
      ),
    );
    reg(
      "recusa_revogar_ultimo_administrador",
      revogaUltimo.status === 400,
      { status: revogaUltimo.status, corpo: revogaUltimo.corpo },
    );
    const aindaAtivo = await prisma.autorizacao.findFirst({
      where: { id: adminAuth.id, ativa: true },
    });
    reg("ultimo_admin_permanece_ativo", Boolean(aindaAtivo), aindaAtivo?.id);

    const emailSegundo = `adr014.admin2.${Date.now()}@pef.local`;
    const pessoaSegundo = await prisma.pessoa.create({
      data: {
        familiaId,
        nome: "Segundo Admin ADR014",
        vinculo: "familiar",
      },
    });
    const usuarioSegundo = await prisma.usuario.create({
      data: {
        pessoaId: pessoaSegundo.id,
        email: emailSegundo,
        senhaHash: hash("temp-local"),
      },
    });
    const authSegundo = await prisma.autorizacao.create({
      data: {
        familiaId,
        usuarioId: usuarioSegundo.id,
        responsabilidade: "administrador",
        pessoaAlvoId: null,
      },
    });

    const revogaExcedente = await json(
      await fetch(
        `${base}/familias/${familiaId}/autorizacoes/${authSegundo.id}`,
        { method: "DELETE", headers: hAdmin },
      ),
    );
    reg(
      "permite_revogar_admin_excedente",
      revogaExcedente.status < 300 && revogaExcedente.corpo?.ativa === false,
      { status: revogaExcedente.status },
    );
  }

  const falhas = resultados.filter((r) => !r.ok);
  console.log(JSON.stringify({ ok: falhas.length === 0, resultados }, null, 2));
  process.exit(falhas.length === 0 ? 0 : 1);
} catch (e) {
  console.error(e);
  console.log(
    JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2),
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
