/** Rotas no espaço familiar `/f/{slug}/…` (E1-ACE-03/04). */

export function prefixoFamilia(slug: string): string {
  return `/f/${encodeURIComponent(slug)}`;
}

export function rotaFamilia(slug: string, caminho = ""): string {
  const base = prefixoFamilia(slug);
  if (!caminho || caminho === "/") return base;
  const relativo = caminho.startsWith("/") ? caminho : `/${caminho}`;
  return `${base}${relativo}`;
}

export function extrairSlugDaUrl(pathname: string): string | null {
  const m = pathname.match(/^\/f\/([^/]+)/);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

export function caminhoAposSlug(pathname: string): string {
  const m = pathname.match(/^\/f\/[^/]+(\/.*)?$/);
  if (!m) return pathname;
  return m[1] && m[1].length > 0 ? m[1] : "/";
}

export function pessoaIdDaUrl(pathname: string): string | null {
  const m = pathname.match(/\/pessoas\/([^/]+)/);
  return m?.[1] ?? null;
}
