# Roteiro — homologação humana COR-UX-EST-HOM-20261122

**Demanda:** correções UX após estabilização **APROVADA PARCIALMENTE**  
**Branch:** `develop` (working tree local com as correções; sem commit automático)  
**Dados:** apenas fictícios · **Dispositivos:** celular físico + desktop

## Antes de começar

1. API e web locais (`npm run dev:api` / `npm run dev:web`).
2. Conta com responsabilidade de Desenvolvimento na pessoa acompanhada.
3. Não usar dados reais sensíveis.

## Percurso

| # | Passo | Esperado | Critério |
|---|---|---|---|
| 1 | Abrir **Biblioteca → Atividades reais** | Catálogo principal carrega com esqueleto contextual (não tela em branco). Sugestões aparecem **depois** do catálogo. | COR-UX-LOAD, COR-UX-SUG-POS |
| 2 | Em Explorar, rolar até **Sugestões** e tocar **Renovar sugestões** | Feedback aparece **junto das sugestões**. Ou troca até 3 itens (escolhidas preservadas), ou mensagem neutra de esgotamento/sem slot. Não parece “botão morto”. | COR-UX-RENOVAR |
| 3 | Abrir **Jogos digitais** | Lista de jogos com esqueleto contextual enquanto carrega. | COR-UX-LOAD |
| 4 | Concluir uma fase **não final** | Após salvar, diálogo Mantine com celebração breve, **Ir para próxima fase** e **Voltar ao catálogo**. Dica continua 1 por partida; fases seguem livres. | COR-UX-FASE-DIALOG |
| 5 | Concluir a **última fase** de um jogo | Diálogo com parabéns de conclusão do jogo e **Voltar ao catálogo** (sem “próxima fase”). | COR-UX-FASE-DIALOG |
| 6 | Reabrir fase já concluída / outra fase | Progresso preservado; escolha livre mantida; sem nova permissão/IA/estrelas digitais. | regressão |
| 7 | Menu → **Recompensas** | Após sugestões no fluxo de Atividades, a navegação secundária a Recompensas permanece acessível e coerente. | COR-UX-SUG-POS |

## Resultado humano

- [ ] APROVADA
- [ ] APROVADA PARCIALMENTE (listar apontamentos)
- [ ] REPROVADA (listar apontamentos)

**Assinatura / data:** __________________
