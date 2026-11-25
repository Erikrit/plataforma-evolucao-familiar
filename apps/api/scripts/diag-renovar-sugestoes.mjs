/**
 * Diagnóstico pontual: Renovar sugestões (backend/auth/elegibilidade/esgotamento).
 * Não altera produto. Requer API em API_URL.
 */
import { PrismaClient } from "@prisma/client";
import { CATALOGO_BIBLIOTECA_E4 } from "../prisma/catalogo-biblioteca-e4.mjs";
import { provisionarFamiliaComAdmin } from "./lib-provisionar-familia.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const prisma = new PrismaClient();
const stamp = Date.now();

async function json(r) {
  const t = await r.text();
  try {
    return { status: r.status, corpo: JSON.parse(t), bruto: t };
  } catch {
    return { status: r.status, corpo: t, bruto: t };
  }
}

async function login(email, senha, familiaSlug) {
  return json(
    await fetch(`${base}/sessoes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, senha, familiaSlug }),
    }),
  );
}

function headers(token) {
  return { "content-type": "application/json", "x-sessao-token": token };
}

async function garantirCatalogo() {
  for (const item of CATALOGO_BIBLIOTECA_E4) {
    await prisma.desafio.upsert({
      where: { id: item.id },
      create: {
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
      update: {
        nome: item.nome,
        ativo: true,
        familiaId: null,
        origem: "catalogo",
      },
    });
  }
  return prisma.desafio.count({
    where: { origem: "catalogo", familiaId: null, ativo: true },
  });
}

async function main() {
  const ativos = await garantirCatalogo();
  const slug = `diag-renovar-${stamp}`;
  const email = `diag.renovar.${stamp}@pef.local`;
  const senha = `Diag-Renovar-${stamp}`;
  const fam = await provisionarFamiliaComAdmin(prisma, {
    nomeFamilia: `Diag Renovar ${stamp}`,
    slug,
    nomeAdmin: `Admin Diag ${stamp}`,
    emailAdmin: email,
    senhaAdmin: senha,
  });
  const sess = await login(email, senha, slug);
  if (sess.status >= 300) {
    throw new Error(`login falhou: ${sess.status} ${sess.bruto}`);
  }
  const h = headers(sess.corpo.token);
  const adminId = sess.corpo.usuario?.id;

  const pessoa = await json(
    await fetch(`${base}/familias/${fam.familia.id}/pessoas`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ nome: `Pessoa Diag ${stamp}` }),
    }),
  );
  const pessoaId = pessoa.corpo?.id;
  if (!pessoaId) throw new Error(`cria pessoa falhou: ${pessoa.bruto}`);

  const semAuth = await json(
    await fetch(`${base}/pessoas/${pessoaId}/sugestoes/renovar`, {
      method: "POST",
      headers: h,
    }),
  );

  const authDev = await json(
    await fetch(`${base}/familias/${fam.familia.id}/autorizacoes`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        usuarioId: adminId,
        responsabilidade: "responsavel_desenvolvimento",
        // M01 §16: data fictícia exigida para Desenvolvimento.
        dataNascimentoAlvo: "2018-05-10",
        pessoaAlvoId: pessoaId,
      }),
    }),
  );

  const lista1 = await json(
    await fetch(`${base}/pessoas/${pessoaId}/sugestoes`, { headers: h }),
  );
  const ids1 = (lista1.corpo?.sugestoes ?? []).map((s) => s.id);

  const renovar1 = await json(
    await fetch(`${base}/pessoas/${pessoaId}/sugestoes/renovar`, {
      method: "POST",
      headers: h,
    }),
  );
  const ids2 = (renovar1.corpo?.sugestoes ?? []).map((s) => s.id);
  const novos = ids2.filter((id) => !ids1.includes(id));

  let ultimo = renovar1;
  let rodadas = 1;
  for (; rodadas < 16; rodadas += 1) {
    ultimo = await json(
      await fetch(`${base}/pessoas/${pessoaId}/sugestoes/renovar`, {
        method: "POST",
        headers: h,
      }),
    );
    if ((ultimo.corpo?.trocadas ?? 0) === 0) break;
  }

  // Escolher todas e tentar renovar
  for (const id of ids2.slice(0, 6)) {
    await fetch(`${base}/pessoas/${pessoaId}/sugestoes/${id}/escolher`, {
      method: "POST",
      headers: h,
    });
  }
  const renovarTodasEscolhidas = await json(
    await fetch(`${base}/pessoas/${pessoaId}/sugestoes/renovar`, {
      method: "POST",
      headers: h,
    }),
  );

  const relatorio = {
    catalogoAtivo: ativos,
    authOrganizacao: {
      semResponsabilidadeDev: {
        status: semAuth.status,
        mensagem: semAuth.corpo?.message,
      },
      comResponsabilidadeDev: { status: authDev.status },
    },
    listar: { status: lista1.status, total: ids1.length },
    renovarPrimeiro: {
      status: renovar1.status,
      trocadas: renovar1.corpo?.trocadas,
      mensagem: renovar1.corpo?.mensagem,
      novos: novos.length,
    },
    aposEsgotarCandidatos: {
      rodadas,
      status: ultimo.status,
      trocadas: ultimo.corpo?.trocadas,
      mensagem: ultimo.corpo?.mensagem,
    },
    aposTodasEscolhidas: {
      status: renovarTodasEscolhidas.status,
      trocadas: renovarTodasEscolhidas.corpo?.trocadas,
      mensagem: renovarTodasEscolhidas.corpo?.mensagem,
    },
  };

  let causa = "INDETERMINADO";
  if (semAuth.status === 403 && renovar1.status < 300 && (renovar1.corpo?.trocadas ?? 0) > 0) {
    causa = "BACKEND_OK; falha percebida tende a UX (feedback longe da ação) ou esgotamento/escolhas preservadas";
  } else if (renovar1.status === 403) {
    causa = "AUTORIZACAO";
  } else if (renovar1.status >= 300) {
    causa = "BACKEND_HTTP";
  } else if ((renovar1.corpo?.trocadas ?? 0) === 0) {
    causa = "ESGOTAMENTO_OU_SEM_SUBSTITUIVEIS_NA_PRIMEIRA";
  }
  relatorio.conclusaoCausaProvavel = causa;
  console.log(JSON.stringify(relatorio, null, 2));
}

main()
  .catch((e) => {
    console.error("diag-renovar falhou:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
