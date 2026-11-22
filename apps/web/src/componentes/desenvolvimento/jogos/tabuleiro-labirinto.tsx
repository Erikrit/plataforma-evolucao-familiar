"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import type { ConteudoLabirinto, PosicaoLabirinto } from "@/lib/api";
import estilos from "./jogos.module.css";

const DIRECOES = [
  { id: "cima", tecla: "ArrowUp", nome: "cima", icone: "↑", linha: -1, coluna: 0 },
  { id: "esquerda", tecla: "ArrowLeft", nome: "a esquerda", icone: "←", linha: 0, coluna: -1 },
  { id: "baixo", tecla: "ArrowDown", nome: "baixo", icone: "↓", linha: 1, coluna: 0 },
  { id: "direita", tecla: "ArrowRight", nome: "a direita", icone: "→", linha: 0, coluna: 1 },
] as const;
type Direcao = (typeof DIRECOES)[number];

function mesmaPosicao(a: PosicaoLabirinto, b: PosicaoLabirinto) {
  return a.linha === b.linha && a.coluna === b.coluna;
}

function proximaPosicao(posicao: PosicaoLabirinto, direcao: Direcao) {
  return { linha: posicao.linha + direcao.linha, coluna: posicao.coluna + direcao.coluna };
}

function podeAndar(mapa: readonly string[], posicao: PosicaoLabirinto) {
  const celula = mapa[posicao.linha]?.[posicao.coluna];
  return Boolean(celula && celula !== "#");
}

function caminhoSugerido(conteudo: ConteudoLabirinto, origem: PosicaoLabirinto) {
  const fila: { posicao: PosicaoLabirinto; primeira?: Direcao }[] = [{ posicao: origem }];
  const visitadas = new Set([`${origem.linha}/${origem.coluna}`]);
  for (let i = 0; i < fila.length; i += 1) {
    const { posicao, primeira } = fila[i];
    if (mesmaPosicao(posicao, conteudo.chegada)) return primeira;
    for (const direcao of DIRECOES) {
      const proxima = proximaPosicao(posicao, direcao);
      const chave = `${proxima.linha}/${proxima.coluna}`;
      if (!podeAndar(conteudo.mapa, proxima) || visitadas.has(chave)) continue;
      visitadas.add(chave);
      fila.push({ posicao: proxima, primeira: primeira ?? direcao });
    }
  }
}

export function TabuleiroLabirinto({
  conteudo,
  aoConcluir,
}: {
  conteudo: ConteudoLabirinto;
  aoConcluir: () => void;
}) {
  const [posicao, setPosicao] = useState(conteudo.inicio);
  const [mensagem, setMensagem] = useState("");
  const [dica, setDica] = useState<Direcao["id"] | null>(null);
  const foco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    foco.current?.focus();
  }, []);

  function mover(direcao: Direcao) {
    const destino = proximaPosicao(posicao, direcao);
    setDica(null);
    if (!podeAndar(conteudo.mapa, destino)) {
      setMensagem("Há uma parede nessa direção. Procure outra passagem.");
      return;
    }
    setMensagem("");
    setPosicao(destino);
    if (mesmaPosicao(destino, conteudo.chegada)) aoConcluir();
  }

  function peloTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
    const direcao = DIRECOES.find((item) => item.tecla === evento.key);
    if (!direcao) return;
    evento.preventDefault();
    mover(direcao);
  }

  function mostrarDica() {
    const proxima = caminhoSugerido(conteudo, posicao);
    if (!proxima) return;
    setDica(proxima.id);
    setMensagem(`Tente ir para ${proxima.nome}.`);
  }

  const abertas = DIRECOES.filter((direcao) => podeAndar(conteudo.mapa, proximaPosicao(posicao, direcao)));

  return (
    <Stack gap="md" ref={foco} tabIndex={0} role="group" aria-label="Labirinto. Use as setas para mover." onKeyDown={peloTeclado}>
      <Group justify="space-between">
        <Text fw={600}>Encontre a chegada</Text>
        <Button variant="light" onClick={mostrarDica}>Dica</Button>
      </Group>
      <div className={estilos.mapa} style={{ gridTemplateColumns: `repeat(${conteudo.mapa[0].length}, minmax(0, 1fr))` }} aria-hidden="true">
        {conteudo.mapa.flatMap((linha, i) => [...linha].map((celula, j) => {
          const aqui = posicao.linha === i && posicao.coluna === j;
          const tipo = aqui ? "jogador" : celula === "#" ? "parede" : celula === "F" ? "chegada" : "caminho";
          return <span className={estilos.celula} key={`${i}/${j}`} data-tipo={tipo}>{aqui ? "●" : celula === "F" ? "⚑" : ""}</span>;
        }))}
      </div>
      <div className={estilos.direcoes} role="group" aria-label="Mover a peça">
        {DIRECOES.map((direcao) => (
          <Button
            key={direcao.id}
            className={estilos.seta}
            style={{ gridArea: direcao.id }}
            variant={dica === direcao.id ? "filled" : "light"}
            aria-label={`Mover para ${direcao.nome}`}
            onClick={() => mover(direcao)}
          >
            <span aria-hidden="true">{direcao.icone}</span>
          </Button>
        ))}
      </div>
      <Text size="sm" role="status">
        Linha {posicao.linha + 1}, coluna {posicao.coluna + 1}. Chegada na linha {conteudo.chegada.linha + 1}, coluna {conteudo.chegada.coluna + 1}.
        {" "}Passagens: {abertas.map((direcao) => direcao.nome).join(", ")}.
        {mensagem ? " " + mensagem : ""}
      </Text>
    </Stack>
  );
}
