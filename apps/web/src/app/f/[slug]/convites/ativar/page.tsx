"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { rotaFamilia } from "@/lib/rotas-familia";

export default function PaginaAtivarConviteFamilia() {
  const params = useParams<{ slug: string }>();
  const slug = String(params.slug ?? "");
  const [token, setToken] = useState("");
  const [tokenDaUrl, setTokenDaUrl] = useState(false);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [destinoEntrada, setDestinoEntrada] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const paramsUrl = new URLSearchParams(window.location.search);
    const inicial = paramsUrl.get("token");
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
    setDestinoEntrada(null);
    try {
      const resultado = await ativarConvite(token.trim(), {
        senha,
        nome: nome.trim() || undefined,
        familiaSlug: slug,
      });
      setSenha("");
      setDestinoEntrada(
        resultado?.destinoEntrada ?? rotaFamilia(slug, "/entrar"),
      );
      setSucesso(
        resultado?.reutilizouPessoa
          ? "Conta ativada na pessoa já cadastrada. Você já pode entrar."
          : "Conta criada. Você já pode entrar nesta família.",
      );
    } catch (e) {
      const mensagem =
        e instanceof Error ? e.message : "Não foi possível ativar o convite";
      const expirado = /expir|inválid|invalid|usado|utiliz|contexto/i.test(
        mensagem,
      );
      setErro(
        expirado
          ? "Este convite não é mais válido neste contexto. Peça um novo convite a quem administra a família."
          : mensagem,
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Container component="main" size="sm" py="lg" px="md">
      <Stack gap="lg">
        <Anchor component={Link} href={rotaFamilia(slug, "/entrar")} size="sm">
          ← Entrar na família
        </Anchor>

        <Stack gap={4}>
          <Title order={1}>Ativar convite</Title>
          <Text c="dimmed" size="sm">
            Crie sua senha para começar a acompanhar a pessoa autorizada nesta
            família.
          </Text>
        </Stack>

        <Card withBorder padding="lg" radius="md">
          <form onSubmit={aoAtivar}>
            <Stack gap="sm">
              {tokenDaUrl ? (
                <Text size="sm" c="dimmed">
                  Convite reconhecido pelo link. Você não precisa colar o
                  código.
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
                disabled={!token.trim() || !slug}
              >
                Ativar conta
              </Button>
            </Stack>
          </form>
          <MensagemFeedback erro={erro} sucesso={sucesso} />
          {sucesso && destinoEntrada ? (
            <Text size="sm" mt="sm">
              Próximo passo:{" "}
              <Anchor component={Link} href={destinoEntrada}>
                entrar nesta família
              </Anchor>
              .
            </Text>
          ) : null}
        </Card>
      </Stack>
    </Container>
  );
}
