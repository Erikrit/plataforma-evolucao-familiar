/** QG-3 módulo 02: encadeia smokes CV-01..CV-06. */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const passos = [
  { script: "smoke-cv01.mjs", label: "ACE-C01/C02" },
  { script: "smoke-cv02.mjs", label: "ACE-C03/C04/C05" },
  { script: "smoke-cv03.mjs", label: "ACE-C06/C07" },
  { script: "smoke-cv04.mjs", label: "ACE-C08" },
  { script: "smoke-cv05.mjs", label: "ACE-C09/C10" },
  { script: "smoke-cv06.mjs", label: "ACE-C11 + ACE-C12-PENDING" },
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
  });
}

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exitCode = ok ? 0 : 1;
