# Glossário — Plataforma de Evolução Familiar

**Status: PROPOSTA** — extraído das especificações; aguarda aprovação do Produto. Em divergência, a especificação vence.

Fontes: **M01** a **M04** são `docs/modulos/<id>/ESPECIFICACAO.md`.

## Pessoas e acesso

| Termo | Definição | Fonte |
|---|---|---|
| Família | Espaço organizador e limite dos dados de seus participantes, isolado das demais famílias | M01 §2, FAM-R12 |
| Pessoa | Integrante ou colaborador externo, com ou sem login | M01 §2 |
| Pessoa acompanhada | Pessoa a quem se referem o acompanhamento e o histórico, com ou sem conta | M01 §11 |
| Conta | Credencial pessoal vinculada a uma única família | M01 §2, FAM-R13 |
| Vínculo | Relação com a família, familiar ou externa; não é permissão | M01 §2, §11 |
| Responsabilidade | Concessão contextual sobre uma pessoa acompanhada | M01 §11 |
| Autorização | Alcance permitido para usuário, pessoa acompanhada e módulo | M01 §2 |
| Área | Domínio de acompanhamento coberto por uma concessão, como Cuidados ou Desenvolvimento | M01 §11 |
| Administrador | Perfil que gerencia pessoas e convites, sem acesso automático a conteúdo sensível | M01 §6 |
| Responsável | Perfil que acompanha e organiza uma pessoa conforme autorização | M01 FUN-07, M02 §2 |
| Integrante | Perfil de experiência com acesso apenas ao que lhe foi autorizado | M01 §6 |
| Autoacompanhamento | Acesso da pessoa com conta aos próprios contextos permitidos | M01 §11 |

## Cuidados

| Termo | Definição | Fonte |
|---|---|---|
| Programação | Horários conferidos e vigência de um medicamento; mudar não altera o passado | M02 CUI-F01, F04 |
| Vigência | Período em que uma programação vale | M02 CUI-F04 |
| Rotina do dia | Medicamentos e compromissos autorizados do dia, com observação opcional | M02 CUI-F02 |
| Ocorrência | Uma dose prevista pela programação em um horário | M02 CUI-F03, F08 |
| Situação da dose | Tomou conforme informação, informou que não tomou ou sem confirmação | M02 CUI-F02 |
| Sem confirmação | Dose sem relato; não equivale a não tomada | M02 CUI-F02 |
| Relato | Informação dada sobre a dose; não é constatação clínica | M02 CUI-F03, M04 §3 |
| Observação do dia | Texto breve e opcional registrado na Rotina | M02 CUI-F07 |
| Consulta | Compromisso com data, horário e categoria | M02 CUI-F05 |
| Exame | Registro com categoria; data e arquivo opcionais, sem interpretação | M02 CUI-F06 |
| Lembrete | Aviso discreto a destinatário autorizado; não prova uso nem leitura | M02 CUI-F08 |

## Desenvolvimento

| Termo | Definição | Fonte |
|---|---|---|
| Biblioteca | Conjunto curado de atividades e jogos oferecido à pessoa | M03 DEV-F01, §13 |
| Atividade real | Brincadeira presencial da Biblioteca | M03 §12 |
| Brincadeira personalizada | Atividade criada pela família; só o nome é obrigatório | M03 DEV-F02 |
| Modelo | Atividade do catálogo global compartilhado, sem dados pessoais | M03 §12 |
| Sugestão | Modelo elegível oferecido sob demanda, até dois por vez | M03 DEV-JOG-P02 |
| Atividade ativa | Atividade escolhida e disponível para nova participação da pessoa | M03 DEV-F03, §12 |
| Retirar das ativas | Liberar a vaga sem registrar participação nem mover para Executadas | M03 DEV-JOG-P02 |
| Explorar / Executadas | Estados exclusivos de disponibilidade atual da atividade | M03 DEV-F03 |
| Disponibilizar novamente | Devolver atividade ou recompensa à disponibilidade sem mudar o histórico | M03 DEV-F03, F06 |
| Participação | Execução registrada como Concluiu ou Participou | M03 DEV-F04 |
| Estrelas | Reconhecimento automático da participação, conforme a tabela aprovada | M03 DEV-F05 |
| Saldo | Estrelas disponíveis para resgate | M03 DEV-F06 |
| Recompensa | Item opcional com nome e custo em estrelas | M03 DEV-F06 |
| Resgate | Ocorrência que debita o custo da recompensa e o preserva no histórico | M03 DEV-F06 |
| Jogo digital | Jogo da Biblioteca, distinto da atividade real | M03 §13 |

## Evolução

| Termo | Definição | Fonte |
|---|---|---|
| Evolução familiar | Compreensão da trajetória de cada pessoa a partir do que já foi registrado | M04 §1 |
| Histórico individual | Linha do tempo dos acontecimentos autorizados de uma pessoa | M04 §2 |
| Resumo da pessoa | Visão contextual e pequena de um período | M04 §3 |
| Resumo familiar | Poucos destaques autorizados na página inicial; não é um feed | M04 §4 |
| Prévia | Apresentação com a mesma seleção autorizada que irá ao PDF | M04 §5 |

## Perguntas ao Produto

1. **Desafio, brincadeira e atividade** aparecem para conceitos próximos. Recomendação: "atividade" como termo canônico e "desafio" só como nome interno legado.
2. **Integrante** nomeia um perfil (M01 §6) e também quem faz parte da família (M01 §2). Recomendação: reservar para o perfil.
3. **Marco de desenvolvimento**, sugerido no prompt da esteira, não aparece em nenhuma das quatro especificações. Recomendação: não adotar sem decisão.
