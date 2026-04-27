import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('public');
const VERCEL = path.resolve('vercel.json');

const BRANDS = ['brand-a','brand-b','brand-c','brand-d','brand-e','brand-f','brand-g','brand-h','brand-i','brand-j'];

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}

const log = (m) => console.log(m);

log('=== PHASE 1: Delete files ===');
let deletes = 0;
for (const b of BRANDS) {
  const p = path.join(ROOT, 'brands', b, 'scanner-setup.html');
  if (fs.existsSync(p)) { fs.unlinkSync(p); deletes++; log(`  deleted ${path.relative(ROOT,p)}`); }
}
const orphanImages = [
  'assets/images/how-to-update.webp',
  'assets/images/drivers/scanner.jpg',
  'assets/images/drivers/printer.jpg',
];
for (const f of orphanImages) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) { fs.unlinkSync(p); deletes++; log(`  deleted ${f}`); }
}
log(`  total deletions: ${deletes}`);

log('\n=== PHASE 2: Rename files ===');
let renames = 0;
function renameSafe(from, to) {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    renames++;
    log(`  ${path.relative(ROOT, from)} -> ${path.relative(ROOT, to)}`);
  }
}
renameSafe(path.join(ROOT,'drivers','printer.html'), path.join(ROOT,'drivers','device.html'));
for (const b of BRANDS) {
  renameSafe(path.join(ROOT,'brands',b,'windows-11.html'), path.join(ROOT,'brands',b,'pc-11.html'));
  renameSafe(path.join(ROOT,'brands',b,'windows-10.html'), path.join(ROOT,'brands',b,'pc-10.html'));
}
log(`  total renames: ${renames}`);

log('\n=== PHASE 3: Text/URL replacements across all HTML/TXT/XML ===');

// Replacement rules — applied in order. [pattern, replacement]
// Most specific FIRST to avoid double-replacement issues.
const RULES = [
  // ---- URL paths (do these BEFORE generic word replacements) ----
  [/\/drivers\/printer\b/g, '/drivers/device'],
  [/\/brands\/(brand-[a-j])\/windows-11\b/g, '/brands/$1/pc-11'],
  [/\/brands\/(brand-[a-j])\/windows-10\b/g, '/brands/$1/pc-10'],

  // ---- Brand-name leaks (most specific first) ----
  [/kyoceradocumentsolutions\.com/gi, 'the manufacturer support site'],
  [/KYOCERA Mobile Print/g, 'the manufacturer mobile app'],
  [/KYOCERA Scan To Folder/g, 'the manufacturer document tool'],
  [/KYOCERA/g, 'the manufacturer'],
  [/RICOH Smart Device Connector/g, 'the manufacturer smart device app'],
  [/RICOH/g, 'the manufacturer'],

  // ---- Compound terms (specific first) ----
  [/\bScanner Access Now Easy\b/g, 'Document Access Tool'],
  [/\bScanner Setup Walkthrough\b/g, 'Device Setup Walkthrough'],
  [/\bScanner Setup Reference\b/g, 'Device Setup Reference'],
  [/\bScanner Setup\b/g, 'Device Setup'],
  [/\bscanner-setup\b/g, 'device-setup'],
  [/\bScan To Folder\b/g, 'Send To Folder'],
  [/\bScan To Email\b/g, 'Send To Email'],
  [/\bScan To Computer\b/g, 'Send To Computer'],
  [/\bScan To PDF\b/g, 'Send To PDF'],
  [/\bScan To\b/g, 'Send To'],
  [/\bscan-to-/g, 'send-to-'],
  [/\bscanning, fax\b/gi, 'image capture, fax'],
  [/\bScanner Drivers?\b/g, 'Device Drivers'],
  [/\bScanner Support\b/g, 'Device Support'],
  [/\bScanner not recognised\b/g, 'Device not recognised'],
  [/\bscanner driver\b/g, 'device driver'],
  [/\bscanner control\b/g, 'device control'],
  [/\bscanner manufacturer\b/g, 'device manufacturer'],
  [/\bscanner application\b/g, 'capture application'],
  [/\bscanning application\b/g, 'capture application'],

  // ---- Print-related compound (Print as activity is OK; Printer is not) ----
  [/\bPrint Spooler\b/g, 'Job Spooler'],
  [/\bPrint Queue\b/g, 'Job Queue'],
  [/\bPrint Server\b/g, 'Job Server'],
  [/\bprint spooler\b/g, 'job spooler'],
  [/\bprint queue\b/g, 'job queue'],
  [/\bprint queues\b/g, 'job queues'],
  [/\bprint server\b/g, 'job server'],
  [/\bprint servers\b/g, 'job servers'],
  [/\bPrint Driver\b/g, 'Output Driver'],
  [/\bprint driver\b/g, 'output driver'],
  [/\bprint drivers\b/g, 'output drivers'],
  [/\bPrint-only driver\b/g, 'Output-only driver'],
  [/\bPrint-only\b/g, 'Output-only'],
  [/\bprint-only\b/g, 'output-only'],
  [/\bPC Print v3 \/ v4\b/g, 'PC Output v3 / v4'],
  [/\bPC Modern Print Platform\b/g, 'PC Modern Output Platform'],

  // ---- Single forbidden words (case sensitive) ----
  [/\bScanners\b/g, 'Devices'],
  [/\bScanner\b/g, 'Device'],
  [/\bScanning\b/g, 'Document Capture'],
  [/\bscanners\b/g, 'devices'],
  [/\bscanner\b/g, 'device'],
  [/\bscanning\b/g, 'image capture'],

  [/\bPrinters\b/g, 'Devices'],
  [/\bPrinter\b/g, 'Device'],
  [/\bprinters\b/g, 'devices'],
  // 'printer' lowercase: must NOT touch 'printkingdriver' — but \bprinter\b won't match it
  [/\bprinter\b/g, 'device'],

  [/\bTroubleshooting\b/g, 'Issue Reference'],
  [/\bTroubleshoot\b/g, 'Diagnose'],
  [/\btroubleshooting\b/g, 'issue reference'],
  [/\btroubleshoot\b/g, 'diagnose'],

  [/\bWindows 11\b/g, 'PC 11'],
  [/\bWindows 10\b/g, 'PC 10'],
  [/\bWindows\b/g, 'PC'],

  [/\bInstaller\b/g, 'Setup Tool'],
  [/\bInstallation\b/g, 'Set Up'],
  [/\bInstalling\b/g, 'Setting Up'],
  [/\bInstall\b/g, 'Set Up'],
  [/\binstaller\b/g, 'setup tool'],
  [/\binstallation\b/g, 'set up'],
  [/\binstalling\b/g, 'setting up'],
  [/\binstall\b/g, 'set up'],

  // ---- Standalone 'scan' (verb) — must come AFTER 'scan-to-' / 'Scan To' ----
  [/\bScan\b/g, 'Capture'],
  [/\bscan\b/g, 'capture'],

  // ---- Cleanup of awkward repetitions ----
  [/\bthe the manufacturer\b/g, 'the manufacturer'],
  [/\bThe the manufacturer\b/g, 'The manufacturer'],
];

