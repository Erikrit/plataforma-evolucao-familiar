"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  Anchor,
  Button,
  Card,
  Checkbox,
  Container,
  Drawer,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  cadastrarMedicamento,
  criarConsulta,
  obterCuidadosHoje,
  obterMe,
  obterPessoa,
  registrarAtividadeApoio,
  registrarDose,
} from "@/lib/api";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";

type CartaoDose = {
  medicamentoId: string;
  nome: string;
  horario: string;
  situacao: string;
  registroId: string | null;
  confirmaAoTocar: false;
};

type Rotina = {
  data: string;
  proximoCuidado: CartaoDose | null;
  secoes: {
    medicamentos: CartaoDose[];
    consultas: { id: string; especialidadeOuDescricao: string; dataHora: string }[];
    atividadesApoio: { id: string; descricao: string }[];
  };
  regra: string;
};

export default function PaginaCuidados() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [nomePessoa, setNomePessoa] = useState<string>("");
  const [rotina, setRotina] = useState<Rotina | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [nomeMed, setNomeMed] = useState("");
  const [primeiroHorario, setPrimeiroHorario] = useState("08:00");
  const [dosesPorDia, setDosesPorDia] = useState<number | string>(1);
  const [duracaoTipo, setDuracaoTipo] = useState<"continua" | "dias">("continua");
  const [duracaoDias, setDuracaoDias] = useState<number | string>(7);
  const [horariosLista, setHorariosLista] = useState<string[]>(["08:00"]);
  const [horariosConferidos, setHorariosConferidos] = useState(false);
  const [intervaloHoras, setIntervaloHoras] = useState<number | string>("");
  const [selecionado, setSelecionado] = useState<CartaoDose | null>(null);
  const [registrando, setRegistrando] = useState(false);
  const [atividade, setAtividade] = useState("");
  const [consultaDesc, setConsultaDesc] = useState("");
  const [consultaQuando, setConsultaQuando] = useState("");
  const [enviandoForm, setEnviandoForm] = useState(false);

  const dosesNumericas = useMemo(() => {
    const n = Number(dosesPorDia);
    return Number.isInteger(n) && n >= 1 ? Math.min(n, 24) : 1;
  }, [dosesPorDia]);

  useEffect(() => {
    setHorariosLista((atual) => {
      const proximo = Array.from({ length: dosesNumericas }, (_, i) => {
        if (i === 0) return primeiroHorario;
        return atual[i] ?? "";
      });
      return proximo;
    });
    setHorariosConferidos(false);
  }, [dosesNumericas, primeiroHorario]);

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
          setErro("Entre na página inicial para ver os cuidados.");
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
        setErro(e instanceof Error ? e.message : "Não foi possível carregar");
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId, carregar]);

  function aplicarSugestaoIntervalo() {
    const intervalo = Number(intervaloHoras);
    if (!Number.isInteger(intervalo) || intervalo < 1) {
      setErro(
        "Informe o intervalo em horas só quando a orientação trouxer um intervalo explícito (ex.: a cada 8 horas).",
      );
      return;
    }
    setHorariosLista(
      sugerirHorariosPorIntervalo(primeiroHorario, dosesNumericas, intervalo),
    );
    setHorariosConferidos(false);
    setErro(null);
    setSucesso(
      "Sugestão matemática aplicada para conferência. Ajuste se necessário antes de confirmar.",
    );
  }

  async function aoCadastrarMedicamento(evento: FormEvent) {
    evento.preventDefault();
    if (!autenticado || enviandoForm) return;
    if (!horariosConferidos) {
      setErro("Confirme os horários com a orientação vigente antes de ativar.");
      return;
    }
    const horarios = horariosLista.map((h) => h.trim());
    if (horarios.some((h) => !/^\d{2}:\d{2}$/.test(h))) {
      setErro("Preencha todos os horários no formato HH:MM.");
      return;
    }
    setEnviandoForm(true);
    setErro(null);
    setSucesso(null);
    try {
      const intervalo = Number(intervaloHoras);
      await cadastrarMedicamento(params.pessoaId, {
        nome: nomeMed,
        primeiroHorario,
        dosesPorDia: dosesNumericas,
        duracaoTipo,
        duracaoDias: duracaoTipo === "dias" ? Number(duracaoDias) : null,
        horarios,
        horariosConferidos: true,
        intervaloHoras:
          Number.isInteger(intervalo) && intervalo >= 1 ? intervalo : null,
        ativar: true,
      });
      setNomeMed("");
      setPrimeiroHorario("08:00");
      setDosesPorDia(1);
      setDuracaoTipo("continua");
      setDuracaoDias(7);
      setHorariosLista(["08:00"]);
      setHorariosConferidos(false);
      setIntervaloHoras("");
      await carregar(params.pessoaId);
      setSucesso("Medicamento cadastrado e ativado.");
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Não foi possível cadastrar o medicamento. Os dados digitados foram mantidos.",
      );
    } finally {
      setEnviandoForm(false);
    }
  }

  async function confirmarRelato(situacao: string) {
    if (!selecionado || !autenticado || registrando) return;
    setRegistrando(true);
    setErro(null);
    setSucesso(null);
    try {
      await registrarDose(selecionado.medicamentoId, {
        data: rotina?.data,
        horario: selecionado.horario,
        situacao,
      });
      setSelecionado(null);
      await carregar(params.pessoaId);
      setSucesso("Relato registrado.");
    } catch {
      setErro("Não foi possível registrar o relato. Nada foi alterado.");
    } finally {
      setRegistrando(false);
    }
  }

  async function aoRegistrarApoio(evento: FormEvent) {
    evento.preventDefault();
    if (!autenticado || enviandoForm) return;
    setEnviandoForm(true);
    setErro(null);
    setSucesso(null);
    try {
      await registrarAtividadeApoio(params.pessoaId, atividade);
      setAtividade("");
      await carregar(params.pessoaId);
      setSucesso("Atividade de apoio registrada.");
    } catch {
      setErro("Não foi possível registrar a atividade.");
    } finally {
      setEnviandoForm(false);
    }
  }

  async function aoCriarConsulta(evento: FormEvent) {
    evento.preventDefault();
    if (!autenticado || enviandoForm) return;
    setEnviandoForm(true);
    setErro(null);
    setSucesso(null);
    try {
      const dataHora = new Date(consultaQuando);
      if (Number.isNaN(dataHora.getTime())) {
        setErro("Informe data e hora válidas da consulta.");
        return;
      }
      await criarConsulta(params.pessoaId, {
        especialidadeOuDescricao: consultaDesc,
        dataHora: dataHora.toISOString(),
      });
      setConsultaDesc("");
      setConsultaQuando("");
      await carregar(params.pessoaId);
      setSucesso("Consulta agendada.");
    } catch {
      setErro("Não foi possível agendar a consulta.");
    } finally {
      setEnviandoForm(false);
    }
  }

  const podeVer = autenticado && !carregando && !erro?.startsWith("Acesso");
  const medicamentos = rotina?.secoes.medicamentos ?? [];
  const consultas = rotina?.secoes.consultas ?? [];
  const apoios = rotina?.secoes.atividadesApoio ?? [];

  return (
    <Container component="main" size="sm" py="lg" px="md" className="cuidados-mobile">
      <Stack gap="lg">
        <Anchor component={Link} href={`/pessoas/${params.pessoaId}`} size="sm">
          ← {nomePessoa || "Perfil"}
        </Anchor>

        <Stack gap={4}>
          <Title order={1}>Cuidados{nomePessoa ? ` de ${nomePessoa}` : ""}</Title>
          <Text c="dimmed" size="sm">
            Toque no cartão para escolher o relato. Nada é registrado sozinho.
          </Text>
        </Stack>

        {carregando ? <EstadoCarregando rotulo="Carregando cuidados…" /> : null}
        <MensagemFeedback erro={erro} sucesso={sucesso} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <>
            <Stack gap="sm">
              <Title order={2}>Rotina de hoje</Title>
              {rotina?.proximoCuidado ? (
                <Card
                  withBorder
                  padding="md"
                  radius="md"
                  className="destaque-proximo"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelecionado(rotina.proximoCuidado)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelecionado(rotina.proximoCuidado);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Text size="sm" c="dimmed">
                    Próximo cuidado
                  </Text>
                  <Text fw={600} size="lg">
                    {rotina.proximoCuidado.nome}
                  </Text>
                  <Text size="sm">
                    {rotina.proximoCuidado.horario} ·{" "}
                    {rotuloSituacao(rotina.proximoCuidado.situacao)}
                  </Text>
                  <Text size="sm" c="azul" fw={500} mt={4}>
                    Abrir opções
                  </Text>
                </Card>
              ) : null}

              {medicamentos.length === 0 ? (
                <EstadoVazio
                  titulo="Nenhum medicamento para hoje"
                  descricao="Quando houver programação, os cartões aparecem aqui."
                />
              ) : (
                <Stack gap="sm">
                  {medicamentos.map((c) => (
                    <Card
                      key={`${c.medicamentoId}-${c.horario}`}
                      withBorder
                      padding="md"
                      radius="md"
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelecionado(c)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelecionado(c);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Text fw={600}>{c.nome}</Text>
                      <Text size="sm" c="dimmed">
                        {c.horario} · {rotuloSituacao(c.situacao)}
                      </Text>
                    </Card>
                  ))}
                </Stack>
              )}
              <Text size="sm" c="dimmed">
                Sem confirmação significa que ainda não houve relato — não é um julgamento.
              </Text>
            </Stack>

            <Stack gap="sm">
              <Title order={2}>Outros cuidados</Title>
              <Text fw={600} size="sm">
                Consultas
              </Text>
              {consultas.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Nenhuma consulta listada.
                </Text>
              ) : (
                <Stack gap={6} component="ul" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {consultas.map((c) => (
                    <Text key={c.id} component="li" size="sm">
                      {c.especialidadeOuDescricao}
                      {c.dataHora ? ` · ${formatarQuando(c.dataHora)}` : ""}
                    </Text>
                  ))}
                </Stack>
              )}
              <Text fw={600} size="sm">
                Apoio
              </Text>
              {apoios.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Nenhuma atividade de apoio registrada.
                </Text>
              ) : (
                <Stack gap={6} component="ul" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {apoios.map((a) => (
                    <Text key={a.id} component="li" size="sm">
                      {a.descricao}
                    </Text>
                  ))}
                </Stack>
              )}
              <Anchor component={Link} href={`/pessoas/${params.pessoaId}/historico`} size="sm">
                Ver histórico
              </Anchor>
            </Stack>

            <Accordion variant="contained" radius="md">
              <Accordion.Item value="gerenciar">
                <Accordion.Control>
                  <Text fw={600}>Gerenciar cuidados</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="lg">
                    <form onSubmit={aoCadastrarMedicamento}>
                      <Stack gap="sm">
                        <Title order={3}>Novo medicamento</Title>
                        <Text size="sm" c="dimmed">
                          Cadastre com os horários da orientação vigente. O sistema não recomenda dose nem inventa intervalo clínico.
                        </Text>
                        <TextInput
                          label="Nome"
                          value={nomeMed}
                          onChange={(e) => setNomeMed(e.currentTarget.value)}
                          required
                        />
                        <TextInput
                          label="Primeiro horário"
                          type="time"
                          value={primeiroHorario}
                          onChange={(e) =>
                            setPrimeiroHorario(normalizarHoraInput(e.currentTarget.value))
                          }
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
                        <Text size="sm" fw={500}>
                          Duração
                        </Text>
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
                          Conferência dos horários
                        </Text>
                        <Text size="sm" c="dimmed">
                          Preencha exatamente como na orientação. Não usamos “doses ao dia” para calcular horários automaticamente.
                        </Text>
                        {horariosLista.map((horario, indice) => (
                          <TextInput
                            key={`horario-${indice}`}
                            label={indice === 0 ? "Horário 1 (primeiro)" : `Horário ${indice + 1}`}
                            type="time"
                            value={horario}
                            disabled={indice === 0}
                            onChange={(e) => {
                              const valor = normalizarHoraInput(e.currentTarget.value);
                              setHorariosLista((atual) =>
                                atual.map((h, i) => (i === indice ? valor : h)),
                              );
                              setHorariosConferidos(false);
                            }}
                            required
                          />
                        ))}

                        <Accordion variant="separated" radius="md">
                          <Accordion.Item value="avancado">
                            <Accordion.Control>
                              Opções avançadas
                            </Accordion.Control>
                            <Accordion.Panel>
                              <Stack gap="sm">
                                <NumberInput
                                  label="Intervalo em horas (opcional)"
                                  description="Use só se a orientação disser algo como “a cada 8 horas”. Não equivale a doses por dia."
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
                      </Stack>
                    </form>

                    <form onSubmit={aoRegistrarApoio}>
                      <Stack gap="sm">
                        <Title order={3}>Registrar apoio</Title>
                        <TextInput
                          label="Descrição"
                          value={atividade}
                          onChange={(e) => setAtividade(e.currentTarget.value)}
                          required
                        />
                        <Button type="submit" loading={enviandoForm}>
                          Registrar
                        </Button>
                      </Stack>
                    </form>

                    <form onSubmit={aoCriarConsulta}>
                      <Stack gap="sm">
                        <Title order={3}>Agendar consulta</Title>
                        <TextInput
                          label="Especialidade ou descrição"
                          value={consultaDesc}
                          onChange={(e) => setConsultaDesc(e.currentTarget.value)}
                          required
                        />
                        <TextInput
                          label="Data e hora"
                          type="datetime-local"
                          value={consultaQuando}
                          onChange={(e) => setConsultaQuando(e.currentTarget.value)}
                          required
                        />
                        <Button type="submit" loading={enviandoForm}>
                          Agendar
                        </Button>
                      </Stack>
                    </form>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </>
        ) : null}

        <Drawer
          opened={Boolean(selecionado)}
          onClose={() => {
            if (!registrando) setSelecionado(null);
          }}
          position="bottom"
          title={`Relato${nomePessoa ? ` de ${nomePessoa}` : ""}`}
          padding="md"
          size="auto"
          overlayProps={{ backgroundOpacity: 0.35 }}
          closeOnEscape={!registrando}
          closeOnClickOutside={!registrando}
        >
          {selecionado ? (
            <Stack gap="sm">
              <Text>
                <Text span fw={600}>{selecionado.nome}</Text>
                {` às ${selecionado.horario}`}
              </Text>
              <Button
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

function normalizarHoraInput(valor: string): string {
  const m = valor.trim().match(/^(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : valor.trim();
}

/** Auxílio matemático apenas quando há intervalo explícito; não deriva de doses/dia. */
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
