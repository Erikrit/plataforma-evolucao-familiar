"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { ConteudoSudoku } from "@/lib/api";
import type { ContratoTabuleiro } from "./contrato-tabuleiro";
import { dicaSudoku } from "./dicas-jogos";
import estilos from "./jogos.module.css";

/**
 * Sudoku de figuras (DEV-CAT-M1, ticket 12): cada figura aparece uma vez em cada
 * linha, coluna e bloco. Toque numa casa vazia e depois na figura.
 */
export function TabuleiroSudoku({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoSudoku;
} & ContratoTabuleiro) {
  const n = conteudo.tamanho;
  const [grade, setGrade] = useState(() => conteudo.inicial.map((linha) => [...linha]));
  const [selecionada, setSelecionada] = useState<[number, number] | null>(null);
  const [destacada, setDestacada] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const concluiu = useRef(false);
  const gradeAtual = useRef(grade);
  gradeAtual.current = grade;
  const pedidosDica = useRef({ chave: "", nivel: 0 });
  const foco = useRef<HTMLDivElement>(null);
  const dada = (l: number, c: number) => conteudo.inicial[l][c] !== 0;

  useEffect(() => {
    foco.current?.focus();
  }, []);

  useEffect(() => {
    registrarObterDica(() => {
      const chave = JSON.stringify(gradeAtual.current);
      const pedidos = pedidosDica.current;
      pedidos.nivel = pedidos.chave === chave ? pedidos.nivel + 1 : 1;
      pedidos.chave = chave;
      const dica = dicaSudoku(conteudo, gradeAtual.current, pedidos.nivel);
      if (!dica) return null;
      setMensagem(dica.texto);
      setDestacada(dica.celula ? `${dica.celula[0]}/${dica.celula[1]}` : null);
      if (dica.celula) setSelecionada([dica.celula[0], dica.celula[1]]);
      return dica.texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, registrarObterDica]);

  function colocar(valor: number) {
    if (concluiu.current || !selecionada) {
      if (!selecionada) setMensagem("Escolha primeiro uma casa vazia.");
      return;
    }
    const [l, c] = selecionada;
    if (dada(l, c)) return;
    const nova = grade.map((linha) => [...linha]);
    nova[l][c] = valor;
    setGrade(nova);
    setDestacada(null);
    if (nova.some((linha) => linha.some((v) => v === 0))) {
      setMensagem("");
      return;
    }
    if (nova.every((linha, i) => linha.every((v, j) => v === conteudo.solucao[i][j]))) {
      concluiu.current = true;
      aoConcluir();
      return;
    }
    setMensagem("Alguma figura se repete numa linha, coluna ou bloco. Troque e tente de novo.");
  }

  const nomeCasa = (l: number, c: number) => {
    const v = grade[l][c];
    return `Linha ${l + 1}, coluna ${c + 1}: ${v ? conteudo.simbolos[v - 1].nome : "vazia"}${dada(l, c) ? ", fixa" : ""}`;
  };

  return (
    <Stack gap="md" ref={foco} tabIndex={-1}>
      <Text fw={600}>Cada figura aparece uma vez em cada linha, coluna e bloco.</Text>
      <div
        className={estilos.sudoku}
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        role="grid"
        aria-label={`Sudoku ${n} por ${n}`}
      >
        {grade.map((linha, l) =>
          linha.map((v, c) => (
            <UnstyledButton
              key={`${l}/${c}`}
              className={estilos.casaSudoku}
              role="gridcell"
              aria-label={nomeCasa(l, c)}
              aria-pressed={selecionada?.[0] === l && selecionada?.[1] === c}
              data-dada={dada(l, c)}
              data-dica={destacada === `${l}/${c}`}
              data-borda-direita={(c + 1) % conteudo.caixa.colunas === 0 && c + 1 < n}
              data-borda-baixo={(l + 1) % conteudo.caixa.linhas === 0 && l + 1 < n}
              onClick={() => !dada(l, c) && setSelecionada([l, c])}
            >
              <span aria-hidden="true">{v ? conteudo.simbolos[v - 1].simbolo : ""}</span>
            </UnstyledButton>
          )),
        )}
      </div>
      <Group gap="xs" role="group" aria-label="Figuras para colocar">
        {conteudo.simbolos.map((figura, i) => (
          <UnstyledButton
            key={figura.id}
            className={estilos.pecaAcao}
            aria-label={`Colocar ${figura.nome}`}
            onClick={() => colocar(i + 1)}
          >
            <span className={estilos.figura} aria-hidden="true">
              {figura.simbolo}
            </span>
          </UnstyledButton>
        ))}
        <Button variant="default" onClick={() => colocar(0)} disabled={!selecionada}>
          Apagar
        </Button>
      </Group>
      <Text size="sm" role="status">
        {mensagem}
      </Text>
    </Stack>
  );
}
