/**
 * Smoke DEM-E4 / DEV-JOG-P01..P03: catálogo, descoberta sob demanda, ativas,
 * retirada, limite 10, isolamento e regressão de participação/estrelas.
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
    const versaoConteudo = item.versaoConteudo ?? 1;
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
        versaoConteudo,
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
        versaoConteudo,
        adaptacoes: item.adaptacoes,
        supervisao: item.supervisao,
        origem: "catalogo",
        ativo: true,
        familiaId: null,
      },
    });
  }
  return prisma.desafio.count({
    where: { origem: "catalogo", familiaId: null, ativo: true },
  });
}

try {
  const ativosAntes = await garantirCatalogo();
  const nomesCuradoria = [
    "O que sumiu?",
    "Mapa do tesouro",
    "História em turnos",
    "Orquestra de casa",
    "Alvo cooperativo",
    "Piquenique em casa",
  ];
  const curadoriaOk = nomesCuradoria.every((nome) =>
    CATALOGO_BIBLIOTECA_E4.some((item) => item.nome === nome),
  );
  reg("E4-ACE-01-catalogo-ativo", ativosAntes <= 24 && ativosAntes >= 6 && curadoriaOk, {
    ativos: ativosAntes,
    curadoriaOk,
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
      body: JSON.stringify({
        nome: `Pessoa Dev E4 ${stamp}`,
        dataNascimento: "2018-06-15",
      }),
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
        // M01 §16: data fictícia exigida para Desenvolvimento.
        dataNascimentoAlvo: "2018-05-10",
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
        // M01 §16: data fictícia exigida para Desenvolvimento.
        dataNascimentoAlvo: "2018-05-10",
        pessoaAlvoId: pessoaBId,
      }),
    }),
  );
  reg("auth-desenvolvimento-B", authDevB.status < 300, {
    status: authDevB.status,
  });

  // 1) Primeiro acesso: sem auto-gerar sugestões; ativas vazias.
  const sugVazio = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes`, { headers: hA }),
  );
  const ativasVazio = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/desafios?disponibilidade=explorar`,
      { headers: hA },
    ),
  );
  reg(
    "E4-ACE-09-primeiro-acesso",
    sugVazio.status < 300 &&
      (sugVazio.corpo?.sugestoes ?? []).length === 0 &&
      (ativasVazio.corpo?.desafios ?? []).length === 0,
    {
      sugestoes: sugVazio.corpo?.total,
      ativas: ativasVazio.corpo?.total,
    },
  );

  // 2) Sugerir sob demanda: até 2.
  const sugerir = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes/renovar`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({}),
    }),
  );
  const idsSug = (sugerir.corpo?.sugestoes ?? []).map((s) => s.id);
  reg(
    "E4-ACE-02-ate-2",
    sugerir.status < 300 &&
      Array.isArray(sugerir.corpo?.sugestoes) &&
      sugerir.corpo.sugestoes.length > 0 &&
      sugerir.corpo.sugestoes.length <= 2 &&
      (sugerir.corpo?.trocadas ?? 0) <= 2,
    { status: sugerir.status, total: sugerir.corpo?.total, trocadas: sugerir.corpo?.trocadas },
  );

  const sugLeitura = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes`, { headers: hA }),
  );
  const idsLeitura = (sugLeitura.corpo?.sugestoes ?? []).map((s) => s.id);
  reg(
    "E4-ACE-04-persistencia-leitura",
    idsSug.length === idsLeitura.length &&
      idsSug.every((id, i) => id === idsLeitura[i]),
    { idsSug, idsLeitura },
  );

  const alvoEscolha = sugerir.corpo.sugestoes[0];
  const outraSugestao = sugerir.corpo.sugestoes[1] ?? null;
  const escolher = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/sugestoes/${alvoEscolha.id}/escolher`,
      { method: "POST", headers: hA },
    ),
  );
  const sugAposEscolha = escolher.corpo?.sugestoes ?? [];
  reg(
    "E4-ACE-02-escolher-sem-reposicao",
    escolher.status < 300 &&
      escolher.corpo?.escolhida === true &&
      !sugAposEscolha.some((s) => s.id === alvoEscolha.id) &&
      (outraSugestao
        ? sugAposEscolha.some((s) => s.id === outraSugestao.id)
        : true),
    {
      status: escolher.status,
      restantes: sugAposEscolha.map((s) => s.id),
    },
  );

  const ativasApos = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/desafios?disponibilidade=explorar`,
      { headers: hA },
    ),
  );
  reg(
    "E4-ACE-09-retorno-ativas",
    (ativasApos.corpo?.desafios ?? []).some((d) => d.id === alvoEscolha.id),
    { total: ativasApos.corpo?.total },
  );

  const saldoAntes = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/estrelas`, { headers: hA }),
  );
  const saldoAntesN = saldoAntes.corpo?.saldoDisponivel ?? 0;

  const renovar = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes/renovar`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({}),
    }),
  );
  const aposRenovar = renovar.corpo?.sugestoes ?? [];
  reg(
    "E4-ACE-03-renovar",
    renovar.status < 300 &&
      (renovar.corpo?.trocadas ?? 0) <= 2 &&
      !aposRenovar.some((s) => s.id === alvoEscolha.id),
    {
      status: renovar.status,
      trocadas: renovar.corpo?.trocadas,
      ids: aposRenovar.map((s) => s.id),
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

  // Retirada sem participação: libera vaga, sem Executadas, sem estrelas.
  const retirar = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/sugestoes/${alvoEscolha.id}/retirar`,
      { method: "POST", headers: hA },
    ),
  );
  const ativasAposRetirada = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/desafios?disponibilidade=explorar`,
      { headers: hA },
    ),
  );
  const executadasAposRetirada = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/desafios?disponibilidade=executadas`,
      { headers: hA },
    ),
  );
  const saldoAposRetirada = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/estrelas`, { headers: hA }),
  );
  reg(
    "E4-ACE-09-retirada",
    retirar.status < 300 &&
      retirar.corpo?.escolhida === false &&
      !(ativasAposRetirada.corpo?.desafios ?? []).some(
        (d) => d.id === alvoEscolha.id,
      ) &&
      !(executadasAposRetirada.corpo?.desafios ?? []).some(
        (d) => d.id === alvoEscolha.id,
      ) &&
      (saldoAposRetirada.corpo?.saldoDisponivel ?? -1) === saldoAntesN,
    {
      status: retirar.status,
      saldo: saldoAposRetirada.corpo?.saldoDisponivel,
    },
  );

  // Escolher de novo para fluxo de participação.
  await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/sugestoes/${alvoEscolha.id}/escolher`,
      { method: "POST", headers: hA },
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
    {
      status: participacao.status,
      estrelas: participacao.corpo?.estrelasConcedidas,
    },
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

  const explorAposPart = await json(
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
  reg(
    "E4-ACE-05-ativas-executadas",
    (executadas.corpo?.desafios ?? []).some((d) => d.id === alvoEscolha.id) &&
      !(explorAposPart.corpo?.desafios ?? []).some(
        (d) => d.id === alvoEscolha.id,
      ),
    {
      executadas: true,
      ativas: (explorAposPart.corpo?.desafios ?? []).length,
    },
  );

  // Participada permanece fora da rotação de novidades.
  const renovarAposPart = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/sugestoes/renovar`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({}),
    }),
  );
  reg(
    "E4-ACE-03-exclui-participada",
    renovarAposPart.status < 300 &&
      !(renovarAposPart.corpo?.sugestoes ?? []).some(
        (s) => s.id === alvoEscolha.id,
      ),
    { ids: (renovarAposPart.corpo?.sugestoes ?? []).map((s) => s.id) },
  );

  // Limite 10: nove ativas + duas concorrentes → só a décima.
  const memoriaIds = CATALOGO_BIBLIOTECA_E4.filter(
    (d) => d.categoria === "memoria_atencao" && d.id !== alvoEscolha.id,
  ).map((d) => d.id);
  // Criar personalizadas categorizadas para completar 9 se catálogo insuficiente.
  const personalizadas = [];
  while (memoriaIds.length + personalizadas.length < 20) {
    const criada = await json(
      await fetch(`${base}/pessoas/${pessoaAId}/desafios`, {
        method: "POST",
        headers: hA,
        body: JSON.stringify({
          nome: `Memória fictícia ${personalizadas.length} ${stamp}`,
          categoria: "memoria_atencao",
          dificuldade: "simples",
          instrucao: "Brincadeira de teste fictícia.",
        }),
      }),
    );
    if (criada.status >= 300 || !criada.corpo?.id) break;
    personalizadas.push(criada.corpo.id);
  }
  const poolMemoria = [...memoriaIds, ...personalizadas];
  const nove = poolMemoria.slice(0, 9);
  for (const id of nove) {
    const r = await json(
      await fetch(`${base}/pessoas/${pessoaAId}/sugestoes/${id}/escolher`, {
        method: "POST",
        headers: hA,
      }),
    );
    if (r.status >= 300 && r.corpo?.codigo !== "LIMITE_ATIVAS_CATEGORIA") {
      // ignore already chosen / conflicts that are not limit
    }
  }

  const contagemNove = await prisma.sugestaoDesafioPessoa.count({
    where: {
      pessoaId: pessoaAId,
      escolhida: true,
      desafio: { categoria: "memoria_atencao", ativo: true },
    },
  });

  const candidato10a = poolMemoria[9];
  const candidato10b = poolMemoria[10];
  const [escolhaConcA, escolhaConcB] = await Promise.all([
    json(
      await fetch(
        `${base}/pessoas/${pessoaAId}/sugestoes/${candidato10a}/escolher`,
        { method: "POST", headers: hA },
      ),
    ),
    json(
      await fetch(
        `${base}/pessoas/${pessoaAId}/sugestoes/${candidato10b}/escolher`,
        { method: "POST", headers: hA },
      ),
    ),
  ]);
  const okA = escolhaConcA.status < 300;
  const okB = escolhaConcB.status < 300;
  const bloqueadoA =
    escolhaConcA.status === 409 &&
    (escolhaConcA.corpo?.codigo === "LIMITE_ATIVAS_CATEGORIA" ||
      escolhaConcA.corpo?.message?.codigo === "LIMITE_ATIVAS_CATEGORIA" ||
      String(escolhaConcA.bruto).includes("10 atividades ativas"));
  const bloqueadoB =
    escolhaConcB.status === 409 &&
    (escolhaConcB.corpo?.codigo === "LIMITE_ATIVAS_CATEGORIA" ||
      escolhaConcB.corpo?.message?.codigo === "LIMITE_ATIVAS_CATEGORIA" ||
      String(escolhaConcB.bruto).includes("10 atividades ativas"));
  const contagemDez = await prisma.sugestaoDesafioPessoa.count({
    where: {
      pessoaId: pessoaAId,
      escolhida: true,
      desafio: { categoria: "memoria_atencao", ativo: true },
    },
  });
  reg(
    "E4-ACE-08-concorrencia-decima",
    contagemNove >= 9 &&
      contagemDez === 10 &&
      ((okA && bloqueadoB) || (okB && bloqueadoA)),
    {
      contagemNove,
      contagemDez,
      a: escolhaConcA.status,
      b: escolhaConcB.status,
    },
  );

  // Personalizada sem categoria não conta no limite.
  const semCat = await json(
    await fetch(`${base}/pessoas/${pessoaAId}/desafios`, {
      method: "POST",
      headers: hA,
      body: JSON.stringify({
        nome: `Cabana fictícia ${stamp}`,
        dificuldade: "simples",
        instrucao: "Personalizada sem categoria.",
      }),
    }),
  );
  const ativasComSemCat = await json(
    await fetch(
      `${base}/pessoas/${pessoaAId}/desafios?disponibilidade=explorar`,
      { headers: hA },
    ),
  );
  reg(
    "E4-ACE-08-personalizada-sem-categoria",
    semCat.status < 300 &&
      (ativasComSemCat.corpo?.desafios ?? []).some(
        (d) => d.id === semCat.corpo?.id,
      ),
    { status: semCat.status, id: semCat.corpo?.id },
  );

  const cruzado = await json(
    await fetch(`${base}/pessoas/${pessoaBId}/sugestoes`, { headers: hA }),
  );
  reg(
    "isolamento-familia",
    cruzado.status === 403 || cruzado.status === 404,
    { status: cruzado.status },
  );

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
