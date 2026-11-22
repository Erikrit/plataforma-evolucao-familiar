# E2 — Gestão de acessos e ativação por link

**Demanda:** DEM-E2-ACESSOS-20261122  
**Estado:** COMPLETED técnico (E2-01..04); homologação humana PENDING (E2-ACE-08).  
**Tipo:** transversal · **Risco:** alto (contas, saúde/criança, autorização).  
**Aprovação:** Módulo 01 v1.9 §15, E2-ACE-01..08.  
**Base inspecionada:** develop @ 2ccc5d4a421289a2899557de91f6935f6807dd95.

## Triagem e dependências

E1 corrigida e homologada no escopo registrado. DEF-E2-ATIVACAO-20261122 aberto: o usuário espera mensagem para ativar pessoas. Produto aprovou link compartilhado manualmente e adiou envio automático.

Inspeção estática: ServicoConvites.criar gera token, pessoaContaId/pessoaAlvoId e expiração; ativar valida slug, uso/prazo e cria conta em transação, reutilizando pessoa existente quando indicada. PainelGerenciarFamilia recebe linkAtivacao, apresenta âncora e ainda usa “Enviar convite”. Essa inspeção identifica a divergência de expectativa, mas não demonstra funcionamento completo da ativação.

Reutilizar FUN-03/04/07, FAM-R05/07/11/12/13 e ADR-014. Não trocar modelo de identidade nem permissões. Governança e registros da esteira continuam vigentes.

## Incrementos verticais

| ID | Requisitos | Resultado | Arquivos previstos |
|---|---|---|---|
| E2-01 — Habilitar e ativar | E2-ACE-01..04 | Cadastro sem conta preservado; gerar/copiar convite contextual e ativar/login com pessoaId correto; remover expectativa de e-mail enviado | painel-gerenciar-familia.tsx, lib/api.ts, app/f/[slug]/convites/ativar/page.tsx, convites/servico-convites.ts e controlador; testes pertinentes |
| E2-02 — Compreender contas e convites | E2-ACE-05 | Estados reais e metadados mínimos por família, separados de acesso ativo; ajustar contrato mínimo se necessário | pessoas/convites/autorizacoes e painel administrativo; testes |
| E2-03 — Compreender e gerir acompanhamento | E2-ACE-06/07 | Visão por pessoa/área/responsabilidade, opções ADR-014, concessão/retirada com explicação e controles existentes | painel administrativo, lib/api.ts, autorizacoes e responsabilidades; testes |
| E2-04 — Validar conjunto | E2-ACE-01..08 | Regressão E1/M01 e jornadas humanas; evidências próprias e roteiro | suítes existentes e roteiro/evidências E2 |

Cada incremento passa por QG-1, verifier e QG-2. Fechamento usa QG-3 e homologação humana. Não herdar PASS da E1.

## Verificações técnicas e desenho UX

- Registrar a jornada mínima de baixa fidelidade e estados antes de alterar componentes; aproveitar abas existentes, evitando novo painel paralelo.
- Confirmar se os contratos de pessoas/convites já permitem distinguir estados. Se faltar leitura administrativa, adicionar o mínimo, com filtro de família e metadados sem conteúdo clínico. Não assumir endpoint pronto.
- Mostrar token/link somente ao administrador autorizado no contexto de geração; não publicar tokens em listagens, logs ou análises. Link é credencial de ativação.
- Montar link absoluto com origem confiável do ambiente e slug validado; não fixar família ou localhost. Prever clipboard indisponível.
- Verificar uso único e corrida dentro da transação; corrigir somente lacunas necessárias para impedir duplicação/ativação concorrente indevida.
- Confirmar o fluxo de conta existente: concessão contextual, não criação duplicada ou tomada de conta.
- Convite pendente não aparece como acompanhamento ativo. Conta ativada não significa permissão irrestrita.
- Backend mantém autoridade sobre todas as operações; UI usa catálogo vigente. Sem envio de mensagem, sem marcação de e-mail verificado.
- Revogação invalida sessões; validar último administrador e acesso próprio sem ampliar suas capacidades.

## Homologação e saída

Três jornadas: cadastrar pessoa e ativar sua conta pelo link; conceder acompanhamento em área suportada; retirar acompanhamento e confirmar o bloqueio. Executar com administrador, responsável, integrante e pessoa com acesso próprio, em duas famílias fictícias. Incluir convite inválido/expirado/usado, URL de outra família, retry e falha de persistência.

O relato de defeito permanece aberto até E2-ACE-08. Rótulo correto por si não demonstra correção da jornada. Aceite humano deve identificar o escopo efetivamente percorrido.

**Retomada:** comparar branch/checkout, alterações locais e não rastreados; calcular fingerprint dos arquivos afetados. Esta rodada é remota e documental. Próxima ação: implementation-workflow E2-01. Sem bloqueio funcional identificado; contratos e estados exatos são fechados no desenho técnico inicial.
