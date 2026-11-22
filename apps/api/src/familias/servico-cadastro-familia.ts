import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { gerarHashSenha } from "../comum/senha";
import {
  ehSlugReservado,
  normalizarSlugFamilia,
  proximoSlugAlternativo,
  sugerirSlugAPartirDoNome,
} from "../comum/slug-familia";
import { ServicoPrisma } from "../prisma/servico-prisma";

type EntradaCadastro = {
  nomeFamilia?: string;
  nomeTitular?: string;
  email?: string;
  senha?: string;
  slug?: string;
  /** Campos rejeitados se presentes com intenção de destino externo. */
  familiaId?: unknown;
  papel?: unknown;
  responsabilidade?: unknown;
  pessoaId?: unknown;
};

type JanelaLimite = { contagem: number; reiniciaEm: number };

const LIMITE_CADASTROS = 40;
const JANELA_MS = 15 * 60 * 1000;

@Injectable()
export class ServicoCadastroFamilia {
  private readonly limitePorOrigem = new Map<string, JanelaLimite>();

  constructor(private readonly prisma: ServicoPrisma) {}

  sugerirEndereco(nome: string) {
    const slug = sugerirSlugAPartirDoNome(nome);
    return { slug };
  }

  async cadastrarInicial(entrada: EntradaCadastro, origem = "anonimo") {
    this.aplicarLimite(origem);

    if (
      entrada.familiaId != null ||
      entrada.papel != null ||
      entrada.responsabilidade != null ||
      entrada.pessoaId != null
    ) {
      throw new BadRequestException(
        "O cadastro inicial cria somente a nova família e sua primeira administração.",
      );
    }

    const nomeFamilia = String(entrada.nomeFamilia ?? "").trim();
    const nomeTitular = String(entrada.nomeTitular ?? "").trim();
    const email = String(entrada.email ?? "")
      .trim()
      .toLowerCase();
    const senha = String(entrada.senha ?? "");
    const slugInformado = String(entrada.slug ?? "").trim();

    if (!nomeFamilia) {
      throw new BadRequestException("Informe o nome da família.");
    }
    if (!nomeTitular) {
      throw new BadRequestException("Informe o nome do titular.");
    }
    if (!email || !email.includes("@")) {
      throw new BadRequestException("Informe um e-mail válido.");
    }
    if (senha.length < 8) {
      throw new BadRequestException("A senha deve ter ao menos 8 caracteres.");
    }

    const slug = normalizarSlugFamilia(
      slugInformado || sugerirSlugAPartirDoNome(nomeFamilia),
    );

    const senhaHash = gerarHashSenha(senha);

    try {
      const criado = await this.prisma.$transaction(async (tx) => {
        const familia = await tx.familia.create({
          data: { nome: nomeFamilia, slug },
        });
        const pessoa = await tx.pessoa.create({
          data: {
            familiaId: familia.id,
            nome: nomeTitular,
            vinculo: null,
          },
        });
        const usuario = await tx.usuario.create({
          data: {
            pessoaId: pessoa.id,
            email,
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

      return {
        ...criado,
        caminhoEntrada: `/f/${criado.familia.slug}/entrar`,
      };
    } catch (erro: unknown) {
      const codigo = (erro as { code?: string })?.code;
      if (codigo === "P2002") {
        const alvo = Array.isArray((erro as { meta?: { target?: unknown } })?.meta?.target)
          ? ((erro as { meta: { target: string[] } }).meta.target).join(",")
          : String((erro as { meta?: { target?: unknown } })?.meta?.target ?? "");
        if (alvo.includes("slug")) {
          const alternativa = await this.buscarAlternativaSlug(slug);
          throw new ConflictException({
            message: "Já existe família com este endereço.",
            codigo: "COLISAO_SLUG",
            alternativa,
          });
        }
        if (alvo.includes("email")) {
          throw new ConflictException({
            message: "Já existe conta com este e-mail.",
            codigo: "COLISAO_EMAIL",
          });
        }
        throw new ConflictException("Não foi possível concluir o cadastro.");
      }
      throw erro;
    }
  }

  private async buscarAlternativaSlug(slugBase: string): Promise<string> {
    for (let i = 2; i <= 30; i += 1) {
      const candidato = proximoSlugAlternativo(slugBase, i);
      if (ehSlugReservado(candidato)) continue;
      const existe = await this.prisma.familia.findUnique({
        where: { slug: candidato },
        select: { id: true },
      });
      if (!existe) return candidato;
    }
    return proximoSlugAlternativo(slugBase, Date.now() % 100000);
  }

  private aplicarLimite(origem: string) {
    const agora = Date.now();
    const chave = origem.trim() || "anonimo";
    const atual = this.limitePorOrigem.get(chave);
    if (!atual || atual.reiniciaEm <= agora) {
      this.limitePorOrigem.set(chave, {
        contagem: 1,
        reiniciaEm: agora + JANELA_MS,
      });
      return;
    }
    if (atual.contagem >= LIMITE_CADASTROS) {
      throw new HttpException(
        "Muitas tentativas de cadastro. Aguarde alguns minutos e tente de novo.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    atual.contagem += 1;
  }
}
