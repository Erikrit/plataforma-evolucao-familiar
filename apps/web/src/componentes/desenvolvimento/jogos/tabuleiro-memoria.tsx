"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { FiguraMemoria } from "@/lib/api";
import estilos from "./jogos.module.css";

export function TabuleiroMemoria({
  cartas,
  aoConcluir,
}: {
  cartas: readonly FiguraMemoria[];
  aoConcluir: () => void;
}) {
  const [viradas, setViradas] = useState<number[]>([]);
  const [encontradas, setEncontradas] = useState<number[]>([]);
  const [dica, setDica] = useState<number[]>([]);
  const primeiraCarta = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    primeiraCarta.current?.focus();
  }, []);

  function virar(indice: number) {
    if (encontradas.includes(indice) || viradas.includes(indice)) return;

    const anterior = viradas.length === 1 ? viradas[0] : undefined;
    if (anterior === undefined) {
      setViradas([indice]);
      setDica((cartasIndicadas) => cartasIndicadas.includes(indice)
        ? cartasIndicadas.filter((indicada) => indicada !== indice)
        : []);
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

  function mostrarDica() {
    const primeira = viradas.length === 1
      ? viradas[0]
      : cartas.findIndex((_, indice) => !encontradas.includes(indice));
    if (primeira === -1) return;
    const par = cartas.findIndex((carta, indice) => indice !== primeira && carta.id === cartas[primeira].id);
    if (par === -1) return;
    if (viradas.length === 2) setViradas([]);
    setDica(viradas.length === 1 ? [par] : [primeira, par]);
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" fw={600} aria-live="polite">
          Pares encontrados: {encontradas.length / 2} de {cartas.length / 2}
        </Text>
        <Button variant="light" onClick={mostrarDica}>Dica</Button>
      </Group>
      <div role="status">
        {dica.length === 2 ? <Text size="sm">Tente as cartas {dica[0] + 1} e {dica[1] + 1}.</Text> : null}
        {dica.length === 1 ? <Text size="sm">Agora vire a carta {dica[0] + 1}.</Text> : null}
      </div>
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
                  <span className={estilos.figura} aria-hidden="true">{figura.simbolo}</span>
                  <span className={estilos.nomeFigura}>{figura.nome}</span>
                </>
              ) : <span className={estilos.numeroCarta}>{numero}</span>}
            </UnstyledButton>
          );
        })}
      </div>
      {viradas.length === 2 ? (
        <Text size="sm" role="status">Essas figuras são diferentes. Escolha outra carta para continuar.</Text>
      ) : null}
    </Stack>
  );
}
