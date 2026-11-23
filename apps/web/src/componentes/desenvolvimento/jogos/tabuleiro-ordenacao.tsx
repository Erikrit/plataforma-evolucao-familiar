"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Button, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { CenaOrdenacao, ConteudoOrdenacao } from "@/lib/api";
import estilos from "./jogos.module.css";

function mesmaOrdem(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((id, indice) => id === b[indice]);
}

export function TabuleiroOrdenacao({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoOrdenacao;
  aoConcluir: () => void;
  registrarObterDica: (obter: (() => string | null) | null) => void;
}) {
  const [fila, setFila] = useState<CenaOrdenacao[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [focoDisponivel, setFocoDisponivel] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);
  const concluiu = useRef(false);

  const disponiveis = useMemo(
    () => conteudo.cenas.filter((cena) => !fila.some((item) => item.id === cena.id)),
    [conteudo.cenas, fila],
  );

  useEffect(() => {
    raiz.current?.focus();
  }, []);

  useEffect(() => {
    if (focoDisponivel >= disponiveis.length) {
      setFocoDisponivel(Math.max(0, disponiveis.length - 1));
    }
  }, [disponiveis.length, focoDisponivel]);

  useEffect(() => {
    registrarObterDica(() => {
      if (conteudo.dica) {
        setMensagem(conteudo.dica);
        return conteudo.dica;
      }
      const nomes = conteudo.ordemCorreta
        .map((id) => conteudo.cenas.find((cena) => cena.id === id)?.nome)
        .filter(Boolean);
      const texto = `Uma ordem possível começa com ${nomes[0]?.toLowerCase() ?? "a primeira cena"}.`;
      setMensagem(texto);
      return texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, registrarObterDica]);

  function colocar(cena: CenaOrdenacao) {
    if (concluiu.current || fila.some((item) => item.id === cena.id)) return;
    const proxima = [...fila, cena];
    setFila(proxima);
    setMensagem("");
    if (proxima.length !== conteudo.ordemCorreta.length) return;
    if (mesmaOrdem(proxima.map((item) => item.id), conteudo.ordemCorreta)) {
      concluiu.current = true;
      aoConcluir();
      return;
    }
    setMensagem("Ainda não está na ordem. Use Desfazer e tente de novo.");
  }

  function desfazer() {
    if (concluiu.current || fila.length === 0) return;
    setFila((atual) => atual.slice(0, -1));
    setMensagem("");
  }

  function aoTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "Backspace" || evento.key === "Delete") {
      evento.preventDefault();
      desfazer();
      return;
    }
    if (disponiveis.length === 0) return;
    if (evento.key === "ArrowRight" || evento.key === "ArrowDown") {
      evento.preventDefault();
      setFocoDisponivel((atual) => (atual + 1) % disponiveis.length);
      return;
    }
    if (evento.key === "ArrowLeft" || evento.key === "ArrowUp") {
      evento.preventDefault();
      setFocoDisponivel((atual) => (atual - 1 + disponiveis.length) % disponiveis.length);
      return;
    }
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      const cena = disponiveis[focoDisponivel];
      if (cena) colocar(cena);
    }
  }

  return (
    <Stack gap="md" ref={raiz} tabIndex={0} onKeyDown={aoTeclado} className={estilos.ordenacao}>
      <Text fw={600} size="lg">
        {conteudo.enunciado}
      </Text>

      <Stack gap="xs">
        <Text size="sm" fw={600}>
          Sua história
        </Text>
        <ol className={estilos.filaOrdenacao} aria-label="Cenas na ordem escolhida">
          {conteudo.ordemCorreta.map((_, indice) => {
            const cena = fila[indice];
            return (
              <li key={`slot-${indice}`} className={estilos.slotOrdenacao} data-preenchido={Boolean(cena)}>
                <span className={estilos.numeroCarta}>{indice + 1}</span>
                {cena ? (
                  <>
                    <span className={estilos.figura} aria-hidden="true">
                      {cena.simbolo}
                    </span>
                    <span className={estilos.nomeFigura}>{cena.nome}</span>
                  </>
                ) : (
                  <span className={estilos.nomeFigura}>Espaço livre</span>
                )}
              </li>
            );
          })}
        </ol>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" fw={600}>
          Cenas disponíveis
        </Text>
        <Group gap="xs" role="group" aria-label="Cenas para ordenar">
          {disponiveis.map((cena, indice) => (
            <UnstyledButton
              key={cena.id}
              className={estilos.pecaAcao}
              data-foco={indice === focoDisponivel}
              onClick={() => {
                setFocoDisponivel(indice);
                colocar(cena);
              }}
              aria-label={`Colocar ${cena.nome}`}
            >
              <span className={estilos.figura} aria-hidden="true">
                {cena.simbolo}
              </span>
              <span className={estilos.nomeFigura}>{cena.nome}</span>
            </UnstyledButton>
          ))}
          {disponiveis.length === 0 ? (
            <Text size="sm" c="dimmed">
              Todas as cenas já estão na história.
            </Text>
          ) : null}
        </Group>
      </Stack>

      <Group>
        <Button variant="light" onClick={desfazer} disabled={fila.length === 0 || concluiu.current}>
          Desfazer
        </Button>
      </Group>

      <Text size="sm" role="status">
        {mensagem}
      </Text>
    </Stack>
  );
}
