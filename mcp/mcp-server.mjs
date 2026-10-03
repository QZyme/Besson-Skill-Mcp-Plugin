// 北山Besson 教程检索 MCP 服务器
// 用法：
//   stdio（默认）: node mcp-server.mjs
//   HTTP        : node mcp-server.mjs --http   （环境变量 PORT，默认 3987）
// 数据：默认读取 ../tools/index_data.json（仓库根目录），可用环境变量 BESSON_DATA_PATH 覆盖。
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── 数据加载 ──────────────────────────────────────────────────────────────
function loadData() {
  const candidates = [
    process.env.BESSON_DATA_PATH,
    join(__dirname, '..', 'tools', 'index_data.json'),
    join(__dirname, 'index_data.json'),
  ];
  for (const p of candidates) {
    if (!p) continue;
    try {
      return JSON.parse(readFileSync(resolve(p), 'utf8'));
    } catch (e) { /* 继续尝试下一个 */ }
  }
  throw new Error('找不到教程索引数据：请设置 BESSON_DATA_PATH 或在仓库中保留 tools/index_data.json');
}

const DATA = loadData();
const SITE = DATA.site || 'https://beishanair.github.io/';

const JAVA = { A: 'Java 17', B: 'Java 21', C: 'Java 17', D: 'Java 21', E: 'Java 25', F: 'Java 25' };
const GAPS = { A: [], B: ['54（本站无 #54）'], C: ['22-27（未发布）'], D: ['13-24（未发布）'], E: [], F: ['全系列待开'] };

// ── 检索逻辑（与 dsh-plugin/besson-tools.mjs 一致）────────────────────────
function buildSearchIndex() {
  const items = [];
  for (const s of DATA.series) {
    for (const c of s.chapters || []) {
      items.push({
        kind: 'chapter', series: s.id, seriesName: s.name, loader: s.loader || '',
        mc: s.mc || '', java: JAVA[s.id] || '', chapter: c.n, title: c.title, url: c.url,
        haystack: [s.id, s.name, s.loader, s.mc, c.n, c.title].join(' ').toLowerCase(),
      });
    }
  }
  for (const a of DATA.standalones) {
    items.push({
      kind: 'article', series: '', seriesName: '其他独立文章', loader: '', mc: '', java: '',
      chapter: '', title: a.title, url: a.url,
      haystack: [a.title].join(' ').toLowerCase(),
    });
  }
  return items;
}
const INDEX = buildSearchIndex();

