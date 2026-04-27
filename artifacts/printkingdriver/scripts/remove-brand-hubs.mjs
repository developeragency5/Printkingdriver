#!/usr/bin/env node
// Remove the 11 "Brand Overviews" hub pages and every reference to them.
// Scope: /brands, /brands/brand-{a..j}.
// Out of scope: /brands/brand-X/{linux,macos,pc-10,pc-11} OS sub-pages (already noindex'd).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

const HUB_PATHS = [
  '/brands',
  '/brands/brand-a', '/brands/brand-b', '/brands/brand-c', '/brands/brand-d',
  '/brands/brand-e', '/brands/brand-f', '/brands/brand-g', '/brands/brand-h',
  '/brands/brand-i', '/brands/brand-j',
];

const HUB_FILES = [
  path.join(PUBLIC, 'brands/index.html'),
  ...['a','b','c','d','e','f','g','h','i','j'].map(
    l => path.join(PUBLIC, `brands/brand-${l}.html`)
  ),
];

let totalChanges = 0;

// 1) Delete the 11 hub HTML files.
let deleted = 0;
for (const f of HUB_FILES) {
  if (fs.existsSync(f)) { fs.unlinkSync(f); deleted++; }
}
console.log(`[1] Deleted ${deleted} brand hub HTML files.`);
totalChanges += deleted;

// 2) Walk every .html under public/ and scrub references.
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}

// Build href patterns that match the 11 hub URLs ONLY,
// not the OS sub-pages (e.g. /brands/brand-a/macos must be left alone).
// A hub URL ends at the closing quote OR a hash, never at a slash.
const HUB_HREF_RE = /href="\/brands(\/brand-[a-j])?(#[^"]*)?"/g;

// Anchor element wrapping just hub URLs:
//   <a [...]href="/brands"[...]>TEXT</a>  →  TEXT
//   <a [...]href="/brands/brand-a"[...]>TEXT</a>  →  TEXT
// Built strictly so it cannot match OS-sub-page anchors.
const HUB_ANCHOR_RE = /<a\s+[^>]*href="\/brands(\/brand-[a-j])?(#[^"]*)?"[^>]*>([\s\S]*?)<\/a>/g;

// Special-case: the "Back to the manufacturer overview" link at the top of each
// of the 40 OS sub-pages used to point at the (now deleted) brand hub. Rewrite
// it to point at /all-pages with honest link text. All three forms are tightly
// scoped to the `<div class="container u-max-980">` wrapper so we never match
// an unrelated icon-14 SVG elsewhere in the document (e.g. nav search clear).
//
//   1. INTACT: anchor is still present pointing at the deleted hub
//   2. ORPHAN: previous run stripped the anchor, leaving icon + text bare
//   3. CORRUPTED: an earlier run injected the opening anchor in the wrong
//      element; the body has SVG + " Back to all pages</a>" with no opener
//
// All three collapse to the same canonical anchor — fully idempotent.
const OS_BACK_LINK_CONTAINER_PREFIX_RE = /(<div class="container u-max-980">\s*)/.source;
const OS_BACK_LINK_BODY_SVG_RE =
  /<svg[^>]*class="icon-14"[^>]*><path d="m12 19-7-7 7-7"\/><path d="M19 12H5"\/><\/svg>/.source;

const OS_BACK_LINK_INTACT_RE = new RegExp(
  OS_BACK_LINK_CONTAINER_PREFIX_RE +
    '<a\\s+href="\\/brands\\/brand-[a-j]"\\s+class="legal__back">(' +
    OS_BACK_LINK_BODY_SVG_RE +
    ')\\s*Back to the manufacturer overview<\\/a>',
  'g',
);
const OS_BACK_LINK_ORPHAN_RE = new RegExp(
  OS_BACK_LINK_CONTAINER_PREFIX_RE +
    '(' + OS_BACK_LINK_BODY_SVG_RE + ')\\s*Back to the manufacturer overview',
  'g',
);
const OS_BACK_LINK_CORRUPTED_RE = new RegExp(
  OS_BACK_LINK_CONTAINER_PREFIX_RE +
    '(' + OS_BACK_LINK_BODY_SVG_RE + ')\\s*Back to all pages<\\/a>',
  'g',
);
// Defence in depth: also undo the wrongly-injected opening anchor inside the
// nav search-clear button if a previous buggy run left it there.
const OS_BACK_LINK_NAV_INJECTION_RE =
  /<button class="nav__search-clear" type="button" aria-label="Clear search"><a href="\/all-pages" class="legal__back"><svg/g;
const OS_BACK_LINK_REPLACEMENT =
  '$1<a href="/all-pages" class="legal__back">$2 Back to all pages</a>';

