---
name: planejar
description: Transforma o alinhamento em spec curta e tickets bala traçante, com costuras e bloqueios.
argument-hint: "demanda ou caminho da especificação"
disable-model-invocation: true
---

# Planejar

Serve também para replanejar após `BLOCKED` ou `NEEDS_DECISION`.

Sintetiza o que já foi decidido; a entrega são documentos, e o código fica para `/implementar`. Decisão em aberto volta para `/sabatina`.

## 1. Reunir

Ler o adaptador (`docs/agents/*`), o trecho da fonte oficial, as ADRs da área e o código tocado. Confirmar versão e status da especificação: o que é aprovado, preliminar ou pendente.

Concluído quando cada requisito da demanda tem ID rastreável e status.

## 2. Mapear dependências e riscos

Outros módulos, autenticação, dados, contratos. Risco **alto** pela lista do adaptador; **médio** para experiência de uso; **baixo** para cosmético.

Concluído quando cada dependência está classificada como pronta, pendente ou bloqueio.

## 3. Acordar as costuras

Preferir **costuras** existentes, na posição mais alta possível; quanto menos, melhor. Para cada uma: o que pega e o que deixa passar. Se a forma da interface está em dúvida, chamar `desenho-modulos`.

Concluído quando o humano confirmou as costuras.

## 4. Escrever a spec

Usar [modelo-spec.md](modelo-spec.md). Referenciar requisitos por ID; a regra continua na fonte oficial.

Concluído quando toda seção do modelo está preenchida ou marcada como não aplicável.

## 5. Fatiar

Cada ticket é uma **bala traçante**: caminho estreito e completo por todas as camadas, verificável sozinho, cabível em uma sessão limpa. Preparação do código vem antes. Declarar bloqueios.

Refatoração ampla e mecânica usa **expandir–migrar–contrair**: criar a forma nova ao lado da antiga, migrar em lotes que fiquem verdes, remover a antiga.

Concluído quando todo requisito está em ao menos um ticket, e todo critério de ticket cita um ID.

## 6. Aprovar e publicar

Mostrar lista numerada: título, bloqueado por, o que entrega, risco. Perguntar sobre granularidade, bloqueios e junções. Iterar até a aprovação e então publicar conforme `docs/agents/rastreador.md`.

Atualizar a `demanda` para `READY` (ou `BLOCKED`/`PENDING` com motivo) e o registro com entrada curta.

Concluída quando os arquivos publicados conferem com a divisão aprovada e o estado aponta o primeiro ticket da fronteira.

## Saída

```markdown
## Planejamento
- demandaId:
- riscos:
- dependências:
- costuras:
- tickets: [{ numero, requisitos, bloqueadoPor, arquivosPrevistos, qg }]
- bloqueios:
- próxima ação: /implementar <primeiro ticket da fronteira>
```
