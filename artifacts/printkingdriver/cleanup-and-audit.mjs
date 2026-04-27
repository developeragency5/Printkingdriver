#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public');
const FIX_SLUGS = [
  ['fix-driver-not-found-error', 'How to Fix the Driver Not Found Error'],
  ['fix-corrupted-driver-error', 'How to Fix a Corrupted Driver Error'],
  ['fix-device-not-recognised-after-driver-update', 'How to Fix Device Not Recognised After Driver Update'],
  ['fix-driver-keeps-removing-itself', 'How to Fix a Driver That Keeps Removing Itself'],
  ['fix-outdated-driver-stops-device-working', 'How to Fix an Outdated Driver That Stops a Device Working'],
  ['fix-driver-conflict-between-devices', 'How to Fix a Driver Conflict Between Devices'],
  ['fix-driver-not-compatible-with-system', 'How to Fix Driver Not Compatible With System'],
  ['fix-driver-error-causing-system-crash', 'How to Fix a Driver Error Causing a System Crash'],
  ['fix-driver-error-code-guide', 'Driver Error Code Guide'],
  ['fix-driver-stopped-after-system-update', 'How to Fix a Driver That Stopped Working After a System Update'],
  ['fix-driver-error-slowing-device', 'How to Fix a Driver Error Slowing a Device'],
  ['fix-driver-not-responding-error', 'How to Fix the Driver Not Responding Error'],
  ['fix-driver-power-state-failure', 'How to Fix a Driver Power State Failure'],
  ['fix-driver-timeout-error', 'How to Fix a Driver Timeout Error'],
  ['fix-driver-access-violation-error', 'How to Fix a Driver Access Violation Error'],
  ['fix-driver-blue-screen-error', 'How to Fix a Driver Blue Screen Error'],
  ['fix-driver-signature-error', 'How to Fix a Driver Signature Error'],
  ['fix-driver-entry-point-not-found', 'How to Fix Driver Entry Point Not Found'],
  ['fix-driver-failed-to-load-error', 'How to Fix a Driver Failed to Load Error'],
  ['fix-driver-keeps-showing-error-on-startup', 'How to Fix a Driver That Keeps Showing an Error on Startup'],
];

let totalChanges = 0;
const changedFiles = new Set();
const issues = [];

function note(msg) { console.log(msg); }
function record(file, before, after, why) {
  if (before !== after) { changedFiles.add(file); totalChanges++; }
  return after;
}

async function walk(dir, out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

// ---------- Phase 1: Delete device.html ----------
async function deleteDevicePage() {
  const target = path.join(ROOT, 'drivers', 'device.html');
  try { await fs.unlink(target); note(`DELETED ${target}`); }
  catch (e) { note(`SKIP delete (already gone): ${e.message}`); }
}

// ---------- Phase 2: Strip device <li> from every HTML file ----------
async function stripDeviceFromAllHtml() {
  const files = (await walk(ROOT)).filter(f => f.endsWith('.html'));
  // Matches <li>...href="/drivers/device"...</li> with optional whitespace/newlines
  // covers mega menu (multiline & inline), drawer, sitemap.html sm-list, all-pages list
  const liRe = /\s*<li>\s*<a href="\/drivers\/device(?:"|\/")[^>]*>[\s\S]*?<\/a>\s*<\/li>/g;
  let touched = 0;
  for (const f of files) {
    const before = await fs.readFile(f, 'utf8');
    const after = before.replace(liRe, '');
    if (after !== before) {
      await fs.writeFile(f, after);
      touched++;
      changedFiles.add(f);
      totalChanges++;
    }
  }
  note(`Stripped device <li> from ${touched} HTML files`);
}

// ---------- Phase 3: Patch index.html (cat-block + tree + intro text) ----------
async function patchIndex() {
  const f = path.join(ROOT, 'index.html');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;

  // Fix awkward "devices, devices, and webcams"
  s = s.replace(
    /turning devices, devices, and webcams into productive parts of your workflow/,
    'turning external devices and webcams into productive parts of your workflow'
  );

  // Remove cat-block Device Driver <li>
  s = s.replace(
    /\s*<li><strong>Device Driver<\/strong><span>[^<]*<\/span><\/li>\s*\n\s*\n/,
    '\n '
  );

  // Remove ASCII tree branch for Device Driver (img + 3 sub items + blank line)
  s = s.replace(
    /\s*│ ├── <img class="tree__sub-img" src="data:image\/svg\+xml,[^"]*" alt="" \/> <strong>Device Driver<\/strong>\s*\n\s*│ │ ├─ Document processing\s*\n\s*│ │ ├─ Print formatting\s*\n\s*│ │ └─ Output control\s*\n\s*│ │\s*\n\s*│ └──/,
    '\n│ └──'
  );

  if (s !== orig) {
    await fs.writeFile(f, s);
    note('Patched index.html (cat-block + ASCII tree + intro text)');
    changedFiles.add(f); totalChanges++;
  } else {
    issues.push('index.html: no changes applied — patterns may have shifted');
  }
}

