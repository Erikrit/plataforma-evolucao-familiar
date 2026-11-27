/**
 * Régua das Atividades Reais sobre o catálogo versionado, sem banco (DEV-CAT-M1-CONTEUDO, ticket 01).
 *
 *   npm run regua:atividades -w @pef/api           # fichas + matriz de cobertura; sai 1 se alguma ficha reprovar
 *                                                  # ou se faltar atividade em alguma faixa × área (desde o ticket 02)
 *                                                  # ou se a cobertura por faixa não atender COBERTURA_FAIXA (ticket 03)
 *   npm run regua:atividades -w @pef/api -- --json # saída estruturada
 *
 * Buracos de duração, lugar e pessoas são relatados e não mudam a saída.
 */
import { CATALOGO_BIBLIOTECA_E4 } from "../prisma/catalogo-biblioteca-e4.mjs";
import { AREAS, FAIXAS, avaliarAtividades } from "./lib-regua-atividades.mjs";

const relatorio = avaliarAtividades(CATALOGO_BIBLIOTECA_E4);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(relatorio, null, 2));
} else {
  for (const falha of relatorio.falhas) {
    console.log(`FALHA [${falha.regra}] ${falha.atividade}: ${falha.detalhe}`);
  }
  const { matriz } = relatorio;
  const largura = Math.max(...AREAS.map((a) => a.length));
  console.log(`\nMatriz faixa × área (${relatorio.atividades.length} ativas)`);
  console.log(`${"".padEnd(largura)}  ${FAIXAS.map((f) => f.id.padStart(8)).join(" ")}`);
  for (const area of AREAS) {
    console.log(`${area.padEnd(largura)}  ${FAIXAS.map((f) => String(matriz.faixaArea[f.id][area]).padStart(8)).join(" ")}`);
  }
  const linha = (rotulo, contagem) =>
    console.log(`${rotulo}: ${Object.entries(contagem).map(([k, n]) => `${k}=${n}`).join(" ")}`);
  console.log("");
  linha("faixa", matriz.faixa);
  linha("duração", matriz.duracao);
  linha("lugar", matriz.lugar);
  linha("pessoas", matriz.pessoas);
  console.log(`combinações faixa × área × duração × lugar × pessoas preenchidas: ${matriz.combinacoes.length} (lista completa com --json)`);
  for (const pendencia of relatorio.pendenciasDeFaixa) console.log(`PENDÊNCIA [faixa] ${pendencia}`);
  if (relatorio.buracos.length) console.log(`\nBuracos (${relatorio.buracos.length}): ${relatorio.buracos.join("; ")}`);
  console.log(
    `\nregua-atividades: ${relatorio.atividades.length} ativas, ${relatorio.falhas.length} falhas — ` +
      `fichas ${relatorio.aprovado ? "APROVADAS" : "REPROVADAS"}, ${relatorio.buracosDeArea.length} buracos de área, ` +
      `${relatorio.pendenciasDeFaixa.length} pendências de faixa`,
  );
}

if (!relatorio.catalogoAprovado) process.exitCode = 1;
