import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { GuardaSessao } from "../auth/guarda-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";
import { ServicoMedicamentos } from "./servico-medicamentos";
import { ServicoCompromissos } from "./servico-compromissos";
import { ServicoAcompanhamento } from "./servico-acompanhamento";

@Controller()
@UseGuards(GuardaSessao)
export class ControladorCuidados {
  constructor(
    private readonly medicamentos: ServicoMedicamentos,
    private readonly compromissos: ServicoCompromissos,
    private readonly acompanhamento: ServicoAcompanhamento,
  ) {}

  @Get("pessoas/:pessoaId/cuidados/hoje")
  rotinaHoje(
    @Param("pessoaId") pessoaId: string,
    @Query("data") data: string | undefined,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.medicamentos.rotinaHoje(pessoaId, requisicao.usuario!, data);
  }

  @Get("pessoas/:pessoaId/medicamentos")
  listarMedicamentos(
    @Param("pessoaId") pessoaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.medicamentos.listar(pessoaId, requisicao.usuario!);
  }

  @Post("pessoas/:pessoaId/medicamentos")
  cadastrarMedicamento(
    @Param("pessoaId") pessoaId: string,
    @Body()
    corpo: {
      nome?: string;
      instrucoes?: string;
      horarios?: string[];
      frequencia?: string;
      anexoIds?: string[];
      ativar?: boolean;
      primeiroHorario?: string;
      dosesPorDia?: number;
      duracaoTipo?: "continua" | "dias" | string;
      duracaoDias?: number | null;
      horariosConferidos?: boolean;
      intervaloHoras?: number | null;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.medicamentos.cadastrar(pessoaId, requisicao.usuario!, corpo);
  }

  @Post("medicamentos/:medicamentoId/ativacao")
  ativar(
    @Param("medicamentoId") medicamentoId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.medicamentos.ativar(medicamentoId, requisicao.usuario!);
  }

  @Put("medicamentos/:medicamentoId/programacao")
  alterarProgramacao(
    @Param("medicamentoId") medicamentoId: string,
    @Body()
    corpo: {
      horarios?: string[];
      frequencia?: string;
      primeiroHorario?: string;
      dosesPorDia?: number;
      duracaoTipo?: "continua" | "dias" | string;
      duracaoDias?: number | null;
      horariosConferidos?: boolean;
      intervaloHoras?: number | null;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.medicamentos.alterarProgramacao(
      medicamentoId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Post("medicamentos/:medicamentoId/encerramento")
  encerrar(
    @Param("medicamentoId") medicamentoId: string,
    @Body() corpo: { acao?: "suspender" | "encerrar" },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.medicamentos.encerrarOuSuspender(
      medicamentoId,
      requisicao.usuario!,
      corpo.acao === "suspender" ? "suspender" : "encerrar",
    );
  }

  @Post("medicamentos/:medicamentoId/doses/registros")
  registrarDose(
    @Param("medicamentoId") medicamentoId: string,
    @Body()
    corpo: {
      data?: string;
      horario?: string;
      situacao?: string;
      horarioEfetivo?: string | null;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.medicamentos.registrarDose(
      medicamentoId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Patch("registros-doses/:registroId")
  corrigirDose(
    @Param("registroId") registroId: string,
    @Body() corpo: { situacao?: string; horarioEfetivo?: string | null },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.medicamentos.corrigirDose(
      registroId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Get("pessoas/:pessoaId/consultas")
  listarConsultas(
    @Param("pessoaId") pessoaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.compromissos.listarConsultas(pessoaId, requisicao.usuario!);
  }

  @Post("pessoas/:pessoaId/consultas")
  criarConsulta(
    @Param("pessoaId") pessoaId: string,
    @Body()
    corpo: {
      dataHora?: string;
      especialidadeOuDescricao?: string;
      profissional?: string;
      local?: string;
      observacao?: string;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.compromissos.criarConsulta(
      pessoaId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Patch("consultas/:consultaId")
  atualizarConsulta(
    @Param("consultaId") consultaId: string,
    @Body()
    corpo: {
      status?: "agendada" | "realizada" | "cancelada";
      profissional?: string;
      local?: string;
      observacao?: string;
      dataHora?: string;
      especialidadeOuDescricao?: string;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.compromissos.atualizarConsulta(
      consultaId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Get("pessoas/:pessoaId/exames")
  listarExames(
    @Param("pessoaId") pessoaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.compromissos.listarExames(pessoaId, requisicao.usuario!);
  }

  @Post("pessoas/:pessoaId/exames")
  criarExame(
    @Param("pessoaId") pessoaId: string,
    @Body()
    corpo: {
      descricao?: string;
      data?: string | null;
      consultaId?: string | null;
      anexoId?: string | null;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.compromissos.criarExame(pessoaId, requisicao.usuario!, corpo);
  }

  @Get("pessoas/:pessoaId/atividades-apoio")
  listarAtividades(
    @Param("pessoaId") pessoaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.compromissos.listarAtividades(pessoaId, requisicao.usuario!);
  }

  @Post("pessoas/:pessoaId/atividades-apoio")
  registrarAtividade(
    @Param("pessoaId") pessoaId: string,
    @Body() corpo: { descricao?: string; observacao?: string },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.compromissos.registrarAtividade(
      pessoaId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Get("pessoas/:pessoaId/historico")
  @Header("Cache-Control", "private, no-store")
  historico(
    @Param("pessoaId") pessoaId: string,
    @Query("de") de: string | undefined,
    @Query("ate") ate: string | undefined,
    @Query("dominio") dominio: string | undefined,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.acompanhamento.historico(pessoaId, requisicao.usuario!, {
      de,
      ate,
      dominio,
    });
  }

  @Get("pessoas/:pessoaId/lembretes")
  lembretes(
    @Param("pessoaId") pessoaId: string,
    @Query("data") data: string | undefined,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.acompanhamento.lembretesDerivados(
      pessoaId,
      requisicao.usuario!,
      data,
    );
  }

  @Get("pessoas/:pessoaId/resumo-cuidados")
  @Header("Cache-Control", "private, no-store")
  resumo(
    @Param("pessoaId") pessoaId: string,
    @Query("de") de: string,
    @Query("ate") ate: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.acompanhamento.resumo(pessoaId, requisicao.usuario!, {
      de: de ?? new Date(0).toISOString(),
      ate: ate ?? new Date().toISOString(),
    });
  }

  @Get("pessoas/:pessoaId/resumo-desenvolvimento")
  @Header("Cache-Control", "private, no-store")
  resumoDesenvolvimento(
    @Param("pessoaId") pessoaId: string,
    @Query("de") de: string,
    @Query("ate") ate: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.acompanhamento.resumoDesenvolvimento(
      pessoaId,
      requisicao.usuario!,
      {
        de: de ?? new Date(0).toISOString(),
        ate: ate ?? new Date().toISOString(),
      },
      { incluirJogos: true },
    );
  }

  @Get("pessoas/:pessoaId/resumo-previa")
  @Header("Cache-Control", "private, no-store")
  resumoPrevia(
    @Param("pessoaId") pessoaId: string,
    @Query("de") de: string,
    @Query("ate") ate: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.acompanhamento.previaResumo(pessoaId, requisicao.usuario!, {
      de: de ?? new Date(0).toISOString(),
      ate: ate ?? new Date().toISOString(),
    });
  }

  @Get("pessoas/:pessoaId/relatorio.pdf")
  @Header("Cache-Control", "private, no-store")
  async relatorioPdf(
    @Param("pessoaId") pessoaId: string,
    @Query("de") de: string,
    @Query("ate") ate: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.acompanhamento.gerarPdfTexto(pessoaId, requisicao.usuario!, {
      de: de ?? new Date(0).toISOString(),
      ate: ate ?? new Date().toISOString(),
    });
  }
}
