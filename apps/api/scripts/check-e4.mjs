/**
 * Checagem estática DEM-E4-BIBLIOTECA (E4-ACE + DEV-JOG-P01..P03).
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
const entradaDesenvolvimento = readFileSync(
  join(
    raiz,
    "apps/web/src/app/f/[slug]/pessoas/[pessoaId]/desenvolvimento/page.tsx",
  ),
  "utf8",
);
const biblioteca = readFileSync(
  join(raiz, "apps/web/src/componentes/desenvolvimento/biblioteca-atividades.tsx"),
  "utf8",
);
const api = readFileSync(join(raiz, "apps/web/src/lib/api.ts"), "utf8");
const acompanhamento = readFileSync(
  join(raiz, "apps/api/src/cuidados/servico-acompanhamento.ts"),
  "utf8",
);

const idsCatalogo = [...catalogo.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
const idsUnicos = new Set(idsCatalogo);
const fichasCuradoria = [
  "O que sumiu?",
  "Mapa do tesouro",
  "História em turnos",
  "Orquestra de casa",
  "Alvo cooperativo",
  "Piquenique em casa",
];

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
    schema.includes("retiradaSemParticipacao") &&
    schema.includes("candidata") &&
    !schema.includes("model ModeloAtividade"),
  "Extensão de Desafio + seleção privada com candidata/exposta/retirada",
);
reg(
  "DEV-JOG-P01-curadoria",
  fichasCuradoria.every((nome) => catalogo.includes(nome)) &&
    idsCatalogo.length === 24,
  "Seis fichas aprovadas no catálogo de 24",
);
reg(
  "E4-ACE-02-sugestoes",
  constantes.includes("LIMITE_SUGESTOES_PESSOA = 2") &&
    sugestoes.includes("LIMITE_SUGESTOES_PESSOA") &&
    !sugestoes.includes("gerarSelecaoInicial") &&
    sugestoes.includes("diversificarPorCategoria") &&
    sugestoes.includes("carregarCandidatas"),
  "Até 2 sugestões sob demanda, sem geração automática na listagem",
);
reg(
  "E4-ACE-03-renovar",
  constantes.includes("LIMITE_RENOVAR_SUGESTOES = 2") &&
    (sugestoes.includes("Não há novas sugestões disponíveis por agora") ||
      constantes.includes("MENSAGEM_SEM_NOVAS_SUGESTOES")) &&
    sugestoes.includes("retiradaSemParticipacao") &&
    controlador.includes("sugestoes/renovar"),
  "Renovar até 2 com prioridade a inéditas e retiradas",
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
  "Escolher/renovar/retirar não concede estrelas nem reabre Executadas",
);
reg(
  "E4-ACE-06-snapshot",
  schema.includes("nomeAplicado") &&
    participacoes.includes("nomeAplicado: desafio.nome") &&
    acompanhamento.includes("nomeAplicado ?? p.desafio.nome"),
  "Snapshot de conteúdo na participação e no histórico",
);
reg(
  "E4-ACE-08-limite-dez",
  constantes.includes("LIMITE_ATIVAS_POR_CATEGORIA = 10") &&
    constantes.includes("MENSAGEM_LIMITE_ATIVAS") &&
    sugestoes.includes("LIMITE_ATIVAS_CATEGORIA") &&
    controlador.includes("sugestoes/:desafioId/retirar"),
  "Limite de 10 ativas por categoria com retirada autorizada",
);
reg(
  "E4-ACE-09-ui-fluxo",
  entradaDesenvolvimento.includes("redirect(rotaFamilia") &&
    entradaDesenvolvimento.includes("/desenvolvimento/biblioteca") &&
    biblioteca.includes("Sugerir brincadeiras") &&
    biblioteca.includes("Renovar sugestões") &&
    biblioteca.includes("Quero experimentar") &&
    biblioteca.includes("Retirar das ativas") &&
    biblioteca.includes("Ver atividades ativas") &&
    biblioteca.includes("Atividades ativas") &&
    api.includes("listarSugestoesDesafio") &&
    api.includes("renovarSugestoesDesafio") &&
    api.includes("retirarAtividadeAtiva") &&
    api.includes("ErroLimiteAtivas"),
  "UI móvel: descoberta sob demanda, ativas, limite e retirada",
);

// DEV-CAT-P08 (DEV-CAT-M1, ticket 06): área Números em API, filtros e leituras do Módulo 04.
const rotulosWeb = readFileSync(join(raiz, "apps/web/src/lib/rotulos-experiencia.ts"), "utf8");
const resumoWeb = readFileSync(join(raiz, "apps/web/src/app/f/[slug]/pessoas/[pessoaId]/resumo/page.tsx"), "utf8");
const historicoWeb = readFileSync(join(raiz, "apps/web/src/app/f/[slug]/pessoas/[pessoaId]/historico/page.tsx"), "utf8");
reg(
  "DEV-CAT-P08-numeros",
  /CATEGORIAS_BIBLIOTECA = \[[^\]]*"numeros"/.test(constantes) &&
    /numeros: "Números"/.test(rotulosWeb) &&
    !/"criatividade",\s*"coordenacao"/.test(sugestoes) &&
    sugestoes.includes("CATEGORIAS_BIBLIOTECA") &&
    resumoWeb.includes("ROTULOS_CATEGORIA_DESENVOLVIMENTO") &&
    historicoWeb.includes("ROTULOS_CATEGORIA_DESENVOLVIMENTO"),
  "Números aceita na API, nos filtros e com rótulo no Histórico e no Resumo; sugestões sem lista fixa",
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
