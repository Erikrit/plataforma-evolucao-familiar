"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Container,
  Drawer,
  Group,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";
import {
  obterCuidadosHoje,
  obterMe,
  obterPessoa,
  registrarAtividadeApoio,
  registrarDose,
} from "@/lib/api";
import { podeRegistrarRelatoCuidados } from "@/lib/rotulos-experiencia";

type CartaoDose = {
  medicamentoId: string;
  nome: string;
  horario: string;
  situacao: string;
  registroId: string | null;
  confirmaAoTocar: false;
};

type CompromissoDia = {
  id: string;
  especialidadeOuDescricao: string;
  dataHora: string;
};

type Rotina = {
  data: string;
  proximoCuidado: CartaoDose | null;
  secoes: {
    medicamentos: CartaoDose[];
    consultas: CompromissoDia[];
    atividadesApoio: { id: string; descricao: string }[];
  };
  regra: string;
};

export default function PaginaRotinaCuidados() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const { autorizacoes, usuario } = useSessao();
  const [autenticado, setAutenticado] = useState(false);
  const [nomePessoa, setNomePessoa] = useState("");
  const [rotina, setRotina] = useState<Rotina | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] = useState<CartaoDose | null>(null);
  const [registrando, setRegistrando] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [salvandoObs, setSalvandoObs] = useState(false);
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);

  const podeRelatar = podeRegistrarRelatoCuidados(
    params.pessoaId,
    usuario?.pessoa.id,
    autorizacoes,
  );

  const carregar = useCallback(async (pessoaId: string) => {
    setRotina((await obterCuidadosHoje(pessoaId)) as Rotina);
  }, []);

  useEffect(() => {
    void (async () => {
      setCarregando(true);
      setErro(null);
      try {
        const me = await obterMe();
        if (!me) {
          setAutenticado(false);
          setErro("Entre na página inicial para ver a rotina.");
          return;
        }
        setAutenticado(true);
        const perfil = (await obterPessoa(
          me.pessoa.familiaId,
          params.pessoaId,
        )) as { nome: string };
        setNomePessoa(perfil.nome);
        await carregar(params.pessoaId);
      } catch (e) {
        setErro(
          e instanceof Error ? e.message : "Não foi possível carregar a rotina.",
        );
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId, carregar]);

  async function confirmarRelato(situacao: string) {
    if (!selecionado || registrando) return;
    setRegistrando(true);
    setErro(null);
    setSucesso(null);
    try {
      await registrarDose(selecionado.medicamentoId, {
        horario: selecionado.horario,
        situacao,
      });
      await carregar(params.pessoaId);
      setSucesso("Relato registrado.");
      setSelecionado(null);
    } catch {
      setErro("Não foi possível registrar o relato. Tente de novo.");
    } finally {
      setRegistrando(false);
    }
  }

  async function aoSalvarObservacao(evento: FormEvent) {
    evento.preventDefault();
    const texto = observacao.trim();
    if (!texto || !podeRelatar || salvandoObs) return;
    setSalvandoObs(true);
    setErro(null);
    setSucesso(null);
    try {
      await registrarAtividadeApoio(params.pessoaId, texto);
      setObservacao("");
      setSucesso("Observação registrada.");
    } catch {
      setErro("Não foi possível salvar a observação. Tente de novo.");
    } finally {
      setSalvandoObs(false);
    }
  }

  const podeVer = autenticado && !carregando && !erro?.startsWith("Acesso");
  const proximo = rotina?.proximoCuidado ?? null;
  const medicamentos = (rotina?.secoes.medicamentos ?? []).filter(
    (c) =>
      !proximo ||
      c.medicamentoId !== proximo.medicamentoId ||
      c.horario !== proximo.horario,
  );
  const consultas = rotina?.secoes.consultas ?? [];
  const saudacao = nomePessoa
    ? `${nomePessoa}, olha o que temos para hoje!`
    : "Olha o que temos para hoje!";
  const obsPronta = observacao.trim().length > 0;

  return (
    <Container component="main" size="sm" px={0} className="cuidados-mobile">
      <Stack gap="lg">
        <Title order={1}>{saudacao}</Title>

        {carregando ? <EstadoCarregando rotulo="Carregando rotina…" /> : null}
        <MensagemFeedback erro={erro} sucesso={sucesso} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <Stack gap="md">
            {proximo ? (
              <CartaoMedicamento
                cartao={proximo}
                destaque
                onAbrir={() => setSelecionado(proximo)}
              />
            ) : null}

            {medicamentos.length === 0 && consultas.length === 0 && !proximo ? (
              <EstadoVazio
                titulo="Nada previsto para hoje"
                descricao="Quando houver medicamentos ou compromissos, eles aparecem aqui."
              />
            ) : (
              <Stack gap="sm">
                {medicamentos.map((c) => (
                  <CartaoMedicamento
                    key={`${c.medicamentoId}-${c.horario}`}
                    cartao={c}
                    onAbrir={() => setSelecionado(c)}
                  />
                ))}
                {consultas.map((c) => (
                  <Card key={c.id} withBorder padding="md" radius="md">
                    <Group gap="sm" wrap="nowrap" align="flex-start">
                      <MarcadorVisual tipo="consulta" />
                      <Stack gap={2}>
                        <Text size="sm" c="dimmed">
                          Consulta
                        </Text>
                        <Text fw={600}>{c.especialidadeOuDescricao}</Text>
                        <Text size="sm" c="dimmed">
                          {formatarQuando(c.dataHora)}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))}
              </Stack>
            )}

            {podeRelatar ? (
              <form onSubmit={aoSalvarObservacao}>
                <Stack gap="sm">
                  <Textarea
                    label="Observação do dia"
                    description="Opcional. Sem obrigação de preencher."
                    value={observacao}
                    onChange={(e) => setObservacao(e.currentTarget.value)}
                    minRows={2}
                    maxRows={5}
                    autosize
                    disabled={salvandoObs}
                  />
                  <Button
                    type="submit"
                    variant="light"
                    loading={salvandoObs}
                    disabled={!obsPronta || salvandoObs}
                  >
                    Salvar observação
                  </Button>
                </Stack>
              </form>
            ) : null}
          </Stack>
        ) : null}

        <Drawer
          opened={Boolean(selecionado)}
          onClose={() => {
            if (!registrando) setSelecionado(null);
          }}
          position={ehCelular ? "bottom" : "right"}
          title="Relato de medicamento"
          padding="md"
          size={ehCelular ? "auto" : "md"}
          overlayProps={{ backgroundOpacity: 0.35 }}
          closeOnEscape={!registrando}
          closeOnClickOutside={!registrando}
        >
          {selecionado ? (
            <Stack gap="sm">
              <Group gap="sm" wrap="nowrap">
                <MarcadorVisual tipo="medicamento" />
                <Text>
                  <Text span fw={600}>
                    {selecionado.nome}
                  </Text>
                  {` às ${selecionado.horario}`}
                </Text>
              </Group>
              <Button
                color="teal"
                onClick={() => void confirmarRelato("tomou_conforme_informacao")}
                loading={registrando}
                disabled={registrando}
              >
                {registrando ? "Registrando…" : "Informou que tomou"}
              </Button>
              <Button
                variant="default"
                onClick={() => void confirmarRelato("informou_nao_tomou")}
                disabled={registrando}
              >
                Informou que não tomou
              </Button>
              <Button
                variant="subtle"
                onClick={() => setSelecionado(null)}
                disabled={registrando}
              >
                Cancelar
              </Button>
            </Stack>
          ) : null}
        </Drawer>
      </Stack>
    </Container>
  );
}

