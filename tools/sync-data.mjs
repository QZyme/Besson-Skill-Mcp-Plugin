// 北山Besson 教程数据同步脚本
// 用法：node tools/sync-data.mjs
// 作用：从 https://beishanair.github.io/ 重新抓取全部文章，重建教程索引，
//       并把数据注入 dsh-plugin/besson-tools.mjs（就地更新 DATA 字面量），
//       同时输出 index_data.json 供人工核对。
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const MODULE_PATH = process.env.MODULE_OUT || join(REPO_ROOT, 'dsh-plugin', 'besson-tools.mjs');
const OUT_JSON = process.env.JSON_OUT || join(__dirname, 'index_data.json');

const SITE = 'https://beishanair.github.io';
const SERIES_DIR = { '120': 'A', '121': 'B', 'f120': 'C', 'nf121': 'D', 'fa261': 'E' };
const STANDALONES = new Map([
  ['/2024/07/13/121/first-blog/', '开篇（博客第一篇文章）'],
  ['/2024/09/04/faq/', 'FAQ（常见问题，全版本通用）'],
  ['/2025/02/19/120/120/', '前言 1.20 Fabric 长线教程计划'],
  ['/2025/07/20/particle/', 'Python × Minecraft 粒子特效教程'],
]);

async function get(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
      if (r.status !== 200) return null;
      return await r.text();
    } catch (e) {
      if (i === retries) return null;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  return null;
}

function postLinks(html) {
  const re = /<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gs;
  const out = new Set();
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (/^\/20\d\d\//.test(href)) out.add(SITE + href.split('#')[0]);
  }
  return out;
}

async function collectPostUrls() {
  const urls = new Set();
  // 归档页：分页直到连续多次失败（404 或网络故障），避免瞬时超时提前中断
  let fails = 0;
  for (let p = 1; p <= 30 && fails < 3; p++) {
    const t = await get(`${SITE}/archives/${p === 1 ? '' : `page/${p}/`}`);
    if (!t) { fails += 1; continue; }
    fails = 0;
    for (const u of postLinks(t)) urls.add(u);
    await new Promise((r) => setTimeout(r, 120));
  }
  // 标签页兜底
  const tags = ['Fabric', 'Fabric-1-20', 'Fabric-1-21', 'Forge', 'Forge-1-20-1', 'NeoForge', 'NeoForge-1-21-1', 'Particle', 'FAQ'];
  for (const tag of tags) {
    fails = 0;
    for (let p = 1; p <= 12 && fails < 3; p++) {
      const t = await get(`${SITE}/tags/${tag}/${p === 1 ? '' : `page/${p}/`}`);
      if (!t) { fails += 1; continue; }
      fails = 0;
      for (const u of postLinks(t)) urls.add(u);
      await new Promise((r) => setTimeout(r, 120));
    }
  }
  return [...urls];
}

/** 站点标题里的 HTML 实体（&amp; 等）解码。 */
function decodeEntities(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text
    .replace(/&#x2F;/gi, '/')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-zA-Z]+);/g, (all, name) => named[name.toLowerCase()] ?? all);
}

/**
 * 站点会在标题尾部追加系列标签，例如「 1.20 Fabric 长线教程计划」「 1.21.2 Fabric」。
 * 这与系列元数据（mc / loader / name）重复，会污染检索结果，因此剥离。
 */
const SERIES_SUFFIX = /\s*\d+(?:\.\d+)*\s+(?:Fabric|Forge|NeoForge)(?:\s*长线教程计划)?\s*$/;

function pageTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/);
  if (!m) return '';
  return decodeEntities(m[1]).replace(/\s*\|\s*Tomorrow-Land\s*$/i, '').replace(SERIES_SUFFIX, '').trim();
}

/**
 * 封面编号即章节号。站点封面命名并不统一，同一系列内混用：
 *   3 位补零   053.jpg      （B 系列较早的章节）
 *   4 位补零   0055.jpg     （B 系列较晚的章节，以及 A/C/D/E 全部）
 *   带子编号   0002-1.jpg   （补充章节，对应章节号 "2-1"）
 * 因此接受 1~4 位数字并保留 `-子编号`；取不到返回 null，由调用方兜底。
 */
function coverNumber(html) {
  const m = html.match(/property="og:image"\s+content="[^"]*\/pic\/[^/]+\/(\d{1,4})(?:-(\d+))?\.(?:jpg|png|webp)"/);
  if (!m) return null;
  const num = parseInt(m[1], 10);
  return m[2] === undefined ? String(num) : `${num}-${m[2]}`;
}

