# Revisão UX do Módulo 04 — Histórico, Resumo e PDF

**Data** 2026-11-20. **Estado** revisão estática concluída, proposta de experiência em validação com Produto.
**Referência** develop @ 64a4a0694d6d370267d8b7ff7d381aa484bec97b.
**Fonte funcional** docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md v1.1.
**Retomada** após aceite humano da simplificação do Módulo 01, registrado em STATUS-E-ESCOPO.md.
A aplicação, os testes e os arquivos PDF não foram executados ou renderizados nesta revisão.

## 1. Proposta concreta de experiência

Preservar Histórico e Resumo no menu contextual da pessoa. PDF é uma ação do Resumo.

| Destino | Composição proposta | Ação principal |
|---|---|---|
| Histórico | Pessoa identificada no contexto, período compacto, acontecimentos agrupados por dia com horário, ícone e descrição humana | Consultar acontecimento; expandir detalhes existentes e autorizados |
| Resumo de Cuidados | Pessoa e período, quatro situações das doses com rótulos legíveis, consultas/exames e observações existentes pertinentes | Consultar resumo; preparar PDF se autorizado |
| Resumo de Desenvolvimento | Experiências, categorias quando existentes, estrelas como incentivo e observações existentes | Consultar experiências; preparar PDF se autorizado |
| Prévia do PDF | Pessoa, período e conteúdo exato que será exportado, com aviso breve de compartilhamento | Baixar PDF após conferência |

**Histórico no celular** — abrir já com os acontecimentos, mais recentes primeiro. Período em controle compacto com opções “Últimos 7 dias”, “Últimos 30 dias” e “Personalizado”, dentro da capacidade efetivamente suportada. A apresentação inicial pode usar período útil sem tornar obrigatório escolher datas. Filtro de área aparece somente quando houver mais de uma área autorizada. Ícones complementam textos. Correções permanecem identificáveis. Não criar novos campos para alimentar o histórico.

**Resumo no celular** — exibir período e conteúdo imediatamente. Para quem acessa duas áreas, manter seções claramente identificadas e os limites de autorização por operação. Exemplo de bloco de Cuidados com dados fictícios: “21 doses previstas”, “18 tomadas informadas”, “1 não tomada informada”, “2 sem confirmação”. Manter a explicação necessária de que ausência de confirmação não significa dose não tomada. Evitar parágrafos que ensinem onde está o menu.

**PDF** — botão “Preparar PDF” somente com capacidade de exportação. Abrir prévia com pessoa, datas e os mesmos dados do arquivo. Exibir “Baixar PDF” após carregamento bem-sucedido. A prévia pode ser a própria tela quando sua seleção corresponder integralmente à exportação; reaproveitar o contrato de prévia existente. A implementação escolhe a composição mais simples após validar a proposta. Conteúdo completo deve continuar em páginas adicionais, sem corte silencioso.

Esses detalhes são proposta de UX. O aceite do Módulo 01 não aprova automaticamente este desenho.

## 2. Achados verificáveis na inspeção

