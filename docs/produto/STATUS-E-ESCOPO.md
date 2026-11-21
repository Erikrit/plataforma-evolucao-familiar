# Estado das decisões e escopo

## Situação vigente — V1 homologada em 2026-11-21

**V1 HOMOLOGADA PELO RESPONSÁVEL DO PRODUTO. Publicação para uso adiada por decisão expressa.**
**Baseline do código:** develop @ `2bafbc560cfedc9483151b4dfaaef12b443c0a94`.
**Fonte do aceite:** comunicação humana nesta conversa, após atualização e homologação do Módulo 04.

O aceite abrange a V1 existente dos módulos 01–04. A demanda `DEM-M04-EVO-REV-20261121` recebe homologação humana APROVADA nesta data. Os aceites anteriores integram esta baseline, e as lacunas conhecidas seguem na evolução pós-V1. A V1 é referência histórica para comparar mudanças futuras.

**Próxima fase:** evolução pós-V1, com demandas delimitadas para fechar lacunas. A política para os dados de desenvolvimento está no Documento Mestre §13 e dispensa preservação dos cadastros atuais e compatibilidade com esses dados enquanto o sistema permanecer nesta fase pré-uso.

**Evidências:** estado da esteira e `evidencia-m04-evo-rev-20261121.json` registram QG-1/2/3 PASS e verificação independente shell PASS; verifier oficial BLOCKED por ambiente Ask/shell. Esta atualização registra a homologação comunicada pelo responsável. Testes, aplicação, PDF e segurança não foram reexecutados ou auditados nesta atualização.

### Lacunas para evolução

| Frente já registrada | Área responsável | Encaminhamento |
|---|---|---|
| Remoção/desativação de pessoas e tratamento do histórico funcional | Produto + Arquitetura + UX | Definir comportamento e jornada antes de implementar |
| Opções válidas de vínculo e edição administrativa (UX-HOM-02-SELETOR) | Produto + UX | Fechar opções e apresentação no contexto administrativo |
| Autenticação definitiva, sessões e revisão de segurança | Arquitetura + Qualidade | Reconciliar solução e testes para futura disponibilização |
| Lembretes reais ACE-C12 e canais/dispositivos | Arquitetura + UX + Qualidade | Validar entrega e comportamento em aparelhos previstos |
| Contratos, retenção de dados e PWA/alternativa móvel | Arquitetura | Resolver conforme necessidade efetiva de uso e decisões existentes |

A lista consolida pendências registradas. A ordem de execução será definida por demanda. A dispensa de compatibilidade de dados de teste reduz trabalho de migração e não decide automaticamente regras de exclusão de registros durante o uso.

## Nova prioridade de evolução — famílias, áreas, biblioteca e IA, 2026-11-21

O responsável solicitou tratar estas frentes antes da proposta de desativação de pessoas/vínculos. Aquela proposta fica **ADIADA**, com retomada futura. O foco passa à definição da evolução para outras famílias, exames e resumos por área, biblioteca real/digital por categoria e idade, sugestões assistidas e gestão de acessos.

**Documento de trabalho:** `docs/produto/EVOLUCAO-POS-V1.md`. Reúne as ideias solicitadas, evidência estática da base, recomendações, alternativas pesquisadas e sequência proposta E1..E6. **Estado dos detalhamentos: PROPOSTA**, para fechamento funcional por entrega. O pedido de explorar a evolução não aprova automaticamente as decisões técnicas e regras novas de IA/saúde/jogos/estrelas.

**Recomendação inicial:** famílias/identidade/acessos, seguida de exames e resumo por área. A base de código consultada é develop @ f0a6ca0699cb2f39a8b5b5a59c0d0ab36b6d1e1e. A conta atual pertence a uma pessoa de uma família; permitir participação em múltiplas famílias exige revisão dessa relação. Isolamento é validado no servidor além da URL.

**Próxima ação:** fechar o escopo E1 e suas decisões estruturais. A baseline V1 permanece homologada e com disponibilização adiada. A política pré-uso do Documento Mestre §13 continua aplicável.

## Primeira frente de evolução pós-V1 — 2026-11-21

