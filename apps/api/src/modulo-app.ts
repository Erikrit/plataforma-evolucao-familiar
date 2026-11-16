import { Module } from "@nestjs/common";
import { ModuloAuth } from "./auth/modulo-auth";
import { ModuloAutorizacoes } from "./autorizacoes/modulo-autorizacoes";
import { ModuloAnexos } from "./anexos/modulo-anexos";
import { ModuloConvites } from "./convites/modulo-convites";
import { ModuloCuidados } from "./cuidados/modulo-cuidados";
import { ModuloDesenvolvimento } from "./desenvolvimento/modulo-desenvolvimento";
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
    ModuloAnexos,
    ModuloCuidados,
    ModuloDesenvolvimento,
  ],
})
export class ModuloApp {}

