#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public');

// ---------- all-pages.html: collapse to single fix section ----------
async function dedupAllPages() {
  const f = path.join(ROOT, 'all-pages.html');
  let s = await fs.readFile(f, 'utf8');
  // The fix section starts at <section class="detail-card"><h2>Error Fix Guides
  // and ends at </ul></section>. Find ALL of them, keep only the first.
  const re = /<section class="detail-card"><h2>Error Fix Guides[\s\S]*?<\/ul><\/section>/g;
  const matches = [...s.matchAll(re)];
  console.log(`all-pages.html: found ${matches.length} fix sections`);
  if (matches.length > 1) {
    // Keep first, remove subsequent
    let kept = false;
    s = s.replace(re, m => {
      if (!kept) { kept = true; return m; }
      return '';
    });
    await fs.writeFile(f, s);
    console.log('all-pages.html: kept 1, removed extras');
  }
}

// ---------- sitemap.html: collapse to single fix block ----------
async function dedupSitemapHtml() {
  const f = path.join(ROOT, 'sitemap.html');
  let s = await fs.readFile(f, 'utf8');
  const re = /\s*<!-- Error Fix Guides -->[\s\S]*?<div class="sm-block" id="sec-fixes"[\s\S]*?<\/ul>\s*<\/div>/g;
  const matches = [...s.matchAll(re)];
  console.log(`sitemap.html: found ${matches.length} fix blocks`);
  if (matches.length > 1) {
    let kept = false;
    s = s.replace(re, m => {
      if (!kept) { kept = true; return m; }
      return '';
    });
    await fs.writeFile(f, s);
    console.log('sitemap.html: kept 1, removed extras');
  }
}

// ---------- Make cleanup-and-audit.mjs idempotent ----------
async function patchAuditScriptIdempotency() {
  const f = 'cleanup-and-audit.mjs';
  let s = await fs.readFile(f, 'utf8');
  const orig = s;

  // Guard the all-pages inject
  s = s.replace(
    /(  \/\/ Add new "Error Fix Guides" section after the Driver Reference section\n)/,
    `$1  // Idempotency guard
  if (s.includes('Error Fix Guides')) {
    if (s !== orig) await fs.writeFile(f, s);
    if (s !== orig) note('Patched all-pages.html (-device, counts updated; fix section already present)');
    if (s !== orig) { changedFiles.add(f); totalChanges++; }
    return;
  }
`
  );

  // Guard the sitemap.html inject
  s = s.replace(
    /(  \/\/ Add a new sm-block for Error Fix Guides AFTER the Driver Types block, BEFORE the Legal & Info block\n)/,
    `$1  if (s.includes('id="sec-fixes"')) {
    if (s !== orig) await fs.writeFile(f, s);
    if (s !== orig) note('Patched sitemap.html (-device, counts updated; fix block already present)');
    if (s !== orig) { changedFiles.add(f); totalChanges++; }
    return;
  }
`
  );

  if (s !== orig) {
    await fs.writeFile(f, s);
    console.log('cleanup-and-audit.mjs: idempotency guards added');
  }
}

await dedupAllPages();
await dedupSitemapHtml();
await patchAuditScriptIdempotency();

// Verify
const ap = await fs.readFile(path.join(ROOT, 'all-pages.html'), 'utf8');
const sm = await fs.readFile(path.join(ROOT, 'sitemap.html'), 'utf8');
const apFix = (ap.match(/href="\/fix-/g) || []).length;
const smFix = (sm.match(/href="\/fix-/g) || []).length;
console.log(`After dedup: all-pages.html has ${apFix} fix links, sitemap.html has ${smFix} fix links`);
