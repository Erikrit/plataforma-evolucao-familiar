/** Check estático E1-02: rotas /f/{slug}, guarda e destinoEntrada contextual. */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const authz = readFileSync(
  join(raiz, "apps/api/src/autorizacoes/servico-autorizacoes.ts"),
  "utf8",
);
const nav = readFileSync(
  join(raiz, "apps/web/src/componentes/navegacao-app.tsx"),
  "utf8",
);
const sessao = readFileSync(
  join(raiz, "apps/web/src/componentes/contexto-sessao.tsx"),
  "utf8",
);
const guarda = readFileSync(
  join(raiz, "apps/web/src/componentes/guarda-contexto-familiar.tsx"),
  "utf8",
);
const rotas = readFileSync(
  join(raiz, "apps/web/src/lib/rotas-familia.ts"),
  "utf8",
);

reg(
  "destino-entrada-com-slug",
  authz.includes("baseFamilia") &&
    authz.includes("familiaSlug") &&
    authz.includes("/gerenciar-familia"),
  "API prefixa /f/{slug}",
);
reg(
  "rotas-familia-helper",
  rotas.includes("rotaFamilia") && rotas.includes("extrairSlugDaUrl"),
  "lib/rotas-familia",
);
reg(
  "guarda-contexto",
  guarda.includes("limparDadosContexto") &&
    guarda.includes("Contexto familiar diferente"),
  "GuardaContextoFamiliar",
);
reg(
  "sessao-limpa-dados",
  sessao.includes("limparDadosContexto") &&
    sessao.includes("contextoUrlCompativel") &&
    sessao.includes("marcarSlugUrl"),
  "contexto-sessao E1-ACE-03",
);
reg(
  "nav-usa-rota-familia",
  nav.includes("rotaFamilia") &&
    nav.includes("contextoUrlCompativel") &&
    nav.includes("Contexto familiar diferente"),
  "navegacao contextual",
);
reg(
  "paginas-familia",
  existsSync(join(raiz, "apps/web/src/app/f/[slug]/page.tsx")) &&
    existsSync(
      join(raiz, "apps/web/src/app/f/[slug]/pessoas/[pessoaId]/page.tsx"),
    ) &&
    existsSync(
      join(raiz, "apps/web/src/app/f/[slug]/gerenciar-familia/page.tsx"),
    ),
  "árvore /f/[slug]",
);

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exit(ok ? 0 : 1);