// ---------- Phase 4: Patch drivers.html (dtype-card) ----------
async function patchDriversListing() {
  const f = path.join(ROOT, 'drivers.html');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;
  // Remove the bare <li>Device Driver</li> + the empty line after
  s = s.replace(/\s*<li>Device Driver<\/li>\s*\n\s*\n/, '\n ');
  if (s !== orig) {
    await fs.writeFile(f, s);
    note('Patched drivers.html (dtype-card list)');
    changedFiles.add(f); totalChanges++;
  } else {
    issues.push('drivers.html: dtype-card device <li> not removed');
  }
}

// ---------- Phase 5: Patch all-pages.html ----------
async function patchAllPages() {
  const f = path.join(ROOT, 'all-pages.html');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;

  // Remove the body driver-reference Device entry
  s = s.replace(/<li><a href="\/drivers\/device">Device<\/a><\/li>/, '');

  // Update count "(14)" → "(13)" in Driver Reference heading
  s = s.replace(
    /(Driver Reference <span class="sitelinks__count">\()14(\)<\/span>)/,
    '$113$2'
  );

  // Update intro "54 pages total" → "73 pages total"
  s = s.replace(/54 pages total/g, '73 pages total');

  // Add new "Error Fix Guides" section after the Driver Reference section
  // Idempotency guard
  if (s.includes('Error Fix Guides')) {
    if (s !== orig) await fs.writeFile(f, s);
    if (s !== orig) note('Patched all-pages.html (-device, counts updated; fix section already present)');
    if (s !== orig) { changedFiles.add(f); totalChanges++; }
    return;
  }
  const fixListItems = FIX_SLUGS.map(([slug, title]) =>
    `<li><a href="/${slug}">${title}</a></li>`
  ).join('');
  const fixSection = `<section class="detail-card"><h2>Error Fix Guides <span class="sitelinks__count">(20)</span></h2><p>Step-by-step guides for the most common driver error messages. Each guide explains what the error means, why it appears and how to resolve it.</p><ul class="all-pages-list">${fixListItems}</ul></section>`;

  // Insert before the next section after Driver Reference: look for the closing </ul></section> followed by the next section
  // Find the exact Driver Reference section end and inject after it
  s = s.replace(
    /(<li><a href="\/drivers\/webcam">Webcam<\/a><\/li><\/ul><\/section>)/,
    `$1${fixSection}`
  );

  if (s !== orig) {
    await fs.writeFile(f, s);
    note('Patched all-pages.html (-device, +20 fix entries, counts updated)');
    changedFiles.add(f); totalChanges++;
  } else {
    issues.push('all-pages.html: no changes applied');
  }
}

