# Linha de base de code smells

De Fowler, *Refactoring*, cap. 3. Sempre julgamento ("possível Inveja de Dados"), nunca violação objetiva.

- **Nome Misterioso:** não revela o que faz. → renomear; sem nome honesto, o desenho está turvo.
- **Código Duplicado:** mesma lógica em dois pontos do diff. → extrair.
- **Inveja de Dados:** método usa mais os dados de outro objeto. → mover.
- **Grupos de Dados:** campos que andam juntos. → criar um tipo.
- **Obsessão por Primitivos:** primitivo no lugar de conceito do domínio. → tipo próprio.
- **Switches Repetidos:** mesma cascata em vários pontos. → polimorfismo ou um mapa único.
- **Cirurgia com Rifle:** uma mudança lógica espalhada. → reunir.
- **Mudança Divergente:** um módulo editado por razões distintas. → separar.
- **Generalidade Especulativa:** abstração sem requisito. → remover.
- **Cadeias de Mensagens:** `a.b().c().d()`. → esconder o caminho.
- **Intermediário:** só repassa. → chamar o destino.
- **Herança Recusada:** ignora o que herda. → compor.
