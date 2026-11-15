import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { NOME_COOKIE_SESSAO, ServicoSessao } from "./servico-sessao";
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
  async entrar(
    @Body() corpo: CorpoEntrada,
    @Res({ passthrough: true }) resposta: Response,
  ) {
    const email = (corpo.email ?? "").trim();
    const senha = corpo.senha ?? "";
    const sessao = await this.sessoes.entrar(email, senha);
    this.definirCookieSessao(resposta, sessao.token, sessao.expiraEm);
    return sessao;
  }

  @Delete("sessoes")
  async sair(
    @Req() requisicao: Request,
    @Res({ passthrough: true }) resposta: Response,
  ) {
    const resultado = await this.sessoes.sair(extrairToken(requisicao));
    this.limparCookieSessao(resposta);
    return resultado;
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
      autenticacao: "sessao_mvp",
    };
  }

  private definirCookieSessao(
    resposta: Response,
    token: string,
    expiraEmIso: string,
  ) {
    const seguro = process.env.COOKIE_SECURE === "true";
    resposta.cookie(NOME_COOKIE_SESSAO, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: seguro,
      path: "/",
      expires: new Date(expiraEmIso),
    });
  }

  private limparCookieSessao(resposta: Response) {
    resposta.clearCookie(NOME_COOKIE_SESSAO, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
}
