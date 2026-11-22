# E3 — Exames e Resumo por área

**Demanda:** DEM-E3-EXAMES-RESUMO-20261122  
**Tipo:** transversal · **Risco:** alto (documentos de saúde, crianças, autorização/PDF).  
**Aprovação funcional:** Produto em 2026-11-22, Módulo 02 v1.6 §10 e Módulo 04 v1.2 §12.  
**Estado:** PENDING para implementação; validação do desenho E3-UX-00 antes de código.  
**Base inspecionada:** develop @ 133eec53089fc9cbd98bfd1dfd4f1987af783f2a.

## Fontes e evidência inicial

O detalhe atual em app/f/[slug]/pessoas/[pessoaId]/cuidados/consultas/page.tsx informa presença de documento; não oferece ação de abertura no trecho inspecionado. Anexos possuem caminho privado existente. Resumo/Histórico/PDF pertencem ao Módulo 04, com dados derivados e autorização por operação. Inspeção estática; não é teste da aplicação.

Fontes: especificações acima; ADR-004/006/009/010/014; arquitetura vigente; GUIA-DE-EXPERIENCIA.md; desenho E3 em PROPOSTA-EVOLUCAO-POS-V1.md §11.

## Incrementos verticais

| ID | Aceite/requisitos | Escopo e arquivos previstos | Gate |
|---|---|---|---|
| E3-00 | E3-UX-00 | Validar detalhe, visualizador, Resumo e estados do desenho de baixa fidelidade; registrar resultado antes de código | Validação de UX pelo responsável |
| E3-01 | E3-EX-01..05 | Abrir/baixar documento pelo detalhe, viewer acessível e tratamento de falhas; página Consultas e exames, componente reutilizável de visualização, lib/api.ts, anexos/serviço/controlador conforme necessidade | QG-1, verifier, QG-2 |
| E3-02 | E3-RES-01..04 | Resumo único com blocos por área/período, fontes e vazios; página resumo, lib/api.ts e servico-acompanhamento.ts conforme necessidade | QG-1, verifier, QG-2 |
| E3-03 | E3-RES-05 e E3-HOM; regressão completa | Prévia/PDF consistente, testes de isolamento, roteiro móvel/desktop e evidências próprias | QG-1, verifier, QG-2/3 e PENDING_HUMAN |

## Arquitetura e contratos a conferir

- Inspecionar transporte de bytes/base64 e permissão de leitura/download existente antes de escolher viewer. Não supor URL S3/assinada nem exigir migração de armazenamento.
- Conferir formatos efetivamente suportados e limites de upload; permitir somente prévia segura de PDF/imagens aceitos, sem executar HTML/SVG ativo. Falha de visualização deve ser explícita.
- Avaliar componente mínimo, licença/dependências, suporte móvel/teclado/zoom e fallback. Não fixar tecnologia sem esse levantamento.
- Revogar URLs temporárias em memória ao fechar/mudar pessoa; não persistir documentos privados no localStorage nem incluir laudos em logs.
- Resolução de anexo sempre pelo servidor e relação com pessoa/família; família igual não substitui autorização clínica.
- Derivar resumo dos registros oficiais. Reutilizar contratos de cada área e não criar feed/eventos paralelo.
- Preservar vigências de medicamentos e correções. Datas desconhecidas não são substituídas por datas artificiais.
- Não unificar tipos de PDF por conveniência técnica. Manter seleção autorizada e paridade com prévia, sem anexos completos.
- Projetar estados de troca de pessoa/período e revogação para não manter conteúdo sensível anterior na tela.

## Validação

Testar PDF multipágina e imagem, zoom/retorno, download autorizado, sem arquivo, tipo não suportado/inválido, falha de rede e sessão revogada. Verificar acesso próprio, responsável, integrante e administrador sem capacidade clínica, em duas famílias fictícias.

Resumo: cuidados, desenvolvimento, ambas as áreas, período vazio, categorias ausentes e correções. Testar totais e PDF por tipo/período com os mesmos gates do detalhe.

Não reutilizar PASS de E1/E2 como prova desta alteração. Antes de editar, reconciliar checkout, branch, alterações locais/não rastreados e fingerprint real. Esta rodada é documental remota.

**Bloqueio atual:** E3-UX-00 aguardando validação do desenho. **Próxima ação:** validar o desenho em UX §11; após aceite, marcar E3-01 READY e executar implementation-workflow. Fora: IA, OCR, interpretação clínica, campos extras obrigatórios, nova permissão e publicação.
