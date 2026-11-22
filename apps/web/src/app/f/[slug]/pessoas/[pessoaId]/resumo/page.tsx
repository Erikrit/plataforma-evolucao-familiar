"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { rotaFamilia } from "@/lib/rotas-familia";
import {
  Anchor,
  Button,
  Container,
  Group,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  baixarBytesBase64,
  obterMe,
  obterPessoa,
  obterRelatorioPdf,
  obterResumoCuidados,
  obterResumoDesenvolvimento,
  type ResumoCuidados,
  type ResumoDesenvolvimento,
} from "@/lib/api";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
} from "@/componentes/feedback";

type PresetPeriodo = "7" | "30" | "personalizado";

function isoHoje() {
  const hoje = new Date();
  const y = hoje.getFullYear();
  const m = String(hoje.getMonth() + 1).padStart(2, "0");
  const d = String(hoje.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isoDiasAtras(dias: number) {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatarQuando(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function rotuloCategoria(categoria: string) {
  if (categoria === "nao_classificada") return "Não classificada";
  return categoria.replaceAll("_", " ");
}

function rotuloResultado(resultado: string) {
  if (resultado === "concluiu") return "Concluiu";
  if (resultado === "participou") return "Participou";
  return resultado;
}

function formatarDataCurta(iso: string | null | undefined) {
  if (!iso) return null;
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return null;
  return data.toLocaleDateString("pt-BR");
}

export default function PaginaResumo() {
  const params = useParams<{ slug: string; pessoaId: string }>();
  const router = useRouter();
  const [nomePessoa, setNomePessoa] = useState("");
  const [preset, setPreset] = useState<PresetPeriodo>("7");
  const [de, setDe] = useState(isoDiasAtras(7));
  const [ate, setAte] = useState(isoHoje());
  const [podeCuidados, setPodeCuidados] = useState(false);
  const [podeDesenvolvimento, setPodeDesenvolvimento] = useState(false);
  const [podeExportar, setPodeExportar] = useState(false);
  const [resumoCuidados, setResumoCuidados] = useState<ResumoCuidados | null>(
    null,
  );
  const [resumoDev, setResumoDev] = useState<ResumoDesenvolvimento | null>(
    null,
  );
  const [erro, setErro] = useState<string | null>(null);
  const [erroExport, setErroExport] = useState<string | null>(null);
  const [acessoNegado, setAcessoNegado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [preparandoPdf, setPreparandoPdf] = useState(false);
  const [pdfPronto, setPdfPronto] = useState<{
    base64: string;
    mimeTipo: string;
    aviso: string;
    paginas?: number;
  } | null>(null);
  const pedidoRef = useRef(0);

  const aplicarPreset = useCallback((valor: PresetPeriodo) => {
    setPreset(valor);
    setPdfPronto(null);
    if (valor === "7") {
      setDe(isoDiasAtras(7));
      setAte(isoHoje());
    } else if (valor === "30") {
      setDe(isoDiasAtras(30));
      setAte(isoHoje());
    }
  }, []);

  const carregar = useCallback(async () => {
    const pedido = ++pedidoRef.current;
    setCarregando(true);
    setErro(null);
    setErroExport(null);
    setAcessoNegado(false);
    setPdfPronto(null);
    setResumoCuidados(null);
    setResumoDev(null);
    try {
      const me = await obterMe();
      if (pedido !== pedidoRef.current) return;
      if (!me) {
        setAutenticado(false);
        setErro("Entre na página inicial para ver o resumo.");
        return;
      }
      setAutenticado(true);
      const perfil = (await obterPessoa(
        me.pessoa.familiaId,
        params.pessoaId,
      )) as {
        nome: string;
        podeExportar?: boolean;
        areas?: { id: string; disponivel: boolean }[];
      };
      if (pedido !== pedidoRef.current) return;
      setNomePessoa(perfil.nome);
      setPodeExportar(perfil.podeExportar === true);
      const areaCuidados = perfil.areas?.find((a) => a.id === "cuidados");
      const areaDev = perfil.areas?.find((a) => a.id === "desenvolvimento");
      const temCuidados = areaCuidados?.disponivel === true;
      const temDev = areaDev?.disponivel === true;
      setPodeCuidados(temCuidados);
      setPodeDesenvolvimento(temDev);

      if (!temCuidados && !temDev) {
        setAcessoNegado(true);
        setErro("Acesso negado ao resumo desta pessoa.");
        return;
      }

      const [cuidados, desenvolvimento] = await Promise.all([
        temCuidados
          ? obterResumoCuidados(params.pessoaId, { de, ate })
          : Promise.resolve(null),
        temDev
          ? obterResumoDesenvolvimento(params.pessoaId, { de, ate })
          : Promise.resolve(null),
      ]);
      if (pedido !== pedidoRef.current) return;
      setResumoCuidados(cuidados);
      setResumoDev(desenvolvimento);
    } catch (e) {
      if (pedido !== pedidoRef.current) return;
      const mensagem =
        e instanceof Error ? e.message : "Não foi possível carregar";
      setAcessoNegado(
        mensagem === "Acesso negado ao resumo." ||
          mensagem === "Acesso negado ao resumo desta pessoa." ||
          mensagem === "Acesso negado a esta pessoa.",
      );
      setErro(mensagem);
      setResumoCuidados(null);
      setResumoDev(null);
    } finally {
      if (pedido === pedidoRef.current) setCarregando(false);
    }
  }, [params.pessoaId, de, ate]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const prepararPdf = useCallback(async () => {
    setPreparandoPdf(true);
    setErroExport(null);
    setPdfPronto(null);
    try {
      const relatorio = await obterRelatorioPdf(params.pessoaId, { de, ate });
      setPdfPronto({
        base64: relatorio.pdfBase64,
        mimeTipo: relatorio.mimeTipo,
        aviso: relatorio.previa.avisoPrivacidade,
        paginas: relatorio.paginas,
      });
      if (relatorio.previa.podeExportar === false) {
        setPodeExportar(false);
      }
    } catch (e) {
      const mensagem =
        e instanceof Error ? e.message : "Não foi possível preparar o PDF";
      setErroExport(mensagem);
      if (mensagem.toLowerCase().includes("permissão")) {
        setPodeExportar(false);
      }
    } finally {
      setPreparandoPdf(false);
    }
  }, [params.pessoaId, de, ate]);

  const baixarPdf = useCallback(() => {
    if (!pdfPronto) return;
    baixarBytesBase64(
      pdfPronto.base64,
      pdfPronto.mimeTipo,
      `resumo-${nomePessoa || params.pessoaId}-${de}-${ate}.pdf`,
    );
  }, [pdfPronto, nomePessoa, params.pessoaId, de, ate]);

  const slug = String(params.slug ?? "");
  const hrefConsultas = rotaFamilia(
    slug,
    `/pessoas/${params.pessoaId}/cuidados/consultas`,
  );
  const hrefCuidados = rotaFamilia(
    slug,
    `/pessoas/${params.pessoaId}/cuidados`,
  );
  const hrefDesenvolvimento = rotaFamilia(
    slug,
    `/pessoas/${params.pessoaId}/desenvolvimento`,
  );

  const cuidadosVazio =
    resumoCuidados != null &&
    resumoCuidados.doses.previstos === 0 &&
    resumoCuidados.consultas.length === 0 &&
    resumoCuidados.exames.length === 0 &&
    (resumoCuidados.observacoes?.length ?? 0) === 0 &&
    (resumoCuidados.mudancasProgramacao?.length ?? 0) === 0;
  const desenvolvimentoVazio =
    resumoDev != null && resumoDev.experiencias.length === 0;
  const tudoVazio =
    (podeCuidados ? cuidadosVazio || resumoCuidados == null : true) &&
    (podeDesenvolvimento ? desenvolvimentoVazio || resumoDev == null : true) &&
    (podeCuidados || podeDesenvolvimento);

  const podeVer =
    autenticado && !carregando && !acessoNegado && erro == null;

  return (
    <Container component="main" size="sm" px={0}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1}>
            Resumo{nomePessoa ? ` · ${nomePessoa}` : ""}
          </Title>
          <Text c="dimmed" size="sm">
            Visão do período — relatos da família, sem diagnóstico.
          </Text>
        </Stack>

        {carregando ? <EstadoCarregando rotulo="Carregando resumo…" /> : null}
        <MensagemFeedback erro={erro ?? erroExport} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push(rotaFamilia(String(params.slug ?? ""), "/entrar"))}>
            Ir para entrar
          </Button>
        ) : null}

        {autenticado && !acessoNegado ? (
          <Stack gap="md">
            <SegmentedControl
              fullWidth
              size="xs"
              value={preset}
              onChange={(v) => aplicarPreset(v as PresetPeriodo)}
              data={[
                { label: "Últimos 7 dias", value: "7" },
                { label: "Últimos 30 dias", value: "30" },
                { label: "Personalizado", value: "personalizado" },
              ]}
            />

            {preset === "personalizado" ? (
              <Group grow align="flex-end">
                <TextInput
                  type="date"
                  label="De"
                  value={de}
                  onChange={(e) => {
                    setPreset("personalizado");
                    setPdfPronto(null);
                    setDe(e.currentTarget.value);
                  }}
                />
                <TextInput
                  type="date"
                  label="Até"
                  value={ate}
                  onChange={(e) => {
                    setPreset("personalizado");
                    setPdfPronto(null);
                    setAte(e.currentTarget.value);
                  }}
                />
              </Group>
            ) : (
              <Text size="xs" c="dimmed">
                Período: {de} a {ate}
              </Text>
            )}

            {podeVer ? (
              <Stack gap="md">
                {tudoVazio ? (
                  <EstadoVazio
                    titulo="Sem dados neste período"
                    descricao="Quando houver relatos autorizados, o resumo aparece aqui. Isso não indica falta de cuidado ou desenvolvimento."
                  />
                ) : null}

                {podeCuidados && resumoCuidados ? (
                  <Stack gap="sm">
                    <Group justify="space-between" align="baseline" wrap="wrap">
                      <Text fw={700}>Cuidados</Text>
                      <Anchor
                        component={Link}
                        href={hrefCuidados}
                        size="xs"
                      >
                        Ver origem em Cuidados
                      </Anchor>
                    </Group>
                    {cuidadosVazio ? (
                      <Text size="sm" c="dimmed">
                        Nenhum registro de Cuidados neste período.
                      </Text>
                    ) : null}
                    <Stack gap={4}>
                      <Text size="sm">
                        {resumoCuidados.doses.previstos} doses previstas
                      </Text>
                      <Text size="sm">
                        {resumoCuidados.doses.tomadasInformadas} tomadas
                        informadas
                      </Text>
                      <Text size="sm">
                        {resumoCuidados.doses.naoTomadasInformadas} não tomadas
                        informadas
                      </Text>
                      <Text size="sm">
                        {resumoCuidados.doses.semConfirmacao} sem confirmação
                      </Text>
                      <Text size="xs" c="dimmed">
                        {resumoCuidados.esclarecimento}
                      </Text>
                    </Stack>

                    <Stack gap={4}>
                      <Group justify="space-between" align="baseline" wrap="wrap">
                        <Text fw={600} size="sm">
                          Consultas e exames
                        </Text>
                        <Anchor
                          component={Link}
                          href={hrefConsultas}
                          size="xs"
                        >
                          Abrir Consultas e exames
                        </Anchor>
                      </Group>
                      {resumoCuidados.consultas.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Nenhuma consulta neste período.
                        </Text>
                      ) : (
                        resumoCuidados.consultas.map((c) => (
                          <Text key={c.id} size="sm">
                            {c.especialidadeOuDescricao} ·{" "}
                            {formatarQuando(c.dataHora)} · {c.status}
                          </Text>
                        ))
                      )}
                      {resumoCuidados.exames.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Nenhum exame neste período.
                        </Text>
                      ) : (
                        resumoCuidados.exames.map((e) => {
                          const dataConhecida = formatarDataCurta(e.data);
                          return (
                            <Text key={e.id} size="sm">
                              {e.descricao}
                              {dataConhecida
                                ? ` · ${dataConhecida}`
                                : ` · registrado em ${formatarQuando(e.criadoEm)}`}
                              {e.temDocumento
                                ? " · documento disponível no app"
                                : ""}
                            </Text>
                          );
                        })
                      )}
                    </Stack>

                    <Stack gap={4}>
                      <Text fw={600} size="sm">
                        Observações de apoio
                      </Text>
                      {(resumoCuidados.observacoes?.length ?? 0) === 0 ? (
                        <Text size="sm" c="dimmed">
                          Nenhuma neste período.
                        </Text>
                      ) : (
                        resumoCuidados.observacoes?.map((o) => (
                          <Text key={o.id} size="sm">
                            {o.descricao}
                            {o.observacao ? ` — ${o.observacao}` : ""} ·{" "}
                            {formatarQuando(o.concluidaEm)}
                          </Text>
                        ))
                      )}
                    </Stack>

                    <Stack gap={4}>
                      <Text fw={600} size="sm">
                        Mudanças de programação
                      </Text>
                      {(resumoCuidados.mudancasProgramacao?.length ?? 0) ===
                      0 ? (
                        <Text size="sm" c="dimmed">
                          Nenhuma neste período.
                        </Text>
                      ) : (
                        resumoCuidados.mudancasProgramacao?.map((p) => (
                          <Text key={p.id} size="sm">
                            {p.medicamento}: horários {p.horarios} ·{" "}
                            {formatarQuando(p.criadoEm)}
                          </Text>
                        ))
                      )}
                    </Stack>
                  </Stack>
                ) : null}

                {podeDesenvolvimento && resumoDev ? (
                  <Stack gap="sm">
                    <Group justify="space-between" align="baseline" wrap="wrap">
                      <Text fw={700}>Desenvolvimento</Text>
                      <Anchor
                        component={Link}
                        href={hrefDesenvolvimento}
                        size="xs"
                      >
                        Ver origem em Desenvolvimento
                      </Anchor>
                    </Group>
                    {desenvolvimentoVazio ? (
                      <Text size="sm" c="dimmed">
                        Nenhum registro de Desenvolvimento neste período.
                      </Text>
                    ) : null}
                    <Stack gap={4}>
                      <Text fw={600} size="sm">
                        Experiências
                      </Text>
                      {resumoDev.experiencias.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Nenhuma brincadeira registrada neste período.
                        </Text>
                      ) : (
                        resumoDev.experiencias.map((e) => (
                          <Text key={e.id} size="sm">
                            {rotuloResultado(e.resultado)}: {e.nome} ·{" "}
                            {rotuloCategoria(e.categoria)} (+
                            {e.estrelasConcedidas} estrelas) ·{" "}
                            {formatarQuando(e.registradoEm)}
                          </Text>
                        ))
                      )}
                    </Stack>

                    <Stack gap={4}>
                      <Text fw={600} size="sm">
                        Categorias
                      </Text>
                      {resumoDev.categoriasExploradas.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Ainda sem categorias neste período.
                        </Text>
                      ) : (
                        resumoDev.categoriasExploradas.map((c) => (
                          <Text key={c.categoria} size="sm">
                            {rotuloCategoria(c.categoria)}: {c.quantidade}
                          </Text>
                        ))
                      )}
                    </Stack>

                    <Stack gap={4}>
                      <Text fw={600} size="sm">
                        Estrelas no período
                      </Text>
                      <Text size="sm">
                        {resumoDev.estrelas.concedidasNoPeriodo} concedidas
                      </Text>
                      <Text size="xs" c="dimmed">
                        {resumoDev.estrelas.esclarecimento}
                      </Text>
                    </Stack>

                    <Stack gap={4}>
                      <Text fw={600} size="sm">
                        Observações da família
                      </Text>
                      {resumoDev.observacoes.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Nenhuma observação neste período.
                        </Text>
                      ) : (
                        resumoDev.observacoes.map((o) => (
                          <Text key={o.experienciaId} size="sm">
                            {o.nome}: {o.texto}
                          </Text>
                        ))
                      )}
                    </Stack>
                  </Stack>
                ) : null}

                {podeExportar ? (
                  <Stack gap="sm">
                    <Text size="xs" c="dimmed">
                      A tela acima é a mesma seleção do PDF. Anexos sensíveis não
                      entram na exportação.
                    </Text>
                    {!pdfPronto ? (
                      <Button
                        variant="light"
                        loading={preparandoPdf}
                        onClick={() => void prepararPdf()}
                      >
                        Preparar PDF
                      </Button>
                    ) : (
                      <Stack gap={6}>
                        <Text size="sm">
                          Prévia pronta
                          {pdfPronto.paginas
                            ? ` · ${pdfPronto.paginas} página(s)`
                            : ""}
                          . Confira o conteúdo acima e baixe o arquivo.
                        </Text>
                        <Text size="xs" c="dimmed">
                          {pdfPronto.aviso}
                        </Text>
                        <Group grow>
                          <Button variant="filled" onClick={baixarPdf}>
                            Baixar PDF
                          </Button>
                          <Button
                            variant="subtle"
                            loading={preparandoPdf}
                            onClick={() => void prepararPdf()}
                          >
                            Preparar de novo
                          </Button>
                        </Group>
                      </Stack>
                    )}
                  </Stack>
                ) : (
                  <Text size="xs" c="dimmed">
                    Sua conta pode consultar o resumo, mas não exportar o PDF
                    completo desta pessoa.
                  </Text>
                )}
              </Stack>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
