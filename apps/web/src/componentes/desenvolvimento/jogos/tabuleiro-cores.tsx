"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button, Stack, Text } from "@mantine/core";
import type { ConteudoCores } from "@/lib/api";
import type { ContratoTabuleiro } from "./contrato-tabuleiro";
import {
  CORES_CAMINHO,
  DIRECOES_CORES,
  andar,
  corDaCasa,
  descreverArredores,
  dicaCores,
  ehTroca,
  pisar,
  type CorCaminho,
  type DirecaoCores,
} from "./caminho-cores";
import estilos from "./jogos.module.css";

/**
 * Caminho de cores (DEV-CAT-M1-CONTEUDO, ticket 05): só se pisa na cor indicada; casas de troca
 * mudam a cor. Cada cor aparece também com símbolo e nome (E5-ACE-10); toque nas setas ou teclado.
 */
export function TabuleiroCores({
  conteudo,
  aoConcluir,
  registrarObterDica,
}: {
  conteudo: ConteudoCores;
} & ContratoTabuleiro) {
  const [posicao, setPosicao] = useState(conteudo.inicio);
  const [cor, setCor] = useState<CorCaminho>(conteudo.cor);
  const [mensagem, setMensagem] = useState("");
  const [dica, setDica] = useState<DirecaoCores["id"] | null>(null);
  const foco = useRef<HTMLDivElement>(null);
  const estado = useRef({ posicao, cor });
  estado.current = { posicao, cor };

  useEffect(() => {
    foco.current?.focus();
  }, []);

  useEffect(() => {
    registrarObterDica(() => {
      const atual = estado.current;
      const proxima = dicaCores(conteudo.mapa, atual.posicao, atual.cor);
      if (!proxima) return null;
      setDica(proxima.id);
      const texto = `Vá para ${proxima.nome}, pisando no ${CORES_CAMINHO[atual.cor].nome}.`;
      setMensagem(texto);
      return texto;
    });
    return () => registrarObterDica(null);
  }, [conteudo, registrarObterDica]);

  function mover(direcao: DirecaoCores) {
    const destino = andar(posicao, direcao);
    setDica(null);
    const casa = conteudo.mapa[destino.linha]?.[destino.coluna];
    const novaCor = pisar(conteudo.mapa, destino, cor);
    if (novaCor == null) {
      const corCasa = corDaCasa(casa);
      setMensagem(
        corCasa
          ? `Essa casa é ${CORES_CAMINHO[corCasa].nome}. Pise só no ${CORES_CAMINHO[cor].nome}.`
          : "Não dá para passar por aí. Procure outra casa.",
      );
      return;
    }
    setPosicao(destino);
    setCor(novaCor);
    if (casa === "F") {
      setMensagem("");
      aoConcluir();
      return;
    }
    setMensagem(ehTroca(casa) ? `Troca! Agora a cor indicada é ${CORES_CAMINHO[novaCor].nome}.` : "");
  }

  function peloTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
    const direcao = DIRECOES_CORES.find((item) => item.tecla === evento.key);
    if (!direcao) return;
    evento.preventDefault();
    mover(direcao);
  }

  const indicada = CORES_CAMINHO[cor];
  return (
    <Stack
      gap="md"
      ref={foco}
      tabIndex={0}
      role="group"
      aria-label="Caminho de cores. Use as setas para andar."
      onKeyDown={peloTeclado}
    >
      <Text fw={600} className={estilos.corIndicada} data-cor={cor}>
        Cor indicada: <span aria-hidden="true">{indicada.simbolo}</span> {indicada.nome}
      </Text>
      <div
        className={estilos.mapa}
        style={{ gridTemplateColumns: `repeat(${conteudo.mapa[0].length}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {conteudo.mapa.flatMap((linha, i) =>
          [...linha].map((casa, j) => {
            const aqui = posicao.linha === i && posicao.coluna === j;
            const corCasa = corDaCasa(casa);
            const tipo = aqui ? "jogador" : casa === "#" ? "parede" : casa === "F" ? "chegada" : corCasa ? "cor" : "caminho";
            return (
              <span
                className={estilos.celula}
                key={`${i}/${j}`}
                data-tipo={tipo}
                data-cor={aqui ? undefined : (corCasa ?? undefined)}
                data-troca={(!aqui && ehTroca(casa)) || undefined}
              >
                {aqui ? "☺" : casa === "F" ? "⚑" : corCasa ? `${ehTroca(casa) ? "↻" : ""}${CORES_CAMINHO[corCasa].simbolo}` : ""}
              </span>
            );
          }),
        )}
      </div>
      <div className={estilos.direcoes} role="group" aria-label="Andar">
        {DIRECOES_CORES.map((direcao) => (
          <Button
            key={direcao.id}
            className={estilos.seta}
            style={{ gridArea: direcao.id }}
            variant={dica === direcao.id ? "filled" : "light"}
            aria-label={`Andar para ${direcao.nome}`}
            onClick={() => mover(direcao)}
          >
            <span aria-hidden="true">{direcao.icone}</span>
          </Button>
        ))}
      </div>
      <Text size="sm" role="status">
        Cor indicada: {indicada.nome}. Em volta: {descreverArredores(conteudo.mapa, posicao)}.
        {mensagem ? " " + mensagem : ""}
      </Text>
    </Stack>
  );
}
