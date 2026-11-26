import { redirect } from "next/navigation";
import { consultaCatalogoJogos } from "@/lib/filtros-jogos";
import { rotaFamilia } from "@/lib/rotas-familia";

/** URL legada da tela intermediária de fases → catálogo final. */
export default async function PaginaJogoLegada({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; pessoaId: string; jogoId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug, pessoaId } = await params;
  const busca = await searchParams;
  const categoria = Array.isArray(busca.categoria)
    ? busca.categoria[0]
    : busca.categoria;
  const fases = Array.isArray(busca.fases) ? busca.fases[0] : busca.fases;
  const faixa = Array.isArray(busca.faixa) ? busca.faixa[0] : busca.faixa;
  redirect(
    rotaFamilia(
      slug,
      `/pessoas/${encodeURIComponent(pessoaId)}/desenvolvimento/biblioteca/jogos`,
    ) + consultaCatalogoJogos({ categoria, fases, faixa }),
  );
}
