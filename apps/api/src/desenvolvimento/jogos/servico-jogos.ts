import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { ProgressoFaseJogo } from "@prisma/client";
import { ServicoAutorizacoes } from "../../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../../comum/tipos-requisicao";
import { ServicoPrisma } from "../../prisma/servico-prisma";
import { selecionarDestaquesJogos } from "./destaques-jogos";
import { faixaPadrao, lerFaixaPedida } from "./faixas";
import { CODIGO_DATA_NASCIMENTO_OBRIGATORIA } from "../../pessoas/data-nascimento";
import { obterMotor } from "./motores-jogos";

@Injectable()
export class ServicoJogos {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  /**
   * Catálogo na faixa pedida (ticket 05): sem pedido, a faixa padrão da pessoa.
   * Sem data de nascimento, recusa e pede a data. Abrir e concluir fases não depende da faixa.
   */
  async listar(pessoaId: string, usuario: UsuarioAutenticado, faixaConsulta?: unknown) {
    const escopo = await this.exigirDesenvolvimento(pessoaId, usuario);
    const pedida = lerFaixaPedida(faixaConsulta);
    const pessoa = await this.prisma.pessoa.findUniqueOrThrow({
      where: { id: escopo.pessoaId },
      select: { nome: true, dataNascimento: true },
    });
    // DEV-CAT-P04/P05: sem data não há faixa; a interface orienta a informar (M01 §16).
    if (!pessoa.dataNascimento) {
      throw new ConflictException({
        statusCode: 409,
        message: `Informe a data de nascimento de ${pessoa.nome} para abrir os jogos.`,
        codigo: CODIGO_DATA_NASCIMENTO_OBRIGATORIA,
      });
    }
    const padrao = faixaPadrao(pessoa.dataNascimento);
    const faixa = pedida ?? padrao;
    const [progresso, catalogo] = await Promise.all([
      this.prisma.progressoFaseJogo.findMany({
        where: escopo,
        select: { jogoId: true, fase: true, concluidaEm: true, ultimaAberturaEm: true },
      }),
      this.prisma.jogoDigital.findMany({
        where: { ativo: true },
        orderBy: [{ ordemEditorial: "asc" }, { id: "asc" }],
        include: {
          fases: { orderBy: { numero: "asc" } },
        },
      }),
    ]);
    const porFase = new Map(progresso.map((item) => [`${item.jogoId}/${item.fase}`, item]));
    return {
      faixaPadrao: padrao,
      faixa,
      destaques: selecionarDestaquesJogos(catalogo, progresso),
      jogos: catalogo.map((jogo) => ({
        id: jogo.id,
        nome: jogo.nome,
        descricao: jogo.descricao,
        categoria: jogo.categoria,
        instrucoes: jogo.instrucoes,
        versao: jogo.versao,
        tipoMecanica: jogo.tipoMecanica,
        fases: jogo.fases.filter((fase) => faixa === "todas" || fase.trilha === faixa).map((fase) => {
          const progressoFase = porFase.get(`${jogo.id}/${fase.numero}`);
          return {
            numero: fase.numero,
            trilha: fase.trilha,
            titulo: fase.titulo,
            objetivo: fase.objetivo,
            estado: progressoFase?.concluidaEm
              ? "concluida"
              : progressoFase
                ? "experimentada"
                : "nao_explorada",
          };
        }),
      })),
    };
  }

