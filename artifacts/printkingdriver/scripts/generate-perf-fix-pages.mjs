// Generates 40 driver-performance fix pages and updates all indexes.
// Uses the existing fix-driver-not-found-error.html as the structural template
// so nav, footer and design stay identical to the other 20 fix pages.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './perf-fix-pages-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const TEMPLATE_FILE = path.join(PUB, 'fix-driver-not-found-error.html');
const TEMPLATE_SLUG = 'fix-driver-not-found-error';
const SITE = 'https://www.printkingdriver.com';
const FIX_KEYWORDS = 'error fix troubleshoot resolve solve repair driver issue problem';

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeJson = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const CHECK_BULLET = '<span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span>';
const SHIELD_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-32" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';
const BACK_ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-14" aria-hidden="true"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>';

function buildJsonLd(p) {
  const url = `${SITE}/${p.slug}`;
  const steps = p.steps.map(([label, body], i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: label.replace(/\.$/, ''),
    text: body,
  }));
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'PrintKingDriver',
      url: `${SITE}/`,
      email: 'support@printkingdriver.com',
      logo: { '@type': 'ImageObject', url: `${SITE}/assets/images/logo-crown.png` },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'PrintKingDriver',
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: `${p.title} | PrintKingDriver`,
      description: p.metaDesc,
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#organization` },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'HowTo',
      name: p.title,
      description: p.metaDesc,
      step: steps,
    },
  ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function buildMain(p) {
  const stepsHtml = p.steps
    .map(([label, body], i) => `<li>${CHECK_BULLET}<span><strong>Step ${i + 1} — ${escapeHtml(label)}.</strong> ${escapeHtml(body)}</span></li>`)
    .join('\n');
  const symptomsHtml = p.symptoms
    .map((s) => `<li>${CHECK_BULLET}<span>${escapeHtml(s)}</span></li>`)
    .join('\n');
  const tipsHtml = p.tips
    .map((t) => `<li>${CHECK_BULLET}<span>${escapeHtml(t)}</span></li>`)
    .join('\n');

  return ` <main>

 <div class="detail-bg cat-essential">
 <div class="container u-max-980">
 <a href="/" class="legal__back">${BACK_ARROW} Back to home</a>

 <header class="detail-head">
 <div class="detail-head__icon cat-icon">${SHIELD_ICON}</div>
 <div>
 <div class="eyebrow">Error Fix Guide</div>
 <h1>${escapeHtml(p.title)}</h1>
 <p>${escapeHtml(p.subtitle)}</p>
 </div>
 </header>

 <section class="detail-card">
 <h2>${escapeHtml(p.leadHead || 'What Is Happening')}</h2>
 <p>${escapeHtml(p.lead)}</p>
 </section>

 <section class="detail-card">
 <h2>Step-by-Step Fix</h2>
 <p class="u-mb-16">Work through the steps below in order. Most readers find the issue clears within the first three or four checks; the later steps are for the cases that need a closer look.</p>
 <ul class="detail-list">
${stepsHtml}
 </ul>
 </section>

 <section class="detail-card detail-card--accent">
 <h2>Why This Happens</h2>
 <p>${escapeHtml(p.why)}</p>
 </section>

 <section class="detail-card">
 <h2>Common Symptoms</h2>
 <p class="u-mb-16">A few clear signals usually point at this issue before any deeper check is needed. Watch for the patterns below.</p>
 <ul class="detail-list">
${symptomsHtml}
 </ul>
 </section>

 <section class="detail-card">
 <h2>Quick Tips</h2>
 <p class="u-mb-16">Before spending time on deeper checks, run through these short reminders — they catch the majority of cases on the first try.</p>
 <ul class="detail-list">
${tipsHtml}
 </ul>
 </section>

 <section class="detail-card">
 <h2>In Summary</h2>
 <p>${escapeHtml(p.summary)}</p>
 </section>

 </div>
 </div>
 </main>`;
}

