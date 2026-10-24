import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const FEED_URL = 'https://opendata.samtrafiken.se/gtfs-rt/sl/VehiclePositions.pb';

// The SL feed is the whole operator: ~600 vehicles, of which all but ~60 are
// buses. Almost none of them carry a routeId (only cancelled and added trips
// do), so the mode has to come from the vehicle id instead.
//
// Those ids look like 9031001 0025 00142 — operator prefix, fleet group, unit.
// Sampling the feed, the fleet groups below are the only ones that ever appear
// on a tunnelbana route; everything else that gets labelled is a bus number.
const METRO_FLEETS = new Set(['0005', '0025', '0027']);

// Route ids encode the line the same way: 9011001 0019 00000 -> T19.
// Blue (10/11) runs underground end to end and never shows up with a position.
const LINE_BY_NUMBER: Record<string, 'red' | 'green' | 'blue'> = {
  '0013': 'red',
  '0014': 'red',
  '0017': 'green',
  '0018': 'green',
  '0019': 'green',
  '0010': 'blue',
  '0011': 'blue',
};

const group = (id: string | null | undefined) => (id ?? '').slice(7, 11);

export default defineEventHandler(async() => {
  const { trafiklabApiKey } = useRuntimeConfig();
  if (!trafiklabApiKey) return [];

  try {
    const res = await fetch(`${FEED_URL}?key=${trafiklabApiKey}`, {
      headers: { Accept: 'application/x-google-protobuf' },
    });
    if (!res.ok) return [];

    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    return feed.entity
      .filter(e => e.vehicle?.position?.latitude != null && e.vehicle?.position?.longitude != null)
      .filter(e => METRO_FLEETS.has(group(e.vehicle?.vehicle?.id)))
      .map(e => ({
        // e.id is not stable: it carries a timestamp, so a third of the ids
        // change between two polls and the map would rebuild those markers
        // instead of moving them. The vehicle id is the same train every time.
        id: e.vehicle!.vehicle!.id!, // guaranteed by the fleet filter above
        lat: e.vehicle!.position!.latitude,
        lng: e.vehicle!.position!.longitude,
        line: LINE_BY_NUMBER[group(e.vehicle?.trip?.routeId)] ?? null,
      }));
  } catch {
    return [];
  }
});
