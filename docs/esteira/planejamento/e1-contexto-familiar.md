# E1 — Contexto familiar e isolamento

**Demanda:** DEM-E1-FAMILIAS-20261121  
**Tipo:** transversal · **Risco:** alto (autenticação, autorização, dados de saúde e criança)  
**Base inspecionada:** develop @ `9193f1660ec2fa06ebdd19d633cc83b86e3a828e`  
**Aprovação:** L3, direção pós-V1 aprovada expressamente pelo Produto em 2026-11-21. Requisitos: Módulo 01 v1.7 §13.  
**Estado do planejamento:** READY para retomada no checkout de desenvolvimento. Código, gates e homologação da E1 pendentes.

## Objetivo e recorte

Entregar a primeira operação verificável com duas famílias fictícias no mesmo banco e URLs próprias. Aplicar FUN-08/FAM-R12/FAM-R13 e E1-ACE-01..08. A regra funcional está na especificação, sem nova concessão de capacidades neste plano.

Fontes: Documento Mestre §13–15; EVOLUCAO-POS-V1.md v2.1; Módulo 01 §11–13; ADR-005/006/009/010/014; ARQUITETURA.md; GUIA-DE-EXPERIENCIA.md e PROPOSTA-EVOLUCAO-POS-V1.md §3.

## Triagem e evidência estática

| Fonte inspecionada | Estado observado | Consequência para E1 |
|---|---|---|
| schema.prisma | Familia sem slug; Usuario.pessoaId único; email globalmente único; Pessoa.familiaId | Acrescentar slug estável e reutilizar identidade atual |
| auth/servico-sessao.ts | entrar(email, senha) consulta e-mail global; sessão opaca com hash e validade de 12h | Acrescentar contexto familiar validado antes de criar sessão |
| auth/controlador-sessao.ts | POST /sessoes sem família; GET /me; cookie pef_sessao | Fechar contrato contextual e adaptar o cliente |
| auth/guarda-sessao.ts | Recupera usuário da sessão por token/cookie | Preservar verificação; comparar contexto solicitado com família do usuário |
| convites/controlador-convites.ts | Criar por familiaId e ativar por token, sem slug no contrato atual | Reconciliar ativação com família de origem e URL contextual |
| anexos/servico-anexos.ts | Conteúdo base64 no banco; obterPrivado busca ID antes de validar família | Escopar busca/autorização sem assumir S3 já integrado |
| contexto-sessao.tsx | Carrega /me e início pela família da conta | Validar contexto da URL antes de aplicar dados; limpar estado em troca/falha |
| apps/web/src/app | Rotas atuais /pessoas, /gerenciar-familia e /convites/ativar, sem /f/[slug] | Migrar links, retornos, ações, destinoEntrada e navegação para o espaço familiar |

Inspeção via GitHub, sem checkout local, execução da aplicação ou testes nesta rodada. Antes de editar código, o executor deve comparar o estado persistido com seu workspace, incluindo arquivos não rastreados e alterações locais. Preservar trabalho concorrente. Recalcular fingerprint real; esta rodada não inventa hash de workspace.

## Direção técnica mínima para implementar

- Manter PostgreSQL e monólito modular. Usar Usuario → Pessoa → Familia; não criar identidade global nem participação em várias famílias.
- Adicionar slug único, normalizado e validado no servidor; manter id interno estável. A UI de edição de slug fica fora.
- Preservar unicidade global de e-mail, mecanismo opaco de sessão e controles de cookie existentes, com revisão pertinente ao novo fluxo.
- Login deve receber contexto familiar explícito e validar sua resolução contra a conta. O contrato final pode estender POST /sessoes com slug obrigatório; não manter uma via de login global que contorne a entrada familiar.
- Nas APIs já escopadas por familiaId, comparar esse ID ao contexto da sessão. Nas operações por ID de recurso, carregar com filtro relacional de família e depois verificar a capacidade contextual.
- A API não precisa copiar o prefixo visual /f de todas as páginas. Slug/ID de família informado pelo cliente continua sendo entrada não confiável; todos os caminhos privados mantêm a mesma validação.
- Provisionar família e primeira administração por utilitário privado controlado, com operação consistente e sem credenciais permanentes no código, argumentos de processo ou logs. O titular define a senha em fluxo controlado; escolher a menor implementação segura na primeira fatia. O catálogo genérico de convites/autorizações não passa a conceder administrador.
- Preservar a sessão de uma família; em outra URL, rejeitar o contexto antes de carregar qualquer dado. O cookie comum não torna a conta válida na outra família. Uma nova autenticação substitui o contexto visível e limpa dados retidos.
- A ativação pode reutilizar token de convite existente, desde que o contexto de origem seja verificado e a resposta leve à URL correta. Não copiar a pessoa ao ativar a conta.
- Não montar dependência artificial de S3, RLS, Redis ou fila. Primeiro proteger as superfícies realmente implementadas. Jobs/caches/integrações ausentes devem constar como ausentes no inventário, com obrigação futura referenciada.
- Dados de desenvolvimento podem ser recriados segundo Documento Mestre §13. Qualquer reset no executor deve apontar explicitamente para o banco local de teste. Evidências devem ser reproduzíveis em ambiente novo.

