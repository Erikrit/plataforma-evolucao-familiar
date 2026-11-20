"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Anchor,
  Button,
  Card,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import { entrar, type AcessoResumo, type ContextoOperacional } from "@/lib/api";
import { rotuloPapelExperiencia } from "@/lib/rotulos-experiencia";

function textoAcesso(a: AcessoResumo): string {
  const papel = rotuloPapelExperiencia(a.papel);
  if (a.papel === "Administrador" || !a.pessoaAcompanhadaNome) {
    return `${a.participanteNome} · ${papel} · família (administração)${a.ativo ? "" : " · inativo"}`;
  }
  const area = a.area ? `${a.area} · ` : "";
  return `${a.participanteNome} · ${area}${papel}${a.ativo ? "" : " · inativo"}`;
}

function rotuloArea(area: ContextoOperacional["area"]): string {
  return area === "cuidados" ? "Cuidados" : "Desenvolvimento";
}

export function PainelFundacao() {
  const router = useRouter();
  const {
    pronto,
    usuario,
    cartoes,
    destaques,
    acessos,
    contextos,
    destinoEntrada,
    podeGerenciarFamilia,
    entrarNaSessao,
    erroSessao,
  } = useSessao();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const contextosPorPessoa = useMemo(() => {
    const mapa = new Map<
      string,
      { nome: string; areas: ContextoOperacional[] }
    >();
    for (const ctx of contextos) {
      const atual = mapa.get(ctx.pessoaId);
      if (atual) {
        atual.areas.push(ctx);
      } else {
        mapa.set(ctx.pessoaId, { nome: ctx.nome, areas: [ctx] });
      }
    }
    return [...mapa.entries()].map(([pessoaId, valor]) => ({
      pessoaId,
      nome: valor.nome,
      areas: valor.areas,
    }));
  }, [contextos]);

  async function aoEntrar(evento: FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    setSucesso(null);
    try {
      const nova = await entrar(email, senha);
      const inicio = await entrarNaSessao(nova.usuario);
      setSucesso("Você entrou.");
      if (inicio.destinoEntrada) {
        router.replace(inicio.destinoEntrada);
      }
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível entrar"));
    } finally {
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
          <MensagemFeedback erro={erro ?? erroSessao} sucesso={sucesso} />
        </Stack>
      </Card>
    );
  }

  const escolhaMultipla = contextos.length > 1;
  const contextoUnico = contextos.length === 1 ? contextos[0] : null;

  return (
    <Stack gap="lg">
      <Text>
        Olá, <Text span fw={600}>{usuario.pessoa.nome}</Text>
      </Text>

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

      {escolhaMultipla ? (
        <Stack gap="sm">
          <Title order={2}>Escolha o acompanhamento</Title>
          <Text c="dimmed" size="sm">
            Você tem mais de um contexto autorizado. Abra a área desejada.
          </Text>
          <Stack gap="sm">
            {contextosPorPessoa.map((grupo) => (
              <Card key={grupo.pessoaId} withBorder padding="md" radius="md">
                <Stack gap="xs">
                  <Text fw={600}>{grupo.nome}</Text>
                  <GroupAreas areas={grupo.areas} />
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      ) : null}

      {contextoUnico ? (
        <Card
          component={Link}
          href={contextoUnico.href}
          withBorder
          padding="md"
          radius="md"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text fw={600}>
            Continuar em {rotuloArea(contextoUnico.area)} de {contextoUnico.nome}
          </Text>
          <Text size="sm" c="dimmed">
            Único contexto operacional autorizado nesta sessão.
          </Text>
        </Card>
      ) : null}

      {!escolhaMultipla && !contextoUnico ? (
        <Stack gap="sm">
          <Title order={2}>Pessoas</Title>
          {cartoes.length === 0 ? (
            <EstadoVazio
              titulo="Nenhuma pessoa por aqui ainda"
              descricao={
                podeGerenciarFamilia
                  ? "Abra Gerenciar família no menu para adicionar a primeira pessoa."
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
      ) : null}

      {podeGerenciarFamilia ? (
        <Card
          component={Link}
          href="/gerenciar-familia"
          withBorder
          padding="md"
          radius="md"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text fw={600}>Gerenciar família</Text>
          <Text size="sm" c="dimmed">
            {destinoEntrada === "/gerenciar-familia" && contextos.length === 0
              ? "Nenhum contexto operacional — abra a gestão da família."
              : "Pessoas, acessos e convites — área administrativa separada do acompanhamento."}
          </Text>
        </Card>
      ) : null}

      <MensagemFeedback erro={erro ?? erroSessao} sucesso={sucesso} />
    </Stack>
  );
}

function GroupAreas({ areas }: { areas: ContextoOperacional[] }) {
  return (
    <Stack gap={6}>
      {areas.map((area) => (
        <Button
          key={`${area.pessoaId}-${area.area}`}
          component={Link}
          href={area.href}
          variant="light"
          fullWidth
        >
          {rotuloArea(area.area)}
        </Button>
      ))}
    </Stack>
  );
}
