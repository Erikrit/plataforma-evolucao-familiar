# Registro da esteira

## EVO-CATALOGO-JOGOS-20261122 — CAT-HOM APROVADA

- **Origem:** responsável do Produto nesta conversa (“aprovado”), após CAT-01..05 técnicos + QG-3.
- **Resultado:** **CAT-HOM APROVADA** · demanda **HOMOLOGADA**. Evidência: [JSON](estado/evidencia-cat-hom-20261122.json) · [roteiro](estado/roteiro-homologacao-cat-hom.md).
- **Catálogo:** 24 modelos E4 + **8 jogos / 40 fases** E5.
- **Não autorizado por este aceite:** publicação para uso real; deploy/push/PR; E6/E7; encerramento automático dos gaps EST-02 / restore VPS.
- **Próximo:** se rumo a uso real, tratar bloqueios operacionais restantes e exigir **autorização explícita de publicação**. Sem commit/push/deploy automático.

## EVO-CATALOGO-JOGOS-20261122 — CAT-05 (QG-3 + roteiro CAT-HOM)

- **Estado técnico:** COMPLETED (local, sem commit/push). **CAT-HOM:** PENDING_HUMAN. Publicação **não** autorizada.
- **Entrega:** QG-3 de regressão do conjunto CAT-01..04; roteiro humano [CAT-HOM](estado/roteiro-homologacao-cat-hom.md); catálogo oficial 24 E4 + **8 jogos / 40 fases**.
- **QG-3:** typecheck/build API+web PASS (`PEF_NEXT_DIST_DIR=.next-qg-cat-05`); checks cat-04/03/e5 PASS; carga 8/40; `smoke:e5` 40 OK; `smoke:e4` 16 OK; `smoke:authz` PASS. Verifier PASS_COM_ACHADOS (`a2fdad4b-2406-4045-990e-17ff05d4b17b`).
- **Evidência:** [JSON](estado/evidencia-cat-05-20261122.json).
- **Próximo:** aceite humano CAT-HOM no celular; só então avaliar autorização de publicação (independente).

## EVO-CATALOGO-JOGOS-20261122 — CAT-04 (Histórias em cenas + 8/40)

- **Estado técnico:** COMPLETED (local, sem commit/push). **CAT-05:** PENDING. Homologação celular: PENDING_HUMAN.
- **Homologação humana até CAT-03:** APROVADA (responsável nesta conversa).
- **Entrega:** Histórias em cenas (motor `ordenacao`, toque/teclado/desfazer); 5 fases × 2 variantes; carga oficial **8 jogos / 40 fases**.
- **QG:** typecheck API/web PASS; `check:cat-04` + regressão `check:cat-03`/`check:e5` PASS; carga 8/40; `smoke:e5` 40 OK; `smoke:authz` PASS; `smoke:e4` 16 OK. Verifier PASS_COM_ACHADOS (`340b7b3d-ce2a-47fc-8d44-2ecfb4d03fc6`).
- **Evidência:** [JSON](estado/evidencia-cat-04-20261122.json).
- **Próximo:** CAT-05 (QG-3 + roteiro CAT-HOM).

## EVO-CATALOGO-JOGOS-20261122 — CAT-03 (quatro jogos novos)

- **Estado técnico:** COMPLETED (local, sem commit/push). **CAT-04..05:** PENDING. Homologação celular: PENDING_HUMAN.
- **Entrega:** Pares de sombras (memória com faces), Ache o intruso e Palavra e figura (escolha), Entrega no jardim (labirinto com pontos P); 20 fases curadas; carga oficial 7 jogos / 35 fases.
- **QG:** typecheck API/web PASS; `check:e5` + `check:cat-03` PASS; `smoke:e5` 38 OK; `smoke:authz` PASS; `smoke:e4` 16 OK. Verifier PASS_COM_ACHADOS.
- **Evidência:** [JSON](estado/evidencia-cat-03-20261122.json).
- **Próximo:** CAT-04 (Histórias em cenas + oito jogos / 40 fases).

## EVO-CATALOGO-JOGOS-20261122 — CAT-02 (leitura PostgreSQL)

- **Estado técnico:** COMPLETED (local, sem commit/push). **CAT-03..05:** PENDING.
- **Entrega:** `ServicoJogos` lê `jogo_digital`/`fase_jogo_digital`; motores em código por `tipoMecanica`; `iniciar` devolve `tipoMecanica`; Resumo resolve editorial no PG.
- **QG:** typecheck API/web PASS; `check:e5` PASS; `smoke:e5` 30 OK; `smoke:authz` PASS; `smoke:e4` 16 OK. Verifier PASS_COM_ACHADOS.
- **Evidência:** [JSON](estado/evidencia-cat-02-20261122.json).
- **Próximo:** CAT-03 (quatro jogos novos).

## EVO-CATALOGO-JOGOS-20261122 — CAT-01 (migração + carga oficial)

- **Estado técnico:** COMPLETED (local, sem commit/push). **CAT-02..05:** PENDING.
- **Entrega:** migração inicial Prisma com `JogoDigital`/`FaseJogoDigital`; `db:carga-oficial` idempotente (24 E4 + 3 jogos + 15 fases); seed fictício separado.
- **QG:** typecheck API PASS; bancos descartáveis `qg:cat-01` PASS (novo + piloto com progresso preservado).
- **Evidências:** [JSON](estado/evidencia-cat-01-20261122.json) · [QG-1](estado/qg1-typecheck-cat-01.txt) · [QG-2](estado/qg2-cat-01-bancos.txt).
- **Próximo:** CAT-02 (leitura do catálogo digital a partir do PostgreSQL).

## EVO-CATALOGO-JOGOS-20261122 — decisão L3 e planejamento da V1

- Produto aprovou oito jogos, catálogo PostgreSQL, cadastro inicial aberto e renomeação planejada da branch padrão para `master`.
- CAT-01 READY para migração inicial e carga oficial isolada. CAT-02..05 PENDING. Homologação E5 R2 e fechamento da estabilização preservados.
- [Catálogo e critérios](planejamento/evo-catalogo-jogos-20261122.md) · [Preparação operacional](planejamento/estabilizacao-pre-uso.md).

## ESTABILIZACAO-PRE-USO — homologação humana APROVADA

- **Origem:** responsável do Produto nesta conversa (“aprovado”), após fechamento técnico QG-3.
- **Frentes:** E3-HOM, EST-03-HOM, E4 residual, COR-UX-HOM → **APROVADA**.
- **Estado:** demanda `HOMOLOGADA` / `COMPLETED`. Evidência: [JSON](estado/evidencia-estabilizacao-hom-20261122.json).
- **Não autorizado por este aceite:** publicação para uso real; E6/E7; L3 catálogos; encerramento automático dos gaps EST-02 / restore VPS.
- **Próximo:** se rumo a uso real, tratar bloqueios operacionais restantes e exigir autorização explícita de publicação. Sem commit/push/deploy automático.

## ESTABILIZACAO-PRE-USO — fechamento técnico QG-3

- **Tipo:** transversal · **Perfil:** QG-3 fechamento do conjunto EST-00..04.
- **Origem:** pedido humano de fechamento durante homologação em curso.
- **QG-3:** typecheck api+web PASS; `smoke:est-04-ops`, `smoke:authz`, `smoke:est-03-docs` (15), `smoke:e3` (18) PASS. Evidência: [JSON](estado/evidencia-estabilizacao-fechamento-qg3-20261122.json).
- **Estado:** demanda `COMPLETED` / `AGUARDANDO_HOMOLOGACAO_HUMANA`. Homologação humana **não** aprovada por este fechamento.
- **Publicação:** não autorizada. Bloqueios de uso real preservados.
- **Preservados:** E5 UX R2 APROVADA; EVO-CATALOGO L3 pendente; sem E6/E7.
- **Próximo:** registrar resultado humano nos roteiros; sem commit/push/deploy automático.

## ESTABILIZACAO-PRE-USO — EST-04 COMPLETED técnico (ops local)

- **Tipo:** transversal · **Incremento:** EST-04.
- **Checkout base:** `develop` @ `1c4c404` + alinhamento documental `origin/docs/alinhamento-est04-20261122` reconciliado (histórico preservado).
- **Entrega:** estratégia schema (`db push` / sem `migrations`); `migrate diff` sync; backup `pg_dump` + restore em `pef_restore_est04` (23=23); Docker healthy; `/saude` 200/503; procedimento e smoke `est-04-ops` (15 PASS).
- **QG:** typecheck api/web PASS; build api PASS; smoke ops PASS. Verifier **PASS_COM_ACHADOS** (`8d107190-9eeb-4eef-b42e-497661fa026b`) — shell do verifier em Ask; evidências do orquestrador. Fingerprint `sha256:393af5ec2b09df78…`.
- **Bloqueios residuais:** restore local ≠ VPS; sem migrate history; gaps EST-02; humanos PENDING; publicação não autorizada.
- **Preservados:** E5 UX R2 APROVADA; EST-03; EVO-CATALOGO L3 pendente; sem E6/E7.
- **Evidência:** [JSON](estado/evidencia-est-04-20261122.json) · [procedimento](estado/procedimento-est-04-ops.md).
- **Próximo:** homologações humanas em paralelo; fechar gaps de bloqueio antes de pedir publicação. Sem push/deploy.

## 2026-11-22 — Alinhamento do projeto após integração EST-03

- **Origem:** pedido humano de alinhamento e próximo passo; reconciliação documental na demanda existente ESTABILIZACAO-PRE-USO-20261122, sem novo módulo ou regra funcional.
- **Base inspecionada:** `develop` @ `1c4c404b5e39beb06a1c37aa6527aad0cc566912`; checkout inicial limpo. EST-03 já integrada; encaminhamento antigo de commit local e campo global de iniciar EST-02 estavam superados.
- **Correções documentais:** STATUS, plano EST e `atual.json` apontam ao próximo EST-04 (PENDING); referência E4→defeito E3 aberto foi reconciliada com a correção técnica EST-01. Evidências antigas e fingerprints de produto preservados.
- **Homologações:** E5 R2 APROVADA preservada; E3-HOM, EST-03, E4 residual e COR-UX-HOM continuam pendentes no seu escopo. Nenhuma aprovação inferida do novo pedido.
- **Prioridade:** operação/backup/restore/health, com gaps de segurança do alvo explícitos; catálogos L3 pendentes; E6/E7 fora; sem liberação de produção. Não reaplicar o plano antigo E5 sobre UX já homologada.
- **Validação nesta rodada:** documental e consistência de estado; não reexecuta produto ou infraestrutura. Sem código, commit, push, PR ou deploy.


## ESTABILIZACAO-PRE-USO — EST-03 COMPLETED técnico

- **Tipo:** transversal · **Incremento:** EST-03.
- **Checkout base:** `develop` @ `348a44a`.
- **Defeitos corrigidos:** Cache-Control ausente em resumo/prévia/PDF; `temDocumento` vazava para colaboradora.
- **QG:** typecheck/build API+web PASS; smoke est-03-docs (15), e3, e4, e5, authz PASS. Verifier **PASS_COM_ACHADOS** (`62d6b3ae-7f00-47fd-b03f-7b5a73fa0527`). Fingerprint `sha256:89d4dae23976eedc…`.
- **E4 residual:** tipificada (smoke PASS; HOM parcial preservada; expansão L3 fora).
- **Humano:** PENDING — [roteiro](estado/roteiro-homologacao-est-03.md). Evidência: [JSON](estado/evidencia-est-03-20261122.json).
- **Próximo:** EST-04 quando autorizado. Sem push/deploy; publicação não autorizada.

## ESTABILIZACAO-PRE-USO — EST-03 retomada (triagem)

- **Tipo:** transversal · **Origem:** pedido humano para executar EST-03.
- **Checkout:** `develop` @ `348a44a` (= `origin/develop`); working tree limpa.
- **Divergências registradas:** STATUS/`atual.json` tinham `EVO-CATALOGO-JOGOS` como demanda ativa (L3 PENDENTE) e estabilização PAUSED; revisão apontava `5e23c7a`. Prevaleceu o estado real + pedido humano: estabilização reativada; EVO pausada em `demandaPausadaL3` sem perder NEEDS_DECISION.
- **Preservados:** E1/E2 APROVADAS; E5 UX R2 APROVADA; EST-00..02 COMPLETED técnico; ADR-015; auditoria técnica.
- **Fluxo:** implementation-workflow (diagnóstico → correção só com evidência) → quality-gate → verifier. Sem E6/E7, sem EST-04, sem push/deploy.
- **Próximo:** diagnosticar isolamento Histórico/Resumo/PDF/documentos e E4 residual.

## EVO-CATALOGO-JOGOS-20261122 — planejamento L3 (NEEDS_DECISION)