function CartaoMedicamento({
  cartao,
  destaque = false,
  onAbrir,
}: {
  cartao: CartaoDose;
  destaque?: boolean;
  onAbrir: () => void;
}) {
  return (
    <Card
      withBorder
      padding="md"
      radius="md"
      className={destaque ? "destaque-proximo" : undefined}
      role="button"
      tabIndex={0}
      onClick={onAbrir}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAbrir();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <Group gap="sm" wrap="nowrap" align="flex-start">
        <MarcadorVisual tipo="medicamento" />
        <Stack gap={2}>
          {destaque ? (
            <Text size="sm" c="dimmed">
              Próximo cuidado
            </Text>
          ) : null}
          <Text fw={600} size={destaque ? "lg" : "md"}>
            {cartao.nome}
          </Text>
          <Text size="sm" c="dimmed">
            {cartao.horario} · {rotuloSituacao(cartao.situacao)}
          </Text>
          <Text size="sm" c="azul" fw={500}>
            Abrir opções
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

function MarcadorVisual({ tipo }: { tipo: "medicamento" | "consulta" }) {
  const rotulo = tipo === "medicamento" ? "Med" : "Cons";
  const cor = tipo === "medicamento" ? "teal" : "blue";
  return (
    <ThemeIcon
      variant="light"
      color={cor}
      size={36}
      radius="md"
      aria-hidden
    >
      <Text size="xs" fw={700}>
        {rotulo}
      </Text>
    </ThemeIcon>
  );
}

function rotuloSituacao(situacao: string) {
  if (situacao === "tomou_conforme_informacao") return "informou que tomou";
  if (situacao === "informou_nao_tomou") return "informou que não tomou";
  return "sem confirmação";
}

function formatarQuando(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
