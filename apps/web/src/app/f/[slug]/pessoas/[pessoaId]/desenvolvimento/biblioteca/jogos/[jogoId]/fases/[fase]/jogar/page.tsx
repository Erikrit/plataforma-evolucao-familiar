"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import { CatalogoJogosAutorizado } from "@/componentes/desenvolvimento/jogos/catalogo-jogos";
import { PartidaJogo } from "@/componentes/desenvolvimento/jogos/partida-jogo";
import estilos from "@/componentes/desenvolvimento/jogos/jogos.module.css";
import { EstadoCarregando, EstadoVazio } from "@/componentes/feedback";
import { consultaCatalogoJogos } from "@/lib/filtros-jogos";

function FaseDoJogo() {
  const params = useParams<{ jogoId: string; fase: string }>();
  const { caminho } = useDesenvolvimento();
  const busca = useSearchParams();
  const catalogo =
    caminho +
    "/biblioteca/jogos" +
    consultaCatalogoJogos({
      categoria: busca.get("categoria"),
      fases: busca.get("fases"),
    });

  return (
    <div className={estilos.partida}>
      <Container size="sm">
        <CatalogoJogosAutorizado>
          {({ jogos }) => {
            const jogo = jogos.find((item) => item.id === params.jogoId);
            const fase = jogo?.fases.find(
              (item) => String(item.numero) === params.fase,
            );
            if (!jogo || !fase) {
              return <EstadoVazio titulo="Fase indisponível" />;
            }
            return (
              <PartidaJogo
                key={jogo.id + "/" + fase.numero}
                jogo={jogo}
                fase={fase}
                retorno={catalogo}
              />
            );
          }}
        </CatalogoJogosAutorizado>
      </Container>
    </div>
  );
}

export default function PaginaPartida() {
  return (
    <Suspense fallback={<EstadoCarregando rotulo="Abrindo fase…" />}>
      <FaseDoJogo />
    </Suspense>
  );
}
