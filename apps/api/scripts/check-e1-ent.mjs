/** Check estático DEM-E1-ENTRADA: boas-vindas, cadastro e sem atalho fixo. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const ler = (rel) => readFileSync(join(raiz, rel), "utf8");

const boasVindas = ler("apps/web/src/componentes/boas-vindas-familia.tsx");
const pageRoot = ler("apps/web/src/app/page.tsx");
const pageF = ler("apps/web/src/app/f/page.tsx");
const pageCriar = ler("apps/web/src/app/f/criar/page.tsx");
const fundacao = ler("apps/web/src/componentes/painel-fundacao.tsx");
const api = ler("apps/web/src/lib/api.ts");
const slug = ler("apps/api/src/comum/slug-familia.ts");
const servico = ler("apps/api/src/familias/servico-cadastro-familia.ts");
const controlador = ler("apps/api/src/familias/controlador-cadastro-familia.ts");
const entrar = ler("apps/web/src/app/f/[slug]/entrar/page.tsx");

reg(
  "paginas-boas-vindas",
  pageRoot.includes("BoasVindasFamilia") &&
    pageF.includes("BoasVindasFamilia") &&
    boasVindas.includes("Criar minha família") &&
    boasVindas.includes("Acessar minha família"),
  "/ e /f usam boas-vindas",
);
reg(
  "sem-atalho-oliveira",
  !boasVindas.includes("/f/oliveira") &&
    !pageRoot.includes("/f/oliveira") &&
    !pageF.includes("/f/oliveira") &&
    !fundacao.includes("/f/oliveira"),
  "sem link fixo oliveira",
);
reg(
  "pagina-criar",
  existsSync(join(raiz, "apps/web/src/app/f/criar/page.tsx")) &&
    pageCriar.includes("cadastrarFamilia") &&
    pageCriar.includes("Copiar endereço") &&
    pageCriar.includes("Acessar minha família") &&
    !/e-?mail enviado/i.test(pageCriar),
  "/f/criar com confirmação",
);
reg(
  "api-cliente-cadastro",
  api.includes("cadastrarFamilia") && api.includes("/familias"),
  "cliente POST /familias",
);
reg(
  "api-servidor-cadastro",
  controlador.includes('@Post("familias")') &&
    servico.includes("$transaction") &&
    servico.includes("administrador") &&
    slug.includes("SLUGS_RESERVADOS") &&
    slug.includes('"criar"'),
  "cadastro transacional + slug reservado",
);
reg(
  "entrar-retorno-util",
  entrar.includes('href="/f"') && entrar.includes("Criar minha família"),
  "entrar sem família orienta retorno",
);

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exit(ok ? 0 : 1);
