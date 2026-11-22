import { randomInt } from "node:crypto";
import type { CategoriaBiblioteca } from "../constantes-desenvolvimento";

type FiguraMemoria = Readonly<{ id: string; nome: string; simbolo: string }>;

type FaseBase = Readonly<{
  numero: number;
  titulo: string;
  objetivo: string;
}>;

type FaseMemoria = FaseBase & Readonly<{
  tipo: "memoria";
  conjuntos: readonly (readonly FiguraMemoria[])[];
}>;

type FormaSequencia = "circulo" | "quadrado" | "triangulo" | "losango";
type CorSequencia = "azul" | "dourado" | "verde" | "roxo";
type FiguraSequencia = Readonly<{ id: string; forma: FormaSequencia; cor: CorSequencia; nome: string }>;

type FaseSequencia = FaseBase & Readonly<{
  tipo: "sequencia";
  comprimento: number;
  lacuna: number;
  padroes: readonly (readonly FiguraSequencia[])[];
}>;

type FaseLabirinto = FaseBase & Readonly<{
  tipo: "labirinto";
  mapas: readonly (readonly string[])[];
}>;

type Fase = FaseMemoria | FaseSequencia | FaseLabirinto;

export type JogoCatalogo = Readonly<{
  id: string;
  nome: string;
  descricao: string;
  categoria: CategoriaBiblioteca;
  instrucoes: string;
  versao: number;
  fases: readonly Fase[];
}>;

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
} satisfies Record<string, FiguraMemoria>;

const f = figuras;

const MEMORIA: JogoCatalogo = {
  id: "memoria",
  nome: "Memória de figuras",
  descricao: "Vire as cartas e encontre as figuras que formam pares.",
  categoria: "memoria_atencao",
  instrucoes: "Vire duas cartas de cada vez. Se as figuras forem diferentes, escolha outra carta para começar um novo par.",
  versao: 1,
  fases: [
    {
      tipo: "memoria", numero: 1, titulo: "Primeiros pares",
      objetivo: "Encontre os 2 pares de figuras.",
      conjuntos: [[f.gato, f.sol], [f.peixe, f.pipa]],
    },
    {
      tipo: "memoria", numero: 2, titulo: "Mais figuras",
      objetivo: "Encontre os 3 pares de figuras.",
      conjuntos: [[f.arvore, f.coelho, f.estrela], [f.nuvem, f.bola, f.abelha]],
    },
    {
      tipo: "memoria", numero: 3, titulo: "Quatro pares",
      objetivo: "Encontre os 4 pares de figuras.",
      conjuntos: [[f.bicicleta, f.peixe, f.sol, f.pipa], [f.lua, f.barco, f.gato, f.morango]],
    },
    {
      tipo: "memoria", numero: 4, titulo: "Mesa maior",
      objetivo: "Encontre os 6 pares de figuras.",
      conjuntos: [
        [f.abelha, f.maca, f.trem, f.sol, f.arvore, f.bola],
        [f.nuvem, f.bicicleta, f.coelho, f.pipa, f.barco, f.uva],
      ],
    },
    {
      tipo: "memoria", numero: 5, titulo: "Feira de frutas",
      objetivo: "Repare nos detalhes e encontre os 6 pares de frutas.",
      conjuntos: [
        [f.maca, f.laranja, f.pessego, f.morango, f.cereja, f.pera],
        [f.pessego, f.pera, f.maca, f.banana, f.melancia, f.abacaxi],
      ],
    },
  ],
};

const nomeForma: Record<FormaSequencia, string> = {
  circulo: "Círculo", quadrado: "Quadrado", triangulo: "Triângulo", losango: "Losango",
};

function peca(forma: FormaSequencia, cor: CorSequencia): FiguraSequencia {
  return { id: `${forma}-${cor}`, forma, cor, nome: `${nomeForma[forma]} ${cor}` };
}

const circuloAzul = peca("circulo", "azul");
const circuloDourado = peca("circulo", "dourado");
const circuloRoxo = peca("circulo", "roxo");
const circuloVerde = peca("circulo", "verde");
const quadradoAzul = peca("quadrado", "azul");
const quadradoVerde = peca("quadrado", "verde");
const trianguloAzul = peca("triangulo", "azul");
const trianguloVerde = peca("triangulo", "verde");
const losangoVerde = peca("losango", "verde");
const losangoRoxo = peca("losango", "roxo");

const PECAS_SEQUENCIA = [
  circuloAzul, circuloDourado, circuloRoxo, circuloVerde, quadradoAzul,
  quadradoVerde, trianguloAzul, trianguloVerde, losangoVerde, losangoRoxo,
];

