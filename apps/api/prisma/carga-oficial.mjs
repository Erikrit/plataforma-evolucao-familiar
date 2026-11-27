/**
 * Carga oficial de catálogos (E4 + E5 piloto, CAT-03 e CAT-04; trilhas do DEV-CAT-M1).
 * Idempotente por chaves estáveis; sem famílias, contas, cuidados ou progresso.
 * Separada do seed fictício de desenvolvimento.
 */
import { Prisma, PrismaClient } from "@prisma/client";
import { pathToFileURL } from "node:url";
import { CATALOGO_BIBLIOTECA_E4 } from "./catalogo-biblioteca-e4.mjs";
import { CATALOGO_JOGOS_PILOTO_E5 } from "./catalogo-jogos-piloto-e5.mjs";
import { CATALOGO_JOGOS_EXPANSAO_E5 } from "./catalogo-jogos-expansao-e5.mjs";
import { CATALOGO_JOGOS_HISTORIAS_E5 } from "./catalogo-jogos-historias-e5.mjs";
import { CATALOGO_JOGOS_MARCO1_E5 } from "./catalogo-jogos-marco1-e5.mjs";
import { CATALOGO_JOGOS_MEMORIA_ESCOLHA_E5 } from "./catalogo-jogos-memoria-escolha-e5.mjs";
import { trilhaDaFase } from "./trilhas-jogos.mjs";

const PUBLICADO_EM = new Date("2026-11-22T00:00:00.000Z");
const CATALOGO_JOGOS_E5 = [
  ...CATALOGO_JOGOS_PILOTO_E5,
  ...CATALOGO_JOGOS_EXPANSAO_E5,
  ...CATALOGO_JOGOS_HISTORIAS_E5,
  ...CATALOGO_JOGOS_MARCO1_E5,
  ...CATALOGO_JOGOS_MEMORIA_ESCOLHA_E5,
];

/**
 * Campos gravados de uma Atividade Real do catálogo, com a ficha padrão (DEV-CAT-M1-CONTEUDO,
 * ticket 01). Única tradução catálogo → banco: carga oficial e smoke:e4 usam esta.
 */
export function dadosDesafioCatalogo(item) {
  return {
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
    versaoConteudo: item.versaoConteudo ?? 1,
    passos: item.passos ?? [],
    variacaoFacil: item.variacaoFacil ?? null,
    variacaoDificil: item.variacaoDificil ?? null,
    adaptacaoSentado: item.adaptacaoSentado ?? null,
    seguranca: item.seguranca ?? Prisma.DbNull,
    lugar: item.lugar ?? null,
    pessoasMin: item.pessoasMin ?? null,
    pessoasMax: item.pessoasMax ?? null,
    origem: "catalogo",
    ativo: item.ativo !== false,
  };
}

export async function carregarCatalogosOficiais(prisma) {
  if (CATALOGO_BIBLIOTECA_E4.length !== 64) {
    throw new Error(
      `Catálogo E4 deve ter 64 modelos; encontrado ${CATALOGO_BIBLIOTECA_E4.length}.`,
    );
  }
  // As contagens vêm do catálogo (DEV-CAT-M1, ticket 03): cada jogo numera as fases
  // de 1 a N, sem lacunas, e a trilha declarada confere com o número.
  const fasesComTrilha = new Map();
  for (const jogo of CATALOGO_JOGOS_E5) {
    const numeros = jogo.fases.map((fase) => fase.numero);
    if (numeros.length === 0 || numeros.some((numero, indice) => numero !== indice + 1)) {
      throw new Error(`Jogo ${jogo.id}: fases devem ser numeradas de 1 a N; encontrado ${numeros.join(",")}.`);
    }
    for (const fase of jogo.fases) {
      const trilha = trilhaDaFase(fase.numero);
      if (fase.trilha != null && fase.trilha !== trilha) {
        throw new Error(`Jogo ${jogo.id}, fase ${fase.numero}: trilha ${fase.trilha} não confere com ${trilha}.`);
      }
      fasesComTrilha.set(fase, trilha);
    }
  }

  // Ticket 12: jogos ativos do Marco 1; os arquivados seguem na carga com ativo: false.
  const idsEsperados = [
    "memoria",
    "labirinto",
    "historias-cenas",
    "entrega-jardim",
    "sudoku-figuras",
    "forme-palavra",
    "menor-maior",
    "robo-setas",
    // DEV-CAT-M1-CONTEUDO, ticket 04.
    "letra-inicial",
    "adivinha-pista",
  ];
  for (const id of idsEsperados) {
    if (!CATALOGO_JOGOS_E5.some((jogo) => jogo.id === id && jogo.ativo !== false)) {
      throw new Error(`E5 oficial sem jogo obrigatório: ${id}`);
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const item of CATALOGO_BIBLIOTECA_E4) {
      const dados = dadosDesafioCatalogo(item);
      await tx.desafio.upsert({
        where: { id: item.id },
        create: { id: item.id, ...dados },
        update: dados,
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
          ativo: jogo.ativo !== false,
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
          ativo: jogo.ativo !== false,
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
            trilha: fasesComTrilha.get(fase),
            titulo: fase.titulo,
            objetivo: fase.objetivo,
            dificuldade: fase.dificuldade,
            configuracao: fase.configuracao,
            versao: jogo.versao,
          },
          update: {
            trilha: fasesComTrilha.get(fase),
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
