/**
 * FF-NASC-ACE-01 a 04 (Módulo 01 §16): data de nascimento exigida para Desenvolvimento.
 * Dados fictícios; requer API em API_URL e banco descartável.
 */
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";

const prisma = new PrismaClient();
const base = (process.env.API_URL ?? "http://localhost:3001").replace(/\/$/, "");
const referencia = `${Date.now().toString(36)}${randomBytes(2).toString("hex")}`;
const CODIGO = "DATA_NASCIMENTO_OBRIGATORIA";
let checagens = 0;

function conferir(nome, condicao, detalhe) {
  assert.ok(condicao, `${nome} ${detalhe ? JSON.stringify(detalhe) : ""}`);
  checagens += 1;
  console.log(`PASS ${nome}`);
}

async function chamar(caminho, { metodo = "GET", token, corpo } = {}) {
  const headers = {};
  if (token) headers["x-sessao-token"] = token;
  if (corpo) headers["content-type"] = "application/json";
  const resposta = await fetch(base + caminho, {
    method: metodo,
    headers,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const texto = await resposta.text();
  let dados = null;
  try {
    dados = JSON.parse(texto);
  } catch {
    dados = texto;
  }
  return { status: resposta.status, dados };
}

async function entrar(slug, email, senha) {
  const resposta = await chamar("/sessoes", {
    metodo: "POST",
    corpo: { familiaSlug: slug, email, senha },
  });
  assert.equal(resposta.status, 201, JSON.stringify(resposta.dados));
  return resposta.dados;
}

async function criarFamilia(rotulo) {
  const slug = `nasc-${rotulo}-${referencia}`;
  const email = `nasc-${rotulo}-${referencia}@pef.example`;
  const senha = `Fixtura-Nasc-${rotulo}-${referencia}`;
  const { familia } = await provisionarFamiliaComAdmin(prisma, {
    slug,
    nomeFamilia: `Família fictícia ${rotulo}`,
    nomeAdmin: "Administração fictícia",
    emailAdmin: email,
    senhaAdmin: senha,
  });
  const sessao = await entrar(slug, email, senha);
  return { slug, familiaId: familia.id, token: sessao.token, usuarioId: sessao.usuario.id };
}

async function criarPessoa(familia, nome) {
  const resposta = await chamar(`/familias/${familia.familiaId}/pessoas`, {
    metodo: "POST",
    token: familia.token,
    corpo: { nome },
  });
  assert.equal(resposta.status, 201, JSON.stringify(resposta.dados));
  return resposta.dados;
}

/** Cria participante com conta própria (não administrador) pelo fluxo de convite. */
async function criarParticipante(familia) {
  const pessoa = await criarPessoa(familia, "Participante fictício");
  const email = `nasc-part-${referencia}@pef.example`;
  const convite = await chamar(`/familias/${familia.familiaId}/convites`, {
    metodo: "POST",
    token: familia.token,
    corpo: { email, nomeConvidado: pessoa.nome, pessoaContaId: pessoa.id },
  });
  assert.ok(convite.status < 300, JSON.stringify(convite.dados));
  const senha = `Fixtura-Part-${referencia}`;
  const ativacao = await chamar(`/convites/${encodeURIComponent(convite.dados.token)}/ativar`, {
    metodo: "POST",
    corpo: { senha, familiaSlug: familia.slug },
  });
  assert.ok(ativacao.status < 300, JSON.stringify(ativacao.dados));
  const sessao = await entrar(familia.slug, email, senha);
  return { token: sessao.token, usuarioId: sessao.usuario.id };
}

function conceder(familia, usuarioId, pessoaAlvoId, extra = {}) {
  return chamar(`/familias/${familia.familiaId}/autorizacoes`, {
    metodo: "POST",
    token: familia.token,
    corpo: { usuarioId, responsabilidade: "responsavel_desenvolvimento", pessoaAlvoId, ...extra },
  });
}

const dataIso = (valor) => (valor ? new Date(valor).toISOString().slice(0, 10) : null);

try {
  const familia = await criarFamilia("a");
  const outra = await criarFamilia("b");
  const participante = await criarParticipante(familia);

  // FF-NASC-ACE-01
  const crianca = await criarPessoa(familia, "Criança fictícia");
  conferir("FF-NASC-ACE-01 cadastro só com nome", Boolean(crianca.id) && crianca.dataNascimento === null);

  // FF-NASC-ACE-02 — concessão
  const semData = await conceder(familia, participante.usuarioId, crianca.id);
  conferir(
    "FF-NASC-ACE-02 concessão sem data pede a data",
    semData.status === 400 && semData.dados?.codigo === CODIGO,
    semData,
  );
  const nenhuma = await prisma.autorizacao.count({
    where: { familiaId: familia.familiaId, pessoaAlvoId: crianca.id, ativa: true },
  });
  conferir("FF-NASC-ACE-02 recusa não cria autorização", nenhuma === 0);
  const futura = await conceder(familia, participante.usuarioId, crianca.id, {
    dataNascimentoAlvo: "2999-01-01",
  });
  const inexistente = await conceder(familia, participante.usuarioId, crianca.id, {
    dataNascimentoAlvo: "2019-02-30",
  });
  conferir("FF-NASC-ACE-02 data futura recusada", futura.status === 400, futura);
  conferir("FF-NASC-ACE-02 data inexistente recusada", inexistente.status === 400, inexistente);
  const comData = await conceder(familia, participante.usuarioId, crianca.id, {
    dataNascimentoAlvo: "2018-05-10",
  });
  const gravada = await prisma.pessoa.findUnique({ where: { id: crianca.id } });
  conferir(
    "FF-NASC-ACE-02 concessão com data grava data e acesso",
    comData.status === 201 && dataIso(gravada?.dataNascimento) === "2018-05-10",
    comData,
  );

  // FF-NASC-ACE-02 — convite
  const irma = await criarPessoa(familia, "Irmã fictícia");
  const conviteSemData = await chamar(`/familias/${familia.familiaId}/convites`, {
    metodo: "POST",
    token: familia.token,
    corpo: {
      email: `nasc-conv-${referencia}@pef.example`,
      responsabilidade: "responsavel_desenvolvimento",
      pessoaAlvoId: irma.id,
    },
  });
  conferir(
    "FF-NASC-ACE-02 convite de Desenvolvimento sem data pede a data",
    conviteSemData.status === 400 && conviteSemData.dados?.codigo === CODIGO,
    conviteSemData,
  );
  const conviteComData = await chamar(`/familias/${familia.familiaId}/convites`, {
    metodo: "POST",
    token: familia.token,
    corpo: {
      email: `nasc-conv-${referencia}@pef.example`,
      responsabilidade: "responsavel_desenvolvimento",
      pessoaAlvoId: irma.id,
      dataNascimentoAlvo: "2016-09-01",
    },
  });
  const irmaGravada = await prisma.pessoa.findUnique({ where: { id: irma.id } });
  conferir(
    "FF-NASC-ACE-02 convite com data grava a data",
    conviteComData.status < 300 && dataIso(irmaGravada?.dataNascimento) === "2016-09-01",
    conviteComData,
  );
  const apagarComConvite = await chamar(`/familias/${familia.familiaId}/pessoas/${irma.id}`, {
    metodo: "PATCH",
    token: familia.token,
    corpo: { dataNascimento: null },
  });
  conferir(
    "FF-NASC convite pendente de Desenvolvimento impede apagar a data",
    apagarComConvite.status === 400 && apagarComConvite.dados?.codigo === CODIGO,
    apagarComConvite,
  );
  const cuidados = await chamar(`/familias/${familia.familiaId}/autorizacoes`, {
    metodo: "POST",
    token: familia.token,
    corpo: {
      usuarioId: participante.usuarioId,
      responsabilidade: "responsavel_cuidados",
      pessoaAlvoId: (await criarPessoa(familia, "Avó fictícia")).id,
    },
  });
  conferir("FF-NASC Cuidados continua sem exigir data", cuidados.status === 201, cuidados);

  // FF-NASC-ACE-03 — pessoa com Desenvolvimento anterior à regra, sem data
  const legado = await criarPessoa(familia, "Criança fictícia anterior");
  await prisma.autorizacao.create({
    data: {
      familiaId: familia.familiaId,
      usuarioId: participante.usuarioId,
      responsabilidade: "responsavel_desenvolvimento",
      pessoaAlvoId: legado.id,
    },
  });
  const agora = new Date();
  await prisma.progressoFaseJogo.create({
    data: {
      familiaId: familia.familiaId,
      pessoaId: legado.id,
      jogoId: "memoria",
      fase: 1,
      primeiraExploracaoEm: agora,
      versaoPrimeiraExploracao: 1,
      ultimaAberturaEm: agora,
      versaoUltimaAbertura: 1,
      concluidaEm: agora,
      versaoConclusao: 1,
      chaveConclusao: randomBytes(16).toString("hex"),
      nomeNaConclusao: "Memória de figuras",
      categoriaNaConclusao: "memoria_atencao",
    },
  });
  const perfil = await chamar(`/familias/${familia.familiaId}/pessoas/${legado.id}`, {
    token: participante.token,
  });
  conferir(
    "FF-NASC-ACE-03 responsável vê que falta a data",
    perfil.status === 200 && perfil.dados?.dataNascimento === null,
    perfil,
  );
  const vinculo = await chamar(`/familias/${familia.familiaId}/pessoas/${legado.id}`, {
    metodo: "PATCH",
    token: participante.token,
    corpo: { vinculo: "Outro" },
  });
  conferir("FF-NASC-ACE-03 responsável não edita outros dados do perfil", vinculo.status === 403, vinculo);
  const informada = await chamar(`/familias/${familia.familiaId}/pessoas/${legado.id}`, {
    metodo: "PATCH",
    token: participante.token,
    corpo: { dataNascimento: "2017-11-20" },
  });
  const progresso = await prisma.progressoFaseJogo.count({
    where: { pessoaId: legado.id, concluidaEm: { not: null } },
  });
  conferir(
    "FF-NASC-ACE-03 responsável informa a data e o progresso continua",
    informada.status === 200 && dataIso(informada.dados?.dataNascimento) === "2017-11-20" && progresso === 1,
    informada,
  );
  const intrusa = await chamar(`/familias/${familia.familiaId}/pessoas/${legado.id}`, {
    metodo: "PATCH",
    token: outra.token,
    corpo: { dataNascimento: "2017-01-01" },
  });
  conferir("FF-NASC isolamento entre famílias", intrusa.status >= 400 && intrusa.status !== 500, intrusa);

  // FF-NASC-ACE-04 — corrigir sem apagar e sem reescrever registros
  const apagar = await chamar(`/familias/${familia.familiaId}/pessoas/${legado.id}`, {
    metodo: "PATCH",
    token: familia.token,
    corpo: { dataNascimento: null },
  });
  conferir(
    "FF-NASC-ACE-04 data não pode ser apagada com Desenvolvimento ativo",
    apagar.status === 400 && apagar.dados?.codigo === CODIGO,
    apagar,
  );
  const corrigida = await chamar(`/familias/${familia.familiaId}/pessoas/${legado.id}`, {
    metodo: "PATCH",
    token: familia.token,
    corpo: { dataNascimento: "2015-03-03" },
  });
  const progressoDepois = await prisma.progressoFaseJogo.findMany({ where: { pessoaId: legado.id } });
  conferir(
    "FF-NASC-ACE-04 correção mantém registros anteriores",
    corrigida.status === 200
      && dataIso(corrigida.dados?.dataNascimento) === "2015-03-03"
      && progressoDepois.length === 1
      && progressoDepois[0].concluidaEm !== null,
    corrigida,
  );

  console.log(`smoke-ff-nasc: ${checagens} checagens OK`);
} finally {
  await prisma.$disconnect();
}
