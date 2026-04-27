#!/usr/bin/env node
/**
 * Rebuild artifacts/printkingdriver/public/drivers/bios.html using
 * drivers/audio.html as the structural template (which is intact:
 * navbar, drawer, mega menu, main, detail-bg with back button, detail-head,
 * detail-cards, footer). Replace the audio-specific bits with bios content.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');

const templatePath = path.join(PUBLIC, 'drivers/audio.html');
let html = fs.readFileSync(templatePath, 'utf8');

// ---------- 1. Head metadata replacements -------------------------------
html = html.replace(
  /<title>Audio Driver — Reference Guide \| PrintKingDriver<\/title>/,
  '<title>BIOS / UEFI Driver — Reference Guide | PrintKingDriver</title>'
);
html = html.replace(
  /<meta name="description" content="Audio drivers manage sound input and output between the operating system and your hardware\. Learn what they do, how they work, common faults and proven fixes\." \/>/,
  '<meta name="description" content="BIOS / UEFI firmware initialises hardware before the operating system loads. Learn what it does, how it works, common faults and proven fixes." />'
);
html = html.replace(
  /<meta property="og:title" content="Audio Driver — Reference Guide \| PrintKingDriver" \/>/,
  '<meta property="og:title" content="BIOS / UEFI Driver — Reference Guide | PrintKingDriver" />'
);
html = html.replace(
  /<meta property="og:description" content="Audio drivers manage sound input and output between the operating system and your hardware\. Learn what they do, how they work, common faults and proven fixes\." \/>/,
  '<meta property="og:description" content="BIOS / UEFI firmware initialises hardware before the operating system loads. Learn what it does, how it works, common faults and proven fixes." />'
);
html = html.replace(
  '<link rel="canonical" href="https://www.printkingdriver.com/drivers/audio" />',
  '<link rel="canonical" href="https://www.printkingdriver.com/drivers/bios" />'
);

// ---------- 2. JSON-LD WebPage block ------------------------------------
html = html.replace(
  /"WebPage","@id":"https:\/\/www\.printkingdriver\.com\/drivers\/audio#webpage","url":"https:\/\/www\.printkingdriver\.com\/drivers\/audio","name":"Audio Driver — Reference Guide \| PrintKingDriver","description":"Manages sound input and output processing\. Learn what a audio driver does, how it works, and why it matters\."/,
  '"WebPage","@id":"https://www.printkingdriver.com/drivers/bios#webpage","url":"https://www.printkingdriver.com/drivers/bios","name":"BIOS / UEFI Driver — Reference Guide | PrintKingDriver","description":"Initialises hardware before the operating system loads. Learn what a BIOS / UEFI driver does, how it works, and why it matters."'
);

// ---------- 3. Detail-bg category colour --------------------------------
html = html.replace(
  '<div class="detail-bg cat-essential">',
  '<div class="detail-bg cat-advanced">'
);

// ---------- 4. Detail-head: icon + eyebrow + title + subtitle -----------
// audio.html detail-head:
//   icon (speaker), "Essential Driver", "Audio Driver", "Manages sound input and output processing."
const oldDetailHead = ` <header class="detail-head">
 <div class="detail-head__icon cat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-32" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
 <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
 <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg></div>
 <div>
 <div class="eyebrow">Essential Driver</div>
 <h1>Audio Driver</h1>
 <p>Manages sound input and output processing.</p>
 </div>
 </header>`;

const newDetailHead = ` <header class="detail-head">
 <div class="detail-head__icon cat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-32" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" />
 <rect x="9" y="9" width="6" height="6" />
 <path d="M15 2v2" />
 <path d="M15 20v2" />
 <path d="M2 15h2" />
 <path d="M2 9h2" />
 <path d="M20 15h2" />
 <path d="M20 9h2" />
 <path d="M9 2v2" />
 <path d="M9 20v2" /></svg></div>
 <div>
 <div class="eyebrow">Advanced Driver</div>
 <h1>BIOS / UEFI Driver</h1>
 <p>Initialises hardware before the operating system loads.</p>
 </div>
 </header>`;

if (!html.includes(oldDetailHead)) {
  console.error('ERROR: could not find audio.html detail-head block — template may have changed.');
  process.exit(1);
}
html = html.replace(oldDetailHead, newDetailHead);

// ---------- 5. Replace ALL detail-card sections with bios content -------
// Bios cards as a single block. We replace from the first <section class="detail-card">
// through the closing </main> tag.
const newCardsBlock = ` <section class="detail-card">
 <h2>What Is It?</h2>
 <p>BIOS / UEFI firmware is the low-level software that initialises hardware before the operating system loads. It runs the moment the system is powered on, checking memory, processor, storage and graphics components, and preparing them for use. Without it, no operating system could ever start.</p>
 <p>Modern systems use UEFI — the successor to the legacy 16-bit BIOS standard. UEFI offers a richer interface, faster boot, secure-boot verification, support for partitions over 2 TB, and a network stack that can fetch firmware updates directly from the manufacturer.</p>
 <p>It also exposes user-configurable settings such as boot order, power profiles, virtualisation toggles, fan curves, memory timing profiles and the platform trust module. Adjusting these is normally done via a setup screen reached by pressing a key — usually <strong>Delete</strong>, <strong>F2</strong> or <strong>F12</strong> — during the first seconds after power-on.</p>
 <p>Although users rarely interact with it directly, BIOS / UEFI quality affects boot speed, hardware compatibility and platform security. Manufacturers publish updates to support new processors, fix stability issues and patch security advisories.</p>
 </section>

 <section class="detail-card">
 <h2>How It Works</h2>
 <p>When power is applied, the firmware checks each major component, configures memory and CPU features, and selects a boot device. It then loads the bootloader and provides a minimal interface used until the system's own drivers are ready.</p>
 <div class="detail-flow">
 <div class="detail-flow__step"><div class="detail-flow__icon c-purple"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-18" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></div><div class="detail-flow__label">Power On</div></div>
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-16 detail-flow__arrow" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
 <div class="detail-flow__step is-highlight"><div class="detail-flow__icon c-blue"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-18" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" />
 <rect x="9" y="9" width="6" height="6" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg></div><div class="detail-flow__label">Firmware (BIOS / UEFI)</div></div>
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-16 detail-flow__arrow" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
 <div class="detail-flow__step"><div class="detail-flow__icon c-teal"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-18" aria-hidden="true"><polyline points="3 12 9 12 11 9 13 15 15 12 21 12" /></svg></div><div class="detail-flow__label">Hardware Check</div></div>
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-16 detail-flow__arrow" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
 <div class="detail-flow__step"><div class="detail-flow__icon c-green"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-18" aria-hidden="true"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg></div><div class="detail-flow__label">Bootloader</div></div>
 </div>
 </section>

 <section class="detail-card">
 <h2>Key Functions</h2>
 <ul class="detail-list">
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>Runs power-on self-test (POST) to verify each major component before boot.</span></li>
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>Selects the boot device and hands control to the bootloader.</span></li>
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>Verifies signed bootloaders via Secure Boot to block unauthorised code.</span></li>
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>Exposes user-configurable hardware settings — boot order, fan curves, memory profiles.</span></li>
 </ul>
 </section>

 <section class="detail-card">
 <h2>Components &amp; Examples</h2>
 <div class="tbl-wrap"><div class="tbl-scroll"><table class="tbl">
 <thead><tr><th>Component</th><th>Role</th><th class="hide-md">Example</th></tr></thead>
 <tbody><tr><td class="strong">POST</td><td>Hardware self-checks</td><td class="hide-md mono small">Memory test, CPU init</td></tr><tr><td class="strong">Boot manager</td><td>Selects bootloader</td><td class="hide-md mono small">Boot order menu</td></tr><tr><td class="strong">Secure Boot</td><td>Trust verification</td><td class="hide-md mono small">Signed bootloader check</td></tr></tbody>
 </table></div></div>
 </section>

 <section class="detail-card detail-card--accent">
 <h2>Why It Matters</h2>
 <p>Firmware quality affects boot speed, hardware compatibility and platform security. A reliable, up-to-date BIOS / UEFI ensures new processors are recognised, peripherals enumerate cleanly and modern security features such as Secure Boot are available.</p>
 </section>

 <section class="detail-card">
 <h2>Common Issues &amp; Symptoms</h2>
 <p class="u-mb-16">Recognising the symptom is the first step in narrowing down whether the problem really is the firmware, the hardware or another part of the system.</p>
 <div class="tbl-wrap"><div class="tbl-scroll"><table class="tbl">
 <thead><tr><th>Symptom</th><th>Likely Cause</th><th class="hide-md">What It Affects</th></tr></thead>
 <tbody><tr><td class="strong">New CPU not recognised after fitting</td><td>Firmware microcode predates the chip.</td><td class="hide-md small">Compatibility</td></tr><tr><td class="strong">System won’t boot after firmware change</td><td>Settings reset; boot order or secure boot incorrect.</td><td class="hide-md small">Boot reliability</td></tr><tr><td class="strong">Fans run at full speed</td><td>Fan curve table missing in current firmware.</td><td class="hide-md small">Thermals &amp; noise</td></tr><tr><td class="strong">Slow boot after firmware update</td><td>Fast Boot or legacy-compatibility settings reset to defaults.</td><td class="hide-md small">Performance</td></tr></tbody>
 </table></div></div>
 </section>

 <section class="detail-card">
 <h2>Best Practices</h2>
 <p class="u-mb-16">A short checklist to keep firmware healthy and reduce the chance of running into the issues above.</p>
 <ul class="detail-list">
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>Plug the system into mains power before flashing — power loss mid-update can brick the board.</span></li>
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>Read the change-log; flash only when a fix or feature is genuinely needed.</span></li>
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>Note your current firmware settings (memory profile, fan curves, boot order) before updating.</span></li>
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>Use the manufacturer’s official tool, not third-party flashers.</span></li>
 <li><span class="detail-list__bullet"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span><span>After flashing, re-enable virtualisation, the platform trust module and secure boot if you rely on them.</span></li>
 </ul>
 </section>

 <section class="detail-card">
 <h2>Frequently Asked Questions</h2>
 <div class="faq__inner u-mt-8-0-0">
 <div class="faq__item">
 <button type="button" class="faq__q">What is the difference between BIOS and UEFI?<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-16" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
 <div class="faq__a"><p class="u-pt-0">The older option is a legacy 16-bit firmware standard, while the modern replacement offers a richer interface, faster boot, secure boot, modern partition support and drive sizes beyond 2 TB. Most systems since 2012 use the newer standard.</p></div>
 </div>
 <div class="faq__item">
 <button type="button" class="faq__q">Is updating firmware risky?<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-16" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
 <div class="faq__a"><p class="u-pt-0">Modern flashing tools are robust, but there is always a small risk if power is lost mid-update. Only flash when you have a clear reason — a fix, new CPU support, or a security advisory.</p></div>
 </div>
 <div class="faq__item">
 <button type="button" class="faq__q">Can I downgrade firmware?<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-16" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
 <div class="faq__a"><p class="u-pt-0">Sometimes — many vendors lock newer microcode releases. Check the manufacturer page; if downgrade is supported, the change-log will mention it explicitly.</p></div>
 </div>
 </div>
 </section>
 </main>`;

// Match from the first detail-card after detail-head down to </main>
const cardsRegex = /<section class="detail-card">\s*<h2>What Is It\?<\/h2>[\s\S]*?<\/main>/;
if (!cardsRegex.test(html)) {
  console.error('ERROR: could not match detail-cards block in template.');
  process.exit(1);
}
html = html.replace(cardsRegex, newCardsBlock);

// ---------- 6. Write the file -------------------------------------------
const outPath = path.join(PUBLIC, 'drivers/bios.html');
fs.writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${html.length} bytes, ${html.split('\n').length} lines)`);

// ---------- 7. Sanity checks --------------------------------------------
const checks = {
  hasBackButton: /legal__back/.test(html),
  backButtonHref: /href="\/drivers"\s+class="legal__back"/.test(html),
  hasMain: /<main>/.test(html) && /<\/main>/.test(html),
  hasDetailHead: /<header class="detail-head">/.test(html),
  hasMegaMenu: /class="mega"/.test(html),
  hasDrawer: /class="drawer"/.test(html),
  hasFooter: /<footer class="footer">/.test(html),
  hasBiosTitle: /<h1>BIOS \/ UEFI Driver<\/h1>/.test(html),
  noForbidden: !/\b(PC|Mac|Macs|macOS|Linux|OS)\b/.test(
    html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')
  ),
};
console.log('Checks:', checks);
const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
if (failed.length) {
  console.error('FAILED checks:', failed);
  process.exit(1);
}
console.log('All checks passed.');
