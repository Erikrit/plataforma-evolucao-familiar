/**
 * Régua de qualidade dos jogos digitais (M03 §15; DEV-CAT-M1, ticket 02).
 *
 * Verificador comum, sem banco, sobre a configuração editorial dos jogos.
 * Confere solução, resposta única, progressão, nome × figura, rótulo que entrega
 * a resposta e variantes repetidas. Devolve métricas por fase e as falhas;
 * qualquer falha reprova o catálogo.
 */
import { CATALOGO_JOGOS_PILOTO_E5 } from "../prisma/catalogo-jogos-piloto-e5.mjs";
import { CATALOGO_JOGOS_EXPANSAO_E5 } from "../prisma/catalogo-jogos-expansao-e5.mjs";
import { CATALOGO_JOGOS_HISTORIAS_E5 } from "../prisma/catalogo-jogos-historias-e5.mjs";
import { CATALOGO_JOGOS_MARCO1_E5 } from "../prisma/catalogo-jogos-marco1-e5.mjs";
import { CATALOGO_JOGOS_MEMORIA_ESCOLHA_E5 } from "../prisma/catalogo-jogos-memoria-escolha-e5.mjs";
import { CATALOGO_JOGO_BARQUINHO_E5 } from "../prisma/catalogo-jogos-barquinho-e5.mjs";
import { CATALOGO_JOGOS_CORES_E5 } from "../prisma/catalogo-jogos-cores-e5.mjs";
import { trilhaDaFase } from "../prisma/trilhas-jogos.mjs";

/** Mesma composição que a carga oficial publica (`prisma/carga-oficial.mjs`). */
export const CATALOGO_CARREGADO = [
  ...CATALOGO_JOGOS_PILOTO_E5,
  ...CATALOGO_JOGOS_EXPANSAO_E5,
  ...CATALOGO_JOGOS_HISTORIAS_E5,
  ...CATALOGO_JOGOS_MARCO1_E5,
  ...CATALOGO_JOGOS_MEMORIA_ESCOLHA_E5,
  ...CATALOGO_JOGO_BARQUINHO_E5,
  ...CATALOGO_JOGOS_CORES_E5,
];

/**
 * Vocabulário revisado: o que cada figura mostra. Um nome corresponde à figura se
 * alguma palavra dele começa por um dos termos (sem acento, minúsculas). Figura
 * nova entra aqui com revisão humana; sem entrada, a régua reprova.
 */
export const VOCABULARIO_FIGURAS = {
  "🐈": ["gato"], "🐟": ["peixe"], "🐝": ["abelha"], "🐇": ["coelho"], "🐦": ["passaro", "ave"],
  "🦋": ["borboleta"], "🦅": ["aguia", "ave"], "🪰": ["mosca"],
  "🌳": ["arvore", "parque", "floresta"], "🌸": ["flor"], "🍃": ["folha"], "🌵": ["cacto"],
  "🌱": ["semente", "broto", "muda", "plant"], "🪴": ["vaso", "planta", "terra"],
  "☀️": ["sol"], "🌙": ["lua"], "⭐": ["estrela"], "☁️": ["nuvem"], "☄️": ["cometa"], "🌧️": ["chuva"],
  "💧": ["gota", "agua", "enxagu", "molh"], "💦": ["gota", "respingo", "suor"], "🔥": ["fogo", "forno", "assar"],
  "⚽": ["bola", "futebol"], "🏀": ["bola", "basquete"], "🪁": ["pipa"],
  "⛵": ["barco", "veleiro"], "🚂": ["trem"], "🚲": ["bicicleta"], "🚗": ["carro"], "🚌": ["onibus"],
  "🛵": ["moto", "lambreta"], "✈️": ["aviao"],
  "🍎": ["maca"], "🍐": ["pera"], "🍌": ["banana"], "🍊": ["laranja"], "🍓": ["morango"], "🍇": ["uva"],
  "🍒": ["cereja"], "🍉": ["melancia"], "🍍": ["abacaxi"], "🍑": ["pessego"], "🥕": ["cenoura", "colh", "horta"],
  "🥪": ["sanduiche", "lanche"], "🍽️": ["prato", "comer", "refeicao"], "🎂": ["bolo"], "🥣": ["tigela", "misturar", "massa"],
  "😋": ["fome", "gostoso", "delicia"],
  "🏠": ["casa"], "🏰": ["castelo"], "⛪": ["igreja"], "⛺": ["tenda", "barraca"], "🏫": ["escola"],
  "🔑": ["chave"], "📘": ["livro"], "☕": ["xicara", "cafe"], "👟": ["sapato", "tenis"], "👕": ["camiseta", "roupa", "vest"],
  "🎒": ["mochila"], "🧼": ["sabao", "sabonete"], "🧺": ["cesto", "cesta"], "🚿": ["chuveiro", "banho", "ducha"],
  "🪥": ["escova", "dente"], "🛏️": ["cama", "dorm", "acord", "deit"], "⏰": ["despertador", "relogio", "acord"],
  "🚶": ["caminh", "andar", "passe"], "📄": ["papel", "folha"], "✏️": ["lapis", "desenh"], "✍️": ["escrev"],
  "💌": ["carta", "cartao", "envelope", "bilhete"],
  // Ticket 09: figuras novas do Marco 1 (termos = palavras do nome; revisão humana na homologação).
  "🐶": ["cachorro"],
  "🐢": ["tartaruga"],
  "🐸": ["sapo"],
  "🐄": ["vaca"],
  "🐖": ["porco"],
  "🐑": ["ovelha"],
  "🐴": ["cavalo"],
  "🐘": ["elefante"],
  "🦒": ["girafa"],
  "🐒": ["macaco"],
  "🦁": ["leao"],
  "🐧": ["pinguim"],
  "🦆": ["pato"],
  "🐌": ["caracol"],
  "🐞": ["joaninha"],
  "🦀": ["caranguejo"],
  "🐙": ["polvo"],
  "🐳": ["baleia"],
  "🐔": ["galinha"],
  "🐭": ["rato"],
  "🌻": ["girassol"],
  "🍄": ["cogumelo"],
  "🌷": ["tulipa"],
  "🥝": ["kiwi"],
  "🥥": ["coco"],
  "🍋": ["limao"],
  "🥭": ["manga"],
  "🌽": ["milho"],
  "🥦": ["brocolis"],
  "🥔": ["batata"],
  "🍞": ["pao"],
  "🧀": ["queijo"],
  "🥚": ["ovo"],
  "🍪": ["biscoito"],
  "🌈": ["arco", "iris"],
  "❄️": ["floco", "neve"],
  "⚡": ["raio"],
  "🚁": ["helicoptero"],
  "🚜": ["trator"],
  "🚀": ["foguete"],
  "🛴": ["patinete"],
  "🪑": ["cadeira"],
  "🕯️": ["vela"],
  "🧸": ["ursinho"],
  "🎈": ["balao"],
  "🎲": ["dado"],
  "🧦": ["meia"],
  "🧢": ["bone"],
  "🖍️": ["giz", "cera"],
  "📏": ["regua"],
  "✂️": ["tesoura"],
  "🔵": ["circulo"], "🟢": ["circulo"], "🟥": ["quadrado"], "🔺": ["triangulo"], "🔻": ["triangulo"],
};

