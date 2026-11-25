"use client";

import { useEffect, useRef, useState } from "react";
import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { ConteudoEscolha, FiguraEscolha } from "@/lib/api";
import type { ContratoTabuleiro } from "./contrato-tabuleiro";
import estilos from "./jogos.module.css";

export function TabuleiroEscolha({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoEscolha;
} & ContratoTabuleiro) {
  const [mensagem, setMensagem] = useState("");
  const foco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    foco.current?.focus();
  }, []);

  useEffect(() => {
    registrarObterDica(() => {
      if (conteudo.dica) {
        setMensagem(conteudo.dica);
        return conteudo.dica;
      }
      const correta = conteudo.opcoes.find((item) => item.id === conteudo.resposta);
      if (!correta) return null;
      const texto = `A resposta certa é ${correta.nome.toLowerCase()}.`;
      setMensagem(texto);
      return texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, registrarObterDica]);

  function escolher(figura: FiguraEscolha) {
    if (figura.id === conteudo.resposta) {
      aoConcluir();
      return;
    }
    setMensagem(`${figura.nome} não é a resposta. Experimente outra figura.`);
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
        {conteudo.opcoes.map((figura) => (
          <UnstyledButton
            key={figura.id}
            className={estilos.pecaAcao}
            onClick={() => escolher(figura)}
            aria-label={figura.nome}
          >
            <span className={estilos.figura} aria-hidden="true">
              {figura.simbolo}
            </span>
            <span className={estilos.nomeFigura}>{figura.nome}</span>
          </UnstyledButton>
        ))}
      </Group>
      <Text size="sm" role="status">
        {mensagem}
      </Text>
    </Stack>
  );
}
