import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { GuardaSessao } from "../auth/guarda-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";
import { ServicoPessoas } from "./servico-pessoas";

type CorpoPessoa = {
  nome?: string;
  vinculo?: string;
};

type CorpoPerfil = {
  vinculo?: string;
  dataNascimento?: string | null;
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

  @Get(":pessoaId")
  obter(
    @Param("familiaId") familiaId: string,
    @Param("pessoaId") pessoaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.pessoas.obter(familiaId, pessoaId, requisicao.usuario!);
  }

  @Patch(":pessoaId")
  atualizar(
    @Param("familiaId") familiaId: string,
    @Param("pessoaId") pessoaId: string,
    @Body() corpo: CorpoPerfil,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.pessoas.atualizarPerfil(
      familiaId,
      pessoaId,
      requisicao.usuario!,
      corpo,
    );
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
