"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AppShell,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useSessao } from "@/componentes/contexto-sessao";
import { podeOrganizarDesenvolvimento } from "@/lib/rotulos-experiencia";
import { consultaCategoriaJogos } from "@/lib/filtros-jogos";
import {
  extrairSlugDaUrl,
  pessoaIdDaUrl,
  rotaFamilia,
  rotaRetornoPartida,
} from "@/lib/rotas-familia";
import {
  obterPessoa,
  sair,
  type AreasAutorizadasCartao,
} from "@/lib/api";

type AreaNav = {
  id: string;
  rotulo: string;
  href: string;
  subitem?: boolean;
};

function areasDaPessoa(
  slug: string,
  pessoaId: string,
  auth: AreasAutorizadasCartao | null | undefined,
  podeOrganizar: boolean,
): AreaNav[] {
  const areas: AreaNav[] = [
    {
      id: "perfil",
      rotulo: "Perfil",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}`),
    },
  ];
  if (!auth) return areas;
  if (auth.cuidados) {
    areas.push({
      id: "rotina",
      rotulo: "Rotina",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/cuidados`),
    });
    areas.push({
      id: "medicamentos",
      rotulo: "Medicamentos",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/cuidados/medicamentos`),
    });
    areas.push({
      id: "consultas",
      rotulo: "Consultas e exames",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/cuidados/consultas`),
    });
  }
  if (auth.desenvolvimento) {
    areas.push({
      id: "desenvolvimento",
      rotulo: "Desenvolvimento",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/desenvolvimento`),
    });
    areas.push({
      id: "biblioteca-desenvolvimento",
      rotulo: "Biblioteca",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/desenvolvimento/biblioteca`),
      subitem: true,
    });
    areas.push({
      id: "recompensas-desenvolvimento",
      rotulo: "Recompensas",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/desenvolvimento/recompensas`),
      subitem: true,
    });
    if (podeOrganizar) {
      areas.push({
        id: "cadastros-desenvolvimento",
        rotulo: "Cadastros",
        href: rotaFamilia(
          slug,
          `/pessoas/${pessoaId}/desenvolvimento/cadastros`,
        ),
        subitem: true,
      });
    }
  }
  if (auth.historico) {
    areas.push({
      id: "historico",
      rotulo: "Histórico",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/historico`),
    });
    areas.push({
      id: "resumo",
      rotulo: "Resumo",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/resumo`),
    });
  }
  return areas;
}

function ativoPorHref(pathname: string, href: string) {
  const home = href.match(/^\/f\/[^/]+\/?$/);
  if (home) {
    return pathname === href || pathname === href.replace(/\/$/, "");
  }
  if (href.endsWith("/gerenciar-familia")) {
    return pathname.includes("/gerenciar-familia");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemNavAtivo(pathname: string, area: AreaNav) {
  if (area.id === "perfil" || area.id === "desenvolvimento") {
    return pathname === area.href;
  }
  if (area.id === "rotina") {
    return (
      pathname === area.href ||
      (pathname.startsWith(`${area.href}/`) &&
        !pathname.includes("/cuidados/medicamentos") &&
        !pathname.includes("/cuidados/consultas"))
    );
  }
  return ativoPorHref(pathname, area.href);
}

function MenuNavegacao({
  onNavegar,
}: {
  onNavegar?: () => void;
}) {
  const pathname = usePathname();
  const slugUrl = extrairSlugDaUrl(pathname);
  const {
    pronto,
    usuario,
    cartoes,
    autorizacoes,
    podeGerenciarFamilia,
    contextoUrlCompativel,
    limparSessaoLocal,
  } = useSessao();
  const slug = slugUrl ?? usuario?.familia?.slug ?? null;
  const [saindo, setSaindo] = useState(false);
  const [fallback, setFallback] = useState<{
    chave: string;
    nome: string;
    areas: AreasAutorizadasCartao;
  } | null>(null);

  const pessoaId = pessoaIdDaUrl(pathname);
  const chaveFallback = JSON.stringify([usuario?.id, slug, pessoaId]);
  const fallbackAtual = fallback?.chave === chaveFallback ? fallback : null;
  const cartaoAtual = useMemo(
    () => cartoes.find((c) => c.pessoaId === pessoaId) ?? null,
    [cartoes, pessoaId],
  );

  useEffect(() => {
    if (!usuario || !pessoaId || !contextoUrlCompativel || cartaoAtual?.areasAutorizadas) {
      setFallback(null);
      return;
    }
    let cancelado = false;
    void (async () => {
      try {
        const perfil = (await obterPessoa(
          usuario.pessoa.familiaId,
          pessoaId,
        )) as {
          nome: string;
          areas?: { id: string; disponivel: boolean }[];
        };
        if (cancelado) return;
        const lista = perfil.areas ?? [];
        const cuidados = lista.some((a) => a.id === "cuidados" && a.disponivel);
        const desenvolvimento = lista.some(
          (a) => a.id === "desenvolvimento" && a.disponivel,
        );
        setFallback({
          chave: chaveFallback,
          nome: perfil.nome,
          areas: { cuidados, desenvolvimento, historico: cuidados || desenvolvimento },
        });
      } catch {
        if (!cancelado) {
          setFallback(null);
        }
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, pessoaId, cartaoAtual, contextoUrlCompativel, chaveFallback]);

  const areas = useMemo(
    () =>
      slug && pessoaId && contextoUrlCompativel
        ? areasDaPessoa(
            slug,
            pessoaId,
            cartaoAtual?.areasAutorizadas ?? fallbackAtual?.areas,
            podeOrganizarDesenvolvimento(
              pessoaId,
              usuario?.pessoa.id,
              autorizacoes,
            ),
          )
        : [],
    [
      slug,
      pessoaId,
      cartaoAtual,
      fallbackAtual,
      usuario,
      autorizacoes,
      contextoUrlCompativel,
    ],
  );
  const nomePessoaMenu = cartaoAtual?.nome ?? fallbackAtual?.nome;

  async function aoSair() {
    setSaindo(true);
    try {
      await sair();
    } catch {
      /* limpeza local mesmo se a API falhar */
    } finally {
      limparSessaoLocal();
      setSaindo(false);
      onNavegar?.();
    }
  }

  if (!pronto) {
    return (
      <Stack gap="xs" p="md" role="status" aria-live="polite">
        <Text size="sm" c="dimmed">
          Verificando sessão…
        </Text>
      </Stack>
    );
  }

  if (slugUrl && usuario && !contextoUrlCompativel) {
    return (
      <Stack gap="xs" p="md">
        <Text size="sm" c="dimmed">
          Contexto familiar diferente. Nenhum dado desta ou da outra família é
          exibido aqui.
        </Text>
        <NavLink
          component={Link}
          href={rotaFamilia(slugUrl, "/entrar")}
          label="Entrar nesta família"
          onClick={onNavegar}
        />
        {usuario.familia?.slug ? (
          <NavLink
            component={Link}
            href={rotaFamilia(usuario.familia.slug, "/")}
            label="Ir à sua família"
            onClick={onNavegar}
          />
        ) : null}
        <Button
          variant="default"
          onClick={() => void aoSair()}
          loading={saindo}
          fullWidth
        >
          Sair
        </Button>
      </Stack>
    );
  }

  if (!usuario || !slug) {
    return (
      <Stack gap="xs" p="md">
        <Text size="sm" c="dimmed">
          Entre pelo endereço da família.
        </Text>
        {slugUrl ? (
          <NavLink
            component={Link}
            href={rotaFamilia(slugUrl, "/entrar")}
            label="Entrar"
            active={pathname.endsWith("/entrar")}
            onClick={onNavegar}
          />
        ) : (
          <NavLink
            component={Link}
            href="/"
            label="Início"
            active={pathname === "/"}
            onClick={onNavegar}
          />
        )}
        <Text size="sm" c="dimmed">
          Convites são ativados pelo link /f/…/convites/ativar da família.
        </Text>
      </Stack>
    );
  }

  const hrefInicio = rotaFamilia(slug, "/");
  const hrefGestao = rotaFamilia(slug, "/gerenciar-familia");

  return (
    <Stack gap="md" p="md">
      <Stack gap={2}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          Olá
        </Text>
        <Text fw={600}>{usuario.pessoa.nome}</Text>
      </Stack>

      <Stack gap={4}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          Geral
        </Text>
        <NavLink
          component={Link}
          href={hrefInicio}
          label="Nossa família"
          active={ativoPorHref(pathname, hrefInicio)}
          onClick={onNavegar}
        />
        {podeGerenciarFamilia ? (
          <NavLink
            component={Link}
            href={hrefGestao}
            label="Gerenciar família"
            active={ativoPorHref(pathname, hrefGestao)}
            onClick={onNavegar}
          />
        ) : null}
      </Stack>

      {pessoaId ? (
        <Stack gap={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {nomePessoaMenu ?? "Pessoa"}
          </Text>
          {areas.map((area) => (
            <NavLink
              key={area.id}
              component={Link}
              href={area.href}
              label={area.rotulo}
              active={itemNavAtivo(pathname, area)}
              aria-current={
                pathname === area.href ? "page" : itemNavAtivo(pathname, area) ? "location" : undefined
              }
              onClick={onNavegar}
              pl={area.subitem ? "xl" : undefined}
            />
          ))}
        </Stack>
      ) : null}

      <Button
        variant="default"
        onClick={() => void aoSair()}
        loading={saindo}
        fullWidth
      >
        Sair
      </Button>
    </Stack>
  );
}

function SaidaDaPartida({ destino }: { destino: string }) {
  const consulta = consultaCategoriaJogos(useSearchParams().get("categoria"));
  return <Button component={Link} href={destino + consulta} variant="default">Sair do jogo</Button>;
}

export function NavegacaoApp({ children }: { children: ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const { usuario, cartoes, contextoUrlCompativel } = useSessao();
  const slug = extrairSlugDaUrl(pathname) ?? usuario?.familia?.slug ?? null;

  const pessoaId = pessoaIdDaUrl(pathname);
  const nomePessoa =
    contextoUrlCompativel
      ? (cartoes.find((c) => c.pessoaId === pessoaId)?.nome ?? null)
      : null;

  const titulo = pathname.includes("/gerenciar-familia")
    ? "Gerenciar família"
    : pessoaId && nomePessoa
      ? nomePessoa
      : "Nossa família";

  const retornoPartida = rotaRetornoPartida(pathname);
  if (retornoPartida) {
    return (
      <main>
        <Container size="sm" pt="md">
          <Group justify="flex-end">
            <Suspense fallback={<Button component={Link} href={retornoPartida} variant="default">Sair do jogo</Button>}>
              <SaidaDaPartida destino={retornoPartida} />
            </Suspense>
          </Group>
        </Container>
        {children}
      </main>
    );
  }

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger
              opened={menuAberto}
              onClick={() => setMenuAberto((v) => !v)}
              hiddenFrom="sm"
              size="sm"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            />
            <Stack gap={0}>
              <Title order={4} component="p" style={{ margin: 0 }}>
                {titulo}
              </Title>
              {usuario && pessoaId && contextoUrlCompativel ? (
                <Text size="xs" c="dimmed">
                  Acompanhamento por pessoa
                </Text>
              ) : slug ? (
                <Text size="xs" c="dimmed">
                  /f/{slug}
                </Text>
              ) : null}
            </Stack>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar visibleFrom="sm" p={0} style={{ overflowY: "auto" }}>
        <MenuNavegacao />
      </AppShell.Navbar>

      <Drawer
        opened={menuAberto}
        onClose={() => setMenuAberto(false)}
        size="280px"
        padding={0}
        title="Menu"
        hiddenFrom="sm"
        position="left"
      >
        <MenuNavegacao onNavegar={() => setMenuAberto(false)} />
      </Drawer>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
