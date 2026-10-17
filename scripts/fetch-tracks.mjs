// Regenerates app/data/tracks.ts from OpenStreetMap.
//
// The map used to draw each route as straight lines between station
// coordinates, which in Gothenburg sent the trams straight across blocks,
// parks and water. OSM maps the actual rails as `type=route` relations, so we
// bake that geometry in here — same reasoning as fetch-venues.mjs: the public
// Overpass mirrors are not dependable enough to sit in front of a user, and
// track alignments change on the order of years.
//
// The non-obvious part is corridor bundling. In Gothenburg each stretch of
// track is used by 2.6 lines on average, and exact geometry stacks perfectly,
// so drawing one polyline per line would leave the city centre showing only
// whichever colour happened to be drawn last. Instead we group ways by the
// *set* of lines using them; the map then draws each corridor once per line,
// offset sideways into parallel lanes.
//
// Run with: node scripts/fetch-tracks.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CITIES_FILE = resolve(ROOT, 'app/data/cities.ts');
const OUT_FILE = resolve(ROOT, 'app/data/tracks.ts');

const SIMPLIFY_M = 10;   // Douglas-Peucker tolerance; 10 m is invisible at max zoom
const COORD_DECIMALS = 5; // ~1 m
const MIN_CORRIDOR_M = 80; // shorter stretches get absorbed into a neighbour
const MIN_RELATIONS = 30; // both networks are ~50 relations; fewer means a broken mirror

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.osm.ch/api/interpreter',
];
const ATTEMPTS_PER_ENDPOINT = 3;
const TIMEOUT_MS = 180_000;

// OSM route `ref` -> app line id. Anything not listed here is ignored, which
// is how Nockebybanan (12), Lidingöbanan (21), Lisebergslinjen, the
// under-construction "Gul linje till Älvsjö" and Gothenburg's 10 and 12 stay
// out: the app does not model them.
const STOCKHOLM_LINE_BY_REF = {
  10: 'blue', 11: 'blue',
  13: 'red', 14: 'red',
  17: 'green', 18: 'green', 19: 'green',
  30: 'tvarbanan', 31: 'tvarbanan',
  7: 'sparvag-city',
};

const QUERY = `[out:json][timeout:180];
(rel["type"="route"]["route"="tram"]["network"~"Västtrafik",i];
 rel["type"="route"]["route"~"^(tram|subway|light_rail)$"]["network"~"Storstockholms|^SL$",i];);
out geom;`;

// Lane order comes straight from the legend order in cities.ts, so the two
// never drift apart.
function parseCityLines() {
  const src = readFileSync(CITIES_FILE, 'utf8');
  const cities = {};
  for (const [, cityId, block] of src.matchAll(/(\w+):\s*\{[\s\S]*?lines:\s*\[([\s\S]*?)\]/g)) {
    cities[cityId] = [...block.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
  }
  return cities;
}

function lineForRelation(tags, cityLines) {
  const ref = tags.ref;
  if (!ref) return null;
  if (/Västtrafik/i.test(tags.network ?? '')) {
    const id = `gbg-${ref}`;
    return cityLines.gothenburg.includes(id) ? { city: 'gothenburg', line: id } : null;
  }
  const line = STOCKHOLM_LINE_BY_REF[ref];
  return line && cityLines.stockholm.includes(line) ? { city: 'stockholm', line } : null;
}

function metresBetween(a, b) {
  const latScale = Math.cos((a[0] + b[0]) / 2 * Math.PI / 180);
  return Math.hypot((a[0] - b[0]) * 111_320, (a[1] - b[1]) * 111_320 * latScale);
}

function lengthM(coords) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) total += metresBetween(coords[i - 1], coords[i]);
  return total;
}

function perpendicularM(p, a, b) {
  const latScale = Math.cos(a[0] * Math.PI / 180);
  const px = (p[1] - a[1]) * latScale, py = p[0] - a[0];
  const bx = (b[1] - a[1]) * latScale, by = b[0] - a[0];
  const lenSq = bx * bx + by * by;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, (px * bx + py * by) / lenSq));
  return Math.hypot(px - t * bx, py - t * by) * 111_320;
}

