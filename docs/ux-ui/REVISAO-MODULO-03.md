# Revisão de UX — Módulo 03: Desenvolvimento da Laurinha

**Referência:** `develop` em `47eb820cbe870fb2694c8d1616189d0392b283bc`; direção de UX aprovada pelo responsável do produto em 2026-11-18.  
**Status:** **APROVADA COMO DIREÇÃO DE DESIGN**, não implementada/homologada por esta revisão.  
**Fonte funcional:** `docs/modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md` v1.1; **padrão de UX:** `docs/ux-ui/GUIA-DE-EXPERIENCIA.md` § Desenvolvimento.  
**Proposta substituída:** protótipo que alternava modos Integrante/Responsável para Desenvolvimento; a duplicidade não agregava valor ao uso cotidiano.

## Decisão validada

**Desenvolvimento é uma experiência única para quem possui autorização contextual**, sem seletor nem telas paralelas por perfil. A interface principal é centrada nas brincadeiras da Laurinha, participação presencial e reconhecimento da experiência. O Responsável legitimamente autorizado a organizar encontra **ações adicionais** de criação e gerenciamento em segundo plano; não precisa trocar de modo. Outros adultos autorizados acessam apenas o que podem fazer. **A experiência visual não concede acesso novo**, em especial ao Administrador ou à colaboradora externa da Vovó.

### Fluxo principal aprovado como direção

1. **Explorar / Guardadas:** lista de brincadeiras autoexplicativas e seleção direta; marcador simples de guardada, sem atraso ou obrigação.
2. **Abrir brincadeira:** nome e instrução curta, dificuldade/categoria se ajudarem, materiais opcionais; não exigir criação de planejamento.
3. **Registrar participação:** **Concluiu** ou **Participou** com iconografia distinta de confirmação de medicamentos, observação opcional e estados acessíveis; sem opção de não realizada.
4. **Reconhecimento:** estrelas calculadas e persistidas exclusivamente conforme DEV-F05; feedback apenas depois da resposta efetiva, sem duplicar pontos após retry.
5. **Organização contextual:** criar brincadeira (nome mínimo, dificuldade simples por padrão) e gerenciar recompensas somente quando a operação estiver autorizada, afastadas da lista principal.
6. **Histórico/Evolução:** consultar via Módulo 04, sem outro cadastro.

## Evidência e limites da implementação atual

Inspeção estática de `apps/web/src/app/pessoas/[pessoaId]/desenvolvimento/page.tsx`: já há `Explorar`/`Guardadas`, cartões, drawer de detalhes, escolhas `Concluiu`/`Participou`, saldo, resgate e criação. O código atual também reúne estrelas, atalho de histórico e dois formulários em accordions no conteúdo da página: reorganizar com o mínimo de mudança, **não reimplementar**. Auditar permissões efetivas para criação, participação e recompensas; a existência de botões não demonstra autorização. Sem testes executados ou homologação humana nesta revisão.

## Critérios UX para a implementação posterior

- [ ] Mesma experiência de explorar, abrir e registrar para qualquer adulto legitimamente autorizado.
- [ ] Não há seletor Integrante/Responsável nem telas duplicadas do módulo 03.
- [ ] Criação e gestão são ações secundárias, aparecendo somente para quem tem autorização de operação; acesso direto pelo backend protegido.
- [ ] Cartões são legíveis em mobile, com ícones úteis e sem explicações repetidas.
- [ ] `Concluiu` e `Participou` são claros, lúdicos e distintos de relato de medicamento.
- [ ] Observação permanece opcional; ausência não gera atraso, culpa ou redução de estrelas.
- [ ] Pontuação é automática e servidor-confirmada, idempotente na mesma execução; resgates não duplicam nem geram saldo negativo.
- [ ] Histórico é reutilizado; não há nova base ou entrada de dados duplicada.
- [ ] Privacidade infantil protegida por autorização contextual, inclusive em URL e API.

## Próxima decisão de UX

**VALIDADO em 2026-11-18 pelo responsável do produto.** Resultado alegre porém discreto, pontos somente após persistência, saldo compacto e recompensas opcionais em área secundária, com gerenciamento separado e sempre sujeito à autorização. Próximo encaminhamento recomendado: reconciliação com a implementação do Módulo 03 e execução incremental das diferenças via esteira existente, mantendo homologação humana posterior obrigatória.

## Aprovação integrada — reconhecimento, estrelas e recompensas (2026-11-18)

**Status: DIREÇÃO UX APROVADA E DOCUMENTADA**, complementando a experiência única já aprovada. **Não é homologação da interface implementada.**

1. **Reconhecimento de uma brincadeira:** a pessoa adulta registra `Concluiu` ou `Participou` conforme DEV-F04; somente quando o servidor confirma a operação e o movimento de estrelas, mostrar retorno afetivo e breve com nome da brincadeira, resultado e estrelas **de fato concedidas**. O feedback não substitui a informação acessível por texto e não presume que `Participou` seja fracasso. Em caso de erro ou dúvida de gravação, não afirmar conquista; retry não pode creditar duplicado.
2. **Saldo compacto:** mostrar as estrelas disponíveis de forma simples junto à área de atividades, evitando cartões/explicações excessivos, rankings, metas compulsórias ou incentivo a completar tarefas por cobrança. Quantidade exibida deriva de leitura autorizada e atualizada.
3. **Recompensas opcionais:** acessar a lista de recompensas em contexto secundário; visualizar nome e custo de forma compreensível e distinguir **resgatar** de **gerenciar**. Nenhuma recompensa é condição para participar ou ganhar estrelas. Um resgate só é declarado concluído após resposta persistida, validação de saldo e confirmação proporcional, protegendo custo histórico e evitando duplicação.
4. **Organização autorizada:** cadastrar brincadeiras e recompensas somente se a operação for permitida; não repetir formulários na área principal nem criar alternância Integrante/Responsável. O módulo tem **uma experiência** com ações conforme autorização. O Administrador não herda automaticamente acesso aos dados da criança, nem a colaboradora externa da Vovó.
5. **Conferência na implementação:** preservar tabelas de DEV-F05, idempotência, observação opcional, acessibilidade, linguagem lúdica e simples, e histórico via Módulo 04. Para ações sem suporte de autorização granular visível no contrato, solicitar análise arquitetural, sem inventar permissões.

**Critérios complementares de aceite UX:**

- [ ] Um registro confirmado produz um único feedback de estrelas com pontuação retornada pelo servidor; um erro não produz conquista fictícia.
- [ ] Resultado `Concluiu` e `Participou` têm identidade acessível e não confundem criança com avaliação/punição.
- [ ] Saldo é pequeno, legível e atualizado após participar ou resgatar; nenhuma explicação redundante na tela principal.
- [ ] Recompensas são opcionais, secundárias, com escolha/resgate distintos de cadastro/gestão; a autorização é validada no servidor.
- [ ] Não há alternância de perfil, obrigatoriedade de resgate, cronômetro, ranking ou metas de produtividade.
- [ ] A implementação é verificada em mobile, com rede lenta, duplo clique/reenvio e acessibilidade; **aceite humano posterior não pode ser inferido dos testes técnicos**.

**Próxima etapa:** preparar correções incrementais do Módulo 03 a partir do código real, pela triagem `task-routing` e `implementation-workflow`, sem autorizar commit/push/deploy pela esteira. Outras pendências administrativas do Módulo 01 permanecem adiadas, conforme o aceite parcial anterior.
