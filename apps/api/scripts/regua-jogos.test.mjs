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

// ---- Ticket 09 (decisões do responsável em 2026-11-26) ----

test("memória: empate em pares só passa com mais figuras do mesmo grupo", () => {
  const frutas = [fig("maca", "Maçã", "🍎"), fig("pera", "Pera", "🍐"), fig("uva", "Uva", "🍇"), fig("banana", "Banana", "🍌")];
  const misto = [fig("maca", "Maçã", "🍎"), fig("gato", "Gato", "🐈"), fig("sol", "Sol", "☀️"), fig("carro", "Carro", "🚗")];
  const misto2 = [fig("pera", "Pera", "🍐"), fig("peixe", "Peixe", "🐟"), fig("lua", "Lua", "🌙"), fig("trem", "Trem", "🚂")];
  const frutas2 = [fig("laranja", "Laranja", "🍊"), fig("morango", "Morango", "🍓"), fig("cereja", "Cereja", "🍒"), fig("melancia", "Melancia", "🍉")];
  const passa = avaliarCatalogo([jogo("memoria", [{ conjuntos: [misto, misto2] }, { conjuntos: [frutas, frutas2] }])]);
  assert.deepEqual(falhasDe(passa, "progressao"), []);
  const falha = avaliarCatalogo([jogo("memoria", [{ conjuntos: [frutas, frutas2] }, { conjuntos: [misto, misto2] }])]);
  assert.deepEqual(falhasDe(falha, "progressao").map((f) => f.fase), [2]);
});

test("escolha: empate em opções só passa com distratores mais parecidos com a resposta", () => {
  const longe = { enunciado: "Pera", ocultarNomes: true, resposta: "pera", opcoes: [fig("pera", "Pera", "🍐"), fig("gato", "Gato", "🐈"), fig("carro", "Carro", "🚗")] };
  const longe2 = { enunciado: "Uva", ocultarNomes: true, resposta: "uva", opcoes: [fig("uva", "Uva", "🍇"), fig("sol", "Sol", "☀️"), fig("trem", "Trem", "🚂")] };
  const perto = { enunciado: "Pera", ocultarNomes: true, resposta: "pera", opcoes: [fig("pera", "Pera", "🍐"), fig("maca", "Maçã", "🍎"), fig("banana", "Banana", "🍌")] };
  const perto2 = { enunciado: "Uva", ocultarNomes: true, resposta: "uva", opcoes: [fig("uva", "Uva", "🍇"), fig("cereja", "Cereja", "🍒"), fig("morango", "Morango", "🍓")] };
  const passa = avaliarCatalogo([jogo("escolha", [{ conjuntos: [longe, longe2] }, { conjuntos: [perto, perto2] }])]);
  assert.deepEqual(passa.falhas, []);
  const falha = avaliarCatalogo([jogo("escolha", [{ conjuntos: [perto, perto2] }, { conjuntos: [longe, longe2] }])]);
  assert.deepEqual(falhasDe(falha, "progressao").map((f) => f.fase), [2]);
});

test("escolha com nomes ocultos não entrega a resposta pelo rótulo; dica com o nome da resposta reprova", () => {
  const conjunto = (dica) => ({ enunciado: "Pera", ocultarNomes: true, resposta: "pera", dica, opcoes: [fig("pera", "Pera", "🍐"), fig("maca", "Maçã", "🍎")] });
  const relatorio = avaliarCatalogo([jogo("escolha", [{ conjuntos: [conjunto("É verde e alongada."), { ...conjunto("Procure a pera."), enunciado: "Pera " }] }])]);
  assert.deepEqual(falhasDe(relatorio, "rotulo"), []);
  assert.deepEqual(falhasDe(relatorio, "dica").map((f) => f.variante), [2]);
});

