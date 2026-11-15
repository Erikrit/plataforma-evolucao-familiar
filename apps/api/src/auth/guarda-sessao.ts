import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { ServicoSessao } from "./servico-sessao";
import type { RequisicaoComUsuario } from "../comum/tipos-requisicao";

@Injectable()
export class GuardaSessao implements CanActivate {
  constructor(private readonly sessoes: ServicoSessao) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const requisicao = contexto
      .switchToHttp()
      .getRequest<Request & RequisicaoComUsuario>();
    const token = extrairToken(requisicao);
    try {
      requisicao.usuario = await this.sessoes.obterUsuarioPorToken(token);
      return true;
    } catch {
      throw new UnauthorizedException("Sessão necessária.");
    }
  }
}

export function extrairToken(requisicao: Request): string | undefined {
  const cabecalho = requisicao.header("x-sessao-token");
  if (cabecalho) return cabecalho;
  const auth = requisicao.header("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return undefined;
}
