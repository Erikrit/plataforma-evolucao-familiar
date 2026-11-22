/** Check estático E1-03: isolamento por família sem revelar existência cruzada. */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const anexos = readFileSync(
  join(raiz, "apps/api/src/anexos/servico-anexos.ts"),
  "utf8",
);
const convites = readFileSync(
  join(raiz, "apps/api/src/convites/servico-convites.ts"),
  "utf8",
);
const acompanhamento = readFileSync(
  join(raiz, "apps/api/src/cuidados/servico-acompanhamento.ts"),
  "utf8",
);
const medicamentos = readFileSync(
  join(raiz, "apps/api/src/cuidados/servico-medicamentos.ts"),
  "utf8",
);
const apiWeb = readFileSync(join(raiz, "apps/web/src/lib/api.ts"), "utf8");
const layout = readFileSync(
  join(raiz, "apps/web/src/app/f/[slug]/layout.tsx"),
  "utf8",
);

reg(
  "anexo-cruzado-not-found",
  anexos.includes("usuario.pessoa.familiaId !== anexo.familiaId") &&
    anexos.includes('throw new NotFoundException("Anexo não encontrado.")'),
  "obterPrivado/vincular sem revelar anexo de outra família",
);
reg(
  "pessoa-cruzada-not-found-acompanhamento",
  acompanhamento.includes(
    "pessoa.familiaId !== usuario.pessoa.familiaId",
  ) &&
    acompanhamento.includes(
      'throw new NotFoundException("Pessoa não encontrada.")',
    ),
  "histórico/PDF sem revelar pessoa de outra família",
);
reg(
  "medicamento-cruzado-not-found",
  medicamentos.includes(
    "med.pessoa.familiaId !== usuario.pessoa.familiaId",
  ),
  "programação por ID escopada à família",
);
reg(
  "ativar-exige-familia-slug",
  convites.includes("familiaSlug") &&
    convites.includes("Convite não é válido neste contexto familiar") &&
    convites.includes("destinoEntrada"),
  "ativação contextual E1-ACE-07",
);
reg(
  "api-web-ativar-slug",
  apiWeb.includes("familiaSlug: string") &&
    apiWeb.includes("destinoEntrada"),
  "cliente envia familiaSlug",
);
reg(
  "pagina-ativar-contextual",
  existsSync(
    join(raiz, "apps/web/src/app/f/[slug]/convites/ativar/page.tsx"),
  ) && layout.includes("convites/ativar"),
  "UI /f/{slug}/convites/ativar pública na família",
);

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exit(ok ? 0 : 1);