- **Tipo:** transversal · **Origem:** pedido humano de arquitetura extensível do catálogo digital.
- **Checkout:** `develop` @ `5e23c7a` (= `origin/develop`).
- **Entrega:** especificação consolidada — 4 camadas (editorial/motor/renderizador/progresso), Prisma aditivo, contratos, compatibilidade dos 3 jogos, CAT-01..05. [Plano](planejamento/evo-catalogo-jogos-20261122.md).
- **Cruzamento:** frente digital referenciada a partir de [expansao-catalogos-e4-e5.md](planejamento/expansao-catalogos-e4-e5.md).
- **Aprovação:** L3 **PENDENTE**. Sem implementação, sem novos jogos, sem commit/push/deploy automático.
- **Próximo:** decisão do Produto; se aprovado, abrir CAT-01.

## 2026-11-22 — Auditoria técnica de consultas e artefatos

- Lembretes passaram a consultar doses em lote e exigem permissão de leitura de Cuidados, conforme M02. A home reutiliza as concessões ativas da própria requisição.
- Revisão independente aprovada após o ajuste para dados com versões ativas duplicadas. Smokes de autorização, jornadas, E2, E4 e E5 executados com PostgreSQL isolado.
- Inventário, evidências e plano dos recortes pendentes. [Auditoria técnica](planejamento/auditoria-tecnica-20261122.md)

## COR-UX-EST-HOM-20261122 — COMPLETED técnico

- **Tipo:** melhoria_ux · **Origem:** homologação humana da estabilização **APROVADA PARCIALMENTE**.
- **Checkout:** `develop` @ `95cb9de` + alterações locais (sem commit automático).
- **Entrega Etapa A:** `EsqueletoLista`; sugestões após catálogo; feedback de Renovar na seção (causa UX comprovada; backend OK); Modal Mantine pós-fase (próxima / catálogo / parabéns final).
- **QG:** typecheck + check/smoke e4/e5/authz PASS. Build web **BLOCKED** (EPERM `.next/trace`). Verifier **PASS_COM_ACHADOS**. Fingerprint `sha256:7ba70a28dc7944d0…`.
- **Humano:** COR-UX-HOM PENDING — [roteiro](estado/roteiro-homologacao-cor-ux-est-hom.md). Evidência: [JSON](estado/evidencia-cor-ux-est-hom-20261122.json).
- **Etapa B:** só planejamento L3 — [expansao-catalogos-e4-e5.md](planejamento/expansao-catalogos-e4-e5.md). Sem implementação.
- **Próximo:** homologação humana; depois retomar EST-03. Sem commit/push/deploy automático.

## COR-UX-EST-HOM-20261122 — triagem

- **Tipo:** melhoria_ux · **Origem:** homologação humana da estabilização **APROVADA PARCIALMENTE**.
- **Checkout:** `develop` @ `95cb9de`, alinhado a `origin/develop`, working tree limpa.
- **Estabilização:** `ESTABILIZACAO-PRE-USO-20261122` **PAUSED** (EST-00..02 COMPLETED técnico; EST-03/04 pendentes). Apontamentos: loading contextual, posição das sugestões, Renovar, diálogo pós-fase.
- **Etapa B:** expansão de catálogos — **somente planejamento** (`docs/esteira/planejamento/expansao-catalogos-e4-e5.md`); L3 Produto; sem implementação nesta demanda.
- **Fluxo:** implementation-workflow → quality-gate → homologação humana. Sem commit/push/deploy automático.

## EST-02 — auth enxuta (COMPLETED técnico)

- **Demanda:** `ESTABILIZACAO-PRE-USO-20261122` · incremento EST-02 COMPLETED técnico.
- **Decisão Produto APROVADA:** segurança enxuta → **ADR-015** (sessão/cookie; sem JWT; sem auth empresarial; ADR-006/014; só falhas comprovadas).
- **Correção:** `clearCookie` com as mesmas opções de `COOKIE_SECURE` do set.
- **QG-1/2:** typecheck PASS; smoke e1-01/e1-ent/e1-03/e2/authz PASS; smoke-est-02-sessao PASS (`qg*-est-02*.txt`). Sem rate-limit de login (risco residual / bloqueante uso real).
- **Verifier:** PASS_COM_ACHADOS (`da2a6d0d-…`). Evidência: [JSON](estado/evidencia-est-02-20261122.json).
- **Próximo:** EST-03. Sem E6/E7. Sem prontidão de produção. Sem commit/push/deploy automático.

## EST-01 — anexos E3 + UX Resumo/Histórico

- **Demanda:** `ESTABILIZACAO-PRE-USO-20261122` · incremento EST-01 COMPLETED técnico.
- **Causa:** HTTP 413 ao salvar anexo ~200 KB (limite JSON ~100 KB).
- **Correção:** body 12 MB; limite 8 MB validado; UI com checagem e retry sem duplicar upload; smoke médio >100 KB.
- **UX:** Histórico e Resumo alinhados a Card/`coresPef` (mesmo padrão da Rotina), sem mudança de regra.
- **QG:** typecheck api/web PASS; smoke-e3 18 OK; smoke-authz PASS; build web PASS. Verifier **PASS_COM_ACHADOS** (`aaf2fcd8-…`). Fingerprint `sha256:8f2ac0f5afe25966…`.
- **Humano:** E3-HOM PENDING_HUMAN. Sem commit/push/deploy.
- **Evidência:** [JSON](estado/evidencia-est-01-20261122.json)

## ESTABILIZACAO-PRE-USO-20261122 — triagem e EST-00

- **Tipo:** transversal · **Origem:** preparar uso real sem E6/E7 e sem novas funcionalidades.
- **Checkout:** `develop` @ `e050a99`, working tree limpa, alinhada a `origin/develop`.
- **Reconciliação:** E5 UX R2 humana **APROVADA** (reprovações R1/R2 históricas preservadas). E3 anexos ABERTO. E4 parcial. Sem autorização de publicação.
- **Plano:** [estabilizacao-pre-uso.md](planejamento/estabilizacao-pre-uso.md) — EST-00 COMPLETED; próximo EST-01 (`DEF-E3-ANEXO-SALVAR`).
- **Estado demanda:** READY · incremento ativo EST-01. Sem commit/push/deploy automático.

## COR-E5-UX-HOM-R2-20261122

- **Tipo:** melhoria_ux · **Origem:** homologação humana REPROVADA da R1; correções complementares aprovadas (dica Modal, seletor, barra, ícone).
- **Preservado:** protótipo R1, catálogo com partida direta, menu/agrupamento, permissões/persistência/histórico/estrelas presenciais.
- **Entrega:** Modal Dica (como jogar + 1 dica/partida); seletor compacto de fases com estados; barra verde-clara; ícone Desenvolvimento trending-up.
- **QG:** typecheck, check-e4/e5, smoke-e4/e5/authz e build web PASS. Verifier PASS (após correção de cache da dica e rótulos). Fingerprint `sha256:9e70ea931ca2ff30…`.
- **Estado:** COMPLETED · **homologação humana APROVADA** em 2026-11-22 (versão `e050a99`). Histórico: R1 REPROVADA; registro intermediário R2 REPROVADA até o aceite. Sem commit/push/deploy automático nesta anotação.
- **Evidência:** [JSON](estado/evidencia-cor-e5-ux-hom-r2-20261122.json) · [Roteiro](estado/roteiro-ux-navegacao-e5-r2.md)

## COR-E5-UX-HOM-20261122

- **Tipo:** melhoria_ux · **Origem:** homologação humana REPROVADA (funcional aceito; visual/navegação não).
- **Protótipo:** APROVADO pelo Produto · [HTML](estado/prototipo-cor-e5-ux-hom-20261122.html).
- **Implementação:** catálogo = tela final (fase + progresso + Jogar); filtros Todas/Concluídas/Não concluídas; partida direta com Como jogar; URL legada redireciona; menu AppShell/Drawer com grupos expansíveis e ícones; tema PEF.
- **QG:** typecheck, check-e4/e5, smoke-e4/e5/authz e build web PASS. Verifier PASS_COM_ACHADOS (objetivo só na ajuda). Fingerprint `sha256:307f5dcfcce6045b…`.
- **Estado:** COMPLETED técnico · **AGUARDANDO HOMOLOGAÇÃO HUMANA** (`PENDING_HUMAN`). Sem commit/push/deploy.
- **Evidência:** [JSON](estado/evidencia-cor-e5-ux-hom-20261122.json) · [Roteiro](estado/roteiro-ux-navegacao-e5.md)

## COR-E5-UX-HOM-20261122 — triagem e protótipo

- **Checkout:** `develop` @ `4cb8cf0` + alterações locais; inspecionado antes de GitHub.
- **Triagem:** L1 UX; catálogo como tela final; menu redesenhado; tema PEF.
- **Estado na triagem:** `NEEDS_DECISION` até aprovação do desenho (obtida em seguida).
- **Precedente:** DEM-E5-UX-NAVEGACAO-CORR-20261122 (REPROVADO).

## DEM-E5-UX-NAVEGACAO-CORR-20261122

Resultado humano REPROVADO. Correção transversal aprovada em develop. Sequência técnica: corrigir entrada e navegação compartilhada, ajustar partida e filtros, testar por perfil e retornar à homologação. [Roteiro](estado/roteiro-ux-navegacao-e5.md)

## 2026-11-22 — Catálogo de Jogos digitais recuperado no ambiente local

