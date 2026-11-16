/** QG-3 módulo 04: reset canônico + encadeia smokes EF-01..EF-06. */
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
  { script: "smoke-ef01.mjs", label: "histórico unificado + authz" },
  { script: "smoke-ef02.mjs", label: "filtros período/domínio" },
  { script: "smoke-ef03.mjs", label: "resumo Vovó" },
  { script: "smoke-ef04.mjs", label: "resumo Laurinha" },
  { script: "smoke-ef05.mjs", label: "prévia/PDF autorizados" },
  { script: "smoke-ef06.mjs", label: "destaques home" },
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
