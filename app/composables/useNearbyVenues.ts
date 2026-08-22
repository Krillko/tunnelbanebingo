interface Venue {
  id: number;
  name: string;
  lat: number;
  lng: number;
  amenity: string;
  distanceM: number;
  url: string;
}

interface OverpassElement {
  type: 'node' | 'way';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface CacheEntry {
  venues: Venue[];
  timestamp: number;
}

const CACHE_KEY = 'tunnelbanebingo-venues-cache';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1_000; // venue data barely changes — cache a week
const MAX_CACHE_ENTRIES = 50;

// overpass.kumi.systems has been returning 502s for days — try known-good mirrors first,
// keep it as a last-resort fallback in case it recovers.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.osm.ch/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const FETCH_TIMEOUT_MS = 8_000;

function loadCache(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) as Record<string, CacheEntry> : {};
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, CacheEntry>): void {
  try {
    const entries = Object.entries(cache)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .slice(0, MAX_CACHE_ENTRIES);
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // storage full or unavailable — ignore, caching is a best-effort optimization
  }
}

async function fetchFromOverpass(query: string): Promise<OverpassResponse> {
  let lastError: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      return await $fetch<OverpassResponse>(endpoint, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: FETCH_TIMEOUT_MS,
      });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useNearbyVenues() {
  const venues = ref<Venue[]>([]);
  const loading = ref(false);

  async function fetchVenues(stationId: string, stationLat: number, stationLng: number): Promise<void> {
    loading.value = true;
    venues.value = [];

    const cache = loadCache();
    const cached = cache[stationId];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      venues.value = cached.venues;
      loading.value = false;
      return;
    }

    const query = `[out:json][timeout:20];
(
  node["amenity"~"^(bar|pub|cafe|restaurant)$"]["name"](around:500,${stationLat},${stationLng});
  way["amenity"~"^(bar|pub|cafe|restaurant)$"]["name"](around:500,${stationLat},${stationLng});
);
out center body;`;
    try {
      const data = await fetchFromOverpass(query);
      const result = data.elements
        .filter(el => el.tags?.name)
        .map((el): Venue | null => {
          const lat = el.type === 'node' ? el.lat : el.center?.lat;
          const lng = el.type === 'node' ? el.lon : el.center?.lon;
          if (lat == null || lng == null) return null;
          const distanceM = Math.round(haversineM(stationLat, stationLng, lat, lng) / 5) * 5;
          const url = el.tags!.website ?? el.tags!['contact:website'] ?? `https://www.openstreetmap.org/${el.type}/${el.id}`;
          return { id: el.id, name: el.tags!.name!, lat, lng, amenity: el.tags!.amenity ?? '', distanceM, url };
        })
        .filter((v): v is Venue => v !== null)
        .sort((a, b) => a.distanceM - b.distanceM)
        .slice(0, 4);

      venues.value = result;
      cache[stationId] = { venues: result, timestamp: Date.now() };
      saveCache(cache);
    } catch {
      // all mirrors failed — fall back to stale cache if we have one, otherwise stay empty
      if (cached) venues.value = cached.venues;
    } finally {
      loading.value = false;
    }
  }

  function clear(): void {
    venues.value = [];
    loading.value = false;
  }

  return { venues: readonly(venues), loading: readonly(loading), fetchVenues, clear };
}
