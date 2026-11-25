---
name: passagem
description: Compacta a sessão em documento local de retomada e atualiza a próxima ação.
argument-hint: "foco da próxima sessão (opcional)"
disable-model-invocation: true
---

# Passagem

1. Conferir a realidade: `git status`, demanda ativa e `node scripts/esteira/qg.mjs --verificar-fingerprint --demanda <id>`.
2. Gravar o arquivo local no caminho de passagens de `docs/agents/projeto.md`, com:

   ```json
   {
     "data": "",
     "demanda": { "id": "", "estado": "", "fingerprint": "" },
     "revisao": { "branch": "", "commit": "" },
     "foco": "",
     "feito": [],
     "pendente": [],
     "decisoes": [],
     "decisoesAbertas": [],
     "tentativasPorCausa": [],
     "referencias": [],
     "skillsSugeridas": [],
     "proximaAcao": ""
   }
   ```

   Referenciar por caminho o que já está em spec, ticket, ADR ou evidência. Ocultar segredos e dados pessoais.
3. Atualizar `proximaAcao` da demanda no estado, só esse campo.
4. Confirmar com `git check-ignore` que o arquivo fica fora do Git.

Concluída quando uma sessão nova consegue continuar lendo só esse arquivo e suas referências.