// Iterative Douglas-Peucker — some corridors run to 1 300 points, deep enough
// to blow the stack if this recursed.
function simplify(coords, toleranceM) {
  if (coords.length < 3) return coords;
  const keep = new Array(coords.length).fill(false);
  keep[0] = keep[coords.length - 1] = true;
  const stack = [[0, coords.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxDist = 0, index = -1;
    for (let i = first + 1; i < last; i++) {
      const dist = perpendicularM(coords[i], coords[first], coords[last]);
      if (dist > maxDist) { maxDist = dist; index = i; }
    }
    if (index !== -1 && maxDist > toleranceM) {
      keep[index] = true;
      stack.push([first, index], [index, last]);
    }
  }
  return coords.filter((_, i) => keep[i]);
}

const nodeKey = ([lat, lng]) => `${lat},${lng}`;

// Join ways end-to-end into the longest continuous runs we can, flipping
// direction where needed. OSM shares the node between adjacent ways, so the
// endpoint coordinates match exactly.
function mergeWays(ways) {
  const remaining = ways.map(w => w.slice());
  const merged = [];
  while (remaining.length) {
    let run = remaining.pop();
    let grew = true;
    while (grew) {
      grew = false;
      for (let i = 0; i < remaining.length; i++) {
        const way = remaining[i];
        for (const candidate of [way, way.slice().reverse()]) {
          if (nodeKey(run[run.length - 1]) === nodeKey(candidate[0])) {
            run = run.concat(candidate.slice(1));
          } else if (nodeKey(run[0]) === nodeKey(candidate[candidate.length - 1])) {
            run = candidate.slice(0, -1).concat(run);
          } else {
            continue;
          }
          remaining.splice(i, 1);
          grew = true;
          break;
        }
        if (grew) break;
      }
    }
    merged.push(run);
  }
  return merged;
}

function buildCorridors(wayLines, wayGeom, laneOrder) {
  const byKey = new Map();
  for (const [wayId, lines] of wayLines) {
    const key = [...lines].sort((a, b) => laneOrder.indexOf(a) - laneOrder.indexOf(b)).join('|');
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(wayId);
  }
  const corridors = [];
  for (const [key, wayIds] of byKey) {
    for (const coords of mergeWays(wayIds.map(id => wayGeom.get(id)))) {
      corridors.push({ key, lines: key.split('|'), coords, wayIds });
    }
  }
  return corridors;
}

// OSM splits ways at traffic signals and junctions, so a bundle's membership
// flickers over short stretches and the lanes would jog sideways constantly.
// Where a stub's lines are a subset of a touching corridor's, fold it in: the
// stub is then over-drawn by the extra lines for a few dozen metres, which is
// invisible, and no line loses continuity.
function absorbStubs(corridors, wayLines, wayGeom, laneOrder) {
  let changed = false;
  const byNode = new Map();
  for (const corridor of corridors) {
    for (const coord of corridor.coords) {
      const k = nodeKey(coord);
      if (!byNode.has(k)) byNode.set(k, new Set());
      byNode.get(k).add(corridor);
    }
  }
  for (const stub of corridors) {
    if (lengthM(stub.coords) >= MIN_CORRIDOR_M) continue;
    const stubLines = new Set(stub.lines);
    let best = null, bestLength = 0;
    const touching = new Set();
    for (const coord of [stub.coords[0], stub.coords[stub.coords.length - 1]]) {
      for (const other of byNode.get(nodeKey(coord)) ?? []) touching.add(other);
    }
    for (const other of touching) {
      if (other === stub || other.key === stub.key) continue;
      if (![...stubLines].every(l => other.lines.includes(l))) continue;
      const len = lengthM(other.coords);
      if (len > bestLength) { best = other; bestLength = len; }
    }
    if (!best) continue;
    for (const wayId of stub.wayIds) {
      wayLines.set(wayId, new Set(best.lines));
    }
    changed = true;
  }
  return changed ? buildCorridors(wayLines, wayGeom, laneOrder) : null;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// A mirror is only trusted if it reports a real OSM base timestamp. osm.ch
// has served an empty database behind a 200 before now; without this check we
// would cheerfully bake in a blank map.
function assertUsable(json, minElements) {
  const stamp = json?.osm3s?.timestamp_osm_base;
  if (!stamp || Number.isNaN(Date.parse(stamp))) {
    throw new Error(`mirror reported a bogus OSM timestamp (${JSON.stringify(stamp)}) — stale or empty database`);
  }
  if (!Array.isArray(json.elements)) throw new Error('response has no elements array');
  // osm.ch has answered this query "200 OK" with a single relation and a
  // plausible timestamp. Both networks together are ~50 relations, so anything
  // near-empty is a broken mirror rather than a real answer — rotate on.
  if (json.elements.length < minElements) {
    throw new Error(`only ${json.elements.length} elements, expected at least ${minElements} — mirror is serving a partial database`);
  }
  return json;
}

async function overpass(query, minElements) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS_PER_ENDPOINT; attempt++) {
    for (const endpoint of ENDPOINTS) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new URLSearchParams({ data: query }),
          // overpass-api.de answers 406 to a request with no User-Agent.
          headers: { 'User-Agent': 'tunnelbanebingo track data generator (github.com/Krillko/tunnelbanebingo)' },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = assertUsable(await res.json(), minElements);
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

async function main() {
  const cityLines = parseCityLines();
  for (const city of ['stockholm', 'gothenburg']) {
    if (!cityLines[city]?.length) throw new Error(`could not parse ${city} lines out of cities.ts`);
  }
  console.log('lane order from cities.ts:');
  for (const [city, lines] of Object.entries(cityLines)) console.log(`  ${city}: ${lines.join(', ')}`);

  console.log('\n  fetching route relations');
  const { elements } = await overpass(QUERY, MIN_RELATIONS);

  // wayId -> geometry, and wayId -> set of app line ids running over it.
  const wayGeom = new Map();
  const wayLinesByCity = { stockholm: new Map(), gothenburg: new Map() };
  const seenLines = new Set();

  for (const relation of elements) {
    const hit = lineForRelation(relation.tags ?? {}, cityLines);
    if (!hit) continue;
    seenLines.add(hit.line);
    for (const member of relation.members ?? []) {
      // Role-less members are the track ways; stop/platform members are nodes.
      if (member.type !== 'way' || member.role || !member.geometry) continue;
      wayGeom.set(member.ref, member.geometry.map(p => [p.lat, p.lon]));
      const map = wayLinesByCity[hit.city];
      if (!map.has(member.ref)) map.set(member.ref, new Set());
      map.get(member.ref).add(hit.line);
    }
  }

  const missing = Object.values(cityLines).flat().filter(l => !seenLines.has(l));
  if (missing.length) {
    throw new Error(`no OSM geometry found for ${missing.join(', ')} — refusing to write a partial dataset`);
  }

  const byCity = {};
  for (const [city, wayLines] of Object.entries(wayLinesByCity)) {
    const laneOrder = cityLines[city];
    let corridors = buildCorridors(wayLines, wayGeom, laneOrder);
    const rawCount = corridors.length;

    // Each pass can expose new stubs as neighbours merge; it settles quickly.
    for (let pass = 0; pass < 5; pass++) {
      const next = absorbStubs(corridors, wayLines, wayGeom, laneOrder);
      if (!next) break;
      corridors = next;
    }

    byCity[city] = corridors
      .map(c => ({ lines: c.lines, coords: simplify(c.coords, SIMPLIFY_M) }))
      .filter(c => c.coords.length >= 2)
      .sort((a, b) => b.lines.length - a.lines.length || a.lines[0].localeCompare(b.lines[0]));

    const points = byCity[city].reduce((n, c) => n + c.coords.length, 0);
    const widest = Math.max(...byCity[city].map(c => c.lines.length));
    console.log(`\n  ${city}: ${byCity[city].length} corridors (${rawCount} before stub absorption), `
      + `${points} points, widest bundle ${widest} line(s)`);
  }

  const totalCorridors = Object.values(byCity).reduce((n, c) => n + c.length, 0);
  if (totalCorridors < 20) {
    throw new Error(`only ${totalCorridors} corridors — refusing to write a bad dataset`);
  }

  const round = n => Number(n.toFixed(COORD_DECIMALS));
  const body = Object.entries(byCity).map(([city, corridors]) => {
    const rows = corridors.map((c) => {
      const coords = c.coords.map(([lat, lng]) => `[${round(lat)}, ${round(lng)}]`).join(', ');
      return `    { lines: [${c.lines.map(l => `'${l}'`).join(', ')}], coords: [${coords}] },`;
    }).join('\n');
    return `  ${city}: [\n${rows}\n  ],`;
  }).join('\n');

  const totalPoints = Object.values(byCity).reduce((n, cs) => n + cs.reduce((m, c) => m + c.coords.length, 0), 0);

  writeFileSync(OUT_FILE, `// AUTO-GENERATED — do not edit by hand.
// Regenerate with: node scripts/fetch-tracks.mjs
//
// Real track geometry per city, grouped into corridors: one entry per
// continuous stretch of track, listing every line that runs over it in lane
// order. Simplified to ${SIMPLIFY_M} m, coordinates rounded to ${COORD_DECIMALS} decimals.
// Source: OpenStreetMap route relations via the Overpass API.
// Data © OpenStreetMap contributors, ODbL.
// Generated ${new Date().toISOString().slice(0, 10)}: ${totalCorridors} corridors, ${totalPoints} points.

import type { CityId } from '~/types/city';
import type { TrackCorridor } from '~/types/track';

export const cityTracks: Record<CityId, TrackCorridor[]> = {
${body}
};
`);

  console.log(`\nWrote ${OUT_FILE}`);
  console.log(`${totalCorridors} corridors, ${totalPoints} points`);
}

main().catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exitCode = 1;
});
