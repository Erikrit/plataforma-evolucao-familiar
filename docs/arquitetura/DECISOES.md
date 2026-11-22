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
| ADR-014 | Gestão de acessos reutiliza as três responsabilidades contextuais | Atende CT-20261119-003 sem matriz nova, sem papel inédito e com fechamento dos controles de administrador |
| ADR-015 | Autenticação enxuta por sessão/cookie (uso familiar privado) | Fecha a lacuna de “auth definitiva” sem JWT nem arquitetura empresarial; corrige só falhas comprovadas |

## ADR-015 — Autenticação enxuta por sessão/cookie (pré-uso / uso familiar privado)

**Status:** APROVADA pelo responsável do Produto (2026-11-22) e DOCUMENTADA pela Arquitetura.  
**Demanda:** `ESTABILIZACAO-PRE-USO-20261122` · incremento EST-02.  
**Não substitui** ADR-006 (autorização por pessoa/contexto) nem ADR-014 (gestão de acessos).  
**Não altera** requisitos funcionais dos módulos; define o recorte de autenticação para estabilização e uso familiar privado.

### Decisão

1. Manter autenticação por **sessão server-side** com cookie HttpOnly (`pef_sessao`), token opaco armazenado com hash, validade finita e logout/revogação que apagam a sessão no servidor.
2. **Não migrar para JWT** e não introduzir provedor IdP, OAuth obrigatório, SSO ou matriz empresarial de autenticação.
3. Reutilizar as **autorizações contextuais** já existentes (ADR-006 / ADR-014) para isolamento entre famílias e pessoas e para documentos de saúde/dados infantis.
4. Em EST-02 e evoluções de estabilização: **corrigir somente falhas comprovadas** (reproduzidas por teste ou inspeção). Mudança estrutural inevitável exige `NEEDS_DECISION` antes de implementar.

### Controles já previstos pela baseline (não redesenhar)

- Cookie: `httpOnly`, `sameSite=lax`, `secure` quando `COOKIE_SECURE=true`.
- CORS com origem configurável (`WEB_ORIGIN`) e `credentials: true`.
- Guarda de sessão nas rotas privadas; login contextual por slug da família.
- Invalidação de sessões na revogação de autorização (ADR-014).

### Fora desta ADR

JWT; autenticação multi-fator empresarial; redesenho de convites além do escopo E2 homologado; declaração de prontidão de produção (permanece nos critérios de bloqueio da estabilização).

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

## ADR-014 — Gestão de acessos sem matriz nova (Módulo 01)

**Status:** DOCUMENTADA pela Arquitetura (2026-11-19), como reconciliação L2 do `CT-20261119-003` com FUN-03/FUN-04/FUN-07 já aprovados na especificação v1.3.  
**Inspeção:** `develop` @ `efee45267afcfb5f7312b12db268377a1e644dc2`.  
**Não substitui** ADR-006 (autorização por pessoa/contexto) nem a ADR-013 (não criar permissão de desenvolvimento só de leitura).  
**Não altera** a especificação funcional. Remoção ou desativação de pessoa permanece fora. Código de produto não foi modificado neste registro.

### Combinações que os gates já sustentam

A interface continua com três rótulos (Administrador, Responsável, Integrante). Área e responsabilidade de apresentação são só a leitura das responsabilidades técnicas já usadas pelos módulos. Não há quarta opção.

| Área | Responsabilidade na interface | Responsabilidade técnica | Efeito já implementado |
|---|---|---|---|
| Cuidados | Responsável | `responsavel_cuidados` | Ver rotina, registrar, programar, consultar anexo e exportar, só na pessoa-alvo |
| Cuidados | Integrante | `colaboradora_cuidados` | Ver rotina e registrar apoio/dose na pessoa-alvo; sem programação, anexo clínico nem exportação |
| Desenvolvimento | Responsável | `responsavel_desenvolvimento` | Ver, participar, organizar e exportar o desenvolvimento da pessoa-alvo |
| — | Administrador | `administrador` | Metadados da família, pessoas, convites e acessos. Sem conteúdo clínico ou infantil por esse papel |

`participante_limitado` está no enum e passa em `conceder`/`criar` convite, mas nenhum gate de cuidado ou desenvolvimento o consulta. A pessoa-alvo entra em `idsPessoasVisiveis` e pode aparecer no início sem área autorizada. Por isso sai da lista concedível. Integrante em Desenvolvimento não existe: a ADR-013 já manteve organização e reativação em `responsavel_desenvolvimento`. Acesso da própria conta aos próprios dados também não entra no seletor.

A pessoa-alvo pode ser qualquer pessoa da mesma família. O exemplo da colaboradora com a Vovó é o fluxo aprovado, não uma trava extra por tipo de pessoa. Isolar a Laurinha continua sendo consequência de não conceder essa dupla.

### Menor ajuste

