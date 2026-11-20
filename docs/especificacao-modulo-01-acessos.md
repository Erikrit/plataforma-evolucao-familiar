# Módulo 01 — Gestão e visualização de acessos

**Projeto:** Plataforma de Evolução Familiar  
**Destinatários:** Desenvolvimento, UX e QA  
**Estado:** especificação de correção após reprovação na homologação humana  
**Referência técnica:** branch `develop`, CT-20261119-003 e ADR-014

## 1. Resultado esperado

Antes de confirmar um acesso, o administrador consegue explicar **quem verá qual área de qual pessoa e quais ações estarão disponíveis**. Depois da concessão ou ativação do convite, a conta do participante encontra exatamente a área e as ações informadas. Ao consultar a aba **Acessos**, o administrador consegue responder tanto “quem acompanha esta pessoa?” quanto “o que esta conta pode acessar?”.

A inspeção da `develop` confirmou que a interface já permite selecionar participante, pessoa acompanhada, área e responsabilidade. A lista atual privilegia a consulta por pessoa, a confirmação repete a seleção e a troca de área pode preencher automaticamente a primeira responsabilidade da lista. A reprodução das sessões reais e a comparação visual com o protótipo fazem parte da validação desta entrega.

## 2. Regra de acesso e texto da interface

**Participante** é quem entra e usa o sistema. **Pessoa acompanhada** é de quem são os dados. **Área** é a parte do sistema a que o vínculo dá acesso para aquela pessoa. **Responsabilidade** define as ações disponíveis dentro dessa área. Uma mesma conta pode ter responsabilidades diferentes em pessoas ou áreas diferentes.

A tabela descreve as combinações vigentes da ADR-014. Os textos são referências para a UI. A equipe deve respeitar os nomes das ações existentes e conferir cada promessa contra os controles do servidor e a sessão real antes de fechar a entrega.

| Escopo e rótulo | Regra vigente | Texto de referência |
|---|---|---|
| Família · Administrador | Administra dados cadastrais da família e de pessoas, convites e acessos. O conteúdo clínico e de desenvolvimento exige autorização correspondente. | “Gerencia pessoas, convites e acessos da família. O acesso a Cuidados e Desenvolvimento depende das responsabilidades de cada pessoa.” |
| Cuidados · Responsável | `responsavel_cuidados`. Vê a rotina, registra, programa, consulta anexos e exporta na pessoa selecionada. | “Pode ver a rotina, registrar cuidados, programar, consultar anexos e exportar informações de Cuidados de [pessoa].” |
| Cuidados · Integrante | `colaboradora_cuidados`. Vê a rotina e registra apoio ou dose na pessoa selecionada. Programação, anexos clínicos e exportação ficam restritos às autorizações correspondentes. | “Pode ver a rotina e registrar apoio e doses de [pessoa]. Programação, anexos clínicos e exportação ficam disponíveis ao Responsável.” |
| Desenvolvimento · Responsável | `responsavel_desenvolvimento`. Vê, participa, organiza e exporta no contexto da pessoa selecionada. | “Pode acompanhar, participar, organizar e exportar informações de Desenvolvimento de [pessoa].” |

O catálogo de concessão direta e convite contém as três combinações contextuais da tabela. A regra de acesso aos próprios dados segue o contrato vigente. A proteção do último administrador é aplicada no servidor.

## 3. Comportamento por tela

### 3.1 Gerenciar família → Acessos

- Manter a consulta **Por pessoa acompanhada** e acrescentar **Por participante** na mesma aba. Na primeira, o administrador vê quem acompanha a pessoa e em qual área. Na segunda, seleciona uma conta e vê todas as pessoas, áreas e responsabilidades daquela conta.
- Na visão por participante, agrupar as linhas contextuais por pessoa acompanhada. Em cada linha mostrar **área e responsabilidade**. Na visão por pessoa, mostrar **participante, área e responsabilidade**. Usar `usuarioId` para distinguir contas de mesmo nome.
- Exibir **Administração da família** em bloco próprio. Identificar o escopo pelo papel e pelos campos explícitos do contrato. Se faltar o nome em um registro contextual, manter o escopo contextual e informar que o nome está indisponível.
- Usar o rótulo **Integrante** na interface para o papel de apresentação legado `Colaborador`. Convites pendentes, usados ou expirados são consultados em **Convites**. Se a consulta de acessos ativos estiver vazia, explicar a ausência no contexto selecionado.
- Ao retirar um acesso contextual, identificar na confirmação o participante, a pessoa, a área e a responsabilidade afetados. Após sucesso, atualizar as duas visões. Após erro, manter o registro visível e exibir a falha no contexto da ação.

### 3.2 Conceder acesso e enviar convite

1. Selecionar a conta existente ou informar o e-mail no fluxo de convite. Em seguida, selecionar a pessoa acompanhada e a área.
2. Em **Cuidados**, mostrar **Responsável** e **Integrante** com o resumo das ações de cada opção. Exigir escolha explícita. Se o usuário trocar de área e retornar a Cuidados, limpar a escolha anterior.
3. Em **Desenvolvimento**, apresentar **Responsável** como a única opção, com o resumo correspondente. Usar o mesmo catálogo e as mesmas descrições nos dois fluxos.
4. Na revisão, mostrar o efeito da combinação inteira. Exemplo: **“Quando entrar, a cuidadora verá Cuidados da Avó. Ela poderá ver a rotina e registrar apoio e doses.”** No convite, indicar que esse acesso começa após a ativação. Permitir voltar e corrigir a seleção antes do envio.
5. Mostrar sucesso após confirmação do servidor. Em caso de falha, manter os campos para revisão e apresentar a mensagem junto à etapa que falhou.

### 3.3 Visão do participante

