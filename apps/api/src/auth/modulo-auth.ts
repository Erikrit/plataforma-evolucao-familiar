import { Module } from "@nestjs/common";
import { ControladorSessao } from "./controlador-sessao";
import { GuardaSessao } from "./guarda-sessao";
import { ServicoSessao } from "./servico-sessao";

@Module({
  controllers: [ControladorSessao],
  providers: [ServicoSessao, GuardaSessao],
  exports: [ServicoSessao, GuardaSessao],
})
export class ModuloAuth {}