/**
 * Termos de ação das cenas de Histórias (ticket 09): somados aos do vocabulário,
 * porque a cena nomeia a ação feita com a figura (ex.: "Assar no forno" com 🔥).
 */
const TERMOS_CENAS = {
  "🐣": ["pintinho"],
  "🧵": ["linha"],
  "☂️": ["guarda"],
  "📮": ["correio"],
  "🎉": ["festa", "cantar"],
  "🎁": ["presente", "embrulh"],
  "🌬️": ["vento"],
  "🪣": ["balde"],
  "🧽": ["esponja", "molhar", "lavar"],
  "🚪": ["porta", "sair"],
  "🍯": ["mel"],
  "🐝": ["abelha"],
  "🌻": ["girassol"],
  "🍽️": ["prato", "comer", "servir"],
  "🎈": ["balao", "encher"],
  "🚗": ["carro"],
  "🍞": ["pao"],
  "🧀": ["queijo"],
  "🥪": ["sanduiche"],
  "🌈": ["arco"],
  "🌧️": ["chuva"],
  "🍎": ["maca"],
  "🥕": ["cenoura"],
  "🔥": ["fogo", "forno", "assar", "cozinh"],
  "💧": ["gota", "agua", "enxagu", "molh"],
  "🧼": ["sabao", "sabonete", "lavar"],
  "☀️": ["sol"],
  "🌳": ["arvore", "parque", "passear"],
  "📘": ["livro"],
  "✏️": ["lapis", "desenh"],
  "✂️": ["tesoura", "recort"],
  "🖍️": ["giz", "pintar"],
  "💌": ["carta", "cartao", "envelope", "bilhete"],
  "🏠": ["casa"],
  "🪥": ["escova", "dente"],
  "🎒": ["mochila"],
  "🚌": ["onibus"],
  "🏫": ["escola"],
  "⏰": ["despertador", "relogio", "acord"],
  "👕": ["camiseta", "roupa", "vest"],
  "🧺": ["cesto", "cesta"],
  "👟": ["tenis", "sapato"],
  "☁️": ["nuvem"],
  "🪁": ["pipa"],
  "🕯️": ["vela"],
  "🎂": ["bolo"],
  "🥣": ["tigela", "misturar", "massa"],
  "🥚": ["ovo"],
  "🐔": ["galinha"],
  "🌸": ["flor"],
  "🌱": ["semente", "broto", "plant"],
  "🪴": ["vaso", "planta", "terra"],
  "😋": ["fome", "gostoso", "delicia"],
  "📄": ["papel", "folha"],
  "🚿": ["chuveiro", "banho", "ducha"],
  "🚶": ["caminh", "andar", "passe"],
};
for (const [simbolo, termos] of Object.entries(TERMOS_CENAS)) {
  VOCABULARIO_FIGURAS[simbolo] = [...new Set([...(VOCABULARIO_FIGURAS[simbolo] ?? []), ...termos])];
}

/**
 * Grupo de cada figura (ticket 09): figuras do mesmo grupo se confundem mais.
 * Usado para desempatar a progressão por semelhança (decisão de 2026-11-26).
 */
const GRUPOS_FIGURAS = {
  animais: "🐈🐶🐟🐝🐇🐦🦋🦅🪰🐢🐸🐄🐖🐑🐴🐘🦒🐒🦁🐧🦆🐌🐞🦀🐙🐳🐔🐭🐣",
  plantas: "🌳🌸🍃🌵🌻🍄🌱🪴🌷",
  frutas: "🍎🍐🍌🍊🍓🍇🍒🍉🍍🍑🥝🥥🍋🥭",
  comidas: "🥕🌽🥦🍅🥔🍞🧀🥚🍪🎂🥪🥣",
  ceu: "☀️🌙⭐☁️☄️🌈❄️⚡🌧️",
  transportes: "⛵🚂🚲🚗🚌🛵✈️🚁🚜🚀🛴",
  casa: "🔑📘☕🏠🪑🛏️🕯️⏰🧼🧺🚿🪥",
  brinquedos: "⚽🏀🪁🧸🎈🎲",
  roupas: "👟👕🧦🧢🎒",
  escola: "✏️🖍️📏✂️📄🏫",
  lugares: "🏰⛪⛺",
  formas: "🔵🟢🟥🔺🔻🟦🟡🔶",
};
const SUPERGRUPOS = {
  animais: "seres vivos", plantas: "seres vivos", frutas: "alimentos", comidas: "alimentos",
  ceu: "natureza", casa: "objetos", brinquedos: "objetos", roupas: "objetos", escola: "objetos",
  transportes: "transportes", lugares: "lugares", formas: "formas",
};
const grupoDe = (simbolo) =>
  Object.entries(GRUPOS_FIGURAS).find(([, simbolos]) => [...new Intl.Segmenter().segment(simbolos)].some((p) => p.segment === simbolo))?.[0] ?? null;

/** Letras de som vizinho, que a criança confunde ao falar o nome (Letra inicial). L/R ficam de fora: o R inicial não soa como L. */
const SONS_VIZINHOS = { b: "p", p: "b", f: "v", v: "f", t: "d", d: "t", m: "n", n: "m", c: "g", g: "c", s: "z", z: "s" };

/**
 * Distrações parecidas com a resposta (homologação de 2026-11-27):
 * - letra (`inicio` de uma letra): a distração começa com a letra de som vizinho;
 * - sílaba (`inicio` de duas ou mais letras): a distração começa com a mesma letra;
 * - pista: a distração é do mesmo grupo de figuras da resposta.
 */