  async iniciar(pessoaId: string, jogoId: string, numero: number, usuario: UsuarioAutenticado) {
    const escopo = await this.exigirDesenvolvimento(pessoaId, usuario);
    const { jogo, fase } = await this.exigirFase(jogoId, numero, { exigirAtivo: true });
    const motor = obterMotor(jogo.tipoMecanica);
    const configuracao = motor.validarConfiguracao(fase.configuracao);
    const identidade = { ...escopo, jogoId, fase: numero };
    const agora = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.progressoFaseJogo.createMany({
        data: {
          ...identidade,
          primeiraExploracaoEm: agora,
          versaoPrimeiraExploracao: jogo.versao,
          ultimaAberturaEm: agora,
          versaoUltimaAbertura: jogo.versao,
        },
        skipDuplicates: true,
      });
      await tx.progressoFaseJogo.updateMany({
        where: { ...identidade, ultimaAberturaEm: { lt: agora } },
        data: { ultimaAberturaEm: agora, versaoUltimaAbertura: jogo.versao },
      });
    });
    return {
      versao: jogo.versao,
      tipoMecanica: jogo.tipoMecanica,
      conteudo: motor.montarConteudo(configuracao),
    };
  }

  async concluir(
    pessoaId: string,
    jogoId: string,
    numero: number,
    usuario: UsuarioAutenticado,
    entrada: { versao?: unknown; chave?: unknown } | undefined,
  ) {
    const escopo = await this.exigirDesenvolvimento(pessoaId, usuario);
    const { jogo } = await this.exigirFase(jogoId, numero, { exigirAtivo: false });
    const { versao, chave } = entrada ?? {};
    if (typeof versao !== "number" || !Number.isInteger(versao) || versao < 1
      || typeof chave !== "string" || !/^[a-f0-9]{32}$/.test(chave)) {
      throw new BadRequestException("Confirmação da fase inválida.");
    }
    const identidade = { ...escopo, jogoId, fase: numero };
    const where = { familiaId_pessoaId_jogoId_fase: identidade };

    return this.prisma.$transaction(async (tx) => {
      const atual = await tx.progressoFaseJogo.findUnique({ where });
      if (!atual) throw new ConflictException("Comece a fase antes de concluir.");
      if (atual.concluidaEm && atual.chaveConclusao === chave && atual.versaoConclusao === versao) {
        return this.confirmacao(atual, chave, versao);
      }
      if (versao !== jogo.versao || atual.versaoUltimaAbertura !== versao) {
        throw new ConflictException("A fase foi atualizada. Abra a fase novamente para jogar.");
      }
      if (atual.concluidaEm) return this.confirmacao(atual, chave, versao);

      // A primeira atualização vence. Inícios e reenvios seguintes preservam este registro.
      await tx.progressoFaseJogo.updateMany({
        where: { ...identidade, concluidaEm: null, versaoUltimaAbertura: versao },
        data: {
          concluidaEm: new Date(),
          versaoConclusao: versao,
          chaveConclusao: chave,
          nomeNaConclusao: jogo.nome,
          categoriaNaConclusao: jogo.categoria,
        },
      });
      const salvo = await tx.progressoFaseJogo.findUniqueOrThrow({ where });
      if (!salvo.concluidaEm) {
        throw new ConflictException("A fase foi atualizada. Abra a fase novamente para jogar.");
      }
      return this.confirmacao(salvo, chave, versao);
    });
  }

  private confirmacao(registro: ProgressoFaseJogo, chave: string, versao: number) {
    return {
      concluidaEm: registro.concluidaEm,
      versaoConclusao: registro.versaoConclusao,
      primeiraDescoberta: registro.chaveConclusao === chave && registro.versaoConclusao === versao,
    };
  }

  private async exigirFase(
    jogoId: string,
    numero: number,
    opcoes: { exigirAtivo: boolean },
  ) {
    const jogo = await this.prisma.jogoDigital.findFirst({
      where: {
        id: jogoId,
        ...(opcoes.exigirAtivo ? { ativo: true } : {}),
      },
      include: {
        fases: { where: { numero }, take: 1 },
      },
    });
    const fase = jogo?.fases[0];
    if (!jogo || !fase) throw new NotFoundException("Fase não encontrada.");
    obterMotor(jogo.tipoMecanica);
    return { jogo, fase };
  }

  private async exigirDesenvolvimento(pessoaId: string, usuario: UsuarioAutenticado) {
    const familiaId = usuario.pessoa.familiaId;
    const pessoa = await this.prisma.pessoa.findFirst({
      where: { id: pessoaId, familiaId },
      select: { id: true },
    });
    if (!pessoa) throw new NotFoundException("Pessoa não encontrada.");
    const permitido = await this.autorizacoes.podeVerDesenvolvimento(familiaId, pessoa.id, usuario);
    if (!permitido) throw new ForbiddenException("Acesso negado ao desenvolvimento desta pessoa.");
    return { familiaId, pessoaId: pessoa.id };
  }
}
