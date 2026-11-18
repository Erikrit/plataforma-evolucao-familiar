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

**Validar apresentação de resultado da participação, saldo de estrelas e recompensas** num único conjunto, antes de encaminhar implementação. Não alterar regra de pontuação, escopo, autorização ou dados sem governança adequada.
