---
name: modelagem-dominio
description: Modelagem de domínio — afia termos e decisões do projeto. Use ao discutir terminologia, ao editar o glossário ou ao propor uma ADR.
---

# Modelagem de domínio

Disciplina de **mudar** o modelo. Só ler o glossário para usar o termo certo dispensa esta skill. Locais e regras de escrita: `docs/agents/dominio.md`.

## Durante a conversa

- **Confrontar com o glossário:** "o glossário define *X* assim; você parece querer dizer *Y*. Qual vale?"
- **Afiar termo vago:** propor um termo canônico quando uma palavra cobre dois conceitos.
- **Testar com cenários:** inventar casos de borda que obriguem a precisar o limite entre conceitos. Dados sempre fictícios.
- **Cruzar com o código:** se o código contradiz o que foi dito, mostrar os dois lados e perguntar.
- **Registrar na hora:** termo resolvido entra no glossário como `PROPOSTA`, com fonte.

Formatos: [formatos.md](formatos.md), ao escrever termo ou ADR.

## ADR

Propor só quando as três condições valem: **difícil de reverter**, **surpreendente sem contexto** e **fruto de alternativa real**.

Concluída quando cada termo discutido está definido ou listado como pergunta, e cada decisão que cumpre as três condições tem ADR proposta ou recusa do humano.
