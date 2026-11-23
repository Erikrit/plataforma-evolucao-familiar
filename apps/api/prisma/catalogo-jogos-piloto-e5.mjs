/**
 * Piloto E5 — três jogos e 15 fases oficiais (IDs estáveis).
 * Fonte da carga oficial; a API lê o editorial no PostgreSQL (CAT-02).
 */

const figuras = {
  gato: { id: "gato", nome: "Gato", simbolo: "🐈" },
  peixe: { id: "peixe", nome: "Peixe", simbolo: "🐟" },
  abelha: { id: "abelha", nome: "Abelha", simbolo: "🐝" },
  coelho: { id: "coelho", nome: "Coelho", simbolo: "🐇" },
  arvore: { id: "arvore", nome: "Árvore", simbolo: "🌳" },
  nuvem: { id: "nuvem", nome: "Nuvem", simbolo: "☁️" },
  sol: { id: "sol", nome: "Sol", simbolo: "☀️" },
  lua: { id: "lua", nome: "Lua", simbolo: "🌙" },
  estrela: { id: "estrela", nome: "Estrela", simbolo: "⭐" },
  bola: { id: "bola", nome: "Bola", simbolo: "⚽" },
  barco: { id: "barco", nome: "Barco", simbolo: "⛵" },
  pipa: { id: "pipa", nome: "Pipa", simbolo: "🪁" },
  trem: { id: "trem", nome: "Trem", simbolo: "🚂" },
  bicicleta: { id: "bicicleta", nome: "Bicicleta", simbolo: "🚲" },
  maca: { id: "maca", nome: "Maçã", simbolo: "🍎" },
  pera: { id: "pera", nome: "Pera", simbolo: "🍐" },
  banana: { id: "banana", nome: "Banana", simbolo: "🍌" },
  laranja: { id: "laranja", nome: "Laranja", simbolo: "🍊" },
  morango: { id: "morango", nome: "Morango", simbolo: "🍓" },
  uva: { id: "uva", nome: "Uva", simbolo: "🍇" },
  cereja: { id: "cereja", nome: "Cereja", simbolo: "🍒" },
  melancia: { id: "melancia", nome: "Melancia", simbolo: "🍉" },
  abacaxi: { id: "abacaxi", nome: "Abacaxi", simbolo: "🍍" },
  pessego: { id: "pessego", nome: "Pêssego", simbolo: "🍑" },
};

const f = figuras;

function peca(forma, cor, nomeForma) {
  return { id: `${forma}-${cor}`, forma, cor, nome: `${nomeForma} ${cor}` };
}

const nomeForma = {
  circulo: "Círculo",
  quadrado: "Quadrado",
  triangulo: "Triângulo",
  losango: "Losango",
};

const circuloAzul = peca("circulo", "azul", nomeForma.circulo);
const circuloDourado = peca("circulo", "dourado", nomeForma.circulo);
const circuloRoxo = peca("circulo", "roxo", nomeForma.circulo);
const circuloVerde = peca("circulo", "verde", nomeForma.circulo);
const quadradoAzul = peca("quadrado", "azul", nomeForma.quadrado);
const quadradoVerde = peca("quadrado", "verde", nomeForma.quadrado);
const trianguloAzul = peca("triangulo", "azul", nomeForma.triangulo);
const trianguloVerde = peca("triangulo", "verde", nomeForma.triangulo);
const losangoVerde = peca("losango", "verde", nomeForma.losango);
const losangoRoxo = peca("losango", "roxo", nomeForma.losango);

function espelharMapa(mapa) {
  return [mapa, mapa.map((linha) => [...linha].reverse().join(""))];
}

function dificuldadeDaFase(numero) {
  if (numero <= 2) return "simples";
  if (numero <= 4) return "media";
  return "avancada";
}

