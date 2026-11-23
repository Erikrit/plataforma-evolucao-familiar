/** Check estático M01-SIMP-CAD: invariantes de código da simplificação v1.5 §11. */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const resultados = [];
const reg = (nome, ok, detalhe) => resultados.push({ nome, ok, detalhe });

const convites = readFileSync(
  join(raiz, "apps/api/src/convites/servico-convites.ts"),
  "utf8",
);
const schema = readFileSync(join(raiz, "apps/api/prisma/schema.prisma"), "utf8");
const authz = readFileSync(
  join(raiz, "apps/api/src/autorizacoes/servico-autorizacoes.ts"),
  "utf8",
);
const fundacao = readFileSync(
  join(raiz, "apps/web/src/componentes/painel-fundacao.tsx"),
  "utf8",
);
const gerenciar = readFileSync(
  join(raiz, "apps/web/src/componentes/painel-gerenciar-familia.tsx"),
  "utf8",
);

reg(
  "schema-pessoaContaId",
  schema.includes("pessoaContaId") && schema.includes("ConvitePessoaConta"),
  "campo e relação",
);
reg(
  "ativar-reutiliza-pessoa",
  convites.includes("pessoaContaId") &&
    convites.includes("reutilizouPessoa") &&
    convites.includes("convite.pessoaContaId"),
  "ativação sem duplicar",
);
reg(
  "sem-migracao-legada",
  !convites.includes("migrarConta") && !convites.includes("reconcil"),
  "sem procedimento legado",
);
reg(
  "entrada-contextos",
  authz.includes("destinoEntrada") &&
    authz.includes("contextos") &&
    fundacao.includes("destinoEntrada") &&
    fundacao.includes("Escolha o acompanhamento"),
  "entrada contextual",
);
reg(
  "ux-habilitar-conta",
  gerenciar.includes("precisaEntrar") &&
    gerenciar.includes("pessoaContaId") &&
    gerenciar.includes("Habilitar conta"),
  "cadastro + habilitar",
);
reg(
  "auto-sem-programacao-automatica",
  authz.includes("podeAlterarProgramacaoCuidados") &&
    !/podeAlterarProgramacaoCuidados[\s\S]{0,200}usuario\.pessoa\.id === pessoaId/.test(
      authz,
    ),
  "programação não é automática no acesso próprio",
);

const ok = resultados.every((r) => r.ok);
console.log(JSON.stringify({ ok, resultados }, null, 2));
process.exit(ok ? 0 : 1);