// ---------- Phase 6: Patch sitemap.html ----------
async function patchSitemapHtml() {
  const f = path.join(ROOT, 'sitemap.html');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;

  // Remove the body sm-list Device Driver entry
  s = s.replace(/\s*<li><a href="\/drivers\/device">Device Driver<\/a><\/li>/, '');

  // Update Driver Types count "13 entries" → "12 entries"
  s = s.replace(/(<span class="sm-block__count">)13 entries(<\/span>)/, '$112 entries$2');

  // Add a new sm-block for Error Fix Guides AFTER the Driver Types block, BEFORE the Legal & Info block
  if (s.includes('id="sec-fixes"')) {
    if (s !== orig) await fs.writeFile(f, s);
    if (s !== orig) note('Patched sitemap.html (-device, counts updated; fix block already present)');
    if (s !== orig) { changedFiles.add(f); totalChanges++; }
    return;
  }
  const fixItems = FIX_SLUGS.map(([slug, title]) =>
    `      <li><a href="/${slug}">${title}</a></li>`
  ).join('\n');

  const fixBlock = `
      <!-- Error Fix Guides -->
      <div class="sm-block" id="sec-fixes" style="--accent: 90%; grid-column: 1 / -1;">
        <div class="sm-block__heading">
          <span class="sm-block__icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </span>
          <div class="sm-block__heading-text">
            <span class="sm-block__num">Section 04</span>
            <span class="sm-block__title">Error Fix Guides</span>
          </div>
          <span class="sm-block__count">20 entries</span>
        </div>
        <ul class="sm-list sm-list--cols">
${fixItems}
        </ul>
      </div>
`;

  // Find the Legal & Info comment and inject the fix block before it
  s = s.replace(/(\n\s*<!-- Legal & Info -->)/, `${fixBlock}$1`);

  if (s !== orig) {
    await fs.writeFile(f, s);
    note('Patched sitemap.html (-device, +Error Fix Guides block of 20)');
    changedFiles.add(f); totalChanges++;
  } else {
    issues.push('sitemap.html: no changes applied');
  }
}

// ---------- Phase 7: Patch sitemap.xml ----------
async function patchSitemapXml() {
  const f = path.join(ROOT, 'sitemap.xml');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;
  // Remove the entire <url> block containing /drivers/device
  s = s.replace(/\s*<url>\s*<loc>https:\/\/www\.printkingdriver\.com\/drivers\/device<\/loc>[\s\S]*?<\/url>/, '');
  if (s !== orig) {
    await fs.writeFile(f, s);
    note('Patched sitemap.xml (-device URL)');
    changedFiles.add(f); totalChanges++;
  } else {
    issues.push('sitemap.xml: device URL not found');
  }
}

// ---------- Phase 8: Patch llms.txt ----------
async function patchLlms() {
  const f = path.join(ROOT, 'llms.txt');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;
  // Remove the device drivers line
  s = s.replace(/^- \[Device Drivers\]\(https:\/\/www\.printkingdriver\.com\/drivers\/device\)[^\n]*\n/m, '');

  // Append a new section for fix pages if not already present
  if (!s.includes('## Error Fix Guides')) {
    const fixLines = FIX_SLUGS.map(([slug, title]) =>
      `- [${title}](https://www.printkingdriver.com/${slug}): Step-by-step driver error troubleshooting guide`
    ).join('\n');
    s = s.trimEnd() + `\n\n## Error Fix Guides\n\n${fixLines}\n`;
  }
  if (s !== orig) {
    await fs.writeFile(f, s);
    note('Patched llms.txt (-device line, +20 fix entries)');
    changedFiles.add(f); totalChanges++;
  } else {
    issues.push('llms.txt: no changes applied');
  }
}

// ---------- Phase 9: Patch scripts.js search index ----------
async function patchScriptsJs() {
  const f = path.join(ROOT, 'assets', 'scripts.js');
  let s = await fs.readFile(f, 'utf8');
  const orig = s;
  // Remove Device Driver search index line
  s = s.replace(/^\s*\{ label: "Device Driver",.*\},?\n/m, '');

  // Add 20 fix entries before the closing `];` of SEARCH_INDEX
  const fixEntries = FIX_SLUGS.map(([slug, title]) =>
    `    { label: ${JSON.stringify(title)}, href: ${JSON.stringify('/' + slug)}, type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },`
  ).join('\n');

  // Inject before the `];` that closes SEARCH_INDEX
  if (!s.includes('type: "Fix"')) {
    s = s.replace(
      /(\{ label: "Contact \/ Get In Touch",[^}]*\},)\n(  \];)/,
      `$1\n${fixEntries}\n$2`
    );
  }

  if (s !== orig) {
    await fs.writeFile(f, s);
    note('Patched scripts.js (-device entry, +20 fix entries)');
    changedFiles.add(f); totalChanges++;
  } else {
    issues.push('scripts.js: search index unchanged');
  }
}

