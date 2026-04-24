import fs from 'node:fs/promises';
import path from 'node:path';
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
console.log('Done.');
