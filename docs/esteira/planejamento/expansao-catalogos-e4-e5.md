# Expansão dos catálogos (E4 real + E5 digital) — planejamento

**Status:** PLANEJAMENTO SOMENTE · **Aprovação da expansão E4:** L3 Produto **PENDENTE**

**Demanda de origem:** `COR-UX-EST-HOM-20261122` Etapa B  
A expansão E4 aguarda aprovação expressa. A ampliação digital da V1 foi aprovada em 2026-11-22 e segue o plano EVO.

**Frente digital:** [EVO-CATALOGO-JOGOS-20261122](evo-catalogo-jogos-20261122.md) é a referência para os oito jogos, a persistência em PostgreSQL e os incrementos CAT.

## Objetivo

Avaliar e especificar a ampliação do catálogo de atividades reais além do limite E4 (24), sem misturar com as correções UX da Etapa A.

## Restrições preservadas

- Não gerar 120 jogos automaticamente nem conteúdo sem validação editorial.
- Não usar idade como diagnóstico ou julgamento (faixa apenas orientativa).
- Sem IA, novas permissões ou gamificação extra.
- Não alterar tabela de estrelas das atividades reais (DEV-F05).
- Preservar histórico, progresso por pessoa, autorização e idempotência.
- Migração **aditiva**; sem reset destrutivo de dados de uso.

## Situação atual (baseline)

| Frente | Limite vigente | Persistência | Observação |
|---|---|---|---|
| Atividades reais (E4) | até 24 ativos, 6 sugestões, renovar até 3 | `Desafio` + `SugestaoDesafioPessoa` | Seed `catalogo-biblioteca-e4` |
| Jogos digitais (E5) | 3 jogos × 5 fases (mecânicas memória/sequência/labirinto) | Catálogo em código + `progresso_fase_jogo` | Sem metadados editoriais no banco |

## Proposta funcional (para aprovação L3)

### 1. Catálogo real além do E4

- Elevar teto de modelos ativos publicados em faixas progressivas (ex.: 24 → 36 → 48), com curadoria humana por lote.
- Manter sugestões ≤ 6 e renovação ≤ 3 até nova decisão; esgotamento continua mensagem neutra.
- Faixa etária orientativa, dificuldade, categoria, publicação (`ativo`) e `versaoConteudo` já existentes — reutilizar.

### 2. Relação com o lançamento

A V1 conserva os 24 modelos E4, até seis sugestões e renovação de até três. A revisão desse teto fica para etapa própria após a V1. A carga oficial deve incluir o catálogo E4 existente e o catálogo digital aprovado. Critérios de curadoria e homologação dos jogos constam no plano EVO.

## Impacto / riscos

- **Alto:** volume de conteúdo infantil; privacidade e autorização por pessoa.
- **Médio:** esgotamento de sugestões se o catálogo crescer sem ajustar elegibilidade.
- **Baixo (se aditivo):** quebra de progresso digital se IDs de jogo forem estáveis.

## Encaminhamento

1. Preparar a carga oficial dos 24 modelos atuais no CAT-01.
2. Avaliar um lote futuro de atividades reais com aprovação de Produto e verificação dos limites.
3. Preservar os aceites da Etapa A (COR-UX).

## Fora de escopo explícito

- Geração automática em massa de jogos.
- IA de desenvolvimento/cuidados (E6/E7).
- Mudança de estrelas presenciais ou novas permissões.