function classify(url) {
  const u = url.replace(SITE, '');
  if (STANDALONES.has(u)) return { kind: 'standalone', title: STANDALONES.get(u) };
  const seg = u.match(/^\/(?:20\d\d\/\d\d\/\d\d\/)([^/]+)\//);
  const dir = seg ? seg[1] : '';
  const id = SERIES_DIR[dir];
  if (id) return { kind: 'chapter', series: id, dir };
  return { kind: 'other' };
}

const SERIES = {
  A: { id: 'A', name: 'Fabric 1.20.1 长线教程计划', loader: 'Fabric', mc: '1.20.1', tag: 'Fabric-1-20', chapters: [] },
  B: { id: 'B', name: 'Fabric 1.21.X 长线教程计划', loader: 'Fabric', mc: '1.21.X', tag: 'Fabric-1-21', chapters: [] },
  C: { id: 'C', name: 'Forge 1.20.1 长线教程计划', loader: 'Forge', mc: '1.20.1', tag: 'Forge-1-20-1', chapters: [] },
  D: { id: 'D', name: 'NeoForge 1.21.1 长线教程计划', loader: 'NeoForge', mc: '1.21.1', tag: 'NeoForge-1-21-1', chapters: [] },
  E: { id: 'E', name: 'Fabric 26.1 教程计划', loader: 'Fabric', mc: '26.1', tag: 'Fabric', chapters: [] },
  F: { id: 'F', name: 'NeoForge 26.1 教程计划', loader: 'NeoForge', mc: '26.1', tag: 'NeoForge', chapters: [] },
};

const urls = await collectPostUrls();
console.log(`发现文章 ${urls.length} 篇，逐篇抓取元数据（含 og:image 章节号）…`);

const standalones = [];
let other = 0;
for (const url of urls) {
  const cls = classify(url);
  if (cls.kind === 'standalone') {
    standalones.push({ title: cls.title, url });
    continue;
  }
  if (cls.kind === 'other') { other += 1; continue; }
  const html = await get(url, 3);
  if (!html) { console.warn('抓取失败：', url); continue; }
  const title = pageTitle(html) || url.split('/').filter(Boolean).pop();
  let n = coverNumber(html);
  if (n === null) {
    // 兜底：从 URL slug 提取章节号（部分 slug 自带编号，如 1first / 12config）
    const m = url.match(/\/(\d{1,2})[a-z][a-z0-9]*\/$/);
    n = m ? m[1] : '';
    if (n === '') console.warn('章节号缺失：', url);
  }
  SERIES[cls.series].chapters.push({ n, title, url });
  await new Promise((r) => setTimeout(r, 80));
}

for (const s of Object.values(SERIES)) {
  s.chapters.sort((a, b) => {
    const na = /^\d+$/.test(a.n) ? parseInt(a.n, 10) : 0;
    const nb = /^\d+$/.test(b.n) ? parseInt(b.n, 10) : 0;
    return na - nb;
  });
}
standalones.sort((a, b) => a.url.localeCompare(b.url));

const data = {
  site: SITE + '/',
  author: 'BeiShan_Besson',
  synced: new Date().toISOString().slice(0, 10),
  series: Object.values(SERIES),
  standalones,
};
writeFileSync(OUT_JSON, JSON.stringify(data, null, 1), 'utf8');

// 注入 besson-tools.mjs
const moduleSrc = readFileSync(MODULE_PATH, 'utf8');
const injected = moduleSrc.replace(/(const DATA = )(\{.*?\});\n/s, `$1${JSON.stringify(data)};\n`);
if (injected === moduleSrc) throw new Error('未能在 besson-tools.mjs 中找到 DATA 字面量，模板可能已变化');
writeFileSync(MODULE_PATH, injected, 'utf8');

console.log(`完成：系列 A=${SERIES.A.chapters.length} B=${SERIES.B.chapters.length} C=${SERIES.C.chapters.length} D=${SERIES.D.chapters.length} E=${SERIES.E.chapters.length} F=${SERIES.F.chapters.length}，独立文章 ${standalones.length}，其他 ${other}`);
console.log('已更新 dsh-plugin/besson-tools.mjs 与 tools/index_data.json');
console.log('提示：章节号来自每篇文章的 og:image 封面编号；若有 NaN 章节号请人工核对 index_data.json。');
