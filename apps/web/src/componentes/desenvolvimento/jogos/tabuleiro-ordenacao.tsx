"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Button, Group, Stack, Text, UnstyledButton, VisuallyHidden } from "@mantine/core";
import type { CenaOrdenacao, ConteudoOrdenacao } from "@/lib/api";
import type { ContratoTabuleiro } from "./contrato-tabuleiro";
import { dicaOrdenacao } from "./dicas-jogos";
import { Figura, TextoComFiguras } from "./figura";
import estilos from "./jogos.module.css";

/** Letra ou número: a peça já mostra o próprio nome (Forme a palavra, Do menor ao maior). */
function autodescritiva(cena: CenaOrdenacao) {
  return cena.nome === cena.simbolo;
}

function mesmaOrdem(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((id, indice) => id === b[indice]);
}

export function TabuleiroOrdenacao({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoOrdenacao;
} & ContratoTabuleiro) {
  const [fila, setFila] = useState<CenaOrdenacao[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [focoDisponivel, setFocoDisponivel] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);
  const concluiu = useRef(false);

  const pecas = conteudo.cenas.every(autodescritiva);
  const rotuloCena = (cena: CenaOrdenacao) =>
    conteudo.ocultarNomes ? `Cena ${conteudo.cenas.findIndex((c) => c.id === cena.id) + 1}` : cena.nome;
  const mostrarNome = (cena: CenaOrdenacao) => !conteudo.ocultarNomes && !autodescritiva(cena);

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

  // Dica em dois níveis (ticket 09): o nível volta ao 1º quando a fila muda.
  const filaAtual = useRef(fila);
  filaAtual.current = fila;
  const pedidosDica = useRef({ chave: "", nivel: 0 });

  useEffect(() => {
    registrarObterDica(() => {
      const colocadas = filaAtual.current.map((cena) => cena.id);
      const chave = colocadas.join(",");
      const pedidos = pedidosDica.current;
      pedidos.nivel = pedidos.chave === chave ? pedidos.nivel + 1 : 1;
      pedidos.chave = chave;
      const texto = dicaOrdenacao(conteudo, colocadas, pedidos.nivel);
      setMensagem(texto);
      return texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, registrarObterDica]);

  function colocar(cena: CenaOrdenacao) {
    // Com intrusas sobra peça: a fila não passa do número de espaços.
    if (concluiu.current || fila.length >= conteudo.ordemCorreta.length || fila.some((item) => item.id === cena.id)) {
      if (fila.length >= conteudo.ordemCorreta.length) setMensagem("Todos os espaços estão ocupados. Use Desfazer para trocar.");
      return;
    }
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
        <TextoComFiguras texto={conteudo.enunciado} />
      </Text>

      <Stack gap="xs">
        <Text size="sm" fw={600}>
          {pecas ? "Sua resposta" : "Sua história"}
        </Text>
        <ol className={estilos.filaOrdenacao} aria-label={pecas ? "Peças na ordem escolhida" : "Cenas na ordem escolhida"}>
          {conteudo.ordemCorreta.map((_, indice) => {
            const cena = fila[indice];
            return (
              <li key={`slot-${indice}`} className={estilos.slotOrdenacao} data-preenchido={Boolean(cena)}>
                <span className={estilos.numeroCarta}>{indice + 1}</span>
                {cena ? (
                  <>
                    <span className={estilos.figura} aria-hidden={!pecas}>
                      <Figura simbolo={cena.simbolo} />
                    </span>
                    {mostrarNome(cena) ? <span className={estilos.nomeFigura}>{cena.nome}</span> : null}
                    {conteudo.ocultarNomes ? <VisuallyHidden>{rotuloCena(cena)}</VisuallyHidden> : null}
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
          {pecas ? "Peças disponíveis" : "Cenas disponíveis"}
        </Text>
        {conteudo.intrusas ? (
          <Text size="sm" c="dimmed">
            {pecas
              ? conteudo.intrusas === 1
                ? "Atenção: uma peça sobra e fica de fora."
                : `Atenção: ${conteudo.intrusas} peças sobram e ficam de fora.`
              : conteudo.intrusas === 1
                ? "Atenção: uma cena não faz parte da história e fica de fora."
                : `Atenção: ${conteudo.intrusas} cenas não fazem parte da história e ficam de fora.`}
          </Text>
        ) : null}
        <div className={estilos.gradePecas} role="group" aria-label={pecas ? "Peças para ordenar" : "Cenas para ordenar"}>
          {disponiveis.map((cena, indice) => (
            <UnstyledButton
              key={cena.id}
              className={estilos.pecaAcao}
              data-foco={indice === focoDisponivel}
              onClick={() => {
                setFocoDisponivel(indice);
                colocar(cena);
              }}
              aria-label={`Colocar ${rotuloCena(cena)}`}
            >
              <span className={estilos.figura} aria-hidden="true">
                <Figura simbolo={cena.simbolo} />
              </span>
              {mostrarNome(cena) ? <span className={estilos.nomeFigura}>{cena.nome}</span> : null}
            </UnstyledButton>
          ))}
          {disponiveis.length === 0 ? (
            <Text size="sm" c="dimmed">
              {pecas ? "Todas as peças já estão na resposta." : "Todas as cenas já estão na história."}
            </Text>
          ) : null}
        </div>
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
