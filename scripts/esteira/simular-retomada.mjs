#!/usr/bin/env node
/**
 * Simula reconciliação de estado da esteira sem implementar produto.
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
  return h.digest("hex").slice(0, 16);
}

const estado = JSON.parse(readFileSync(estadoPath, "utf8"));
const status = spawnSync("git", ["status", "--short"], {
  cwd: raiz,
  encoding: "utf8",
});

const arquivosEsteira = [
  "AGENTS.md",
  ".cursor/rules/engineering.mdc",
  ".cursor/agents/verifier.md",
  ".cursor/skills/module-planning/SKILL.md",
  ".cursor/skills/implementation-workflow/SKILL.md",
  ".cursor/skills/quality-gate/SKILL.md",
  ".cursor/hooks.json",
];

const fingerprint = hashArquivos(arquivosEsteira);
const dirty = (status.stdout || "").trim();

const simulacao = {
  lidoDe: "docs/esteira/estado/atual.json",
  estadoRegistrado: estado.estado,
  moduloId: estado.moduloId,
  incrementoId: estado.incrementoId,
  workspace: {
    gitStatusShort: dirty || "(limpo)",
    exitGitStatus: status.status,
  },
  fingerprintCalculado: fingerprint,
  fingerprintRegistrado: estado.fingerprint,
  fingerprintCompativel: estado.fingerprint === fingerprint,
  decisaoRetomada:
    estado.estado === "READY" || estado.estado === "PENDING"
      ? "Nenhum incremento em voo — seguir proximaAcao"
      : estado.fingerprint && estado.fingerprint !== fingerprint
        ? "Workspace diverge do fingerprint — revalidar antes de continuar"
        : "Comparar arquivos do incremento e retomar proximaAcao sem reimplementar o válido",
  proximaAcao: estado.proximaAcao,
  geradoEm: new Date().toISOString(),
};

mkdirSync(dirname(simPath), { recursive: true });
writeFileSync(simPath, JSON.stringify(simulacao, null, 2), "utf8");

console.log(JSON.stringify({ ok: true, simulacaoPath: "docs/esteira/estado/retomada-simulacao.local.json", simulacao }, null, 2));
