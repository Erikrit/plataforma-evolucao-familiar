"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { GuardaDesenvolvimento } from "@/componentes/contexto-desenvolvimento";

export default function LayoutDesenvolvimento({ children }: { children: ReactNode }) {
  const { slug, pessoaId } = useParams<{ slug: string; pessoaId: string }>();
  return (
    <GuardaDesenvolvimento slug={slug} pessoaId={pessoaId}>
      {children}
    </GuardaDesenvolvimento>
  );
}
