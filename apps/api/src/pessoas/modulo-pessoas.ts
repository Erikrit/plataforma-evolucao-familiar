import { Module } from "@nestjs/common";
import { ModuloAuth } from "../auth/modulo-auth";
import { ModuloAutorizacoes } from "../autorizacoes/modulo-autorizacoes";
import { ControladorPessoas } from "./controlador-pessoas";
import { ServicoPessoas } from "./servico-pessoas";

@Module({
  imports: [ModuloAuth, ModuloAutorizacoes],
  controllers: [ControladorPessoas],
  providers: [ServicoPessoas],
})
export class ModuloPessoas {}
