# Roteiro de homologação humana — DEM-E4-BIBLIOTECA

**Demanda:** DEM-E4-BIBLIOTECA-20261122  
**Critério humano:** E4-HOM  
**Escopo:** biblioteca curada, sugestões (até 6), escolher/manter, renovar (até 3), regressão Explorar/Executadas/estrelas/histórico.  
**Ambiente:** app local (`apps/web` + `apps/api`), celular em prioridade.  
**Dados:** apenas fictícios.

## Antes de começar

1. API e web locais no ar; catálogo E4 aplicado (seed ou smoke).
2. Duas famílias de teste, cada uma com responsável de Desenvolvimento sobre uma pessoa.
3. Conta só com ver Desenvolvimento (sem organização), se possível.
4. Anote o saldo de estrelas antes de escolher/renovar.

## Percurso principal (E4-HOM)

| # | Passo | Esperado |
|---|---|---|
| 1 | Abrir Desenvolvimento da pessoa no celular | Seção **Sugestões para esta pessoa** com até 6 itens; instrução/materiais legíveis |
| 2 | Abrir uma sugestão | Entende o que fazer; sem cobrança nem pontos só por abrir |
| 3 | **Escolher para experimentar** (responsável) | Item marcado como escolhida; outro responsável da mesma pessoa vê o mesmo estado |
| 4 | **Renovar sugestões** | Até 3 não escolhidas mudam; a escolhida permanece; saldo de estrelas inalterado |
| 5 | Sem novas opções (renovar de novo se preciso) | Mensagem neutra “Não há novas sugestões…”; seleção preservada |
| 6 | Registrar Participou/Concluiu pela sugestão ou Explorar | Estrelas conforme tabela vigente; item vai para **Executadas** |
| 7 | Conferir Explorar / Executadas | Regras DEV-F03 intactas; renovar **não** devolve item à Explorar |
| 8 | Disponibilizar novamente e participar de novo | Fluxo antigo funciona; histórico/PDF (se usar) mostram o nome da execução |
| 9 | Família B | Não vê sugestões/escolhas da família A |
| 10 | **Ver biblioteca** | Vai à lista Explorar existente; filtros de categoria; sem menu global novo |

## Critérios a marcar

- [ ] E4-ACE-01..07 (humano + técnico)
- [ ] E4-HOM — escolher → renovar preservando escolha → participar → Executadas → disponibilizar novamente; duas famílias; estrelas/histórico ok

## Fora do aceite

IA/internet em tempo real, jogos digitais (E5), nova tabela de estrelas, publicação automática, correção de anexos E3, commit/push/deploy nesta homologação.
