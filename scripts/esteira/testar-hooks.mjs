#!/usr/bin/env node
/**
 * Testes não destrutivos da política e dos hooks (simulação via stdin).
 * Nenhum comando dos casos é executado.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { avaliarComandoShell, avaliarMcp } from "./politica/politica-proibida.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const resultados = [];
const registrar = (nome, esperado, obtido) =>
  resultados.push({ nome, passou: esperado === obtido, esperado, obtido });

function executar(scriptRel, entrada) {
  return spawnSync(process.execPath, [join(raiz, scriptRel)], {
    input: typeof entrada === "string" ? entrada : JSON.stringify(entrada),
    encoding: "utf8",
    cwd: raiz,
  });
}

// --- Política -------------------------------------------------------------
const shell = {
  deny: [
    "git commit -m x",
    "git -C . commit -m x",
    'git -C "dir com espaco" commit',
    "git -c a=b push",
    "git --no-pager push origin main",
    "git.exe push",
    "git push origin main",
    "git tag v1",
    "git merge develop",
    "git rebase origin/develop",
    "git restore .",
    "git checkout -- .",
    "git checkout .",
    "git checkout HEAD -- src",
    "git checkout -f develop",
    "git switch --discard-changes develop",
    "git stash drop",
    "git stash clear",
    "git reset --hard HEAD~1",
    "git clean -fd",
    "git cherry-pick abc",
    "git revert HEAD",
    "git am x.patch",
    "git reset --keep HEAD~1",
    "git checkout HEAD src/a.ts",
    "git -C . checkout -q develop src/a.ts",
    "docker volume rm x",
    "docker volume prune -f",
    "docker system prune --volumes",
    "git clean --force",
    "git branch -D x",
    "npm run lint && git commit -am x",
    "gh pr create --title t --body b",
    "gh pr merge 1",
    "gh -R dono/repo pr create",
    "gh pr -R dono/repo merge 1",
    "gh issue create --title t",
    "gh pr new",
    "gh issue new -t x",
    "gh release new v1",
    "gh project item-add 1",
    "gh cache delete --all",
    "gh release create v1",
    "gh workflow run x.yml",
    "gh api -X POST /repos/o/r/issues",
    "gh api --method=DELETE /repos/o/r",
    "gh api repos/o/r/issues -f title=x",
    "npm publish",
    "vercel deploy --prod",
    "docker push img",
    "docker compose down -v",
    "docker-compose down --volumes",
    "npm run db:reset",
    "node scripts/reset-db-local.mjs",
    "npx prisma migrate reset",
    "npx prisma db push --force-reset",
    "git clean \\\n  -fd",
    "git clean `\n  -fd",
    "git branch \\\r\n  -D x",
    "docker compose down \\\n  -v",
    "npx vercel \\\n  --prod",
    "gh api repos/o/r/issues \\\n  -f title=x",
    'gh api "repos/o/r/issues?a=1&b=2" -X DELETE',
    "git checkout 'a;b' -f",
    'sh -c "git push; echo ok"',
  ],
  allow: [
    "git status --short",
    "git log --grep=x",
    "git diff --name-only HEAD",
    "git merge-base HEAD origin/develop",
    "git --no-pager log -3",
    "git switch -c chore/x",
    "git checkout develop",
    "git checkout -b nova origin/develop",
    "git checkout develop 2>&1",
    "git checkout develop && npm run lint",
    "git checkout develop\nnpm run lint",
    "git rev-list HEAD",
    "git reset --soft HEAD",
    "docker volume ls",
    "git stash list",
    "gh pr view 1",
    "gh pr list --search create",
    "gh issue list",
    "gh project item-list 1",
    "gh cache list",
    "gh api repos/o/r/pulls",
    'gh api "repos/o/r/pulls?a=1&b=2"',
    "npm run lint \\\n  -- --fix",
    "gh api -X GET search/issues -f q=x",
    "docker compose up -d",
    "docker compose down",
    "npm run typecheck",
    "npx prisma migrate deploy",
  ],
};
for (const [esperado, comandos] of Object.entries(shell)) {
  for (const c of comandos) {
    registrar(`política shell: ${c}`, esperado, avaliarComandoShell(c).permitido ? "allow" : "deny");
  }
}

const mcp = {
  deny: [
    ["mcp__github__create_pull_request", {}],
    ["mcp__github__merge_pull_request", {}],
    ["mcp__github__push_files", {}],
    ["mcp__github__createRelease", {}],
    ["MCP:create_pull_request", {}],
    ["mcp__vercel__deploy_to_vercel", {}],
    ["mcp__shell__run", { command: "git -C . push" }],
    ["mcp__shell__run", { command: ["git", "push"] }],
    ["mcp__shell__run", { calls: [{ command: "git push" }] }],
    ["mcp__x__generic", { action: "deploy" }],
    ["mcp__github__create_deployment", {}],
    ["mcp__x__redeploy", {}],
    ["mcp__x__trigger_deployments", {}],
    ["mcp__x__unpublish", {}],
    ["mcp__github__create_or_update_file", {}],
    ["mcp__github__delete_file", {}],
    ["create_or_update_file", {}],
    ["mcp__github__delete_release", {}],
    ["mcp__github__issue_write", {}],
    ["mcp__github__add_reply_to_pull_request_comment", {}],
    ["mcp__github__resolve_review_thread", {}],
    ["mcp__github__assign_copilot_to_issue", {}],
    ["mcp__github__request_copilot_review", {}],
    ["mcp__github__add_issue_comment", {}],
    ["mcp__github__pull_request_review_write", {}],
  ],
  allow: [
    ["get_repository", {}],
    ["mcp__github__list_commits", {}],
    ["mcp__github__get_commit", {}],
    ["mcp__github__issue_read", {}],
    ["mcp__github__list_issues", {}],
    ["mcp__github__get_file_contents", {}],
    ["mcp__drive__create_file", {}],
    ["mcp__github__list_deployments", {}],
    ["mcp__github__pull_request_read", { method: "get" }],
    ["mcp__docs__update", { text: "commitment; push notification" }],
    ["mcp__x__read", { q: "push" }],
  ],
};
for (const [esperado, chamadas] of Object.entries(mcp)) {
  for (const [toolName, toolInput] of chamadas) {
    registrar(
      `política MCP: ${toolName} ${JSON.stringify(toolInput)}`,
      esperado,
      avaliarMcp({ toolName, toolInput }).permitido ? "allow" : "deny",
    );
  }
}

// --- Cursor: JSON {permission} em stdout ------------------------------------
if (existsSync(join(raiz, ".cursor/hooks"))) {
  const casos = [
    ["bloquear-shell", { command: "git status --short" }, "allow"],
    ["bloquear-shell", { command: "git commit -m 'x'" }, "deny"],
    ["bloquear-shell", "{inválido", "deny"],
    ["bloquear-pretool", { tool_name: "Shell", tool_input: { command: "git commit -am x" } }, "deny"],
    ["bloquear-pretool", { tool_name: "Shell", tool_input: { command: "npm run lint" } }, "allow"],
    ["bloquear-pretool", "{inválido", "deny"],
    ["bloquear-mcp", { tool_name: "get_repository", tool_input: {} }, "allow"],
    ["bloquear-mcp", { tool_name: "create_pull_request", tool_input: { title: "x" } }, "deny"],
    ["bloquear-mcp", "{inválido", "deny"],
  ];
  for (const [hook, entrada, esperado] of casos) {
    const r = executar(`.cursor/hooks/${hook}.mjs`, entrada);
    let obtido;
    try {
      obtido = r.status === 0 ? JSON.parse(r.stdout).permission : `exit ${r.status}`;
    } catch {
      obtido = "saída ilegível";
    }
    registrar(`Cursor ${hook}: ${JSON.stringify(entrada)}`, esperado, obtido);
  }
}

// --- Claude Code e Codex: exit 2 bloqueia ------------------------------------
const casosExit = [
  [{ tool_name: "Bash", tool_input: { command: "git commit -m x" } }, 2],
  [{ tool_name: "PowerShell", tool_input: { command: "git commit -m x" } }, 2],
  [{ tool_name: "Bash", tool_input: { command: "npm run typecheck" } }, 0],
  [{ tool_name: "Read", tool_input: { file_path: "x" } }, 0],
  [{ tool_name: "mcp__github__create_pull_request", tool_input: {} }, 2],
  [{ tool_name: "mcp__github__list_commits", tool_input: {} }, 0],
  ["{inválido", 2],
  ["", 2],
  ["null", 2],
];
for (const hook of [".claude/hooks/bloquear-ferramenta.mjs", ".codex/hooks/bloquear-pretool.mjs"]) {
  if (hook.startsWith(".codex") && !existsSync(join(raiz, hook))) continue;
  for (const [entrada, esperado] of casosExit) {
    const r = executar(hook, entrada);
    registrar(`${hook}: ${JSON.stringify(entrada)}`, esperado, r.status);
    if (esperado === 2) {
      registrar(`${hook}: motivo em stderr para ${JSON.stringify(entrada)}`, true, r.stderr.length > 0);
    }
  }
}

const sessao = executar(".claude/hooks/contexto-sessao.mjs", { hook_event_name: "SessionStart" });
registrar("contexto-sessao: exit 0", 0, sessao.status);
registrar("contexto-sessao: até 15 linhas", true, sessao.stdout.trim().split("\n").length <= 15);

const falhas = resultados.filter((r) => !r.passou);
console.log(
  JSON.stringify(
    {
      ok: falhas.length === 0,
      total: resultados.length,
      falhas: falhas.length,
      detalhesFalhas: falhas,
      limitacao: "Bloqueio por heurística textual; ofuscação ou indireção pode contornar.",
    },
    null,
    2,
  ),
);
process.exit(falhas.length === 0 ? 0 : 1);
