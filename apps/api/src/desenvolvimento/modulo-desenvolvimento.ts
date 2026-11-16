import { Module } from "@nestjs/common";
import { ModuloAuth } from "../auth/modulo-auth";
import { ModuloAutorizacoes } from "../autorizacoes/modulo-autorizacoes";
import { ModuloPrisma } from "../prisma/modulo-prisma";
import { ControladorDesenvolvimento } from "./controlador-desenvolvimento";
import { ServicoDesafios } from "./servico-desafios";
import { ServicoParticipacoes } from "./servico-participacoes";
import { ServicoRecompensas } from "./servico-recompensas";

@Module({
  imports: [ModuloPrisma, ModuloAuth, ModuloAutorizacoes],
  controllers: [ControladorDesenvolvimento],
  providers: [ServicoDesafios, ServicoParticipacoes, ServicoRecompensas],
  exports: [ServicoDesafios, ServicoParticipacoes, ServicoRecompensas],
})
export class ModuloDesenvolvimento {}
