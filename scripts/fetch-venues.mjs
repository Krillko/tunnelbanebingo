// Regenerates app/data/venues.ts from OpenStreetMap.
//
// Why this is a build-time script and not a runtime fetch: the public Overpass
// mirrors are not dependable enough to sit in front of a user. Over repeated
// testing overpass-api.de hung or answered 406, kumi.systems and
// private.coffee answered 500, and — worst of all — overpass.osm.ch answered
// "200 OK" with an empty element list and a nonsense timestamp_osm_base, which
// a client has no honest way to tell apart from "there really are no bars
// here". Venue data changes on the order of months, so we fetch it once here,
// where a failure is visible and retryable, and ship the result as static data.
//
// Run with: node scripts/fetch-venues.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STATIONS_FILE = resolve(ROOT, 'app/data/stations.ts');
const OUT_FILE = resolve(ROOT, 'app/data/venues.ts');

const AMENITIES = ['bar', 'pub', 'cafe', 'restaurant'];
const RADIUS_M = 500;
const MAX_PER_STATION = 4;
const BBOX_MARGIN_DEG = 0.02; // ~2 km, comfortably more than RADIUS_M
const CLUSTER_SPAN_DEG = 0.8; // keeps one city in one query, not one country

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.osm.ch/api/interpreter',
];
const ATTEMPTS_PER_ENDPOINT = 3;
const TIMEOUT_MS = 180_000;

function parseStations() {
  const src = readFileSync(STATIONS_FILE, 'utf8');
  const re = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*lat:\s*(-?[\d.]+),\s*lng:\s*(-?[\d.]+)/g;
  const stations = [];
  const seen = new Set();
  for (const [, id, name, lat, lng] of src.matchAll(re)) {
    if (seen.has(id)) continue; // interchanges are listed once per line
    seen.add(id);
    stations.push({ id, name, lat: Number(lat), lng: Number(lng) });
  }
  return stations;
}

// Group stations into geographically tight clusters so each city costs one
// query instead of one query per station.
function clusterStations(stations) {
  const clusters = [];
  for (const s of stations) {
    const hit = clusters.find(c =>
      Math.max(c.maxLat, s.lat) - Math.min(c.minLat, s.lat) <= CLUSTER_SPAN_DEG
      && Math.max(c.maxLng, s.lng) - Math.min(c.minLng, s.lng) <= CLUSTER_SPAN_DEG);
    if (hit) {
      hit.stations.push(s);
      hit.minLat = Math.min(hit.minLat, s.lat);
      hit.maxLat = Math.max(hit.maxLat, s.lat);
      hit.minLng = Math.min(hit.minLng, s.lng);
      hit.maxLng = Math.max(hit.maxLng, s.lng);
    } else {
      clusters.push({ stations: [s], minLat: s.lat, maxLat: s.lat, minLng: s.lng, maxLng: s.lng });
    }
  }
  return clusters;
}

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6_371_000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// A mirror is only trusted if it reports a real OSM base timestamp. osm.ch
// currently serves an empty database behind a 200 with timestamp "117795";
// without this check we would cheerfully bake in zero venues everywhere.
function assertUsable(json) {
  const stamp = json?.osm3s?.timestamp_osm_base;
  if (!stamp || Number.isNaN(Date.parse(stamp))) {
    throw new Error(`mirror reported a bogus OSM timestamp (${JSON.stringify(stamp)}) — stale or empty database`);
  }
  if (!Array.isArray(json.elements)) throw new Error('response has no elements array');
  return json;
}

async function overpass(query) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS_PER_ENDPOINT; attempt++) {
    for (const endpoint of ENDPOINTS) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new URLSearchParams({ data: query }),
          headers: { 'User-Agent': 'tunnelbanebingo venue data generator (github.com/Krillko/tunnelbanebingo)' },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = assertUsable(await res.json());
        console.log(`    ✓ ${endpoint} → ${json.elements.length} elements`);
        return json;
      } catch (err) {
        lastError = err;
        console.log(`    ✗ ${endpoint} (attempt ${attempt}): ${err.message}`);
        await sleep(2_000);
      }
    }
  }
  throw new Error(`every Overpass mirror failed: ${lastError?.message}`);
}

function venuesNear(station, elements) {
  return elements
    .map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      const name = el.tags?.name;
      if (lat == null || lng == null || !name) return null;
      const distanceM = haversineM(station.lat, station.lng, lat, lng);
      if (distanceM > RADIUS_M) return null;
      return {
        id: el.id,
        name,
        lat,
        lng,
        amenity: el.tags.amenity ?? '',
        distanceM: Math.round(distanceM / 5) * 5,
        url: el.tags.website ?? el.tags['contact:website'] ?? `https://www.openstreetmap.org/${el.type}/${el.id}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, MAX_PER_STATION);
}

async function main() {
  const stations = parseStations();
  const clusters = clusterStations(stations);
  console.log(`${stations.length} stations in ${clusters.length} cluster(s)`);

  const byStation = {};
  let total = 0;

  for (const [i, cluster] of clusters.entries()) {
    const bbox = [
      (cluster.minLat - BBOX_MARGIN_DEG).toFixed(4),
      (cluster.minLng - BBOX_MARGIN_DEG).toFixed(4),
      (cluster.maxLat + BBOX_MARGIN_DEG).toFixed(4),
      (cluster.maxLng + BBOX_MARGIN_DEG).toFixed(4),
    ].join(',');
    console.log(`\n  cluster ${i + 1}/${clusters.length}: ${cluster.stations.length} stations, bbox ${bbox}`);

    const filter = `["amenity"~"^(${AMENITIES.join('|')})$"]["name"]`;
    const { elements } = await overpass(
      `[out:json][timeout:180];(node${filter}(${bbox});way${filter}(${bbox}););out center;`
    );

    for (const station of cluster.stations) {
      const found = venuesNear(station, elements);
      if (found.length) {
        byStation[station.id] = found;
        total += found.length;
      }
    }
    if (i < clusters.length - 1) await sleep(5_000); // be a good Overpass citizen
  }

  const covered = Object.keys(byStation).length;
  if (covered < stations.length * 0.5) {
    throw new Error(`only ${covered}/${stations.length} stations got venues — refusing to write a bad dataset`);
  }

  const body = Object.keys(byStation).sort().map((id) => {
    const rows = byStation[id].map(v =>
      `    { id: ${v.id}, name: ${JSON.stringify(v.name)}, lat: ${v.lat}, lng: ${v.lng}, `
      + `amenity: ${JSON.stringify(v.amenity)}, distanceM: ${v.distanceM}, url: ${JSON.stringify(v.url)} },`).join('\n');
    return `  ${JSON.stringify(id)}: [\n${rows}\n  ],`;
  }).join('\n');

  writeFileSync(OUT_FILE, `// AUTO-GENERATED — do not edit by hand.
// Regenerate with: node scripts/fetch-venues.mjs
//
// Venues within ${RADIUS_M} m of each station, up to ${MAX_PER_STATION} per station, nearest first.
// Source: OpenStreetMap via the Overpass API. Data © OpenStreetMap contributors, ODbL.
// Generated ${new Date().toISOString().slice(0, 10)} from ${covered} of ${stations.length} stations.

import type { Venue } from '~/types/venue';

export const stationVenues: Record<string, Venue[]> = {
${body}
};
`);

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  console.log(`\nWrote ${OUT_FILE}`);
  console.log(`${total} venues across ${covered}/${stations.length} stations`);
}

main().catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exitCode = 1;
});