test("ordenação: empate em cenas só passa quando a pista sai", () => {
  const cenas = (ids) => ids.map((id) => ({ id, nome: { acordar: "Acordar", vestir: "Vestir-se", mochila: "Pegar a mochila", escola: "Chegar à escola" }[id], simbolo: { acordar: "⏰", vestir: "👕", mochila: "🎒", escola: "🏫" }[id] }));
  const comPista = { enunciado: "Manhã", cenas: cenas(["acordar", "vestir", "mochila"]), dica: "Vestir vem antes da mochila." };
  const comPista2 = { enunciado: "Escola", cenas: cenas(["vestir", "mochila", "escola"]), dica: "A mochila vem antes da escola." };
  const semPista = { enunciado: "Manhã", cenas: cenas(["acordar", "vestir", "escola"]) };
  const semPista2 = { enunciado: "Escola", cenas: cenas(["acordar", "mochila", "escola"]) };
  const passa = avaliarCatalogo([jogo("ordenacao", [{ conjuntos: [comPista, comPista2] }, { conjuntos: [semPista, semPista2] }])]);
  assert.deepEqual(falhasDe(passa, "progressao"), []);
  const falha = avaliarCatalogo([jogo("ordenacao", [{ conjuntos: [semPista, semPista2] }, { conjuntos: [comPista, comPista2] }])]);
  assert.deepEqual(falhasDe(falha, "progressao").map((f) => f.fase), [2]);
});

// ---- Tickets 12 e 13 (decisões de 2026-11-26) ----

const cena = (id, nome, simbolo) => ({ id, nome, simbolo });
const manha = [cena("acordar", "Acordar com o despertador", "⏰"), cena("mochila", "Pegar a mochila", "🎒"), cena("escola", "Chegar à escola", "🏫")];
const lanche = [cena("pao", "Pegar o pão", "🍞"), cena("queijo", "Pôr o queijo no pão", "🧀"), cena("comer", "Comer o sanduíche", "🥪")];

test("ordenação: empate em cenas passa quando os nomes somem ou entra intrusa", () => {
  const base = { conjuntos: [{ enunciado: "A", cenas: manha }, { enunciado: "B", cenas: lanche }] };
  const semNomes = { conjuntos: base.conjuntos.map((c) => ({ ...c, ocultarNomes: true })) };
  const intrusa = { conjuntos: semNomes.conjuntos.map((c, i) => ({ ...c, intrusas: [i ? cena("carro", "Esfregar o carro", "🚗") : cena("bola", "Bola", "⚽")] })) };
  const passa = avaliarCatalogo([jogo("ordenacao", [base, semNomes, intrusa])]);
  assert.deepEqual(falhasDe(passa, "progressao"), []);
  assert.deepEqual(passa.jogos[0].fases.map((f) => [f.metricas.semNomes, f.metricas.intrusas]), [[0, 0], [1, 0], [1, 1]]);
  const falha = avaliarCatalogo([jogo("ordenacao", [intrusa, base])]);
  assert.deepEqual(falhasDe(falha, "progressao").map((f) => f.fase), [2]);
});

test("ordenação: intrusa igual a uma cena da história admite duas respostas", () => {
  const relatorio = avaliarCatalogo([
    jogo("ordenacao", [{ conjuntos: [{ enunciado: "A", cenas: manha, intrusas: [cena("x", "Pegar a mochila", "🎒")] }, { enunciado: "B", cenas: lanche }] }]),
  ]);
  assert.deepEqual(falhasDe(relatorio, "resposta-unica").map((f) => f.variante), [1]);
});

test("peças de letra e número se descrevem sozinhas; números fora de ordem não têm solução", () => {
  const letras = (palavra) => [...palavra].map((l, i) => cena(`${palavra}-${i}`, l, l));
  const numeros = (lista) => lista.map((n) => cena(`n${n}`, String(n), String(n)));
  const ok = avaliarCatalogo([
    jogo("ordenacao", [{ conjuntos: [{ enunciado: "Forme a palavra da figura ☀️", cenas: letras("SOL") }, { enunciado: "Forme a palavra da figura 🌙", cenas: letras("LUA") }] }], "forme-palavra"),
    jogo("ordenacao", [{ conjuntos: [{ enunciado: "Do menor ao maior", cenas: numeros([3, 7, 12]) }, { enunciado: "Do menor ao maior", cenas: numeros([2, 5, 9]) }] }], "menor-maior"),
  ]);
  assert.deepEqual(ok.falhas, []);
  const ruim = avaliarCatalogo([
    jogo("ordenacao", [{ conjuntos: [{ enunciado: "Do menor ao maior", cenas: numeros([7, 3, 12]) }, { enunciado: "Do menor ao maior", cenas: [cena("a", "B", "C"), cena("b", "1", "1")] }] }]),
  ]);
  assert.deepEqual(ruim.falhas.map((f) => [f.variante, f.regra]), [[1, "solucao"], [2, "nome-figura"]]);
});

