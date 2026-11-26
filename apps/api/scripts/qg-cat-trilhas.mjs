/**
 * DEV-CAT-M1, ticket 03 — trilhas em banco descartável do Postgres local (Docker).
 * 1) Migra até a versão anterior às trilhas e grava labirinto 1–5 e progresso fictício.
 * 2) Aplica a migração de trilhas: fases antigas recebem a trilha pelo número.
 * 3) Carga oficial ×2: contagens vêm do catálogo, sem duplicar; progresso preservado.
 * Só cria e apaga o banco descartável abaixo; nunca toca `pef` nem a VPS.
 */
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { CATALOGO_CARREGADO } from "./lib-regua-jogos.mjs";

const MIGRACAO_TRILHAS = "20261126120000_trilha_fase_jogo";
const raizApi = join(dirname(fileURLToPath(import.meta.url)), "..");
const container = process.env.PEF_POSTGRES_CONTAINER || "pef-postgres";
const usuario = process.env.PEF_DB_USER || "pef";
const senha = process.env.PEF_DB_PASSWORD || "pef_dev_local";
const host = process.env.PEF_DB_HOST || "localhost";
const porta = process.env.PEF_DB_PORT || "5433";
const banco = "pef_cat_trilhas";
const url = `postgresql://${usuario}:${senha}@${host}:${porta}/${banco}?schema=public`;
if (!["localhost", "127.0.0.1"].includes(host)) throw new Error("qg-cat-trilhas só roda em banco local.");

let falhas = 0;
function conferir(nome, ok, detalhe) {
  if (!ok) falhas += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${nome}${detalhe ? ` — ${JSON.stringify(detalhe)}` : ""}`);
}

const executar = (comando, args, env = {}) =>
  spawnSync(comando, args, { cwd: raizApi, encoding: "utf8", env: { ...process.env, ...env }, shell: comando === "npx" });
const psql = (sql) => executar("docker", ["exec", container, "psql", "-U", usuario, "-d", "postgres", "-c", sql]);

function recriarBanco() {
  psql(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${banco}' AND pid <> pg_backend_pid();`);
  psql(`DROP DATABASE IF EXISTS ${banco};`);
  return psql(`CREATE DATABASE ${banco};`).status === 0;
}

function migrar(semTrilhas) {
  let schema = join(raizApi, "prisma", "schema.prisma");
  let temporario;
  if (semTrilhas) {
    temporario = mkdtempSync(join(tmpdir(), "pef-trilhas-"));
    cpSync(join(raizApi, "prisma"), temporario, {
      recursive: true,
      filter: (origem) => !origem.includes(MIGRACAO_TRILHAS),
    });
    schema = join(temporario, "schema.prisma");
  }
  try {
    return executar("npx", ["prisma", "migrate", "deploy", "--schema", `"${schema}"`], { DATABASE_URL: url });
  } finally {
    if (temporario) rmSync(temporario, { recursive: true, force: true });
  }
}

const carga = () => executar(process.execPath, [join(raizApi, "prisma", "carga-oficial.mjs")], { DATABASE_URL: url });

const agora = new Date("2026-11-20T15:00:00.000Z");
const progresso = (prisma) =>
  prisma.progressoFaseJogo.findMany({ where: { familiaId: "familia_trilhas" }, orderBy: [{ jogoId: "asc" }, { fase: "asc" }] });

async function main() {
  conferir("banco descartável criado", recriarBanco());
  const antes = migrar(true);
  conferir("migração até a versão anterior às trilhas", antes.status === 0, antes.status ? antes.stderr.slice(-400) : undefined);

  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO jogo_digital (id, nome, descricao, categoria, instrucoes, tipo_mecanica, versao, atualizado_em)
       VALUES ('labirinto', 'Caminhos e labirintos', 'd', 'raciocinio', 'i', 'labirinto', 1, now())`,
    );
    for (let numero = 1; numero <= 5; numero += 1) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO fase_jogo_digital (jogo_id, numero, titulo, objetivo, dificuldade, configuracao, versao)
         VALUES ('labirinto', ${numero}, 'Fase', 'Objetivo', 'simples', '{}'::jsonb, 1)`,
      );
    }
    await prisma.familia.create({ data: { id: "familia_trilhas", nome: "Família Ensaio Trilhas", slug: "ensaio-trilhas" } });
    await prisma.pessoa.create({ data: { id: "pessoa_trilhas", familiaId: "familia_trilhas", nome: "Criança Ensaio", vinculo: "neta" } });
    for (const [jogoId, fase] of [["labirinto", 3], ["labirinto", 5], ["memoria", 2]]) {
      await prisma.progressoFaseJogo.create({
        data: {
          familiaId: "familia_trilhas", pessoaId: "pessoa_trilhas", jogoId, fase,
          primeiraExploracaoEm: agora, versaoPrimeiraExploracao: 1, ultimaAberturaEm: agora, versaoUltimaAbertura: 1,
          concluidaEm: agora, versaoConclusao: 1, chaveConclusao: `${jogoId}-${fase}`.padEnd(32, "0"),
          nomeNaConclusao: jogoId, categoriaNaConclusao: "raciocinio",
        },
      });
    }
    const progressoAntes = await progresso(prisma);

    const depois = migrar(false);
    conferir("migração de trilhas aplicada", depois.status === 0, depois.status ? depois.stderr.slice(-400) : undefined);
    const antigas = await prisma.faseJogoDigital.findMany({ where: { jogoId: "labirinto" }, select: { numero: true, trilha: true } });
    conferir("fases existentes recebem a trilha pelo número", antigas.length === 5 && antigas.every((f) => f.trilha === "pequenos"));

    const [c1, c2] = [carga(), carga()];
    conferir("carga oficial executada duas vezes", c1.status === 0 && c2.status === 0, c1.status || c2.status ? (c1.stderr || c2.stderr).slice(-400) : undefined);

    const esperadoFases = CATALOGO_CARREGADO.reduce((total, jogo) => total + jogo.fases.length, 0);
    const [jogos, fases] = await Promise.all([prisma.jogoDigital.count(), prisma.faseJogoDigital.findMany()]);
    conferir("contagens vêm do catálogo, sem duplicar", jogos === CATALOGO_CARREGADO.length && fases.length === esperadoFases, { jogos, fases: fases.length, esperadoFases });
    // Oráculo independente de propósito: não reusa trilhaDaFase, que é o código sob teste.
    const trilhaEsperada = (n) => (n <= 5 ? "pequenos" : n <= 10 ? "medios" : "grandes");
    conferir("trilha coerente com o número da fase", fases.every((f) => f.trilha === trilhaEsperada(f.numero)));
    conferir("Caminhos e labirintos com 15 fases", fases.filter((f) => f.jogoId === "labirinto").length === 15);
    conferir("conclusões anteriores preservadas", JSON.stringify(await progresso(prisma)) === JSON.stringify(progressoAntes));
  } finally {
    await prisma.$disconnect();
    psql(`DROP DATABASE IF EXISTS ${banco};`);
  }
  console.log(falhas ? `qg-cat-trilhas: ${falhas} falha(s)` : "qg-cat-trilhas: todas as checagens PASS");
  process.exitCode = falhas ? 1 : 0;
}

main().catch((erro) => {
  console.error(erro);
  psql(`DROP DATABASE IF EXISTS ${banco};`);
  process.exitCode = 1;
});
