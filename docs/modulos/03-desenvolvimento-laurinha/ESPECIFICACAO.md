# Módulo 03 — Desenvolvimento da Laurinha

**Versão:** 1.1 — revisão funcional simplificada  
**Estado:** proposta revisada para aceite final; substitui o resumo v1.0.  
**Dependência:** Módulo 01 — Fundação Familiar.  
**Fonte de histórico aprofundado e relatórios:** Módulo 04.

## 1. Propósito

Facilitar brincadeiras e experiências presenciais entre a Laurinha, Mikaela e adultos autorizados, reconhecendo participação de forma lúdica e preservando lembranças relevantes. O sistema incentiva a convivência e não mede inteligência, comportamento ou desempenho clínico.

**Restrições inegociáveis:** evolução familiar; esforço mínimo; organização sem cobrança. Se um campo não contribui para lembrar, cuidar, organizar ou compreender evolução, não deve ser exigido. Se registrar a brincadeira der mais trabalho do que realizá-la, simplificar ou remover o fluxo.

## 2. Escopo enxuto

1. **Descobrir ou criar brincadeiras** — biblioteca inicial pequena e útil de atividades com instruções simples, adequadas à faixa etária, em memória/atenção, raciocínio, linguagem, criatividade, coordenação e autonomia.
2. **Guardar para depois (opcional)** — salvar ou retirar atividades de uma lista sem prazo, status de atraso, metas semanais obrigatórias ou notificações de cobrança.
3. **Registrar participação e conceder estrelas automaticamente** — ação curta, realizada por adulto autorizado após a experiência.
4. **Consultar estrelas e recompensas (opcionais)** — saldo, movimentos e resgates compreensíveis. Histórico cronológico completo e resumos ficam no Módulo 04.

Não exigir uso diário, planejamento, cronômetro, foto de prova ou avaliações estruturadas.

## 3. Pessoas e autorizações

- **Mikaela:** referência principal para escolher e organizar brincadeiras e recompensas; não aprova pontos um a um.
- **Outros adultos autorizados:** podem consultar atividades e registrar participações, conforme autorização por pessoa e operação.
- **Laurinha:** participa da experiência; **não precisa de conta** e não precisa registrar dados.
- **Administrador:** gerencia autorizações; parentesco ou administração não concede automaticamente acesso irrestrito a dados privados da criança.
- **Colaboradora da Vovó:** não recebe acesso a este módulo por sua função de cuidados.

## 4. Funcionalidades e comportamentos

### DEV-F01 — Biblioteca de atividades

Cada atividade da biblioteca oferece nome, instrução curta, categoria, dificuldade e materiais quando necessários. Duração aproximada é opcional. Filtros simples por categoria e apresentação adequada a celular. As orientações priorizam a atividade presencial e não exigem manter a tela aberta.

A biblioteca será curada, pequena e apropriada para a idade; não inclui testes diagnósticos nem promessas clínicas.

### DEV-F02 — Brincadeira personalizada

**Entrada mínima:** nome. **Dificuldade:** pré-selecionada como simples; o adulto pode alterá-la para média ou desafiadora. Categoria, instruções, materiais e duração são opcionais e podem ser preenchidos depois.

A dificuldade determina as estrelas segundo regra simples. Nenhuma categoria obrigatória para permitir salvar. A alteração posterior de categoria/dificuldade não reescreve participações ou pontos anteriores.

### DEV-F03 — Guardar para depois

Uma atividade pode ser marcada ou desmarcada como guardada. Não existem vencimento, agenda de desafios atrasados nem obrigação de concluir a lista. Pode-se realizar qualquer atividade sem guardá-la antes. **Não implementar tabela/fluxo de planejamento semanal obrigatório**; organização por favoritos/guardados é suficiente no MVP.

### DEV-F04 — Participação simples

Depois de realizar a atividade, o adulto autorizado escolhe:
- **Concluiu:** completou a proposta da brincadeira.
- **Participou:** explorou, tentou ou precisou de apoio, sem necessariamente concluí-la.

**Não realizada** deixa de ser opção de registro cotidiano. Se a brincadeira não aconteceu, não há nada para preencher nem punição.

Observação qualitativa opcional, nunca exigida. O sistema acrescenta pessoa, desafio, autor e momento automaticamente. A mesma brincadeira pode ser realizada legitimamente várias vezes, como execuções distintas. Uma tentativa de envio repetida da **mesma execução** não pode gerar registros e pontos duplicados. Correções preservam rastreabilidade e ajustam pontos de modo consistente.

### DEV-F05 — Estrelas automáticas

Sem aprovação manual, sem envio de quantidade pelo frontend, sem ranking, sequência diária, bônus por assiduidade ou perda de estrelas por emoções/comportamento.

**Tabela simples proposta para aceite final:**

| Dificuldade | Concluiu | Participou |
|---|---:|---:|
| Simples | 5 | 3 |
| Média | 10 | 5 |
| Desafiadora | 15 | 8 |

A dificuldade vem predefinida nas atividades do catálogo e em simples nas personalizadas. Valores são **proposta v1.1, ainda não aprovados explicitamente**. A regra deve ser transparente; o valor concedido em cada execução é preservado mesmo se valores futuros mudarem. O registro de participação e o movimento de estrelas formam uma operação consistente.

