import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
require("ts-node").register({
  project: fileURLToPath(new URL("../tsconfig.json", import.meta.url)),
  transpileOnly: true,
});
const { CATALOGO_JOGOS, montarConteudoFase } = require("../src/desenvolvimento/jogos/catalogo-jogos");
const { selecionarDestaquesJogos } = require("../src/desenvolvimento/jogos/destaques-jogos");
const { CATEGORIAS_BIBLIOTECA } = require("../src/desenvolvimento/constantes-desenvolvimento");

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
    const esperado = [2, 3, 4, 6, 6][fase.numero - 1];
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
    assert.equal(distancia, [6, 8, 10, 16, 19][fase.numero - 1]);
    assert.equal(visitados.size, [...mapa.join("")].filter((celula) => celula !== "#").length);
  }
}

for (const jogo of CATALOGO_JOGOS) {
  assert.ok(CATEGORIAS_BIBLIOTECA.includes(jogo.categoria));
  assert.ok(jogo.versao > 0);
  assert.deepEqual(jogo.fases.map((fase) => fase.numero), [1, 2, 3, 4, 5]);
  for (const fase of jogo.fases) {
    assert.ok(fase.objetivo && fase.titulo);
    if (fase.tipo === "memoria") conferirMemoria(fase);
    if (fase.tipo === "sequencia") conferirSequencia(fase);
    if (fase.tipo === "labirinto") conferirLabirinto(fase);
  }
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

console.log("check-e5: três jogos, 15 fases, variantes e destaques determinísticos validados");
