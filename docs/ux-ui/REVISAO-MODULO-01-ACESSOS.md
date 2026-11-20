# Revisão prioritária — Módulo 01: acessos e permissões

**Data da priorização:** 2026-11-19  
**Referência de inspeção:** `develop` em `fe4c8cbc3f529f3a9cdbba1bf73bc84c386c7e24`  
**Estado:** revisão preliminar, **NÃO HOMOLOGADA** quanto aos achados novos; requer cenários humanos concretos e auditoria de autorização.  
**Fontes canônicas:** `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md` v1.3, `docs/produto/GOVERNANCA.md`, `docs/ux-ui/GUIA-DE-EXPERIENCIA.md`.  
**Prioridade:** Módulo 01 antes da revisão UX do Módulo 04, por solicitação expressa do Produto.

## Escopo e limite

Revisar se a família consegue entender **quem tem acesso a quê**, conceder/revogar responsabilidades legitimamente permitidas e confiar que a interface e o backend negam acessos não autorizados. Preservar três perfis simples de apresentação (Administrador, Responsável e Integrante), sem matriz de operações configurável, sem concessão implícita de dados infantis/clínicos ao administrador. **Não confundir autorização técnica com vínculo familiar nem com papel exibido.**

**Separação obrigatória:**
1. **Lacuna de UX/gestão:** ação necessária ausente, fluxo confuso, contexto incompleto, rótulo enganoso.
2. **Falha funcional:** concessão/revogação autorizada não é aplicada corretamente.
3. **Falha de segurança:** API, sessão, URL direta ou resposta expõe/permite dados além do escopo; exigir reprodução isolada e correção prioritária. Ocultação de botão sozinha não corrige falha de autorização.

## Observações documentais verificadas

- `apps/web/src/componentes/painel-gerenciar-familia.tsx`: concessão direta limitada a `responsavel_desenvolvimento` para `usuario.id`, além de convite fixo `colaboradora_cuidados`; lista de acessos com ação Retirar. A interface ainda não permite administrar de forma clara diferentes participantes/responsabilidades existentes. **Achado comprovado de limitação de fluxo**, não prova de violação de segurança.
- `apps/api/src/autorizacoes/servico-autorizacoes.ts`: `conceder` exige administrador, valida alvo da mesma família, pessoa-alvo e responsabilidade técnica; há operações de revogar e listar. Examinar todos os chamadores e caminhos alternativos antes de concluir que as verificações estão completas.
- `apps/api/src/autorizacoes/responsabilidades.ts`: responsabilidades internas `administrador`, `responsavel_cuidados`, `responsavel_desenvolvimento`, `colaboradora_cuidados`, `participante_limitado`. São **valores técnicos**, não uma matriz de edição para usuários. A interface aprovada usa `Integrante` como terceiro rótulo.
- A remoção de pessoa acompanhada e o seletor de vínculos permanecem pendências funcionais distintas, **não implementar** como efeito colateral desta auditoria.

## Matriz mínima de validação (a executar)

| Ator/cenário | Experiência esperada | Verificação necessária |
|---|---|---|
| Administrador sem autorização de conteúdo | Pode administrar pessoas, participantes, convites e metadados de acesso; não vê prontuário, doses, anexos ou dados infantis por presunção | Menu, página, API, URL direta e relatórios |
| Responsável autorizado a cuidados | Acompanha Vovó e gere operações de cuidados permitidas; não herda Desenvolvimento | Leitura, escrita, lista contextual e isolamento |
| Responsável autorizado a desenvolvimento | Acompanha Laurinha no escopo permitido; não herda cuidados da Vovó | Leitura, criação, participação, recompensas |
| Integrante externo autorizado só a cuidados | Registra apenas o autorizado; não gere pessoas, programações ou Laura | API, URL direta, anexos, exportação e menus |
| Autorização acumulada | Mesma conta apresenta apenas a união dos escopos autorizados, sem permissões extras | Sessão, menus e endpoints |
| Revogação durante sessão | Bloqueia novas operações e não remove histórico/autoria | Token/cookie, endpoints, revalidação, cache |
| Conta sem autorização ou de outra família | Nenhuma listagem, prévia, contagem ou mutação de dados protegidos | Identificadores trocados e endpoints diretos |
| Convite pendente/expirado | Não aparece como acesso ativo, não concede escopo antes de ativar | Fluxo de ativação e listagem |

## Questões a reconciliar com Produto e Arquitetura

- A administração deve permitir selecionar **participante → pessoa acompanhada → responsabilidade** entre as capacidades já aprovadas, com confirmação simples? Quais responsabilidades podem ser atribuídas por convite versus concessão direta, sem oferecer `administrador` irrestritamente?
- Como mostrar o escopo sem expor detalhes técnicos ou dados sensíveis? Ex.: “Vovó · Cuidados · Responsável · Ativo”.
- Há falhas reproduzíveis de autorização (acesso a URL/API não permitido, revogação ineficaz, dado infantil/clínico exposto), ou a queixa refere-se só à concessão limitada? Priorizar reprodução antes de redesenhar.
- Exclusão/desativação de pessoa e vínculos pertencem a demandas de Produto próprias; só entram após decisão funcional explícita e proteção do histórico.

