import { Module, forwardRef } from "@nestjs/common";
import { ModuloAuth } from "../auth/modulo-auth";
import { ControladorAutorizacoes } from "./controlador-autorizacoes";
import { ServicoAutorizacoes } from "./servico-autorizacoes";

@Module({
  imports: [forwardRef(() => ModuloAuth)],
  controllers: [ControladorAutorizacoes],
  providers: [ServicoAutorizacoes],
  exports: [ServicoAutorizacoes],
})
export class ModuloAutorizacoes {}