function distracoesParecidas(conjunto, correta, distratores) {
  if (conjunto.inicio) {
    const inicio = normalizar(conjunto.inicio);
    const primeira = (opcao) => normalizar(opcao.nome)[0];
    const alvo = inicio.length > 1 ? inicio[0] : SONS_VIZINHOS[inicio];
    return distratores.filter((d) => primeira(d) === alvo).length;
  }
  if (conjunto.pista) {
    const grupo = grupoDe(correta.simbolo);
    return grupo ? distratores.filter((d) => grupoDe(d.simbolo) === grupo).length : 0;
  }
  return 0;
}

/** 2 por distrator do mesmo grupo da resposta, 1 se só do mesmo supergrupo. */
function semelhancaComResposta(resposta, distratores) {
  const g = grupoDe(resposta.simbolo);
  if (!g) return 0;
  return distratores.reduce((total, d) => {
    const gd = grupoDe(d.simbolo);
    return total + (gd === g ? 2 : gd && SUPERGRUPOS[gd] === SUPERGRUPOS[g] ? 1 : 0);
  }, 0);
}

/** Letra (Forme a palavra) ou número (Do menor ao maior): a peça mostra o próprio nome. */
const ehNumero = (simbolo) => /^\d+$/.test(simbolo);
const ehAutodescritiva = (simbolo) => ehNumero(simbolo) || /^\p{Lu}$/u.test(simbolo);

const NOME_FORMA = { circulo: "circulo", quadrado: "quadrado", triangulo: "triangulo", losango: "losango" };

/**
 * Métrica principal (tem de crescer), secundárias (o empate passa se uma delas cresce)
 * e métricas que não podem cair. No labirinto, passos sozinhos não mediam dificuldade
 * (homologação H10, 2026-11-26): o que cresce são as decisões no caminho.
 */
const METRICAS = {
  labirinto: { principal: "decisoes", secundarias: [], naoCaem: ["passos"], extras: ["juncoes", "becos"] },
  memoria: { principal: "pares", secundarias: ["semelhanca"] },
  // Homologação de 2026-11-27: "parecidas" mede o quanto as distrações confundem (letra/pista)
  // e desempata a progressão; "proporcao" é a fração das distrações que são parecidas.
  escolha: { principal: "opcoes", secundarias: ["semelhanca", "parecidas"], extras: ["proporcao"] },
  sequencia: { principal: "periodo", secundarias: ["comprimento", "lacunaNoMeio"] },
  // Ticket 13: Pequenos com nome, Médios sem nome, Grandes com intrusas; a pista sai nos empates.
  ordenacao: { principal: "cenas", secundarias: ["semNomes", "intrusas", "semPista"] },
  // Ticket 12: Sudoku cresce em casas vazias; Robô com setas, em curvas (comandos a planejar).
  sudoku: { principal: "vazias", secundarias: ["tamanho"] },
  robo: { principal: "curvas", secundarias: [], naoCaem: ["passos"], extras: ["decisoes"] },
  // DEV-CAT-M1-CONTEUDO, ticket 05: caminho mais longo; cores e trocas não aliviam; decisões desempatam.
  cores: { principal: "passos", secundarias: ["decisoes"], naoCaem: ["cores", "trocas"] },
  // DEV-CAT-M1-CONTEUDO, ticket 11: rio mais longo; canal, pedras, curvas e correnteza não aliviam.
  barquinho: { principal: "comprimento", secundarias: [], naoCaem: ["estreitamento", "pedras", "curvas", "correnteza"] },
};

const normalizar = (texto) =>
  texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").trim();
const palavras = (texto) => normalizar(texto).split(/\s+/).filter(Boolean);
const igualVisivel = (a, b) => a.simbolo === b.simbolo && normalizar(a.nome) === normalizar(b.nome);
const listaNomes = (nomes) => nomes.map((nome) => `“${nome}”`).join(", ");

/**
 * O texto cita o nome (ou palavra derivada dele): alguma palavra começa pelo radical
 * de uma palavra do nome (a palavra sem a última letra, com ao menos três letras).
 */
function citaNome(texto, nome) {
  const radicais = palavras(nome).filter((p) => p.length >= 3).map((p) => p.slice(0, Math.max(3, p.length - 1)));
  return palavras(texto).some((p) => radicais.some((r) => p.startsWith(r)));
}

// ---------- Nome × figura ----------

function conferirFigura(item) {
  const termos = VOCABULARIO_FIGURAS[item.simbolo];
  if (!termos) return `${item.simbolo} sem referência no vocabulário revisado`;
  if (palavras(item.nome).some((p) => termos.some((t) => p.startsWith(t)))) return null;
  return `“${item.nome}” não corresponde a ${item.simbolo} (${termos.join(", ")})`;
}

function conferirPeca(peca) {
  const p = palavras(peca.nome);
  if (p.includes(NOME_FORMA[peca.forma]) && p.includes(normalizar(peca.cor))) return null;
  return `“${peca.nome}” não corresponde a ${peca.forma} ${peca.cor}`;
}

// ---------- Labirinto ----------

const VIZINHOS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const aberta = (mapa, l, c) => Boolean(mapa[l]?.[c]) && mapa[l][c] !== "#";

function localizar(mapa, marco) {
  const pontos = [];
  mapa.forEach((linha, l) => [...linha].forEach((celula, c) => celula === marco && pontos.push([l, c])));
  return pontos;
}

/**
 * Menor percurso que passa por todos os pontos P (qualquer ordem) e termina em F.
 * Devolve as células visitadas, do início à chegada, ou null se não houver.
 */