**Prioridade anterior, agora adiada pelo Produto:** pessoas (remoção/desativação) e organização de vínculos. A inspeção da develop @ 2481f38a9fd259571bd93211ddc5bf5e4475af25 confirma ausência de estado de pessoa e de operação de remoção/desativação; vínculo aceita texto livre e atualização pela própria pessoa ou administrador.

**Proposta em avaliação L3:** desativação reversível, tratamento de conta/sessões e histórico, proteção do último administrador, reativação explícita e vínculo opcional Familiar/Colaborador externo gerido pela administração. Comportamentos, jornada e critérios PES-EVO-01..09 em `docs/ux-ui/REVISAO-MODULO-01-ACESSOS.md`, seção “Evolução pós-V1 — pessoas e vínculos, 2026-11-21”.

**Próximo passo:** decisão de Produto sobre a proposta concreta, seguida de especificação funcional e detalhamento técnico. Código e testes não foram alterados nesta análise.

## Histórico das revisões

Os registros abaixo descrevem as respectivas datas e versões. A situação vigente é a baseline V1 indicada acima.


**Revisão documental:** 2026-11-16. **Branch de referência:** `develop` (`6772243862085ea82acfd4596bdba6288377f842`). **Governança:** `docs/produto/GOVERNANCA.md`. O código e as evidências foram inspecionados documentalmente; os testes não foram reexecutados nesta revisão. Se a `develop` evoluir, reconciliar novamente.

## Separação obrigatória de estados

- **Especificado/aprovado:** decisão oficial na especificação funcional; não implica código.
- **Implementado localmente:** código e rotas identificados no commit de referência; não implica prontidão para uso real.
- **QG-3 PASS registrado:** evidência produzida pelo desenvolvimento, sem reexecução ou auditoria independente nesta reconciliação.
- **Homologado:** aceite humano no escopo e versão identificados. O aceite vigente da V1 está na abertura deste documento; validações de segurança, produção e dispositivos têm evidências e critérios próprios.

## Estado por módulo

| Elemento | Decisão funcional | Estado de implementação/evidência | Pendente antes de uso real |
|---|---|---|---|
| 01 — Fundação Familiar | Especificação v1.2 aprovada (CT-20261116-001) | FF-01..FF-06 e correções de UX 01/02 presentes; QG-3 local registrado | Homologação e revisão de segurança/autenticação |
| 02 — Cuidados da Vovó | Especificação v1.3 aprovada | CV-01..CV-06, programação v1.3 e UX 01/02 presentes; QG-3 local registrado | Lembretes reais ACE-C12, UX em dispositivos e segurança |
| 03 — Desenvolvimento da Laurinha | Especificação v1.1 aprovada | DL-01..DL-06 no código; QG-3 PASS registrado em `evidencia-qg3-modulo-03.json` | Homologação de uso, permissões e experiência |
| 04 — Evolução Familiar | Especificação v1.1 aprovada | EF-01..EF-06 no código; QG-3 PASS registrado em `evidencia-qg3-modulo-04.json` | Homologação de histórico, resumos, PDFs e privacidade |
| Autenticação/autorização | Acesso contextual obrigatório; privacidade por padrão | Sessão MVP cookie httpOnly e autorização contextual presentes; correções SA-01..SA-04 registradas | Revisão de autenticação definitiva, segurança e dispositivos |
| Experiência móvel | Mobile-first, navegação por pessoas e notificações discretas | UX-01..UX-14 com QG-3 e capturas emuladas registradas | Teste com familiares, acessibilidade e aparelhos reais |
| Publicação | Nenhuma decisão de homologação para uso real encontrada | Há código local; sem evidência de implantação homologada nesta revisão | Não inserir dados familiares reais sensíveis |

## Evidências documentais verificadas

- Estado de execução: `docs/esteira/estado/atual.json` (Módulo 04 COMPLETED, EF-06, QG-3 PASS).
- Histórico: `docs/esteira/REGISTRO.md` (em 2026-11-16 registra módulos 01–04 e UX 01/02 como COMPLETED localmente).
- QG-3 dos módulos 03/04: `docs/esteira/estado/evidencia-qg3-modulo-03.json` e `evidencia-qg3-modulo-04.json`.
- QG-3 UX: `docs/esteira/estado/evidencia-qg3-ux-01-02.json`, com capturas emuladas de 320, 375, 390 e 1280 px.
- Código identificado: `apps/api/src/`, `apps/web/src/` e scripts smoke em `apps/api/scripts/`.