**Próximos passos recomendados:** coletar relatos objetivos das falhas percebidas; realizar inspeção dirigida de UI e backend com testes negativos; classificar severidade/impacto; submeter somente mudanças funcionais e de segurança pertinentes à governança; preparar uma correção única e limitada para a esteira existente; executar testes e homologação humana. Sem alterar código nesta etapa.

## Aprofundamento com Produto — organização e seleção de área (2026-11-19)

**Necessidade explicitada pelo responsável do produto:** falta de organização na gestão familiar e **possibilidade de selecionar a área de acompanhamento**, mantendo a análise das quatro frentes (segurança, organização, concessão/revogação e pessoas/vínculos). **Status: direção UX proposta para validação funcional; nenhuma implementação autorizada por este registro.** Referência estática: `develop` em `348afb3f09419448560319ef72ac9a81891b88df`.

### Organização recomendada

- Na aba administrativa **Acessos**, priorizar consulta **por pessoa acompanhada**, mostrando agrupamentos com **participante (conta)**, **área** (`Cuidados` ou `Desenvolvimento`), **responsabilidade de apresentação** (`Responsável` ou `Integrante`) e estado ativo; preservar as informações de administrador da família em contexto administrativo próprio, sem tratá-lo como acesso automático a dados sensíveis.
- **Conceder acesso:** fluxo curto `selecionar participante existente → pessoa acompanhada → área → responsabilidade compatível → revisão/confirmação`. Para quem ainda não tem conta, direcionar ao convite correspondente, sem criar usuário artificial nem confundir convite pendente com autorização ativa.
- **Revogar acesso:** ação contextual sobre o vínculo correto, mostrando quem, qual pessoa e área serão afetados, com confirmação proporcional e atualização de lista após resposta persistida.
- Não oferecer matriz granular de operações, permissões personalizadas ou rótulos técnicos crus. Área escolhida não significa acesso automático a todos os documentos, prescrições ou à outra área.

### Correspondência técnica observada (não equivale a contrato aprovado para nova UI)

- `painel-gerenciar-familia.tsx` concede diretamente somente `responsavel_desenvolvimento` para `usuario.id` e convida com `colaboradora_cuidados`; não oferece seleção de participante nem área. Confirma lacuna UX/funcional da interface de gestão.
- `servico-autorizacoes.ts` exige administrador, verifica usuário e pessoa-alvo na família e aceita responsabilidades previstas; `responsabilidades.ts` contém `administrador`, `responsavel_cuidados`, `responsavel_desenvolvimento`, `colaboradora_cuidados`, `participante_limitado`. **Não expor `administrador` como opção genérica** por simples reutilização do enum; avaliar quem pode conceder/revogar privilégios administrativos e como proteger último administrador.
- `listarAcessos` devolve papel de apresentação, participante, pessoa acompanhada e ativo, **mas não expõe a área de forma explícita**. Mapear área a partir do papel `Responsável` é incorreto: pode significar cuidados ou desenvolvimento. Arquitetura deve determinar menor ajuste seguro ao contrato de metadados; não vazar dados clínicos/infantis.
- Convite atual com `responsabilidade` fixa `colaboradora_cuidados` difere do comportamento funcional FUN-03 (selecionar responsabilidade e pessoa-alvo), a reconciliar.

### Quatro frentes e status

| Frente | Prioridade | Resultado atual |
|---|---|---|
| 1 — Segurança | Bloqueadora se houver falha reproduzível | **NÃO VERIFICADA DINAMICAMENTE**. Testar API/URL direta, isolamento de família, sessão revogada, privilégios administrativos e dados sensíveis |
| 2 — Organização | Alta UX | **LACUNA CONFIRMADA**: lista sem agrupamento por área/pessoa e concessionário sem contexto |
| 3 — Conceder/revogar | Alta | **LACUNA DE CONCESSÃO CONFIRMADA** na UI; revogação existente, mas precisa de teste real e contexto claro |
| 4 — Pessoas/vínculos | Importante, separado | **PENDENTE FUNCIONAL**: exclusão/desativação de pessoa, vínculos válidos e proteção de histórico; não acrescentar botão destrutivo sem regra aprovada |

### Encaminhamento de governança

**CT-20261119-003 — proposta de UX → Produto/Arquitetura, `NEEDS_DECISION`.** Decidir o conjunto **fechado** de combinações concedíveis pela administração (área e responsabilidades existentes, incluindo perfil Integrante em Desenvolvimento se realmente suportado; sem inventar capacidade), tratamento de convites, visibilidade do escopo na listagem e restrições especiais ao papel `administrador`. A operação de remoção de pessoa deve ser decidida separadamente para evitar risco de exclusão de histórico infantil/médico. Arquitetura deve auditar segurança antes de modificar contratos.

**Critérios preliminares de aceite:** administrador identifica para cada pessoa quem possui acesso ativo, em qual área, com qual responsabilidade; seleciona apenas combinações aprovadas e confirma a concessão/revogação correta; usuários sem poder de administração não acessam formulários/APIs; admin sem autorização de conteúdo não recebe acesso clínico/infantil; convite pendente não consta como ativo; revogação retira acesso efetivamente, inclusive nas sessões; nenhuma exclusão de pessoa sem preservação de dados e decisão funcional.

**Próxima etapa recomendada:** Produto define combinações e política administrativa de concessão; Arquitetura reconcilia os contratos e testes negativos; UX fecha layout agrupado em dispositivo móvel e desktop; esteira implementa mudança mínima e pede homologação humana. Não alterar especificação FUN-04 por suposição.