function visibleWords(html) {
  // Strip from <main> ... </main>, then strip tags, then count words.
  const m = html.match(/<main>([\s\S]*?)<\/main>/);
  if (!m) return 0;
  const text = m[1]
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

async function main() {
  const tpl = await fs.readFile(TEMPLATE_FILE, 'utf8');

  // Slugs we will write
  console.log(`Generating ${PAGES.length} pages...`);

  const written = [];
  const wordCounts = [];

  for (const p of PAGES) {
    let html = tpl;

    // 1) <title> — entity-safe replacement using regex on tag, not literal string match.
    const newTitle = `${escapeHtml(p.title)} | PrintKingDriver`;
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${newTitle}</title>`);

    // 2) Meta description (and OG/Twitter equivalents) via attribute regex.
    const desc = escapeAttr(p.metaDesc);
    html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${desc}$2`);
    html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${desc}$2`);
    html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${desc}$2`);

    // 3) OG/Twitter title
    html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escapeAttr(`${p.title} | PrintKingDriver`)}$2`);
    html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${escapeAttr(`${p.title} | PrintKingDriver`)}$2`);

    // 4) Canonical URL (and any other absolute refs to the template slug)
    html = html.split(`${SITE}/${TEMPLATE_SLUG}`).join(`${SITE}/${p.slug}`);

    // 5) JSON-LD — replace the entire ld+json block (single line in template)
    const ldBlock = `<script type="application/ld+json">${buildJsonLd(p)}</script>`;
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ldBlock);

    // 6) <main>...</main> swap
    html = html.replace(/<main>[\s\S]*?<\/main>/, buildMain(p));

    // Validate word count of the rendered <main>
    const wc = visibleWords(html);
    wordCounts.push({ slug: p.slug, words: wc });
    if (wc < 600 || wc > 700) {
      console.warn(`!! ${p.slug}: ${wc} words (target 600-700)`);
    }

    const outFile = path.join(PUB, `${p.slug}.html`);
    await fs.writeFile(outFile, html, 'utf8');
    written.push(p.slug);
  }

  console.log(`Wrote ${written.length} files.`);
  const offBudget = wordCounts.filter((w) => w.words < 600 || w.words > 700);
  console.log(`Word-count summary: in-budget ${wordCounts.length - offBudget.length} / off-budget ${offBudget.length}`);
  if (offBudget.length) {
    console.log('Off-budget pages:');
    offBudget.forEach((w) => console.log(`  ${w.slug}: ${w.words}`));
  }

  // === Update indexes ===
  await updateAllPages(PAGES);
  await updateSitemapXml(PAGES);
  await updateLlmsTxt(PAGES);
  await updateSearchIndex(PAGES);

  console.log('All indexes updated.');
}

async function updateAllPages(pages) {
  const file = path.join(PUB, 'all-pages.html');
  let html = await fs.readFile(file, 'utf8');

  // Idempotency: strip any previously-inserted Performance Fix Guides section(s).
  html = html.replace(/\n\s*<section class="ap-block">\s*<h2>Performance Fix Guides[\s\S]*?<\/section>\s*/g, '\n');

  // Reset the page count back to 53, then bump to the new total (53 base + N new).
  html = html.replace(/\d+\s+pages total/g, '53 pages total');
  html = html.replace(/53 pages total/g, `${53 + pages.length} pages total`);

  // Build the new section
  const items = pages
    .map((p) => `<li><a href="/${p.slug}">${escapeHtml(p.title)}</a></li>`)
    .join('\n');
  const section = `\n <section class="ap-block">\n <h2>Performance Fix Guides (${pages.length})</h2>\n <ul class="ap-list">\n${items}\n </ul>\n </section>\n`;

  // Insert before the closing </div></div></main> of the all-pages container.
  // Find the last </section> before </main>.
  const marker = '</main>';
  const idx = html.lastIndexOf(marker);
  if (idx === -1) throw new Error('Could not locate </main> in all-pages.html');
  // Insert the new section just before </main>'s wrapping div closures.
  // Strategy: find the last </section> before </main> and insert after it.
  const before = html.slice(0, idx);
  const lastSecCloseIdx = before.lastIndexOf('</section>');
  if (lastSecCloseIdx === -1) throw new Error('Could not locate last </section> in all-pages.html');
  const insertPos = lastSecCloseIdx + '</section>'.length;
  html = html.slice(0, insertPos) + section + html.slice(insertPos);

  await fs.writeFile(file, html, 'utf8');
  console.log('all-pages.html updated.');
}