**Limite:** registros locais de testes não equivalem a resultados independentes nem provam uso seguro com dados sensíveis. A consulta documental não executou a aplicação, testes ou inspeção de dispositivos.

## Decisões vigentes — apenas referência

- Visão e limites: `docs/produto/DOCUMENTO-MESTRE.md`.
- Regras por módulo: `docs/modulos/*/ESPECIFICACAO.md` (01 v1.2; 02 v1.3; 03/04 v1.1).
- UX: `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` e revisões específicas.
- Arquitetura e pendências técnicas: `docs/arquitetura/ARQUITETURA.md`, `docs/arquitetura/DECISOES.md`.

**Não duplicar regras detalhadas aqui.** Este arquivo consolida estado, riscos e encaminhamentos, e não substitui suas fontes.

**CT-20261116-001 — decisão funcional aprovada e documentada:** gestão de acessos no MVP apresenta apenas Administrador, Responsável e Colaborador e relação quem acompanha quem; sem matriz de permissões na UI. O administrador visualiza somente metadados necessários, e a pessoa acompanhada com conta pode saber quem tem acesso ativo aos próprios dados. Fonte: Módulo 01 v1.2, FUN-04/FUN-07. **Implementação local:** demanda `DEM-CT-20261116-001` COMPLETED na esteira (`GET /acessos`, UI e smokes); **não** equivale a homologação familiar nem revisão de segurança em produção.

## Pendências e encaminhamentos abertos

1. **Segurança/autenticação (Arquitetura + Acompanhamento):** validar mecanismo definitivo, política de acesso/sessões e proteção de dados sensíveis antes de inserir dados reais.
2. **Lembretes ACE-C12 (Arquitetura + UX + Acompanhamento):** validar canais, permissões, dispositivos físicos e limitações reais. Não contar com notificações como único canal seguro para medicamentos.
3. **Homologação dos módulos 01–04 (UX + Acompanhamento):** executar jornadas com usuários autorizados, acessibilidade, privacidade, correção de estados e falhas de rede; não equiparar QG-3 emulado à homologação familiar.
4. **Contratos e dados (Arquitetura):** reconciliar rotas reais com o rascunho de API, critérios de segurança e retenção; mudar comportamento funcional somente via Produto.
5. **PWA/alternativa móvel (Arquitetura):** decidir após validação dos requisitos funcionais nos aparelhos previstos.

**Condução da governança:** mudanças L1 locais, L2 com avaliação de impacto e L3 somente com aprovação explícita do Produto; transferência CT quando necessária. Ver `docs/produto/GOVERNANCA.md`.

## Limites de segurança e execução

O repositório é público. Não incluir imagens de crianças, prescrições, exames, segredos ou dados reais da família. Esta reconciliação é **somente documental**; não altera implementação, estado da esteira, commits, push, merge ou deploy.

## Atualização de homologação UX — 2026-11-16 (posterior à revisão documental acima)

**Referência da inspeção:** `develop` em `e150b70eb4824ea0fedc4679610e254ed02fc5fe`. A homologação técnica R2 `DEM-HOMOL-UX-20261116-R2` registra `PASS` em `docs/esteira/estado/evidencia-homol-ux-r2-20261116.json`; **não equivale ao aceite UX nem à homologação humana**.

**Resultado do teste de uso relatado pelo responsável pelo produto:** **UX REPROVADA**, por falta de identidade visual/ícones, repetição de textos/instruções, confirmação de ações pouco diferenciada e formulários de medicamentos/consultas competindo com a rotina de Cuidados. Trata-se de novo achado humano após os testes técnicos, sem alterar retrospectivamente os resultados automatizados. O escopo e a proposta de organização estão em `docs/ux-ui/REVISAO-MODULOS-01-02.md` e o padrão aprovado em `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` §4.3.

**Próxima ação:** desenhar e validar as jornadas de Cuidados e Desenvolvimento antes de programar; depois implementar alterações UX delimitadas e repetir homologação técnica e de uso. **Status de experiência: NÃO HOMOLOGADA.** Permanecem as pendências de segurança e dispositivos reais descritas acima.

