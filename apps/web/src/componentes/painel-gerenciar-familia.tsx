"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Anchor,
  Button,
  Group,
  Select,
  Stack,
  Tabs,
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
import {
  concederAutorizacao,
  criarConvite,
  criarPessoa,
  revogarAutorizacao,
  type AcessoResumo,
} from "@/lib/api";
import { rotuloPapelExperiencia } from "@/lib/rotulos-experiencia";

function textoAcesso(a: AcessoResumo): string {
  const alvo = a.pessoaAcompanhadaNome
    ? a.pessoaAcompanhadaNome
    : "família (administração)";
  const papel = rotuloPapelExperiencia(a.papel);
  return `${a.participanteNome} · ${papel} · acompanha ${alvo}${a.ativo ? "" : " · inativo"}`;
}

export function PainelGerenciarFamilia() {
  const {
    pronto,
    usuario,
    cartoes,
    acessos,
    podeGerenciarFamilia,
    recarregarInicio,
  } = useSessao();
  const [nome, setNome] = useState("");
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
    const mapa = new Map(cartoes.map((c) => [c.pessoaId, c]));
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

  async function aoCadastrar(evento: FormEvent) {
    evento.preventDefault();
    if (!usuario) return;
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const criada = await criarPessoa(usuario.pessoa.familiaId, nome);
      setNome("");
      await recarregarInicio();
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
      await recarregarInicio();
      setSucesso("Acesso de desenvolvimento concedido.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível conceder o acesso");
    } finally {
      setCarregando(false);
    }
  }

  async function aoRevogarAcesso(autorizacaoId: string) {
    if (!usuario) return;
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await revogarAutorizacao(usuario.pessoa.familiaId, autorizacaoId);
      await recarregarInicio();
      setSucesso(
        "Acesso retirado. Novas operações desse participante ficam bloqueadas.",
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível revogar o acesso");
    } finally {
      setCarregando(false);
    }
  }

  if (!pronto) {
    return <EstadoCarregando rotulo="Carregando…" />;
  }

  if (!usuario) {
    return (
      <Stack gap="md">
        <Text>Entre na página inicial para gerenciar a família.</Text>
        <Button component={Link} href="/" variant="light">
          Ir para entrar
        </Button>
      </Stack>
    );
  }

  if (!podeGerenciarFamilia) {
    return (
      <EstadoVazio
        titulo="Área restrita"
        descricao="Somente quem administra a família pode abrir esta área. O acompanhamento cotidiano continua nas pessoas autorizadas."
      />
    );
  }

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={1}>Gerenciar família</Title>
        <Text c="dimmed" size="sm">
          Pessoas, acessos e convites em um só lugar — sem misturar com o
          acompanhamento do dia a dia.
        </Text>
      </Stack>

      <MensagemFeedback erro={erro} sucesso={sucesso} />

      <Tabs defaultValue="pessoas" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="pessoas">Pessoas</Tabs.Tab>
          <Tabs.Tab value="acessos">Acessos e permissões</Tabs.Tab>
          <Tabs.Tab value="convites">Convites</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pessoas" pt="md">
          <Stack gap="lg">
            <form onSubmit={aoCadastrar}>
              <Stack gap="sm">
                <Title order={2}>Adicionar pessoa</Title>
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

            <Stack gap="sm">
              <Title order={2}>Pessoas da família</Title>
              {pessoasUnicas.length === 0 ? (
                <EstadoVazio
                  titulo="Nenhuma pessoa cadastrada"
                  descricao="Adicione a primeira pessoa pelo formulário acima."
                />
              ) : (
                <Stack gap={6} component="ul" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {pessoasUnicas.map((p) => (
                    <Group key={p.pessoaId} component="li" justify="space-between">
                      <Text size="sm">{p.nome}</Text>
                      <Anchor component={Link} href={`/pessoas/${p.pessoaId}`} size="sm">
                        Abrir perfil
                      </Anchor>
                    </Group>
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="acessos" pt="md">
          <Stack gap="lg">
            <Stack gap="sm">
              <Title order={2}>Acessos desta família</Title>
              <Text size="sm" c="dimmed">
                Papéis do MVP: Administrador, Responsável e Integrante. Sem
                matriz de permissões nem dados sensíveis.
              </Text>
              {!acessos || acessos.itens.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Ainda não há acessos ativos listados.
                </Text>
              ) : (
                <Stack
                  gap="xs"
                  component="ul"
                  style={{ listStyle: "none", margin: 0, padding: 0 }}
                >
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
            </Stack>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void aoAcumularDesenvolvimento();
              }}
            >
              <Stack gap="sm">
                <Title order={3}>Conceder acesso de desenvolvimento</Title>
                <Select
                  label="Pessoa acompanhada"
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
        </Tabs.Panel>

        <Tabs.Panel value="convites" pt="md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void aoConvidarColaboradora();
            }}
          >
            <Stack gap="sm">
              <Title order={2}>Convidar colaboradora</Title>
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
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
