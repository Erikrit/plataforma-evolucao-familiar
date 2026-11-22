/**
 * QG-3 E1: regressão integrada — encadeia smokes E1 + jornadas 01–04 + authz.
 * Substitui a suíte legada pré-contexto familiar.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

const passos = [
  { script: "smoke-e1-01.mjs", label: "E1-ACE-01/02 provisionar+login" },
  { script: "smoke-e1-02.mjs", label: "E1-ACE-03/04 navegação/contexto" },
  { script: "smoke-e1-03.mjs", label: "E1-ACE-05/06/07 isolamento API" },
  { script: "smoke-e1-jornadas.mjs", label: "E1-ACE-08 jornadas M01–04" },
  { script: "smoke-e1-authz.mjs", label: "authz crítico contextual" },
];

const resultados = [];

for (const passo of passos) {
  const r = spawnSync(process.execPath, [join(dir, passo.script)], {
    encoding: "utf8",
    env: process.env,
  });
  resultados.push({
    script: passo.script,
    label: passo.label,
    ok: r.status === 0,
    exit: r.status,
    trecho: (r.stdout || r.stderr || "").slice(-600),
  });
  if (r.status !== 0) break;
}

const ok = resultados.every((r) => r.ok) && resultados.length === passos.length;
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exit(ok ? 0 : 1);
