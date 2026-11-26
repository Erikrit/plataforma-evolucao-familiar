/**
 * Ilustrações Twemoji (D3, 2026-11-26): SVGs servidos pela plataforma em
 * /figuras/twemoji/<código>.svg. Origem e licença em public/figuras/twemoji/ORIGEM.md.
 * Lista gerada a partir dos arquivos baixados (DEV-CAT-M1, ticket 10).
 */
export const VERSAO_TWEMOJI = "17.0.3";

const DISPONIVEIS = new Set<string>(["1f308","1f319","1f327","1f32c","1f331","1f333","1f335","1f336","1f337","1f338","1f33b","1f33d","1f343","1f344","1f347","1f349","1f34a","1f34b","1f34c","1f34d","1f34e","1f350","1f351","1f352","1f353","1f357","1f35e","1f36a","1f36f","1f37d","1f382","1f388","1f389","1f392","1f3b2","1f3c0","1f3d7","1f3e0","1f3eb","1f407","1f408","1f40c","1f411","1f412","1f414","1f416","1f418","1f419","1f41c","1f41d","1f41f","1f423","1f426","1f427","1f42b","1f42d","1f433","1f438","1f43f","1f455","1f45f","1f48c","1f4a7","1f4c4","1f4ca","1f4cf","1f4d2","1f4d6","1f4d8","1f4ee","1f511","1f512","1f522","1f524","1f525","1f56f","1f58d","1f60b","1f680","1f681","1f682","1f68c","1f697","1f69a","1f69c","1f6aa","1f6b2","1f6b6","1f6bf","1f6cf","1f6f4","1f6f5","1f916","1f954","1f955","1f95a","1f95d","1f963","1f965","1f966","1f96a","1f96d","1f980","1f981","1f986","1f988","1f989","1f9a9","1f9c0","1f9e0","1f9e2","1f9e6","1f9ed","1f9f5","1f9f8","1f9fa","1f9fc","1f9fd","1fa74","1fa81","1fa91","1faa3","1faa5","1fab4","23f0","2600","2601","2602","2604","2615","26a1","26bd","26f5","2702","2708","270f","2744","2b50"]);

/** Código do arquivo Twemoji: pontos de código em hexadecimal, sem FE0F fora de sequências com ZWJ. */
export function codigoTwemoji(simbolo: string): string {
  const pontos = [...simbolo].map((c) => c.codePointAt(0)!.toString(16));
  return (pontos.includes("200d") ? pontos : pontos.filter((p) => p !== "fe0f")).join("-");
}

/** Caminho do SVG local, ou null se a figura não estiver no conjunto (usa o emoji do aparelho). */
export function caminhoFigura(simbolo: string): string | null {
  const codigo = codigoTwemoji(simbolo);
  return DISPONIVEIS.has(codigo) ? `/figuras/twemoji/${codigo}.svg` : null;
}

export const CREDITO_TWEMOJI = "Ilustrações: Twemoji, © Twitter, Inc. e colaboradores, licença CC-BY 4.0.";
