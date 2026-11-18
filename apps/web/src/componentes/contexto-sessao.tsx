"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  limparSessaoLegada,
  obterInicio,
  obterMe,
  type AcessosResposta,
  type AutorizacaoResumo,
  type CartaoInicio,
  type DestaqueInicio,
  type UsuarioSessao,
} from "@/lib/api";
import { mensagemErroAmigavel } from "@/componentes/feedback";

type EstadoSessao = {
  pronto: boolean;
  usuario: UsuarioSessao | null;
  cartoes: CartaoInicio[];
  destaques: DestaqueInicio[];
  acessos: AcessosResposta | null;
  autorizacoes: AutorizacaoResumo[];
  filtradoPorAutorizacao: boolean;
  podeGerenciarFamilia: boolean;
  erroSessao: string | null;
  entrarNaSessao: (usuario: UsuarioSessao) => Promise<void>;
  recarregarInicio: () => Promise<void>;
  limparSessaoLocal: () => void;
};

const ContextoSessao = createContext<EstadoSessao | null>(null);

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [pronto, setPronto] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [cartoes, setCartoes] = useState<CartaoInicio[]>([]);
  const [destaques, setDestaques] = useState<DestaqueInicio[]>([]);
  const [acessos, setAcessos] = useState<AcessosResposta | null>(null);
  const [autorizacoes, setAutorizacoes] = useState<AutorizacaoResumo[]>([]);
  const [filtradoPorAutorizacao, setFiltrado] = useState(false);
  const [erroSessao, setErroSessao] = useState<string | null>(null);

  const limparSessaoLocal = useCallback(() => {
    setUsuario(null);
    setCartoes([]);
    setDestaques([]);
    setAcessos(null);
    setAutorizacoes([]);
    setFiltrado(false);
  }, []);

  const aplicarInicio = useCallback(async (atual: UsuarioSessao) => {
    const inicio = await obterInicio(atual.pessoa.familiaId);
    setCartoes(inicio.cartoes);
    setDestaques(inicio.destaques ?? []);
    setAcessos(
      inicio.acessos ?? {
        modo: "proprios_dados",
        somenteLeitura: true,
        itens: [],
      },
    );
    setAutorizacoes(inicio.autorizacoes ?? []);
    setFiltrado(inicio.filtradoPorAutorizacao);
  }, []);

  const entrarNaSessao = useCallback(
    async (atual: UsuarioSessao) => {
      setUsuario(atual);
      await aplicarInicio(atual);
    },
    [aplicarInicio],
  );

  const recarregarInicio = useCallback(async () => {
    if (!usuario) return;
    await aplicarInicio(usuario);
  }, [usuario, aplicarInicio]);

  useEffect(() => {
    limparSessaoLegada();
    void (async () => {
      try {
        const me = await obterMe();
        if (me) {
          setUsuario(me);
          await aplicarInicio(me);
        }
      } catch (e) {
        setErroSessao(
          mensagemErroAmigavel(e, "Não foi possível verificar a sessão"),
        );
      } finally {
        setPronto(true);
      }
    })();
  }, [aplicarInicio]);

  const podeGerenciarFamilia = Boolean(
    usuario && acessos?.modo === "administracao",
  );

  const valor = useMemo<EstadoSessao>(
    () => ({
      pronto,
      usuario,
      cartoes,
      destaques,
      acessos,
      autorizacoes,
      filtradoPorAutorizacao,
      podeGerenciarFamilia,
      erroSessao,
      entrarNaSessao,
      recarregarInicio,
      limparSessaoLocal,
    }),
    [
      pronto,
      usuario,
      cartoes,
      destaques,
      acessos,
      autorizacoes,
      filtradoPorAutorizacao,
      podeGerenciarFamilia,
      erroSessao,
      entrarNaSessao,
      recarregarInicio,
      limparSessaoLocal,
    ],
  );

  return (
    <ContextoSessao.Provider value={valor}>{children}</ContextoSessao.Provider>
  );
}

export function useSessao() {
  const ctx = useContext(ContextoSessao);
  if (!ctx) {
    throw new Error("useSessao deve ser usado dentro de ProvedorSessao");
  }
  return ctx;
}
