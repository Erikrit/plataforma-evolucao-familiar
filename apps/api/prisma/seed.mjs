import { createHash, randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function gerarHashSenha(senha) {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";

try {
  const familia = await prisma.familia.upsert({
    where: { id: "familia_seed_local" },
    update: { nome: "Família Local" },
    create: {
      id: "familia_seed_local",
      nome: "Família Local",
    },
  });

  const pessoaAdmin = await prisma.pessoa.upsert({
    where: { id: "pessoa_admin_seed" },
    update: { nome: "Administrador Inicial", familiaId: familia.id },
    create: {
      id: "pessoa_admin_seed",
      familiaId: familia.id,
      nome: "Administrador Inicial",
      vinculo: "administrador",
    },
  });

  const usuarioAdmin = await prisma.usuario.upsert({
    where: { email: emailAdmin },
    update: {
      pessoaId: pessoaAdmin.id,
      senhaHash: gerarHashSenha(senhaAdmin),
    },
    create: {
      id: "usuario_admin_seed",
      pessoaId: pessoaAdmin.id,
      email: emailAdmin,
      senhaHash: gerarHashSenha(senhaAdmin),
    },
  });

  const authAdmin = await prisma.autorizacao.findFirst({
    where: {
      familiaId: familia.id,
      usuarioId: usuarioAdmin.id,
      responsabilidade: "administrador",
      pessoaAlvoId: null,
      ativa: true,
    },
  });
  if (!authAdmin) {
    await prisma.autorizacao.create({
      data: {
        id: "auth_admin_seed",
        familiaId: familia.id,
        usuarioId: usuarioAdmin.id,
        responsabilidade: "administrador",
        pessoaAlvoId: null,
      },
    });
  }

  console.log(
    JSON.stringify({
      ok: true,
      familiaId: familia.id,
      adminEmail: emailAdmin,
      autorizacaoAdmin: true,
      aviso: "Credenciais locais fictícias; não usar dados reais.",
      fingerprintSeed: createHash("sha256")
        .update(`${familia.id}:${emailAdmin}:admin`)
        .digest("hex")
        .slice(0, 12),
    }),
  );
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
