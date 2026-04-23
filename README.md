# TunnelbaneBingo

A Stockholm subway bingo game. Hit the button, watch a casino-style animation randomly pick a T-bana station, then go visit it.

## What it does

- Shows a Leaflet map of Stockholm with all ~100 T-bana stations as colored dots (red/green/blue by line) and polylines for the routes
- Click **Bingo!** to trigger a slot-machine animation: stations flash rapidly then slow down over ~4 seconds
- Web Audio API tick sounds play during the animation (pitch descends as it slows)
- The winning station zooms in on the map with a gold marker, confetti fires, and the station name appears in the sidebar
- Click **Spela igen** to reset and go again

## Home station weighting

You can set a home station in Settings. When set, the randomizer draws from a weighted distribution over all eligible stations rather than a uniform one.

### How it works

**Travel time estimation.** The network graph is built from the route topology in `routes.ts`: stations adjacent in a route segment get a directed edge whose weight is estimated travel time in minutes, computed as haversine distance divided by an assumed average speed of 30 km/h. Stations served by multiple lines get transfer edges between their per-line nodes — 5 minutes within the T-bana (blue↔red↔green) and 7 minutes to/from Tvärbanan or Spårväg City, reflecting the extra walking involved. Shortest-path travel time from the home station to every other station is then computed with Dijkstra.

**Weighted sampling.** Each eligible station $i$ is assigned weight

$$w_i = e^{-t_i / \tau}$$

where $t_i$ is the estimated travel time in minutes and $\tau = 20$ is a scale parameter. The winner is sampled from the categorical distribution $P(i) = w_i / \sum_j w_j$.

The exponential form means the distribution decays monotonically with travel time and has a single tuning knob ($\tau$) with a direct interpretation: a station $\tau$ minutes away has weight $e^{-1} \approx 0.37$ relative to the home station itself. At $\tau = 20$ the weight at 40 minutes is $\approx 0.14$ and at 60 minutes $\approx 0.05$ — distant stations remain possible but are drawn infrequently.

The home station itself is excluded from the draw entirely.

> **ELI5.** Imagine cutting a piece of string for every station. The string for a station that's 5 minutes away is long; the one for a station that's an hour away is very short. You throw all the strings in a hat and pull one out — you'll almost always grab a long one, but you might get lucky and grab a short one. Setting a home station just determines how the strings are cut.

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
