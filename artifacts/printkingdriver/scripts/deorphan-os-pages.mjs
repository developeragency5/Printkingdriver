// Resolve SEMrush "orphaned page in sitemap.xml" warning for the 40 OS
// variant pages (brand-a..j × {macos, linux, pc-10, pc-11}). These pages
// are kept on disk for direct-URL access, but removed from the XML sitemap
// and marked noindex,nofollow so search engines stop tracking them.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(__dirname, "..", "public");
const BRANDS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const VARIANTS = ["macos", "linux", "pc-10", "pc-11"];

const ORPHAN_PATHS = BRANDS.flatMap((b) =>
  VARIANTS.map((v) => `/brands/brand-${b}/${v}`)
);

// --- 1. Strip orphan <url>...</url> entries from sitemap.xml -------------
const sitemapPath = path.join(PUB, "sitemap.xml");
let xml = await fs.readFile(sitemapPath, "utf8");
const beforeCount = (xml.match(/<url>/g) || []).length;
let removed = 0;
for (const p of ORPHAN_PATHS) {
  // Match a complete <url>...</url> block whose <loc> ends with this path
  const re = new RegExp(
    `\\s*<url>\\s*<loc>https://www\\.printkingdriver\\.com${p.replace(/\//g, "\\/")}</loc>[\\s\\S]*?</url>`,
    "g"
  );
  const next = xml.replace(re, () => {
    removed++;
    return "";
  });
  xml = next;
}
await fs.writeFile(sitemapPath, xml, "utf8");
const afterCount = (xml.match(/<url>/g) || []).length;
console.log(`sitemap.xml: ${beforeCount} → ${afterCount} URLs (removed ${removed})`);

// --- 2. Add noindex,nofollow meta to the 40 HTML files -------------------
const NOINDEX = '<meta name="robots" content="noindex,nofollow" />';
let touched = 0;
let already = 0;
let missing = 0;
for (const p of ORPHAN_PATHS) {
  const file = path.join(PUB, p + ".html");
  let html;
  try {
    html = await fs.readFile(file, "utf8");
  } catch {
    missing++;
    continue;
  }
  if (html.includes('name="robots" content="noindex')) {
    already++;
    continue;
  }
  // Insert before existing <meta name="robots"> if present, else before </head>
  if (/<meta\s+name="robots"[^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name="robots"[^>]*>/i, NOINDEX);
  } else {
    html = html.replace(/<\/head>/i, `  ${NOINDEX}\n  </head>`);
  }
  await fs.writeFile(file, html, "utf8");
  touched++;
}
console.log(`HTML files: ${touched} updated, ${already} already noindex, ${missing} missing`);
