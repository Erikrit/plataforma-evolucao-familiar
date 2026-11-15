"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Anchor,
  Button,
  Card,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { ativarConvite } from "@/lib/api";
import { MensagemFeedback } from "@/componentes/feedback";

export default function PaginaAtivarConvite() {
  const [token, setToken] = useState("");
  const [tokenDaUrl, setTokenDaUrl] = useState(false);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inicial = params.get("token");
    if (inicial) {
      setToken(inicial);
      setTokenDaUrl(true);
    }
  }, []);

  async function aoAtivar(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await ativarConvite(token.trim(), {
        senha,
        nome: nome.trim() || undefined,
      });
      setSenha("");
      setSucesso("Conta criada. Você já pode entrar na página inicial.");
    } catch (e) {
      const mensagem =
        e instanceof Error ? e.message : "Não foi possível ativar o convite";
      const expirado = /expir|inválid|invalid|usado|utiliz/i.test(mensagem);
      setErro(
        expirado
          ? "Este convite não é mais válido. Peça um novo convite a quem administra a família."
          : mensagem,
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Container component="main" size="sm" py="lg" px="md">
      <Stack gap="lg">
        <Anchor component={Link} href="/" size="sm">
          ← Nossa família
        </Anchor>

        <Stack gap={4}>
          <Title order={1}>Ativar convite</Title>
          <Text c="dimmed" size="sm">
            Crie sua senha para começar a acompanhar a pessoa autorizada.
          </Text>
        </Stack>

        <Card withBorder padding="lg" radius="md">
          <form onSubmit={aoAtivar}>
            <Stack gap="sm">
              {tokenDaUrl ? (
                <Text size="sm" c="dimmed">
                  Convite reconhecido pelo link. Você não precisa colar o código.
                </Text>
              ) : (
                <TextInput
                  label="Código do convite"
                  description="Cole o código que você recebeu, se não veio no link."
                  value={token}
                  onChange={(e) => setToken(e.currentTarget.value)}
                  required
                  autoComplete="off"
                />
              )}
              {!tokenDaUrl ? null : (
                <input type="hidden" value={token} readOnly aria-hidden />
              )}
              <TextInput
                label="Seu nome (opcional)"
                value={nome}
                onChange={(e) => setNome(e.currentTarget.value)}
                autoComplete="name"
              />
              <PasswordInput
                label="Crie uma senha"
                value={senha}
                onChange={(e) => setSenha(e.currentTarget.value)}
                required
                autoComplete="new-password"
              />
              <Button
                type="submit"
                loading={carregando}
                disabled={!token.trim()}
              >
                Ativar conta
              </Button>
            </Stack>
          </form>
          <MensagemFeedback erro={erro} sucesso={sucesso} />
          {sucesso ? (
            <Text size="sm" mt="sm">
              Próximo passo:{" "}
              <Anchor component={Link} href="/">
                entrar na página inicial
              </Anchor>
              .
            </Text>
          ) : null}
        </Card>
      </Stack>
    </Container>
  );
}
