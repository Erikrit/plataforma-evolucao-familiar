/**
 * Smoke E1-03: isolamento API ponta a ponta (E1-ACE-05/06/07).
 * Requer API em API_URL e famílias provisionáveis.
 */
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const prisma = new PrismaClient();
const stamp = Date.now();
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

async function json(r) {
  const t = await r.text();
  try {
    return { status: r.status, corpo: JSON.parse(t), bruto: t };
  } catch {
    return { status: r.status, corpo: t, bruto: t };
  }
}

async function login(email, senha, familiaSlug) {
  return json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, senha, familiaSlug }),
    }),
  );
}

function headers(token) {
  return {
    "content-type": "application/json",
    "x-sessao-token": token,
  };
}

try {
  const slugA = `iso-a-${stamp}`;
  const slugB = `iso-b-${stamp}`;
  const emailA = `iso.a.${stamp}@pef.local`;
  const senhaA = `iso-a-${stamp}-segura`;
  const emailB = `iso.b.${stamp}@pef.local`;
  const senhaB = `iso-b-${stamp}-segura`;

  const famA = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Iso A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Iso Admin A ${stamp}`,
    emailAdmin: emailA,
    senhaAdmin: senhaA,
  });
  const famB = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Iso B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Iso Admin B ${stamp}`,
    emailAdmin: emailB,
    senhaAdmin: senhaB,
  });

  const sessA = await login(emailA, senhaA, slugA);
  const sessB = await login(emailB, senhaB, slugB);
  reg(
    "login-A-e-B",
    sessA.status < 300 && sessB.status < 300,
    { a: sessA.status, b: sessB.status },
  );
  const hA = headers(sessA.corpo.token);
  const hB = headers(sessB.corpo.token);
  const idFamA = famA.familia.id;
  const idFamB = famB.familia.id;
  const pessoaAdminA = famA.pessoa.id;
  const pessoaAdminB = famB.pessoa.id;

  // Pessoa acompanhada em A + concessão clínica ao admin A
  const pessoaA = await json(
    await fetch(`${base}/familias/${idFamA}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Pessoa Iso A ${stamp}` }),
    }),
  );
  reg("cria-pessoa-A", pessoaA.status < 300, { status: pessoaA.status });
  const pessoaAId = pessoaA.corpo?.id;

  const authzA = await json(
    await fetch(`${base}/familias/${idFamA}/autorizacoes`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        usuarioId: famA.usuario.id,
        responsabilidade: "responsavel_cuidados",
        pessoaAlvoId: pessoaAId,
      }),
    }),
  );
  reg("concede-cuidados-A", authzA.status < 300, { status: authzA.status });

  const medA = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/medicamentos`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        nome: `Med Iso ${stamp}`,
        horarios: ["08:00"],
        ativar: true,
      }),
    }),
  );
  reg("cria-med-A", medA.status < 300, { id: medA.corpo?.id });

  const anexoA = await json(
    await fetch(`${base}/familias/${idFamA}/anexos`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        pessoaId: pessoaAId,
        nomeArquivo: "receita-iso.pdf",
        mimeTipo: "application/pdf",
        conteudoBase64: Buffer.from("%PDF-iso-a").toString("base64"),
      }),
    }),
  );
  reg("cria-anexo-A", anexoA.status < 300, { id: anexoA.corpo?.id });
  const anexoAId = anexoA.corpo?.id;

  // Recursos em B
  const pessoaB = await json(
    await fetch(`${base}/familias/${idFamB}/pessoas`, {
      method: "POST",
      headers: hB,
      body: JSON.stringify({ nome: `Pessoa Iso B ${stamp}` }),
    }),
  );
  const pessoaBId = pessoaB.corpo?.id;
  await json(
    await fetch(`${base}/familias/${idFamB}/autorizacoes`, {
      method: "POST",
      headers: hB,
      body: JSON.stringify({
        usuarioId: famB.usuario.id,
        responsabilidade: "responsavel_cuidados",
        pessoaAlvoId: pessoaBId,
      }),
    }),
  );
  const anexoB = await json(
    await fetch(`${base}/familias/${idFamB}/anexos`, {
      method: "POST",
      headers: hB,
      body: JSON.stringify({
        pessoaId: pessoaBId,
        nomeArquivo: "receita-b.pdf",
        mimeTipo: "application/pdf",
        conteudoBase64: Buffer.from("%PDF-iso-b").toString("base64"),
      }),
    }),
  );
  const anexoBId = anexoB.corpo?.id;

  // E1-ACE-05: familiaId cruzado
  const cruzFam = await json(
    await fetch(`${base}/familias/${idFamB}/pessoas`, { headers: hA }),
  );
  reg(
    "E1-ACE-05-sessao-A-familiaId-B",
    cruzFam.status === 403,
    { status: cruzFam.status },
  );

  const criaCruz = await json(
    await fetch(`${base}/familias/${idFamB}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: "Nao deve existir" }),
    }),
  );
  const parcial = await prisma.pessoa.findFirst({
    where: { familiaId: idFamB, nome: "Nao deve existir" },
  });
  reg(
    "E1-ACE-05-escrita-cruzada-sem-parcial",
    criaCruz.status === 403 && !parcial,
    { status: criaCruz.status, parcial: Boolean(parcial) },
  );

  // E1-ACE-05/06: pessoaId / anexo / histórico / PDF cruzados → 404
  const cruzPessoa = await json(
    await fetch(`${base}/familias/${idFamA}/pessoas/${pessoaBId}`, {
      headers: hA,
    }),
  );
  reg(
    "E1-ACE-05-pessoaId-B-via-familia-A",
    cruzPessoa.status === 404 || cruzPessoa.status === 403,
    { status: cruzPessoa.status },
  );

  const cruzRotina = await json(
    await fetch(`${base}/pessoas/${pessoaBId}/cuidados/hoje`, { headers: hA }),
  );
  reg(
    "E1-ACE-06-rotina-pessoa-B",
    cruzRotina.status === 404,
    { status: cruzRotina.status, corpo: cruzRotina.corpo },
  );

  const cruzHist = await json(
    await fetch(
      `${base}/pessoas/${pessoaBId}/historico?de=${encodeURIComponent(new Date(0).toISOString())}&ate=${encodeURIComponent(new Date().toISOString())}`,
      { headers: hA },
    ),
  );
  reg(
    "E1-ACE-06-historico-pessoa-B",
    cruzHist.status === 404,
    { status: cruzHist.status },
  );

  const cruzPdf = await json(
    await fetch(
      `${base}/pessoas/${pessoaBId}/relatorio.pdf?de=${encodeURIComponent(new Date(0).toISOString())}&ate=${encodeURIComponent(new Date().toISOString())}`,
      { headers: hA },
    ),
  );
  reg(
    "E1-ACE-06-pdf-pessoa-B",
    cruzPdf.status === 404,
    { status: cruzPdf.status },
  );

  const cruzAnexo = await json(
    await fetch(`${base}/anexos/${anexoBId}`, { headers: hA }),
  );
  const vazouConteudo =
    typeof cruzAnexo.bruto === "string" &&
    cruzAnexo.bruto.includes("%PDF-iso-b");
  reg(
    "E1-ACE-06-anexo-B-sem-existencia",
    cruzAnexo.status === 404 && !vazouConteudo,
    { status: cruzAnexo.status, vazouConteudo },
  );

  const anexoProprio = await json(
    await fetch(`${base}/anexos/${anexoAId}`, { headers: hA }),
  );
  reg(
    "E1-ACE-06-anexo-A-ok",
    anexoProprio.status < 300 &&
      String(anexoProprio.corpo?.conteudoBase64 || "").length > 0,
    { status: anexoProprio.status },
  );

  // Mesma família sem capacidade clínica (pessoa sem concessão)
  const pessoaSemAcesso = await json(
    await fetch(`${base}/familias/${idFamB}/pessoas`, {
      method: "POST",
      headers: hB,
      body: JSON.stringify({ nome: `Sem Acesso ${stamp}` }),
    }),
  );
  const semCap = await json(
    await fetch(`${base}/pessoas/${pessoaSemAcesso.corpo?.id}/cuidados/hoje`, {
      headers: hB,
    }),
  );
  reg(
    "E1-ACE-05-mesma-familia-sem-capacidade",
    semCap.status === 403,
    { status: semCap.status },
  );

  // Convite A: contexto B recusado; contexto A ok; reuso recusado
  const emailConv = `iso.conv.${stamp}@pef.local`;
  const convite = await json(
    await fetch(`${base}/familias/${idFamA}/convites`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        email: emailConv,
        nomeConvidado: "Convidado Iso",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: pessoaAId,
      }),
    }),
  );
  reg("cria-convite-A", convite.status < 300, { status: convite.status });
  const tokenConv = convite.corpo?.token;

  const ativB = await json(
    await fetch(`${base}/convites/${tokenConv}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        senha: "conv-iso-123",
        nome: "Convidado Iso",
        familiaSlug: slugB,
      }),
    }),
  );
  const usuarioParcial = await prisma.usuario.findUnique({
    where: { email: emailConv },
  });
  reg(
    "E1-ACE-07-convite-A-contexto-B",
    ativB.status === 403 && !usuarioParcial,
    { status: ativB.status, parcial: Boolean(usuarioParcial) },
  );

  const ativA = await json(
    await fetch(`${base}/convites/${tokenConv}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        senha: "conv-iso-123",
        nome: "Convidado Iso",
        familiaSlug: slugA,
      }),
    }),
  );
  reg(
    "E1-ACE-07-convite-A-contexto-A",
    ativA.status < 300 &&
      ativA.corpo?.familiaSlug === slugA &&
      String(ativA.corpo?.destinoEntrada || "").startsWith(`/f/${slugA}`),
    { status: ativA.status, corpo: ativA.corpo },
  );

  const ativUsado = await json(
    await fetch(`${base}/convites/${tokenConv}/ativar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        senha: "conv-iso-999",
        familiaSlug: slugA,
      }),
    }),
  );
  reg(
    "E1-ACE-07-token-usado",
    ativUsado.status === 410,
    { status: ativUsado.status },
  );

  // Revogação: invalida sessão e bloqueia novas operações; histórico permanece
  const sessColab = await login(emailConv, "conv-iso-123", slugA);
  reg("login-colab", sessColab.status < 300, { status: sessColab.status });
  const hColab = headers(sessColab.corpo.token);
  const antesRevoga = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/cuidados/hoje`, {
      headers: hColab,
    }),
  );
  reg(
    "colab-ve-rotina-antes",
    antesRevoga.status < 300,
    { status: antesRevoga.status },
  );

  const authColab = await prisma.autorizacao.findFirst({
    where: {
      familiaId: idFamA,
      usuarioId: sessColab.corpo.usuario.id,
      ativa: true,
    },
  });
  const revoga = await json(
    await fetch(
      `${base}/familias/${idFamA}/autorizacoes/${authColab.id}`,
      { method: "DELETE", headers: hA },
    ),
  );
  reg(
    "E1-ACE-07-revoga",
    revoga.status < 300 &&
      revoga.corpo?.historicoPreservado === true &&
      (revoga.corpo?.sessoesInvalidadas ?? 0) >= 1,
    revoga.corpo,
  );

  const aposRevoga = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/cuidados/hoje`, {
      headers: hColab,
    }),
  );
  reg(
    "E1-ACE-07-sessao-revogada-bloqueada",
    aposRevoga.status === 401,
    { status: aposRevoga.status },
  );

  const historicoAinda = await prisma.autorizacao.findUnique({
    where: { id: authColab.id },
  });
  reg(
    "E1-ACE-07-historico-preservado",
    historicoAinda &&
      historicoAinda.ativa === false &&
      historicoAinda.revogadaEm != null,
    {
      ativa: historicoAinda?.ativa,
      revogadaEm: historicoAinda?.revogadaEm,
    },
  );

  // Leitura autorizada A→A ainda ok
  const okA = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/cuidados/hoje`, { headers: hA }),
  );
  reg("E1-ACE-05-A-para-A-ok", okA.status < 300, { status: okA.status });

  void pessoaAdminA;
  void medA;

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (e) {
  console.error(e);
  console.log(JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2));
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
