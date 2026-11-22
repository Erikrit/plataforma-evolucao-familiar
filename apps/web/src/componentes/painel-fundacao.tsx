"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Anchor,
  Button,
  Card,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";
import { type AcessoResumo, type ContextoOperacional } from "@/lib/api";
import { rotaFamilia } from "@/lib/rotas-familia";
import { rotuloPapelExperiencia } from "@/lib/rotulos-experiencia";

function textoAcesso(a: AcessoResumo): string {
  const papel = rotuloPapelExperiencia(a.papel);
  if (a.papel === "Administrador" || !a.pessoaAcompanhadaNome) {
    return `${a.participanteNome} · ${papel} · família (administração)${a.ativo ? "" : " · inativo"}`;
  }
  const area = a.area ? `${a.area} · ` : "";
  return `${a.participanteNome} · ${area}${papel}${a.ativo ? "" : " · inativo"}`;
}

function rotuloArea(area: ContextoOperacional["area"]): string {
  return area === "cuidados" ? "Cuidados" : "Desenvolvimento";
}

export function PainelFundacao() {
  const {
    pronto,
    usuario,
    cartoes,
    destaques,
    acessos,
    contextos,
    destinoEntrada,
    podeGerenciarFamilia,
    erroSessao,
  } = useSessao();

  const contextosPorPessoa = useMemo(() => {
    const mapa = new Map<
      string,
      { nome: string; areas: ContextoOperacional[] }
    >();
    for (const ctx of contextos) {
      const atual = mapa.get(ctx.pessoaId);
      if (atual) {
        atual.areas.push(ctx);
      } else {
        mapa.set(ctx.pessoaId, { nome: ctx.nome, areas: [ctx] });
      }
    }
    return [...mapa.entries()].map(([pessoaId, valor]) => ({
      pessoaId,
      nome: valor.nome,
      areas: valor.areas,
    }));
  }, [contextos]);

  if (!pronto) {
    return <EstadoCarregando rotulo="Verificando sessão…" />;
  }

  if (!usuario) {
    return (
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={2}>Sessão necessária</Title>
          <Text c="dimmed" size="sm">
            Entre pelo endereço da sua família para continuar. Não há login global
            nesta etapa.
          </Text>
          <Text size="sm">
            <Anchor component={Link} href="/f">
              Ir às boas-vindas
            </Anchor>
            {" · "}
            <Anchor component={Link} href="/f/criar">
              Criar minha família
            </Anchor>
          </Text>
          <MensagemFeedback erro={erroSessao} />
        </Stack>
      </Card>
    );
  }

  const slug = usuario.familia?.slug;
  if (!slug) {
    return (
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={2}>Contexto incompleto</Title>
          <Text c="dimmed" size="sm">
            Não foi possível identificar o endereço da família nesta sessão.
            Entre novamente pelo endereço /f/…/entrar.
          </Text>
          <MensagemFeedback erro={erroSessao} />
        </Stack>
      </Card>
    );
  }

  const escolhaMultipla = contextos.length > 1;
  const contextoUnico = contextos.length === 1 ? contextos[0] : null;
  const hrefGestao = rotaFamilia(slug, "/gerenciar-familia");

  return (
    <Stack gap="lg">
      <Text>
        Olá, <Text span fw={600}>{usuario.pessoa.nome}</Text>
      </Text>

      {acessos &&
      acessos.modo === "proprios_dados" &&
      acessos.itens.length > 0 ? (
        <Stack gap="sm">
          <Title order={2}>Quem acompanha você</Title>
          <Text c="dimmed" size="sm">
            Somente leitura: nomes e papéis com acesso ativo aos seus dados.
          </Text>
          <Stack gap={6} component="ul" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {acessos.itens.map((a) => (
              <Text key={a.id} component="li" size="sm">
                {textoAcesso(a)}
              </Text>
            ))}
          </Stack>
        </Stack>
      ) : null}

      {destaques.length > 0 ? (
        <Stack gap="sm">
          <Title order={2}>Para acompanhar</Title>
          <Stack gap="xs">
            {destaques.map((d) => (
              <Card
                key={`${d.tipo}-${d.pessoaId}-${d.quando}`}
                component={Link}
                href={rotaFamilia(slug, `/pessoas/${d.pessoaId}`)}
                withBorder
                padding="sm"
                radius="md"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Stack gap={2}>
                  <Text size="sm" fw={600}>
                    {d.titulo}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {d.pessoaNome}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      ) : null}

      {escolhaMultipla ? (
        <Stack gap="sm">
          <Title order={2}>Escolha o acompanhamento</Title>
          <Text c="dimmed" size="sm">
            Você tem mais de um contexto autorizado. Abra a área desejada.
          </Text>
          <Stack gap="sm">
            {contextosPorPessoa.map((grupo) => (
              <Card key={grupo.pessoaId} withBorder padding="md" radius="md">
                <Stack gap="xs">
                  <Text fw={600}>{grupo.nome}</Text>
                  <GroupAreas areas={grupo.areas} />
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      ) : null}

      {contextoUnico ? (
        <Card
          component={Link}
          href={contextoUnico.href}
          withBorder
          padding="md"
          radius="md"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text fw={600}>
            Continuar em {rotuloArea(contextoUnico.area)} de {contextoUnico.nome}
          </Text>
          <Text size="sm" c="dimmed">
            Único contexto operacional autorizado nesta sessão.
          </Text>
        </Card>
      ) : null}

      {!escolhaMultipla && !contextoUnico ? (
        <Stack gap="sm">
          <Title order={2}>Pessoas</Title>
          {cartoes.length === 0 ? (
            <EstadoVazio
              titulo="Nenhuma pessoa por aqui ainda"
              descricao={
                podeGerenciarFamilia
                  ? "Abra Gerenciar família no menu para adicionar a primeira pessoa."
                  : "Quando alguém te autorizar, a pessoa aparecerá nesta lista."
              }
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {cartoes.map((cartao) => (
                <Card
                  key={cartao.pessoaId}
                  component={Link}
                  href={rotaFamilia(slug, `/pessoas/${cartao.pessoaId}`)}
                  withBorder
                  padding="md"
                  radius="md"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Stack gap={4}>
                    <Text fw={600} size="lg">
                      {cartao.nome}
                    </Text>
                    {cartao.resumo ? (
                      <Text size="sm" c="dimmed">
                        {cartao.resumo}
                      </Text>
                    ) : null}
                    <Text size="sm" c="azul" fw={500}>
                      Abrir perfil
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      ) : null}

      {podeGerenciarFamilia ? (
        <Card
          component={Link}
          href={hrefGestao}
          withBorder
          padding="md"
          radius="md"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text fw={600}>Gerenciar família</Text>
          <Text size="sm" c="dimmed">
            {destinoEntrada === hrefGestao && contextos.length === 0
              ? "Nenhum contexto operacional — abra a gestão da família."
              : "Pessoas, acessos e convites — área administrativa separada do acompanhamento."}
          </Text>
        </Card>
      ) : null}

      <MensagemFeedback erro={erroSessao} />
    </Stack>
  );
}

function GroupAreas({ areas }: { areas: ContextoOperacional[] }) {
  return (
    <Stack gap={6}>
      {areas.map((area) => (
        <Button
          key={`${area.pessoaId}-${area.area}`}
          component={Link}
          href={area.href}
          variant="light"
          fullWidth
        >
          {rotuloArea(area.area)}
        </Button>
      ))}
    </Stack>
  );
}
