// HTTP 模式冒烟测试：启动服务器 → initialize → tools/list → tools/call → 退出
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 39871;
const child = spawn(process.execPath, [__dirname + '/mcp-server.mjs', '--http'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'ignore', 'inherit'],
});

const base = `http://127.0.0.1:${PORT}/mcp`;
await new Promise((r) => setTimeout(r, 1500));

async function rpc(sessionId, body) {
  const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };
  if (sessionId) headers['mcp-session-id'] = sessionId;
  const res = await fetch(base, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  return { status: res.status, session: res.headers.get('mcp-session-id'), text };
}

try {
  const init = await rpc(null, {
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '0.0.1' } },
  });
  console.log('initialize ->', init.status, 'session:', init.session ? 'OK' : '无');
  const tools = await rpc(init.session, { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
  console.log('tools/list ->', tools.status, tools.text.includes('besson_tutorial_lookup') ? '包含 3 工具 ✓' : tools.text.slice(0, 200));
  const call = await rpc(init.session, {
    jsonrpc: '2.0', id: 3, method: 'tools/call',
    params: { name: 'besson_tutorial_lookup', arguments: { query: '附魔' } },
  });
  console.log('tools/call ->', call.status, call.text.includes('enchantment') ? '返回正确结果 ✓' : call.text.slice(0, 300));
} catch (e) {
  console.log('HTTP 测试失败:', e.message);
} finally {
  child.kill();
  process.exit(0);
}