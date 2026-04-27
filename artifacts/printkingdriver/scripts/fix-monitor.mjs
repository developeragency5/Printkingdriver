#!/usr/bin/env node
/**
 * fix-monitor.mjs
 *
 * Surgically repairs drivers/monitor.html where two adjacent sections
 * (Best Practices + FAQ) got chewed by an over-greedy regex.
 *
 * Strategy:
 *   1. Pull the entire damaged region (Best Practices section + FAQ section)
 *      from git HEAD.
 *   2. From that pristine region: drop the FAQ item containing "PC"
 *      (Q: "Do monitors actually need a driver?") and the "PC" sentence
 *      from FAQ Q3 ("Why is HDR greyed out?").
 *   3. Splice the cleaned region back into the current file in place of the
 *      damaged region.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const FILE = path.resolve(__dirname, '..', 'public', 'drivers', 'monitor.html');
const REPO_REL = path.relative(REPO_ROOT, FILE).replace(/\\/g, '/');

const original = execSync(`git show HEAD:${REPO_REL}`, { cwd: REPO_ROOT, encoding: 'utf8' });
let current = fs.readFileSync(FILE, 'utf8');

// Pull the original Best Practices section + FAQ section as one block
const origBlockRe = /(<section class="detail-card">\s*<h2>Best Practices<\/h2>[\s\S]*?<\/section>)\s*(<section class="detail-card">\s*<h2>Frequently Asked Questions<\/h2>[\s\S]*?<\/section>)/;
const origMatch = original.match(origBlockRe);
if (!origMatch) {
  console.error('FAIL: could not locate Best Practices + FAQ region in original');
  process.exit(1);
}
const [origFull, origBest, origFaq] = origMatch;

// Clean the FAQ section: drop FAQ items containing forbidden words; sentence-strip the "PC" sentence from any other answer
const BAD = /\b(PC|Mac|Macs|macOS|Linux|OS)\b/;
const SAFE = /MAC layer|MAC address/;
const hasBad = (t) => BAD.test(t) && !SAFE.test(t);

let cleanedFaq = origFaq.replace(
  /<div class="faq__item">[\s\S]*?<\/div>\s*<\/div>/g,
  (block) => (hasBad(block.replace(/<[^>]+>/g, '')) ? '' : block)
);
// Sentence-strip remaining <p>…</p>
cleanedFaq = cleanedFaq.replace(/<p([^>]*)>([\s\S]*?)<\/p>/g, (full, attrs, body) => {
  if (!hasBad(body)) return full;
  const sents = body.split(/(?<=[.!?])\s+/);
  const kept = sents.filter((s) => !hasBad(s)).join(' ').trim();
  return kept ? `<p${attrs}>${kept}</p>` : '';
});

const cleanedBlock = origBest + '\n\n      ' + cleanedFaq;

// Replace the damaged region in current with the cleaned block.
// The damaged region in current starts at Best Practices section and ends at the same </section>.
const damagedRe = /<section class="detail-card">\s*<h2>Best Practices<\/h2>[\s\S]*?<\/section>/;
const damagedMatch = current.match(damagedRe);
if (!damagedMatch) {
  console.error('FAIL: could not locate damaged region in current monitor.html');
  process.exit(1);
}
current = current.replace(damagedRe, cleanedBlock);
fs.writeFileSync(FILE, current);

const items = (cleanedFaq.match(/class="faq__item"/g) || []).length;
const answers = (cleanedFaq.match(/class="faq__a"/g) || []).length;
const bullets = (origBest.match(/<li><span class="detail-list__bullet"/g) || []).length;
console.log(`Repaired drivers/monitor.html`);
console.log(`  Best Practices bullets: ${bullets}`);
console.log(`  FAQ items: ${items} (answers: ${answers})`);
