# qavajs-skill

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Skill spec compliant](https://img.shields.io/badge/skill--spec-compliant-green)](#compliance-with-the-skill-spec)
[![qavajs](https://img.shields.io/badge/qavajs-2.x-orange)](https://qavajs.github.io)

An installable, **skill-spec compliant** Claude / Cursor / Windsurf skill bundle that teaches your AI assistant the [qavajs](https://qavajs.github.io) BDD test-automation framework — plus a sibling `browser-verify` skill for low-level CDP grounding and a `playwright-cli` skill that documents Microsoft's snapshot/ref-based Playwright CLI.

> qavajs is CucumberJS plus a memory layer, validation library, page-object DSL, fixtures, templates, and pre-built step packages for Playwright, WebdriverIO, REST/GraphQL/WebSocket, mobile (Appium) and Electron.

The bundle ships:

- **`skills/qavajs/`** — the qavajs skill: ~270 literal Gherkin step patterns, the complete `config.ts` schema, every CLI flag, the locator DSL with hierarchy and templates, composition primitives (`executeStep`, `executeTest`, `Template`, `Override`, `Fixture`, `BeforeExecution`/`AfterExecution`), and runner-specific guides for each backend — all under 500 lines in the activated body, with the heavy reference material in `references/` loaded on demand. (MIT)
- **`skills/browser-verify/`** — testing-grade Chrome automation via the DevTools Protocol: arbitrary JS evaluation in page context, cookie / localStorage inspection, computed-style queries, network timing, real CDP `Input`-domain mouse and keyboard events. Zero npm dependencies (Node 22's built-in WebSocket). Sourced from [bermudas/toscacloud_cli](https://github.com/bermudas/toscacloud_cli) under Apache-2.0.
- **`skills/playwright-cli/`** — reference for Microsoft's [`@playwright/cli`](https://www.npmjs.com/package/@playwright/cli) (a snapshot/ref-based browser CLI distinct from `@playwright/test`): `playwright-cli open|click|fill|snapshot|eval|tracing-start|video-start|state-save|route|run-code`, named-session management, `--debug=cli` attach to paused tests, and 9 deep-dive references for tracing / video / mocking / storage / sessions / element-attributes. Sourced from [qavajs/demo](https://github.com/qavajs/demo) under MIT.
- **`.github/agents/qavajs.agent.md`** — a GitHub Copilot agent persona that consumes all three skills.
- **`.mcp.json`** — Model Context Protocol server config (Playwright only) that pairs with this agent.

---

## Quick install

```bash
# Detect IDE, install everything (most common case)
npx github:bermudas/qavajs-skill init

# Pin to a single IDE
npx github:bermudas/qavajs-skill init --target claude
npx github:bermudas/qavajs-skill init --target cursor
npx github:bermudas/qavajs-skill init --target windsurf

# Install into all supported IDE folders
npx github:bermudas/qavajs-skill init --target all

# Refresh an already-installed skill
npx github:bermudas/qavajs-skill init --update

# See what's available without installing
npx github:bermudas/qavajs-skill init --list
```

The installer copies `skills/qavajs/` into one of the IDE's skill folders:

| IDE | Destination |
|---|---|
| Claude Code | `.claude/skills/qavajs/` |
| Cursor      | `.cursor/skills/qavajs/` |
| Windsurf    | `.windsurf/skills/qavajs/` |

After install, your assistant will trigger the skill whenever the conversation touches qavajs — see [Triggering](#triggering) below.

---

## What's in the bundle

```
.
├── .github/agents/qavajs.agent.md  ← GitHub Copilot agent persona
├── .mcp.json                       ← MCP servers for the agent (Playwright only)
├── bin/init.mjs                    ← installer
├── skills.json                     ← registry of bundled skills
└── skills/
    ├── qavajs/                     ← MIT (this repo)
    │   ├── SKILL.md                ← entry-point (~280 lines, description ~1017 chars)
    │   ├── references/             ← 24 prose refs + 11 step catalogs
    │   │   │
    │   │   │   # Core authoring
    │   │   ├── architecture.md     ← config schema + CLI flags + cucumber-js vs standalone
    │   │   ├── memory.md           ← memory layer + parameter resolution
    │   │   ├── validation.md       ← matchers + natural-language phrases + softly
    │   │   ├── page-object.md      ← locator() DSL, hierarchy, templates, locator.native
    │   │   ├── composition.md      ← executeStep, Template, Fixture, BeforeExecution
    │   │   │
    │   │   │   # Runners & domains
    │   │   ├── playwright-runner.md
    │   │   ├── wdio-runner.md
    │   │   ├── api-testing.md      ← REST / GraphQL / WebSocket / SOAP
    │   │   ├── sql-testing.md      ← MySQL / PostgreSQL / custom DBClient
    │   │   ├── file-testing.md     ← waits, validation, PDF/Word/Excel/CSV loaders
    │   │   ├── email-testing.md    ← Gmail API + advanced search + mailparser
    │   │   ├── lighthouse.md       ← perf / SEO / a11y audits
    │   │   ├── visual-testing.md   ← pixelmatch screenshot diffs
    │   │   ├── accessibility.md    ← axe-core AND IBM Equal Access (with conflict warning)
    │   │   ├── cloud-providers.md  ← SauceLabs / BrowserStack / Mobitru / LambdaTest
    │   │   ├── standalone-runners.md ← Cypress / Playwright Test / Playwright+WDIO
    │   │   │
    │   │   │   # Operations
    │   │   ├── parallel.md         ← parallel + sharding + parallel test data
    │   │   ├── typescript.md       ← TS setup, ts-node, ESM
    │   │   ├── vscode.md           ← VS Code extension
    │   │   ├── wdio-adapter.md     ← @wdio/* services (selenium-standalone, appium)
    │   │   ├── cicd.md             ← GitHub Actions / GitLab / Azure / Jenkins
    │   │   ├── formatters.md       ← console / HTML / JUnit / Allure / ReportPortal
    │   │   ├── recipes.md          ← common patterns ready to adapt
    │   │   ├── troubleshooting.md
    │   │   ├── migration-v1-to-v2.md
    │   │   ├── update.md
    │   │   │
    │   │   │   # Agent-driven workflows (v1.2.0)
    │   │   ├── workflow-create-test.md   ← author a scenario (config-aware)
    │   │   ├── workflow-run-test.md      ← run + paste-ready bug-report blocks
    │   │   ├── workflow-fix-test.md      ← symptom → cause → fix decision table
    │   │   │
    │   │   │   # 11 literal Gherkin step catalogs (300 patterns total)
    │   │   ├── steps-memory.md             ← 15
    │   │   ├── steps-playwright.md         ← 107
    │   │   ├── steps-wdio.md               ← 111
    │   │   ├── steps-api.md                ← 33
    │   │   ├── steps-sql.md                ← 8
    │   │   ├── steps-files.md              ← 9
    │   │   ├── steps-gmail.md              ← 4
    │   │   ├── steps-lighthouse.md         ← 3
    │   │   ├── steps-visual-testing.md     ← 2
    │   │   ├── steps-accessibility.md      ← 4   (axe-core)
    │   │   └── steps-accessibility-ea.md   ← 4   (IBM Equal Access)
    │   ├── scripts/
    │   │   └── refresh-catalogs.sh ← shallow-clones all 11 step repos and regenerates catalogs
    │   └── assets/                 ← copy-paste starters: config / feature / page-object / memory / CLAUDE.md
    ├── browser-verify/             ← Apache-2.0 (sourced from bermudas/toscacloud_cli)
    │   ├── SKILL.md                ← entry-point
    │   ├── references/
    │   │   └── cdp-commands.md     ← full CDP command reference
    │   └── scripts/
    │       ├── chrome-launcher.sh  ← start/stop debugged Chrome
    │       └── cdp.mjs             ← 50+ CDP commands; Node 22 only, zero deps
    └── playwright-cli/             ← MIT (sourced from qavajs/demo)
        ├── SKILL.md                ← entry-point with full command surface
        └── references/             ← 9 deep-dive references
            ├── element-attributes.md
            ├── playwright-tests.md   ← run + --debug=cli + attach workflow
            ├── request-mocking.md    ← route patterns + run-code mocking
            ├── running-code.md       ← geolocation, permissions, media emulation
            ├── session-management.md
            ├── storage-state.md      ← state-save/load + cookies + localStorage
            ├── test-generation.md    ← auto-generated Playwright TS code
            ├── tracing.md
            └── video-recording.md
```

Each `SKILL.md` stays under the 500-line spec budget; dense reference material lives in `references/` and loads only when relevant. That keeps the activated context lean.

### Coverage compared to the upstream docs

The 24 prose references and 11 catalogs cover the full surface area of the qavajs 2.x docs site (Commons, Steps, Modules, Guides, StandaloneSolutions) — including all 11 specialised testing domains (web, mobile, API, SQL, files, email, perf, visual, a11y × 2 engines), every CI/CD platform with a worked example, every cloud provider, and a v1→v2 migration table. No `@qavajs/*` package is left undocumented.

---

## GitHub Copilot agent + MCP servers

If your project uses GitHub Copilot's custom agents, this repo includes a ready-to-use persona at `.github/agents/qavajs.agent.md`. It loads the qavajs and browser-verify skills' principles and calls them out by name in its operating doctrine. Drop the file into your own repo's `.github/agents/` folder (or symlink) and Copilot will pick it up.

`.mcp.json` declares the MCP servers the agent expects to have available. Currently that's just one:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

The agent uses the Playwright MCP server for live-browser interactions; for deeper browser introspection (cookies, computed styles, JS evaluation, real CDP input events) it shells out to `browser-verify`'s `cdp.mjs` instead — that path has no MCP dependency.

Drop `.mcp.json` next to `.claude/settings.json` (or wherever your tooling reads it) — Cursor, Claude Code and Copilot all pick it up.

A Claude-Code-flavoured agent persona is on the roadmap and will land in a follow-up release.

---

## Triggering

The skills' `description` fields are tuned to fire on any qavajs-flavoured signal:

- The string `qavajs`, `@qavajs/...`, or any of its packages (`@qavajs/core`, `@qavajs/steps-playwright`, `@qavajs/steps-wdio`, `@qavajs/steps-api`, `@qavajs/memory`, `@qavajs/validation`, `@qavajs/template`, `@qavajs/po-playwright`).
- A `config.ts` whose default export contains `paths`, `require`, `memory`, `pageObject`, or `browser` together.
- Gherkin steps such as `I open '$baseUrl' url`, `I click 'A > B > C'`, `I expect text of 'X' to equal 'Y'`, `I send "GET" request to "$BASE/users" and save response as "r"`.
- Page-object code using `locator(...)`, `locator.template(...)`, `.as(SomeClass)`, or imports from `@qavajs/steps-playwright/po` / `@qavajs/po-playwright`.
- Cucumber output in the `@qavajs/console-formatter` style, or an Allure / `cucumber-html-formatter` / ReportPortal report originating from `qavajs run`.

Even when the user just says "Cucumber + Playwright" without naming qavajs, the skill is consulted and recommended explicitly.

---

## How it was built

This skill was authored end-to-end with the [skill-creator](https://github.com/anthropics/claude-code) workflow against an evaluation loop:

| Eval (iteration 1) | With skill | Without skill |
|---|---|---|
| Scaffold a Playwright qavajs project from scratch | **9/10** | 6/10 |
| API test with auth + JSON-schema check + PATCH + 400 | **13/13** | 12/13 |
| Diagnose a failing `'A > B > C'` locator path | **8/8** | 7/8 |
| **Aggregate pass rate** | **97% ± 6%** | 80% ± 17% |

The iteration-1 benchmark is reproducible — see [Self-improvement](#self-improvement) below.

---

## Self-improvement

Two flavours of update:

### 1. Refresh step catalogs

The four `steps-*.md` reference files are auto-extracted from upstream source. To refresh them when qavajs releases a new version:

```bash
# from a clone of this repo
npm run refresh-catalogs
# or
bash skills/qavajs/scripts/refresh-catalogs.sh
```

The script shallow-clones `@qavajs/steps-memory`, `@qavajs/steps-playwright`, `@qavajs/steps-wdio` and `@qavajs/steps-api`, walks their TypeScript source, and rewrites the catalogs in place. Diff and commit.

### 2. The skill is allowed to edit itself

`skills/qavajs/SKILL.md` carries a `## Self-improvement` section telling Claude (or any agent that activates the skill) that it may **append** new patterns and gotchas to the right reference file when it discovers something the docs missed — and log the change in `references/update.md`. The intent is that skills get richer with use rather than going stale.

This obeys two rules baked into the skill body:

1. **Add, don't rewrite.** When a fact is missing, append; when a fact is wrong, fix surgically and log.
2. **Verify before adding.** New step phrases must come from upstream source (links in `references/update.md`); guesses go to `troubleshooting.md` as candidates, not into the catalogs.

After non-trivial edits, bump `metadata.version` in `SKILL.md` frontmatter.

---

## Compliance with the skill spec

This skill follows the standard agent-skill specification:

- Frontmatter `name` is lowercase + hyphens, matches the directory name (no `claude` / `anthropic` substrings).
- `description` is third-person, includes trigger phrases, and is ≤1024 characters.
- `SKILL.md` body is ≤500 lines (currently ~260).
- Bundled resources live in `references/`, `scripts/`, and `assets/` (no `setup.yaml` required — no MCP dependencies).
- No hardcoded absolute paths anywhere in the skill.

Run a quick local validator from the repo root:

```bash
awk '/^description:/{ sub(/^description:[[:space:]]*/,""); printf "description chars: %d (<= 1024)\n", length }' skills/qavajs/SKILL.md
awk '/^---$/{n++; next} n>=2' skills/qavajs/SKILL.md | wc -l | awk '{printf "body lines:        %d (<= 500)\n", $1}'
```

---

## Local development

```bash
git clone https://github.com/bermudas/qavajs-skill.git
cd qavajs-skill

# Install the skill into a sandbox project to try it out
mkdir /tmp/sandbox && cd /tmp/sandbox
node /path/to/qavajs-skill/bin/init.mjs init --target claude

# Refresh catalogs after qavajs upstream releases
bash /path/to/qavajs-skill/skills/qavajs/scripts/refresh-catalogs.sh
```

The `bin/init.mjs` script has no runtime dependencies — pure `node:fs` / `node:path` / `node:readline` — so it runs anywhere Node ≥ 18 does.

---

## Related

- **qavajs framework** — <https://qavajs.github.io>, <https://github.com/qavajs>
- **qavajs demo monorepo** — <https://github.com/qavajs/demo>
- **Claude Code skills documentation** — <https://docs.claude.com/en/docs/claude-code>

---

## License

[MIT](LICENSE) © 2026 Alexander Bychinskiy.

Trademarks: qavajs is a project of its respective authors. This repository is independent and not affiliated with the qavajs maintainers.
