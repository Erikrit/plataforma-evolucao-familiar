---
name: revisao-codigo
description: Revisão em dois eixos, Padrões e Especificação, das mudanças desde um ponto fixo. Use ao revisar branch, diff ou trabalho em andamento, e antes de concluir uma implementação.
---

# Revisão de código

Dois eixos independentes, para que um não esconda o outro: código impecável pode implementar a coisa errada, e a coisa certa pode violar os padrões.

## Passos

1. **Fixar o ponto.** Usar o indicado ou `referenciaBase` de `esteira.config.json`. Confirmar com `git rev-parse` e calcular `git merge-base <ponto> HEAD`. O diff é `git diff <merge-base>` **mais** os não rastreados (`git ls-files --others --exclude-standard`), pois o trabalho pode não ter commit. Concluído quando o diff é não vazio.
2. **Achar a especificação:** argumento do humano, ticket, critérios da demanda. Ausente: perguntar; se não existir, pular esse eixo e declarar. Extrair os requisitos em escopo como **trechos citados**: ID, `arquivo:linha` e texto, localizados com `grep -n`.
3. **Achar os padrões:** a linha "Padrões de engenharia" de `docs/agents/projeto.md`, ADRs da área e [smells.md](smells.md). Citar as regras pertinentes ao diff por `arquivo:linha`. Padrão documentado vence a linha de base; o que ferramenta já impõe fica de fora.
4. **Acionar em paralelo**, com contexto limpo, os subagentes `revisor-padroes` e `revisor-especificacao`. Passar a cada um: comando do diff, lista de arquivos do diff, arquivos não rastreados e os trechos citados do seu eixo (IDs + linhas). Caminho de documento inteiro vai só como fonte de consulta, não como leitura.
5. **Relatar** sob `## Padrões` e `## Especificação`, lado a lado, na ordem em que vieram.

Fechar com uma linha: total por eixo e o achado mais grave **dentro de cada eixo**.

Concluída quando os dois relatórios constam, ou a ausência de um está justificada, e cada achado cita regra ou linha da especificação.
