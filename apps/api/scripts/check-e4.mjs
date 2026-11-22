/**
 * Checagem estática DEM-E4-BIBLIOTECA (E4-ACE).
 * Não substitui smoke nem homologação humana (E4-HOM).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const schema = readFileSync(
  join(raiz, "apps/api/prisma/schema.prisma"),
  "utf8",
);
const catalogo = readFileSync(
  join(raiz, "apps/api/prisma/catalogo-biblioteca-e4.mjs"),
  "utf8",
);
const constantes = readFileSync(
  join(raiz, "apps/api/src/desenvolvimento/constantes-desenvolvimento.ts"),
  "utf8",
);
const sugestoes = readFileSync(
  join(raiz, "apps/api/src/desenvolvimento/servico-sugestoes.ts"),
  "utf8",
);
const participacoes = readFileSync(
  join(raiz, "apps/api/src/desenvolvimento/servico-participacoes.ts"),
  "utf8",
);
const controlador = readFileSync(
  join(raiz, "apps/api/src/desenvolvimento/controlador-desenvolvimento.ts"),
  "utf8",
);
const page = readFileSync(
  join(
    raiz,
    "apps/web/src/app/f/[slug]/pessoas/[pessoaId]/desenvolvimento/page.tsx",
  ),
  "utf8",
);
const api = readFileSync(join(raiz, "apps/web/src/lib/api.ts"), "utf8");
const acompanhamento = readFileSync(
  join(raiz, "apps/api/src/cuidados/servico-acompanhamento.ts"),
  "utf8",
);

const idsCatalogo = [...catalogo.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
const idsUnicos = new Set(idsCatalogo);

reg(
  "E4-ACE-01-limite-constante",
  constantes.includes("LIMITE_CATALOGO_ATIVO = 24") &&
    catalogo.includes("CATALOGO_BIBLIOTECA_E4") &&
    idsCatalogo.length <= 24 &&
    idsCatalogo.length === idsUnicos.size,
  `Catálogo com ${idsCatalogo.length} ids únicos ≤ 24`,
);
reg(
  "E4-ACE-01-metadados-schema",
  schema.includes("faixaEtariaMin") &&
    schema.includes("origemConteudo") &&
    schema.includes("versaoConteudo") &&
    schema.includes("model SugestaoDesafioPessoa") &&
    !schema.includes("model ModeloAtividade"),
  "Extensão de Desafio + seleção privada (sem segunda tabela global)",
);
reg(
  "E4-ACE-02-sugestoes",
  constantes.includes("LIMITE_SUGESTOES_PESSOA = 6") &&
    sugestoes.includes("LIMITE_SUGESTOES_PESSOA") &&
    sugestoes.includes("gerarSelecaoInicial") &&
    sugestoes.includes("diversificarPorCategoria"),
  "Até 6 sugestões elegíveis com diversificação",
);
reg(
  "E4-ACE-03-renovar",
  constantes.includes("LIMITE_RENOVAR_SUGESTOES = 3") &&
    sugestoes.includes("Não há novas sugestões disponíveis no momento") &&
    sugestoes.includes("!s.escolhida") &&
    controlador.includes("sugestoes/renovar"),
  "Renovar até 3 não escolhidas com mensagem de escassez",
);
reg(
  "E4-ACE-04-persistencia",
  schema.includes("sugestao_desafio_pessoa") &&
    sugestoes.includes("Serializable") &&
    sugestoes.includes("jaEstavaEscolhida") &&
    !sugestoes.includes("desafioGuardado.create"),
  "Seleção própria, concorrência e sem reuso de DesafioGuardado",
);
reg(
  "E4-ACE-05-sem-pontos",
  !sugestoes.includes("estrelasPara") &&
    !sugestoes.includes("movimentoEstrelas") &&
    !sugestoes.includes("disponibilidadeDesafio.upsert") &&
    !sugestoes.includes("participacaoDesafio.create"),
  "Escolher/renovar não concede estrelas nem reabre Executadas",
);
reg(
  "E4-ACE-06-snapshot",
  schema.includes("nomeAplicado") &&
    participacoes.includes("nomeAplicado: desafio.nome") &&
    acompanhamento.includes("nomeAplicado ?? p.desafio.nome"),
  "Snapshot de conteúdo na participação e no histórico",
);
reg(
  "E4-ACE-07-ui",
  page.includes("Sugestões para esta pessoa") &&
    page.includes("Renovar sugestões") &&
    page.includes("Ver biblioteca") &&
    page.includes("Escolher para experimentar") &&
    page.includes("Sem sugestões agora") &&
    api.includes("listarSugestoesDesafio") &&
    api.includes("renovarSugestoesDesafio"),
  "UI móvel com sugestões, renovar e biblioteca existente",
);

const falhas = resultados.filter((r) => !r.ok);
for (const r of resultados) {
  console.log(
    `${r.ok ? "PASS" : "FAIL"} ${r.nome}${r.detalhe ? ` — ${r.detalhe}` : ""}`,
  );
}
if (falhas.length) {
  console.error(`\ncheck-e4: ${falhas.length} falha(s)`);
  process.exit(1);
}
console.log(`\ncheck-e4: ${resultados.length} checagens OK`);
