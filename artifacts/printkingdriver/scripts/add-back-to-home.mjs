#!/usr/bin/env node
/**
 * Add a consistent "Back to home" link to top-nav pages that previously
 * had no back button: about, contact, how-it-works, 404.
 * The link sits inside a small u-max-980 container immediately after <main>,
 * matching the pattern already used on drivers.html.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');

const TARGETS = ['about.html', 'contact.html', 'how-it-works.html', '404.html'];

const BACK_HTML = `      <div class="container u-max-980" style="padding-top:24px;">
        <a href="/" class="legal__back"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-14" aria-hidden="true"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg> Back to home</a>
      </div>
`;

for (const file of TARGETS) {
  const fp = path.join(PUBLIC, file);
  let html = fs.readFileSync(fp, 'utf8');

  if (/legal__back/.test(html)) {
    console.log(`SKIP ${file}: already has a back link`);
    continue;
  }

  const m = html.match(/<main(?:\s[^>]*)?>/);
  if (!m) {
    console.log(`SKIP ${file}: no <main> tag`);
    continue;
  }

  const insertAt = m.index + m[0].length;
  html = html.slice(0, insertAt) + '\n' + BACK_HTML + html.slice(insertAt);
  fs.writeFileSync(fp, html);
  console.log(`OK   ${file}: inserted Back to home link`);
}