function menorPercurso(mapa) {
  const [inicio] = localizar(mapa, "I");
  const [chegada] = localizar(mapa, "F");
  if (!inicio || !chegada) return null;
  const pontos = localizar(mapa, "P");
  const todos = (1 << pontos.length) - 1;
  const marca = (l, c, m) => {
    const i = pontos.findIndex(([pl, pc]) => pl === l && pc === c);
    return i < 0 ? m : m | (1 << i);
  };
  const origem = [inicio[0], inicio[1], marca(inicio[0], inicio[1], 0)];
  const fila = [origem];
  const anterior = new Map([[origem.join("/"), null]]);
  for (let i = 0; i < fila.length; i += 1) {
    const [l, c, m] = fila[i];
    if (l === chegada[0] && c === chegada[1] && m === todos) {
      const celulas = [];
      for (let chave = [l, c, m].join("/"); chave; chave = anterior.get(chave)) {
        celulas.unshift(chave.split("/").slice(0, 2).map(Number));
      }
      return celulas;
    }
    for (const [dl, dc] of VIZINHOS) {
      const [nl, nc] = [l + dl, c + dc];
      if (!aberta(mapa, nl, nc)) continue;
      const nm = marca(nl, nc, m);
      const chave = `${nl}/${nc}/${nm}`;
      if (anterior.has(chave)) continue;
      anterior.set(chave, [l, c, m].join("/"));
      fila.push([nl, nc, nm]);
    }
  }
  return null;
}

const saidas = (mapa, l, c) => VIZINHOS.filter(([dl, dc]) => aberta(mapa, l + dl, c + dc)).length;

/**
 * Decisão: célula do percurso em que a criança tem mais de um caminho para seguir,
 * sem contar o lado de onde veio (no início, duas saídas; depois, três ou mais).
 */
function contarDecisoes(mapa, celulas) {
  return celulas.slice(0, -1).filter(([l, c], i) => saidas(mapa, l, c) >= (i === 0 ? 2 : 3)).length;
}

function avaliarMapa(mapa) {
  let juncoes = 0;
  let becos = 0;
  mapa.forEach((linha, l) =>
    [...linha].forEach((celula, c) => {
      if (celula === "#") return;
      const n = saidas(mapa, l, c);
      if (n >= 3) juncoes += 1;
      if (n === 1 && celula !== "I" && celula !== "F") becos += 1;
    }),
  );
  const celulas = menorPercurso(mapa);
  return {
    metricas: {
      decisoes: celulas ? contarDecisoes(mapa, celulas) : 0,
      passos: celulas ? celulas.length - 1 : 0,
      juncoes,
      becos,
    },
    falhas: celulas ? [] : [["solucao", "sem caminho do início à chegada passando pelos pontos"]],
  };
}

/** Mudanças de direção ao longo do percurso (Robô com setas). */
function contarCurvas(celulas) {
  let curvas = 0;
  for (let i = 2; i < celulas.length; i += 1) {
    const [a, b, c] = [celulas[i - 2], celulas[i - 1], celulas[i]];
    if (b[0] - a[0] !== c[0] - b[0] || b[1] - a[1] !== c[1] - b[1]) curvas += 1;
  }
  return curvas;
}

// ---------- Sudoku ----------

const CAIXAS = { 4: [2, 2], 6: [2, 3] };

function gradeValida(grade, n) {
  const [bl, bc] = CAIXAS[n] ?? [0, 0];
  const conjuntos = [];
  for (let i = 0; i < n; i += 1) {
    conjuntos.push(grade[i]);
    conjuntos.push(grade.map((linha) => linha[i]));
  }
  for (let l = 0; l < n; l += bl) {
    for (let c = 0; c < n; c += bc) {
      conjuntos.push(grade.slice(l, l + bl).flatMap((linha) => linha.slice(c, c + bc)));
    }
  }
  return conjuntos.every((v) => v.length === n && new Set(v).size === n && v.every((x) => x >= 1 && x <= n));
}

/** Conta soluções até `limite` (backtracking). */
function contarSolucoes(grade, n, limite = 2) {
  const [bl, bc] = CAIXAS[n];
  const g = grade.map((linha) => [...linha]);
  let total = 0;
  const pode = (l, c, v) => {
    for (let i = 0; i < n; i += 1) if (g[l][i] === v || g[i][c] === v) return false;
    const l0 = l - (l % bl);
    const c0 = c - (c % bc);
    for (let i = l0; i < l0 + bl; i += 1) for (let j = c0; j < c0 + bc; j += 1) if (g[i][j] === v) return false;
    return true;
  };
  const resolver = (pos) => {
    if (total >= limite) return;
    if (pos === n * n) { total += 1; return; }
    const [l, c] = [Math.floor(pos / n), pos % n];
    if (g[l][c]) { resolver(pos + 1); return; }
    for (let v = 1; v <= n; v += 1) {
      if (!pode(l, c, v)) continue;
      g[l][c] = v;
      resolver(pos + 1);
      g[l][c] = 0;
    }
  };
  resolver(0);
  return total;
}

const lerGrade = (linhas) => linhas.map((linha) => [...linha].map((x) => (x === "." ? 0 : Number(x))));

const espelhoHorizontal = (mapa) => mapa.map((linha) => [...linha].reverse().join(""));
const espelhoVertical = (mapa) => [...mapa].reverse();

// ---------- Por motor: variantes, métricas e falhas ----------

// ---------- Caminho de cores (ticket 05) ----------

const CORES_CAMINHO = ["a", "v", "m", "r"];
// Ordem fixa dos vizinhos: baixo, direita, cima, esquerda (caminho determinístico).
const VIZINHOS_CORES = [[1, 0], [0, 1], [-1, 0], [0, -1]];

/**
 * Pode pisar na casa com a cor indicada? Partida e chegada sempre; casa de troca (maiúscula)
 * sempre, e ele muda a cor; casa comum só se for da cor indicada. Devolve a cor seguinte,
 * ou null se não pode pisar.
 */
function pisarCores(linhas, l, c, cor) {
  const casa = linhas[l]?.[c];
  if (casa == null || casa === "#") return null;
  if (casa === "I" || casa === "F") return cor;
  if (CORES_CAMINHO.includes(casa.toLowerCase()) && casa === casa.toUpperCase()) return casa.toLowerCase();
  return casa === cor ? cor : null;
}

/** Menor caminho pelo par (casa, cor), da partida à chegada; null se não houver. */
function caminhoCores(linhas, corInicial) {
  const inicio = localizar(linhas, "I")[0];
  const chave = (l, c, cor) => `${l}/${c}/${cor}`;
  const anterior = new Map([[chave(...inicio, corInicial), null]]);
  const fila = [[...inicio, corInicial]];
  for (let i = 0; i < fila.length; i += 1) {
    const [l, c, cor] = fila[i];
    if (linhas[l][c] === "F") {
      const caminho = [];
      for (let k = chave(l, c, cor); k; k = anterior.get(k)) {
        const [kl, kc, kcor] = k.split("/");
        caminho.unshift([Number(kl), Number(kc), kcor]);
      }
      return caminho;
    }
    for (const [dl, dc] of VIZINHOS_CORES) {
      const proximaCor = pisarCores(linhas, l + dl, c + dc, cor);
      if (proximaCor == null || anterior.has(chave(l + dl, c + dc, proximaCor))) continue;
      anterior.set(chave(l + dl, c + dc, proximaCor), chave(l, c, cor));
      fila.push([l + dl, c + dc, proximaCor]);
    }
  }
  return null;
}

