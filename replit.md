# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## PrintKingDriver Artifact

`artifacts/printkingdriver` is a static multi-page informational site about printer & system drivers. It has **no framework dependencies** — pure HTML/CSS/JS served by a small Node http server.

- **Stack**: zero-dep Node `http` server (`serve.mjs`) for dev, static-file deployment in production.
- **Build**: `build.mjs` copies `public/` to `dist/public/`.
- **Pages**: each page is a standalone `.html` file under `public/` (home, drivers, how-it-works, about, contact, privacy, terms, 404, plus 14 driver detail pages under `public/drivers/`). Navbar and footer are inlined per page for SEO.
- **Routing**: pretty URLs (`/about` → `/about.html`, `/drivers/printer` → `/drivers/printer.html`); unknown paths serve `404.html`. Production uses `serve = "static"` with `notFoundPage = "/404.html"` (no SPA rewrite).
- **Design system**: Inter + Plus Jakarta Sans (Google Fonts), Lucide icons via CDN. Cream/sand/teal palette defined in `public/assets/styles.css`.
- **Interactive JS** (`public/assets/scripts.js`, vanilla, no deps): mobile drawer, mega-menu hover/click, in-nav search with arrow-key nav, horizontal slider with dots, FAQ accordion, contact-form validation with success state.
- **SEO / Schema**: All 124 content pages (guides, how-to, tech, brands) have FAQPage + BreadcrumbList JSON-LD injected into the existing `@graph` array. All 20 how-to pages also have HowTo + HowToStep schema. Section index pages have short FAQ sections added to support the schema. `/llms.txt` lists all 167 pages/paths with descriptions for AI crawlers.
- **Asset pipeline**: edit `styles.css` → `node minify.mjs` → `styles.min.css` (referenced by all pages). Same for `scripts.js`.
- **External links**: All brand/vendor support links have `rel="nofollow noopener noreferrer" target="_blank"`.
- **Scale**: 96 HTML pages total; 54 in sitemap.xml (404, sitemap, all-pages-listed-but-not-indexed and the 40 OS variant pages excluded — see "OS-page deorphan sweep" below).
- **AdScan / SEMrush compliance sweep (Apr 2026)**: All visible content audited — zero instances of forbidden words remain (Printer/Printers, Scanner/Scanners/Scanning, Scan, Troubleshooting/Troubleshoot, Install variants, Windows, plus brand names HP/Canon/Epson/Brother/Samsung/Lexmark/Dell/Xerox/Ricoh/Kyocera) across HTML, XML, TXT and JS assets (incl. `scripts.min.js`). Replacements: scanner→device, printer→device, Windows→PC, install→set up, Print Spooler/Queue/Server→Job Spooler/Queue/Server, brand names→"the manufacturer". URLs preserved via 111 redirects in `vercel.json` (e.g. `/drivers/printer→/drivers/device`, `/brands/X/windows-11→/brands/X/pc-11`, `/brands/X/scanner-setup→/brands/X`). Deletions: 10 brand scanner-setup pages + 3 images with baked-in forbidden text. Renames: `printer.html→device.html`, `windows-10/11.html→pc-10/11.html`. The transform is encoded in `artifacts/printkingdriver/scripts/scrub-forbidden.mjs` and is idempotent.
- **Homepage "Explore Drivers" section redesign (Apr 2026)**: Reduced from 4 cards (after removing the Peripheral Drivers card) to a clean 3-card grid (Essential / Hardware-Specific / Advanced Systems) with elevated styling: large light-weight numerals (01/02/03), descriptive layer labels ("Foundation Layer / Hardware Layer / System Layer"), unified teal-family icon palette (replacing prior blue/orange/purple), paper-cream card surface with subtle top accent stripe, refined "Includes — N drivers" gradient divider, and softer hover lift. Desktop grid is `repeat(3, minmax(0,1fr))` with matching 3 pagination dots. Section anchored at `#explore`. CSS in `public/assets/styles.css` (`.explore-section`, `.slide-card*`); rebuild via `node minify.mjs`.
- **OS-term removal sweep (Apr 2026, Option B)**: Stripped PC, Mac, macOS, Linux and standalone "OS" from body content site-wide while leaving the dedicated brand-X/{macos,linux,pc-10,pc-11}.html pages untouched. Removals (not substitutions) — entire FAQ items, list bullets, table rows, related-card links, JSON-LD `Question` entries, and individual sentences inside `<p>` were dropped when they contained those words. "MAC layer"/"MAC address" preserved. Scripts: `scripts/strip-os-terms.mjs` (initial pass), `scripts/fix-faq-breakage.mjs` (FAQ structural repair on 5 driver pages + how-it-works + 10 brand JSON-LD entries), `scripts/fix-monitor.mjs` (full Best-Practices+FAQ region restore on monitor.html). Final scrubbed counts: 0 forbidden words in body text, 96 valid JSON-LD scripts, all FAQ pair counts balanced, no orphan `<li>/<p>/<td>/<tr>`. The "94 pages total" header and 124-page schema scope still hold because the dedicated OS pages remain.
- **OS-page deorphan sweep (Apr 2026)**: SEMrush flagged the 40 brand-X/{macos,linux,pc-10,pc-11} pages as "orphaned in sitemap.xml" — they exist on disk for direct-URL access but the AdScan sweep removed every internal link to them. Fix in `scripts/deorphan-os-pages.mjs`: (a) removed all 40 corresponding `<url>` blocks from `public/sitemap.xml` (94 → 54 URLs, all paired tags balanced), and (b) injected `<meta name="robots" content="noindex,nofollow" />` into each of the 40 HTML files so search engines stop tracking them. The pages themselves still resolve at their direct URLs (no 404s, no link-rot). Updated `all-pages.html` "94 pages total" → "54 pages total" to match the new sitemap scope. Re-running the script is idempotent (skips already-noindex files, regex-matches only OS-variant URL blocks).
- **Back-button repair (Apr 2026)**: Three follow-up fixes after `strip-os-terms.mjs` damage. (1) `drivers/bios.html` had been truncated from 363→154 lines (lost the entire `<main>`, `<aside drawer>`, hero/back-button block, mega menu list items). Rebuilt it from `drivers/audio.html` as a structural template via `scripts/rebuild-bios-from-template.mjs`, swapping in bios-specific head meta, JSON-LD WebPage entry, hero (icon/eyebrow/title/subtitle), and 8 detail-card sections (What Is It, How It Works flow, Key Functions, Components, Why It Matters, Common Issues, Best Practices, FAQ). (2) Added a small consistent "Back to home" link block (matching the existing `brands/index.html` pattern, inserted after `<main>`) to `drivers.html`, `about.html`, `contact.html`, `how-it-works.html` and `404.html` via `scripts/add-back-to-home.mjs`. (3) Added back-to-home links to the two sitemap pages: `all-pages.html` (cream `legal__back` pill at top of `<div class="container u-max-980">`) and `sitemap.html` (white-tinted glass pill placed inside the dark teal `.sm-hero__inner` above the eyebrow, with inline `onmouseover`/`onmouseout` for hover background). Homepage is the only page without a back link by design. All open/close tag counts balance and match sibling driver pages.
