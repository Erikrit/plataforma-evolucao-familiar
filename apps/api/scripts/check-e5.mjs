import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { CATALOGO_JOGOS_PILOTO_E5 } from "../prisma/catalogo-jogos-piloto-e5.mjs";

const require = createRequire(import.meta.url);
require("ts-node").register({
  project: fileURLToPath(new URL("../tsconfig.json", import.meta.url)),
  transpileOnly: true,
});
const { montarConteudoMotor } = require("../src/desenvolvimento/jogos/motores-jogos");
const { selecionarDestaquesJogos } = require("../src/desenvolvimento/jogos/destaques-jogos");
const { CATEGORIAS_BIBLIOTECA } = require("../src/desenvolvimento/constantes-desenvolvimento");
const { faixaPadrao, idadeEm, lerFaixaPedida } = require("../src/desenvolvimento/jogos/faixas");
const { dicaEscolha, dicaSequencia, dicaMemoria, dicaOrdenacao, dicaSudoku, dicaRobo, comandosDoCaminho } = require("../../web/src/componentes/desenvolvimento/jogos/dicas-jogos");

// Valida o catálogo que a carga oficial publica (DEV-CAT-M1, ticket 01).
const CATALOGO_JOGOS = CATALOGO_JOGOS_PILOTO_E5.map((jogo) => ({
  ...jogo,
  fases: jogo.fases.map((fase) => ({
    numero: fase.numero,
    titulo: fase.titulo,
    objetivo: fase.objetivo,
    tipo: jogo.tipoMecanica,
    configuracao: fase.configuracao,
    ...fase.configuracao,
  })),
}));

function montarConteudoFase(fase, sortear) {
  return montarConteudoMotor(fase.tipo, fase.configuracao, sortear);
}

assert.equal(new Set(CATALOGO_JOGOS.map((jogo) => jogo.id)).size, CATALOGO_JOGOS.length);
assert.deepEqual(CATALOGO_JOGOS.map((jogo) => jogo.id), ["memoria", "sequencia", "labirinto"]);

function rodada(fase, indice) {
  let sorteios = 0;
  return montarConteudoFase(fase, () => sorteios++ === 0 ? indice : 0);
}

function conferirMemoria(fase) {
  assert.ok(fase.conjuntos.length >= 2);
  const variantes = new Set();
  for (const [indice, figuras] of fase.conjuntos.entries()) {
    const esperado = fase.conjuntos[0].length;
    assert.equal(figuras.length, esperado);
    assert.equal(new Set(figuras.map((figura) => figura.id)).size, esperado);
    const conteudo = rodada(fase, indice);
    assert.equal(conteudo.cartas.length, esperado * 2);
    assert.ok(figuras.every((figura) => conteudo.cartas.filter((carta) => carta.id === figura.id).length === 2));
    variantes.add(conteudo.cartas.map((figura) => figura.id).sort().join(","));
  }
  assert.equal(variantes.size, fase.conjuntos.length);
}

function conferirSequencia(fase) {
  assert.ok(fase.padroes.length >= 2);
  assert.equal(new Set(fase.padroes.map((padrao) => padrao.map((peca) => peca.id).join(","))).size, fase.padroes.length);
  for (const [indice, padrao] of fase.padroes.entries()) {
    const conteudo = rodada(fase, indice);
    assert.equal(conteudo.sequencia.length, fase.comprimento);
    assert.equal(conteudo.sequencia.filter((peca) => peca === null).length, 1);
    assert.equal(conteudo.sequencia[fase.lacuna], null);
    const evidencias = conteudo.sequencia.filter((peca, posicao) =>
      peca && posicao % padrao.length === fase.lacuna % padrao.length,
    );
    assert.ok(evidencias.length > 0, "O padrão tem de mostrar a peça em outra posição.");
    assert.equal(conteudo.alternativas.length, 3);
    assert.equal(new Set(conteudo.alternativas.map((peca) => peca.id)).size, 3);
    const corretas = conteudo.alternativas.filter((peca) => evidencias.every((item) => item.id === peca.id));
    assert.deepEqual(corretas.map((peca) => peca.id), [conteudo.resposta]);
    assert.ok(conteudo.alternativas.every((peca) => peca.forma && peca.cor && peca.nome));
    const [correta] = corretas;
    if (padrao.every((peca) => peca.forma === correta.forma)) {
      assert.ok(conteudo.alternativas.every((peca) => peca.forma === correta.forma));
    } else if (padrao.every((peca) => peca.cor === correta.cor)) {
      assert.ok(conteudo.alternativas.every((peca) => peca.cor === correta.cor));
    } else {
      const distratoras = conteudo.alternativas.filter((peca) => peca.id !== correta.id);
      assert.equal(distratoras.filter((peca) => peca.forma === correta.forma).length, 1);
      assert.equal(distratoras.filter((peca) => peca.cor === correta.cor).length, 1);
    }
  }
}

