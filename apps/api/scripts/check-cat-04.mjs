/**
 * CAT-04 — Histórias em cenas: curadoria, variantes e motor de ordenação.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { CATALOGO_JOGOS_HISTORIAS_E5 } from "../prisma/catalogo-jogos-historias-e5.mjs";
import { CATALOGO_JOGOS_PILOTO_E5 } from "../prisma/catalogo-jogos-piloto-e5.mjs";
import { CATALOGO_JOGOS_EXPANSAO_E5 } from "../prisma/catalogo-jogos-expansao-e5.mjs";

const require = createRequire(import.meta.url);
require("ts-node").register({
  project: fileURLToPath(new URL("../tsconfig.json", import.meta.url)),
  transpileOnly: true,
});
const { montarConteudoMotor, obterMotor } = require("../src/desenvolvimento/jogos/motores-jogos");
const { CATEGORIAS_BIBLIOTECA } = require("../src/desenvolvimento/constantes-desenvolvimento");

assert.equal(CATALOGO_JOGOS_HISTORIAS_E5.length, 1);
assert.equal(CATALOGO_JOGOS_HISTORIAS_E5[0].id, "historias-cenas");
assert.equal(CATALOGO_JOGOS_HISTORIAS_E5[0].tipoMecanica, "ordenacao");
assert.equal(CATALOGO_JOGOS_HISTORIAS_E5[0].fases.length, 15);

const oficial = [
  ...CATALOGO_JOGOS_PILOTO_E5,
  ...CATALOGO_JOGOS_EXPANSAO_E5,
  ...CATALOGO_JOGOS_HISTORIAS_E5,
];
assert.equal(oficial.length, 8);
// Sem total fixo (DEV-CAT-M1, ticket 03): cada jogo tem trilhas completas de cinco fases.
assert.ok(oficial.every((jogo) => [5, 10, 15].includes(jogo.fases.length)));
const totalFasesOficial = oficial.reduce((acc, jogo) => acc + jogo.fases.length, 0);
assert.deepEqual(
  [...oficial.map((jogo) => jogo.id)].sort(),
  [
    "ache-intruso",
    "entrega-jardim",
    "historias-cenas",
    "labirinto",
    "memoria",
    "palavra-figura",
    "pares-sombras",
    "sequencia",
  ],
);
assert.equal(
  oficial.find((jogo) => jogo.id === "historias-cenas").ordemEditorial,
  7,
);
assert.equal(
  oficial.find((jogo) => jogo.id === "entrega-jardim").ordemEditorial,
  8,
);

function rodada(config, indice) {
  let sorteios = 0;
  return montarConteudoMotor("ordenacao", config, () => (sorteios++ === 0 ? indice : 0));
}

for (const jogo of CATALOGO_JOGOS_HISTORIAS_E5) {
  assert.ok(CATEGORIAS_BIBLIOTECA.includes(jogo.categoria));
  obterMotor(jogo.tipoMecanica);
  assert.deepEqual(jogo.fases.map((fase) => fase.numero), Array.from({ length: 15 }, (_, i) => i + 1));
  for (const fase of jogo.fases) {
    assert.ok(fase.titulo && fase.objetivo);
    // Ticket 09: cenas de 2 a 9; empate de cenas passa só quando a pista sai (régua).
    const esperados = fase.configuracao.conjuntos[0].cenas.length;
    assert.ok(fase.configuracao.conjuntos.length >= 2);
    const assinaturas = new Set();
    for (const [indice, conjunto] of fase.configuracao.conjuntos.entries()) {
      assert.equal(conjunto.cenas.length, esperados);
      assert.equal(new Set(conjunto.cenas.map((cena) => cena.id)).size, esperados);
      assert.ok(conjunto.enunciado);
      const config = obterMotor("ordenacao").validarConfiguracao({
        conjuntos: [conjunto],
      });
      assert.ok(config);
      const conteudo = rodada(fase.configuracao, indice);
      assert.equal(conteudo.tipo, "ordenacao");
      assert.equal(conteudo.ordemCorreta.length, esperados);
      // Ticket 13: as intrusas aparecem junto e ficam fora da ordem certa.
      const intrusas = (conjunto.intrusas ?? []).length;
      assert.equal(conteudo.cenas.length, esperados + intrusas);
      assert.equal(conteudo.intrusas ?? 0, intrusas);
      assert.equal(Boolean(conteudo.ocultarNomes), fase.numero >= 6);
      assert.deepEqual(
        conteudo.ordemCorreta,
        conjunto.cenas.map((cena) => cena.id),
      );
      assert.ok(
        !conteudo.cenas.every((cena, i) => cena.id === conteudo.ordemCorreta[i]),
        "partida não deve começar já ordenada",
      );
      assinaturas.add(conjunto.cenas.map((cena) => cena.id).join(">"));
    }
    assert.equal(assinaturas.size, fase.configuracao.conjuntos.length);
  }
}

console.log(`check-cat-04: Histórias em cenas, 15 fases, variantes e ordenação validados; oficial 8/${totalFasesOficial}`);
