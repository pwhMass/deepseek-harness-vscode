# Webview third-party assets

These assets are loaded locally in the sidebar webview, not executed in the VS Code extension host. `npm run build` copies the pinned development dependencies into `media/`.

- **highlight.js 11.12.0** — https://highlightjs.org/ / https://github.com/highlightjs/highlight.js. The common browser build is copied from `@highlightjs/cdn-assets/highlight.min.js`, unmodified. Copyright and BSD-3-Clause license: [highlight.LICENSE](highlight.LICENSE).
- **VS Code Codicons 0.0.46-24** — https://github.com/microsoft/vscode-codicons. The CSS and font are copied unmodified from `@vscode/codicons/dist/`. Icons/font: **CC BY 4.0**, copyright Microsoft Corporation; see [codicons/LICENSE](codicons/LICENSE). Code: **MIT**; see [codicons/LICENSE-CODE](codicons/LICENSE-CODE). Inclusion in this extension does not imply endorsement by Microsoft.

No fixed-color highlight.js theme is used. Syntax-token colors come from the active VS Code theme variables in the webview stylesheet.
