/**
 * Checagem estática DEM-E3-EXAMES-RESUMO (E3-EX / E3-RES).
 * Não substitui smoke nem homologação humana (E3-HOM).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const consultas = readFileSync(
  join(
    raiz,
    "apps/web/src/app/f/[slug]/pessoas/[pessoaId]/cuidados/consultas/page.tsx",
  ),
  "utf8",
);
const resumo = readFileSync(
  join(raiz, "apps/web/src/app/f/[slug]/pessoas/[pessoaId]/resumo/page.tsx"),
  "utf8",
);
const api = readFileSync(join(raiz, "apps/web/src/lib/api.ts"), "utf8");
const anexos = readFileSync(
  join(raiz, "apps/api/src/anexos/servico-anexos.ts"),
  "utf8",
);
const acompanhamento = readFileSync(
  join(raiz, "apps/api/src/cuidados/servico-acompanhamento.ts"),
  "utf8",
);

reg(
  "E3-EX-01-ui-baixar",
  consultas.includes("Baixar arquivo") &&
    consultas.includes("obterAnexoPrivado") &&
    consultas.includes("baixarBytesBase64") &&
    !consultas.includes("visualizador") &&
    !consultas.includes("pdf.js") &&
    !consultas.includes("react-pdf"),
  "Detalhe do exame com download e sem viewer embutido",
);
reg(
  "E3-EX-02-contexto",
  consultas.includes("aplicativo do seu dispositivo") &&
    consultas.includes("abertura automática não é garantida") &&
    consultas.includes("Tentar novamente"),
  "Microcopy de abertura externa e retry",
);
reg(
  "E3-EX-03-authz-api",
  anexos.includes("podeConsultarAnexosCuidados") &&
    api.includes("obterAnexoPrivado") &&
    api.includes("Sem permissão para baixar este documento"),
  "Download autenticado com autorização ACE-C09",
);
reg(
  "E3-EX-04-estados",
  consultas.includes("Sem documento anexado") &&
    consultas.includes("Arquivo indisponível") &&
    consultas.includes("sem permissão para baixar"),
  "Estados sem anexo / indisponível / negado",
);
reg(
  "E3-EX-05-cadastro",
  consultas.includes("Registrar exame") &&
    consultas.includes("exameArquivo") &&
    !consultas.includes("transcrição") &&
    !consultas.includes("resultado do exame"),
  "Cadastro mínimo preservado",
);
reg(
  "E3-RES-01-entrada-unica",
  resumo.includes("Resumo") &&
    resumo.includes("Últimos 7 dias") &&
    resumo.includes("podeCuidados") &&
    resumo.includes("podeDesenvolvimento") &&
    !resumo.includes("visualizador"),
  "Uma entrada Resumo com período e blocos por área",
);
reg(
  "E3-RES-02-cuidados",
  resumo.includes("tomadasInformadas") &&
    resumo.includes("semConfirmacao") &&
    resumo.includes("sem confirmação") &&
    resumo.includes("temDocumento") &&
    resumo.includes("documento disponível no app") &&
    acompanhamento.includes("temDocumento: Boolean(e.anexoId)"),
  "Cuidados com estados e exames factuais",
);
reg(
  "E3-RES-03-desenvolvimento",
  resumo.includes("Desenvolvimento") &&
    resumo.includes("estrelas") &&
    resumo.includes("Categorias") &&
    !resumo.includes("ranking"),
  "Desenvolvimento sem ranking",
);
reg(
  "E3-RES-04-vazios-fontes",
  resumo.includes("Nenhum registro de Cuidados neste período") &&
    resumo.includes("Ver origem em Cuidados") &&
    resumo.includes("setResumoCuidados(null)") &&
    resumo.includes("Abrir Consultas e exames"),
  "Vazios neutros, fontes e limpeza ao trocar período",
);
reg(
  "E3-RES-05-pdf",
  resumo.includes("Preparar PDF") &&
    resumo.includes("Baixar PDF") &&
    acompanhamento.includes("Exames (sem anexos embutidos)") &&
    acompanhamento.includes("não incluído"),
  "Prévia/PDF sem embutir laudos",
);
reg(
  "E3-sem-viewer-global",
  !api.includes("react-pdf") &&
    !api.includes("pdfjs") &&
    api.includes("baixarBytesBase64") &&
    api.includes("revokeObjectURL"),
  "Download local com URL temporária liberada",
);

const falhas = resultados.filter((r) => !r.ok);
for (const r of resultados) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.nome}${r.detalhe ? ` — ${r.detalhe}` : ""}`);
}
if (falhas.length) {
  console.error(`\ncheck-e3: ${falhas.length} falha(s)`);
  process.exit(1);
}
console.log(`\ncheck-e3: ${resultados.length} checagens OK`);