// ---------- Barquinho no rio (ticket 11) ----------

/**
 * Análise do rio, própria da régua e independente da simulação da web. O barco ocupa uma
 * casa e anda por água (`.`, `f` ou `B`), descendo ou virando para o lado; não sobe.
 * Devolve se há rota até a última linha e os becos sem saída: casas alcançáveis a partir
 * da partida que não chegam à última linha. Sem tempo e sem perder (M03 §15), nenhuma
 * casa pode prender o barco.
 */
function analisarRioBarquinho(rio) {
  const livre = (l, c) => [".", "f", "B"].includes(rio[l]?.[c]);
  const passos = (l, c) => [[l + 1, c], [l, c - 1], [l, c + 1]].filter(([nl, nc]) => livre(nl, nc));
  const alcancadas = new Set();
  const fila = [[0, rio[0].indexOf("B")]];
  alcancadas.add(fila[0].join("/"));
  for (let i = 0; i < fila.length; i += 1) {
    for (const [nl, nc] of passos(...fila[i])) {
      if (alcancadas.has(`${nl}/${nc}`)) continue;
      alcancadas.add(`${nl}/${nc}`);
      fila.push([nl, nc]);
    }
  }
  // Casas que chegam à última linha: propagação de baixo para cima até estabilizar.
  const chegam = new Set();
  for (let c = 0; c < rio[0].length; c += 1) if (livre(rio.length - 1, c)) chegam.add(`${rio.length - 1}/${c}`);
  for (let mudou = true; mudou; ) {
    mudou = false;
    for (let l = rio.length - 2; l >= 0; l -= 1) {
      for (let c = 0; c < rio[l].length; c += 1) {
        if (!livre(l, c) || chegam.has(`${l}/${c}`)) continue;
        if (passos(l, c).some(([nl, nc]) => chegam.has(`${nl}/${nc}`))) {
          chegam.add(`${l}/${c}`);
          mudou = true;
        }
      }
    }
  }
  return {
    rota: chegam.has(fila[0].join("/")),
    becos: [...alcancadas].filter((casa) => !chegam.has(casa)).map((casa) => casa.split("/").map(Number)),
  };
}

/** Canal de cada linha: primeira e última casa que não é margem. */
function canalDa(linha) {
  const esquerda = [...linha].findIndex((c) => c !== "#");
  const direita = linha.length - 1 - [...linha].reverse().findIndex((c) => c !== "#");
  return { esquerda, direita, largura: esquerda < 0 ? 0 : direita - esquerda + 1 };
}

