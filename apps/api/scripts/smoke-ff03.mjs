/**
 * Smoke FF-03: ACE-05 (acumular responsabilidades) e ACE-07 (cartões filtrados).
 */
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { IDS_SEED, resolverPessoa } from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";
const prisma = new PrismaClient();

function hashSenha(senha) {
  const sal = randomBytes(16).toString("hex");
  return `${sal}:${scryptSync(senha, sal, 64).toString("hex")}`;
}

async function json(resposta) {
  const texto = await resposta.text();
  try {
    return { status: resposta.status, corpo: JSON.parse(texto) };
  } catch {
    return { status: resposta.status, corpo: texto };
  }
}

async function login(email, senha) {
  const resposta = await fetch(`${base}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const dados = await json(resposta);
  if (resposta.status >= 300) {
    throw new Error(`login ${email}: ${resposta.status} ${JSON.stringify(dados.corpo)}`);
  }
  return dados.corpo;
}

const resultados = [];
function registrar(nome, ok, detalhe) {
  resultados.push({ nome, ok, detalhe });
}

try {
  const adminSessao = await login(emailAdmin, senhaAdmin);
  const tokenAdmin = adminSessao.token;
  const familiaId = adminSessao.usuario.pessoa.familiaId;
  const headersAdmin = {
    "content-type": "application/json",
    "x-sessao-token": tokenAdmin,
  };

  const vovo = await resolverPessoa(base, headersAdmin, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });
  const laurinha = await resolverPessoa(base, headersAdmin, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });

  const acumulada = await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
    method: "POST",
    headers: headersAdmin,
    body: JSON.stringify({
      usuarioId: adminSessao.usuario.id,
      responsabilidade: "responsavel_desenvolvimento",
      pessoaAlvoId: laurinha.id,
    }),
  });
  const acumuladaJson = await json(acumulada);
  const authsAdmin = await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
    headers: headersAdmin,
  });
  const authsAdminJson = await json(authsAdmin);
  const responsabilidades = (authsAdminJson.corpo ?? []).map(
    (a) => a.responsabilidade,
  );
  registrar(
    "ACE-05",
    acumulada.status < 300 &&
      responsabilidades.includes("administrador") &&
      responsabilidades.includes("responsavel_desenvolvimento"),
    { responsabilidades, acumulada: acumuladaJson.corpo },
  );

  const emailLimitado = "colaboradora@pef.local";
  const senhaLimitada = "colab-local";
  const pessoaLimitada = await prisma.pessoa.upsert({
    where: { id: "pessoa_colab_seed" },
    update: { nome: "Colaboradora Externa", familiaId },
    create: {
      id: "pessoa_colab_seed",
      familiaId,
      nome: "Colaboradora Externa",
      vinculo: "colaboradora",
    },
  });
  const usuarioLimitado = await prisma.usuario.upsert({
    where: { email: emailLimitado },
    update: {
      pessoaId: pessoaLimitada.id,
      senhaHash: hashSenha(senhaLimitada),
    },
    create: {
      id: "usuario_colab_seed",
      pessoaId: pessoaLimitada.id,
      email: emailLimitado,
      senhaHash: hashSenha(senhaLimitada),
    },
  });

  await prisma.autorizacao.deleteMany({
    where: { usuarioId: usuarioLimitado.id },
  });
  const concessao = await fetch(`${base}/familias/${familiaId}/autorizacoes`, {
    method: "POST",
    headers: headersAdmin,
    body: JSON.stringify({
      usuarioId: usuarioLimitado.id,
      responsabilidade: "colaboradora_cuidados",
      pessoaAlvoId: vovo.id,
    }),
  });
  registrar("concessao-colaboradora", concessao.status < 300, {
    status: concessao.status,
  });

  const sessaoColab = await login(emailLimitado, senhaLimitada);
  const inicioColab = await fetch(
    `${base}/familias/${familiaId}/inicio`,
    { headers: { "x-sessao-token": sessaoColab.token } },
  );
  const inicioColabJson = await json(inicioColab);
  const nomesColab = (inicioColabJson.corpo?.cartoes ?? []).map((c) => c.nome);
  registrar(
    "ACE-07",
    inicioColab.status < 300 &&
      inicioColabJson.corpo?.filtradoPorAutorizacao === true &&
      nomesColab.includes("Vovó") &&
      !nomesColab.includes("Laurinha"),
    { nomesColab, filtrado: inicioColabJson.corpo?.filtradoPorAutorizacao },
  );

  const inicioAdmin = await fetch(`${base}/familias/${familiaId}/inicio`, {
    headers: headersAdmin,
  });
  const inicioAdminJson = await json(inicioAdmin);
  const nomesAdmin = (inicioAdminJson.corpo?.cartoes ?? []).map((c) => c.nome);
  registrar(
    "admin-ve-todos",
    nomesAdmin.includes("Vovó") && nomesAdmin.includes("Laurinha"),
    { nomesAdmin },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (erro) {
  console.error(
    JSON.stringify({
      ok: false,
      mensagem: erro instanceof Error ? erro.message : String(erro),
      resultados,
    }),
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
