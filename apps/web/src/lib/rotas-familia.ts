/** Rotas no espaço familiar `/f/{slug}/…` (E1-ACE-03/04). */

const SLUGS_RESERVADOS = new Set([
  "criar",
  "entrar",
  "acessar",
  "convites",
  "pessoas",
  "gerenciar-familia",
]);

/** Aceita identificador digitado ou trecho de URL /f/{slug}. */
export function normalizarIdentificadorFamilia(valor: string): string | null {
  let bruto = valor.trim().toLowerCase();
  if (!bruto) return null;
  try {
    if (bruto.includes("://") || bruto.startsWith("/")) {
      const url = bruto.includes("://")
        ? new URL(bruto)
        : new URL(bruto, "http://local.invalid");
      bruto = url.pathname;
    }
  } catch {
    /* mantém texto bruto */
  }
  const m = bruto.match(/\/f\/([^/]+)/);
  if (m?.[1]) bruto = decodeURIComponent(m[1]);
  bruto = bruto.replace(/^\/+|\/+$/g, "");
  if (bruto.startsWith("f/")) bruto = bruto.slice(2);
  const slug = bruto.split("/")[0]?.trim() ?? "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  if (SLUGS_RESERVADOS.has(slug)) return null;
  return slug;
}

export function ehSlugReservadoNaUi(slug: string): boolean {
  return SLUGS_RESERVADOS.has(slug.trim().toLowerCase());
}

export function prefixoFamilia(slug: string): string {
  return `/f/${encodeURIComponent(slug)}`;
}

export function rotaFamilia(slug: string, caminho = ""): string {
  const base = prefixoFamilia(slug);
  if (!caminho || caminho === "/") return base;
  const relativo = caminho.startsWith("/") ? caminho : `/${caminho}`;
  return `${base}${relativo}`;
}

/** Origem confiável do ambiente (browser); sem fixar localhost em código. */
export function origemDoApp(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function urlAbsolutaDoApp(caminho: string): string {
  const origem = origemDoApp();
  if (!origem) return caminho;
  return `${origem}${caminho.startsWith("/") ? caminho : `/${caminho}`}`;
}

export function caminhoAtivacaoConvite(
  slug: string | null | undefined,
  token: string,
): string {
  const consulta = `token=${encodeURIComponent(token)}`;
  if (slug) return rotaFamilia(slug, `/convites/ativar?${consulta}`);
  return `/convites/ativar?${consulta}`;
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

/** Retorno da partida vai ao catálogo (tela final de escolha), não à URL legada do jogo. */
export function rotaRetornoPartida(pathname: string): string | null {
  const partida = pathname.match(
    /^(\/f\/[^/]+\/pessoas\/[^/]+\/desenvolvimento\/biblioteca\/jogos)\/[^/]+\/fases\/[^/]+\/jogar\/?$/,
  );
  return partida?.[1] ?? null;
}
