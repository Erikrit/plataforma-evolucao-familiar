"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
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
import {
  EstadoCarregando,
  MensagemFeedback,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  cadastrarFamilia,
  ErroApi,
  sugerirEnderecoFamilia,
  type FamiliaCriada,
} from "@/lib/api";
import { RedirecionarRotaLegada } from "@/componentes/redirecionar-rota-legada";

function urlEntradaCompleta(caminhoEntrada: string): string {
  if (typeof window === "undefined") return caminhoEntrada;
  return `${window.location.origin}${caminhoEntrada}`;
}

export default function PaginaCriarFamilia() {
  const { pronto, usuario } = useSessao();
  const [nomeFamilia, setNomeFamilia] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEditado, setSlugEditado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [criada, setCriada] = useState<FamiliaCriada | null>(null);
  const [copiaOk, setCopiaOk] = useState(false);
  const [copiaManual, setCopiaManual] = useState(false);

  useEffect(() => {
    if (slugEditado || !nomeFamilia.trim()) return;
    let ativo = true;
    sugerirEnderecoFamilia(nomeFamilia)
      .then((r) => {
        if (ativo) setSlug(r.slug);
      })
      .catch(() => {
        /* sugestão local já cobre falha de rede */
      });
    return () => {
      ativo = false;
    };
  }, [nomeFamilia, slugEditado]);

  const previaUrl = useMemo(() => {
    const id = slug.trim().toLowerCase();
    if (!id) return "/f/…/entrar";
    return `/f/${id}/entrar`;
  }, [slug]);

  async function aoCadastrar(evento: FormEvent) {
    evento.preventDefault();
    if (carregando || criada) return;
    setCarregando(true);
    setErro(null);
    setCopiaOk(false);
    setCopiaManual(false);
    try {
      const resultado = await cadastrarFamilia({
        nomeFamilia,
        nomeTitular,
        email,
        senha,
        slug,
      });
      setCriada(resultado);
      setSenha("");
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível criar a família."));
      if (e instanceof ErroApi && e.alternativa) {
        setSlug(e.alternativa);
        setSlugEditado(true);
      }
    } finally {
      setCarregando(false);
    }
  }

  async function copiarEndereco() {
    if (!criada) return;
    const texto = urlEntradaCompleta(criada.caminhoEntrada);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(texto);
        setCopiaOk(true);
        setCopiaManual(false);
        return;
      }
    } catch {
      /* cai no modo manual */
    }
    setCopiaManual(true);
    setCopiaOk(false);
  }

  if (!pronto) {
    return (
      <Container component="main" size="sm" px="md" py="xl">
        <EstadoCarregando rotulo="Verificando sessão…" />
      </Container>
    );
  }

  if (usuario?.familia?.slug) {
    return <RedirecionarRotaLegada />;
  }

  if (criada) {
    const urlCompleta = urlEntradaCompleta(criada.caminhoEntrada);
    return (
      <Container component="main" size="sm" px="md" py="xl">
        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Title order={1}>Família criada</Title>
            <Text size="sm">
              {criada.familia.nome} está pronta. Guarde o endereço de acesso:
            </Text>
            <Text fw={600}>{urlCompleta}</Text>
            <Text c="dimmed" size="sm">
              Use o e-mail informado e a senha que você definiu para entrar. Não
              enviamos mensagem por e-mail nesta etapa.
            </Text>
            <Button onClick={copiarEndereco}>Copiar endereço</Button>
            {copiaOk ? (
              <Text size="sm" c="teal">
                Endereço copiado.
              </Text>
            ) : null}
            {copiaManual ? (
              <TextInput
                label="Copie manualmente"
                value={urlCompleta}
                readOnly
                onFocus={(e) => e.currentTarget.select()}
              />
            ) : null}
            <Button
              component={Link}
              href={criada.caminhoEntrada}
              variant="light"
            >
              Acessar minha família
            </Button>
            <Text size="sm">
              <Anchor component={Link} href="/f">
                Voltar às boas-vindas
              </Anchor>
            </Text>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container component="main" size="sm" px="md" py="xl">
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={1}>Criar minha família</Title>
          <Text c="dimmed" size="sm">
            Informe os dados mínimos. O endereço será usado para entrar depois.
          </Text>
          <form onSubmit={aoCadastrar}>
            <Stack gap="sm">
              <TextInput
                label="Nome da família"
                value={nomeFamilia}
                onChange={(e) => setNomeFamilia(e.currentTarget.value)}
                required
                autoComplete="organization"
              />
              <TextInput
                label="Seu nome"
                value={nomeTitular}
                onChange={(e) => setNomeTitular(e.currentTarget.value)}
                required
                autoComplete="name"
              />
              <TextInput
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                autoComplete="username"
              />
              <PasswordInput
                label="Senha"
                value={senha}
                onChange={(e) => setSenha(e.currentTarget.value)}
                required
                autoComplete="new-password"
                description="Mínimo de 8 caracteres"
              />
              <TextInput
                label="Endereço de acesso"
                value={slug}
                onChange={(e) => {
                  setSlugEditado(true);
                  setSlug(e.currentTarget.value);
                }}
                required
                description={`Prévia: ${previaUrl}`}
                autoComplete="off"
              />
              <Button type="submit" loading={carregando} disabled={carregando}>
                Criar família
              </Button>
            </Stack>
          </form>
          <MensagemFeedback erro={erro} />
          <Text size="sm">
            <Anchor component={Link} href="/f">
              Voltar às boas-vindas
            </Anchor>
          </Text>
        </Stack>
      </Card>
    </Container>
  );
}
