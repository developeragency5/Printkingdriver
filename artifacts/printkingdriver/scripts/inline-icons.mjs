import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "public");

const ICONS = [
  "alert-circle","arrow-down","arrow-left","arrow-right","bluetooth","check",
  "check-circle-2","check-square","chevron-down","chevron-left","chevron-right",
  "clock","cpu","file-code","file-question","globe","hard-drive","layers","mail",
  "menu","message-circle","microchip","monitor","monitor-speaker","mouse-pointer-2",
  "phone","printer","refresh-cw","scan","search","server","shield","shield-check",
  "usb","volume-2","volume-x","webcam","wifi","wifi-off","x","x-octagon","zap",
];

const VERSION = "0.350.0";
const ALIAS = { microchip: "cpu" }; // microchip not in this version, cpu is visually similar
const cache = {};
async function fetchIcon(name) {
  const real = ALIAS[name] || name;
  if (cache[name]) return cache[name];
  const url = `https://unpkg.com/lucide-static@${VERSION}/icons/${real}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${name}->${real}: ${res.status}`);
  const svg = (await res.text()).trim();
  cache[name] = svg;
  return svg;
}

console.log(`Fetching ${ICONS.length} icons…`);
await Promise.all(ICONS.map(fetchIcon));
console.log("All icons fetched.");

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name.endsWith(".html")) yield p;
  }
}

const ATTR_RE = /<i\b([^>]*?)data-lucide="([^"]+)"([^>]*)><\/i>/g;
const SCRIPT_RE = /\s*<script[^>]*lucide[^>]*><\/script>\s*/gi;

let changed = 0, replaced = 0;
for await (const file of walk(ROOT)) {
  let html = await fs.readFile(file, "utf8");
  const before = html;
  html = html.replace(ATTR_RE, (m, pre, name, post) => {
    const svg = cache[name];
    if (!svg) return m;
    const attrs = (pre + " " + post).trim();
    const classMatch = /class="([^"]+)"/.exec(attrs);
    const cls = classMatch ? classMatch[1] : "";
    const ariaMatch = /aria-[a-z-]+="[^"]*"/g.exec(attrs);
    const aria = ariaMatch ? ariaMatch[0] : 'aria-hidden="true"';
    const inner = svg
      .replace(/^<svg\b[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "");
    replaced++;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}" ${aria}>${inner}</svg>`;
  });
  html = html.replace(SCRIPT_RE, "\n");
  if (html !== before) {
    await fs.writeFile(file, html);
    changed++;
  }
}
console.log(`Inlined ${replaced} icons across ${changed} HTML files.`);
