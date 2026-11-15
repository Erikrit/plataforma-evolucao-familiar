import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GuardaSessao } from "../auth/guarda-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";
import { ServicoPessoas } from "./servico-pessoas";

type CorpoPessoa = {
  nome?: string;
  vinculo?: string;
};

@Controller("familias/:familiaId/pessoas")
@UseGuards(GuardaSessao)
export class ControladorPessoas {
  constructor(private readonly pessoas: ServicoPessoas) {}

  @Get()
  listar(
    @Param("familiaId") familiaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.pessoas.listar(familiaId, requisicao.usuario!);
  }

  @Post()
  criar(
    @Param("familiaId") familiaId: string,
    @Body() corpo: CorpoPessoa,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.pessoas.criar(familiaId, requisicao.usuario!, corpo);
  }
}
