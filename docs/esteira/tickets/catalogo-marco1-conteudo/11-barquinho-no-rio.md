# 11: Barquinho no rio (jogo 2D completo)

**O que entregar:** Jogo 2D com 15 fases em três trilhas: rio mais longo, canal mais estreito, mais pedras, curvas e correnteza leve. Sem tempo, sem vidas e sem perder: bater numa pedra só desvia o barco. A fase termina ao chegar na margem final; as folhas são opcionais e não bloqueiam a conclusão. A régua ganha métricas do motor 2D (comprimento, largura mínima do canal, densidade de pedras, curvas) e verifica que existe rota possível. Dica mostra a direção livre mais próxima.

**Bloqueado por:** 10

**Status:** READY

**Costura:** régua de jogos, check:e5, carga oficial, smoke:e5 e homologação

**Risco:** alto

## Critérios

- [ ] DEV-CAT-P03 — 15 fases em três trilhas com dificuldade crescente medida pela régua
- [ ] Régua (Solução) — toda fase tem rota possível com a largura do barco
- [ ] E5-F04 — dica útil no estado atual
- [ ] E5-ACE-10 — toque, teclado, movimento reduzido e saída sempre visível
- [ ] E5-HOM — homologação no celular nas três trilhas
