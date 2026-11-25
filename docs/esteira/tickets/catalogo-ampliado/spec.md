# Catálogo ampliado — Marco 1, fundação

**Demanda:** `DEV-CAT-M1` · **Tipo:** transversal · **Origem:** humano · **Status:** READY — divisão aprovada pelo responsável pelo Produto em 2026-11-25; tickets 05, 07 e 10 em NEEDS_DECISION até D1 a D3.

## Problema

O catálogo atual (24 atividades, 8 jogos e 40 fases) tem pouca variedade, progressão curta e erros de curadoria: rótulos que entregam a resposta, emoji que não corresponde ao nome, dificuldade que não cresce e dica que não acompanha a partida. A família de uma criança de 5 a 12 anos esgota o conteúdo rápido, e o processo atual não detecta esses erros antes de publicar.

## Solução

A Biblioteca abre na faixa etária da pessoa (Pequenos, Médios ou Grandes). Cada jogo tem três trilhas de cinco fases, com dificuldade crescente medida por verificador. Atividades Reais oferecem até cinco sugestões. A área Números entra nos filtros. O conteúdo só é publicado se passar pela régua de qualidade do Módulo 03 §15. Esta demanda constrói a fundação e refaz os 8 jogos atuais; os 12 jogos novos e as 60 atividades formam a demanda seguinte do Marco 1.

## Requisitos

- DEV-CAT-P01 — M03 §15, definição de jogo — APROVADO
- DEV-CAT-P02 — M03 §15, faixas 5–12 — APROVADO; limites internos PENDENTE (D1)
- DEV-CAT-P03 — M03 §15, três trilhas de cinco fases — APROVADO
- DEV-CAT-P04 — M03 §15, visibilidade por faixa e Ver outras faixas — APROVADO
- DEV-CAT-P05 e FF-NASC-ACE-01 a 04 — M03 §15 e M01 §16, data de nascimento — APROVADO
- DEV-CAT-P06 — M03 §15, mudança de faixa — APROVADO
- DEV-CAT-P07 — M03 §15, leitura pelo adulto, sem narração — APROVADO
- DEV-CAT-P08 — M03 §15, área Números — APROVADO
- DEV-CAT-P09 — M03 §15, até cinco sugestões — APROVADO
- Régua de qualidade — M03 §15 — APROVADO
- E5-F01 a F08 e E5-ACE-02 a 12 não substituídos — M03 §13 — vigentes

## Decisões pendentes

- **D1:** limites das faixas (proposta 5–6, 7–9, 10–12). Bloqueia o ticket 05.
- **D2:** atividades para adultos e idosos permanecem no catálogo fora das faixas infantis? Bloqueia o ticket 07.
- **D3:** origem das ilustrações (SVG próprio ou base licenciada, como Twemoji CC-BY ou OpenMoji CC-BY-SA, após conferir a licença). Bloqueia o ticket 10.

## Decisões de implementação

### ADR-017 — Catálogo ampliado de jogos e atividades (PROPOSTA, 2026-11-25)

**Status:** proposta técnica para revisão de Arquitetura. **Referência funcional:** Módulo 03 v1.8, seção 15; Módulo 01 v1.10, seção 16. **Base estática:** develop @ 3af08c06ed96f4accf6cb16f480f65030016b1b6. Entra em `DECISOES.md` só depois de aprovada (ver `docs/agents/dominio.md`).

#### Contexto

Hoje a carga oficial e as checagens fixam 24 atividades, 8 jogos e 40 fases (`carga-oficial.mjs`, `check-e5`, `check-cat-03`, `check-cat-04`). As fases vão de 1 a 5 e o conteúdo é escrito à mão, sem verificação de progressão. O `check-e5` valida uma cópia antiga do piloto (`src/desenvolvimento/jogos/catalogo-jogos.ts`), não o catálogo carregado.

#### Proposta

