// esbuild bundler for the VS Code extension.
// Two outputs: the extension host bundle (Node, CJS for VS Code <1.99 compat) and a stripped spike build.
import esbuild from 'esbuild'
import { copyFile, mkdir } from 'node:fs/promises'

// Browser-only assets: copied at build time, never imported by the Node bundle.
// Keep the CSS beside its font so codicon.css's relative URL works in a webview.
await mkdir('media/codicons', { recursive: true })
for (const [source, target] of [
  ['@highlightjs/cdn-assets/highlight.min.js', 'highlight.min.js'],
  ['@highlightjs/cdn-assets/LICENSE', 'highlight.LICENSE'],
  ['@vscode/codicons/dist/codicon.css', 'codicons/codicon.css'],
  ['@vscode/codicons/dist/codicon.ttf', 'codicons/codicon.ttf'],
  ['@vscode/codicons/LICENSE', 'codicons/LICENSE'],
  ['@vscode/codicons/LICENSE-CODE', 'codicons/LICENSE-CODE'],
]) {
  await copyFile('node_modules/' + source, 'media/' + target)
}

const production = process.argv.includes('--production')
const watch = process.argv.includes('--watch')

/** @type {import('esbuild').BuildOptions} */
const extensionOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  sourcemap: !production,
  minify: production,
  external: ['vscode'],
  logLevel: 'info',
  legalComments: 'none',
}

if (watch) {
  const ctx = await esbuild.context(extensionOptions)
  await ctx.watch()
  console.log('[esbuild] watching...')
} else {
  await esbuild.build(extensionOptions)
  console.log('[esbuild] built dist/extension.js')
}
