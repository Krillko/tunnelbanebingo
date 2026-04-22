import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const FEED_URL = 'https://opendata.samtrafiken.se/gtfs-rt/sl/VehiclePositions.pb';

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
      .map(e => ({
        id: e.id,
        lat: e.vehicle!.position!.latitude,
        lng: e.vehicle!.position!.longitude,
        routeId: e.vehicle?.trip?.routeId ?? null,
      }));
  } catch {
    return [];
  }
});
