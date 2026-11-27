"use client";

import type { CSSProperties } from "react";
import { Figura } from "@/componentes/desenvolvimento/jogos/figura";
import estilos from "@/componentes/desenvolvimento/jogos/jogos.module.css";

const CORES: Record<string, { fundo: string; traço: string }> = {
  memoria: { fundo: "#E8EFFC", traço: "#244E95" },
  sequencia: { fundo: "#E7F5EC", traço: "#2F6B4F" },
  labirinto: { fundo: "#FFF4E5", traço: "#9A5B00" },
  "pares-sombras": { fundo: "#F0E8FA", traço: "#5B3A8C" },
  "ache-intruso": { fundo: "#FDECEC", traço: "#9B2C2C" },
  "palavra-figura": { fundo: "#E6F7F5", traço: "#0F6E66" },
  "historias-cenas": { fundo: "#FFF0F6", traço: "#A61E4D" },
  "entrega-jardim": { fundo: "#F3F8E8", traço: "#5C7A1A" },
  "sudoku-figuras": { fundo: "#E7F5EC", traço: "#2F6B4F" },
  "forme-palavra": { fundo: "#E6F7F5", traço: "#0F6E66" },
  "menor-maior": { fundo: "#FDF3E1", traço: "#8A5A00" },
  "robo-setas": { fundo: "#F0E8FA", traço: "#5B3A8C" },
  "letra-inicial": { fundo: "#E6F7F5", traço: "#0F6E66" },
  "adivinha-pista": { fundo: "#FFF0F6", traço: "#A61E4D" },
};

type Props = {
  jogoId: string;
  style?: CSSProperties;
};

/**
 * Ticket 16: figura Twemoji grande sobre placa colorida, no mesmo estilo dos jogos.
 * Jogos sem figura definida (arquivados) mantêm o ícone de traço.
 */
const FIGURA_JOGO: Record<string, string> = {
  memoria: "🧠",
  labirinto: "🧭",
  "entrega-jardim": "🚚",
  "historias-cenas": "📖",
  "sudoku-figuras": "🔢",
  "forme-palavra": "🔤",
  "menor-maior": "📊",
  "robo-setas": "🤖",
  "letra-inicial": "✏️",
  "adivinha-pista": "🦉",
};

/** Ícone quadrado editorial por jogo (sem depender de capaRef). */
export function IconeJogoCatalogo({ jogoId, style }: Props) {
  const cores = CORES[jogoId] ?? { fundo: "#EEF2F7", traço: "#3B4A63" };
  const figura = FIGURA_JOGO[jogoId];
  if (figura) {
    return (
      <span
        className={estilos.placaJogo}
        style={{ background: `linear-gradient(160deg, #fff 0%, ${cores.fundo} 55%)`, border: `2px solid ${cores.traço}33`, ...style }}
        aria-hidden
      >
        <Figura simbolo={figura} rotulo="" />
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden
      focusable="false"
      style={style}
    >
      <rect width="64" height="64" rx="12" fill={cores.fundo} />
      <g
        fill="none"
        stroke={cores.traço}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {desenho(jogoId)}
      </g>
    </svg>
  );
}

function desenho(jogoId: string) {
  switch (jogoId) {
    case "memoria":
      return (
        <>
          <rect x="14" y="16" width="16" height="20" rx="3" />
          <rect x="34" y="16" width="16" height="20" rx="3" />
          <circle cx="22" cy="26" r="3" fill={CORES.memoria.traço} stroke="none" />
          <circle cx="42" cy="26" r="3" fill={CORES.memoria.traço} stroke="none" />
        </>
      );
    case "sequencia":
      return (
        <>
          <circle cx="18" cy="32" r="6" />
          <rect x="28" y="26" width="12" height="12" rx="2" />
          <path d="M46 26 54 32 46 38Z" />
        </>
      );
    case "labirinto":
      return (
        <>
          <path d="M16 16h32v32H16Z" />
          <path d="M16 28h20v8H24v12" />
        </>
      );
    case "pares-sombras":
      return (
        <>
          <circle cx="24" cy="30" r="10" />
          <circle cx="42" cy="30" r="10" opacity="0.45" />
        </>
      );
    case "ache-intruso":
      return (
        <>
          <circle cx="20" cy="32" r="6" />
          <circle cx="32" cy="32" r="6" />
          <circle cx="44" cy="32" r="6" />
          <path d="M44 24 48 20" />
        </>
      );
    case "palavra-figura":
      return (
        <>
          <rect x="14" y="20" width="20" height="24" rx="3" />
          <path d="M40 24h10M40 32h14M40 40h8" />
        </>
      );
    case "historias-cenas":
      return (
        <>
          <rect x="12" y="18" width="18" height="14" rx="2" />
          <rect x="34" y="18" width="18" height="14" rx="2" />
          <rect x="23" y="36" width="18" height="14" rx="2" />
        </>
      );
    case "entrega-jardim":
      return (
        <>
          <path d="M32 14c8 10 14 16 14 24a14 14 0 1 1-28 0c0-8 6-14 14-24Z" />
          <path d="M32 28v18" />
        </>
      );
    case "sudoku-figuras":
      return (
        <>
          <rect x="14" y="14" width="36" height="36" rx="2" />
          <path d="M32 14v36M14 32h36M23 14v36M41 14v36M14 23h36M14 41h36" />
        </>
      );
    case "forme-palavra":
      return (
        <>
          <rect x="10" y="24" width="12" height="16" rx="2" />
          <rect x="26" y="24" width="12" height="16" rx="2" />
          <rect x="42" y="24" width="12" height="16" rx="2" />
        </>
      );
    case "menor-maior":
      return (
        <>
          <path d="M14 46h8M28 46V34M28 46h8M42 46V22M42 46h8" />
          <path d="M18 46V40" />
        </>
      );
    case "robo-setas":
      return (
        <>
          <rect x="20" y="20" width="24" height="20" rx="4" />
          <path d="M28 30h0M36 30h0M32 14v6M24 46l-6 4M40 46l6 4" />
        </>
      );
    default:
      return <circle cx="32" cy="32" r="12" />;
  }
}
