# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- Always run `nvm use` before any npm/node commands
- Always allowed to use the Chrome MCP tools (`mcp__claude-in-chrome__*`) to test and verify UI changes in the browser

## Commands

```bash
nvm use                    # Use correct Node version (24.15.0) — always run first
npm install                # Install dependencies
npm run dev                # Start dev server at http://localhost:3000
npm run build              # Build for production
npm run generate           # Generate static output
npm run preview            # Preview production build
npx tsc --noEmit           # Type check
npx eslint --fix [files]   # Lint and auto-fix
```

## Stack

- **Nuxt 4** with Vue 3.5+ (Composition API, `<script setup>`)
- **@nuxt/ui** v4 — component library (auto-imported components like `UButton`, `UInput`, etc.)
- **@nuxt/eslint** — ESLint integration with Nuxt-aware rules
- TypeScript strict mode with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`

## Project Layout

Source lives in `app/` (Nuxt 4 convention). Auto-imports are enabled for composables, utils, and components — no explicit imports needed within the `app/` directory.

Path aliases `~` and `@` both resolve to `app/`.
