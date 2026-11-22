/**
 * Smoke DEM-E1-ENTRADA: cadastro público, colisões, isolamento e sem e-mail.
 * Requer API em API_URL (default http://localhost:3001) e banco local.
 */
import { PrismaClient } from "@prisma/client";

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

async function postFamilia(corpo) {
  return json(
    await fetch(`${base}/familias`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    }),
  );
}

async function postSessao(corpo) {
  return json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
    }),
  );
}

try {
  const slugA = `ent-a-${stamp}`;
  const slugB = `ent-b-${stamp}`;
  const emailA = `ent.a.${stamp}@pef.local`;
  const emailB = `ent.b.${stamp}@pef.local`;
  const senhaA = `SenhaEntA-${stamp}`;
  const senhaB = `SenhaEntB-${stamp}`;

  const sugestao = await json(
    await fetch(
      `${base}/familias/sugerir-endereco?nome=${encodeURIComponent("Família Teste")}`,
    ),
  );
  reg(
    "E1-ENT-02-sugerir",
    sugestao.status === 200 && typeof sugestao.corpo?.slug === "string",
    sugestao.corpo,
  );

  const criadaA = await postFamilia({
    nomeFamilia: `Família Entrada A ${stamp}`,
    nomeTitular: `Titular A ${stamp}`,
    email: emailA,
    senha: senhaA,
    slug: slugA,
  });
  reg(
    "E1-ENT-03-criar-A",
    criadaA.status === 201 || criadaA.status === 200,
    {
      status: criadaA.status,
      slug: criadaA.corpo?.familia?.slug,
      caminho: criadaA.corpo?.caminhoEntrada,
    },
  );
  const senhaVazada =
    JSON.stringify(criadaA.corpo).toLowerCase().includes(senhaA.toLowerCase()) ||
    String(criadaA.bruto).toLowerCase().includes(senhaA.toLowerCase());
  reg("E1-ENT-05-sem-senha-na-resposta", !senhaVazada, { senhaVazada });
  reg(
    "E1-ENT-04-caminho-entrada",
    criadaA.corpo?.caminhoEntrada === `/f/${slugA}/entrar`,
    criadaA.corpo?.caminhoEntrada,
  );
  reg(
    "E1-ENT-05-sem-email-enviado",
    !/e-?mail (enviado|verificado)/i.test(JSON.stringify(criadaA.corpo)),
    "resposta sem afirmação de e-mail",
  );

  const criadaB = await postFamilia({
    nomeFamilia: `Família Entrada A ${stamp}`,
    nomeTitular: `Titular B ${stamp}`,
    email: emailB,
    senha: senhaB,
    slug: slugB,
  });
  reg(
    "E1-ENT-02-nome-repetido-ok",
    criadaB.status === 201 || criadaB.status === 200,
    { status: criadaB.status, slug: criadaB.corpo?.familia?.slug },
  );

  const colisaoSlug = await postFamilia({
    nomeFamilia: "Outra",
    nomeTitular: "Outro",
    email: `colisao.slug.${stamp}@pef.local`,
    senha: "senha-colisao-ok",
    slug: slugA,
  });
  const msgSlug = JSON.stringify(colisaoSlug.corpo);
  reg(
    "E1-ENT-02-colisao-slug",
    colisaoSlug.status === 409 && /endereço|slug/i.test(msgSlug),
    { status: colisaoSlug.status, corpo: colisaoSlug.corpo },
  );

  const reservado = await postFamilia({
    nomeFamilia: "Reservado",
    nomeTitular: "Titular",
    email: `reservado.${stamp}@pef.local`,
    senha: "senha-reservado",
    slug: "criar",
  });
  reg(
    "E1-ENT-02-slug-reservado",
    reservado.status === 400,
    { status: reservado.status, corpo: reservado.corpo },
  );

  const colisaoEmail = await postFamilia({
    nomeFamilia: "Outra email",
    nomeTitular: "Outro",
    email: emailA,
    senha: "senha-colisao-email",
    slug: `ent-c-${stamp}`,
  });
  reg(
    "E1-ENT-05-colisao-email",
    colisaoEmail.status === 409,
    { status: colisaoEmail.status },
  );

  const rejeitaDestino = await postFamilia({
    nomeFamilia: "Destino",
    nomeTitular: "Titular",
    email: `destino.${stamp}@pef.local`,
    senha: "senha-destino-1",
    slug: `ent-d-${stamp}`,
    familiaId: criadaA.corpo?.familia?.id,
    papel: "administrador",
  });
  reg(
    "E1-ENT-06-recusa-destino",
    rejeitaDestino.status === 400,
    { status: rejeitaDestino.status, corpo: rejeitaDestino.corpo },
  );

  const contarA = await prisma.familia.count({ where: { slug: slugA } });
  const contarEmail = await prisma.usuario.count({ where: { email: emailA } });
  reg("E1-ENT-03-sem-duplicata", contarA === 1 && contarEmail === 1, {
    contarA,
    contarEmail,
  });

  const loginA = await postSessao({
    email: emailA,
    senha: senhaA,
    familiaSlug: slugA,
  });
  reg("E1-ACE-02-login-A", loginA.status === 201 || loginA.status === 200, {
    status: loginA.status,
  });
  const loginCruzado = await postSessao({
    email: emailA,
    senha: senhaA,
    familiaSlug: slugB,
  });
  reg(
    "E1-ACE-02-login-cruzado-negado",
    loginCruzado.status === 401,
    { status: loginCruzado.status },
  );

  const pessoasB = await prisma.pessoa.count({
    where: { familiaId: criadaB.corpo?.familia?.id },
  });
  const authzAemB = await prisma.autorizacao.count({
    where: {
      familiaId: criadaB.corpo?.familia?.id,
      usuarioId: criadaA.corpo?.usuario?.id,
    },
  });
  reg("E1-ENT-06-isolamento-basico", pessoasB === 1 && authzAemB === 0, {
    pessoasB,
    authzAemB,
  });

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (erro) {
  console.error(erro);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
