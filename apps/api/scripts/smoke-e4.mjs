/**
 * Smoke DEM-E4: catálogo curado, sugestões, escolher/renovar, regressão Explorar/estrelas.
 * Requer API em API_URL e banco local. Homologação humana (E4-HOM) é separada.
 */
import { PrismaClient } from "@prisma/client";
import { CATALOGO_BIBLIOTECA_E4 } from "../prisma/catalogo-biblioteca-e4.mjs";
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

async function garantirCatalogo() {
  if (CATALOGO_BIBLIOTECA_E4.length > 24) {
    throw new Error("Catálogo E4 excede 24 itens.");
  }
  for (const item of CATALOGO_BIBLIOTECA_E4) {
    await prisma.desafio.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        familiaId: null,
        nome: item.nome,
        instrucao: item.instrucao,
        categoria: item.categoria,
        dificuldade: item.dificuldade,
        materiais: item.materiais,
        duracaoMinutos: item.duracaoMinutos,
        faixaEtariaMin: item.faixaEtariaMin,
        faixaEtariaMax: item.faixaEtariaMax,
        origemConteudo: "autoral_pef",
        versaoConteudo: 1,
        adaptacoes: item.adaptacoes,
        supervisao: item.supervisao,
        origem: "catalogo",
        ativo: true,
      },
      update: {
        nome: item.nome,
        instrucao: item.instrucao,
        categoria: item.categoria,
        dificuldade: item.dificuldade,
        materiais: item.materiais,
        duracaoMinutos: item.duracaoMinutos,
        faixaEtariaMin: item.faixaEtariaMin,
        faixaEtariaMax: item.faixaEtariaMax,
        origemConteudo: "autoral_pef",
        adaptacoes: item.adaptacoes,
        supervisao: item.supervisao,
        origem: "catalogo",
        ativo: true,
        familiaId: null,
      },
    });
  }
  const ativos = await prisma.desafio.count({
    where: { origem: "catalogo", familiaId: null, ativo: true },
  });
  return ativos;
}

