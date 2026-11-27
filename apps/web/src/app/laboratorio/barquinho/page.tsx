import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LaboratorioBarquinho } from "@/componentes/laboratorio/laboratorio-barquinho";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Laboratório 2D — Barquinho no rio",
  robots: { index: false, follow: false },
};

/**
 * Medição do 2D (DEV-CAT-M1-CONTEUDO, ticket 10; PixiJS pela ADR-018): uma fase do Barquinho
 * no rio, sem API, sem sessão e sem dados de família. Só existe com `PEF_LABORATORIO_2D=1`
 * no servidor; nas demais instalações responde "não encontrada".
 */
export default function PaginaLaboratorioBarquinho() {
  if (process.env.PEF_LABORATORIO_2D !== "1") notFound();
  return <LaboratorioBarquinho />;
}
