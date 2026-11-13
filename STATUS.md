# DSH 0.2.2-rc.2 compatibility work

Updated: 2026-11-14. Status: **0.4.3 default-collapsed execution/Thinking UI** implemented, release gates passed and **WSL installation verified** on `feat/ui-polish`; **0.2.2-rc.2 compatibility retained**. Existing cookie authentication/settings are preserved. Full native visual/theme/code-copy acceptance remains pending reload.

## 0.4.3 WSL installation — verified follow-up

- User explicitly selected **direct WSL update** after the folding UI's release checks. Official VS Code Server extension management successfully updated the existing WSL extension from **0.4.2 to 0.4.3** without starting a replacement server.
- Installed-extension listing confirms `lucasliang.harness-connector-deepseek@0.4.3`. Installed package identity and eight bundle/resource/license files match the final VSIX byte-for-byte.
- WSL machine-settings bytes are unchanged before/after installation: existing `127.0.0.1:3080`, `paste` mode, discovery and approvals remain intact. No credential read, new login, configuration write or DSH Host restart was needed for this update.
- Installed artifact: `dist/deepseek-harness-vscode-0.4.3-folding.vsix`, implementation commit `cd72799`; SHA256 `cadf8ffa0fe13c0fc48a6d53c3e656db2415e18e75815d5ed2a74056da55ed67`. This post-install record does not rebuild or change the archive; its embedded release status is the pre-install implementation record.
- Next: **Developer: Reload Window** in the WSL VS Code window. Verify default-closed Thinking/process summaries, expand/collapse during streaming, final-answer readability and preserved review/approval visibility. Installation is verified; active-window loading and native visual/clipboard/keyboard acceptance are not yet claimed.

## 0.4.3 default folding — verified implementation batch

User request: keep final answers prominent and collapse most intermediate Agent output, tools and Thinking by default, with opt-in expansion similar to the Web UI.

- Only `src/view/client.ts`, `src/view/styles.ts`, release version/lock metadata and release records change. No new dependencies, CSP, protocol, credentials, session-binding, approvals, native review/diff or `src/harness/**` change.
- Thinking uses a native, default-closed `details`/`summary` disclosure. Execution summaries fold tool rows and demonstrable intermediate assistant messages and retain readable tool/update/error counts plus a working indicator. Code highlighting and code/message copy remain available on expansion.
- Latest ordinary text stays visible, including when the last text precedes a failed, late or orphan tool result. The renderer does not fabricate a final-answer flag or hide ordinary text-only exchanges where it cannot reliably identify process output.
- User/turn boundaries are never crossed. Review-linked tools, changed-files, system context and visible answer rows split physical process fragments; expanding preserves the original item order. Review controls and pending approvals/questions are not hidden inside a default-closed process. Start/stop/error status lines remain visible.
- Process/Thinking/tool expansion choices survive ordinary streaming/result revisions; queued native toggle events from retired nodes cannot overwrite a new disclosure. The normal unique streaming-to-durable replacement carries the Thinking identity and following-fragment anchor forward. Switching sessions resets these view-only choices, including sessions with equal renderVersion. A scrolled-up reader is no longer forcibly returned to the bottom.
- New CSS uses VS Code theme variables, closed-body guards and native keyboard/focus behavior; tool headers support Enter/Space and announce expanded state.

Verification:

