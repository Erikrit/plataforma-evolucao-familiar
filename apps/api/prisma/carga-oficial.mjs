/**
 * Carga oficial de catálogos (E4 + E5 piloto, CAT-03 e CAT-04).
 * Idempotente por chaves estáveis; sem famílias, contas, cuidados ou progresso.
 * Separada do seed fictício de desenvolvimento.
 */
import { PrismaClient } from "@prisma/client";
import { pathToFileURL } from "node:url";
import { CATALOGO_BIBLIOTECA_E4 } from "./catalogo-biblioteca-e4.mjs";
import { CATALOGO_JOGOS_PILOTO_E5 } from "./catalogo-jogos-piloto-e5.mjs";
import { CATALOGO_JOGOS_EXPANSAO_E5 } from "./catalogo-jogos-expansao-e5.mjs";
import { CATALOGO_JOGOS_HISTORIAS_E5 } from "./catalogo-jogos-historias-e5.mjs";

const PUBLICADO_EM = new Date("2026-11-22T00:00:00.000Z");
const CATALOGO_JOGOS_E5 = [
  ...CATALOGO_JOGOS_PILOTO_E5,
  ...CATALOGO_JOGOS_EXPANSAO_E5,
  ...CATALOGO_JOGOS_HISTORIAS_E5,
];

export async function carregarCatalogosOficiais(prisma) {
  if (CATALOGO_BIBLIOTECA_E4.length !== 24) {
    throw new Error(
      `Catálogo E4 deve ter 24 modelos; encontrado ${CATALOGO_BIBLIOTECA_E4.length}.`,
    );
  }
  if (CATALOGO_JOGOS_PILOTO_E5.length !== 3) {
    throw new Error(
      `Piloto E5 deve ter 3 jogos; encontrado ${CATALOGO_JOGOS_PILOTO_E5.length}.`,
    );
  }
  if (CATALOGO_JOGOS_EXPANSAO_E5.length !== 4) {
    throw new Error(
      `Expansão E5 CAT-03 deve ter 4 jogos; encontrado ${CATALOGO_JOGOS_EXPANSAO_E5.length}.`,
    );
  }
  if (CATALOGO_JOGOS_HISTORIAS_E5.length !== 1) {
    throw new Error(
      `Histórias E5 CAT-04 deve ter 1 jogo; encontrado ${CATALOGO_JOGOS_HISTORIAS_E5.length}.`,
    );
  }

  const totalFases = CATALOGO_JOGOS_E5.reduce(
    (acc, jogo) => acc + jogo.fases.length,
    0,
  );
  if (totalFases !== 40) {
    throw new Error(`E5 oficial (piloto+CAT-03+CAT-04) deve ter 40 fases; encontrado ${totalFases}.`);
  }

  const idsEsperados = [
    "memoria",
    "sequencia",
    "labirinto",
    "pares-sombras",
    "ache-intruso",
    "palavra-figura",
    "historias-cenas",
    "entrega-jardim",
  ];
  for (const id of idsEsperados) {
    if (!CATALOGO_JOGOS_E5.some((jogo) => jogo.id === id)) {
      throw new Error(`E5 oficial sem jogo obrigatório: ${id}`);
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const item of CATALOGO_BIBLIOTECA_E4) {
      await tx.desafio.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          familiaId: null,
          nome: item.nome,
          instrucao: item.instrucao,
          categoria: item.categoria,
          dificuldade: item.dificuldade,
          materiais: item.materiais,
          duracaoMinutos: item.duracaoMinutos,
          faixaEtariaMin: item.faixaEtariaMin,
          faixaEtariaMax: item.faixaEtariaMax,
          origemConteudo: "autoral_pef",
          versaoConteudo: 1,
          adaptacoes: item.adaptacoes,
          supervisao: item.supervisao,
          origem: "catalogo",
          ativo: true,
        },
        update: {
          nome: item.nome,
          instrucao: item.instrucao,
          categoria: item.categoria,
          dificuldade: item.dificuldade,
          materiais: item.materiais,
          duracaoMinutos: item.duracaoMinutos,
          faixaEtariaMin: item.faixaEtariaMin,
          faixaEtariaMax: item.faixaEtariaMax,
          origemConteudo: "autoral_pef",
          versaoConteudo: 1,
          adaptacoes: item.adaptacoes,
          supervisao: item.supervisao,
          origem: "catalogo",
          ativo: true,
          familiaId: null,
        },
      });
    }

    for (const jogo of CATALOGO_JOGOS_E5) {
      await tx.jogoDigital.upsert({
        where: { id: jogo.id },
        create: {
          id: jogo.id,
          nome: jogo.nome,
          descricao: jogo.descricao,
          categoria: jogo.categoria,
          instrucoes: jogo.instrucoes,
          tipoMecanica: jogo.tipoMecanica,
          versao: jogo.versao,
          faixaEtariaMin: jogo.faixaEtariaMin,
          faixaEtariaMax: jogo.faixaEtariaMax,
          ativo: true,
          publicadoEm: PUBLICADO_EM,
          ordemEditorial: jogo.ordemEditorial,
          capaRef: null,
        },
        update: {
          nome: jogo.nome,
          descricao: jogo.descricao,
          categoria: jogo.categoria,
          instrucoes: jogo.instrucoes,
          tipoMecanica: jogo.tipoMecanica,
          versao: jogo.versao,
          faixaEtariaMin: jogo.faixaEtariaMin,
          faixaEtariaMax: jogo.faixaEtariaMax,
          ativo: true,
          publicadoEm: PUBLICADO_EM,
          ordemEditorial: jogo.ordemEditorial,
          capaRef: null,
        },
      });

      for (const fase of jogo.fases) {
        await tx.faseJogoDigital.upsert({
          where: {
            jogoId_numero: { jogoId: jogo.id, numero: fase.numero },
          },
          create: {
            jogoId: jogo.id,
            numero: fase.numero,
            titulo: fase.titulo,
            objetivo: fase.objetivo,
            dificuldade: fase.dificuldade,
            configuracao: fase.configuracao,
            versao: jogo.versao,
          },
          update: {
            titulo: fase.titulo,
            objetivo: fase.objetivo,
            dificuldade: fase.dificuldade,
            configuracao: fase.configuracao,
            versao: jogo.versao,
          },
        });
      }
    }
  });

  const [
    desafiosCatalogo,
    jogos,
    fases,
    familias,
    usuarios,
    medicamentos,
    progresso,
  ] = await Promise.all([
    prisma.desafio.count({ where: { familiaId: null, origem: "catalogo", ativo: true } }),
    prisma.jogoDigital.count(),
    prisma.faseJogoDigital.count(),
    prisma.familia.count(),
    prisma.usuario.count(),
    prisma.medicamento.count(),
    prisma.progressoFaseJogo.count(),
  ]);

  return {
    ok: true,
    e4Modelos: desafiosCatalogo,
    e5Jogos: jogos,
    e5Fases: fases,
    familias,
    usuarios,
    medicamentos,
    progresso,
  };
}

const executadoDireto =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (executadoDireto) {
  const prisma = new PrismaClient();
  try {
    const resumo = await carregarCatalogosOficiais(prisma);
    console.log(JSON.stringify(resumo, null, 2));
  } catch (erro) {
    console.error(
      JSON.stringify({
        ok: false,
        mensagem: erro instanceof Error ? erro.message : String(erro),
      }),
    );
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
