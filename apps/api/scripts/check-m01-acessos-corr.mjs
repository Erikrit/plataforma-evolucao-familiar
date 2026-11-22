/**
 * Checagem estática AC-01..07 da correção M01 Acessos (textos e fluxos na UI).
 * Não substitui smoke de autorização nem homologação humana (AC-09).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const painel = readFileSync(
  join(raiz, "apps/web/src/componentes/painel-gerenciar-familia.tsx"),
  "utf8",
);
const api = readFileSync(join(raiz, "apps/web/src/lib/api.ts"), "utf8");
const servico = readFileSync(
  join(raiz, "apps/api/src/autorizacoes/servico-autorizacoes.ts"),
  "utf8",
);

const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

reg(
  "ui_visao_por_pessoa",
  painel.includes('label: "Por pessoa acompanhada"'),
  "SegmentedControl por pessoa",
);
reg(
  "ui_visao_por_participante",
  painel.includes('label: "Por participante"'),
  "SegmentedControl por participante",
);
reg(
  "ui_bloco_administracao",
  painel.includes("Administração da família") &&
    api.includes("TEXTO_ADMINISTRACAO_FAMILIA"),
  "Bloco + texto referência",
);
reg(
  "ui_escolha_explicita_cuidados",
  painel.includes("setResponsabilidadeConcessao(null)") &&
    painel.includes("setResponsabilidadeConvite(null)") &&
    painel.includes("Escolha explicitamente Responsável ou Integrante"),
  "Limpa escolha ao voltar a Cuidados",
);
reg(
  "ui_resumo_integrante",
  api.includes("registrar apoio e doses") &&
    api.includes("Programação, anexos clínicos e exportação"),
  "Texto Integrante",
);
reg(
  "ui_resumo_responsavel_cuidados",
  api.includes("programar, consultar anexos e exportar"),
  "Texto Responsável Cuidados",
);
reg(
  "ui_revisao_efeito",
  api.includes("textoRevisaoAcesso") &&
    painel.includes("textoRevisaoAcesso") &&
    (api.includes("Quando entrar,") || api.includes("acompanhará")),
  "Revisão descreve efeito",
);
reg(
  "ui_convite_revisao",
  painel.includes("etapaConfirmacaoConvite") &&
    painel.includes("Gerar convite") &&
    !painel.includes("Enviar convite") &&
    api.includes("Após a ativação"),
  "Convite com revisão (gerar, sem envio)",
);
reg(
  "api_participanteUsuarioId",
  servico.includes("participanteUsuarioId: linha.usuario.id"),
  "GET /acessos expõe participanteUsuarioId",
);
reg(
  "ui_revoga_contexto",
  painel.includes("textoConfirmacaoRevoga") &&
    painel.includes("Pessoa acompanhada:"),
  "Confirmação de retirada contextual",
);

const falhas = resultados.filter((r) => !r.ok);
for (const r of resultados) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.nome} — ${r.detalhe}`);
}
if (falhas.length) {
  console.error(`\n${falhas.length} checagem(ns) falharam.`);
  process.exit(1);
}
console.log(`\nOK ${resultados.length} checagens estáticas M01 acessos.`);
