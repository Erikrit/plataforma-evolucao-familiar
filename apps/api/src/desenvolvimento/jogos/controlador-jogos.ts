import {
  Body, Controller, Get, Header, Param, ParseIntPipe, Post, Req, UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { GuardaSessao } from "../../auth/guarda-sessao";
import type { RequisicaoComUsuario } from "../../comum/tipos-requisicao";
import { ServicoJogos } from "./servico-jogos";

@Controller("pessoas/:pessoaId/jogos")
@UseGuards(GuardaSessao)
export class ControladorJogos {
  constructor(private readonly jogos: ServicoJogos) {}

  @Get()
  @Header("Cache-Control", "private, no-store")
  listar(
    @Param("pessoaId") pessoaId: string,
    @Req() req: Request & RequisicaoComUsuario,
  ) {
    return this.jogos.listar(pessoaId, req.usuario!);
  }

  @Post(":jogoId/fases/:fase/iniciar")
  @Header("Cache-Control", "private, no-store")
  iniciar(
    @Param("pessoaId") pessoaId: string,
    @Param("jogoId") jogoId: string,
    @Param("fase", ParseIntPipe) fase: number,
    @Req() req: Request & RequisicaoComUsuario,
  ) {
    return this.jogos.iniciar(pessoaId, jogoId, fase, req.usuario!);
  }

  @Post(":jogoId/fases/:fase/concluir")
  @Header("Cache-Control", "private, no-store")
  concluir(
    @Param("pessoaId") pessoaId: string,
    @Param("jogoId") jogoId: string,
    @Param("fase", ParseIntPipe) fase: number,
    @Body() entrada: { versao?: unknown; chave?: unknown },
    @Req() req: Request & RequisicaoComUsuario,
  ) {
    return this.jogos.concluir(pessoaId, jogoId, fase, req.usuario!, entrada);
  }
}