- **E5-06-COR-02.** O catálogo falhava com Prisma `P2021` porque o PostgreSQL de desenvolvimento ainda não tinha a tabela de progresso da E5. Atualização aditiva aplicada e procedimento registrado no README.
- **Verificação.** QG-1, revisão independente e QG-2 passaram. A reprodução em Chrome com dados fictícios confirmou a transição de HTTP 500 para 200, os três jogos e o registro de conclusão da primeira fase da Memória. [Relatório](estado/relatorio-teste-usuario-e5-20261122.md#erro-de-servidor-ao-abrir-jogos-digitais)
- **Aceite.** E5-06 segue em validação humana de E4-HOM e E5-HOM.

## 2026-11-22 — Correções do teste de uso e reteste da E5

- **E5-06-COR-01.** Dica persistente da Memória, filtro aplicado a destaques e catálogo, singular no resgate unitário e compilação sem download de fonte.
- **Verificação.** QG-1, revisão independente e QG-2 passaram. Chrome com 38 checagens, smokes E4 e E5 com 46 checagens no total e build web em rede restrita. [Reteste](estado/relatorio-teste-usuario-e5-20261122.md#reteste-após-as-correções)
- **Aceite.** E5-06 segue em validação humana de E4-HOM e E5-HOM.

## 2026-11-22 — Percursos de usuário da Biblioteca e da E5

- **E5-06.** 28 checagens passaram na aplicação local em Chrome, entre desktop e viewport móvel emulada.
- **Achados.** Dica da Memória, comunicação do escopo do filtro e plural no resgate unitário. O relato inclui passos de reprodução. [Relatório de teste de uso](estado/relatorio-teste-usuario-e5-20261122.md)
- **Aceite.** Revalidação E4-HOM e homologação E5-HOM em dispositivo real seguem pendentes.

## 2026-11-22 — Implementação local da Biblioteca e dos jogos digitais

- **Entrega.** E5-01 a E5-05 concluídos tecnicamente. A Biblioteca contextual reúne Atividades reais e Jogos digitais, com Recompensas e Cadastros como destinos secundários.
- **Piloto.** Memória, Sequência e Labirinto com cinco fases cada. Destaques e descobertas usam o progresso autorizado por pessoa e família. Histórico e Resumo leem os registros da E5.
- **E5-06.** Validação integrada registrada por cenário e roteiro para o responsável e a criança. E4-HOM requer revalidação do percurso corrigido e E5-HOM está pendente de aceite humano. [Evidências](estado/evidencia-e5-20261122.json) · [Roteiro](estado/roteiro-homologacao-e5.md)

## 2026-11-22 — E4 com aceite parcial e E5 planejada

- **Retorno humano.** E4-HOM aprovada parcialmente. A organização da entrada e da Biblioteca será reavaliada após a correção E5-01. [Status e escopo](../produto/STATUS-E-ESCOPO.md)
- **Demanda.** `DEM-E5-JOGOS-DIGITAIS-20261122`, transversal, risco alto, `READY` para iniciar E5-01. Base `develop @ 45e1231`, implementação E4 em `0a1055b`.
- **Integração.** Módulo 03 §13 consolidado, desenho UX e seis incrementos. A Biblioteca contextual começa com Atividades reais e recebe os jogos quando houver uma jornada jogável. [Plano E5](planejamento/e5-jogos-digitais.md)
- **Validação.** Revisão documental e estática, com bootstrap da esteira (42 verificações) e `check:e4` (8 verificações) aprovados. Implementação, verifier, QG do novo fluxo e E5-HOM pendentes. O hash da evidência histórica da E4 não foi reproduzido no checkout. O defeito de anexos E3 segue aberto e adiado.

## 2026-11-22 — DEM-E4 COMPLETED técnico (humana PENDING)

- **Demanda:** DEM-E4-BIBLIOTECA-20261122 COMPLETED técnico; homologação humana PENDING_HUMAN (E4-HOM).
- **Entrega:** Catálogo curado ≤24 com metadados/versão; sugestões ≤6 por pessoa; escolher/renovar ≤3 com persistência e Serializable; snapshot de conteúdo na participação; UI Sugestões/Renovar/Ver biblioteca; check/smoke e4; roteiro humano.
- **Decisões:** estender `Desafio` (sem `modelo_atividade`); `SugestaoDesafioPessoa` ≠ `DesafioGuardado`; Explorar/Executadas/estrelas preservados.
- **QG-1/2/3:** PASS · Verifier indep. shell PASS; oficial BLOCKED (Ask).
- **Critérios:** E4-ACE-01..07 PASS; E4-HOM PENDING_HUMAN.
- **Fingerprint:** `sha256:8767629646547880` (full `…92fd6a18`); base develop @ `0d2fa2b`.
- **Próximo:** homologação humana no roteiro-homologacao-e4.md; sem commit/push/deploy.
- **Integração documental:** autorizada pelo fluxo da esteira nesta conversa.


## 2026-11-22 — E4 aprovada e planejada

- **Aceite humano:** proposta E4 aceita, incluindo até 24 modelos ativos, 6 sugestões por pessoa e renovação de até 3 alternativas.
- **Fonte funcional:** Módulo 03 v1.3 §12, E4-ACE-01..07/E4-HOM.
- **Demanda:** DEM-E4-BIBLIOTECA-20261122 READY; plano e4-biblioteca-real.md, E4-01..03.
- **Base:** develop @ 4ae828da06b5dfa78abbedda56e5c5965aea33ac; schema e servico-desafios inspecionados estaticamente, sem testes ou código nesta rodada.
- **Preservação:** renovar não executa/reativa nem gera pontos; modelos globais sem dados pessoais e escolhas privadas.
- **Pendência:** DEF-E3-ANEXO-SALVAR-20261122 continua aberto/adiado; E3 sem novo aceite humano.
- **Próximo:** implementation-workflow E4-01; integração documental autorizada pelo responsável nesta conversa.


## 2026-11-22 — Falha de salvar anexos; avanço E4 autorizado

- **Relato humano:** atualização feita; anexos falham ao salvar, impedindo homologação da jornada.
- **Defeito:** DEF-E3-ANEXO-SALVAR-20261122 ABERTO, tratamento adiado expressamente pelo Produto.
- **Aceite:** E3-HOM PENDING_HUMAN; não inferir aprovação dos demais fluxos. Resultados técnicos históricos preservados.
- **Próximo:** detalhar E4 — Biblioteca de atividades reais; correção futura deve reproduzir salvar → baixar, sem diagnóstico presumido.
- **Referência:** develop @ d4a4db0cef5cca5bdb16772ea97cf1724634fcb9; sem testes/código nesta anotação. Commit documental autorizado nesta conversa.


## 2026-11-22 — DEM-E3 COMPLETED técnico (humana PENDING)

- **Demanda:** DEM-E3-EXAMES-RESUMO-20261122 COMPLETED técnico; homologação humana PENDING_HUMAN (E3-HOM).
- **Entrega:** Baixar arquivo no detalhe do exame (sem viewer); Resumo por área/período com fontes e vazios; prévia/PDF sem anexos embutidos; check/smoke e3; roteiro humano.
- **QG-1/2/3:** PASS · Verifier indep. shell PASS; oficial BLOCKED (Ask/shell).
- **Critérios:** E3-EX-01..05 e E3-RES-01..05 PASS; E3-HOM PENDING_HUMAN.
- **Fingerprint:** `sha256:2dead837b08ac808` (full `…b0edb14c`); base develop @ `8a51752`.
- **Próximo:** homologação humana no roteiro-homologacao-e3.md; sem commit/push/deploy.
- **Integração documental:** autorizada pelo fluxo da esteira nesta conversa.


## 2026-11-22 — E3-UX-00 aprovado com download externo

- **Decisão humana:** baixar anexo e abrir no aplicativo do dispositivo; restante do desenho E3 aprovado.
- **Escopo:** retirados viewer/zoom/paginação próprios; mantidas autorização, Resumo por área e prévia/PDF de relatório.
- **Fontes:** Módulo 02 v1.7 §10; Módulo 04 v1.2 §12; UX §11.
- **Estado:** E3-00 COMPLETED somente como desenho; demanda e E3-01 READY. Gates e homologação de implementação pendentes.
- **Referência:** develop @ 382a90e4eb44b9c0cdaffa70c88bba813a450149; atualização documental sem código/testes.
- **Próximo:** implementation-workflow E3-01. Integração documental autorizada pelo responsável.


## 2026-11-22 — E3 aprovada; desenho e planejamento preparados

- **Aceite de Produto:** recomendação E3 aceita: visualizador privado de exame e Resumo factual por área, validando desenho antes de implementar.
- **Requisitos:** Módulo 02 v1.6 §10 e Módulo 04 v1.2 §12.
- **Demanda:** DEM-E3-EXAMES-RESUMO-20261122 PENDING; E3-00 em validação, E3-01..03 pendentes.
- **Desenho/plano:** UX PROPOSTA-EVOLUCAO-POS-V1.md §11; planejamento/e3-exames-resumo.md.
- **Base:** develop @ 133eec53089fc9cbd98bfd1dfd4f1987af783f2a; consulta estática, sem implementação ou testes nesta rodada.
- **Próximo:** validar E3-UX-00 e liberar E3-01. E2 e seus aceites preservados; publicação adiada.
- **Integração documental:** autorizada pelo responsável nesta conversa.


## 2026-11-22 — E2 homologada humanamente

- **Fonte:** responsável comunicou melhorias feitas e homologação APROVADA.
- **Demanda/critério:** DEM-E2-ACESSOS-20261122 / E2-ACE-08.
- **Defeito:** DEF-E2-ATIVACAO-20261122 encerrado no escopo do link manual; envio automático adiado.
- **Referência:** develop @ `e3a75a9fca41c6bd0125ae39af3aa50f1f11d350`; evidencia-e2-20261122.json.
- **Verificação:** registros técnicos consultados, sem reexecução. QG-1/2/3 e independente shell PASS; verifier oficial FAIL preservado, com justificativa/reexecução descritas na evidência.
- **Próximo:** detalhamento E3 — exames e resumo por área, sem publicação.
- **Integração documental:** autorizada pelo responsável nesta conversa.


## 2026-11-22 — DEM-E2 COMPLETED técnico (humana PENDING)

- **Demanda:** DEM-E2-ACESSOS-20261122 COMPLETED técnico; homologação humana PENDING_HUMAN (E2-ACE-08); DEF-E2-ATIVACAO-20261122 permanece aberto.
- **Entrega:** Gerar/copiar link de ativação (sem envio de e-mail), claim atômico na ativação, listagem/estados de convite e conta, revisão ADR-014, regressão E1/authz, roteiro humano.
- **QG-1/2/3:** PASS · Verifier indep. shell PASS; oficial FAIL (build antigo + Ask) — reexecução shell prevalece.
- **Critérios:** E2-ACE-01..07 PASS; E2-ACE-08 PENDING_HUMAN
- **Fingerprint:** `sha256:42cb6128d3f428f6`
- **Evidência:** `evidencia-e2-20261122.json` · `roteiro-homologacao-e2.md`
- **Commit/push/deploy:** não executados
- **mensagemCommit sugerida:** `feat(fundacao): ativar acessos por link manual e esclarecer estados`

## 2026-11-22 — E2 aprovada e planejada: ativação por link e gestão de acessos

- **Aprovação humana:** link compartilhado manualmente; envio automático adiado. Recorte Módulo 01 v1.9 §15, E2-ACE-01..08.
- **Demanda:** DEM-E2-ACESSOS-20261122, transversal, risco alto, READY; E2-01..04 em `docs/esteira/planejamento/e2-acessos-ativacao.md`.
- **Defeito:** DEF-E2-ATIVACAO-20261122 permanece ABERTO até correção e homologação da jornada.
- **Base:** develop @ 2ccc5d4a421289a2899557de91f6935f6807dd95. Inspeção do serviço de convite e painel administrativo.
- **Achado:** geração de token/link existente, sem envio no serviço inspecionado; botão ainda rotulado “Enviar convite”. Ativação ponta a ponta não validada nesta rodada.
- **Validação:** somente revisão documental/estática; novos gates, verifier e homologação pendentes. Histórico E1 preservado.
- **Próximo:** implementation-workflow E2-01. Integração documental autorizada pelo responsável nesta conversa.


## 2026-11-22 — Correções de entrada E1 homologadas humanamente

- **Aceite:** responsável informou correções feitas e homologação humana APROVADA para as correções; DEM-E1-ENTRADA-20261121, critério E1-ENT-08.
- **Referência disponível:** develop @ `2781c76ec2992976b268d7accadc948e45347b8a`; evidência técnica `evidencia-e1-ent-20261121.json`.
- **Escopo:** entrada/boas-vindas/cadastro familiar e endereço copiar/acessar; manter e-mail/senha sem envio de mensagem.
- **Rastreabilidade:** atualizados estado ativo e histórico da demanda, STATUS e plano. Reprovação da entrega original e evidência técnica original preservadas.
- **Verificação:** consulta documental/estática; testes e aplicação não reexecutados nesta atualização. QG-1/2/3 PASS e verifier independente shell PASS registrados; oficial BLOCKED Ask/shell.
- **Próximo:** detalhamento E2, mantendo disponibilização para uso adiada.
- **Integração documental:** commit autorizado pelo responsável nesta conversa.


## 2026-11-21 — DEM-E1-ENTRADA COMPLETED técnico (humana PENDING)

- **Demanda:** DEM-E1-ENTRADA-20261121 COMPLETED técnico; homologação humana PENDING_HUMAN (E1-ENT-08).
- **Entrega:** boas-vindas em `/` e `/f`; cadastro em `/f/criar` (POST `/familias`); URL copiar/acessar; remoção do atalho `/f/oliveira`; slug reservado; regressão E1-ACE.
- **QG-1/2/3:** PASS · Verifier indep. shell PASS; oficial BLOCKED Ask ([verifier](08888821-4ff0-48b5-a024-2b807aaa750e))
- **Critérios:** E1-ENT-01..07 PASS; E1-ENT-08 PENDING_HUMAN; regressão ACE-01..08 PASS técnico
- **Fingerprint:** `sha256:f02234b3d87c192d`
- **Evidência:** `evidencia-e1-ent-20261121.json` · `roteiro-homologacao-e1-ent.md`
- **Commit/push/deploy:** não executados
- **mensagemCommit sugerida:** `feat(fundacao): cadastrar familia pela interface com endereco de acesso`

## 2026-11-21 — E1 humana REPROVADA; cadastro inicial aprovado e planejado

- **Fonte humana:** responsável reprovou entrada /f e links fixos /f/oliveira; aceitou boas-vindas/cadastro e esclareceu que dispensa apenas o envio de mensagem.
- **Decisão L3:** Módulo 01 v1.8 FUN-09/§14 substitui exclusividade do provisionamento privado. E-mail/senha permanecem; confirmação entrega URL copiar/acessar.
- **Base inspecionada:** develop @ efb9fecf07db18b2c20057e8ec7fd28663b26916. Consulta remota, sem operar localhost ou executar testes.
- **Demanda anterior:** DEM-E1-FAMILIAS-20261121 mantém PASS técnico histórico; homologação humana registrada REPROVADA.
- **Demanda ativa:** DEM-E1-ENTRADA-20261121, transversal, alto risco, READY; planejamento complementar em e1-contexto-familiar.md, E1-ENT-01..03.
- **Próxima ação:** implementation-workflow de E1-ENT-01 após reconciliar checkout/fingerprint. Novos gates e nova homologação pendentes.
- **Integração:** atualização documental no GitHub autorizada pelo responsável nesta conversa. Código de aplicação não alterado nesta rodada.


## 2026-11-21 — E1-04 COMPLETED (técnico PASS; humana PENDING)

- **Demanda:** DEM-E1-FAMILIAS-20261121 COMPLETED técnico; homologação humana PENDING_HUMAN.
- **Entrega:** QG-3 integrado; smokes legados pré-contexto removidos; suíte nova `e1-01..04` + `e1-jornadas` + `e1-authz`; roteiro humano.
- **QG-1/2/3:** PASS · Verifier indep. shell PASS; oficial BLOCKED Ask ([verifier](0aa384e2-1a46-49bf-b313-dff5de6cdbc9))
- **Critérios:** E1-ACE-01..08 PASS técnico; ACE-08 humano pendente
- **Fingerprint:** `sha256:7b3f13d6c96b7878`
- **Evidência:** `evidencia-e1-04-20261121.json` · `roteiro-homologacao-e1-04.md`
- **Commit/push/deploy:** não executados

## 2026-11-21 — E1-03 COMPLETED (técnico PASS)

- **Demanda:** DEM-E1-FAMILIAS-20261121 permanece IN_PROGRESS; próximo E1-04.
- **Entrega:** isolamento API (404 cruzado sem revelar existência), ativação de convite com `familiaSlug`, UI `/f/{slug}/convites/ativar`, revogação com sessão invalidada.
- **QG-1/2:** PASS · QG-3 N/A · Verifier indep. shell PASS; oficial BLOCKED Ask ([verifier](e1e2abc8-7846-4f42-9703-318e202cec51))
- **Critérios:** E1-ACE-05/06/07 PASS
- **Fingerprint:** `sha256:6b7f7732595e5810`
- **Evidência:** `evidencia-e1-03-20261121.json`
- **Commit/push/deploy:** não executados

## 2026-11-21 — E1-02 COMPLETED (técnico PASS)

- **Demanda:** DEM-E1-FAMILIAS-20261121 permanece IN_PROGRESS; próximo E1-03.
- **Entrega:** árvore `/f/[slug]/*`, guarda de contexto, `destinoEntrada`/hrefs com slug, rotas legadas redirecionadas, limpeza de dados ao trocar URL.
- **QG-1/2:** PASS · QG-3 N/A · Verifier indep. shell PASS; oficial BLOCKED Ask ([verifier](e1dff68b-bedb-41fe-8ab2-b28dc2e5ba84))
- **Critérios:** E1-ACE-03/04 PASS
- **Fingerprint:** `sha256:0f36e9f6de2d4126`
- **Evidência:** `evidencia-e1-02-20261121.json`
- **Commit/push/deploy:** não executados

## 2026-11-21 — E1-01 COMPLETED (técnico PASS)

- **Demanda:** DEM-E1-FAMILIAS-20261121 permanece IN_PROGRESS; próximo E1-02.
- **Entrega:** `Familia.slug`; provisionamento privado (CLI); POST `/sessoes` com `familiaSlug`; `/f/[slug]/entrar`; home sem login global.
- **QG-1/2:** PASS · QG-3 N/A (incremento) · Verifier indep. shell PASS; oficial BLOCKED Ask ([verifier](93fede9b-e1da-480f-b366-79d9bdd033be))
- **Critérios:** E1-ACE-01/02 PASS
- **Fingerprint:** `sha256:efa4c2550a447dc2`
- **Evidência:** `evidencia-e1-01-20261121.json`
- **Commit/push/deploy:** não executados

## 2026-11-21 — Retomada DEM-E1-FAMILIAS / E1-01 IN_PROGRESS

- **Reconciliação:** develop @ `1cb67a05c848d1698b0a938becf6c57afe8c5a6c`, worktree limpo; base de plano `9193f16` ancestral.
- **Triagem:** transversal aprovada L3 (M01 v1.7 §13); fluxo implementation-workflow → quality-gate + verifier.
- **Decisões técnicas locais E1-01:** `familiaSlug` obrigatório em POST /sessoes; slug `[a-z0-9-]+` único; provisionamento via CLI/`lib-provisionar-familia` com senha só em `PEF_PROVISION_SENHA`.
- **Escopo ativo:** E1-ACE-01/02 — schema slug, seed oliveira, login contextual, `/f/[slug]/entrar`, smoke/check e1-01.
- **Commit/push/deploy:** não executados.

## 2026-11-21 — Direção pós-V1 aprovada e planejamento E1

- **Fonte do aceite:** responsável do Produto concordou com a recomendação de aprovar a direção E1–E7 apresentada sobre o commit `9193f16`. Reservadas decisões particulares de pontuação digital, dados pessoais/IA e clínica.
- **Documentação:** Documento Mestre v1.7 §15; EVOLUCAO-POS-V1.md v2.1; Módulo 01 v1.7 §13.
- **Triagem:** DEM-E1-FAMILIAS-20261121, transversal, risco alto, L3 documentada.
- **Plano:** `docs/esteira/planejamento/e1-contexto-familiar.md`, incrementos E1-01..04 e E1-ACE-01..08.
- **Estado:** READY para retomada local; próximo E1-01 por implementation-workflow.
- **Base inspecionada:** develop @ `9193f1660ec2fa06ebdd19d633cc83b86e3a828e`. Consulta remota; workspace/fingerprint devem ser reconciliados pelo executor antes de editar.
- **Evidência:** revisão estática/documental. Código de aplicação, QG-1/2/3, verifier e homologação da E1 não executados. Histórico e aceites V1 preservados.
- **Integração documental:** commit no GitHub autorizado expressamente pelo responsável nesta conversa; autorização restrita à documentação desta rodada.


## 2026-11-21 — Homologação humana Módulo 04 e baseline V1

- **Aceite humano** APROVADA a entrega DEM-M04-EVO-REV-20261121, critério EVO-REV-HOM, por comunicação expressa do responsável do Produto.
- **V1** homologada pelo responsável, disponibilização para uso adiada. Código de referência develop @ 2bafbc560cfedc9483151b4dfaaef12b443c0a94.
- **Próxima fase** evolução pós-V1 para fechar lacunas, conforme STATUS-E-ESCOPO.md.
- **Dados pré-uso** política aprovada no Documento Mestre §13, com dispensa de preservação dos dados atuais de desenvolvimento.
- **Verificação deste registro** consulta documental da branch e das evidências existentes. Resultados técnicos preservados, sem reexecução nesta atualização.


## 2026-11-21 — DEM-M04-EVO-REV-20261121 COMPLETED (técnico PASS)

- **Tipo:** transversal · **Risco:** alto (authz/privacidade/PDF)
- **Entrega:** Histórico (período compacto, ícones, detalhes); Resumo contextual; Preparar PDF → conferência → Baixar; PDF multipágina; totais integros; `podeExportar`; observações/programações
- **QG-1/2/3:** PASS · Verifier indep. shell PASS; oficial BLOCKED Ask ([verifier](d04a7109-c499-4d1d-b2d1-5e2ff144cba2))
- **Fingerprint:** `sha256:fa68687616df8905`
- **Humana:** PENDING_HUMAN — `roteiro-homologacao-m04-evo-rev.md`
- **Evidência:** `evidencia-m04-evo-rev-20261121.json`
- **Commit/push:** não executados
- **Próximo:** homologação humana expressa Histórico/Resumo/PDF

## 2026-11-21 — Triagem + planejamento DEM-M04-EVO-REV-20261121

- **Tipo:** transversal (correções UX+funcionais M04) · **Risco:** alto (authz/privacidade/PDF)
- **Aprovação:** L2 — direção UX APROVADA em `REVISAO-MODULO-04.md` §1/§6 (Produto 2026-11-20); requisitos EVO-R05/R07/R10/R12 já em especificação v1.1
- **Escopo:** EVO-REV-01..08 — prévia fiel, PDF completo, totais do período, exportação autorizada, Histórico/Resumo aprovados
- **Fora:** restringir período sem Produto; ampliar permissões; anexos no PDF; novos requisitos
- **HEAD:** `1ddde98` develop (= origin/develop)
- **Fluxo:** module-planning (EF-REV-01..03) → implementation-workflow → quality-gate + verifier → PENDING_HUMAN
- **Incrementos:** EF-REV-01 contratos/completude → EF-REV-02 experiência → EF-REV-03 validação integrada
- **Commit/push:** não executados

## 2026-11-20 — Aceite humano DEM-M01-SIMP-CAD-20261120

- **Resultado humano** APROVADA, informado expressamente pelo responsável do Produto nesta conversa após a atualização.
- **Critério humano** M01-SIMP-HOM aprovado para cadastro/conta/acessos e entrada contextual v1.5.
- **Referência disponível** develop @ 5260fc672f3b207e659c888ac78e436e0548f8ae.
- **Resultados técnicos** preservados conforme registro da demanda. Testes não reexecutados nesta atualização documental.
- **Fonte consolidada** docs/produto/STATUS-E-ESCOPO.md, seção de homologação humana da simplificação do Módulo 01 em 2026-11-20.
- **Próximo encaminhamento** revisão UX do Módulo 04 conforme sequência aprovada.


Separado da especificação funcional do produto. Atualizar com entradas curtas.

## Estado atual (2026-11-20)

- **Esteira v2 (desenvolvimento contínuo):** ACTIVE — entrada via `task-routing`; schema `atual.json` v2 (`demanda` / `demandasConcluidas`)
- **DEM-SEED-LOCAL-20261120:** COMPLETED — banco limpo + seed ≤6 pessoas · fingerprint `sha256:a7b705e631d032e4`
- **DEM-M01-SIMP-CAD-20261120:** COMPLETED técnico PASS · fingerprint `sha256:c9ba9051d7d0cca4` · verifier indep. PASS; oficial BLOCKED ([verifier](8e779dd7-9d7b-4e2b-b4c5-b32fe26c7b20)) · humana PENDING_HUMAN (M01-SIMP-HOM)
- **DEM-M01-ACESSOS-CORR-20261120:** COMPLETED técnico PASS · fingerprint `sha256:f8ed38e0032e040a` · verifier indep. PASS; oficial BLOCKED ([verifier](bce6f2ac-2e08-429f-aa06-26f85b45935f)) · humana REPROVADA (sucedida pela simplificação §11)

## 2026-11-20 — DEM-SEED-LOCAL-20261120 COMPLETED

- **Tipo:** refatoracao (dados locais) · **Risco:** baixo
- **Escopo:** TRUNCATE local + seed Família Oliveira com 6 pessoas; amostra cuidados/desenvolvimento mais crível
- **Pessoas:** Carlos, Mikaela, Ana Paula (contas); Helena, Laurinha, Ricardo (sem conta)
- **Fora:** remoção dos smokes da esteira (permanecem; poluem o banco se rodados de novo)
- **Verificação:** 1 família / 6 pessoas / 3 usuários após `npm run db:reset -w @pef/api`
- **Fingerprint:** `sha256:a7b705e631d032e4`
- **Commit/push:** não executados

## 2026-11-20 — DEM-M01-SIMP-CAD-20261120 COMPLETED (técnico PASS)

- **Tipo:** melhoria_funcional · **Risco:** alto (authz/conta/sessão)
- **Aprovação:** L3 Produto APROVADA (M01 v1.5 §11 / c46ed61); ADR-014 esclarecimento; UX jornada APROVADA
- **Entrega:** `pessoaContaId` no convite/ativação; cadastro + “precisa entrar?” / Habilitar conta; `contextos`+`destinoEntrada` no início; home com escolha/redirecionamento; smokes `m01-simp-cad` + regressão M01; smokes ff02/03/04 alinhados ao nome seed Helena
- **Fora:** contas legadas, novos poderes, exclusão de pessoa
- **QG-1/2/3:** PASS · Verifier indep. PASS; oficial BLOCKED Ask ([verifier](8e779dd7-9d7b-4e2b-b4c5-b32fe26c7b20))
- **Fingerprint:** `sha256:c9ba9051d7d0cca4`
- **Humana:** PENDING_HUMAN — `roteiro-homologacao-m01-simp-cad.md`
- **Evidência:** `evidencia-m01-simp-cad-20261120.json`
- **Commit/push:** não executados
- **Próximo:** homologação humana expressa M01-SIMP-HOM

## 2026-11-20 — Triagem + planejamento DEM-M01-SIMP-CAD-20261120

- **Tipo:** melhoria_funcional (complexa) · **Risco:** alto (authz/conta/sessão)
- **Aprovação:** L3 Produto APROVADA (M01 v1.5 §11); ADR-014 esclarecimento DOCUMENTADA; UX jornada APROVADA em REVISAO-MODULO-01-ACESSOS
- **Escopo:** cadastro mínimo; ativação ordinária reutilizando pessoaId; entrada contextual; sem migração legada; capacidades próprias atuais
- **Fora:** contas legadas, novos poderes, exclusão de pessoa, seletor vínculo, Integrante em Desenvolvimento
- **HEAD:** `c46ed61` develop
- **Fluxo:** module-planning (3 incrementos) → implementation-workflow → quality-gate + verifier → PENDING_HUMAN
- **Commit/push:** não executados

- **DEM-ADR014-ACESSOS-20261119:** COMPLETED técnico PASS · fingerprint `sha256:5b3f46d7c53bbe9c` · humana PENDING_HUMAN (reprovada na rodada; sucedida pela correção)
- **DEM-CT-20261119-003:** parecer DOCUMENTADO (ADR-014) · sucedido pela implementação DEM-ADR014-ACESSOS
- **DEM-UX-HOM-R3-20261119:** COMPLETED técnico PASS · fingerprint `sha256:f0114d296d15068a` · [verifier](6c71be97-490f-422a-adbd-06911be180d6); humana PENDING_HUMAN / UX REPROVADA
- **DEM-CT-20261119-001-002:** COMPLETED técnico PASS · ADR-013 · fingerprint em `evidencia-ct-dl-exec-rec-20261119.json` · [verifier](422aae3f-f66c-4f49-9823-4746e0ed2739); humana PENDING_HUMAN
- **DEM-UX-DL-03-20261119:** COMPLETED técnico PASS · fingerprint `sha256:b284793cde1478f7` · [verifier](5f0fd528-2614-49c0-ba3f-3edbf7564f9f); humana PENDING_HUMAN
- **DEM-UX-HOM-20261118:** COMPLETED técnico PASS · fingerprint `sha256:9f6ab4a42a59c149` · [verifier](e5ccff07-38c8-4231-ac68-7ff4d28d56fe); humana PENDING_HUMAN / UX REPROVADA
- **DEM-ESTEIRA-IW-COMMITMSG-20261118:** COMPLETED — `implementation-workflow` passa a exigir `mensagemCommit` no resumo em `COMPLETED`

## 2026-11-20 — DEM-M01-ACESSOS-CORR-20261120 COMPLETED (técnico PASS)

- **Tipo:** correcao · **Risco:** alto (authz/UX)
- **Entrega:** visão Por participante; bloco Administração; escolha explícita Responsável/Integrante em Cuidados; revisão com efeito das ações; `participanteUsuarioId` em GET /acessos; smokes AC-05/06
- **QG-1/QG-2:** PASS · QG-3 NOT_APPLICABLE · Verifier indep. PASS; oficial BLOCKED Ask ([verifier](bce6f2ac-2e08-429f-aa06-26f85b45935f))
- **Fingerprint:** `sha256:f8ed38e0032e040a`
- **Humana:** PENDING_HUMAN (AC-09) — roteiro em `roteiro-ac09-m01-acessos-corr.md`
- **Evidência:** `evidencia-m01-acessos-corr-20261120.json`
- **Commit/push:** não executados
- **Próximo:** homologação humana expressa AC-09 (celular + desktop)

## 2026-11-20 — Triagem DEM-M01-ACESSOS-CORR-20261120 (IN_PROGRESS)

- **Tipo:** correcao · **Origem:** humano + `docs/especificacao-modulo-01-acessos.md` + reprovação homologação humana
- **Aprovação:** L2 ADR-014 DOCUMENTADA; especificação de correção no pedido; sem L3 novo
- **Escopo:** consulta por pessoa e por participante; bloco administração; escolha explícita Cuidados; revisão com efeito; alinhamento sessão/menu; AC-01..09
- **Fora:** exclusão de pessoa, seletor de vínculo, Integrante em Desenvolvimento, sucessão de admin
- **HEAD:** `1c3ab8d` develop · module-planning N/A (correção delimitada)
- **Fluxo:** implementation-workflow → quality-gate + verifier; humana PENDING_HUMAN
- **Commit/push:** não executados

## 2026-11-19 — DEM-ADR014-ACESSOS-20261119 COMPLETED (técnico PASS)

- **Tipo:** melhoria_funcional · **Risco:** alto (authz)
- **Aprovação:** L2 ADR-014 DOCUMENTADA; FUN-03/FUN-04/FUN-07 v1.3; pedido humano de implementação
- **Entrega:** catálogo fechado das 3 combinações; recusa `administrador`/`participante_limitado`; preservação transacional do último admin; `area` em `GET /acessos`; `usuarioId` para admin; UX Acessos por pessoa/área/responsabilidade com revisão/confirmação e convite alinhado
- **Fora:** exclusão de pessoa, edição de vínculo, Integrante em Desenvolvimento, sucessão de admin
- **QG-1/QG-2:** PASS · QG-3 NOT_APPLICABLE · Verifier independente PASS; oficial BLOCKED Ask ([verifier](a02013cb-2491-45c3-8a52-6ee4ac317850))
- **Fingerprint:** `sha256:5b3f46d7c53bbe9c` (algoritmo esteira)
- **Evidência:** `evidencia-adr014-acessos-20261119.json`
- **Humana:** PENDING_HUMAN
- **Commit/push:** não executados
- **Próximo:** homologação humana expressa do Módulo 01 Acessos

## 2026-11-19 — Triagem + Arquitetura DEM-CT-20261119-003 (READY)

- **Tipo:** melhoria_funcional · **Origem:** CT-20261119-003 + `docs/ux-ui/REVISAO-MODULO-01-ACESSOS.md`
- **Aprovação:** L2 Arquitetura DOCUMENTADA (ADR-014); FUN-03/FUN-04/FUN-07 v1.3 permanecem a fonte funcional; sem L3 novo
- **Escopo:** catálogo fechado das três responsabilidades contextuais, área na listagem, recusa de `administrador`/`participante_limitado` e preservação do último administrador no servidor
- **Fora:** exclusão de pessoa, seletor de vínculo, Integrante em Desenvolvimento, sucessão de administrador, layout
- **HEAD inspecionado:** `efee452` develop
- **Código de produto:** não alterado
- **Produto:** nenhuma decisão funcional bloqueante
- **Fluxo seguinte, quando pedido:** `implementation-workflow` → `quality-gate` + verifier; homologação humana depois
- **Commit/push:** não executados

## 2026-11-19 — DEM-UX-HOM-R3-20261119 COMPLETED (técnico PASS)

- **Entrega:** R3-01 preservar aba após registrar/resgatar/reativar; R3-02 Cadastros no submenu AppShell/Drawer; R3-03 filtro de categorias + categoria opcional no cadastro
- **QG-1/2/3:** PASS · Verifier independente PASS ([verifier](6c71be97-490f-422a-adbd-06911be180d6)); oficial BLOCKED Ask ([verifier](a5e4c37e-8d27-4636-90b7-23212504be44))
- **Fingerprint:** `sha256:f0114d296d15068a`
- **Humana:** PENDING_HUMAN · status UX oficial permanece REPROVADA
- **Evidência:** `evidencia-ux-hom-r3-20261119.json`
- **Commit/push:** não executados
- **Próximo:** nova homologação humana expressa do Módulo 03

## 2026-11-19 — Triagem DEM-UX-HOM-R3-20261119 (READY→IN_PROGRESS)

- **Tipo:** melhoria_ux · **Origem:** reprovação humana R3 em `docs/ux-ui/REVISAO-MODULO-03.md` (`DEV-UX-HOM-R3-01..03`)
- **Aprovação:** L2 UX documentada; compatível com ESPECIFICACAO v1.2 e ADR-013; sem CT/L3 novo
- **Escopo:** preservar aba após registrar/resgatar/disponibilizar; Cadastros como submenu lateral sob Desenvolvimento (AppShell/Drawer); filtro de categorias em Explorar/Executadas + categoria opcional no cadastro
- **Fora:** regras de estrelas, histórico, reativação, resgates, permissões e API (contrato atual já aceita `categoria`)
- **HEAD:** `7b8348e` develop = origin/develop, working tree limpa
- **Fluxo:** implementation-workflow → quality-gate (QG-1/QG-2/QG-3 módulo 03) + verifier
- **Humana:** REPROVADA / PENDING_HUMAN até novo aceite
- **Commit/push:** não executados

## 2026-11-19 — DEM-CT-20261119-001-002 COMPLETED (técnico PASS)

- **Entrega:** ADR-013 — Explorar/Executadas + Disponíveis/Resgatadas; reativação `responsavel_desenvolvimento`; Guardadas retidas; idempotência/geração de resgates; UI alinhada; smokes ef01–ef06 ajustados
- **QG-1/2/3:** PASS · Verifier PASS ([verifier](422aae3f-f66c-4f49-9823-4746e0ed2739))
- **Evidência:** `evidencia-ct-dl-exec-rec-20261119.json`
- **Humana:** PENDING_HUMAN (UX M03 permanece REPROVADA até novo aceite)
- **Commit/push:** não executados
- **Próximo:** homologação humana do Módulo 03

## 2026-11-19 — Triagem + Arquitetura DEM-CT-20261119-001-002 (READY)

- **Tipo:** melhoria_funcional (impacto M03; regressão leve M04)
- **Origem:** CT-20261119-001/002 APROVADAS/DOCUMENTADAS · ESPECIFICACAO v1.2 · pedido Arquitetura
- **Aprovação:** L3 Produto DOCUMENTADA; ADR-013 Arquitetura registrada
- **Escopo arquitetural:** disponibilidade por pessoa/atividade e por recompensa; retenção Guardadas; reativação em `responsavel_desenvolvimento`; idempotência/concorrência; sem evento novo no M04
- **Lacuna Produto:** nenhuma bloqueante
- **HEAD inspecionado:** `609829e` develop
- **Código de produto:** não alterado neste passo
- **Fluxo:** `implementation-workflow` INC-DL-EXEC-01 → … → quality-gate + verifier; homologação humana após entrega
- **Commit/push:** não executados

## 2026-11-19 — DEM-UX-DL-03-20261119 COMPLETED (técnico PASS)

- **Entrega:** experiência única Desenvolvimento; saldo compacto; recompensas secundárias com confirmação; organizar só com `responsavel_desenvolvimento`; feedback de estrelas pós-persistência
- **QG-1/2/3:** PASS · Verifier PASS ([verifier](5f0fd528-2614-49c0-ba3f-3edbf7564f9f); generalPurpose + roteiro verifier.md)
- **Fingerprint:** `sha256:b284793cde1478f7`
- **Humana:** PENDING_HUMAN
- **Evidência:** `evidencia-ux-dl03-20261119.json`
- **Commit/push:** não executados
- **Próximo:** homologação humana do Módulo 03

## 2026-11-19 — Triagem DEM-UX-DL-03-20261119 (READY→IN_PROGRESS)

- **Tipo:** melhoria_ux · **Origem:** REVISAO-MODULO-03.md + GUIA § Desenvolvimento (APROVADA 2026-11-18)
- **Aprovação:** L2 UX APROVADA; sem module-planning (decomposição já no plano de revisão)
- **Escopo:** experiência única; saldo compacto; recompensas secundárias; organizar só com authz; preservar DEV-F01..F07
- **Fora:** remoção de pessoas, permissões M01, seletor de vínculos
- **HEAD:** `f498694` develop, working tree limpa
- **Fluxo:** implementation-workflow (INC1→INC2) → quality-gate + verifier + QG-3
- **Commit/push:** não executados
- **Próximo:** UX-DL-INC1

## 2026-11-18 — DEM-UX-HOM-20261118 COMPLETED (técnico PASS)

- **Tipo:** transversal · slices A (authz/perfil) → B (estados/feedback) → C (microcopy/rótulos)
- **QG-1/QG-2/QG-3:** PASS · Verifier PASS ([verifier](e5ccff07-38c8-4231-ac68-7ff4d28d56fe))
- **Fingerprint:** `sha256:9f6ab4a42a59c149`
- **Pendência:** UX-HOM-02-SELETOR NEEDS_DECISION (opções de vínculo)
- **Humana:** PENDING_HUMAN · status UX oficial permanece REPROVADA
- **Evidência:** `evidencia-ux-hom-20261118.json`
- **Commit/push:** não executados
- **Próximo:** homologação humana expressa; commit sob decisão humana

## 2026-11-18 — Triagem DEM-UX-HOM-20261118 (READY→IN_PROGRESS)

- **Tipo:** transversal (correção UX com risco alto — authz/saúde/criança)
- **Origem:** `PLANO-CORRETIVO-HOMOLOGACAO-20261118.md` + `REVISAO-MODULOS-01-02.md` UX-HOM-01..07
- **Aprovação:** L2 Produto APROVADA (plano corretivo); seletor de vínculos = NEEDS_DECISION (não inventar opções)
- **Fluxo:** task-routing → implementation-workflow (slices A/B/C) → quality-gate + verifier + QG-3; sem module-planning
- **HEAD reconciliado:** `2d9b7ae` develop, working tree limpa
- **Commit/push:** não executados
- **Próximo:** Slice A (UX-HOM-01/02)
- **DEM-HOMOL-CUI-20261117:** COMPLETED — validação integrada §5.5 **técnica PASS** · [verifier](4ef6dcc6-051d-47d9-802e-2be0cd3fa459); humana PENDING_HUMAN
- **DEM-CUI-UX-CONS-20261117:** COMPLETED — Consultas e exames (3 fatias) PASS · fingerprint `sha256:de1eade8ffd58638` · [verifier](5815ebc1-8b1a-4298-9116-b2d55aa5f175); humana PENDING_HUMAN
- **DEM-CUI-UX-MED-20261117:** COMPLETED — Medicamentos PASS · fingerprint `sha256:c9a5c265a942a508` · [verifier](499257c4-d934-4188-8b08-59cf6ed32954); humana PENDING_HUMAN
- **DEM-CUI-UX-ROTINA-20261117:** COMPLETED — Rotina por perfil PASS · fingerprint `sha256:cc37be8b77e8ee9c` · [verifier](3963e837-e912-42cd-8a15-c2faf3f7febb); humana PENDING_HUMAN
- **DEM-CUI-UX-FUND-20261117:** COMPLETED — fundação UX Cuidados PASS · fingerprint `sha256:c6fd9b7f2e03b50d` · [verifier](d65ca03f-63db-4dcb-8ab5-c1cd195a080b); humana PENDING_HUMAN

## 2026-11-18 — DEM-ESTEIRA-IW-COMMITMSG-20261118 COMPLETED

- **Tipo:** melhoria esteira (L1) · skill `implementation-workflow`
- **Entrega:** resumo estruturado com `mensagemCommit` obrigatória em `COMPLETED` (texto para o humano; sem auto-commit)
- **Arquivo:** `.cursor/skills/implementation-workflow/SKILL.md`
- **Commit/push:** não executados
- **Próximo:** homologação humana Cuidados; uso da nova saída nas próximas implementações

## 2026-11-17 — DEM-HOMOL-CUI-20261117 COMPLETED (técnico PASS)

- **Perfil:** quality-gate `homologacao` · sem implementação
- **CUI-VAL-01..06:** PASS (authz, Rotina limpa, Med/Cons separados, nav, msg rede, smokes)
- **CUI-VAL-HUMANO:** PENDING_HUMAN (dispositivos / revisão Produto)
- **Verifier:** PASS ([verifier](4ef6dcc6-051d-47d9-802e-2be0cd3fa459))
- **Evidência:** `evidencia-homol-cui-20261117.json`
- **Commit/push:** não executados
- **Próximo:** homologação humana; commit das entregas UX sob decisão humana

## 2026-11-17 — Triagem DEM-HOMOL-CUI-20261117 (READY→IN_PROGRESS)

- **Tipo:** homologacao · **Origem:** REVISAO-INTEGRADA §5 item 5 pós CONS
- **Fluxo:** quality-gate perfil homologação (sem implementação inicial)
- **Critérios:** CUI-VAL-01..06 técnicos + CUI-VAL-HUMANO PENDING_HUMAN
- **Commit/push:** não executados

## 2026-11-17 — DEM-CUI-UX-CONS-20261117 COMPLETED

- **Entrega (3 fatias/janela):** lista+ícones+detalhes/gestão status; agendamento horas cheias/exato; exame com anexo só autorizado; Integrante só lista
- **QG-1/QG-2:** PASS · Verifier oficial Ask/shell BLOCKED; verificação independente PASS ([verifier](5815ebc1-8b1a-4298-9116-b2d55aa5f175))
- **Fingerprint:** `sha256:de1eade8ffd58638` (algoritmo `simular-retomada`)
- **Humana:** PENDING_HUMAN
- **Commit/push:** não executados
- **Próximo:** §5.5 validação integrada / homologação

## 2026-11-17 — Triagem DEM-CUI-UX-CONS-20261117 (READY→IN_PROGRESS)

- **Tipo:** melhoria_ux · **Origem:** REVISAO-INTEGRADA §5 item 4 (3 fatias/janela)
- **Aprovação:** L2 UX APROVADA (GUIA §4.5; CUI-F05/CUI-F06)
- **Fatias:** CUI-UX-CONS-01 lista/detalhes · CUI-UX-CONS-02 agendamento · CUI-UX-CONS-03 exame+anexo
- **Fluxo:** implementation-workflow → quality-gate
- **Commit/push:** não executados

## 2026-11-17 — DEM-CUI-UX-MED-20261117 COMPLETED

- **Entrega:** lista→detalhes; suspender/encerrar no detalhe; cadastro horas cheias + horário exato; Integrante só lista
- **QG-1/QG-2:** PASS · Verifier PASS após correção evidência QG-1 ([verifier](499257c4-d934-4188-8b08-59cf6ed32954))
- **Fingerprint:** `sha256:c9a5c265a942a508`
- **Humana:** PENDING_HUMAN
- **Commit/push:** não executados
- **Próximo:** Consultas e exames (§5.4)

## 2026-11-17 — Triagem DEM-CUI-UX-MED-20261117 (READY→IN_PROGRESS)

- **Tipo:** melhoria_ux · **Origem:** REVISAO-INTEGRADA §5 item 3
- **Aprovação:** L2 UX APROVADA (GUIA §4.3)
- **Escopo:** lista→detalhes; suspender/encerrar só no detalhe; cadastro com horas cheias + horário exato
- **Commit/push:** não executados

## 2026-11-17 — DEM-CUI-UX-ROTINA-20261117 COMPLETED

- **Entrega:** cartões medicamento/consulta na Rotina; observação opcional via `atividades-apoio`; histórico “Observação”; dedupe do próximo cuidado
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](3963e837-e912-42cd-8a15-c2faf3f7febb))
- **Fingerprint:** `sha256:cc37be8b77e8ee9c`
- **Evidência:** `evidencia-cui-ux-rotina-20261117.json`, typecheck, smokes cv03/authz, build web
- **Humana:** PENDING_HUMAN
- **Commit/push:** não executados
- **Próximo:** Medicamentos (§5.3) ou Consultas/exames (§5.4)

