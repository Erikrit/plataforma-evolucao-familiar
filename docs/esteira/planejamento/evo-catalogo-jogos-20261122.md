# EVO-CATALOGO-JOGOS-20261122 — Arquitetura extensível do catálogo digital

**Status:** PLANEJAMENTO CONSOLIDADO · **Aprovação:** L3 Produto **PENDENTE** (`NEEDS_DECISION`)  
**Demanda:** `EVO-CATALOGO-JOGOS-20261122`  
**Checkout de referência:** `develop` @ `5e23c7a` (= `origin/develop`)  
**Não implementar** código de produto até aprovação explícita do responsável pelo Produto.

Fontes cruzadas: [Módulo 03 §13](../../modulos/03-desenvolvimento-laurinha/ESPECIFICACAO.md#13-e5--jogos-digitais-na-biblioteca-de-desenvolvimento) · [plano E5](e5-jogos-digitais.md) · [expansão E4/E5](expansao-catalogos-e4-e5.md) · [GOVERNANCA](../../produto/GOVERNANCA.md) · [ARQUITETURA](../../arquitetura/ARQUITETURA.md) · ADR-006/013/014/015.

## 1. Objetivo

Planejar arquitetura extensível para o catálogo digital da Plataforma de Evolução Familiar, permitindo ampliar jogos, categorias, dificuldades e recursos visuais sem reconstruir a plataforma nem perder o progresso existente.

## 2. Triagem

| Campo | Valor |
|---|---|
| tipo | `transversal` |
| origem | Pedido humano de planejamento arquitetural |
| aprovação | L3 Produto — **PENDENTE** |
| risco | alto (dados infantis, progresso, autorização contextual) |
| fluxo | `task-routing` → `module-planning` → **parar em NEEDS_DECISION** até L3 |

**Fora desta etapa:** novos jogos, motor gráfico pesado, object storage, novas permissões, alteração de autenticação, estrelas digitais, rankings, avaliações cognitivas, commit/push/deploy automático.

**Política de dados:** o Documento Mestre §13 dispensa preservação de cadastros pré-uso; **esta demanda reforça** preservação de `ProgressoFaseJogo` e dos IDs dos jogos — migração **aditiva**, sem reset destrutivo do progresso digital.

## 3. Baseline

| Peça | Situação em `5e23c7a` |
|---|---|
| Regras E5 | Módulo 03 v1.4 §13; E5-ACE-01..12; homologação UX R2 APROVADA |
| Catálogo | Em código: `apps/api/src/desenvolvimento/jogos/catalogo-jogos.ts` |
| IDs estáveis | `memoria`, `sequencia`, `labirinto` (5 fases cada) |
| Progresso | `ProgressoFaseJogo` / `progresso_fase_jogo` — PK `(familiaId, pessoaId, jogoId, fase)` |
| Authz | `podeVerDesenvolvimento` (ADR-006 / ADR-014); sem permissão nova |
| Estrelas | Somente atividades reais (DEV-F05); descoberta digital = E5-F06 |
| Categorias | `CATEGORIAS_BIBLIOTECA` em `constantes-desenvolvimento.ts` |

## 4. Arquitetura (4 camadas)

```
Biblioteca / Partida (web)
        │
        ├──────────────► Catálogo editorial (PostgreSQL)
        │                      JogoDigital · FaseJogoDigital · RecursoVisualJogo
        │
        ├──────────────► Progresso privado (PostgreSQL)
        │                      ProgressoFaseJogo (PK inalterada)
        │
ServicoJogos (API) ───► Motores em código (registro por motorId)
        │                      validarConfiguracao + montarConteudo
        │
Partida (web) ────────► Renderizadores em código (registro por renderizadorId)
                               tabuleiro-* com tema PEF
```

| Camada | Onde | Responsabilidade | Não faz |
|---|---|---|---|
| Catálogo editorial | PostgreSQL (novo) | Metadados, fases, versão, publicação, faixa orientativa, refs visuais | Executar lógica de jogo |
| Motor | Código API | Validar config declarativa e montar conteúdo da partida | Persistir UI; carregar código de terceiros do banco |
| Renderizador | Código web | Desenhar tabuleiro com tema da plataforma | Decidir conclusão sem confirmação do servidor |
| Progresso | `ProgressoFaseJogo` | Exploração, conclusão, versões históricas | Estrelas, ranking, telemetria cognitiva |

### Invariantes

1. Sem código executável de terceiros no banco — apenas JSON/config validado pelo motor versionado no repositório.
2. `jogoId` estável = PK editorial = chave em `ProgressoFaseJogo.jogoId` (preservar os três IDs atuais).
3. Autorização contextual reutilizada; sem novas permissões e sem mudança de autenticação.
4. Estrelas permanecem nas atividades reais; jogos digitais não geram estrelas.
5. Faixa etária é orientativa (como E4); não bloqueia nem diagnostica.
6. Tema visual PEF na biblioteca e navegação; recursos gráficos externos só como referência nesta etapa.
7. Meta de curadoria ≈ 20 experiências publicadas por categoria, em lotes progressivos — não gerar massa automática nesta demanda.

## 5. Modelo Prisma proposto (aditivo)

Espelha o padrão editorial de `Desafio` (E4), separado do progresso privado.

```prisma
model JogoDigital {
  id               String   @id
  nome             String
  descricao        String
  categoria        String
  instrucoes       String
  motorId          String   @map("motor_id")
  renderizadorId   String   @map("renderizador_id")
  versao           Int      @default(1)
  faixaEtariaMin   Int?     @map("faixa_etaria_min")
  faixaEtariaMax   Int?     @map("faixa_etaria_max")
  origemConteudo   String?  @map("origem_conteudo")
  ativo            Boolean  @default(true)
  publicadoEm      DateTime? @map("publicado_em")
  ordemEditorial   Int      @default(0) @map("ordem_editorial")
  capaRef          String?  @map("capa_ref")
  criadoEm         DateTime @default(now()) @map("criado_em")
  atualizadoEm     DateTime @updatedAt @map("atualizado_em")
  fases            FaseJogoDigital[]

  @@index([ativo, categoria])
  @@map("jogo_digital")
}

model FaseJogoDigital {
  jogoId           String   @map("jogo_id")
  numero           Int
  titulo           String
  objetivo         String
  dificuldade      String
  configuracao     Json
  versao           Int      @default(1)
  jogo             JogoDigital @relation(fields: [jogoId], references: [id])

  @@id([jogoId, numero])
  @@map("fase_jogo_digital")
}

model RecursoVisualJogo {
  id          String   @id @default(cuid())
  jogoId      String?  @map("jogo_id")
  chave       String
  tipo        String
  referencia  String
  licenca     String?
  ativo       Boolean  @default(true)

  @@unique([jogoId, chave])
  @@map("recurso_visual_jogo")
}
```

**`ProgressoFaseJogo`:** sem alteração da chave composta. Snapshots `nomeNaConclusao`, `categoriaNaConclusao` e campos `versao*` protegem Histórico/Resumo após republicação editorial.

**`configuracao`:** dados declarativos do motor (conjuntos, padrões, mapas). Rejeitado se inválido. Nunca armazena scripts ou binários executáveis.

**`capaRef` / `RecursoVisualJogo.referencia`:** URI, path ou chave lógica externa. Object storage e upload de blobs ficam fora desta etapa.

## 6. Contratos de motor e renderizador

Registro em código (não no banco):

```ts
type MotorJogo = {
  id: string;
  validarConfiguracao(config: unknown): void;
  montarConteudo(config: unknown, sortear: (limite: number) => number): unknown;
};

type RenderizadorJogo = {
  id: string;
  Componente: React.FC<PropsPartida>;
};
```

- Motores iniciais: `memoria`, `sequencia`, `labirinto` (extraídos da lógica atual de `montarConteudoFase`).
- Renderizadores iniciais: componentes `tabuleiro-memoria`, `tabuleiro-sequencia`, `tabuleiro-labirinto`.
- `POST .../iniciar` passa a devolver `{ versao, motorId, renderizadorId, conteudo }`.
- Cliente desconhecido de `renderizadorId` → mensagem neutra + saída, sem crash.
- Conclusão: idempotência vigente (`chave` + `versao`) em `ServicoJogos`.
- Novo motor/renderizador futuro = novo código + ids no editorial; progresso permanece por `jogoId`/`fase`.

## 7. Compatibilidade — três jogos atuais

| jogoId | motorId | renderizadorId | fases | Progresso |
|---|---|---|---|---|
| `memoria` | `memoria` | `memoria` | 1–5 | linhas existentes intactas |
| `sequencia` | `sequencia` | `sequencia` | 1–5 | idem |
| `labirinto` | `labirinto` | `labirinto` | 1–5 | idem |

**Migração aditiva:** seed copia `CATALOGO_JOGOS` para `JogoDigital` + `FaseJogoDigital` (`configuracao` = conjuntos/padrões/mapas atuais). Em CAT-02, `ServicoJogos` lê o PostgreSQL; fallback em código, se usado, é temporário e removido ao fechar CAT-02. Destaques, Histórico e Resumo continuam resolvendo por `jogoId`.

## 8. Incrementos CAT-01 .. CAT-05 (após L3)

| ID | Entrega | Aceite | Testes / QG | Alvos previstos |
|---|---|---|---|---|
| **CAT-01** | Schema Prisma + seed dos 3 jogos; comportamento observável inalterado | IDs/fases iguais; progresso pré-existente legível | typecheck API; smoke seed; query progresso | `schema.prisma`, migration, seed |
| **CAT-02** | `ServicoJogos` + registro de motores; API devolve motor/renderizador | E5-ACE-01..07, 09, 12; authz inalterada | `check:e5`, `smoke:e5`, `smoke:authz` | `servico-jogos.ts`, motores, controlador |
| **CAT-03** | Metadados na biblioteca (faixa, dificuldade por fase, ativo); `capaRef` sem storage | Filtros/tema PEF; inativo some do catálogo sem apagar progresso | typecheck web; smoke listagem; UX móvel | biblioteca jogos, `api.ts` |
| **CAT-04** | Pipeline editorial (rascunho→publicado, versão); capacidade ≈20/categoria **sem** criar jogos novos | Republicar não apaga progresso; JSON sem código | testes versão/conflito; script curadoria | seeds/scripts, validadores |
| **CAT-05** | QG-3 + atualização canônica (Módulo 03 / STATUS / ADR proposta) | E5-ACE + CAT-ACE; homologação humana `PENDING_HUMAN` | builds; smokes E4/E5/authz; verifier | docs + evidências |

### Critérios de aceite do planejamento

| ID | Critério |
|---|---|
| CAT-ACE-01 | Separação das 4 camadas documentada e refletida no modelo. |
| CAT-ACE-02 | Migração aditiva dos 3 jogos com IDs estáveis. |
| CAT-ACE-03 | Contratos motor/renderizador extensíveis sem quebrar progresso. |
| CAT-ACE-04 | Sem estrelas digitais, ranking, avaliação cognitiva, permissões novas ou auth alterada. |
| CAT-ACE-05 | Meta ≈20/categoria e refs gráficas externas previstas; object storage e jogos novos fora desta etapa. |
| CAT-HOM | Homologação humana somente após implementação aprovada (não nesta etapa). |

### Riscos e dependências

- **Alto:** conteúdo infantil; privacidade e autorização por pessoa.
- **Médio:** JSON de fase inválido; cliente sem renderizador para `renderizadorId` novo.
- **Dependências:** E5 homologada (R2), ADR-006/013/014/015, taxonomia `CATEGORIAS_BIBLIOTECA`, monólito modular.
- **Bloqueio atual:** aprovação L3 antes de qualquer incremento CAT-*.

## 9. Relação com expansão E4/E5

A frente de **atividades reais** (tetos além de 24, sugestões/renovação) permanece em [expansao-catalogos-e4-e5.md](expansao-catalogos-e4-e5.md).  
A frente **digital / arquitetura de catálogo de jogos** é deste documento (`EVO-CATALOGO-JOGOS-20261122`). A meta ≈20 por categoria digital e a persistência editorial digital deferem a este plano.

## 10. Encaminhamento

1. Produto aprova, ajusta ou rejeita esta especificação (L3).
2. Se aprovada: atualizar fonte canônica (trecho pertinente do Módulo 03 e/ou ADR) e abrir CAT-01 via `implementation-workflow`.
3. Sem aprovação: permanecer `NEEDS_DECISION`; não implementar.

**Próxima ação humana:** decisão L3 do responsável pelo Produto.
