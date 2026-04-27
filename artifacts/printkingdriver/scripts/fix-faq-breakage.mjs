#!/usr/bin/env node
/**
 * fix-faq-breakage.mjs
 *
 * Repairs FAQ breakage caused by an over-greedy regex in strip-os-terms.mjs.
 *
 * For each affected file:
 *   1. Restore the FAQ section verbatim from git HEAD.
 *   2. Re-strip only the FAQ items whose visible text contains a forbidden word.
 *
 * Also:
 *   - Drops the `<details class="faq-elegant__item">` whose answer became empty
 *     in how-it-works.html.
 *   - Patches all brand JSON-LD `mainEntity` arrays to drop Question entries
 *     whose `name` is empty after sentence-stripping.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'public');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

const BAD = /\b(PC|Mac|Macs|macOS|Linux|OS)\b/;
const SAFE_MAC = /MAC layer|MAC address/;
const hasBad = (text) => BAD.test(text) && !SAFE_MAC.test(text);

const BROKEN = [
  'drivers/audio.html',
  'drivers/device.html',
  'drivers/monitor.html',
  'drivers/network.html',
  'drivers/webcam.html',
];

function readFromGit(relFromRepoRoot) {
  return execSync(`git show HEAD:${relFromRepoRoot}`, { cwd: REPO_ROOT, encoding: 'utf8' });
}

/**
 * Replace the FAQ section <div class="faq__inner …">…</div> with a cleaned
 * version where any <div class="faq__item">…</div> containing a forbidden word
 * is removed in its entirety.
 */
function rebuildFaqSection(originalHtml) {
  return originalHtml.replace(
    /(<div class="faq__inner[^"]*">)([\s\S]*?)(<\/div>\s*<\/section>)/,
    (full, open, inner, close) => {
      // Split on faq__item blocks
      const items = [];
      let i = 0;
      const itemRe = /<div class="faq__item">[\s\S]*?<\/div>\s*<\/div>/g;
      let lastIndex = 0;
      let m;
      while ((m = itemRe.exec(inner)) !== null) {
        if (m.index > lastIndex) items.push({ kind: 'gap', text: inner.slice(lastIndex, m.index) });
        items.push({ kind: 'item', text: m[0] });
        lastIndex = m.index + m[0].length;
      }
      if (lastIndex < inner.length) items.push({ kind: 'gap', text: inner.slice(lastIndex) });

      const kept = items.filter((p) => {
        if (p.kind !== 'item') return true;
        const visible = p.text.replace(/<[^>]+>/g, '');
        return !hasBad(visible);
      });
      return open + kept.map((p) => p.text).join('') + close;
    }
  );
}

console.log('=== Restoring + repairing FAQ sections in 5 driver pages ===\n');

for (const rel of BROKEN) {
  const filePath = path.join(ROOT, rel);
  const repoRel = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');
  const original = readFromGit(repoRel);
  const current = fs.readFileSync(filePath, 'utf8');

  // Extract the FAQ section from the original
  const faqRe = /<div class="faq__inner[^"]*">[\s\S]*?<\/div>\s*<\/section>/;
  const originalFaq = original.match(faqRe)?.[0];
  const currentFaq = current.match(faqRe)?.[0];

  if (!originalFaq || !currentFaq) {
    console.log(`  SKIP ${rel}: no FAQ section located`);
    continue;
  }

  // Build a clean FAQ section by stripping bad items from the original
  const cleanedFaq = rebuildFaqSection(originalFaq);

  // Replace current's FAQ section with the cleaned one
  const fixed = current.replace(faqRe, cleanedFaq);
  fs.writeFileSync(filePath, fixed);

  const before = (currentFaq.match(/class="faq__item"/g) || []).length;
  const after = (cleanedFaq.match(/class="faq__item"/g) || []).length;
  console.log(`  FIXED ${rel}: items ${before} -> ${after}`);
}

console.log('\n=== Removing empty faq-elegant item in how-it-works.html ===\n');

const hiwPath = path.join(ROOT, 'how-it-works.html');
let hiw = fs.readFileSync(hiwPath, 'utf8');
const beforeHiw = hiw.length;
// Drop any <details class="faq-elegant__item">…<div class="faq-elegant__a"></div>…</details>
hiw = hiw.replace(
  /<details class="faq-elegant__item">[\s\S]*?<div class="faq-elegant__a"><\/div>[\s\S]*?<\/details>/g,
  () => { console.log('  removed empty faq-elegant item'); return ''; }
);
// Renumber remaining faq-elegant__num spans 01..n
const nums = [];
hiw = hiw.replace(/<span class="faq-elegant__num">(\d+)<\/span>/g, (_, n) => {
  nums.push(n);
  return `<span class="faq-elegant__num">__SLOT_${nums.length - 1}__</span>`;
});
nums.forEach((_, idx) => {
  hiw = hiw.replace(`__SLOT_${idx}__`, String(idx + 1).padStart(2, '0'));
});
fs.writeFileSync(hiwPath, hiw);
console.log(`  how-it-works.html: ${beforeHiw} -> ${hiw.length} bytes; renumbered ${nums.length} FAQ items`);

console.log('\n=== Patching JSON-LD in 10 brand index pages (drop empty Question entries) ===\n');

for (const letter of 'abcdefghij'.split('')) {
  const filePath = path.join(ROOT, 'brands', `brand-${letter}.html`);
  if (!fs.existsSync(filePath)) continue;
  let s = fs.readFileSync(filePath, 'utf8');
  const before = s;
  s = s.replace(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
    (full, open, body, close) => {
      let json;
      try { json = JSON.parse(body); } catch { return full; }
      const clean = (node) => {
        if (Array.isArray(node)) {
          return node
            .map(clean)
            .filter((n) => {
              if (n && typeof n === 'object' && n['@type'] === 'Question') {
                if (!n.name || (n.acceptedAnswer && !n.acceptedAnswer.text)) return false;
              }
              return true;
            });
        }
        if (node && typeof node === 'object') {
          const out = {};
          for (const [k, v] of Object.entries(node)) out[k] = clean(v);
          return out;
        }
        return node;
      };
      const cleaned = clean(json);
      const newBody = JSON.stringify(cleaned);
      return open + newBody + close;
    }
  );
  if (s !== before) {
    fs.writeFileSync(filePath, s);
    console.log(`  patched brands/brand-${letter}.html`);
  }
}

console.log('\nDone.\n');
