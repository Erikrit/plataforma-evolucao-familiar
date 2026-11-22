"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { rotaFamilia } from "@/lib/rotas-familia";
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
import { useSessao } from "@/componentes/contexto-sessao";
import {
  EstadoCarregando,
  MensagemFeedback,
  mensagemErroAmigavel,
} from "@/componentes/feedback";
import {
  criarDesafioPersonalizado,
  criarRecompensa,
  obterPessoa,
} from "@/lib/api";
import {
  podeOrganizarDesenvolvimento,
  ROTULOS_CATEGORIA_DESENVOLVIMENTO,
} from "@/lib/rotulos-experiencia";

const OPCOES_CATEGORIA = Object.entries(ROTULOS_CATEGORIA_DESENVOLVIMENTO).map(
  ([value, label]) => ({ value, label }),
);

export default function PaginaCadastrosDesenvolvimento() {
  const params = useParams<{ slug: string; pessoaId: string }>();
  const router = useRouter();
  const { usuario, autorizacoes, pronto } = useSessao();
  const [nomePessoa, setNomePessoa] = useState("");
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [carregando, setCarregando] = useState(true);
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

  const podeOrganizar = podeOrganizarDesenvolvimento(
    params.pessoaId,
    usuario?.pessoa.id,
    autorizacoes,
  );

  useEffect(() => {
    if (!pronto) return;
    void (async () => {
      setCarregando(true);
      setErro(null);
      setAcessoLiberado(false);
      try {
        if (!usuario) {
          setErro("Entre na página inicial para ver o desenvolvimento.");
          return;
        }
        const perfil = (await obterPessoa(
          usuario.pessoa.familiaId,
          params.pessoaId,
        )) as { nome: string; areas?: { id: string; disponivel: boolean }[] };
        setNomePessoa(perfil.nome);
        const area = perfil.areas?.find((a) => a.id === "desenvolvimento");
        if (!area?.disponivel || !podeOrganizar) {
          setErro("Acesso negado aos cadastros do desenvolvimento desta pessoa.");
          return;
        }
        setAcessoLiberado(true);
      } catch (e) {
        setErro(mensagemErroAmigavel(e, "Não foi possível carregar"));
      } finally {
        setCarregando(false);
      }
    })();
  }, [pronto, usuario, params.pessoaId, podeOrganizar]);

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
      await criarDesafioPersonalizado(params.pessoaId, {
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
      await criarRecompensa(params.pessoaId, {
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

  const podeVer = Boolean(usuario) && !carregando && acessoLiberado;

  return (
    <Container component="main" size="sm" px={0}>
      <Stack gap="lg">
        <Title order={1}>
          Cadastros{nomePessoa ? ` · ${nomePessoa}` : ""}
        </Title>

        {!pronto || carregando ? <EstadoCarregando /> : null}

        <MensagemFeedback erro={erro} sucesso={sucesso} />

        {pronto && !carregando && !usuario ? (
          <Button variant="light" onClick={() => router.push(rotaFamilia(String(params.slug ?? ""), "/entrar"))}>
            Ir para entrar
          </Button>
        ) : null}

        {podeVer ? (
          <>
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
          </>
        ) : null}
      </Stack>
    </Container>
  );
}
