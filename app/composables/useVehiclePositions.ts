import type { CityId } from '~/types/city';

export interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  line: 'red' | 'green' | 'blue' | null;
}

const POLL_INTERVAL_MS = 15_000;

// The feed is Stockholm's (SL) only, so Göteborg gets nothing to draw.
export function useVehiclePositions(cityId: MaybeRefOrGetter<CityId>) {
  const vehicles = ref<Vehicle[]>([]);
  const { trafiklabEnabled } = useRuntimeConfig().public;

  if (!trafiklabEnabled) return { vehicles };

  async function refresh() {
    if (toValue(cityId) !== 'stockholm') {
      vehicles.value = [];
      return;
    }
    try {
      vehicles.value = await $fetch<Vehicle[]>('/api/vehicles');
    } catch {
      // silently ignore network errors
    }
  }

  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    refresh();
    timer = setInterval(refresh, POLL_INTERVAL_MS);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { vehicles };
}
