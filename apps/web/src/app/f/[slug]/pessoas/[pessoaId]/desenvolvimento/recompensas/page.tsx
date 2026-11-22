"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Container, Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import {
  EstadoCarregando,
  EstadoVazio,
  MensagemFeedback,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import {
  disponibilizarRecompensa,
  listarRecompensas,
  obterEstrelas,
  resgatarRecompensa,
  type EstrelasResumo,
  type RecompensaResumo,
} from "@/lib/api";
import { novaChaveOperacao } from "@/lib/chave-operacao";

type Filtro = "disponiveis" | "resgatadas";

function formatarEstrelas(quantidade: number): string {
  return `${quantidade} ${quantidade === 1 ? "estrela" : "estrelas"}`;
}

export default function PaginaRecompensas() {
  const { pessoaId, nomePessoa, podeOrganizar } = useDesenvolvimento();
  const [filtro, setFiltro] = useState<Filtro>("disponiveis");
  const [lista, setLista] = useState<{ saldo: EstrelasResumo; recompensas: RecompensaResumo[] } | null>(null);
  const [erroLista, setErroLista] = useState<string | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [confirmacao, setConfirmacao] = useState<{ recompensa: RecompensaResumo; chave: string } | null>(null);
  const [enviandoId, setEnviandoId] = useState<string | null>(null);
  const consulta = useRef(0);

  const carregar = useCallback(async () => {
    const id = ++consulta.current;
    setErroLista(null);
    try {
      const [saldo, recompensas] = await Promise.all([
        obterEstrelas(pessoaId),
        listarRecompensas(pessoaId, { disponibilidade: filtro }),
      ]);
      if (id === consulta.current) {
        setLista({ saldo, recompensas: recompensas.filter((r) => r.ativa !== false) });
      }
    } catch (erro) {
      if (id === consulta.current) {
        setErroLista(mensagemErroAmigavel(erro, "Não foi possível carregar as recompensas."));
      }
    }
  }, [pessoaId, filtro]);

  useEffect(() => {
    void carregar();
    return () => { consulta.current += 1; };
  }, [carregar]);

  async function confirmarResgate() {
    if (!confirmacao || enviandoId) return;
    const { recompensa, chave } = confirmacao;
    setErroAcao(null);
    setSucesso(null);
    setEnviandoId(recompensa.id);
    try {
      await resgatarRecompensa(pessoaId, recompensa.id, chave);
      setConfirmacao(null);
      setSucesso(`Resgate de “${recompensa.nome}” confirmado.`);
      setLista(null);
      await carregar();
    } catch (erro) {
      setErroAcao(mensagemErroAmigavel(erro, "Não foi possível confirmar o resgate."));
    } finally {
      setEnviandoId(null);
    }
  }

  async function disponibilizar(recompensa: RecompensaResumo) {
    if (!podeOrganizar || enviandoId) return;
    setErroAcao(null);
    setSucesso(null);
    setEnviandoId(recompensa.id);
    try {
      await disponibilizarRecompensa(pessoaId, recompensa.id);
      setSucesso(`“${recompensa.nome}” disponível para novo resgate.`);
      setLista(null);
      await carregar();
    } catch (erro) {
      setErroAcao(mensagemErroAmigavel(erro, "Não foi possível disponibilizar a recompensa."));
    } finally {
      setEnviandoId(null);
    }
  }

  return (
    <Container size="sm" px={0}>
      <Stack gap="lg">
        <Title order={1}>Recompensas · {nomePessoa}</Title>
        {lista ? (
          <Text size="sm" aria-live="polite">
            Saldo disponível: {lista.saldo.saldoDisponivel} · Total conquistado: {lista.saldo.totalConquistado}
          </Text>
        ) : null}
        <SegmentedControl
          fullWidth
          aria-label="Lista de recompensas"
          value={filtro}
          disabled={Boolean(enviandoId)}
          onChange={(valor) => {
            consulta.current += 1;
            setLista(null);
            setConfirmacao(null);
            setErroLista(null);
            setErroAcao(null);
            setFiltro(valor as Filtro);
          }}
          data={[
            { label: "Disponíveis", value: "disponiveis" },
            { label: "Resgatadas", value: "resgatadas" },
          ]}
        />
        <MensagemFeedback erro={erroAcao} sucesso={sucesso} />
        {erroLista ? (
          <Stack align="flex-start">
            <EstadoVazio titulo="Recompensas indisponíveis" descricao={erroLista} />
            <Button variant="light" onClick={() => void carregar()}>Tentar novamente</Button>
          </Stack>
        ) : !lista ? (
          <EstadoCarregando rotulo="Carregando recompensas…" />
        ) : lista.recompensas.length === 0 ? (
          <EstadoVazio titulo={filtro === "disponiveis" ? "Nenhuma recompensa disponível" : "Nenhum resgate ainda"} />
        ) : (
          lista.recompensas.map((recompensa) => {
            const confirmando = confirmacao?.recompensa.id === recompensa.id;
            const saldoInsuficiente = lista.saldo.saldoDisponivel < recompensa.custo;
            return (
              <Card key={recompensa.id} withBorder padding="md">
                <Stack gap="sm" align="flex-start">
                  <Title order={2} size="h4">{recompensa.nome}</Title>
                  <Text size="sm">{formatarEstrelas(recompensa.custo)}</Text>
                  {recompensa.ultimoResgate ? (
                    <Text size="sm" c="dimmed">
                      Último resgate: {formatarEstrelas(recompensa.ultimoResgate.custoAplicado)}
                    </Text>
                  ) : null}
                  {filtro === "disponiveis" ? (
                    confirmando ? (
                      <Stack gap="xs">
                        <Text size="sm">Usar {formatarEstrelas(recompensa.custo)} neste resgate?</Text>
                        <Group gap="xs">
                          <Button size="sm" loading={enviandoId === recompensa.id} onClick={() => void confirmarResgate()}>
                            Confirmar resgate
                          </Button>
                          <Button size="sm" variant="subtle" disabled={Boolean(enviandoId)} onClick={() => setConfirmacao(null)}>
                            Cancelar
                          </Button>
                        </Group>
                      </Stack>
                    ) : (
                      <Button
                        size="sm"
                        disabled={saldoInsuficiente || Boolean(enviandoId)}
                        onClick={() => {
                          setErroAcao(null);
                          setConfirmacao({ recompensa, chave: novaChaveOperacao() });
                        }}
                      >
                        {saldoInsuficiente ? "Saldo insuficiente" : "Resgatar"}
                      </Button>
                    )
                  ) : podeOrganizar ? (
                    <Button size="sm" variant="light" loading={enviandoId === recompensa.id} disabled={Boolean(enviandoId && enviandoId !== recompensa.id)} onClick={() => void disponibilizar(recompensa)}>
                      Disponibilizar novamente
                    </Button>
                  ) : null}
                </Stack>
              </Card>
            );
          })
        )}
      </Stack>
    </Container>
  );
}
