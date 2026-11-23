"use client";

import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { GuardaContextoFamiliar } from "@/componentes/guarda-contexto-familiar";

export default function LayoutFamilia({ children }: { children: ReactNode }) {
  const params = useParams<{ slug: string }>();
  const pathname = usePathname();
  const slug = String(params.slug ?? "");
  const ePaginaPublica =
    pathname.endsWith("/entrar") || pathname.includes("/convites/ativar");

  return (
    <GuardaContextoFamiliar
      slug={slug}
      permitirEntrarSemSessao={ePaginaPublica}
    >
      {children}
    </GuardaContextoFamiliar>
  );
}
