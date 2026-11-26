"use client";

import { useEffect, useRef, useState } from "react";
import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { ConteudoEscolha, FiguraEscolha } from "@/lib/api";
import type { ContratoTabuleiro } from "./contrato-tabuleiro";
import { dicaEscolha } from "./dicas-jogos";
import estilos from "./jogos.module.css";

export function TabuleiroEscolha({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoEscolha;
} & ContratoTabuleiro) {
  const [mensagem, setMensagem] = useState("");
  const [destacada, setDestacada] = useState<string | null>(null);
  const [acertou, setAcertou] = useState(false);
  const pedidosDica = useRef(0);
  const foco = useRef<HTMLDivElement>(null);
  // Em Palavra e figura o nome entrega a resposta: só aparece depois do acerto.
  const mostrarNomes = !conteudo.ocultarNomes || acertou;

  useEffect(() => {
    foco.current?.focus();
  }, []);

  useEffect(() => {
    pedidosDica.current = 0;
    registrarObterDica(() => {
      pedidosDica.current += 1;
      const dica = dicaEscolha(conteudo, pedidosDica.current);
      if (!dica) return null;
      setMensagem(dica.texto);
      setDestacada(dica.destacar ?? null);
      return dica.texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, registrarObterDica]);

  function escolher(figura: FiguraEscolha) {
    if (figura.id === conteudo.resposta) {
      setAcertou(true);
      aoConcluir();
      return;
    }
    setMensagem(
      mostrarNomes
        ? `${figura.nome} não é a resposta. Experimente outra figura.`
        : "Essa não é a figura. Experimente outra.",
    );
  }

  return (
    <Stack gap="md" ref={foco} tabIndex={-1}>
      <Text fw={600} size="lg">
        {conteudo.enunciado}
      </Text>
      <Group
        grow
        align="stretch"
        gap="xs"
        role="group"
        aria-label="Opções para escolher"
      >
        {conteudo.opcoes.map((figura, indice) => (
          <UnstyledButton
            key={figura.id}
            className={estilos.pecaAcao}
            onClick={() => escolher(figura)}
            aria-label={mostrarNomes ? figura.nome : `Figura ${indice + 1}`}
            data-dica={destacada === figura.id}
          >
            <span className={estilos.figura} aria-hidden="true">
              {figura.simbolo}
            </span>
            {mostrarNomes ? (
              <span className={estilos.nomeFigura}>{figura.nome}</span>
            ) : null}
          </UnstyledButton>
        ))}
      </Group>
      <Text size="sm" role="status">
        {mensagem}
      </Text>
    </Stack>
  );
}
