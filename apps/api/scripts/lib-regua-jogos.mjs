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

/** Mesma composição que a carga oficial publica (`prisma/carga-oficial.mjs`). */
export const CATALOGO_CARREGADO = [
  ...CATALOGO_JOGOS_PILOTO_E5,
  ...CATALOGO_JOGOS_EXPANSAO_E5,
  ...CATALOGO_JOGOS_HISTORIAS_E5,
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
  "🔵": ["circulo"], "🟢": ["circulo"], "🟥": ["quadrado"], "🔺": ["triangulo"], "🔻": ["triangulo"],
};

const NOME_FORMA = { circulo: "circulo", quadrado: "quadrado", triangulo: "triangulo", losango: "losango" };

/** Métrica principal (tem de crescer) e secundárias (o empate passa se uma delas cresce). */
const METRICAS = {
  labirinto: { principal: "passos", secundarias: ["juncoes", "becos"] },
  memoria: { principal: "pares", secundarias: [] },
  escolha: { principal: "opcoes", secundarias: [] },
  sequencia: { principal: "periodo", secundarias: ["comprimento", "lacunaNoMeio"] },
  ordenacao: { principal: "cenas", secundarias: [] },
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

/** Menor percurso que passa por todos os pontos P (qualquer ordem) e termina em F. */
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
  const origem = [inicio[0], inicio[1], marca(inicio[0], inicio[1], 0), 0];
  const fila = [origem];
  const vistos = new Set([origem.slice(0, 3).join("/")]);
  for (let i = 0; i < fila.length; i += 1) {
    const [l, c, m, passos] = fila[i];
    if (l === chegada[0] && c === chegada[1] && m === todos) return passos;
    for (const [dl, dc] of VIZINHOS) {
      const [nl, nc] = [l + dl, c + dc];
      if (!aberta(mapa, nl, nc)) continue;
      const nm = marca(nl, nc, m);
      const chave = `${nl}/${nc}/${nm}`;
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      fila.push([nl, nc, nm, passos + 1]);
    }
  }
  return null;
}

function avaliarMapa(mapa) {
  let juncoes = 0;
  let becos = 0;
  mapa.forEach((linha, l) =>
    [...linha].forEach((celula, c) => {
      if (celula === "#") return;
      const saidas = VIZINHOS.filter(([dl, dc]) => aberta(mapa, l + dl, c + dc)).length;
      if (saidas >= 3) juncoes += 1;
      if (saidas === 1 && celula !== "I" && celula !== "F") becos += 1;
    }),
  );
  const passos = menorPercurso(mapa);
  return {
    metricas: { passos: passos ?? 0, juncoes, becos },
    falhas: passos == null ? [["solucao", "sem caminho do início à chegada passando pelos pontos"]] : [],
  };
}

const espelhoHorizontal = (mapa) => mapa.map((linha) => [...linha].reverse().join(""));
const espelhoVertical = (mapa) => [...mapa].reverse();

// ---------- Por motor: variantes, métricas e falhas ----------

const MOTORES = {
  labirinto: {
    variantes: (config) => config.mapas ?? [],
    avaliar: (mapa) => avaliarMapa(mapa),
    chave: (mapa) => mapa.join("/"),
    espelhos: (mapa) => [espelhoHorizontal(mapa), espelhoVertical(mapa)].map((m) => m.join("/")),
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
      return { metricas: { pares: contagem.size }, falhas };
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
        if (normalizar(conjunto.enunciado) === normalizar(correta.nome)) motivos.push("o nome da resposta repete o enunciado");
        const nomes = opcoes.map((opcao) => normalizar(opcao.nome));
        const vezes = (nome) => nomes.filter((n) => n === nome).length;
        const distratoras = opcoes.filter((opcao) => opcao !== correta).map((opcao) => normalizar(opcao.nome));
        if (vezes(normalizar(correta.nome)) === 1 && distratoras.every((nome) => vezes(nome) >= 2)) {
          motivos.push(`só a resposta tem nome diferente (“${correta.nome}”)`);
        }
        if (motivos.length) falhas.push(["rotulo", motivos.join("; ")]);
      }
      for (const opcao of opcoes) {
        const erro = conferirFigura(opcao);
        if (erro) falhas.push(["nome-figura", erro]);
      }
      return { metricas: { opcoes: opcoes.length }, falhas };
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
      if (cenas.length < 2 || new Set(cenas.map((cena) => cena.id)).size !== cenas.length) {
        falhas.push(["solucao", "cenas insuficientes ou com ids repetidos"]);
      }
      if (cenas.some((cena, i) => cenas.some((outra, j) => j > i && igualVisivel(cena, outra)))) {
        falhas.push(["resposta-unica", "duas cenas iguais admitem mais de uma ordem"]);
      }
      for (const cena of cenas) {
        const erro = conferirFigura(cena);
        if (erro) falhas.push(["nome-figura", erro]);
      }
      return { metricas: { cenas: cenas.length }, falhas };
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
    const { principal, secundarias } = METRICAS[jogo.tipoMecanica];
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
      for (const nome of [principal, ...secundarias]) {
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
    }
    jogos.push({ id: jogo.id, tipoMecanica: jogo.tipoMecanica, fases });
  }

  return { aprovado: falhas.length === 0, jogos, falhas };
}