- `npm run typecheck`: passed.
- `node --import tsx scripts/protocol-test.ts`: **602 assertions passed**, including incremental render costs, pending questions/approvals and granular native review actions. Final rerun output stays local in ignored `dist/ui-0.4.3-protocol.log`.
- `DSH_TEST_RUNTIME=/path/to/isolated-rc2-runtime npm run rc2-test`: passed against the existing isolated **0.2.2-rc.2** runtime, no Host started.
- `node --import tsx dist/ui-polish-test.ts`: **55 existing UI checks passed**.
- `node --import tsx dist/ui-folding-test.ts`: **61 new production-renderer/VM/DOM-stub checks passed**. Covers default closures, retained/highlighted answer, opt-in expansion, tool keyboard state, no-work repaint cost, revision/settlement state, stale toggles, session isolation/equal-version switch, review/changes/system barriers, exact expanded chronology, interrupted/late/orphan-tool text fallback, steer boundaries, partial history, scrolled-up position and CSS closed/focus guards. An initial probe omitted the production `shortPath` helper; adding that helper corrected the probe, not product code. Generated probes are local acceptance artifacts under ignored `dist/`, not shipped source tests or native visual acceptance.
- Independent read-only design review identified two real edge cases (last text before a late tool; reordering across exposed review/system/changes). Both are fixed and covered in the 61 checks; the ordinary stream-settlement anchor counterexample is covered too.
- Production build and `npx --no-install vsce package --no-dependencies --ignoreFile dist/ui-package.vscodeignore --out dist/deepseek-harness-vscode-0.4.3-folding.vsix`: passed. The generated local ignore file inherits the repository's exclusions and includes only `dist/extension.js` from build output, preventing old VSIX checksums and local probes/logs from leaking into the new package without changing source ignore rules.
- Artifact: `dist/deepseek-harness-vscode-0.4.3-folding.vsix`; final SHA256 is recorded beside it in `dist/deepseek-harness-vscode-0.4.3-folding.vsix.sha256` after the documentation-inclusive packaging pass, avoiding a self-referential archive hash.

Limits/next acceptance: this projection has no explicit final-answer field, so multiple ordinary text-only assistant messages remain unfolded. Review-visible barriers may produce more than one process summary per turn. In uncommon settlement/delta ordering, a physical fragment can move or split and its expanded choice may reset; all content is retained. Native VS Code visual, real keyboard/clipboard and light/dark/high-contrast acceptance are not claimed by VM tests. User explicitly selected direct WSL update after the release gates; installation/byte verification is recorded above. Existing `127.0.0.1:3080` / `paste` authentication settings remain untouched.

## WSL authentication — 2026-11-14 follow-up

- After reloading, the user reported authentication failure and explicitly requested help restoring login. Screenshot and active extension log agreed: the saved session belonged to `127.0.0.1:3080`, while the configured endpoint was `localhost:3080`. The extension correctly treats these as different cookie authorities.
- Changed only the WSL remote setting `deepseekHarness.host` from `localhost` to `127.0.0.1`. Kept port `3080`, `sessionMode: paste`, discovery and approval settings unchanged. No token/credential file was read, no new signing secret/session was minted, and no Host was started/restarted.
- The running extension's configuration listener automatically reconnected. Its log confirms successful `session/list` negotiation, `auth=cookie`, the `$events` socket and Host `ready`, followed by an open `session/follow` socket and a history snapshot. Authentication and session attachment are now verified in the native WSL extension host; visual/code-copy/theme acceptance remains separate.
- The machine-specific setting stays local and is not committed. This source record contains no cookie, launch token or signing key; the delivered VSIX is unchanged.

## WSL installation — 2026-11-14 follow-up

- User explicitly requested installation into WSL after the build-only delivery, superseding the initial no-install constraint for this step only.
- Updated the existing WSL workspace extension from **0.4.1 to 0.4.2**, using the already-installed VS Code Server extension-management CLI and an explicit WSL extensions directory. No replacement server was started and no VS Code configuration or DSH Host/profile was changed.
- CLI installation exited 0; its installed-extension listing now reports `lucasliang.harness-connector-deepseek@0.4.2`.
- Verified installed package version/identity and byte-for-byte equality with the delivered VSIX for `dist/extension.js`, highlight.js, codicon CSS/font, licenses and third-party notices.
- Installed archive: `dist/deepseek-harness-vscode-0.4.2-ui.vsix`, source commit `55c4eaa`; SHA256 `d684ae53016b4fc7332a210aed431c77512af335f3d6222e96edae6d6abd33b8`. This deployment note is recorded **after** packaging; the original archive was not rebuilt or changed.
- Next: run **Developer: Reload Window** in the VS Code window connected to WSL, then perform the theme/narrow-sidebar/clipboard visual acceptance below. Installation is verified; active-window loading and real clipboard behavior are not yet claimed.

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

Uncovered/manual acceptance: after installation and **Developer: Reload Window**, check dark/light/high-contrast themes, narrow sidebar, long code/table scrolling, keyboard focus and actual clipboard permissions. The build/verification batch itself did not install an extension; the separately authorized WSL installation is recorded above. No VS Code configuration or production Host/profile is changed. Real-Host native approval and Diff interactions are not re-exercised in this UI batch; the inherited limits below still apply.

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
