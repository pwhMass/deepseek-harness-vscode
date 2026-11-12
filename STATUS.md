# DSH 0.2.2-rc.2 compatibility work

Updated: 2026-11-12. Status: core protocol compatibility with **0.2.2-rc.2 verified**; local VSIX built. Native-window/Remote–WSL acceptance remains outside measured coverage.

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
