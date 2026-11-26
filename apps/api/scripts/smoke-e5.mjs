import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";

const prisma = new PrismaClient();
const base = process.env.API_URL ?? "http://localhost:3001";
const referencia = Date.now();
const novaChave = () => randomBytes(16).toString("hex");
let checagens = 0;

function conferir(nome, condicao) {
  assert.ok(condicao, nome);
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
  return { status: resposta.status, dados: await resposta.json(), cache: resposta.headers.get("cache-control") };
}

async function entrar(familia) {
  const { slug, email, senha } = familia;
  const resposta = await chamar("/sessoes", {
    metodo: "POST",
    corpo: { familiaSlug: slug, email, senha },
  });
  assert.equal(resposta.status, 201);
  return resposta.dados;
}

async function criarFamilia(rotulo) {
  const slug = `e5-${rotulo}-${referencia}`;
  const email = `e5-${rotulo}-${referencia}@pef.example`;
  const senha = `Fixtura-E5-${rotulo}-${referencia}`;
  const { familia } = await provisionarFamiliaComAdmin(prisma, {
    slug, nomeFamilia: `Família de teste ${rotulo}`,
    nomeAdmin: "Conta de teste", emailAdmin: email, senhaAdmin: senha,
  });
  const credenciais = { slug, email, senha, familiaId: familia.id };
  const sessao = await entrar(credenciais);
  return { ...credenciais, token: sessao.token, usuarioId: sessao.usuario.id };
}

async function autorizar(familia, pessoaId, responsabilidade) {
  const resposta = await chamar(`/familias/${familia.familiaId}/autorizacoes`, {
    metodo: "POST", token: familia.token,
    corpo: {
      usuarioId: familia.usuarioId, pessoaAlvoId: pessoaId, responsabilidade,
      // M01 §16: data fictícia exigida para Desenvolvimento.
      ...(responsabilidade === "responsavel_desenvolvimento" ? { dataNascimentoAlvo: "2018-05-10" } : {}),
    },
  });
  assert.equal(resposta.status, 201);
  return resposta.dados.id;
}

