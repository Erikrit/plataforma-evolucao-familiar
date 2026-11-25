import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { GuardaSessao } from "../auth/guarda-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";
import { ServicoDesafios } from "./servico-desafios";
import { ServicoParticipacoes } from "./servico-participacoes";
import { ServicoRecompensas } from "./servico-recompensas";
import { ServicoSugestoes } from "./servico-sugestoes";

@Controller()
@UseGuards(GuardaSessao)
export class ControladorDesenvolvimento {
  constructor(
    private readonly desafios: ServicoDesafios,
    private readonly participacoes: ServicoParticipacoes,
    private readonly recompensas: ServicoRecompensas,
    private readonly sugestoes: ServicoSugestoes,
  ) {}

  @Get("desafios")
  listarCatalogo(
    @Query("pessoaId") pessoaId: string | undefined,
    @Query("categoria") categoria: string | undefined,
    @Query("guardados") guardados: string | undefined,
    @Query("disponibilidade") disponibilidade: string | undefined,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.desafios.listarCatalogo(requisicao.usuario!, {
      pessoaId,
      categoria,
      apenasGuardados: guardados === "1" || guardados === "true",
      disponibilidade: this.resolverFiltroDisponibilidade(disponibilidade),
    });
  }

  @Get("pessoas/:pessoaId/desafios")
  listarParaPessoa(
    @Param("pessoaId") pessoaId: string,
    @Query("categoria") categoria: string | undefined,
    @Query("guardados") guardados: string | undefined,
    @Query("disponibilidade") disponibilidade: string | undefined,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.desafios.listarParaPessoa(pessoaId, requisicao.usuario!, {
      categoria,
      apenasGuardados: guardados === "1" || guardados === "true",
      disponibilidade: this.resolverFiltroDisponibilidade(disponibilidade),
    });
  }

