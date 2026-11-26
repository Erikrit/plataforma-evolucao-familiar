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

// Tickets 09, 12 e 13: 8 jogos ativos com 15 fases cada, todos aprovados pela régua (modo estrito).
test("DEV-CAT-P01 e P03: catálogo carregado com 8 jogos ativos de 15 fases aprovado pela régua", () => {
  const relatorio = avaliarCatalogo(CATALOGO_CARREGADO);
  assert.deepEqual(relatorio.falhas, []);
  const ativos = CATALOGO_CARREGADO.filter((jogo) => jogo.ativo !== false);
  assert.deepEqual(ativos.map((j) => j.id).sort(), ["entrega-jardim", "forme-palavra", "historias-cenas", "labirinto", "memoria", "menor-maior", "robo-setas", "sudoku-figuras"]);
  assert.ok(ativos.every((jogo) => jogo.fases.length === 15));
  assert.deepEqual(CATALOGO_CARREGADO.filter((j) => j.ativo === false).map((j) => j.id).sort(), ["ache-intruso", "palavra-figura", "pares-sombras", "sequencia"]);
  assert.ok(CATALOGO_CARREGADO.every((jogo) => jogo.fases.every((f) => f.trilha === (f.numero <= 5 ? "pequenos" : f.numero <= 10 ? "medios" : "grandes"))));
  // Ticket 13: Histórias com nome até a fase 5, só figuras a partir da 6 e intrusas a partir da 11.
  const historias = CATALOGO_CARREGADO.find((j) => j.id === "historias-cenas");
  assert.ok(historias.fases.every((f) => f.configuracao.conjuntos.every((c) => Boolean(c.ocultarNomes) === f.numero >= 6)));
  assert.ok(historias.fases.every((f) => f.configuracao.conjuntos.every((c) => ((c.intrusas ?? []).length > 0) === f.numero >= 11)));
});
