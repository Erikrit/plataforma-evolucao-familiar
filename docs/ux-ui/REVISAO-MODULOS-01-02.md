# Revisão de UX — módulos implementados 01 e 02

**Referência auditada:** branch `develop` (2026-11-15).  
**Estado:** correções UX-01..UX-14 implementadas; QG-3 local PASS (capturas emuladas + smokes). Homologação com usuários/dispositivos reais e ACE-C12 ainda pendentes.  
**Tipo de evidência:** implementação local + typecheck/build + capturas emuladas; não confundir com homologação em aparelho físico do usuário.  
**Guia transversal:** `docs/ux-ui/GUIA-DE-EXPERIENCIA.md`.  
**Fonte de status corrente:** `docs/produto/STATUS-E-ESCOPO.md` e `docs/esteira/estado/atual.json`.  
**Evidência QG-3:** `docs/esteira/estado/evidencia-qg3-ux-01-02.json`.

## Regras de execução

Corrigir somente o que estiver dentro do comportamento funcional vigente. Reutilizar rotas/componentes e não ampliar escopo. Toda correção preserva dados, histórico, permissões, privacidade, respostas de API e exceções da especificação. Quando a UI atual estiver desalinhada da especificação, marcar dependência funcional existente e não inventar contrato.

## 01 — Fundação Familiar

| ID | Evidência no código | Problema/impacto | Recomendação UX | Prioridade | Natureza |
|---|---|---|---|---|---|
| UX-01 | `apps/web/src/app/page.tsx` e `componentes/painel-fundacao.tsx` | Título e texto introdutório parecem bootstrap; administração ocupa a home antes dos cartões | Home 'Nossa família' com cartões das pessoas permitidas em primeiro lugar, detalhes úteis só se disponíveis; administração sob 'Gerenciar família' | Alta | UI dentro da especificação |
| UX-02 | `painel-fundacao.tsx` | Cadastro, convites, ativação e autorizações todos na mesma tela geram rolagem e distração | Entrada administrativa secundária; formulários sob demanda; manter convite/ativação existentes | Alta | UI; verificar autorização existente |
| UX-03 | `painel-fundacao.tsx` mostra `id:`, `FF-04`, `FAM-R10`, `ACE-05`, `Token:` | Jargões e identificadores confundem o público familiar | Textos claros; identificadores técnicos fora da experiência regular; manter fluxo seguro de ativação | Alta | UI; não alterar contrato de convite |
| UX-04 | `apps/web/src/app/pessoas/[pessoaId]/page.tsx` | 'Perfil' genérico e formulário de vínculo antes das áreas | Nome e áreas autorizadas em destaque; editar vínculo opcional em segundo plano; opção indisponível com contexto útil, sem navegação quebrada | Média | UI |
| UX-05 | `apps/web/src/app/convites/ativar/page.tsx` | Token exposto como campo mesmo quando URL tem token; fluxo pouco contextual | Quando presente na URL, preencher sem exigir redigitação; explicar passo, erro/expiração e próximo passo após ativação | Média | UI; regras de token continuam as existentes |
| UX-06 | `apps/web/src/app/globals.css` | Paleta bege/verde antiga, variações e estrutura visual limitada | Migrar incrementalmente para tema Azul Contemporâneo/densidade confortável com componentes Mantine após validação | Alta | UI |

**Fluxos alvo:** entrar → pessoas autorizadas → perfil → área autorizada; administrador → Gerenciar família → adicionar pessoa/convite/autorização; convite → ativação → entrada. Nenhuma nova permissão derivada da organização visual.

## 02 — Cuidados da Vovó