## Reprovação humana de UX — nova rodada relatada em 2026-11-18

**Status: REPROVADA / NÃO HOMOLOGADA (bloqueador de aceite).** O responsável pelo produto realizou nova avaliação humana e comunicou achados que prevalecem sobre quaisquer QG/PASS técnicos. **Referência de inspeção documental do código:** `develop` em `b639f9920d3bbde083c30fb035da413c6e616ede`; trata-se de leitura estática, não de execução independente das telas. A nova avaliação não deve ser confundida com a reprovação anterior de 2026-11-16.

**Problemas humanos relatados:** (1) áreas Cuidados/Desenvolvimento sem acesso continuam visíveis; (2) cartões de medicamentos e atividades de desenvolvimento exibem situação somente em texto, sem ícone semântico claro de confirmação/participação; (3) notificações de resultado permanecem na tela; (4) campo de edição de vínculo aparece no perfil de acompanhamento, digitável, embora deva pertencer à administração autorizada e ter seleção controlada; (5) textos redundantes em home/perfil; (6) terminologia visual antiga “Colaborador”; (7) página de pessoa repete nome, conta, vínculo e “Áreas disponíveis” apesar da navegação contextual.

**Evidências estáticas verificadas:** `apps/web/src/app/pessoas/[pessoaId]/page.tsx` renderiza áreas indisponíveis como cartões desabilitados (linhas 134–182) e `Accordion Editar vínculo e dados` com `TextInput` aberto no perfil (188–212); `apps/web/src/componentes/feedback.tsx` renderiza `Alert` de sucesso/erro enquanto props existirem, sem expiração/fechamento próprios; `apps/web/src/app/page.tsx` e `apps/web/src/componentes/painel-fundacao.tsx` contêm os textos introdutórios relatados; `apps/web/src/componentes/navegacao-app.tsx` já filtra alguns links por áreas autorizadas, mas a página de perfil não aplica a mesma regra de ocultação; `apps/web/src/lib/api.ts` ainda usa o tipo de apresentação `Colaborador`; `apps/web/src/app/pessoas/[pessoaId]/cuidados/page.tsx` usa texto `Med`/`Cons` como marcadores e status textual; Desenvolvimento exige auditoria visual dos cartões/resultados. Nenhuma constatação presume acesso real indevido no backend, que exige teste direto de autorização.

**Encaminhamento:** corrigir primeiro visibilidade/autorização e edição administrativa, depois estados visuais/feedback e redução de conteúdo duplicado, finalmente comparar as três experiências Integrante/Responsável/Administrador em mobile e desktop e repetir **homologação humana**. Não utilizar dados reais sensíveis antes de segurança e homologação pertinentes. Critérios e backlog detalhados em `docs/ux-ui/REVISAO-MODULOS-01-02.md`.


## Aceite humano da primeira rodada corretiva de UX — 2026-11-18

**Resultado: HOMOLOGADA PELO RESPONSÁVEL DO PRODUTO, COM ESCOPO DELIMITADO.** Após a implementação documentada da demanda `DEM-UX-HOM-20261118` (QG-1/QG-2/QG-3 e verifier com PASS técnico registrado), o responsável pelo produto avaliou a interface como significativamente melhor e **aprovou expressamente a primeira revisão corretiva de UX**. Este aceite cobre os ajustes de interação e apresentação identificados em `UX-HOM-01..07` como rodada, **sem declarar concluída toda a UX da plataforma** e sem apagar as reprovações históricas de rodadas anteriores.

**Fora desse aceite, para etapa futura de Fundação Familiar:** (a) administrador não consegue remover pessoas cadastradas; distinguir retirada de acesso, desativação e possível exclusão de cadastro sem perda indevida de histórico; (b) gestão de responsabilidades/acessos ainda confusa e com opção limitada de concessão. Esses itens **não integravam o escopo de `DEM-UX-HOM-20261118`**, logo ficam **REGISTRADOS/PENDENTES**, não reprovam retroativamente esta primeira rodada. Também permanece `UX-HOM-02-SELETOR` (`NEEDS_DECISION`) para opções válidas de vínculo em contexto administrativo. Alterações de regras de pessoa/autorização exigem Produto e Arquitetura segundo governança; não presumir autorização para excluir pessoas nem introduzir matriz granular de permissões.