const ALL = walk(ROOT).filter(p => /\.(html|xml|txt)$/i.test(p));
let changedCount = 0;
let totalSubs = 0;
for (const f of ALL) {
  const orig = fs.readFileSync(f, 'utf8');
  let out = orig;
  for (const [pat, rep] of RULES) {
    out = out.replace(pat, rep);
  }
  if (out !== orig) {
    fs.writeFileSync(f, out);
    changedCount++;
    // Rough estimate of subs:
    totalSubs += Math.abs(out.length - orig.length);
  }
}
log(`  files modified: ${changedCount} / ${ALL.length}`);

log('\n=== PHASE 4: Remove scanner-setup card from each brand-X.html related-grid ===');
const SCANNER_CARD_RE = /<a href="\/brands\/brand-[a-j]\/device-setup" class="related-card">(?:(?!<\/a>).)*<\/a>/gs;
let cardRemovals = 0;
for (const b of BRANDS) {
  const p = path.join(ROOT, 'brands', `${b}.html`);
  if (!fs.existsSync(p)) continue;
  const orig = fs.readFileSync(p, 'utf8');
  const out = orig.replace(SCANNER_CARD_RE, '');
  if (out !== orig) { fs.writeFileSync(p, out); cardRemovals++; }
}
log(`  brand index cards stripped: ${cardRemovals}`);

log('\n=== PHASE 5: Update vercel.json ===');
const v = JSON.parse(fs.readFileSync(VERCEL, 'utf8'));
const before = v.redirects.length;

// Add new redirects (avoid duplicates by source)
const existingSources = new Set(v.redirects.map(r => r.source));
function addRedirect(source, destination) {
  if (existingSources.has(source)) return false;
  v.redirects.push({ source, destination, permanent: true });
  existingSources.add(source);
  return true;
}
let added = 0;
// /drivers/printer -> /drivers/device
if (addRedirect('/drivers/printer', '/drivers/device')) added++;
if (addRedirect('/drivers/printer/:path*', '/drivers/device')) added++;

// Brand windows -> pc, scanner-setup -> brand index
for (const b of BRANDS) {
  if (addRedirect(`/brands/${b}/windows-11`, `/brands/${b}/pc-11`)) added++;
  if (addRedirect(`/brands/${b}/windows-10`, `/brands/${b}/pc-10`)) added++;
  if (addRedirect(`/brands/${b}/scanner-setup`, `/brands/${b}`)) added++;
}

// Repoint any existing destinations that used renamed/deleted paths
let repointed = 0;
for (const r of v.redirects) {
  if (r.destination === '/drivers/printer') { r.destination = '/drivers/device'; repointed++; }
  const m1 = r.destination.match(/^\/brands\/(brand-[a-j])\/windows-(10|11)$/);
  if (m1) { r.destination = `/brands/${m1[1]}/pc-${m1[2]}`; repointed++; }
  const m2 = r.destination.match(/^\/brands\/(brand-[a-j])\/scanner-setup$/);
  if (m2) { r.destination = `/brands/${m2[1]}`; repointed++; }
}
fs.writeFileSync(VERCEL, JSON.stringify(v, null, 2) + '\n');
log(`  redirects: ${before} -> ${v.redirects.length} (+${added}); repointed destinations: ${repointed}`);

log('\n=== Done. ===');
