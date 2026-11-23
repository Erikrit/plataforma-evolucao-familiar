# Estabilização pré-uso

**Demanda:** `ESTABILIZACAO-PRE-USO-20261122`  
**Tipo:** transversal · **Risco:** alto (saúde, documentos, auth, operação)  
**Aprovação:** pedido humano de estabilização sem E6/E7 e sem novas funcionalidades  
**Base reconciliada:** `develop` @ `3491646` (EST-00..04 com fechamento técnico e homologação registrados). A expansão digital aprovada segue demanda própria.
**Estado:** EST-00..04 COMPLETED técnico · QG-3 PASS · **homologação humana APROVADA** · demanda `HOMOLOGADA` · publicação não autorizada

## Contexto homologado

| Frente | Homologação humana | Nota |
|---|---|---|
| E1 entrada | APROVADA | Escopo DEM-E1-ENTRADA |
| E2 acessos/link | APROVADA | Envio automático de e-mail adiado |
| E3 exames/resumo | PENDING_HUMAN | `DEF-E3-ANEXO-SALVAR-20261122` CORRIGIDO TECNICAMENTE (EST-01); E3-HOM pendente |
| E4 biblioteca real | APROVADA_PARCIALMENTE | Revalidação residual pós-E5 |
| E5 jogos + UX R2 | APROVADA (R2) | Reprovações R1/R2 históricas preservadas |
| Publicação uso real | NÃO AUTORIZADA | Bloqueios abaixo |

## Incrementos

### EST-00 — Reconciliação e critérios de bloqueio

- **Problema comprovado:** STATUS/estado marcavam E5 R2 como REPROVADA/PENDING; checkout já em `e050a99` limpo; demanda apontava alterações locais inexistentes.
- **Impacto/risco:** médio (rastreabilidade); alto se publicar com estado falso.
- **Arquivos:** `STATUS-E-ESCOPO.md`, `atual.json`, `REGISTRO.md`, evidências/roteiros E5 R2, este plano.
- **Menor solução:** alinhar status humano à confirmação do responsável; preservar REPROVADA no histórico; inventariar riscos sem alterar produto.
- **Aceite:** estado real documentado; E5 R2 APROVADA; plano EST-00..04 publicado; sem inventar PASS de testes.
- **Testes:** inspeção Git + leitura de evidências (sem reexecução obrigatória nesta fatia).
- **Dependências:** nenhuma de código.
- **Homologação humana:** não (registro de aceite já dado para E5 R2).

### EST-01 — Anexos E3 (`DEF-E3-ANEXO-SALVAR-20261122`) + UX Resumo/Histórico

- **Problema comprovado:** HTTP 413 em POST de anexo com body ~273 KB (arquivo ~200 KB em base64); uploads pequenos OK. E3-HOM impedida. UX de Resumo/Histórico inconsistente com o padrão Card/`coresPef` da Rotina (autorizado pelo responsável nesta rodada).
- **Impacto/risco:** alto (documento); médio (usabilidade Evolução).
- **Arquivos:** `main.ts`, `limites-anexo.ts`, `servico-anexos.ts`, `consultas/page.tsx`, `historico/page.tsx`, `resumo/page.tsx`, `smoke-e3.mjs`.
- **Solução aplicada:** `useBodyParser` 12 MB; validação 8 MB; checagem/retry na UI; smoke médio >100 KB; layout Evolução alinhado ao PEF.
- **Aceite técnico:** PASS (QG + verifier PASS_COM_ACHADOS). **Aceite humano E3-HOM:** PENDING.
- **Achado residual:** anexo órfão possível se o usuário abandonar o formulário após upload (retry sem duplicata mitigado).
- **Dependências:** EST-00.
- **Homologação humana:** E3-HOM na UI com PDF ~200 KB fictício.

### EST-02 — Autenticação, sessões, convites e autorização