**Escopo explícito do aceite:** apenas a primeira rodada de apresentação/interação validada humanamente; **não equivale a homologação integral dos Módulos 01–04, segurança de dados reais, autorizações auditadas em produção, notificações em dispositivos físicos ou implantação**. Evidências automatizadas documentadas continuam com seu próprio status; não reexecutadas neste registro. O status anterior `REPROVADA` permanece como **histórico da rodada anterior**, superado **somente para o escopo homologado** por este aceite de 2026-11-18.

**Próxima etapa de UX:** aprofundar a experiência do **Módulo 03 — Desenvolvimento da Laurinha** (biblioteca/atividades, participação, estrelas e recompensas), seguida de homologação humana própria. Não retomar as melhorias administrativas antes de concluir a sequência de UX, salvo risco real de segurança.

## Homologação humana reprovada — Módulo 03, rodada de 2026-11-19

**Resultado comunicado pelo responsável do produto: REPROVADA.** A implementação mais recente foi avaliada humanamente, com quatro achados: (1) falta de organização/agrupamento de brincadeiras por categorias de desenvolvimento; (2) criação de brincadeiras e recompensas deveria ficar em área própria de cadastro; (3) substituir aba `Guardadas` por `Executadas`, movimentando atividade após registro e permitindo reativação pelo Responsável; (4) recompensas em submenu com `Disponíveis` e `Resgatadas`, com opção de repetir um resgate legítimo de recompensa já utilizada.

**Referência documental consultada:** `develop` em `f498694a391f008f0d244caf2b892832d3c146d7`. Esta branch ainda não apresenta evidência inequívoca da última implementação informada; **não atribuir as lacunas ao código não sincronizado**. Inspeção documental nesta data identificou contratos antigos com `guardados`, categorias já enumeradas, participações registradas com histórico e resgates com custo histórico; reconciliar com o workspace e a entrega efetivamente homologada antes de planejar implementação.

**Classificação:** organização por categorias e área de cadastro = UX, com validação da taxonomia/contratos; `Guardadas → Executadas` com transição automática e reativação = **mudança funcional DEV-F03/DEV-F04, L3**; repetição e visão de resgates = **revisão funcional DEV-F06, L3**. Não tratar como alteração de texto sem rever persistência, semântica e autorização.

**Acompanhar em:** `docs/ux-ui/REVISAO-MODULO-03.md`, seção `Reprovação humana — 2026-11-19`. **Status de Módulo 03: UX REPROVADA**, mesmo com eventuais testes técnicos verdes. O aceite humano anterior continua válido **somente** para a primeira rodada corretiva transversal `UX-HOM-01..07`; não se estende ao Módulo 03.

**Pendências administrativas do Módulo 01** (remoção de pessoas, gestão de acessos e seletor de vínculos) continuam adiadas para depois da sequência de UX, salvo risco de segurança.

## Aprovação funcional L3 do Módulo 03 — 2026-11-19

**Decisões `CT-20261119-001` e `CT-20261119-002`: APROVADAS PELO PRODUTO e DOCUMENTADAS** na especificação funcional `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md` v1.2. Brincadeiras migram de Explorar para Executadas após participação confirmada e voltam somente com disponibilização autorizada; recompensas migram de Disponíveis para Resgatadas após resgate confirmado e podem voltar para novo resgate **com novo débito**. Histórico, estrelas, custos efetivos e autoria anteriores são preservados. Tentativas repetidas e concorrência exigem idempotência, autorização e ausência de saldo negativo.

**Não significa implementação concluída ou UX homologada.** A reprovação humana de 2026-11-19 segue vigente. A primeira revisão corretiva transversal de UX continua homologada apenas no próprio escopo.

**Arquitetura (2026-11-19):** `ADR-013` registrada em `docs/arquitetura/DECISOES.md` e refletida em `ARQUITETURA.md`.  
**Implementação técnica (2026-11-19):** demanda `DEM-CT-20261119-001-002` **COMPLETED** na esteira (QG-1/2/3 + verifier PASS; evidência `docs/esteira/estado/evidencia-ct-dl-exec-rec-20261119.json`). Código local ainda **sem commit**. Homologação humana do Módulo 03 permanece **PENDING_HUMAN** / UX **REPROVADA** até novo aceite.