const MOTORES = {
  labirinto: {
    variantes: (config) => config.mapas ?? [],
    avaliar: (mapa) => avaliarMapa(mapa),
    chave: (mapa) => mapa.join("/"),
    espelhos: (mapa) => [espelhoHorizontal(mapa), espelhoVertical(mapa)].map((m) => m.join("/")),
    // Só as paredes: mover início, chegada ou pontos não cria variante nova.
    paredes: (mapa) => {
      const semMarcos = mapa.map((linha) => linha.replace(/[IFP]/g, "."));
      return [semMarcos, espelhoHorizontal(semMarcos), espelhoVertical(semMarcos)].map((m) => m.join("/"));
    },
  },
  cores: {
    variantes: (config) => config.mapas ?? [],
    avaliar({ cor, linhas }) {
      const falhas = [];
      const metricas = { passos: 0, decisoes: 0, cores: 0, trocas: 0 };
      const colunas = linhas?.[0]?.length ?? 0;
      if (!Array.isArray(linhas) || linhas.some((linha) => linha.length !== colunas || !/^[#IFavmrAVMR]+$/.test(linha))) {
        falhas.push(["solucao", "mapa de cores com linhas desiguais ou letras fora do alfabeto"]);
        return { metricas, falhas };
      }
      if (localizar(linhas, "I").length !== 1 || localizar(linhas, "F").length !== 1) {
        falhas.push(["solucao", "mapa de cores precisa de uma partida e uma chegada"]);
        return { metricas, falhas };
      }
      if (!CORES_CAMINHO.includes(cor)) {
        falhas.push(["solucao", `cor inicial inválida: ${cor}`]);
        return { metricas, falhas };
      }
      metricas.cores = new Set([...linhas.join("")].filter((casa) => CORES_CAMINHO.includes(casa.toLowerCase())).map((casa) => casa.toLowerCase())).size;
      const caminho = caminhoCores(linhas, cor);
      if (!caminho) {
        falhas.push(["solucao", "sem rota pela cor indicada até a chegada"]);
        return { metricas, falhas };
      }
      metricas.passos = caminho.length - 1;
      metricas.trocas = caminho.filter(([l, c]) => /[AVMR]/.test(linhas[l][c])).length;
      // Decisão: casa do caminho com mais de uma saída pela cor (sem contar a casa de onde veio).
      metricas.decisoes = caminho.slice(0, -1).filter(([l, c, corAqui], i) => {
        const veio = caminho[i - 1];
        return VIZINHOS_CORES.filter(([dl, dc]) =>
          !(veio && veio[0] === l + dl && veio[1] === c + dc) && pisarCores(linhas, l + dl, c + dc, corAqui) != null,
        ).length >= 2;
      }).length;
      return { metricas, falhas };
    },
    chave: ({ cor, linhas }) => `${cor}:${(linhas ?? []).join("/")}`,
  },
  barquinho: {
    variantes: (config) => (config.rios ?? []).map((rio) => ({ rio, correnteza: config.correnteza })),
    avaliar({ rio, correnteza }) {
      const falhas = [];
      const metricas = { comprimento: rio.length, estreitamento: 0, pedras: 0, curvas: 0, correnteza: correnteza ?? 0 };
      const colunas = rio[0]?.length ?? 0;
      if (rio.length < 2 || rio.some((linha) => linha.length !== colunas)) {
        falhas.push(["solucao", "linhas do rio com tamanhos diferentes"]);
        return { metricas, falhas };
      }
      if (rio.some((linha) => linha[0] !== "#" || linha.at(-1) !== "#")) falhas.push(["solucao", "rio sem margem nas bordas"]);
      if ([...rio[0]].filter((c) => c === "B").length !== 1 || rio.slice(1).some((l) => l.includes("B"))) {
        falhas.push(["solucao", "o barco (B) precisa estar uma vez, na primeira linha"]);
        return { metricas, falhas };
      }
      const { rota, becos } = analisarRioBarquinho(rio);
      if (!rota) {
        falhas.push(["solucao", "sem rota do barco até a margem final"]);
      } else {
        if (becos.length) falhas.push(["solucao", `beco sem saída em ${becos.length} casa(s): ${becos.slice(0, 5).map(([l, c]) => `(${l},${c})`).join(", ")}`]);
      }
      const canais = rio.map(canalDa);
      const casasCanal = canais.reduce((total, canal) => total + canal.largura, 0);
      const pedras = rio.reduce((total, linha) => total + [...linha].filter((c) => c === "o").length, 0);
      metricas.estreitamento = colunas - Math.min(...canais.map((canal) => canal.largura));
      metricas.pedras = casasCanal ? Math.round((100 * pedras) / casasCanal) : 0;
      metricas.curvas = canais.filter((canal, i) => i > 0 && (canal.esquerda !== canais[i - 1].esquerda || canal.direita !== canais[i - 1].direita)).length;
      return { metricas, falhas };
    },
    chave: ({ rio }) => rio.join("/"),
    espelhos: ({ rio }) => [rio.map((linha) => [...linha].reverse().join("")).join("/")],
  },
  robo: {
    variantes: (config) => config.mapas ?? [],
    avaliar(mapa) {
      const base = avaliarMapa(mapa);
      const celulas = menorPercurso(mapa);
      return { ...base, metricas: { ...base.metricas, curvas: celulas ? contarCurvas(celulas) : 0 } };
    },
    chave: (mapa) => mapa.join("/"),
    espelhos: (mapa) => [espelhoHorizontal(mapa), espelhoVertical(mapa)].map((m) => m.join("/")),
    paredes: (mapa) => {
      const semMarcos = mapa.map((linha) => linha.replace(/[IFP]/g, "."));
      return [semMarcos, espelhoHorizontal(semMarcos), espelhoVertical(semMarcos)].map((m) => m.join("/"));
    },
  },
  sudoku: {
    variantes: (config) => (config.grades ?? []).map((grade) => ({ grade, config })),
    avaliar({ grade, config }) {
      const falhas = [];
      const n = config.tamanho;
      const inicial = lerGrade(grade.inicial ?? []);
      const solucao = lerGrade(grade.solucao ?? []);
      if (!CAIXAS[n] || (config.simbolos ?? []).length !== n || !gradeValida(solucao, n)) {
        falhas.push(["solucao", "solução que não é um sudoku válido"]);
      } else if (inicial.some((linha, l) => linha.some((v, c) => v && v !== solucao[l][c]))) {
        falhas.push(["solucao", "casa dada diferente da solução"]);
      } else if (contarSolucoes(inicial, n) !== 1) {
        falhas.push(["resposta-unica", "a grade admite mais de uma solução"]);
      }
      for (const simbolo of config.simbolos ?? []) {
        const erro = conferirFigura(simbolo);
        if (erro) falhas.push(["nome-figura", erro]);
      }
      return { metricas: { vazias: inicial.flat().filter((v) => !v).length, tamanho: n }, falhas };
    },
    chave: ({ grade }) => `${(grade.inicial ?? []).join("/")}=${(grade.solucao ?? []).join("/")}`,
  },
  memoria: {
    variantes: (config) => config.conjuntos ?? [],
    avaliar(conjunto) {
      const falhas = [];
      const cartas = conjunto.flatMap((item) =>
        Array.isArray(item.faces) ? item.faces.map((face) => ({ ...face, id: item.id })) : [item, item],
      );
      const contagem = new Map();
      cartas.forEach((carta) => contagem.set(carta.id, (contagem.get(carta.id) ?? 0) + 1));
      if ([...contagem.values()].some((n) => n !== 2)) falhas.push(["solucao", "par sem exatamente duas cartas"]);
      const vazamentos = [];
      const objetos = [];
      for (const item of conjunto) {
        const faces = Array.isArray(item.faces) ? item.faces : [item];
        // A face objeto nomeia a figura; a outra (sombra) não pode repetir esse nome.
        const objeto = faces.find((face) => (face.face ?? "objeto") === "objeto") ?? faces[0];
        if (objetos.some((outro) => igualVisivel(outro, objeto))) {
          falhas.push(["resposta-unica", `dois pares com a mesma figura “${objeto.nome}”`]);
        }
        objetos.push(objeto);
        const erro = conferirFigura(objeto);
        if (erro) falhas.push(["nome-figura", erro]);
        for (const face of faces) {
          if (face !== objeto && palavras(face.nome).join(" ").includes(palavras(objeto.nome).join(" "))) {
            vazamentos.push(face.nome);
          }
        }
      }
      if (vazamentos.length) falhas.push(["rotulo", `a sombra mostra o nome do objeto (${listaNomes(vazamentos)})`]);
      // Semelhança: pares menos grupos distintos (mais pares do mesmo grupo, mais difícil).
      const grupos = new Set(objetos.map((o, i) => grupoDe(o.simbolo) ?? `sem-grupo-${i}`));
      return { metricas: { pares: contagem.size, semelhanca: contagem.size - grupos.size }, falhas };
    },
    chave: (conjunto) => conjunto.map((item) => item.id).sort().join(","),
  },
  escolha: {
    variantes: (config) => config.conjuntos ?? [],
    avaliar(conjunto) {
      const falhas = [];
      const opcoes = conjunto.opcoes ?? [];
      const correta = opcoes.find((opcao) => opcao.id === conjunto.resposta);
      if (!correta) {
        falhas.push(["solucao", `resposta “${conjunto.resposta}” fora das opções`]);
      } else {
        const gemeas = opcoes.filter((opcao) => opcao !== correta && igualVisivel(opcao, correta));
        if (gemeas.length) falhas.push(["resposta-unica", `${gemeas.length + 1} opções iguais a “${correta.nome}”`]);
        const motivos = [];
        // Com nomes ocultos nos botões, o rótulo não aparece e não entrega a resposta.
        const visiveis = !conjunto.ocultarNomes;
        if (visiveis && normalizar(conjunto.enunciado) === normalizar(correta.nome)) motivos.push("o nome da resposta repete o enunciado");
        const nomes = opcoes.map((opcao) => normalizar(opcao.nome));
        const vezes = (nome) => nomes.filter((n) => n === nome).length;
        const distratoras = opcoes.filter((opcao) => opcao !== correta).map((opcao) => normalizar(opcao.nome));
        if (visiveis && vezes(normalizar(correta.nome)) === 1 && distratoras.every((nome) => vezes(nome) >= 2)) {
          motivos.push(`só a resposta tem nome diferente (“${correta.nome}”)`);
        }
        // Adivinha pela pista (ticket 04): a pista não diz o nome da resposta, nem em palavra derivada.
        if (conjunto.pista && citaNome(conjunto.enunciado, correta.nome)) {
          motivos.push(`a pista diz o nome da resposta (“${correta.nome}”)`);
        }
        if (motivos.length) falhas.push(["rotulo", motivos.join("; ")]);
        // Dica de primeiro nível não pode dizer o nome da resposta.
        const dicaCita = conjunto.pista
          ? citaNome(conjunto.dica ?? "", correta.nome)
          : conjunto.dica && ` ${palavras(conjunto.dica).join(" ")} `.includes(` ${palavras(correta.nome).join(" ")} `);
        if (dicaCita) falhas.push(["dica", `a dica entrega a resposta (“${correta.nome}”)`]);
        // Letra inicial (ticket 04): a resposta começa com a letra ou sílaba pedida, e só ela.
        if (conjunto.inicio) {
          const inicio = normalizar(conjunto.inicio);
          const comeca = (opcao) => normalizar(opcao.nome).startsWith(inicio);
          const outras = opcoes.filter((opcao) => opcao !== correta && comeca(opcao));
          if (!comeca(correta)) {
            falhas.push(["solucao", `“${correta.nome}” não começa com ${conjunto.inicio}`]);
          } else if (outras.length) {
            falhas.push(["resposta-unica", `também começa com ${conjunto.inicio}: ${listaNomes(outras.map((opcao) => opcao.nome))}`]);
          }
        }
      }
      for (const opcao of opcoes) {
        const erro = conferirFigura(opcao);
        if (erro) falhas.push(["nome-figura", erro]);
      }
      const distratores = opcoes.filter((o) => o !== correta);
      const semelhanca = correta ? semelhancaComResposta(correta, distratores) : 0;
      const parecidas = correta ? distracoesParecidas(conjunto, correta, distratores) : 0;
      const proporcao = distratores.length ? parecidas / distratores.length : 1;
      return { metricas: { opcoes: opcoes.length, semelhanca, parecidas, proporcao }, falhas };
    },
    chave: (conjunto) => `${conjunto.resposta}:${(conjunto.opcoes ?? []).map((o) => o.id).sort().join(",")}`,
  },
  sequencia: {
    variantes: (config) => (config.padroes ?? []).map((padrao) => ({ padrao, config })),
    avaliar({ padrao, config }) {
      const falhas = [];
      const { comprimento, lacuna } = config;
      const posicao = lacuna % padrao.length;
      const evidencias = Array.from({ length: comprimento }, (_, i) => i).filter(
        (i) => i !== lacuna && i % padrao.length === posicao,
      );
      if (lacuna >= comprimento || evidencias.length === 0) {
        falhas.push(["solucao", "a peça que falta não aparece em outra posição da sequência"]);
      }
      for (const peca of padrao) {
        const erro = conferirPeca(peca);
        if (erro) falhas.push(["nome-figura", erro]);
      }
      return {
        metricas: { periodo: padrao.length, comprimento, lacunaNoMeio: lacuna < comprimento - 1 ? 1 : 0 },
        falhas,
      };
    },
    chave: ({ padrao }) => padrao.map((peca) => peca.id).join(","),
  },
  ordenacao: {
    variantes: (config) => config.conjuntos ?? [],
    avaliar(conjunto) {
      const falhas = [];
      const cenas = conjunto.cenas ?? [];
      const intrusas = conjunto.intrusas ?? [];
      const todas = [...cenas, ...intrusas];
      if (cenas.length < 2 || new Set(todas.map((cena) => cena.id)).size !== todas.length) {
        falhas.push(["solucao", "cenas insuficientes ou com ids repetidos"]);
      }
      if (todas.some((cena, i) => todas.some((outra, j) => j > i && igualVisivel(cena, outra)))) {
        falhas.push(["resposta-unica", "duas peças iguais admitem mais de uma ordem"]);
      }
      // Do menor ao maior (ticket 12): a ordem certa é a crescente.
      if (cenas.every((cena) => ehNumero(cena.simbolo))) {
        const valores = cenas.map((cena) => Number(cena.simbolo));
        if (valores.some((v, i) => i > 0 && v <= valores[i - 1])) falhas.push(["solucao", "números fora da ordem crescente"]);
      }
      for (const cena of todas) {
        const erro = ehAutodescritiva(cena.simbolo)
          ? normalizar(cena.nome) === normalizar(cena.simbolo) ? null : `“${cena.nome}” não corresponde a ${cena.simbolo}`
          : conferirFigura(cena);
        if (erro) falhas.push(["nome-figura", erro]);
      }
      return {
        metricas: {
          cenas: cenas.length,
          semNomes: conjunto.ocultarNomes ? 1 : 0,
          intrusas: intrusas.length,
          semPista: conjunto.dica ? 0 : 1,
        },
        falhas,
      };
    },
    chave: (conjunto) => (conjunto.cenas ?? []).map((cena) => cena.id).join(","),
  },
};

function avaliarVariedade(motor, variantes) {
  const falhas = [];
  const chaves = variantes.map(motor.chave);
  chaves.forEach((chave, i) => {
    for (let j = 0; j < i; j += 1) {
      if (chaves[j] === chave) {
        falhas.push(["variedade", `variante ${i + 1} repete a solução da variante ${j + 1}`, i + 1]);
      } else if (motor.espelhos?.(variantes[i]).includes(chaves[j])) {
        falhas.push(["variedade", `variante ${i + 1} é só espelhamento da variante ${j + 1}`, i + 1]);
      } else if (motor.paredes) {
        const [proprias, ...espelhadas] = motor.paredes(variantes[i]);
        const outras = motor.paredes(variantes[j])[0];
        if (proprias === outras) {
          falhas.push(["variedade", `variante ${i + 1} tem as mesmas paredes da variante ${j + 1}`, i + 1]);
        } else if (espelhadas.includes(outras)) {
          falhas.push(["variedade", `variante ${i + 1} tem as paredes espelhadas da variante ${j + 1}`, i + 1]);
        }
      }
    }
  });
  return falhas;
}

/**
 * Escolha com letra ou pista (homologação de 2026-11-27). Mais opções sozinhas não bastam:
 * - Médios: em cada fase, pelo menos metade das distrações é parecida;
 * - Grandes: todas as distrações são parecidas;
 * - dentro de cada trilha, as distrações parecidas não diminuem de uma fase para a outra;
 * - a média de distrações parecidas cresce de Pequenos para Médios e de Médios para Grandes.
 */
function avaliarDificuldadePorTrilha(jogo, fases) {
  if (jogo.tipoMecanica !== "escolha") return [];
  const regrada = jogo.fases.some((fase) => (fase.configuracao?.conjuntos ?? []).some((c) => c.inicio || c.pista));
  if (!regrada) return [];
  const trilhaDe = (fase) => fase.trilha ?? trilhaDaFase(fase.numero);
  const porTrilha = new Map();
  const falhas = [];
  jogo.fases.forEach((fase, i) => {
    const trilha = trilhaDe(fase);
    const { parecidas, proporcao, opcoes } = fases[i].metricas;
    // A fase vale pela variante mais fácil; a proporção é a menor entre as variantes.
    const distratores = Math.max(0, opcoes - 1);
    const contagem = `${Math.round(proporcao * distratores)} de ${distratores} distrações parecidas`;
    if (trilha === "medios" && proporcao < 0.5) falhas.push([fase.numero, `medios: ${contagem}; mínimo metade`]);
    if (trilha === "grandes" && proporcao < 1) falhas.push([fase.numero, `grandes: ${contagem}; todas precisam ser`]);
    const lista = porTrilha.get(trilha) ?? [];
    const anterior = lista.at(-1);
    if (anterior && parecidas < anterior.parecidas) {
      falhas.push([fase.numero, `parecidas ${anterior.parecidas} → ${parecidas} dentro de ${trilha}: a dificuldade cai`]);
    }
    lista.push({ numero: fase.numero, parecidas });
    porTrilha.set(trilha, lista);
  });
  const media = (lista) => lista.reduce((t, f) => t + f.parecidas, 0) / lista.length;
  const arred = (n) => Math.round(n * 10) / 10;
  const ordem = ["pequenos", "medios", "grandes"].filter((t) => porTrilha.has(t));
  for (let i = 1; i < ordem.length; i += 1) {
    const [antes, agora] = [porTrilha.get(ordem[i - 1]), porTrilha.get(ordem[i])];
    if (media(agora) <= media(antes)) {
      falhas.push([agora[0].numero, `distrações parecidas em ${ordem[i]} (${arred(media(agora))}) não passam das de ${ordem[i - 1]} (${arred(media(antes))})`]);
    }
  }
  return falhas;
}

/**
 * Avalia o catálogo de jogos. `aprovado` é falso se houver qualquer falha.
 * Variantes e fases são numeradas a partir de 1.
 */
export function avaliarCatalogo(catalogo) {
  const falhas = [];
  const jogos = [];

  for (const jogo of catalogo) {
    const motor = MOTORES[jogo.tipoMecanica];
    const registrar = (fase, variante, regra, detalhe) =>
      falhas.push({ jogo: jogo.id, fase, ...(variante ? { variante } : {}), regra, detalhe });
    if (!motor) {
      registrar(undefined, undefined, "motor", `mecânica “${jogo.tipoMecanica}” sem verificador`);
      continue;
    }
    const { principal, secundarias, naoCaem = [], extras = [] } = METRICAS[jogo.tipoMecanica];
    const fases = [];

    for (const fase of jogo.fases) {
      const variantes = motor.variantes(fase.configuracao ?? {});
      if (variantes.length < 2) registrar(fase.numero, undefined, "variedade", "fase com menos de duas variantes");
      const avaliacoes = variantes.map((variante) => motor.avaliar(variante));
      avaliacoes.forEach(({ falhas: lista }, i) =>
        lista.forEach(([regra, detalhe]) => registrar(fase.numero, i + 1, regra, detalhe)),
      );
      avaliarVariedade(motor, variantes).forEach(([regra, detalhe, variante]) =>
        registrar(fase.numero, variante, regra, detalhe),
      );
      // A fase vale pela variante mais fácil: a criança pode cair em qualquer uma.
      const metricas = {};
      for (const nome of [principal, ...secundarias, ...naoCaem, ...extras]) {
        metricas[nome] = avaliacoes.length ? Math.min(...avaliacoes.map((a) => a.metricas[nome])) : 0;
      }
      fases.push({ numero: fase.numero, metricas });
    }

    for (let i = 1; i < fases.length; i += 1) {
      const [antes, agora] = [fases[i - 1].metricas, fases[i].metricas];
      const trajeto = `${principal} ${antes[principal]} → ${agora[principal]}`;
      if (agora[principal] < antes[principal]) {
        registrar(fases[i].numero, undefined, "progressao", `${trajeto}: a dificuldade cai`);
      } else if (agora[principal] === antes[principal] && !secundarias.some((s) => agora[s] > antes[s])) {
        registrar(fases[i].numero, undefined, "progressao", `${trajeto}: a métrica do motor não cresce`);
      }
      for (const nome of naoCaem.filter((m) => agora[m] < antes[m])) {
        registrar(fases[i].numero, undefined, "progressao", `${nome} ${antes[nome]} → ${agora[nome]}: a dificuldade cai`);
      }
    }
    avaliarDificuldadePorTrilha(jogo, fases).forEach(([fase, detalhe]) => registrar(fase, undefined, "dificuldade-trilha", detalhe));
    jogos.push({ id: jogo.id, tipoMecanica: jogo.tipoMecanica, fases });
  }

  return { aprovado: falhas.length === 0, jogos, falhas };
}
