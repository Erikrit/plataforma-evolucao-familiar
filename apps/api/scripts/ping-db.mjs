import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log(JSON.stringify({ ok: true, banco: "ok" }));
  process.exit(0);
} catch (erro) {
  console.error(
    JSON.stringify({
      ok: false,
      banco: "indisponivel",
      mensagem: erro instanceof Error ? erro.message : String(erro),
    }),
  );
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
