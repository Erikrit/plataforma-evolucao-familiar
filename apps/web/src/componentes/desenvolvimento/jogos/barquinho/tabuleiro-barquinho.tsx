"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Alert, Button, Stack, Text } from "@mantine/core";
import { useReducedMotion } from "@mantine/hooks";
import type { ContratoTabuleiro } from "../contrato-tabuleiro";
import {
  criarControladorBarquinho,
  type ControladorBarquinho,
  type MedicaoQuadros,
} from "./controlador-barquinho";
import type { RenderizadorBarquinho } from "./cena-barquinho";
import {
  descreverArredores,
  dicaBarquinho,
  totalFolhas,
  type EstadoBarquinho,
  type FaseBarquinho,
  type Lado,
} from "./simulacao-barquinho";
import estilos from "./barquinho.module.css";

/** Medidas de abertura, para o teste técnico do 2D (ticket 10). */
export type MedicaoAbertura = Readonly<{
  /** Do início da montagem até a biblioteca baixada e avaliada. */
  carregarMs: number;
  /** Do início da montagem até o primeiro quadro desenhado. */
  primeiroQuadroMs: number;
  /** Bytes de script baixados depois do início da montagem (transferidos, com compressão). */
  scriptsBaixadosBytes: number;
  movimentoReduzido: boolean;
}>;

export type MedidorBarquinho = Readonly<{ medirQuadros: () => MedicaoQuadros }>;

// ADR-018: o PixiJS vira um pedaço separado, baixado só quando o jogo abre.
const carregarCena = () => import("./renderizador-pixi").then((m) => m.montarCenaPixi);

function scriptsBaixadosDesde(inicio: number) {
  return performance
    .getEntriesByType("resource")
    .filter(
      (item): item is PerformanceResourceTiming =>
        item instanceof PerformanceResourceTiming &&
        item.startTime >= inicio &&
        item.initiatorType === "script",
    )
    .reduce((total, item) => total + (item.transferSize || item.encodedBodySize), 0);
}

function alturaDoRio() {
  return Math.round(Math.min(Math.max(window.innerHeight * 0.5, 260), 520));
}

