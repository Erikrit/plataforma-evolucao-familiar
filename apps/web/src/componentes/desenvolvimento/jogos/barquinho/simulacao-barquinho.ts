/**
 * Simulação do Barquinho no rio (DEV-CAT-M1-CONTEUDO, ticket 10), sem biblioteca 2D.
 * Sem tempo, sem vidas e sem perder (M03 §15): a pedra só desvia o barco e,
 * sem saída à frente, o barco espera a criança virar. Funções puras, testadas pelo check:e5.
 *
 * O rio é uma grade de cima (partida) para baixo (margem final):
 * `#` margem, `.` água, `o` pedra, `f` folha e `B` o barco na primeira linha.
 */

export type FaseBarquinho = Readonly<{
  rio: readonly string[];
  /** Velocidade da correnteza, em linhas por segundo. */
  correnteza: number;
}>;

export type EstadoBarquinho = Readonly<{
  /** Progresso contínuo rio abaixo, em linhas. */
  linha: number;
  /** Faixa em que o barco está. */
  coluna: number;
  folhas: readonly string[];
  desvios: number;
  pausado: boolean;
  /** Caminho fechado à frente: o barco espera a criança virar. */
  parado: boolean;
  concluido: boolean;
  /** Último acontecimento, para o leitor de tela. */
  aviso: string | null;
}>;

export type Lado = -1 | 1;
export type DicaBarquinho = Readonly<{ texto: string; lado: Lado | 0 }>;

const NOME_LADO: Record<Lado, string> = { [-1]: "a esquerda", 1: "a direita" };
const MARGEM_ERRO = 1e-9;

function celula(fase: FaseBarquinho, linha: number, coluna: number) {
  return fase.rio[linha]?.[coluna];
}

export function aguaLivre(fase: FaseBarquinho, linha: number, coluna: number) {
  const valor = celula(fase, linha, coluna);
  return valor === "." || valor === "f" || valor === "B";
}

export function ultimaLinha(fase: FaseBarquinho) {
  return fase.rio.length - 1;
}

export function totalFolhas(fase: FaseBarquinho) {
  return fase.rio.reduce((total, linha) => total + [...linha].filter((c) => c === "f").length, 0);
}

function chave(linha: number, coluna: number) {
  return `${linha}/${coluna}`;
}

function pegarFolha(estado: EstadoBarquinho, fase: FaseBarquinho, linha: number, coluna: number) {
  if (celula(fase, linha, coluna) !== "f" || estado.folhas.includes(chave(linha, coluna))) return estado;
  const folhas = [...estado.folhas, chave(linha, coluna)];
  return { ...estado, folhas, aviso: `Folha pega (${folhas.length} de ${totalFolhas(fase)}).` };
}

export function criarPartidaBarquinho(fase: FaseBarquinho): EstadoBarquinho {
  const coluna = fase.rio[0].indexOf("B");
  if (coluna < 0) throw new Error("O rio precisa do barco (B) na primeira linha.");
  return {
    linha: 0,
    coluna,
    folhas: [],
    desvios: 0,
    pausado: false,
    parado: false,
    concluido: false,
    aviso: null,
  };
}

/**
 * Primeiro movimento de uma rota até a margem final (busca em largura; seguir em frente
 * tem prioridade, então a rota adia as viradas até perto da pedra).
 * `null` quando não há rota.
 */
function rotaAteChegada(fase: FaseBarquinho, linha: number, coluna: number) {
  type No = { linha: number; coluna: number; primeiraVirada: Lado | 0 };
  if (!aguaLivre(fase, linha, coluna)) return null;
  const fila: No[] = [{ linha, coluna, primeiraVirada: 0 }];
  const visitados = new Set([chave(linha, coluna)]);
  for (let i = 0; i < fila.length; i += 1) {
    const no = fila[i];
    if (no.linha === ultimaLinha(fase)) return no;
    const vizinhos: [number, number, Lado | 0][] = [
      [no.linha + 1, no.coluna, 0],
      [no.linha, no.coluna - 1, -1],
      [no.linha, no.coluna + 1, 1],
    ];
    for (const [l, c, lado] of vizinhos) {
      if (!aguaLivre(fase, l, c) || visitados.has(chave(l, c))) continue;
      visitados.add(chave(l, c));
      fila.push({ linha: l, coluna: c, primeiraVirada: no.primeiraVirada || lado });
    }
  }
  return null;
}

export function existeRotaBarquinho(fase: FaseBarquinho) {
  const inicio = criarPartidaBarquinho(fase);
  return rotaAteChegada(fase, inicio.linha, inicio.coluna) != null;
}