const SEQUENCIA: JogoCatalogo = {
  id: "sequencia",
  nome: "Complete a sequência",
  descricao: "Descubra o padrão e escolha a peça que falta.",
  categoria: "raciocinio",
  instrucoes: "Leia as peças na ordem em que aparecem. Observe o trecho que se repete e escolha a peça que completa o espaço vazio.",
  versao: 1,
  fases: [
    {
      tipo: "sequencia", numero: 1, titulo: "Cores alternadas",
      objetivo: "Escolha a próxima cor do padrão.",
      comprimento: 5, lacuna: 4,
      padroes: [[circuloAzul, circuloDourado], [circuloRoxo, circuloVerde]],
    },
    {
      tipo: "sequencia", numero: 2, titulo: "Formas alternadas",
      objetivo: "Escolha a próxima forma do padrão.",
      comprimento: 6, lacuna: 5,
      padroes: [[quadradoAzul, trianguloAzul], [trianguloVerde, losangoVerde]],
    },
    {
      tipo: "sequencia", numero: 3, titulo: "Padrão de três",
      objetivo: "Observe as três peças que se repetem.",
      comprimento: 7, lacuna: 6,
      padroes: [
        [circuloAzul, quadradoAzul, trianguloAzul],
        [losangoVerde, circuloVerde, quadradoVerde],
      ],
    },
    {
      tipo: "sequencia", numero: 4, titulo: "No meio do caminho",
      objetivo: "Encontre a peça que falta no meio do padrão.",
      comprimento: 8, lacuna: 3,
      padroes: [
        [trianguloVerde, quadradoVerde, circuloVerde],
        [quadradoAzul, trianguloAzul, circuloAzul],
      ],
    },
    {
      tipo: "sequencia", numero: 5, titulo: "Formas e cores",
      objetivo: "Repare na forma e na cor para preencher o espaço vazio.",
      comprimento: 9, lacuna: 5,
      padroes: [
        [circuloAzul, trianguloVerde, trianguloAzul, circuloVerde],
        [quadradoVerde, losangoRoxo, losangoVerde, quadradoAzul],
      ],
    },
  ],
};

function espelharMapa(mapa: readonly string[]) {
  return [mapa, mapa.map((linha) => [...linha].reverse().join(""))];
}

const LABIRINTO: JogoCatalogo = {
  id: "labirinto",
  nome: "Caminhos e labirintos",
  descricao: "Pense no percurso e leve a peça até a chegada.",
  categoria: "raciocinio",
  instrucoes: "Use os botões de direção ou as setas do teclado com foco no jogo. Você pode mudar de caminho a qualquer momento.",
  versao: 1,
  fases: [
    {
      tipo: "labirinto", numero: 1, titulo: "Primeiro caminho",
      objetivo: "Leve a peça até a chegada seguindo o corredor.",
      mapas: espelharMapa([
        "#####",
        "#I..#",
        "###.#",
        "#F..#",
        "#####",
      ]),
    },
    {
      tipo: "labirinto", numero: 2, titulo: "Uma bifurcação",
      objetivo: "Escolha o caminho que leva à chegada.",
      mapas: espelharMapa([
        "#########",
        "#I...####",
        "###.#####",
        "###....F#",
        "#########",
      ]),
    },
    {
      tipo: "labirinto", numero: 3, titulo: "Escolhas no caminho",
      objetivo: "Explore as passagens para encontrar a chegada.",
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
    {
      tipo: "labirinto", numero: 4, titulo: "Trajeto mais longo",
      objetivo: "Encontre a chegada passando pelas curvas.",
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
    {
      tipo: "labirinto", numero: 5, titulo: "O grande labirinto",
      objetivo: "Planeje as curvas para encontrar a chegada.",
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
  ],
};

export const CATALOGO_JOGOS: readonly JogoCatalogo[] = [MEMORIA, SEQUENCIA, LABIRINTO];

export function embaralhar<T>(itens: readonly T[], sortear: (limite: number) => number): T[] {
  const resultado = [...itens];
  for (let i = resultado.length - 1; i > 0; i -= 1) {
    const outro = sortear(i + 1);
    [resultado[i], resultado[outro]] = [resultado[outro], resultado[i]];
  }
  return resultado;
}

export function montarConteudoFase(fase: Fase, sortear: (limite: number) => number = randomInt) {
  if (fase.tipo === "memoria") {
    const figuras = fase.conjuntos[sortear(fase.conjuntos.length)];
    return { tipo: fase.tipo, cartas: embaralhar([...figuras, ...figuras], sortear) };
  }
  if (fase.tipo === "labirinto") {
    const mapa = fase.mapas[sortear(fase.mapas.length)];
    return { tipo: fase.tipo, mapa, inicio: localizar(mapa, "I"), chegada: localizar(mapa, "F") };
  }
  const padrao = fase.padroes[sortear(fase.padroes.length)];
  const correta = padrao[fase.lacuna % padrao.length];
  const sequencia = Array.from({ length: fase.comprimento }, (_, indice) =>
    indice === fase.lacuna ? null : padrao[indice % padrao.length],
  );
  const outrasPecas = PECAS_SEQUENCIA.filter((item) => item.id !== correta.id);
  const mesmaForma = embaralhar(outrasPecas.filter((item) => item.forma === correta.forma), sortear);
  const mesmaCor = embaralhar(outrasPecas.filter((item) => item.cor === correta.cor), sortear);
  const soMudaCor = padrao.every((item) => item.forma === correta.forma);
  const soMudaForma = padrao.every((item) => item.cor === correta.cor);
  const distratoras = soMudaCor
    ? mesmaForma.slice(0, 2)
    : soMudaForma
      ? mesmaCor.slice(0, 2)
      : [mesmaForma[0], mesmaCor[0]];
  const alternativas = embaralhar([correta, ...distratoras], sortear);
  return { tipo: fase.tipo, sequencia, alternativas, resposta: correta.id };
}

function localizar(mapa: readonly string[], marco: "I" | "F") {
  const linha = mapa.findIndex((conteudo) => conteudo.includes(marco));
  return { linha, coluna: mapa[linha].indexOf(marco) };
}
