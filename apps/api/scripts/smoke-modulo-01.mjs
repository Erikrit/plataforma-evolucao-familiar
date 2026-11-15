/** Regressão QG-3 do módulo 01 — critérios ACE aplicáveis. */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const scripts = [
  ["smoke:ff02", "ACE-01/02/09"],
  ["smoke:ff03", "ACE-05/07"],
  ["smoke:ff04", "ACE-03/04"],
  ["smoke:ff05", "ACE-06/10"],
];

const resultados = [];
for (const [script, label] of scripts) {
  const r = spawnSync("npm", ["run", script, "-w", "@pef/api"], {
    encoding: "utf8",
    shell: true,
    cwd: raiz,
  });
  resultados.push({
    script,
    label,
    ok: r.status === 0,
    exit: r.status,
  });
}

const css = readFileSync(join(raiz, "apps/web/src/app/globals.css"), "utf8");
const perfil = existsSync(
  join(raiz, "apps/web/src/app/pessoas/[pessoaId]/page.tsx"),
);
resultados.push({
  script: "ACE-08-estrutural",
  label: "mobile-first CSS + perfil",
  ok: css.includes("@media (max-width") && perfil,
  exit: 0,
});

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exit(ok ? 0 : 1);
