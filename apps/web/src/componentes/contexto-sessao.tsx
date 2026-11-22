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
  type ContextoOperacional,
  type DestaqueInicio,
  type InicioResposta,
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
  contextos: ContextoOperacional[];
  destinoEntrada: string | null;
  filtradoPorAutorizacao: boolean;
  podeGerenciarFamilia: boolean;
  erroSessao: string | null;
  slugUrl: string | null;
  contextoUrlCompativel: boolean;
  entrarNaSessao: (usuario: UsuarioSessao) => Promise<InicioResposta>;
  recarregarInicio: () => Promise<void>;
  limparSessaoLocal: () => void;
  limparDadosContexto: () => void;
  marcarSlugUrl: (slug: string | null) => void;
};

const ContextoSessao = createContext<EstadoSessao | null>(null);

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [pronto, setPronto] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [cartoes, setCartoes] = useState<CartaoInicio[]>([]);
  const [destaques, setDestaques] = useState<DestaqueInicio[]>([]);
  const [acessos, setAcessos] = useState<AcessosResposta | null>(null);
  const [autorizacoes, setAutorizacoes] = useState<AutorizacaoResumo[]>([]);
  const [contextos, setContextos] = useState<ContextoOperacional[]>([]);
  const [destinoEntrada, setDestinoEntrada] = useState<string | null>(null);
  const [filtradoPorAutorizacao, setFiltrado] = useState(false);
  const [erroSessao, setErroSessao] = useState<string | null>(null);
  const [slugUrl, setSlugUrl] = useState<string | null>(null);

  const limparDadosContexto = useCallback(() => {
    setCartoes([]);
    setDestaques([]);
    setAcessos(null);
    setAutorizacoes([]);
    setContextos([]);
    setDestinoEntrada(null);
    setFiltrado(false);
  }, []);

  const limparSessaoLocal = useCallback(() => {
    setUsuario(null);
    limparDadosContexto();
  }, [limparDadosContexto]);

  const marcarSlugUrl = useCallback((slug: string | null) => {
    setSlugUrl(slug);
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
    setContextos(inicio.contextos ?? []);
    setDestinoEntrada(inicio.destinoEntrada ?? null);
    setFiltrado(inicio.filtradoPorAutorizacao);
    if (inicio.familiaSlug) {
      setUsuario({
        ...atual,
        familia: {
          id: atual.pessoa.familiaId,
          nome: atual.familia?.nome ?? "",
          slug: inicio.familiaSlug,
        },
      });
    }
    return inicio;
  }, []);

  const entrarNaSessao = useCallback(
    async (atual: UsuarioSessao) => {
      setUsuario(atual);
      return aplicarInicio(atual);
    },
    [aplicarInicio],
  );

  const slugSessao = usuario?.familia?.slug ?? null;
  const contextoUrlCompativel = Boolean(
    usuario && slugUrl && slugSessao && slugUrl === slugSessao,
  );

  const recarregarInicio = useCallback(async () => {
    if (!usuario) return;
    if (!slugUrl || usuario.familia?.slug !== slugUrl) {
      limparDadosContexto();
      return;
    }
    await aplicarInicio(usuario);
  }, [usuario, aplicarInicio, slugUrl, limparDadosContexto]);

  useEffect(() => {
    limparSessaoLegada();
    void (async () => {
      try {
        const me = await obterMe();
        if (me) setUsuario(me);
      } catch (e) {
        setErroSessao(
          mensagemErroAmigavel(e, "Não foi possível verificar a sessão"),
        );
      } finally {
        setPronto(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!pronto || !usuario) return;
    if (!slugUrl) {
      limparDadosContexto();
      return;
    }
    if (usuario.familia?.slug && usuario.familia.slug !== slugUrl) {
      limparDadosContexto();
      return;
    }
    let cancelado = false;
    void (async () => {
      try {
        await aplicarInicio(usuario);
      } catch (e) {
        if (!cancelado) {
          limparDadosContexto();
          setErroSessao(
            mensagemErroAmigavel(e, "Não foi possível carregar o início"),
          );
        }
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [pronto, usuario?.id, slugUrl, aplicarInicio, limparDadosContexto]);

  const podeGerenciarFamilia = Boolean(
    usuario && acessos?.modo === "administracao" && contextoUrlCompativel,
  );

  const valor = useMemo<EstadoSessao>(
    () => ({
      pronto,
      usuario,
      cartoes: contextoUrlCompativel ? cartoes : [],
      destaques: contextoUrlCompativel ? destaques : [],
      acessos: contextoUrlCompativel ? acessos : null,
      autorizacoes: contextoUrlCompativel ? autorizacoes : [],
      contextos: contextoUrlCompativel ? contextos : [],
      destinoEntrada: contextoUrlCompativel ? destinoEntrada : null,
      filtradoPorAutorizacao,
      podeGerenciarFamilia,
      erroSessao,
      slugUrl,
      contextoUrlCompativel,
      entrarNaSessao,
      recarregarInicio,
      limparSessaoLocal,
      limparDadosContexto,
      marcarSlugUrl,
    }),
    [
      pronto,
      usuario,
      cartoes,
      destaques,
      acessos,
      autorizacoes,
      contextos,
      destinoEntrada,
      filtradoPorAutorizacao,
      podeGerenciarFamilia,
      erroSessao,
      slugUrl,
      contextoUrlCompativel,
      entrarNaSessao,
      recarregarInicio,
      limparSessaoLocal,
      limparDadosContexto,
      marcarSlugUrl,
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
