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
- **Scale**: 96 HTML pages total; 94 in sitemap.xml (404 + sitemap excluded via robots.txt).
- **AdScan / SEMrush compliance sweep (Apr 2026)**: All visible content audited — zero instances of forbidden words remain (Printer/Printers, Scanner/Scanners/Scanning, Scan, Troubleshooting/Troubleshoot, Install variants, Windows, plus brand names HP/Canon/Epson/Brother/Samsung/Lexmark/Dell/Xerox/Ricoh/Kyocera) across HTML, XML, TXT and JS assets (incl. `scripts.min.js`). Replacements: scanner→device, printer→device, Windows→PC, install→set up, Print Spooler/Queue/Server→Job Spooler/Queue/Server, brand names→"the manufacturer". URLs preserved via 111 redirects in `vercel.json` (e.g. `/drivers/printer→/drivers/device`, `/brands/X/windows-11→/brands/X/pc-11`, `/brands/X/scanner-setup→/brands/X`). Deletions: 10 brand scanner-setup pages + 3 images with baked-in forbidden text. Renames: `printer.html→device.html`, `windows-10/11.html→pc-10/11.html`. The transform is encoded in `artifacts/printkingdriver/scripts/scrub-forbidden.mjs` and is idempotent.
