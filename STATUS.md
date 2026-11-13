# DSH 0.2.2-rc.2 compatibility work

Updated: 2026-11-14. Status: **0.4.2 sidebar UI polish** implemented on `feat/ui-polish`, based on `8affb63`; core protocol compatibility with **0.2.2-rc.2 retained**. Native-window/Remote–WSL acceptance remains outside measured coverage.

## 0.4.2 UI polish — verified implementation batch

- Webview-only highlight.js common build, pinned to `@highlightjs/cdn-assets@11.12.0`. Explicit language grammars only; unknown/untagged languages, grammar failures, a missing highlighter, and blocks over 100,000 UTF-16 code units fall back to escaped plain text. `html: false` and the existing link policy remain in place.
- Fenced and indented code blocks have a dedicated header with a copy button, never an overlay. Clipboard uses `navigator.clipboard.writeText`, then an off-screen textarea and `execCommand('copy')`; success/failure is reported once through button text and a polite live region. User/assistant message copy returns the original message text/Markdown, without reasoning or toolbar labels.
- Toolbar/new/refresh/close buttons use local codicons, preserving IDs/titles and adding accessible names. System-message toggle retains its icon on state updates and reports `aria-pressed`.
- Message cards distinguish user/assistant, follow VS Code font settings, strengthen heading sizes/spacing, and constrain wide code/tables to local horizontal scrolling. New colors use VS Code theme variables; high-contrast token text favors legibility. Native session select is unchanged.
- **No invented timestamps:** the existing conversation projection contains no user/assistant timestamp field. This UI-only batch does not change that projection or infer dates from sequence numbers.
- Build copies browser assets and original licenses to `media/`; provider loads the local highlighter with the existing nonce and codicon stylesheet with webview resource URIs. Existing CSP, `font-src`, and resource roots are unchanged. No new extension-host runtime dependency, RPC, approval, review/diff, session-binding, or `src/harness/**` change. Extension ID remains `lucasliang.harness-connector-deepseek`.
- License correction: codicon **code is MIT**, while its **icons/font are CC BY 4.0** (not MIT). Both original licenses and Microsoft attribution ship in `media/`; highlight.js is BSD-3-Clause. See [third-party notices](media/THIRD-PARTY-NOTICES.md).

Final release verification (2026-11-14):

- `npm run typecheck`: passed.
- `node --import tsx scripts/protocol-test.ts`: **602 assertions passed**.
- `DSH_TEST_RUNTIME=/path/to/isolated-rc2-runtime npm run rc2-test`: passed with the already-installed **0.2.2-rc.2** test runtime. Initial invocation without this required environment variable stopped at the fixture prerequisite; no product defect or Host change.
- `npm run build`: passed; all browser assets copied.
- Additional generated `dist/ui-polish-test.ts` VM/DOM-stub probe: **55 checks passed**, using the real shipped markdown-it/highlight.js bundles. Covers highlighted TypeScript, unknown/no language, escaped code/language labels, indented blocks, missing/broken highlighter, large-block fallback, unsafe HTML/links, exact clipboard text, fallback denial/exception/cleanup, focus/selection restoration, feedback reset, message copy, delegated code copy, no fabricated dates, and font glyph availability. This is not native GUI testing; the generated probe stays local under ignored `dist/` and is excluded from the VSIX.
- `npm audit`: reports **21 existing dependency-tree advisories (12 moderate, 9 high)**; neither newly added browser asset package is listed. No unrelated dependency upgrade or `audit fix` was applied; this batch is not a dependency/security audit.
- `npx --no-install vsce package --no-dependencies --out dist/deepseek-harness-vscode-0.4.2-ui.vsix`: passed, including its production prepublish build. Package inspection confirms version/extension ID, the bundled host code, all six local resource/license copies and third-party attribution, and excludes dependencies, source, generated test probes and other VSIX files.
- Delivery: `dist/deepseek-harness-vscode-0.4.2-ui.vsix`; SHA256 is recorded beside the final archive in `dist/deepseek-harness-vscode-0.4.2-ui.vsix.sha256` after the final documentation-inclusive packaging pass. The digest is intentionally outside the packaged status document to avoid a self-referential archive hash.
- Final diff/scope review and an independent read-only UI/CSP/clipboard/resource review found no blocking issues; `git diff --check` passed. Delivery source branch: the authorized fork's `feat/ui-polish`; Git commit/push outcome is reported with delivery, not fabricated inside its own commit.

