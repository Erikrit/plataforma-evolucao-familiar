/** QG-3 módulo 03: reset canônico + encadeia smokes DL-01..DL-05. */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

const reset = spawnSync(process.execPath, [join(dir, "reset-db-local.mjs")], {
  encoding: "utf8",
  env: process.env,
});
if (reset.status !== 0) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        etapa: "reset-db-local",
        exit: reset.status,
        trecho: (reset.stdout || reset.stderr || "").slice(-500),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
  process.exit();
}

const passos = [
  { script: "smoke-dl01.mjs", label: "DEV-F01 + authz biblioteca" },
  { script: "smoke-dl02.mjs", label: "DEV-F02 + guardar (retenção)" },
  { script: "smoke-dl03.mjs", label: "DEV-F04/F05 participação+estrelas" },
  { script: "smoke-dl-exec.mjs", label: "CT-001 Explorar/Executadas" },
  { script: "smoke-dl04.mjs", label: "DEV-F06 recompensas+resgate" },
  { script: "smoke-dl-rec.mjs", label: "CT-002 Disponíveis/Resgatadas" },
  { script: "smoke-dl05.mjs", label: "UI-contratos + histórico M04 + authz" },
];

const resultados = [
  {
    script: "reset-db-local.mjs",
    label: "reset+seed canônico",
    ok: true,
    exit: 0,
  },
];

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
    trecho: (r.stdout || r.stderr || "").slice(-400),
  });
}

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exitCode = ok ? 0 : 1;