## 2026-11-17 — Triagem DEM-CUI-UX-ROTINA-20261117 (READY→IN_PROGRESS)

- **Tipo:** melhoria_ux · **Origem:** REVISAO-INTEGRADA §5 item 2 pós FUND
- **Aprovação:** L2 UX APROVADA (GUIA §4.3/4.6; CUI-UX-02/04)
- **Fluxo:** implementation-workflow → quality-gate
- **Escopo:** cartões/compromissos na Rotina; observação livre opcional via `atividades-apoio` existente; sem categorias de apoio
- **Commit/push:** não executados
- **DEM-HOMOL-UX-20261116-R2:** COMPLETED — homologação técnica **PASS** · [verifier](b8945c64-bab2-4726-bac7-f58d3810ac1c); humana PENDING_HUMAN / UX uso reprovada até redesenho
- **DEM-COR-UX-HOMOL-20261116:** COMPLETED — correção UX-ACC-01 + UX-CUI-01 PASS · fingerprint `sha256:46b2078e73b0c6d5` · [verifier](a6551ef3-2348-4942-a1aa-0e0e09a9684c); humana PENDING_HUMAN
- **DEM-HOMOL-UX-20261116:** COMPLETED — homologação técnica **FAIL** (UX-ACC-01 + Drawer desktop); humana PENDING_HUMAN · [verifier](ac0570d9-36b6-4add-8740-805e52d735c4)