- **Problema comprovado:** STATUS listava “autenticação definitiva, sessões e revisão de segurança” como lacuna pré-disponibilização; E1/E2 homologadas no escopo funcional, não como revisão de produção.
- **Decisão de Produto APROVADA (2026-11-22) — segurança enxuta para uso familiar privado:**
  - Manter autenticação existente por sessão/cookie.
  - Não migrar para JWT.
  - Não criar arquitetura empresarial de autenticação.
  - Reutilizar autorizações contextuais existentes (ADR-006 / ADR-014).
  - Preservar isolamento entre famílias e pessoas.
  - Corrigir somente falhas comprovadas.
- **Registro canônico:** ADR-015 em `docs/arquitetura/DECISOES.md` (não duplicar regras aqui).
- **Impacto/risco:** alto para uso real.
- **Arquivos:** auth/guarda-sessão, cookie `pef_sessao`, convites, `servico-autorizacoes.ts`, smokes e1/e2/authz, ADR-006/014/015.
- **Menor solução:** inventário e regressão dos controles vigentes; correções só de defeito reproduzido; sem redesenho de auth.
- **Aceite técnico:** regressão login/sessão/logout + E1/E2/authz PASS; inventário de controles e gaps/riscos residuais documentados; **não** marcar COMPLETED só com docs — exige evidência de testes.
- **Testes essenciais (proporcionais):** login válido/inválido; validade/expiração de sessão; logout/revogação; cookie em produção (`COOKIE_SECURE`); HTTPS/CORS/origem e proteção CSRF (sameSite + origem); proteção básica a tentativas repetidas de login; acesso direto não autorizado; isolamento pessoas/famílias; documentos de saúde e dados infantis via authz existente.
- **Dependências:** EST-01 preferível (não bloqueante técnico).
- **Homologação humana:** não exigida nesta fatia (sem mudança de jornada de acesso). Publicação permanece não autorizada.
- **Resultado técnico:** regressões PASS; correção local `clearCookie` alinhado a `COOKIE_SECURE`; gaps residuais (sem rate-limit de login; HTTPS/`COOKIE_SECURE`/`WEB_ORIGIN` no ambiente alvo) documentados como bloqueantes operacionais — ver evidência EST-02.
- **Verifier:** PASS_COM_ACHADOS (`da2a6d0d-442f-4cae-9b1f-8738694a624f`) — fingerprint recalculado no fechamento.
- **Estado do incremento:** COMPLETED técnico.

### EST-03 — Histórico, resumo, PDF, documentos privados e E4 residual

- **Problemas comprovados (diagnóstico):** (1) `resumo-cuidados` / `resumo-previa` / `relatorio.pdf` sem `Cache-Control: private, no-store`; (2) Resumo/prévia expunham `temDocumento=true` à colaboradora (Histórico já omitia). Isolamento famílias/pessoas, paridade prévia/PDF sem bytes de anexo e smoke E4 já PASS na baseline.
- **Impacto/risco:** alto (privacidade); E4 residual médio (tipificação).
- **Arquivos:** `controlador-cuidados.ts`, `servico-acompanhamento.ts`, `smoke-est-03-docs.mjs`, `package.json` (script).
- **Correções:** headers de cache alinhados ao Histórico; `temDocumento` gated por `podeConsultarAnexosCuidados`.
- **Aceite técnico:** PASS (QG + verifier PASS_COM_ACHADOS). E4 residual tipificada sem reescrita do módulo; expansão de catálogo permanece L3 fora.
- **Testes:** `smoke:est-03-docs` (15), e3/e4/e5/authz, typecheck, builds.
- **Desempenho:** sem novo defeito nesta fatia; otimizações da auditoria 2026-11-22 preservadas.
- **Dependências:** EST-01 para jornada de documento.
- **Homologação humana:** PENDING — [roteiro-homologacao-est-03.md](../estado/roteiro-homologacao-est-03.md).
- **Estado do incremento:** COMPLETED técnico.

### EST-04 — Banco, backup/restore, Docker, health e implantação

