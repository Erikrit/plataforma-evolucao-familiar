"use client";

import { useEffect, useRef, useState } from "react";
import { Stack, Text, UnstyledButton } from "@mantine/core";
import type { ConteudoSequencia, FiguraSequencia } from "@/lib/api";
import type { ContratoTabuleiro } from "./contrato-tabuleiro";
import { dicaSequencia } from "./dicas-jogos";
import estilos from "./jogos.module.css";

function Peca({ figura }: { figura: FiguraSequencia }) {
  return (
    <>
      <span
        className={estilos.forma}
        data-forma={figura.forma}
        data-cor={figura.cor}
        aria-hidden="true"
      />
      <span className={estilos.nomeFigura}>{figura.nome}</span>
    </>
  );
}

export function TabuleiroSequencia({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoSequencia;
} & ContratoTabuleiro) {
  const [mensagem, setMensagem] = useState("");
  const [destacada, setDestacada] = useState<string | null>(null);
  const pedidosDica = useRef(0);
  const foco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    foco.current?.focus();
  }, []);

  useEffect(() => {
    pedidosDica.current = 0;
    registrarObterDica(() => {
      pedidosDica.current += 1;
      const dica = dicaSequencia(conteudo, pedidosDica.current);
      if (!dica) return null;
      setMensagem(dica.texto);
      setDestacada(dica.destacar ?? null);
      return dica.texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, registrarObterDica]);

  function escolher(figura: FiguraSequencia) {
    if (figura.id === conteudo.resposta) {
      aoConcluir();
    } else {
      setMensagem(
        `A peça ${figura.nome.toLowerCase()} muda o padrão. Experimente outra.`,
      );
    }
  }

  return (
    <Stack gap="md" ref={foco} tabIndex={-1}>
      <Text fw={600}>Qual peça falta?</Text>
      <ol
        className={estilos.sequencia}
        role="list"
        aria-label="Padrão para completar"
      >
        {conteudo.sequencia.map((figura, indice) => (
          <li
            key={indice}
            className={estilos.peca}
            data-lacuna={figura === null}
          >
            {figura ? <Peca figura={figura} /> : <span>Vazio</span>}
          </li>
        ))}
      </ol>
      <div className={estilos.gradePecas} role="group" aria-label="Peças para escolher">
        {conteudo.alternativas.map((figura) => (
          <UnstyledButton
            key={figura.id}
            className={estilos.pecaAcao}
            onClick={() => escolher(figura)}
            data-dica={destacada === figura.id}
          >
            <Peca figura={figura} />
          </UnstyledButton>
        ))}
      </div>
      <Text size="sm" role="status">
        {mensagem}
      </Text>
    </Stack>
  );
}
