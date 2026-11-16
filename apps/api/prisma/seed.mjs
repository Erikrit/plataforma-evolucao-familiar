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

  const pessoaVovo = await prisma.pessoa.upsert({
    where: { id: "pessoa_vovo_seed" },
    update: { nome: "Vovó", familiaId: familia.id },
    create: {
      id: "pessoa_vovo_seed",
      familiaId: familia.id,
      nome: "Vovó",
      vinculo: "avó",
    },
  });

  const pessoaLaurinha = await prisma.pessoa.upsert({
    where: { id: "pessoa_laurinha_seed" },
    update: { nome: "Laurinha", familiaId: familia.id },
    create: {
      id: "pessoa_laurinha_seed",
      familiaId: familia.id,
      nome: "Laurinha",
      vinculo: "filha",
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

  /** Biblioteca curada mínima (DEV-F01) — conteúdo fictício, sem tom clínico. */
  const biblioteca = [
    {
      id: "desafio_cat_memoria_cores",
      nome: "Memória das cores",
      instrucao:
        "Mostre 3 objetos coloridos, esconda e peça para lembrar a ordem das cores.",
      categoria: "memoria_atencao",
      dificuldade: "simples",
      materiais: "Objetos coloridos da casa",
      duracaoMinutos: 10,
    },
    {
      id: "desafio_cat_contar_passos",
      nome: "Contar passos até a porta",
      instrucao: "Contem juntos os passos do sofá até a porta; depois tentem de novo.",
      categoria: "raciocinio",
      dificuldade: "simples",
      materiais: null,
      duracaoMinutos: 5,
    },
    {
      id: "desafio_cat_historia_juntos",
      nome: "Inventar uma história juntos",
      instrucao:
        "Um começa com uma frase; o outro continua. Sem pressa e sem correção.",
      categoria: "linguagem",
      dificuldade: "media",
      materiais: null,
      duracaoMinutos: 15,
    },
    {
      id: "desafio_cat_desenho_livre",
      nome: "Desenho livre do dia",
      instrucao: "Desenhem algo que gostaram hoje e contem um ao outro o que fizeram.",
      categoria: "criatividade",
      dificuldade: "simples",
      materiais: "Papel e lápis de cor",
      duracaoMinutos: 20,
    },
    {
      id: "desafio_cat_equilibrio",
      nome: "Equilíbrio no tapete",
      instrucao: "Andem em linha reta no tapete, um pé na frente do outro, de mãos dadas.",
      categoria: "coordenacao",
      dificuldade: "simples",
      materiais: "Tapete ou fita no chão",
      duracaoMinutos: 8,
    },
    {
      id: "desafio_cat_guardar_brinquedos",
      nome: "Guardar brinquedos juntos",
      instrucao: "Escolham 5 brinquedos e guardem no lugar combinado, sem pressa.",
      categoria: "autonomia",
      dificuldade: "simples",
      materiais: null,
      duracaoMinutos: 10,
    },
  ];

  for (const item of biblioteca) {
    await prisma.desafio.upsert({
      where: { id: item.id },
      update: {
        nome: item.nome,
        instrucao: item.instrucao,
        categoria: item.categoria,
        dificuldade: item.dificuldade,
        materiais: item.materiais,
        duracaoMinutos: item.duracaoMinutos,
        origem: "catalogo",
        familiaId: null,
        ativo: true,
      },
      create: {
        id: item.id,
        familiaId: null,
        nome: item.nome,
        instrucao: item.instrucao,
        categoria: item.categoria,
        dificuldade: item.dificuldade,
        materiais: item.materiais,
        duracaoMinutos: item.duracaoMinutos,
        origem: "catalogo",
        ativo: true,
      },
    });
  }

  console.log(
    JSON.stringify({
      ok: true,
      familiaId: familia.id,
      adminEmail: emailAdmin,
      pessoasCanonicas: {
        admin: pessoaAdmin.id,
        vovo: pessoaVovo.id,
        laurinha: pessoaLaurinha.id,
      },
      autorizacaoAdmin: true,
      bibliotecaSeed: biblioteca.length,
      aviso: "Credenciais locais fictícias; não usar dados reais.",
      fingerprintSeed: createHash("sha256")
        .update(`${familia.id}:${emailAdmin}:admin:vovo:laurinha:biblioteca6`)
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
