"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { ConteudoSequencia, FiguraSequencia } from "@/lib/api";
import estilos from "./jogos.module.css";

function Peca({ figura }: { figura: FiguraSequencia }) {
  return (
    <>
      <span className={estilos.forma} data-forma={figura.forma} data-cor={figura.cor} aria-hidden="true" />
      <span className={estilos.nomeFigura}>{figura.nome}</span>
    </>
  );
}

export function TabuleiroSequencia({
  conteudo,
  aoConcluir,
}: {
  conteudo: ConteudoSequencia;
  aoConcluir: () => void;
}) {
  const [mensagem, setMensagem] = useState("");
  const foco = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    foco.current?.focus();
  }, []);

  function escolher(figura: FiguraSequencia) {
    if (figura.id === conteudo.resposta) {
      aoConcluir();
    } else {
      setMensagem(`A peça ${figura.nome.toLowerCase()} muda o padrão. Experimente outra.`);
    }
  }

  function mostrarDica() {
    const peca = conteudo.alternativas.find((item) => item.id === conteudo.resposta);
    if (peca) setMensagem(`Para completar o padrão, escolha ${peca.nome.toLowerCase()}.`);
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text fw={600}>Qual peça falta?</Text>
        <Button variant="light" ref={foco} onClick={mostrarDica}>Dica</Button>
      </Group>
      <ol className={estilos.sequencia} role="list" aria-label="Padrão para completar">
        {conteudo.sequencia.map((figura, indice) => (
          <li key={indice} className={estilos.peca} data-lacuna={figura === null}>
            {figura ? <Peca figura={figura} /> : <span>Vazio</span>}
          </li>
        ))}
      </ol>
      <Group grow align="stretch" gap="xs" role="group" aria-label="Peças para escolher">
        {conteudo.alternativas.map((figura) => (
          <UnstyledButton key={figura.id} className={estilos.pecaAcao} onClick={() => escolher(figura)}>
            <Peca figura={figura} />
          </UnstyledButton>
        ))}
      </Group>
      <Text size="sm" role="status">{mensagem}</Text>
    </Stack>
  );
}
