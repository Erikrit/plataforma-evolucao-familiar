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
