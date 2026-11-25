# Mecânica de skills

## Frontmatter

- `name`: igual à pasta, em minúsculas com hífen.
- `description`: até 1024 caracteres.
- Skill de **usuário**: `disable-model-invocation: true`, descrição de uma linha para humanos. Orquestra.
- Skill de **modelo**: descrição com gatilhos. É método ou referência.

Escolher modelo só quando o agente ou outra skill precisa alcançá-la sozinho.

## Chamadas

- Usuário chama modelo: "chamar a skill `nome`".
- Entre skills de usuário há só recomendação ao humano: "recomendar `/nome`".
- Referência comum a duas skills de usuário vai para skill de modelo ou arquivo do adaptador.

## Núcleo e adaptador

Skill do núcleo serve a qualquer repositório. Caminho, comando, regra ou nome do projeto fica em `docs/agents/*.md` ou `esteira.config.json`, e a skill aponta para lá. O validador impõe a lista de termos bloqueados.

## Dividir

- **Por sequência:** quando os passos seguintes levam a apressar o atual.
- **Por invocação:** quando há palavra-âncora própria ou outra skill precisa dela.

Depois de editar: sincronizar os espelhos e rodar o validador.