- A página inicial, as áreas no menu e as ações das telas devem refletir as autorizações efetivas e os demais acessos previstos no contrato. Mostrar claramente **a pessoa selecionada e a área atual**. Ao mudar de pessoa, renderizar os destinos do novo contexto e evitar manter ações ou dados da pessoa anterior na tela.
- As combinações aprovadas produzem os efeitos da tabela. Usar os mecanismos de autorização já existentes para menu e ações e preservar a validação no servidor. Conferir os resultados com contas de teste reais, cada uma com acessos conhecidos.
- Na retirada de um vínculo, respeitar a invalidação de sessão prevista pela ADR-014. Depois do novo login, a conta mantém os outros vínculos e perde apenas o acesso contextual retirado.
- Conferir os três percursos em largura de celular e desktop. A seleção e a revisão devem permitir identificar participante, pessoa, área e efeito sem depender da cor ou de texto cortado.

## 4. Cenários de aceite

Preparar uma família fictícia com **Avó**, **Laurinha**, **Administrador**, **Cuidadora** e **Responsável**. Usar contas independentes. Para os cenários de privacidade, garantir que a conta testada tenha apenas os vínculos declarados no cenário.

| ID | Dado / Quando | Então |
|---|---|---|
| AC-01 | Administrador com apenas o papel familiar abre Gerenciar família e consulta sua conta. | A administração aparece em bloco próprio. A conta gerencia pessoas, acessos e convites. O menu e as telas preservam a privacidade de Cuidados e Desenvolvimento. |
| AC-02 | Administrador seleciona Cuidados da Avó, troca para Desenvolvimento e volta a Cuidados. | As duas opções de Cuidados têm descrições distintas. Ao retornar, o botão de revisão depende de nova escolha explícita. Repetir no convite. |
| AC-03 | Administrador concede Cuidados da Avó à Cuidadora como Integrante e ela entra. | A revisão descreve rotina, apoio e doses. A conta encontra essa área da Avó e consegue executar as ações prometidas. Programação, anexos clínicos, exportação e Desenvolvimento da Laurinha ficam fora desse vínculo. |
| AC-04 | Administrador concede Cuidados da Avó como Responsável a uma conta de teste. | A sessão mostra as ações correspondentes à função, incluindo programação, anexos e exportação, usando dados fictícios preparados para essas verificações. |
| AC-05 | A conta Responsável mantém Cuidados da Avó e recebe Desenvolvimento da Laurinha. | É possível ver ambos os vínculos na visão por participante e encontrá-los nos grupos corretos por pessoa. Na conta, cada área e suas ações aparecem no contexto correto. |
| AC-06 | Administrador retira apenas Cuidados da Avó da conta do cenário AC-05. | As duas visões refletem a retirada. A sessão é invalidada conforme o contrato. Após novo login, Desenvolvimento da Laurinha continua disponível e Cuidados da Avó deixa de abrir. |
| AC-07 | Administrador envia convite com uma combinação válida. O convite é aberto e ativado. | Antes da ativação, o convite aparece apenas em Convites. Após ativação, a área e as ações da conta correspondem à combinação prometida. |
| AC-08 | QA executa os testes de autorização existentes com os cenários de escopo por família, pessoa e área, proteção do último administrador e consistência do catálogo previsto na ADR-014. | O servidor preserva os limites previstos. Registrar separadamente qualquer divergência entre o texto, o menu, as ações da tela e a autorização efetiva. |
| AC-09 | Homologador usa o formulário e as duas visões sem orientação. Antes de confirmar, explica o que a outra conta verá e fará. Depois, entra com essa conta. | A descrição feita pelo homologador coincide com a sessão real. Registrar a evidência em celular e desktop, com dados fictícios. |

## 5. Entrega para a esteira

- Entrar pelo `task-routing` como correção do Módulo 01. Usar `module-planning` quando o roteamento indicar necessidade. Seguir com `implementation-workflow` e `quality-gate`.
- Pontos de partida na web: `painel-gerenciar-familia.tsx` para consulta, concessão e convite. `navegacao-app.tsx`, página inicial e páginas da pessoa para conferir a visão de cada conta. Reutilizar o catálogo de responsabilidades e as verificações do servidor previstas na ADR-014.
- Conferir primeiro a revisão e o protótipo aprovados com a versão que foi homologada, quando estiverem disponíveis. Registrar a referência da versão testada e evidências dos percursos AC-01 a AC-09. Onde houver divergência, identificar se ocorre na descrição da concessão, na navegação, na ação apresentada ou na autorização efetiva.
- A entrega cobre consulta de acessos, seleção, revisão, retirada e experiência do participante. A ADR-014 delimita as combinações vigentes. Sucessão de administrador, remoção de pessoa e novas combinações são demandas próprias.
- O resultado técnico segue para **homologação humana pendente**. O Módulo 01 só recebe aceite quando Produto confirmar o cenário AC-09 juntamente com as evidências dos demais cenários. A repriorização do Módulo 01 antes do Módulo 04 segue o registro de Produto.

## Referências oficiais

- [Governança](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/develop/docs/produto/GOVERNANCA.md)
- [Status e escopo](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/develop/docs/produto/STATUS-E-ESCOPO.md)
- [Revisão UX do Módulo 01](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/develop/docs/ux-ui/REVISAO-MODULO-01-ACESSOS.md)
- [Decisões de Arquitetura — ADR-014](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/develop/docs/arquitetura/DECISOES.md#adr-014--gestão-de-acessos-sem-matriz-nova-módulo-01)
- [Painel administrativo na develop](https://github.com/Erikrit/plataforma-evolucao-familiar/blob/develop/apps/web/src/componentes/painel-gerenciar-familia.tsx)