const simbolosSudoku = [fig("maca", "Maçã", "🍎"), fig("pera", "Pera", "🍐"), fig("uva", "Uva", "🍇"), fig("banana", "Banana", "🍌")];
const solucao4 = ["1234", "3412", "2143", "4321"];

test("sudoku: solução única aprova; duas soluções ou dado errado reprova; vazias medem a dificuldade", () => {
  const grade = (inicial) => ({ inicial, solucao: solucao4 });
  const fase = (a, b) => ({ tamanho: 4, simbolos: simbolosSudoku, grades: [grade(a), grade(b)] });
  const ok = avaliarCatalogo([jogo("sudoku", [fase(["12.4", "3412", "2143", "4321"], ["1234", "3.12", "2143", "4321"]), fase(["1..4", "3412", "2143", "4321"], ["1234", "3412", "2.43", "43.1"])])]);
  assert.deepEqual(ok.falhas, []);
  assert.deepEqual(ok.jogos[0].fases.map((f) => f.metricas.vazias), [1, 2]);
  const ruim = avaliarCatalogo([jogo("sudoku", [fase(["....", "....", "....", "...."], ["1234", "3412", "2143", "4322"])])]);
  assert.deepEqual(ruim.falhas.map((f) => [f.variante, f.regra]), [[1, "resposta-unica"], [2, "solucao"]]);
});

