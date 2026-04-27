/**
 * Trim 40 newly generated fix-pages so each lands within 600–700 words
 * inside <main>. Removes redundant filler phrases that appear naturally and
 * can be dropped without damaging meaning. Idempotent and bounded — refuses
 * to drop a page below 600.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');

const SLUGS = [
  'fix-driver-device-abnormal-power-drain',
  'fix-driver-device-input-ignored',
  'fix-driver-system-running-multiple-errors',
  'fix-driver-device-losing-saved-data',
  'fix-driver-device-running-on-minimum-settings',
  'fix-driver-device-wrong-output',
  'fix-driver-system-alert-keeps-repeating',
  'fix-driver-device-not-holding-state',
  'fix-driver-device-sending-wrong-signals',
  'fix-driver-device-underperforming',
  'fix-driver-device-failing-under-normal-use',
  'fix-driver-device-losing-configuration',
  'fix-driver-system-generating-constant-errors',
  'fix-driver-device-rejecting-valid-commands',
  'fix-driver-device-running-inconsistently',
  'fix-driver-device-dropping-current-task',
  'fix-driver-system-producing-false-errors',
  'fix-driver-device-responding-incorrectly',
  'fix-driver-device-below-expected-speed',
  'fix-driver-device-failing-at-random-times',
  'fix-driver-device-output-inconsistent',
  'fix-driver-device-not-completing-tasks',
  'fix-driver-device-ignoring-system-commands',
  'fix-driver-device-abnormal-heat-generation',
  'fix-driver-device-losing-sync-with-system',
  'fix-driver-device-not-saving-state',
  'fix-driver-device-wrong-settings',
  'fix-driver-device-conflict-with-system',
  'fix-driver-device-error-on-command',
  'fix-driver-device-failing-after-light-use',
  'fix-driver-device-not-accepting-new-commands',
  'fix-driver-device-repeated-faults',
  'fix-driver-device-running-at-wrong-speed',
  'fix-driver-device-not-completing-cycle',
  'fix-driver-device-abnormal-output',
  'fix-driver-device-failing-on-first-use',
  'fix-driver-device-not-responding-to-input',
  'fix-driver-device-running-without-proper-control',
  'fix-driver-device-losing-power-unexpectedly',
  'fix-driver-device-not-at-full-ability',
];

// Ordered list of redundant phrases to trim — applied one at a time until
// the page lands under 700. Each replacement is a [literal, replacement] pair.
// Phrases are chosen so removing them does not damage the sentence meaning.
const TRIMS = [
  [' without any further intervention on the system', ''],
  [' without any further intervention', ''],
  [' without any further action on the system', ''],
  [' without any further action', ''],
  [' before any deeper change is tried', ''],
  [' before any other change is made', ''],
  [' before any other change is tried', ''],
  [' before any deeper change is made', ''],
  [' before any deeper change.', '.'],
  [' before any deeper investigation', ''],
  [' before any deeper change is tried.', '.'],
  [' rather than any sweeping change to the system', ''],
  [' rather than any sweeping change', ''],
  [', however brief', ''],
  [' even though every component appears healthy', ''],
  [' even though every other component appears healthy', ''],
  [' even though the workload is well within range', ''],
  [' even though the workload would not explain it', ''],
  [' even though the chosen settings remain unchanged', ''],
  [' even though no further change has been made', ''],
  [' even though the supply is healthy and the workload is well within range', ''],
  [' even though the supply is healthy', ''],
  [' even though the previous command finished cleanly', ''],
  [' even though the device appears healthy', ''],
  [' even though every component appears healthy.', '.'],
  [' without any issue at all', ''],
  [' without any issue', ''],
  [' for the same workload', ''],
  [' for the same action', ''],
  [' for the same request', ''],
  [' for the same task', ''],
  [' for the same command', ''],
  [' across the system', ''],
  [' on the system', ''],
  [' on the device', ''],
  [' to the system', ''],
  [' in good time', ''],
  [' from scratch', ''],
  [' at all', ''],
  [' on its own', ''],
  [' in isolation', ''],
  // Targeted trims for the small group of remaining oversize pages.
  // These shorten common em-dashed boilerplate without changing meaning.
  [' or an interrupted session', ''],
  [' or an interrupted shutdown', ''],
  [' or a brief fault', ''],
  [' or a slow service', ''],
  [' or a brief storage hiccup', ''],
  [' or a brief service pause', ''],
  [' or a brief queue stall', ''],
  [' or a power-state mismatch', ''],
  [' or a power-profile change', ''],
  [' or a profile mismatch', ''],
  [' or a service hiccup', ''],
  [' or a changed default', ''],
  [' or a partial session', ''],
  [' is genuinely ready and is met with an error rather than a result', ' meets an error rather than a result'],
  [' before any request can be handled', ' before requests can be handled'],
  [' the status fields the operating system reads on a regular interval', ' status fields on a regular interval'],
];

function wordCountInMain(html) {
  const m = html.match(/<main>([\s\S]*?)<\/main>/);
  if (!m) return 0;
  const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

let trimmed = 0;
let alreadyOk = 0;
const finalCounts = [];
const tooShort = [];
const stillTooLong = [];

for (const slug of SLUGS) {
  const file = path.join(PUBLIC, `${slug}.html`);
  if (!fs.existsSync(file)) {
    console.error(`ERROR: missing ${slug}.html`);
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  let wc = wordCountInMain(html);

  if (wc <= 700 && wc >= 600) {
    alreadyOk++;
    finalCounts.push({ slug, words: wc });
    continue;
  }

  // Apply trims one at a time, only until under 700, never below 600.
  for (const [literal, replacement] of TRIMS) {
    if (wc <= 700) break;
    if (!html.includes(literal)) continue;
    // Try removing one occurrence at a time
    while (wc > 700 && html.includes(literal)) {
      const next = html.replace(literal, replacement);
      const nextWc = wordCountInMain(next);
      if (nextWc < 600) break; // never let a page fall below 600
      html = next;
      wc = nextWc;
    }
  }

  fs.writeFileSync(file, html);
  trimmed++;
  finalCounts.push({ slug, words: wc });
  if (wc < 600) tooShort.push({ slug, words: wc });
  if (wc > 700) stillTooLong.push({ slug, words: wc });
}

const min = Math.min(...finalCounts.map(c => c.words));
const max = Math.max(...finalCounts.map(c => c.words));

console.log(`\nFinal counts: min=${min}, max=${max}.`);
console.log(`Already in range (no trim needed): ${alreadyOk}`);
console.log(`Trimmed: ${trimmed}`);

if (stillTooLong.length) {
  console.log(`\nWARN: ${stillTooLong.length} still above 700:`);
  for (const c of stillTooLong) console.log(`  ${c.slug}: ${c.words}`);
}
if (tooShort.length) {
  console.log(`\nWARN: ${tooShort.length} below 600:`);
  for (const c of tooShort) console.log(`  ${c.slug}: ${c.words}`);
}
if (!stillTooLong.length && !tooShort.length) {
  console.log('\nAll 40 pages within 600–700 word range. ✓');
}