1. **Trilhas sem mudar a chave do progresso.** Manter `ProgressoFaseJogo` com a chave família/pessoa/jogo/fase e numerar as fases de 1 a 15: 1–5 Pequenos, 6–10 Médios, 11–15 Grandes. Acrescentar a `FaseJogoDigital` um campo editorial `trilha`, conferido contra o número da fase. As descobertas existentes das fases 1–5 continuam válidas. Como os dados de teste da V1 podem ser recriados, a migração pode reiniciar o progresso de teste, desde que seja versionada e reproduzível numa instalação do zero.
2. **Faixa calculada no servidor.** A faixa padrão vem de `Pessoa.dataNascimento` na data da consulta. A API de jogos e de sugestões recebe a faixa pedida (padrão ou outra escolhida) e continua aplicando a autorização por operação.
3. **Data de nascimento.** Obrigatória na concessão de Desenvolvimento e verificada nas rotas de Desenvolvimento. A coluna continua opcional no banco, porque Cuidados não exige.
4. **Categoria Números.** Acrescentar `numeros` a `CATEGORIAS_BIBLIOTECA`, aos filtros da web e às leituras do Módulo 04. Os registros históricos guardam a categoria no momento da conclusão.
5. **Limites.** `LIMITE_SUGESTOES_PESSOA` e `LIMITE_RENOVAR_SUGESTOES` passam a 5. O teto editorial de 24 e os totais fixos da carga dão lugar a contagens por marco declaradas no catálogo.
6. **Conteúdo e verificação.** Cada motor declara as métricas de dificuldade dele. Um verificador comum confere solução, resposta única, progressão crescente, correspondência entre nome e figura, sobreposição de variantes e ausência de rótulo que entregue a resposta. A carga oficial recusa um catálogo reprovado. O `check-e5` passa a ler o catálogo carregado.
7. **Contrato de jogo na web.** Cada tabuleiro implementa um contrato único (montar, dica sob demanda recalculada, avisar conclusão). Isso prepara o teste 2D sem alterar os contratos de servidor de início, conclusão e versão.
8. **Ilustrações próprias.** Substituir gradualmente emoji por SVG próprio ou licenciado, com origem registrada, servido pela própria plataforma.

#### Pendências

Custos de bundle e desempenho do 2D só serão medidos no teste posterior ao Marco 1. O formato exato do conteúdo e a lista de motores do Marco 1 serão definidos no planejamento do incremento.

## Costuras e testes

| Costura | Pega | Deixa passar | Testes semelhantes |
|---|---|---|---|
| Verificador de catálogo (script, sem banco) | Fase sem solução, mais de uma resposta, progressão que não cresce, rótulo que entrega resposta, nome e figura divergentes, variantes repetidas | Clareza percebida pela criança | `check:e5`, `check:cat-03`, `check:cat-04` |
| Carga oficial em banco descartável | Totais, idempotência, trilha coerente com o número da fase | Experiência na tela | carga oficial executada duas vezes |
| API de jogos e sugestões (smoke) | Faixa calculada, Ver outras faixas, autorização, isolamento, data de nascimento obrigatória, cinco sugestões | Leiaute | `smoke:e5`, `smoke:e4`, `smoke:authz` |
| Contrato de tabuleiro na web | Dica recalculada no estado atual, conclusão única | Legibilidade real em aparelho | `check:e5` (destaques) |
| Homologação humana no celular | Clareza, ritmo, legibilidade em 320 px | — | roteiro CAT-HOM (snapshot `f58d029`) |

## Riscos e dependências

- **Alto:** persistência (migração de `FaseJogoDigital` e data de nascimento), criança e autorização. As checagens críticas de `esteira.config.json` (`smoke:authz`) são obrigatórias nos tickets 03, 04, 05 e 07.
- Dados gravados nos bancos descartáveis de desenvolvimento e homologação podem ser recriados; o banco da VPS nunca é apagado nem recriado automaticamente.
- Depende do aceite da demanda `EST-V2-CLAUDE-CODE`, ativa em `atual.json`. A triagem formal de `DEV-CAT-M1` entra no estado quando ela for encerrada.

## Fora do escopo

Os 12 jogos novos e as 60 atividades do Marco 1 (próxima demanda), 2D, narração por voz, ranking, metas, notificações, avaliação cognitiva, IA na partida, anúncios e multijogador.