## 2026-11-17 — DEM-CUI-UX-FUND-20261117 COMPLETED

- **Entrega:** rótulo Integrante na UI; menu contextual Rotina / Medicamentos / Consultas e exames; Rotina sem gestão embutida; cadastro/agenda nas páginas secundárias (só `responsavel_cuidados`)
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](d65ca03f-63db-4dcb-8ab5-c1cd195a080b))
- **Fingerprint:** `sha256:c6fd9b7f2e03b50d`
- **Evidência:** `evidencia-cui-ux-fund-20261117.json`, typecheck web, smokes cv03/ct-acessos/authz, build web
- **Humana:** PENDING_HUMAN (UX permanece reprovada até novo teste de uso)
- **Fora do slice:** CUI-UX-04 observação diária; polimento visual/ícones
- **Commit/push:** não executados
- **Próximo:** incremento Rotina/observação ou Medicamentos/Consultas polidos (§5 REVISAO-INTEGRADA); reiniciar `dev:web` se necessário

## 2026-11-17 — Triagem DEM-CUI-UX-FUND-20261117 (READY→IN_PROGRESS)

- **Tipo:** melhoria_ux · **Origem:** humano + `docs/ux-ui/REVISAO-INTEGRADA-CUIDADOS.md` §5 item 1
- **Aprovação:** L2 UX APROVADA/DOCUMENTADA (GUIA §4.3–4.4; FUN-04 Integrante); sem mudança L3 de regra
- **Fluxo:** task-routing → implementation-workflow → quality-gate
- **Escopo:** CUI-UX-05 (rótulo Integrante) + CUI-UX-01 (nav contextual; gestão fora da Rotina)
- **Fora deste slice:** observação diária (CUI-UX-04), cadastro horário polido, anexos/exame completo
- **Risco:** médio (authz de visibilidade; sem ampliar permissões)
- **Commit/push:** não executados

