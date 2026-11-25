/**
 * Contrato único dos tabuleiros de jogo (DEV-CAT-M1, ticket 08).
 * A partida não conhece a mecânica: monta o tabuleiro com o conteúdo
 * recebido do servidor, pede a dica sob demanda e recebe o aviso de conclusão.
 */

/** Calcula a dica no estado atual da partida; `null` quando não há dica útil. */
export type ObterDica = () => string | null;

export type ContratoTabuleiro = Readonly<{
  /** Chamado uma vez quando o objetivo da fase é alcançado. */
  aoConcluir: () => void;
  /**
   * Registra o cálculo da dica. A partida chama o cálculo a cada pedido,
   * para que a dica acompanhe o estado atual do tabuleiro.
   */
  registrarObterDica: (obter: ObterDica | null) => void;
}>;
