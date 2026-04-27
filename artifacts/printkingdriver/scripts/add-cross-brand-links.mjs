// DEPRECATED (Apr 2026) — DO NOT RUN.
// The 20 brand firmware-update + wireless-setup pages this script targets were
// removed from the site. Running this script will exit with ENOENT errors.
// Kept only for historical reference. See `remove-brand-setup-pages.mjs`.
//
// Original purpose: Add a "More setup guides" cross-link section to every brand
// sub-page so each page receives ~10 additional incoming internal links from
// peer pages.

console.error('add-cross-brand-links.mjs is deprecated — the brand firmware-update and wireless-setup pages have been removed. Aborting.');
process.exit(0);

// --- Original code preserved below for reference ---
//
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(__dirname, "..", "public");
const BRANDS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const TYPES = [
  { slug: "firmware-update", label: "Firmware Update", sibling: "wireless-setup", siblingLabel: "Wireless Setup" },
  { slug: "wireless-setup",  label: "Wireless Setup",  sibling: "firmware-update", siblingLabel: "Firmware Update" },
];

const MARKER = "<!-- cross-brand-links -->";

const arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-14 related-card__arrow" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const cardSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-18" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>';

function buildCard(href, name) {
  return `<a href="${href}" class="related-card"><div class="related-card__icon">${cardSvg}</div><div class="related-card__name">${name}</div>${arrowSvg}</a>`;
}

let touched = 0;
let already = 0;

for (const b of BRANDS) {
  for (const t of TYPES) {
    const file = path.join(PUB, "brands", `brand-${b}`, `${t.slug}.html`);
    let html = await fs.readFile(file, "utf8");
    if (html.includes(MARKER)) {
      already++;
      continue;
    }
    // Build the cross-link section
    const sibling = buildCard(
      `/brands/brand-${b}/${t.sibling}`,
      `Brand ${b.toUpperCase()} ${t.siblingLabel}`
    );
    const peers = BRANDS
      .filter((other) => other !== b)
      .map((other) =>
        buildCard(`/brands/brand-${other}/${t.slug}`, `Brand ${other.toUpperCase()} ${t.label}`)
      )
      .join("");
    const section =
      `${MARKER}<section class="detail-card"><h2>More Setup Guides</h2>` +
      `<p>Setup walkthroughs for the same task across other manufacturers, plus the related guide for this manufacturer.</p>` +
      `<div class="related-grid">${sibling}${peers}</div></section>`;
    // Insert immediately before the closing </div></div></main>
    const updated = html.replace(/(\s*<\/div>\s*<\/div>\s*<\/main>)/, `${section}$1`);
    if (updated === html) {
      console.warn(`Could not find insertion point in ${file}`);
      continue;
    }
    await fs.writeFile(file, updated, "utf8");
    touched++;
  }
}

console.log(`Cross-brand links: ${touched} pages updated, ${already} already had the section`);