function tokenize(q) {
  return q.toLowerCase()
    .replace(/[、，。；：·&+（）()"'\-—_|/\\]/g, ' ')
    .split(/\s+/).map((t) => t.trim()).filter((t) => t.length > 0);
}

function search(query, limit) {
  const tokens = tokenize(String(query || ''));
  const lim = Math.max(1, Math.min(25, Number.isFinite(limit) ? Math.floor(limit) : 8));
  if (tokens.length === 0) return { matched: [], total: 0, hint: '请输入查询关键词' };
  const scored = [];
  for (const it of INDEX) {
    const t = it.haystack;
    let hits = 0, weight = 0, phraseHit = false;
    for (const tok of tokens) {
      if (t.includes(tok)) {
        hits += 1;
        weight += tok.length;
        if (/^[a-f]$/.test(tok) && it.series.toLowerCase() === tok) weight += 4;
        if (String(it.chapter) === tok) weight += 12;
        if (/^\d+$/.test(tok) && String(it.chapter).startsWith(tok)) weight += 6;
      }
    }
    if (it.title.toLowerCase().includes(tokens.join(' '))) { phraseHit = true; weight += 20; }
    if (hits > 0) scored.push({ item: it, hits, weight, phraseHit });
  }
  scored.sort((a, b) => (b.hits - a.hits) || (b.weight - a.weight) || (b.phraseHit ? 1 : 0) - (a.phraseHit ? 1 : 0));
  return {
    matched: scored.slice(0, lim).map(({ item }) => ({
      kind: item.kind, series: item.series, seriesName: item.seriesName, loader: item.loader,
      mc: item.mc, java: item.java, chapter: item.chapter, title: item.title, url: item.url,
    })),
    total: scored.length,
  };
}

function seriesMeta(id) {
  const s = DATA.series.find((x) => x.id === id);
  if (!s) return null;
  return {
    id: s.id, name: s.name, loader: s.loader || '', mc: s.mc || '', java: JAVA[id] || '',
    tag: s.tag || '',
    status: (s.chapters || []).length > 0 ? (id === 'B' ? '完整' : '进行中') : '待开',
    gaps: GAPS[id] || [], chapters: (s.chapters || []).length,
  };
}

function text(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}

function dateOf(url) {
  const m = String(url).match(/\/20(\d\d)\/(\d\d)\/(\d\d)\//);
  return m ? `20${m[1]}/${m[2]}/${m[3]}` : '';
}

// ── 正文抓取与提取（besson_tutorial_fetch 使用）───────────────────────────
function htmlToText(html) {
  const container = html.match(/<article[\s>][\s\S]*?<\/article>/i)
    || html.match(/<main[\s>][\s\S]*?<\/main>/i)
    || html.match(/<div[^>]*class="[^"]*(?:post-content|entry-content|page-content)[^"]*"[\s>][\s\S]*?<\/div>/i);
  const frag = container ? container[0] : html;
  return frag
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(?:h[1-6])[^>]*>/gi, '\n\n## ')
    .replace(/<p[^>]*>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<pre[^>]*>/gi, '\n\n```\n')
    .replace(/<\/pre>/gi, '\n```\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&#x2F;/g, '/')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function fetchArticle(url) {
  const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
  if (!r.ok) return { error: `HTTP ${r.status}` };
  const html = await r.text();
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1]?.trim() || '';
  return { title, text: htmlToText(html), bytes: html.length };
}

// ── MCP 服务 ──────────────────────────────────────────────────────────────
const server = new McpServer({
  name: 'besson-tutorials-mcp',
  version: '1.1.1',
});

server.registerTool('besson_tutorial_lookup', {
  title: '检索北山Besson 教程章节',
  description: '在 BeiShan_Besson（北山Besson）的 Minecraft 模组开发教程站（' + SITE + '）中检索教程章节。' +
    '站内系列：A=Fabric 1.20.1（Java 17）、B=Fabric 1.21.X（Java 21）、C=Forge 1.20.1（Java 17）、D=NeoForge 1.21.1（Java 21）、E=Fabric 26.1（Java 25）、F=NeoForge 26.1（待开）。' +
    '输入关键词（例如："NeoForge 生物群系"、"Fabric 1.20.1 流体"、"附魔"、"粒子"、"D 44"），返回匹配章节的标题与链接，并可用 limit 控制返回条数。',
  inputSchema: {
    query: z.string().describe('检索关键词，可组合使用：系列字母（A-F）、Loader、MC 版本、章节号、主题词'),
    limit: z.number().int().min(1).max(25).optional().describe('最多返回的匹配条数（1-25，默认 8）'),
  },
}, async ({ query, limit }) => {
  const r = search(query, limit);
  const lines = [`「${query}」在 北山Besson 教程站 中共命中 ${r.total} 条，展示前 ${r.matched.length} 条：`];
  if (r.matched.length === 0) lines.push('未命中任何章节，建议换关键词，或调用 besson_tutorial_index 查看系列总览');
  for (const m of r.matched) {
    const label = m.series ? `[${m.series} ${m.seriesName} #${m.chapter} / ${m.java}]` : '[独立文章]';
    lines.push(`${label} ${m.title} — ${m.url}`);
  }
  return text({ query: String(query), total: r.total, matched: r.matched, note: lines.join('\n') });
});

server.registerTool('besson_tutorial_index', {
  title: '北山Besson 教程系列总览',
  description: '查看教程站六大系列总览：MC 版本、Java、章节数量、状态与缺号，以及独立文章、教程总汇页和生态现状（当前 MC 26.2、Fabric Loader 0.19.3）。不需要参数，直接调用。',
  inputSchema: {},
}, async () => text({
  site: DATA.site, author: DATA.author, synced: DATA.synced, totalArticlesOnSite: 195,
  series: DATA.series.map((s) => seriesMeta(s.id)),
  standalones: DATA.standalones,
  tutorialIndexPage: SITE + '2099/12/31/sum/',
  ecosystem: {
    currentMinecraft: '26.2（正式版；26.1.1/26.1.2 已发布，26.3 快照开发中）',
    fabricLoader: '0.19.3',
    neoforge261: '官方已适配（2026-03）但教程站 F 系列待开',
    note: '教程总汇页（sum）部分章节列表滞后，以实际文章为准',
  },
}));

server.registerTool('besson_tutorial_series', {
  title: '北山Besson 单系列全部章节',
  description: '列出教程站某个系列（A-F）的全部章节（章节号、标题、日期、链接）与系列元信息（Loader、MC 版本、Java、状态、缺号）。',
  inputSchema: {
    series: z.string().describe('系列标识：字母 A-F，或名称关键词（fabric 1.20.1 / fabric 1.21 / forge / neoforge / 26.1）'),
  },
}, async ({ series }) => {
  const key = String(series || '').trim().toLowerCase();
  let s = DATA.series.find((x) => x.id.toLowerCase() === key);
  if (!s) {
    s = DATA.series.find((x) => [x.id, x.name, x.loader, x.mc].join(' ').toLowerCase().includes(key));
  }
  if (!s) {
    return text({ error: `未找到系列「${series}」。可用：A=Fabric 1.20.1, B=Fabric 1.21.X, C=Forge 1.20.1, D=NeoForge 1.21.1, E=Fabric 26.1, F=NeoForge 26.1` });
  }
  return text({
    meta: seriesMeta(s.id),
    chapters: (s.chapters || []).map((c) => ({ chapter: c.n, date: dateOf(c.url), title: c.title, url: c.url })),
  });
});

server.registerTool('besson_tutorial_fetch', {
  title: '抓取北山Besson 教程正文',
  description: '抓取教程站一篇文章的正文。直接传 url（来自 lookup/series/index 返回的链接）即可抓取；' +
    '或只传 query，将按本地索引自动解析最匹配的一篇再抓取。返回标题与正文纯文本（含代码块、图片为引用链接）。' +
    '正文可能较长，可用 maxChars 控制返回长度。',
  inputSchema: {
    url: z.string().optional().describe('教程文章 URL（仅限 beishanair.github.io 站点内）'),
    query: z.string().optional().describe('检索关键词，未提供 url 时用于自动解析最匹配的一篇'),
    maxChars: z.number().int().min(200).max(30000).optional().describe('正文最长返回字符数（默认 6000）'),
  },
}, async ({ url: urlArg, query, maxChars }) => {
  const cap = Math.max(200, Math.min(30000, Number.isFinite(maxChars) ? Math.floor(maxChars) : 6000));
  let target = String(urlArg || '').trim();
  let resolved = null;
  if (!target) {
    const q = String(query || '').trim();
    if (!q) return text({ error: '至少要提供 url 或 query 之一' });
    const r = search(q, 1);
    if (!r.matched.length) return text({ error: `未按「${q}」解析到教程，请先调用 besson_tutorial_lookup` });
    resolved = r.matched[0];
    target = resolved.url;
  }
  if (!/^https?:\/\/beishanair\.github\.io\/.*/.test(target)) {
    return text({ error: '仅支持本站（beishanair.github.io）内的教程链接', url: target });
  }
  try {
    const art = await fetchArticle(target);
    if (art.error) return text({ error: art.error, url: target });
    return text({
      url: target,
      ...(resolved ? { resolvedFrom: `「${query}」→ [${resolved.series} ${resolved.seriesName} #${resolved.chapter}] ${resolved.title}` } : {}),
      title: art.title,
      bytes: art.bytes,
      chars: art.text.length,
      text: art.text.slice(0, cap),
      truncated: art.text.length > cap,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    return text({ error: '抓取失败: ' + ((e && e.message) || e), url: target });
  }
});

// ── 传输 ──────────────────────────────────────────────────────────────────
const httpMode = process.argv.includes('--http');

if (httpMode) {
  const port = Number(process.env.PORT || 3987);
  const transports = new Map();
  const httpServer = createServer(async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    let transport = sessionId ? transports.get(sessionId) : undefined;
    const isNew = !transport;
    if (!transport) {
      transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => randomUUID() });
      await server.connect(transport);
    }
    try {
      await transport.handleRequest(req, res, req.body);
      if (isNew && transport.sessionId) transports.set(transport.sessionId, transport);
    } catch (err) {
      if (!res.headersSent) res.writeHead(500).end(String((err && err.message) || err));
      else res.end();
    }
  });
  httpServer.listen(port, () => {
    console.error(`besson-tutorials-mcp HTTP 模式已启动：http://127.0.0.1:${port}/mcp`);
  });
} else {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('besson-tutorials-mcp stdio 模式已启动');
}
