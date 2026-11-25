---
name: escrita-para-agentes
description: Escrita para agentes. Use ao criar ou editar skills, CLAUDE.md, AGENTS.md ou documentos apontados por eles.
---

# Escrita para agentes

Objetivo: o agente seguir o mesmo **processo** a cada execução. Ao escrever uma skill, ler também [mecanica-skills.md](mecanica-skills.md).

## Ponteiros

Um **ponteiro** nomeia um material e a condição para buscá-lo; a redação decide se o agente chega lá. Descrição de skill é ponteiro.

- Começar pela palavra-âncora.
- Um gatilho por ramo; sinônimos do mesmo ramo são repetição.
- Deixar no corpo o que o corpo já diz.

## Duas cargas

**Contexto** é o que fica carregado a cada turno. **Cognitiva** é o que o humano precisa lembrar. Cada documento gasta uma delas; gastar a cognitiva onde o julgamento humano importa.

## Hierarquia

1. Passo no arquivo. 2. Referência no arquivo. 3. Referência em arquivo irmão, por ponteiro.

Todo ramo precisa: fica no arquivo. Só alguns precisam: vai para o irmão. Definição, regra e ressalva de um conceito ficam juntas.

## Critério de conclusão

Todo passo termina em condição **verificável** e **exigente**: "todo critério tem teste ou justificativa" em vez de "entender o problema". Critério vago convida à conclusão prematura.

## Palavras-âncora

Conceito compacto que o modelo já conhece, repetido como termo: *fatia vertical*, *bala traçante*, *costura*, *fronteira*, *vermelho/verde*, *evidência*, *fingerprint*, *módulo profundo*. Preferir palavra existente a inventada.

Instruir no **positivo**. Proibição é guarda-corpo, com o comportamento desejado ao lado.

## Poda

- **Fonte única** por significado; o resto aponta.
- O ambiente também é fonte: o que um comando ou arquivo já mostra dispensa cópia.
- Cortar a frase que não muda o comportamento padrão.
- Cortar o que envelheceu.

Concluída quando cada passo tem critério, cada ponteiro tem condição, cada link resolve e nenhum significado aparece em dois lugares.
