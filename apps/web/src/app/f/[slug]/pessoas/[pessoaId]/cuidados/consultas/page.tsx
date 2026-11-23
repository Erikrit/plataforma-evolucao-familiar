"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { rotaFamilia } from "@/lib/rotas-familia";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Drawer,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";
import { IconeConsulta, IconeExame } from "@/componentes/icones-experiencia";
import {
  atualizarConsulta,
  baixarBytesBase64,
  criarAnexo,
  criarConsulta,
  criarExame,
  listarConsultas,
  listarExames,
  obterAnexoPrivado,
  obterMe,
  obterPessoa,
  type ConsultaLista,
  type ExameLista,
} from "@/lib/api";
import {
  podeOrganizarConsultasExames,
  podeVerAnexosCuidados,
} from "@/lib/rotulos-experiencia";

const HORAS_CHEIAS = Array.from({ length: 24 }, (_, i) => {
  const h = `${String(i).padStart(2, "0")}:00`;
  return { value: h, label: h };
});

/** Alinhado a apps/api/src/anexos/limites-anexo.ts */
const LIMITE_BYTES_ANEXO = 8 * 1024 * 1024;

type ItemLista =
  | { kind: "consulta"; quando: number; consulta: ConsultaLista }
  | { kind: "exame"; quando: number; exame: ExameLista };

