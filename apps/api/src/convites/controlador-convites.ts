import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GuardaSessao } from "../auth/guarda-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";
import { ServicoConvites } from "./servico-convites";

type CorpoConvite = {
  email?: string;
  nomeConvidado?: string;
  responsabilidade?: string;
  pessoaAlvoId?: string;
  /** Pessoa já cadastrada que receberá a conta (M01 v1.5 §11). */
  pessoaContaId?: string;
};

type CorpoAtivacao = {
  senha?: string;
  nome?: string;
};

@Controller()
export class ControladorConvites {
  constructor(private readonly convites: ServicoConvites) {}

  @Post("familias/:familiaId/convites")
  @UseGuards(GuardaSessao)
  criar(
    @Param("familiaId") familiaId: string,
    @Body() corpo: CorpoConvite,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.convites.criar(familiaId, requisicao.usuario!, corpo);
  }

  @Post("convites/:token/ativar")
  ativar(@Param("token") token: string, @Body() corpo: CorpoAtivacao) {
    return this.convites.ativar(token, corpo);
  }
}
