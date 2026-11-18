"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AppShell,
  Burger,
  Button,
  Drawer,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  obterPessoa,
  sair,
  type AreasAutorizadasCartao,
} from "@/lib/api";

type AreaNav = {
  id: string;
  rotulo: string;
  href: string;
};

function areasDaPessoa(
  pessoaId: string,
  auth: AreasAutorizadasCartao | null | undefined,
): AreaNav[] {
  const areas: AreaNav[] = [
    {
      id: "perfil",
      rotulo: "Perfil",
      href: `/pessoas/${pessoaId}`,
    },
  ];
  if (!auth) return areas;
  if (auth.cuidados) {
    areas.push({
      id: "rotina",
      rotulo: "Rotina",
      href: `/pessoas/${pessoaId}/cuidados`,
    });
    areas.push({
      id: "medicamentos",
      rotulo: "Medicamentos",
      href: `/pessoas/${pessoaId}/cuidados/medicamentos`,
    });
    areas.push({
      id: "consultas",
      rotulo: "Consultas e exames",
      href: `/pessoas/${pessoaId}/cuidados/consultas`,
    });
  }
  if (auth.desenvolvimento) {
    areas.push({
      id: "desenvolvimento",
      rotulo: "Desenvolvimento",
      href: `/pessoas/${pessoaId}/desenvolvimento`,
    });
  }
  if (auth.historico) {
    areas.push({
      id: "historico",
      rotulo: "Histórico",
      href: `/pessoas/${pessoaId}/historico`,
    });
    areas.push({
      id: "resumo",
      rotulo: "Resumo",
      href: `/pessoas/${pessoaId}/resumo`,
    });
  }
  return areas;
}

function ativoPorHref(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/gerenciar-familia") return pathname.startsWith("/gerenciar-familia");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemNavAtivo(pathname: string, area: AreaNav) {
  if (area.id === "perfil") return pathname === area.href;
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
  const {
    pronto,
    usuario,
    cartoes,
    podeGerenciarFamilia,
    limparSessaoLocal,
  } = useSessao();
  const [saindo, setSaindo] = useState(false);
  const [areasFallback, setAreasFallback] =
    useState<AreasAutorizadasCartao | null>(null);
  const [nomeFallback, setNomeFallback] = useState<string | null>(null);

  const pessoaMatch = pathname.match(/^\/pessoas\/([^/]+)/);
  const pessoaId = pessoaMatch?.[1] ?? null;
  const cartaoAtual = useMemo(
    () => cartoes.find((c) => c.pessoaId === pessoaId) ?? null,
    [cartoes, pessoaId],
  );

  useEffect(() => {
    if (!usuario || !pessoaId) {
      setAreasFallback(null);
      setNomeFallback(null);
      return;
    }
    if (cartaoAtual?.areasAutorizadas) {
      setAreasFallback(cartaoAtual.areasAutorizadas);
      setNomeFallback(cartaoAtual.nome);
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
        setNomeFallback(perfil.nome);
        setAreasFallback({
          cuidados,
          desenvolvimento,
          historico: cuidados || desenvolvimento,
        });
      } catch {
        if (!cancelado) {
          setAreasFallback(null);
          setNomeFallback(null);
        }
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, pessoaId, cartaoAtual]);

  // Só monta destinos após flags reais; sem auth ainda → só Perfil (sem vazamento).
  const areas = useMemo(
    () =>
      pessoaId
        ? areasDaPessoa(
            pessoaId,
            cartaoAtual?.areasAutorizadas ?? areasFallback,
          )
        : [],
    [pessoaId, cartaoAtual, areasFallback],
  );
  const nomePessoaMenu = cartaoAtual?.nome ?? nomeFallback;

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

  if (!usuario) {
    return (
      <Stack gap="xs" p="md">
        <Text size="sm" c="dimmed">
          Entre para ver a família.
        </Text>
        <NavLink
          component={Link}
          href="/"
          label="Entrar"
          active={pathname === "/"}
          onClick={onNavegar}
        />
        <NavLink
          component={Link}
          href="/convites/ativar"
          label="Ativar convite"
          active={pathname.startsWith("/convites")}
          onClick={onNavegar}
        />
      </Stack>
    );
  }

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
          href="/"
          label="Nossa família"
          active={pathname === "/"}
          onClick={onNavegar}
        />
        {podeGerenciarFamilia ? (
          <NavLink
            component={Link}
            href="/gerenciar-familia"
            label="Gerenciar família"
            active={ativoPorHref(pathname, "/gerenciar-familia")}
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
              onClick={onNavegar}
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

export function NavegacaoApp({ children }: { children: ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const { usuario, cartoes } = useSessao();

  const pessoaMatch = pathname.match(/^\/pessoas\/([^/]+)/);
  const pessoaId = pessoaMatch?.[1] ?? null;
  const nomePessoa =
    cartoes.find((c) => c.pessoaId === pessoaId)?.nome ?? null;

  const titulo =
    pathname.startsWith("/gerenciar-familia")
      ? "Gerenciar família"
      : pessoaId && nomePessoa
        ? nomePessoa
        : "Nossa família";

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
              {usuario && pessoaId ? (
                <Text size="xs" c="dimmed">
                  Acompanhamento por pessoa
                </Text>
              ) : null}
            </Stack>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar visibleFrom="sm" p={0}>
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
