"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, type ReactNode } from "react";
import { Anchor, Card, Stack, Text, Title } from "@mantine/core";
import { useSessao } from "@/componentes/contexto-sessao";
import { EstadoCarregando } from "@/componentes/feedback";
import { rotaFamilia } from "@/lib/rotas-familia";

/**
 * Garante que dados da sessão só aparecem quando o slug da URL
 * coincide com a família da conta (E1-ACE-03).
 */
export function GuardaContextoFamiliar({
  slug,
  children,
  permitirEntrarSemSessao = false,
}: {
  slug: string;
  children: ReactNode;
  /** Página /entrar pode renderizar formulário sem sessão. */
  permitirEntrarSemSessao?: boolean;
}) {
  const {
    pronto,
    usuario,
    limparDadosContexto,
    contextoUrlCompativel,
    marcarSlugUrl,
  } = useSessao();

  useLayoutEffect(() => {
    marcarSlugUrl(slug);
  }, [slug, marcarSlugUrl]);

  const slugSessao = usuario?.familia?.slug ?? null;
  const compativel = Boolean(usuario && slugSessao === slug);

  useLayoutEffect(() => {
    if (!pronto) return;
    if (usuario && slugSessao !== slug) {
      limparDadosContexto();
    }
  }, [pronto, usuario, slugSessao, slug, limparDadosContexto]);

  const orientacao = useMemo(() => {
    if (!usuario) {
      return {
        titulo: "Entre nesta família",
        texto: "Use o endereço e as credenciais desta família para continuar.",
        href: rotaFamilia(slug, "/entrar"),
        rotulo: "Ir para entrar",
      };
    }
    return {
      titulo: "Contexto familiar diferente",
      texto:
        "Sua sessão pertence a outra família. Este endereço não mostra dados anteriores. Entre pelo endereço correto ou saia e acesse esta família.",
      href: slugSessao ? rotaFamilia(slugSessao, "/") : rotaFamilia(slug, "/entrar"),
      rotulo: slugSessao ? "Ir à sua família" : "Ir para entrar",
    };
  }, [usuario, slug, slugSessao]);

  if (!pronto) {
    return <EstadoCarregando rotulo="Verificando contexto familiar…" />;
  }

  if (permitirEntrarSemSessao) {
    return <>{children}</>;
  }

  if (!compativel) {
    return (
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={2}>{orientacao.titulo}</Title>
          <Text c="dimmed" size="sm">
            {orientacao.texto}
          </Text>
          <Text size="sm">
            <Anchor component={Link} href={orientacao.href}>
              {orientacao.rotulo}
            </Anchor>
            {usuario ? (
              <>
                {" · "}
                <Anchor component={Link} href={rotaFamilia(slug, "/entrar")}>
                  Entrar nesta família
                </Anchor>
              </>
            ) : null}
          </Text>
        </Stack>
      </Card>
    );
  }

  if (!contextoUrlCompativel) {
    return <EstadoCarregando rotulo="Ajustando contexto…" />;
  }

  return <>{children}</>;
}
