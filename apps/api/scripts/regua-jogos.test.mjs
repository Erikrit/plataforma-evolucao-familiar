/**
 * Régua de qualidade dos jogos (M03 §15; DEV-CAT-M1, ticket 02).
 * Rodar: npm run test:regua -w @pef/api
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { avaliarCatalogo, CATALOGO_CARREGADO } from "./lib-regua-jogos.mjs";

const fig = (id, nome, simbolo) => ({ id, nome, simbolo });

function jogo(tipoMecanica, configuracoes, id = `jogo-${tipoMecanica}`) {
  return {
    id,
    nome: id,
    tipoMecanica,
    fases: configuracoes.map((configuracao, indice) => ({
      numero: indice + 1,
      titulo: `Fase ${indice + 1}`,
      objetivo: "Objetivo.",
      configuracao,
    })),
  };
}

const falhasDe = (relatorio, regra) => relatorio.falhas.filter((falha) => falha.regra === regra);

const labirintoBom = [
  { mapas: [["#####", "#I.F#", "#####"], ["#####", "#I#.#", "#...#", "#F###", "#####"]] },
  // Fase 2: as duas variantes têm uma decisão no caminho (a fase 1 não tem nenhuma).
  { mapas: [["#####", "#I..#", "#.#.#", "#..F#", "#####"], ["######", "#I.#.#", "##...#", "#F.###", "######"]] },
];
const corredor = (n) => ["#".repeat(n + 3), `#I${".".repeat(n - 1)}F#`, "#".repeat(n + 3)];
const curva = ["#####", "#I..#", "###.#", "#F..#", "#####"];

test("catálogo coerente é aprovado", () => {
  const relatorio = avaliarCatalogo([jogo("labirinto", labirintoBom)]);
  assert.deepEqual(relatorio.falhas, []);
  assert.equal(relatorio.aprovado, true);
});

test("labirinto que só cresce em passos, sem mais decisões no caminho, reprova (H10)", () => {
  const relatorio = avaliarCatalogo([jogo("labirinto", [labirintoBom[0], { mapas: [corredor(5), curva] }])]);
  assert.deepEqual(falhasDe(relatorio, "progressao").map((f) => [f.fase, f.detalhe]), [[2, "decisoes 0 → 0: a métrica do motor não cresce"]]);
});

test("labirinto com mais decisões mas menos passos também reprova", () => {
  const relatorio = avaliarCatalogo([jogo("labirinto", [{ mapas: [corredor(7), ["#########", "#I......#", "#######F#", "#########"]] }, labirintoBom[1]])]);
  assert.deepEqual(falhasDe(relatorio, "progressao").map((f) => [f.fase, f.detalhe]), [[2, "passos 7 → 4: a dificuldade cai"]]);
});

test("E5-ACE-03: fase sem solução reprova o catálogo", () => {
  const semCaminho = { mapas: [["#####", "#I#F#", "#####"], labirintoBom[1].mapas[1]] };
  const relatorio = avaliarCatalogo([jogo("labirinto", [labirintoBom[0], semCaminho])]);
  assert.equal(relatorio.aprovado, false);
  assert.deepEqual(falhasDe(relatorio, "solucao").map((f) => [f.fase, f.variante]), [[2, 1]]);
});

test("E5-ACE-03: escolha com duas respostas reprova o catálogo", () => {
  const conjunto = (opcoes) => ({ enunciado: "Qual não é fruta?", opcoes, resposta: "carro" });
  const relatorio = avaliarCatalogo([
    jogo("escolha", [
      {
        conjuntos: [
          conjunto([fig("maca", "Maçã", "🍎"), fig("pera", "Pera", "🍐"), fig("carro", "Carro", "🚗"), fig("carro-2", "Carro", "🚗")]),
          conjunto([fig("uva", "Uva", "🍇"), fig("banana", "Banana", "🍌"), fig("carro", "Carro", "🚗")]),
        ],
      },
    ]),
  ]);
  assert.equal(relatorio.aprovado, false);
  assert.deepEqual(falhasDe(relatorio, "resposta-unica").map((f) => f.variante), [1]);
});

test("E5-ACE-03: memória ou ordenação com figuras iguais admitem duas respostas", () => {
  const relatorio = avaliarCatalogo([
    jogo("memoria", [
      { conjuntos: [[fig("gato", "Gato", "🐈"), fig("gato-2", "Gato", "🐈")], [fig("sol", "Sol", "☀️"), fig("lua", "Lua", "🌙")]] },
    ]),
    jogo("ordenacao", [
      {
        conjuntos: [
          { enunciado: "A", cenas: [fig("a", "Acordar", "⏰"), fig("b", "Acordar", "⏰"), fig("c", "Vestir-se", "👕")] },
          { enunciado: "B", cenas: [fig("d", "Escovar os dentes", "🪥"), fig("e", "Vestir-se", "👕")] },
        ],
      },
    ]),
  ]);
  assert.equal(relatorio.aprovado, false);
  assert.deepEqual(falhasDe(relatorio, "resposta-unica").map((f) => [f.jogo, f.variante]), [["jogo-memoria", 1], ["jogo-ordenacao", 1]]);
});

test("escolha sem a resposta entre as opções não tem solução", () => {
  const relatorio = avaliarCatalogo([
    jogo("escolha", [{ conjuntos: [{ enunciado: "Qual?", opcoes: [fig("uva", "Uva", "🍇"), fig("pera", "Pera", "🍐")], resposta: "maca" }] }]),
  ]);
  assert.equal(falhasDe(relatorio, "solucao").length, 1);
});

test("rótulo igual ao enunciado ou nome único entre repetidos entrega a resposta", () => {
  const relatorio = avaliarCatalogo([
    jogo("escolha", [
      {
        conjuntos: [
          { enunciado: "Pera", opcoes: [fig("maca", "Maçã", "🍎"), fig("pera", "Pera", "🍐")], resposta: "pera" },
          {
            enunciado: "Qual não combina?",
            opcoes: [fig("e1", "Estrela", "⭐"), fig("e2", "Estrela", "⭐"), fig("lua", "Lua", "🌙")],
            resposta: "lua",
          },
          {
            enunciado: "Qual não é fruta?",
            opcoes: [fig("maca", "Maçã", "🍎"), fig("pera", "Pera", "🍐"), fig("carro", "Carro", "🚗")],
            resposta: "carro",
          },
        ],
      },
    ]),
  ]);
  assert.deepEqual(falhasDe(relatorio, "rotulo").map((f) => f.variante), [1, 2]);
});

test("face de sombra com o nome do objeto entrega o par", () => {
  const par = (id, nome, simbolo, nomeSombra) => ({
    id,
    faces: [{ nome, simbolo, face: "objeto" }, { nome: nomeSombra, simbolo, face: "sombra" }],
  });
  const relatorio = avaliarCatalogo([
    jogo("memoria", [
      {
        conjuntos: [
          [par("gato", "Gato", "🐈", "Sombra: Gato"), par("sol", "Sol", "☀️", "Sombra")],
          [par("peixe", "Peixe", "🐟", "Sombra"), par("lua", "Lua", "🌙", "Sombra")],
        ],
      },
    ]),
  ]);
  assert.deepEqual(falhasDe(relatorio, "rotulo").map((f) => [f.variante, f.detalhe]), [[1, "a sombra mostra o nome do objeto (“Sombra: Gato”)"]]);
  assert.deepEqual(falhasDe(relatorio, "nome-figura"), []);
});

test("nome e figura divergentes ou sem referência reprovam", () => {
  const relatorio = avaliarCatalogo([
    jogo("memoria", [{ conjuntos: [[fig("libelula", "Libélula", "🪰"), fig("gato", "Gato", "🐈")], [fig("x", "Xis", "🦄"), fig("sol", "Sol", "☀️")]] }]),
  ]);
  assert.deepEqual(
    falhasDe(relatorio, "nome-figura").map((f) => f.detalhe),
    ["“Libélula” não corresponde a 🪰 (mosca)", "🦄 sem referência no vocabulário revisado"],
  );
});

test("peça de sequência com nome diferente da forma e cor reprova", () => {
  const peca = (forma, cor, nome = `${forma} ${cor}`) => ({ id: `${forma}-${cor}`, forma, cor, nome });
  const relatorio = avaliarCatalogo([
    jogo("sequencia", [
      {
        comprimento: 5,
        lacuna: 4,
        padroes: [
          [peca("circulo", "azul", "Círculo azul"), peca("circulo", "verde", "Círculo roxo")],
          [peca("quadrado", "azul", "Quadrado azul"), peca("quadrado", "verde", "Quadrado verde")],
        ],
      },
    ]),
  ]);
  assert.deepEqual(falhasDe(relatorio, "nome-figura").map((f) => f.variante), [1]);
});

test("métrica principal que cai ou empata sem secundária crescer reprova", () => {
  const pares = (n) => ({
    conjuntos: [
      ["gato", "peixe", "sol", "lua", "bola", "pipa"].slice(0, n).map((id) => fig(id, id[0].toUpperCase() + id.slice(1), { gato: "🐈", peixe: "🐟", sol: "☀️", lua: "🌙", bola: "⚽", pipa: "🪁" }[id])),
      ["trem", "barco", "uva", "pera", "maca", "casa"].slice(0, n).map((id) => fig(id, { trem: "Trem", barco: "Barco", uva: "Uva", pera: "Pera", maca: "Maçã", casa: "Casa" }[id], { trem: "🚂", barco: "⛵", uva: "🍇", pera: "🍐", maca: "🍎", casa: "🏠" }[id])),
    ],
  });
  const relatorio = avaliarCatalogo([jogo("memoria", [pares(2), pares(4), pares(3), pares(3)])]);
  assert.deepEqual(falhasDe(relatorio, "progressao").map((f) => f.fase), [3, 4]);
});

test("variante com as mesmas paredes e só a chegada em outro lugar reprova", () => {
  const v1 = ["#######", "#I....#", "#.###.#", "#...#F#", "#######"];
  const v2 = ["#######", "#I....#", "#.###.#", "#F..#.#", "#######"];
  const relatorio = avaliarCatalogo([jogo("labirinto", [{ mapas: [v1, v2] }])]);
  assert.deepEqual(falhasDe(relatorio, "variedade").map((f) => f.detalhe), ["variante 2 tem as mesmas paredes da variante 1"]);
});

test("variante espelhada ou com a mesma solução reprova", () => {
  const mapa = ["#####", "#I..#", "###F#", "#####"];
  const espelho = mapa.map((linha) => [...linha].reverse().join(""));
  const relatorio = avaliarCatalogo([
    jogo("labirinto", [{ mapas: [mapa, espelho] }]),
    jogo("ordenacao", [
      { conjuntos: [{ enunciado: "A", cenas: [fig("a", "Acordar", "⏰"), fig("b", "Vestir-se", "👕")] }, { enunciado: "B", cenas: [fig("a", "Acordar", "⏰"), fig("b", "Vestir-se", "👕")] }] },
    ]),
  ]);
  assert.deepEqual(falhasDe(relatorio, "variedade").map((f) => f.jogo), ["jogo-labirinto", "jogo-ordenacao"]);
});

test("DEV-CAT-P03: Caminhos e labirintos tem 15 fases em três trilhas aprovadas pela régua", () => {
  const labirinto = CATALOGO_CARREGADO.find((j) => j.id === "labirinto");
  const relatorio = avaliarCatalogo([labirinto]);
  assert.deepEqual(relatorio.falhas, []);
  assert.deepEqual(labirinto.fases.map((f) => f.numero), Array.from({ length: 15 }, (_, i) => i + 1));
  assert.deepEqual(
    labirinto.fases.map((f) => f.trilha),
    [...Array(5).fill("pequenos"), ...Array(5).fill("medios"), ...Array(5).fill("grandes")],
  );
  assert.ok(labirinto.fases.every((f) => f.configuracao.mapas.every((m) => m[0].length <= 15)), "até 15 colunas (320 px)");
});

// Linha de base do modo relatório: ao refazer os 8 jogos (ticket 09), este teste
// passa a exigir catálogo aprovado.
test("relatório do catálogo carregado reproduz as falhas conhecidas", () => {
  const relatorio = avaliarCatalogo(CATALOGO_CARREGADO);
  assert.equal(relatorio.jogos.length, 8);

  const entrega = relatorio.jogos.find((j) => j.id === "entrega-jardim");
  assert.deepEqual(entrega.fases.map((f) => f.metricas.passos), [4, 14, 8, 14, 33]);
  assert.deepEqual(
    falhasDe(relatorio, "progressao").map((f) => `${f.jogo}:${f.fase}`),
    ["memoria:5", "ache-intruso:3", "palavra-figura:3", "palavra-figura:5", "entrega-jardim:3", "entrega-jardim:3", "entrega-jardim:5", "historias-cenas:3", "historias-cenas:5"],
  );

  const rotulos = falhasDe(relatorio, "rotulo");
  assert.ok(rotulos.some((f) => f.jogo === "ache-intruso"));
  assert.equal(rotulos.filter((f) => f.jogo === "palavra-figura").length, 10);
  assert.equal(rotulos.filter((f) => f.jogo === "pares-sombras").length, 10);

  const nomes = falhasDe(relatorio, "nome-figura").map((f) => f.detalhe);
  assert.ok(nomes.some((d) => d.includes("Libélula") && d.includes("🪰")));
  assert.ok(nomes.some((d) => d.includes("Secar com toalha") && d.includes("🧺")));

  assert.deepEqual([...new Set(falhasDe(relatorio, "variedade").map((f) => f.jogo))], ["entrega-jardim"]);
  assert.deepEqual(falhasDe(relatorio, "solucao"), []);
  assert.deepEqual(falhasDe(relatorio, "resposta-unica"), []);
  assert.equal(relatorio.aprovado, false);
});
