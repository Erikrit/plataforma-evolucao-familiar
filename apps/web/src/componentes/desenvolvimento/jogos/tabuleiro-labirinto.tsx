"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button, Stack, Text } from "@mantine/core";
import type { ConteudoLabirinto, PosicaoLabirinto } from "@/lib/api";
import estilos from "./jogos.module.css";

const DIRECOES = [
  {
    id: "cima",
    tecla: "ArrowUp",
    nome: "cima",
    icone: "↑",
    linha: -1,
    coluna: 0,
  },
  {
    id: "esquerda",
    tecla: "ArrowLeft",
    nome: "a esquerda",
    icone: "←",
    linha: 0,
    coluna: -1,
  },
  {
    id: "baixo",
    tecla: "ArrowDown",
    nome: "baixo",
    icone: "↓",
    linha: 1,
    coluna: 0,
  },
  {
    id: "direita",
    tecla: "ArrowRight",
    nome: "a direita",
    icone: "→",
    linha: 0,
    coluna: 1,
  },
] as const;
type Direcao = (typeof DIRECOES)[number];

function mesmaPosicao(a: PosicaoLabirinto, b: PosicaoLabirinto) {
  return a.linha === b.linha && a.coluna === b.coluna;
}

function chavePosicao(posicao: PosicaoLabirinto) {
  return `${posicao.linha}/${posicao.coluna}`;
}

function proximaPosicao(posicao: PosicaoLabirinto, direcao: Direcao) {
  return {
    linha: posicao.linha + direcao.linha,
    coluna: posicao.coluna + direcao.coluna,
  };
}

function podeAndar(mapa: readonly string[], posicao: PosicaoLabirinto) {
  const celula = mapa[posicao.linha]?.[posicao.coluna];
  return Boolean(celula && celula !== "#");
}

function caminhoSugerido(
  conteudo: ConteudoLabirinto,
  origem: PosicaoLabirinto,
  alvo: PosicaoLabirinto,
) {
  const fila: { posicao: PosicaoLabirinto; primeira?: Direcao }[] = [
    { posicao: origem },
  ];
  const visitadas = new Set([chavePosicao(origem)]);
  for (let i = 0; i < fila.length; i += 1) {
    const { posicao, primeira } = fila[i];
    if (mesmaPosicao(posicao, alvo)) return primeira;
    for (const direcao of DIRECOES) {
      const proxima = proximaPosicao(posicao, direcao);
      const chave = chavePosicao(proxima);
      if (!podeAndar(conteudo.mapa, proxima) || visitadas.has(chave)) continue;
      visitadas.add(chave);
      fila.push({ posicao: proxima, primeira: primeira ?? direcao });
    }
  }
}

export function TabuleiroLabirinto({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoLabirinto;
  aoConcluir: () => void;
  registrarObterDica: (obter: (() => string | null) | null) => void;
}) {
  const pontos = conteudo.pontos ?? [];
  const [posicao, setPosicao] = useState(conteudo.inicio);
  const [coletados, setColetados] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [dica, setDica] = useState<Direcao["id"] | null>(null);
  const foco = useRef<HTMLDivElement>(null);
  const estado = useRef({ posicao, coletados });
  estado.current = { posicao, coletados };

  useEffect(() => {
    foco.current?.focus();
  }, []);

  useEffect(() => {
    registrarObterDica(() => {
      const atual = estado.current;
      const pendente = pontos.find(
        (ponto) => !atual.coletados.includes(chavePosicao(ponto)),
      );
      const alvo = pendente ?? conteudo.chegada;
      const proxima = caminhoSugerido(conteudo, atual.posicao, alvo);
      if (!proxima) return null;
      setDica(proxima.id);
      const texto = pendente
        ? `Vá para ${proxima.nome} até o próximo ponto de entrega.`
        : `Tente ir para ${proxima.nome} até a chegada.`;
      setMensagem(texto);
      return texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, pontos, registrarObterDica]);

  function mover(direcao: Direcao) {
    const destino = proximaPosicao(posicao, direcao);
    setDica(null);
    if (!podeAndar(conteudo.mapa, destino)) {
      setMensagem("Há uma parede nessa direção. Procure outra passagem.");
      return;
    }
    const chave = chavePosicao(destino);
    const novosColetados =
      pontos.some((ponto) => mesmaPosicao(ponto, destino))
      && !coletados.includes(chave)
        ? [...coletados, chave]
        : coletados;
    setColetados(novosColetados);
    setPosicao(destino);
    if (mesmaPosicao(destino, conteudo.chegada)) {
      if (novosColetados.length < pontos.length) {
        setMensagem(
          `Ainda faltam ${pontos.length - novosColetados.length} ponto(s) de entrega.`,
        );
        return;
      }
      setMensagem("");
      aoConcluir();
      return;
    }
    setMensagem(
      novosColetados.length > coletados.length
        ? `Entrega feita (${novosColetados.length} de ${pontos.length}).`
        : "",
    );
  }

  function peloTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey)
      return;
    const direcao = DIRECOES.find((item) => item.tecla === evento.key);
    if (!direcao) return;
    evento.preventDefault();
    mover(direcao);
  }

  const abertas = DIRECOES.filter((direcao) =>
    podeAndar(conteudo.mapa, proximaPosicao(posicao, direcao)),
  );

  return (
    <Stack
      gap="md"
      ref={foco}
      tabIndex={0}
      role="group"
      aria-label="Labirinto. Use as setas para mover."
      onKeyDown={peloTeclado}
    >
      <Text fw={600}>
        {pontos.length > 0
          ? `Entregas ${coletados.length} de ${pontos.length}. Depois, chegue ao destino.`
          : "Encontre a chegada"}
      </Text>
      <div
        className={estilos.mapa}
        style={{
          gridTemplateColumns: `repeat(${conteudo.mapa[0].length}, minmax(0, 1fr))`,
        }}
        aria-hidden="true"
      >
        {conteudo.mapa.flatMap((linha, i) =>
          [...linha].map((celula, j) => {
            const aqui = posicao.linha === i && posicao.coluna === j;
            const ponto = pontos.some(
              (item) => item.linha === i && item.coluna === j,
            );
            const entregue = coletados.includes(`${i}/${j}`);
            const tipo = aqui
              ? "jogador"
              : celula === "#"
                ? "parede"
                : celula === "F"
                  ? "chegada"
                  : ponto
                    ? entregue
                      ? "entregaFeita"
                      : "entrega"
                    : "caminho";
            return (
              <span className={estilos.celula} key={`${i}/${j}`} data-tipo={tipo}>
                {aqui
                  ? "●"
                  : celula === "F"
                    ? "⚑"
                    : ponto
                      ? entregue
                        ? "✓"
                        : "◆"
                      : ""}
              </span>
            );
          }),
        )}
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
        Linha {posicao.linha + 1}, coluna {posicao.coluna + 1}. Chegada na linha{" "}
        {conteudo.chegada.linha + 1}, coluna {conteudo.chegada.coluna + 1}.{" "}
        Passagens: {abertas.map((direcao) => direcao.nome).join(", ")}.
        {mensagem ? " " + mensagem : ""}
      </Text>
    </Stack>
  );
}