## Nova reprovação humana — Módulo 03, revisão de UX R3 (2026-11-19)

**Status: REPROVADA / NÃO HOMOLOGADA.** Após implementação de Executadas/Resgatadas, o responsável pelo produto identificou: (1) troca indevida de aba depois de marcar brincadeira ou resgatar recompensa — apenas o item deve mudar de lista; (2) Cadastros não foi convertido em submenu do menu lateral contextual; (3) categorias de desenvolvimento não foram disponibilizadas como filtro/campo de criação. **Inspeção de código:** `develop` no commit `28c32fa4038a497fbcb74cf5ecf4047f465c5dee` confirma seleções automáticas de abas, formulário de cadastros na página e ausência de filtro de categorias. Os mecanismos existentes de estados persistidos e dados funcionais não são revogados pela reprovação da UX.

**Correção:** ver `docs/ux-ui/REVISAO-MODULO-03.md`, IDs `DEV-UX-HOM-R3-01..03`. São correções de interação e navegação, preservando DEV-F03/F04/F06 v1.2 e ADR-013. A tarefa técnica só poderá ser declarada pronta após testes; aceite humano exige nova avaliação. Primeira homologação transversal UX continua homologada no escopo próprio; pendências administrativas do Módulo 01 seguem adiadas.

## Homologação humana APROVADA — Desenvolvimento (UX R3), 2026-11-19

**Resultado: HOMOLOGADA PELO RESPONSÁVEL DO PRODUTO no escopo do Módulo 03 — correções R3.** Após a implementação dos itens `DEV-UX-HOM-R3-01..03`, o responsável do produto comunicou expressamente **“alterações feitas, validação humana aprovada”**. Essa decisão **supera a reprovação humana anterior apenas para o escopo UX do Desenvolvimento**; preservam-se os registros de reprovação anteriores como histórico e os aceites de versões anteriores sem retroação.

**Revisão do código disponível na `develop`:** commit `7dad200a85feb5b2534b941ad31581089f941812` — `apps/web/src/app/pessoas/[pessoaId]/desenvolvimento/page.tsx` contém filtragem por categoria e fluxo de registro/resgate sem seleção programática automática da aba de destino; `apps/web/src/componentes/navegacao-app.tsx` inclui entrada contextual `Cadastros`; `apps/web/src/app/pessoas/[pessoaId]/desenvolvimento/cadastros/page.tsx` contém formulário de brincadeira com categoria opcional e de recompensa. A esteira registra `DEM-UX-HOM-R3-20261119` tecnicamente `COMPLETED` / QG+verifier `PASS`, evidências locais não reexecutadas neste registro. **O aceite humano foi comunicado pelo responsável**, não inferido de código, screenshots ou testes técnicos.

**Status de UX do Módulo 03: HOMOLOGADA NA RODADA R3.** Não equivale a homologação integral de segurança, autorização em produção, todos os módulos, dispositivos não avaliados ou liberação para dados familiares reais. Pendências administrativas do Módulo 01 continuam postergadas. **Próxima revisão UX planejada:** Módulo 04 — Evolução Familiar (Histórico, Resumo e PDF), orientada pela especificação aprovada, sem iniciar código antes da avaliação.

## Repriorização aprovada — Módulo 01 antes do Módulo 04 (2026-11-19)

O responsável pelo produto solicitou **priorizar a revisão de permissões e a experiência administrativa do Módulo 01 — Fundação Familiar**, diante de falhas percebidas, e **adiar temporariamente a revisão UX do Módulo 04 — Evolução Familiar**. Essa mudança de prioridade não revoga a homologação humana de UX do Módulo 03 nem autoriza mudanças de permissões por inferência.

**Inspeção estática de `develop` em `fe4c8cbc3f529f3a9cdbba1bf73bc84c386c7e24`:** a tela `painel-gerenciar-familia.tsx` oferece uma única concessão direta `responsavel_desenvolvimento` para `usuario.id` (administrador logado), convite predefinido `colaboradora_cuidados` e revogação de acessos; já o serviço `servico-autorizacoes.ts` aceita `usuarioId` de outro usuário da mesma família e responsabilidades técnicas diversas sob verificação de administrador. **Lacuna confirmada de cobertura/clareza da UI; não é prova de bypass de autorização.** O Módulo 01 v1.3 mantém três rótulos de apresentação, autorização contextual, ausência de matriz granular e proibição de acesso automático a dados sensíveis pelo Administrador.

