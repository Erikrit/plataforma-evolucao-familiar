/**
 * Régua das Atividades Reais (M03 §15, linha "Atividade real"; DEV-CAT-M1-CONTEUDO, ticket 01).
 * Rodar: npm run test:regua-atividades -w @pef/api
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { CATALOGO_BIBLIOTECA_E4 } from "../prisma/catalogo-biblioteca-e4.mjs";
import { AREAS, FAIXAS, avaliarAtividades, faixasDaAtividade } from "./lib-regua-atividades.mjs";

function ficha(extra = {}) {
  return {
    id: "atividade_teste",
    nome: "Atividade de teste",
    instrucao: "Brincar juntos de um jeito simples.",
    categoria: "numeros",
    materiais: "Nenhum.",
    duracaoMinutos: 10,
    faixaEtariaMin: 5,
    faixaEtariaMax: 9,
    passos: ["Combinem a regra.", "Brinquem em turnos."],
    variacaoFacil: "Façam com menos itens.",
    variacaoDificil: "Façam com mais itens.",
    adaptacaoSentado: "Brinquem à mesa.",
    seguranca: { pequenos: ["Adulto por perto."], medios: ["Espaço livre no chão."] },
    lugar: "dentro_de_casa",
    pessoasMin: 2,
    pessoasMax: 4,
    ...extra,
  };
}

const regrasDe = (relatorio) => relatorio.falhas.map((falha) => falha.regra);

test("ficha completa é aprovada", () => {
  const relatorio = avaliarAtividades([ficha()]);
  assert.deepEqual(relatorio.falhas, []);
  assert.equal(relatorio.aprovado, true);
});

test("ficha sem segurança reprova", () => {
  const relatorio = avaliarAtividades([ficha({ seguranca: null })]);
  assert.equal(relatorio.aprovado, false);
  assert.deepEqual(regrasDe(relatorio), ["seguranca"]);
});

test("segurança faltando para uma das faixas cobertas reprova", () => {
  const relatorio = avaliarAtividades([ficha({ seguranca: { pequenos: ["Adulto por perto."] } })]);
  assert.deepEqual(
    relatorio.falhas.map((f) => [f.regra, f.detalhe]),
    [["seguranca", "faltam itens de segurança para medios"]],
  );
});

test("segurança para faixa que a atividade não cobre reprova", () => {
  const relatorio = avaliarAtividades([
    ficha({ seguranca: { pequenos: ["a"], medios: ["b"], grandes: ["c"] } }),
  ]);
  assert.deepEqual(
    relatorio.falhas.map((f) => [f.regra, f.detalhe]),
    [["seguranca", "segurança para faixa fora da atividade: grandes"]],
  );
});

test("mais de três passos reprova, e zero passos também", () => {
  const quatro = avaliarAtividades([ficha({ passos: ["a", "b", "c", "d"] })]);
  assert.deepEqual(regrasDe(quatro), ["passos"]);
  const nenhum = avaliarAtividades([ficha({ passos: [] })]);
  assert.deepEqual(regrasDe(nenhum), ["passos"]);
  const vazio = avaliarAtividades([ficha({ passos: ["a", "  "] })]);
  assert.deepEqual(regrasDe(vazio), ["passos"]);
});

test("ficha sem variação mais fácil ou mais difícil reprova", () => {
  assert.deepEqual(regrasDe(avaliarAtividades([ficha({ variacaoFacil: null })])), ["variacoes"]);
  assert.deepEqual(regrasDe(avaliarAtividades([ficha({ variacaoDificil: " " })])), ["variacoes"]);
});

test("ficha sem adaptação para brincar sentado reprova", () => {
  assert.deepEqual(regrasDe(avaliarAtividades([ficha({ adaptacaoSentado: undefined })])), ["sentado"]);
});

test("objetivo, materiais, duração, área, faixa, lugar e pessoas são obrigatórios", () => {
  const relatorio = avaliarAtividades([
    ficha({
      instrucao: "",
      materiais: null,
      duracaoMinutos: 0,
      categoria: "inexistente",
      faixaEtariaMin: 4,
      lugar: "praia",
      pessoasMin: 3,
      pessoasMax: 2,
      seguranca: { pequenos: ["a"], medios: ["b"] },
    }),
  ]);
  assert.deepEqual(
    [...new Set(regrasDe(relatorio))].sort(),
    ["area", "duracao", "faixa", "lugar", "materiais", "objetivo", "pessoas"],
  );
});

test("nomes repetidos entre ativas reprovam; arquivadas não entram na régua", () => {
  const repetidas = avaliarAtividades([ficha({ id: "a" }), ficha({ id: "b" })]);
  assert.deepEqual(regrasDe(repetidas), ["nome"]);
  const arquivada = avaliarAtividades([ficha({ id: "a" }), { id: "velha", nome: "Atividade de teste", ativo: false }]);
  assert.deepEqual(arquivada.falhas, []);
  assert.equal(arquivada.atividades.length, 1);
});

test("faixas cobertas seguem D1: Pequenos 5–6, Médios 7–9, Grandes 10–12", () => {
  assert.deepEqual(faixasDaAtividade({ faixaEtariaMin: 5, faixaEtariaMax: 6 }), ["pequenos"]);
  assert.deepEqual(faixasDaAtividade({ faixaEtariaMin: 6, faixaEtariaMax: 7 }), ["pequenos", "medios"]);
  assert.deepEqual(faixasDaAtividade({ faixaEtariaMin: 8, faixaEtariaMax: 12 }), ["medios", "grandes"]);
});

test("matriz de cobertura conta faixa × área e cada dimensão, e aponta os buracos", () => {
  const relatorio = avaliarAtividades([
    ficha(),
    ficha({
      id: "b",
      nome: "Outra",
      categoria: "linguagem",
      faixaEtariaMin: 10,
      faixaEtariaMax: 12,
      duracaoMinutos: 25,
      lugar: "ambos",
      pessoasMin: 2,
      pessoasMax: 2,
      seguranca: { grandes: ["Espaço livre."] },
    }),
  ]);
  const { matriz } = relatorio;
  assert.equal(matriz.faixaArea.pequenos.numeros, 1);
  assert.equal(matriz.faixaArea.medios.numeros, 1);
  assert.equal(matriz.faixaArea.grandes.linguagem, 1);
  assert.equal(matriz.faixaArea.grandes.numeros, 0);
  assert.deepEqual(matriz.faixa, { pequenos: 1, medios: 1, grandes: 1 });
  assert.deepEqual(matriz.duracao, { curta: 1, media: 0, longa: 1 });
  assert.deepEqual(matriz.lugar, { dentro_de_casa: 2, area_externa: 1 });
  assert.deepEqual(matriz.pessoas, { individual: 0, dupla: 2, grupo: 1 });
  assert.ok(relatorio.buracos.includes("faixa×área: grandes × numeros"));
  assert.ok(relatorio.buracos.includes("área: memoria_atencao"));
  assert.ok(relatorio.buracos.includes("duração: media"));
  assert.equal(relatorio.aprovado, true, "buracos são relatados, não reprovam a ficha");
  assert.ok(relatorio.buracosDeArea.includes("faixa×área: grandes × numeros"));
  assert.ok(relatorio.buracosDeArea.includes("área: memoria_atencao"));
  assert.ok(!relatorio.buracosDeArea.includes("duração: media"), "duração, lugar e pessoas não são buraco de área");
});

test("catálogo que cobre toda faixa × área não tem buraco de área", () => {
  const faixas = FAIXAS.map((f) => [f.min, f.max, f.id]);
  const catalogo = AREAS.flatMap((area) =>
    faixas.map(([min, max, faixa]) =>
      ficha({ id: `${area}_${faixa}`, nome: `${area} ${faixa}`, categoria: area, faixaEtariaMin: min, faixaEtariaMax: max, seguranca: { [faixa]: ["Ok."] } }),
    ),
  );
  assert.deepEqual(avaliarAtividades(catalogo).buracosDeArea, []);
});

test("matriz emite a combinação completa faixa × área × duração × lugar × pessoas", () => {
  const { matriz } = avaliarAtividades([
    ficha({ faixaEtariaMin: 10, faixaEtariaMax: 12, duracaoMinutos: 25, lugar: "ambos", pessoasMin: 1, pessoasMax: 2, seguranca: { grandes: ["Ok."] } }),
  ]);
  const chave = (c) => [c.faixa, c.area, c.duracao, c.lugar, c.pessoas].join("|");
  assert.deepEqual(matriz.combinacoes.map(chave).sort(), [
    "grandes|numeros|longa|area_externa|dupla",
    "grandes|numeros|longa|area_externa|individual",
    "grandes|numeros|longa|dentro_de_casa|dupla",
    "grandes|numeros|longa|dentro_de_casa|individual",
  ]);
  assert.ok(matriz.combinacoes.every((c) => c.quantidade === 1));
});

test("atividade de uma pessoa entra na matriz como individual", () => {
  const { matriz } = avaliarAtividades([ficha({ pessoasMin: 1, pessoasMax: 1 })]);
  assert.deepEqual(matriz.pessoas, { individual: 1, dupla: 0, grupo: 0 });
});

test("áreas da régua são as mesmas de CATEGORIAS_BIBLIOTECA na API", () => {
  const constantes = readFileSync(new URL("../src/desenvolvimento/constantes-desenvolvimento.ts", import.meta.url), "utf8");
  const bloco = constantes.match(/CATEGORIAS_BIBLIOTECA = \[([^\]]*)\]/)[1];
  assert.deepEqual(AREAS, [...bloco.matchAll(/"([a-z_]+)"/g)].map((m) => m[1]));
});

test("Régua de qualidade (Atividade real): as 40 atividades ativas passam na ficha padrão (ticket 02)", () => {
  const relatorio = avaliarAtividades(CATALOGO_BIBLIOTECA_E4);
  assert.equal(relatorio.atividades.length, 40);
  assert.deepEqual(relatorio.falhas, []);
});

test("matriz de cobertura sem buraco nas áreas: toda faixa tem atividade em cada área (ticket 02)", () => {
  assert.deepEqual(avaliarAtividades(CATALOGO_BIBLIOTECA_E4).buracosDeArea, []);
});

test("DEV-CAT-P08: pelo menos 6 atividades ativas de Números", () => {
  const numeros = CATALOGO_BIBLIOTECA_E4.filter((a) => a.ativo !== false && a.categoria === "numeros");
  assert.ok(numeros.length >= 6, `${numeros.length} atividades de Números`);
});