  @Post("familias/:familiaId/desafios")
  criarNaFamilia(
    @Param("familiaId") familiaId: string,
    @Body()
    corpo: {
      nome?: string;
      instrucao?: string | null;
      categoria?: string | null;
      dificuldade?: string;
      materiais?: string | null;
      duracaoMinutos?: number | null;
      pessoaId?: string;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.desafios.criarPersonalizado(
      familiaId,
      requisicao.usuario!,
      corpo,
      corpo.pessoaId,
    );
  }

  @Post("pessoas/:pessoaId/desafios")
  criarParaPessoa(
    @Param("pessoaId") pessoaId: string,
    @Body()
    corpo: {
      nome?: string;
      instrucao?: string | null;
      categoria?: string | null;
      dificuldade?: string;
      materiais?: string | null;
      duracaoMinutos?: number | null;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.desafios.criarPersonalizadoParaPessoa(
      pessoaId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Patch("desafios/:desafioId")
  alterar(
    @Param("desafioId") desafioId: string,
    @Body()
    corpo: {
      nome?: string;
      instrucao?: string | null;
      categoria?: string | null;
      dificuldade?: string;
      materiais?: string | null;
      duracaoMinutos?: number | null;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.desafios.alterar(desafioId, requisicao.usuario!, corpo);
  }

  @Get("pessoas/:pessoaId/sugestoes")
  listarSugestoes(
    @Param("pessoaId") pessoaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.sugestoes.listarParaPessoa(pessoaId, requisicao.usuario!);
  }

  @Post("pessoas/:pessoaId/sugestoes/renovar")
  renovarSugestoes(
    @Param("pessoaId") pessoaId: string,
    @Body() corpo: { categoria?: string } | undefined,
    @Query("categoria") categoriaQuery: string | undefined,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.sugestoes.renovar(pessoaId, requisicao.usuario!, {
      categoria: corpo?.categoria ?? categoriaQuery,
    });
  }

  @Post("pessoas/:pessoaId/sugestoes/:desafioId/escolher")
  escolherSugestao(
    @Param("pessoaId") pessoaId: string,
    @Param("desafioId") desafioId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.sugestoes.escolher(
      pessoaId,
      desafioId,
      requisicao.usuario!,
    );
  }

  @Post("pessoas/:pessoaId/sugestoes/:desafioId/retirar")
  retirarSugestao(
    @Param("pessoaId") pessoaId: string,
    @Param("desafioId") desafioId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.sugestoes.retirar(
      pessoaId,
      desafioId,
      requisicao.usuario!,
    );
  }

  @Post("pessoas/:pessoaId/desafios/:desafioId/disponibilizar")
  disponibilizarDesafio(
    @Param("pessoaId") pessoaId: string,
    @Param("desafioId") desafioId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.desafios.disponibilizarNovamente(
      pessoaId,
      desafioId,
      requisicao.usuario!,
    );
  }

  @Post("pessoas/:pessoaId/desafios/:desafioId/guardar")
  guardar(
    @Param("pessoaId") pessoaId: string,
    @Param("desafioId") desafioId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.desafios.guardar(pessoaId, desafioId, requisicao.usuario!);
  }

  @Delete("pessoas/:pessoaId/desafios/:desafioId/guardar")
  retirarGuardado(
    @Param("pessoaId") pessoaId: string,
    @Param("desafioId") desafioId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.desafios.retirarGuardado(
      pessoaId,
      desafioId,
      requisicao.usuario!,
    );
  }

  @Post("pessoas/:pessoaId/participacoes")
  registrarParticipacao(
    @Param("pessoaId") pessoaId: string,
    @Body()
    corpo: {
      desafioId?: string;
      resultado?: string;
      observacao?: string | null;
      execucaoChave?: string;
    },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.participacoes.registrar(
      pessoaId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Patch("participacoes/:participacaoId")
  corrigirParticipacao(
    @Param("participacaoId") participacaoId: string,
    @Body()
    corpo: { resultado?: string; observacao?: string | null },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.participacoes.corrigir(
      participacaoId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Get("pessoas/:pessoaId/estrelas")
  consultarEstrelas(
    @Param("pessoaId") pessoaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.participacoes.consultarEstrelas(
      pessoaId,
      requisicao.usuario!,
    );
  }

  @Get("pessoas/:pessoaId/recompensas")
  listarRecompensas(
    @Param("pessoaId") pessoaId: string,
    @Query("disponibilidade") disponibilidade: string | undefined,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.recompensas.listar(pessoaId, requisicao.usuario!, {
      disponibilidade: this.resolverFiltroRecompensa(disponibilidade),
    });
  }

  @Post("pessoas/:pessoaId/recompensas")
  criarRecompensa(
    @Param("pessoaId") pessoaId: string,
    @Body() corpo: { nome?: string; custo?: number },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.recompensas.criar(pessoaId, requisicao.usuario!, corpo);
  }

  @Patch("recompensas/:recompensaId")
  alterarRecompensa(
    @Param("recompensaId") recompensaId: string,
    @Body() corpo: { nome?: string; custo?: number; ativa?: boolean },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.recompensas.alterar(
      recompensaId,
      requisicao.usuario!,
      corpo,
    );
  }

  @Post("pessoas/:pessoaId/recompensas/:recompensaId/disponibilizar")
  disponibilizarRecompensa(
    @Param("pessoaId") pessoaId: string,
    @Param("recompensaId") recompensaId: string,
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.recompensas.disponibilizarNovamente(
      pessoaId,
      recompensaId,
      requisicao.usuario!,
    );
  }

  @Post("pessoas/:pessoaId/resgates")
  resgatar(
    @Param("pessoaId") pessoaId: string,
    @Body()
    corpo: { recompensaId?: string; solicitacaoChave?: string },
    @Req() requisicao: Request & RequisicaoComUsuario,
  ) {
    return this.recompensas.resgatar(pessoaId, requisicao.usuario!, corpo);
  }

  private resolverFiltroDisponibilidade(
    valor: string | undefined,
  ): "explorar" | "executadas" | undefined {
    const normalizado = (valor ?? "").trim().toLowerCase();
    if (normalizado === "explorar" || normalizado === "executadas") {
      return normalizado;
    }
    return undefined;
  }

  private resolverFiltroRecompensa(
    valor: string | undefined,
  ): "disponiveis" | "resgatadas" | undefined {
    const normalizado = (valor ?? "").trim().toLowerCase();
    if (normalizado === "disponiveis" || normalizado === "resgatadas") {
      return normalizado;
    }
    return undefined;
  }
}
