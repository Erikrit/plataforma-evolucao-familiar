import assert from "node:assert/strict";
import { ServicoAcompanhamento } from "../dist/cuidados/servico-acompanhamento.js";
import { chaveOcorrencia } from "../dist/cuidados/permissoes-cuidados.js";

const dia = "2026-11-22";
const horarios = ["09:00", "11:00", "13:00"];
const pessoa = { id: "teste", familiaId: "familia-teste" };
let consultas = 0;
let leiturasDuplicadas = 0;
let duplicada = false;
let acessoCuidados = true;
let medicamentos = [
  { id: "med1", nome: "Teste 1", programacoes: [{ horarios }] },
  { id: "med2", nome: "Teste 2", programacoes: [{ horarios }] },
  { id: "med3", nome: "Sem programação", programacoes: [] },
];
const chave = chaveOcorrencia("med1", dia, "09:00");
const prisma = {
  pessoa: { findUnique: async () => pessoa },
  medicamento: { findMany: async () => medicamentos },
  consulta: { findMany: async () => [] },
  registroDose: {
    findMany: async ({ where }) => {
      consultas++;
      assert.equal(where.versaoAtiva, true);
      assert.deepEqual(where.ocorrenciaChave.in, ["med1", "med2"].flatMap(
        id => horarios.map(hora => chaveOcorrencia(id, dia, hora)),
      ));
      return [
        { ocorrenciaChave: chave, situacao: "tomou" },
        ...(duplicada ? [{ ocorrenciaChave: chave, situacao: "nao_tomou" }] : []),
      ];
    },
    findFirst: async ({ where }) => {
      leiturasDuplicadas++;
      assert.deepEqual(where, { ocorrenciaChave: chave, versaoAtiva: true });
      return { situacao: "tomou" };
    },
  },
};
const servico = new ServicoAcompanhamento(prisma, {
  podeVerCuidados: async () => acessoCuidados,
  podeVerDesenvolvimento: async () => true,
});
const usuario = { pessoa: { id: pessoa.id, familiaId: pessoa.familiaId } };
const { itens } = await servico.lembretesDerivados(pessoa.id, usuario, dia);
assert.equal(consultas, 1);
assert.equal(leiturasDuplicadas, 0);
duplicada = true;
const comDuplicata = await servico.lembretesDerivados(pessoa.id, usuario, dia);
assert.deepEqual(comDuplicata.itens, itens);
assert.equal(consultas, 2);
assert.equal(leiturasDuplicadas, 1);
acessoCuidados = false;
await assert.rejects(servico.lembretesDerivados(pessoa.id, usuario, dia), { status: 403 });
await assert.rejects(servico.lembretesDerivados(pessoa.id, {
  pessoa: { id: "outra-pessoa", familiaId: "outra-familia" },
}, dia), { status: 404 });
assert.equal(consultas, 2);
assert.equal(itens.length, 6);
assert.deepEqual(itens.map(item => item.horario), [...horarios, ...horarios].sort());
assert.equal(itens[0].estado, "tomou");
assert.ok(itens.slice(1).every(item => item.estado === "sem_confirmacao_apenas_informativo"));
medicamentos = [];
acessoCuidados = true;
assert.deepEqual((await servico.lembretesDerivados(pessoa.id, usuario, dia)).itens, []);
assert.equal(consultas, 2);
console.log("PASS lembretes: seis ocorrências, uma consulta de doses; agenda vazia, zero.");
