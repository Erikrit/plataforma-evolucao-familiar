# Estabilização pré-uso

**Demanda:** `ESTABILIZACAO-PRE-USO-20261122`  
**Tipo:** transversal · **Risco:** alto (saúde, documentos, auth, operação)  
**Aprovação:** pedido humano de estabilização sem E6/E7 e sem novas funcionalidades  
**Base reconciliada:** `develop` @ `e050a999b2a040df62860d4ecd113c11b0718ccc` (working tree limpa)  
**Estado:** EST-00 COMPLETED · EST-01 COMPLETED técnico (E3-HOM PENDING_HUMAN) · EST-02 READY

## Contexto homologado

| Frente | Homologação humana | Nota |
|---|---|---|
| E1 entrada | APROVADA | Escopo DEM-E1-ENTRADA |
| E2 acessos/link | APROVADA | Envio automático de e-mail adiado |
| E3 exames/resumo | PENDING_HUMAN | `DEF-E3-ANEXO-SALVAR-20261122` ABERTO |
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

- **Problema comprovado:** STATUS lista “autenticação definitiva, sessões e revisão de segurança” como lacuna pré-disponibilização; E1/E2 homologadas no escopo atual, não como revisão de produção.
- **Impacto/risco:** alto para uso real.
- **Arquivos:** auth/guarda-sessão, convites, `servico-autorizacoes.ts`, smokes e1/e2/authz, ADR-006/014.
- **Menor solução:** inventário de gaps vs baseline homologada; correções só de regressão/defeito comprovado; sem redesenhar auth definitiva sem decisão L3.
- **Aceite:** regressão E1/E2/authz PASS; lista explícita do que ainda bloqueia produção.
- **Testes:** smokes e1-ent, e2, authz, ct-acessos.
- **Dependências:** EST-01 preferível (não bloqueante técnico).
- **Homologação humana:** se alterar jornada de acesso; senão evidência técnica + nota de gaps.

### EST-03 — Histórico, resumo, PDF, documentos privados e E4 residual

- **Problema comprovado:** E4-HOM parcial; PDF/resumo sem anexos embutidos (desenho E3); documentos privados dependem do fluxo de anexo estável.
- **Impacto/risco:** alto (privacidade/isolamento); médio se só tipificação E4.
- **Arquivos:** `servico-acompanhamento.ts`, páginas histórico/resumo, API PDF, biblioteca E4, smoke e4/e5.
- **Menor solução:** regressão de isolamento e paridade prévia/PDF; tipificar pendências E4 sem reescrever módulo aprovado.
- **Aceite:** sem vazamento entre pessoas/famílias; PDF sem anexos; E4 residual documentada ou revalidada no escopo mínimo.
- **Testes:** smoke e4, regressão resumo/PDF, authz documentos.
- **Dependências:** EST-01 para jornada de documento.
- **Homologação humana:** E4 residual se houver mudança de percurso; PDF/histórico conforme impacto.

### EST-04 — Banco, backup/restore, Docker, health e implantação

- **Problema comprovado:** `docker-compose` só Postgres local; health API `GET /saude` existe no histórico da esteira; **não há evidência de backup/restore validado**; publicação não autorizada.
- **Impacto/risco:** alto declarar “pronto para uso” sem restore; médio para operação local.
- **Arquivos:** `docker-compose.yml`, Prisma migrate, README, health endpoint, scripts de esteira.
- **Menor solução:** documentar e validar em ambiente local/controlado: migrate aditiva, backup, restore, healthcheck; checklist de bloqueio; **sem deploy**.
- **Aceite:** procedimento de backup/restore executado com evidência; health OK; critérios de bloqueio aplicados; sem db reset destrutivo em banco compartilhado.
- **Testes:** restore em volume descartável; health; migrate dry-run/status.
- **Dependências:** EST-01..03 preferíveis para não validar ops sobre defeito crítico aberto.
- **Homologação humana:** autorização explícita de publicação (fora desta demanda até critérios verdes).

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

## Próxima ação

Iniciar **EST-01** com `implementation-workflow` + `quality-gate`: reproduzir falha de salvar anexo com dados fictícios e corrigir a causa raiz comprovada.