// Mega-menu line variant: "<a href="/brands">Brand Pages</a> · "
// Strip cleanly so the surrounding sentence still flows.
const MEGA_MENU_RE = /<a\s+href="\/brands">Brand Pages<\/a>\s*·\s*/g;

// "Brand Overviews" detail-card section in all-pages.html — start tag → matching </section>
const BRAND_OVERVIEWS_SECTION_RE =
  /<section class="detail-card"><h2>Brand Overviews[\s\S]*?<\/section>/;

// Page count: idempotent — only act when the legacy count (93) is still present.
// Once it's been set to 82 the regex no longer matches, so re-running is a no-op.
const PAGE_COUNT_RE = /93\s+pages total/g;

// JSON-LD: significantLink array on the homepage still listed "/brands".
// Strip the entry (with the comma on either side) so the array stays valid.
const SIGNIFICANT_LINK_BRANDS_RE =
  /,?"https:\/\/www\.printkingdriver\.com\/brands"(?=,|])/g;

// JSON-LD: BreadcrumbList items that point at deleted hubs.
// On the 40 OS sub-pages, each breadcrumb has positions 1=Home, 2=Device Brands,
// 3=the manufacturer, 4=current page. Positions 2 and 3 point at deleted URLs.
// Strip those two ListItem objects, then renumber position 4 → 2.
const BREADCRUMB_BRANDS_ITEMS_RE =
  /,\{"@type":"ListItem","position":[23],"name":"[^"]*","item":"https:\/\/www\.printkingdriver\.com\/brands(\/brand-[a-j])?"\}/g;
const BREADCRUMB_POS4_TO_POS2_RE =
  /\{"@type":"ListItem","position":4,"name":/g;

// Disclaimer pre-existing prose bug: "see the setup guides, , and —" appears
// in section 1 — an earlier scrub left empty list slots between commas.
// Surgical fix: collapse the broken middle to a single em-dash.
const DISCLAIMER_BROKEN_LIST_RE = /the setup guides, , and — it/g;

const htmlFiles = walk(PUBLIC);
let filesTouched = 0;

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // Remove mega-menu "Brand Pages · " prefix wherever it appears.
  html = html.replace(MEGA_MENU_RE, '');

  // Remove the "Brand Overviews" detail-card section (only in all-pages.html).
  html = html.replace(BRAND_OVERVIEWS_SECTION_RE, '');

  // Decrement "X pages total" by 11 (only if file mentions brand-overview history).
  if (file.endsWith('all-pages.html')) {
    html = html.replace(PAGE_COUNT_RE, '82 pages total');
    // Also remove the "brand-overview hubs, individual brand setup walkthroughs" phrase
    // from the intro so it's not misleading.
    html = html.replace(
      /, brand-overview hubs, individual brand setup walkthroughs,/,
      ',',
    );
  }

  // Drop "/brands" from the homepage's significantLink JSON-LD array.
  html = html.replace(SIGNIFICANT_LINK_BRANDS_RE, '');

  // On the 40 OS sub-pages, drop deleted-hub items from BreadcrumbList JSON-LD
  // and renumber the surviving final item from position 4 down to position 2.
  // Order-sensitive: strip items first, then renumber.
  if (BREADCRUMB_BRANDS_ITEMS_RE.test(html)) {
    BREADCRUMB_BRANDS_ITEMS_RE.lastIndex = 0;
    html = html.replace(BREADCRUMB_BRANDS_ITEMS_RE, '');
    html = html.replace(BREADCRUMB_POS4_TO_POS2_RE,
      '{"@type":"ListItem","position":2,"name":');
  }

  // Tidy the pre-existing disclaimer prose bug if we encounter it.
  html = html.replace(DISCLAIMER_BROKEN_LIST_RE, 'the setup guides — it');

  // Repair the OS-page back-link BEFORE the generic stripper runs.
  // Order: undo any nav-injection corruption first (so $1 prefix is clean),
  // then convert intact, orphan, or already-corrupted-but-tagless body forms.
  html = html.replace(OS_BACK_LINK_NAV_INJECTION_RE,
    '<button class="nav__search-clear" type="button" aria-label="Clear search"><svg');
  html = html.replace(OS_BACK_LINK_INTACT_RE, OS_BACK_LINK_REPLACEMENT);
  html = html.replace(OS_BACK_LINK_ORPHAN_RE, OS_BACK_LINK_REPLACEMENT);
  html = html.replace(OS_BACK_LINK_CORRUPTED_RE, OS_BACK_LINK_REPLACEMENT);

  // Replace any remaining hub anchor with its text content (preserves prose).
  html = html.replace(HUB_ANCHOR_RE, (_m, _g1, _g2, text) => text);

  // Final sweep: strip any leftover bare href to a hub (defence in depth).
  html = html.replace(HUB_HREF_RE, 'href="/"');

  if (html !== before) {
    fs.writeFileSync(file, html);
    filesTouched++;
  }
}
console.log(`[2] Scrubbed ${filesTouched} HTML files.`);
totalChanges += filesTouched;

