# Como usar a esteira

Comece por `/esteira` com a demanda em uma frase. Ela lê o estado, classifica e recomenda o próximo passo; você decide.

## Fluxos

| Demanda | Caminho |
|---|---|
| Correção com causa conhecida | `/esteira` → `/implementar` → `/homologar` se houver validação humana |
| Correção com causa desconhecida | `/esteira` → `/implementar` (usa `diagnosticar`) → `/homologar` se for o caso |
| Melhoria aprovada e delimitada | `/esteira` → `/implementar` |
| Nova funcionalidade ou módulo | `/esteira` → `/sabatina` → `/planejar` → `/implementar` por ticket → QG-3 |
| Refatoração | `/melhorar-arquitetura` → `/planejar` → `/implementar` |
| Só validar | `/esteira` → `/homologar` |
| Fim de sessão | `/passagem` e, se houve tropeço, `/retro` |
| Outro repositório | `exportar-kit.mjs` → `/configurar-esteira` |

Da sabatina aos tickets, fique na mesma sessão. Cada ticket começa em sessão nova.

## O que você decide

- Respostas da sabatina, costuras e divisão em tickets.
- Aprovação L3, termos do glossário e ADRs, que nascem como `PROPOSTA`.
- Homologação humana: `PENDING_HUMAN` só muda com o seu retorno.
- Commit, push, PR, merge e deploy, usando a `mensagemCommit` entregue.

## Comandos

```bash
npm run esteira:qg -- --perfil qg1 --demanda <id>              # executa as checagens
npm run esteira:qg -- --verificar-fingerprint --demanda <id>   # evidência ainda vale?
npm run esteira:validar       # skills, adaptador, espelhos e estado
npm run esteira:sincronizar   # regenera os espelhos de Codex e Cursor
npm run esteira:testar        # hooks, QG e validador
bash scripts/verificar-local.sh <id> <base> [qg1 qg2 qg3]  # sobe banco e API locais e roda os portões
```

| Resultado | O que fazer |
|---|---|
| `FAIL` | Ver a saída no JSON de evidência e corrigir a causa |
| `BLOCKED` | Suprir o requisito citado (Docker, API local, banco local) e repetir; `verificar-local.sh` prepara os três |
| `NOT_APPLICABLE` | Nada; o motivo está registrado |
| Fingerprint divergente | Repetir os perfis listados |

Smokes gravam no banco local. Dentro do QG, só rodam se API e banco forem locais.

## Editar a esteira

1. Skills e subagentes: só em `.claude/`. Os espelhos são gerados.
2. O que é deste projeto: `docs/agents/*.md` e `esteira.config.json`.
3. `npm run esteira:sincronizar && npm run esteira:validar && npm run esteira:testar`.

Operação bloqueada pelo hook: execute você mesmo no terminal, se for o caso. Um comando que apenas cita a operação também é bloqueado.

## Levar para outro repositório

```bash
node scripts/esteira/exportar-kit.mjs <caminho-do-repositorio>
```

Depois, no destino, `/configurar-esteira`. O kit leva `.claude-plugin/plugin.json`, para virar plugin no futuro.
