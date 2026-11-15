import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { NOME_COOKIE_SESSAO, ServicoSessao } from "./servico-sessao";
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
  const cookie = lerCookie(requisicao.headers.cookie, NOME_COOKIE_SESSAO);
  if (cookie) return cookie;
  return undefined;
}

function lerCookie(
  cabecalho: string | undefined,
  nome: string,
): string | undefined {
  if (!cabecalho) return undefined;
  const partes = cabecalho.split(";");
  for (const parte of partes) {
    const [chave, ...resto] = parte.trim().split("=");
    if (chave === nome) {
      return decodeURIComponent(resto.join("="));
    }
  }
  return undefined;
}
