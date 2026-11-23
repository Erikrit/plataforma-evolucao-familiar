/**
 * Expansão E5 CAT-03 — quatro jogos e 20 fases oficiais (IDs estáveis).
 * Duas variantes curadas por fase. Mecânicas: memória (faces), escolha, labirinto (P).
 */

function dificuldadeDaFase(numero) {
  if (numero <= 2) return "simples";
  if (numero <= 4) return "media";
  return "avancada";
}

function parSombra(id, nome, simbolo) {
  return {
    id,
    faces: [
      { nome, simbolo, face: "objeto" },
      { nome: `Sombra: ${nome}`, simbolo, face: "sombra" },
    ],
  };
}

const sombra = {
  gato: parSombra("gato", "Gato", "🐈"),
  peixe: parSombra("peixe", "Peixe", "🐟"),
  abelha: parSombra("abelha", "Abelha", "🐝"),
  coelho: parSombra("coelho", "Coelho", "🐇"),
  arvore: parSombra("arvore", "Árvore", "🌳"),
  sol: parSombra("sol", "Sol", "☀️"),
  lua: parSombra("lua", "Lua", "🌙"),
  estrela: parSombra("estrela", "Estrela", "⭐"),
  bola: parSombra("bola", "Bola", "⚽"),
  barco: parSombra("barco", "Barco", "⛵"),
  pipa: parSombra("pipa", "Pipa", "🪁"),
  trem: parSombra("trem", "Trem", "🚂"),
  bicicleta: parSombra("bicicleta", "Bicicleta", "🚲"),
  maca: parSombra("maca", "Maçã", "🍎"),
  pera: parSombra("pera", "Pera", "🍐"),
  banana: parSombra("banana", "Banana", "🍌"),
  casa: parSombra("casa", "Casa", "🏠"),
  flor: parSombra("flor", "Flor", "🌸"),
  chave: parSombra("chave", "Chave", "🔑"),
  livro: parSombra("livro", "Livro", "📘"),
  xicara: parSombra("xicara", "Xícara", "☕"),
  sapato: parSombra("sapato", "Sapato", "👟"),
};

function fig(id, nome, simbolo) {
  return { id, nome, simbolo };
}

function espelharMapa(mapa) {
  return [mapa, mapa.map((linha) => [...linha].reverse().join(""))];
}