**Próxima etapa prioritária:** revisão conjunta de UX, Produto, Arquitetura e Qualidade com cenários de administrador, responsável, integrante e revogação, começando por relatos concretos do teste humano e comparação com controles do servidor. Não implementar concessões adicionais, alteração de papel ou exclusão de pessoas sem decisão funcional e avaliação de segurança. Registrar achados e propostas em `docs/ux-ui/REVISAO-MODULO-01-ACESSOS.md`. **Módulo 04 permanece próximo na fila após resolução/homologação do Módulo 01.**

**Parecer de Arquitetura (2026-11-19), `develop` @ `efee45267afcfb5f7312b12db268377a1e644dc2`:** `CT-20261119-003` reconciliado na ADR-014. As combinações concedíveis são Cuidados/Responsável, Cuidados/Integrante e Desenvolvimento/Responsável, mapeadas às responsabilidades já existentes. Administrador permanece fora desse fluxo, com preservação do último administrador no servidor. Não há decisão funcional nova para o Produto. Exclusão de pessoa continua pendência própria. Código de produto não foi alterado neste parecer; o Módulo 01 segue sem homologação desta rodada.

## Nova reprovação humana e direção funcional do Módulo 01 — 2026-11-20

**Resultado humano: REPROVADA** após nova implementação das correções administrativas, conforme informado pelo responsável do Produto. Queixa principal: confusão entre cadastro de pessoa, conta de usuário e responsabilidades; proposta de distinção intuitiva entre pessoa acompanhada, participante e acesso, incluindo autoacompanhamento e abertura da rotina após login. **Implementação técnica inspecionada:** `develop` @ `687eb25afd41f519e9e473ef49169008e94ae2e2`. Estado da esteira: `DEM-M01-ACESSOS-CORR-20261120` com QG-1/QG-2/verifier `PASS`, homologação `PENDING_HUMAN` no arquivo de estado; o retorno humano informado nesta conversa é **REPROVADA**, superando esse estado para o escopo examinado, sem alterar indevidamente os resultados técnicos históricos.

**Decisão funcional de Produto:** APROVADA a **direção conceitual** de pessoa acompanhada com/sem conta, conta podendo acompanhar a si/outros/ambos, responsabilidade contextual não exclusiva, cadastro mínimo com eventual convite/ativação de conta e navegação pós-login contextual. Registrada no Documento Mestre v1.3 e Especificação do Módulo 01 v1.4. **Não** foram aprovados novos gates/checkboxes granulares, tipo Ator exclusivo ou exigência de senha/e-mail para toda pessoa. **Ainda pendem** análise de segurança da associação conta↔pessoa existente, poderes de autoacompanhamento além da leitura e detalhamento de navegação para múltiplas áreas. Encaminhar a Arquitetura e UX antes de implementação, sem violar ADR-014.

**Prioridade:** Módulo 01; Módulo 04 permanece pausado. Aceite humano UX do Módulo 03 preservado no escopo já aprovado.

## Fechamento de Produto — cadastro e autoacompanhamento, 2026-11-20

**Decisões APROVADAS e DOCUMENTADAS** no Documento Mestre v1.4 e na especificação do Módulo 01 v1.5, seção 11. O responsável informou que o sistema ainda não foi lançado e não possui usuários em utilização. Tratamento de contas legadas fica dispensado nesta entrega; o fluxo ordinário de cadastro/ativação mantém a identidade Pessoa/Usuario consistente.

**Autoacompanhamento:** manter as capacidades efetivas atuais, inclusive programação e exportação dependentes de responsabilidade contextual. As duas pendências do alinhamento anterior estão encerradas para esta entrega. A entrada pós-login deriva de pessoa/área realmente autorizadas, incluindo acesso próprio. O detalhamento de UX e implementação segue pela esteira, com referência à especificação v1.5 e ao esclarecimento da ADR-014.