### DEV-F06 — Estrelas e recompensas

Exibir estrelas conquistadas no total, saldo disponível e movimentos/resgates relevantes de forma compreensível. A família pode combinar recompensas fora do aplicativo; o catálogo e o resgate digital são opcionais. Se cadastrada, uma recompensa precisa apenas de nome e custo; o resgate preserva custo histórico e não deve duplicar nem permitir saldo negativo.

Não condicionar afeto, comida, necessidades básicas, descanso ou cuidados a pontos. Se a família combinar uma recompensa, evitar alterar uma meta já prometida sem novo acordo compreensível com a criança.

### DEV-F07 — Acesso ao histórico

O módulo pode abrir a linha do tempo e o resumo da Laurinha **fornecidos pelo Módulo 04**; não desenvolver painel ou segunda base de histórico independente. Qualquer observação registrada acompanha sua participação original.

## 5. Fluxos de uso

**A. Explorar:** abrir Laurinha → descobrir atividades → abrir instruções → realizar presencialmente; sem cadastro/planejamento obrigatório.

**B. Criar:** adicionar brincadeira → nome → dificuldade já definida como simples (alterável) → salvar.

**C. Guardar:** tocar em guardar → atividade aparece em guardadas → retirar quando quiser; sem prazos.

**D. Registrar:** abrir atividade → Concluiu ou Participou → confirmar → estrelas e participação salvas em uma ação.

**E. Recompensa:** consultar saldo → selecionar recompensa opcional → confirmar resgate como adulto autorizado.

**F. Evolução:** abrir histórico individual (Módulo 04) → consultar atividades e observações sem nova alimentação.

## 6. Estados e exceções

- Sem atividades registradas: mensagem neutra; não há cobrança.
- Atividade guardada não realizada: permanece guardada até o usuário retirar; não vira pendência.
- Repetição legítima: pode registrar novamente, com nova identidade de execução.
- Duplo toque ou reenvio após falha: não duplica estrelas.
- Erro de gravação: não apresentar pontos como definitivamente ganhos antes de confirmação.
- Correção de resultado: recalcular o efeito do movimento com histórico preservado.
- Resgates concorrentes: impedir gasto duplicado ou saldo negativo.
- Sem autorização: bloquear consulta, registro, histórico e dados agregados.
- Alteração de dificuldade: não mudar resultados já registrados.
- Pausas de dias ou semanas: nenhum alerta de atraso ou diminuição de desempenho.

## 7. Dados mínimos

| Ação | Informado pelo adulto | Automático |
|---|---|---|
| Criar atividade | Nome; dificuldade com padrão simples | Identidade, origem e pontuação |
| Guardar atividade | Seleção da atividade | Pessoa e associação |
| Registrar participação | Concluiu/Participou; nota opcional | Autor, momento, identificação da execução, pontos e histórico |
| Criar recompensa | Nome e custo | Identificadores e status |
| Resgatar | Escolha da recompensa | Custo aplicado, movimento, autoria e horário |

Evitar classificação, observação, evidência fotográfica, justificativa ou data como campos obrigatórios quando derivados ou desnecessários.

## 8. Integração e fronteiras

- Módulo 01 identifica pessoas, sessões e autorizações.
- Módulo 03 é fonte oficial de desafios, participações, estrelas e resgates.
- Módulo 04 lê os registros autorizados e apresenta histórico, resumo e PDF, sem duplicar entrada de dados.
- Sem dependência funcional do módulo de cuidados da Vovó.

## 9. Critérios de aceitação

- [ ] Adulto encontra e realiza uma atividade da biblioteca sem criar planejamento.
- [ ] Atividade personalizada pode ser salva apenas com nome (dificuldade simples predefinida).
- [ ] Categoria e observação não são obrigatórias.
- [ ] Guardar para depois não gera prazo, atraso ou cobrança.
- [ ] Somente Concluiu e Participou aparecem no registro cotidiano.
- [ ] Uma participação gera estrelas automaticamente sem aprovação.
- [ ] Tentativa/participação recebe reconhecimento conforme tabela vigente.
- [ ] Brincadeiras não realizadas não exigem qualquer registro.
- [ ] Reenvio da mesma execução não duplica dados ou estrelas, mas nova execução legítima é permitida.
- [ ] Correções e resgates mantêm consistência de saldo e rastreabilidade.
- [ ] Histórico individual é disponibilizado pelo Módulo 04, sem segundo cadastro.
- [ ] A colaboradora e usuários sem autorização não acessam dados da Laurinha.
- [ ] Experiência funciona em celular e sem uso diário.
- [ ] Nenhuma informação é apresentada como avaliação clínica da criança.

## 10. Fora do MVP

Planejamento com calendário obrigatório; declaração de atividade não realizada; metas compulsórias; ranking; notas escolares/clínicas; XP separado; níveis complexos; jogos digitais; geração por IA; medição de inteligência; foto/vídeo como prova; relatórios manuais; painel próprio duplicado de evolução.

**Princípio de aceite:** a família vive a experiência; a plataforma reconhece e lembra, sem fiscalizar.
