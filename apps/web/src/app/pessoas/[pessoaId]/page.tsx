"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  Anchor,
  Button,
  Card,
  Container,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  atualizarPessoa,
  obterMe,
  obterPessoa,
  type UsuarioSessao,
} from "@/lib/api";
import {
  EstadoCarregando,
  EstadoVazio,
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
  const [vinculo, setVinculo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

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
        setVinculo(dados.vinculo ?? "");
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível carregar o perfil");
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId]);

  async function aoSalvar(evento: FormEvent) {
    evento.preventDefault();
    if (!usuario || !perfil) return;
    setSalvando(true);
    setErro(null);
    setSucesso(null);
    try {
      const dados = (await atualizarPessoa(
        usuario.pessoa.familiaId,
        perfil.id,
        { vinculo },
      )) as Perfil;
      setPerfil(dados);
      setVinculo(dados.vinculo ?? "");
      setSucesso("Informações atualizadas.");
    } catch {
      setErro("Não foi possível salvar. Tente de novo.");
    } finally {
      setSalvando(false);
    }
  }

  const semSessao = !carregando && !usuario;

  return (
    <Container component="main" size="sm" py="lg" px="md">
      <Stack gap="lg">
        <Anchor component={Link} href="/" size="sm">
          ← Nossa família
        </Anchor>

        {carregando ? <EstadoCarregando rotulo="Carregando perfil…" /> : null}

        <MensagemFeedback erro={erro} sucesso={sucesso} />

        {semSessao ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {perfil && usuario ? (
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={1}>{perfil.nome}</Title>
              <Text c="dimmed" size="sm">
                {perfil.possuiConta
                  ? "Tem conta na plataforma"
                  : "Ainda sem conta — pode ser acompanhada pela família"}
              </Text>
              {perfil.vinculo ? (
                <Text size="sm">Vínculo: {perfil.vinculo}</Text>
              ) : null}
            </Stack>

            <Stack gap="sm">
              <Title order={2}>Áreas disponíveis</Title>
              {perfil.areas.length === 0 ? (
                <EstadoVazio
                  titulo="Nenhuma área liberada"
                  descricao="Quando houver autorização, as opções aparecem aqui."
                />
              ) : (
                <Stack gap="sm">
                  {perfil.areas.map((area) => {
                    const disponivel =
                      area.disponivel &&
                      (area.id === "cuidados" ||
                        area.id === "historico" ||
                        area.id === "desenvolvimento" ||
                        area.id === "resumo");
                    const href =
                      area.id === "cuidados"
                        ? `/pessoas/${perfil.id}/cuidados`
                        : area.id === "historico"
                          ? `/pessoas/${perfil.id}/historico`
                          : area.id === "desenvolvimento"
                            ? `/pessoas/${perfil.id}/desenvolvimento`
                            : area.id === "resumo"
                              ? `/pessoas/${perfil.id}/resumo`
                              : null;

                    if (disponivel && href) {
                      return (
                        <Card
                          key={area.id}
                          component={Link}
                          href={href}
                          withBorder
                          padding="md"
                          radius="md"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Text fw={600}>{area.rotulo}</Text>
                          <Text size="sm" c="azul">
                            Abrir
                          </Text>
                        </Card>
                      );
                    }

                    return (
                      <Card key={area.id} withBorder padding="md" radius="md">
                        <Text fw={600}>{area.rotulo}</Text>
                        <Text size="sm" c="dimmed">
                          {area.disponivel
                            ? "Em breve nesta versão"
                            : "Sem acesso no momento — peça autorização a quem administra a família"}
                        </Text>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Stack>

            <Accordion variant="contained" radius="md">
              <Accordion.Item value="dados">
                <Accordion.Control>
                  <Text fw={600}>Editar vínculo e dados</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <form onSubmit={aoSalvar}>
                    <Stack gap="sm">
                      <Text size="sm" c="dimmed">
                        Opcional. Não impede o uso das áreas autorizadas.
                      </Text>
                      <TextInput
                        label="Vínculo familiar"
                        description="Ex.: mãe, filha, neta"
                        value={vinculo}
                        onChange={(e) => setVinculo(e.currentTarget.value)}
                      />
                      <Button type="submit" loading={salvando}>
                        Salvar
                      </Button>
                    </Stack>
                  </form>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
