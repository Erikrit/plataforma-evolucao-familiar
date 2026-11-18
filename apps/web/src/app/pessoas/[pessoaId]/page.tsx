"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { obterMe, obterPessoa, type UsuarioSessao } from "@/lib/api";
import {
  EstadoCarregando,
  MensagemFeedback,
} from "@/componentes/feedback";

type Perfil = {
  id: string;
  nome: string;
  vinculo: string | null;
  dataNascimento: string | null;
  possuiConta: boolean;
  areas: { id: string; rotulo: string; disponivel: boolean }[];
};

export default function PaginaPerfil() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    void (async () => {
      setCarregando(true);
      setErro(null);
      try {
        const me = await obterMe();
        if (!me) {
          setErro("Entre na página inicial para ver este perfil.");
          setCarregando(false);
          return;
        }
        setUsuario(me);
        const dados = (await obterPessoa(
          me.pessoa.familiaId,
          params.pessoaId,
        )) as Perfil;
        setPerfil(dados);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível carregar o perfil");
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId]);

  const semSessao = !carregando && !usuario;

  return (
    <Container component="main" size="sm" px={0}>
      <Stack gap="lg">
        {carregando ? <EstadoCarregando rotulo="Carregando perfil…" /> : null}

        <MensagemFeedback erro={erro} />

        {semSessao ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {perfil && usuario ? (
          <Stack gap={4}>
            <Title order={1}>{perfil.nome}</Title>
            {perfil.vinculo ? (
              <Text size="sm" c="dimmed">
                Vínculo: {perfil.vinculo}
              </Text>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