export const CATALOGO_JOGOS_EXPANSAO_E5 = [
  {
    id: "pares-sombras",
    nome: "Pares de sombras",
    descricao: "Associe cada objeto à sua silhueta.",
    categoria: "memoria_atencao",
    instrucoes:
      "Vire duas cartas de cada vez. Encontre o objeto e a sombra que formam o mesmo par.",
    tipoMecanica: "memoria",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 4,
    fases: [
      {
        numero: 1,
        titulo: "Dois pares",
        objetivo: "Encontre os 2 pares de objeto e sombra.",
        dificuldade: dificuldadeDaFase(1),
        configuracao: {
          conjuntos: [
            [sombra.gato, sombra.sol],
            [sombra.peixe, sombra.pipa],
          ],
        },
      },
      {
        numero: 2,
        titulo: "Três animais",
        objetivo: "Encontre os 3 pares de animais e suas sombras.",
        dificuldade: dificuldadeDaFase(2),
        configuracao: {
          conjuntos: [
            [sombra.gato, sombra.peixe, sombra.abelha],
            [sombra.coelho, sombra.gato, sombra.peixe],
          ],
        },
      },
      {
        numero: 3,
        titulo: "Quatro objetos",
        objetivo: "Encontre os 4 pares de objetos e sombras.",
        dificuldade: dificuldadeDaFase(3),
        configuracao: {
          conjuntos: [
            [sombra.bola, sombra.barco, sombra.trem, sombra.chave],
            [sombra.pipa, sombra.bicicleta, sombra.livro, sombra.xicara],
          ],
        },
      },
      {
        numero: 4,
        titulo: "Figuras do dia a dia",
        objetivo: "Encontre os 5 pares de figuras cotidianas.",
        dificuldade: dificuldadeDaFase(4),
        configuracao: {
          conjuntos: [
            [sombra.casa, sombra.flor, sombra.sapato, sombra.livro, sombra.xicara],
            [sombra.chave, sombra.bola, sombra.casa, sombra.flor, sombra.trem],
          ],
        },
      },
      {
        numero: 5,
        titulo: "Contornos próximos",
        objetivo: "Repare nos contornos e encontre os 6 pares.",
        dificuldade: dificuldadeDaFase(5),
        configuracao: {
          conjuntos: [
            [sombra.maca, sombra.pera, sombra.banana, sombra.sol, sombra.lua, sombra.estrela],
            [sombra.arvore, sombra.flor, sombra.casa, sombra.barco, sombra.pipa, sombra.bola],
          ],
        },
      },
    ],
  },
  {
    id: "ache-intruso",
    nome: "Ache o intruso",
    descricao: "Observe o grupo e descubra qual figura destoa.",
    categoria: "memoria_atencao",
    instrucoes:
      "Olhe todas as figuras. Toque naquela que não combina com o restante do grupo.",
    tipoMecanica: "escolha",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 5,
    fases: [
      {
        numero: 1,
        titulo: "Três formas",
        objetivo: "Ache a figura que destoa entre três formas.",
        dificuldade: dificuldadeDaFase(1),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual figura não combina com as outras?",
              opcoes: [
                fig("circulo-1", "Círculo", "🔵"),
                fig("circulo-2", "Círculo", "🟢"),
                fig("quadrado", "Quadrado", "🟥"),
              ],
              resposta: "quadrado",
              dica: "Duas figuras são redondas. Procure a que tem cantos.",
            },
            {
              enunciado: "Qual figura não combina com as outras?",
              opcoes: [
                fig("tri-1", "Triângulo", "🔺"),
                fig("estrela", "Estrela", "⭐"),
                fig("tri-2", "Triângulo", "🔻"),
              ],
              resposta: "estrela",
              dica: "Duas figuras têm três pontas iguais. A outra é diferente.",
            },
          ],
        },
      },
      {
        numero: 2,
        titulo: "Tamanhos",
        objetivo: "Ache a figura de tamanho diferente.",
        dificuldade: dificuldadeDaFase(2),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual bola tem tamanho diferente?",
              opcoes: [
                fig("bola-p1", "Bola pequena", "⚽"),
                fig("bola-g", "Bola grande", "🏀"),
                fig("bola-p2", "Bola pequena", "⚽"),
                fig("bola-p3", "Bola pequena", "⚽"),
              ],
              resposta: "bola-g",
              dica: "Três bolas são do mesmo tipo. Uma é de outro esporte.",
            },
            {
              enunciado: "Qual estrela não combina?",
              opcoes: [
                fig("est-1", "Estrela", "⭐"),
                fig("est-2", "Estrela", "⭐"),
                fig("lua", "Lua", "🌙"),
                fig("est-3", "Estrela", "⭐"),
              ],
              resposta: "lua",
              dica: "Três são estrelas. A outra ilumina a noite de outro jeito.",
            },
          ],
        },
      },
      {
        numero: 3,
        titulo: "Grupo de objetos",
        objetivo: "Ache o objeto que não pertence ao grupo.",
        dificuldade: dificuldadeDaFase(3),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é uma fruta?",
              opcoes: [
                fig("maca", "Maçã", "🍎"),
                fig("pera", "Pera", "🍐"),
                fig("banana", "Banana", "🍌"),
                fig("carro", "Carro", "🚗"),
              ],
              resposta: "carro",
              dica: "Três figuras são frutas. Uma serve para se deslocar.",
            },
            {
              enunciado: "Qual não é um animal?",
              opcoes: [
                fig("gato", "Gato", "🐈"),
                fig("peixe", "Peixe", "🐟"),
                fig("flor", "Flor", "🌸"),
                fig("coelho", "Coelho", "🐇"),
              ],
              resposta: "flor",
              dica: "Três figuras são animais. Uma cresce no jardim.",
            },
          ],
        },
      },
      {
        numero: 4,
        titulo: "Por atributo",
        objetivo: "Ache a figura que destoa pelo atributo do grupo.",
        dificuldade: dificuldadeDaFase(4),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual transporte não anda sobre rodas?",
              opcoes: [
                fig("bike", "Bicicleta", "🚲"),
                fig("carro", "Carro", "🚗"),
                fig("barco", "Barco", "⛵"),
                fig("onibus", "Ônibus", "🚌"),
                fig("moto", "Moto", "🛵"),
              ],
              resposta: "barco",
              dica: "Quatro andam em terra com rodas. Um flutua na água.",
            },
            {
              enunciado: "Qual não brilha no céu?",
              opcoes: [
                fig("sol", "Sol", "☀️"),
                fig("lua", "Lua", "🌙"),
                fig("estrela", "Estrela", "⭐"),
                fig("nuvem", "Nuvem", "☁️"),
                fig("cometa", "Cometa", "☄️"),
              ],
              resposta: "nuvem",
              dica: "Quatro figuras brilham ou brilharam no céu. Uma só cobre a luz.",
            },
          ],
        },
      },
      {
        numero: 5,
        titulo: "Duas pistas",
        objetivo: "Use as duas pistas para achar o intruso.",
        dificuldade: dificuldadeDaFase(5),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Qual não é fruta vermelha ou rosada?",
              opcoes: [
                fig("maca", "Maçã", "🍎"),
                fig("morango", "Morango", "🍓"),
                fig("cereja", "Cereja", "🍒"),
                fig("banana", "Banana", "🍌"),
                fig("melancia", "Melancia", "🍉"),
                fig("pessego", "Pêssego", "🍑"),
              ],
              resposta: "banana",
              dica: "Quase todas são frutas avermelhadas ou rosadas. Uma é amarela.",
            },
            {
              enunciado: "Qual não é um animal que voa?",
              opcoes: [
                fig("abelha", "Abelha", "🐝"),
                fig("passaro", "Pássaro", "🐦"),
                fig("borboleta", "Borboleta", "🦋"),
                fig("peixe", "Peixe", "🐟"),
                fig("aguia", "Águia", "🦅"),
                fig("libelula", "Libélula", "🪰"),
              ],
              resposta: "peixe",
              dica: "Cinco figuras voam. Uma vive na água.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "palavra-figura",
    nome: "Palavra e figura",
    descricao: "Leia a palavra e escolha a figura correspondente.",
    categoria: "linguagem",
    instrucoes:
      "Leia a palavra com calma. Toque na figura que combina com ela.",
    tipoMecanica: "escolha",
    versao: 1,
    faixaEtariaMin: 6,
    faixaEtariaMax: 8,
    ordemEditorial: 6,
    fases: [
      {
        numero: 1,
        titulo: "Duas figuras",
        objetivo: "Escolha a figura da palavra entre duas opções.",
        dificuldade: dificuldadeDaFase(1),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Sol",
              opcoes: [fig("sol", "Sol", "☀️"), fig("lua", "Lua", "🌙")],
              resposta: "sol",
              dica: "A palavra fala do astro que ilumina o dia.",
            },
            {
              enunciado: "Gato",
              opcoes: [fig("gato", "Gato", "🐈"), fig("peixe", "Peixe", "🐟")],
              resposta: "gato",
              dica: "É um animal de quatro patas que mia.",
            },
          ],
        },
      },
      {
        numero: 2,
        titulo: "Objetos comuns",
        objetivo: "Escolha a figura correta entre três objetos.",
        dificuldade: dificuldadeDaFase(2),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Chave",
              opcoes: [
                fig("chave", "Chave", "🔑"),
                fig("livro", "Livro", "📘"),
                fig("xicara", "Xícara", "☕"),
              ],
              resposta: "chave",
              dica: "Serve para abrir a porta.",
            },
            {
              enunciado: "Bicicleta",
              opcoes: [
                fig("bike", "Bicicleta", "🚲"),
                fig("barco", "Barco", "⛵"),
                fig("trem", "Trem", "🚂"),
              ],
              resposta: "bike",
              dica: "Tem duas rodas e pedais.",
            },
          ],
        },
      },
      {
        numero: 3,
        titulo: "Mesmo grupo",
        objetivo: "Escolha a figura certa entre itens do mesmo grupo.",
        dificuldade: dificuldadeDaFase(3),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Pera",
              opcoes: [
                fig("maca", "Maçã", "🍎"),
                fig("pera", "Pera", "🍐"),
                fig("banana", "Banana", "🍌"),
              ],
              resposta: "pera",
              dica: "É a fruta alongada de casca verde ou amarela.",
            },
            {
              enunciado: "Coelho",
              opcoes: [
                fig("gato", "Gato", "🐈"),
                fig("coelho", "Coelho", "🐇"),
                fig("peixe", "Peixe", "🐟"),
              ],
              resposta: "coelho",
              dica: "Tem orelhas longas e pula.",
            },
          ],
        },
      },
      {
        numero: 4,
        titulo: "Palavras parecidas",
        objetivo: "Atenção às palavras semelhantes e escolha a figura certa.",
        dificuldade: dificuldadeDaFase(4),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Casa",
              opcoes: [
                fig("casa", "Casa", "🏠"),
                fig("castelo", "Castelo", "🏰"),
                fig("igreja", "Igreja", "⛪"),
                fig("tenda", "Tenda", "⛺"),
              ],
              resposta: "casa",
              dica: "É a moradia comum do dia a dia, não um castelo.",
            },
            {
              enunciado: "Flor",
              opcoes: [
                fig("flor", "Flor", "🌸"),
                fig("arvore", "Árvore", "🌳"),
                fig("folha", "Folha", "🍃"),
                fig("cacto", "Cacto", "🌵"),
              ],
              resposta: "flor",
              dica: "É a planta colorida e delicada do jardim.",
            },
          ],
        },
      },
      {
        numero: 5,
        titulo: "Com pista curta",
        objetivo: "Use a pista curta se precisar e escolha a figura.",
        dificuldade: dificuldadeDaFase(5),
        configuracao: {
          conjuntos: [
            {
              enunciado: "Estrela",
              opcoes: [
                fig("sol", "Sol", "☀️"),
                fig("lua", "Lua", "🌙"),
                fig("estrela", "Estrela", "⭐"),
                fig("nuvem", "Nuvem", "☁️"),
              ],
              resposta: "estrela",
              dica: "Brilha pequena no céu à noite.",
            },
            {
              enunciado: "Barco",
              opcoes: [
                fig("carro", "Carro", "🚗"),
                fig("barco", "Barco", "⛵"),
                fig("aviao", "Avião", "✈️"),
                fig("trem", "Trem", "🚂"),
              ],
              resposta: "barco",
              dica: "Anda na água com vela ou motor.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "entrega-jardim",
    nome: "Entrega no jardim",
    descricao: "Leve a peça pelos pontos de entrega até a chegada.",
    categoria: "coordenacao",
    instrucoes:
      "Use as setas ou o teclado. Passe por todos os pontos de entrega antes de chegar ao destino.",
    tipoMecanica: "labirinto",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 8,
    fases: [
      {
        numero: 1,
        titulo: "Uma parada",
        objetivo: "Passe pelo ponto de entrega e chegue ao destino.",
        dificuldade: dificuldadeDaFase(1),
        configuracao: {
          mapas: espelharMapa([
            "#######",
            "#I.P.F#",
            "#######",
          ]),
        },
      },
      {
        numero: 2,
        titulo: "Parada após a curva",
        objetivo: "Faça a curva, entregue e chegue.",
        dificuldade: dificuldadeDaFase(2),
        configuracao: {
          mapas: espelharMapa([
            "#######",
            "#I....#",
            "###.#.#",
            "#P..#F#",
            "#######",
          ]),
        },
      },
      {
        numero: 3,
        titulo: "Duas entregas curtas",
        objetivo: "Passe pelos dois pontos e chegue.",
        dificuldade: dificuldadeDaFase(3),
        configuracao: {
          mapas: espelharMapa([
            "#########",
            "#I.P....#",
            "###.###.#",
            "#...P..F#",
            "#########",
          ]),
        },
      },
      {
        numero: 4,
        titulo: "Entregas com bifurcação",
        objetivo: "Escolha o caminho que cobre as duas entregas.",
        dificuldade: dificuldadeDaFase(4),
        configuracao: {
          mapas: espelharMapa([
            "#########",
            "#I..#...#",
            "#.P.#.#.#",
            "#...#.#.#",
            "###.#P#.#",
            "#.......#",
            "#.#####.#",
            "#......F#",
            "#########",
          ]),
        },
      },
      {
        numero: 5,
        titulo: "Jardim maior",
        objetivo: "Faça as três entregas e chegue ao destino.",
        dificuldade: dificuldadeDaFase(5),
        configuracao: {
          mapas: espelharMapa([
            "###########",
            "#I#....P..#",
            "#.#.###.#.#",
            "#...#...#.#",
            "###.#.###.#",
            "#...P.....#",
            "#.#######.#",
            "#.#...#...#",
            "#...P...#F#",
            "###########",
          ]),
        },
      },
    ],
  },
];
