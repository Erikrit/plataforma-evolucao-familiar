---
name: desenho-modulos
description: Módulo profundo — vocabulário e princípios de desenho. Use ao desenhar ou mudar a interface de um módulo, decidir onde fica uma costura, ou quando outra skill precisar desse vocabulário.
---

# Desenho de módulos

Busque **módulos profundos**: muito comportamento atrás de uma interface pequena, em uma costura limpa. As ADRs do projeto (`docs/agents/dominio.md`) definem a forma geral da arquitetura; este vocabulário trabalha dentro dela.

## Vocabulário

- **Módulo:** tudo que tem interface e implementação, em qualquer escala.
- **Interface:** tudo que quem chama precisa saber: tipos, invariantes, ordem, erros, configuração e desempenho.
- **Implementação:** o que fica dentro.
- **Profundidade:** comportamento acessível por unidade de interface aprendida. **Raso** é o módulo cuja interface é quase tão complexa quanto o interior.
- **Costura:** lugar onde o comportamento pode mudar sem editar ali; é onde vive a interface.
- **Adaptador:** algo concreto que ocupa uma costura.
- **Alavancagem:** o que quem chama ganha com a profundidade.
- **Localidade:** o que quem mantém ganha; mudança e verificação concentradas.

## Princípios

- **Teste da remoção:** imagine apagar o módulo. Se a complexidade some, ele só repassava; se reaparece em vários lugares, ele se pagava.
- **A interface é a superfície de teste.** Precisar testar por dentro indica forma errada.
- **Um adaptador é costura hipotética; dois, costura real.**
- Um módulo profundo pode ter costuras internas, invisíveis na interface.
- Receber dependências, devolver resultados, manter a superfície pequena.

## Perguntas

Dá para reduzir métodos? Simplificar parâmetros? Esconder mais? Quem chama precisa conhecer essa ordem ou esse erro?

Em monólito modular, um módulo conversa com outro pela interface exportada; acesso direto a tabela ou arquivo interno de outro módulo é vazamento de costura.

Para aprofundar um grupo de módulos rasos ou comparar alternativas de interface: [aprofundar.md](aprofundar.md).

Concluída quando a proposta nomeia módulo, interface, costura e adaptadores, e passou pelo teste da remoção.
