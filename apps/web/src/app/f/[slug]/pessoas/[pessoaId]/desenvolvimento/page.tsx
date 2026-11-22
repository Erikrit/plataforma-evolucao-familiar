import { redirect } from "next/navigation";
import { rotaFamilia } from "@/lib/rotas-familia";

export default async function Desenvolvimento({ params, searchParams }: {
  params: Promise<{ slug: string; pessoaId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug, pessoaId } = await params;
  const busca = new URLSearchParams();
  for (const [nome, valor] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(valor) ? valor : valor ? [valor] : []) busca.append(nome, item);
  }
  redirect(rotaFamilia(slug, "/pessoas/" + encodeURIComponent(pessoaId) + "/desenvolvimento/biblioteca") + (busca.size ? "?" + busca : ""));
}
