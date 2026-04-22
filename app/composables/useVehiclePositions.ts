export interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  routeId: string | null;
}

const POLL_INTERVAL_MS = 15_000;

export function useVehiclePositions() {
  const vehicles = ref<Vehicle[]>([]);

  async function refresh() {
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