// 3) sitemap.xml — remove the 11 <url> blocks for hub URLs.
{
  const f = path.join(PUBLIC, 'sitemap.xml');
  let xml = fs.readFileSync(f, 'utf8');
  const before = xml;
  // Match <url>...<loc>https://www.printkingdriver.com/brands or /brands/brand-X</loc>...</url>
  // (with NO further path after the brand letter).
  xml = xml.replace(
    /\s*<url>\s*<loc>https:\/\/www\.printkingdriver\.com\/brands(\/brand-[a-j])?<\/loc>[\s\S]*?<\/url>/g,
    '',
  );
  if (xml !== before) {
    fs.writeFileSync(f, xml);
    console.log('[3] sitemap.xml: removed 11 hub <url> blocks.');
    totalChanges++;
  }
}

// 4) llms.txt — remove only lines whose URL is exactly a hub (no further path).
{
  const f = path.join(PUBLIC, 'llms.txt');
  if (fs.existsSync(f)) {
    let txt = fs.readFileSync(f, 'utf8');
    const before = txt;
    const lines = txt.split('\n');
    const HUB_LINE_RE = /https:\/\/www\.printkingdriver\.com\/brands(\/brand-[a-j])?[\s)]/;
    const kept = lines.filter(ln => {
      if (!ln.includes('/brands')) return true;
      // Keep the line if it has a deeper path (e.g. /brands/brand-a/macos)
      const m = ln.match(/https:\/\/www\.printkingdriver\.com\/brands(\/brand-[a-j])?(\/[\w-]+)?/);
      if (!m) return true;
      // m[2] = deeper segment (e.g. "/macos"). If present, keep.
      return Boolean(m[2]);
    });
    txt = kept.join('\n');
    if (txt !== before) {
      fs.writeFileSync(f, txt);
      console.log(`[4] llms.txt: removed ${lines.length - kept.length} hub lines.`);
      totalChanges++;
    }
  }
}

// 5) scripts.js SEARCH_INDEX — remove any object whose href is a hub URL.
{
  const f = path.join(PUBLIC, 'assets/scripts.js');
  let js = fs.readFileSync(f, 'utf8');
  const before = js;
  // Object form: {label:"...",href:"/brands"...} or with brand-X
  js = js.replace(
    /\{\s*[^{}]*href\s*:\s*['"]\/brands(\/brand-[a-j])?['"][^{}]*\}\s*,?\s*/g,
    '',
  );
  if (js !== before) {
    fs.writeFileSync(f, js);
    console.log('[5] scripts.js: removed hub SEARCH_INDEX entries.');
    totalChanges++;
  }
}

// 6) vercel.json — remove the 40 deprecated redirects whose destination is a hub
//    (firmware-update / wireless-setup → /brands/brand-X). Their destinations would 404.
{
  const f = path.join(ROOT, 'vercel.json');
  let json = fs.readFileSync(f, 'utf8');
  const before = json;
  // Match a complete redirect line whose destination is a hub URL.
  json = json.replace(
    /\s*\{\s*"source":\s*"[^"]+",\s*"destination":\s*"\/brands(\/brand-[a-j])?",[^}]*\},?/g,
    '',
  );
  // Also remove any redirect whose source is itself a hub URL (defence in depth).
  json = json.replace(
    /\s*\{\s*"source":\s*"\/brands(\/brand-[a-j])?",[^}]*\},?/g,
    '',
  );
  // Remove brand-name wildcard redirects (e.g. /brands/brother/:path*) whose
  // destination paths now resolve to deleted hubs when :path* is empty.
  // These were old redirects mapping deprecated brand names to the (now gone) anonymised hubs.
  json = json.replace(
    /\s*\{\s*"source":\s*"\/brands\/[a-z]+\/:path\*",[^}]*\},?/g,
    '',
  );
  // Clean up dangling commas left behind when we removed the last entry of the array
  // (e.g. ",\n  ]" → "\n  ]" or ",}" → "}").
  json = json.replace(/,(\s*[\]}])/g, '$1');
  if (json !== before) {
    // Validate JSON still parses.
    try { JSON.parse(json); }
    catch (e) { console.error('[6] vercel.json: JSON broke after edit, aborting.', e.message); process.exit(1); }
    fs.writeFileSync(f, json);
    console.log('[6] vercel.json: removed deprecated brand redirect entries.');
    totalChanges++;
  }
}

console.log(`\nDone. ${totalChanges} change groups applied.`);