1. **Um catálogo, duas pontas.** Centralizar em `responsabilidades.ts` o mapa área + rótulo ↔ responsabilidade técnica e a lista concedível: as três linhas contextuais da tabela. `conceder` e `criar` convite aceitam só essa lista. `administrador` e `participante_limitado` recebem recusa. O corpo atual (`usuarioId`, `responsabilidade`, `pessoaAlvoId`) permanece.
2. **Quem já tem conta** usa `POST /familias/:familiaId/autorizacoes`. **Quem não tem conta** usa o convite já existente, com a mesma lista e a mesma pessoa-alvo. Convite pendente, expirado ou usado continua fora de `GET /acessos`. A ativação segue criando pessoa nova com vínculo `colaboradora`; o rótulo exibido vem da autorização. Ajuste de vínculo continua na pendência já registrada do seletor, fora deste CT.
3. **Escopo na listagem.** `GET /acessos` ganha `area`: `Cuidados`, `Desenvolvimento` ou `null` no administrador. O campo `papel` permanece (`Administrador`, `Responsável`, `Colaborador`); a interface continua traduzindo `Colaborador` para Integrante. A lista administrativa agrupa por pessoa acompanhada e lê “pessoa · área · responsabilidade · ativo”, sem enum cru e sem operação granular.
4. **Participante no seletor.** Para o administrador, a listagem de pessoas passa a incluir `usuarioId` quando a pessoa tem conta. Sem conta, o fluxo segue para convite. Quem não administra não recebe `usuarioId`.
5. **Administrador.** O fluxo genérico não concede esse papel, alinhado ao convite, que já recusa. `revogar` recusa a operação se ela deixasse a família sem administrador ativo; a contagem e a baixa ocorrem na mesma transação. Um administrador excedente, se já existir, pode ser revogado por outro administrador. Revogação de responsabilidade contextual continua como está: inativa a autorização, preserva histórico e apaga as sessões daquele usuário. No próximo login, as autorizações restantes valem porque os gates leem o banco, não a sessão.
6. **O que não criar.** Sem tabela de permissão, sem papel novo, sem endpoint paralelo e sem checagem só na interface. URL direta e outra família continuam nos gates já existentes (`podeVerCuidados`, `podeVerDesenvolvimento` e `garantirFamilia`).

### Classificação dos achados

- **Lacuna de UX:** a aba Acessos concede desenvolvimento só à própria conta, o convite fixa `colaboradora_cuidados` e a lista não mostra a área. O rótulo Integrante já existe na interface.
- **Limitação funcional:** o serviço aceita qualquer responsabilidade do enum, inclusive as que não abrem área; a ativação de convite não vincula pessoa já cadastrada.
- **Falha de controle, confirmada por inspeção:** `conceder` aceita `administrador`; `revogar` aceita remover administrador, e o botão oculto na interface não impede o `DELETE`. A suíte `smoke-authz-critico` já cobre administrador sem acesso clínico, colaboradora isolada na pessoa autorizada e sessão invalidada na revogação dela. Essa suíte não cobre concessão nem preservação do último administrador. Nesta etapa a API não foi chamada de novo.

### Lacuna para Produto

Nenhuma decisão funcional nova. As três combinações e a separação do administrador já estão na especificação v1.3 e nos gates. Sucessão de administrador e Integrante em Desenvolvimento ficam fora até uma decisão L3 explícita. Exclusão de pessoa não entra neste CT.

### Fora desta ADR

Layout móvel/desktop da aba, texto final da confirmação, seletor de vínculo, remoção de pessoa e revisão de autenticação para produção.

## A validar

- Revisão de autenticação para produção e dispositivos reais: recorte de produto fechado pela **ADR-015** (sessão/cookie enxuta, sem JWT). Invalidação de sessão na revogação e catálogo fechado de concessão permanecem na ADR-014; a suíte existente ainda não cobre o último administrador. Gaps operacionais (ex.: limite de tentativas de login, HTTPS/`COOKIE_SECURE` no ambiente alvo) seguem na estabilização EST-02/EST-04, sem redesenho.
- Casos-limite e validação técnica da programação de medicamentos: **comportamento funcional do MVP já aprovado na especificação v1.3 do Módulo 02**; não reabrir a regra nem inventar horários clínicos.
- Confiabilidade e canais dos lembretes em dispositivos reais.
- Contratos exatos da API, restrições e política de dados — **parcialmente endereçado por ADR-013 para disponibilidade/reativação; detalhe de payloads na implementação**.
- Necessidade de PWA ou alternativa móvel adicional.

## Esclarecimento da ADR-014 após decisão de Produto — 2026-11-20

**Referência funcional:** Módulo 01 v1.5, seção 11. **Base estática:** develop @ 89f47d38a5b6e5d05f8145545bfc6b2327f98db8.

Produto informou que o sistema ainda não possui usuários em utilização e dispensou o tratamento de contas legadas nesta entrega. Preservar o modelo Pessoa/Usuario e o catálogo fechado da ADR-014 no fluxo ordinário de novos cadastros e eventual ativação. Ao habilitar conta da pessoa cadastrada na jornada, manter o mesmo pessoaId e distinguir essa identidade da pessoa-alvo do acompanhamento. Não criar procedimento de migração ou reconciliação de contas como pré-condição desta demanda.

Produto decidiu manter o autoacompanhamento exatamente conforme as capacidades atuais. Consulta própria e relato próprio já possuem controles específicos; programação/organização de consultas e exportação de Cuidados dependem de responsabilidade contextual. Preservar os controles das demais operações. O mapa funcional de referência fica na especificação v1.5.

A navegação deve obter contextos a partir de capacidades efetivas do servidor, incluindo acessos próprios, e usar uma única representação para menu, ações e entrada pós-login. Reutilizar os contratos atuais quando suficientes. Se faltar capacidade de representação, aplicar o menor ajuste contratual mantendo a autorização no servidor.

Esta atualização documenta o fechamento funcional e a orientação técnica para execução. A implementação e a validação dinâmica pertencem à próxima demanda da esteira.
