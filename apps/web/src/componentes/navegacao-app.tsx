"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
import { coresPef } from "@/tema/mantine";

type AreaNav = {
  id: string;
  rotulo: string;
  href: string;
  grupo: "cuidados" | "desenvolvimento" | "registros";
  icone: ReactNode;
};

function SvgNav({ children }: { children: ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const iconeInicio = (
  <SvgNav>
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1Z" />
  </SvgNav>
);
const iconeRotina = (
  <SvgNav>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </SvgNav>
);
const iconeMedicamentos = (
  <SvgNav>
    <path d="M10.5 3.5 8 6l10 10 2.5-2.5a3.5 3.5 0 0 0-5-5Z" />
    <path d="m8 6-4.5 4.5a3.5 3.5 0 0 0 5 5L18 6" />
  </SvgNav>
);
const iconeConsultas = (
  <SvgNav>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 11h18" />
  </SvgNav>
);
const iconeBiblioteca = (
  <SvgNav>
    <path d="M4 5h6a3 3 0 0 1 3 3v11a2.5 2.5 0 0 0-2.5-2.5H4Z" />
    <path d="M20 5h-6a3 3 0 0 0-3 3v11a2.5 2.5 0 0 1 2.5-2.5H20Z" />
  </SvgNav>
);
const iconeRecompensas = (
  <SvgNav>
    <path d="M12 3 9.5 8H4l4.5 3.5L6.5 17 12 14l5.5 3-2-5.5L20 8h-5.5Z" />
  </SvgNav>
);
const iconeCadastros = (
  <SvgNav>
    <path d="M12 5v14M5 12h14" />
    <rect x="3" y="3" width="18" height="18" rx="3" />
  </SvgNav>
);
const iconeHistorico = (
  <SvgNav>
    <path d="M4 5h14v10H9l-4 4V5Z" />
  </SvgNav>
);
const iconeResumo = (
  <SvgNav>
    <path d="M4 19V5M4 19h16" />
    <path d="M8 15v-4M12 15V9M16 15v-6" />
  </SvgNav>
);
const iconeConfig = (
  <SvgNav>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </SvgNav>
);
const iconePerfil = (
  <SvgNav>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </SvgNav>
);
const iconeGestao = (
  <SvgNav>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </SvgNav>
);
const iconeCuidados = (
  <SvgNav>
    <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" />
  </SvgNav>
);
const iconeDesenvolvimento = (
  <SvgNav>
    <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
    <path d="M16 7h6v6" />
  </SvgNav>
);

function areasDaPessoa(
  slug: string,
  pessoaId: string,
  auth: AreasAutorizadasCartao | null | undefined,
  podeOrganizar: boolean,
): AreaNav[] {
  const areas: AreaNav[] = [];
  if (!auth) return areas;
  if (auth.cuidados) {
    areas.push({
      id: "rotina",
      rotulo: "Rotina",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/cuidados`),
      grupo: "cuidados",
      icone: iconeRotina,
    });
    areas.push({
      id: "medicamentos",
      rotulo: "Medicamentos",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/cuidados/medicamentos`),
      grupo: "cuidados",
      icone: iconeMedicamentos,
    });
    areas.push({
      id: "consultas",
      rotulo: "Consultas e exames",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/cuidados/consultas`),
      grupo: "cuidados",
      icone: iconeConsultas,
    });
  }
  if (auth.desenvolvimento) {
    areas.push({
      id: "biblioteca-desenvolvimento",
      rotulo: "Biblioteca",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/desenvolvimento/biblioteca`),
      grupo: "desenvolvimento",
      icone: iconeBiblioteca,
    });
    areas.push({
      id: "recompensas-desenvolvimento",
      rotulo: "Recompensas",
      href: rotaFamilia(
        slug,
        `/pessoas/${pessoaId}/desenvolvimento/recompensas`,
      ),
      grupo: "desenvolvimento",
      icone: iconeRecompensas,
    });
    if (podeOrganizar) {
      areas.push({
        id: "cadastros-desenvolvimento",
        rotulo: "Cadastros",
        href: rotaFamilia(
          slug,
          `/pessoas/${pessoaId}/desenvolvimento/cadastros`,
        ),
        grupo: "desenvolvimento",
        icone: iconeCadastros,
      });
    }
  }
  if (auth.historico) {
    areas.push({
      id: "historico",
      rotulo: "Histórico",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/historico`),
      grupo: "registros",
      icone: iconeHistorico,
    });
    areas.push({
      id: "resumo",
      rotulo: "Resumo",
      href: rotaFamilia(slug, `/pessoas/${pessoaId}/resumo`),
      grupo: "registros",
      icone: iconeResumo,
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

function ItemArea({
  area,
  pathname,
  onNavegar,
}: {
  area: AreaNav;
  pathname: string;
  onNavegar?: () => void;
}) {
  const ativo = itemNavAtivo(pathname, area);
  return (
    <NavLink
      component={Link}
      href={area.href}
      label={area.rotulo}
      leftSection={area.icone}
      active={ativo}
      aria-current={
        pathname === area.href ? "page" : ativo ? "location" : undefined
      }
      onClick={onNavegar}
    />
  );
}

function MenuNavegacao({ onNavegar }: { onNavegar?: () => void }) {
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
    if (
      !usuario ||
      !pessoaId ||
      !contextoUrlCompativel ||
      cartaoAtual?.areasAutorizadas
    ) {
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
          areas: {
            cuidados,
            desenvolvimento,
            historico: cuidados || desenvolvimento,
          },
        });
      } catch {
        if (!cancelado) setFallback(null);
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
  const cuidados = areas.filter((a) => a.grupo === "cuidados");
  const desenvolvimento = areas.filter((a) => a.grupo === "desenvolvimento");
  const registros = areas.filter((a) => a.grupo === "registros");

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
            leftSection={iconeInicio}
            active={pathname === "/"}
            onClick={onNavegar}
          />
        )}
        <Text size="sm" c="dimmed">
          Convites são ativados pelo link recebido da família.
        </Text>
      </Stack>
    );
  }

  const hrefInicio = rotaFamilia(slug, "/");
  const hrefGestao = rotaFamilia(slug, "/gerenciar-familia");
  const cuidadosAtivo = cuidados.some((a) => itemNavAtivo(pathname, a));
  const desenvolvimentoAtivo = desenvolvimento.some((a) =>
    itemNavAtivo(pathname, a),
  );
  const configAtiva =
    pathname.includes("/gerenciar-familia") || pathname.includes("/perfil");

  return (
    <Stack gap="md" p="md">
      <Stack gap={2}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          Olá
        </Text>
        <Text fw={600}>{usuario.pessoa.nome}</Text>
      </Stack>

      <NavLink
        component={Link}
        href={hrefInicio}
        label="Início"
        leftSection={iconeInicio}
        active={ativoPorHref(pathname, hrefInicio)}
        onClick={onNavegar}
      />

      {pessoaId ? (
        <Stack gap={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {nomePessoaMenu ?? "Pessoa"}
          </Text>

          {cuidados.length ? (
            <NavLink
              label="Cuidados"
              leftSection={iconeCuidados}
              childrenOffset={28}
              defaultOpened={cuidadosAtivo}
              active={cuidadosAtivo}
            >
              {cuidados.map((area) => (
                <ItemArea
                  key={area.id}
                  area={area}
                  pathname={pathname}
                  onNavegar={onNavegar}
                />
              ))}
            </NavLink>
          ) : null}

          {desenvolvimento.length ? (
            <NavLink
              label="Desenvolvimento"
              leftSection={iconeDesenvolvimento}
              childrenOffset={28}
              defaultOpened={desenvolvimentoAtivo}
              active={desenvolvimentoAtivo}
            >
              {desenvolvimento.map((area) => (
                <ItemArea
                  key={area.id}
                  area={area}
                  pathname={pathname}
                  onNavegar={onNavegar}
                />
              ))}
            </NavLink>
          ) : null}

          {registros.map((area) => (
            <ItemArea
              key={area.id}
              area={area}
              pathname={pathname}
              onNavegar={onNavegar}
            />
          ))}
        </Stack>
      ) : null}

      <NavLink
        label="Configurações"
        leftSection={iconeConfig}
        childrenOffset={28}
        defaultOpened={configAtiva}
        active={configAtiva}
      >
        <NavLink
          label="Meu perfil"
          description={`${usuario.pessoa.nome} · ${usuario.email}`}
          leftSection={iconePerfil}
        />
        {podeGerenciarFamilia ? (
          <NavLink
            component={Link}
            href={hrefGestao}
            label="Gestão da família"
            leftSection={iconeGestao}
            active={ativoPorHref(pathname, hrefGestao)}
            onClick={onNavegar}
          />
        ) : null}
      </NavLink>

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
  const busca = useSearchParams();
  const consulta = busca.size ? "?" + busca.toString() : "";
  return (
    <Button component={Link} href={destino + consulta} variant="default">
      Sair do jogo
    </Button>
  );
}

export function NavegacaoApp({ children }: { children: ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const { usuario, cartoes, contextoUrlCompativel } = useSessao();
  const slug = extrairSlugDaUrl(pathname) ?? usuario?.familia?.slug ?? null;

  const pessoaId = pessoaIdDaUrl(pathname);
  const nomePessoa = contextoUrlCompativel
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
      <main style={{ background: coresPef.fundo, minHeight: "100vh" }}>
        <Container size="sm" pt="md">
          <Group justify="flex-end">
            <Suspense
              fallback={
                <Button
                  component={Link}
                  href={retornoPartida}
                  variant="default"
                >
                  Sair do jogo
                </Button>
              }
            >
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
      styles={{
        main: { background: coresPef.fundo },
        navbar: {
          background: coresPef.superficie,
          borderRight: `1px solid ${coresPef.primariaSuave}`,
        },
        header: {
          background: coresPef.superficie,
          borderBottom: `1px solid ${coresPef.primariaSuave}`,
        },
      }}
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
                  Espaço familiar
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