**Evidência desta atualização:** decisão expressa do responsável nesta conversa, com autorização explícita de commit documental no GitHub. Base da revisão estática develop @ 89f47d38a5b6e5d05f8145545bfc6b2327f98db8. Esta atualização altera documentação; código e testes não foram executados neste fechamento.

**Próximo passo:** task-routing para executar a simplificação aprovada do Módulo 01, testes pertinentes e nova homologação humana. Estado humano permanece REPROVADA nesta rodada. Módulo 03 conserva o aceite R3 e Módulo 04 permanece pausado.

## Homologação humana APROVADA — simplificação do Módulo 01, 2026-11-20

**Resultado comunicado expressamente pelo responsável do Produto: APROVADA.** O responsável informou nesta conversa “Foi feito a atualização e a homologação foi aprovada.” O aceite corresponde à atualização de cadastro, conta, acessos/autoacompanhamento e entrada contextual do Módulo 01 v1.5, demanda `DEM-M01-SIMP-CAD-20261120`, critério humano `M01-SIMP-HOM`.

**Referência disponível no repositório:** `develop` @ `5260fc672f3b207e659c888ac78e436e0548f8ae`, commit da simplificação do Módulo 01. A vinculação desta comunicação à demanda considera a continuidade da atualização tratada nesta conversa. O aceite foi informado pelo responsável; esta atualização documental não reproduziu a avaliação nem reexecutou testes.

**Situação vigente desta rodada: HOMOLOGADA PELO RESPONSÁVEL DO PRODUTO.** Este registro supera a reprovação e a espera de aceite humano para o escopo desta atualização, preservando os registros históricos. Os resultados técnicos permanecem os registrados pela esteira, inclusive a distinção entre verifier oficial bloqueado e verificação independente via shell registrada como PASS. Pendências de segurança/autenticação, produção e dispositivos mantêm seus próprios critérios.

**Próxima etapa da sequência aprovada:** retomar a revisão UX do Módulo 04 — Evolução Familiar (Histórico, Resumo e PDF). Pendências próprias do Módulo 01, como exclusão/desativação de pessoa e seletor de vínculos, continuam sujeitas ao encaminhamento específico. Aceite R3 do Módulo 03 preservado.

## Retomada da revisão UX do Módulo 04 — 2026-11-20

**Estado desta rodada: EM REVISÃO; proposta de experiência aguardando validação.** Revisão estática na develop @ 64a4a0694d6d370267d8b7ff7d381aa484bec97b, após o aceite humano do Módulo 01. Achados e proposta registrados em docs/ux-ui/REVISAO-MODULO-04.md.

**Achados prioritários** seleção de prévia diferente do PDF, corte de linhas no gerador de página única, limites silenciosos de contagem/listagem, representação da capacidade de exportação e cobertura dos registros previstos no resumo. Troca rápida de contexto e combinação de permissões exigem testes. A aplicação, os testes e os PDFs não foram executados nesta revisão.

**Próximo encaminhamento** Produto valida a composição de Histórico/Resumo/prévia. Arquitetura e Qualidade avaliam as correções de aderência à especificação v1.1; alterações funcionais adicionais seguem governança. Homologações anteriores mantêm seu escopo.

## Direção UX do Módulo 04 APROVADA — 2026-11-20

**APROVADA expressamente pelo responsável do Produto** a organização apresentada de Histórico, Resumo e PDF. Direção e plano de execução documentados em `docs/ux-ui/REVISAO-MODULO-04.md`, seções 1 e 6. Histórico por dia com filtros compactos; Resumo contextual por pessoa/período; preparar PDF, conferir e baixar o conteúdo completo autorizado.

**Próximo passo** rotear e planejar correções EVO-REV-01..08 com a esteira existente, implementar, testar e encaminhar à homologação humana. A especificação funcional v1.1 permanece a fonte dos requisitos. Situação desta rodada é **DIREÇÃO UX APROVADA / IMPLEMENTAÇÃO PENDENTE / HOMOLOGAÇÃO HUMANA PENDENTE**.

Este registro documenta a decisão de Produto, com base na develop @ c75800f0e14090434a71a5f038ec2cf09ac1f9d5. Código e testes não foram executados nesta atualização documental. Aceites anteriores mantêm seus próprios escopos.
