/**
 * CLI privado: provisiona família + administrador (E1).
 * Senha apenas via env PEF_PROVISION_SENHA (nunca em argv/logs).
 *
 * Ex.:
 *   PEF_PROVISION_SENHA='********' node scripts/provisionar-familia.mjs \
 *     --nome "Família Silva" --slug silva --admin "Maria Silva" --email maria@pef.local
 */
import { PrismaClient } from "@prisma/client";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";

function lerArg(nome) {
  const idx = process.argv.indexOf(`--${nome}`);
  if (idx < 0) return undefined;
  return process.argv[idx + 1];
}

const prisma = new PrismaClient();

try {
  const senhaAdmin = process.env.PEF_PROVISION_SENHA ?? "";
  if (!senhaAdmin) {
    console.error(
      JSON.stringify({
        ok: false,
        codigo: "SENHA_AUSENTE",
        mensagem:
          "Defina PEF_PROVISION_SENHA no ambiente (não passe senha em argumentos).",
      }),
    );
    process.exitCode = 1;
  } else {
    const resultado = await provisionarFamiliaComAdmin(prisma, {
      nomeFamilia: lerArg("nome") ?? "",
      slug: lerArg("slug") ?? "",
      nomeAdmin: lerArg("admin") ?? "",
      emailAdmin: lerArg("email") ?? "",
      senhaAdmin,
      vinculoAdmin: lerArg("vinculo") ?? null,
    });
    console.log(
      JSON.stringify({
        ok: true,
        ...resultado,
      }),
    );
  }
} catch (erro) {
  console.error(
    JSON.stringify({
      ok: false,
      codigo: erro?.codigo ?? "FALHA",
      mensagem: erro instanceof Error ? erro.message : String(erro),
    }),
  );
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
