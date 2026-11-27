/** Nomes curtos no catálogo; nome completo permanece para leitores de tela (UX-05). */
export const NOMES_CURTOS_JOGOS: Record<string, string> = {
  memoria: "Memória",
  sequencia: "Sequência",
  labirinto: "Labirintos",
  "pares-sombras": "Sombras",
  "ache-intruso": "Intruso",
  "palavra-figura": "Palavra",
  "historias-cenas": "Histórias",
  "entrega-jardim": "Entrega",
  "sudoku-figuras": "Sudoku",
  "forme-palavra": "Palavras",
  "menor-maior": "Números",
  "robo-setas": "Robô",
  "letra-inicial": "Letras",
  "adivinha-pista": "Pistas",
  "barquinho-rio": "Barquinho",
  "caminho-cores": "Cores",
};

export function nomeCurtoJogo(id: string, nomeCompleto: string) {
  return NOMES_CURTOS_JOGOS[id] ?? nomeCompleto;
}

export function primeiraFasePendente(
  fases: readonly { numero: number; estado: string }[],
) {
  return (
    fases.find((fase) => fase.estado !== "concluida")?.numero ??
    fases[0]?.numero ??
    null
  );
}

export function jogoComTodasFasesConcluidas(
  fases: readonly { estado: string }[],
) {
  return fases.length > 0 && fases.every((fase) => fase.estado === "concluida");
}
