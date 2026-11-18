"use client";

import { ThemeIcon } from "@mantine/core";
import type { ReactNode } from "react";

type PropsIcone = {
  rotulo: string;
  cor?: string;
  tamanho?: number;
  children: ReactNode;
};

function MolduraIcone({
  rotulo,
  cor = "azul",
  tamanho = 36,
  children,
}: PropsIcone) {
  return (
    <ThemeIcon
      variant="light"
      color={cor}
      size={tamanho}
      radius="md"
      aria-label={rotulo}
      title={rotulo}
    >
      {children}
    </ThemeIcon>
  );
}

function SvgBase({ children }: { children: ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Medicamento / dose (não usar para desenvolvimento). */
export function IconeMedicamento() {
  return (
    <MolduraIcone rotulo="Medicamento" cor="teal">
      <SvgBase>
        <path d="M10.5 3.5 8 6l10 10 2.5-2.5a3.5 3.5 0 0 0-5-5Z" />
        <path d="m8 6-4.5 4.5a3.5 3.5 0 0 0 5 5L18 6" />
        <path d="m12 10 4 4" />
      </SvgBase>
    </MolduraIcone>
  );
}

/** Consulta. */
export function IconeConsulta() {
  return (
    <MolduraIcone rotulo="Consulta" cor="blue">
      <SvgBase>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 11h18" />
        <path d="M12 15v3M10.5 16.5h3" />
      </SvgBase>
    </MolduraIcone>
  );
}

/** Exame / documento clínico. */
export function IconeExame() {
  return (
    <MolduraIcone rotulo="Exame" cor="violet">
      <SvgBase>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h4" />
      </SvgBase>
    </MolduraIcone>
  );
}

export function IconeDoseTomou() {
  return (
    <MolduraIcone rotulo="Tomou conforme o relato" cor="teal">
      <SvgBase>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </SvgBase>
    </MolduraIcone>
  );
}

export function IconeDoseNaoTomou() {
  return (
    <MolduraIcone rotulo="Informou que não tomou" cor="orange">
      <SvgBase>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
      </SvgBase>
    </MolduraIcone>
  );
}

export function IconeDoseSemConfirmacao() {
  return (
    <MolduraIcone rotulo="Sem confirmação" cor="gray">
      <SvgBase>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </SvgBase>
    </MolduraIcone>
  );
}

function SvgConcluiu() {
  return (
    <SvgBase>
      <path d="m8 14 4 4 8-10" />
      <path d="M5 20h6" />
      <path d="M7 4h2l1 4H8Z" />
    </SvgBase>
  );
}

function SvgParticipou() {
  return (
    <SvgBase>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3 19c1.5-3 4-4.5 6-4.5s4.5 1.5 6 4.5" />
      <path d="M14 14.5c1.2 0 2.8.7 4 2.5" />
    </SvgBase>
  );
}

export function IconeConcluiu({ compacto = false }: { compacto?: boolean }) {
  if (compacto) {
    return (
      <span aria-hidden style={{ display: "inline-flex" }}>
        <SvgConcluiu />
      </span>
    );
  }
  return (
    <MolduraIcone rotulo="Concluiu" cor="violet">
      <SvgConcluiu />
    </MolduraIcone>
  );
}

export function IconeParticipou({ compacto = false }: { compacto?: boolean }) {
  if (compacto) {
    return (
      <span aria-hidden style={{ display: "inline-flex" }}>
        <SvgParticipou />
      </span>
    );
  }
  return (
    <MolduraIcone rotulo="Participou" cor="indigo">
      <SvgParticipou />
    </MolduraIcone>
  );
}

export function IconeBrincadeira() {
  return (
    <MolduraIcone rotulo="Brincadeira" cor="violet">
      <SvgBase>
        <path d="M12 3 9.5 8H4l4.5 3.5L6.5 17 12 14l5.5 3-2-5.5L20 8h-5.5Z" />
      </SvgBase>
    </MolduraIcone>
  );
}

export function MarcadorTipoItem({
  tipo,
}: {
  tipo: "medicamento" | "consulta" | "brincadeira";
}) {
  if (tipo === "medicamento") return <IconeMedicamento />;
  if (tipo === "consulta") return <IconeConsulta />;
  return <IconeBrincadeira />;
}

export function MarcadorSituacaoDose({ situacao }: { situacao: string }) {
  if (situacao === "tomou_conforme_informacao") return <IconeDoseTomou />;
  if (situacao === "informou_nao_tomou") return <IconeDoseNaoTomou />;
  return <IconeDoseSemConfirmacao />;
}
