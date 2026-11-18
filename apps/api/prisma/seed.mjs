/**
 * Seed local fictício — Família Oliveira com os 3 perfis de experiência.
 * Fontes: DOCUMENTO-MESTRE §3, ESPECIFICACAO módulo 01 (FUN-04).
 * Não usar dados pessoais reais.
 */
import { createHash, randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function gerarHashSenha(senha) {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

function diasAtras(dias, horas = 12, minutos = 0) {
  const d = new Date();
  d.setHours(horas, minutos, 0, 0);
  d.setDate(d.getDate() - dias);
  return d;
}

function diasAFrente(dias, horas = 9, minutos = 0) {
  const d = new Date();
  d.setHours(horas, minutos, 0, 0);
  d.setDate(d.getDate() + dias);
  return d;
}

function chaveDose(medicamentoId, dataIso, horario) {
  return `${medicamentoId}|${dataIso}|${horario}`;
}

const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";
const emailResponsavel =
  process.env.PEF_RESPONSAVEL_EMAIL ?? "mikaela@pef.local";
const senhaResponsavel =
  process.env.PEF_RESPONSAVEL_SENHA ?? "responsavel-local";
const emailIntegrante =
  process.env.PEF_INTEGRANTE_EMAIL ?? "ana.paula@pef.local";
const senhaIntegrante =
  process.env.PEF_INTEGRANTE_SENHA ?? "integrante-local";

try {
  const familia = await prisma.familia.upsert({
    where: { id: "familia_seed_local" },
    update: { nome: "Família Oliveira" },
    create: {
      id: "familia_seed_local",
      nome: "Família Oliveira",
    },
  });

  const pessoaAdmin = await prisma.pessoa.upsert({
    where: { id: "pessoa_admin_seed" },
    update: {
      nome: "Carlos Oliveira",
      familiaId: familia.id,
      vinculo: "neto",
      dataNascimento: new Date("1988-04-12T12:00:00.000Z"),
    },
    create: {
      id: "pessoa_admin_seed",
      familiaId: familia.id,
      nome: "Carlos Oliveira",
      vinculo: "neto",
      dataNascimento: new Date("1988-04-12T12:00:00.000Z"),
    },
  });

  const pessoaResponsavel = await prisma.pessoa.upsert({
    where: { id: "pessoa_mikaela_seed" },
    update: {
      nome: "Mikaela Oliveira",
      familiaId: familia.id,
      vinculo: "filha",
      dataNascimento: new Date("1992-09-03T12:00:00.000Z"),
    },
    create: {
      id: "pessoa_mikaela_seed",
      familiaId: familia.id,
      nome: "Mikaela Oliveira",
      vinculo: "filha",
      dataNascimento: new Date("1992-09-03T12:00:00.000Z"),
    },
  });

  const pessoaIntegrante = await prisma.pessoa.upsert({
    where: { id: "pessoa_integrante_seed" },
    update: {
      nome: "Ana Paula Santos",
      familiaId: familia.id,
      vinculo: "colaboradora",
      dataNascimento: new Date("1995-11-21T12:00:00.000Z"),
    },
    create: {
      id: "pessoa_integrante_seed",
      familiaId: familia.id,
      nome: "Ana Paula Santos",
      vinculo: "colaboradora",
      dataNascimento: new Date("1995-11-21T12:00:00.000Z"),
    },
  });

  const pessoaVovo = await prisma.pessoa.upsert({
    where: { id: "pessoa_vovo_seed" },
    update: {
      nome: "Helena Oliveira",
      familiaId: familia.id,
      vinculo: "avó",
      dataNascimento: new Date("1947-02-18T12:00:00.000Z"),
    },
    create: {
      id: "pessoa_vovo_seed",
      familiaId: familia.id,
      nome: "Helena Oliveira",
      vinculo: "avó",
      dataNascimento: new Date("1947-02-18T12:00:00.000Z"),
    },
  });

  const pessoaLaurinha = await prisma.pessoa.upsert({
    where: { id: "pessoa_laurinha_seed" },
    update: {
      nome: "Laurinha",
      familiaId: familia.id,
      vinculo: "neta",
      dataNascimento: new Date("2019-06-14T12:00:00.000Z"),
    },
    create: {
      id: "pessoa_laurinha_seed",
      familiaId: familia.id,
      nome: "Laurinha",
      vinculo: "neta",
      dataNascimento: new Date("2019-06-14T12:00:00.000Z"),
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

  const usuarioResponsavel = await prisma.usuario.upsert({
    where: { email: emailResponsavel },
    update: {
      pessoaId: pessoaResponsavel.id,
      senhaHash: gerarHashSenha(senhaResponsavel),
    },
    create: {
      id: "usuario_mikaela_seed",
      pessoaId: pessoaResponsavel.id,
      email: emailResponsavel,
      senhaHash: gerarHashSenha(senhaResponsavel),
    },
  });

  const usuarioIntegrante = await prisma.usuario.upsert({
    where: { email: emailIntegrante },
    update: {
      pessoaId: pessoaIntegrante.id,
      senhaHash: gerarHashSenha(senhaIntegrante),
    },
    create: {
      id: "usuario_integrante_seed",
      pessoaId: pessoaIntegrante.id,
      email: emailIntegrante,
      senhaHash: gerarHashSenha(senhaIntegrante),
    },
  });

  const autorizacoes = [
    {
      id: "auth_admin_seed",
      usuarioId: usuarioAdmin.id,
      responsabilidade: "administrador",
      pessoaAlvoId: null,
    },
    {
      id: "auth_mikaela_cuidados_vovo",
      usuarioId: usuarioResponsavel.id,
      responsabilidade: "responsavel_cuidados",
      pessoaAlvoId: pessoaVovo.id,
    },
    {
      id: "auth_mikaela_dev_laurinha",
      usuarioId: usuarioResponsavel.id,
      responsabilidade: "responsavel_desenvolvimento",
      pessoaAlvoId: pessoaLaurinha.id,
    },
    {
      id: "auth_integrante_cuidados_vovo",
      usuarioId: usuarioIntegrante.id,
      responsabilidade: "colaboradora_cuidados",
      pessoaAlvoId: pessoaVovo.id,
    },
  ];

  for (const auth of autorizacoes) {
    await prisma.autorizacao.upsert({
      where: { id: auth.id },
      update: {
        familiaId: familia.id,
        usuarioId: auth.usuarioId,
        responsabilidade: auth.responsabilidade,
        pessoaAlvoId: auth.pessoaAlvoId,
        ativa: true,
        revogadaEm: null,
      },
      create: {
        id: auth.id,
        familiaId: familia.id,
        usuarioId: auth.usuarioId,
        responsabilidade: auth.responsabilidade,
        pessoaAlvoId: auth.pessoaAlvoId,
        ativa: true,
      },
    });
  }

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
      instrucao:
        "Contem juntos os passos do sofá até a porta; depois tentem de novo.",
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
      instrucao:
        "Desenhem algo que gostaram hoje e contem um ao outro o que fizeram.",
      categoria: "criatividade",
      dificuldade: "simples",
      materiais: "Papel e lápis de cor",
      duracaoMinutos: 20,
    },
    {
      id: "desafio_cat_equilibrio",
      nome: "Equilíbrio no tapete",
      instrucao:
        "Andem em linha reta no tapete, um pé na frente do outro, de mãos dadas.",
      categoria: "coordenacao",
      dificuldade: "simples",
      materiais: "Tapete ou fita no chão",
      duracaoMinutos: 8,
    },
    {
      id: "desafio_cat_guardar_brinquedos",
      nome: "Guardar brinquedos juntos",
      instrucao:
        "Escolham 5 brinquedos e guardem no lugar combinado, sem pressa.",
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

  const inicioVigencia = diasAtras(14, 8, 0);

  const medPressao = await prisma.medicamento.upsert({
    where: { id: "med_vovo_pressao_seed" },
    update: {
      pessoaId: pessoaVovo.id,
      nome: "Losartana 50 mg",
      instrucoes: "Tomar 1 comprimido pela manhã, com água.",
      status: "ativo",
      criadoPorId: usuarioResponsavel.id,
      ativadoEm: inicioVigencia,
      suspensoEm: null,
      encerradoEm: null,
    },
    create: {
      id: "med_vovo_pressao_seed",
      pessoaId: pessoaVovo.id,
      nome: "Losartana 50 mg",
      instrucoes: "Tomar 1 comprimido pela manhã, com água.",
      status: "ativo",
      criadoPorId: usuarioResponsavel.id,
      ativadoEm: inicioVigencia,
    },
  });

  const medEstomago = await prisma.medicamento.upsert({
    where: { id: "med_vovo_estomago_seed" },
    update: {
      pessoaId: pessoaVovo.id,
      nome: "Omeprazol 20 mg",
      instrucoes: "Tomar em jejum, 30 minutos antes do café.",
      status: "ativo",
      criadoPorId: usuarioResponsavel.id,
      ativadoEm: inicioVigencia,
      suspensoEm: null,
      encerradoEm: null,
    },
    create: {
      id: "med_vovo_estomago_seed",
      pessoaId: pessoaVovo.id,
      nome: "Omeprazol 20 mg",
      instrucoes: "Tomar em jejum, 30 minutos antes do café.",
      status: "ativo",
      criadoPorId: usuarioResponsavel.id,
      ativadoEm: inicioVigencia,
    },
  });

  await prisma.programacaoMedicamento.upsert({
    where: { id: "prog_vovo_pressao_seed" },
    update: {
      medicamentoId: medPressao.id,
      horarios: ["08:00"],
      frequencia: "diaria",
      primeiroHorario: "08:00",
      dosesPorDia: 1,
      duracaoTipo: "continua",
      horariosConferidos: true,
      vigenciaInicio: inicioVigencia,
      vigenciaFim: null,
      criadoPorId: usuarioResponsavel.id,
    },
    create: {
      id: "prog_vovo_pressao_seed",
      medicamentoId: medPressao.id,
      horarios: ["08:00"],
      frequencia: "diaria",
      primeiroHorario: "08:00",
      dosesPorDia: 1,
      duracaoTipo: "continua",
      horariosConferidos: true,
      vigenciaInicio: inicioVigencia,
      criadoPorId: usuarioResponsavel.id,
    },
  });

  await prisma.programacaoMedicamento.upsert({
    where: { id: "prog_vovo_estomago_seed" },
    update: {
      medicamentoId: medEstomago.id,
      horarios: ["07:00"],
      frequencia: "diaria",
      primeiroHorario: "07:00",
      dosesPorDia: 1,
      duracaoTipo: "continua",
      horariosConferidos: true,
      vigenciaInicio: inicioVigencia,
      vigenciaFim: null,
      criadoPorId: usuarioResponsavel.id,
    },
    create: {
      id: "prog_vovo_estomago_seed",
      medicamentoId: medEstomago.id,
      horarios: ["07:00"],
      frequencia: "diaria",
      primeiroHorario: "07:00",
      dosesPorDia: 1,
      duracaoTipo: "continua",
      horariosConferidos: true,
      vigenciaInicio: inicioVigencia,
      criadoPorId: usuarioResponsavel.id,
    },
  });

  const doses = [
    {
      id: "dose_pressao_ontem_seed",
      medicamentoId: medPressao.id,
      dias: 1,
      horario: "08:00",
      situacao: "tomou_conforme_informacao",
      registradoPorId: usuarioIntegrante.id,
      horaEfetiva: 8,
      minutoEfetivo: 5,
    },
    {
      id: "dose_estomago_ontem_seed",
      medicamentoId: medEstomago.id,
      dias: 1,
      horario: "07:00",
      situacao: "tomou_conforme_informacao",
      registradoPorId: usuarioIntegrante.id,
      horaEfetiva: 7,
      minutoEfetivo: 2,
    },
    {
      id: "dose_pressao_hoje_seed",
      medicamentoId: medPressao.id,
      dias: 0,
      horario: "08:00",
      situacao: "tomou_conforme_informacao",
      registradoPorId: usuarioResponsavel.id,
      horaEfetiva: 8,
      minutoEfetivo: 10,
    },
    {
      id: "dose_estomago_hoje_seed",
      medicamentoId: medEstomago.id,
      dias: 0,
      horario: "07:00",
      situacao: "informou_nao_tomou",
      registradoPorId: usuarioIntegrante.id,
      horaEfetiva: null,
      minutoEfetivo: null,
    },
  ];

  for (const dose of doses) {
    const dataRef = diasAtras(dose.dias, 0, 0);
    const dataIso = dataRef.toISOString().slice(0, 10);
    const horarioEfetivo =
      dose.horaEfetiva == null
        ? null
        : diasAtras(dose.dias, dose.horaEfetiva, dose.minutoEfetivo ?? 0);

    await prisma.registroDose.upsert({
      where: { id: dose.id },
      update: {
        medicamentoId: dose.medicamentoId,
        ocorrenciaChave: chaveDose(dose.medicamentoId, dataIso, dose.horario),
        situacao: dose.situacao,
        horarioEfetivo,
        registradoPorId: dose.registradoPorId,
        versaoAtiva: true,
        substituiId: null,
      },
      create: {
        id: dose.id,
        medicamentoId: dose.medicamentoId,
        ocorrenciaChave: chaveDose(dose.medicamentoId, dataIso, dose.horario),
        situacao: dose.situacao,
        horarioEfetivo,
        registradoPorId: dose.registradoPorId,
        versaoAtiva: true,
      },
    });
  }

  await prisma.consulta.upsert({
    where: { id: "consulta_vovo_cardio_seed" },
    update: {
      pessoaId: pessoaVovo.id,
      dataHora: diasAFrente(5, 10, 0),
      especialidadeOuDescricao: "Cardiologia — retorno",
      profissional: "Dra. Renata Lima",
      local: "Clínica Horizonte",
      observacao: "Levar lista atualizada de medicamentos.",
      status: "agendada",
      criadoPorId: usuarioResponsavel.id,
    },
    create: {
      id: "consulta_vovo_cardio_seed",
      pessoaId: pessoaVovo.id,
      dataHora: diasAFrente(5, 10, 0),
      especialidadeOuDescricao: "Cardiologia — retorno",
      profissional: "Dra. Renata Lima",
      local: "Clínica Horizonte",
      observacao: "Levar lista atualizada de medicamentos.",
      status: "agendada",
      criadoPorId: usuarioResponsavel.id,
    },
  });

  await prisma.consulta.upsert({
    where: { id: "consulta_vovo_clinico_seed" },
    update: {
      pessoaId: pessoaVovo.id,
      dataHora: diasAtras(12, 15, 30),
      especialidadeOuDescricao: "Clínico geral",
      profissional: "Dr. Paulo Mendes",
      local: "UBS Centro",
      observacao: null,
      status: "realizada",
      criadoPorId: usuarioResponsavel.id,
    },
    create: {
      id: "consulta_vovo_clinico_seed",
      pessoaId: pessoaVovo.id,
      dataHora: diasAtras(12, 15, 30),
      especialidadeOuDescricao: "Clínico geral",
      profissional: "Dr. Paulo Mendes",
      local: "UBS Centro",
      status: "realizada",
      criadoPorId: usuarioResponsavel.id,
    },
  });

  await prisma.exame.upsert({
    where: { id: "exame_vovo_sangue_seed" },
    update: {
      pessoaId: pessoaVovo.id,
      descricao: "Hemograma completo",
      data: diasAtras(10, 8, 0),
      consultaId: "consulta_vovo_clinico_seed",
      criadoPorId: usuarioResponsavel.id,
    },
    create: {
      id: "exame_vovo_sangue_seed",
      pessoaId: pessoaVovo.id,
      descricao: "Hemograma completo",
      data: diasAtras(10, 8, 0),
      consultaId: "consulta_vovo_clinico_seed",
      criadoPorId: usuarioResponsavel.id,
    },
  });

  await prisma.registroAtividade.upsert({
    where: { id: "apoio_vovo_hoje_seed" },
    update: {
      pessoaId: pessoaVovo.id,
      descricao: "Observação do dia",
      observacao:
        "Helena acordou bem-disposta, almoçou normalmente e caminhou um pouco no quintal.",
      concluidaEm: diasAtras(0, 14, 20),
      registradoPorId: usuarioIntegrante.id,
    },
    create: {
      id: "apoio_vovo_hoje_seed",
      pessoaId: pessoaVovo.id,
      descricao: "Observação do dia",
      observacao:
        "Helena acordou bem-disposta, almoçou normalmente e caminhou um pouco no quintal.",
      concluidaEm: diasAtras(0, 14, 20),
      registradoPorId: usuarioIntegrante.id,
    },
  });

  await prisma.desafioGuardado.upsert({
    where: {
      pessoaId_desafioId: {
        pessoaId: pessoaLaurinha.id,
        desafioId: "desafio_cat_historia_juntos",
      },
    },
    update: {},
    create: {
      id: "guardado_laurinha_historia_seed",
      pessoaId: pessoaLaurinha.id,
      desafioId: "desafio_cat_historia_juntos",
    },
  });

  const participacoes = [
    {
      id: "part_laurinha_cores_seed",
      desafioId: "desafio_cat_memoria_cores",
      resultado: "concluiu",
      observacao: "Lembrou as três cores na primeira tentativa.",
      execucaoChave: "seed|laurinha|memoria_cores|1",
      dificuldadeAplicada: "simples",
      estrelasConcedidas: 2,
      dias: 3,
      saldoApos: 2,
    },
    {
      id: "part_laurinha_passos_seed",
      desafioId: "desafio_cat_contar_passos",
      resultado: "participou",
      observacao: "Contou junto até a porta, pediu para repetir.",
      execucaoChave: "seed|laurinha|contar_passos|1",
      dificuldadeAplicada: "simples",
      estrelasConcedidas: 1,
      dias: 1,
      saldoApos: 3,
    },
  ];

  for (const part of participacoes) {
    await prisma.participacaoDesafio.upsert({
      where: { id: part.id },
      update: {
        pessoaId: pessoaLaurinha.id,
        desafioId: part.desafioId,
        resultado: part.resultado,
        observacao: part.observacao,
        execucaoChave: part.execucaoChave,
        dificuldadeAplicada: part.dificuldadeAplicada,
        estrelasConcedidas: part.estrelasConcedidas,
        registradoPorId: usuarioResponsavel.id,
        registradoEm: diasAtras(part.dias, 16, 0),
        versaoAtiva: true,
        substituiId: null,
      },
      create: {
        id: part.id,
        pessoaId: pessoaLaurinha.id,
        desafioId: part.desafioId,
        resultado: part.resultado,
        observacao: part.observacao,
        execucaoChave: part.execucaoChave,
        dificuldadeAplicada: part.dificuldadeAplicada,
        estrelasConcedidas: part.estrelasConcedidas,
        registradoPorId: usuarioResponsavel.id,
        registradoEm: diasAtras(part.dias, 16, 0),
        versaoAtiva: true,
      },
    });

    await prisma.movimentoEstrelas.upsert({
      where: { id: `mov_${part.id}` },
      update: {
        pessoaId: pessoaLaurinha.id,
        tipo: "credito_participacao",
        quantidade: part.estrelasConcedidas,
        saldoApos: part.saldoApos,
        participacaoId: part.id,
        criadoEm: diasAtras(part.dias, 16, 1),
      },
      create: {
        id: `mov_${part.id}`,
        pessoaId: pessoaLaurinha.id,
        tipo: "credito_participacao",
        quantidade: part.estrelasConcedidas,
        saldoApos: part.saldoApos,
        participacaoId: part.id,
        criadoEm: diasAtras(part.dias, 16, 1),
      },
    });
  }

  await prisma.recompensa.upsert({
    where: { id: "recompensa_laurinha_cinema_seed" },
    update: {
      pessoaId: pessoaLaurinha.id,
      nome: "Escolher o filme da noite",
      custo: 5,
      ativa: true,
    },
    create: {
      id: "recompensa_laurinha_cinema_seed",
      pessoaId: pessoaLaurinha.id,
      nome: "Escolher o filme da noite",
      custo: 5,
      ativa: true,
    },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        familiaId: familia.id,
        familiaNome: "Família Oliveira",
        contas: {
          administrador: { email: emailAdmin, senha: senhaAdmin },
          responsavel: { email: emailResponsavel, senha: senhaResponsavel },
          integrante: { email: emailIntegrante, senha: senhaIntegrante },
        },
        pessoasCanonicas: {
          admin: pessoaAdmin.id,
          responsavel: pessoaResponsavel.id,
          integrante: pessoaIntegrante.id,
          vovo: pessoaVovo.id,
          laurinha: pessoaLaurinha.id,
        },
        autorizacoes: autorizacoes.map((a) => ({
          id: a.id,
          responsabilidade: a.responsabilidade,
          pessoaAlvoId: a.pessoaAlvoId,
        })),
        amostra: {
          medicamentosVovo: 2,
          consultas: 2,
          exames: 1,
          doses: doses.length,
          biblioteca: biblioteca.length,
          participacoesLaurinha: participacoes.length,
        },
        aviso:
          "Dados locais fictícios para os 3 perfis; Vovó e Laurinha sem conta.",
        fingerprintSeed: createHash("sha256")
          .update(
            `${familia.id}:${emailAdmin}:${emailResponsavel}:${emailIntegrante}:vovo:laurinha:3perfis`,
          )
          .digest("hex")
          .slice(0, 12),
      },
      null,
      2,
    ),
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
