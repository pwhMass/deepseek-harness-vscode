/** CSS for the webview sidebar. Kept as a plain string template; physical
 *  file separation makes it easier to edit without touching provider.ts. */
export const STYLES = /* css */ `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body {
  margin: 0; padding: 0; height: 100vh; min-width: 0; overflow-x: hidden;
  display: flex; flex-direction: column;
  font-family: var(--vscode-font-family, sans-serif);
  font-size: var(--vscode-font-size, 13px);
  color: var(--vscode-foreground);
  background: var(--vscode-sideBar-background);
}
.bar { padding: 8px 10px; border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border)); min-width: 0; }
.brand-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; padding: 8px 10px; border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border)); }
.brand-bar img { width: 20px; height: 20px; flex-shrink: 0; }
.brand-bar .brand-name { font-weight: 600; font-size: 1em; flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
.brand-bar .toolbar { display: flex; flex-wrap: wrap; gap: 2px; margin-left: auto; }
.brand-bar .toolbar button { padding: 4px; min-width: 26px; min-height: 26px; background: none; color: var(--vscode-icon-foreground, var(--vscode-foreground)); }
.brand-bar .toolbar button:hover { background: var(--vscode-toolbar-hoverBackground, var(--vscode-list-hoverBackground)); }
.brand-bar .toolbar button.active { background: var(--vscode-toolbar-activeBackground, var(--vscode-list-activeSelectionBackground)); color: var(--vscode-list-activeSelectionForeground, var(--vscode-foreground)); }
button.icon { display: inline-flex; align-items: center; justify-content: center; gap: 4px; }
button .codicon, .subpanel-title .codicon { flex: 0 0 auto; font-size: 16px; }
:where(button, input, textarea, select, a, [tabindex]):focus-visible { outline: 2px solid var(--vscode-focusBorder); outline-offset: 2px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
textarea.clipboard-fallback { position: fixed; left: -10000px; top: 0; width: 1px; height: 1px; min-height: 0; max-height: none; padding: 0; border: 0; opacity: 0; pointer-events: none; }
.toggle-badge { font-size: 9px; background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); border-radius: 8px; padding: 0 4px; margin-left: 2px; }
.row { display: flex; gap: 6px; align-items: center; margin: 4px 0; }
.status { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-weight: 600; }
#status-text, #host-info, #mux-status { overflow-wrap: anywhere; }
#session-select { min-width: 0; flex: 1 1 0; }
/* The manual connect/retry affordance rides in the status row, right-aligned so
   it reads as an action on the status rather than another toolbar icon. */
.status #connect { margin-left: auto; padding: 2px 8px; font-size: 11px; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot.disconnected { background: var(--vscode-disabledForeground, #888); }
.dot.connecting { background: var(--vscode-charts-yellow, #ca9c2e); animation: pulse 1s infinite; }
.dot.connected { background: var(--vscode-charts-green, #2da44e); }
.dot.error { background: var(--vscode-errorForeground, #c53149); }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
.muted { color: var(--vscode-descriptionForeground); font-weight: 400; font-size: 11px; }
select, button, input, textarea {
  font-family: inherit; font-size: inherit; color: inherit;
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border, transparent);
  border-radius: 2px; padding: 4px 6px;
}
select { width: 100%; }
button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; padding: 4px 10px; border-radius: 2px; }
button:hover { background: var(--vscode-button-hoverBackground); }
button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
button:disabled { opacity: .5; cursor: default; }
button.icon { padding: 4px 6px; }
.ws-name { font-weight: 600; }
.ws-path { color: var(--vscode-descriptionForeground); font-size: 11px; word-break: break-all; }
.ws-pending { color: var(--vscode-charts-yellow, #ca9c2e); font-size: 11px; margin-top: 2px; }
#messages { flex: 1 1 0; min-height: 0; min-width: 0; overflow-y: auto; overflow-x: hidden; padding: 10px; display: flex; flex-direction: column; gap: 12px; }
#messages > * { flex-shrink: 0; }
.msg { min-width: 0; max-width: 100%; padding: 10px 12px; border: 1px solid var(--vscode-contrastBorder, var(--vscode-panel-border, var(--vscode-widget-border))); border-radius: 6px; overflow-wrap: anywhere; }
.msg.user { background: var(--vscode-input-background); color: var(--vscode-input-foreground, var(--vscode-foreground)); border-left: 3px solid var(--vscode-textLink-foreground); }
.msg.assistant { background: var(--vscode-editor-background); color: var(--vscode-editor-foreground, var(--vscode-foreground)); }
.msg .msg-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 10px; margin-bottom: 8px; white-space: normal; }
.msg .role { font-weight: 600; font-size: 0.92em; line-height: 1.4; }
.msg .message-body { min-width: 0; line-height: 1.6; white-space: pre-wrap; }
.msg .copy-message, .msg .copy-code { display: inline-flex; align-items: center; justify-content: center; gap: 5px; flex: 0 0 auto; max-width: 100%; padding: 4px 7px; font-size: 0.85em; line-height: 1.4; border: 1px solid var(--vscode-contrastBorder, var(--vscode-button-border, var(--vscode-panel-border))); border-radius: 3px; white-space: normal; }
.msg .copy-message { margin-left: auto; }
.msg button[data-copy-state="success"] { color: var(--vscode-testing-iconPassed, var(--vscode-foreground)); }
.msg button[data-copy-state="error"] { color: var(--vscode-errorForeground); border-color: var(--vscode-inputValidation-errorBorder, var(--vscode-errorForeground)); }
.msg .reasoning { min-width: 0; color: var(--vscode-descriptionForeground); font-style: normal; line-height: 1.5; margin: 8px 0; border-left: 2px solid var(--vscode-panel-border, var(--vscode-widget-border)); padding-left: 8px; white-space: normal; }
.msg .reasoning-head { display: list-item; padding: 3px 0; cursor: pointer; font-size: 0.9em; font-weight: 500; line-height: 1.5; white-space: normal; overflow-wrap: anywhere; }
.msg .reasoning-body { min-width: 0; max-height: 24rem; overflow: auto; padding: 6px 0 4px; border-top: 1px solid var(--vscode-panel-border, var(--vscode-widget-border)); font-size: 0.92em; line-height: 1.6; white-space: pre-wrap; overflow-wrap: anywhere; }
.msg .reasoning:not([open]) > .reasoning-body { display: none; }
.msg .usage { font-size: 0.85em; line-height: 1.4; color: var(--vscode-descriptionForeground); margin-top: 8px; }

/* Markdown resets inherited plain-message whitespace; code alone keeps it. */
.msg .md { line-height: 1.6; white-space: normal; }
.msg .md > :first-child { margin-top: 0; }
.msg .md > :last-child { margin-bottom: 0; }
.msg .md p { margin: 0 0 0.8em; }
.msg .md h1, .msg .md h2, .msg .md h3, .msg .md h4, .msg .md h5, .msg .md h6 { margin: 1.2em 0 0.5em; line-height: 1.35; font-weight: 600; }
.msg .md h1 { font-size: 1.45em; }
.msg .md h2 { font-size: 1.3em; }
.msg .md h3 { font-size: 1.15em; }
.msg .md h4 { font-size: 1.05em; }
.msg .md h5, .msg .md h6 { font-size: 1em; }
.msg .md code {
  font-family: var(--vscode-editor-font-family, monospace);
  color: var(--vscode-textPreformat-foreground, var(--vscode-editor-foreground));
  background: var(--vscode-textCodeBlock-background, var(--vscode-editor-background));
  padding: 1px 4px; border-radius: 3px; font-size: 0.92em;
}
.msg .md pre {
  max-width: 100%; min-width: 0; margin: 0.8em 0; padding: 10px;
  background: var(--vscode-textCodeBlock-background, var(--vscode-editor-background));
  color: var(--vscode-editor-foreground); border-radius: 4px; overflow-x: auto;
  white-space: pre; overflow-wrap: normal; word-break: normal; tab-size: 4;
}
.msg .md pre code { display: block; background: none; color: var(--vscode-editor-foreground); padding: 0; line-height: 1.5; white-space: pre; overflow-wrap: normal; word-break: normal; }
.msg .code-block { min-width: 0; max-width: 100%; margin: 0.8em 0; border: 1px solid var(--vscode-contrastBorder, var(--vscode-panel-border, var(--vscode-widget-border))); border-radius: 4px; background: var(--vscode-textCodeBlock-background, var(--vscode-editor-background)); }
.msg .code-block-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 10px; min-width: 0; padding: 6px 8px; border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border)); background: var(--vscode-editorWidget-background, var(--vscode-editor-background)); white-space: normal; }
.msg .code-language { min-width: 0; flex: 1 1 auto; font-family: var(--vscode-editor-font-family, monospace); font-size: 0.85em; color: var(--vscode-descriptionForeground); overflow-wrap: anywhere; }
.msg .code-block pre { margin: 0; border-radius: 0 0 4px 4px; }
.msg .md blockquote { margin: 0.8em 0; padding: 6px 10px; border-left: 3px solid var(--vscode-textBlockQuote-border, var(--vscode-textLink-foreground)); background: var(--vscode-textBlockQuote-background, var(--vscode-editor-background)); }
.msg .md blockquote > :last-child { margin-bottom: 0; }
.msg .md ul, .msg .md ol { padding-left: 1.5em; margin: 0.6em 0; }
.msg .md li { margin: 0.25em 0; }
.msg .md a { color: var(--vscode-textLink-foreground); text-underline-offset: 2px; }
.msg .md a:hover { color: var(--vscode-textLink-activeForeground, var(--vscode-textLink-foreground)); }
.msg .md table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; margin: 0.8em 0; font-size: 0.95em; }
.msg .md th, .msg .md td { border: 1px solid var(--vscode-panel-border, var(--vscode-widget-border)); padding: 6px 8px; }
.msg .md th { background: var(--vscode-textBlockQuote-background, var(--vscode-editor-background)); font-weight: 600; }
.msg .md img { max-width: 100%; height: auto; }
.msg .md hr { border: 0; border-top: 1px solid var(--vscode-panel-border, var(--vscode-widget-border)); margin: 1em 0; }

/* Semantic VS Code theme colors, without an external light/dark token palette. */
.msg .hljs { color: var(--vscode-editor-foreground); }
.msg .hljs-comment, .msg .hljs-quote { color: var(--vscode-descriptionForeground); font-style: italic; }
.msg .hljs-keyword, .msg .hljs-selector-tag, .msg .hljs-doctag { color: var(--vscode-symbolIcon-keywordForeground, var(--vscode-editor-foreground)); }
.msg .hljs-string, .msg .hljs-regexp, .msg .hljs-template-tag, .msg .hljs-template-variable { color: var(--vscode-symbolIcon-stringForeground, var(--vscode-editor-foreground)); }
.msg .hljs-number, .msg .hljs-literal { color: var(--vscode-symbolIcon-numberForeground, var(--vscode-editor-foreground)); }
.msg .hljs-title, .msg .hljs-section { color: var(--vscode-symbolIcon-functionForeground, var(--vscode-editor-foreground)); }
.msg .hljs-built_in, .msg .hljs-type, .msg .hljs-title.class_ { color: var(--vscode-symbolIcon-classForeground, var(--vscode-editor-foreground)); }
.msg .hljs-attr, .msg .hljs-attribute, .msg .hljs-property { color: var(--vscode-symbolIcon-propertyForeground, var(--vscode-editor-foreground)); }
.msg .hljs-variable, .msg .hljs-params, .msg .hljs-subst { color: var(--vscode-symbolIcon-variableForeground, var(--vscode-editor-foreground)); }
.msg .hljs-tag, .msg .hljs-name, .msg .hljs-selector-class, .msg .hljs-selector-id { color: var(--vscode-symbolIcon-namespaceForeground, var(--vscode-editor-foreground)); }
.msg .hljs-meta, .msg .hljs-symbol, .msg .hljs-bullet, .msg .hljs-link { color: var(--vscode-textLink-foreground); }
.msg .hljs-addition { color: var(--vscode-gitDecoration-addedResourceForeground, var(--vscode-editor-foreground)); }
.msg .hljs-deletion { color: var(--vscode-gitDecoration-deletedResourceForeground, var(--vscode-editor-foreground)); }
.msg .hljs-emphasis { font-style: italic; }
.msg .hljs-strong { font-weight: 600; }

/* Preserve readable contrast when a high-contrast theme's token colors vary. */
body.vscode-high-contrast .msg .hljs span, body.vscode-high-contrast-light .msg .hljs span { color: var(--vscode-editor-foreground); }

/* Native disclosures keep intermediate work out of the final answer's hierarchy.
   Only open bodies get a layout override, preserving the browser's closed state. */
.agent-process { min-width: 0; max-width: 100%; border: 1px solid var(--vscode-contrastBorder, var(--vscode-panel-border, var(--vscode-widget-border))); border-radius: 4px; background: var(--vscode-editorWidget-background, var(--vscode-sideBar-background)); }
.agent-process-head { display: list-item; padding: 6px 8px; cursor: pointer; font-size: 0.9em; font-weight: 500; line-height: 1.5; color: var(--vscode-descriptionForeground); white-space: normal; overflow-wrap: anywhere; }
.agent-process[open] > .agent-process-head { color: var(--vscode-foreground); border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border)); }
.agent-process.running > .agent-process-head { color: var(--vscode-charts-yellow, var(--vscode-foreground)); }
.agent-process.has-errors > .agent-process-head { color: var(--vscode-errorForeground); }
.agent-process-head:hover, .msg .reasoning-head:hover { background: var(--vscode-list-hoverBackground); }
.agent-process-head:focus-visible, .msg .reasoning-head:focus-visible { outline: 2px solid var(--vscode-focusBorder); outline-offset: 2px; }
.agent-process-body { min-width: 0; padding: 8px; }
.agent-process[open] > .agent-process-body { display: flex; flex-direction: column; gap: 8px; }
.agent-process:not([open]) > .agent-process-body { display: none; }
.agent-process-body > .tool, .agent-process-body > .msg { min-width: 0; max-width: 100%; margin: 0; }
.agent-process-body > .msg { padding: 8px; }
.agent-process-body > .msg .msg-head { margin-bottom: 6px; }
.msg .reasoning[open] > .reasoning-head { color: var(--vscode-foreground); }

/* System item (collapsed by default) */
.system {
  padding: 4px 8px; border-radius: 4px;
  background: var(--vscode-textBlockQuote-background);
  border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.2));
  font-size: 11px; color: var(--vscode-descriptionForeground);
}
.system .sys-head { cursor: pointer; user-select: none; display: flex; align-items: center; gap: 6px; font-weight: 500; }
.system .sys-head:hover { color: var(--vscode-foreground); }
.system .sys-arrow { display: inline-block; width: 10px; transition: transform 0.15s; }
.system.open .sys-arrow { transform: rotate(90deg); }
.system .sys-body { display: none; margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--vscode-panel-border, rgba(128,128,128,.2)); white-space: pre-wrap; word-break: break-word; font-family: var(--vscode-editor-font-family, monospace); font-size: 10.5px; }
.system.open .sys-body { display: block; }
.system .sys-source { color: var(--vscode-textLink-foreground); font-size: 10px; margin-left: auto; }

/* ToolItem: single collapsed card (call + result merged). */
.tool {
  padding: 4px 8px; border-radius: 4px;
  background: var(--vscode-textBlockQuote-background);
  border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.2));
}
.tool .t-head {
  cursor: pointer; user-select: none;
  display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 12px;
}
.tool .t-head:hover { background: var(--vscode-list-hoverBackground, rgba(128,128,128,.08)); border-radius: 3px; }
.tool .t-arrow { display: inline-block; width: 10px; transition: transform 0.15s; color: var(--vscode-descriptionForeground); }
.tool.open .t-arrow { transform: rotate(90deg); }
.tool .t-name { color: var(--vscode-symbolIcon-functionForeground, #b58900); flex: 0 0 auto; }
.tool.error .t-name { color: var(--vscode-errorForeground, #c53149); }
.tool .t-title { flex: 1; }
.tool .t-state { font-size: 10px; flex: 0 0 auto; }
.tool .t-state.running { color: var(--vscode-charts-yellow, #ca9c2e); }
.tool .t-state.done { color: var(--vscode-charts-green, #2da44e); }
.tool .t-state.error { color: var(--vscode-errorForeground, #c53149); }
.tool .t-body { display: none; margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--vscode-panel-border, rgba(128,128,128,.2)); }
.tool.open .t-body { display: block; }
.tool .t-section-title { font-size: 10px; font-weight: 600; text-transform: uppercase; color: var(--vscode-descriptionForeground); margin: 6px 0 2px; }
.tool pre {
  margin: 0; font-family: var(--vscode-editor-font-family, monospace);
  font-size: 11px; white-space: pre-wrap; word-break: break-word;
  max-height: 260px; overflow-y: auto;
  background: var(--vscode-editor-background);
  padding: 6px; border-radius: 3px;
}
.tool.error .t-result { color: var(--vscode-errorForeground); }

.status-line { font-size: 11px; color: var(--vscode-descriptionForeground); text-align: center; padding: 2px 0; }
.status-line.running { color: var(--vscode-charts-yellow, #ca9c2e); }
.cursor { display: inline-block; width: 7px; height: 13px; background: var(--vscode-editorCursor-foreground); vertical-align: text-bottom; animation: blink 1s step-end infinite; margin-left: 2px; }
@keyframes blink { 50% { opacity: 0; } }
#input-area { border-top: 1px solid var(--vscode-panel-border, rgba(128,128,128,.2)); padding: 8px 10px; display: flex; flex-direction: column; gap: 6px; }
textarea { resize: none; min-height: 60px; max-height: 200px; width: 100%; }
.input-row { display: flex; gap: 6px; }
.input-row button { flex: 1; }
#open-web { text-align: center; padding: 6px; border-top: 1px solid var(--vscode-panel-border, rgba(128,128,128,.2)); }
#open-web a { color: var(--vscode-textLink-foreground); cursor: pointer; text-decoration: none; font-size: 11px; }
#open-web a:hover { text-decoration: underline; }
.empty { text-align: center; color: var(--vscode-descriptionForeground); padding: 24px 12px; font-size: 12px; }

/* First-run card. Replaces the one-line empty state until something has
   connected once: same slot, but it can be read by somebody who has never seen
   this extension before. */
.first-run { padding: 18px 12px; font-size: 12px; color: var(--vscode-foreground); }
.first-run .fr-step { display: flex; gap: 8px; margin-bottom: 10px; }
.first-run .fr-n {
  flex: 0 0 18px; height: 18px; line-height: 18px; border-radius: 50%;
  text-align: center; font-size: 10px; font-weight: bold;
  background: var(--vscode-badge-background, rgba(128,128,128,.25));
  color: var(--vscode-badge-foreground, var(--vscode-foreground));
}
.first-run .fr-body { flex: 1 1 auto; min-width: 0; }
.first-run .fr-title { font-weight: bold; }
.first-run .fr-note { color: var(--vscode-descriptionForeground); line-height: 1.45; }
.first-run .fr-actions { margin-top: 14px; }

/* Context injection UI */
.context-bar { display: flex; flex-wrap: wrap; gap: 4px; padding: 4px 0; align-items: center; }
.ctx-chip {
  display: inline-flex; align-items: center; gap: 3px;
  background: var(--vscode-badge-background, rgba(0,120,212,.2));
  color: var(--vscode-badge-foreground, var(--vscode-foreground));
  border-radius: 3px; padding: 1px 6px; font-size: 10px; max-width: 200px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ctx-chip.selection { background: var(--vscode-charts-yellow, #ca9c2e); color: var(--vscode-contrastActiveBorder, #000); }
.ctx-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.atfile-hint { font-size: 10px; color: var(--vscode-descriptionForeground); opacity: 0.7; padding: 2px 0; }

/* Review card (embedded in tool item, always visible) */
.t-review {
  margin: 4px 0; padding: 6px 8px; border-radius: 4px;
  background: var(--vscode-textBlockQuote-background);
  border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.25));
  font-size: 12px;
}
.t-review .review-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.t-review .review-title { font-weight: 600; font-size: 11px; text-transform: uppercase; color: var(--vscode-descriptionForeground); }
.t-review .review-state { font-size: 10px; padding: 1px 6px; border-radius: 8px; }
.t-review .review-state.pending { background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); }
.t-review .review-state.accepted { background: var(--vscode-charts-green, #2da44e); color: #fff; }
.t-review .review-state.rejected { background: var(--vscode-charts-red, #c53149); color: #fff; }
.t-review .review-state.partial { background: var(--vscode-charts-yellow, #ca9c2e); color: #000; }
.t-review .review-state.conflicted { background: var(--vscode-errorForeground, #c53149); color: #fff; }
.t-review .review-files { display: flex; flex-direction: column; gap: 2px; }
.t-review .review-file {
  display: flex; flex-direction: column; padding: 3px 4px; border-radius: 3px;
  background: var(--vscode-editor-background);
}
.t-review .rf-head { display: flex; align-items: center; gap: 6px; }
.t-review .rf-path { flex: 1; font-family: var(--vscode-editor-font-family, monospace); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.t-review .rf-stats { font-size: 10px; font-family: var(--vscode-editor-font-family, monospace); flex: 0 0 auto; }
.t-review .rf-stats .added { color: var(--vscode-charts-green, #2da44e); }
.t-review .rf-stats .removed { color: var(--vscode-charts-red, #c53149); }
.t-review .rf-state { font-size: 10px; flex: 0 0 auto; }
.t-review .rf-state.accepted { color: var(--vscode-charts-green, #2da44e); }
.t-review .rf-state.rejected { color: var(--vscode-charts-red, #c53149); }
.t-review .review-file button { padding: 2px 6px; font-size: 10px; flex: 0 0 auto; }
/* Per-hunk rows. Indented under the file so the hierarchy reads as "these are
   the parts of that file", and dimmer, because they are detail rather than a
   second list of files. */
.t-review .rf-hunks { display: flex; flex-direction: column; gap: 1px; margin: 2px 0 0 10px; }
.t-review .rf-hunk {
  display: flex; align-items: center; gap: 6px; padding: 1px 3px; border-radius: 3px;
  border-left: 2px solid var(--vscode-panel-border, rgba(128,128,128,.3));
}
.t-review .rf-hunk.rejected { opacity: .55; }
.t-review .rf-hunk-text {
  flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: var(--vscode-editor-font-family, monospace); font-size: 10px;
  color: var(--vscode-descriptionForeground);
}
.t-review .review-actions { display: flex; gap: 6px; margin-top: 6px; }
.t-review .review-actions button { flex: 1; padding: 3px 10px; font-size: 11px; }

/* ─── end-of-turn changed files ─────────────────────────────────────────────
   A report of what the turn already wrote, plus the one action that makes
   sense on a fact: undo it. Visually a sibling of the review card above, but
   it belongs to the TURN rather than to one tool call, so it sits at the end
   of the transcript instead of inside a tool row. */
.changes {
  margin: 8px 0; padding: 8px 10px; border-radius: 6px;
  background: var(--vscode-editorWidget-background, rgba(128,128,128,0.08));
  border: 1px solid var(--vscode-widget-border, rgba(128,128,128,0.25));
}
.changes.loading { color: var(--vscode-descriptionForeground); font-size: 11px; }
.changes.error { border-color: var(--vscode-errorForeground, #c53149); }
.changes-error { font-size: 11px; color: var(--vscode-errorForeground, #c53149); }
.changes-head { display: flex; align-items: center; gap: 8px; }
.changes-title { flex: 1; font-size: 11px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.changes-stats { font-family: var(--vscode-editor-font-family, monospace); font-size: 10px; flex: 0 0 auto; }
.changes-stats .added, .changes-file .cf-stats .added { color: var(--vscode-charts-green, #2da44e); }
.changes-stats .removed, .changes-file .cf-stats .removed { color: var(--vscode-charts-red, #c53149); }
.changes-head button { padding: 2px 8px; font-size: 10px; flex: 0 0 auto; }
.changes-files { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }
.changes-file { display: flex; align-items: center; gap: 6px; }
.changes-file .cf-path {
  flex: 1; cursor: pointer; font-family: var(--vscode-editor-font-family, monospace);
  font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.changes-file .cf-path:hover { text-decoration: underline; }
.changes-file .cf-stats { font-size: 10px; font-family: var(--vscode-editor-font-family, monospace); flex: 0 0 auto; }
.changes-file button { padding: 2px 6px; font-size: 10px; flex: 0 0 auto; }
.changes-fold { margin-top: 6px; width: 100%; padding: 3px 10px; font-size: 11px; }

/* ── v0.0.9: queued messages / slash completion / usage panel ───────────── */
#queue-bar { border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.25)); border-radius: 4px; margin-bottom: 6px; padding: 5px 7px; }#queue-bar .queue-title { font-size: 10px; color: var(--vscode-descriptionForeground); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .4px; }
#queue-bar .queue-item { display: flex; align-items: center; gap: 5px; padding: 3px 0; }
#queue-bar .queue-item + .queue-item { border-top: 1px dashed var(--vscode-panel-border, rgba(128,128,128,.2)); }
#queue-bar .queue-text { flex: 1; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--vscode-charts-yellow, #ca9c2e); }
#queue-bar .queue-item button { padding: 1px 6px; font-size: 10px; flex: 0 0 auto; }

/* ── pending waterfalls: approvals + ask_user_question ───────────────────
   Both block the Host's tool call, so both belong in the one place the user is
   already looking when they are about to type. Deliberately styled as a warning
   block (left rule, raised background) rather than a message: it is a question
   addressed to the reader, not a record of something that happened. */
.pending-panel { display: flex; flex-direction: column; gap: 6px; margin-bottom: 6px; }
.pending-card { border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.35)); border-left: 3px solid var(--vscode-charts-yellow, #ca9c2e); border-radius: 4px; padding: 7px 8px; background: var(--vscode-editorWidget-background, rgba(128,128,128,.06)); }
.pending-card.risk { border-left-color: var(--vscode-charts-red, #c53149); }
.pending-card.responding { opacity: .6; }
.pending-kind { font-size: 10px; text-transform: uppercase; letter-spacing: .5px; color: var(--vscode-descriptionForeground); margin-bottom: 3px; }
.pending-head { font-size: 11.5px; font-weight: 600; margin-bottom: 3px; }
.pending-tool { font-size: 11px; font-family: var(--vscode-editor-font-family, monospace); margin-bottom: 2px; }
.pending-reason { font-size: 11px; color: var(--vscode-descriptionForeground); white-space: pre-wrap; word-break: break-word; }
.pending-note { font-size: 10.5px; color: var(--vscode-charts-red, #c53149); margin-top: 4px; }
.pending-card .pending-question { font-size: 11.5px; margin: 5px 0 3px; white-space: pre-wrap; word-break: break-word; }
.pending-card .pending-detail { font-size: 10.5px; color: var(--vscode-descriptionForeground); max-height: 160px; overflow: auto; white-space: pre-wrap; border-left: 2px solid var(--vscode-panel-border, rgba(128,128,128,.3)); padding-left: 6px; margin: 4px 0; }
.pending-opts { display: flex; flex-direction: column; gap: 2px; margin: 4px 0; }
.pending-opt { display: flex; align-items: flex-start; gap: 6px; font-size: 11px; padding: 3px 5px; border-radius: 3px; cursor: pointer; }
.pending-opt:hover { background: var(--vscode-list-hoverBackground, rgba(128,128,128,.15)); }
.pending-opt input { flex: 0 0 auto; margin: 2px 0 0; }
.pending-opt .pending-opt-desc { display: block; font-size: 10px; color: var(--vscode-descriptionForeground); }
.pending-card .pending-other { width: 100%; box-sizing: border-box; font-size: 11px; padding: 3px 5px; margin-top: 3px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border, var(--vscode-panel-border, rgba(128,128,128,.35))); border-radius: 3px; }
.pending-actions { display: flex; gap: 6px; margin-top: 6px; }
.pending-actions button { padding: 3px 10px; font-size: 11px; }
.pending-actions .grow { flex: 1; }

/* Composer attachments: chips above the textarea. Images that were pasted get a
   local blob thumbnail, so the preview never travels as base64. */
.attach-bar { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 6px; }
.attach-chip { display: flex; align-items: center; gap: 5px; max-width: 100%; padding: 3px 5px 3px 3px; border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.3)); border-radius: 4px; background: var(--vscode-input-background); }
.attach-thumb { width: 26px; height: 26px; border-radius: 3px; object-fit: cover; flex: 0 0 auto; background: var(--vscode-editorWidget-background, #222); }
.attach-glyph { width: 26px; height: 26px; border-radius: 3px; flex: 0 0 auto; display: flex; align-items: center; justify-content: center; font-size: 13px; background: var(--vscode-editorWidget-background, #222); }
.attach-name { font-size: 11px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.attach-size { font-size: 10px; color: var(--vscode-descriptionForeground); flex: 0 0 auto; }
.attach-chip .attach-x { padding: 0 4px; font-size: 10px; flex: 0 0 auto; background: transparent; color: var(--vscode-descriptionForeground); }
.attach-chip .attach-x:hover { color: var(--vscode-foreground); background: var(--vscode-toolbar-hoverBackground, rgba(128,128,128,.2)); }
#input-area.drag-over { outline: 1px dashed var(--vscode-focusBorder); outline-offset: -3px; }


#slash-popup { position: relative; border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.3)); border-radius: 4px; margin-bottom: 4px; background: var(--vscode-editorWidget-background, var(--vscode-input-background)); box-shadow: 0 2px 8px rgba(0,0,0,.35); max-height: 180px; overflow-y: auto; z-index: 5; }
#slash-popup .slash-row { display: flex; gap: 8px; align-items: baseline; padding: 4px 8px; cursor: pointer; }
#slash-popup .slash-row.active { background: var(--vscode-list-activeSelectionBackground, rgba(128,128,128,.25)); color: var(--vscode-list-activeSelectionForeground, inherit); }
#slash-popup .slash-name { font-family: var(--vscode-editor-font-family, monospace); font-weight: 600; font-size: 11.5px; flex: 0 0 auto; }
#slash-popup .slash-desc { font-size: 10.5px; color: var(--vscode-descriptionForeground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── @file mention completion (host fileReferences/list) ─────────────────── */
/* Deliberately the same visual grammar as the slash popup: both are composer
   completions sitting directly above the textarea, and a user who has learned
   one should not have to learn the other. */
#at-popup { position: relative; border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.3)); border-radius: 4px; margin-bottom: 4px; background: var(--vscode-editorWidget-background, var(--vscode-input-background)); box-shadow: 0 2px 8px rgba(0,0,0,.35); max-height: 200px; overflow-y: auto; z-index: 5; }
#at-popup .at-row { display: flex; gap: 8px; align-items: baseline; padding: 4px 8px; cursor: pointer; }
#at-popup .at-row.active { background: var(--vscode-list-activeSelectionBackground, rgba(128,128,128,.25)); color: var(--vscode-list-activeSelectionForeground, inherit); }
#at-popup .at-glyph { flex: 0 0 auto; font-size: 11px; opacity: .85; }
#at-popup .at-path { font-family: var(--vscode-editor-font-family, monospace); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; direction: rtl; text-align: left; }
#at-popup .at-kind { flex: 0 0 auto; font-size: 10px; color: var(--vscode-descriptionForeground); }

.steer-wrap { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--vscode-descriptionForeground); cursor: pointer; flex: 0 0 auto; margin-left: auto; }
.steer-wrap input { width: auto; margin: 0; }
.input-row { display: flex; gap: 6px; align-items: center; }
.input-row #send { flex: 0 0 auto; }
.input-row #stop { flex: 0 0 auto; }

/* Model + thinking depth, one row under the composer: two labelled selects so
   the choice is visible while typing, not buried in the settings panel. */
.model-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 2px 0 0; }
.model-slot { display: inline-flex; align-items: center; gap: 4px; flex: 1 1 auto; min-width: 0; }
.model-tag { font-size: 10px; text-transform: uppercase; letter-spacing: .04em; color: var(--vscode-descriptionForeground); flex: 0 0 auto; }
.model-bar select { flex: 1 1 auto; min-width: 0; width: auto; font-size: 11px; padding: 2px 4px; }
.model-note { font-size: 10px; color: var(--vscode-descriptionForeground); flex: 0 0 auto; }

.usage-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 6px; margin: 4px 0; }
.usage-grid .usage-cell { background: var(--vscode-editor-background, rgba(128,128,128,.08)); border: 1px solid var(--vscode-panel-border, rgba(128,128,128,.2)); border-radius: 4px; padding: 4px 6px; text-align: center; }
.usage-grid .usage-cell b { display: block; font-size: 12px; }
.usage-grid .usage-cell span { font-size: 9.5px; color: var(--vscode-descriptionForeground); text-transform: uppercase; letter-spacing: .3px; }

/* ── v0.1.0: session search / event inspector subpanels ─────────────────── */
.subpanel { min-width: 0; border: 1px solid var(--vscode-contrastBorder, var(--vscode-panel-border, var(--vscode-widget-border))); border-radius: 5px; margin: 6px 10px; padding: 10px; background: var(--vscode-editorWidget-background, var(--vscode-sideBar-background)); }
.subpanel-head { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.subpanel-title { display: flex; align-items: center; gap: 6px; flex: 1 1 0; min-width: 0; margin: 0; font-size: 1em; line-height: 1.4; font-weight: 600; overflow-wrap: anywhere; }
.subpanel-head button { margin-left: 0; flex: 0 0 auto; }

/* Settings and help. One row per knob: what it is, what it does, and the control
   — because the alternative was a list of command-palette entries with no way to
   see what any of them were set to. */
.set-group {
  font-size: 10px; text-transform: uppercase; letter-spacing: .06em;
  color: var(--vscode-descriptionForeground); margin: 12px 0 4px;
}
.set-group:first-child { margin-top: 2px; }
.set-row { display: flex; gap: 8px; align-items: flex-start; padding: 7px 0; border-top: 1px solid var(--vscode-panel-border, rgba(128,128,128,.22)); }
.set-group + .set-row { border-top: 0; }
.set-label { flex: 0 0 86px; font-size: 11px; font-weight: 600; padding-top: 3px; }
.set-main { flex: 1 1 auto; min-width: 0; }
.set-note { color: var(--vscode-descriptionForeground); font-size: 10.5px; line-height: 1.45; margin-top: 3px; }
.set-actions { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
.set-actions button { margin: 0; }
.set-inline { display: flex; gap: 4px; }
.set-inline input { flex: 1 1 auto; min-width: 0; }
.set-inline input[type="number"] { flex: 0 0 78px; }
.set-check { display: flex; align-items: center; gap: 6px; font-size: 11px; }
.set-check input { flex: 0 0 auto; }
#settings-body { max-height: 340px; overflow-y: auto; }
.subpanel .row { display: flex; gap: 6px; margin-bottom: 5px; }
.subpanel .row input { flex: 1; }
.muted.warn { color: var(--vscode-charts-yellow, #ca9c2e); }

#search-results { max-height: 180px; overflow-y: auto; }
.search-row { padding: 4px 6px; border-radius: 4px; cursor: pointer; }
.search-row:hover { background: var(--vscode-list-hoverBackground, rgba(128,128,128,.15)); }
.search-row .search-title { font-size: 11.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.search-row .search-snippet { font-size: 10.5px; color: var(--vscode-descriptionForeground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.inspector-list { max-height: 220px; overflow-y: auto; font-family: var(--vscode-editor-font-family, monospace); font-size: 10.5px; }
.insp-row { display: flex; gap: 6px; padding: 1.5px 4px; cursor: copy; border-radius: 3px; align-items: baseline; }
.insp-row:hover { background: var(--vscode-list-hoverBackground, rgba(128,128,128,.15)); }
.insp-row.copied { background: var(--vscode-list-activeSelectionBackground, rgba(90,160,255,.25)); }
.insp-seq { color: var(--vscode-descriptionForeground); flex: 0 0 26px; text-align: right; }
.insp-time { color: var(--vscode-descriptionForeground); flex: 0 0 62px; }
.insp-kind { color: var(--vscode-charts-blue, #4aa3ff); flex: 0 0 auto; }
.insp-summary { color: var(--vscode-foreground, inherit); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Keep long text inside the sidebar; intentional wide content scrolls locally. */
.ws-name, .model-note, .set-note { overflow-wrap: anywhere; }
.tool .t-head { flex-wrap: wrap; }
.tool .t-title { min-width: 0; overflow-wrap: anywhere; }
.tool .t-name { max-width: 100%; overflow-wrap: anywhere; }
#input-area { min-width: 0; }
.subpanel .row input { min-width: 0; }
.set-inline { flex-wrap: wrap; }
.input-row { flex-wrap: wrap; }
@media (max-width: 360px) {
  .brand-bar { gap: 6px; }
  .brand-bar .toolbar { width: 100%; justify-content: flex-end; }
  #messages { padding: 8px; gap: 10px; }
  .msg { padding: 8px; }
  .subpanel { margin-right: 8px; margin-left: 8px; padding: 8px; }
  .set-row { flex-wrap: wrap; gap: 4px; }
  .set-label { flex-basis: 100%; padding-top: 0; }
  .set-main { flex-basis: 100%; }
  .subpanel .row { flex-wrap: wrap; }
  .subpanel .row input { flex-basis: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .dot.connecting, .cursor { animation: none; }
}
`
