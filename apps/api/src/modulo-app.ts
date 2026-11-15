import { Module } from "@nestjs/common";
import { ModuloAuth } from "./auth/modulo-auth";
import { ModuloAutorizacoes } from "./autorizacoes/modulo-autorizacoes";
import { ModuloConvites } from "./convites/modulo-convites";
import { ModuloPessoas } from "./pessoas/modulo-pessoas";
import { ModuloPrisma } from "./prisma/modulo-prisma";
import { ModuloSaude } from "./saude/modulo-saude";

@Module({
  imports: [
    ModuloPrisma,
    ModuloSaude,
    ModuloAuth,
    ModuloAutorizacoes,
    ModuloPessoas,
    ModuloConvites,
  ],
})
export class ModuloApp {}

