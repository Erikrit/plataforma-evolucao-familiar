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
  COMBINACOES_ACESSO_CONCEDIVEIS,
  concederAutorizacao,
  criarConvite,
  criarPessoa,
  revogarAutorizacao,
  type AcessoResumo,
} from "@/lib/api";
import { rotuloPapelExperiencia } from "@/lib/rotulos-experiencia";

type AreaConcessao = "Cuidados" | "Desenvolvimento";

function textoAcesso(a: AcessoResumo): string {
  const papel = rotuloPapelExperiencia(a.papel);
  if (a.papel === "Administrador" || !a.pessoaAcompanhadaNome) {
    return `${a.participanteNome} · ${papel} · família (administração)${a.ativo ? "" : " · inativo"}`;
  }
  const area = a.area ?? "—";
  return `${a.participanteNome} · ${area} · ${papel}${a.ativo ? "" : " · inativo"}`;
}

function chaveGrupoAcesso(a: AcessoResumo): string {
  if (a.papel === "Administrador" || !a.pessoaAcompanhadaId) {
    return "__administracao__";
  }
  return a.pessoaAcompanhadaId;
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
  const [areaConvite, setAreaConvite] = useState<AreaConcessao | null>(
    "Cuidados",
  );
  const [responsabilidadeConvite, setResponsabilidadeConvite] = useState<
    string | null
  >("colaboradora_cuidados");

  const [participanteUsuarioId, setParticipanteUsuarioId] = useState<
    string | null
  >(null);
  const [pessoaAlvoConcessaoId, setPessoaAlvoConcessaoId] = useState<
    string | null
  >(null);
  const [areaConcessao, setAreaConcessao] = useState<AreaConcessao | null>(
    "Cuidados",
  );
  const [responsabilidadeConcessao, setResponsabilidadeConcessao] = useState<
    string | null
  >("responsavel_cuidados");
  const [etapaConfirmacao, setEtapaConfirmacao] = useState(false);

  const [abaAtiva, setAbaAtiva] = useState<string | null>("pessoas");
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

  const participantesComConta = useMemo(
    () =>
      pessoasUnicas
        .filter((p) => p.possuiConta && p.usuarioId)
        .map((p) => ({
          value: p.usuarioId!,
          label: p.nome,
          pessoaId: p.pessoaId,
        })),
    [pessoasUnicas],
  );

  const opcoesParticipantes = useMemo(
    () =>
      participantesComConta.map((p) => ({
        value: p.value,
        label: p.label,
      })),
    [participantesComConta],
  );

  const opcoesResponsabilidadeConcessao = useMemo(() => {
    if (!areaConcessao) return [];
    return COMBINACOES_ACESSO_CONCEDIVEIS.filter((c) => c.area === areaConcessao).map(
      (c) => ({
        value: c.responsabilidade,
        label: c.rotulo,
      }),
    );
  }, [areaConcessao]);

  const opcoesResponsabilidadeConvite = useMemo(() => {
    if (!areaConvite) return [];
    return COMBINACOES_ACESSO_CONCEDIVEIS.filter((c) => c.area === areaConvite).map(
      (c) => ({
        value: c.responsabilidade,
        label: c.rotulo,
      }),
    );
  }, [areaConvite]);

  const acessosAgrupados = useMemo(() => {
    const itens = acessos?.itens ?? [];
    const grupos = new Map<
      string,
      { titulo: string; itens: AcessoResumo[] }
    >();
    for (const item of itens) {
      const chave = chaveGrupoAcesso(item);
      const titulo =
        chave === "__administracao__"
          ? "Administração da família"
          : (item.pessoaAcompanhadaNome ?? "Pessoa acompanhada");
      const atual = grupos.get(chave);
      if (atual) {
        atual.itens.push(item);
      } else {
        grupos.set(chave, { titulo, itens: [item] });
      }
    }
    return [...grupos.entries()].sort((a, b) => {
      if (a[0] === "__administracao__") return -1;
      if (b[0] === "__administracao__") return 1;
      return a[1].titulo.localeCompare(b[1].titulo, "pt");
    });
  }, [acessos]);

  const participanteSelecionado = participantesComConta.find(
    (p) => p.value === participanteUsuarioId,
  );
  const pessoaAlvoSelecionada = pessoasUnicas.find(
    (p) => p.pessoaId === pessoaAlvoConcessaoId,
  );
  const combinacaoSelecionada = COMBINACOES_ACESSO_CONCEDIVEIS.find(
    (c) => c.responsabilidade === responsabilidadeConcessao,
  );

  useEffect(() => {
    if (!pessoaAlvoConviteId && pessoasUnicas.length > 0) {
      const preferida =
        pessoasUnicas.find((p) => /vovó|vovo/i.test(p.nome)) ?? pessoasUnicas[0];
      setPessoaAlvoConviteId(preferida.pessoaId);
    }
    if (!pessoaAlvoConcessaoId && pessoasUnicas.length > 0) {
      const preferida =
        pessoasUnicas.find((p) => /vovó|vovo/i.test(p.nome)) ?? pessoasUnicas[0];
      setPessoaAlvoConcessaoId(preferida.pessoaId);
    }
  }, [pessoasUnicas, pessoaAlvoConviteId, pessoaAlvoConcessaoId]);

  useEffect(() => {
    if (
      areaConcessao &&
      !opcoesResponsabilidadeConcessao.some(
        (o) => o.value === responsabilidadeConcessao,
      )
    ) {
      setResponsabilidadeConcessao(
        opcoesResponsabilidadeConcessao[0]?.value ?? null,
      );
      setEtapaConfirmacao(false);
    }
  }, [areaConcessao, opcoesResponsabilidadeConcessao, responsabilidadeConcessao]);

  useEffect(() => {
    if (
      areaConvite &&
      !opcoesResponsabilidadeConvite.some(
        (o) => o.value === responsabilidadeConvite,
      )
    ) {
      setResponsabilidadeConvite(
        opcoesResponsabilidadeConvite[0]?.value ?? null,
      );
    }
  }, [areaConvite, opcoesResponsabilidadeConvite, responsabilidadeConvite]);

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

  async function aoConvidar() {
    if (!usuario || !pessoaAlvoConviteId || !responsabilidadeConvite) {
      setErro("Escolha a pessoa acompanhada, a área e a responsabilidade.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const alvo = pessoasUnicas.find((p) => p.pessoaId === pessoaAlvoConviteId);
      const combinacao = COMBINACOES_ACESSO_CONCEDIVEIS.find(
        (c) => c.responsabilidade === responsabilidadeConvite,
      );
      const convite = await criarConvite(usuario.pessoa.familiaId, {
        email: emailConvite,
        nomeConvidado: "Participante convidado",
        responsabilidade: responsabilidadeConvite,
        pessoaAlvoId: pessoaAlvoConviteId,
      });
      const caminho = `/convites/ativar?token=${encodeURIComponent(convite.token)}`;
      setLinkAtivacao(caminho);
      setSucesso(
        `Convite pronto (${combinacao?.area ?? ""} · ${combinacao?.rotulo ?? ""}) para acompanhar ${alvo?.nome ?? "a pessoa escolhida"}.`,
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível gerar o convite");
    } finally {
      setCarregando(false);
    }
  }

  async function aoConfirmarConcessao() {
    if (
      !usuario ||
      !participanteUsuarioId ||
      !pessoaAlvoConcessaoId ||
      !responsabilidadeConcessao
    ) {
      setErro("Revise participante, pessoa acompanhada, área e responsabilidade.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await concederAutorizacao(usuario.pessoa.familiaId, {
        usuarioId: participanteUsuarioId,
        responsabilidade: responsabilidadeConcessao,
        pessoaAlvoId: pessoaAlvoConcessaoId,
      });
      await recarregarInicio();
      setEtapaConfirmacao(false);
      setSucesso(
        `Acesso concedido: ${participanteSelecionado?.label ?? "participante"} · ${combinacaoSelecionada?.area ?? ""} · ${combinacaoSelecionada?.rotulo ?? ""} · ${pessoaAlvoSelecionada?.nome ?? ""}.`,
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível conceder o acesso");
    } finally {
      setCarregando(false);
    }
  }

  async function aoRevogarAcesso(autorizacaoId: string, resumo: string) {
    if (!usuario) return;
    const ok = window.confirm(
      `Retirar este acesso?\n\n${resumo}\n\nNovas operações desse participante ficam bloqueadas. O histórico permanece.`,
    );
    if (!ok) return;
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

      <Tabs value={abaAtiva} onChange={setAbaAtiva} keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="pessoas">Pessoas</Tabs.Tab>
          <Tabs.Tab value="acessos">Acessos</Tabs.Tab>
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
                      <Text size="sm">
                        {p.nome}
                        {p.possuiConta ? " · com conta" : " · sem conta"}
                      </Text>
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
              <Title order={2}>Quem acompanha cada pessoa</Title>
              <Text size="sm" c="dimmed">
                Agrupado por pessoa acompanhada: participante, área e
                responsabilidade (Administrador, Responsável ou Integrante).
              </Text>
              {!acessos || acessos.itens.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Ainda não há acessos ativos listados.
                </Text>
              ) : (
                <Stack gap="md">
                  {acessosAgrupados.map(([chave, grupo]) => (
                    <Stack key={chave} gap="xs">
                      <Title order={3}>{grupo.titulo}</Title>
                      <Stack
                        gap="xs"
                        component="ul"
                        style={{ listStyle: "none", margin: 0, padding: 0 }}
                      >
                        {grupo.itens.map((a) => (
                          <Group
                            key={a.id}
                            component="li"
                            justify="space-between"
                            align="flex-start"
                            wrap="nowrap"
                            gap="sm"
                          >
                            <Text size="sm">{textoAcesso(a)}</Text>
                            <Button
                              size="compact-sm"
                              variant="subtle"
                              color="red"
                              loading={carregando}
                              onClick={() =>
                                void aoRevogarAcesso(a.id, textoAcesso(a))
                              }
                            >
                              Retirar
                            </Button>
                          </Group>
                        ))}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>

            <Stack gap="sm">
              <Title order={3}>Conceder acesso</Title>
              <Text size="sm" c="dimmed">
                Selecione um participante com conta. Sem conta, use a aba
                Convites com a mesma combinação.
              </Text>
              {participantesComConta.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Ninguém com conta disponível para concessão direta.{" "}
                  <Anchor
                    component="button"
                    type="button"
                    onClick={() => setAbaAtiva("convites")}
                  >
                    Ir para convite
                  </Anchor>
                </Text>
              ) : !etapaConfirmacao ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (
                      !participanteUsuarioId ||
                      !pessoaAlvoConcessaoId ||
                      !areaConcessao ||
                      !responsabilidadeConcessao
                    ) {
                      setErro(
                        "Preencha participante, pessoa acompanhada, área e responsabilidade.",
                      );
                      return;
                    }
                    setErro(null);
                    setEtapaConfirmacao(true);
                  }}
                >
                  <Stack gap="sm">
                    <Select
                      label="Participante (com conta)"
                      description="Quem receberá o acesso."
                      data={opcoesParticipantes}
                      value={participanteUsuarioId}
                      onChange={(v) => {
                        setParticipanteUsuarioId(v);
                        setEtapaConfirmacao(false);
                      }}
                      searchable
                      required
                    />
                    <Select
                      label="Pessoa acompanhada"
                      data={opcoesPessoas}
                      value={pessoaAlvoConcessaoId}
                      onChange={(v) => {
                        setPessoaAlvoConcessaoId(v);
                        setEtapaConfirmacao(false);
                      }}
                      searchable
                      required
                    />
                    <Select
                      label="Área"
                      data={[
                        { value: "Cuidados", label: "Cuidados" },
                        { value: "Desenvolvimento", label: "Desenvolvimento" },
                      ]}
                      value={areaConcessao}
                      onChange={(v) => {
                        setAreaConcessao((v as AreaConcessao | null) ?? null);
                        setEtapaConfirmacao(false);
                      }}
                      required
                    />
                    <Select
                      label="Responsabilidade"
                      data={opcoesResponsabilidadeConcessao}
                      value={responsabilidadeConcessao}
                      onChange={(v) => {
                        setResponsabilidadeConcessao(v);
                        setEtapaConfirmacao(false);
                      }}
                      required
                    />
                    <Button
                      type="submit"
                      variant="light"
                      disabled={
                        !participanteUsuarioId ||
                        !pessoaAlvoConcessaoId ||
                        !responsabilidadeConcessao
                      }
                    >
                      Revisar
                    </Button>
                  </Stack>
                </form>
              ) : (
                <Stack gap="sm">
                  <Text size="sm">
                    Confirme:{" "}
                    <Text span fw={600}>
                      {participanteSelecionado?.label}
                    </Text>{" "}
                    · {combinacaoSelecionada?.area} ·{" "}
                    {combinacaoSelecionada?.rotulo} · acompanha{" "}
                    <Text span fw={600}>
                      {pessoaAlvoSelecionada?.nome}
                    </Text>
                    .
                  </Text>
                  <Group gap="sm">
                    <Button
                      variant="default"
                      onClick={() => setEtapaConfirmacao(false)}
                      disabled={carregando}
                    >
                      Voltar
                    </Button>
                    <Button
                      loading={carregando}
                      onClick={() => void aoConfirmarConcessao()}
                    >
                      Confirmar concessão
                    </Button>
                  </Group>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="convites" pt="md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void aoConvidar();
            }}
          >
            <Stack gap="sm">
              <Title order={2}>Convidar participante</Title>
              <Text size="sm" c="dimmed">
                Para quem ainda não tem conta. Mesmas combinações da concessão
                direta (sem Administrador).
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
                label="Pessoa acompanhada"
                data={opcoesPessoas}
                value={pessoaAlvoConviteId}
                onChange={setPessoaAlvoConviteId}
                required
                searchable
              />
              <Select
                label="Área"
                data={[
                  { value: "Cuidados", label: "Cuidados" },
                  { value: "Desenvolvimento", label: "Desenvolvimento" },
                ]}
                value={areaConvite}
                onChange={(v) => setAreaConvite((v as AreaConcessao | null) ?? null)}
                required
              />
              <Select
                label="Responsabilidade"
                data={opcoesResponsabilidadeConvite}
                value={responsabilidadeConvite}
                onChange={setResponsabilidadeConvite}
                required
              />
              <Button
                type="submit"
                loading={carregando}
                disabled={
                  !pessoaAlvoConviteId ||
                  !areaConvite ||
                  !responsabilidadeConvite
                }
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
