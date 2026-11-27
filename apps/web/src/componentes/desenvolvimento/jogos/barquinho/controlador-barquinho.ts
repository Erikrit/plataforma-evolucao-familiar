/**
 * Controlador do Barquinho no rio (ticket 10): guarda o estado da simulação fora do React,
 * para o laço de quadros do renderizador avançar sem re-renderizar a página a cada quadro.
 * Também mede os quadros para o teste técnico do 2D.
 */
import {
  avancarBarco,
  criarPartidaBarquinho,
  pausarBarco,
  virarBarco,
  type EstadoBarquinho,
  type FaseBarquinho,
  type Lado,
} from "./simulacao-barquinho";

/** Quadro mais longo considerado: aba escondida ou travada não faz o barco pular o rio. */
const QUADRO_MAXIMO_MS = 250;
/** Quadros mais longos que isso contam como travada perceptível (abaixo de 30 quadros/s). */
const QUADRO_TRAVADO_MS = 34;
const AMOSTRAS_MAXIMAS = 3600;

export type MedicaoQuadros = Readonly<{
  quadros: number;
  quadrosPorSegundo: number;
  p95Ms: number;
  travadasPercentual: number;
}>;

export type ControladorBarquinho = {
  readonly fase: FaseBarquinho;
  readonly movimentoReduzido: boolean;
  readonly estado: EstadoBarquinho;
  /** Avança a simulação; chamado pelo laço de quadros do renderizador. */
  passo(ms: number): void;
  virar(lado: Lado): void;
  pausar(pausado: boolean): void;
  medir(): MedicaoQuadros;
  /** Chamado uma vez quando o barco chega na margem final. */
  aoConcluir: (() => void) | null;
  /** Chamado quando o estado muda de forma relevante para a tela (aviso, faixa, folhas). */
  aoMudar: ((estado: EstadoBarquinho) => void) | null;
};

export function criarControladorBarquinho(
  fase: FaseBarquinho,
  opcoes: { movimentoReduzido: boolean },
): ControladorBarquinho {
  let estado = criarPartidaBarquinho(fase);
  let acumuladoMs = 0;
  let avisado = false;
  const amostras: number[] = [];
  const passoReduzidoMs = 1000 / fase.correnteza;

  const controlador: ControladorBarquinho = {
    fase,
    movimentoReduzido: opcoes.movimentoReduzido,
    get estado() {
      return estado;
    },
    aoConcluir: null,
    aoMudar: null,
    passo(ms) {
      const quadro = Math.min(Math.max(ms, 0), QUADRO_MAXIMO_MS);
      if (amostras.length >= AMOSTRAS_MAXIMAS) amostras.shift();
      amostras.push(ms);
      if (opcoes.movimentoReduzido) {
        // Movimento reduzido: o barco anda por linhas inteiras, sem deslizar.
        acumuladoMs += estado.pausado || estado.parado ? 0 : quadro;
        if (acumuladoMs + 1e-6 < passoReduzidoMs) return;
        acumuladoMs -= passoReduzidoMs;
        atualizar(avancarBarco(estado, fase, 1 / fase.correnteza));
      } else {
        atualizar(avancarBarco(estado, fase, quadro / 1000));
      }
    },
    virar(lado) {
      atualizar(virarBarco(estado, fase, lado));
    },
    pausar(pausado) {
      atualizar(pausarBarco(estado, pausado));
    },
    medir() {
      return medirQuadros(amostras);
    },
  };

  function atualizar(novo: EstadoBarquinho) {
    const anterior = estado;
    estado = novo;
    if (novo === anterior) return;
    const relevante =
      novo.aviso !== anterior.aviso ||
      novo.coluna !== anterior.coluna ||
      novo.parado !== anterior.parado ||
      novo.pausado !== anterior.pausado ||
      novo.folhas.length !== anterior.folhas.length ||
      Math.floor(novo.linha) !== Math.floor(anterior.linha);
    if (relevante) controlador.aoMudar?.(novo);
    if (novo.concluido && !avisado) {
      avisado = true;
      controlador.aoConcluir?.();
    }
  }

  return controlador;
}

export function medirQuadros(amostras: readonly number[]): MedicaoQuadros {
  // Descarta o primeiro quadro: inclui a montagem da cena, medida à parte.
  const validas = amostras.slice(1).filter((ms) => ms > 0);
  if (validas.length === 0) return { quadros: 0, quadrosPorSegundo: 0, p95Ms: 0, travadasPercentual: 0 };
  const total = validas.reduce((soma, ms) => soma + ms, 0);
  const ordenadas = [...validas].sort((a, b) => a - b);
  const p95 = ordenadas[Math.min(ordenadas.length - 1, Math.floor(ordenadas.length * 0.95))];
  const travadas = validas.filter((ms) => ms > QUADRO_TRAVADO_MS).length;
  return {
    quadros: validas.length,
    quadrosPorSegundo: Math.round((validas.length * 1000) / total),
    p95Ms: Math.round(p95 * 10) / 10,
    travadasPercentual: Math.round((travadas * 1000) / validas.length) / 10,
  };
}
