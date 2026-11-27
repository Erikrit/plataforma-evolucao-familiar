"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Code,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { ObterDica } from "@/componentes/desenvolvimento/jogos/contrato-tabuleiro";
import { FASE_PROTOTIPO_BARQUINHO } from "@/componentes/desenvolvimento/jogos/barquinho/fase-prototipo-barquinho";
import {
  TabuleiroBarquinho,
  type MedicaoAbertura,
  type MedidorBarquinho,
} from "@/componentes/desenvolvimento/jogos/barquinho/tabuleiro-barquinho";
import type { MedicaoQuadros } from "@/componentes/desenvolvimento/jogos/barquinho/controlador-barquinho";

type Registro = Readonly<{
  abertura: MedicaoAbertura | null;
  quadros: MedicaoQuadros | null;
  concluida: boolean;
}>;

function aparelho() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    navegador: nav.userAgent,
    nucleos: nav.hardwareConcurrency,
    memoriaGb: nav.deviceMemory ?? null,
    densidade: window.devicePixelRatio,
    tela: `${window.innerWidth}x${window.innerHeight}`,
  };
}

/**
 * Bancada de medição do 2D (ticket 10; PixiJS pela ADR-018). A partida usa o mesmo contrato de tabuleiro
 * dos demais jogos: montar, dica sob demanda e aviso de conclusão. Nada é gravado.
 */
export function LaboratorioBarquinho() {
  const [rodada, setRodada] = useState(0);
  const [registro, setRegistro] = useState<Registro>({ abertura: null, quadros: null, concluida: false });
  const [dica, setDica] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [dadosAparelho, setDadosAparelho] = useState<ReturnType<typeof aparelho> | null>(null);
  useEffect(() => setDadosAparelho(aparelho()), []);
  const obterDica = useRef<ObterDica | null>(null);
  const medidor = useRef<MedidorBarquinho | null>(null);

  const registrarObterDica = useCallback((obter: ObterDica | null) => {
    obterDica.current = obter;
  }, []);
  const aoMedidor = useCallback((novo: MedidorBarquinho | null) => {
    medidor.current = novo;
  }, []);
  const aoConcluir = useCallback(() => {
    setRegistro((atual) => ({
      ...atual,
      concluida: true,
      quadros: medidor.current?.medirQuadros() ?? atual.quadros,
    }));
  }, []);
  const aoMedirAbertura = useCallback((abertura: MedicaoAbertura) => {
    setRegistro((atual) => ({ ...atual, abertura }));
  }, []);

  function recomecar() {
    setRegistro({ abertura: null, quadros: null, concluida: false });
    setDica(null);
    setRodada((n) => n + 1);
  }

  const resultado = { ...registro, aparelho: dadosAparelho };

  async function copiar() {
    const quadros = medidor.current?.medirQuadros() ?? registro.quadros;
    const texto = JSON.stringify({ ...resultado, quadros }, null, 2);
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <Container component="main" size="sm" py="md" px="md">
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <Title order={1} size="h3">
            Barquinho no rio · teste 2D
          </Title>
          <Button component={Link} href="/" variant="default" style={{ minHeight: 44 }}>
            Sair
          </Button>
        </Group>
        <Text size="sm" c="dimmed">
          Laboratório da equipe: mede a fase em PixiJS (ADR-018). Nada é gravado.
        </Text>
        <Group gap="xs">
          <Button
            variant="default"
            style={{ minHeight: 44 }}
            onClick={() => setDica(obterDica.current?.() ?? null)}
          >
            Dica
          </Button>
          <Button variant="subtle" style={{ minHeight: 44 }} onClick={recomecar}>
            Recomeçar
          </Button>
        </Group>
        {dica ? (
          <Alert color="blue" role="status">
            {dica}
          </Alert>
        ) : null}

        <TabuleiroBarquinho
          key={rodada}
          fase={FASE_PROTOTIPO_BARQUINHO}
          aoConcluir={aoConcluir}
          registrarObterDica={registrarObterDica}
          aoMedirAbertura={aoMedirAbertura}
          aoMedidor={aoMedidor}
        />

        {registro.concluida ? (
          <Alert color="green" role="status">
            Fase concluída! (no jogo, a partida salva a conclusão no servidor)
          </Alert>
        ) : null}

        <Stack gap="xs">
          <Title order={2} size="h5">
            Medições
          </Title>
          <Code block>{JSON.stringify(resultado, null, 2)}</Code>
          <Button variant="light" onClick={() => void copiar()} style={{ minHeight: 44 }}>
            {copiado ? "Medições copiadas" : "Copiar medições"}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