try {
  const familia = await criarFamilia("a");
  const outra = await criarFamilia("b");
  const criarPessoa = await chamar(`/familias/${familia.familiaId}/pessoas`, {
    metodo: "POST", token: familia.token, corpo: { nome: "Pessoa fictícia para jogos" },
  });
  const pessoaId = criarPessoa.dados.id;
  assert.equal(criarPessoa.status, 201);
  const catalogo = `/pessoas/${pessoaId}/jogos`;
  const fase = `${catalogo}/memoria/fases/5`;
  const iniciar = (token = familia.token, caminho = fase) =>
    chamar(caminho + "/iniciar", { metodo: "POST", token });
  const concluir = (chave, versao, token = familia.token, caminho = fase) =>
    chamar(caminho + "/concluir", { metodo: "POST", token, corpo: { chave, versao } });
  // Os testes anteriores ao ticket 05 leem todas as faixas; as checagens de faixa ficam no fim.
  const lerCatalogo = (token = familia.token, faixa = "todas") => chamar(`${catalogo}?faixa=${faixa}`, { token });
  const saldo = () => chamar(`/pessoas/${pessoaId}/estrelas`, { token: familia.token });

  conferir("Sessão necessária para catálogo", (await chamar(catalogo)).status === 401);
  conferir("Administrador puro sem acesso", (await lerCatalogo()).status === 403 && (await iniciar()).status === 403);
  await autorizar(familia, pessoaId, "responsavel_cuidados");
  conferir("Acesso de Cuidados não concede Desenvolvimento", (await concluir(novaChave(), 1)).status === 403);
  conferir("Outra família sem leitura ou escrita direta", (await lerCatalogo(outra.token)).status === 404
    && (await iniciar(outra.token)).status === 404 && (await concluir(novaChave(), 1, outra.token)).status === 404);
  const acesso = await autorizar(familia, pessoaId, "responsavel_desenvolvimento");
  // Ticket 05: a pessoa tem data (concedida com 2018-05-10); o catálogo sem data é testado no fim.

  const antes = await lerCatalogo();
  const memoria = antes.dados.jogos?.find((jogo) => jogo.id === "memoria");
  conferir("Catálogo privado e quinze fases abertas em todas as faixas", antes.status === 200 && antes.cache === "private, no-store"
    && memoria?.fases.length === 15 && memoria.fases.every((item) => item.estado === "nao_explorada"));
  conferir("Catálogo completo e destaques distintos na primeira visita", antes.dados.jogos.length === 8
    && new Set(antes.dados.destaques).size === 3 && antes.dados.destaques[0] === "memoria");
  conferir("Conclusão exige início persistido", (await concluir(novaChave(), memoria.versao)).status === 409);
  conferir("Acesso direto a fase inexistente falha", (await iniciar(familia.token, `${catalogo}/memoria/fases/16`)).status === 404);
  const antesSaldo = (await saldo()).dados.saldoDisponivel;

  const sessoes = await entrar(familia);
  const iniciadas = await Promise.all([iniciar(), iniciar(sessoes.token), iniciar()]);
  const primeira = iniciadas[0];
  conferir("Início concorrente da fase 5 fornece rodada íntegra", iniciadas.every((r) => r.status === 201)
    && primeira.dados.conteudo.tipo === "memoria" && primeira.dados.conteudo.cartas.length === 8);
  const linha = { familiaId: familia.familiaId, pessoaId, jogoId: "memoria", fase: 5 };
  conferir("Aberturas simultâneas geram um progresso experimentado",
    await prisma.progressoFaseJogo.count({ where: linha }) === 1
    && (await lerCatalogo()).dados.jogos.find((item) => item.id === "memoria").fases[4].estado === "experimentada");
  conferir("Validação de versão e confirmação", (await concluir(novaChave(), memoria.versao + 1)).status === 409
    && (await concluir("invalida", memoria.versao)).status === 400);

  const chaves = [novaChave(), novaChave()];
  const conclusoes = await Promise.all([
    concluir(chaves[0], memoria.versao),
    concluir(chaves[1], memoria.versao, sessoes.token),
  ]);
  const indicePrimeira = conclusoes.findIndex((item) => item.dados.primeiraDescoberta);
  conferir("Conclusões paralelas elegem uma primeira descoberta", conclusoes.every((r) => r.status === 201)
    && conclusoes.filter((r) => r.dados.primeiraDescoberta).length === 1
    && conclusoes[0].dados.concluidaEm === conclusoes[1].dados.concluidaEm);
  const dataPrimeira = conclusoes[indicePrimeira].dados.concluidaEm;
  const retry = await concluir(chaves[indicePrimeira], memoria.versao);
  conferir("Reenvio recupera a confirmação original", retry.status === 201 && retry.dados.primeiraDescoberta
    && retry.dados.concluidaEm === dataPrimeira);
  await iniciar();
  const repetida = await concluir(novaChave(), memoria.versao);
  conferir("Reabertura e repetição preservam conclusão", repetida.status === 201 && !repetida.dados.primeiraDescoberta
    && repetida.dados.concluidaEm === dataPrimeira
    && (await lerCatalogo()).dados.jogos.find((item) => item.id === "memoria").fases[4].estado === "concluida");
  // Ticket 12: Sudoku de figuras no lugar de Complete a sequência (arquivado).
  const sudoku = antes.dados.jogos.find((jogo) => jogo.id === "sudoku-figuras");
  const faseSudoku = `${catalogo}/sudoku-figuras/fases/4`;
  const inicioSudoku = await iniciar(familia.token, faseSudoku);
  const gradeSudoku = inicioSudoku.dados.conteudo;
  conferir("Sudoku abre fase 4 com grade, casas vazias e solução coerente", sudoku?.fases.length === 15
    && inicioSudoku.status === 201 && gradeSudoku.tipo === "sudoku" && gradeSudoku.tamanho === 4
    && gradeSudoku.inicial.flat().filter((v) => v === 0).length === 7
    && gradeSudoku.inicial.every((linha, l) => linha.every((v, c) => v === 0 || v === gradeSudoku.solucao[l][c])));
  const fimSudoku = await concluir(novaChave(), sudoku.versao, familia.token, faseSudoku);
  conferir("Conclusão do Sudoku usa progresso separado da Memória",
    fimSudoku.status === 201 && fimSudoku.dados.primeiraDescoberta
    && await prisma.progressoFaseJogo.count({ where: { pessoaId, concluidaEm: { not: null } } }) === 2);
  conferir("Jogo arquivado sai do catálogo e não abre",
    !antes.dados.jogos.some((jogo) => ["sequencia", "pares-sombras", "ache-intruso", "palavra-figura"].includes(jogo.id))
    && (await iniciar(familia.token, `${catalogo}/sequencia/fases/1`)).status === 404);
  const labirinto = antes.dados.jogos.find((jogo) => jogo.id === "labirinto");
  // DEV-CAT-P03: 15 fases em três trilhas; a última abre já na primeira visita.
  const trilhas = labirinto?.fases.map((fase) => fase.trilha).join(",");
  conferir("Labirinto devolve 15 fases com a trilha de cada uma",
    labirinto?.fases.length === 15
    && trilhas === [...Array(5).fill("pequenos"), ...Array(5).fill("medios"), ...Array(5).fill("grandes")].join(",")
    && antes.dados.jogos.every((jogo) => jogo.fases.every((fase) => typeof fase.trilha === "string")));
  const faseLabirinto = `${catalogo}/labirinto/fases/15`;
  const inicioLabirinto = await iniciar(familia.token, faseLabirinto);
  const grade = inicioLabirinto.dados.conteudo;
  conferir("Labirinto abre a fase 15 na primeira visita com início e chegada válidos",
    inicioLabirinto.status === 201 && grade.tipo === "labirinto"
    && grade.mapa[grade.inicio.linha][grade.inicio.coluna] === "I"
    && grade.mapa[grade.chegada.linha][grade.chegada.coluna] === "F");
  const fimLabirinto = await concluir(novaChave(), labirinto.versao, familia.token, faseLabirinto);
  conferir("Labirinto conclui uma única fase em registro próprio",
    fimLabirinto.status === 201 && fimLabirinto.dados.primeiraDescoberta
    && await prisma.progressoFaseJogo.count({ where: { pessoaId, concluidaEm: { not: null } } }) === 3);
  const depois = await lerCatalogo();
  const recente = depois.dados.destaques[0];
  conferir("Último jogo aberto ganha destaque estável com acesso a todos",
    recente === "labirinto" && depois.dados.jogos.length === 8
    && JSON.stringify(depois.dados.destaques) === JSON.stringify((await lerCatalogo()).dados.destaques));

  const forme = antes.dados.jogos.find((jogo) => jogo.id === "forme-palavra");
  const inicioForme = await iniciar(familia.token, `${catalogo}/forme-palavra/fases/1`);
  const letras = inicioForme.dados.conteudo;
  conferir("Forme a palavra abre letras embaralhadas da palavra",
    forme?.fases.length === 15 && inicioForme.status === 201 && letras.tipo === "ordenacao"
    && letras.cenas.length === 3 && letras.cenas.every((peca) => peca.nome === peca.simbolo));
  const fimForme = await concluir(novaChave(), forme.versao, familia.token, `${catalogo}/forme-palavra/fases/1`);
  conferir("Forme a palavra conclui em progresso próprio", fimForme.status === 201 && fimForme.dados.primeiraDescoberta);

  const menor = antes.dados.jogos.find((jogo) => jogo.id === "menor-maior");
  const inicioMenor = await iniciar(familia.token, `${catalogo}/menor-maior/fases/3`);
  const numeros = inicioMenor.dados.conteudo;
  const ordem = numeros.ordemCorreta.map((id) => Number(numeros.cenas.find((c) => c.id === id).simbolo));
  conferir("Do menor ao maior abre números com ordem crescente",
    menor?.fases.length === 15 && menor.categoria === "numeros" && inicioMenor.status === 201
    && numeros.cenas.length === 4 && ordem.every((v, i) => i === 0 || v > ordem[i - 1]));
  const fimMenor = await concluir(novaChave(), menor.versao, familia.token, `${catalogo}/menor-maior/fases/3`);
  conferir("Do menor ao maior conclui com descoberta", fimMenor.status === 201 && fimMenor.dados.primeiraDescoberta);

  const robo = antes.dados.jogos.find((jogo) => jogo.id === "robo-setas");
  const inicioRobo = await iniciar(familia.token, `${catalogo}/robo-setas/fases/2`);
  const mapaRobo = inicioRobo.dados.conteudo;
  conferir("Robô com setas abre mapa com início e chegada",
    robo?.fases.length === 15 && inicioRobo.status === 201 && mapaRobo.tipo === "robo"
    && mapaRobo.mapa[mapaRobo.inicio.linha][mapaRobo.inicio.coluna] === "I"
    && mapaRobo.mapa[mapaRobo.chegada.linha][mapaRobo.chegada.coluna] === "F");
  const fimRobo = await concluir(novaChave(), robo.versao, familia.token, `${catalogo}/robo-setas/fases/2`);
  conferir("Robô com setas conclui com descoberta", fimRobo.status === 201 && fimRobo.dados.primeiraDescoberta);

  const jardim = antes.dados.jogos.find((jogo) => jogo.id === "entrega-jardim");
  const inicioJardim = await iniciar(familia.token, `${catalogo}/entrega-jardim/fases/5`);
  const gradeJardim = inicioJardim.dados.conteudo;
  conferir("Entrega no jardim abre com pontos de passagem",
    jardim?.fases.length === 15 && inicioJardim.status === 201 && gradeJardim.tipo === "labirinto"
    && Array.isArray(gradeJardim.pontos) && gradeJardim.pontos.length === 2
    && gradeJardim.mapa.join("").includes("P"));
  const fimJardim = await concluir(novaChave(), jardim.versao, familia.token, `${catalogo}/entrega-jardim/fases/5`);
  conferir("Entrega no jardim conclui com descoberta",
    fimJardim.status === 201 && fimJardim.dados.primeiraDescoberta);

  const historias = antes.dados.jogos.find((jogo) => jogo.id === "historias-cenas");
  const inicioHistorias = await iniciar(familia.token, `${catalogo}/historias-cenas/fases/4`);
  const cenas = inicioHistorias.dados.conteudo;
  conferir("Histórias em cenas abre ordenação embaralhada",
    historias?.fases.length === 15 && inicioHistorias.status === 201 && cenas.tipo === "ordenacao"
    && cenas.cenas.length === 4 && cenas.ordemCorreta.length === 4
    && !cenas.cenas.every((cena, indice) => cena.id === cenas.ordemCorreta[indice]));
  const fimHistorias = await concluir(novaChave(), historias.versao, familia.token, `${catalogo}/historias-cenas/fases/4`);
  conferir("Histórias em cenas conclui com descoberta",
    fimHistorias.status === 201 && fimHistorias.dados.primeiraDescoberta);

  // Fixture de uma descoberta gravada com outra versão do catálogo.
  const versaoHistorica = memoria.versao + 1;
  await prisma.progressoFaseJogo.update({
    where: { familiaId_pessoaId_jogoId_fase: linha },
    data: { versaoConclusao: versaoHistorica, nomeNaConclusao: "Memória de uma edição anterior" },
  });
  await iniciar();
  const aposMudanca = await concluir(novaChave(), memoria.versao);
  conferir("Versão diferente preserva a data e a edição da primeira descoberta",
    aposMudanca.status === 201 && !aposMudanca.dados.primeiraDescoberta
    && aposMudanca.dados.concluidaEm === dataPrimeira && aposMudanca.dados.versaoConclusao === versaoHistorica);
  const caminhoPessoa = `/pessoas/${pessoaId}`;
  const historico = (token = familia.token, filtro = "") =>
    chamar(caminhoPessoa + "/historico?dominio=desenvolvimento" + filtro, { token });
  const resumo = (token = familia.token, filtro = "") =>
    chamar(caminhoPessoa + "/resumo-desenvolvimento" + filtro, { token });
  const eventosResposta = await historico();
  const eventos = eventosResposta.dados.eventos.filter((item) => item.tipo === "conclusao_fase_jogo");
  conferir("Histórico deriva uma descoberta por fase com versão da origem", eventosResposta.status === 200
    && eventos.length === 8 && eventos.some((item) => item.origemId === "labirinto/15")
    && eventos.some((item) => item.origemId === "memoria/5"
      && item.resumo.includes("Memória de uma edição anterior") && item.detalhe.includes(String(versaoHistorica))));
  const resumoAtual = await resumo();
  conferir("Histórico e Resumo proíbem cache de dados privados",
    eventosResposta.cache === "private, no-store" && resumoAtual.cache === "private, no-store");
  const jogosResumo = resumoAtual.dados.jogos;
  conferir("Resumo deriva jogos e contagens sem misturar participações", resumoAtual.status === 200
    && jogosResumo.length === 8
    && jogosResumo.every((jogo) => jogo.totalFases === 15
      && jogo.concluidasAte === 1 && jogo.concluidasNoPeriodo === 1)
    && resumoAtual.dados.experiencias.length === 0);
  const passado = "de=2000-01-01&ate=2000-01-02";
  conferir("Período anterior exclui descobertas futuras",
    (await historico(familia.token, "&" + passado)).dados.eventos.length === 0
    && (await resumo(familia.token, "?" + passado)).dados.jogos.length === 0);
  conferir("Histórico e Resumo isolam famílias", (await historico(outra.token)).status === 404
    && (await resumo(outra.token)).status === 404);
  const previa = await chamar(caminhoPessoa + "/resumo-previa", { token: familia.token });
  conferir("Prévia conserva o recorte de exportação", previa.status === 200 && previa.dados.desenvolvimento
    && !Object.hasOwn(previa.dados.desenvolvimento, "jogos"));

  conferir("Jogo não movimenta estrelas", antesSaldo === (await saldo()).dados.saldoDisponivel
    && await prisma.movimentoEstrelas.count({ where: { pessoaId } }) === 0);

  // DEV-CAT-P04 (ticket 05, D1): sem data, pede a data; com 8 anos, abre em Médios e vê as outras faixas.
  // P04 substitui o trecho de E5-ACE-08 que mostrava o catálogo sem data: agora pede a data.
  await prisma.pessoa.update({ where: { id: pessoaId }, data: { dataNascimento: null } });
  const semData = await chamar(catalogo, { token: familia.token });
  conferir("Sem data de nascimento, o catálogo pede a data",
    semData.status === 409 && semData.dados?.codigo === "DATA_NASCIMENTO_OBRIGATORIA");
  const hojeUtc = new Date();
  const oitoAnos = new Date(Date.UTC(hojeUtc.getUTCFullYear() - 8, hojeUtc.getUTCMonth(), hojeUtc.getUTCDate()));
  await prisma.pessoa.update({ where: { id: pessoaId }, data: { dataNascimento: oitoAnos } });
  const padrao = await chamar(catalogo, { token: familia.token });
  const grandes = await lerCatalogo(familia.token, "grandes");
  const todas = await lerCatalogo(familia.token, "todas");
  const fasesPorJogo = (resposta) => resposta.dados.jogos.map((jogo) => jogo.fases.map((f) => f.numero).join(",")).join("|");
  conferir("Pessoa de 8 anos abre em Médios e consegue abrir Grandes e todas",
    padrao.status === 200 && padrao.dados.faixaPadrao === "medios" && padrao.dados.faixa === "medios"
    && padrao.dados.jogos.every((jogo) => jogo.fases.length === 5 && jogo.fases.every((f) => f.trilha === "medios"))
    && grandes.dados.faixa === "grandes" && grandes.dados.faixaPadrao === "medios"
    && grandes.dados.jogos.every((jogo) => jogo.fases.every((f) => f.numero >= 11))
    && todas.dados.jogos.every((jogo) => jogo.fases.length === 15)
    && fasesPorJogo(padrao) !== fasesPorJogo(grandes));
  conferir("Faixa inválida é recusada e outra família continua sem acesso",
    (await lerCatalogo(familia.token, "adultos")).status === 400
    && (await lerCatalogo(outra.token, "medios")).status === 404);
  // P06: de 6 para 7 anos a faixa padrão muda; a fase 5 da Memória, concluída em Pequenos, continua lá.
  const seisAnos = new Date(Date.UTC(hojeUtc.getUTCFullYear() - 7, hojeUtc.getUTCMonth(), hojeUtc.getUTCDate() + 1));
  await prisma.pessoa.update({ where: { id: pessoaId }, data: { dataNascimento: seisAnos } });
  const aosSeis = await chamar(catalogo, { token: familia.token });
  await prisma.pessoa.update({ where: { id: pessoaId }, data: { dataNascimento: oitoAnos } });
  const pequenos = await lerCatalogo(familia.token, "pequenos");
  const memoriaPequenos = pequenos.dados.jogos.find((jogo) => jogo.id === "memoria");
  conferir("Mudar de faixa preserva descobertas e Pequenos abre por Ver outras faixas",
    aosSeis.dados.faixaPadrao === "pequenos" && pequenos.dados.faixaPadrao === "medios"
    && pequenos.dados.faixa === "pequenos" && memoriaPequenos.fases.every((f) => f.numero <= 5)
    && memoriaPequenos.fases.find((f) => f.numero === 5)?.estado === "concluida"
    && (await historico()).dados.eventos.filter((e) => e.tipo === "conclusao_fase_jogo").length >= 8);

  // E5-ACE-12 (ticket 12): conquista de jogo arquivado continua no Histórico e no Resumo.
  const quando = new Date();
  await prisma.progressoFaseJogo.create({
    data: {
      familiaId: familia.familiaId, pessoaId, jogoId: "pares-sombras", fase: 1,
      primeiraExploracaoEm: quando, versaoPrimeiraExploracao: 1, ultimaAberturaEm: quando, versaoUltimaAbertura: 1,
      concluidaEm: quando, versaoConclusao: 1, chaveConclusao: "a".repeat(32),
      nomeNaConclusao: "Pares de sombras", categoriaNaConclusao: "memoria_atencao",
    },
  });
  const historicoArquivado = await historico();
  const resumoArquivado = await resumo();
  conferir("Conquista de jogo arquivado continua no Histórico e no Resumo",
    historicoArquivado.dados.eventos.some((e) => e.origemId === "pares-sombras/1" && e.resumo.includes("Pares de sombras"))
    && resumoArquivado.dados.jogos.some((jogo) => jogo.id === "pares-sombras" && jogo.concluidasAte === 1));

  const revogacao = await chamar(`/familias/${familia.familiaId}/autorizacoes/${acesso}`, {
    metodo: "DELETE", token: familia.token,
  });
  assert.equal(revogacao.status, 200);
  const renovada = await entrar(familia);
  conferir("Revogação invalida sessão e preserva a negativa após novo login",
    (await concluir(novaChave(), memoria.versao)).status === 401
    && (await lerCatalogo(renovada.token)).status === 403
    && (await iniciar(renovada.token)).status === 403);
  const visaoCuidados = await historico(renovada.token);
  conferir("Cuidados sem Desenvolvimento não recebe eventos ou agregados E5",
    visaoCuidados.status === 200 && !visaoCuidados.dados.dominios.desenvolvimento
    && visaoCuidados.dados.eventos.length === 0 && (await resumo(renovada.token)).status === 403);
  conferir("Revogação preserva o registro confirmado", await prisma.progressoFaseJogo.count({ where: { ...linha, concluidaEm: { not: null } } }) === 1);

  console.log(`smoke-e5: ${checagens} checagens OK`);
} finally {
  await prisma.$disconnect();
}
