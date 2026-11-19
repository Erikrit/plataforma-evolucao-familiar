# Registro de decisões arquiteturais

Decisões abaixo são direções preliminares aprovadas conceitualmente, não prova de implementação.

| ID | Decisão | Justificativa |
|---|---|---|
| ADR-001 | Monólito modular | Menor operação e acoplamento distribuído |
| ADR-002 | Um PostgreSQL | Modelo relacional e histórico consistente |
| ADR-003 | Next.js + NestJS + Prisma, preliminares | Aderência à experiência tecnológica existente |
| ADR-004 | Arquivos privados compatíveis com S3 | Proteger exames/receitas e não depender de arquivos locais |
| ADR-005 | Pessoas separadas de contas | Pessoas acompanhadas não precisam de login |
| ADR-006 | Autorizações por pessoa/contexto | Restringir colaboradora a dados da Vovó |
| ADR-007 | Prescrição como anexo + horários estruturados | Mínimo preenchimento e lembretes úteis |
| ADR-008 | Estrelas automáticas por participação | Reduzir passos e retirar aprovação manual |
| ADR-009 | Histórico derivado dos registros de origem | Evitar duplicação e recadastro |
| ADR-010 | PDF sob demanda | Evitar duplicação de dados sensíveis |
| ADR-011 | Sem push/esteira de agentes neste repositório inicial | Separação entre concepção de produto e automação (histórico; supersedido por ADR-012 quanto à localização da esteira) |
| ADR-012 | Esteira de desenvolvimento permitida neste repositório | Mantém o mesmo checkout, com separação lógica da documentação funcional do produto; agentes/skills/hooks não alteram requisitos aprovados automaticamente |
| ADR-013 | Disponibilidade atual de brincadeiras/recompensas separada do histórico | Atende CT-20261119-001/002 (DEV-F03/F04/F06 v1.2) com menor adaptação segura sobre o modelo vigente |

## ADR-013 — Disponibilidade atual ≠ histórico (Módulo 03)

**Status:** APROVADA pela Arquitetura (2026-11-19), dentro do escopo funcional L3 já DOCUMENTADO em `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md` v1.2.  
**Referências:** `CT-20261119-001`, `CT-20261119-002`; inspeção `develop` @ `609829ea3a7e6a778722bd9978332879bd82470a`.  
**Não substitui** ADR-008 (estrelas) nem ADR-009 (histórico derivado).

### Problema reconciliado

A implementação vigente trata **Guardadas** (`DesafioGuardado`) como favoritos e permite **múltiplas participações/resgates** sem estado de “disponível para a próxima ocorrência”. A v1.2 exige abas mutuamente exclusivas de **disponibilidade atual** (Explorar/Executadas; Disponíveis/Resgatadas), reativação autorizada sem apagar histórico, e idempotência/concorrência sem débito duplicado.

### Decisão (menor adaptação segura)

1. **Não reutilizar `DesafioGuardado` como Executadas.** Manter a tabela e os endpoints de guardar/retirar para compatibilidade/retenção; não migrar, renomear nem apagar. A UX aprovada deixa de expor Guardadas como aba principal; descarte futuro exige decisão explícita de Produto.
2. **Brincadeiras — estado por `(pessoaId, desafioId)`:** nova entidade mínima `DisponibilidadeDesafio` (nome de implementação livre desde que único por pessoa+desafio) com `disponivelParaNovaParticipacao` (boolean), auditoria leve (`atualizadoEm`, `atualizadoPorId` opcional) e opcionalmente referência à última participação ativa usada na listagem.  
   - Ausência de linha **ou** `disponivel=true` ⇒ Explorar.  
   - `disponivel=false` ⇒ Executadas (exige ao menos uma participação `versaoAtiva`).  
   - `POST participacoes` bem-sucedido (não idempotente) ⇒ `disponivel=false` na mesma transação da participação+estrelas.  
   - Reenvio com a mesma `execucaoChave` ⇒ sem nova transição.  
   - `POST …/disponibilizar` (reativação) ⇒ `disponivel=true` **sem** criar participação nem movimento de estrelas.  
   - Nova participação sem disponibilidade atual ⇒ **409/409-equivalente** (não criar registro).  
   - Correção de participação (`versaoAtiva`/ajuste de estrelas) **não** reabre Explorar por si só.
