#!/usr/bin/env node
/**
 * Simula reconciliação de estado da esteira sem implementar produto.
 * Suporta schema v2 (demanda ativa) e fingerprints hash dos arquivos afetados.
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const estadoPath = join(raiz, "docs/esteira/estado/atual.json");
const simPath = join(raiz, "docs/esteira/estado/retomada-simulacao.local.json");

function hashArquivos(paths) {
  const h = createHash("sha256");
  for (const rel of paths) {
    const abs = join(raiz, rel);
    h.update(rel);
    h.update("\0");
    if (existsSync(abs)) h.update(readFileSync(abs));
    else h.update("MISSING");
    h.update("\n");
  }
  return `sha256:${h.digest("hex").slice(0, 16)}`;
}

function ehHashVerificavel(fp) {
  return typeof fp === "string" && /^sha256:[a-f0-9]+$/i.test(fp);
}

const estado = JSON.parse(readFileSync(estadoPath, "utf8"));
const status = spawnSync("git", ["status", "--short"], {
  cwd: raiz,
  encoding: "utf8",
});
const branch = (
  spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: raiz,
    encoding: "utf8",
  }).stdout || ""
).trim();
const head = (
  spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: raiz,
    encoding: "utf8",
  }).stdout || ""
).trim();

const arquivosEsteira = [
  "AGENTS.md",
  ".cursor/rules/engineering.mdc",
  ".cursor/agents/verifier.md",
  ".cursor/skills/task-routing/SKILL.md",
  ".cursor/skills/module-planning/SKILL.md",
  ".cursor/skills/implementation-workflow/SKILL.md",
  ".cursor/skills/quality-gate/SKILL.md",
  ".cursor/hooks.json",
];

const fingerprintEsteira = hashArquivos(arquivosEsteira);
const dirty = (status.stdout || "").trim();
const demanda = estado.demanda;

let fingerprintDemanda = null;
let fingerprintDemandaCompativel = null;
if (demanda?.arquivos?.length) {
  fingerprintDemanda = hashArquivos(demanda.arquivos);
  fingerprintDemandaCompativel = demanda.fingerprint
    ? demanda.fingerprint === fingerprintDemanda
    : null;
}

const fingerprintModuloSimbolico = estado.fingerprint;
const fingerprintModuloEhHistorico = !ehHashVerificavel(fingerprintModuloSimbolico);

let decisaoRetomada;
if (demanda && ["IN_PROGRESS", "IN_VALIDATION", "READY", "BLOCKED"].includes(demanda.estado)) {
  if (
    demanda.fingerprint &&
    ehHashVerificavel(demanda.fingerprint) &&
    fingerprintDemandaCompativel === false
  ) {
    decisaoRetomada =
      "Demanda ativa diverge do fingerprint hash — invalidar evidência antiga e revalidar antes de continuar";
  } else {
    decisaoRetomada = `Retomar demanda ${demanda.id} na proximaAcao sem reimplementar o válido`;
  }
} else if (estado.estado === "READY" || estado.estado === "PENDING" || !demanda) {
  decisaoRetomada =
    "Nenhuma demanda em voo — usar task-routing para a próxima demanda (proximaAcao)";
} else if (estado.fingerprint && !ehHashVerificavel(estado.fingerprint)) {
  decisaoRetomada =
    "Fingerprint de módulo histórico é simbólico — não usar como prova de código atual; seguir proximaAcao / task-routing";
} else {
  decisaoRetomada =
    "Comparar arquivos do incremento/demanda e retomar proximaAcao sem reimplementar o válido";
}

const simulacao = {
  lidoDe: "docs/esteira/estado/atual.json",
  schemaVersao: estado.schemaVersao ?? 1,
  estadoRegistrado: estado.estado,
  moduloId: estado.moduloId,
  incrementoId: estado.incrementoId,
  demandaAtiva: demanda
    ? {
        id: demanda.id,
        tipo: demanda.tipo,
        estado: demanda.estado,
        fingerprint: demanda.fingerprint ?? null,
      }
    : null,
  workspace: {
    branch: branch || null,
    head: head || null,
    gitStatusShort: dirty || "(limpo)",
    exitGitStatus: status.status,
  },
  revisaoRegistrada: estado.revisao ?? null,
  fingerprintEsteiraCalculado: fingerprintEsteira,
  fingerprintModuloRegistrado: fingerprintModuloSimbolico,
  fingerprintModuloHistoricoSimbolico: fingerprintModuloEhHistorico,
  fingerprintDemandaCalculado: fingerprintDemanda,
  fingerprintDemandaCompativel,
  decisaoRetomada,
  proximaAcao: demanda?.proximaAcao || estado.proximaAcao,
  geradoEm: new Date().toISOString(),
};

mkdirSync(dirname(simPath), { recursive: true });
writeFileSync(simPath, JSON.stringify(simulacao, null, 2), "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      simulacaoPath: "docs/esteira/estado/retomada-simulacao.local.json",
      simulacao,
    },
    null,
    2,
  ),
);
