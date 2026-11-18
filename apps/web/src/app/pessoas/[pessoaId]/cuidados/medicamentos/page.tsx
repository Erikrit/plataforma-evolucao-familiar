"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  Container,
  Drawer,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
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
  cadastrarMedicamento,
  encerrarOuSuspenderMedicamento,
  listarMedicamentos,
  obterMe,
  obterPessoa,
  type MedicamentoLista,
} from "@/lib/api";
import { podeGerenciarProgramacaoCuidados } from "@/lib/rotulos-experiencia";

const HORAS_CHEIAS = Array.from({ length: 24 }, (_, i) => {
  const h = `${String(i).padStart(2, "0")}:00`;
  return { value: h, label: h };
});

const OPCAO_OUTRO = "__outro__";

export default function PaginaMedicamentos() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const { autorizacoes } = useSessao();
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);

  const [autenticado, setAutenticado] = useState(false);
  const [nomePessoa, setNomePessoa] = useState("");
  const [lista, setLista] = useState<MedicamentoLista[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviandoForm, setEnviandoForm] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [selecionado, setSelecionado] = useState<MedicamentoLista | null>(null);
  const [confirmacao, setConfirmacao] = useState<"suspender" | "encerrar" | null>(
    null,
  );
  const [acaoGestao, setAcaoGestao] = useState(false);

  const [nomeMed, setNomeMed] = useState("");
  const [primeiroHorario, setPrimeiroHorario] = useState("08:00");
  const [dosesPorDia, setDosesPorDia] = useState<number | string>(1);
  const [duracaoTipo, setDuracaoTipo] = useState<"continua" | "dias">("continua");
  const [duracaoDias, setDuracaoDias] = useState<number | string>(7);
  const [modosHorario, setModosHorario] = useState<("cheia" | "exato")[]>(["cheia"]);
  const [horariosLista, setHorariosLista] = useState<string[]>(["08:00"]);
  const [horariosConferidos, setHorariosConferidos] = useState(false);
  const [intervaloHoras, setIntervaloHoras] = useState<number | string>("");

  const podeGerenciar = podeGerenciarProgramacaoCuidados(
    params.pessoaId,
    autorizacoes,
  );

  const dosesNumericas = useMemo(() => {
    const n = Number(dosesPorDia);
    return Number.isInteger(n) && n >= 1 ? Math.min(n, 24) : 1;
  }, [dosesPorDia]);

  useEffect(() => {
    setHorariosLista((atual) =>
      Array.from({ length: dosesNumericas }, (_, i) => {
        if (i === 0) return primeiroHorario;
        return atual[i] ?? "12:00";
      }),
    );
    setModosHorario((atual) =>
      Array.from({ length: dosesNumericas }, (_, i) => {
        if (i === 0) {
          return primeiroHorario.endsWith(":00") ? "cheia" : "exato";
        }
        return atual[i] ?? "cheia";
      }),
    );
    setHorariosConferidos(false);
  }, [dosesNumericas, primeiroHorario]);

  const carregar = useCallback(async (pessoaId: string) => {
    setLista(await listarMedicamentos(pessoaId));
  }, []);

  useEffect(() => {
    void (async () => {
      setCarregando(true);
      setErro(null);
      try {
        const me = await obterMe();
        if (!me) {
          setAutenticado(false);
          setErro("Entre na página inicial para ver os medicamentos.");
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
          e instanceof Error
            ? e.message
            : "Não foi possível carregar os medicamentos.",
        );
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId, carregar]);

  function atualizarHorario(indice: number, valor: string, modo: "cheia" | "exato") {
    const normalizado = normalizarHoraInput(valor);
    setHorariosLista((atual) =>
      atual.map((h, i) => (i === indice ? normalizado : h)),
    );
    setModosHorario((atual) =>
      atual.map((m, i) => (i === indice ? modo : m)),
    );
    if (indice === 0) setPrimeiroHorario(normalizado);
    setHorariosConferidos(false);
  }

  function aplicarSugestaoIntervalo() {
    const intervalo = Number(intervaloHoras);
    if (!Number.isInteger(intervalo) || intervalo < 1) return;
    const sugeridos = sugerirHorariosPorIntervalo(
      primeiroHorario,
      dosesNumericas,
      intervalo,
    );
    setHorariosLista(sugeridos);
    setModosHorario(
      sugeridos.map((h) => (h.endsWith(":00") ? "cheia" : "exato")),
    );
    setHorariosConferidos(false);
  }

  async function aoCadastrarMedicamento(evento: FormEvent) {
    evento.preventDefault();
    if (!podeGerenciar || enviandoForm) return;
    setEnviandoForm(true);
    setErro(null);
    setSucesso(null);
    try {
      await cadastrarMedicamento(params.pessoaId, {
        nome: nomeMed.trim(),
        horarios: horariosLista,
        primeiroHorario,
        dosesPorDia: dosesNumericas,
        duracaoTipo,
        duracaoDias: duracaoTipo === "dias" ? Number(duracaoDias) : null,
        horariosConferidos,
        intervaloHoras:
          intervaloHoras === "" || intervaloHoras == null
            ? null
            : Number(intervaloHoras),
        ativar: true,
      });
      setNomeMed("");
      setHorariosConferidos(false);
      setMostrarCadastro(false);
      await carregar(params.pessoaId);
      setSucesso("Medicamento cadastrado.");
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível cadastrar o medicamento.",
      );
    } finally {
      setEnviandoForm(false);
    }
  }

  async function confirmarGestao() {
    if (!selecionado || !confirmacao || !podeGerenciar || acaoGestao) return;
    setAcaoGestao(true);
    setErro(null);
    setSucesso(null);
    const acao = confirmacao;
    try {
      await encerrarOuSuspenderMedicamento(selecionado.id, acao);
      setConfirmacao(null);
      setSelecionado(null);
      await carregar(params.pessoaId);
      setSucesso(
        acao === "suspender" ? "Medicamento suspenso." : "Medicamento encerrado.",
      );
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Não foi possível atualizar o medicamento.",
      );
    } finally {
      setAcaoGestao(false);
    }
  }

  const podeVer = autenticado && !carregando && !erro?.startsWith("Acesso");
  const vigentes = lista.filter(
    (m) => m.status === "ativo" || m.status === "rascunho",
  );
  const outros = lista.filter(
    (m) => m.status === "suspenso" || m.status === "encerrado",
  );

  return (
    <Container component="main" size="sm" px={0} className="cuidados-mobile">
      <Stack gap="lg">
        <Title order={1}>
          Medicamentos{nomePessoa ? ` · ${nomePessoa}` : ""}
        </Title>

        {carregando ? (
          <EstadoCarregando rotulo="Carregando medicamentos…" />
        ) : null}
        <MensagemFeedback erro={erro} sucesso={sucesso} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <>
            {vigentes.length === 0 ? (
              <EstadoVazio
                titulo="Nenhum medicamento cadastrado"
                descricao={
                  podeGerenciar
                    ? "Adicione a programação quando houver orientação vigente."
                    : "Quando houver programação autorizada, ela aparece aqui."
                }
              />
            ) : (
              <Stack
                gap="sm"
                component="ul"
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {vigentes.map((m) => (
                  <Card
                    key={m.id}
                    component="li"
                    withBorder
                    padding="md"
                    radius="md"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setConfirmacao(null);
                      setSelecionado(m);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setConfirmacao(null);
                        setSelecionado(m);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Group gap="sm" wrap="nowrap" align="flex-start">
                      <ThemeIcon variant="light" color="teal" size={36} radius="md" aria-hidden>
                        <Text size="xs" fw={700}>
                          Med
                        </Text>
                      </ThemeIcon>
                      <Stack gap={2}>
                        <Text fw={600}>{m.nome}</Text>
                        <Text size="sm" c="dimmed">
                          {resumoProgramacao(m)}
                        </Text>
                        <Text size="sm" c="azul" fw={500}>
                          Ver detalhes
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))}
              </Stack>
            )}

            {podeGerenciar && outros.length > 0 ? (
              <Accordion variant="contained" radius="md">
                <Accordion.Item value="outros">
                  <Accordion.Control>
                    Suspensos ou encerrados ({outros.length})
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      {outros.map((m) => (
                        <Card
                          key={m.id}
                          withBorder
                          padding="sm"
                          radius="md"
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setConfirmacao(null);
                            setSelecionado(m);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setConfirmacao(null);
                              setSelecionado(m);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <Text fw={600}>{m.nome}</Text>
                          <Text size="sm" c="dimmed">
                            {rotuloStatus(m.status)} · {resumoProgramacao(m)}
                          </Text>
                        </Card>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            ) : null}

            {podeGerenciar ? (
              <Stack gap="sm">
                {!mostrarCadastro ? (
                  <Button variant="light" onClick={() => setMostrarCadastro(true)}>
                    Adicionar medicamento
                  </Button>
                ) : (
                  <form onSubmit={aoCadastrarMedicamento}>
                    <Stack gap="sm">
                      <Title order={2}>Novo medicamento</Title>
                      <TextInput
                        label="Nome"
                        value={nomeMed}
                        onChange={(e) => setNomeMed(e.currentTarget.value)}
                        required
                      />
                      <NumberInput
                        label="Doses ao dia"
                        value={dosesPorDia}
                        onChange={setDosesPorDia}
                        min={1}
                        max={24}
                        required
                      />
                      <SegmentedControl
                        fullWidth
                        value={duracaoTipo}
                        onChange={(v) => setDuracaoTipo(v as "continua" | "dias")}
                        data={[
                          { label: "Uso contínuo", value: "continua" },
                          { label: "Por dias", value: "dias" },
                        ]}
                      />
                      {duracaoTipo === "dias" ? (
                        <NumberInput
                          label="Quantidade de dias"
                          value={duracaoDias}
                          onChange={setDuracaoDias}
                          min={1}
                          required
                        />
                      ) : null}

                      <Text size="sm" fw={500}>
                        Horários prescritos
                      </Text>
                      {horariosLista.map((horario, indice) => (
                        <SeletorHorarioDose
                          key={`horario-${indice}`}
                          indice={indice}
                          valor={horario}
                          modo={modosHorario[indice] ?? "cheia"}
                          onChange={atualizarHorario}
                        />
                      ))}

                      <Accordion variant="separated" radius="md">
                        <Accordion.Item value="avancado">
                          <Accordion.Control>Opções avançadas</Accordion.Control>
                          <Accordion.Panel>
                            <Stack gap="sm">
                              <NumberInput
                                label="Intervalo em horas (opcional)"
                                description="Use só se a orientação disser algo como “a cada 8 horas”."
                                value={intervaloHoras}
                                onChange={setIntervaloHoras}
                                min={1}
                                max={24}
                                allowDecimal={false}
                              />
                              <Button
                                type="button"
                                variant="light"
                                onClick={aplicarSugestaoIntervalo}
                              >
                                Sugerir horários para conferência
                              </Button>
                            </Stack>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>

                      <Checkbox
                        checked={horariosConferidos}
                        onChange={(e) =>
                          setHorariosConferidos(e.currentTarget.checked)
                        }
                        label="Confirmei estes horários com a orientação vigente"
                      />
                      <Button
                        type="submit"
                        loading={enviandoForm}
                        disabled={!horariosConferidos}
                      >
                        Cadastrar e ativar
                      </Button>
                      <Button
                        type="button"
                        variant="subtle"
                        onClick={() => setMostrarCadastro(false)}
                        disabled={enviandoForm}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </form>
                )}
              </Stack>
            ) : null}
          </>
        ) : null}

        <Drawer
          opened={Boolean(selecionado)}
          onClose={() => {
            if (!acaoGestao) {
              setSelecionado(null);
              setConfirmacao(null);
            }
          }}
          position={ehCelular ? "bottom" : "right"}
          title="Detalhes do medicamento"
          padding="md"
          size={ehCelular ? "auto" : "md"}
          closeOnEscape={!acaoGestao}
          closeOnClickOutside={!acaoGestao}
        >
          {selecionado ? (
            <Stack gap="sm">
              <Text fw={600} size="lg">
                {selecionado.nome}
              </Text>
              <Text size="sm" c="dimmed">
                {rotuloStatus(selecionado.status)}
              </Text>
              <Text size="sm">{resumoProgramacao(selecionado)}</Text>

              {podeGerenciar &&
              (selecionado.status === "ativo" ||
                selecionado.status === "rascunho") ? (
                confirmacao ? (
                  <Stack gap="sm">
                    <Text size="sm">
                      {confirmacao === "suspender"
                        ? "Suspender interrompe a programação vigente, sem apagar o histórico."
                        : "Encerrar finaliza a programação. O histórico é preservado."}
                    </Text>
                    <Button
                      color={confirmacao === "encerrar" ? "red" : "yellow"}
                      loading={acaoGestao}
                      onClick={() => void confirmarGestao()}
                    >
                      Confirmar{" "}
                      {confirmacao === "suspender" ? "suspensão" : "encerramento"}
                    </Button>
                    <Button
                      variant="subtle"
                      disabled={acaoGestao}
                      onClick={() => setConfirmacao(null)}
                    >
                      Voltar
                    </Button>
                  </Stack>
                ) : (
                  <Stack gap="xs">
                    <Button
                      variant="default"
                      onClick={() => setConfirmacao("suspender")}
                    >
                      Suspender
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      onClick={() => setConfirmacao("encerrar")}
                    >
                      Encerrar
                    </Button>
                  </Stack>
                )
              ) : null}

              <Button
                variant="subtle"
                disabled={acaoGestao}
                onClick={() => {
                  setSelecionado(null);
                  setConfirmacao(null);
                }}
              >
                Fechar
              </Button>
            </Stack>
          ) : null}
        </Drawer>
      </Stack>
    </Container>
  );
}

function SeletorHorarioDose({
  indice,
  valor,
  modo,
  onChange,
}: {
  indice: number;
  valor: string;
  modo: "cheia" | "exato";
  onChange: (indice: number, valor: string, modo: "cheia" | "exato") => void;
}) {
  const valorSelect = modo === "exato" ? OPCAO_OUTRO : valor;
  return (
    <Stack gap={6}>
      <Select
        label={indice === 0 ? "Horário 1 (primeiro)" : `Horário ${indice + 1}`}
        data={[...HORAS_CHEIAS, { value: OPCAO_OUTRO, label: "Outro horário da prescrição" }]}
        value={valorSelect}
        onChange={(v) => {
          if (!v) return;
          if (v === OPCAO_OUTRO) {
            onChange(indice, valor.endsWith(":00") ? `${valor.slice(0, 2)}:30` : valor, "exato");
          } else {
            onChange(indice, v, "cheia");
          }
        }}
        searchable
        required
      />
      {modo === "exato" ? (
        <TextInput
          label="Horário exato da prescrição"
          type="time"
          value={valor}
          onChange={(e) =>
            onChange(indice, normalizarHoraInput(e.currentTarget.value), "exato")
          }
          required
        />
      ) : null}
    </Stack>
  );
}

function resumoProgramacao(m: MedicamentoLista) {
  const prog = m.programacoes?.[0];
  const horarios = Array.isArray(prog?.horarios)
    ? (prog.horarios as string[])
    : [];
  const duracao =
    prog?.duracaoTipo === "dias" && prog.duracaoDias
      ? `${prog.duracaoDias} dias`
      : "uso contínuo";
  const parteHorarios =
    horarios.length > 0 ? horarios.join(" · ") : "Horários não informados";
  return `${parteHorarios} · ${duracao}`;
}

function rotuloStatus(status: string) {
  if (status === "ativo") return "Ativo";
  if (status === "rascunho") return "Rascunho";
  if (status === "suspenso") return "Suspenso";
  if (status === "encerrado") return "Encerrado";
  return status;
}

function normalizarHoraInput(valor: string): string {
  const m = valor.trim().match(/^(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : valor.trim();
}

function sugerirHorariosPorIntervalo(
  primeiro: string,
  doses: number,
  intervaloHoras: number,
): string[] {
  const [hStr, mStr] = primeiro.split(":");
  const baseMin = Number(hStr) * 60 + Number(mStr);
  if (!Number.isFinite(baseMin)) return Array.from({ length: doses }, () => "");
  return Array.from({ length: doses }, (_, i) => {
    const total = (baseMin + i * intervaloHoras * 60) % (24 * 60);
    const hh = String(Math.floor(total / 60)).padStart(2, "0");
    const mm = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  });
}
