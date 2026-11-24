# Plano corretivo de UX — homologação humana reprovada em 2026-11-18

> **REGISTRO HISTÓRICO — NÃO É DEMANDA ATIVA.** Este arquivo registra uma rodada de análise, correção ou homologação anterior à V1 consolidada. Termos como “pendente”, “reprovada” ou “não implementada” descrevem **aquela rodada**, não o estado atual. A V1 está homologada funcionalmente e em testes restritos; consultar `docs/produto/STATUS-E-ESCOPO.md`, a especificação vigente do módulo e o código antes de reabrir trabalho. Não executar este plano por padrão.

**Estado:** demanda de correção aprovada pelo responsável pelo produto; **executar pela esteira existente, sem commit/push/merge/deploy automáticos**.  
**Base de análise:** `develop` no commit `bed022447e3535b1cc24aac1c16f4ccff01ba90e`; antes de executar, reconciliar com a branch, o workspace e `docs/esteira/estado/atual.json`.  
**Identificador sugerido:** `DEM-UX-HOM-20261118`.  
**Fonte dos achados:** `docs/ux-ui/REVISAO-MODULOS-01-02.md` (UX-HOM-01..07). **Estado oficial da homologação:** `docs/produto/STATUS-E-ESCOPO.md` — **REPROVADA** até novo aceite humano.  
**Fontes normativas:** `docs/produto/GOVERNANCA.md`, `docs/produto/DOCUMENTO-MESTRE.md`, `docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md`, `docs/modulos/02-cuidados-vovo/ESPECIFICACAO.md`, `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md`, `docs/ux-ui/GUIA-DE-EXPERIENCIA.md`.

## 1. Objetivo e limites

Corrigir **os sete motivos objetivos de reprovação humana** sem redesenhar o produto, criar perfis técnicos, alterar permissões por inferência ou ampliar o MVP. **Ocultação visual não substitui verificação de autorização no backend.** Preservar navegação compartilhada AppShell/Drawer, responsabilidades Administrador/Responsável/Integrante, contexto por pessoa, estados de relatos, histórico e anexos privados.

Manter a implementação atual no que já atende aos requisitos. Não criar nova biblioteca de UI, novo design system, endpoint ou migração apenas para resolver a aparência. O cliente deve continuar usando Mantine e recursos de ícones já adotados, com texto e foco/teclado acessíveis.

## 2. Escopo e critérios verificáveis

| ID | Prioridade | Correção delimitada | Critério de aceite |
|---|---|---|---|
| **UX-HOM-01** | **P0** | Ocultar **áreas não autorizadas** no menu, perfil, home, atalhos, cartões, resumos e previews (Cuidados, Desenvolvimento, Histórico/Resumo). Auditar `apps/web/src/app/pessoas/[pessoaId]/page.tsx` e `componentes/navegacao-app.tsx`; verificar flags reais e fallback sem inventar autorização. | Sem autorização, item **não é renderizado**, não fica esmaecido nem com “Sem acesso”; acesso por URL/API direta é negado pelo servidor; outras pessoas e metadados sensíveis não vazam. Mostrar estado vazio neutro só quando realmente necessário. |
| **UX-HOM-02** | **P0** | Remover `Editar vínculo e dados` da página cotidiana de pessoa. Gestão, se existente, deve ficar em `Gerenciar família` e só para quem tem permissão efetiva. Não aceitar edição livre de vínculo no fluxo habitual. | Perfil sem formulário ou campo digitável de vínculo; alterações por UI ou API exigem autorização. **Não implementar novo seletor com opções inventadas:** só fazê-lo quando houver lista funcional aprovada; se faltar, marcar `NEEDS_DECISION` apenas para o seletor, sem bloquear as demais correções. Preservar leitura dos vínculos existentes. |
| **UX-HOM-03** | **P1** | Corrigir cartões de **medicamentos e atividades de Desenvolvimento**, incluindo estado pós-registro. Usar ícones semânticos distintos, rótulos curtos e estados explícitos. Evitar marcador textual “Med”/“Cons” como substituto de iconografia e não confundir ação com resultado. | Para dose: **tomou conforme relato / informou que não tomou / sem confirmação** visualmente discerníveis sem depender de cor. Para desenvolvimento: **Concluiu / Participou** discerníveis sem usar o mesmo sinal de medicação; não penalizar “não realizada”. Apenas mudança de estado confirmada pelo servidor. Capturas antes/depois e verificação com teclado/leitor de tela. |
| **UX-HOM-04** | **P1** | Feedback de sucesso hoje fica fixo via `componentes/feedback.tsx` e estado local. Tornar confirmação **transitória, breve, acessível, dispensável**, evitando sobreposição do conteúdo. | Sucesso desaparece sem interação, mas **erros críticos permanecem visíveis/recuperáveis até resolução ou dispensa**; feedback não confunde falha com sucesso; validação de foco/aria-live; sem banners permanentes por operação bem-sucedida. |
| **UX-HOM-05** | **P1** | Remover **microcopy redundante** em `app/page.tsx`, `componentes/painel-fundacao.tsx`, rotinas e telas de Desenvolvimento. | Sem “Pessoas que você pode acompanhar...”, “Poucos acontecimentos...”, introduções duplicadas ou instruções sobre a própria navegação. Manter rótulo e informação que ajudam a agir, avisos clínicos e privacidade realmente necessários. Saudações no máximo uma por contexto útil. |
| **UX-HOM-06** | **P1** | Exibir **Integrante** como terceiro perfil funcional em todos os rótulos da UI; mapear saída legada “Colaborador” quando representar **papel**, sem modificar identificador/enum técnico por estética. | “Colaborador” não é rótulo do perfil exibido; **colaborador(a) externo(a)** permanece possível **vínculo**, sem equiparar vínculo a papel nem conceder acesso a parentes ou dados infantis. Testes de mapeamento e de permissões. |
| **UX-HOM-07** | **P1** | Simplificar `pessoas/[pessoaId]/page.tsx` eliminando “Ainda sem conta...”, “Áreas disponíveis” e cards duplicados com menu contextual, quando não têm valor operacional. | Página identifica a pessoa e apresenta apenas dados/ações relevantes não duplicados; navegação para áreas autorizadas já existe no menu lateral/Drawer. Não criar rota intermediária obrigatória. Estado de conta só aparece em gestão de acessos quando útil. |

