import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { GuardaSessao } from "../auth/guarda-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";
import { ServicoAutorizacoes } from "./servico-autorizacoes";

type CorpoConcessao = {
  usuarioId?: string;
  responsabilidade?: string;
  pessoaAlvoId?: string | null;
  dataNascimentoAlvo?: string | null;
};

@Controller("familias/:familiaId")
@UseGuards(GuardaSessao)
export class ControladorAutorizacoes {
  constructor(private readonly autorizacoes: ServicoAutorizacoes) {}

  @Get("inicio")
  inicio(
    @Param("familiaId") familiaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.autorizacoes.cartoesInicio(familiaId, requisicao.usuario!);
  }

  @Get("autorizacoes")
  listar(
    @Param("familiaId") familiaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.autorizacoes.listarDoUsuario(familiaId, requisicao.usuario!);
  }

  /** Metadados de acesso (FUN-04/FUN-07); não amplia permissões. */
  @Get("acessos")
  listarAcessos(
    @Param("familiaId") familiaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.autorizacoes.listarAcessos(familiaId, requisicao.usuario!);
  }

  @Post("autorizacoes")
  conceder(
    @Param("familiaId") familiaId: string,
    @Body() corpo: CorpoConcessao,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.autorizacoes.conceder(familiaId, requisicao.usuario!, corpo);
  }

  @Delete("autorizacoes/:autorizacaoId")
  revogar(
    @Param("familiaId") familiaId: string,
    @Param("autorizacaoId") autorizacaoId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.autorizacoes.revogar(
      familiaId,
      autorizacaoId,
      requisicao.usuario!,
    );
  }
}
