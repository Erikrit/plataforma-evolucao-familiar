/**
 * Dicas em dois níveis (DEV-CAT-M1, ticket 09; decisão de 2026-11-26).
 * O 1º pedido orienta sem entregar a resposta; do 2º em diante, mostra a resposta
 * para a criança não travar. Funções sem dependências, testadas pelo check:e5; são puras
 * quando `sortear` é informado (a memória sorteia as cartas candidatas).
 */

type Figura = Readonly<{ id: string; nome: string; simbolo?: string }>;

export type Dica = Readonly<{ texto: string; destacar?: string | null }>;

export function dicaEscolha(
  conteudo: Readonly<{ opcoes: readonly Figura[]; resposta: string; dica?: string }>,
  nivel: number,
): Dica | null {
  const indice = conteudo.opcoes.findIndex((item) => item.id === conteudo.resposta);
  if (indice < 0) return null;
  if (nivel <= 1) {
    return {
      texto:
        conteudo.dica ??
        "Olhe cada figura com calma e compare com o que o enunciado pede.",
      destacar: null,
    };
  }
  return { texto: `A resposta é a figura ${indice + 1}.`, destacar: conteudo.resposta };
}

/**
 * Menor período que explica as peças visíveis: posições com o mesmo resto têm a
 * mesma peça, e cada resto aparece ao menos uma vez.
 */
function periodo(sequencia: readonly (Figura | null)[]): number {
  for (let p = 1; p < sequencia.length; p += 1) {
    const porResto = new Map<number, string>();
    const coerente = sequencia.every((peca, i) => {
      if (!peca) return true;
      const anterior = porResto.get(i % p);
      porResto.set(i % p, peca.id);
      return anterior == null || anterior === peca.id;
    });
    if (coerente && porResto.size === p) return p;
  }
  return sequencia.length;
}

export function dicaSequencia(
  conteudo: Readonly<{
    sequencia: readonly (Figura | null)[];
    alternativas: readonly Figura[];
    resposta: string;
  }>,
  nivel: number,
): Dica | null {
  const peca = conteudo.alternativas.find((item) => item.id === conteudo.resposta);
  if (!peca) return null;
  if (nivel <= 1) {
    const p = periodo(conteudo.sequencia);
    const lacuna = conteudo.sequencia.indexOf(null);
    const direcao = lacuna - p >= 0 ? `${p} posições antes` : `${p} posições depois`;
    return {
      texto: `O padrão se repete a cada ${p} peças. Olhe a peça que fica ${direcao} do espaço vazio.`,
      destacar: null,
    };
  }
  return {
    texto: `Para completar o padrão, escolha ${peca.nome.toLowerCase()}.`,
    destacar: peca.id,
  };
}

export type DicaMemoria = Readonly<{ texto: string; indicar: number[] }>;

export function dicaMemoria({
  cartas,
  viradas,
  encontradas,
  nivel,
  sortear = (limite: number) => Math.floor(Math.random() * limite),
}: Readonly<{
  cartas: readonly Readonly<{ id: string }>[];
  viradas: readonly number[];
  encontradas: readonly number[];
  nivel: number;
  sortear?: (limite: number) => number;
}>): DicaMemoria | null {
  const fechadas = cartas
    .map((_, indice) => indice)
    .filter((indice) => !encontradas.includes(indice));
  const primeira = viradas.length === 1 ? viradas[0] : fechadas[0];
  if (primeira == null) return null;
  const par = cartas.findIndex(
    (carta, indice) => indice !== primeira && carta.id === cartas[primeira].id,
  );
  if (par === -1) return null;

  if (nivel >= 2) {
    if (viradas.length === 1) return { texto: `Agora vire a carta ${par + 1}.`, indicar: [par] };
    return { texto: `Tente as cartas ${primeira + 1} e ${par + 1}.`, indicar: [primeira, par] };
  }
  if (viradas.length !== 1) {
    return {
      texto: `Comece pela carta ${primeira + 1} e lembre onde viu uma figura igual.`,
      indicar: [primeira],
    };
  }
  // Três candidatas, uma delas o par, sem dizer qual.
  const outras = fechadas.filter((indice) => indice !== primeira && indice !== par);
  const escolhidas: number[] = [];
  while (escolhidas.length < 2 && outras.length) {
    escolhidas.push(outras.splice(sortear(outras.length), 1)[0]);
  }
  const indicar = [par, ...escolhidas].sort((x, y) => x - y);
  return {
    texto: `O par desta carta está entre as cartas ${indicar.map((i) => i + 1).join(", ")}.`,
    indicar,
  };
}

