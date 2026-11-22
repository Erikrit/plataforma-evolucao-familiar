"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Radio,
  SegmentedControl,
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
  TEXTO_ADMINISTRACAO_FAMILIA,
  concederAutorizacao,
  criarConvite,
  criarPessoa,
  resumoAcoesCombinacao,
  revogarAutorizacao,
  textoRevisaoAcesso,
  type AcessoResumo,
  type CombinacaoAcessoConcedivel,
} from "@/lib/api";
import { rotaFamilia } from "@/lib/rotas-familia";
import { rotuloPapelExperiencia } from "@/lib/rotulos-experiencia";

type AreaConcessao = CombinacaoAcessoConcedivel["area"];
type VisaoConsulta = "pessoa" | "participante";

function ehAcessoAdministracao(a: AcessoResumo): boolean {
  return a.papel === "Administrador" || a.area == null;
}

function textoLinhaPorPessoa(a: AcessoResumo): string {
  const papel = rotuloPapelExperiencia(a.papel);
  if (ehAcessoAdministracao(a)) {
    return `${a.participanteNome} · ${papel}${a.ativo ? "" : " · inativo"}`;
  }
  const area = a.area ?? "—";
  return `${a.participanteNome} · ${area} · ${papel}${a.ativo ? "" : " · inativo"}`;
}

function textoLinhaPorParticipante(a: AcessoResumo): string {
  const papel = rotuloPapelExperiencia(a.papel);
  if (ehAcessoAdministracao(a)) {
    return `${papel}${a.ativo ? "" : " · inativo"}`;
  }
  const area = a.area ?? "—";
  const sufixo = a.ativo ? "" : " · inativo";
  if (!a.pessoaAcompanhadaNome?.trim() && a.pessoaAcompanhadaId) {
    return `${area} · ${papel} · nome da pessoa indisponível${sufixo}`;
  }
  return `${area} · ${papel}${sufixo}`;
}

function textoConfirmacaoRevoga(a: AcessoResumo): string {
  const papel = rotuloPapelExperiencia(a.papel);
  if (ehAcessoAdministracao(a)) {
    return `Participante: ${a.participanteNome}\nEscopo: Administração da família (${papel})`;
  }
  const pessoa =
    a.pessoaAcompanhadaNome?.trim() ||
    (a.pessoaAcompanhadaId ? "nome indisponível" : "—");
  return [
    `Participante: ${a.participanteNome}`,
    `Pessoa acompanhada: ${pessoa}`,
    `Área: ${a.area ?? "—"}`,
    `Responsabilidade: ${papel}`,
  ].join("\n");
}

function chaveGrupoPorPessoa(a: AcessoResumo): string {
  if (ehAcessoAdministracao(a)) return "__administracao__";
  return a.pessoaAcompanhadaId ?? "__sem_pessoa__";
}

