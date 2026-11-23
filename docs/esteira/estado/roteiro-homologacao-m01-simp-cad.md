# Roteiro de homologação humana — DEM-M01-SIMP-CAD-20261120

**Critério:** `M01-SIMP-HOM` · Mobile + desktop · dados fictícios

## Preparação

1. API e web locais rodando; base com seed fictício.
2. Entrar como administrador da família.

## Cenários

### 1. Cadastro mínimo sem conta

- Em Gerenciar família → Pessoas, cadastrar só com nome (sem marcar “precisa entrar”).
- Confirmar que a pessoa aparece “sem conta” e pode ser acompanhada por quem já tem autorização.

### 2. Habilitar conta na mesma pessoa

- Cadastrar outra pessoa com “Essa pessoa também precisa entrar?” + e-mail fictício, **ou** usar “Habilitar conta” em pessoa sem conta.
- Abrir o link de ativação, definir senha e ativar.
- Confirmar que **não** surgiu uma segunda pessoa com o mesmo nome; a conta fica na pessoa cadastrada.

### 3. Autoacompanhamento (capacidades atuais)

- Entrar com a conta recém-ativada (só conta, sem responsabilidade contextual).
- Deve consultar a própria área de Cuidados/Desenvolvimento conforme controles atuais.
- Não deve programar medicamento/consulta nem exportar Cuidados sem responsabilidade contextual.
- Conceder Responsável em Cuidados (pessoa-alvo = ela mesma) e confirmar que programação passa a ser permitida.

### 4. Entrada contextual

- Conta com **um** contexto operacional: após login, deve ir direto à área.
- Conta com **dois** contextos (ex.: própria Cuidados + Desenvolvimento, ou duas pessoas): home com escolha simples agrupada por pessoa.
- Administrador sem contexto operacional de conteúdo: destino de gestão familiar.

### 5. Isolamento e revogação

- Colaboradora externa por convite clássico (pessoa-alvo = acompanhada): vê só o escopo autorizado; URL direta a outra pessoa = negado.
- Revogar acesso: sessão invalidada; demais vínculos da conta, se houver, valem no próximo login.

## Resultado

- [ ] Aprovado
- [ ] Reprovado — anotar achados

Homologação humana **não** é inferida de QG/PASS técnico.
