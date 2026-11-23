"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessao } from "@/componentes/contexto-sessao";
import { EstadoCarregando } from "@/componentes/feedback";
import { rotaFamilia } from "@/lib/rotas-familia";

/** Rotas antigas sem /f/{slug}: redireciona ao contexto da sessão ou à orientação. */
export function RedirecionarRotaLegada() {
  const pathname = usePathname();
  const router = useRouter();
  const { pronto, usuario } = useSessao();

  useEffect(() => {
    if (!pronto) return;
    const slug = usuario?.familia?.slug;
    if (slug) {
      const destino =
        pathname === "/" || pathname === ""
          ? rotaFamilia(slug, "/")
          : rotaFamilia(slug, pathname);
      router.replace(destino + window.location.search + window.location.hash);
      return;
    }
    if (pathname !== "/") {
      router.replace("/");
    }
  }, [pronto, usuario, pathname, router]);

  return <EstadoCarregando rotulo="Abrindo contexto familiar…" />;
}
