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

/** Mesma composição que a carga oficial publica (`prisma/carga-oficial.mjs`). */
export const CATALOGO_CARREGADO = [
  ...CATALOGO_JOGOS_PILOTO_E5,
  ...CATALOGO_JOGOS_EXPANSAO_E5,
  ...CATALOGO_JOGOS_HISTORIAS_E5,
  ...CATALOGO_JOGOS_MARCO1_E5,
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
  animais: "🐈🐶🐟🐝🐇🐦🦋🦅🪰🐢🐸🐄🐖🐑🐴🐘🦒🐒🦁🐧🦆🐌🐞🦀🐙🐳🐔🐭",
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
  escolha: { principal: "opcoes", secundarias: ["semelhanca"] },
  sequencia: { principal: "periodo", secundarias: ["comprimento", "lacunaNoMeio"] },
  // Ticket 13: Pequenos com nome, Médios sem nome, Grandes com intrusas; a pista sai nos empates.
  ordenacao: { principal: "cenas", secundarias: ["semNomes", "intrusas", "semPista"] },
  // Ticket 12: Sudoku cresce em casas vazias; Robô com setas, em curvas (comandos a planejar).
  sudoku: { principal: "vazias", secundarias: ["tamanho"] },
  robo: { principal: "curvas", secundarias: [], naoCaem: ["passos"], extras: ["decisoes"] },
};

const normalizar = (texto) =>
  texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").trim();
const palavras = (texto) => normalizar(texto).split(/\s+/).filter(Boolean);
const igualVisivel = (a, b) => a.simbolo === b.simbolo && normalizar(a.nome) === normalizar(b.nome);

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
      if (vazamentos.length) {
        const nomes = vazamentos.map((nome) => `“${nome}”`).join(", ");
        falhas.push(["rotulo", `a sombra mostra o nome do objeto (${nomes})`]);
      }
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
        if (motivos.length) falhas.push(["rotulo", motivos.join("; ")]);
        // Dica de primeiro nível não pode dizer o nome da resposta.
        if (conjunto.dica && ` ${palavras(conjunto.dica).join(" ")} `.includes(` ${palavras(correta.nome).join(" ")} `)) {
          falhas.push(["dica", `a dica entrega a resposta (“${correta.nome}”)`]);
        }
      }
      for (const opcao of opcoes) {
        const erro = conferirFigura(opcao);
        if (erro) falhas.push(["nome-figura", erro]);
      }
      const semelhanca = correta ? semelhancaComResposta(correta, opcoes.filter((o) => o !== correta)) : 0;
      return { metricas: { opcoes: opcoes.length, semelhanca }, falhas };
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
    jogos.push({ id: jogo.id, tipoMecanica: jogo.tipoMecanica, fases });
  }

  return { aprovado: falhas.length === 0, jogos, falhas };
}
