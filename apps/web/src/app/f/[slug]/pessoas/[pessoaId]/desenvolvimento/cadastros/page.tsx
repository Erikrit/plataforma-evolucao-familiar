"use client";

import { type FormEvent, useState } from "react";
import {
  Button,
  Card,
  Container,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useDesenvolvimento } from "@/componentes/contexto-desenvolvimento";
import {
  EstadoVazio,
  MensagemFeedback,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import {
  criarDesafioPersonalizado,
  criarRecompensa,
} from "@/lib/api";
import {
  ROTULOS_CATEGORIA_DESENVOLVIMENTO,
} from "@/lib/rotulos-experiencia";

const OPCOES_CATEGORIA = Object.entries(ROTULOS_CATEGORIA_DESENVOLVIMENTO).map(
  ([value, label]) => ({ value, label }),
);

export default function PaginaCadastrosDesenvolvimento() {
  const { pessoaId, nomePessoa, podeOrganizar } = useDesenvolvimento();
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [nomeNova, setNomeNova] = useState("");
  const [dificuldadeNova, setDificuldadeNova] = useState("simples");
  const [categoriaNova, setCategoriaNova] = useState<string | null>(null);
  const [instrucaoNova, setInstrucaoNova] = useState("");
  const [enviandoCriacao, setEnviandoCriacao] = useState(false);
  const [nomeRecompensa, setNomeRecompensa] = useState("");
  const [custoRecompensa, setCustoRecompensa] = useState<number | string>(5);
  const [enviandoRecompensa, setEnviandoRecompensa] = useState(false);

  async function aoCriar(evento: FormEvent) {
    evento.preventDefault();
    if (!podeOrganizar || enviandoCriacao) return;
    if (!nomeNova.trim()) {
      setErro("Informe o nome da brincadeira.");
      return;
    }
    setEnviandoCriacao(true);
    setErro(null);
    setSucesso(null);
    try {
      await criarDesafioPersonalizado(pessoaId, {
        nome: nomeNova.trim(),
        dificuldade: dificuldadeNova,
        categoria: categoriaNova,
        instrucao: instrucaoNova.trim() || null,
      });
      setNomeNova("");
      setInstrucaoNova("");
      setDificuldadeNova("simples");
      setCategoriaNova(null);
      setSucesso("Brincadeira salva. Ela aparece em Explorar.");
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível salvar"));
    } finally {
      setEnviandoCriacao(false);
    }
  }

  async function aoCriarRecompensa(evento: FormEvent) {
    evento.preventDefault();
    if (!podeOrganizar || enviandoRecompensa) return;
    const custo = Number(custoRecompensa);
    if (!nomeRecompensa.trim()) {
      setErro("Informe o nome da recompensa.");
      return;
    }
    if (!Number.isInteger(custo) || custo <= 0) {
      setErro("Informe um custo em estrelas (número inteiro positivo).");
      return;
    }
    setEnviandoRecompensa(true);
    setErro(null);
    setSucesso(null);
    try {
      await criarRecompensa(pessoaId, {
        nome: nomeRecompensa.trim(),
        custo,
      });
      setNomeRecompensa("");
      setCustoRecompensa(5);
      setSucesso("Recompensa adicionada. Ela aparece em Recompensas.");
    } catch (e) {
      setErro(mensagemErroAmigavel(e, "Não foi possível salvar"));
    } finally {
      setEnviandoRecompensa(false);
    }
  }


  if (!podeOrganizar) {
    return <EstadoVazio titulo="Acesso aos cadastros indisponível" />;
  }

  return (
    <Container size="sm" px={0}>
      <Stack gap="lg">
        <Title order={1}>Cadastros · {nomePessoa}</Title>
        <MensagemFeedback erro={erro} sucesso={sucesso} />
        <Card withBorder padding="md" radius="md">
          <form onSubmit={aoCriar}>
            <Stack gap="sm">
              <Title order={2}>Nova brincadeira</Title>
              <TextInput
                label="Nome"
                value={nomeNova}
                onChange={(e) => setNomeNova(e.currentTarget.value)}
                required
              />
              <Stack gap={4}>
                <Text size="sm" fw={500} id="rotulo-dificuldade">
                  Dificuldade
                </Text>
                <SegmentedControl
                  fullWidth
                  aria-labelledby="rotulo-dificuldade"
                  value={dificuldadeNova}
                  onChange={setDificuldadeNova}
                  data={[
                    { label: "Simples", value: "simples" },
                    { label: "Média", value: "media" },
                    { label: "Desafiadora", value: "desafiadora" },
                  ]}
                />
              </Stack>
              <Select
                label="Categoria"
                description="Opcional"
                placeholder="Sem categoria"
                data={OPCOES_CATEGORIA}
                value={categoriaNova}
                onChange={setCategoriaNova}
                clearable
                allowDeselect
              />
              <Textarea
                label="Como brincar"
                description="Opcional"
                value={instrucaoNova}
                onChange={(e) => setInstrucaoNova(e.currentTarget.value)}
                minRows={2}
                autosize
              />
              <Button type="submit" loading={enviandoCriacao}>
                Salvar brincadeira
              </Button>
            </Stack>
          </form>
        </Card>

        <Card withBorder padding="md" radius="md">
          <form onSubmit={aoCriarRecompensa}>
            <Stack gap="sm">
              <Title order={2}>Nova recompensa</Title>
              <TextInput
                label="Nome"
                value={nomeRecompensa}
                onChange={(e) => setNomeRecompensa(e.currentTarget.value)}
                required
              />
              <NumberInput
                label="Custo em estrelas"
                min={1}
                step={1}
                value={custoRecompensa}
                onChange={setCustoRecompensa}
              />
              <Button type="submit" loading={enviandoRecompensa}>
                Adicionar recompensa
              </Button>
            </Stack>
          </form>
        </Card>
      </Stack>
    </Container>
  );
}
