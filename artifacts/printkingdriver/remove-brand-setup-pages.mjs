#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public');
const BRANDS = ['a','b','c','d','e','f','g','h','i','j'];
const SUBPAGES = ['firmware-update', 'wireless-setup'];

const issues = [];
const changedFiles = new Set();

async function walk(dir, out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

// ---------- Phase 1: Delete the 20 pages ----------
async function deletePages() {
  let count = 0;
  for (const b of BRANDS) {
    for (const sp of SUBPAGES) {
      const f = path.join(ROOT, 'brands', `brand-${b}`, `${sp}.html`);
      try { await fs.unlink(f); count++; }
      catch (e) { issues.push(`Delete failed: ${f} — ${e.message}`); }
    }
  }
  console.log(`Deleted ${count} pages`);
}

// ---------- Phase 2: Strip the related-section from each brand-X.html overview ----------
async function patchBrandOverviews() {
  for (const b of BRANDS) {
    const f = path.join(ROOT, 'brands', `brand-${b}.html`);
    let s = await fs.readFile(f, 'utf8');
    const orig = s;
    // Remove the entire <section class="related-section">...</section> block
    s = s.replace(/\s*<section class="related-section">[\s\S]*?<\/section>/, '');
    if (s !== orig) {
      await fs.writeFile(f, s);
      changedFiles.add(f);
    } else {
      issues.push(`brand-${b}.html: related-section not found`);
    }
  }
  console.log(`Patched ${BRANDS.length} brand overview pages (related-section removed)`);
}

// ---------- Phase 3: all-pages.html ----------
async function patchAllPages() {
  const f = path.join(ROOT, 'all-pages.html');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;

  // Remove the entire "Brand Setup Guides (20)" section
  s = s.replace(
    /<section class="detail-card"><h2>Brand Setup Guides[\s\S]*?<\/ul><\/section>/,
    ''
  );

  // Update count "73 pages total" → "53 pages total"
  s = s.replace(/73 pages total/g, '53 pages total');

  if (s !== orig) {
    await fs.writeFile(f, s);
    changedFiles.add(f);
    console.log('Patched all-pages.html (-Brand Setup Guides section, -20 pages count)');
  } else {
    issues.push('all-pages.html: section not removed');
  }
}

// ---------- Phase 4: sitemap.xml ----------
async function patchSitemapXml() {
  const f = path.join(ROOT, 'sitemap.xml');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;
  // Remove every <url>...</url> block whose loc contains firmware-update or wireless-setup
  s = s.replace(
    /\s*<url>\s*<loc>https:\/\/www\.printkingdriver\.com\/brands\/brand-[a-j]\/(?:firmware-update|wireless-setup)<\/loc>[\s\S]*?<\/url>/g,
    ''
  );
  if (s !== orig) {
    await fs.writeFile(f, s);
    changedFiles.add(f);
    const count = (s.match(/<loc>/g) || []).length;
    console.log(`Patched sitemap.xml (now ${count} URLs)`);
  } else {
    issues.push('sitemap.xml: no URL blocks removed');
  }
}

// ---------- Phase 5: llms.txt ----------
async function patchLlms() {
  const f = path.join(ROOT, 'llms.txt');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;
  // Remove any line containing firmware-update or wireless-setup
  s = s.split('\n').filter(l => !/firmware-update|wireless-setup/.test(l)).join('\n');
  if (s !== orig) {
    await fs.writeFile(f, s);
    changedFiles.add(f);
    console.log('Patched llms.txt (lines removed)');
  } else {
    issues.push('llms.txt: no lines removed');
  }
}

// ---------- Phase 6: vercel.json — add 20 redirects ----------
async function patchVercelJson() {
  const f = 'vercel.json';
  let s = await fs.readFile(f, 'utf8');
  const orig = s;

  // Build 20 new redirect lines
  const newRedirects = [];
  for (const b of BRANDS) {
    for (const sp of SUBPAGES) {
      const src = `/brands/brand-${b}/${sp}`;
      // Skip if already present
      if (!s.includes(`"source": "${src}"`)) {
        newRedirects.push(`    { "source": "${src}", "destination": "/brands/brand-${b}", "permanent": true }`);
      }
    }
  }

  if (newRedirects.length > 0) {
    // Inject right after the opening of the redirects array
    s = s.replace(
      /("redirects":\s*\[)\s*\n/,
      `$1\n${newRedirects.join(',\n')},\n`
    );
    if (s !== orig) {
      try { JSON.parse(s); }
      catch (e) { console.error('vercel.json INVALID after edit:', e.message); process.exit(1); }
      await fs.writeFile(f, s);
      changedFiles.add(f);
      console.log(`Added ${newRedirects.length} redirects to vercel.json`);
    }
  } else {
    console.log('vercel.json: redirects already present, skipped');
  }
  const total = (s.match(/"source":/g) || []).length;
  console.log(`vercel.json: ${total} total redirect entries`);
}

// ---------- Phase 7: Validation ----------
async function checkLinks() {
  const files = (await walk(ROOT)).filter(f => f.endsWith('.html'));
  const allFiles = await walk(ROOT);
  const fileSet = new Set(allFiles.map(f => '/' + path.relative(ROOT, f).replace(/\\/g, '/')));
  const broken = [];
  function pathExists(href) {
    let p = href.split('#')[0].split('?')[0];
    if (!p.startsWith('/') || p.startsWith('//')) return true;
    if (p === '/') return fileSet.has('/index.html');
    if (fileSet.has(p)) return true;
    if (fileSet.has(p + '.html')) return true;
    if (fileSet.has(p + '/index.html')) return true;
    if (fileSet.has(p.replace(/\/$/, '') + '/index.html')) return true;
    return false;
  }
  const hrefRe = /href="([^"]+)"/g;
  for (const f of files) {
    const html = await fs.readFile(f, 'utf8');
    const seen = new Set();
    let m;
    while ((m = hrefRe.exec(html))) {
      const href = m[1];
      if (seen.has(href)) continue; seen.add(href);
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) continue;
      if (!pathExists(href)) broken.push({ file: path.relative(ROOT, f), href });
    }
  }
  console.log(`\nLink check across ${files.length} pages: ${broken.length === 0 ? 'PASS' : `${broken.length} broken`}`);
  broken.slice(0, 20).forEach(b => console.log(`  ${b.file} -> ${b.href}`));
  return broken;
}

