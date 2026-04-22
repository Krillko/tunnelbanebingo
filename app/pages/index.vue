<script setup lang="ts">
import { stations } from '~/data/stations';
import { useBingoAnimation } from '~/composables/useBingoAnimation';
import type { TbanaLine } from '~/types/station';

const { animationState, currentHighlight, winner, startBingo, reset } = useBingoAnimation(stations);
const mapReady = ref(false);

const LINE_LABELS: Record<TbanaLine, string> = {
  red: 'Röda linjen',
  green: 'Gröna linjen',
  blue: 'Blå linjen',
};

const LINE_COLORS: Record<TbanaLine, string> = {
  red: '#E4000F',
  green: '#00873E',
  blue: '#005DA0',
};

watch(winner, async(w) => {
  if (!w) return;
  const { default: confetti } = await import('canvas-confetti');
  confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.3 } }), 300);
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.7 } }), 500);
});

function handleReset() {
  reset();
}
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-50">
    <div class="flex-1 min-h-0 min-h-[50vh] md:min-h-0">
      <BingoMap
        :stations="stations"
        :highlighted-id="currentHighlight"
        :winner-id="winner?.id ?? null"
        @ready="mapReady = true"
      />
    </div>

    <div class="w-full md:w-72 flex-shrink-0 flex flex-col gap-4 p-6 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 bg-white">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          Tunnelbana<br>Bingo
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Slumpa en station på Stockholms tunnelbana
        </p>
      </div>

      <USeparator />

      <div class="flex flex-col gap-4 flex-1">
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition-all duration-200"
          leave-to-class="opacity-0 translate-y-2"
          mode="out-in"
        >
          <div
            v-if="animationState === 'idle'"
            key="idle"
            class="flex flex-col gap-3">
            <UButton
              size="xl"
              block
              :disabled="!mapReady"
              class="text-xl font-bold py-4"
              @click="startBingo"
            >
              🎰 Bingo!
            </UButton>
            <p v-if="!mapReady" class="text-xs text-gray-400 text-center">
              Laddar karta...
            </p>
          </div>

          <div
            v-else-if="animationState === 'spinning'"
            key="spinning"
            class="flex flex-col items-center gap-3 py-4">
            <div class="text-4xl animate-bounce">🎲</div>
            <p class="text-lg font-semibold text-gray-700 animate-pulse">
              Drar lott...
            </p>
          </div>

          <div
            v-else-if="animationState === 'complete' && winner"
            key="complete"
            class="flex flex-col gap-4">
            <div class="rounded-xl border-2 p-5 text-center" :style="{ borderColor: LINE_COLORS[winner.line] }">
              <div class="text-5xl mb-3">🏆</div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                {{ winner.name }}
              </h2>
              <span
                class="inline-block px-3 py-1 rounded-full text-white text-sm font-semibold"
                :style="{ backgroundColor: LINE_COLORS[winner.line] }"
              >
                {{ LINE_LABELS[winner.line] }}
              </span>
            </div>

            <UButton
              variant="outline"
              block
              @click="handleReset"
            >
              Spela igen
            </UButton>
          </div>
        </Transition>
      </div>

      <div class="flex gap-3 justify-center pt-2">
        <div
          v-for="(color, line) in LINE_COLORS"
          :key="line"
          class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: color }" />
          <span class="text-xs text-gray-500 capitalize">{{ line }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
