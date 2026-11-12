# DSH 0.2.2-rc.2 compatibility fork

This is a user-maintained fork of [YichuAI/deepseek-harness-vscode](https://github.com/YichuAI/deepseek-harness-vscode), based on upstream commit `52141a87d17bf8a3ca75e4f0be318017f6e92098` (0.4.1). It is not an upstream Marketplace release or a DeepSeek-official extension. See [STATUS.md](STATUS.md) for measured results and limitations.

## Fixes

- **Attach/reconnect during a turn:** RC2 `session/follow` snapshots include `assistantStream.activeAttempt`. Restore its turn/step mapping, expand the runtime's compact stream records and replay only chunk indexes not already delivered to the current conversation. Ignore stale/duplicate deltas and reject incomplete baselines rather than duplicating partial text. Durable messages remain authoritative.
- **Search results:** normalize RC2 `{items, hasMore}` into the existing UI's `{results}`. Retain legacy `{results, total}` responses; do not manufacture an exact total from a truncated result set.

The runtime version is **0.2.2-rc.2**, not the different **0.2.1-rc.2** used by upstream's earlier verification.

## Local VSIX installation

The compatibility build's display name includes **(RC2 fork)**. Its extension identifier and 0.4.1 version are retained from upstream for drop-in local installation; it replaces the installed upstream extension, and is **not** a separately published Marketplace product. The inherited publisher field identifies the upstream extension identity, not authorship or endorsement of these patches. Do not publish this package under the original author's identity.

```sh
code --install-extension /path/to/harness-connector-deepseek-0.4.1-dsh-0.2.2-rc.2.vsix --force
```

Disable automatic updates for this extension if you need to retain the compatibility build; reinstall the Marketplace version to roll back. A future upstream release may already contain equivalent fixes.

For an existing Host, prefer this configuration so the extension neither reads the local model-credential document nor starts a second Host:

```json
{
  "deepseekHarness.host": "127.0.0.1",
  "deepseekHarness.port": 3080,
  "deepseekHarness.sessionMode": "paste"
}
```

Run **DeepSeek Harness: Use Launch URL** inside VS Code and supply the URL printed by the existing `dsh web` process. Treat its token as a secret. Do not paste it in issue reports or chat transcripts.

For Remote–WSL, Remote–SSH or containers, the workspace extension host and DSH must run in the same environment and see the same project files. A forwarded local port alone does not make Windows and WSL filesystem paths equivalent. This patch does not remove the loopback-only restriction.

## Reproduce tests

Install build dependencies using `npm ci --ignore-scripts`. Install the target DSH into a **separate** npm prefix, not your production Host. Set caches and temporary directories to suitable storage before installing. Neither new test reads your normal DSH home or credentials.

```sh
npm install --prefix /path/to/isolated-runtime --ignore-scripts @deepseek-ai/dsh@0.2.2-rc.2
export DSH_TEST_RUNTIME=/path/to/isolated-runtime
# Set TMPDIR as needed before running. node --import avoids the tsx CLI IPC socket,
# which cannot live on a Windows-mounted WSL drive.
npm run typecheck
node --import tsx scripts/protocol-test.ts
node --import tsx test/e2e/run.ts
npm run rc2-test
npm run rc2-live-test
npm run build
npx --no-install vsce package --no-dependencies --out dist/harness-connector-deepseek-0.4.1-dsh-0.2.2-rc.2.vsix
```

- `rc2-test`: offline regression using the target runtime's own compact stream accumulator and the production client/event-buffer/conversation-model path. Covers active snapshot, compact chunk indexes, missed suffix recovery, duplicate suppression, durable settlement, malformed baseline, fresh subscription and current/legacy search responses.
- `rc2-live-test`: launches a temporary real RC2 Host on an OS-assigned loopback port and an isolated `DSH_HOME`, then stops it in `finally`. Only the upstream LLM is replaced with an in-process deterministic adapter explicitly declaring text/image input capability. The test uses no real API keys or model network calls. Generated test state is retained under the configured temporary directory for diagnosis; it contains synthetic sessions only. RC2's default full-text search is disabled (`openAt: never`), so this test explicitly enables a temporary in-memory index (`openAt: first-search`). This does not change the user's production search policy.
- Existing upstream protocol/e2e tests include fake-Host approvals and file undo, but do **not** alone prove real RC2 compatibility or an actual VS Code window's behavior.

## Remaining boundaries

This is a focused compatibility patch, not a security audit or a rewrite of the client. Authentication continues to use the existing browser-cookie flow; the separate newer remote-peer `/connect` transport is not implemented. UI rendering remains a chat webview with native VS Code file/diff integration, not integration into VS Code's Copilot Chat. Native-window interaction, actual Remote–WSL extension installation, and every optional DSH plugin combination require additional acceptance testing. An inherited edge case remains outside this patch: if a provider abandons an attempt and retries at the exact same turn/step, the conversation model keys streaming text by turn/step rather than attempt identity, so transient retry text can combine until the authoritative durable message arrives. Stream-level errors on a still-open socket also retain upstream's existing recovery behavior.
