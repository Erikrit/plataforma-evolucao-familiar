#!/usr/bin/env bash
# Sincroniza a develop com a documentação da LAN-PREPARACAO (commit d1a7cef) e verifica.
# Uso, na raiz do repositório: bash verificar-preparacao-lancamento.sh
# Não faz commit, push, merge nem deploy.
set -euo pipefail

COMMIT_DOC="d1a7cef309ad7e29716a90cc2194abe876f04bb0"

[ -f esteira.config.json ] || { echo "Rode na raiz do repositório."; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "Há alterações locais; guarde-as antes."; exit 1; }

git fetch origin develop
git switch develop
git merge --ff-only origin/develop
git merge-base --is-ancestor "$COMMIT_DOC" HEAD || { echo "develop não contém $COMMIT_DOC"; exit 1; }

echo "== Verificações =="
node scripts/esteira/validar-esteira.mjs
for f in spec 01-apresentacao-primeiro-acesso 02-enviar-sugestao-plataforma \
         03-operacao-ler-sugestoes 04-revisao-seguranca 05-homologacao; do
  test -f "docs/esteira/tickets/preparacao-lancamento/$f.md" || { echo "faltando: $f.md"; exit 1; }
done
grep -q "## 17. Preparação para o lançamento" docs/modulos/01-fundacao-familiar/ESPECIFICACAO.md
grep -q "## ADR-019" docs/arquitetura/DECISOES.md
grep -q "LAN-PREPARACAO" docs/produto/STATUS-E-ESCOPO.md
node -e 'const s=require("./docs/esteira/estado/atual.json"); console.log("Demanda ativa:", s.demanda?.id, "|", s.demanda?.estado, "|", s.demanda?.proximaAcao)'

cat <<'TXT'

OK. Ordem no Claude Code (cada linha em sessão nova):

  1. Fechar o Marco 1 (demanda ativa):
     /implementar docs/esteira/tickets/catalogo-marco1-conteudo/11-barquinho-no-rio.md
     /implementar docs/esteira/tickets/catalogo-marco1-conteudo/13-refatoracao-geral.md
     /homologar DEV-CAT-M1-CONTEUDO

  2. Depois, a preparação para o lançamento:
     /implementar docs/esteira/tickets/preparacao-lancamento/01-apresentacao-primeiro-acesso.md
     /implementar docs/esteira/tickets/preparacao-lancamento/02-enviar-sugestao-plataforma.md
     /implementar docs/esteira/tickets/preparacao-lancamento/03-operacao-ler-sugestoes.md
     /implementar docs/esteira/tickets/preparacao-lancamento/04-revisao-seguranca.md
     /homologar LAN-PREPARACAO

  Verificação local em cada ticket que toque a API (BASE = develop no início do ticket 01):
     bash scripts/verificar-local.sh LAN-PREPARACAO <BASE> qg1 qg2
TXT
