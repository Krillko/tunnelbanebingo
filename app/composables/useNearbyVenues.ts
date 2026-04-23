interface Venue {
  id: number;
  name: string;
  lat: number;
  lng: number;
  amenity: string;
  distanceM: number;
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

  async function fetchVenues(stationLat: number, stationLng: number): Promise<void> {
    loading.value = true;
    venues.value = [];
    const query = `[out:json][timeout:10];
(
  node["amenity"~"^(bar|pub|cafe)$"]["name"](around:500,${stationLat},${stationLng});
  way["amenity"~"^(bar|pub|cafe)$"]["name"](around:500,${stationLat},${stationLng});
);
out center body;`;
    try {
      const data = await $fetch<OverpassResponse>('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      venues.value = data.elements
        .filter(el => el.tags?.name)
        .map((el): Venue | null => {
          const lat = el.type === 'node' ? el.lat : el.center?.lat;
          const lng = el.type === 'node' ? el.lon : el.center?.lon;
          if (lat == null || lng == null) return null;
          const distanceM = Math.round(haversineM(stationLat, stationLng, lat, lng) / 5) * 5;
          return { id: el.id, name: el.tags!.name!, lat, lng, amenity: el.tags!.amenity ?? '', distanceM };
        })
        .filter((v): v is Venue => v !== null)
        .sort((a, b) => a.distanceM - b.distanceM)
        .slice(0, 4);
    } catch {
      // silently ignore network errors
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