/** Menor distância do início à chegada por fase; não pode cair de uma fase para outra. */
const passosLabirinto = new Map();

function conferirLabirinto(fase) {
  assert.ok(fase.mapas.length >= 2);
  assert.equal(new Set(fase.mapas.map((mapa) => mapa.join("/"))).size, fase.mapas.length);
  for (const [indice, mapa] of fase.mapas.entries()) {
    const { inicio, chegada } = rodada(fase, indice);
    assert.ok(mapa.every((linha) => linha.length === mapa[0].length && /^[#.IF]+$/.test(linha)));
    assert.equal([...mapa.join("").matchAll(/I/g)].length, 1);
    assert.equal([...mapa.join("").matchAll(/F/g)].length, 1);
    assert.equal(mapa[inicio.linha][inicio.coluna], "I");
    assert.equal(mapa[chegada.linha][chegada.coluna], "F");
    const fila = [[inicio.linha, inicio.coluna, 0]];
    const visitados = new Set([`${inicio.linha}/${inicio.coluna}`]);
    let distancia;
    for (let i = 0; i < fila.length; i++) {
      const [linha, coluna, passos] = fila[i];
      if (linha === chegada.linha && coluna === chegada.coluna) distancia = passos;
      for (const [l, c] of [[linha - 1, coluna], [linha + 1, coluna], [linha, coluna - 1], [linha, coluna + 1]]) {
        const chave = `${l}/${c}`;
        if (!mapa[l]?.[c] || mapa[l][c] === "#" || visitados.has(chave)) continue;
        visitados.add(chave);
        fila.push([l, c, passos + 1]);
      }
    }
    assert.ok(distancia > 0, "O mapa tem de ter caminho até a chegada.");
    passosLabirinto.set(fase.numero, Math.min(passosLabirinto.get(fase.numero) ?? Infinity, distancia));
    assert.equal(visitados.size, [...mapa.join("")].filter((celula) => celula !== "#").length);
  }
}

for (const jogo of CATALOGO_JOGOS) {
  assert.ok(CATEGORIAS_BIBLIOTECA.includes(jogo.categoria));
  assert.ok(jogo.versao > 0);
  const totalFases = 15;
  assert.deepEqual(jogo.fases.map((fase) => fase.numero), Array.from({ length: totalFases }, (_, i) => i + 1));
  for (const fase of jogo.fases) {
    assert.ok(fase.objetivo && fase.titulo);
    if (fase.tipo === "memoria") conferirMemoria(fase);
    if (fase.tipo === "sequencia") conferirSequencia(fase);
    if (fase.tipo === "labirinto") conferirLabirinto(fase);
  }
}

const passos = [...passosLabirinto.values()];
assert.equal(passos.length, 15);
// A dificuldade (decisões no caminho) é medida pela régua (test:regua); aqui os passos só não caem.
assert.ok(passos.every((valor, i) => i === 0 || valor >= passos[i - 1]), `Passos do labirinto não podem cair: ${passos.join(",")}`);

// Ticket 09 (decisão de 2026-11-26): dica em dois níveis. O 1º orienta sem entregar; o 2º mostra a resposta.
{
  const escolha = {
    enunciado: "Pera",
    resposta: "pera",
    ocultarNomes: true,
    opcoes: [{ id: "maca", nome: "Maçã", simbolo: "🍎" }, { id: "pera", nome: "Pera", simbolo: "🍐" }],
  };
  const n1 = dicaEscolha(escolha, 1);
  assert.ok(n1 && !/pera/i.test(n1.texto) && n1.destacar == null, "1º nível da escolha não entrega");
  assert.deepEqual(dicaEscolha({ ...escolha, dica: "É verde e alongada." }, 1).texto, "É verde e alongada.");
  const n2 = dicaEscolha(escolha, 2);
  assert.ok(n2.destacar === "pera" && /figura 2/i.test(n2.texto), "2º nível mostra a figura certa sem depender do nome");

  const a = { id: "circulo-azul", nome: "Círculo azul" };
  const b = { id: "quadrado-azul", nome: "Quadrado azul" };
  const c = { id: "triangulo-azul", nome: "Triângulo azul" };
  const sequencia = { sequencia: [a, b, c, a, b, null], alternativas: [b, c, a], resposta: "triangulo-azul" };
  const s1 = dicaSequencia(sequencia, 1);
  assert.ok(!/tri[aâ]ngulo/i.test(s1.texto) && /3 posições antes/.test(s1.texto), `1º nível da sequência orienta pelo período: ${s1.texto}`);
  assert.match(dicaSequencia(sequencia, 2).texto, /triângulo azul/i);

  const cartas = ["gato", "sol", "gato", "lua", "sol", "lua"].map((id) => ({ id }));
  const m1 = dicaMemoria({ cartas, viradas: [0], encontradas: [], nivel: 1, sortear: () => 0 });
  assert.ok(m1.indicar.length === 3 && m1.indicar.includes(2) && !m1.indicar.includes(0), "1º nível indica três cartas, uma delas o par");
  const m2 = dicaMemoria({ cartas, viradas: [0], encontradas: [], nivel: 2, sortear: () => 0 });
  assert.deepEqual(m2.indicar, [2]);
  const m0 = dicaMemoria({ cartas, viradas: [], encontradas: [], nivel: 1, sortear: () => 0 });
  assert.equal(m0.indicar.length, 1, "sem carta virada, o 1º nível só sugere por onde começar");

  // Histórias: o 1º nível não diz a primeira cena; o 2º diz a próxima cena que falta.
  const cenas = [{ id: "a", nome: "Plantar a semente" }, { id: "b", nome: "Flor aberta" }];
  const o1 = dicaOrdenacao({ cenas, ordemCorreta: ["a", "b"] }, [], 1);
  assert.ok(!/plantar|flor/i.test(o1), `1º nível de Histórias não entrega: ${o1}`);
  assert.equal(dicaOrdenacao({ cenas, ordemCorreta: ["a", "b"], dica: "A flor vem depois." }, [], 1), "A flor vem depois.");
  assert.match(dicaOrdenacao({ cenas, ordemCorreta: ["a", "b"] }, [], 2), /plantar a semente/i);
  assert.match(dicaOrdenacao({ cenas, ordemCorreta: ["a", "b"] }, ["a"], 2), /flor aberta/i);

  // Forme a palavra e Do menor ao maior (ticket 12): dica própria de letras e números.
  const letras = [..."SOL"].map((l, i) => ({ id: `sol-${i}`, nome: l, simbolo: l }));
  assert.match(dicaOrdenacao({ cenas: letras, ordemCorreta: letras.map((c) => c.id) }, [], 1), /primeira letra/i);
  assert.match(dicaOrdenacao({ cenas: letras, ordemCorreta: letras.map((c) => c.id) }, ["sol-0"], 2), /próxima letra é O/);
  const nums = [3, 7, 12].map((v) => ({ id: `n${v}`, nome: String(v), simbolo: String(v) }));
  assert.match(dicaOrdenacao({ cenas: nums, ordemCorreta: nums.map((c) => c.id) }, [], 1), /menor número/i);
  assert.match(dicaOrdenacao({ cenas: nums, ordemCorreta: nums.map((c) => c.id) }, [], 2), /primeiro número é 3/);

  // Sudoku (ticket 12): o 1º nível aponta a linha, coluna ou bloco mais perto de completar; o 2º, uma casa.
  const simbolos = ["Maçã", "Pera", "Uva", "Banana"].map((nome, i) => ({ id: String(i), nome, simbolo: "x" }));
  const sudoku = { tamanho: 4, caixa: { linhas: 2, colunas: 2 }, simbolos, solucao: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]] };
  const atual = [[1, 2, 3, 0], [0, 0, 1, 2], [0, 0, 0, 0], [0, 0, 0, 0]];
  const d1 = dicaSudoku(sudoku, atual, 1);
  assert.ok(/linha 1/i.test(d1.texto) && d1.celula == null && !/banana/i.test(d1.texto), `1º nível do sudoku: ${d1.texto}`);
  const d2 = dicaSudoku(sudoku, atual, 2);
  assert.deepEqual(d2.celula, [0, 3]);
  assert.match(d2.texto, /banana/i);

  // Robô (ticket 12): caminho em comandos; o 2º nível diz o próximo comando certo.
  const mapa = ["#####", "#I..#", "###.#", "#F..#", "#####"];
  const caminho = comandosDoCaminho(mapa, { linha: 1, coluna: 1 }, { linha: 3, coluna: 1 });
  assert.deepEqual(caminho, [{ direcao: "direita", passos: 2 }, { direcao: "baixo", passos: 2 }, { direcao: "esquerda", passos: 2 }]);
  const r1 = dicaRobo({ mapa, inicio: { linha: 1, coluna: 1 }, chegada: { linha: 3, coluna: 1 } }, [], 1);
  assert.ok(!/direita|baixo|esquerda/i.test(r1), `1º nível do robô não entrega: ${r1}`);
  assert.match(dicaRobo({ mapa, inicio: { linha: 1, coluna: 1 }, chegada: { linha: 3, coluna: 1 } }, [{ direcao: "direita", passos: 2 }], 2), /baixo.*2/i);
}

// Ticket 05 (D1, 2026-11-26): Pequenos 5–6, Médios 7–9, Grandes 10–12, pela idade na data da consulta.
{
  const hoje = new Date("2026-11-26T12:00:00.000Z");
  const nascido = (iso) => new Date(`${iso}T00:00:00.000Z`);
  assert.equal(idadeEm(nascido("2018-11-26"), hoje), 8);
  assert.equal(idadeEm(nascido("2018-11-27"), hoje), 7, "véspera do aniversário");
  assert.equal(faixaPadrao(nascido("2020-01-01"), hoje), "pequenos");
  assert.equal(faixaPadrao(nascido("2019-11-27"), hoje), "pequenos", "6 anos");
  assert.equal(faixaPadrao(nascido("2019-11-26"), hoje), "medios", "7 anos");
  assert.equal(faixaPadrao(nascido("2016-11-27"), hoje), "medios", "9 anos");
  assert.equal(faixaPadrao(nascido("2016-11-26"), hoje), "grandes", "10 anos");
  assert.equal(faixaPadrao(null, hoje), null);
  assert.equal(lerFaixaPedida(undefined), undefined);
  assert.equal(lerFaixaPedida("todas"), "todas");
  assert.throws(() => lerFaixaPedida("adultos"));
}

const editorial = [...CATALOGO_JOGOS, { id: "outro", categoria: "autonomia" }];
assert.deepEqual(selecionarDestaquesJogos([], []), []);
assert.deepEqual(selecionarDestaquesJogos(editorial.slice(0, 1), []), ["memoria"]);
assert.deepEqual(selecionarDestaquesJogos(editorial.slice(0, 2), []), ["memoria", "sequencia"]);
assert.deepEqual(selecionarDestaquesJogos(editorial, []), ["memoria", "sequencia", "outro"]);
const aberturas = [
  { jogoId: "labirinto", ultimaAberturaEm: new Date(5000) },
  { jogoId: "labirinto", ultimaAberturaEm: new Date(1000) },
  { jogoId: "sequencia", ultimaAberturaEm: new Date(3000) },
];
assert.deepEqual(selecionarDestaquesJogos(editorial, aberturas), ["labirinto", "memoria", "outro"]);
assert.deepEqual(selecionarDestaquesJogos(editorial, [...aberturas].reverse()), ["labirinto", "memoria", "outro"]);
const todosExplorados = editorial.map((item, indice) => ({ jogoId: item.id, ultimaAberturaEm: new Date(indice) }));
assert.deepEqual(selecionarDestaquesJogos(editorial, todosExplorados), ["outro", "memoria", "sequencia"]);
assert.deepEqual(selecionarDestaquesJogos(editorial, editorial.map((item) => ({ jogoId: item.id, ultimaAberturaEm: new Date(5000) }))), ["memoria", "sequencia", "labirinto"]);

console.log("check-e5: três jogos, 45 fases em três trilhas, dicas em dois níveis, variantes e destaques determinísticos validados");