- **Problema comprovado:** `docker-compose` só Postgres local; health API `GET /saude` existe no histórico da esteira; **não há evidência de backup/restore validado**; publicação não autorizada.
- **Impacto/risco:** alto declarar “pronto para uso” sem restore; médio para operação local.
- **Arquivos:** `docker-compose.yml`, Prisma migrate, README, health endpoint, scripts de esteira.
- **Menor solução:** documentar e validar em ambiente local/controlado: migrate aditiva, backup, restore, healthcheck; checklist de bloqueio; **sem deploy**.
- **Aceite:** procedimento de backup/restore executado com evidência; health OK; critérios de bloqueio aplicados; sem db reset destrutivo em banco compartilhado.
- **Testes:** restore em volume descartável; health; migrate dry-run/status.
- **Dependências:** EST-01..03 preferíveis para não validar ops sobre defeito crítico aberto.
- **Homologação humana:** autorização explícita de publicação (fora desta demanda até critérios verdes).
- **Resultado técnico (2026-11-22):** pasta `prisma/migrations` ausente — estratégia local `db push` + conferência `prisma migrate diff` (sync OK). Backup `pg_dump` + restore em `pef_restore_est04` (23=23 tabelas) com evidência. Docker healthy; `/saude` 200 com banco e 503 sem banco. Smoke `est-04-ops` 15 PASS. Procedimento: [procedimento-est-04-ops.md](../estado/procedimento-est-04-ops.md). Evidência: [evidencia-est-04-20261122.json](../estado/evidencia-est-04-20261122.json).
- **Bloqueios residuais:** restore local ≠ VPS; sem histórico migrate para alvo; compose só Postgres; gaps EST-02 (login/HTTPS/cookie/origem); humanos PENDING; publicação não autorizada.
- **Estado do incremento:** COMPLETED técnico (ops local); **não** autoriza uso real.

## Ordem por risco real

1. EST-01 anexos (defeito aberto que impede E3-HOM)  
2. EST-02 auth/autorização (bloqueia dados reais)  
3. EST-03 privacidade documental + E4 residual  
4. EST-04 ops/backup (bloqueia declaração de prontidão)

## Critérios de bloqueio para uso real

Não declarar pronto para uso real enquanto qualquer item abaixo for verdadeiro:

1. `DEF-E3-ANEXO-SALVAR` aberto ou E3-HOM sem aceite após correção  
2. Regressão auth/autorização/isolamento familiar falha  
3. Backup e restore sem evidência válida no ambiente alvo  
4. Segredos/dados reais no repositório ou logs  
5. Ausência de autorização humana explícita de publicação  
6. E6/E7 ou funcionalidade nova introduzida sob rótulo de estabilização  
7. Ambiente de uso real sem HTTPS + `COOKIE_SECURE=true` + `WEB_ORIGIN` correto  
8. Ausência de proteção básica a tentativas repetidas de login no ambiente alvo (gap confirmado em EST-02; mitigação mínima exige decisão se for além do padrão local de cadastro)

## Próxima ação

**Homologação humana APROVADA** (2026-11-22) para E3-HOM, EST-03, E4 residual e COR-UX-HOM. Evidência: [evidencia-estabilizacao-hom-20261122.json](../estado/evidencia-estabilizacao-hom-20261122.json). E5 UX R2 permanece APROVADA no seu escopo.

## Preparação da primeira publicação

1. Preparar migração inicial versionada e carga oficial idempotente em CAT-01. Na V1, validar 24 modelos E4, oito jogos E5 e 40 fases, sem dados familiares, contas ou progresso de demonstração.
2. Fechar gaps EST-02 no alvo. O cadastro inicial é aberto para criar família própria. Homologar duas famílias independentes, convite para ingresso em família existente, proteção de cadastro/login, HTTPS, cookie seguro e origem correta.
3. Conferir PRs, proteções e consumidores da branch padrão antes de renomear `main` para `master`. Confirmar branch padrão, destino das PRs e filtros da esteira após a mudança. CI na PR `develop` → `master`, com banco descartável. Gerar imagens de versão por SHA e digest.
4. Após CAT-HOM aprovado, ensaiar instalação, saúde, anexos, restore isolado e rollback de imagem no alvo. O rollback precisa ser compatível com o schema aplicado. Backup de dados exige proteção e cópia fora da VPS.
5. Com autorização separada, publicar por ação humana, aplicar migrações e carga oficial, validar por consultas de leitura e liberar o onboarding real.

**Estado:** primeira publicação pendente. [Plano CAT](evo-catalogo-jogos-20261122.md).