3. **Migração de brincadeiras:** para cada `(pessoaId, desafioId)` com participação `versaoAtiva`, criar/atualizar disponibilidade `false` (Executadas). Sem participação ⇒ permanece Explorar. Guardados intactos.
4. **Recompensas — ciclo de disponibilidade no próprio `Recompensa`:** campos `disponivelParaResgate` (default `true` em cadastro) e `geracaoDisponibilidade` (inteiro, default `0`). Em `ResgateRecompensa`: persistir `geracaoDisponibilidade` + `@@unique([recompensaId, geracaoDisponibilidade])` e `solicitacaoChave` opcional `@unique` (idempotência de cliente, análogo a `execucaoChave`).  
   - Resgate: exige `ativa && disponivelParaResgate`, saldo suficiente, cria resgate com a geração corrente, débito e `disponivelParaResgate=false` na **mesma** transação (Serializable como hoje).  
   - Disponibilizar novamente: exige item em Resgatadas (`disponivelParaResgate=false`), incrementa `geracaoDisponibilidade`, `disponivelParaResgate=true`; **zero** crédito/estorno.  
   - Retry da mesma `solicitacaoChave` devolve o resgate existente; segunda tentativa na mesma geração falha pela unique (sem segundo débito).
5. **Migração de recompensas:** ordenar resgates existentes por `resgatadoEm`; atribuir gerações `0..n-1`; setar `geracaoDisponibilidade = n-1` (ou `0` se nenhum) e `disponivelParaResgate = (n == 0)`.
6. **Autorização:** reutilizar `responsavel_desenvolvimento` (mesmo gate já usado para cadastro/organização no Módulo 03). **Não** inventar responsabilidade nova nem ampliar quem só não tinha acesso. Listagem/consulta de estados continua no mesmo `podeVerDesenvolvimento`. Endpoints de disponibilizar devem checar o gate no servidor, não só ocultar botão.
7. **Contratos:** estender listagens existentes (`GET …/desafios`, `GET …/recompensas`) com flags/filtros de disponibilidade e metadados de última ocorrência quando úteis; novos `POST` de disponibilizar por pessoa+desafio e por recompensa. Deprecar o uso de `?guardados=` na UX principal sem remover o backend de retenção.
8. **Módulo 04:** continua lendo apenas `participacao_desafio` e `resgate_recompensa` (ADR-009). Disponibilizar **não** gera evento de evolução nem segunda fonte de verdade. Smokes de histórico/resumo/PDF são regressão, não nova feature.

### Lacuna para Produto

Nenhuma lacuna **bloqueante** para iniciar implementação das regras já aprovadas.  
**Confirmação opcional (não bloqueia se silêncio):** se no futuro existir adulto com visão de desenvolvimento **sem** poder organizar, a reativação continuará restrita a `responsavel_desenvolvimento` — não criar permissão implícita mais ampla. Descarte de `DesafioGuardado` permanece **fora** desta ADR.

### Fora desta ADR

Mudança de tabela de estrelas; novo módulo; remoção física de Guardadas; eventos de auditoria no Histórico do Módulo 04 para “disponibilizar”; redesign UX além do necessário aos critérios DEV-F03/F04/F06.

## A validar

- Mecanismo de autenticação e invalidação de sessões.
- Casos-limite e validação técnica da programação de medicamentos: **comportamento funcional do MVP já aprovado na especificação v1.3 do Módulo 02**; não reabrir a regra nem inventar horários clínicos.
- Confiabilidade e canais dos lembretes em dispositivos reais.
- Contratos exatos da API, restrições e política de dados — **parcialmente endereçado por ADR-013 para disponibilidade/reativação; detalhe de payloads na implementação**.
- Necessidade de PWA ou alternativa móvel adicional.
