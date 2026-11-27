import { List, Stack, Text } from "@mantine/core";
import type { DesafioResumo, FichaPadraoAtividade } from "@/lib/api";

/** Ordem e nomes das faixas (D1): iguais às trilhas dos jogos. */
const FAIXAS: { id: keyof NonNullable<FichaPadraoAtividade["seguranca"]>; nome: string }[] = [
  { id: "pequenos", nome: "Pequenos (5–6)" },
  { id: "medios", nome: "Médios (7–9)" },
  { id: "grandes", nome: "Grandes (10–12)" },
];

const ROTULOS_LUGAR: Record<NonNullable<FichaPadraoAtividade["lugar"]>, string> = {
  dentro_de_casa: "Dentro de casa",
  area_externa: "Área externa",
  ambos: "Dentro ou fora de casa",
};

function pessoasTexto(min: number | null | undefined, max: number | null | undefined) {
  if (min == null || max == null) return null;
  return min === max ? `${min} pessoas` : `${min} a ${max} pessoas`;
}

/**
 * Corpo da ficha de uma Atividade Real (M03 §15, ficha padrão): objetivo, passos, materiais,
 * variações, versão sentada e segurança por faixa. Compacta para 320 px: texto pequeno, listas
 * sem recuo extra e rótulos curtos. Personalizadas (sem ficha) mostram só instrução e materiais.
 */
export function FichaAtividade({ atividade }: { atividade: DesafioResumo }) {
  const passos = atividade.passos ?? [];
  const lugarPessoas = [
    atividade.lugar ? ROTULOS_LUGAR[atividade.lugar] : null,
    pessoasTexto(atividade.pessoasMin, atividade.pessoasMax),
  ].filter(Boolean);
  const seguranca = FAIXAS.flatMap((faixa) => {
    const itens = atividade.seguranca?.[faixa.id];
    return itens?.length ? [{ ...faixa, itens }] : [];
  });

  return (
    <Stack gap="xs">
      {atividade.instrucao ? (
        <Text size="sm">{atividade.instrucao}</Text>
      ) : (
        <Text size="sm" c="dimmed">
          Sem instrução escrita — brinquem do jeito que fizer sentido.
        </Text>
      )}
      {lugarPessoas.length ? (
        <Text size="sm" c="dimmed">
          {lugarPessoas.join(" · ")}
        </Text>
      ) : null}

      {passos.length ? (
        <div>
          <Text size="sm" fw={600} component="h3" m={0}>
            Como brincar
          </Text>
          <List type="ordered" size="sm" spacing={4} withPadding>
            {passos.map((passo, indice) => (
              <List.Item key={indice}>{passo}</List.Item>
            ))}
          </List>
        </div>
      ) : null}

      {atividade.materiais ? (
        <Text size="sm">
          <Text span size="sm" fw={600}>
            Materiais:
          </Text>{" "}
          {atividade.materiais}
        </Text>
      ) : null}

      {atividade.variacaoFacil || atividade.variacaoDificil || atividade.adaptacaoSentado ? (
        <Stack gap={4}>
          {atividade.variacaoFacil ? (
            <Text size="sm">
              <Text span size="sm" fw={600}>
                Mais fácil:
              </Text>{" "}
              {atividade.variacaoFacil}
            </Text>
          ) : null}
          {atividade.variacaoDificil ? (
            <Text size="sm">
              <Text span size="sm" fw={600}>
                Mais difícil:
              </Text>{" "}
              {atividade.variacaoDificil}
            </Text>
          ) : null}
          {atividade.adaptacaoSentado ? (
            <Text size="sm">
              <Text span size="sm" fw={600}>
                Sentado:
              </Text>{" "}
              {atividade.adaptacaoSentado}
            </Text>
          ) : null}
        </Stack>
      ) : null}

      {seguranca.length ? (
        <div>
          <Text size="sm" fw={600} component="h3" m={0}>
            Segurança
          </Text>
          <List size="sm" spacing={4} withPadding>
            {seguranca.map((faixa) => (
              <List.Item key={faixa.id}>
                <Text span size="sm" c="dimmed">
                  {faixa.nome}:
                </Text>{" "}
                {faixa.itens.join(" ")}
              </List.Item>
            ))}
          </List>
        </div>
      ) : null}
    </Stack>
  );
}
