# Retomada

1. Ler a demanda ativa no estado e o ticket correspondente.
2. `git status` e arquivos não rastreados.
3. `node scripts/esteira/qg.mjs --verificar-fingerprint --demanda <id>`.
   - **Confere:** evidências continuam válidas; seguir na `proximaAcao` sem refazer o que está válido.
   - **Diverge:** evidências antigas são inválidas; revalidar a partir do QG-1.
   - **Confere em parte:** no meio do ciclo, conferir um perfil por vez com `--perfil`.
   - **Confere, mas com perfil em `FAIL` ou `BLOCKED`:** o comando também sai com erro; tratar a causa e repetir o perfil.
   - **Sem registro:** tratar como não verificado.
4. Fingerprint anterior ao formato `sha256:` é histórico simbólico e não prova o código atual.

Concluída quando cada critério está marcado como válido, inválido ou não verificado.
