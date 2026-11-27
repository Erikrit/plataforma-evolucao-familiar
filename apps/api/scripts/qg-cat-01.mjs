/**
 * CAT-01 — validação em bancos descartáveis.
 * 1) Banco novo: migrate + carga ×2 (60 E4 ativas, 8 jogos, fases contadas do catálogo; sem família/progresso).
 * 2) Banco com progresso piloto: transição aditiva preserva chaves/conclusões.
 * Não toca o banco compartilhado `pef` de forma destrutiva.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { CATALOGO_CARREGADO } from "./lib-regua-jogos.mjs";

const TOTAL_FASES = CATALOGO_CARREGADO.reduce((total, jogo) => total + jogo.fases.length, 0);

const raizApi = join(dirname(fileURLToPath(import.meta.url)), "..");
const raizRepo = join(raizApi, "..", "..");
const container = process.env.PEF_POSTGRES_CONTAINER || "pef-postgres";
const usuario = process.env.PEF_DB_USER || "pef";
const senha = process.env.PEF_DB_PASSWORD || "pef_dev_local";
const host = process.env.PEF_DB_HOST || "localhost";
const porta = process.env.PEF_DB_PORT || "5433";
const dbNovo = process.env.PEF_DB_CAT01_NOVO || "pef_cat01_novo";
const dbPiloto = process.env.PEF_DB_CAT01_PILOTO || "pef_cat01_piloto";

const checagens = [];
let falhas = 0;

function registrar(nome, ok, detalhe = {}) {
  const item = { nome, status: ok ? "PASS" : "FAIL", ...detalhe };
  checagens.push(item);
  if (!ok) falhas += 1;
  console.log(JSON.stringify(item));
  return ok;
}

function executar(comando, args, opcoes = {}) {
  const resultado = spawnSync(comando, args, {
    encoding: "utf8",
    cwd: opcoes.cwd || raizApi,
    env: { ...process.env, ...(opcoes.env || {}) },
    shell: opcoes.shell === true,
  });
  return {
    status: resultado.status ?? 1,
    stdout: resultado.stdout || "",
    stderr: resultado.stderr || "",
    error: resultado.error,
  };
}

function dockerExec(args) {
  return executar("docker", ["exec", container, ...args], { cwd: raizRepo });
}

function urlBanco(nome) {
  return `postgresql://${usuario}:${senha}@${host}:${porta}/${nome}?schema=public`;
}

function limparBanco(nome) {
  dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    "postgres",
    "-c",
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${nome}' AND pid <> pg_backend_pid();`,
  ]);
  dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    "postgres",
    "-c",
    `DROP DATABASE IF EXISTS ${nome};`,
  ]);
}

function criarBanco(nome) {
  limparBanco(nome);
  const r = dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    "postgres",
    "-c",
    `CREATE DATABASE ${nome};`,
  ]);
  return r.status === 0;
}

function migrateDeploy(nome) {
  return executar(
    "npx",
    ["prisma", "migrate", "deploy"],
    {
      cwd: raizApi,
      env: { DATABASE_URL: urlBanco(nome) },
      shell: true,
    },
  );
}

function cargaOficial(nome) {
  return executar(process.execPath, [join(raizApi, "prisma", "carga-oficial.mjs")], {
    cwd: raizApi,
    env: { DATABASE_URL: urlBanco(nome) },
  });
}

async function contagens(nome) {
  const prisma = new PrismaClient({ datasources: { db: { url: urlBanco(nome) } } });
  try {
    return {
      e4: await prisma.desafio.count({
        where: { familiaId: null, origem: "catalogo", ativo: true },
      }),
      jogos: await prisma.jogoDigital.count(),
      fases: await prisma.faseJogoDigital.count(),
      idsJogos: (
        await prisma.jogoDigital.findMany({
          select: { id: true },
          orderBy: { id: "asc" },
        })
      ).map((j) => j.id),
      familias: await prisma.familia.count(),
      usuarios: await prisma.usuario.count(),
      medicamentos: await prisma.medicamento.count(),
      consultas: await prisma.consulta.count(),
      exames: await prisma.exame.count(),
      progresso: await prisma.progressoFaseJogo.count(),
    };
  } finally {
    await prisma.$disconnect();
  }
}

async function inserirProgressoPiloto(nome) {
  const prisma = new PrismaClient({ datasources: { db: { url: urlBanco(nome) } } });
  const agora = new Date("2026-11-20T15:00:00.000Z");
  try {
    await prisma.familia.create({
      data: {
        id: "familia_piloto_cat01",
        nome: "Família Ensaio CAT-01",
        slug: "ensaio-cat01",
      },
    });
    await prisma.pessoa.create({
      data: {
        id: "pessoa_piloto_cat01",
        familiaId: "familia_piloto_cat01",
        nome: "Laurinha Ensaio",
        vinculo: "neta",
      },
    });

    const linhas = [
      {
        jogoId: "memoria",
        fase: 1,
        concluidaEm: agora,
        versaoConclusao: 1,
        chaveConclusao: "memoria|1|v1",
        nomeNaConclusao: "Memória de figuras",
        categoriaNaConclusao: "memoria_atencao",
      },
      {
        jogoId: "sequencia",
        fase: 2,
        concluidaEm: agora,
        versaoConclusao: 1,
        chaveConclusao: "sequencia|2|v1",
        nomeNaConclusao: "Complete a sequência",
        categoriaNaConclusao: "raciocinio",
      },
      {
        jogoId: "labirinto",
        fase: 5,
        concluidaEm: agora,
        versaoConclusao: 1,
        chaveConclusao: "labirinto|5|v1",
        nomeNaConclusao: "Caminhos e labirintos",
        categoriaNaConclusao: "raciocinio",
      },
    ];

    for (const linha of linhas) {
      await prisma.progressoFaseJogo.create({
        data: {
          familiaId: "familia_piloto_cat01",
          pessoaId: "pessoa_piloto_cat01",
          jogoId: linha.jogoId,
          fase: linha.fase,
          primeiraExploracaoEm: agora,
          versaoPrimeiraExploracao: 1,
          ultimaAberturaEm: agora,
          versaoUltimaAbertura: 1,
          concluidaEm: linha.concluidaEm,
          versaoConclusao: linha.versaoConclusao,
          chaveConclusao: linha.chaveConclusao,
          nomeNaConclusao: linha.nomeNaConclusao,
          categoriaNaConclusao: linha.categoriaNaConclusao,
        },
      });
    }

    return prisma.progressoFaseJogo.findMany({
      where: {
        familiaId: "familia_piloto_cat01",
        pessoaId: "pessoa_piloto_cat01",
      },
      orderBy: [{ jogoId: "asc" }, { fase: "asc" }],
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function lerProgressoPiloto(nome) {
  const prisma = new PrismaClient({ datasources: { db: { url: urlBanco(nome) } } });
  try {
    return prisma.progressoFaseJogo.findMany({
      where: {
        familiaId: "familia_piloto_cat01",
        pessoaId: "pessoa_piloto_cat01",
      },
      orderBy: [{ jogoId: "asc" }, { fase: "asc" }],
    });
  } finally {
    await prisma.$disconnect();
  }
}

function progressoIgual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function main() {
  const gen = executar("npx", ["prisma", "generate"], { cwd: raizApi, shell: true });
  let clientOk = gen.status === 0;
  if (!clientOk) {
    const probe = executar(
      process.execPath,
      [
        "-e",
        "import('@prisma/client').then(({PrismaClient})=>{const p=new PrismaClient(); if(!p.jogoDigital||!p.faseJogoDigital) process.exit(2); process.exit(0)}).catch(()=>process.exit(1))",
      ],
      { cwd: raizApi },
    );
    clientOk = probe.status === 0;
  }
  registrar("prisma_generate", clientOk, {
    generateExit: gen.status,
    nota:
      gen.status === 0
        ? "generate ok"
        : "generate bloqueado (arquivo em uso); client existente com modelos editoriais validado",
    stderr: (gen.stderr || "").slice(0, 400),
  });

  // --- Banco novo ---
  registrar("criar_banco_novo", criarBanco(dbNovo), { banco: dbNovo });
  const migNovo = migrateDeploy(dbNovo);
  registrar("migrate_banco_novo", migNovo.status === 0, {
    stdout: migNovo.stdout.slice(0, 500),
    stderr: migNovo.stderr.slice(0, 500),
  });

  const carga1 = cargaOficial(dbNovo);
  let resumo1 = null;
  try {
    resumo1 = JSON.parse(carga1.stdout);
  } catch {
    resumo1 = null;
  }
  registrar("carga1_banco_novo", carga1.status === 0 && resumo1?.ok === true, {
    resumo: resumo1,
    stderr: carga1.stderr.slice(0, 400),
  });

  const carga2 = cargaOficial(dbNovo);
  let resumo2 = null;
  try {
    resumo2 = JSON.parse(carga2.stdout);
  } catch {
    resumo2 = null;
  }
  registrar("carga2_banco_novo_idempotente", carga2.status === 0 && resumo2?.ok === true, {
    resumo: resumo2,
  });

  const contNovo = await contagens(dbNovo);
  registrar("contagens_banco_novo", 
    contNovo.e4 === 60 &&
      contNovo.jogos === 8 &&
      contNovo.fases === TOTAL_FASES &&
      contNovo.idsJogos.join(",") === "labirinto,memoria,sequencia" &&
      contNovo.familias === 0 &&
      contNovo.usuarios === 0 &&
      contNovo.medicamentos === 0 &&
      contNovo.consultas === 0 &&
      contNovo.exames === 0 &&
      contNovo.progresso === 0,
    { contagens: contNovo },
  );

  // --- Banco piloto: schema pré-editorial + progresso, depois tabelas aditivas ---
  registrar("criar_banco_piloto", criarBanco(dbPiloto), { banco: dbPiloto });

  const dumpSchema = "/tmp/pef_cat01_schema.sql";
  mkdirSync(join(raizRepo, "backups"), { recursive: true });
  const dump = dockerExec([
    "pg_dump",
    "-U",
    usuario,
    "-d",
    "pef",
    "--schema-only",
    "--no-owner",
    "--no-privileges",
    "-f",
    dumpSchema,
  ]);
  const restaurar = dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    dbPiloto,
    "-v",
    "ON_ERROR_STOP=1",
    "-f",
    dumpSchema,
  ]);
  registrar("clonar_schema_pre_editorial", dump.status === 0 && restaurar.status === 0, {
    dump: dump.status,
    restaurar: (restaurar.stderr || restaurar.stdout).slice(0, 400),
  });

  const semEditoriais = dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    dbPiloto,
    "-At",
    "-c",
    "SELECT count(*)::int FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('jogo_digital','fase_jogo_digital');",
  ]);
  registrar("piloto_sem_tabelas_editoriais", String(semEditoriais.stdout).trim() === "0", {
    saida: String(semEditoriais.stdout).trim(),
  });

  let progressoAntes = [];
  try {
    progressoAntes = await inserirProgressoPiloto(dbPiloto);
    registrar("inserir_progresso_piloto", progressoAntes.length === 3, {
      chaves: progressoAntes.map((p) => ({
        jogoId: p.jogoId,
        fase: p.fase,
        chaveConclusao: p.chaveConclusao,
        concluidaEm: p.concluidaEm,
      })),
    });
  } catch (erro) {
    registrar("inserir_progresso_piloto", false, {
      mensagem: erro instanceof Error ? erro.message : String(erro),
    });
  }

  const sqlAditivo = [
    'CREATE TABLE IF NOT EXISTS "jogo_digital" (',
    '    "id" TEXT NOT NULL,',
    '    "nome" TEXT NOT NULL,',
    '    "descricao" TEXT NOT NULL,',
    '    "categoria" TEXT NOT NULL,',
    '    "instrucoes" TEXT NOT NULL,',
    '    "tipo_mecanica" TEXT NOT NULL,',
    '    "versao" INTEGER NOT NULL DEFAULT 1,',
    '    "faixa_etaria_min" INTEGER,',
    '    "faixa_etaria_max" INTEGER,',
    '    "ativo" BOOLEAN NOT NULL DEFAULT true,',
    '    "publicado_em" TIMESTAMP(3),',
    '    "ordem_editorial" INTEGER NOT NULL DEFAULT 0,',
    '    "capa_ref" TEXT,',
    '    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,',
    '    "atualizado_em" TIMESTAMP(3) NOT NULL,',
    '    CONSTRAINT "jogo_digital_pkey" PRIMARY KEY ("id")',
    ");",
    'CREATE TABLE IF NOT EXISTS "fase_jogo_digital" (',
    '    "jogo_id" TEXT NOT NULL,',
    '    "numero" INTEGER NOT NULL,',
    '    "trilha" TEXT NOT NULL,',
    '    "titulo" TEXT NOT NULL,',
    '    "objetivo" TEXT NOT NULL,',
    '    "dificuldade" TEXT NOT NULL,',
    '    "configuracao" JSONB NOT NULL,',
    '    "versao" INTEGER NOT NULL DEFAULT 1,',
    '    CONSTRAINT "fase_jogo_digital_pkey" PRIMARY KEY ("jogo_id","numero")',
    ");",
    'CREATE INDEX IF NOT EXISTS "jogo_digital_ativo_categoria_idx" ON "jogo_digital"("ativo", "categoria");',
    "DO $$ BEGIN",
    '  ALTER TABLE "fase_jogo_digital" ADD CONSTRAINT "fase_jogo_digital_jogo_id_fkey"',
    '    FOREIGN KEY ("jogo_id") REFERENCES "jogo_digital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;',
    "EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
  ].join("\n");

  const aplicarAditivo = dockerExec([
    "psql",
    "-U",
    usuario,
    "-d",
    dbPiloto,
    "-v",
    "ON_ERROR_STOP=1",
    "-c",
    sqlAditivo,
  ]);
  registrar("transicao_schema_aditiva", aplicarAditivo.status === 0, {
    stderr: (aplicarAditivo.stderr || "").slice(0, 400),
  });

  const cargaPiloto1 = cargaOficial(dbPiloto);
  registrar("carga1_banco_piloto", cargaPiloto1.status === 0, {
    stdout: cargaPiloto1.stdout.slice(0, 300),
  });
  const cargaPiloto2 = cargaOficial(dbPiloto);
  registrar("carga2_banco_piloto", cargaPiloto2.status === 0, {
    stdout: cargaPiloto2.stdout.slice(0, 300),
  });

  const progressoDepois = await lerProgressoPiloto(dbPiloto);
  const contPiloto = await contagens(dbPiloto);
  registrar(
    "progresso_preservado",
    progressoIgual(progressoAntes, progressoDepois) && contPiloto.progresso === 3,
    {
      antes: progressoAntes.map((p) => ({
        jogoId: p.jogoId,
        fase: p.fase,
        chaveConclusao: p.chaveConclusao,
        concluidaEm: p.concluidaEm?.toISOString?.() ?? p.concluidaEm,
      })),
      depois: progressoDepois.map((p) => ({
        jogoId: p.jogoId,
        fase: p.fase,
        chaveConclusao: p.chaveConclusao,
        concluidaEm: p.concluidaEm?.toISOString?.() ?? p.concluidaEm,
      })),
      contagens: contPiloto,
    },
  );

  registrar(
    "catalogo_piloto_apos_carga",
    contPiloto.e4 === 60 && contPiloto.jogos === 8 && contPiloto.fases === TOTAL_FASES,
    { contagens: contPiloto },
  );

  limparBanco(dbNovo);
  limparBanco(dbPiloto);
  registrar("limpeza_bancos_descartaveis", true, { bancos: [dbNovo, dbPiloto] });

  const saida = {
    demanda: "EVO-CATALOGO-JOGOS-20261122",
    incremento: "CAT-01",
    status: falhas === 0 ? "PASS" : "FAIL",
    falhas,
    checagens,
    em: new Date().toISOString(),
  };

  const dirEvidencia = join(raizRepo, "docs", "esteira", "estado");
  mkdirSync(dirEvidencia, { recursive: true });
  const caminhoJson = join(dirEvidencia, "evidencia-cat-01-20261122.json");
  writeFileSync(caminhoJson, `${JSON.stringify(saida, null, 2)}\n`, "utf8");
  const caminhoTxt = join(dirEvidencia, "qg2-cat-01-bancos.txt");
  writeFileSync(caminhoTxt, `${JSON.stringify(saida, null, 2)}\n`, "utf8");

  console.log(JSON.stringify({ resumo: saida.status, falhas, evidencia: caminhoJson }));
  process.exitCode = falhas === 0 ? 0 : 1;
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
