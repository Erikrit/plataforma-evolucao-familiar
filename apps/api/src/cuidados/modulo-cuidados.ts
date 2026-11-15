import { Module } from "@nestjs/common";
import { ModuloAuth } from "../auth/modulo-auth";
import { ModuloAutorizacoes } from "../autorizacoes/modulo-autorizacoes";
import { ModuloPrisma } from "../prisma/modulo-prisma";
import { ControladorCuidados } from "./controlador-cuidados";
import { ServicoMedicamentos } from "./servico-medicamentos";
import { ServicoCompromissos } from "./servico-compromissos";
import { ServicoAcompanhamento } from "./servico-acompanhamento";

@Module({
  imports: [ModuloPrisma, ModuloAuth, ModuloAutorizacoes],
  controllers: [ControladorCuidados],
  providers: [ServicoMedicamentos, ServicoCompromissos, ServicoAcompanhamento],
  exports: [ServicoMedicamentos, ServicoCompromissos, ServicoAcompanhamento],
})
export class ModuloCuidados {}
