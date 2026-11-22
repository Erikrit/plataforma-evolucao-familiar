# Expansão dos catálogos (E4 real + E5 digital) — planejamento

**Status:** PLANEJAMENTO SOMENTE · **Aprovação:** L3 Produto **PENDENTE**  
**Demanda de origem:** `COR-UX-EST-HOM-20261122` Etapa B  
**Não implementar** até aprovação expressa do responsável pelo Produto.

> **Frente digital (arquitetura extensível):** consolidada em [`evo-catalogo-jogos-20261122.md`](evo-catalogo-jogos-20261122.md) (`EVO-CATALOGO-JOGOS-20261122`, L3 **PENDENTE**). Este arquivo mantém a expansão de **atividades reais (E4)** e o vínculo histórico; modelo Prisma, motores/renderizadores e CAT-01..05 do catálogo digital deferem ao documento novo.

## Objetivo

Avaliar e especificar a ampliação do catálogo de atividades reais além do limite E4 (24) e o dimensionamento do catálogo digital (~20 entradas por categoria), sem misturar com as correções UX da Etapa A.

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

### 2. Catálogo digital ~20 por categoria

- **Especificação consolidada:** [`evo-catalogo-jogos-20261122.md`](evo-catalogo-jogos-20261122.md) (arquitetura em 4 camadas, Prisma, contratos, CAT-01..05, compatibilidade dos 3 jogos).
- Meta de planejamento: ~20 entradas publicadas por categoria de desenvolvimento, com curadoria progressiva e motores/renderizadores registrados em código.
- Não inventar mecânica nova na primeira expansão de conteúdo; novos motores só via incremento futuro aprovado.
- Cada entrada: título, categoria, faixa orientativa, dificuldade por fase, estado de publicação, versão editorial, refs visuais externas (sem object storage nesta etapa).

### 3. Persistência de metadados editoriais

- Modelo aditivo detalhado no plano EVO (`JogoDigital`, `FaseJogoDigital`, `RecursoVisualJogo`), mantendo `ProgressoFaseJogo` e IDs estáveis.
- Seed e curadoria por scripts revisáveis; publicação controlada (`ativo` / `publicadoEm`).
- Histórico de progresso e descobertas permanece por pessoa; republicação não apaga progresso.

### 4. Curadoria, seed e migração

- Fluxo: rascunho editorial → revisão humana → seed/migração aditiva → smoke → homologação por lote.
- Critérios de aceite por lote: quantidade, categorias cobertas, faixa orientativa documentada, regressão de authz/progresso, sem estrelas digitais novas.

### 5. Expansão progressiva

| Fase | Escopo sugerido | Aceite |
|---|---|---|
| B1 | Decisão L3 de tetos E4 e arquitetura digital (EVO) | Documento(s) aprovado(s) |
| B2 | +N atividades reais curadas (lote 1) | Smoke E4 + homologação parcial |
| B3 | CAT-01..05 do plano EVO (fundação editorial digital) | Smoke E5 + regressão progresso |
| B4 | Lotes de conteúdo digital (~20/categoria) após CAT | Homologação por categoria |

## Impacto / riscos

- **Alto:** volume de conteúdo infantil; privacidade e autorização por pessoa.
- **Médio:** esgotamento de sugestões se o catálogo crescer sem ajustar elegibilidade.
- **Baixo (se aditivo):** quebra de progresso digital se IDs de jogo forem estáveis.

## Encaminhamento

1. Responsável pelo Produto aprova ou ajusta tetos E4 (este doc) e/ou arquitetura digital ([evo-catalogo-jogos-20261122.md](evo-catalogo-jogos-20261122.md)) — L3.
2. Só então: incrementos de implementação separados (reais vs. CAT-*).
3. Etapa A (COR-UX) permanece independente e não bloqueada por esta expansão.

## Fora de escopo explícito

- Geração automática em massa de jogos.
- IA de desenvolvimento/cuidados (E6/E7).
- Mudança de estrelas presenciais ou novas permissões.
