# Estado das decisões e escopo

**Revisão documental:** 2026-11-16. **Branch de referência:** `develop` (`6772243862085ea82acfd4596bdba6288377f842`). **Governança:** `docs/produto/GOVERNANCA.md`. O código e as evidências foram inspecionados documentalmente; os testes não foram reexecutados nesta revisão. Se a `develop` evoluir, reconciliar novamente.

## Separação obrigatória de estados

- **Especificado/aprovado:** decisão oficial na especificação funcional; não implica código.
- **Implementado localmente:** código e rotas identificados no commit de referência; não implica prontidão para uso real.
- **QG-3 PASS registrado:** evidência produzida pelo desenvolvimento, sem reexecução ou auditoria independente nesta reconciliação.
- **Homologado:** validação pertinente com usuários/dispositivos, segurança e critérios exigidos; **não foi demonstrada para o MVP**.

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