| ID | Evidência no código | Problema/impacto | Recomendação UX | Prioridade | Natureza |
|---|---|---|---|---|---|
| UX-07 | `apps/web/src/app/pessoas/[pessoaId]/cuidados/page.tsx` | Rotina e três formulários de criação na mesma tela | Hierarquia aprovada: rotina de hoje → outros cuidados → gerenciar cuidados; formulários apenas sob demanda para autorizados | Alta | UI; verificar operações permitidas |
| UX-08 | mesma página, `proximoCuidado` em seção informativa | Próximo cuidado está destacado mas não é acionável como cartão | Tornar destaque um ponto de entrada para a mesma escolha de relato do cartão; não registrar ao tocar | Média | UI |
| UX-09 | mesma página, `role="dialog"` em painel inline | Diálogo marcado como modal sem gestão completa de foco/fechamento; risco de acessibilidade | Usar Drawer/Modal acessível, com foco inicial, contenção/retorno de foco, Escape e cancelamento, incluindo tela pequena | Alta | UI |
| UX-10 | mesma página, ações `confirmarRelato` sem bloqueio próprio durante envio | Possíveis reenvios rápidos e feedback distante do contexto | Estado 'Registrando…', bloquear repetição de toque e mostrar feedback local apenas após persistência; não ocultar erro | Alta | UI/robustez, sem mudar regra de idempotência |
| UX-11 | mesma página, `horarios.split(",")` | Entrada de horários por vírgula é trabalhosa e não atende integralmente o cadastro da especificação v1.3 | Desenhar campos nome, primeiro horário, doses/dia, duração, conferência dos horários prescritos e opções avançadas progressivas, **sem inventar cálculo** | Alta | UX amparada por especificação; depende de contrato existente/adequação funcional |
| UX-12 | mesma página, listas e títulos de consultas/apoio | Informações e cadastros misturados; consulta não mostra data na listagem | Separar leitura das ações de criar, tornar data/hora legíveis onde fornecidas, priorizar próximo compromisso relevante | Média | UI |
| UX-13 | `apps/web/src/app/pessoas/[pessoaId]/historico/page.tsx` | Lista simples, sem agrupamento temporal nem data exibida; traz código `ADR-009` | Lista cronológica legível com data/hora (campo `quando` existente), tipos em linguagem familiar, vazio orientativo e retorno ao contexto da pessoa | Média | UI |
| UX-14 | mensagens `erro`/`sucesso` e `carregando` distribuídas nas telas | Feedback e estados inconsistentes | Padronizar loading, erro, sucesso, disabled, recuperação e apresentação local; não mostrar sucesso sem gravação confirmada | Alta | UI/robustez |

**Fluxos alvo:** pessoa → rotina do dia → cartão de dose → escolha explícita → aguardar gravação → atualização; outro cuidado → consulta/apoio; responsável → gerenciar programação autorizada; histórico da pessoa → acontecimentos por data.

## Dependências e limites

- **Produto/funcional já aprovado:** cadastro de medicamento v1.3; lembretes e segurança. Não reabrir a decisão funcional; identificar lacuna de API/código separadamente na esteira. Não deduzir intervalos clínicos pela quantidade de doses.
- **Produto se surgir novidade:** novas permissões, destinatários de lembretes, edição/suspensão, lógica de frequência, políticas de registro e visibilidade de dados de crianças/saúde. Preparar prompt separado para conversa de Produto, **sem bloquear melhorias visuais independentes**.
- **Engenharia e segurança:** sessão/autorização e testes de regressão pertencem à implementação/qualidade. UI não deve contornar restrições mesmo se uma rota parecer acessível.
- **Exames, PDFs, lembretes e edição** podem estar parciais/ausentes na UI; não considerá-los implementados apenas por estarem descritos. Não adicionar atalhos inoperantes.
- **Validação real pendente:** capturas de telas de 320/375/390px e desktop, teclado, leitores de tela, estados de erro de rede, perfis responsável/Vovó/colaboradora. Sem dados reais de crianças ou saúde.

## Critérios de aceite por módulo

**01:** a home apresenta pessoas autorizadas antes de administração; administrar exige o acesso permitido; cadastro só com nome; convite é compreensível; perfil traz áreas existentes; sem identificadores técnicos em interface usual; layout funcional em desktop e celular.

**02:** rotina abre primeiro, sem formulários permanentes; próximo cuidado pode abrir opções; cartão não confirma sozinho; relato oferece as duas opções e cancelar; aguardar persistência antes de sucesso; erro de rede não altera aparência para 'tomou'; não repetir envio; consulta/apoio legíveis; histórico mostra quando e o que aconteceu; Vovó/colaboradora veem somente o permitido.

## Ordem recomendada

1. Fundamentos visuais e estados compartilhados.
2. Página inicial + perfil + administração/convites.
3. Rotina + diálogo de relato + feedback e prevenção de envio duplicado.
4. Consultas, apoio, histórico e formulários de gerenciamento.
5. Cadastro de medicamentos v1.3 somente com as dependências funcionais claramente identificadas.
6. Verificação UX integrada em celular/desktop, por autorização, rede e acessibilidade.

Não considerar terminado sem capturas reais e verificação dos critérios; execução técnica, alteração de código e gestão da esteira são externas à conversa de UX.