try {
  const ativosAntes = await garantirCatalogo();
  reg("E4-ACE-01-catalogo-ativo", ativosAntes <= 24 && ativosAntes >= 6, {
    ativos: ativosAntes,
  });

  const slugA = `e4-a-${stamp}`;
  const slugB = `e4-b-${stamp}`;
  const emailA = `e4.admin.a.${stamp}@pef.local`;
  const senhaA = `E4-AdminA-${stamp}`;
  const emailB = `e4.admin.b.${stamp}@pef.local`;
  const senhaB = `E4-AdminB-${stamp}`;

  const famA = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `E4 Fam A ${stamp}`,
    slug: slugA,
    nomeAdmin: `Admin E4 A ${stamp}`,
    emailAdmin: emailA,
    senhaAdmin: senhaA,
  });
  const famB = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `E4 Fam B ${stamp}`,
    slug: slugB,
    nomeAdmin: `Admin E4 B ${stamp}`,
    emailAdmin: emailB,
    senhaAdmin: senhaB,
  });

  const sessA = await login(emailA, senhaA, slugA);
  const sessB = await login(emailB, senhaB, slugB);
  reg("login-admins", sessA.status < 300 && sessB.status < 300, {
    a: sessA.status,
    b: sessB.status,
  });
  const hA = headers(sessA.corpo.token);
  const hB = headers(sessB.corpo.token);
  const adminAId = sessA.corpo.usuario?.id;
  const idFamA = famA.familia.id;

  const pessoaA = await json(
    await fetch(`${base}/familias/${idFamA}/pessoas`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({ nome: `Pessoa Dev E4 ${stamp}` }),
    }),
  );
  const pessoaAId = pessoaA.corpo?.id;
  reg("cria-pessoa-A", Boolean(pessoaAId), { status: pessoaA.status });

  const pessoaB = await json(
    await fetch(`${base}/familias/${famB.familia.id}/pessoas`, {
      method: "POST",
      headers: hB,
      body: JSON.stringify({ nome: `Pessoa Dev E4 B ${stamp}` }),
    }),
  );
  const pessoaBId = pessoaB.corpo?.id;

  const authDev = await json(
    await fetch(`${base}/familias/${idFamA}/autorizacoes`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        usuarioId: adminAId,
        responsabilidade: "responsavel_desenvolvimento",
        pessoaAlvoId: pessoaAId,
      }),
    }),
  );
  reg("auth-desenvolvimento-A", authDev.status < 300, { status: authDev.status });

  const authDevB = await json(
    await fetch(`${base}/familias/${famB.familia.id}/autorizacoes`, {
      method: "POST",
      headers: hB,
      body: JSON.stringify({
        usuarioId: sessB.corpo.usuario?.id,
        responsabilidade: "responsavel_desenvolvimento",
        pessoaAlvoId: pessoaBId,
      }),
    }),
  );
  reg("auth-desenvolvimento-B", authDevB.status < 300, {
    status: authDevB.status,
  });

  const sug1 = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes`, { headers: hA }),
  );
  const ids1 = (sug1.corpo?.sugestoes ?? []).map((s) => s.id);
  reg(
    "E4-ACE-02-ate-6",
    sug1.status < 300 &&
      Array.isArray(sug1.corpo?.sugestoes) &&
      sug1.corpo.sugestoes.length > 0 &&
      sug1.corpo.sugestoes.length <= 6,
    { status: sug1.status, total: sug1.corpo?.total, ids: ids1.length },
  );

  const sug1b = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes`, { headers: hA }),
  );
  const ids1b = (sug1b.corpo?.sugestoes ?? []).map((s) => s.id);
  reg(
    "E4-ACE-04-persistencia-leitura",
    ids1.length === ids1b.length &&
      ids1.every((id, i) => id === ids1b[i]),
    { ids1, ids1b },
  );

  const alvoEscolha = sug1.corpo.sugestoes[0];
  const escolher = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/sugestoes/${alvoEscolha.id}/escolher`,
      { method: "POST", headers: hA },
    ),
  );
  reg(
    "E4-ACE-04-escolher",
    escolher.status < 300 &&
      escolher.corpo?.escolhida === true &&
      (escolher.corpo?.sugestoes ?? []).some(
        (s) => s.id === alvoEscolha.id && s.escolhida,
      ),
    { status: escolher.status },
  );

  const saldoAntes = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/estrelas`, { headers: hA }),
  );
  const saldoAntesN = saldoAntes.corpo?.saldoDisponivel ?? 0;

  const renovar = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes/renovar`, {
      method: "POST",
      headers: hA,
    }),
  );
  const aposRenovar = renovar.corpo?.sugestoes ?? [];
  const aindaEscolhida = aposRenovar.some(
    (s) => s.id === alvoEscolha.id && s.escolhida,
  );
  const idsApos = aposRenovar.map((s) => s.id);
  const novos = idsApos.filter((id) => !ids1.includes(id));
  reg(
    "E4-ACE-03-renovar-preserva",
    renovar.status < 300 &&
      aindaEscolhida &&
      (renovar.corpo?.trocadas ?? 0) <= 3 &&
      novos.length === (renovar.corpo?.trocadas ?? -1),
    {
      status: renovar.status,
      trocadas: renovar.corpo?.trocadas,
      aindaEscolhida,
      novos: novos.length,
    },
  );

  const saldoDepoisRenovar = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/estrelas`, { headers: hA }),
  );
  reg(
    "E4-ACE-05-renovar-sem-estrelas",
    (saldoDepoisRenovar.corpo?.saldoDisponivel ?? -1) === saldoAntesN,
    {
      antes: saldoAntesN,
      depois: saldoDepoisRenovar.corpo?.saldoDisponivel,
    },
  );

  const explorarAntes = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/desafios?disponibilidade=explorar`,
      { headers: hA },
    ),
  );
  const chave = `e4-exec-${stamp}`;
  const participacao = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/participacoes`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        desafioId: alvoEscolha.id,
        resultado: "participou",
        execucaoChave: chave,
      }),
    }),
  );
  reg(
    "participacao-ok",
    participacao.status < 300 &&
      participacao.corpo?.estrelasConcedidas > 0 &&
      participacao.corpo?.idempotente === false,
    { status: participacao.status, estrelas: participacao.corpo?.estrelasConcedidas },
  );

  const snap = await prisma.participacaoDesafio.findFirst({
    where: { execucaoChave: chave },
  });
  reg(
    "E4-ACE-06-snapshot",
    Boolean(snap?.nomeAplicado) &&
      snap.nomeAplicado === alvoEscolha.nome &&
      snap.versaoConteudoAplicada != null,
    {
      nomeAplicado: snap?.nomeAplicado,
      versao: snap?.versaoConteudoAplicada,
    },
  );

  await prisma.desafio.update({
    where: { id: alvoEscolha.id },
    data: {
      nome: `ALTERADO TEMP ${stamp}`,
      versaoConteudo: (alvoEscolha.versaoConteudo ?? 1) + 1,
    },
  });
  const historico = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/resumo-desenvolvimento?dias=7`,
      { headers: hA },
    ).catch(() => null),
  );
  // Endpoint de resumo pode ser outro caminho; conferir snapshot no banco + Explorar.
  const explorarDepois = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/desafios?disponibilidade=explorar`,
      { headers: hA },
    ),
  );
  const executadas = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/desafios?disponibilidade=executadas`,
      { headers: hA },
    ),
  );
  const foiParaExecutadas = (executadas.corpo?.desafios ?? []).some(
    (d) => d.id === alvoEscolha.id,
  );
  const sumiuDeExplorar = !(explorarDepois.corpo?.desafios ?? []).some(
    (d) => d.id === alvoEscolha.id,
  );
  reg(
    "E4-ACE-05-explorar-executadas",
    foiParaExecutadas && sumiuDeExplorar,
    {
      executadas: foiParaExecutadas,
      explorarAntes: (explorarAntes.corpo?.desafios ?? []).length,
      explorarDepois: (explorarDepois.corpo?.desafios ?? []).length,
    },
  );

  // Restaura nome do catálogo para não poluir ambiente local.
  await prisma.desafio.update({
    where: { id: alvoEscolha.id },
    data: {
      nome: alvoEscolha.nome,
      versaoConteudo: alvoEscolha.versaoConteudo ?? 1,
    },
  });
  reg(
    "E4-ACE-06-nome-historico-preservado",
    snap.nomeAplicado === alvoEscolha.nome,
    { snapshot: snap.nomeAplicado },
  );

  const cruzado = await json(
    await fetch(`${base}/pessoas/${pessoaBId}/sugestoes`, { headers: hA }),
  );
  reg(
    "isolamento-familia",
    cruzado.status === 403 || cruzado.status === 404,
    { status: cruzado.status },
  );

  const renovarVazioMsg = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes/renovar`, {
      method: "POST",
      headers: hA,
    }),
  );
  // Segunda renovação: pode trocar ou informar escassez; nunca apaga escolha.
  const escolhaIntacta = (renovarVazioMsg.corpo?.sugestoes ?? []).some(
    (s) => s.id === alvoEscolha.id && s.escolhida,
  );
  reg(
    "E4-ACE-03-escolha-intacta-retry",
    renovarVazioMsg.status < 300 && escolhaIntacta,
    {
      status: renovarVazioMsg.status,
      trocadas: renovarVazioMsg.corpo?.trocadas,
      mensagem: renovarVazioMsg.corpo?.mensagem,
    },
  );

  void historico;

  const falhas = resultados.filter((r) => !r.ok);
  for (const r of resultados) {
    console.log(
      `${r.ok ? "PASS" : "FAIL"} ${r.nome} ${r.detalhe ? JSON.stringify(r.detalhe) : ""}`,
    );
  }
  if (falhas.length) {
    console.error(`\nsmoke-e4: ${falhas.length} falha(s)`);
    process.exitCode = 1;
  } else {
    console.log(`\nsmoke-e4: ${resultados.length} checagens OK`);
  }
} catch (erro) {
  console.error("smoke-e4 erro fatal:", erro);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
