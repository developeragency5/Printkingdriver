import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { minify as terserMinify } from 'terser';
import CleanCSS from 'clean-css';

const PUB = 'public';
const ASSETS = path.join(PUB, 'assets');

async function fileSize(p) { const s = await fs.stat(p); return s.size; }
function fmt(n) { return (n/1024).toFixed(2)+' KB'; }

// ---- JS ----
async function minJs(src, dst) {
  const code = await fs.readFile(src, 'utf8');
  const out = await terserMinify(code, {
    ecma: 2020,
    compress: { passes: 2, drop_console: false },
    mangle: true,
    format: { comments: false },
  });
  if (out.error) throw out.error;
  await fs.writeFile(dst, out.code);
  const before = await fileSize(src);
  const after  = await fileSize(dst);
  console.log(`JS  ${path.basename(src)}: ${fmt(before)} -> ${fmt(after)}  (-${(100-after/before*100).toFixed(1)}%)`);
}

// ---- CSS ----
async function minCss(src, dst) {
  const code = await fs.readFile(src, 'utf8');
  const out = new CleanCSS({
    level: { 1: { all: true }, 2: { all: true, restructureRules: true, mergeMedia: true } },
    returnPromise: false,
  }).minify(code);
  if (out.errors.length) { console.error('CSS errors:', out.errors); process.exit(1); }
  if (out.warnings.length) console.warn('CSS warnings:', out.warnings.slice(0,3));
  await fs.writeFile(dst, out.styles);
  const before = await fileSize(src);
  const after  = await fileSize(dst);
  console.log(`CSS ${path.basename(src)}: ${fmt(before)} -> ${fmt(after)}  (-${(100-after/before*100).toFixed(1)}%)`);
}

await minJs(path.join(ASSETS,'scripts.js'),       path.join(ASSETS,'scripts.min.js'));
await minJs(path.join(ASSETS,'cookie-banner.js'), path.join(ASSETS,'cookie-banner.min.js'));
await minCss(path.join(ASSETS,'styles.css'),      path.join(ASSETS,'styles.min.css'));

// ---- Cache-busting: stamp every HTML <link>/<script> referencing a minified
// asset with a content-hash query string so browsers + CDN never serve stale
// CSS/JS after a rebuild. Idempotent: replaces any existing ?v=... value.
async function shortHash(p) {
  const buf = await fs.readFile(p);
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);
}

async function walkHtml(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const ASSET_HASHES = {
  'styles.min.css':       await shortHash(path.join(ASSETS, 'styles.min.css')),
  'scripts.min.js':       await shortHash(path.join(ASSETS, 'scripts.min.js')),
  'cookie-banner.min.js': await shortHash(path.join(ASSETS, 'cookie-banner.min.js')),
};

const htmlFiles = await walkHtml(PUB);
let updated = 0;
for (const file of htmlFiles) {
  const orig = await fs.readFile(file, 'utf8');
  let next = orig;
  for (const [name, hash] of Object.entries(ASSET_HASHES)) {
    // Match: /assets/<name> with optional existing ?v=... query.
    const re = new RegExp(`(/assets/${name.replace(/\./g, '\\.')})(\\?v=[A-Za-z0-9]+)?`, 'g');
    next = next.replace(re, `$1?v=${hash}`);
  }
  if (next !== orig) { await fs.writeFile(file, next); updated++; }
}
console.log(`Stamped cache-busters on ${updated}/${htmlFiles.length} HTML file(s).`);
console.log('Asset versions:', ASSET_HASHES);
console.log('Done.');