test("robô com setas: curvas no caminho medem a dificuldade e passos não caem", () => {
  const reto = ["#######", "#I...F#", "#######"];
  const reto2 = ["######", "#I...#", "####F#", "######"];
  const curva = ["#####", "#I..#", "###.#", "#F..#", "#####"];
  const curva2 = ["######", "#I.#.#", "##.#.#", "#F...#", "######"];
  const relatorio = avaliarCatalogo([jogo("robo", [{ mapas: [reto, reto2] }, { mapas: [curva, curva2] }])]);
  assert.deepEqual(relatorio.jogos[0].fases.map((f) => f.metricas.curvas), [0, 2]);
  assert.deepEqual(falhasDe(relatorio, "progressao"), []);
  const cai = avaliarCatalogo([jogo("robo", [{ mapas: [curva, curva2] }, { mapas: [reto, reto2] }])]);
  assert.deepEqual(falhasDe(cai, "progressao").map((f) => f.fase), [2]);
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

// ---- DEV-CAT-M1-CONTEUDO, ticket 04: pares diferentes entre si e escolha sem rótulo que entregue ----

test("letra inicial: só a resposta começa com a letra ou sílaba pedida", () => {
  const conjunto = (inicio, resposta, opcoes) => ({ enunciado: `Qual figura começa com ${inicio}?`, inicio, ocultarNomes: true, resposta, opcoes });
  const relatorio = avaliarCatalogo([
    jogo("escolha", [
      {
        conjuntos: [
          conjunto("B", "bola", [fig("bola", "Bola", "⚽"), fig("barco", "Barco", "⛵"), fig("gato", "Gato", "🐈")]),
          conjunto("PA", "peixe", [fig("peixe", "Peixe", "🐟"), fig("pato", "Pato", "🦆"), fig("lua", "Lua", "🌙")]),
          conjunto("MA", "maca", [fig("maca", "Maçã", "🍎"), fig("pao", "Pão", "🍞"), fig("uva", "Uva", "🍇")]),
        ],
      },
    ]),
  ]);
  assert.deepEqual(falhasDe(relatorio, "resposta-unica").map((f) => f.variante), [1]);
  assert.deepEqual(falhasDe(relatorio, "solucao").map((f) => f.variante), [2]);
});

test("adivinha pela pista: pista e dica não dizem o nome da resposta", () => {
  const conjunto = (enunciado, dica) => ({ enunciado, dica, pista: true, ocultarNomes: true, resposta: "banana", opcoes: [fig("banana", "Banana", "🍌"), fig("uva", "Uva", "🍇")] });
  const relatorio = avaliarCatalogo([
    jogo("escolha", [
      {
        conjuntos: [
          conjunto("Sou amarela, comprida e nasço na bananeira. Quem sou eu?", "Pense na cor."),
          conjunto("Sou amarela e comprida. Quem sou eu?", "Lembre do cacho de bananas."),
          conjunto("Sou amarela e comprida. Os macacos adoram me comer. Quem sou eu?", "Pense na cor."),
        ],
      },
    ]),
  ]);
  assert.deepEqual(falhasDe(relatorio, "rotulo").map((f) => f.variante), [1]);
  assert.deepEqual(falhasDe(relatorio, "dica").map((f) => f.variante), [2]);
});

// Homologação de 2026-11-27: a dificuldade tem de subir de verdade, com distrações cada vez
// mais parecidas com a resposta, e não só com mais opções.
const escolhaPorTrilha = (conjuntosPorTrilha) => ({
  id: "jogo-escolha-trilhas",
  nome: "Jogo de escolha",
  tipoMecanica: "escolha",
  fases: conjuntosPorTrilha.map((conjuntos, indice) => ({
    numero: indice + 1,
    trilha: ["pequenos", "medios", "grandes"][indice],
    titulo: `Fase ${indice + 1}`,
    objetivo: "Objetivo.",
    configuracao: { conjuntos },
  })),
});
const letra = (inicio, resposta, opcoes) => ({ enunciado: `Qual figura começa com ${inicio}?`, inicio, ocultarNomes: true, resposta, opcoes, dica: "Fale devagar." });
const pistaDe = (enunciado, resposta, opcoes) => ({ enunciado, pista: true, ocultarNomes: true, resposta, opcoes, dica: "Pense bem." });
const parecidasDe = (relatorio) => relatorio.jogos[0].fases.map((f) => f.metricas.parecidas);

test("letra inicial: distrações parecidas são as de som vizinho (B/P, F/V…) e, na sílaba, as de mesma letra", () => {
  const relatorio = avaliarCatalogo([
    escolhaPorTrilha([
      [letra("B", "bola", [fig("bola", "Bola", "⚽"), fig("gato", "Gato", "🐈")]), letra("S", "sol", [fig("sol", "Sol", "☀️"), fig("lua", "Lua", "🌙")])],
      [
        letra("B", "bola", [fig("bola", "Bola", "⚽"), fig("pato", "Pato", "🦆"), fig("gato", "Gato", "🐈")]),
        letra("F", "foguete", [fig("foguete", "Foguete", "🚀"), fig("vela", "Vela", "🕯️"), fig("lua", "Lua", "🌙")]),
      ],
      [
        letra("PA", "pato", [fig("pato", "Pato", "🦆"), fig("pera", "Pera", "🍐"), fig("pipa", "Pipa", "🪁"), fig("peixe", "Peixe", "🐟")]),
        letra("MA", "maca", [fig("maca", "Maçã", "🍎"), fig("milho", "Milho", "🌽"), fig("mel", "Mel", "🍯"), fig("meia", "Meia", "🧦")]),
      ],
    ]),
  ]);
  assert.deepEqual(parecidasDe(relatorio), [0, 1, 3]);
  assert.deepEqual(falhasDe(relatorio, "dificuldade-trilha"), []);
});

test("adivinha pela pista: distrações parecidas são as do mesmo grupo de figuras da resposta", () => {
  const relatorio = avaliarCatalogo([
    escolhaPorTrilha([
      [pistaDe("Tenho oito braços.", "polvo", [fig("polvo", "Polvo", "🐙"), fig("carro", "Carro", "🚗")]), pistaDe("Faço mel.", "abelha", [fig("abelha", "Abelha", "🐝"), fig("sol", "Sol", "☀️")])],
      [
        pistaDe("Sou uma fruta pequena e vermelha.", "cereja", [fig("cereja", "Cereja", "🍒"), fig("morango", "Morango", "🍓"), fig("carro", "Carro", "🚗")]),
        pistaDe("Sou amarela e comprida.", "banana", [fig("banana", "Banana", "🍌"), fig("pera", "Pera", "🍐"), fig("bola", "Bola", "⚽")]),
      ],
      [
        pistaDe("Sou vermelha e venho em dupla no cabinho.", "cereja", [fig("cereja", "Cereja", "🍒"), fig("morango", "Morango", "🍓"), fig("maca", "Maçã", "🍎"), fig("uva", "Uva", "🍇")]),
        pistaDe("Sou redonda, laranja e cheia de gomos.", "laranja", [fig("laranja", "Laranja", "🍊"), fig("limao", "Limão", "🍋"), fig("pessego", "Pêssego", "🍑"), fig("banana", "Banana", "🍌")]),
      ],
    ]),
  ]);
  assert.deepEqual(parecidasDe(relatorio), [0, 1, 3]);
  assert.deepEqual(falhasDe(relatorio, "dificuldade-trilha"), []);
});

test("dificuldade por trilha: reprova quando as distrações não ficam mais parecidas de uma trilha para a outra", () => {
  const igual = (opcoes) => letra("B", "bola", [fig("bola", "Bola", "⚽"), ...opcoes]);
  const relatorio = avaliarCatalogo([
    escolhaPorTrilha([
      [igual([fig("pato", "Pato", "🦆")]), igual([fig("pera", "Pera", "🍐")])],
      [igual([fig("pato", "Pato", "🦆"), fig("gato", "Gato", "🐈")]), igual([fig("pera", "Pera", "🍐"), fig("lua", "Lua", "🌙")])],
      [igual([fig("pato", "Pato", "🦆"), fig("gato", "Gato", "🐈"), fig("lua", "Lua", "🌙")]), igual([fig("pera", "Pera", "🍐"), fig("sol", "Sol", "☀️"), fig("uva", "Uva", "🍇")])],
    ]),
  ]);
  assert.deepEqual(falhasDe(relatorio, "dificuldade-trilha").map((f) => [f.fase, f.detalhe]), [
    [3, "grandes: 1 de 3 distrações parecidas; todas precisam ser"],
    [2, "distrações parecidas em medios (1) não passam das de pequenos (1)"],
    [3, "distrações parecidas em grandes (1) não passam das de medios (1)"],
  ]);
});

test("dificuldade por trilha: nos Médios, pelo menos metade das distrações é parecida, e dentro da trilha não cai", () => {
  const b = (opcoes) => letra("B", "bola", [fig("bola", "Bola", "⚽"), ...opcoes]);
  const p = (opcoes) => letra("P", "pato", [fig("pato", "Pato", "🦆"), ...opcoes]);
  const fases = [
    { trilha: "pequenos", conjuntos: [b([fig("gato", "Gato", "🐈")]), p([fig("lua", "Lua", "🌙")])] },
    { trilha: "medios", conjuntos: [b([fig("pera", "Pera", "🍐"), fig("pipa", "Pipa", "🪁"), fig("gato", "Gato", "🐈")]), p([fig("barco", "Barco", "⛵"), fig("bolo", "Bolo", "🎂"), fig("lua", "Lua", "🌙")])] },
    { trilha: "medios", conjuntos: [b([fig("pera", "Pera", "🍐"), fig("gato", "Gato", "🐈"), fig("lua", "Lua", "🌙"), fig("sol", "Sol", "☀️")]), p([fig("barco", "Barco", "⛵"), fig("gato", "Gato", "🐈"), fig("lua", "Lua", "🌙"), fig("sol", "Sol", "☀️")])] },
    { trilha: "grandes", conjuntos: [letra("PA", "pato", [fig("pato", "Pato", "🦆"), fig("pera", "Pera", "🍐"), fig("pipa", "Pipa", "🪁"), fig("peixe", "Peixe", "🐟"), fig("polvo", "Polvo", "🐙")]), letra("BA", "barco", [fig("barco", "Barco", "⛵"), fig("bola", "Bola", "⚽"), fig("bolo", "Bolo", "🎂"), fig("bicicleta", "Bicicleta", "🚲"), fig("biscoito", "Biscoito", "🍪")])] },
  ];
  const relatorio = avaliarCatalogo([{
    id: "jogo-escolha-medios",
    nome: "Jogo",
    tipoMecanica: "escolha",
    fases: fases.map(({ trilha, conjuntos }, i) => ({ numero: i + 1, trilha, titulo: "Fase", objetivo: "Objetivo.", configuracao: { conjuntos } })),
  }]);
  assert.deepEqual(falhasDe(relatorio, "dificuldade-trilha").map((f) => [f.fase, f.detalhe]), [
    [3, "medios: 1 de 4 distrações parecidas; mínimo metade"],
    [3, "parecidas 2 → 1 dentro de medios: a dificuldade cai"],
  ]);
});

test("dificuldade por trilha não vale para escolha sem letra nem pista", () => {
  const relatorio = avaliarCatalogo([jogo("escolha", [
    { conjuntos: [{ enunciado: "Qual é a fruta?", resposta: "maca", opcoes: [fig("maca", "Maçã", "🍎"), fig("carro", "Carro", "🚗")] }, { enunciado: "Qual é a fruta?", resposta: "pera", opcoes: [fig("pera", "Pera", "🍐"), fig("bola", "Bola", "⚽")] }] },
  ])]);
  assert.deepEqual(falhasDe(relatorio, "dificuldade-trilha"), []);
});

// ---- DEV-CAT-M1-CONTEUDO, ticket 11: Barquinho no rio (motor 2D) ----
// Rio de cima (B, partida) para baixo (margem final): # margem, . água, o pedra, f folha.
const rioCom = (correnteza, ...rios) => ({ correnteza, rios });

test("barquinho: fase sem rota até a margem final reprova; com rota, aprova", () => {
  const aberto = ["#..B..#", "#..o..#", "#.....#", "#.....#"];
  const fechado = ["#..B..#", "#ooooo#", "#.....#", "#.....#"];
  const relatorio = avaliarCatalogo([jogo("barquinho", [rioCom(1, aberto, fechado)])]);
  assert.deepEqual(falhasDe(relatorio, "solucao").map((f) => f.variante), [2]);
  assert.match(falhasDe(relatorio, "solucao")[0].detalhe, /rota/);
});

test("barquinho: nenhuma casa alcançável é beco sem saída (o barco não sobe o rio)", () => {
  // Da casa (2,1) não há como descer: pedra embaixo, margem à esquerda, pedra à direita.
  const comBeco = ["#.B...#", "#.....#", "#.oo..#", "#oo...#", "#.....#"];
  const semBeco = ["#.B...#", "#.....#", "#..o..#", "#o....#", "#.....#"];
  const relatorio = avaliarCatalogo([jogo("barquinho", [rioCom(1, semBeco, comBeco)])]);
  assert.deepEqual(falhasDe(relatorio, "solucao").map((f) => [f.variante, f.detalhe]), [[2, "beco sem saída em 1 casa(s): (2,1)"]]);
});

test("barquinho: variante que é só o espelho horizontal da outra reprova (Variedade)", () => {
  const rio = ["#.B...#", "#...o.#", "#.o...#", "#.....#"];
  const espelho = rio.map((linha) => [...linha].reverse().join(""));
  const relatorio = avaliarCatalogo([jogo("barquinho", [rioCom(1, rio, espelho)])]);
  assert.deepEqual(falhasDe(relatorio, "variedade").map((f) => [f.variante, f.detalhe]), [[2, "variante 2 é só espelhamento da variante 1"]]);
});

test("barquinho: rio precisa de um barco na primeira linha, linhas do mesmo tamanho e margens nas bordas", () => {
  const semBarco = ["#.....#", "#.....#", "#.....#"];
  const torto = ["#..B..#", "#....#", "#.....#"];
  const semMargem = ["...B...", ".......", "......."];
  const relatorio = avaliarCatalogo([jogo("barquinho", [rioCom(1, semBarco, torto, semMargem)])]);
  assert.deepEqual(falhasDe(relatorio, "solucao").map((f) => f.variante), [1, 2, 3]);
});

test("barquinho: métricas de comprimento, estreitamento do canal, pedras e curvas", () => {
  const largo = ["#..B..#", "#.....#", "#.....#", "#.....#"];
  const apertado = ["##.B.##", "##...##", "#..o.##", "#...###", "##...##", "##.o.##", "##...##", "##...##"];
  const relatorio = avaliarCatalogo([jogo("barquinho", [rioCom(1, largo, largo.map((l) => l.replace("B.", ".B"))), rioCom(1.2, apertado, apertado.map((l, i) => (i === 0 ? "##B..##" : l)))])]);
  const [f1, f2] = relatorio.jogos[0].fases.map((f) => f.metricas);
  assert.deepEqual([f1.comprimento, f1.estreitamento, f1.pedras, f1.curvas], [4, 2, 0, 0]);
  // Canal de 3 casas num rio de 7 colunas; 2 pedras em 25 casas de canal; alguma margem muda em 3 linhas.
  assert.deepEqual([f2.comprimento, f2.estreitamento, f2.pedras, f2.curvas], [8, 4, 8, 3]);
  assert.equal(f2.correnteza, 1.2);
  assert.deepEqual(falhasDe(relatorio, "progressao"), []);
});

test("barquinho: a dificuldade não pode cair de uma fase para a outra (pedras, canal, curvas e correnteza)", () => {
  const comPedras = ["#..B..#", "#.o...#", "#...o.#", "#.....#"];
  const semPedras = ["#..B..#", "#.....#", "#.....#", "#.....#", "#.....#"];
  const relatorio = avaliarCatalogo([jogo("barquinho", [
    rioCom(1.2, comPedras, comPedras.map((l) => l.replace("B.", ".B"))),
    rioCom(1, semPedras, semPedras.map((l) => l.replace("B.", ".B"))),
  ])]);
  assert.deepEqual(falhasDe(relatorio, "progressao").map((f) => f.detalhe).sort(), [
    "correnteza 1.2 → 1: a dificuldade cai",
    "pedras 10 → 0: a dificuldade cai",
  ]);
});

// Mãe e filhote e Metades saíram do ticket 04 por decisão do responsável (2026-11-27);
// serão substituídos depois do Marco 1.
test("DEV-CAT-P01 e P03: Letra inicial e Adivinha pela pista com 15 fases aprovadas", () => {
  const ids = ["letra-inicial", "adivinha-pista"];
  const novos = ids.map((id) => CATALOGO_CARREGADO.find((j) => j.id === id));
  assert.ok(novos.every(Boolean), "os dois jogos estão na carga");
  assert.deepEqual(avaliarCatalogo(novos).falhas, []);
  assert.ok(novos.every((j) => j.ativo !== false && j.fases.length === 15));
  const [letra, pista] = novos;
  for (const id of ["mae-filhote", "metades"]) assert.equal(CATALOGO_CARREGADO.some((j) => j.id === id), false, `${id} fora da carga`);
  // Escolha sem rótulo que entregue: nomes ocultos, regra declarada e dica de 1º nível curada.
  for (const [j, campo] of [[letra, "inicio"], [pista, "pista"]]) {
    assert.ok(j.fases.every((f) => f.configuracao.conjuntos.every((c) => c.ocultarNomes === true && c[campo] && c.dica)));
  }
});

// Tickets 09, 12 e 13, mais o ticket 04 de DEV-CAT-M1-CONTEUDO: 10 jogos ativos com 15 fases cada (o Barquinho no rio, ticket 11, está desativado),
// todos aprovados pela régua (modo estrito).
test("DEV-CAT-P01 e P03: catálogo carregado com 10 jogos ativos de 15 fases aprovado pela régua", () => {
  const relatorio = avaliarCatalogo(CATALOGO_CARREGADO);
  assert.deepEqual(relatorio.falhas, []);
  const ativos = CATALOGO_CARREGADO.filter((jogo) => jogo.ativo !== false);
  assert.deepEqual(ativos.map((j) => j.id).sort(), [
    "adivinha-pista", "entrega-jardim", "forme-palavra", "historias-cenas", "labirinto", "letra-inicial",
    "memoria", "menor-maior", "robo-setas", "sudoku-figuras",
  ]);
  assert.ok(ativos.every((jogo) => jogo.fases.length === 15));
  assert.deepEqual(CATALOGO_CARREGADO.filter((j) => j.ativo === false).map((j) => j.id).sort(), ["ache-intruso", "barquinho-rio", "palavra-figura", "pares-sombras", "sequencia"]);
  assert.ok(CATALOGO_CARREGADO.every((jogo) => jogo.fases.every((f) => f.trilha === (f.numero <= 5 ? "pequenos" : f.numero <= 10 ? "medios" : "grandes"))));
  // Ticket 13: Histórias com nome até a fase 5, só figuras a partir da 6 e intrusas a partir da 11.
  const historias = CATALOGO_CARREGADO.find((j) => j.id === "historias-cenas");
  assert.ok(historias.fases.every((f) => f.configuracao.conjuntos.every((c) => Boolean(c.ocultarNomes) === f.numero >= 6)));
  assert.ok(historias.fases.every((f) => f.configuracao.conjuntos.every((c) => ((c.intrusas ?? []).length > 0) === f.numero >= 11)));
});
