/** Check estático E1-04: inventário de superfícies contextuais e suíte nova. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const pkg = JSON.parse(
  readFileSync(join(raiz, "apps/api/package.json"), "utf8"),
);
const scripts = pkg.scripts ?? {};

const smokesNovos = [
  "smoke:e1-01",
  "smoke:e1-02",
  "smoke:e1-03",
  "smoke:e1-04",
  "smoke:e1-jornadas",
  "smoke:authz",
];
for (const nome of smokesNovos) {
  reg(`script-${nome}`, typeof scripts[nome] === "string", scripts[nome]);
}

const legados = [
  "smoke:ff02",
  "smoke:modulo-01",
  "smoke:cv03",
  "smoke:dl02",
  "smoke:ef05",
  "smoke:modulo-04",
  "smoke:ct-acessos",
  "smoke:m01-simp-cad",
];
for (const nome of legados) {
  reg(`legado-removido-${nome}`, scripts[nome] === undefined, scripts[nome]);
}

const arquivosNovos = [
  "apps/api/scripts/smoke-e1-04.mjs",
  "apps/api/scripts/smoke-e1-jornadas.mjs",
  "apps/api/scripts/smoke-e1-authz.mjs",
  "apps/web/src/app/f/[slug]/entrar/page.tsx",
  "apps/web/src/app/f/[slug]/layout.tsx",
  "apps/web/src/componentes/guarda-contexto-familiar.tsx",
  "apps/web/src/lib/rotas-familia.ts",
];
for (const rel of arquivosNovos) {
  reg(`existe-${rel}`, existsSync(join(raiz, rel)), rel);
}

const arquivosLegados = [
  "apps/api/scripts/smoke-ff02.mjs",
  "apps/api/scripts/smoke-modulo-01.mjs",
  "apps/api/scripts/smoke-cv03.mjs",
  "apps/api/scripts/smoke-dl-exec.mjs",
  "apps/api/scripts/smoke-ef05.mjs",
  "apps/api/scripts/smoke-authz-critico.mjs",
];
for (const rel of arquivosLegados) {
  reg(`ausente-${rel}`, !existsSync(join(raiz, rel)), rel);
}

const api = readFileSync(join(raiz, "apps/web/src/lib/api.ts"), "utf8");
const sessao = readFileSync(
  join(raiz, "apps/api/src/auth/servico-sessao.ts"),
  "utf8",
);
reg(
  "login-exige-familiaSlug",
  sessao.includes("familiaSlug") && api.includes("familiaSlug"),
  "contrato contextual",
);

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exit(ok ? 0 : 1);
