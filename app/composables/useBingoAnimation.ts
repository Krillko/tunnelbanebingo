import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import type { Station } from '~/types/station';
import { useTickSound } from '~/composables/useTickSound';

const TOTAL_DURATION_MS = 4000;
const MIN_INTERVAL_MS = 60;
const MAX_INTERVAL_MS = 600;
const DECAY_TAU = 20;

function intervalAt(elapsed: number): number {
  const t = Math.min(elapsed / TOTAL_DURATION_MS, 1);
  return MIN_INTERVAL_MS + (MAX_INTERVAL_MS - MIN_INTERVAL_MS) * (t * t);
}

function sqDist(a: Station, b: Station): number {
  const dlat = a.lat - b.lat;
  const dlng = a.lng - b.lng;
  return dlat * dlat + dlng * dlng;
}

function pickTarget(eligible: Station[], times: Map<string, number> | null): Station {
  if (!times) {
    return eligible[Math.floor(Math.random() * eligible.length)]!;
  }

  const weights = eligible.map(s => {
    const t = times.get(s.id);
    return Math.exp(-(t ?? 120) / DECAY_TAU);
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < eligible.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return eligible[i]!;
  }
  return eligible.at(-1)!;
}

export function useBingoAnimation(
  stationsSource: MaybeRefOrGetter<Station[]>,
  homeStationIdSource: MaybeRefOrGetter<string | null> = () => null,
  travelTimesFromFn?: (id: string) => Map<string, number>,
) {
  const animationState = ref<'idle' | 'spinning' | 'complete'>('idle');
  const currentHighlight = ref<string | null>(null);
  const winner = ref<Station | null>(null);
  const animationTarget = ref<{ lat: number; lng: number } | null>(null);
  const { unlock, playTick } = useTickSound();

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const travelTimes = computed<Map<string, number> | null>(() => {
    const homeId = toValue(homeStationIdSource);
    if (!homeId || !travelTimesFromFn) return null;
    const result = travelTimesFromFn(homeId);
    return result.size > 0 ? result : null;
  });

  function startBingo() {
    if (animationState.value !== 'idle') return;

    unlock();

    const eligible = toValue(stationsSource);
    if (!eligible.length) return;

    const target = pickTarget(eligible, travelTimes.value);
    const byDistance = [...eligible].sort((a, b) => sqDist(a, target) - sqDist(b, target));

    animationState.value = 'spinning';
    winner.value = null;
    animationTarget.value = { lat: target.lat, lng: target.lng };

    const startTime = performance.now();
    let lastId = '';

    function tick() {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / TOTAL_DURATION_MS, 1);

      if (elapsed >= TOTAL_DURATION_MS) {
        currentHighlight.value = target.id;
        setTimeout(() => {
          currentHighlight.value = null;
          winner.value = target;
          animationState.value = 'complete';
        }, 400);
        return;
      }

      const poolSize = Math.max(3, Math.round(eligible.length * (1 - t * 0.85)));
      const pool = byDistance.slice(0, poolSize);

      let candidate: Station;
      do {
        candidate = pool[Math.floor(Math.random() * pool.length)]!;
      } while (candidate.id === lastId && pool.length > 1);

      lastId = candidate.id;
      currentHighlight.value = candidate.id;

      playTick(1200 - 400 * t);

      timeoutId = setTimeout(tick, intervalAt(elapsed));
    }

    tick();
  }

  function reset() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    animationState.value = 'idle';
    currentHighlight.value = null;
    winner.value = null;
    animationTarget.value = null;
  }

  return {
    animationState: readonly(animationState),
    currentHighlight: readonly(currentHighlight),
    winner: readonly(winner),
    animationTarget: readonly(animationTarget),
    startBingo,
    reset,
  };
}
