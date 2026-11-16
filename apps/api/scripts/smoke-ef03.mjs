/** Smoke EF-03: resumo Vovó com previstos / tomadas / não tomadas / sem confirmação. */
import {
  garantirResponsavelCuidados,
  resolverPessoa,
  IDS_SEED,
} from "./lib-authz-smoke.mjs";

const base = process.env.API_URL ?? "http://localhost:3001";
const emailAdmin = process.env.PEF_ADMIN_EMAIL ?? "admin@pef.local";
const senhaAdmin = process.env.PEF_ADMIN_SENHA ?? "admin-local";

async function json(r) {
  const t = await r.text();
  try {
    return { status: r.status, corpo: JSON.parse(t) };
  } catch {
    return { status: r.status, corpo: t };
  }
}

async function login(email, senha) {
  const r = await fetch(`${base}/sessoes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const d = await json(r);
  if (r.status >= 300) throw new Error(`login: ${JSON.stringify(d.corpo)}`);
  return d.corpo;
}

const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

try {
  const admin = await login(emailAdmin, senhaAdmin);
  const familiaId = admin.usuario.pessoa.familiaId;
  const h = {
    "content-type": "application/json",
    "x-sessao-token": admin.token,
  };

  const vovo = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.vovo,
    nome: "Vovó",
  });
  const laurinha = await resolverPessoa(base, h, familiaId, {
    idSeed: IDS_SEED.laurinha,
    nome: "Laurinha",
  });

  await garantirResponsavelCuidados(
    base,
    h,
    familiaId,
    admin.usuario.id,
    vovo.id,
  );

  const hoje = new Date().toISOString().slice(0, 10);
  const antes = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/resumo-cuidados?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  const previstosAntes = antes.corpo?.doses?.previstos ?? 0;

  const med = await json(
    await fetch(`${base}/pessoas/${vovo.id}/medicamentos`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        nome: `EF03 ${Date.now()}`,
        horarios: ["08:00", "20:00"],
        primeiroHorario: "08:00",
        dosesPorDia: 2,
        duracaoTipo: "continua",
        horariosConferidos: true,
        ativar: true,
      }),
    }),
  );
  reg("medicamento-ativado", med.status < 300, {
    status: med.status,
    id: med.corpo?.id,
  });

  const resumo = await json(
    await fetch(
      `${base}/pessoas/${vovo.id}/resumo-cuidados?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  const d = resumo.corpo?.doses;
  const delta = (d?.previstos ?? 0) - previstosAntes;
  reg(
    "resumo-com-previstos-e-sem-confirmacao",
    resumo.status < 300 &&
      delta === 2 &&
      (d?.semConfirmacao ?? 0) - (antes.corpo?.doses?.semConfirmacao ?? 0) ===
        2 &&
      resumo.corpo?.inferenciaClinica === false &&
      typeof resumo.corpo?.esclarecimento === "string" &&
      String(resumo.corpo.esclarecimento).toLowerCase().includes("não significa"),
    {
      status: resumo.status,
      doses: d,
      previstosAntes,
      delta,
    },
  );

  const perfil = await json(
    await fetch(`${base}/familias/${familiaId}/pessoas/${vovo.id}`, {
      headers: h,
    }),
  );
  const areaResumo = perfil.corpo?.areas?.find((a) => a.id === "resumo");
  reg(
    "perfil-area-resumo-disponivel",
    areaResumo?.disponivel === true,
    areaResumo,
  );

  const negadoLaurinha = await json(
    await fetch(
      `${base}/pessoas/${laurinha.id}/resumo-cuidados?de=${hoje}&ate=${hoje}`,
      { headers: h },
    ),
  );
  reg(
    "resumo-cuidados-negado-sem-auth-cuidados",
    negadoLaurinha.status === 403,
    { status: negadoLaurinha.status },
  );

  const ok = resultados.every((r) => r.ok);
  console.log(JSON.stringify({ ok, resultados }, null, 2));
  process.exitCode = ok ? 0 : 1;
} catch (e) {
  console.error(e);
  console.log(JSON.stringify({ ok: false, resultados, erro: String(e) }, null, 2));
  process.exitCode = 1;
}
