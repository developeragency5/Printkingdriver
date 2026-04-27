# Overview

This project is a pnpm workspace monorepo using TypeScript, designed to build and manage a static multi-page informational site called PrintKingDriver. The site focuses on printer and system drivers, providing extensive information without framework dependencies. The primary goal is to deliver a highly optimized, SEO-friendly resource for users seeking driver information, while adhering to strict content guidelines and accessibility standards.

The PrintKingDriver artifact aims to be a comprehensive, high-quality information hub for driver-related queries, leveraging a robust backend and a pure HTML/CSS/JS frontend for maximum performance and compatibility.

# User Preferences

- I want iterative development.
- Ask before making major changes.
- I prefer detailed explanations.
- Do not make changes to the folder `Z`.
- Do not make changes to the file `Y`.
- I like functional programming.
- I prefer simple language.

# System Architecture

The project is structured as a pnpm workspace monorepo.

**Monorepo Structure:**
- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9

**Backend (API Server):**
- **API framework**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (generates from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

**Frontend (PrintKingDriver Artifact):**
- **Architecture**: Static multi-page site, pure HTML/CSS/JS (zero framework dependencies). Served by a minimal Node.js `http` server for development; static-file deployment in production.
- **Build Process**: `build.mjs` copies `public/` assets to `dist/public/`.
- **Page Structure**: Each page is a standalone `.html` file. Common elements like navbar and footer are inlined per page for SEO benefits.
- **Routing**: Employs pretty URLs (e.g., `/about` maps to `/about.html`). Unknown paths are handled by `404.html`. Production serving uses `serve = "static"` with `notFoundPage = "/404.html"`.
- **UI/UX Design:**
    - **Typography**: Inter and Plus Jakarta Sans (Google Fonts).
    - **Icons**: Lucide icons via CDN.
    - **Color Palette**: Cream, sand, and teal, defined in `public/assets/styles.css`.
- **Interactive Elements (Vanilla JS in `public/assets/scripts.js`):** Mobile drawer navigation, mega-menu functionality (hover/click), in-navigation search with keyboard navigation, horizontal sliders, FAQ accordions, and contact form validation.
- **SEO Features:**
    - **Schema Markup**: FAQPage and BreadcrumbList JSON-LD are injected into existing `@graph` arrays on all content pages. HowTo and HowToStep schema are added to relevant pages.
    - **AI Crawling**: `/llms.txt` lists all pages and their descriptions for AI crawlers.
    - **Robots Management**: Specific OS-variant pages are `noindex,nofollow` via meta tags and removed from `sitemap.xml`.
- **Asset Pipeline**: `styles.css` and `scripts.js` are minified using `minify.mjs` to `styles.min.css` and `scripts.min.js`.
- **Content Strategy**: Strict adherence to content guidelines, including removal of specific forbidden words and brand names, handled by `scrub-forbidden.mjs`. Extensive internal linking for SEO.
- **Homepage Design**: Features redesigned "Explore Drivers," "Error Fix Guides," and "Performance Fix Guides" sections with specific layouts, styling, and navigation elements.
- **Back Button Navigation**: Consistent "Back to home" links are implemented across various informational pages.
- **AI-Search Optimization**: "Key Takeaways" / "At a Glance" summary blocks with `data-speakable` attributes and Speakable schema are integrated for AI assistants and voice search. Enhanced meta descriptions and JSON-LD entities for improved search result richness.

# External Dependencies

- **Google Fonts**: Inter, Plus Jakarta Sans
- **Lucide Icons**: via CDN