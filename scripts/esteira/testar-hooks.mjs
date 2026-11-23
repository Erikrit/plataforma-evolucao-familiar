#!/usr/bin/env node
/**
 * Testes não destrutivos da política de hooks (simulação via stdin).
 * Não executa git commit/push reais.
 */
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function rodar(scriptRel, payload) {
  const script = join(raiz, scriptRel);
  const r = spawnSync(process.execPath, [script], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    cwd: raiz,
  });
  let json = null;
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    json = { parseError: true, stdout: r.stdout, stderr: r.stderr };
  }
  return { status: r.status, json };
}

const casos = [
  {
    nome: "permite status leitura",
    script: ".cursor/hooks/bloquear-shell.mjs",
    payload: { command: "git status --short" },
    espera: "allow",
  },
  {
    nome: "bloqueia commit",
    script: ".cursor/hooks/bloquear-shell.mjs",
    payload: { command: "git commit -m 'x'" },
    espera: "deny",
  },
  {
    nome: "bloqueia push",
    script: ".cursor/hooks/bloquear-shell.mjs",
    payload: { command: "git push origin main" },
    espera: "deny",
  },
  {
    nome: "bloqueia reset hard",
    script: ".cursor/hooks/bloquear-shell.mjs",
    payload: { command: "git reset --hard HEAD~1" },
    espera: "deny",
  },
  {
    nome: "bloqueia npm publish",
    script: ".cursor/hooks/bloquear-shell.mjs",
    payload: { command: "npm publish" },
    espera: "deny",
  },
  {
    nome: "bloqueia vercel deploy",
    script: ".cursor/hooks/bloquear-shell.mjs",
    payload: { command: "vercel deploy --prod" },
    espera: "deny",
  },
  {
    nome: "bloqueia gh pr create",
    script: ".cursor/hooks/bloquear-shell.mjs",
    payload: { command: "gh pr create --title t --body b" },
    espera: "deny",
  },
  {
    nome: "preToolUse bloqueia shell commit",
    script: ".cursor/hooks/bloquear-pretool.mjs",
    payload: { tool_name: "Shell", tool_input: { command: "git commit -am x" } },
    espera: "deny",
  },
  {
    nome: "MCP leitura permitido (get_)",
    script: ".cursor/hooks/bloquear-mcp.mjs",
    payload: { tool_name: "get_repository", tool_input: {} },
    espera: "allow",
  },
  {
    nome: "MCP create_pull_request bloqueado",
    script: ".cursor/hooks/bloquear-mcp.mjs",
    payload: { tool_name: "create_pull_request", tool_input: { title: "x" } },
    espera: "deny",
  },
];

const resultados = [];
let falhas = 0;

for (const c of casos) {
  const { status, json } = rodar(c.script, c.payload);
  const perm = json.permission;
  const passou = status === 0 && perm === c.espera;
  if (!passou) falhas += 1;
  resultados.push({
    nome: c.nome,
    passou,
    esperado: c.espera,
    obtido: perm,
    exit: status,
  });
}

const saida = {
  ok: falhas === 0,
  total: casos.length,
  falhas,
  resultados,
  limitacao:
    "Bloqueio por heurística textual; ofuscação/indirection pode contornar. failClosed mitiga falha do hook, não evasão deliberada.",
};

console.log(JSON.stringify(saida, null, 2));
process.exit(falhas === 0 ? 0 : 1);
