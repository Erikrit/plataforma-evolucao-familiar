import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { ProvedoresApp } from "@/componentes/provedores-app";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plataforma de Evolução Familiar",
  description: "Acompanhamento familiar simples e acolhedor",
};

export default function LayoutRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <ProvedoresApp>{children}</ProvedoresApp>
      </body>
    </html>
  );
}
