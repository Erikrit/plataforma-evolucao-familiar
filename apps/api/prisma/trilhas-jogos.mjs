/**
 * Trilhas dos jogos (DEV-CAT-P03; ADR-017 item 1): cinco fases por trilha, numeradas
 * de 1 a 15 sem mudar a chave do progresso. Os limites de idade das faixas aguardam D1.
 */
export const TRILHAS = [
  { id: "pequenos", primeira: 1, ultima: 5 },
  { id: "medios", primeira: 6, ultima: 10 },
  { id: "grandes", primeira: 11, ultima: 15 },
];

export function trilhaDaFase(numero) {
  const trilha = TRILHAS.find((item) => numero >= item.primeira && numero <= item.ultima);
  if (!trilha) throw new Error(`Fase ${numero} fora das trilhas (1 a 15).`);
  return trilha.id;
}
