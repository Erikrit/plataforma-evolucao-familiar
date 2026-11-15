import { Module } from "@nestjs/common";
import { ModuloAuth } from "../auth/modulo-auth";
import { ModuloAutorizacoes } from "../autorizacoes/modulo-autorizacoes";
import { ModuloPrisma } from "../prisma/modulo-prisma";
import { ControladorAnexos } from "./controlador-anexos";
import { ServicoAnexos } from "./servico-anexos";

@Module({
  imports: [ModuloPrisma, ModuloAuth, ModuloAutorizacoes],
  controllers: [ControladorAnexos],
  providers: [ServicoAnexos],
  exports: [ServicoAnexos],
})
export class ModuloAnexos {}
