export function selecionarDestaquesJogos(
  jogos: readonly { id: string; categoria: string }[],
  aberturas: readonly { jogoId: string; ultimaAberturaEm: Date }[],
) {
  const porJogo = new Map<string, number>();
  for (const abertura of aberturas) {
    const data = abertura.ultimaAberturaEm.getTime();
    if (data > (porJogo.get(abertura.jogoId) ?? -Infinity)) porJogo.set(abertura.jogoId, data);
  }
  const recentes = jogos
    .filter((jogo) => porJogo.has(jogo.id))
    .sort((a, b) => porJogo.get(b.id)! - porJogo.get(a.id)!);
  const novos = jogos.filter((jogo) => !porJogo.has(jogo.id));

  const destaque = new Set<string>();
  const categorias = new Set<string>();

  function incluir(jogo: { id: string; categoria: string }) {
    if (destaque.size === 3 || destaque.has(jogo.id)) return;
    destaque.add(jogo.id);
    categorias.add(jogo.categoria);
  }

  if (recentes[0]) incluir(recentes[0]);
  for (const jogo of novos) {
    if (!categorias.has(jogo.categoria)) incluir(jogo);
  }
  for (const jogo of novos) incluir(jogo);
  for (const jogo of jogos) incluir(jogo);
  return [...destaque];
}
