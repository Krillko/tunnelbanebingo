# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- Always run `nvm use` before any npm/node commands
- Always run `npx eslint --fix` on changed files after editing code
- Always allowed to use the Chrome MCP tools (`mcp__claude-in-chrome__*`) to test and verify UI changes in the browser
- Never run `git commit` — the user always commits themselves

## Commands

```bash
nvm use                    # Use correct Node version (24.15.0) — always run first
npm install                # Install dependencies
npm run dev                # Start dev server at https://localhost:3011
npm run build              # Build for production
npm run generate           # Generate static output
npm run preview            # Preview production build
npx tsc --noEmit           # Type check
npx eslint --fix [files]   # Lint and auto-fix
```

## Stack

- **Nuxt 4** with Vue 3.5+ (Composition API, `<script setup>`), `ssr: false` (SPA)
- **@nuxt/ui** v4 — component library (auto-imported components like `UButton`, `UInput`, etc.)
- **Tailwind CSS v4** — configured via `app/assets/css/main.css` (not a JS config file)
- **Leaflet** — map rendering with CartoDB Positron tiles (free, no API key)
- **@nuxt/eslint** — ESLint integration with Nuxt-aware rules
- TypeScript strict mode with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`

## Project Layout

Source lives in `app/` (Nuxt 4 convention). Auto-imports are enabled for composables, utils, and components — no explicit imports needed within the `app/` directory.

Path aliases `~` and `@` both resolve to `app/`.

Key files:
- `app/assets/css/main.css` — Tailwind v4 + Nuxt UI CSS entry point (required for styles to load)
- `app/data/stations.ts` — all ~100 Stockholm T-bana stations with OSM-accurate lat/lng, grouped by line
- `app/data/routes.ts` — ordered station ID arrays per branch, used to draw polylines on the map
- `app/components/BingoMap.client.vue` — Leaflet map, `.client.vue` suffix prevents SSR
- `app/composables/useBingoAnimation.ts` — slot-machine animation state machine (pre-picks winner, quadratic ease-out over 4s)
- `app/composables/useTickSound.ts` — Web Audio API casino tick sounds (no audio files, oscillator-based)
- `app/pages/index.vue` — main page: flex layout with map + sidebar, three states (idle/spinning/winner)

## HTTPS / Dev Server

HTTPS is enabled via mkcert certificates (`localhost.pem` / `localhost-key.pem`, gitignored). To regenerate if missing:
```bash
mkcert localhost 127.0.0.1
```
The `.pem` files must be in the project root — `nuxt.config.ts` references them directly.

## Tailwind v4 Note

`@nuxt/ui` v4 uses Tailwind CSS v4 which requires a CSS entry point. Without `app/assets/css/main.css` importing `tailwindcss` and `@nuxt/ui`, no styles will be applied. Do not use a `tailwind.config.js` — configuration is CSS-based.

## Future: Live Vehicle Positions

The scaffolding for real-time train/tram dots on the map is **already built but inactive**:

- `server/api/vehicles.get.ts` — Nuxt server route that fetches and decodes the GTFS-RT protobuf feed from Trafiklab, returns JSON array of `{ id, lat, lng, routeId }`
- `app/composables/useVehiclePositions.ts` — polls `/api/vehicles` every 15 s, exposes `vehicles` ref
- `BingoMap.client.vue` — already accepts a `vehicles` prop and renders small dark dots (radius 4)
- `app/pages/index.vue` — already calls `useVehiclePositions()` and passes `vehicles` to the map

**To activate:**
1. Go to [app.trafiklab.se](https://app.trafiklab.se), project 52268
2. Add the **"GTFS Regional Realtime"** API and generate a key
3. Add `TRAFIKLAB_API_KEY=your_key` to `.env`

**Blocker:** GitHub Pages is static — it can't run the Nuxt server route. The feature works in local dev (`npm run dev`) but needs real server hosting in production (Vercel, Railway, Render, etc.) where `TRAFIKLAB_API_KEY` is set as an environment variable. Consider migrating from GitHub Pages to Vercel when ready.
