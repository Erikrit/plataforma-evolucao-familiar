/**
 * Seed local fictício — Família Oliveira (máx. 6 pessoas).
 * 3 contas para os perfis Admin / Responsável / Integrante.
 * Vovó e Laurinha sem conta. Dados fictícios; não usar dados reais.
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
  const familia = await prisma.familia.create({
    data: {
      id: "familia_seed_local",
      nome: "Família Oliveira",
      slug: "oliveira",
    },
  });

  const pessoaAdmin = await prisma.pessoa.create({
    data: {
      id: "pessoa_admin_seed",
      familiaId: familia.id,
      nome: "Carlos Oliveira",
      vinculo: "neto",
      dataNascimento: new Date("1988-04-12T12:00:00.000Z"),
    },
  });

  const pessoaResponsavel = await prisma.pessoa.create({
    data: {
      id: "pessoa_mikaela_seed",
      familiaId: familia.id,
      nome: "Mikaela Oliveira",
      vinculo: "filha",
      dataNascimento: new Date("1992-09-03T12:00:00.000Z"),
    },
  });

  const pessoaIntegrante = await prisma.pessoa.create({
    data: {
      id: "pessoa_integrante_seed",
      familiaId: familia.id,
      nome: "Ana Paula Santos",
      vinculo: "colaboradora",
      dataNascimento: new Date("1995-11-21T12:00:00.000Z"),
    },
  });

  const pessoaVovo = await prisma.pessoa.create({
    data: {
      id: "pessoa_vovo_seed",
      familiaId: familia.id,
      nome: "Helena Oliveira",
      vinculo: "avó",
      dataNascimento: new Date("1947-02-18T12:00:00.000Z"),
    },
  });

  const pessoaLaurinha = await prisma.pessoa.create({
    data: {
      id: "pessoa_laurinha_seed",
      familiaId: familia.id,
      nome: "Laurinha",
      vinculo: "neta",
      dataNascimento: new Date("2019-06-14T12:00:00.000Z"),
    },
  });

  const pessoaTio = await prisma.pessoa.create({
    data: {
      id: "pessoa_ricardo_seed",
      familiaId: familia.id,
      nome: "Ricardo Oliveira",
      vinculo: "filho",
      dataNascimento: new Date("1968-07-22T12:00:00.000Z"),
    },
  });

  const usuarioAdmin = await prisma.usuario.create({
    data: {
      id: "usuario_admin_seed",
      pessoaId: pessoaAdmin.id,
      email: emailAdmin,
      senhaHash: gerarHashSenha(senhaAdmin),
    },
  });

  const usuarioResponsavel = await prisma.usuario.create({
    data: {
      id: "usuario_mikaela_seed",
      pessoaId: pessoaResponsavel.id,
      email: emailResponsavel,
      senhaHash: gerarHashSenha(senhaResponsavel),
    },
  });

  const usuarioIntegrante = await prisma.usuario.create({
    data: {
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
    await prisma.autorizacao.create({
      data: {
        id: auth.id,
        familiaId: familia.id,
        usuarioId: auth.usuarioId,
        responsabilidade: auth.responsabilidade,
        pessoaAlvoId: auth.pessoaAlvoId,
        ativa: true,
      },
    });
  }

  const { CATALOGO_BIBLIOTECA_E4 } = await import("./catalogo-biblioteca-e4.mjs");
  if (CATALOGO_BIBLIOTECA_E4.length > 24) {
    throw new Error("Catálogo E4 excede o limite de 24 modelos ativos.");
  }

  for (const item of CATALOGO_BIBLIOTECA_E4) {
    await prisma.desafio.create({
      data: {
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
    });
  }

  const inicioVigencia = diasAtras(21, 8, 0);

  const medPressao = await prisma.medicamento.create({
    data: {
      id: "med_vovo_pressao_seed",
      pessoaId: pessoaVovo.id,
      nome: "Losartana 50 mg",
      instrucoes: "1 comprimido pela manhã, com um copo d'água.",
      status: "ativo",
      criadoPorId: usuarioResponsavel.id,
      ativadoEm: inicioVigencia,
    },
  });

  const medEstomago = await prisma.medicamento.create({
    data: {
      id: "med_vovo_estomago_seed",
      pessoaId: pessoaVovo.id,
      nome: "Omeprazol 20 mg",
      instrucoes: "Em jejum, cerca de 30 minutos antes do café.",
      status: "ativo",
      criadoPorId: usuarioResponsavel.id,
      ativadoEm: inicioVigencia,
    },
  });

  await prisma.programacaoMedicamento.create({
    data: {
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

  await prisma.programacaoMedicamento.create({
    data: {
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

  /** Histórico curto e crível dos últimos dias (mistura tomada / não tomada / sem registro). */
  const padraoDoses = [
    { dias: 4, pressao: "tomou_conforme_informacao", estomago: "tomou_conforme_informacao", por: "integrante" },
    { dias: 3, pressao: "tomou_conforme_informacao", estomago: "tomou_conforme_informacao", por: "responsavel" },
    { dias: 2, pressao: "tomou_conforme_informacao", estomago: "informou_nao_tomou", por: "integrante" },
    { dias: 1, pressao: "tomou_conforme_informacao", estomago: "tomou_conforme_informacao", por: "integrante" },
    { dias: 0, pressao: "tomou_conforme_informacao", estomago: "informou_nao_tomou", por: "responsavel" },
  ];

  let idxDose = 0;
  for (const dia of padraoDoses) {
    const registradorId =
      dia.por === "integrante" ? usuarioIntegrante.id : usuarioResponsavel.id;
    const dataRef = diasAtras(dia.dias, 0, 0);
    const dataIso = dataRef.toISOString().slice(0, 10);

    for (const item of [
      {
        medId: medPressao.id,
        horario: "08:00",
        situacao: dia.pressao,
        hora: 8,
        minuto: 5 + (dia.dias % 3),
      },
      {
        medId: medEstomago.id,
        horario: "07:00",
        situacao: dia.estomago,
        hora: 7,
        minuto: 2 + (dia.dias % 2),
      },
    ]) {
      idxDose += 1;
      const tomou = item.situacao === "tomou_conforme_informacao";
      await prisma.registroDose.create({
        data: {
          id: `dose_seed_${idxDose}`,
          medicamentoId: item.medId,
          ocorrenciaChave: chaveDose(item.medId, dataIso, item.horario),
          situacao: item.situacao,
          horarioEfetivo: tomou
            ? diasAtras(dia.dias, item.hora, item.minuto)
            : null,
          registradoPorId: registradorId,
          versaoAtiva: true,
        },
      });
    }
  }

  await prisma.consulta.create({
    data: {
      id: "consulta_vovo_cardio_seed",
      pessoaId: pessoaVovo.id,
      dataHora: diasAFrente(5, 10, 0),
      especialidadeOuDescricao: "Cardiologia — retorno",
      profissional: "Dra. Renata Lima",
      local: "Clínica Horizonte",
      observacao: "Levar lista atualizada de medicamentos e pressão dos últimos dias.",
      status: "agendada",
      criadoPorId: usuarioResponsavel.id,
    },
  });

  await prisma.consulta.create({
    data: {
      id: "consulta_vovo_clinico_seed",
      pessoaId: pessoaVovo.id,
      dataHora: diasAtras(12, 15, 30),
      especialidadeOuDescricao: "Clínico geral",
      profissional: "Dr. Paulo Mendes",
      local: "UBS Centro",
      observacao: "Queixa leve de azia; orientou manter omeprazol.",
      status: "realizada",
      criadoPorId: usuarioResponsavel.id,
    },
  });

  await prisma.consulta.create({
    data: {
      id: "consulta_vovo_fisio_seed",
      pessoaId: pessoaVovo.id,
      dataHora: diasAFrente(2, 14, 0),
      especialidadeOuDescricao: "Fisioterapia — joelho direito",
      profissional: "Ft. Camila Borges",
      local: "Espaço Movimento",
      observacao: "Sessão de fortalecimento; ir com calçado confortável.",
      status: "agendada",
      criadoPorId: usuarioResponsavel.id,
    },
  });

  await prisma.exame.create({
    data: {
      id: "exame_vovo_sangue_seed",
      pessoaId: pessoaVovo.id,
      descricao: "Hemograma completo + glicemia de jejum",
      data: diasAtras(10, 8, 0),
      consultaId: "consulta_vovo_clinico_seed",
      criadoPorId: usuarioResponsavel.id,
    },
  });

  await prisma.exame.create({
    data: {
      id: "exame_vovo_pressao_seed",
      pessoaId: pessoaVovo.id,
      descricao: "Aferição de pressão arterial (controle)",
      data: diasAtras(3, 9, 15),
      criadoPorId: usuarioIntegrante.id,
    },
  });

  const rotinas = [
    {
      id: "apoio_vovo_d4_seed",
      dias: 4,
      hora: 18,
      minuto: 10,
      por: usuarioIntegrante.id,
      observacao:
        "Helena almoçou bem, tomou café da tarde com biscoito e assistiu ao jornal.",
    },
    {
      id: "apoio_vovo_d2_seed",
      dias: 2,
      hora: 12,
      minuto: 40,
      por: usuarioIntegrante.id,
      observacao:
        "Relatou azia leve pela manhã (omeprazol não tomado). Depois do almoço ficou melhor.",
    },
    {
      id: "apoio_vovo_hoje_seed",
      dias: 0,
      hora: 14,
      minuto: 20,
      por: usuarioIntegrante.id,
      observacao:
        "Acordou bem-disposta, caminhou no quintal e pediu para marcar a fisioterapia.",
    },
  ];

  for (const rotina of rotinas) {
    await prisma.registroAtividade.create({
      data: {
        id: rotina.id,
        pessoaId: pessoaVovo.id,
        descricao: "Observação do dia",
        observacao: rotina.observacao,
        concluidaEm: diasAtras(rotina.dias, rotina.hora, rotina.minuto),
        registradoPorId: rotina.por,
      },
    });
  }

  await prisma.desafioGuardado.create({
    data: {
      id: "guardado_laurinha_historia_seed",
      pessoaId: pessoaLaurinha.id,
      desafioId: "desafio_cat_historia_juntos",
    },
  });

  await prisma.desafioGuardado.create({
    data: {
      id: "guardado_laurinha_desenho_seed",
      pessoaId: pessoaLaurinha.id,
      desafioId: "desafio_cat_desenho_livre",
    },
  });

  const participacoes = [
    {
      id: "part_laurinha_cores_seed",
      desafioId: "desafio_cat_memoria_cores",
      resultado: "concluiu",
      observacao: "Lembrou as três cores na primeira tentativa e quis repetir.",
      execucaoChave: "seed|laurinha|memoria_cores|1",
      dificuldadeAplicada: "simples",
      estrelasConcedidas: 2,
      dias: 5,
      saldoApos: 2,
    },
    {
      id: "part_laurinha_passos_seed",
      desafioId: "desafio_cat_contar_passos",
      resultado: "participou",
      observacao: "Contou junto até a porta; pediu para fazer de novo no dia seguinte.",
      execucaoChave: "seed|laurinha|contar_passos|1",
      dificuldadeAplicada: "simples",
      estrelasConcedidas: 1,
      dias: 3,
      saldoApos: 3,
    },
    {
      id: "part_laurinha_equilibrio_seed",
      desafioId: "desafio_cat_equilibrio",
      resultado: "concluiu",
      observacao: "Andou de mãos dadas com a Mikaela sem perder o equilíbrio.",
      execucaoChave: "seed|laurinha|equilibrio|1",
      dificuldadeAplicada: "simples",
      estrelasConcedidas: 2,
      dias: 1,
      saldoApos: 5,
    },
  ];

  for (const part of participacoes) {
    await prisma.participacaoDesafio.create({
      data: {
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

    await prisma.movimentoEstrelas.create({
      data: {
        id: `mov_${part.id}`,
        pessoaId: pessoaLaurinha.id,
        tipo: "credito_participacao",
        quantidade: part.estrelasConcedidas,
        saldoApos: part.saldoApos,
        participacaoId: part.id,
        criadoEm: diasAtras(part.dias, 16, 1),
      },
    });

    await prisma.disponibilidadeDesafio.create({
      data: {
        id: `disp_${part.id}`,
        pessoaId: pessoaLaurinha.id,
        desafioId: part.desafioId,
        disponivelParaNovaParticipacao: false,
        atualizadoPorId: usuarioResponsavel.id,
      },
    });
  }

  await prisma.recompensa.create({
    data: {
      id: "recompensa_laurinha_cinema_seed",
      pessoaId: pessoaLaurinha.id,
      nome: "Escolher o filme da noite",
      custo: 5,
      ativa: true,
      disponivelParaResgate: true,
      geracaoDisponibilidade: 0,
    },
  });

  await prisma.recompensa.create({
    data: {
      id: "recompensa_laurinha_sorvete_seed",
      pessoaId: pessoaLaurinha.id,
      nome: "Sorvete no fim de semana",
      custo: 3,
      ativa: true,
      disponivelParaResgate: true,
      geracaoDisponibilidade: 0,
    },
  });

  const totalPessoas = await prisma.pessoa.count({
    where: { familiaId: familia.id },
  });
  if (totalPessoas > 6) {
    throw new Error(`seed ultrapassou o limite de 6 pessoas (${totalPessoas})`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        familiaId: familia.id,
        familiaNome: "Família Oliveira",
        totalPessoas,
        contas: {
          administrador: { email: emailAdmin, senha: senhaAdmin },
          responsavel: { email: emailResponsavel, senha: senhaResponsavel },
          integrante: { email: emailIntegrante, senha: senhaIntegrante },
        },
        pessoas: [
          { id: pessoaAdmin.id, nome: pessoaAdmin.nome, conta: true },
          { id: pessoaResponsavel.id, nome: pessoaResponsavel.nome, conta: true },
          { id: pessoaIntegrante.id, nome: pessoaIntegrante.nome, conta: true },
          { id: pessoaVovo.id, nome: pessoaVovo.nome, conta: false },
          { id: pessoaLaurinha.id, nome: pessoaLaurinha.nome, conta: false },
          { id: pessoaTio.id, nome: pessoaTio.nome, conta: false },
        ],
        amostra: {
          medicamentosVovo: 2,
          consultas: 3,
          exames: 2,
          doses: idxDose,
          observacoesRotina: rotinas.length,
          biblioteca: biblioteca.length,
          participacoesLaurinha: participacoes.length,
          recompensas: 2,
        },
        aviso:
          "Seed local fictício (≤6 pessoas). Smokes da esteira podem criar dados temporários de novo.",
        fingerprintSeed: createHash("sha256")
          .update(
            `${familia.id}:${emailAdmin}:${emailResponsavel}:${emailIntegrante}:vovo:laurinha:ricardo:v2`,
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
