"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Anchor,
  Button,
  Card,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { MensagemFeedback } from "@/componentes/feedback";
import { normalizarIdentificadorFamilia } from "@/lib/rotas-familia";

export function BoasVindasFamilia() {
  const router = useRouter();
  const [identificador, setIdentificador] = useState("");
  const [erroAcesso, setErroAcesso] = useState<string | null>(null);

  function aoAcessar(evento: FormEvent) {
    evento.preventDefault();
    setErroAcesso(null);
    const slug = normalizarIdentificadorFamilia(identificador);
    if (!slug) {
      setErroAcesso("Informe o endereço da sua família para continuar.");
      return;
    }
    router.push(`/f/${encodeURIComponent(slug)}/entrar`);
  }

  return (
    <Stack gap="lg">
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={1}>Bem-vindo à nossa família</Title>
          <Text c="dimmed" size="sm">
            Crie o espaço da sua família ou acesse pelo endereço que você já
            recebeu. Não há lista pública de famílias.
          </Text>
          <Button component={Link} href="/f/criar">
            Criar minha família
          </Button>
        </Stack>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={2}>Acessar minha família</Title>
          <Text c="dimmed" size="sm">
            Digite o identificador do endereço (a parte depois de /f/).
          </Text>
          <form onSubmit={aoAcessar}>
            <Stack gap="sm">
              <TextInput
                label="Endereço da família"
                placeholder="ex.: silva"
                value={identificador}
                onChange={(e) => setIdentificador(e.currentTarget.value)}
                autoComplete="off"
              />
              <Button type="submit" variant="light">
                Continuar para entrar
              </Button>
            </Stack>
          </form>
          <MensagemFeedback erro={erroAcesso} />
          <Text size="sm">
            Recebeu um convite? Use o link compartilhado pela família em{" "}
            <Anchor component="span">/f/…/convites/ativar</Anchor>.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
