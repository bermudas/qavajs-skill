# qavajs Automation — Lessons Learned

> Seed lessons distributed with the skill. Engagement-specific notes (real
> project names, internal URLs, auth providers, account state) belong in
> `.claude/agent-memory/qavajs-automation-specialist/runtime/`, which is
> git-ignored and never distributed.

## Running tests (CRITICAL)

- **Always run from the project directory** that contains `config.ts` and `node_modules`.
  - Correct: `pushd <project-dir> && ./node_modules/.bin/qavajs run --config config.ts; popd`
  - Wrong: `npx qavajs run --config config.ts` from workspace root (fails if qavajs is installed locally to sub-project)
- Use `./node_modules/.bin/qavajs` not `npx qavajs` when tests live in a sub-folder of a monorepo/workspace.
- `dotenv/config` must be imported at the top of `config.ts` to load `.env`: `import 'dotenv/config'`
- `--dry-run` before first real run to validate step resolution without a browser.

## Page object hierarchy (CRITICAL)

- Root `App` class MUST use `locator('scope').as(ClassName)` for every component — NOT `new ClassName()`.
  - `new ClassName()` bypasses the component scope chain and causes `TypeError: Cannot read properties of null` at runtime.
  - Correct: `Sidebar = locator('nav[aria-label="side-bar"]').as(Sidebar)`
  - Wrong:   `Sidebar = new Sidebar()`

## MUI (Material UI) selector patterns

MUI components almost never render as native `<button>`. Always inspect DOM first.

| MUI component       | Rendered as              | Reliable selector                                          |
|---------------------|--------------------------|------------------------------------------------------------|
| `MuiChip` (clickable) | `div[role="button"]`   | `[class*="MuiChip-root"]:has-text("text")`                 |
| `MuiListItemButton` | `div[role="button"]` inside `<li>` | Click the parent `li[aria-label="X"]` — works fine |
| `MuiToggleButton`   | `button[role="button"]`  | `button:has-text("text")` usually works                    |
| `MuiIconButton`     | `button`                 | `button[aria-label="X"]`                                   |

- **General rule**: when `button:has-text("X")` returns nothing, try `[role="button"]:has-text("X")` before assuming the element is absent.
- MUI category filter tabs on "create" pages are typically `MuiChip` → use `[role="button"]:has-text("Category")`.
- MUI type filter chips on list pages (`MuiChip-root`) → use `[class*="MuiChip-root"]:has-text("Type")`.

## Data-driven UI elements

- Filter chips, badges and counts are often **account-state-dependent** — they only appear when the test account has relevant data.
- Do NOT assert domain-specific filter chips as stable fixtures; they change with the account's data inventory.
- Prefer asserting structural elements (headings, text inputs, static category tabs) over data-driven chips.

## OIDC / form-based login

- Direct OIDC provider form login is typically `input[name="username"]`, `input[type="password"]`, and a submit control (id varies by provider — inspect the DOM).
- SSO brokers that use FIDO2 / passkey are not automatable in a fresh browser context without passkey emulation — they need an existing authenticated session or a non-passkey service account.
- Accounts that land on an onboarding/interstitial page may have navigation intercepted on first click. Navigate directly to the target URL instead of relying on a nav-click.

## `{playwrightTimeout}` parameter syntax

- Correct: `I wait for network idle (timeout: 30000)` — note the parenthetical `(timeout: N)` format.
- Wrong:   `I wait for network idle for 30000 ms` — does not match the step regex.
