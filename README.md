# TunnelbaneBingo

A Stockholm subway bingo game. Hit the button, watch a casino-style animation randomly pick a T-bana station, then go visit it.  
Now also with Gothenburg. So I guess I need a better name.

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

## Map and place data

Both of the external services this app depended on turned out to be unreliable, in different ways. Neither is called at runtime any more in the form it originally was.

### Basemap: CARTO → OpenFreeMap

The map was built on CartoDB Positron raster tiles, which were free and keyless until CARTO started demanding an API key. It now renders [OpenFreeMap](https://openfreemap.org/) vector tiles through `@maplibre/maplibre-gl-leaflet`, which keeps Leaflet as the map framework and swaps only the tile layer. There are two styles, `positron` and `dark`, picked from the app's dark-mode state.

> **Keep `maplibre-gl` pinned to v5.** v6 stops shipping its worker chunk in a way this setup depends on, and the map goes blank with no console error — which is a miserable thing to debug.

### Nearby places: live Overpass → pre-baked data

The "near the station" list used to query the Overpass API from the browser on every draw. This broke repeatedly, and the reason was worse than plain downtime: the public mirrors fail constantly *and inconsistently*. Over one round of testing, `overpass-api.de` hung or returned 406, `kumi.systems` and `private.coffee` returned 500, and `overpass.osm.ch` returned **200 OK with an empty result set** and a nonsense `timestamp_osm_base`. That last one is the killer — a browser has no honest way to tell "the mirror is serving an empty database" apart from "there really are no bars here", so the app would cache the empty result and show nothing.

Venue data changes on the order of months, so it's now fetched once at build time and committed as static data:

```bash
npm run venues     # regenerates app/data/venues.ts
```

`scripts/fetch-venues.mjs` queries one bounding box per city (2 requests, not one per station), retries across all four mirrors, rejects any mirror whose reported OSM timestamp isn't a real date, and refuses to write the file if fewer than half the stations come back populated. Lookups in the app are then a synchronous map access — instant, offline-capable, and incapable of failing because someone else's server is down.

Current data: 863 venues across 239 of 258 stations, within 500 m, up to 4 per station. The 19 stations with no entry genuinely have no bar, pub, café or restaurant tagged nearby in OpenStreetMap; the UI says so and offers a Google Maps search instead.

Place data is from OpenStreetMap, © OpenStreetMap contributors, [ODbL](https://opendatacommons.org/licenses/odbl/).

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
- **Leaflet** + **MapLibre GL** — vector basemap from [OpenFreeMap](https://openfreemap.org/) (free, no API key)
- **@nuxt/ui** v4 + Tailwind CSS v4
- **canvas-confetti** — winner celebration
- **Web Audio API** — tick sounds via oscillator (no audio files)