## 2026-11-16 — DEM-HOMOL-UX-20261116-R2 COMPLETED (técnico PASS)

- **Perfil:** quality-gate `homologacao` · sem implementação
- **Revalidação:** flash sessão PASS · mensagem rede PT PASS · Drawer desktop lateral PASS
- **Smokes/typecheck:** PASS · Verifier PASS ([verifier](b8945c64-bab2-4726-bac7-f58d3810ac1c))
- **Humana/dispositivos:** PENDING_HUMAN
- **Evidência:** `docs/esteira/estado/evidencia-homol-ux-r2-20261116.json`
- **Commit/push:** não executados
- **Próximo:** homologação humana em aparelhos; commit das correções UX sob decisão humana

## 2026-11-16 — Triagem DEM-HOMOL-UX-20261116-R2 (READY→IN_PROGRESS)

- **Tipo:** homologacao · **Origem:** pedido humano de nova tentativa pós DEM-COR-UX-HOMOL
- **Aprovação:** L1 Qualidade/UX · sem implementação nesta demanda
- **Fluxo:** task-routing → quality-gate (perfil homologação)
- **Foco:** revalidar UX-ACC-01 e UX-CUI-01 corrigidos + regressão NAV/ADM/DES/EVO
- **Commit/push:** não executados
- **DEM-UX-NAV-ADM-20261116:** COMPLETED — fingerprint `sha256:db65d95aa716c68e` · verifier PASS (independente); humana PENDING_HUMAN
- **DEM-CT-20261116-001:** COMPLETED — fingerprint `sha256:2a04c89c9f1f00e7` · verifier PASS (reutilizar GET /acessos)
- **Módulo 04 Evolução Familiar:** COMPLETED (QG-3 PASS) — evidência `docs/esteira/estado/evidencia-qg3-modulo-04.json`
- **Módulo 03 Desenvolvimento Laurinha:** COMPLETED (QG-3 PASS) — evidência `docs/esteira/estado/evidencia-qg3-modulo-03.json`

## 2026-11-16 — DEM-COR-UX-HOMOL-20261116 COMPLETED

- **Entrega:** flash sessão na nav; erro rede em PT; Drawer cuidados/desenvolvimento proporcional no desktop
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](a6551ef3-2348-4942-a1aa-0e0e09a9684c))
- **Fingerprint:** `sha256:46b2078e73b0c6d5`
- **Evidências:** `evidencia-cor-ux-homol-20261116.json`, `qg1-typecheck-web-cor-ux.txt`, `qg2-build-web-cor-ux.txt` (sem EPERM), smokes cv03/authz
- **Humana/dispositivos:** PENDING_HUMAN
- **Commit/push:** não executados
- **Próximo:** homologação humana rápida (reload + Drawer desktop + celular)

## 2026-11-16 — Triagem DEM-COR-UX-HOMOL-20261116 (READY→IN_PROGRESS)

- **Tipo:** melhoria_ux (correção residual) · **Origem:** achados DEM-HOMOL-UX-20261116
- **Aprovação:** L1 APROVADA (UX; sem regra funcional nova)
- **Fluxo:** task-routing → implementation-workflow → quality-gate
- **Escopo:** UX-ACC-01 (flash sessão; erro rede PT); UX-CUI-01 (Drawer proporcional no desktop)
- **Risco:** baixo · **HEAD base:** `bb73e8b` (docs Homoloção) / código produto `71c6444`
- **Humana:** permanece PENDING_HUMAN
- **Commit/push:** não executados

## 2026-11-16 — DEM-HOMOL-UX-20261116 COMPLETED (técnico FAIL)

- **Perfil:** quality-gate `homologacao` · sem implementação
- **HEAD:** `71c6444` · branch `develop`
- **Veredicto técnico:** FAIL · Verifier FAIL ([verifier](ac0570d9-36b6-4add-8740-805e52d735c4))
- **OK estrutural:** UX-NAV-01/02, UX-ADM-01/02, UX-DES-01, UX-EVO-01 (desktop/API)
- **Falha:** UX-ACC-01; UX-CUI-01 parcial (Drawer bottom full-height no desktop)
- **Smokes/typecheck:** PASS · Build desta corrida BLOCKED (EPERM com next:dev); build anterior UX PASS
- **Humana/dispositivos:** PENDING_HUMAN
- **Reconciliação:** bloqueio Ask/shell da demanda anterior não impede esta homologação; achados de a11y/UX residuais são o FAIL
- **Ambiente:** após build concorrente, web local em 500 — reiniciar `next:dev` / limpar `.next` antes de nova UI
- **Commit/push:** não executados
- **Próximo:** correções UX-ACC/CUI via task-routing; depois homologação humana

## 2026-11-16 — Triagem DEM-HOMOL-UX-20261116 (READY→IN_PROGRESS)