// ---------- Phase 10: Add redirect to vercel.json ----------
async function patchVercelJson() {
  const f = 'vercel.json';
  let s = await fs.readFile(f, 'utf8');
  const orig = s;
  if (!s.includes('"/drivers/device"')) {
    // Add a redirect entry. Find the redirects array and insert at the start.
    s = s.replace(
      /("redirects":\s*\[)\s*\n/,
      `$1\n    { "source": "/drivers/device", "destination": "/drivers", "permanent": true },\n`
    );
  }
  if (s !== orig) {
    await fs.writeFile(f, s);
    note('Patched vercel.json (+redirect /drivers/device → /drivers)');
    changedFiles.add(f); totalChanges++;
  } else {
    issues.push('vercel.json: redirect already present or pattern shifted');
  }
}

// ---------- Phase 11: Link checker ----------
async function checkLinks() {
  note('\n=== LINK CHECK ===');
  const files = (await walk(ROOT)).filter(f => f.endsWith('.html'));
  const broken = [];
  // Build a set of valid public paths (clean URLs allowed)
  const allFiles = await walk(ROOT);
  const fileSet = new Set(allFiles.map(f => '/' + path.relative(ROOT, f).replace(/\\/g, '/')));

  function pathExists(href) {
    // strip query / hash
    let p = href.split('#')[0].split('?')[0];
    if (!p.startsWith('/')) return true; // skip relative or external
    if (p.startsWith('//')) return true; // protocol-relative external
    if (p === '/') return fileSet.has('/index.html');
    // check direct file
    if (fileSet.has(p)) return true;
    // .html
    if (fileSet.has(p + '.html')) return true;
    // index.html
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
      if (!pathExists(href)) {
        broken.push({ file: path.relative(ROOT, f), href });
      }
    }
  }
  if (broken.length === 0) note('Link check: PASS — no broken internal links across all HTML files');
  else {
    note(`Link check: FAIL — ${broken.length} broken links`);
    broken.slice(0, 30).forEach(b => note(`  ${b.file} -> ${b.href}`));
  }
  return broken;
}

// ---------- Phase 12: SEO checker ----------
async function checkSeo() {
  note('\n=== SEO CHECK ===');
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
      if (!c.re.test(html)) {
        failures.push({ file: path.relative(ROOT, f), missing: c.name });
      }
    }
  }
  if (failures.length === 0) note(`SEO check: PASS — all ${files.length} pages have title/meta/og/jsonld/h1/viewport/lang`);
  else {
    note(`SEO check: ${failures.length} issues across pages`);
    failures.slice(0, 30).forEach(x => note(`  ${x.file} missing ${x.missing}`));
  }
  return failures;
}

// ---------- Run ----------
(async () => {
  note('=== PHASE 1: Delete device.html ===');
  await deleteDevicePage();

  note('\n=== PHASE 2: Strip device <li> from all HTML ===');
  await stripDeviceFromAllHtml();

  note('\n=== PHASE 3-9: Targeted patches ===');
  await patchIndex();
  await patchDriversListing();
  await patchAllPages();
  await patchSitemapHtml();
  await patchSitemapXml();
  await patchLlms();
  await patchScriptsJs();

  note('\n=== PHASE 10: Add redirect ===');
  await patchVercelJson();

  const broken = await checkLinks();
  const seoFails = await checkSeo();

  note('\n=== SUMMARY ===');
  note(`Files changed: ${changedFiles.size}`);
  note(`Total replace ops: ${totalChanges}`);
  note(`Patch issues: ${issues.length}`);
  issues.forEach(i => note(`  ! ${i}`));
  note(`Broken links: ${broken.length}`);
  note(`SEO issues: ${seoFails.length}`);

  if (broken.length || seoFails.length || issues.length) {
    process.exitCode = 1;
  }
})();
