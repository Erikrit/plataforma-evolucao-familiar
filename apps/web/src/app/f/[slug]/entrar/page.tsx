"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  MensagemFeedback,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import {
  entrar,
  obterContextoFamilia,
  type FamiliaContexto,
} from "@/lib/api";
import { ehSlugReservadoNaUi } from "@/lib/rotas-familia";

export default function PaginaEntrarFamilia() {
  const params = useParams<{ slug: string }>();
  const slug = String(params.slug ?? "");
  const router = useRouter();
  const { entrarNaSessao } = useSessao();
  const [familia, setFamilia] = useState<FamiliaContexto | null>(null);
  const [pronto, setPronto] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    let ativo = true;
    setPronto(false);
    setErro(null);
    setFamilia(null);
    if (!slug || ehSlugReservadoNaUi(slug)) {
      setErro(
        "Este endereço é reservado ou inválido. Volte às boas-vindas ou escolha outro identificador.",
      );
      setPronto(true);
      return () => {
        ativo = false;
      };
    }
    obterContextoFamilia(slug)
      .then((ctx) => {
        if (!ativo) return;
        setFamilia(ctx);
      })
      .catch((e) => {
        if (!ativo) return;
        setFamilia(null);
        setErro(mensagemErroAmigavel(e, "Endereço de família não encontrado."));
      })
      .finally(() => {
        if (ativo) setPronto(true);
      });
    return () => {
      ativo = false;
    };
  }, [slug]);

  async function aoEntrar(evento: FormEvent) {
    evento.preventDefault();
    if (!familia) return;
    setCarregando(true);
    setErro(null);
    try {
      const nova = await entrar(email, senha, familia.slug);
      const usuarioComFamilia = {
        ...nova.usuario,
        familia: nova.familia ?? {
          id: nova.usuario.pessoa.familiaId,
          nome: familia.nome,
          slug: familia.slug,
        },
      };
      const inicio = await entrarNaSessao(usuarioComFamilia);
      if (inicio.destinoEntrada) {
        router.replace(inicio.destinoEntrada);
      } else {
        router.replace(`/f/${familia.slug}`);
      }
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível entrar"));
    } finally {
      setCarregando(false);
    }
  }

  if (!pronto) {
    return (
      <Container component="main" size="sm" px="md" py="xl">
        <EstadoCarregando rotulo="Carregando família…" />
      </Container>
    );
  }

  return (
    <Container component="main" size="sm" px="md" py="xl">
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={1}>Entrar</Title>
          {familia ? (
            <Text c="dimmed" size="sm">
              {familia.nome}
            </Text>
          ) : (
            <Text c="dimmed" size="sm">
              Família indisponível.
            </Text>
          )}
          {familia ? (
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
          ) : (
            <Text size="sm">
              <Anchor component={Link} href="/f">
                Voltar às boas-vindas
              </Anchor>
              {" · "}
              <Anchor component={Link} href="/f/criar">
                Criar minha família
              </Anchor>
            </Text>
          )}
          <MensagemFeedback erro={erro} />
        </Stack>
      </Card>
    </Container>
  );
}
