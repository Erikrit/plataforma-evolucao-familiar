/**
 * Provisionamento privado de família + primeira administração (E1-ACE-01).
 * Uso apenas por utilitário CLI / testes locais — não exposto na API pública.
 */
import { randomBytes, scryptSync } from "node:crypto";

const PADRAO_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAMANHO_MIN = 2;
const TAMANHO_MAX = 48;
const SLUGS_RESERVADOS = new Set([
  "criar",
  "entrar",
  "acessar",
  "convites",
  "pessoas",
  "gerenciar-familia",
]);

export function normalizarSlugFamilia(valor) {
  const slug = String(valor ?? "")
    .trim()
    .toLowerCase();
  if (
    slug.length < TAMANHO_MIN ||
    slug.length > TAMANHO_MAX ||
    !PADRAO_SLUG.test(slug)
  ) {
    const erro = new Error(
      "Endereço de família inválido. Use letras minúsculas, números e hífens.",
    );
    erro.codigo = "SLUG_INVALIDO";
    throw erro;
  }
  if (SLUGS_RESERVADOS.has(slug)) {
    const erro = new Error(
      "Este endereço é reservado. Escolha outro identificador.",
    );
    erro.codigo = "SLUG_RESERVADO";
    throw erro;
  }
  return slug;
}

function gerarHashSenha(senha) {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

/**
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {{ nomeFamilia: string, slug: string, nomeAdmin: string, emailAdmin: string, senhaAdmin: string, vinculoAdmin?: string|null }} entrada
 */
export async function provisionarFamiliaComAdmin(prisma, entrada) {
  const nomeFamilia = String(entrada.nomeFamilia ?? "").trim();
  const nomeAdmin = String(entrada.nomeAdmin ?? "").trim();
  const emailAdmin = String(entrada.emailAdmin ?? "")
    .trim()
    .toLowerCase();
  const senhaAdmin = String(entrada.senhaAdmin ?? "");
  const slug = normalizarSlugFamilia(entrada.slug);
  const vinculoAdmin =
    entrada.vinculoAdmin === undefined || entrada.vinculoAdmin === null
      ? null
      : String(entrada.vinculoAdmin).trim() || null;

  if (!nomeFamilia) {
    const erro = new Error("Nome da família é obrigatório.");
    erro.codigo = "DADOS_INVALIDOS";
    throw erro;
  }
  if (!nomeAdmin) {
    const erro = new Error("Nome do administrador é obrigatório.");
    erro.codigo = "DADOS_INVALIDOS";
    throw erro;
  }
  if (!emailAdmin || !emailAdmin.includes("@")) {
    const erro = new Error("E-mail do administrador inválido.");
    erro.codigo = "DADOS_INVALIDOS";
    throw erro;
  }
  if (senhaAdmin.length < 8) {
    const erro = new Error("Senha do administrador deve ter ao menos 8 caracteres.");
    erro.codigo = "DADOS_INVALIDOS";
    throw erro;
  }

  const senhaHash = gerarHashSenha(senhaAdmin);

  try {
    return await prisma.$transaction(async (tx) => {
      const familia = await tx.familia.create({
        data: { nome: nomeFamilia, slug },
      });
      const pessoa = await tx.pessoa.create({
        data: {
          familiaId: familia.id,
          nome: nomeAdmin,
          vinculo: vinculoAdmin,
        },
      });
      const usuario = await tx.usuario.create({
        data: {
          pessoaId: pessoa.id,
          email: emailAdmin,
          senhaHash,
        },
      });
      await tx.autorizacao.create({
        data: {
          familiaId: familia.id,
          usuarioId: usuario.id,
          responsabilidade: "administrador",
          pessoaAlvoId: null,
          ativa: true,
        },
      });
      return {
        familia: { id: familia.id, nome: familia.nome, slug: familia.slug },
        pessoa: { id: pessoa.id, nome: pessoa.nome },
        usuario: { id: usuario.id, email: usuario.email },
      };
    });
  } catch (erro) {
    const codigo = erro?.code;
    if (codigo === "P2002") {
      const alvo = Array.isArray(erro?.meta?.target)
        ? erro.meta.target.join(",")
        : String(erro?.meta?.target ?? "");
      const conflito = new Error(
        alvo.includes("slug")
          ? "Já existe família com este endereço."
          : alvo.includes("email")
            ? "Já existe conta com este e-mail."
            : "Conflito de unicidade ao provisionar família.",
      );
      conflito.codigo = "COLISAO";
      throw conflito;
    }
    throw erro;
  }
}