async function updateSitemapXml(pages) {
  const file = path.join(PUB, 'sitemap.xml');
  let xml = await fs.readFile(file, 'utf8');
  const today = new Date().toISOString().slice(0, 10);

  // Idempotency: strip any previously-inserted <url>...</url> blocks for our slugs.
  // Also dedupes any duplicate URL blocks regardless of leading whitespace.
  const slugSet = new Set(pages.map((p) => p.slug));
  const seen = new Set();
  xml = xml.replace(/[ \t]*<url>[\s\S]*?<\/url>\s*/g, (block) => {
    const m = block.match(/<loc>([^<]+)<\/loc>/);
    if (!m) return block;
    const loc = m[1];
    const slug = loc.replace(`${SITE}/`, '').replace(/^https?:\/\/[^/]+\//, '');
    if (slugSet.has(slug)) return '';
    if (seen.has(loc)) return '';
    seen.add(loc);
    return block;
  });

  const entries = pages
    .map((p) => `  <url>\n    <loc>${SITE}/${p.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`)
    .join('\n');

  xml = xml.replace('</urlset>', `${entries}\n</urlset>`);
  await fs.writeFile(file, xml, 'utf8');
  console.log('sitemap.xml updated.');
}

async function updateLlmsTxt(pages) {
  const file = path.join(PUB, 'llms.txt');
  let txt = await fs.readFile(file, 'utf8');

  // Idempotency: strip any previously-inserted "## Performance Fix Guides" blocks
  // (from the heading until the next "## " heading or end of file).
  txt = txt.replace(/\n## Performance Fix Guides[\s\S]*?(?=\n## |\s*$)/g, '\n');

  const lines = pages
    .map((p) => `- /${p.slug} — ${p.subtitle}`)
    .join('\n');
  const block = `\n## Performance Fix Guides (${pages.length})\n\nFocused fix guides for driver-related performance issues, written in plain language and free of brand names.\n\n${lines}\n`;
  txt = txt.trimEnd() + '\n' + block + '\n';
  await fs.writeFile(file, txt, 'utf8');
  console.log('llms.txt updated.');
}

async function updateSearchIndex(pages) {
  const file = path.join(PUB, 'assets', 'scripts.js');
  let js = await fs.readFile(file, 'utf8');

  // Find SEARCH_INDEX = [ ... ];
  const m = js.match(/(const|var|let)\s+SEARCH_INDEX\s*=\s*\[/);
  if (!m) throw new Error('SEARCH_INDEX not found in scripts.js');
  const startIdx = js.indexOf('[', m.index);
  // Find matching ]
  let depth = 0;
  let endIdx = -1;
  for (let i = startIdx; i < js.length; i++) {
    if (js[i] === '[') depth++;
    else if (js[i] === ']') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }
  if (endIdx === -1) throw new Error('Could not match SEARCH_INDEX closing bracket');

  // Idempotency: strip any previously-inserted entries for our slugs (any object
  // shape — old `{title:...}` or new `{ label: ... }` formats) by matching on href.
  let body = js.slice(startIdx + 1, endIdx);
  for (const p of pages) {
    const slugEsc = p.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match a full object literal containing href:"/<slug>" — handles spaces and any property order.
    const re = new RegExp(`,?\\s*\\{[^{}]*href:\\s*"\\/${slugEsc}"[^{}]*\\}`, 'g');
    body = body.replace(re, '');
  }

  // Build new entries to append using the existing schema: label/href/type/keywords.
  const entries = pages
    .map((p) => `    { label: "${escapeJson(p.title)}", href: "/${p.slug}", type: "Fix", keywords: "${FIX_KEYWORDS}" }`)
    .join(',\n');

  const trimmedBody = body.replace(/,?\s*$/, '');
  const newBody = trimmedBody + (trimmedBody.trim() ? ',\n' : '\n') + entries + '\n  ';

  js = js.slice(0, startIdx + 1) + newBody + js.slice(endIdx);

  await fs.writeFile(file, js, 'utf8');
  console.log('scripts.js SEARCH_INDEX updated.');
}

await main();
