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
    corpo: { usuarioId: familia.usuarioId, pessoaAlvoId: pessoaId, responsabilidade },
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
  const lerCatalogo = (token = familia.token) => chamar(catalogo, { token });
  const saldo = () => chamar(`/pessoas/${pessoaId}/estrelas`, { token: familia.token });

  conferir("Sessão necessária para catálogo", (await chamar(catalogo)).status === 401);
  conferir("Administrador puro sem acesso", (await lerCatalogo()).status === 403 && (await iniciar()).status === 403);
  await autorizar(familia, pessoaId, "responsavel_cuidados");
  conferir("Acesso de Cuidados não concede Desenvolvimento", (await concluir(novaChave(), 1)).status === 403);
  conferir("Outra família sem leitura ou escrita direta", (await lerCatalogo(outra.token)).status === 404
    && (await iniciar(outra.token)).status === 404 && (await concluir(novaChave(), 1, outra.token)).status === 404);
  const acesso = await autorizar(familia, pessoaId, "responsavel_desenvolvimento");

  const antes = await lerCatalogo();
  const memoria = antes.dados.jogos?.find((jogo) => jogo.id === "memoria");
  conferir("Catálogo privado e cinco fases abertas sem nascimento", antes.status === 200 && antes.cache === "private, no-store"
    && memoria?.fases.length === 5 && memoria.fases.every((item) => item.estado === "nao_explorada"));
  conferir("Catálogo completo e destaques distintos na primeira visita", antes.dados.jogos.length === 3
    && new Set(antes.dados.destaques).size === 3 && antes.dados.destaques[0] === "memoria");
  conferir("Conclusão exige início persistido", (await concluir(novaChave(), memoria.versao)).status === 409);
  conferir("Acesso direto a fase inexistente falha", (await iniciar(familia.token, `${catalogo}/memoria/fases/6`)).status === 404);
  const antesSaldo = (await saldo()).dados.saldoDisponivel;

  const sessoes = await entrar(familia);
  const iniciadas = await Promise.all([iniciar(), iniciar(sessoes.token), iniciar()]);
  const primeira = iniciadas[0];
  conferir("Início concorrente da fase 5 fornece rodada íntegra", iniciadas.every((r) => r.status === 201)
    && primeira.dados.conteudo.tipo === "memoria" && primeira.dados.conteudo.cartas.length === 12);
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
  const sequencia = antes.dados.jogos.find((jogo) => jogo.id === "sequencia");
  const faseSequencia = `${catalogo}/sequencia/fases/4`;
  const inicioSequencia = await iniciar(familia.token, faseSequencia);
  const conteudoSequencia = inicioSequencia.dados.conteudo;
  conferir("Sequência abre fase 4 no primeiro acesso", sequencia?.fases.length === 5
    && inicioSequencia.status === 201 && conteudoSequencia.tipo === "sequencia"
    && conteudoSequencia.sequencia.filter((peca) => peca === null).length === 1
    && conteudoSequencia.alternativas.filter((peca) => peca.id === conteudoSequencia.resposta).length === 1);
  const fimSequencia = await concluir(novaChave(), sequencia.versao, familia.token, faseSequencia);
  conferir("Conclusão de Sequência usa progresso separado da Memória",
    fimSequencia.status === 201 && fimSequencia.dados.primeiraDescoberta
    && await prisma.progressoFaseJogo.count({ where: { pessoaId, concluidaEm: { not: null } } }) === 2);
  const labirinto = antes.dados.jogos.find((jogo) => jogo.id === "labirinto");
  const faseLabirinto = `${catalogo}/labirinto/fases/5`;
  const inicioLabirinto = await iniciar(familia.token, faseLabirinto);
  const grade = inicioLabirinto.dados.conteudo;
  conferir("Labirinto abre fase avançada com início e chegada válidos",
    labirinto?.fases.length === 5 && inicioLabirinto.status === 201 && grade.tipo === "labirinto"
    && grade.mapa[grade.inicio.linha][grade.inicio.coluna] === "I"
    && grade.mapa[grade.chegada.linha][grade.chegada.coluna] === "F");
  const fimLabirinto = await concluir(novaChave(), labirinto.versao, familia.token, faseLabirinto);
  conferir("Labirinto conclui uma única fase em registro próprio",
    fimLabirinto.status === 201 && fimLabirinto.dados.primeiraDescoberta
    && await prisma.progressoFaseJogo.count({ where: { pessoaId, concluidaEm: { not: null } } }) === 3);
  const depois = await lerCatalogo();
  const recente = depois.dados.destaques[0];
  conferir("Último jogo aberto ganha destaque estável com acesso a todos",
    recente === "labirinto" && depois.dados.jogos.length === 3
    && JSON.stringify(depois.dados.destaques) === JSON.stringify((await lerCatalogo()).dados.destaques));

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
    && eventos.length === 3 && eventos.some((item) => item.origemId === "memoria/5"
      && item.resumo.includes("Memória de uma edição anterior") && item.detalhe.includes(String(versaoHistorica))));
  const resumoAtual = await resumo();
  conferir("Histórico e Resumo proíbem cache de dados privados",
    eventosResposta.cache === "private, no-store" && resumoAtual.cache === "private, no-store");
  const jogosResumo = resumoAtual.dados.jogos;
  conferir("Resumo deriva jogos e contagens sem misturar participações", resumoAtual.status === 200
    && jogosResumo.length === 3 && jogosResumo.every((jogo) => jogo.totalFases === 5
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
