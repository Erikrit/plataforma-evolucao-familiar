import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GuardaSessao } from "../auth/guarda-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";
import { ServicoAnexos } from "./servico-anexos";

@Controller()
@UseGuards(GuardaSessao)
export class ControladorAnexos {
  constructor(private readonly anexos: ServicoAnexos) {}

  @Post("familias/:familiaId/anexos")
  criar(
    @Param("familiaId") familiaId: string,
    @Body()
    corpo: {
      pessoaId?: string;
      nomeArquivo?: string;
      mimeTipo?: string;
      conteudoBase64?: string;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.anexos.criar(familiaId, requisicao.usuario!, corpo);
  }

  @Get("anexos/:anexoId")
  obter(
    @Param("anexoId") anexoId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.anexos.obterPrivado(anexoId, requisicao.usuario!);
  }

  @Post("anexos/:anexoId/medicamentos")
  vincular(
    @Param("anexoId") anexoId: string,
    @Body() corpo: { medicamentoIds?: string[] },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.anexos.vincularAMedicamentos(
      anexoId,
      corpo.medicamentoIds ?? [],
      requisicao.usuario!,
    );
  }
}
