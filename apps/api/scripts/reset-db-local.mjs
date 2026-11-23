/**
 * Limpa o banco local e reexecuta o seed canônico
 * (Família Oliveira, ≤6 pessoas, 3 contas + amostra cuidados/desenvolvimento).
 * Uso: npm run db:reset -w @pef/api
 * Não usar em ambiente com dados reais.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const raizApi = join(dirname(fileURLToPath(import.meta.url)), "..");

const tabelas = [
  "movimento_estrelas",
  "resgate_recompensa",
  "participacao_desafio",
  "disponibilidade_desafio",
  "sugestao_desafio_pessoa",
  "desafio_guardado",
  "recompensa",
  "desafio",
  "fase_jogo_digital",
  "jogo_digital",
  "progresso_fase_jogo",
  "registro_dose",
  "programacao_medicamento",
  "medicamento_anexo",
  "medicamento",
  "consulta",
  "exame",
  "registro_atividade",
  "anexo",
  "sessao_provisoria",
  "autorizacao",
  "convite",
  "usuario",
  "pessoa",
  "familia",
];

try {
  for (const tabela of tabelas) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tabela}" CASCADE`);
  }

  const seed = spawnSync(process.execPath, [join(raizApi, "prisma", "seed.mjs")], {
    cwd: raizApi,
    encoding: "utf8",
    env: process.env,
  });
  if (seed.stdout) process.stdout.write(seed.stdout);
  if (seed.stderr) process.stderr.write(seed.stderr);
  if (seed.status !== 0) {
    throw new Error(`seed falhou com código ${seed.status}`);
  }

  console.log(JSON.stringify({ ok: true, acao: "reset+seed" }));
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
