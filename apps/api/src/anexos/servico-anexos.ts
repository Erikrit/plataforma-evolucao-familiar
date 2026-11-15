import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "node:crypto";
import { ServicoPrisma } from "../prisma/servico-prisma";
import { ServicoAutorizacoes } from "../autorizacoes/servico-autorizacoes";
import type { UsuarioAutenticado } from "../comum/tipos-requisicao";

@Injectable()
export class ServicoAnexos {
  constructor(
    private readonly prisma: ServicoPrisma,
    private readonly autorizacoes: ServicoAutorizacoes,
  ) {}

  async criar(
    familiaId: string,
    usuario: UsuarioAutenticado,
    entrada: {
      pessoaId?: string;
      nomeArquivo?: string;
      mimeTipo?: string;
      conteudoBase64?: string;
    },
  ) {
    if (usuario.pessoa.familiaId !== familiaId) {
      throw new ForbiddenException("Família fora do alcance da sessão.");
    }
    const pessoaId = entrada.pessoaId?.trim() || null;
    if (pessoaId) {
      const pode = await this.autorizacoes.podeVerCuidados(
        familiaId,
        pessoaId,
        usuario,
      );
      if (!pode) {
        throw new ForbiddenException("Sem acesso à pessoa do anexo (ACE-C09).");
      }
    }

    const nomeArquivo = (entrada.nomeArquivo ?? "anexo.bin").trim();
    const mimeTipo = (entrada.mimeTipo ?? "application/octet-stream").trim();
    const conteudoBase64 = entrada.conteudoBase64?.trim() || null;
    const tamanhoBytes = conteudoBase64
      ? Buffer.from(conteudoBase64, "base64").length
      : 0;

    return this.prisma.anexo.create({
      data: {
        familiaId,
        pessoaId,
        chavePrivada: `priv_${randomBytes(16).toString("hex")}`,
        nomeArquivo,
        mimeTipo,
        tamanhoBytes,
        conteudoBase64,
        criadoPorId: usuario.id,
      },
      select: {
        id: true,
        chavePrivada: true,
        nomeArquivo: true,
        mimeTipo: true,
        tamanhoBytes: true,
        pessoaId: true,
        criadoEm: true,
      },
    });
  }

  async obterPrivado(anexoId: string, usuario: UsuarioAutenticado) {
    const anexo = await this.prisma.anexo.findUnique({
      where: { id: anexoId },
    });
    if (!anexo || anexo.revogadoEm) {
      throw new NotFoundException("Anexo não encontrado.");
    }
    if (usuario.pessoa.familiaId !== anexo.familiaId) {
      throw new ForbiddenException("Anexo fora do alcance da sessão.");
    }
    if (anexo.pessoaId) {
      const pode = await this.autorizacoes.podeVerCuidados(
        anexo.familiaId,
        anexo.pessoaId,
        usuario,
      );
      if (!pode) {
        throw new ForbiddenException(
          "Acesso negado ao anexo privado (ACE-C09).",
        );
      }
    } else {
      const admin = await this.autorizacoes.podeGerirPessoas(
        anexo.familiaId,
        usuario,
      );
      if (!admin) {
        throw new ForbiddenException("Acesso negado ao anexo privado.");
      }
    }

    return {
      id: anexo.id,
      nomeArquivo: anexo.nomeArquivo,
      mimeTipo: anexo.mimeTipo,
      tamanhoBytes: anexo.tamanhoBytes,
      conteudoBase64: anexo.conteudoBase64,
      acesso: "privado_autenticado",
    };
  }

  async vincularAMedicamentos(
    anexoId: string,
    medicamentoIds: string[],
    usuario: UsuarioAutenticado,
  ) {
    const anexo = await this.prisma.anexo.findUnique({
      where: { id: anexoId },
    });
    if (!anexo || anexo.revogadoEm) {
      throw new NotFoundException("Anexo não encontrado.");
    }
    if (usuario.pessoa.familiaId !== anexo.familiaId) {
      throw new ForbiddenException("Anexo fora do alcance.");
    }

    for (const medicamentoId of medicamentoIds) {
      const med = await this.prisma.medicamento.findUnique({
        where: { id: medicamentoId },
        include: { pessoa: true },
      });
      if (!med || med.pessoa.familiaId !== anexo.familiaId) {
        throw new NotFoundException(`Medicamento ${medicamentoId} inválido.`);
      }
      const pode = await this.autorizacoes.podeAlterarProgramacaoCuidados(
        anexo.familiaId,
        med.pessoaId,
        usuario,
      );
      if (!pode) {
        throw new ForbiddenException(
          "Sem permissão para vincular receita ao medicamento.",
        );
      }
      await this.prisma.medicamentoAnexo.upsert({
        where: {
          medicamentoId_anexoId: { medicamentoId, anexoId },
        },
        create: { medicamentoId, anexoId },
        update: {},
      });
    }

    return this.prisma.medicamentoAnexo.findMany({
      where: { anexoId },
      select: { medicamentoId: true, anexoId: true },
    });
  }
}
