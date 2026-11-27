/**
 * Peso do 2D (DEV-CAT-M1-CONTEUDO, ticket 10), depois de `npm run build`.
 *
 *   node scripts/check-peso-2d.mjs [pasta-do-build] [pasta-do-build-de-referencia]
 *
 * 1. Nenhuma rota carrega a biblioteca 2D no download inicial: ela só vem por `import()`.
 * 2. Com uma referência (build da base sem o 2D), cada rota que existe nas duas
 *    sobe no máximo 2 kB comprimido: o mapa de pedaços sob demanda do webpack e o
 *    rearranjo dos pedaços compartilhados (decisões do responsável de 2026-11-27: 1,5 kB no
 *    ticket 10, 2 kB no ticket 11, com o tabuleiro do Barquinho também sob demanda).
 * Também informa o peso comprimido dos pedaços de cada biblioteca.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const FOLGA_BYTES = 2048;
// Textos internos de cada biblioteca (avisos e faixa de versão), ausentes do código do projeto.
// ADR-018: só o PixiJS; o Phaser continua marcado para acusar se voltar ao build.
const MARCAS = { phaser: /Phaser v"\+/, pixi: /PixiJS (Deprecation|Error|Warning|%c)/ };

const [pastaNova = ".next", pastaBase] = process.argv.slice(2).map((p) => resolve(p));

function ler(pasta, arquivo) {
  return readFileSync(join(pasta, arquivo));
}

function rotasIniciais(pasta) {
  const manifesto = JSON.parse(ler(pasta, "app-build-manifest.json"));
  return new Map(Object.entries(manifesto.pages).map(([rota, arquivos]) => [rota, arquivos.filter((a) => a.endsWith(".js"))]));
}

function comprimido(pasta, arquivo) {
  return gzipSync(ler(pasta, arquivo)).length;
}

function pesoRota(pasta, arquivos) {
  return arquivos.reduce((total, arquivo) => total + comprimido(pasta, arquivo), 0);
}

const novas = rotasIniciais(pastaNova);
const falhas = [];
for (const [rota, arquivos] of novas) {
  for (const arquivo of arquivos) {
    const texto = ler(pastaNova, arquivo).toString("utf8");
    for (const [biblioteca, marca] of Object.entries(MARCAS)) {
      if (marca.test(texto)) falhas.push(`${rota} carrega ${biblioteca} em ${arquivo}`);
    }
  }
}
assert.deepEqual(falhas, [], "biblioteca 2D no download inicial de alguma rota");

const pedacos = join(pastaNova, "static", "chunks");
const pesos = { phaser: 0, pixi: 0 };
for (const arquivo of readdirSync(pedacos).filter((a) => a.endsWith(".js"))) {
  const conteudo = readFileSync(join(pedacos, arquivo));
  for (const [biblioteca, marca] of Object.entries(MARCAS)) {
    if (marca.test(conteudo.toString("utf8"))) pesos[biblioteca] += gzipSync(conteudo).length;
  }
}
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;
console.log(`pedaço principal sob demanda (gzip): phaser ${kb(pesos.phaser)}, pixi ${kb(pesos.pixi)}`);

if (pastaBase) {
  assert.ok(existsSync(join(pastaBase, "app-build-manifest.json")), "build de referência sem manifesto");
  const base = rotasIniciais(pastaBase);
  const linhas = [];
  for (const [rota, arquivos] of base) {
    if (!novas.has(rota)) continue;
    const antes = pesoRota(pastaBase, arquivos);
    const depois = pesoRota(pastaNova, novas.get(rota));
    linhas.push({ rota, antes, depois, diferenca: depois - antes });
  }
  for (const { rota, antes, depois, diferenca } of linhas) {
    if (/biblioteca|jogos|^\/page$|layout/.test(rota)) {
      console.log(`${rota}: ${kb(antes)} → ${kb(depois)} (${diferenca >= 0 ? "+" : ""}${diferenca} B)`);
    }
  }
  const acima = linhas.filter((linha) => linha.diferenca > FOLGA_BYTES);
  assert.deepEqual(acima.map((linha) => `${linha.rota} +${linha.diferenca} B`), [], "rota existente ficou mais pesada");
  console.log(`check-peso-2d: ${linhas.length} rotas sem aumento acima de ${FOLGA_BYTES} B; 2D só sob demanda`);
} else {
  console.log("check-peso-2d: nenhuma rota carrega a biblioteca 2D no download inicial");
}
