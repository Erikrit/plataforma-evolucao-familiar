import { Module } from "@nestjs/common";
import { ModuloAuth } from "../auth/modulo-auth";
import { ModuloAutorizacoes } from "../autorizacoes/modulo-autorizacoes";
import { ControladorConvites } from "./controlador-convites";
import { ServicoConvites } from "./servico-convites";

@Module({
  imports: [ModuloAuth, ModuloAutorizacoes],
  controllers: [ControladorConvites],
  providers: [ServicoConvites],
})
export class ModuloConvites {}
