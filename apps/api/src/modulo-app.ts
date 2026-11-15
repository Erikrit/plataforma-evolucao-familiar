import { Module } from "@nestjs/common";
import { ModuloAuth } from "./auth/modulo-auth";
import { ModuloPessoas } from "./pessoas/modulo-pessoas";
import { ModuloPrisma } from "./prisma/modulo-prisma";
import { ModuloSaude } from "./saude/modulo-saude";

@Module({
  imports: [ModuloPrisma, ModuloSaude, ModuloAuth, ModuloPessoas],
})
export class ModuloApp {}
