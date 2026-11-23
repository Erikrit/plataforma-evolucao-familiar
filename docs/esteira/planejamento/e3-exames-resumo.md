# E3 — Exames e Resumo por área

**Demanda:** DEM-E3-EXAMES-RESUMO-20261122  
**Tipo:** transversal · **Risco:** alto (documentos de saúde, crianças, autorização/PDF).  
**Aprovação funcional:** Produto em 2026-11-22, Módulo 02 v1.7 §10 e Módulo 04 v1.2 §12.  
**Estado:** COMPLETED técnico em 2026-11-22; E3-HOM PENDING_HUMAN. Download externo sem viewer.  
**Base:** develop @ 8a517523319a76740f21ad51da5a6e02cb29f6c1 (implementação local sem commit).

## Fontes e evidência inicial

O detalhe atual em app/f/[slug]/pessoas/[pessoaId]/cuidados/consultas/page.tsx informa presença de documento; não oferece ação de abertura no trecho inspecionado. Anexos possuem caminho privado existente. Resumo/Histórico/PDF pertencem ao Módulo 04, com dados derivados e autorização por operação. Inspeção estática; não é teste da aplicação.

Fontes: especificações acima; ADR-004/006/009/010/014; arquitetura vigente; GUIA-DE-EXPERIENCIA.md; desenho E3 em PROPOSTA-EVOLUCAO-POS-V1.md §11.

## Incrementos verticais

| ID | Aceite/requisitos | Escopo e arquivos previstos | Gate |
|---|---|---|---|
| E3-00 | E3-UX-00 | Desenho aprovado: detalhe com Baixar arquivo, Resumo por área e prévia/PDF; sem visualizador embutido | COMPLETED (desenho) |
| E3-01 | E3-EX-01..05 | Download pelo detalhe e tratamento de falhas; página Consultas e exames, lib/api.ts; sem componente viewer | COMPLETED técnico |
| E3-02 | E3-RES-01..04 | Resumo único com blocos por área/período, fontes e vazios; página resumo + servico-acompanhamento.ts | COMPLETED técnico |
| E3-03 | E3-RES-05 e E3-HOM; regressão completa | Prévia/PDF consistente, testes de isolamento, roteiro móvel/desktop e evidências próprias | COMPLETED técnico; E3-HOM PENDING_HUMAN |

## Arquitetura e contratos a conferir

- Inspecionar transporte privado de bytes/base64 e permissão existente para oferecer download autenticado, sem exigir S3 ou migração de armazenamento.
- Preservar nome e MIME do arquivo, usando resposta de download apropriada, sem executar conteúdo ativo na plataforma.
- Não introduzir biblioteca de visualização, zoom ou paginação. A abertura é feita pelo aplicativo/navegador do dispositivo.
- Liberar URLs temporárias em memória quando usadas para download; não persistir documentos no localStorage nem conteúdo clínico em logs.
- Resolução de anexo sempre pelo servidor e relação com pessoa/família; família igual não substitui autorização clínica.
- Derivar resumo dos registros oficiais. Reutilizar contratos de cada área e não criar feed/eventos paralelo.
- Preservar vigências de medicamentos e correções. Datas desconhecidas não são substituídas por datas artificiais.
- Não unificar tipos de PDF por conveniência técnica. Manter seleção autorizada e paridade com prévia, sem anexos completos.
- Projetar estados de troca de pessoa/período e revogação para não manter conteúdo sensível anterior na tela.

## Validação

Testar download íntegro de PDF/imagem com nome/formato corretos, contexto preservado, sem arquivo, arquivo indisponível, falha de rede e sessão revogada. Abertura externa é jornada humana, não função de visualizador interno. Verificar acesso próprio, responsável, integrante e administrador sem capacidade clínica, em duas famílias fictícias.

Resumo: cuidados, desenvolvimento, ambas as áreas, período vazio, categorias ausentes e correções. Testar totais e PDF por tipo/período com os mesmos gates do detalhe.

Não reutilizar PASS de E1/E2 como prova desta alteração. Antes de editar, reconciliar checkout, branch, alterações locais/não rastreados e fingerprint real. Esta rodada é documental remota.

**Bloqueios:** nenhum. **Próxima ação:** homologação humana E3-HOM. Fora: visualizador embutido, IA, OCR, interpretação clínica, campos extras obrigatórios, nova permissão e publicação.
