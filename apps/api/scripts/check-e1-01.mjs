/** Check estático E1-01: slug, login contextual e ausência de login global. */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const schema = readFileSync(join(raiz, "apps/api/prisma/schema.prisma"), "utf8");
const sessao = readFileSync(
  join(raiz, "apps/api/src/auth/servico-sessao.ts"),
  "utf8",
);
const controlador = readFileSync(
  join(raiz, "apps/api/src/auth/controlador-sessao.ts"),
  "utf8",
);
const api = readFileSync(join(raiz, "apps/web/src/lib/api.ts"), "utf8");
const fundacao = readFileSync(
  join(raiz, "apps/web/src/componentes/painel-fundacao.tsx"),
  "utf8",
);
const paginaEntrar = join(
  raiz,
  "apps/web/src/app/f/[slug]/entrar/page.tsx",
);
const provision = readFileSync(
  join(raiz, "apps/api/scripts/lib-provisionar-familia.mjs"),
  "utf8",
);

reg(
  "schema-slug-unico",
  /slug\s+String\s+@unique/.test(schema),
  "Familia.slug @unique",
);
reg(
  "entrar-exige-slug",
  sessao.includes("familiaSlug") &&
    sessao.includes("normalizarSlugFamilia") &&
    controlador.includes("familiaSlug") &&
    controlador.includes("Informe o endereço da família"),
  "POST /sessoes contextual",
);
reg(
  "cliente-envia-slug",
  /entrar\(\s*email:\s*string,\s*senha:\s*string,\s*familiaSlug:\s*string/.test(
    api,
  ) && api.includes("familiaSlug"),
  "api.entrar(familiaSlug)",
);
reg(
  "home-sem-login-global",
  !fundacao.includes("await entrar(") &&
    fundacao.includes("Não há login global") &&
    !fundacao.includes("/f/oliveira"),
  "home sem login global nem atalho fixo",
);
reg(
  "pagina-entrar-familiar",
  existsSync(paginaEntrar),
  "apps/web/src/app/f/[slug]/entrar/page.tsx",
);
reg(
  "provision-privado-transacional",
  provision.includes("$transaction") &&
    provision.includes("administrador") &&
    provision.includes("COLISAO"),
  "CLI/lib provisiona admin em transação",
);

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exit(ok ? 0 : 1);