export function TabuleiroBarquinho({
  fase,
  aoConcluir,
  registrarObterDica,
  aoMedirAbertura,
  aoMedidor,
}: {
  fase: FaseBarquinho;
  aoMedirAbertura?: (medicao: MedicaoAbertura) => void;
  aoMedidor?: (medidor: MedidorBarquinho | null) => void;
} & ContratoTabuleiro) {
  const movimentoReduzido = useReducedMotion(false, { getInitialValueInEffect: false });
  const rio = useRef<HTMLDivElement>(null);
  const grupo = useRef<HTMLDivElement>(null);
  const controladorRef = useRef<ControladorBarquinho | null>(null);
  const concluir = useRef(aoConcluir);
  concluir.current = aoConcluir;
  const medirAbertura = useRef(aoMedirAbertura);
  medirAbertura.current = aoMedirAbertura;
  const [estado, setEstado] = useState<EstadoBarquinho | null>(null);
  const [falha, setFalha] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [dicaLado, setDicaLado] = useState<Lado | 0 | null>(null);

  useEffect(() => {
    const alvo = rio.current;
    if (!alvo) return;
    let cancelado = false;
    let renderizador: RenderizadorBarquinho | null = null;
    const inicio = performance.now();
    const controlador = criarControladorBarquinho(fase, { movimentoReduzido });
    controladorRef.current = controlador;
    controlador.aoMudar = (novo) => setEstado(novo);
    controlador.aoConcluir = () => concluir.current();
    setEstado(controlador.estado);
    setFalha(false);
    aoMedidor?.({ medirQuadros: () => controlador.medir() });

    void (async () => {
      try {
        const montar = await carregarCena();
        const carregarMs = performance.now() - inicio;
        if (cancelado) return;
        const largura = alvo.clientWidth;
        const altura = alturaDoRio();
        alvo.style.height = `${altura}px`;
        renderizador = await montar({
          alvo,
          controlador,
          largura,
          altura,
          aoPrimeiroQuadro: () => {
            const primeiroQuadroMs = performance.now() - inicio;
            // A medição do download espera o navegador registrar os recursos.
            window.setTimeout(() => {
              medirAbertura.current?.({
                carregarMs: Math.round(carregarMs),
                primeiroQuadroMs: Math.round(primeiroQuadroMs),
                scriptsBaixadosBytes: scriptsBaixadosDesde(inicio),
                movimentoReduzido,
              });
            }, 0);
          },
        });
        if (cancelado) renderizador.destruir();
      } catch {
        if (!cancelado) setFalha(true);
      }
    })();

    return () => {
      cancelado = true;
      renderizador?.destruir();
      controlador.aoMudar = null;
      controlador.aoConcluir = null;
      controladorRef.current = null;
      aoMedidor?.(null);
    };
  }, [fase, movimentoReduzido, tentativa, aoMedidor]);

  useEffect(() => {
    grupo.current?.focus();
  }, []);

  useEffect(() => {
    registrarObterDica(() => {
      const controlador = controladorRef.current;
      if (!controlador) return null;
      const dica = dicaBarquinho(controlador.estado, fase);
      setDicaLado(dica?.lado ?? null);
      return dica?.texto ?? null;
    });
    return () => registrarObterDica(null);
  }, [fase, registrarObterDica]);

  const virar = useCallback((lado: Lado) => {
    setDicaLado(null);
    controladorRef.current?.virar(lado);
  }, []);

  const alternarPausa = useCallback(() => {
    const controlador = controladorRef.current;
    if (controlador) controlador.pausar(!controlador.estado.pausado);
  }, []);

  function peloTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
    if (evento.key === "ArrowLeft") virar(-1);
    else if (evento.key === "ArrowRight") virar(1);
    else if (evento.key === " " && evento.target === evento.currentTarget) alternarPausa();
    else return;
    evento.preventDefault();
  }

  function peloToque(evento: PointerEvent<HTMLDivElement>) {
    // Toque simples: metade esquerda do rio vira para a esquerda; metade direita, para a direita.
    const caixa = evento.currentTarget.getBoundingClientRect();
    virar(evento.clientX - caixa.left < caixa.width / 2 ? -1 : 1);
  }

  const folhas = totalFolhas(fase);

  return (
    <Stack
      gap="md"
      ref={grupo}
      tabIndex={0}
      role="group"
      className={estilos.grupo}
      aria-label="Barquinho no rio. Setas para a esquerda e para a direita viram o barco; espaço para ou segue."
      onKeyDown={peloTeclado}
    >
      <Text fw={600}>
        Leve o barquinho até a margem.
        {folhas > 0 ? ` Folhas: ${estado?.folhas.length ?? 0} de ${folhas} (opcional).` : ""}
      </Text>
      {falha ? (
        <Alert color="red" role="alert">
          <Stack align="flex-start">
            <Text size="sm">Não foi possível carregar o rio.</Text>
            <Button onClick={() => setTentativa((n) => n + 1)}>Tentar novamente</Button>
          </Stack>
        </Alert>
      ) : null}
      <div ref={rio} className={estilos.rio} aria-hidden="true" onPointerDown={peloToque} />
      <div className={estilos.controles} role="group" aria-label="Guiar o barco">
        <Button
          className={estilos.virar}
          variant={dicaLado === -1 ? "filled" : "light"}
          aria-label="Virar para a esquerda"
          onClick={() => virar(-1)}
        >
          <span aria-hidden="true">←</span>
        </Button>
        <Button className={estilos.pausar} variant="default" onClick={alternarPausa}>
          {estado?.pausado ? "Seguir" : "Parar"}
        </Button>
        <Button
          className={estilos.virar}
          variant={dicaLado === 1 ? "filled" : "light"}
          aria-label="Virar para a direita"
          onClick={() => virar(1)}
        >
          <span aria-hidden="true">→</span>
        </Button>
      </div>
      {estado ? (
        <>
          <Text size="sm">{descreverArredores(estado, fase)}</Text>
          <Text size="sm" role="status">
            {estado.aviso ?? ""}
          </Text>
        </>
      ) : null}
    </Stack>
  );
}