async function checkSeo() {
  const files = (await walk(ROOT)).filter(f => f.endsWith('.html'));
  const checks = [
    { name: 'title',          re: /<title>[^<]+<\/title>/ },
    { name: 'meta-desc',      re: /<meta\s+name="description"\s+content="[^"]+"/ },
    { name: 'og:title',       re: /<meta\s+property="og:title"\s+content="[^"]+"/ },
    { name: 'og:description', re: /<meta\s+property="og:description"\s+content="[^"]+"/ },
    { name: 'jsonld',         re: /<script\s+type="application\/ld\+json">/ },
    { name: 'h1',             re: /<h1[\s>]/ },
    { name: 'viewport',       re: /<meta\s+name="viewport"/ },
    { name: 'lang',           re: /<html[^>]*\blang="/ },
  ];
  const failures = [];
  for (const f of files) {
    const html = await fs.readFile(f, 'utf8');
    for (const c of checks) {
      if (!c.re.test(html)) failures.push({ file: path.relative(ROOT, f), missing: c.name });
    }
  }
  console.log(`SEO check across ${files.length} pages: ${failures.length === 0 ? 'PASS' : `${failures.length} issues`}`);
  failures.slice(0, 20).forEach(x => console.log(`  ${x.file} missing ${x.missing}`));
  return failures;
}

(async () => {
  console.log('=== Phase 1: Delete 20 pages ===');
  await deletePages();
  console.log('\n=== Phase 2: Strip related-section from brand overviews ===');
  await patchBrandOverviews();
  console.log('\n=== Phase 3: all-pages.html ===');
  await patchAllPages();
  console.log('\n=== Phase 4: sitemap.xml ===');
  await patchSitemapXml();
  console.log('\n=== Phase 5: llms.txt ===');
  await patchLlms();
  console.log('\n=== Phase 6: vercel.json ===');
  await patchVercelJson();
  console.log('\n=== Phase 7: Validation ===');
  const broken = await checkLinks();
  const seoFails = await checkSeo();
  console.log('\n=== Summary ===');
  console.log(`Files changed: ${changedFiles.size}`);
  console.log(`Issues: ${issues.length}`);
  issues.forEach(i => console.log(`  ! ${i}`));
  if (broken.length || seoFails.length || issues.length) process.exitCode = 1;
})();