function chaveParticipante(a: AcessoResumo): string {
  return a.participanteUsuarioId ?? a.participantePessoaId;
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
  const [precisaEntrar, setPrecisaEntrar] = useState(false);
  const [emailContaNova, setEmailContaNova] = useState("");
  const [pessoaHabilitarId, setPessoaHabilitarId] = useState<string | null>(
    null,
  );
  const [emailHabilitar, setEmailHabilitar] = useState("");
  const [emailConvite, setEmailConvite] = useState("");
  const [pessoaAlvoConviteId, setPessoaAlvoConviteId] = useState<string | null>(
    null,
  );
  const [areaConvite, setAreaConvite] = useState<AreaConcessao | null>(
    "Cuidados",
  );
  const [responsabilidadeConvite, setResponsabilidadeConvite] = useState<
    string | null
  >(null);
  const [etapaConfirmacaoConvite, setEtapaConfirmacaoConvite] = useState(false);

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
  >(null);
  const [etapaConfirmacao, setEtapaConfirmacao] = useState(false);

  const [visaoConsulta, setVisaoConsulta] = useState<VisaoConsulta>("pessoa");
  const [participanteConsultaId, setParticipanteConsultaId] = useState<
    string | null
  >(null);

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

  const combinacoesAreaConcessao = useMemo(() => {
    if (!areaConcessao) return [];
    return COMBINACOES_ACESSO_CONCEDIVEIS.filter((c) => c.area === areaConcessao);
  }, [areaConcessao]);

  const combinacoesAreaConvite = useMemo(() => {
    if (!areaConvite) return [];
    return COMBINACOES_ACESSO_CONCEDIVEIS.filter((c) => c.area === areaConvite);
  }, [areaConvite]);

  const itensAcesso = acessos?.itens ?? [];

  const blocoAdministracao = useMemo(
    () => itensAcesso.filter((a) => ehAcessoAdministracao(a)),
    [itensAcesso],
  );

  const acessosContextuais = useMemo(
    () => itensAcesso.filter((a) => !ehAcessoAdministracao(a)),
    [itensAcesso],
  );

  const gruposPorPessoa = useMemo(() => {
    const grupos = new Map<
      string,
      { titulo: string; itens: AcessoResumo[] }
    >();
    for (const item of acessosContextuais) {
      const chave = chaveGrupoPorPessoa(item);
      const titulo =
        item.pessoaAcompanhadaNome?.trim() ||
        (item.pessoaAcompanhadaId
          ? "Pessoa acompanhada (nome indisponível)"
          : "Pessoa acompanhada");
      const atual = grupos.get(chave);
      if (atual) {
        atual.itens.push(item);
      } else {
        grupos.set(chave, { titulo, itens: [item] });
      }
    }
    return [...grupos.entries()].sort((a, b) =>
      a[1].titulo.localeCompare(b[1].titulo, "pt"),
    );
  }, [acessosContextuais]);

  const opcoesConsultaParticipante = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const a of itensAcesso) {
      const id = chaveParticipante(a);
      if (!mapa.has(id)) mapa.set(id, a.participanteNome);
    }
    const lista = [...mapa.entries()].map(([value, label]) => ({
      value,
      label,
    }));
    const contagem = new Map<string, number>();
    for (const o of lista) {
      contagem.set(o.label, (contagem.get(o.label) ?? 0) + 1);
    }
    return lista
      .map((o) =>
        (contagem.get(o.label) ?? 0) > 1
          ? {
              ...o,
              label: `${o.label} · conta ${o.value.slice(0, 8)}`,
            }
          : o,
      )
      .sort((a, b) => a.label.localeCompare(b.label, "pt"));
  }, [itensAcesso]);

  const acessosDoParticipanteConsulta = useMemo(() => {
    if (!participanteConsultaId) return [];
    return itensAcesso.filter(
      (a) => chaveParticipante(a) === participanteConsultaId,
    );
  }, [itensAcesso, participanteConsultaId]);

  const adminDoParticipanteConsulta = useMemo(
    () => acessosDoParticipanteConsulta.filter((a) => ehAcessoAdministracao(a)),
    [acessosDoParticipanteConsulta],
  );

  const contextuaisDoParticipanteConsulta = useMemo(() => {
    const itens = acessosDoParticipanteConsulta.filter(
      (a) => !ehAcessoAdministracao(a),
    );
    const grupos = new Map<
      string,
      { titulo: string; itens: AcessoResumo[] }
    >();
    for (const item of itens) {
      const chave = item.pessoaAcompanhadaId ?? "__sem_pessoa__";
      const titulo =
        item.pessoaAcompanhadaNome?.trim() ||
        (item.pessoaAcompanhadaId
          ? "Pessoa acompanhada (nome indisponível)"
          : "Pessoa acompanhada");
      const atual = grupos.get(chave);
      if (atual) atual.itens.push(item);
      else grupos.set(chave, { titulo, itens: [item] });
    }
    return [...grupos.entries()].sort((a, b) =>
      a[1].titulo.localeCompare(b[1].titulo, "pt"),
    );
  }, [acessosDoParticipanteConsulta]);

  const participanteSelecionado = participantesComConta.find(
    (p) => p.value === participanteUsuarioId,
  );
  const pessoaAlvoSelecionada = pessoasUnicas.find(
    (p) => p.pessoaId === pessoaAlvoConcessaoId,
  );
  const pessoaAlvoConvite = pessoasUnicas.find(
    (p) => p.pessoaId === pessoaAlvoConviteId,
  );
  const combinacaoSelecionada = COMBINACOES_ACESSO_CONCEDIVEIS.find(
    (c) => c.responsabilidade === responsabilidadeConcessao,
  );
  const combinacaoConvite = COMBINACOES_ACESSO_CONCEDIVEIS.find(
    (c) => c.responsabilidade === responsabilidadeConvite,
  );

  useEffect(() => {
    if (!pessoaAlvoConviteId && pessoasUnicas.length > 0) {
      const preferida =
        pessoasUnicas.find((p) => /vovó|vovo|avó|avo/i.test(p.nome)) ??
        pessoasUnicas[0];
      setPessoaAlvoConviteId(preferida.pessoaId);
    }
    if (!pessoaAlvoConcessaoId && pessoasUnicas.length > 0) {
      const preferida =
        pessoasUnicas.find((p) => /vovó|vovo|avó|avo/i.test(p.nome)) ??
        pessoasUnicas[0];
      setPessoaAlvoConcessaoId(preferida.pessoaId);
    }
  }, [pessoasUnicas, pessoaAlvoConviteId, pessoaAlvoConcessaoId]);

  useEffect(() => {
    if (
      visaoConsulta === "participante" &&
      !participanteConsultaId &&
      opcoesConsultaParticipante.length > 0
    ) {
      setParticipanteConsultaId(opcoesConsultaParticipante[0].value);
    }
  }, [visaoConsulta, participanteConsultaId, opcoesConsultaParticipante]);

  function aoTrocarAreaConcessao(proxima: AreaConcessao | null) {
    setAreaConcessao(proxima);
    setEtapaConfirmacao(false);
    if (proxima === "Desenvolvimento") {
      setResponsabilidadeConcessao("responsavel_desenvolvimento");
    } else {
      setResponsabilidadeConcessao(null);
    }
  }

  function aoTrocarAreaConvite(proxima: AreaConcessao | null) {
    setAreaConvite(proxima);
    setEtapaConfirmacaoConvite(false);
    if (proxima === "Desenvolvimento") {
      setResponsabilidadeConvite("responsavel_desenvolvimento");
    } else {
      setResponsabilidadeConvite(null);
    }
  }

  async function aoCadastrar(evento: FormEvent) {
    evento.preventDefault();
    if (!usuario) return;
    if (precisaEntrar && !emailContaNova.trim()) {
      setErro("Informe o e-mail para habilitar a conta desta pessoa.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const criada = await criarPessoa(usuario.pessoa.familiaId, nome);
      setNome("");
      let mensagem = `${criada.nome} foi adicionada à família.`;
      if (precisaEntrar) {
        const convite = await criarConvite(usuario.pessoa.familiaId, {
          email: emailContaNova.trim(),
          nomeConvidado: criada.nome,
          pessoaContaId: criada.id,
        });
        const slug = usuario.familia?.slug;
        const caminho = slug
          ? rotaFamilia(
              slug,
              `/convites/ativar?token=${encodeURIComponent(convite.token)}`,
            )
          : `/convites/ativar?token=${encodeURIComponent(convite.token)}`;
        setLinkAtivacao(caminho);
        setEmailContaNova("");
        setPrecisaEntrar(false);
        mensagem = `${criada.nome} cadastrada. Conta pronta para ativação no mesmo cadastro (sem nova pessoa).`;
      }
      await recarregarInicio();
      setSucesso(mensagem);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  async function aoHabilitarConta(pessoaId: string, nomePessoa: string) {
    if (!usuario) return;
    if (!emailHabilitar.trim()) {
      setErro("Informe o e-mail da conta a habilitar.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const convite = await criarConvite(usuario.pessoa.familiaId, {
        email: emailHabilitar.trim(),
        nomeConvidado: nomePessoa,
        pessoaContaId: pessoaId,
      });
      const slug = usuario.familia?.slug;
      const caminho = slug
        ? rotaFamilia(
            slug,
            `/convites/ativar?token=${encodeURIComponent(convite.token)}`,
          )
        : `/convites/ativar?token=${encodeURIComponent(convite.token)}`;
      setLinkAtivacao(caminho);
      setPessoaHabilitarId(null);
      setEmailHabilitar("");
      setSucesso(
        `Convite de conta para ${nomePessoa}. A ativação reutiliza esta pessoa; o acompanhamento contextual continua em Acessos.`,
      );
      await recarregarInicio();
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível habilitar a conta",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function aoConfirmarConvite() {
    if (!usuario || !pessoaAlvoConviteId || !responsabilidadeConvite) {
      setErro("Escolha a pessoa acompanhada, a área e a responsabilidade.");
      return;
    }
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const convite = await criarConvite(usuario.pessoa.familiaId, {
        email: emailConvite,
        nomeConvidado: "Participante convidado",
        responsabilidade: responsabilidadeConvite,
        pessoaAlvoId: pessoaAlvoConviteId,
      });
      const slug = usuario.familia?.slug;
      const caminho = slug
        ? rotaFamilia(
            slug,
            `/convites/ativar?token=${encodeURIComponent(convite.token)}`,
          )
        : `/convites/ativar?token=${encodeURIComponent(convite.token)}`;
      setLinkAtivacao(caminho);
      setEtapaConfirmacaoConvite(false);
      setSucesso(
        `Convite pronto. Antes da ativação ele aparece só em Convites. ${textoRevisaoAcesso(
          {
            participanteNome: emailConvite.trim() || "a pessoa convidada",
            area: combinacaoConvite?.area ?? "Cuidados",
            responsabilidade:
              (responsabilidadeConvite as CombinacaoAcessoConcedivel["responsabilidade"]) ??
              "colaboradora_cuidados",
            nomePessoa: pessoaAlvoConvite?.nome ?? "",
            convite: true,
          },
        )}`,
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
        `Acesso concedido. ${textoRevisaoAcesso({
          participanteNome: participanteSelecionado?.label ?? "",
          area: combinacaoSelecionada?.area ?? "Cuidados",
          responsabilidade:
            (responsabilidadeConcessao as CombinacaoAcessoConcedivel["responsabilidade"]) ??
            "responsavel_cuidados",
          nomePessoa: pessoaAlvoSelecionada?.nome ?? "",
        })}`,
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível conceder o acesso");
    } finally {
      setCarregando(false);
    }
  }

  async function aoRevogarAcesso(autorizacaoId: string, acesso: AcessoResumo) {
    if (!usuario) return;
    const ok = window.confirm(
      `Retirar este acesso?\n\n${textoConfirmacaoRevoga(acesso)}\n\nA sessão desse participante será invalidada. Os demais acessos permanecem.`,
    );
    if (!ok) return;
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      await revogarAutorizacao(usuario.pessoa.familiaId, autorizacaoId);
      await recarregarInicio();
      setSucesso(
        "Acesso retirado. A sessão foi invalidada; os demais vínculos desse participante permanecem após novo login.",
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível revogar o acesso");
    } finally {
      setCarregando(false);
    }
  }

  function renderListaAcessos(
    itens: AcessoResumo[],
    visao: VisaoConsulta,
  ) {
    return (
      <Stack
        gap="xs"
        component="ul"
        style={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {itens.map((a) => (
          <Group
            key={a.id}
            component="li"
            justify="space-between"
            align="flex-start"
            wrap="nowrap"
            gap="sm"
          >
            <Text size="sm">
              {visao === "pessoa"
                ? textoLinhaPorPessoa(a)
                : textoLinhaPorParticipante(a)}
            </Text>
            <Button
              size="compact-sm"
              variant="subtle"
              color="red"
              loading={carregando}
              onClick={() => void aoRevogarAcesso(a.id, a)}
            >
              Retirar
            </Button>
          </Group>
        ))}
      </Stack>
    );
  }

  function renderOpcoesResponsabilidade(
    combinacoes: readonly CombinacaoAcessoConcedivel[],
    valor: string | null,
    onChange: (v: string) => void,
    nomePessoa: string,
  ) {
    const unica = combinacoes.length === 1;
    return (
      <Radio.Group
        label="Responsabilidade"
        description={
          unica
            ? "Única opção nesta área."
            : "Escolha explicitamente Responsável ou Integrante."
        }
        value={valor ?? ""}
        onChange={(v) => onChange(v)}
        required
      >
        <Stack gap="sm" mt="xs">
          {combinacoes.map((c) => (
            <Radio
              key={c.responsabilidade}
              value={c.responsabilidade}
              label={
                <Stack gap={2}>
                  <Text size="sm" fw={600}>
                    {c.rotulo}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {resumoAcoesCombinacao(c.responsabilidade, nomePessoa)}
                  </Text>
                </Stack>
              }
            />
          ))}
        </Stack>
      </Radio.Group>
    );
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
                  placeholder="Ex.: Avó"
                  required
                  autoComplete="off"
                />
                <Checkbox
                  label="Essa pessoa também precisa entrar?"
                  description="Opcional. Gera convite de conta na mesma pessoa, sem senha definida por você."
                  checked={precisaEntrar}
                  onChange={(e) => setPrecisaEntrar(e.currentTarget.checked)}
                />
                {precisaEntrar ? (
                  <TextInput
                    label="E-mail da conta"
                    value={emailContaNova}
                    onChange={(e) => setEmailContaNova(e.currentTarget.value)}
                    type="email"
                    required
                    placeholder="email@exemplo.com"
                    autoComplete="off"
                  />
                ) : null}
                <Button
                  type="submit"
                  loading={carregando}
                  disabled={
                    !nome.trim() ||
                    (precisaEntrar && !emailContaNova.trim())
                  }
                >
                  Salvar
                </Button>
                {linkAtivacao && abaAtiva === "pessoas" ? (
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
              <Title order={2}>Pessoas da família</Title>
              {pessoasUnicas.length === 0 ? (
                <EstadoVazio
                  titulo="Nenhuma pessoa cadastrada"
                  descricao="Adicione a primeira pessoa pelo formulário acima."
                />
              ) : (
                <Stack
                  gap="sm"
                  component="ul"
                  style={{ listStyle: "none", margin: 0, padding: 0 }}
                >
                  {pessoasUnicas.map((p) => (
                    <Stack
                      key={p.pessoaId}
                      component="li"
                      gap={6}
                      style={{
                        borderBottom: "1px solid var(--mantine-color-gray-3)",
                        paddingBottom: 8,
                      }}
                    >
                      <Group justify="space-between" align="flex-start">
                        <Text size="sm">
                          {p.nome}
                          {p.possuiConta ? " · com conta" : " · sem conta"}
                        </Text>
                        <Group gap="xs">
                          {!p.possuiConta ? (
                            <Button
                              size="compact-sm"
                              variant="light"
                              onClick={() => {
                                setPessoaHabilitarId(
                                  pessoaHabilitarId === p.pessoaId
                                    ? null
                                    : p.pessoaId,
                                );
                                setEmailHabilitar("");
                                setErro(null);
                              }}
                            >
                              Habilitar conta
                            </Button>
                          ) : null}
                          <Anchor
                            component={Link}
                            href={usuario?.familia?.slug ? rotaFamilia(usuario.familia.slug, `/pessoas/${p.pessoaId}`) : `/pessoas/${p.pessoaId}`}
                            size="sm"
                          >
                            Abrir perfil
                          </Anchor>
                        </Group>
                      </Group>
                      {pessoaHabilitarId === p.pessoaId ? (
                        <Stack gap="xs">
                          <TextInput
                            label="E-mail da conta"
                            value={emailHabilitar}
                            onChange={(e) =>
                              setEmailHabilitar(e.currentTarget.value)
                            }
                            type="email"
                            required
                            placeholder="email@exemplo.com"
                            autoComplete="off"
                          />
                          <Group gap="sm">
                            <Button
                              variant="default"
                              size="compact-sm"
                              onClick={() => {
                                setPessoaHabilitarId(null);
                                setEmailHabilitar("");
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="compact-sm"
                              loading={carregando}
                              disabled={!emailHabilitar.trim()}
                              onClick={() =>
                                void aoHabilitarConta(p.pessoaId, p.nome)
                              }
                            >
                              Gerar convite de conta
                            </Button>
                          </Group>
                        </Stack>
                      ) : null}
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="acessos" pt="md">
          <Stack gap="lg">
            <Stack gap="sm">
              <Title order={2}>Consulta de acessos</Title>
              <SegmentedControl
                value={visaoConsulta}
                onChange={(v) => setVisaoConsulta(v as VisaoConsulta)}
                data={[
                  { value: "pessoa", label: "Por pessoa acompanhada" },
                  { value: "participante", label: "Por participante" },
                ]}
                fullWidth
              />

              {visaoConsulta === "pessoa" ? (
                <Stack gap="md">
                  <Stack gap="xs">
                    <Title order={3}>Administração da família</Title>
                    <Text size="sm" c="dimmed">
                      {TEXTO_ADMINISTRACAO_FAMILIA}
                    </Text>
                    {blocoAdministracao.length === 0 ? (
                      <Text size="sm" c="dimmed">
                        Nenhum administrador ativo listado neste contexto.
                      </Text>
                    ) : (
                      renderListaAcessos(blocoAdministracao, "pessoa")
                    )}
                  </Stack>

                  {gruposPorPessoa.length === 0 ? (
                    <Text size="sm" c="dimmed">
                      Ainda não há acessos contextuais ativos por pessoa
                      acompanhada.
                    </Text>
                  ) : (
                    gruposPorPessoa.map(([chave, grupo]) => (
                      <Stack key={chave} gap="xs">
                        <Title order={3}>{grupo.titulo}</Title>
                        {renderListaAcessos(grupo.itens, "pessoa")}
                      </Stack>
                    ))
                  )}
                </Stack>
              ) : (
                <Stack gap="md">
                  <Select
                    label="Participante"
                    description="Selecione a conta. Contas com o mesmo nome são distinguidas pelo identificador da conta."
                    data={opcoesConsultaParticipante}
                    value={participanteConsultaId}
                    onChange={setParticipanteConsultaId}
                    searchable
                  />
                  {!participanteConsultaId ? (
                    <Text size="sm" c="dimmed">
                      Selecione uma conta para ver pessoas, áreas e
                      responsabilidades.
                    </Text>
                  ) : acessosDoParticipanteConsulta.length === 0 ? (
                    <Text size="sm" c="dimmed">
                      Nenhum acesso ativo para esta conta no contexto
                      selecionado.
                    </Text>
                  ) : (
                    <>
                      {adminDoParticipanteConsulta.length > 0 ? (
                        <Stack gap="xs">
                          <Title order={3}>Administração da família</Title>
                          <Text size="sm" c="dimmed">
                            {TEXTO_ADMINISTRACAO_FAMILIA}
                          </Text>
                          {renderListaAcessos(
                            adminDoParticipanteConsulta,
                            "participante",
                          )}
                        </Stack>
                      ) : null}
                      {contextuaisDoParticipanteConsulta.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Esta conta não tem acessos contextuais ativos.
                        </Text>
                      ) : (
                        contextuaisDoParticipanteConsulta.map(
                          ([chave, grupo]) => (
                            <Stack key={chave} gap="xs">
                              <Title order={3}>{grupo.titulo}</Title>
                              {renderListaAcessos(grupo.itens, "participante")}
                            </Stack>
                          ),
                        )
                      )}
                    </>
                  )}
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
                        {
                          value: "Desenvolvimento",
                          label: "Desenvolvimento",
                        },
                      ]}
                      value={areaConcessao}
                      onChange={(v) =>
                        aoTrocarAreaConcessao(
                          (v as AreaConcessao | null) ?? null,
                        )
                      }
                      required
                    />
                    {areaConcessao
                      ? renderOpcoesResponsabilidade(
                          combinacoesAreaConcessao,
                          responsabilidadeConcessao,
                          (v) => {
                            setResponsabilidadeConcessao(v);
                            setEtapaConfirmacao(false);
                          },
                          pessoaAlvoSelecionada?.nome ?? "",
                        )
                      : null}
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
                    {textoRevisaoAcesso({
                      participanteNome: participanteSelecionado?.label ?? "",
                      area: combinacaoSelecionada?.area ?? "Cuidados",
                      responsabilidade:
                        (responsabilidadeConcessao as CombinacaoAcessoConcedivel["responsabilidade"]) ??
                        "responsavel_cuidados",
                      nomePessoa: pessoaAlvoSelecionada?.nome ?? "",
                    })}
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
          {!etapaConfirmacaoConvite ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  !emailConvite.trim() ||
                  !pessoaAlvoConviteId ||
                  !areaConvite ||
                  !responsabilidadeConvite
                ) {
                  setErro(
                    "Preencha e-mail, pessoa acompanhada, área e responsabilidade.",
                  );
                  return;
                }
                setErro(null);
                setEtapaConfirmacaoConvite(true);
              }}
            >
              <Stack gap="sm">
                <Title order={2}>Convidar participante</Title>
                <Text size="sm" c="dimmed">
                  Para quem ainda não tem conta. Mesmas combinações da concessão
                  direta (sem Administrador). O acesso só começa após a
                  ativação.
                </Text>
                <TextInput
                  label="E-mail"
                  value={emailConvite}
                  onChange={(e) => {
                    setEmailConvite(e.currentTarget.value);
                    setEtapaConfirmacaoConvite(false);
                  }}
                  type="email"
                  required
                  placeholder="email@exemplo.com"
                />
                <Select
                  label="Pessoa acompanhada"
                  data={opcoesPessoas}
                  value={pessoaAlvoConviteId}
                  onChange={(v) => {
                    setPessoaAlvoConviteId(v);
                    setEtapaConfirmacaoConvite(false);
                  }}
                  required
                  searchable
                />
                <Select
                  label="Área"
                  data={[
                    { value: "Cuidados", label: "Cuidados" },
                    {
                      value: "Desenvolvimento",
                      label: "Desenvolvimento",
                    },
                  ]}
                  value={areaConvite}
                  onChange={(v) =>
                    aoTrocarAreaConvite((v as AreaConcessao | null) ?? null)
                  }
                  required
                />
                {areaConvite
                  ? renderOpcoesResponsabilidade(
                      combinacoesAreaConvite,
                      responsabilidadeConvite,
                      (v) => {
                        setResponsabilidadeConvite(v);
                        setEtapaConfirmacaoConvite(false);
                      },
                      pessoaAlvoConvite?.nome ?? "",
                    )
                  : null}
                <Button
                  type="submit"
                  variant="light"
                  disabled={
                    !emailConvite.trim() ||
                    !pessoaAlvoConviteId ||
                    !responsabilidadeConvite
                  }
                >
                  Revisar
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
          ) : (
            <Stack gap="sm">
              <Title order={2}>Revisar convite</Title>
              <Text size="sm">
                {textoRevisaoAcesso({
                  participanteNome: emailConvite.trim() || "a pessoa convidada",
                  area: combinacaoConvite?.area ?? "Cuidados",
                  responsabilidade:
                    (responsabilidadeConvite as CombinacaoAcessoConcedivel["responsabilidade"]) ??
                    "colaboradora_cuidados",
                  nomePessoa: pessoaAlvoConvite?.nome ?? "",
                  convite: true,
                })}
              </Text>
              <Group gap="sm">
                <Button
                  variant="default"
                  onClick={() => setEtapaConfirmacaoConvite(false)}
                  disabled={carregando}
                >
                  Voltar
                </Button>
                <Button
                  loading={carregando}
                  onClick={() => void aoConfirmarConvite()}
                >
                  Enviar convite
                </Button>
              </Group>
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
