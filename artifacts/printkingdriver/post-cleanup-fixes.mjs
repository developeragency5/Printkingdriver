#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public');

// ---------- A. Fix vercel.json ----------
async function fixVercel() {
  const f = 'vercel.json';
  let s = await fs.readFile(f, 'utf8');
  const orig = s;

  // 1. Repoint all 18 existing destinations from /drivers/device → /drivers
  const before = (s.match(/"destination":\s*"\/drivers\/device"/g) || []).length;
  s = s.replace(/"destination":\s*"\/drivers\/device"/g, '"destination": "/drivers"');
  console.log(`Repointed ${before} existing redirects FROM /drivers/device TO /drivers`);

  // 2. Add a fresh redirect entry for direct hits on /drivers/device
  if (!/"source":\s*"\/drivers\/device"/.test(s)) {
    s = s.replace(
      /("redirects":\s*\[)\s*\n/,
      `$1\n    { "source": "/drivers/device", "destination": "/drivers", "permanent": true },\n`
    );
    console.log('Added new redirect: /drivers/device → /drivers');
  }

  if (s !== orig) await fs.writeFile(f, s);
  // Confirm structure
  try { JSON.parse(s); console.log('vercel.json: valid JSON'); }
  catch (e) { console.error('vercel.json INVALID JSON:', e.message); process.exit(1); }
  const total = (s.match(/"source":/g) || []).length;
  console.log(`vercel.json: ${total} total redirect entries`);
}

// ---------- B. Fix unescaped quotes in fix pages ----------
// Some titles contain "Driver Not Found" with straight double quotes which break
// content="..." attributes. Replace " with curly quotes ldquo / rdquo in the
// affected pages — pretty AND valid HTML.
async function fixQuotedTitles() {
  const targets = [
    'fix-driver-not-found-error.html',
    'fix-driver-not-responding-error.html',
  ];
  for (const name of targets) {
    const f = path.join(ROOT, name);
    let s = await fs.readFile(f, 'utf8');
    const orig = s;
    // Replace ALL " with curly quotes within the head meta block ONLY where the
    // straight quotes are wrapping the error name. Pattern: ""Driver X" inside content="..."
    // Use a generic approach: find content="..." attribute strings, and within their value,
    // replace internal straight quotes with curly. We only need to fix the head <meta> tags
    // and the page <title>.
    // Simpler: in the FIRST 2000 characters, replace ""X" patterns with &ldquo;X&rdquo;
    const head = s.slice(0, 2500);
    const fixed = head
      // Title tag: <title>"X" Y</title>  →  <title>&ldquo;X&rdquo; Y</title>
      .replace(/<title>"([^"]+)" /, '<title>&ldquo;$1&rdquo; ')
      // content="A "driver X" error  →  content="A &ldquo;driver X&rdquo; error
      .replace(/content="A "([^"]+)" /g, 'content="A &ldquo;$1&rdquo; ')
      // og:title: content=""Driver Not Found" Error  →  content="&ldquo;Driver Not Found&rdquo; Error
      .replace(/content=""([^"]+)" /g, 'content="&ldquo;$1&rdquo; ');
    s = fixed + s.slice(2500);
    if (s !== orig) {
      await fs.writeFile(f, s);
      console.log(`Fixed unescaped quotes in ${name}`);
    } else {
      console.log(`No quote fix needed in ${name}`);
    }
  }
}

await fixVercel();
await fixQuotedTitles();
console.log('Done.');
