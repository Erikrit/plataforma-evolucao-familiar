---
name: tdd
description: TDD, vermelho → verde em fatias verticais. Use ao construir comportamento ou corrigir bug com teste primeiro, ou ao escrever testes.
---

# TDD

Nomear testes com os termos do glossário (`docs/agents/dominio.md`); abri-lo, por `grep -n` e faixa de linhas, só para termo novo. Requisito e ADR: localizar pelo ID com `grep -n` e ler só o trecho. Arquivos de dados grandes (catálogos) são inspecionados pelos scripts que o adaptador indica, nunca lidos inteiros.

## Costuras

Uma **costura** é a fronteira pública onde se observa o comportamento. Testar somente em costuras acordadas: se ainda não há acordo, listar as candidatas, com o que cada uma pega e deixa passar, e confirmar com o humano. Forma da interface em dúvida: chamar `desenho-modulos`.

## O laço

1. **Vermelho.** Um teste que falha pelo motivo esperado. Ver a falha.
2. **Verde.** O mínimo de código que o faz passar. Ver passar.
3. Próxima **fatia vertical**: uma costura, um teste, uma implementação.

Cada teste é uma **bala traçante** que responde ao que o ciclo anterior ensinou. Refatorar pertence à revisão (`revisao-codigo`).

## Bom teste

Verifica comportamento pela interface pública e se lê como especificação. O valor esperado vem de fonte independente: literal conhecido, exemplo resolvido, critério de aceite. Exemplos em [testes.md](testes.md); substitutos em [mocks.md](mocks.md).

## Anti-padrões

- **Acoplado à implementação:** quebra em refatoração que preserva o comportamento. Observar pela interface.
- **Tautológico:** recalcula o esperado do mesmo jeito que o código. Usar literal independente.
- **Fatiamento horizontal:** todos os testes, depois todo o código. Fazer uma fatia por vez.

Sem runner na costura, relatar a lacuna como `PENDING` com a alternativa executável mais próxima.

Concluída quando todo critério em escopo tem um teste que foi visto **vermelho** e depois **verde**, ou justificativa escrita.