export default function PaginaConsultasExames() {
  const params = useParams<{ slug: string; pessoaId: string }>();
  const router = useRouter();
  const { autorizacoes, usuario } = useSessao();
  const ehCelular = useMediaQuery("(max-width: 47.99em)", true);

  const [autenticado, setAutenticado] = useState(false);
  const [familiaId, setFamiliaId] = useState<string | null>(null);
  const [nomePessoa, setNomePessoa] = useState("");
  const [consultas, setConsultas] = useState<ConsultaLista[]>([]);
  const [exames, setExames] = useState<ExameLista[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviandoForm, setEnviandoForm] = useState(false);
  const [acaoGestao, setAcaoGestao] = useState(false);

  const [selecionado, setSelecionado] = useState<ItemLista | null>(null);
  const [confirmacaoStatus, setConfirmacaoStatus] = useState<
    "realizada" | "cancelada" | null
  >(null);
  const [baixandoAnexo, setBaixandoAnexo] = useState(false);
  const [erroAnexo, setErroAnexo] = useState<string | null>(null);
  const [metaAnexo, setMetaAnexo] = useState<{
    nomeArquivo: string;
    mimeTipo: string;
  } | null>(null);

  const [mostrarAgenda, setMostrarAgenda] = useState(false);
  const [consultaDesc, setConsultaDesc] = useState("");
  const [consultaData, setConsultaData] = useState("");
  const [modoHorario, setModoHorario] = useState<"cheia" | "exato">("cheia");
  const [horaCheia, setHoraCheia] = useState("09:00");
  const [horaExata, setHoraExata] = useState("09:00");

  const [mostrarExame, setMostrarExame] = useState(false);
  const [exameDesc, setExameDesc] = useState("");
  const [exameData, setExameData] = useState("");
  const [exameArquivo, setExameArquivo] = useState<File | null>(null);
  const [anexoPendenteId, setAnexoPendenteId] = useState<string | null>(null);

  const podeOrganizar = podeOrganizarConsultasExames(
    params.pessoaId,
    autorizacoes,
  );
  const podeAnexos = podeVerAnexosCuidados(
    params.pessoaId,
    usuario?.pessoa.id,
    autorizacoes,
  );

  const carregar = useCallback(async (pessoaId: string) => {
    const [c, e] = await Promise.all([
      listarConsultas(pessoaId),
      listarExames(pessoaId),
    ]);
    setConsultas(c);
    setExames(e);
  }, []);

  useEffect(() => {
    void (async () => {
      setCarregando(true);
      setErro(null);
      try {
        const me = await obterMe();
        if (!me) {
          setAutenticado(false);
          setErro("Entre na página inicial para ver consultas e exames.");
          return;
        }
        setAutenticado(true);
        setFamiliaId(me.pessoa.familiaId);
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
            : "Não foi possível carregar consultas e exames.",
        );
      } finally {
        setCarregando(false);
      }
    })();
  }, [params.pessoaId, carregar]);

  const itens = useMemo(() => {
    const lista: ItemLista[] = [
      ...consultas.map((consulta) => ({
        kind: "consulta" as const,
        quando: new Date(consulta.dataHora).getTime() || 0,
        consulta,
      })),
      ...exames.map((exame) => ({
        kind: "exame" as const,
        quando: exame.data
          ? new Date(exame.data).getTime() || 0
          : exame.criadoEm
            ? new Date(exame.criadoEm).getTime() || 0
            : 0,
        exame,
      })),
    ];
    return lista.sort((a, b) => b.quando - a.quando);
  }, [consultas, exames]);

  function montarDataHoraConsulta(): Date {
    if (!consultaData) throw new Error("Informe a data da consulta.");
    const hora = modoHorario === "cheia" ? horaCheia : normalizarHora(horaExata);
    if (!/^\d{2}:\d{2}$/.test(hora)) {
      throw new Error("Informe um horário válido.");
    }
    const [hh, mm] = hora.split(":").map(Number);
    const [ano, mes, dia] = consultaData.split("-").map(Number);
    const dataHora = new Date(ano, mes - 1, dia, hh, mm, 0, 0);
    if (Number.isNaN(dataHora.getTime())) {
      throw new Error("Informe data e horário válidos.");
    }
    return dataHora;
  }

  async function aoCriarConsulta(evento: FormEvent) {
    evento.preventDefault();
    if (!podeOrganizar || enviandoForm) return;
    setEnviandoForm(true);
    setErro(null);
    setSucesso(null);
    try {
      const dataHora = montarDataHoraConsulta();
      await criarConsulta(params.pessoaId, {
        especialidadeOuDescricao: consultaDesc.trim(),
        dataHora: dataHora.toISOString(),
      });
      setConsultaDesc("");
      setConsultaData("");
      setModoHorario("cheia");
      setHoraCheia("09:00");
      setHoraExata("09:00");
      setMostrarAgenda(false);
      await carregar(params.pessoaId);
      setSucesso("Consulta agendada.");
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível agendar a consulta.",
      );
    } finally {
      setEnviandoForm(false);
    }
  }

  async function aoCriarExame(evento: FormEvent) {
    evento.preventDefault();
    if (!podeOrganizar || enviandoForm) return;
    setEnviandoForm(true);
    setErro(null);
    setSucesso(null);
    try {
      let anexoId = anexoPendenteId;
      if (exameArquivo && !anexoId) {
        if (!podeAnexos || !familiaId) {
          throw new Error("Sem autorização para anexar documento.");
        }
        if (exameArquivo.size > LIMITE_BYTES_ANEXO) {
          throw new Error(
            `Escolha um arquivo de até ${Math.floor(LIMITE_BYTES_ANEXO / (1024 * 1024))} MB.`,
          );
        }
        if (exameArquivo.size <= 0) {
          throw new Error("Arquivo vazio não pode ser anexado.");
        }
        const base64 = await lerArquivoBase64(exameArquivo);
        const anexo = await criarAnexo(familiaId, {
          pessoaId: params.pessoaId,
          nomeArquivo: exameArquivo.name,
          mimeTipo: exameArquivo.type || "application/octet-stream",
          conteudoBase64: base64,
        });
        anexoId = anexo.id;
        setAnexoPendenteId(anexo.id);
      }
      await criarExame(params.pessoaId, {
        descricao: exameDesc.trim(),
        data: exameData ? new Date(`${exameData}T12:00:00`).toISOString() : null,
        anexoId,
      });
      setExameDesc("");
      setExameData("");
      setExameArquivo(null);
      setAnexoPendenteId(null);
      setMostrarExame(false);
      await carregar(params.pessoaId);
      setSucesso("Exame registrado.");
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível registrar o exame.",
      );
    } finally {
      setEnviandoForm(false);
    }
  }

  async function confirmarStatus() {
    if (
      !selecionado ||
      selecionado.kind !== "consulta" ||
      !confirmacaoStatus ||
      !podeOrganizar ||
      acaoGestao
    ) {
      return;
    }
    setAcaoGestao(true);
    setErro(null);
    setSucesso(null);
    const status = confirmacaoStatus;
    try {
      await atualizarConsulta(selecionado.consulta.id, { status });
      setConfirmacaoStatus(null);
      setSelecionado(null);
      await carregar(params.pessoaId);
      setSucesso(
        status === "realizada"
          ? "Consulta marcada como realizada."
          : "Consulta cancelada.",
      );
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Não foi possível atualizar a consulta.",
      );
    } finally {
      setAcaoGestao(false);
    }
  }

  const podeVer = autenticado && !carregando && !erro?.startsWith("Acesso");
  const vazio = itens.length === 0;

  return (
    <Container component="main" size="sm" px={0} className="cuidados-mobile">
      <Stack gap="lg">
        <Title order={1}>
          Consultas e exames{nomePessoa ? ` · ${nomePessoa}` : ""}
        </Title>

        {carregando ? (
          <EstadoCarregando rotulo="Carregando consultas e exames…" />
        ) : null}
        <MensagemFeedback erro={erro} sucesso={sucesso} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push(rotaFamilia(String(params.slug ?? ""), "/entrar"))}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <>
            {vazio ? (
              <EstadoVazio
                titulo="Nenhum compromisso listado"
                descricao={
                  podeOrganizar
                    ? "Agende uma consulta ou registre um exame quando houver necessidade."
                    : "Compromissos autorizados aparecem aqui."
                }
              />
            ) : (
              <Stack
                gap="sm"
                component="ul"
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {itens.map((item) =>
                  item.kind === "consulta" ? (
                    <Card
                      key={`c-${item.consulta.id}`}
                      component="li"
                      withBorder
                      padding="md"
                      radius="md"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setConfirmacaoStatus(null);
                        setErroAnexo(null);
                        setMetaAnexo(null);
                        setSelecionado(item);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setConfirmacaoStatus(null);
                          setErroAnexo(null);
                          setMetaAnexo(null);
                          setSelecionado(item);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Group gap="sm" wrap="nowrap" align="flex-start">
                        <IconeConsulta />
                        <Stack gap={2}>
                          <Text fw={600}>
                            {item.consulta.especialidadeOuDescricao}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {rotuloStatusConsulta(item.consulta.status)} ·{" "}
                            {formatarQuando(item.consulta.dataHora)}
                          </Text>
                          <Text size="sm" c="azul" fw={500}>
                            Ver detalhes
                          </Text>
                        </Stack>
                      </Group>
                    </Card>
                  ) : (
                    <Card
                      key={`e-${item.exame.id}`}
                      component="li"
                      withBorder
                      padding="md"
                      radius="md"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setConfirmacaoStatus(null);
                        setErroAnexo(null);
                        setMetaAnexo(null);
                        setSelecionado(item);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setConfirmacaoStatus(null);
                          setErroAnexo(null);
                          setMetaAnexo(null);
                          setSelecionado(item);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Group gap="sm" wrap="nowrap" align="flex-start">
                        <IconeExame />
                        <Stack gap={2}>
                          <Text fw={600}>{item.exame.descricao}</Text>
                          <Text size="sm" c="dimmed">
                            Exame
                            {item.exame.data
                              ? ` · ${formatarData(item.exame.data)}`
                              : ""}
                            {item.exame.anexoId && podeAnexos
                              ? " · com documento"
                              : ""}
                          </Text>
                          <Text size="sm" c="azul" fw={500}>
                            Ver detalhes
                          </Text>
                        </Stack>
                      </Group>
                    </Card>
                  ),
                )}
              </Stack>
            )}

            {podeOrganizar ? (
              <Stack gap="sm">
                {!mostrarAgenda && !mostrarExame ? (
                  <Group grow preventGrowOverflow={false}>
                    <Button
                      variant="light"
                      onClick={() => {
                        setMostrarExame(false);
                        setMostrarAgenda(true);
                      }}
                    >
                      Agendar consulta
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setMostrarAgenda(false);
                        setMostrarExame(true);
                      }}
                    >
                      Registrar exame
                    </Button>
                  </Group>
                ) : null}

                {mostrarAgenda ? (
                  <form onSubmit={aoCriarConsulta}>
                    <Stack gap="sm">
                      <Title order={2}>Agendar consulta</Title>
                      <TextInput
                        label="Especialidade ou descrição"
                        value={consultaDesc}
                        onChange={(e) => setConsultaDesc(e.currentTarget.value)}
                        required
                      />
                      <TextInput
                        label="Data"
                        type="date"
                        value={consultaData}
                        onChange={(e) => setConsultaData(e.currentTarget.value)}
                        required
                      />
                      {modoHorario === "cheia" ? (
                        <Select
                          label="Horário"
                          data={HORAS_CHEIAS}
                          value={horaCheia}
                          onChange={(v) => setHoraCheia(v ?? "09:00")}
                          allowDeselect={false}
                          required
                        />
                      ) : (
                        <TextInput
                          label="Horário exato"
                          type="time"
                          value={horaExata}
                          onChange={(e) =>
                            setHoraExata(e.currentTarget.value)
                          }
                          required
                        />
                      )}
                      <Checkbox
                        checked={modoHorario === "exato"}
                        onChange={(e) => {
                          const exato = e.currentTarget.checked;
                          setModoHorario(exato ? "exato" : "cheia");
                          if (exato) setHoraExata(horaCheia);
                          else {
                            const [h] = horaExata.split(":");
                            setHoraCheia(`${h.padStart(2, "0")}:00`);
                          }
                        }}
                        label="Outro horário da consulta (minutos exatos)"
                      />
                      <Button type="submit" loading={enviandoForm}>
                        Agendar
                      </Button>
                      <Button
                        type="button"
                        variant="subtle"
                        onClick={() => setMostrarAgenda(false)}
                        disabled={enviandoForm}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </form>
                ) : null}

                {mostrarExame ? (
                  <form onSubmit={aoCriarExame}>
                    <Stack gap="sm">
                      <Title order={2}>Registrar exame</Title>
                      <TextInput
                        label="Descrição"
                        value={exameDesc}
                        onChange={(e) => setExameDesc(e.currentTarget.value)}
                        required
                      />
                      <TextInput
                        label="Data (opcional)"
                        type="date"
                        value={exameData}
                        onChange={(e) => setExameData(e.currentTarget.value)}
                      />
                      {podeAnexos ? (
                        <Stack gap={4}>
                          <TextInput
                            label="Documento (opcional)"
                            type="file"
                            accept="image/*,.pdf,application/pdf"
                            onChange={(e) => {
                              const arquivo = e.currentTarget.files?.[0] ?? null;
                              setExameArquivo(arquivo);
                              setAnexoPendenteId(null);
                            }}
                          />
                          <Text size="xs" c="dimmed">
                            PDF ou imagem, até{" "}
                            {Math.floor(LIMITE_BYTES_ANEXO / (1024 * 1024))} MB.
                            {anexoPendenteId
                              ? " Documento já enviado — ao tentar de novo, só registra o exame."
                              : ""}
                          </Text>
                        </Stack>
                      ) : null}
                      <Button type="submit" loading={enviandoForm}>
                        Registrar
                      </Button>
                      <Button
                        type="button"
                        variant="subtle"
                        onClick={() => {
                          setMostrarExame(false);
                          setExameArquivo(null);
                          setAnexoPendenteId(null);
                        }}
                        disabled={enviandoForm}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </form>
                ) : null}
              </Stack>
            ) : null}
          </>
        ) : null}

        <Drawer
          opened={Boolean(selecionado)}
          onClose={() => {
            if (!acaoGestao && !baixandoAnexo) {
              setSelecionado(null);
              setConfirmacaoStatus(null);
              setErroAnexo(null);
              setMetaAnexo(null);
            }
          }}
          position={ehCelular ? "bottom" : "right"}
          title={
            selecionado?.kind === "consulta"
              ? "Detalhes da consulta"
              : "Detalhes do exame"
          }
          padding="md"
          size={ehCelular ? "auto" : "md"}
          closeOnEscape={!acaoGestao && !baixandoAnexo}
          closeOnClickOutside={!acaoGestao && !baixandoAnexo}
        >
          {selecionado?.kind === "consulta" ? (
            <Stack gap="sm">
              <Text fw={600} size="lg">
                {selecionado.consulta.especialidadeOuDescricao}
              </Text>
              <Text size="sm" c="dimmed">
                {rotuloStatusConsulta(selecionado.consulta.status)}
              </Text>
              <Text size="sm">{formatarQuando(selecionado.consulta.dataHora)}</Text>
              {selecionado.consulta.profissional ? (
                <Text size="sm">
                  Profissional: {selecionado.consulta.profissional}
                </Text>
              ) : null}
              {selecionado.consulta.local ? (
                <Text size="sm">Local: {selecionado.consulta.local}</Text>
              ) : null}

              {podeOrganizar && selecionado.consulta.status === "agendada" ? (
                confirmacaoStatus ? (
                  <Stack gap="sm">
                    <Text size="sm">
                      {confirmacaoStatus === "realizada"
                        ? "Marcar esta consulta como realizada?"
                        : "Cancelar esta consulta? O registro permanece no histórico."}
                    </Text>
                    <Button
                      color={confirmacaoStatus === "cancelada" ? "red" : "teal"}
                      loading={acaoGestao}
                      onClick={() => void confirmarStatus()}
                    >
                      Confirmar{" "}
                      {confirmacaoStatus === "realizada"
                        ? "realização"
                        : "cancelamento"}
                    </Button>
                    <Button
                      variant="subtle"
                      disabled={acaoGestao}
                      onClick={() => setConfirmacaoStatus(null)}
                    >
                      Voltar
                    </Button>
                  </Stack>
                ) : (
                  <Stack gap="xs">
                    <Button
                      variant="light"
                      onClick={() => setConfirmacaoStatus("realizada")}
                    >
                      Marcar como realizada
                    </Button>
                    <Button
                      variant="default"
                      color="red"
                      onClick={() => setConfirmacaoStatus("cancelada")}
                    >
                      Cancelar consulta
                    </Button>
                  </Stack>
                )
              ) : null}
            </Stack>
          ) : null}

          {selecionado?.kind === "exame" ? (
            <Stack gap="sm">
              {nomePessoa ? (
                <Text size="sm" c="dimmed">
                  {nomePessoa}
                </Text>
              ) : null}
              <Text fw={600} size="lg">
                {selecionado.exame.descricao}
              </Text>
              <Text size="sm" c="dimmed">
                Exame
              </Text>
              {selecionado.exame.data ? (
                <Text size="sm">{formatarData(selecionado.exame.data)}</Text>
              ) : (
                <Text size="sm" c="dimmed">
                  Sem data informada
                </Text>
              )}
              {selecionado.exame.anexoId ? (
                podeAnexos ? (
                  <Stack gap="xs">
                    <Text size="sm">
                      {metaAnexo
                        ? `${metaAnexo.nomeArquivo} · ${rotuloMime(metaAnexo.mimeTipo)}`
                        : "Documento anexado"}
                    </Text>
                    <Text size="xs" c="dimmed">
                      O arquivo pode ser aberto no aplicativo do seu dispositivo
                      após o download. A abertura automática não é garantida.
                    </Text>
                    {erroAnexo ? (
                      <Text size="sm" c="red">
                        {erroAnexo}
                      </Text>
                    ) : null}
                    <Button
                      variant="light"
                      loading={baixandoAnexo}
                      onClick={() => {
                        const anexoId = selecionado.exame.anexoId;
                        if (!anexoId) return;
                        void (async () => {
                          setBaixandoAnexo(true);
                          setErroAnexo(null);
                          try {
                            const anexo = await obterAnexoPrivado(anexoId);
                            const conteudo = (anexo.conteudoBase64 ?? "").trim();
                            if (!conteudo) {
                              throw new Error("Arquivo indisponível.");
                            }
                            setMetaAnexo({
                              nomeArquivo: anexo.nomeArquivo,
                              mimeTipo: anexo.mimeTipo,
                            });
                            baixarBytesBase64(
                              conteudo,
                              anexo.mimeTipo,
                              anexo.nomeArquivo,
                            );
                          } catch (e) {
                            setErroAnexo(
                              e instanceof Error
                                ? e.message
                                : "Não foi possível baixar o arquivo.",
                            );
                          } finally {
                            setBaixandoAnexo(false);
                          }
                        })();
                      }}
                    >
                      {erroAnexo ? "Tentar novamente" : "Baixar arquivo"}
                    </Button>
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    Documento presente — sem permissão para baixar.
                  </Text>
                )
              ) : (
                <Text size="sm" c="dimmed">
                  Sem documento anexado
                </Text>
              )}
            </Stack>
          ) : null}
        </Drawer>
      </Stack>
    </Container>
  );
}

function rotuloStatusConsulta(status: string) {
  if (status === "realizada") return "Realizada";
  if (status === "cancelada") return "Cancelada";
  return "Agendada";
}

function formatarQuando(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatarData(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pt-BR");
}

function rotuloMime(mime: string) {
  const m = (mime || "").toLowerCase();
  if (m.includes("pdf")) return "PDF";
  if (m.startsWith("image/")) return "Imagem";
  if (m) return m;
  return "Arquivo";
}

function normalizarHora(valor: string) {
  const m = valor.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return valor;
  return `${m[1].padStart(2, "0")}:${m[2]}`;
}

function lerArquivoBase64(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      const resultado = String(leitor.result ?? "");
      const base64 = resultado.includes(",")
        ? resultado.split(",")[1] ?? ""
        : resultado;
      if (!base64) {
        reject(new Error("Não foi possível ler o arquivo."));
        return;
      }
      resolve(base64);
    };
    leitor.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    leitor.readAsDataURL(arquivo);
  });
}
