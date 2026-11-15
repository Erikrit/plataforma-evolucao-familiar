import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { ServicoSessao } from "./servico-sessao";
import { extrairToken, GuardaSessao } from "./guarda-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";

type CorpoEntrada = {
  email?: string;
  senha?: string;
};

@Controller()
export class ControladorSessao {
  constructor(private readonly sessoes: ServicoSessao) {}

  @Post("sessoes")
  async entrar(@Body() corpo: CorpoEntrada) {
    const email = (corpo.email ?? "").trim();
    const senha = corpo.senha ?? "";
    return this.sessoes.entrar(email, senha);
  }

  @Delete("sessoes")
  async sair(@Req() requisicao: Request) {
    return this.sessoes.sair(extrairToken(requisicao));
  }

  @Get("me")
  @UseGuards(GuardaSessao)
  eu(@Req() requisicao: Request & RequisicaoComUsuario) {
    const usuario = requisicao.usuario!;
    return {
      id: usuario.id,
      email: usuario.email,
      pessoa: {
        id: usuario.pessoa.id,
        nome: usuario.pessoa.nome,
        familiaId: usuario.pessoa.familiaId,
      },
      autenticacao: "provisoria",
    };
  }
}