| ID | Prioridade | Evidência estática | Encaminhamento |
|---|---|---|---|
| EVO-REV-01 | Alta | historico/page.tsx mantém dois campos de data em destaque e parágrafo sobre uso do menu; resumo/page.tsx repete instruções de navegação | Validar controle compacto de período e retirar texto redundante |
| EVO-REV-02 | Alta | Cartões do histórico exibem data, tipo e resumo, sem ícone nem detalhe expansível; resumo não apresenta datas das consultas embora o payload as contenha | Melhorar legibilidade com dados já disponíveis e detalhes autorizados |
| EVO-REV-03 | Alta funcional | linhasRelatorio inclui c.registros com doses detalhadas, enquanto resumo/page.tsx não renderiza esses registros. O botão baixa o PDF imediatamente e só então mostra o aviso retornado | Reconciliar seleção da prévia e PDF conforme EVO-R05/R10 e seção 5 |
| EVO-REV-04 | Alta funcional | montarPdfMinimo aplica split por linha e slice(0,55), depois slice(0,90) em cada linha; documento tem uma página | Corrigir paginação e quebra de linha, validando completude, acentos e texto longo |
| EVO-REV-05 | Alta funcional | resumo usa listarDiasIso(de,ate,62), que termina ao alcançar 62 dias sem sinalizar; consultas/exames usam take 20; experiências take 40 e doses detalhadas take 50 | Evitar resumo parcial apresentado como total; separar totais do período e listagem paginada conforme especificação |
| EVO-REV-06 | Alta autorização/UX | Botão Exportar PDF aparece com conteúdo, sem consulta explícita da capacidade de exportar. Servidor exigeExportacao permanece presente | Representar capacidade efetiva e testar acesso por domínio e operação, inclusive conta com Cuidados/Integrante e Desenvolvimento/Responsável |
| EVO-REV-07 | Alta confiabilidade | Requisições dependem diretamente das datas e pessoaId, sem descarte explícito de respostas antigas; podeVer interpreta autorização pelo prefixo textual da mensagem de erro | Testar troca rápida de pessoa/período e perda de acesso; usar estado explícito e impedir resposta antiga de preencher contexto novo |
| EVO-REV-08 | Média funcional | Resumo de Cuidados não consulta/retorna observações de apoio na função resumo; especificação prevê observações e mudanças de programação pertinentes | Conferir cobertura dos registros existentes e apresentar os itens previstos sem duplicação |

Os limites de take e 62 dias são observados no código. Seu efeito prático precisa de fixtures que ultrapassem cada limite. As condições de corrida e autorização por combinação de domínios são riscos a testar, sem conclusão de vazamento reproduzido nesta revisão.

O cabeçalho do PDF usa pessoaId, estados técnicos e datas ISO. O nome compreensível da pessoa, rótulos e datas locais devem ser utilizados na apresentação ao usuário, mantendo identificadores técnicos apenas onde necessários ao diagnóstico.

## 3. Encaminhamento entre áreas

**UX/Produto** — validar a composição de Histórico, Resumo e prévia acima antes de iniciar o redesenho.

**Arquitetura/Qualidade** — avaliar EVO-REV-03..08 como aderência aos requisitos já aprovados. Prévia fiel, PDF completo, totais corretos e autorização contextual já são exigidos na especificação v1.1. A menor correção compatível pode ser planejada sem reabrir esses requisitos. Caso a solução proponha restringir período aceito, excluir dados antes previstos ou ampliar exportação, encaminhar a mudança funcional ao Produto.

**Esteira** — após validação da experiência, rotear demanda delimitada com os achados aplicáveis e respectivas evidências. Preservar o aceite dos módulos anteriores e executar regressão conforme impacto. Não marcar esta revisão como homologação de tela implementada.

## 4. Critérios de validação

- Familiar identifica de quem são os dados e o período em Histórico, Resumo e PDF.
- Consegue entender os quatro estados de doses sem julgamento ou inferência clínica.
- Encontra experiências, categorias e observações já existentes, inclusive sem categoria.
- Prévia e PDF têm a mesma seleção autorizada e conteúdo completo.
- Amostras excedem 55 linhas, 90 caracteres e os limites de listagem existentes; período excede 62 dias ou recebe tratamento explícito compatível com o requisito aprovado.
- Alterações de programação no mesmo dia e vigências históricas não distorcem contagens.
- Integrante, Responsável, acesso próprio e administrador têm suas capacidades respeitadas em tela, URL, API, prévia e PDF.
- Revogação, falha de rede e troca rápida de contexto não mostram dados anteriores como resposta atual.
- Mobile, desktop, teclado e foco são verificados. Aceite humano registrado após entrega.

## 5. Arquivos consultados

- docs/modulos/04-evolucao-familiar/ESPECIFICACAO.md
- docs/ux-ui/DIRETRIZES-PROXIMOS-MODULOS-E-EXECUCAO.md
- docs/produto/STATUS-E-ESCOPO.md
- apps/web/src/app/pessoas/[pessoaId]/historico/page.tsx
- apps/web/src/app/pessoas/[pessoaId]/resumo/page.tsx
- apps/api/src/cuidados/servico-acompanhamento.ts

**Próxima ação** validar a proposta de experiência e encaminhar as correções técnicas identificadas. Estado de UX do Módulo 04 nesta rodada é EM REVISÃO, com achados estáticos e proposta aguardando validação.