- **Tipo:** homologacao · **Origem:** humano + PENDING_HUMAN pós DEM-UX-NAV-ADM
- **Aprovação:** L1 Acompanhamento/Qualidade + UX (sem alteração de regra funcional)
- **Fluxo:** task-routing → quality-gate (perfil homologação); sem implementation-workflow
- **Escopo:** UX-NAV-01/02, UX-ADM-01/02, UX-CUI-01, UX-DES-01, UX-EVO-01, UX-ACC-01
- **Risco:** médio (authz de visibilidade / privacidade na inspeção; sem ampliar permissões)
- **Reconciliação:** HEAD `71c6444`; verifier oficial anterior BLOCKED (Ask/shell) — revalidar com evidências técnicas; humana permanece PENDING_HUMAN
- **Commit/push:** não executados

## 2026-11-16 — DEM-UX-NAV-ADM-20261116 COMPLETED

- **Entrega:** AppShell + Drawer; nav contextual por pessoa; `/gerenciar-familia` (Pessoas/Acessos/Convites); home sem admin; refinos CUI/DES/EVO; CT acessos reutilizado
- **QG-1/QG-2:** PASS · Verifier PASS ([verificação independente](25127f08-94fa-4193-9832-a0cfda7c2efa); subagente oficial Ask/shell BLOCKED)
- **Fingerprint:** `sha256:db65d95aa716c68e` (algoritmo `simular-retomada.mjs`)
- **Evidências:** `qg1-typecheck-web-ux-nav.txt`, `qg2-build-web-ux-nav.txt`, `qg2-smoke-ct-acessos-ux-nav.txt`, `qg2-smoke-authz-ux-nav.txt`
- **Homologação humana/dispositivos:** PENDING_HUMAN (UX-ACC-01)
- **Commit/push:** não executados
- **Próximo:** task-routing / homologação familiar em aparelhos reais

## 2026-11-16 — Triagem DEM-UX-NAV-ADM-20261116 (READY→IN_PROGRESS)

- **Tipo:** melhoria_ux · **Origem:** revisão UX integrada + pedido humano
- **Aprovação:** L2 DOCUMENTADA (GUIA §4.1–4.2; CT-20261116-001 já DOCUMENTADO; DEM-CT COMPLETED)
- **Fluxo:** task-routing → implementation-workflow → quality-gate (module-planning omitido — decomposição já na revisão UX)
- **Escopo:** UX-NAV-01/02, UX-ADM-01/02, UX-CUI-01, UX-DES-01, UX-EVO-01, UX-ACC-01
- **Risco:** médio (UI/authz de visibilidade; sem ampliar permissões)
- **Reconciliação:** HEAD `af9a172` vs estado anterior `e2b47b4`; workspace limpo; histórico preservado
- **Commit/push:** não executados

## 2026-11-16 — DEM-CT-20261116-001 COMPLETED

- **Entrega:** `GET /familias/:id/acessos` + papéis MVP; admin lista quem acompanha quem; Vovó (com conta) lê quem acessa seus dados; UI sem matriz; revogar via DELETE existente; `smoke:ct-acessos`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](8fe0305e-48a2-4d23-bb62-08469cbf8e2d))
- **Fingerprint:** `sha256:2a04c89c9f1f00e7`
- **Evidências:** `qg1-typecheck-*-ct-acessos.txt`, `qg2-smoke-ct-acessos.txt`, `qg2-smoke-authz-ct-acessos.txt`
- **Não feito:** homologação humana/dispositivos; commit/push
- **Próximo:** task-routing para nova demanda

## 2026-11-16 — Triagem DEM-CT-20261116-001 (READY→IN_PROGRESS)

- **Tipo:** melhoria_funcional · **Origem:** CT-20261116-001 · **Aprovação:** DOCUMENTADA (Módulo 01 v1.2 FUN-04/FUN-07)
- **Fluxo:** task-routing → implementation-workflow → quality-gate (sem module-planning)
- **Risco:** alto (auth/privacidade) · **Aceite:** FUN-04, FUN-07, FAM-R11
- **Escopo:** metadados de acessos (Admin/Responsável/Colaborador + quem acompanha quem); sem matriz; sem ampliar permissões
- **Commit/push:** não executados

## 2026-11-16 — Evolução da esteira (Desenvolvimento Contínuo v2)

- **Escopo:** processo apenas — skill `task-routing`; adaptação de `module-planning`, `implementation-workflow`, `quality-gate`, `verifier`, `AGENTS.md`, `engineering.mdc`, GOVERNANCA §9
- **Estado:** schema v2 com `demanda: null`; histórico de módulos 01–04 preservado; fingerprints históricos simbólicos mantidos
- **Não implementado:** CT-20261116-001 nem melhorias UX de produto
- **Validação:** `validar-bootstrap.mjs`, `testar-hooks.mjs`, `simular-roteamento.mjs`, `simular-retomada.mjs`
- **Commit/push:** não executados



- **UX consolidação 01/02:** COMPLETED (QG-3 PASS) — evidência `docs/esteira/estado/evidencia-qg3-ux-01-02.json`
- **CV-PROG-V13:** COMPLETED — metadados v1.3 em `alterarProgramacao` + limpeza docs obsoletas
- **Docs:** `REVISAO-INTEGRADA-2026-11-15.md` removida (não era fonte corrente; usar STATUS-E-ESCOPO)
- **Correção auth/autorização:** COMPLETED (SA-01..SA-04, QG-3 PASS, verifier PASS)
- **Módulo 02 Cuidados da Vovó:** COMPLETED (CV-01..CV-06, QG-3 PASS)
- **Módulo 01 Fundação Familiar:** COMPLETED (FF-01..FF-06, QG-3 PASS)
- **Estado persistido:** `docs/esteira/estado/atual.json`
- **Evidência authz:** `docs/esteira/estado/evidencia-correcao-authz.json`
- **App local:** `apps/api` + `apps/web` + Compose (Postgres `:5433`)
- **Auth:** sessão MVP (hash SHA-256 + cookie httpOnly); IdP definitivo ainda em DECISOES.md
- **ACE-C12:** PENDING (lembretes/PWA em dispositivos reais)
- **Commit/push/deploy:** sob decisão humana; não feitos pela esteira

## 2026-11-16 — Módulo 04 COMPLETED (EF-06 + QG-3)

- **EF-06:** destaques discretos em `/familias/:id/inicio` + seção “Para acompanhar” na home; authz por domínio; sem ranking/cobrança
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](b26db6d1-5a99-45cb-865b-b240239f53d9))
- **QG-3:** PASS — `smoke:modulo-04` (reset + EF-01..EF-06)
- **Fingerprint módulo:** `ef-modulo04-qg3-2026-11-16`
- **Evidência:** `docs/esteira/estado/evidencia-qg3-modulo-04.json`
- **Próximo:** designação humana do próximo módulo
- **Commit/push:** não executados

## 2026-11-16 — EF-05 COMPLETED

- **EF-05:** `GET /resumo-previa` + PDF unificado por domínio autorizado; sem anexos; colaboradora 403; UI Exportar PDF em `/resumo`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](b8b12bac-0352-4d8f-970e-4e1b78ae3130))
- **Fingerprint:** `ef05-2026-11-16`
- **Próximo:** EF-06 (destaques home + QG-3)
- **Commit/push:** não executados

## 2026-11-16 — EF-04 COMPLETED

- **EF-04:** GET `/resumo-desenvolvimento` (experiências, categorias, estrelas, observações) + UI `/resumo`; personalizada sem categoria → `nao_classificada`; sem clínica/ranking
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](154e2cdf-934f-4fd0-b44d-e0a5ea3522fc))
- **Fingerprint:** `ef04-2026-11-16`
- **Próximo:** EF-05 (prévia/PDF autorizados)
- **Commit/push:** não executados

## 2026-11-15 — EF-01..EF-03 COMPLETED (pausa M04)

- **EF-01:** histórico unificado + authz domínio · Verifier PASS ([verifier](22602b81-3adf-4bef-8e1f-101960402b5b))
- **EF-02:** filtros período/domínio + UI histórico · Verifier PASS ([verifier](84711f1e-7823-48fb-8dae-1db0cb8297a5))
- **EF-03:** resumo Vovó (previstos/tomadas/não tomadas/sem confirmação) + UI `/resumo` · Verifier PASS ([verifier](06ee571f-88c6-44f6-bcac-8f4ff036404d)); correção datas civis 1/3
- **Pausa:** contexto longo; retomar com `implementation-workflow` em EF-04
- **Restante M04:** EF-04 resumo Laurinha → EF-05 PDF → EF-06 destaques + QG-3
- **Commit/push:** não executados

## 2026-11-15 — Módulo 03 COMPLETED + planejamento Módulo 04

- **Módulo 03:** DL-01..DL-06 COMPLETED; QG-3 PASS ([verifier DL-06](eceeba42-1498-4c75-9f62-92a773b2e6b0))
- **Fingerprint:** `dl-modulo03-qg3-13844004b669409f`
- **Entrega final:** UI saldo/recompensas/resgate; link histórico; authz histórico cuidados||desenvolvimento; smoke-modulo-03
- **Módulo 04:** planejado EF-01 (histórico unificado) → EF-02 UI/filtros → EF-03 resumo Vovó → EF-04 resumo Laurinha → EF-05 PDF → EF-06 destaques+QG-3
- **Commit/push:** não executados

## 2026-11-15 — DL-06 COMPLETED (UI saldo + link M04 + QG-3)

- **Entrega:** card estrelas/recompensas/resgate; link histórico; exigirVisao desenvolvimento; smokes dl05 + modulo-03
- **QG-1/QG-2/QG-3:** PASS · Verifier PASS ([verifier](eceeba42-1498-4c75-9f62-92a773b2e6b0))
- **Fingerprint módulo:** `dl-modulo03-qg3-13844004b669409f`
- **Próximo:** módulo 04 EF-01
- **Commit/push:** não executados

## 2026-11-15 — DL-05 COMPLETED (UI explorar/criar/guardar/registrar)

- **Entrega:** página `/pessoas/[id]/desenvolvimento`; link no perfil; cliente API; gate `podeVer`; só Concluiu/Participou
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](8b73259a-9333-47e4-b309-24443c0538d0))
- **Fingerprint:** `dl05-2026-11-15`
- **Evidências:** `qg1-typecheck-dl05.txt`, `qg2-build-dl05.txt`
- **Correção:** authz UI (1/3) — ocultar formulários sem acesso
- **Próximo:** DL-06 (saldo/recompensas + link histórico M04 + QG-3)
- **Commit/push:** não executados

## 2026-11-15 — DL-04 COMPLETED (recompensas + resgate)

- **Entrega:** CRUD recompensas; resgate com `custoAplicado`; GET estrelas enriquecido; Serializable anti-saldo-negativo
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](8bd6ec6a-f458-4ad1-a69d-f9b422a28640))
- **Fingerprint:** `dl04-2026-11-15`
- **Evidências:** `qg1-typecheck-dl04.txt`, `qg2-build-dl04.txt`, `qg2-smoke-dl04.txt`
- **Próximo:** DL-05 (UI mobile)
- **Commit/push:** não executados

## 2026-11-15 — DL-03 COMPLETED (participação + estrelas)

- **Entrega:** POST participações Concluiu/Participou; estrelas 5/3·15 atômicas; idempotência `execucaoChave`; snapshot; correção; GET estrelas
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](81ba359d-03e1-4327-8409-7dfca96209a6))
- **Fingerprint:** `dl03-2026-11-15`
- **Evidências:** `qg1-typecheck-dl03.txt`, `qg2-build-dl03.txt`, `qg2-smoke-dl03.txt`
- **Próximo:** DL-04 (recompensas/resgate)
- **Commit/push:** não executados

## 2026-11-15 — DL-02 COMPLETED (personalizada + guardar)

- **Entrega:** POST personalizada (nome mín., dificuldade simples); guardar/retirar; PATCH metadados; flag `guardado` na listagem
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](efde3595-c3b1-43f8-a35c-80dcd36a3ab7))
- **Fingerprint:** `dl02-2026-11-15`
- **Evidências:** `qg1-typecheck-dl02.txt`, `qg2-build-dl02.txt`, `qg2-smoke-dl02.txt`
- **Próximo:** DL-03 (participação + estrelas)
- **Commit/push:** não executados

## 2026-11-15 — DL-01 COMPLETED (biblioteca + authz desenvolvimento)

- **Entrega:** schema domínio; `podeVerDesenvolvimento`; seed 6 atividades; `GET /pessoas/:id/desafios` e `GET /desafios?pessoaId=`; área no perfil/cartões
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](cb9b5f2f-1cfb-4361-9be3-176591b91b47))
- **Fingerprint:** `dl01-2026-11-15`
- **Evidências:** `qg1-typecheck-dl01.txt`, `qg2-build-dl01.txt`, `qg2-smoke-dl01.txt`
- **Próximo:** DL-02 (personalizada + guardar)
- **Commit/push:** não executados

