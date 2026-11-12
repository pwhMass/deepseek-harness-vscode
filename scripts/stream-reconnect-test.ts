/** Offline RC2 reconnect/search regression. No Host, credentials, or model API.
 * Uses RC2's real dsh-llm accumulator to construct its compact stream, and the
 * production HarnessClient → EventBuffer → ConversationModel projection path.
 * Run: npx tsx scripts/stream-reconnect-test.ts [RC2 node_modules/@deepseek-ai]
 */
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { HarnessClient } from '../src/harness/client.ts'
import { BrowserSessionAuth } from '../src/harness/auth.ts'
import { EventBuffer } from '../src/harness/events.ts'
import { ConversationModel } from '../src/conversation/model.ts'
import type { MuxFrame, SessionFollowFrame, StreamChunk } from '../src/harness/protocol.ts'

async function main(): Promise<void> {
const root = process.argv[2] ?? (process.env.DSH_TEST_RUNTIME
  ? resolve(process.env.DSH_TEST_RUNTIME, 'node_modules/@deepseek-ai') : undefined)
assert.ok(root, 'Pass the RC2 node_modules/@deepseek-ai directory as argv[2], or set DSH_TEST_RUNTIME to its npm prefix; no Host is started.')
const { AssistantStreamAccumulator } = await import(pathToFileURL(resolve(root, 'dsh-llm/lib/index.js')).href)
const auth = new BrowserSessionAuth({ host: '127.0.0.1', port: 1,
  store: { load: async () => undefined, save: async () => {} }, log: () => {}, allowLocalMint: false })
const client = new HarnessClient({ host: '127.0.0.1', port: 1, auth, log: () => {} })
const model = new ConversationModel('s')
const buffer = new EventBuffer((frames) => {
  for (const raw of frames) {
    const frame = raw as MuxFrame
    if (frame.type === 'session/event') model.applyEvent(frame.event as never)
    if (frame.type === 'assistant/stream') model.applyStreamChunk(frame.turn as number, frame.step as number, frame.chunk as StreamChunk)
  }
}, 60_000)
// Only the transport ingress is injected; the parsing/replay/fold are production.
const ingress = client as unknown as {
  activeSink: { sessionId: string; buffer: EventBuffer }
  onFollowFrame(sessionId: string, frame: SessionFollowFrame): void
}
ingress.activeSink = { sessionId: 's', buffer }
const deliver = (frame: unknown) => { ingress.onFollowFrame('s', frame as SessionFollowFrame); buffer.flushNow() }
const accumulator = new AssistantStreamAccumulator()
let nextIndex = 0
let revision = 1
const push = (chunk: StreamChunk) => {
  accumulator.push({ time: 100 + nextIndex, chunk })
  return { type: 'assistant-stream', frame: { type: 'chunk', attemptId: 'a', revision: ++revision, index: nextIndex++, time: 100, chunk } }
}
const baseline = () => ({ type: 'snapshot', header: { id: 's' }, cursor: 0, records: [], hasMore: false,
  assistantStream: { revision, activeAttempt: { attemptId: 'a', startedAfterSeq: 0,
    turn: 1, step: 1, nextIndex, stream: accumulator.snapshot() } } })
const assistant = () => model.snapshot().items.filter(item => item.kind === 'assistant')

// Attach after start: no start frame has been received by this client.
push({ type: 'block-start', index: 0, blockType: 'reasoning' })
push({ type: 'reasoning-delta', index: 0, text: 'think ' })
push({ type: 'reasoning-delta', index: 0, text: 'carefully' })
push({ type: 'text-delta', index: 1, text: 'hello' })
// Non-text compact records still consume chunk indexes.
push({ type: 'tool-call-delta', index: 2, id: 'tool-1', name: 'read', argumentsDelta: '{' })
push({ type: 'tool-call-delta', index: 2, id: 'tool-1', name: 'read', argumentsDelta: '}' })
deliver(baseline())
assert.equal(assistant().length, 1)
assert.equal(assistant()[0]?.text, 'hello')
assert.equal(assistant()[0]?.reasoning, 'think carefully')

// Same sink after socket loss: baseline fills only the missed suffix.
deliver(push({ type: 'text-delta', index: 1, text: ' live' }))
const missed = push({ type: 'text-delta', index: 1, text: ' missed' })
deliver(baseline())
assert.equal(assistant()[0]?.text, 'hello live missed')
deliver(baseline())
deliver(missed) // old queued duplicate after the baseline cut
assert.equal(assistant()[0]?.text, 'hello live missed')
deliver(push({ type: 'text-delta', index: 1, text: ' resumed' }))
assert.equal(assistant()[0]?.text, 'hello live missed resumed')
assert.equal(assistant().length, 1)

// Durable settlement is authoritative even if a stale baseline is seen later.
deliver({ type: 'event', event: { type: 'assistant/message', seq: 1, time: 200, data: {
  turn: 1, step: 1, message: { role: 'assistant', content: [{ type: 'text', text: 'final' }] },
} } })
deliver(baseline())
assert.equal(assistant().length, 1)
assert.equal(assistant()[0]?.text, 'final')
assert.equal(assistant()[0]?.streaming, false)

// A new subscription starts without previous delivery counters or model state.
client.dispose()
buffer.dispose()
const freshClient = new HarnessClient({ host: '127.0.0.1', port: 1, auth, log: () => {} })
const freshModel = new ConversationModel('s')
const freshBuffer = new EventBuffer(frames => {
  for (const raw of frames) {
    const f = raw as { type: string; turn: number; step: number; chunk: StreamChunk }
    if (f.type === 'assistant/stream') freshModel.applyStreamChunk(f.turn, f.step, f.chunk)
  }
}, 60_000)
const fresh = freshClient as unknown as typeof ingress
fresh.activeSink = { sessionId: 's', buffer: freshBuffer }
const bad = baseline()
bad.assistantStream.activeAttempt.nextIndex++
fresh.onFollowFrame('s', bad as unknown as SessionFollowFrame)
freshBuffer.flushNow()
assert.equal(freshModel.snapshot().items.length, 0, 'incomplete baseline must not partially replay')
fresh.onFollowFrame('s', baseline() as unknown as SessionFollowFrame)
freshBuffer.flushNow()
assert.equal((freshModel.snapshot().items[0] as { text: string }).text, 'hello live missed resumed')

// Search RC2 shape from session-controller typert.remote-client.js SessionSearchValue:
// {items: [{sessionId, snippet}], hasMore: boolean}. Keep legacy shape working.
const rpc = freshClient as unknown as { rpc(method: string, request: unknown): Promise<unknown> }
const items = [{ sessionId: 's', snippet: 'matched content' }]
rpc.rpc = async (method, request) => {
  assert.equal(method, 'session/search')
  assert.deepEqual(request, { query: 'matched' })
  return { items, hasMore: true }
}
assert.deepEqual(await freshClient.searchSessions('matched'), { results: items })
rpc.rpc = async () => ({ items: [], hasMore: false })
assert.deepEqual(await freshClient.searchSessions('none'), { results: [] })
const legacy = { results: items, total: 1 }
rpc.rpc = async () => legacy
assert.deepEqual(await freshClient.searchSessions('matched'), legacy)
freshClient.dispose()
freshBuffer.dispose()
console.log('RC2 active snapshot, compact chunk indexes, reconnect suffix, duplicate suppression, durable settlement, malformed baseline, fresh subscription, and search shape: passed')
}

main().catch(error => { console.error(error); process.exitCode = 1 })
