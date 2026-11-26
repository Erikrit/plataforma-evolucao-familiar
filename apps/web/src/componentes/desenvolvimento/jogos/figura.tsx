"use client";

import type { ReactNode } from "react";
import { caminhoFigura } from "@/lib/figuras-twemoji";

/**
 * Figura Twemoji local (ticket 10): mesma aparência em todos os aparelhos e sem
 * recurso externo na partida (E5-F03). Sem SVG disponível, mostra o emoji.
 * Tamanho em em: acompanha o tamanho de fonte do recipiente.
 */
export function Figura({ simbolo, rotulo }: { simbolo: string; rotulo?: string }) {
  const caminho = caminhoFigura(simbolo);
  if (!caminho) return <>{simbolo}</>;
  return (
    <img
      src={caminho}
      alt={rotulo ?? simbolo}
      draggable={false}
      style={{ width: "1em", height: "1em", verticalAlign: "-0.125em", display: "inline-block" }}
    />
  );
}

const segmentador = typeof Intl !== "undefined" && "Segmenter" in Intl
  ? new Intl.Segmenter("pt", { granularity: "grapheme" })
  : null;

/** Texto com emojis trocados pelas figuras locais (ex.: "Forme a palavra da figura 🐈"). */
export function TextoComFiguras({ texto }: { texto: string }) {
  if (!segmentador) return <>{texto}</>;
  const partes: ReactNode[] = [];
  let buffer = "";
  let indice = 0;
  for (const { segment } of segmentador.segment(texto)) {
    if (/\p{Extended_Pictographic}/u.test(segment) && caminhoFigura(segment)) {
      if (buffer) partes.push(buffer);
      buffer = "";
      partes.push(<Figura key={indice++} simbolo={segment} />);
    } else {
      buffer += segment;
    }
  }
  if (buffer) partes.push(buffer);
  return <>{partes}</>;
}
