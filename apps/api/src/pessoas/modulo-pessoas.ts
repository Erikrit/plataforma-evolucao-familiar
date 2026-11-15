import { Module } from "@nestjs/common";
import { ModuloAuth } from "../auth/modulo-auth";
import { ControladorPessoas } from "./controlador-pessoas";
import { ServicoPessoas } from "./servico-pessoas";

@Module({
  imports: [ModuloAuth],
  controllers: [ControladorPessoas],
  providers: [ServicoPessoas],
})
export class ModuloPessoas {}