/** Dica no estado atual: a direção livre mais próxima no caminho até a margem final. */
export function dicaBarquinho(estado: EstadoBarquinho, fase: FaseBarquinho): DicaBarquinho | null {
  if (estado.concluido) return null;
  const rota = rotaAteChegada(fase, Math.floor(estado.linha + MARGEM_ERRO), estado.coluna);
  if (!rota) return null;
  if (rota.primeiraVirada === 0) {
    return { texto: "Siga em frente: o caminho até a margem está livre.", lado: 0 };
  }
  return {
    texto: `Vire para ${NOME_LADO[rota.primeiraVirada]} para passar pelas pedras.`,
    lado: rota.primeiraVirada,
  };
}

/** Faixa vizinha para onde a pedra empurra o barco; prefere a que ainda leva à margem final. */
function faixaDeDesvio(fase: FaseBarquinho, linha: number, coluna: number) {
  const candidatas = ([-1, 1] as const)
    .map((lado) => coluna + lado)
    .filter((c) => aguaLivre(fase, linha, c) && aguaLivre(fase, linha + 1, c));
  return candidatas.find((c) => rotaAteChegada(fase, linha + 1, c)) ?? candidatas[0] ?? null;
}

export function avancarBarco(
  estado: EstadoBarquinho,
  fase: FaseBarquinho,
  segundos: number,
): EstadoBarquinho {
  if (estado.pausado || estado.concluido || estado.parado || segundos <= 0) return estado;
  let atual = estado;
  let alvo = estado.linha + fase.correnteza * segundos;
  // Processa linha a linha: um passo grande dá o mesmo resultado que vários pequenos.
  for (;;) {
    const linhaAtual = Math.floor(atual.linha + MARGEM_ERRO);
    const proxima = linhaAtual + 1;
    if (alvo + MARGEM_ERRO < proxima) return { ...atual, linha: alvo };
    if (!aguaLivre(fase, proxima, atual.coluna)) {
      const desvio = faixaDeDesvio(fase, linhaAtual, atual.coluna);
      if (desvio == null) {
        const saida = dicaBarquinho({ ...atual, linha: linhaAtual }, fase);
        return {
          ...atual,
          linha: linhaAtual,
          parado: true,
          aviso: saida && saida.lado !== 0
            ? `Caminho fechado à frente. Vire para ${NOME_LADO[saida.lado]}.`
            : "Caminho fechado à frente. Vire o barco.",
        };
      }
      const lado: Lado = desvio < atual.coluna ? -1 : 1;
      atual = {
        ...atual,
        coluna: desvio,
        desvios: atual.desvios + 1,
        aviso: `A pedra desviou o barco para ${NOME_LADO[lado]}.`,
      };
    }
    atual = pegarFolha({ ...atual, linha: proxima }, fase, proxima, atual.coluna);
    if (proxima >= ultimaLinha(fase)) {
      return { ...atual, linha: ultimaLinha(fase), concluido: true, aviso: "Chegou na margem!" };
    }
    alvo = Math.max(alvo, proxima);
  }
}

export function virarBarco(estado: EstadoBarquinho, fase: FaseBarquinho, lado: Lado): EstadoBarquinho {
  if (estado.concluido) return estado;
  const linha = Math.floor(estado.linha + MARGEM_ERRO);
  const coluna = estado.coluna + lado;
  if (!aguaLivre(fase, linha, coluna)) {
    const motivo = celula(fase, linha, coluna) === "o" ? "Uma pedra" : "A margem";
    return { ...estado, aviso: `${motivo} está desse lado.` };
  }
  return pegarFolha({ ...estado, coluna, parado: false, aviso: null }, fase, linha, coluna);
}

export function pausarBarco(estado: EstadoBarquinho, pausado: boolean): EstadoBarquinho {
  return { ...estado, pausado, aviso: pausado ? "Barco parado." : "Barco seguindo." };
}

/** O que há em volta do barco, em texto, para o leitor de tela. */
export function descreverArredores(estado: EstadoBarquinho, fase: FaseBarquinho) {
  const linha = Math.floor(estado.linha + MARGEM_ERRO);
  const nome = (l: number, c: number) => {
    const valor = celula(fase, l, c);
    if (valor === "o") return "pedra";
    if (valor === "#" || valor == null) return "margem";
    return valor === "f" && !estado.folhas.includes(chave(l, c)) ? "folha" : "água";
  };
  return `À frente: ${nome(linha + 1, estado.coluna)}. Esquerda: ${nome(linha, estado.coluna - 1)}. Direita: ${nome(linha, estado.coluna + 1)}.`;
}
