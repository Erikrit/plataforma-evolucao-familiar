import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const visual = readFileSync(
  path.join(raiz, "web/src/lib/catalogo-visual-jogos.ts"),
  "utf8",
);
assert.match(visual, /NOMES_CURTOS_JOGOS/);
assert.match(visual, /Memória/);
assert.match(visual, /Sequência/);
assert.match(visual, /Labirintos/);
assert.match(visual, /Histórias/);
assert.match(visual, /primeiraFasePendente/);
assert.match(visual, /jogoComTodasFasesConcluidas/);

const pagina = readFileSync(
  path.join(
    raiz,
    "web/src/app/f/[slug]/pessoas/[pessoaId]/desenvolvimento/biblioteca/jogos/page.tsx",
  ),
  "utf8",
);
assert.match(pagina, /cols=\{4\}/);
assert.match(pagina, /ItemCatalogoJogo|miniaturaJogo/);
assert.match(pagina, /Escolher fase/);
assert.match(pagina, /CabecalhoBiblioteca/);
assert.match(pagina, /TODAS_CATEGORIAS_JOGOS/);
assert.match(pagina, /label: "Todas"/);
assert.match(pagina, /nomeCurtoJogo/);
assert.match(pagina, /primeiraFasePendente/);

const partida = readFileSync(
  path.join(
    raiz,
    "web/src/componentes/desenvolvimento/jogos/partida-jogo.tsx",
  ),
  "utf8",
);
assert.match(partida, /jogoCompletoAposEstaFase/);

const atividades = readFileSync(
  path.join(
    raiz,
    "web/src/componentes/desenvolvimento/biblioteca-atividades.tsx",
  ),
  "utf8",
);
assert.match(atividades, /Select/);
assert.doesNotMatch(atividades, /Chip\.Group/);

const cabecalho = readFileSync(
  path.join(
    raiz,
    "web/src/componentes/desenvolvimento/cabecalho-biblioteca.tsx",
  ),
  "utf8",
);
assert.match(cabecalho, /Biblioteca ·/);
assert.match(cabecalho, /estrelas disponíveis/);

console.log("check-catalogo-visual: UX-03/04/05 ok");