## 2026-11-15 — Planejamento módulo 03 READY (DL-01..DL-06)

- **Espec:** `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md` v1.1 aprovada
- **Incrementos:** DL-01 schema/authz/biblioteca → DL-02 personalizada/guardar → DL-03 participação/estrelas → DL-04 recompensas → DL-05 UI fluxos → DL-06 UI saldo + link M04 + QG-3
- **Riscos altos:** privacidade infantil (ADR-006); idempotência/concorrência de estrelas e resgates (ADR-008)
- **Preliminares:** contratos HTTP; tabela de resgate na modelagem
- **Fora deste módulo:** IdP definitivo; M04 completo; ACE-C12
- **Próximo:** `implementation-workflow` DL-01
- **Commit/push:** não executados

## 2026-11-15 — QG-3 UX consolidação 01/02 PASS

- **Smokes:** cv03, authz, modulo-02, cv05 PASS
- **Visual:** capturas 320/375/390 + desktop em `docs/esteira/estado/qg3-capturas/`
- **Correções no gate:** ACE-C11 (Drawer); histórico em linguagem familiar
- **ACE-C12:** PENDING (dispositivos reais)
- **Evidência:** `docs/esteira/estado/evidencia-qg3-ux-01-02.json`
- **Fingerprint:** `ux-01-02-qg3-2026-11-15`
- **Commit/push:** não executados

## 2026-11-15 — CV-PROG-V13 COMPLETED (metadados v1.3 + docs)

- **Entrega:** `alterarProgramacao` persiste metadados CUI-F01; `resolverMetadadosProgramacao` compartilhado; contrato web/API; remoção de `REVISAO-INTEGRADA`; STATUS/ESPECIFICACAO/README alinhados
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](c2b9f6bc-619a-4250-9049-09078c164801))
- **Fingerprint:** `cv-prog-v13-2026-11-15`
- **Próximo:** QG-3 / revisão visual integrada
- **Commit/push:** não executados

## 2026-11-15 — UX-MEDICAMENTO COMPLETED (opção A / UX-11)

- **Decisão:** A — adequar API/Prisma + UI
- **Entrega:** campos v1.3; UI com conferência; `ativar` exige `horariosConferidos`; sugestão só com intervalo explícito
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](76c1bc8d-5025-4107-9979-1056466f0996))
- **Fingerprint:** `ux-medicamento-2026-11-15`
- **Próximo:** QG-3 / revisão visual integrada
- **Commit/push:** não executados

## 2026-11-15 — UX-MEDICAMENTO NEEDS_DECISION (UX-11) — resolvido com opção A

- **Motivo original:** contrato incompleto vs CUI-F01 v1.3
- **Resolução:** opção A aprovada pelo operador
- **Commit/push:** não executados

## 2026-11-15 — UX-CUIDADOS-LISTAS COMPLETED (UX-12/13)

- **Entrega:** consultas/apoio legíveis; histórico cronológico sem ADR-009
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](4ad3d9c9-6283-4f88-b214-cdc44a6b6528))
- **Fingerprint:** `ux-cuidados-listas-2026-11-15`
- **Commit/push:** não executados

## 2026-11-15 — UX-CUIDADOS-ROTINA COMPLETED (UX-07..10)

- **Entrega:** hierarquia rotina/outros/gerenciar; Drawer relato; anti-reenvio
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](5fd7c7b2-24d2-4f48-8c7b-4ea83e86976a))
- **Fingerprint:** `ux-cuidados-rotina-2026-11-15`
- **Commit/push:** não executados

## 2026-11-15 — UX-PERFIL-CONVITE COMPLETED (UX-04/05)

- **Entrega:** perfil com áreas em destaque + vínculo no Accordion; ativação com token da URL
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](fe57a657-2235-4bdc-b513-227ba1cb65e1))
- **Fingerprint:** `ux-perfil-convite-2026-11-15`
- **Commit/push:** não executados

## 2026-11-15 — UX-HOME COMPLETED (pessoas-primeiro + microcopy)

- **Incremento:** UX-HOME (UX-01..UX-03)
- **Entrega:** cartões primeiro; Gerenciar família em Accordion; sem jargão/ids na home
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](f80afdb7-6106-48b7-a1f0-f487696e05a9))
- **Fingerprint:** `ux-home-2026-11-15`
- **Próximo:** UX-PERFIL-CONVITE
- **Commit/push:** não executados

## 2026-11-15 — UX-BASE COMPLETED (Mantine + Azul Contemporâneo)

- **Incremento:** UX-BASE (UX-06 + base UX-14)
- **Entrega:** Mantine 8, tema, providers, PostCSS, feedback compartilhado, tokens Azul Contemporâneo
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](18595357-cc53-4cd6-a487-4c3b9d6058bb))
- **Evidências:** `qg1-typecheck-ux-base.txt`, `qg2-build-ux-base.txt`
- **Fingerprint:** `ux-base-2026-11-15`
- **Próximo:** UX-HOME
- **Commit/push:** não executados

## 2026-11-15 — Planejamento consolidação UX/UI (UX-01..UX-14)

- **Skill:** `module-planning`
- **Fontes:** `docs/ux-ui/GUIA-DE-EXPERIENCIA.md`, `REVISAO-MODULOS-01-02.md`, `DIRETRIZES-PROXIMOS-MODULOS-E-EXECUCAO.md`
- **Reconciliação:** `develop` limpa = `origin/develop` @ `9083b92`; pacote QA anterior COMPLETED
- **Viabilidade Mantine:** PROSSEGUIR com v8 (`@mantine/core` + hooks + notifications); stack Next 15/React 19; sem lib concorrente
- **Incrementos:** UX-BASE → UX-HOME → UX-PERFIL-CONVITE → UX-CUIDADOS-ROTINA → UX-CUIDADOS-LISTAS → UX-MEDICAMENTO (possível NEEDS_DECISION)
- **Fora de escopo:** módulos 03/04 nesta execução
- **Commit/push:** não executados

## 2026-11-15 — Correção auth/autorização COMPLETED (SA-01..SA-04)

- **Causas corrigidas:** admin com clínica automática; `podeVerCuidados`≡visão de pessoa; anexos amplos; token em claro
- **QG-1/QG-2/QG-3:** PASS · Verifier PASS ([verifier](e313a9af-9b15-4051-8b94-18f1737e38d1))
- **Evidências:** `smoke-authz-critico-saida.json`, `smoke-modulo-01-pos-authz.json`, `smoke-modulo-02-pos-authz.json`
- **Fingerprint:** `2d79762e2e65ffba`
- **Commit/push:** não executados

## 2026-11-15 — Planejamento correção auth/autorização

- **Skill:** `module-planning` + execução via `implementation-workflow`
- **Causas:** admin com acesso clínico automático; cuidados≡visão de pessoa; anexos amplos; token em texto puro
- **Incrementos:** SA-01 (permissões) → SA-02 (anexos/áreas) → SA-03 (sessão) → SA-04 (testes/QG)
- **Commit/push:** não executados

## 2026-11-15 — Módulo 02 COMPLETED (CV-01..CV-06 + QG-3)

- **Módulo:** `02-cuidados-vovo` — COMPLETED
- **Entrega:** medicamentos/programação/doses, rotina do dia, consultas/exames/apoio, anexos privados, histórico derivado, resumo/PDF, lembretes derivados, UI mobile
- **Aceites ACE-C01..C11:** PASS (`npm run smoke:modulo-02`); **ACE-C12:** PENDING documentado
- **QG-1/QG-2/QG-3:** PASS · Verifier PASS ([verifier](79d9223b-e8e7-4c44-91f6-e68e5987e49c))
- **Evidência:** `docs/esteira/estado/evidencia-modulo-02.json`
- **Fingerprint:** `803f9fc3c906f5f2`
- **Commit/push:** não executados
- **Próximo produto:** módulo 03 — Desenvolvimento Laurinha (após `module-planning`)

## 2026-11-15 — Planejamento módulo 02 Cuidados da Vovó

- **Skill:** `module-planning`
- **Fonte:** `docs/modulos/02-cuidados-vovo/ESPECIFICACAO.md` v1.0
- **Incrementos:** CV-01..CV-06
- **Riscos altos:** dados de saúde/anexos; colaboradora vs prescrição/Laurinha
- **ACE-C12:** PENDING até dispositivos reais
- **Código de cuidados:** ainda não criado neste passo
- **Commit/push:** não executados

## 2026-11-15 — Módulo 01 COMPLETED (FF-04..FF-06 + QG-3)

- **Módulo:** `01-fundacao-familiar` — COMPLETED
- **FF-04:** convites + ativação + ACE-03/04 (colaboradora→Vovó; 403 Laurinha)
- **FF-05:** revogação com invalidação de sessão + ACE-06/10 (isolamento famílias)
- **FF-06:** perfil `/pessoas/[id]` + CSS mobile + regressão QG-3
- **Aceites ACE-01..10:** PASS (`npm run smoke:modulo-01`)
- **Verifier QG-3:** PASS ([verifier](7aaefaf1-f0fa-43ef-81ce-e3923a1fbd38))
- **Evidência:** `docs/esteira/estado/evidencia-modulo-01.json`
- **Auth:** ainda provisória (DECISOES.md)
- **Commit/push:** não executados
- **Próximo produto:** módulo 02 — Cuidados da Vovó (após `module-planning`)

## 2026-11-15 — FF-03 COMPLETED (autorizações + cartões)

- **Incremento:** FF-03
- **Entrega:** modelo `autorizacao`; `GET/POST .../autorizacoes`; `GET .../inicio` com cartões filtrados; UI home
- **Aceite:** ACE-05, ACE-07 via `npm run smoke:ff03`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](70579d37-5ad4-49df-a8a2-bd9bb91d72f8))
- **Evidência:** `docs/esteira/estado/evidencia-ff-03.json`
- **Commit/push:** não executados

## 2026-11-14 — FF-02 COMPLETED (pessoa + sessão provisória)

- **Incremento:** FF-02
- **Entrega:** Prisma `familia`/`pessoa`/`usuario`/`sessao_provisoria`; `POST /sessoes`, `GET /me`, `GET|POST /familias/:id/pessoas`; UI cadastro só com nome; seed admin fictício
- **Aceite:** ACE-01, ACE-02, ACE-09 via `npm run smoke:ff02`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](a295fba1-32a1-47b1-a94f-6087213c6231))
- **Evidência:** `docs/esteira/estado/evidencia-ff-02.json`
- **Commit/push:** não executados

## 2026-11-14 — FF-01 COMPLETED (bootstrap)

- **Incremento:** FF-01 bootstrap monólito modular
- **Entrega:** `apps/api` (NestJS+Prisma), `apps/web` (Next.js), `docker-compose.yml` (Postgres `:5433`), health `GET /saude`
- **QG-1/QG-2:** PASS · Verifier PASS ([verifier](55c34b52-0254-4227-a5c5-f62c3de159a4))
- **Evidência:** `docs/esteira/estado/evidencia-ff-01.json`
- **Commit/push:** não executados

## 2026-11-14 — Planejamento módulo 01 Fundação Familiar

- **Skill:** `module-planning`
- **Fonte:** `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` v1.0
- **Na época:** `READY` · próximo incremento `FF-01`
- **Código de produto:** ainda não criado nesse passo
- **Commit/push:** não executados

## 2026-11-14 — Bootstrap da esteira v1.0

- **Decisão:** ADR-012 — esteira no mesmo repositório, isolada logicamente.
- **Agente principal:** chat Cursor (orquestrador/desenvolvedor).
- **Subagente:** `verifier` (readonly).
- **Skills:** `module-planning`, `implementation-workflow`, `quality-gate`.
- **Hooks:** `beforeShellExecution`, `beforeMCPExecution`, `preToolUse` com `failClosed`.
- **Na época:** app de produto inexistente; esteira `READY` após validação estrutural.
- **Validação:** `validar-bootstrap.mjs`, `testar-hooks.mjs` (10/10), `simular-retomada.mjs`.
- **Candidatas (avaliar depois):** Vercel React Best Practices; Web Design Guidelines.

## Quality Gates — contratos

| Gate | Escopo | Estado atual |
|---|---|---|
| QG-1 | typecheck, lint, testes do diff | PASS nos módulos 01 e 02 |
| QG-2 | build, smokes, verifier | PASS FF-01..06 e CV-01..06 |
| QG-3 | módulo completo | PASS módulo 01 e 02 (`smoke:modulo-02` + verifier) |

## Limitações conhecidas

- Hooks usam heurística textual; ofuscação pode contornar — não é garantia absoluta.
- Auth definitiva e validação com usuários reais ainda pendentes.
- ACE-08 coberto por checagem estrutural mobile-first; teste em dispositivo real pendente.
- Sem deploy; alterações permanecem no workspace local até commit/push humanos.
