"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  Anchor,
  Button,
  Card,
  Group,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  concederAutorizacao,
  criarConvite,
  criarPessoa,
  entrar,
  limparSessaoLegada,
  obterInicio,
  obterMe,
  revogarAutorizacao,
  sair,
  type AcessoResumo,
  type AcessosResposta,
  type CartaoInicio,
  type DestaqueInicio,
  type UsuarioSessao,
} from "@/lib/api";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";

function textoAcesso(a: AcessoResumo): string {
  const alvo = a.pessoaAcompanhadaNome
    ? a.pessoaAcompanhadaNome
    : "família (administração)";
  return `${a.participanteNome} · ${a.papel} · acompanha ${alvo}${a.ativo ? "" : " · inativo"}`;
}

export function PainelFundacao() {
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [pronto, setPronto] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [cartoes, setCartoes] = useState<CartaoInicio[]>([]);
  const [destaques, setDestaques] = useState<DestaqueInicio[]>([]);
  const [acessos, setAcessos] = useState<AcessosResposta | null>(null);
  const [filtrado, setFiltrado] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [pessoaAlvoConviteId, setPessoaAlvoConviteId] = useState<string | null>(
    null,
  );
  const [pessoaAlvoDesenvId, setPessoaAlvoDesenvId] = useState<string | null>(
    null,
  );
  const [linkAtivacao, setLinkAtivacao] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const pessoasUnicas = useMemo(() => {
    const mapa = new Map<string, CartaoInicio>();
    for (const c of cartoes) mapa.set(c.pessoaId, c);
    return [...mapa.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
  }, [cartoes]);

  const opcoesPessoas = useMemo(
    () =>
      pessoasUnicas.map((p) => ({
        value: p.pessoaId,
        label: p.nome,
      })),
    [pessoasUnicas],
  );

  const podeAdministrar = Boolean(usuario) && !filtrado;

  useEffect(() => {
    limparSessaoLegada();
    void (async () => {
      try {
        const me = await obterMe();
        if (me) {
          setUsuario(me);
          await carregarInicio(me);
        }
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível verificar a sessão");
      } finally {
        setPronto(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!pessoaAlvoConviteId && pessoasUnicas.length > 0) {
      const preferida =
        pessoasUnicas.find((p) => /vovó|vovo/i.test(p.nome)) ?? pessoasUnicas[0];
      setPessoaAlvoConviteId(preferida.pessoaId);
    }
    if (!pessoaAlvoDesenvId && pessoasUnicas.length > 0) {
      const preferida =
        pessoasUnicas.find((p) => /laurinha/i.test(p.nome)) ?? pessoasUnicas[0];
      setPessoaAlvoDesenvId(preferida.pessoaId);
    }
  }, [pessoasUnicas, pessoaAlvoConviteId, pessoaAlvoDesenvId]);

  async function carregarInicio(atual: UsuarioSessao) {
    const inicio = await obterInicio(atual.pessoa.familiaId);
    setCartoes(inicio.cartoes);
    setDestaques(inicio.destaques ?? []);
    setAcessos(
      inicio.acessos ?? {
        modo: "proprios_dados",
        somenteLeitura: true,
        itens: [],
      },
    );
    setFiltrado(inicio.filtradoPorAutorizacao);
  }

  async function aoRevogarAcesso(autorizacaoId: string) {
    if (!usuario) return;
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await revogarAutorizacao(usuario.pessoa.familiaId, autorizacaoId);
      await carregarInicio(usuario);
      setSucesso("Acesso retirado. Novas operações desse participante ficam bloqueadas.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível revogar o acesso");
    } finally {
      setCarregando(false);
    }
  }

  async function aoEntrar(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const nova = await entrar(email, senha);
      setUsuario(nova.usuario);
      await carregarInicio(nova.usuario);
      setSucesso("Você entrou.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível entrar");
    } finally {
      setCarregando(false);
    }
  }

  async function aoCadastrar(evento: FormEvent) {
    evento.preventDefault();
    if (!usuario) return;
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const criada = await criarPessoa(usuario.pessoa.familiaId, nome);
      setNome("");
      await carregarInicio(usuario);
      setSucesso(`${criada.nome} foi adicionada à família.`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  async function aoConvidarColaboradora() {
    if (!usuario || !pessoaAlvoConviteId) {
      setErro("Escolha a pessoa que a colaboradora vai acompanhar.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const alvo = pessoasUnicas.find((p) => p.pessoaId === pessoaAlvoConviteId);
      const convite = await criarConvite(usuario.pessoa.familiaId, {
        email: emailConvite,
        nomeConvidado: "Colaboradora Convidada",
        responsabilidade: "colaboradora_cuidados",
        pessoaAlvoId: pessoaAlvoConviteId,
      });
      const caminho = `/convites/ativar?token=${encodeURIComponent(convite.token)}`;
      setLinkAtivacao(caminho);
      setSucesso(
        `Convite pronto para ${alvo?.nome ?? "a pessoa escolhida"}. Abra o link de ativação quando a pessoa for criar a conta.`,
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível gerar o convite");
    } finally {
      setCarregando(false);
    }
  }

  async function aoAcumularDesenvolvimento() {
    if (!usuario || !pessoaAlvoDesenvId) {
      setErro("Escolha a pessoa para acompanhamento de desenvolvimento.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await concederAutorizacao(usuario.pessoa.familiaId, {
        usuarioId: usuario.id,
        responsabilidade: "responsavel_desenvolvimento",
        pessoaAlvoId: pessoaAlvoDesenvId,
      });
      await carregarInicio(usuario);
      setSucesso("Acesso de desenvolvimento concedido.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível conceder o acesso");
    } finally {
      setCarregando(false);
    }
  }

  async function aoSair() {
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await sair();
    } catch {
      /* limpeza local mesmo se a API falhar */
    } finally {
      setUsuario(null);
      setCartoes([]);
      setDestaques([]);
      setAcessos(null);
      setLinkAtivacao(null);
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
          <MensagemFeedback erro={erro} sucesso={sucesso} />
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center" wrap="wrap">
        <Text>
          Olá, <Text span fw={600}>{usuario.pessoa.nome}</Text>
        </Text>
        <Button
          variant="default"
          onClick={() => void aoSair()}
          loading={carregando}
        >
          Sair
        </Button>
      </Group>

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
          {filtrado
            ? "Mostramos apenas quem você pode acompanhar."
            : "Toque em uma pessoa para ver o perfil e as áreas disponíveis."}
        </Text>

        {cartoes.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma pessoa por aqui ainda"
            descricao={
              podeAdministrar
                ? "Abra Gerenciar família para adicionar a primeira pessoa."
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

      {podeAdministrar ? (
        <Accordion variant="contained" radius="md">
          <Accordion.Item value="gerenciar">
            <Accordion.Control>
              <Text fw={600}>Gerenciar família</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="lg">
                <form onSubmit={aoCadastrar}>
                  <Stack gap="sm">
                    <Title order={3}>Adicionar pessoa</Title>
                    <Text size="sm" c="dimmed">
                      Só o nome é necessário agora.
                    </Text>
                    <TextInput
                      label="Nome"
                      value={nome}
                      onChange={(e) => setNome(e.currentTarget.value)}
                      placeholder="Ex.: Vovó"
                      required
                      autoComplete="off"
                    />
                    <Button
                      type="submit"
                      loading={carregando}
                      disabled={!nome.trim()}
                    >
                      Salvar
                    </Button>
                  </Stack>
                </form>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void aoConvidarColaboradora();
                  }}
                >
                  <Stack gap="sm">
                    <Title order={3}>Convidar colaboradora</Title>
                    <Text size="sm" c="dimmed">
                      A pessoa receberá acesso só aos cuidados autorizados.
                    </Text>
                    <TextInput
                      label="E-mail"
                      value={emailConvite}
                      onChange={(e) => setEmailConvite(e.currentTarget.value)}
                      type="email"
                      required
                      placeholder="email@exemplo.com"
                    />
                    <Select
                      label="Quem ela vai acompanhar"
                      data={opcoesPessoas}
                      value={pessoaAlvoConviteId}
                      onChange={setPessoaAlvoConviteId}
                      required
                      searchable
                    />
                    <Button
                      type="submit"
                      loading={carregando}
                      disabled={!pessoaAlvoConviteId}
                    >
                      Gerar convite
                    </Button>
                    {linkAtivacao ? (
                      <Text size="sm">
                        Link de ativação:{" "}
                        <Anchor component={Link} href={linkAtivacao}>
                          abrir página de ativação
                        </Anchor>
                      </Text>
                    ) : null}
                  </Stack>
                </form>

                <Stack gap="sm">
                  <Title order={3}>Acessos desta família</Title>
                  <Text size="sm" c="dimmed">
                    Quem acompanha quem, com papel simples. Sem matriz de permissões.
                  </Text>
                  {!acessos || acessos.itens.length === 0 ? (
                    <Text size="sm" c="dimmed">
                      Ainda não há acessos ativos listados.
                    </Text>
                  ) : (
                    <Stack gap="xs" component="ul" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {acessos.itens.map((a) => (
                        <Group
                          key={a.id}
                          component="li"
                          justify="space-between"
                          align="flex-start"
                          wrap="nowrap"
                          gap="sm"
                        >
                          <Text size="sm">{textoAcesso(a)}</Text>
                          {a.papel !== "Administrador" ? (
                            <Button
                              size="compact-sm"
                              variant="subtle"
                              color="red"
                              loading={carregando}
                              onClick={() => void aoRevogarAcesso(a.id)}
                            >
                              Retirar
                            </Button>
                          ) : null}
                        </Group>
                      ))}
                    </Stack>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void aoAcumularDesenvolvimento();
                    }}
                  >
                    <Stack gap="sm">
                      <Select
                        label="Conceder acesso de desenvolvimento"
                        description="Você passa a acompanhar também o desenvolvimento desta pessoa."
                        data={opcoesPessoas}
                        value={pessoaAlvoDesenvId}
                        onChange={setPessoaAlvoDesenvId}
                        searchable
                      />
                      <Button
                        type="submit"
                        variant="light"
                        loading={carregando}
                        disabled={!pessoaAlvoDesenvId}
                      >
                        Conceder acesso
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ) : null}

      <MensagemFeedback erro={erro} sucesso={sucesso} />
    </Stack>
  );
}
