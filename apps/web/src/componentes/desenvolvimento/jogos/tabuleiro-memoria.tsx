"use client";

import { useEffect, useRef, useState } from "react";
import { Stack, Text, UnstyledButton } from "@mantine/core";
import type { FiguraMemoria } from "@/lib/api";
import type { ContratoTabuleiro } from "./contrato-tabuleiro";
import { dicaMemoria } from "./dicas-jogos";
import { Figura } from "./figura";
import estilos from "./jogos.module.css";

export function TabuleiroMemoria({
  cartas,
  aoConcluir,
  registrarObterDica,
}: {
  cartas: readonly FiguraMemoria[];
} & ContratoTabuleiro) {
  const [viradas, setViradas] = useState<number[]>([]);
  const [encontradas, setEncontradas] = useState<number[]>([]);
  const [dica, setDica] = useState<number[]>([]);
  const primeiraCarta = useRef<HTMLButtonElement>(null);
  const estado = useRef({ viradas, encontradas });
  // Nível da dica: volta ao 1º sempre que o tabuleiro muda (ticket 09).
  const pedidosDica = useRef({ chave: "", nivel: 0 });
  estado.current = { viradas, encontradas };

  useEffect(() => {
    primeiraCarta.current?.focus();
  }, []);

  useEffect(() => {
    registrarObterDica(() => {
      const { viradas: abertas, encontradas: pares } = estado.current;
      const chave = `${abertas.join(",")}|${pares.length}`;
      const pedidos = pedidosDica.current;
      pedidos.nivel = pedidos.chave === chave ? pedidos.nivel + 1 : 1;
      pedidos.chave = chave;
      if (abertas.length === 2) setViradas([]);
      const dicaAtual = dicaMemoria({
        cartas,
        viradas: abertas.length === 1 ? abertas : [],
        encontradas: pares,
        nivel: pedidos.nivel,
      });
      if (!dicaAtual) return null;
      setDica(dicaAtual.indicar);
      return dicaAtual.texto;
    });
    return () => registrarObterDica(null);
  }, [cartas, registrarObterDica]);

  function virar(indice: number) {
    if (encontradas.includes(indice) || viradas.includes(indice)) return;

    const anterior = viradas.length === 1 ? viradas[0] : undefined;
    if (anterior === undefined) {
      setViradas([indice]);
      setDica((cartasIndicadas) =>
        cartasIndicadas.includes(indice)
          ? cartasIndicadas.filter((indicada) => indicada !== indice)
          : [],
      );
      return;
    }
    setDica([]);
    if (cartas[anterior].id !== cartas[indice].id) {
      setViradas([anterior, indice]);
      return;
    }
    const pares = [...encontradas, anterior, indice];
    setViradas([]);
    setEncontradas(pares);
    if (pares.length === cartas.length) aoConcluir();
  }

  return (
    <Stack gap="md">
      <Text size="sm" fw={600} aria-live="polite">
        Pares encontrados: {encontradas.length / 2} de {cartas.length / 2}
      </Text>
      <div
        className={estilos.cartas}
        data-colunas={cartas.length <= 4 ? 2 : cartas.length === 6 ? 3 : 4}
        role="group"
        aria-label="Cartas da memória"
      >
        {cartas.map((figura, indice) => {
          const encontrada = encontradas.includes(indice);
          const visivel = encontrada || viradas.includes(indice);
          const numero = indice + 1;
          return (
            <UnstyledButton
              key={indice}
              ref={indice === 0 ? primeiraCarta : undefined}
              className={estilos.carta}
              onClick={() => virar(indice)}
              aria-disabled={visivel}
              aria-label={`Carta ${numero}, ${visivel ? figura.nome : "virada para baixo"}${encontrada ? ", par encontrado" : ""}`}
              data-estado={encontrada ? "par" : visivel ? "virada" : "fechada"}
              data-dica={dica.includes(indice)}
            >
              {visivel ? (
                <>
                  <span
                    className={estilos.figura}
                    data-face={figura.face ?? "objeto"}
                    aria-hidden="true"
                  >
                    <Figura simbolo={figura.simbolo} />
                  </span>
                  <span className={estilos.nomeFigura}>{figura.nome}</span>
                </>
              ) : (
                <span className={estilos.numeroCarta}>{numero}</span>
              )}
            </UnstyledButton>
          );
        })}
      </div>
      {viradas.length === 2 ? (
        <Text size="sm" role="status">
          Essas figuras são diferentes. Escolha outra carta para continuar.
        </Text>
      ) : null}
    </Stack>
  );
}
