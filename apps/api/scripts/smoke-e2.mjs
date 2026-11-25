/**
 * Smoke DEM-E2-ACESSOS: ativação por link, estados e acompanhamento (E2-ACE-01..07).
 * Requer API em API_URL e banco local.
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
  const slugA = `e2-a-${stamp}`;
  const slugB = `e2-b-${stamp}`;
  const emailAdminA = `e2.admin.a.${stamp}@pef.local`;
  const senhaAdminA = `E2-AdminA-${stamp}`;
  const emailAdminB = `e2.admin.b.${stamp}@pef.local`;
  const senhaAdminB = `E2-AdminB-${stamp}`;

  const famA = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `E2 Fam A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Admin E2 A ${stamp}`,
    emailAdmin: emailAdminA,
    senhaAdmin: senhaAdminA,
  });
  const famB = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `E2 Fam B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Admin E2 B ${stamp}`,
    emailAdmin: emailAdminB,
    senhaAdmin: senhaAdminB,
  });

  const sessA = await login(emailAdminA, senhaAdminA, slugA);
  const sessB = await login(emailAdminB, senhaAdminB, slugB);
  reg("login-admins", sessA.status < 300 && sessB.status < 300, {
    a: sessA.status,
    b: sessB.status,
  });
  const hA = headers(sessA.corpo.token);
  const hB = headers(sessB.corpo.token);
  const idFamA = famA.familia.id;

  // E2-ACE-01: cadastro sem conta
  const pessoaSemConta = await json(
    await fetch(`${base}/familias/${idFamA}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Pessoa Sem Conta ${stamp}` }),
    }),
  );
  reg(
    "E2-ACE-01-cadastro-sem-conta",
    pessoaSemConta.status < 300 && pessoaSemConta.corpo?.id,
    { status: pessoaSemConta.status, id: pessoaSemConta.corpo?.id },
  );
  const pessoaAlvoId = pessoaSemConta.corpo.id;

  // Habilitar conta em pessoa existente (sem senha do admin)
  const emailConta = `e2.conta.${stamp}@pef.local`;
  const conviteConta = await json(
    await fetch(`${base}/familias/${idFamA}/convites`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        email: emailConta,
        nomeConvidado: `Conta ${stamp}`,
        pessoaContaId: pessoaAlvoId,
      }),
    }),
  );
  reg(
    "E2-ACE-01-02-gerar-convite-conta",
    conviteConta.status < 300 &&
      conviteConta.corpo?.token &&
      conviteConta.corpo?.pessoaContaId === pessoaAlvoId &&
      Boolean(conviteConta.corpo?.expiraEm) &&
      !String(conviteConta.bruto).toLowerCase().includes("e-mail enviado"),
    {
      status: conviteConta.status,
      pessoaContaId: conviteConta.corpo?.pessoaContaId,
      expiraEm: conviteConta.corpo?.expiraEm,
    },
  );

  // E2-ACE-05: listar estados (sem token)
  const lista = await json(
    await fetch(`${base}/familias/${idFamA}/convites`, { headers: hA }),
  );
  const itemPendente = Array.isArray(lista.corpo)
    ? lista.corpo.find((c) => c.id === conviteConta.corpo?.id)
    : null;
  const listaTemToken = JSON.stringify(lista.corpo ?? {}).includes(
    conviteConta.corpo?.token ?? "__none__",
  );
  reg(
    "E2-ACE-05-listar-pendente-sem-token",
    lista.status < 300 &&
      itemPendente?.estado === "pendente" &&
      !listaTemToken,
    {
      status: lista.status,
      estado: itemPendente?.estado,
      vazouToken: listaTemToken,
    },
  );

  const listaB = await json(
    await fetch(`${base}/familias/${idFamA}/convites`, { headers: hB }),
  );
  reg(
    "E2-ACE-05-listar-outra-familia-negado",
    listaB.status === 403 || listaB.status === 401 || listaB.status === 404,
    { status: listaB.status },
  );

  const inicio = await json(
    await fetch(`${base}/familias/${idFamA}/inicio`, { headers: hA }),
  );
  const cartao = (inicio.corpo?.cartoes ?? []).find(
    (c) => c.pessoaId === pessoaAlvoId,
  );
  reg(
    "E2-ACE-05-estado-cartao-pendente",
    cartao?.estadoConta === "convite_pendente" && cartao?.possuiConta === false,
    { estadoConta: cartao?.estadoConta, possuiConta: cartao?.possuiConta },
  );

  // E2-ACE-03: ativar com pessoaId reutilizado
  const senhaTitular = `SenhaE2-${stamp}`;
  const ativacao = await json(
    await fetch(
      `${base}/convites/${encodeURIComponent(conviteConta.corpo.token)}/ativar`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          senha: senhaTitular,
          familiaSlug: slugA,
        }),
      },
    ),
  );
  reg(
    "E2-ACE-03-ativar-reutiliza-pessoa",
    ativacao.status < 300 &&
      ativacao.corpo?.reutilizouPessoa === true &&
      ativacao.corpo?.pessoaId === pessoaAlvoId &&
      ativacao.corpo?.destinoEntrada === `/f/${slugA}/entrar` &&
      !String(ativacao.bruto).toLowerCase().includes("verificad"),
    {
      status: ativacao.status,
      pessoaId: ativacao.corpo?.pessoaId,
      reutilizou: ativacao.corpo?.reutilizouPessoa,
    },
  );

  const loginTitular = await login(emailConta, senhaTitular, slugA);
  reg("E2-ACE-03-login-familia-correta", loginTitular.status < 300, {
    status: loginTitular.status,
  });

  // E2-ACE-04: token usado
  const reuso = await json(
    await fetch(
      `${base}/convites/${encodeURIComponent(conviteConta.corpo.token)}/ativar`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          senha: `${senhaTitular}-x`,
          familiaSlug: slugA,
        }),
      },
    ),
  );
  reg("E2-ACE-04-token-usado", reuso.status === 410, { status: reuso.status });

  // Convite contextual + slug errado
  const emailCtx = `e2.ctx.${stamp}@pef.local`;
  const conviteCtx = await json(
    await fetch(`${base}/familias/${idFamA}/convites`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        email: emailCtx,
        nomeConvidado: `Ctx ${stamp}`,
        responsabilidade: "responsavel_cuidados",
        pessoaAlvoId,
      }),
    }),
  );
  reg("E2-ACE-02-convite-contextual", conviteCtx.status < 300, {
    status: conviteCtx.status,
  });

  const slugErrado = await json(
    await fetch(
      `${base}/convites/${encodeURIComponent(conviteCtx.corpo.token)}/ativar`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          senha: `SenhaCtx-${stamp}`,
          familiaSlug: slugB,
        }),
      },
    ),
  );
  reg(
    "E2-ACE-04-familia-trocada",
    slugErrado.status === 403,
    { status: slugErrado.status },
  );

  // E-mail já existente
  const conviteEmailDup = await json(
    await fetch(`${base}/familias/${idFamA}/convites`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        email: emailConta,
        nomeConvidado: "Dup",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId,
      }),
    }),
  );
  let ativacaoDup = { status: 0 };
  if (conviteEmailDup.status < 300) {
    ativacaoDup = await json(
      await fetch(
        `${base}/convites/${encodeURIComponent(conviteEmailDup.corpo.token)}/ativar`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            senha: `Outra-${stamp}`,
            familiaSlug: slugA,
          }),
        },
      ),
    );
  }
  reg(
    "E2-ACE-04-email-existente",
    ativacaoDup.status >= 400,
    { criar: conviteEmailDup.status, ativar: ativacaoDup.status },
  );

  // E2-ACE-06/07: concessão ADR-014 + revogação
  const usuarioTitular = await prisma.usuario.findUnique({
    where: { email: emailConta },
  });
  const concessao = await json(
    await fetch(`${base}/familias/${idFamA}/autorizacoes`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        usuarioId: usuarioTitular?.id,
        responsabilidade: "responsavel_desenvolvimento",
        // M01 §16: data fictícia exigida para Desenvolvimento.
        dataNascimentoAlvo: "2018-05-10",
        pessoaAlvoId,
      }),
    }),
  );
  reg(
    "E2-ACE-06-concessao-adr014",
    concessao.status < 300 && Boolean(usuarioTitular?.id),
    {
      status: concessao.status,
      usuarioId: usuarioTitular?.id,
    },
  );

  const acessos = await json(
    await fetch(`${base}/familias/${idFamA}/acessos`, { headers: hA }),
  );
  const itemDev = (acessos.corpo?.itens ?? []).find(
    (i) =>
      i.participanteUsuarioId === usuarioTitular?.id &&
      i.area === "Desenvolvimento",
  );
  reg(
    "E2-ACE-06-consulta-acessos",
    acessos.status < 300 && Boolean(itemDev),
    {
      status: acessos.status,
      achou: Boolean(itemDev),
      area: itemDev?.area,
      papel: itemDev?.papel,
    },
  );

  const authzId = itemDev?.id ?? concessao.corpo?.id;
  const revoga = authzId
    ? await json(
        await fetch(`${base}/familias/${idFamA}/autorizacoes/${authzId}`, {
          method: "DELETE",
          headers: hA,
        }),
      )
    : { status: 0 };
  reg("E2-ACE-07-revogacao", revoga.status < 300, { status: revoga.status });

  // Último admin protegido
  const adminAuthz = (acessos.corpo?.itens ?? []).find(
    (i) =>
      i.participanteUsuarioId === famA.usuario.id &&
      (i.papel === "Administrador" || i.area == null),
  );
  const tentaRemoverAdmin = adminAuthz?.id
    ? await json(
        await fetch(
          `${base}/familias/${idFamA}/autorizacoes/${adminAuthz.id}`,
          { method: "DELETE", headers: hA },
        ),
      )
    : { status: 0 };
  reg(
    "E2-ACE-07-ultimo-admin",
    tentaRemoverAdmin.status >= 400,
    { status: tentaRemoverAdmin.status },
  );

  const falhas = resultados.filter((r) => !r.ok);
  for (const r of resultados) {
    console.log(
      `${r.ok ? "PASS" : "FAIL"} ${r.nome} — ${JSON.stringify(r.detalhe)}`,
    );
  }
  if (falhas.length) {
    console.error(`\nsmoke-e2: ${falhas.length} falha(s)`);
    process.exitCode = 1;
  } else {
    console.log(`\nsmoke-e2: ${resultados.length} checagens OK`);
  }
} catch (e) {
  console.error("smoke-e2 erro fatal:", e);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
