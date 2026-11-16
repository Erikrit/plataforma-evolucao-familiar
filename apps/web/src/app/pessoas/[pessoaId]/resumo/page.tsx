"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Anchor,
  Button,
  Card,
  Container,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
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

function periodoPadrao() {
  const ate = new Date();
  const de = new Date();
  de.setDate(de.getDate() - 7);
  return {
    de: de.toISOString().slice(0, 10),
    ate: ate.toISOString().slice(0, 10),
  };
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

export default function PaginaResumo() {
  const params = useParams<{ pessoaId: string }>();
  const router = useRouter();
  const padrao = periodoPadrao();
  const [nomePessoa, setNomePessoa] = useState("");
  const [de, setDe] = useState(padrao.de);
  const [ate, setAte] = useState(padrao.ate);
  const [podeCuidados, setPodeCuidados] = useState(false);
  const [podeDesenvolvimento, setPodeDesenvolvimento] = useState(false);
  const [resumoCuidados, setResumoCuidados] = useState<ResumoCuidados | null>(
    null,
  );
  const [resumoDev, setResumoDev] = useState<ResumoDesenvolvimento | null>(
    null,
  );
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [avisoExport, setAvisoExport] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const me = await obterMe();
      if (!me) {
        setAutenticado(false);
        setErro("Entre na página inicial para ver o resumo.");
        return;
      }
      setAutenticado(true);
      const perfil = (await obterPessoa(
        me.pessoa.familiaId,
        params.pessoaId,
      )) as { nome: string; areas?: { id: string; disponivel: boolean }[] };
      setNomePessoa(perfil.nome);
      const areaCuidados = perfil.areas?.find((a) => a.id === "cuidados");
      const areaDev = perfil.areas?.find((a) => a.id === "desenvolvimento");
      const temCuidados = areaCuidados?.disponivel === true;
      const temDev = areaDev?.disponivel === true;
      setPodeCuidados(temCuidados);
      setPodeDesenvolvimento(temDev);

      if (!temCuidados && !temDev) {
        setErro("Acesso negado ao resumo desta pessoa.");
        setResumoCuidados(null);
        setResumoDev(null);
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
      setResumoCuidados(cuidados);
      setResumoDev(desenvolvimento);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível carregar");
      setResumoCuidados(null);
      setResumoDev(null);
    } finally {
      setCarregando(false);
    }
  }, [params.pessoaId, de, ate]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const exportarPdf = useCallback(async () => {
    setExportando(true);
    setAvisoExport(null);
    setErro(null);
    try {
      const relatorio = await obterRelatorioPdf(params.pessoaId, { de, ate });
      setAvisoExport(relatorio.previa.avisoPrivacidade);
      const binario = atob(relatorio.pdfBase64);
      const bytes = new Uint8Array(binario.length);
      for (let i = 0; i < binario.length; i += 1) {
        bytes[i] = binario.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: relatorio.mimeTipo });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resumo-${params.pessoaId}-${de}-${ate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível exportar");
    } finally {
      setExportando(false);
    }
  }, [params.pessoaId, de, ate]);

  const podeVer =
    autenticado && !carregando && !erro?.startsWith("Acesso");
  const temConteudo =
    (resumoCuidados != null &&
      (resumoCuidados.doses.previstos > 0 ||
        resumoCuidados.consultas.length > 0 ||
        resumoCuidados.exames.length > 0)) ||
    (resumoDev != null && resumoDev.experiencias.length > 0);

  return (
    <Container component="main" size="sm" px={0}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1}>
            Resumo{nomePessoa ? ` · ${nomePessoa}` : ""}
          </Title>
          <Text c="dimmed" size="sm">
            Visão curta do período — relatos da família, sem diagnóstico. Filtros
            simples abaixo; retorno à pessoa pelo menu.
          </Text>
        </Stack>

        {carregando ? <EstadoCarregando rotulo="Carregando resumo…" /> : null}
        <MensagemFeedback erro={erro} />

        {!autenticado && !carregando ? (
          <Button variant="light" onClick={() => router.push("/")}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <Stack gap="md">
            <TextInput
              type="date"
              label="De"
              value={de}
              onChange={(e) => setDe(e.currentTarget.value)}
            />
            <TextInput
              type="date"
              label="Até"
              value={ate}
              onChange={(e) => setAte(e.currentTarget.value)}
            />

            {temConteudo ? (
              <Stack gap="sm">
                {podeCuidados && resumoCuidados ? (
                  <>
                    <Card withBorder padding="md" radius="md">
                      <Stack gap={6}>
                        <Text fw={600}>Medicamentos no período</Text>
                        <Text size="sm">
                          Previstos: {resumoCuidados.doses.previstos}
                        </Text>
                        <Text size="sm">
                          Tomadas informadas:{" "}
                          {resumoCuidados.doses.tomadasInformadas}
                        </Text>
                        <Text size="sm">
                          Não tomadas informadas:{" "}
                          {resumoCuidados.doses.naoTomadasInformadas}
                        </Text>
                        <Text size="sm">
                          Sem confirmação:{" "}
                          {resumoCuidados.doses.semConfirmacao}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {resumoCuidados.esclarecimento}
                        </Text>
                      </Stack>
                    </Card>

                    <Card withBorder padding="md" radius="md">
                      <Text fw={600}>Consultas</Text>
                      {resumoCuidados.consultas.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Nenhuma neste período.
                        </Text>
                      ) : (
                        resumoCuidados.consultas.map((c) => (
                          <Text key={c.id} size="sm">
                            {c.especialidadeOuDescricao} · {c.status}
                          </Text>
                        ))
                      )}
                    </Card>

                    <Card withBorder padding="md" radius="md">
                      <Text fw={600}>Exames</Text>
                      {resumoCuidados.exames.length === 0 ? (
                        <Text size="sm" c="dimmed">
                          Nenhum neste período.
                        </Text>
                      ) : (
                        resumoCuidados.exames.map((e) => (
                          <Text key={e.id} size="sm">
                            {e.descricao}
                          </Text>
                        ))
                      )}
                    </Card>
                  </>
                ) : null}

                {podeDesenvolvimento && resumoDev ? (
                  <>
                    <Card withBorder padding="md" radius="md">
                      <Stack gap={6}>
                        <Text fw={600}>Experiências no período</Text>
                        {resumoDev.experiencias.length === 0 ? (
                          <Text size="sm" c="dimmed">
                            Nenhuma brincadeira registrada neste período.
                          </Text>
                        ) : (
                          resumoDev.experiencias.map((e) => (
                            <Text key={e.id} size="sm">
                              {rotuloResultado(e.resultado)}: {e.nome} ·{" "}
                              {rotuloCategoria(e.categoria)} (+
                              {e.estrelasConcedidas} estrelas)
                            </Text>
                          ))
                        )}
                      </Stack>
                    </Card>

                    <Card withBorder padding="md" radius="md">
                      <Stack gap={6}>
                        <Text fw={600}>Categorias exploradas</Text>
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
                    </Card>

                    <Card withBorder padding="md" radius="md">
                      <Stack gap={6}>
                        <Text fw={600}>Estrelas no período</Text>
                        <Text size="sm">
                          Concedidas: {resumoDev.estrelas.concedidasNoPeriodo}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {resumoDev.estrelas.esclarecimento}
                        </Text>
                      </Stack>
                    </Card>

                    <Card withBorder padding="md" radius="md">
                      <Stack gap={6}>
                        <Text fw={600}>Observações da família</Text>
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
                    </Card>
                  </>
                ) : null}

                <Stack gap={6}>
                  <Text size="xs" c="dimmed">
                    A prévia acima é a mesma seleção do PDF. Anexos sensíveis
                    não entram na exportação.
                  </Text>
                  <Button
                    variant="light"
                    loading={exportando}
                    onClick={() => void exportarPdf()}
                  >
                    Exportar PDF
                  </Button>
                  {avisoExport ? (
                    <Text size="xs" c="dimmed">
                      {avisoExport}
                    </Text>
                  ) : null}
                </Stack>

                <Anchor
                  component={Link}
                  href={`/pessoas/${params.pessoaId}/historico`}
                  size="sm"
                >
                  Ver linha do tempo completa
                </Anchor>
              </Stack>
            ) : (
              <EstadoVazio
                titulo="Sem dados neste período"
                descricao="Quando houver relatos, o resumo aparece aqui — sem cobrança."
              />
            )}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
