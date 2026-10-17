import type { Venue } from '~/types/venue';
import { stationVenues } from '~/data/venues';

/**
 * Nearby bars, pubs, cafés and restaurants for a station.
 *
 * This used to query the Overpass API live from the browser, which was the
 * source of the recurring "it spins and then shows nothing" bug: the public
 * mirrors fail constantly, and overpass.osm.ch in particular answers 200 OK
 * with an empty result set, which is indistinguishable from a station that
 * genuinely has no bars nearby. The data is now baked into app/data/venues.ts
 * at build time (see scripts/fetch-venues.mjs), so lookups are instant, work
 * offline, and cannot come back empty because somebody else's server is down.
 */
export function useNearbyVenues() {
  const venues = ref<Venue[]>([]);

  function fetchVenues(stationId: string): void {
    venues.value = stationVenues[stationId] ?? [];
  }

  function clear(): void {
    venues.value = [];
  }

  return { venues: readonly(venues), fetchVenues, clear };
}
