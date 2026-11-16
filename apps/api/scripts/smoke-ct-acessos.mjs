/** Smoke CT-20261116-001: metadados de acessos (FUN-04/FUN-07) sem ampliar permissões. */
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
  if (r.status >= 300) throw new Error(`login ${email}: ${JSON.stringify(d.corpo)}`);
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

  const emailColab = `ct.acessos.${Date.now()}@pef.local`;
  const convite = (
    await json(
      await fetch(`${base}/familias/${familiaId}/convites`, {
        method: "POST",
        headers: hAdmin,
        body: JSON.stringify({
          email: emailColab,
          nomeConvidado: "Colab CT Acessos",
          responsabilidade: "colaboradora_cuidados",
          pessoaAlvoId: vovo.id,
        }),
      }),
    )
  ).corpo;
  await fetch(`${base}/convites/${convite.token}/ativar`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ senha: "temp-local", nome: "Colab CT Acessos" }),
  });
  const colab = await login(emailColab, "temp-local");
  const hColab = { "x-sessao-token": colab.token };

  const acessosAdmin = await json(
    await fetch(`${base}/familias/${familiaId}/acessos`, { headers: hAdmin }),
  );
  reg(
    "admin_lista_acessos_200",
    acessosAdmin.status === 200,
    `status=${acessosAdmin.status}`,
  );
  reg(
    "admin_modo_administracao",
    acessosAdmin.corpo?.modo === "administracao",
    acessosAdmin.corpo?.modo,
  );
  reg(
    "admin_somente_leitura_false",
    acessosAdmin.corpo?.somenteLeitura === false,
    acessosAdmin.corpo?.somenteLeitura,
  );

  const itensAdmin = Array.isArray(acessosAdmin.corpo?.itens)
    ? acessosAdmin.corpo.itens
    : [];
  const papeisOk = itensAdmin.every((i) =>
    ["Administrador", "Responsável", "Colaborador"].includes(i.papel),
  );
  reg("papeis_mvp_apenas_tres", papeisOk && itensAdmin.length > 0, {
    qtd: itensAdmin.length,
    papeis: [...new Set(itensAdmin.map((i) => i.papel))],
  });

  const colabNoAdmin = itensAdmin.find(
    (i) =>
      i.participanteNome === "Colab CT Acessos" &&
      i.pessoaAcompanhadaId === vovo.id &&
      i.papel === "Colaborador" &&
      i.ativo === true,
  );
  reg("admin_ve_colaborador_sobre_vovo", Boolean(colabNoAdmin), colabNoAdmin?.id);

  const semCamposSensiveis = itensAdmin.every(
    (i) =>
      !("operacoes" in i) &&
      !("escopos" in i) &&
      !("medicamentos" in i) &&
      !("documento" in i),
  );
  reg("sem_matriz_nem_dados_sensiveis", semCamposSensiveis, true);

  const acessosColab = await json(
    await fetch(`${base}/familias/${familiaId}/acessos`, { headers: hColab }),
  );
  reg(
    "colab_lista_200",
    acessosColab.status === 200,
    `status=${acessosColab.status}`,
  );
  reg(
    "colab_modo_proprios_dados",
    acessosColab.corpo?.modo === "proprios_dados",
    acessosColab.corpo?.modo,
  );
  reg(
    "colab_somente_leitura",
    acessosColab.corpo?.somenteLeitura === true,
    acessosColab.corpo?.somenteLeitura,
  );
  const itensColab = Array.isArray(acessosColab.corpo?.itens)
    ? acessosColab.corpo.itens
    : [];
  reg(
    "colab_nao_ve_acessos_admin_da_familia",
    itensColab.length === 0 ||
      itensColab.every((i) => i.pessoaAcompanhadaId === colab.usuario.pessoa.id),
    { qtd: itensColab.length },
  );

  const emailVovo = `vovo.ct.${Date.now()}@pef.local`;
  const existenteVovo = await prisma.usuario.findUnique({
    where: { pessoaId: vovo.id },
  });
  if (existenteVovo) {
    await prisma.usuario.update({
      where: { id: existenteVovo.id },
      data: { email: emailVovo, senhaHash: hash("vovo-local") },
    });
  } else {
    await prisma.usuario.create({
      data: {
        id: `usuario_vovo_ct_${Date.now()}`,
        pessoaId: vovo.id,
        email: emailVovo,
        senhaHash: hash("vovo-local"),
      },
    });
  }
  const vovoLogin = await login(emailVovo, "vovo-local");
  const acessosVovo = await json(
    await fetch(`${base}/familias/${familiaId}/acessos`, {
      headers: { "x-sessao-token": vovoLogin.token },
    }),
  );
  reg(
    "vovo_modo_proprios_dados",
    acessosVovo.corpo?.modo === "proprios_dados",
    acessosVovo.corpo?.modo,
  );
  const itensVovo = Array.isArray(acessosVovo.corpo?.itens)
    ? acessosVovo.corpo.itens
    : [];
  reg(
    "vovo_ve_quem_acessa_seus_dados",
    itensVovo.some(
      (i) =>
        i.participanteNome === "Colab CT Acessos" &&
        i.papel === "Colaborador" &&
        i.pessoaAcompanhadaId === vovo.id &&
        i.ativo === true,
    ),
    { qtd: itensVovo.length },
  );
  reg(
    "vovo_somente_leitura",
    acessosVovo.corpo?.somenteLeitura === true,
    acessosVovo.corpo?.somenteLeitura,
  );
  reg(
    "vovo_nao_lista_admin_familia",
    !itensVovo.some((i) => i.papel === "Administrador"),
    itensVovo.map((i) => i.papel),
  );

  const inicio = await json(
    await fetch(`${base}/familias/${familiaId}/inicio`, { headers: hAdmin }),
  );
  reg(
    "inicio_inclui_acessos",
    inicio.status === 200 && inicio.corpo?.acessos?.modo === "administracao",
    inicio.corpo?.acessos?.modo,
  );

  const autorizacoesProprias = await json(
    await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
      headers: hColab,
    }),
  );
  reg(
    "get_autorizacoes_ainda_proprias",
    autorizacoesProprias.status === 200 &&
      Array.isArray(autorizacoesProprias.corpo) &&
      autorizacoesProprias.corpo.every((a) => a.pessoaAlvoId === vovo.id),
    { qtd: autorizacoesProprias.corpo?.length },
  );

  const falhas = resultados.filter((r) => !r.ok);
  console.log(JSON.stringify({ ok: falhas.length === 0, resultados }, null, 2));
  process.exit(falhas.length === 0 ? 0 : 1);
} catch (e) {
  console.error(e);
  console.log(JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2));
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
