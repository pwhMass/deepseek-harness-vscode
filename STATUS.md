# DSH 0.2.2-rc.2 compatibility work

Updated: 2026-11-19 (archived pre-0.4.3 batches to [STATUS-archive.md](STATUS-archive.md)).
Status: **0.4.3 default-collapsed execution/Thinking UI** implemented, release gates passed, and **WSL installation verified** on `feat/ui-polish` (`origin = pwhMass/deepseek-harness-vscode`); **0.2.2-rc.2 compatibility retained**. Existing `127.0.0.1:3080` / `paste` cookie auth/settings preserved.

## Current state & recent verified batches

- **0.4.3 WSL installation (verified, 2026-11-14)**:
  - Updated WSL extension from 0.4.2 to `lucasliang.harness-connector-deepseek@0.4.3` via official VS Code Server CLI without restarting DSH Host or altering WSL settings/credentials.
  - Installed bundle/resource/license files match `dist/deepseek-harness-vscode-0.4.3-folding.vsix` (commit `cd72799`, SHA256 `cadf8ffa0fe13c0fc48a6d53c3e656db2415e18e75815d5ed2a74056da55ed67`) byte-for-byte.
- **0.4.3 default folding implementation (`cd72799`)**:
  - Scoped to `src/view/client.ts`, `src/view/styles.ts`, version/lock metadata, and release records; no new dependencies, CSP, protocol, approval, review/diff, or `src/harness/**` changes.
  - Thinking & intermediate tool/process output default-collapsed via native `details`/`summary`; latest ordinary text, review controls, and pending approvals/questions remain visible; expansion choices survive streaming revisions and reset on session switch.
  - Gates passed: `npm run typecheck`, `scripts/protocol-test.ts` (602 assertions), isolated RC2 `npm run rc2-test`, `dist/ui-polish-test.ts` (55 checks), `dist/ui-folding-test.ts` (61 checks), and `vsce package` VSIX build.
- **Prior batches (archived)**: 0.4.2 highlight.js/codicon UI polish, WSL `127.0.0.1` cookie authority fix, and 0.4.1 RC2 compatibility fixes (`e42b3c0`) are preserved verbatim in [STATUS-archive.md](STATUS-archive.md).

## Limits & next steps

- **Next**: Run **Developer: Reload Window** in the WSL VS Code window and verify default-closed Thinking/process summaries, expand/collapse during streaming, final-answer readability, light/dark/high-contrast themes, and real keyboard/clipboard behavior.
- **Inherited limits**: Without an explicit final-answer field, multiple ordinary text-only assistant messages stay unfolded; VM tests do not claim native GUI/visual/clipboard acceptance. See [RC2-COMPATIBILITY.md](RC2-COMPATIBILITY.md) for build/install notes.