/**
 * Ordenação (Histórias, Forme a palavra, Do menor ao maior): o 1º nível orienta
 * (ou usa a pista curada); o 2º diz a próxima peça certa.
 */
export function dicaOrdenacao(
  conteudo: Readonly<{ cenas: readonly Figura[]; ordemCorreta: readonly string[]; dica?: string }>,
  colocadas: readonly string[],
  nivel: number,
): string {
  const pecas = conteudo.cenas.every((cena) => cena.nome === cena.simbolo);
  const numeros = pecas && conteudo.cenas.every((cena) => /^\d+$/.test(cena.nome));
  if (nivel <= 1) {
    if (conteudo.dica) return conteudo.dica;
    if (numeros) return "Comece pelo menor número e vá aumentando.";
    if (pecas) return "Diga devagar o nome da figura e procure a primeira letra.";
    return "Pense no que precisa acontecer primeiro para a próxima cena ser possível.";
  }
  let certas = 0;
  while (certas < colocadas.length && colocadas[certas] === conteudo.ordemCorreta[certas]) certas += 1;
  const proxima = conteudo.cenas.find((cena) => cena.id === conteudo.ordemCorreta[certas]);
  if (!proxima) return pecas ? "A resposta já está na ordem." : "A história já está na ordem.";
  const prefixo = certas < colocadas.length ? "Desfaça as peças fora de ordem. " : "";
  if (numeros) return `${prefixo}${certas === 0 ? "O primeiro número é" : "O próximo número é"} ${proxima.nome}.`;
  if (pecas) return `${prefixo}${certas === 0 ? "A palavra começa com" : "A próxima letra é"} ${proxima.nome}.`;
  return certas === 0
    ? `${prefixo}A história começa com ${proxima.nome.toLowerCase()}.`
    : `${prefixo}A próxima cena é ${proxima.nome.toLowerCase()}.`;
}

// ---------- Sudoku de figuras (ticket 12) ----------

export type DicaSudoku = Readonly<{ texto: string; celula?: readonly [number, number] | null }>;

/** Linha, coluna ou bloco mais perto de completar; o 2º nível aponta uma casa e a figura. */
export function dicaSudoku(
  conteudo: Readonly<{
    tamanho: number;
    caixa: Readonly<{ linhas: number; colunas: number }>;
    simbolos: readonly Figura[];
    solucao: readonly (readonly number[])[];
  }>,
  atual: readonly (readonly number[])[],
  nivel: number,
): DicaSudoku | null {
  const n = conteudo.tamanho;
  const { linhas: bl, colunas: bc } = conteudo.caixa;
  const unidades: { nome: string; casas: [number, number][] }[] = [];
  for (let i = 0; i < n; i += 1) {
    unidades.push({ nome: `linha ${i + 1}`, casas: Array.from({ length: n }, (_, c) => [i, c] as [number, number]) });
  }
  for (let i = 0; i < n; i += 1) {
    unidades.push({ nome: `coluna ${i + 1}`, casas: Array.from({ length: n }, (_, l) => [l, i] as [number, number]) });
  }
  let bloco = 0;
  for (let l = 0; l < n; l += bl) {
    for (let c = 0; c < n; c += bc) {
      bloco += 1;
      const casas: [number, number][] = [];
      for (let i = l; i < l + bl; i += 1) for (let j = c; j < c + bc; j += 1) casas.push([i, j]);
      unidades.push({ nome: `bloco ${bloco}`, casas });
    }
  }
  const vazias = (u: { casas: [number, number][] }) => u.casas.filter(([l, c]) => !atual[l][c]);
  const candidatas = unidades.filter((u) => vazias(u).length > 0);
  if (!candidatas.length) return null;
  const alvo = candidatas.reduce((melhor, u) => (vazias(u).length < vazias(melhor).length ? u : melhor));
  const faltam = vazias(alvo).length;
  if (nivel <= 1) {
    return {
      texto: `Na ${alvo.nome} ${faltam === 1 ? "falta só 1 figura" : `faltam ${faltam} figuras`}. Veja quais já estão lá.`,
      celula: null,
    };
  }
  const [l, c] = vazias(alvo)[0];
  const figura = conteudo.simbolos[conteudo.solucao[l][c] - 1];
  return { texto: `Na linha ${l + 1}, coluna ${c + 1}, vai a figura ${figura.nome.toLowerCase()}.`, celula: [l, c] };
}

