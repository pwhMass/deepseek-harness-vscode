/** Isolated real-Host compatibility smoke test. No user home, credentials or model network.
 * DSH_TEST_RUNTIME=/path/to/npm-prefix TMPDIR=/large/temp npx tsx scripts/rc2-live-test.ts
 * Starts only a temporary loopback Host on an OS-assigned port; always stops it.
 */
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { BrowserSessionAuth } from '../src/harness/auth.ts'
import { HarnessClient } from '../src/harness/client.ts'
import { ConversationModel } from '../src/conversation/model.ts'

async function main() {
const runtime = process.env.DSH_TEST_RUNTIME
assert(runtime, 'set DSH_TEST_RUNTIME to an isolated npm prefix containing @deepseek-ai/dsh@0.2.2-rc.2')
const modules = join(resolve(runtime), 'node_modules', '@deepseek-ai')
const pkg = JSON.parse(readFileSync(join(modules, 'dsh/package.json'), 'utf8'))
assert.equal(pkg.version, '0.2.2-rc.2')
const root = mkdtempSync(join(tmpdir(), 'dsh-rc2-live-'))
const home = join(root, 'home'), cwd = join(root, 'workspace')
mkdirSync(home); mkdirSync(cwd)
const fixture = join(root, 'fixture.mjs')
// A deterministic in-process adapter. The real Host, RPC, journal, mux and model folding
// remain production code. Only the upstream model is replaced; no keys or external calls.
const gate = join(root, 'continue-stream')
writeFileSync(fixture, `import { existsSync } from 'node:fs';
import { LlmAdapter } from ${JSON.stringify(pathToFileURL(join(modules, 'dsh-llm/lib/index.js')).href)};
export const inject = ['llm'];
export function apply(ctx) {
 class Fixture extends LlmAdapter {
  async listModels(provider) { return [{provider,id:'fixture',name:'Fixture',inputModalities:['text','image']}]; }
  async resolveModel(provider,id) { return {provider,id,name:'Fixture',inputModalities:['text','image'],contextWindow:32768}; }
  async *stream(options) {
   yield {type:'block-start',index:0,blockType:'text'};
   yield {type:'text-delta',index:0,text:'rc2-live '};
   const deadline=Date.now()+20000;
   while(!existsSync(${JSON.stringify(gate)}) && !options.signal?.aborted && Date.now()<deadline) await new Promise(r=>setTimeout(r,25));
   yield {type:'text-delta',index:0,text:'pong'};
   yield {type:'block-end',index:0,block:{type:'text',text:'rc2-live pong'}};
   yield {type:'usage',usage:{inputTokens:1,outputTokens:2}};
   yield {type:'finish',reason:{kind:'stop'}};
  }
 }
 ctx.llm.registerAdapter(['rc2-fixture'],new Fixture());
}
`)
const patch = join(root, 'test.patch.yml')
writeFileSync(patch, `- insert:\n    - id: rc2-fixture\n      name: ${JSON.stringify(fixture)}\n- id: agent-default-model\n  config:\n    provider: rc2-fixture\n    model: fixture\n- id: session-title-llm\n  disabled: true\n- id: llm-deepseek\n  disabled: true\n- id: llm-deepseek-account\n  disabled: true\n- id: session-query-sqlite\n  config:\n    path: ':memory:'\n    openAt: first-search\n`)
// Deliberately do not forward arbitrary environment or any model credential.
const env: NodeJS.ProcessEnv = Object.fromEntries(
 ['PATH','HOME','TMPDIR','TEMP','TMP','SystemRoot'].flatMap(k => process.env[k] ? [[k,process.env[k]]] : []),
)
env.DSH_HOME = home
console.log('Starting isolated RC2 Host; waiting for its loopback launch URL...')
let output = ''
const child = spawn(process.execPath, [join(modules,'dsh/lib/bin.js'),'--profile','web','--patch',patch,'--port','0'], {cwd,env,stdio:['ignore','pipe','pipe']})
const stopChild = () => { child.kill('SIGTERM') }
process.once('exit',stopChild)
process.once('SIGTERM',stopChild)
process.once('SIGINT',stopChild)
let launchResolve: (url:string)=>void, launchReject: (e:Error)=>void
const launched = new Promise<string>((res,rej) => {launchResolve=res;launchReject=rej})
const timer = setTimeout(() => launchReject(new Error('Host startup timed out: '+output.replace(/\?token=[^\s]+/g,'?token=[redacted]'))),180_000)
for (const stream of [child.stdout,child.stderr]) stream.on('data', b => {
 output += b.toString()
 const url = output.match(/http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9_-]+/)?.[0]
 if (url) launchResolve(url)
})
child.on('exit',(code)=>launchReject(new Error('Host exited '+code+': '+output.replace(/\?token=[^\s]+/g,'?token=[redacted]'))))
let client: HarnessClient | undefined
let peer: HarnessClient | undefined
let checks=0
function check(name:string, condition:unknown) { assert(condition,name); console.log('✓ '+(++checks)+' '+name) }
async function until(predicate:()=>boolean, label:string) {
 const end=Date.now()+15000
 while (!predicate()) { if(Date.now()>end) throw new Error('timeout: '+label); await new Promise(r=>setTimeout(r,25)) }
}
try {
 const launch = await launched; clearTimeout(timer)
 const port=Number(new URL(launch).port)
 console.log('Real DSH '+pkg.version+' at http://127.0.0.1:'+port+' (isolated test only)')
 const auth = new BrowserSessionAuth({host:'127.0.0.1',port,store:{load:async()=>undefined,save:async()=>{}},log:()=>{}})
 await auth.adoptLaunchUrl(launch)
 check('launch-token authentication',auth.isReady())
 client = new HarnessClient({host:'127.0.0.1',port,auth,log:()=>{}})
 await client.connect()
 check('connect and $events ready',client.getState().kind==='connected')
 const ws=(await client.createWorkspace(cwd)).workspace
 const session=(await client.createSession({workspaceId:ws.workspaceId})).sessionId
 check('workspace and session creation',typeof session==='string')
 const catalog=await client.modelCatalog()
 check('model catalog',catalog.groups.some(g=>g.id==='rc2-fixture' && g.models.some(m=>m.id==='fixture')))
 await client.selectModel(session,'rc2-fixture','fixture')
 const model=new ConversationModel(session)
 let ended=false, streamed=false, subscribed=false
 const sub=client.subscribe(session,frames=>{
  for(const f of frames) {
   const frame=f as any
   if(frame.type==='session/subscribed') subscribed=true
   if(frame.type==='session/event' && frame.event) {subscribed=true; model.applyEvent(frame.event); if(frame.event.type==='turn/end') ended=true}
   if(frame.type==='assistant/stream') {model.applyStreamChunk(frame.turn,frame.step,frame.chunk);streamed=true}
  }
 })
 await until(()=>subscribed,'follow snapshot')
 let history=await client.getHistory(session,{maxMessages:50})
 check('model selection is durable',history.events.some(e=>e.event.type==='model/selection'))
 peer=new HarnessClient({host:'127.0.0.1',port,auth,log:()=>{}})
 await peer.connect()
 await client.prompt(session,'rc2-compat-unique-search-marker','UTC')
 await until(()=>streamed,'first live delta')
 const peerModel=new ConversationModel(session)
 const peerSub=peer.subscribe(session,frames=>{
  for(const raw of frames) {
   const f=raw as any
   if(f.type==='session/event') peerModel.applyEvent(f.event)
   if(f.type==='assistant/stream') peerModel.applyStreamChunk(f.turn,f.step,f.chunk)
  }
 })
 await until(()=>peerModel.snapshot().items.some(i=>i.kind==='assistant' && i.streaming && i.text==='rc2-live '),'active snapshot baseline in second client')
 check('second client attaches mid-turn and restores active text',true)
 writeFileSync(gate,'continue')
 await until(()=>ended,'turn/end')
 await until(()=>peerModel.snapshot().items.some(i=>i.kind==='assistant' && !i.streaming && i.text==='rc2-live pong'),'second client durable settlement')
 check('same session in two clients converges without duplicated text',peerModel.snapshot().items.filter(i=>i.kind==='assistant').length===1)
 peerSub.dispose()
 check('live assistant stream',streamed)
 check('durable assistant message folded',model.snapshot().items.some(i=>i.kind==='assistant' && i.text.includes('rc2-live pong')))
 history=await client.getHistory(session,{maxMessages:50})
 check('session/page history reload',history.events.some(e=>e.event.type==='assistant/message'))
 const search=await client.searchSessions('rc2-compat-unique-search-marker')
 check('session/search results reach UI shape',search.results?.some(r=>r.sessionId===session))
 const staged=await client.uploadFile(session,'fixture.txt',new TextEncoder().encode('compatibility fixture'))
 check('binary upload receipt',typeof staged.receiptId==='string')
 ended=false
 await client.prompt(session,'receipt round trip','UTC',{files:[{receiptId:staged.receiptId as string}]})
 await until(()=>ended,'attachment turn/end')
 check('staged file prompt accepted',ended)
 const renamed=await client.renameSession(session,'RC2 compatibility fixture')
 check('rename session',renamed.title==='RC2 compatibility fixture')
 check('session listing',(await client.listSessions()).items.some(s=>s.sessionId===session))
 sub.dispose()
 console.log('PASS: '+checks+' real-Host checks. Test data retained at '+root+'; no production service touched.')
} finally {
 clearTimeout(timer)
 client?.dispose()
 peer?.dispose()
 child.kill('SIGTERM')
 await new Promise<void>(resolve=>{
  if(child.exitCode!==null || child.signalCode!==null) return resolve()
  const kill=setTimeout(()=>child.kill('SIGKILL'),5000)
  child.once('exit',()=>{clearTimeout(kill);resolve()})
 })
}
}
main().catch(error=>{ console.error(error); process.exitCode=1 })
