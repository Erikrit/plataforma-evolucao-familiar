---
name: diagnosticar
description: Diagnóstico de bug ou regressão por fases, a partir de um laço vermelho. Use quando algo quebra, falha, fica lento ou se comporta de modo inesperado e a causa é desconhecida.
---

# Diagnosticar

Pular fase só com justificativa escrita. Em comandos, saídas e capturas mostradas, trocar segredos e dados pessoais por `<OCULTO>`.

## 1. Laço vermelho

Construir **um comando** que fica **vermelho** com este bug. É onde o esforço rende mais. Formas, em ordem: teste na costura que alcança o bug; chamada HTTP; CLI com entrada fixa; navegador automatizado; captura reproduzida; arnês mínimo; laço aleatório; bissecção; comparação entre versões; roteiro guiado para o humano.

Depois, apertar: mais rápido, sinal mais específico, mais determinístico. Bug intermitente: aumentar a taxa até ser depurável.

Concluída quando o comando **já foi executado**, com saída mostrada, e é:

- capaz de ficar vermelho com o sintoma exato relatado;
- determinístico, ou com taxa alta e medida;
- de segundos;
- executável sem humano (salvo o roteiro guiado).

Sem laço possível, parar: listar tentativas e pedir acesso, captura sem dados sensíveis ou permissão para instrumentar.

## 2. Reproduzir e minimizar

Confirmar que é a falha relatada. Cortar um elemento por vez, reexecutando.

Concluída quando remover qualquer elemento restante deixa o laço **verde**.

## 3. Hipóteses

Três a cinco, em ordem, cada uma falseável: "se a causa é X, mudar Y faz sumir". Mostrar ao humano e seguir com a ordem própria se não houver resposta.

Concluída quando cada hipótese tem uma previsão que pode falhar.

## 4. Isolar

Uma variável por vez; cada sonda testa uma previsão. Depurador antes de log. Prefixo único em logs temporários, como `[DEBUG-a4f2]`. Desempenho: medir a base, depois bisseccionar.

Concluída quando uma hipótese foi confirmada e as concorrentes, descartadas com saída real.

## 5. Corrigir com teste de regressão

Costura correta é a que exercita o padrão real do bug. Escrever o teste, ver **vermelho**, corrigir, ver **verde**, reexecutar o laço original. Sem costura correta, isso é um achado: registrar e sugerir `/melhorar-arquitetura`.

Concluída quando o teste foi visto vermelho e verde, ou a falta de costura está registrada.

Correção que muda regra funcional passa pela `triagem` antes.

## 6. Limpar

Concluída quando o laço original está verde, o teste de regressão passa (ou a ausência está registrada), nenhum prefixo de depuração resta e a causa confirmada está no resumo para a `mensagemCommit`.
