#!/usr/bin/env node
/**
 * strip-os-terms.mjs
 *
 * Removes mentions of PC, Mac, macOS, Linux and standalone "OS" from body
 * content across the site. Leaves the dedicated OS pages untouched
 * (brands/brand-X/macos.html, brands/brand-X/linux.html, brands/brand-X/pc-*.html).
 *
 * Strategy: delete the enclosing sentence/clause/element rather than substitute
 * synonyms, so the resulting copy stays grammatical.
 *
 * Idempotent: re-running on already-clean files does nothing.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'public');

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}

const isExcluded = (p) => {
  const rel = path.relative(ROOT, p).replace(/\\/g, '/');
  return /^brands\/brand-[a-j]\/(macos|linux|pc-\d+)\.html$/.test(rel);
};

const files = walk(ROOT).filter((p) => !isExcluded(p));

const stats = {};
function bump(file, key, n = 1) {
  stats[file] ??= {};
  stats[file][key] = (stats[file][key] || 0) + n;
}

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const orig = fs.readFileSync(file, 'utf8');
  let s = orig;

  /* ────────────────────────────────────────────────────────────────────
     GLOBAL PATTERNS (apply to every in-scope file)
     ──────────────────────────────────────────────────────────────────── */

  // 1. Spec-table footer rows: <div><span>OS Support</span><span>…</span></div>
  s = s.replace(
    /[ \t]*<div><span>OS Support<\/span><span>[^<]*<\/span><\/div>\r?\n?/g,
    (m) => { bump(rel, 'os-support-rows'); return ''; }
  );

  // 2. Related-card links to dedicated OS pages
  //    <a href="/brands/brand-X/(pc-NN|macos|linux)" class="related-card">…</a>
  s = s.replace(
    /<a href="\/brands\/brand-[a-j]\/(?:pc-\d+|macos|linux)"[^>]*class="related-card"[^>]*>[\s\S]*?<\/a>/g,
    () => { bump(rel, 'related-cards'); return ''; }
  );

  // 3. Site-index list items linking to dedicated OS pages
  s = s.replace(
    /<li><a href="\/brands\/brand-[a-j]\/(?:pc-\d+|macos|linux)"[^>]*>[^<]*<\/a><\/li>/g,
    () => { bump(rel, 'sitemap-list-items'); return ''; }
  );

  /* ────────────────────────────────────────────────────────────────────
     FILE-SPECIFIC PATTERNS
     ──────────────────────────────────────────────────────────────────── */

  if (rel === 'drivers.html') {
    // Comparison table: drop the OS column entirely (header + 4 cells)
    s = s.replace(/<th class="hide-lg">OS<\/th>/g, () => { bump(rel, 'th-os'); return ''; });
    s = s.replace(/<td class="hide-lg small">[^<]*<\/td>/g,
      () => { bump(rel, 'td-os-col'); return ''; });
  }

  if (rel === 'drivers/network.html') {
    // Drop the TCP/IP stack row mentioning "OS networking"
    s = s.replace(
      /<tr><td class="strong">TCP\/IP stack<\/td><td>Packet routing<\/td><td class="hide-md mono small">OS networking<\/td><\/tr>/g,
      () => { bump(rel, 'tcpip-row'); return ''; }
    );
  }

  if (rel === 'how-it-works.html') {
    // Step 02 references PC 10/PC 11/macOS — drop entire step block
    s = s.replace(
      /<div class="step"><div class="step__num">02<\/div><h3>Identify the Right Driver<\/h3><p>[^<]*<\/p><\/div>/g,
      () => { bump(rel, 'step-02'); return ''; }
    );
    // FAQ item: PC 10, PC 11, and macOS — drop the whole faq item
    s = s.replace(
      /<div class="faq-elegant__item">\s*<button[^>]*class="faq-elegant__q"[^>]*>[^<]*<\/button>\s*<div class="faq-elegant__a"><p>[^<]*<strong>PC 10, PC 11, and macOS<\/strong>[^<]*<\/p><\/div>\s*<\/div>/g,
      () => { bump(rel, 'faq-platforms'); return ''; }
    );
    // FAQ answer that mentions "your OS and architecture" — strip the offending sentence only
    s = s.replace(
      / As a rule of thumb, choose the most recent version that matches your OS and architecture, and avoid beta or preview builds unless you have a specific reason to test them\./g,
      () => { bump(rel, 'os-rule-sentence'); return ''; }
    );
  }

  if (rel === 'all-pages.html') {
    // Update count: 60 → 20 (40 OS pages removed from list above)
    s = s.replace(/(Brand Setup Guides[^<]*<span class="sitelinks__count">\()60(\))/,
      (_, a, b) => { bump(rel, 'count-60-to-20'); return a + '20' + b; });
    // Drop the parenthesised qualifier "(Brand × OS / Topic)"
    s = s.replace(/Brand Setup Guides \(Brand × OS \/ Topic\)/g,
      () => { bump(rel, 'section-title'); return 'Brand Setup Guides'; });
    // Drop the explanatory paragraph that lists the OS names
    s = s.replace(
      /<p>The brand setup guides are step-by-step walkthroughs[^<]*?, for macOS, and for the leading Linux desktop distributions[^<]*?<\/p>/g,
      () => { bump(rel, 'os-paragraph'); return ''; }
    );
    // Drop "Pages are added regularly as new device models and new operating-system versions ship."
    // (mentions operating-system, not standalone OS — safe to leave; user said remove PC/Mac/OS/Linux only)
  }

  if (rel === 'glossary.html') {
    // Drop intro sentence "Where a term has a different name on macOS and PC, both names are listed."
    s = s.replace(
      / Where a term has a different name on macOS and PC, both names are listed\./g,
      () => { bump(rel, 'glossary-intro-sentence'); return ''; }
    );
    // Drop any glossary <tr> row whose definition mentions the words
    s = s.replace(
      /<tr><td class="strong">[^<]*<\/td><td>[^<]*<\/td><\/tr>/g,
      (m) => {
        if (/\b(PC|Mac|Macs|macOS|Linux)\b/.test(m)) {
          bump(rel, 'glossary-rows');
          return '';
        }
        return m;
      }
    );
  }

  if (rel === 'index.html') {
    // Remove " They allow the OS to recognise and use the most fundamental components of a computer." (slide-card)
    s = s.replace(/ They allow the OS to recognise and use the most fundamental components of a computer\./g,
      () => { bump(rel, 'idx-slide-1'); return ''; });
    // Remove " They enable the OS to fully use each component's features and performance."
    s = s.replace(/ They enable the OS to fully use each component['’]s features and performance\./g,
      () => { bump(rel, 'idx-slide-2'); return ''; });
    // Remove "Initialises hardware before the OS loads." (slide-item__note)
    s = s.replace(/<div class="slide-item__note">Initialises hardware before the OS loads\.<\/div>/g,
      () => { bump(rel, 'idx-slide-note'); return ''; });
    // Remove "Bridge the OS to the devices you use" → drop whole heading + its contents wouldn't make sense.
    // Replace the heading text by removing the OS-mentioning words:
    // Per user "do not exchange" — the entire <h3> can be dropped if it's just OS reference.
    // The h3 introduces a section. Let's drop the heading line only.
    s = s.replace(/<h3>Bridge the OS to the devices you use<\/h3>/g,
      () => { bump(rel, 'idx-h3-bridge'); return ''; });
    // Boot Firmware li: "Initialises hardware during system startup before the OS loads, ensures components are ready, and exposes system-level settings."
    s = s.replace(
      /<li><strong>Boot Firmware<\/strong><span>Initialises hardware during system startup before the OS loads, ensures components are ready, and exposes system-level settings\.<\/span><\/li>/g,
      () => { bump(rel, 'idx-boot-firmware-li'); return ''; }
    );
    // Spotlight pillar D: "Works seamlessly with apps, browsers, and OS updates."
    s = s.replace(
      /<div class="spotlight__pillar-d">Works seamlessly with apps, browsers, and OS updates\.<\/div>/g,
      () => { bump(rel, 'idx-spotlight-d'); return ''; }
    );
    // Big driver overview table: remove rows whose td contains "OS"
    s = s.replace(
      /<tr><td class="strong">[^<]*<\/td><td>[^<]*<\/td><td class="hide-md">[^<]*<\/td><\/tr>/g,
      (m) => {
        if (/\bOS\b/.test(m)) { bump(rel, 'idx-tr-os'); return ''; }
        return m;
      }
    );
  }

  /* ────────────────────────────────────────────────────────────────────
     BRAND INDEX PAGES (brands/brand-a.html … brand-j.html, NOT sub-pages)
     ──────────────────────────────────────────────────────────────────── */
  if (/^brands\/brand-[a-j]\.html$/.test(rel)) {
    // Common pattern: "...on PC, macOS, iOS and Android..." or "publishes PC, macOS and Linux drivers..."
    // Drop common enumerations within paragraphs by removing the whole <p> only if its
    // primary content is OS enumeration. Safer approach: strip just the offending clause.
    //
    // Strategy: target known stock phrases used across brand pages.
    s = s.replace(
      / Most modern[^<]*?queue can be created without setting up a vendor driver at all\./g,
      () => { bump(rel, 'brand-airprint-clause'); return ''; }
    );
    s = s.replace(
      / Most [^<]*?devices are also IPP-Everywhere certified, so a queue can be added on PC, macOS, iOS and Android without setting up the vendor package\./g,
      () => { bump(rel, 'brand-ipp-clause'); return ''; }
    );
    s = s.replace(
      /The manufacturer publishes PC, macOS and Linux drivers under model-specific download pages\. /g,
      () => { bump(rel, 'brand-publishes-os'); return ''; }
    );
    // Generic catch-all: any "PC, macOS and Linux" / "PC, macOS, Linux" / "PC and macOS" enumerations
    s = s.replace(
      /\bPC, macOS,? (?:and )?Linux\b\.?/g,
      () => { bump(rel, 'brand-enum-3'); return ''; }
    );
    s = s.replace(
      /\bPC,? (?:and )?macOS\b\.?/g,
      () => { bump(rel, 'brand-enum-2'); return ''; }
    );
    // Table rows like "<tr><td>Operating systems</td><td>PC, macOS, Linux</td></tr>"
    s = s.replace(
      /<tr><td[^>]*>[^<]*<\/td><td[^>]*>[^<]*<\/td><\/tr>/g,
      (m) => {
        if (/\b(PC|Mac|Macs|macOS|Linux)\b/.test(m)) {
          bump(rel, 'brand-table-row');
          return '';
        }
        return m;
      }
    );
  }

  /* ────────────────────────────────────────────────────────────────────
     DRIVERS SUB-PAGES (drivers/*.html)
     ──────────────────────────────────────────────────────────────────── */

  if (/^drivers\//.test(rel)) {
    // Detail-list <li> bullets that mention PC/OS/Linux/Mac in their inner span
    s = s.replace(
      /<li><span class="detail-list__bullet">(?:[\s\S]*?)<\/span><span>([^<]*)<\/span><\/li>/g,
      (m, txt) => {
        if (/\b(PC|Mac|Macs|macOS|Linux|OS)\b/.test(txt)) {
          bump(rel, 'driver-bullet'); return '';
        }
        return m;
      }
    );
    // Issue-table rows mentioning the words
    s = s.replace(
      /<tr><td class="strong">[^<]*<\/td><td>[^<]*<\/td><td class="hide-md small">[^<]*<\/td><\/tr>/g,
      (m) => {
        if (/\b(PC|Mac|Macs|macOS|Linux)\b/.test(m)) {
          bump(rel, 'driver-tr3'); return '';
        }
        return m;
      }
    );
    // 4-col table rows
    s = s.replace(
      /<tr><td class="strong">[^<]*<\/td><td>[^<]*<\/td><td class="hide-md (?:small|mono small)">[^<]*<\/td><\/tr>/g,
      (m) => {
        if (/\b(PC|Mac|Macs|macOS|Linux)\b/.test(m) && /<td/.test(m)) {
          // Only delete if we haven't already (avoid double-match)
          bump(rel, 'driver-tr-mono'); return '';
        }
        return m;
      }
    );
  }

  // Shared predicate: does this string contain a forbidden word (excluding MAC layer/address)?
  const BAD = /\b(PC|Mac|Macs|macOS|Linux|OS)\b/;
  const SAFE_MAC = /MAC layer|MAC address/;
  const hasBad = (text) => BAD.test(text) && !SAFE_MAC.test(text);

  /* ────────────────────────────────────────────────────────────────────
     UNIVERSAL: bullets with inner <strong> tags whose text mentions words
     ──────────────────────────────────────────────────────────────────── */
  s = s.replace(
    /<li><span class="detail-list__bullet">(?:[\s\S]*?)<\/span><span>(?:(?!<\/li>)[\s\S])*?<\/span><\/li>/g,
    (m) => {
      const text = m.replace(/<[^>]+>/g, '');
      if (hasBad(text)) { bump(rel, 'detail-bullet-strong'); return ''; }
      return m;
    }
  );

  /* ────────────────────────────────────────────────────────────────────
     UNIVERSAL: FAQ items containing the words (visible HTML)
     ──────────────────────────────────────────────────────────────────── */
  s = s.replace(
    /<div class="faq__item">(?:[\s\S]*?)<div class="faq__a">(?:[\s\S]*?)<\/div>\s*<\/div>/g,
    (m) => {
      const text = m.replace(/<[^>]+>/g, '');
      if (hasBad(text)) { bump(rel, 'faq-item'); return ''; }
      return m;
    }
  );
  s = s.replace(
    /<div class="faq-elegant__item">(?:[\s\S]*?)<\/div>\s*<\/div>/g,
    (m) => {
      const text = m.replace(/<[^>]+>/g, '');
      if (hasBad(text)) { bump(rel, 'faq-elegant-item'); return ''; }
      return m;
    }
  );

  /* ────────────────────────────────────────────────────────────────────
     UNIVERSAL: table rows — delete any <tr> whose visible text mentions words
     ──────────────────────────────────────────────────────────────────── */
  s = s.replace(/<tr>(?:(?!<\/tr>)[\s\S])*?<\/tr>/g, (m) => {
    const text = m.replace(/<[^>]+>/g, '');
    if (hasBad(text)) { bump(rel, 'tr'); return ''; }
    return m;
  });

  /* ────────────────────────────────────────────────────────────────────
     UNIVERSAL: paragraphs — sentence-strip
     ──────────────────────────────────────────────────────────────────── */
  s = s.replace(/<p([^>]*)>([\s\S]*?)<\/p>/g, (full, attrs, inner) => {
    if (!BAD.test(inner) || SAFE_MAC.test(inner)) return full;
    const parts = inner.split(/(?<=[.!?])\s+/);
    const kept = parts.filter((p) => !hasBad(p));
    if (kept.length === parts.length) return full;
    bump(rel, 'p-sentence-strip', parts.length - kept.length);
    const newInner = kept.join(' ').trim();
    if (!newInner) return '';
    return `<p${attrs}>${newInner}</p>`;
  });

  /* ────────────────────────────────────────────────────────────────────
     UNIVERSAL: JSON-LD <script> — clean Question/Answer + meta strings
     ──────────────────────────────────────────────────────────────────── */
  s = s.replace(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
    (full, open, body, close) => {
      let json;
      try {
        json = JSON.parse(body);
      } catch {
        return full; // leave malformed JSON untouched
      }
      const containsBad = (str) =>
        typeof str === 'string' &&
        /\b(PC|Mac|Macs|macOS|Linux|OS)\b/.test(str) &&
        !/MAC layer|MAC address/.test(str);

      const stripSentencesFromText = (str) => {
        if (typeof str !== 'string') return str;
        const parts = str.split(/(?<=[.!?])\s+/);
        const kept = parts.filter((p) => !containsBad(p));
        if (kept.length !== parts.length) bump(rel, 'jsonld-sentence-strip', parts.length - kept.length);
        return kept.join(' ').trim();
      };

      const cleanNode = (node) => {
        if (Array.isArray(node)) {
          return node
            .map(cleanNode)
            .filter((n) => {
              if (n && typeof n === 'object' && n['@type'] === 'Question') {
                const q = (n.name || '') + ' ' + ((n.acceptedAnswer && n.acceptedAnswer.text) || '');
                if (containsBad(q)) {
                  bump(rel, 'jsonld-question-drop');
                  return false;
                }
              }
              return true;
            });
        }
        if (node && typeof node === 'object') {
          const out = {};
          for (const [k, v] of Object.entries(node)) {
            if (typeof v === 'string' && containsBad(v) && (k === 'description' || k === 'name' || k === 'text')) {
              const cleaned = stripSentencesFromText(v);
              out[k] = cleaned;
            } else {
              out[k] = cleanNode(v);
            }
          }
          return out;
        }
        return node;
      };

      const cleaned = cleanNode(json);
      const newBody = JSON.stringify(cleaned);
      if (newBody !== body.trim()) {
        return open + newBody + close;
      }
      return full;
    }
  );

  /* ────────────────────────────────────────────────────────────────────
     CLEANUP
     ──────────────────────────────────────────────────────────────────── */

  // Empty related-grids left behind
  s = s.replace(/<div class="related-grid">\s*<\/div>/g, '');
  // Empty FAQ wrappers
  s = s.replace(/<div class="faq__inner[^"]*">\s*<\/div>/g, '');
  // Double spaces from sentence removals
  s = s.replace(/  +/g, ' ');
  // Empty paragraphs
  s = s.replace(/<p[^>]*>\s*<\/p>/g, '');

  if (s !== orig) {
    fs.writeFileSync(file, s);
  }
}

const total = Object.keys(stats).length;
console.log(`\nModified ${total} file(s):\n`);
for (const f of Object.keys(stats).sort()) {
  const breakdown = Object.entries(stats[f]).map(([k, v]) => `${k}=${v}`).join(', ');
  console.log(`  ${f}  →  ${breakdown}`);
}
console.log('\nDone.\n');
