---
name: retro
description: Retrospectiva da sessão — propõe melhorias à própria esteira, com diffs.
argument-hint: "sessão a revisar (padrão: a atual)"
disable-model-invocation: true
---

# Retro

Melhora o **ambiente** do agente: skills, hooks, configuração, ponteiros e checagens.

1. Chamar `escrita-para-agentes`.
2. Ler as fontes primárias da sessão: conversa, evidências, diff. Conferir as checagens que já existem, para achar a desligada antes de propor outra.
3. Buscar candidatos:
   - **Navegação:** informação demorada de achar → ponteiro.
   - **Checagem automática:** erro mecânico → lint, teste, hook ou validador.
   - **Padrão de código:** erro de julgamento → regra para o revisor.
   - **Instrução sem efeito ou duplicada** → remover.
   - **Ferramenta cara** → comando mais enxuto.
   - **Informação ausente** → acesso local e seguro.
4. Apresentar por gravidade: fato observado, causa, proposta e **diff sugerido**.
5. Aplicar só os itens aprovados, atualizar espelhos, rodar o validador e os testes da esteira, e escrever entrada curta no registro.

Erro mecânico ganha checagem determinística; regra escrita fica para julgamento.

Concluída quando cada proposta tem fato e diff, e cada item aprovado passou no validador.