// ---------- Robô com setas (ticket 12) ----------

export type Direcao = "cima" | "baixo" | "esquerda" | "direita";
export type Comando = Readonly<{ direcao: Direcao; passos: number }>;
type Posicao = Readonly<{ linha: number; coluna: number }>;

export const DESLOCAMENTOS: Record<Direcao, readonly [number, number]> = {
  cima: [-1, 0],
  baixo: [1, 0],
  esquerda: [0, -1],
  direita: [0, 1],
};

/** Menor caminho do início à chegada, agrupado em comandos (direção e casas). */
export function comandosDoCaminho(mapa: readonly string[], inicio: Posicao, chegada: Posicao): Comando[] {
  const chave = (l: number, c: number) => `${l}/${c}`;
  const anterior = new Map<string, [number, number, Direcao] | null>([[chave(inicio.linha, inicio.coluna), null]]);
  const fila: [number, number][] = [[inicio.linha, inicio.coluna]];
  for (let i = 0; i < fila.length; i += 1) {
    const [l, c] = fila[i];
    if (l === chegada.linha && c === chegada.coluna) break;
    for (const [direcao, [dl, dc]] of Object.entries(DESLOCAMENTOS) as [Direcao, readonly [number, number]][]) {
      const [nl, nc] = [l + dl, c + dc];
      const celula = mapa[nl]?.[nc];
      if (!celula || celula === "#" || anterior.has(chave(nl, nc))) continue;
      anterior.set(chave(nl, nc), [l, c, direcao]);
      fila.push([nl, nc]);
    }
  }
  const direcoes: Direcao[] = [];
  for (let passo = anterior.get(chave(chegada.linha, chegada.coluna)); passo; passo = anterior.get(chave(passo[0], passo[1]))) {
    direcoes.unshift(passo[2]);
  }
  const comandos: { direcao: Direcao; passos: number }[] = [];
  for (const direcao of direcoes) {
    const ultimo = comandos[comandos.length - 1];
    if (ultimo?.direcao === direcao) ultimo.passos += 1;
    else comandos.push({ direcao, passos: 1 });
  }
  return comandos;
}

const casas = (n: number) => (n === 1 ? "1 casa" : `${n} casas`);

export function dicaRobo(
  conteudo: Readonly<{ mapa: readonly string[]; inicio: Posicao; chegada: Posicao }>,
  programa: readonly Comando[],
  nivel: number,
): string {
  const caminho = comandosDoCaminho(conteudo.mapa, conteudo.inicio, conteudo.chegada);
  let certos = 0;
  while (
    certos < programa.length &&
    certos < caminho.length &&
    programa[certos].direcao === caminho[certos].direcao &&
    programa[certos].passos === caminho[certos].passos
  ) {
    certos += 1;
  }
  if (nivel <= 1) {
    if (programa.length === 0) return "Conte quantas casas o robô anda até a primeira curva.";
    if (certos === programa.length) return "Os comandos até aqui estão certos. Pense na próxima curva.";
    return "Algum comando leva o robô por outro caminho. Confira um por um, contando as casas.";
  }
  const certo = caminho[certos];
  if (!certo) return "O programa já leva o robô até a chegada. Toque em Executar.";
  const texto = `${certo.direcao}, ${casas(certo.passos)}`;
  return certos < programa.length
    ? `Apague a partir do comando ${certos + 1}. O certo ali é: ${texto}.`
    : `Próximo comando: ${texto}.`;
}
