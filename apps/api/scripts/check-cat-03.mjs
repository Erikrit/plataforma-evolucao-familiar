/**
 * CAT-03 — curadoria das 20 fases novas e validação pelos motores.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { CATALOGO_JOGOS_EXPANSAO_E5 } from "../prisma/catalogo-jogos-expansao-e5.mjs";

const require = createRequire(import.meta.url);
require("ts-node").register({
  project: fileURLToPath(new URL("../tsconfig.json", import.meta.url)),
  transpileOnly: true,
});
const { montarConteudoMotor, obterMotor } = require("../src/desenvolvimento/jogos/motores-jogos");
const { CATEGORIAS_BIBLIOTECA } = require("../src/desenvolvimento/constantes-desenvolvimento");

assert.equal(CATALOGO_JOGOS_EXPANSAO_E5.length, 4);
assert.deepEqual(
  CATALOGO_JOGOS_EXPANSAO_E5.map((jogo) => jogo.id),
  ["pares-sombras", "ache-intruso", "palavra-figura", "entrega-jardim"],
);

const totalFases = CATALOGO_JOGOS_EXPANSAO_E5.reduce((acc, jogo) => acc + jogo.fases.length, 0);
// Ticket 09: 15 fases por jogo, em três trilhas; a dificuldade é medida pela régua (test:regua).
assert.equal(totalFases, 60);

function rodada(tipo, config, indice) {
  let sorteios = 0;
  return montarConteudoMotor(tipo, config, () => (sorteios++ === 0 ? indice : 0));
}

function alcancavel(mapa, origem, destino, exigidos = []) {
  const indicePonto = new Map(
    exigidos.map((ponto, indice) => [`${ponto.linha}/${ponto.coluna}`, indice]),
  );
  const mascaraCompleta = (1 << exigidos.length) - 1;
  const fila = [{ ...origem, mascara: 0 }];
  const visitados = new Set([`${origem.linha}/${origem.coluna}/0`]);
  for (let i = 0; i < fila.length; i += 1) {
    const atual = fila[i];
    let mascara = atual.mascara;
    const chaveCelula = `${atual.linha}/${atual.coluna}`;
    if (indicePonto.has(chaveCelula)) {
      mascara |= 1 << indicePonto.get(chaveCelula);
    }
    if (
      atual.linha === destino.linha
      && atual.coluna === destino.coluna
      && mascara === mascaraCompleta
    ) {
      return true;
    }
    for (const [dl, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const linha = atual.linha + dl;
      const coluna = atual.coluna + dc;
      const celula = mapa[linha]?.[coluna];
      if (!celula || celula === "#") continue;
      const chave = `${linha}/${coluna}/${mascara}`;
      if (visitados.has(chave)) continue;
      visitados.add(chave);
      fila.push({ linha, coluna, mascara });
    }
  }
  return false;
}

for (const jogo of CATALOGO_JOGOS_EXPANSAO_E5) {
  assert.ok(CATEGORIAS_BIBLIOTECA.includes(jogo.categoria));
  assert.ok(jogo.tipoMecanica);
  obterMotor(jogo.tipoMecanica);
  assert.deepEqual(jogo.fases.map((fase) => fase.numero), Array.from({ length: 15 }, (_, i) => i + 1));
  for (const fase of jogo.fases) {
    assert.ok(fase.titulo && fase.objetivo);
    const config = obterMotor(jogo.tipoMecanica).validarConfiguracao(fase.configuracao);
    assert.ok(config);

    if (jogo.tipoMecanica === "memoria") {
      assert.ok(fase.configuracao.conjuntos.length >= 2);
      const esperados = fase.configuracao.conjuntos[0].length;
      for (const [indice, conjunto] of fase.configuracao.conjuntos.entries()) {
        assert.equal(conjunto.length, esperados);
        const conteudo = rodada("memoria", fase.configuracao, indice);
        assert.equal(conteudo.tipo, "memoria");
        assert.equal(conteudo.cartas.length, esperados * 2);
        assert.ok(conteudo.cartas.every((carta) => carta.face === "objeto" || carta.face === "sombra"));
        assert.equal(
          conteudo.cartas.filter((carta) => carta.face === "sombra").length,
          esperados,
        );
      }
    }

    if (jogo.tipoMecanica === "escolha") {
      assert.ok(fase.configuracao.conjuntos.length >= 2);
      const ids = new Set();
      for (const [indice, conjunto] of fase.configuracao.conjuntos.entries()) {
        assert.equal(conjunto.opcoes.filter((opcao) => opcao.id === conjunto.resposta).length, 1);
        const conteudo = rodada("escolha", fase.configuracao, indice);
        assert.equal(conteudo.tipo, "escolha");
        assert.equal(conteudo.resposta, conjunto.resposta);
        assert.equal(conteudo.opcoes.length, conjunto.opcoes.length);
        assert.ok(conteudo.enunciado);
        ids.add(conjunto.resposta + "|" + conjunto.opcoes.map((o) => o.id).sort().join(","));
      }
      assert.equal(ids.size, fase.configuracao.conjuntos.length);
    }

    if (jogo.tipoMecanica === "labirinto") {
      const esperados = [...fase.configuracao.mapas[0].join("")].filter((c) => c === "P").length;
      assert.ok(esperados >= 1 && fase.configuracao.mapas.length >= 2);
      for (const [indice, mapa] of fase.configuracao.mapas.entries()) {
        const conteudo = rodada("labirinto", fase.configuracao, indice);
        assert.equal(conteudo.tipo, "labirinto");
        assert.equal(conteudo.pontos.length, esperados);
        assert.ok(alcancavel(mapa, conteudo.inicio, conteudo.chegada, conteudo.pontos));
      }
    }
  }
}

console.log("check-cat-03: quatro jogos, 60 fases, variantes e motores validados");