export const CATALOGO_JOGOS_PILOTO_E5 = [
  {
    id: "memoria",
    nome: "Memória de figuras",
    descricao: "Vire as cartas e encontre as figuras que formam pares.",
    categoria: "memoria_atencao",
    instrucoes:
      "Vire duas cartas de cada vez. Se as figuras forem diferentes, escolha outra carta para começar um novo par.",
    tipoMecanica: "memoria",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 1,
    fases: [
      {
        numero: 1,
        titulo: "Primeiros pares",
        objetivo: "Encontre os 2 pares de figuras.",
        dificuldade: dificuldadeDaFase(1),
        configuracao: {
          conjuntos: [
            [f.gato, f.sol],
            [f.peixe, f.pipa],
          ],
        },
      },
      {
        numero: 2,
        titulo: "Mais figuras",
        objetivo: "Encontre os 3 pares de figuras.",
        dificuldade: dificuldadeDaFase(2),
        configuracao: {
          conjuntos: [
            [f.arvore, f.coelho, f.estrela],
            [f.nuvem, f.bola, f.abelha],
          ],
        },
      },
      {
        numero: 3,
        titulo: "Quatro pares",
        objetivo: "Encontre os 4 pares de figuras.",
        dificuldade: dificuldadeDaFase(3),
        configuracao: {
          conjuntos: [
            [f.bicicleta, f.peixe, f.sol, f.pipa],
            [f.lua, f.barco, f.gato, f.morango],
          ],
        },
      },
      {
        numero: 4,
        titulo: "Mesa maior",
        objetivo: "Encontre os 6 pares de figuras.",
        dificuldade: dificuldadeDaFase(4),
        configuracao: {
          conjuntos: [
            [f.abelha, f.maca, f.trem, f.sol, f.arvore, f.bola],
            [f.nuvem, f.bicicleta, f.coelho, f.pipa, f.barco, f.uva],
          ],
        },
      },
      {
        numero: 5,
        titulo: "Feira de frutas",
        objetivo: "Repare nos detalhes e encontre os 6 pares de frutas.",
        dificuldade: dificuldadeDaFase(5),
        configuracao: {
          conjuntos: [
            [f.maca, f.laranja, f.pessego, f.morango, f.cereja, f.pera],
            [f.pessego, f.pera, f.maca, f.banana, f.melancia, f.abacaxi],
          ],
        },
      },
    ],
  },
  {
    id: "sequencia",
    nome: "Complete a sequência",
    descricao: "Descubra o padrão e escolha a peça que falta.",
    categoria: "raciocinio",
    instrucoes:
      "Leia as peças na ordem em que aparecem. Observe o trecho que se repete e escolha a peça que completa o espaço vazio.",
    tipoMecanica: "sequencia",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 2,
    fases: [
      {
        numero: 1,
        titulo: "Cores alternadas",
        objetivo: "Escolha a próxima cor do padrão.",
        dificuldade: dificuldadeDaFase(1),
        configuracao: {
          comprimento: 5,
          lacuna: 4,
          padroes: [
            [circuloAzul, circuloDourado],
            [circuloRoxo, circuloVerde],
          ],
        },
      },
      {
        numero: 2,
        titulo: "Formas alternadas",
        objetivo: "Escolha a próxima forma do padrão.",
        dificuldade: dificuldadeDaFase(2),
        configuracao: {
          comprimento: 6,
          lacuna: 5,
          padroes: [
            [quadradoAzul, trianguloAzul],
            [trianguloVerde, losangoVerde],
          ],
        },
      },
      {
        numero: 3,
        titulo: "Padrão de três",
        objetivo: "Observe as três peças que se repetem.",
        dificuldade: dificuldadeDaFase(3),
        configuracao: {
          comprimento: 7,
          lacuna: 6,
          padroes: [
            [circuloAzul, quadradoAzul, trianguloAzul],
            [losangoVerde, circuloVerde, quadradoVerde],
          ],
        },
      },
      {
        numero: 4,
        titulo: "No meio do caminho",
        objetivo: "Encontre a peça que falta no meio do padrão.",
        dificuldade: dificuldadeDaFase(4),
        configuracao: {
          comprimento: 8,
          lacuna: 3,
          padroes: [
            [trianguloVerde, quadradoVerde, circuloVerde],
            [quadradoAzul, trianguloAzul, circuloAzul],
          ],
        },
      },
      {
        numero: 5,
        titulo: "Formas e cores",
        objetivo: "Repare na forma e na cor para preencher o espaço vazio.",
        dificuldade: dificuldadeDaFase(5),
        configuracao: {
          comprimento: 9,
          lacuna: 5,
          padroes: [
            [circuloAzul, trianguloVerde, trianguloAzul, circuloVerde],
            [quadradoVerde, losangoRoxo, losangoVerde, quadradoAzul],
          ],
        },
      },
    ],
  },
  {
    id: "labirinto",
    nome: "Caminhos e labirintos",
    descricao: "Pense no percurso e leve a peça até a chegada.",
    categoria: "raciocinio",
    instrucoes:
      "Use os botões de direção ou as setas do teclado com foco no jogo. Você pode mudar de caminho a qualquer momento.",
    tipoMecanica: "labirinto",
    versao: 1,
    faixaEtariaMin: 5,
    faixaEtariaMax: 8,
    ordemEditorial: 3,
    fases: [
      {
        numero: 1,
        titulo: "Primeiro caminho",
        objetivo: "Leve a peça até a chegada seguindo o corredor.",
        dificuldade: dificuldadeDaFase(1),
        configuracao: {
          mapas: espelharMapa([
            "#####",
            "#I..#",
            "###.#",
            "#F..#",
            "#####",
          ]),
        },
      },
      {
        numero: 2,
        titulo: "Uma bifurcação",
        objetivo: "Escolha o caminho que leva à chegada.",
        dificuldade: dificuldadeDaFase(2),
        configuracao: {
          mapas: espelharMapa([
            "#########",
            "#I...####",
            "###.#####",
            "###....F#",
            "#########",
          ]),
        },
      },
      {
        numero: 3,
        titulo: "Escolhas no caminho",
        objetivo: "Explore as passagens para encontrar a chegada.",
        dificuldade: dificuldadeDaFase(3),
        configuracao: {
          mapas: espelharMapa([
            "#########",
            "#I......#",
            "###.###.#",
            "#...#...#",
            "#.###.#.#",
            "#...#..F#",
            "#########",
          ]),
        },
      },
      {
        numero: 4,
        titulo: "Trajeto mais longo",
        objetivo: "Encontre a chegada passando pelas curvas.",
        dificuldade: dificuldadeDaFase(4),
        configuracao: {
          mapas: espelharMapa([
            "#########",
            "#I..#...#",
            "###.#.#.#",
            "#...#.#.#",
            "#.###.#.#",
            "#.....#.#",
            "#.#####.#",
            "#......F#",
            "#########",
          ]),
        },
      },
      {
        numero: 5,
        titulo: "O grande labirinto",
        objetivo: "Planeje as curvas para encontrar a chegada.",
        dificuldade: dificuldadeDaFase(5),
        configuracao: {
          mapas: espelharMapa([
            "###########",
            "#I#.......#",
            "#.#.###.#.#",
            "#...#...#.#",
            "###.#.###.#",
            "#...#.....#",
            "#.#######.#",
            "#.#...#...#",
            "#...#...#F#",
            "###########",
          ]),
        },
      },
    ],
  },
];
