import { Module } from "@nestjs/common";
import { ModuloPrisma } from "../prisma/modulo-prisma";
import { ControladorCadastroFamilia } from "./controlador-cadastro-familia";
import { ServicoCadastroFamilia } from "./servico-cadastro-familia";

@Module({
  imports: [ModuloPrisma],
  controllers: [ControladorCadastroFamilia],
  providers: [ServicoCadastroFamilia],
  exports: [ServicoCadastroFamilia],
})
export class ModuloFamilias {}
