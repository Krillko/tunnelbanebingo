import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import type { Station } from '~/types/station';
import { useTickSound } from '~/composables/useTickSound';

const TOTAL_DURATION_MS = 4000;
const MIN_INTERVAL_MS = 60;
const MAX_INTERVAL_MS = 600;

function intervalAt(elapsed: number): number {
  const t = Math.min(elapsed / TOTAL_DURATION_MS, 1);
  return MIN_INTERVAL_MS + (MAX_INTERVAL_MS - MIN_INTERVAL_MS) * (t * t);
}

export function useBingoAnimation(stationsSource: MaybeRefOrGetter<Station[]>) {
  const animationState = ref<'idle' | 'spinning' | 'complete'>('idle');
  const currentHighlight = ref<string | null>(null);
  const winner = ref<Station | null>(null);
  const { playTick } = useTickSound();

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function startBingo() {
    if (animationState.value !== 'idle') return;

    // Snapshot eligible stations at spin time
    const eligible = toValue(stationsSource);
    if (!eligible.length) return;

    const target = eligible[Math.floor(Math.random() * eligible.length)]!;
    animationState.value = 'spinning';
    winner.value = null;

    const startTime = performance.now();
    let lastId = '';

    function tick() {
      const elapsed = performance.now() - startTime;

      if (elapsed >= TOTAL_DURATION_MS) {
        currentHighlight.value = target.id;
        setTimeout(() => {
          currentHighlight.value = null;
          winner.value = target;
          animationState.value = 'complete';
        }, 400);
        return;
      }

      let candidate: Station;
      do {
        candidate = eligible[Math.floor(Math.random() * eligible.length)]!;
      } while (candidate.id === lastId && eligible.length > 1);

      lastId = candidate.id;
      currentHighlight.value = candidate.id;

      const t = elapsed / TOTAL_DURATION_MS;
      const pitch = 1200 - 400 * t;
      playTick(pitch);

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
  }

  return {
    animationState: readonly(animationState),
    currentHighlight: readonly(currentHighlight),
    winner: readonly(winner),
    startBingo,
    reset,
  };
}