Uncovered/manual acceptance: after **Extensions: Install from VSIX…** and **Developer: Reload Window**, check dark/light/high-contrast themes, narrow sidebar, long code/table scrolling, keyboard focus and actual clipboard permissions. No extension is installed into the user's editor, and no VS Code configuration or production Host/profile is changed. Real-Host native approval and Diff interactions are not re-exercised in this UI batch; the inherited limits below still apply.

---

## Scope and provenance

- User requested compatibility verification against **0.2.2-rc.2**, and a fork/fix if needed.
- Upstream: https://github.com/YichuAI/deepseek-harness-vscode at `52141a87d17bf8a3ca75e4f0be318017f6e92098` (extension 0.4.1).
- Authorized fork: https://github.com/pwhMass/deepseek-harness-vscode, branch `compat/dsh-0.2.2-rc.2`.
- Verified npm publishes `@deepseek-ai/dsh@0.2.2-rc.2`. Separate test installation; existing user Host is not upgraded or restarted.

## Confirmed protocol gaps

1. Follow snapshots include an active assistant stream baseline. The upstream client ignores it, so attaching/reconnecting during generation loses already-emitted text and the attempt mapping for subsequent chunks until a durable message arrives.
2. Current session search returns `{items, hasMore}`, but the UI expects `{results, total}`. Upstream passes the unnormalized response through, so valid matches appear empty.

## Verified batch: focused fixes and local build

- Implemented production-client baseline recovery and search response normalization.
- TypeScript typecheck: passed.
- Upstream protocol suite: **602 assertions passed**.
- Upstream end-to-end suite: **96 assertions passed** in the 3 written chains; 2 of 5 chains remain unwritten upstream.
- New offline regression: passed using RC2's real compact stream accumulator and the production client/event-buffer/conversation-model path.
- Reproduction: the same regression against unmodified upstream `52141a8` fails at the first active-baseline assertion (`0 !== 1` assistant items), confirming the test detects the original defect.
- Upstream metadata/version gate: **52 checks passed**.
- Production build and local VSIX packaging: passed. Final artifact will be rebuilt after recording live results.
- Dependencies/cache and isolated runtime are on E drive. `tsx` CLI IPC cannot use Unix sockets on that Windows mount, so tests use equivalent `node --import tsx` execution.

## Real RC2 Host acceptance: 15 checks passed

An isolated real `@deepseek-ai/dsh@0.2.2-rc.2` Host used a deterministic in-process model adapter. No real API keys or external model requests were used, and the production service was not upgraded or restarted. The launcher uses `--profile web --patch <path> --port 0` and stops its temporary Host in `finally`.

Passed:

1. Launch-token exchange obtains a working browser cookie.
2. Connect and `$events` ready frame.
3. Workspace and session creation.
4. Model catalog.
5. Durable model selection.
6. **Second client attaches mid-turn and restores active text from the snapshot.**
7. **Both clients converge to one identical durable message without duplicated text.**
8. Live assistant deltas.
9. Durable assistant message folding.
10. `session/page` history reload.
11. Actual `session/search` results reach the existing UI response shape.
12. Binary upload receipt.
13. Prompt referencing that receipt is accepted and finishes.
14. Rename session.
15. Session listing.

RC2 disables full-text search by default (`openAt: never`). The test explicitly opts into a temporary **in-memory** query index (`openAt: first-search`); no production search setting was changed. An earlier run correctly rejected search with that default, after passing the first 10 checks. Initial launcher/fixture corrections were test-harness defects, not extension incompatibilities; the final complete run exited 0.

## Delivery and remaining limits

- Source fix commit: `e42b3c0` (pushed to the authorized fork).
- Local artifact: `dist/harness-connector-deepseek-0.4.1-dsh-0.2.2-rc.2.vsix`.
- Install/authentication/build instructions and inherited limitations: [RC2-COMPATIBILITY.md](RC2-COMPATIBILITY.md).
- Native VS Code window behavior and actual Remote–WSL installation are **not** yet measured. Real-Host checks use the production extension client/model outside an Extension Host; they are not a claim of full GUI acceptance.
- Real-Host tool-approval and native Diff interaction were not exercised in this smoke test; existing fake-Host approval and filesystem undo suites passed.
- Existing same-turn/step provider-retry transient text behavior and still-open-socket stream-error recovery remain inherited boundaries, documented in the compatibility notes.
- This work does not install the VSIX into the user's editor or alter the user's 3080 Host, profile, credentials, or model settings.
