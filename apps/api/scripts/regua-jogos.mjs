/**
 * Relatório da régua de qualidade sobre o catálogo carregado (DEV-CAT-M1, ticket 02).
 *
 *   npm run regua:jogos -w @pef/api              # relatório; sai 0 mesmo com falhas
 *   npm run regua:jogos -w @pef/api -- --estrito # sai 1 se o catálogo for reprovado
 *   npm run regua:jogos -w @pef/api -- --json    # saída estruturada
 *
 * O modo relatório é o padrão até os 8 jogos atuais serem refeitos (ticket 09).
 */
import { avaliarCatalogo, CATALOGO_CARREGADO } from "./lib-regua-jogos.mjs";

const args = new Set(process.argv.slice(2));
const relatorio = avaliarCatalogo(CATALOGO_CARREGADO);

if (args.has("--json")) {
  console.log(JSON.stringify(relatorio, null, 2));
} else {
  const onde = (o) => [o.fase && `fase ${o.fase}`, o.variante && `variante ${o.variante}`].filter(Boolean).join(", ");
  for (const jogo of relatorio.jogos) {
    console.log(`\n${jogo.id} (${jogo.tipoMecanica})`);
    for (const fase of jogo.fases) {
      const metricas = Object.entries(fase.metricas).map(([nome, valor]) => `${nome}=${valor}`).join(" ");
      console.log(`  fase ${fase.numero}: ${metricas}`);
    }
    for (const o of relatorio.falhas.filter((item) => item.jogo === jogo.id)) {
      console.log(`  FALHA [${o.regra}] ${onde(o)}: ${o.detalhe}`);
    }
  }
  for (const o of relatorio.falhas.filter((item) => !relatorio.jogos.some((j) => j.id === item.jogo))) {
    console.log(`\nFALHA [${o.regra}] ${o.jogo}: ${o.detalhe}`);
  }
  const porRegra = {};
  relatorio.falhas.forEach((o) => (porRegra[o.regra] = (porRegra[o.regra] ?? 0) + 1));
  console.log(
    `\nregua-jogos: ${relatorio.jogos.length} jogos, ${relatorio.falhas.length} falhas ${JSON.stringify(porRegra)} — ` +
      `catálogo ${relatorio.aprovado ? "APROVADO" : "REPROVADO"}`,
  );
}

if (args.has("--estrito") && !relatorio.aprovado) process.exitCode = 1;
