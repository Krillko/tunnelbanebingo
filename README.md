# Tunnelbana Bingo

A Stockholm subway bingo game. Hit the button, watch a casino-style animation randomly pick a T-bana station, then go visit it.

## What it does

- Shows a Leaflet map of Stockholm with all ~100 T-bana stations as colored dots (red/green/blue by line) and polylines for the routes
- Click **Bingo!** to trigger a slot-machine animation: stations flash rapidly then slow down over ~4 seconds
- Web Audio API tick sounds play during the animation (pitch descends as it slows)
- The winning station zooms in on the map with a gold marker, confetti fires, and the station name appears in the sidebar
- Click **Spela igen** to reset and go again

## Setup

Requires [mkcert](https://github.com/FiloSottile/mkcert) for locally-trusted HTTPS (Leaflet map tiles require it in some browsers).

```bash
# First time only — generate local HTTPS certs
mkcert localhost 127.0.0.1

# Install dependencies
nvm use
npm install

# Start dev server at https://localhost:3011
npm run dev
```

## Stack

- **Nuxt 4** SPA (`ssr: false`) + Vue 3.5
- **Leaflet** — map with CartoDB Positron tiles (free, no API key)
- **@nuxt/ui** v4 + Tailwind CSS v4
- **canvas-confetti** — winner celebration
- **Web Audio API** — tick sounds via oscillator (no audio files)
