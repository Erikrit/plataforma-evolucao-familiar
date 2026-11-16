"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  Anchor,
  Button,
  Card,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";
import { entrar, type AcessoResumo } from "@/lib/api";

function textoAcesso(a: AcessoResumo): string {
  const alvo = a.pessoaAcompanhadaNome
    ? a.pessoaAcompanhadaNome
    : "família (administração)";
  return `${a.participanteNome} · ${a.papel} · acompanha ${alvo}${a.ativo ? "" : " · inativo"}`;
}

export function PainelFundacao() {
  const {
    pronto,
    usuario,
    cartoes,
    destaques,
    acessos,
    filtradoPorAutorizacao,
    podeGerenciarFamilia,
    entrarNaSessao,
    erroSessao,
  } = useSessao();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function aoEntrar(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const nova = await entrar(email, senha);
      await entrarNaSessao(nova.usuario);
      setSucesso("Você entrou.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível entrar");
    } finally {
      setCarregando(false);
    }
  }

  if (!pronto) {
    return <EstadoCarregando rotulo="Verificando sessão…" />;
  }

  if (!usuario) {
    return (
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={2}>Entrar</Title>
          <Text c="dimmed" size="sm">
            Use o e-mail e a senha da sua conta familiar.
          </Text>
          <form onSubmit={aoEntrar}>
            <Stack gap="sm">
              <TextInput
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                autoComplete="username"
                required
                type="email"
              />
              <PasswordInput
                label="Senha"
                value={senha}
                onChange={(e) => setSenha(e.currentTarget.value)}
                autoComplete="current-password"
                required
              />
              <Button type="submit" loading={carregando}>
                Entrar
              </Button>
            </Stack>
          </form>
          <Text size="sm">
            Recebeu um convite?{" "}
            <Anchor component={Link} href="/convites/ativar">
              Ativar convite
            </Anchor>
          </Text>
          <MensagemFeedback erro={erro ?? erroSessao} sucesso={sucesso} />
        </Stack>
      </Card>
    );
  }

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
          <Text c="dimmed" size="sm">
            Poucos acontecimentos recentes ou próximos, só do que você pode ver.
          </Text>
          <Stack gap="xs">
            {destaques.map((d) => (
              <Card
                key={`${d.tipo}-${d.pessoaId}-${d.quando}`}
                component={Link}
                href={`/pessoas/${d.pessoaId}`}
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

      <Stack gap="sm">
        <Title order={2}>Pessoas</Title>
        <Text c="dimmed" size="sm">
          {filtradoPorAutorizacao
            ? "Mostramos apenas quem você pode acompanhar."
            : "Toque em uma pessoa para ver o perfil e as áreas disponíveis."}
        </Text>

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
                href={`/pessoas/${cartao.pessoaId}`}
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

      {podeGerenciarFamilia ? (
        <Card
          component={Link}
          href="/gerenciar-familia"
          withBorder
          padding="md"
          radius="md"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text fw={600}>Gerenciar família</Text>
          <Text size="sm" c="dimmed">
            Pessoas, acessos e convites — área administrativa separada do
            acompanhamento.
          </Text>
        </Card>
      ) : null}

      <MensagemFeedback erro={erro ?? erroSessao} sucesso={sucesso} />
    </Stack>
  );
}
