"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { ReactNode } from "react";
import { ProvedorSessao } from "@/componentes/contexto-sessao";
import { NavegacaoApp } from "@/componentes/navegacao-app";
import { temaPef } from "@/tema/mantine";

export function ProvedoresApp({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={temaPef} defaultColorScheme="light">
      <Notifications position="top-center" zIndex={4000} />
      <ProvedorSessao>
        <NavegacaoApp>{children}</NavegacaoApp>
      </ProvedorSessao>
    </MantineProvider>
  );
}
