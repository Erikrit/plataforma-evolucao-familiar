import { Module } from "@nestjs/common";
import { ModuloAuth } from "../auth/modulo-auth";
import { ModuloAutorizacoes } from "../autorizacoes/modulo-autorizacoes";
import { ModuloPrisma } from "../prisma/modulo-prisma";
import { ControladorDesenvolvimento } from "./controlador-desenvolvimento";
import { ServicoDesafios } from "./servico-desafios";
import { ServicoParticipacoes } from "./servico-participacoes";
import { ServicoRecompensas } from "./servico-recompensas";
import { ServicoSugestoes } from "./servico-sugestoes";
import { ControladorJogos } from "./jogos/controlador-jogos";
import { ServicoJogos } from "./jogos/servico-jogos";

@Module({
  imports: [ModuloPrisma, ModuloAuth, ModuloAutorizacoes],
  controllers: [ControladorDesenvolvimento, ControladorJogos],
  providers: [
    ServicoDesafios,
    ServicoParticipacoes,
    ServicoRecompensas,
    ServicoSugestoes,
    ServicoJogos,
  ],
  exports: [
    ServicoDesafios,
    ServicoParticipacoes,
    ServicoRecompensas,
    ServicoSugestoes,
  ],
})
export class ModuloDesenvolvimento {}