## Incrementos verticais

### E1-01 — Provisionar e entrar na família

**Requisitos:** FUN-08, FAM-R12/R13, E1-ACE-01/02.  
**Entrega:** schema/seed ou utilitário de provisionamento, login contextual da API e página mínima /f/[slug]/entrar. Primeira administração pessoal criada por fluxo privado; autenticação em URL incorreta recusada.  
**Arquivos previstos:** apps/api/prisma/schema.prisma, seed.mjs e utilitário a definir; auth/servico-sessao.ts, controlador-sessao.ts; apps/web/src/app/f/[slug]/entrar/page.tsx; apps/web/src/lib/api.ts; scripts de teste pertinentes.  
**Aceite:** criar famílias A/B, colisão sem estado parcial, login válido/negado, slug inválido e senha inválida; segredo ausente das respostas e logs.  
**Gates:** QG-1, verifier e QG-2 com banco local novo.

### E1-02 — Navegação completa no contexto familiar

**Requisitos:** FUN-05/06/08, §11 entrada contextual, E1-ACE-03/04.  
**Entrega:** AppShell, menu, páginas de pessoa, gestão, histórico/resumo e links de retorno com família. Limpar estado ao trocar conta/URL; administrador sem contexto abre gestão.  
**Arquivos previstos:** apps/web/src/app, componentes/contexto-sessao.tsx e componentes de navegação existentes; apps/web/src/lib/api.ts; geração de destinoEntrada na API quando necessário.  
**Aceite:** recarregar, voltar/avançar, URL direta, uma/múltiplas áreas, administrador, integrante e acesso próprio. Sessão A em URL B não renderiza conteúdo anterior, nem transitoriamente.  
**Gates:** QG-1, verifier, QG-2 e inspeção de interface móvel/desktop.

### E1-03 — Relações e recursos privados ponta a ponta

**Requisitos:** FAM-R05/07/11/12/13, E1-ACE-05/06/07.  
**Entrega:** inventário e fechamento de consultas, mutações e vínculos por família nos módulos 01–04; convites contextuais, anexos, prévias e PDF.  
**Arquivos previstos:** auth/guarda-sessao.ts se necessário; autorizacoes, pessoas, convites, anexos, cuidados e desenvolvimento; módulos/projeções existentes e testes de isolamento.  
**Aceite:** matriz A→A permitido conforme papel, A→B negado e mesmo-família sem capacidade negado. Testar leitura/escrita, agregações, relações cruzadas, token de convite usado/expirado, revogação e tentativas sem contexto.  
**Gates:** QG-1, verifier e QG-2; testes negativos devem provar ausência de efeitos persistidos.

### E1-04 — Fechamento integrado e homologação

**Requisitos:** E1-ACE-01..08 e regressões dos módulos 01–04.  
**Entrega:** smokes atualizados para rotas/contexto, build/typecheck, inventário de superfícies, evidências e roteiro humano.  
**Aceite:** suíte nova e regressões pertinentes executadas em base fictícia; resumo/PDF mantêm autorização e conteúdo; titular encontra família/pessoa/área sem passos extras desnecessários.  
**Gates:** QG-3 do conjunto, verifier e PENDING_HUMAN até aceite expresso. Publicação para uso depende de decisão própria.

## Matriz mínima de validação

| Tentativa | Resultado esperado |
|---|---|
| Conta A + URL A + pessoa autorizada A | Fluxo permitido |
| Conta A + URL B | Recusa, sem dados de qualquer contexto |
| Sessão A + familiaId B na API | Recusa |
| Sessão A + ID de pessoa/documento/participação B | Recusa sem existência/conteúdo revelados |
| Sessão A + pessoa A sem operação concedida | Recusa; família igual não basta |
| Administrador sem responsabilidade clínica | Gestão permitida; conteúdo clínico negado |
| Integrante em Cuidados | Apenas rotina e registro já autorizados |
| Conta própria | Mesmas capacidades da especificação §11 |
| Convite A em contexto B | Recusa sem ativação parcial |
| Token usado/expirado ou sessão revogada | Recusa, histórico preservado |
| Retry/duplo toque | Não duplica família, ativação, relato ou transação |
| Prévia/PDF/agregação | Mesma seleção autorizada, sem registros B |

## Dependências, bloqueios e retomada

- Aprovação funcional da direção e recorte E1 documentada nesta rodada.
- Nenhum bloqueio funcional identificado para iniciar E1-01. Escolhas de payload, implementação do bootstrap privado e normalização de slug são decisões técnicas locais dentro dos critérios aprovados; registrá-las antes de codificar, sem reabrir regras já decididas.
- Revisão de autenticação para futura disponibilização continua pendência própria; E1 testa o comportamento pré-uso com contas fictícias.
- Pontuação digital, conteúdo clínico e envio de dados à IA não bloqueiam E1 porque estão fora do seu escopo.
- Próxima ação: implementation-workflow de E1-01 após reconciliar checkout/branch/fingerprint. Não herdar PASS ou homologação da V1 para esta demanda.