**Não conformidades fora do pedido:** não reabrir módulos, experiências ou regras já aprovados. Se detectar risco de segurança ou lacuna funcional relevante, registrar achado e bloquear **apenas o slice dependente** com encaminhamento conforme `GOVERNANCA.md`.

## 3. Plano de execução pequeno e seguro

**Triagem:** `task-routing` (classificar como correção transversal de UX com risco alto por envolver autorização e dados de criança/saúde). Reconciliar branch e alterações locais. Reutilizar `implementation-workflow` para slices delimitados; `module-planning` apenas se a triagem provar dependência estrutural que torne a decomposição indispensável.

1. **Slice A — P0: autorização e perfil.** `UX-HOM-01` + remoção do campo indevido em `UX-HOM-02`. Validar navegação e respostas da API por Integrante, Responsável, Administrador e sessão revogada; evitar revelar destinos antes de carregar autorizações. **Seletor de vínculos depende de decisão funcional sobre opções**, não inventar.
2. **Slice B — estados e feedback.** `UX-HOM-03` + `UX-HOM-04`. Corrigir semântica dos cards de dose e desenvolvimento, ícones/rotulagem/estado após sucesso e mensagens transitórias sem esconder erros.
3. **Slice C — redução de ruído.** `UX-HOM-05` + `UX-HOM-06` + `UX-HOM-07`. Revisar textos, página pessoal e rótulos em conjunto; manter UX consistente com menu lateral, sem introduzir outro.
4. **Validação integrada.** `quality-gate` QG-1 por slice → `verifier` → QG-2; QG-3 no conjunto, incluindo `smoke:authz` onde for aplicável. Execução no navegador/mobile e desktop em larguras 320, 375, 390 e 1280 px, teclado/foco, rede lenta/erro, status pós-confirmação, segurança de URL direta e regressões nos quatro módulos. Gerar evidência real, sem screenshots de dados pessoais reais.
5. **Nova homologação humana.** Preparar checklist e capturas de fluxos reais, porém marcar `PENDING_HUMAN` e manter **REPROVADA/NÃO HOMOLOGADA** no status até o responsável pelo produto validar explicitamente.

## 4. Riscos e salvaguardas

- **Permissão:** autorização é contextual por família, pessoa, domínio e operação; não usar rótulo de papel, `filtradoPorAutorizacao` ou menu oculto como critério único.
- **Vínculo:** escolher opções do seletor é decisão de Produto ainda não resolvida; não misturar `Integrante` (experiência) com `colaborador externo` (vínculo). Não mudar PATCH/DTO por presunção.
- **Notificações:** distinguir mensagens de resultado de notificações de lembrete. A correção de feedback não pode suprimir erro de dose não salva nem desconfigurar agendamento de lembretes.
- **Registro:** doses e participações só mostram conclusão após persistência; sem confirmação não significa não tomada. Estrelas mantêm regras aprovadas.
- **Regressões:** manter história e módulos existentes, especialmente revogação, anexos, consultas, medicamentos e desenvolvimento.

## 5. Saída obrigatória da esteira

- IDs `UX-HOM-01..07` vinculados aos arquivos modificados, testes, screenshots e resultado `PASS/FAIL/BLOCKED`.
- Resultado por slice, verificação independente, fingerprints verificáveis e estado persistido sem apagar demandas anteriores.
- Lista objetiva de pendências funcionais/arquiteturais, caso apareçam.
- **Mensagem de commit sugerida**, mas **não executar commit, push, merge, PR ou deploy**.
- **Homologação humana permanece pendente** até novo aceite expresso.

**Definição de pronto técnico:** critérios implementados e testados com evidência; não significa **homologação humana aprovada**.

## Encerramento da primeira rodada corretiva — aceite humano em 2026-11-18

**Status desta rodada: HOMOLOGADA PELO RESPONSÁVEL DO PRODUTO (escopo `UX-HOM-01..07`).** A implementação já constava como `COMPLETED` técnico na esteira; o aceite humano foi declarado depois. Não confundir a aprovação desta rodada com homologação integral dos módulos, segurança ou produção. **Fora do escopo e adiados:** remoção/desativação de pessoas e reorganização da gestão de acessos/responsabilidades. **Pendente funcional:** opções de vínculo/edição administrativa (`UX-HOM-02-SELETOR`). Próxima etapa UX do produto: Módulo 03 — Desenvolvimento da Laurinha.
