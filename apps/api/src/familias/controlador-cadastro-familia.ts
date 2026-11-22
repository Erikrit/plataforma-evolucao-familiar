import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import { ServicoCadastroFamilia } from "./servico-cadastro-familia";

type CorpoCadastro = {
  nomeFamilia?: string;
  nomeTitular?: string;
  email?: string;
  senha?: string;
  slug?: string;
  familiaId?: unknown;
  papel?: unknown;
  responsabilidade?: unknown;
  pessoaId?: unknown;
};

@Controller()
export class ControladorCadastroFamilia {
  constructor(private readonly cadastro: ServicoCadastroFamilia) {}

  @Get("familias/sugerir-endereco")
  sugerir(@Query("nome") nome = "") {
    return this.cadastro.sugerirEndereco(nome);
  }

  @Post("familias")
  async cadastrar(@Body() corpo: CorpoCadastro, @Req() requisicao: Request) {
    const origem =
      String(requisicao.ip ?? "") ||
      String(requisicao.headers["x-forwarded-for"] ?? "anonimo");
    return this.cadastro.cadastrarInicial(corpo, origem);
  }
}
