/**
 * Checagem estática DEM-E2-ACESSOS (E2-ACE-01..07).
 * Não substitui smoke nem homologação humana (E2-ACE-08).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const painel = readFileSync(
  join(raiz, "apps/web/src/componentes/painel-gerenciar-familia.tsx"),
  "utf8",
);
const api = readFileSync(join(raiz, "apps/web/src/lib/api.ts"), "utf8");
const rotas = readFileSync(
  join(raiz, "apps/web/src/lib/rotas-familia.ts"),
  "utf8",
);
const convites = readFileSync(
  join(raiz, "apps/api/src/convites/servico-convites.ts"),
  "utf8",
);
const controlador = readFileSync(
  join(raiz, "apps/api/src/convites/controlador-convites.ts"),
  "utf8",
);
const autorizacoes = readFileSync(
  join(raiz, "apps/api/src/autorizacoes/servico-autorizacoes.ts"),
  "utf8",
);
const boasVindas = readFileSync(
  join(raiz, "apps/web/src/componentes/boas-vindas-familia.tsx"),
  "utf8",
);

reg(
  "ui_gerar_convite",
  painel.includes("Gerar convite") &&
    !painel.includes("Enviar convite") &&
    painel.includes("Convite criado — compartilhe o link para ativar o acesso"),
  "Rótulos sem afirmação de envio",
);
reg(
  "ui_copiar_link",
  painel.includes("Copiar link de ativação") &&
    painel.includes("urlAbsolutaDoApp") &&
    painel.includes("Selecione e copie o link"),
  "Link absoluto + copiar/selecionar",
);
reg(
  "ui_validade",
  painel.includes("formatarValidadeConvite") &&
    painel.includes("Válido até"),
  "Validade exibida após gerar",
);
reg(
  "ui_estados_pessoa",
  painel.includes("rotuloEstadoConta") &&
    api.includes("estadoConta") &&
    autorizacoes.includes("estadoConta"),
  "Estados de conta na lista de pessoas",
);
reg(
  "ui_lista_convites",
  painel.includes("listarConvites") &&
    painel.includes("Convites da família") &&
    painel.includes("rotuloEstadoConvite") &&
    controlador.includes('@Get("familias/:familiaId/convites")'),
  "Listagem administrativa sem token",
);
reg(
  "ui_aba_acessos",
  painel.includes("Acessos e responsabilidades") &&
    api.includes("acompanhará"),
  "Aba e revisão compreensível",
);
reg(
  "api_claim_atomico",
  convites.includes("updateMany") &&
    convites.includes("usadoEm: null") &&
    convites.includes("$transaction"),
  "Ativação com claim atômico do convite",
);
{
  const blocoListar = convites.slice(
    convites.indexOf("async listar"),
    convites.indexOf("async criar"),
  );
  reg(
    "api_listar_sem_token",
    blocoListar.includes("estado: estadoDoConvite") &&
      !blocoListar.includes("token"),
    "GET convites não seleciona token",
  );
}
reg(
  "rotas_link_contextual",
  rotas.includes("caminhoAtivacaoConvite") &&
    rotas.includes("origemDoApp") &&
    !rotas.includes("localhost:3000"),
  "Montagem de link sem localhost fixo",
);
reg(
  "boas_vindas_sem_envio",
  // Verifica o sentido (link compartilhado, sem promessa de envio), não a frase exata.
  /link[^"<]*compartilh/i.test(boasVindas) &&
    !/link[^"<]*enviad|e-?mail (?:enviado|com o convite)|enviaremos/i.test(boasVindas),
  "Boas-vindas sem expectativa de e-mail",
);

// Ticket 11 (pedido do H1): área, data de nascimento e, por último, a responsabilidade.
const ordemCampos = (data, responsabilidade) => {
  const i = painel.indexOf(data);
  const j = painel.indexOf(responsabilidade);
  return i > 0 && j > 0 && i < j;
};
reg(
  "ticket-11-ordem-dos-campos",
  ordemCampos("{pedeDataConcessao ? (", "combinacoesAreaConcessao,") &&
    ordemCampos("{pedeDataConvite ? (", "combinacoesAreaConvite,"),
  "Data logo depois da área e responsabilidade por último, na concessão e no convite",
);

const falhas = resultados.filter((r) => !r.ok);
for (const r of resultados) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.nome} — ${r.detalhe}`);
}
if (falhas.length) {
  console.error(`\ncheck-e2: ${falhas.length} falha(s)`);
  process.exit(1);
}
console.log(`\ncheck-e2: ${resultados.length} checagens OK`);
