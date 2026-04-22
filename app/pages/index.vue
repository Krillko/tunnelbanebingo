<script setup lang="ts">
import { stations } from '~/data/stations';
import { useBingoAnimation } from '~/composables/useBingoAnimation';
import { useVisitedStations } from '~/composables/useVisitedStations';
import type { TbanaLine } from '~/types/station';

const { visitedSet, toggle, markVisited } = useVisitedStations();
const { vehicles } = useVehiclePositions();

const eligibleStations = computed(() => stations.filter(s => !visitedSet.value.has(s.id)));

const { animationState, currentHighlight, winner, animationTarget, startBingo, reset } = useBingoAnimation(eligibleStations);

const mapReady = ref(false);
const activeTab = ref<'bingo' | 'settings'>('bingo');
const winnerJustAdded = ref(false);

const LINE_LABELS: Record<TbanaLine, string> = {
  red: 'Röda linjen',
  green: 'Gröna linjen',
  blue: 'Blå linjen',
  tvarbanan: 'Tvärbanan',
  'sparvag-city': 'Spårväg City',
};

const LINE_COLORS: Record<TbanaLine, string> = {
  red: '#E4000F',
  green: '#00873E',
  blue: '#005DA0',
  tvarbanan: '#E07B39',
  'sparvag-city': '#8B5CF6',
};

const stationsByLine: Record<TbanaLine, typeof stations> = {
  red: stations.filter(s => s.line === 'red'),
  green: stations.filter(s => s.line === 'green'),
  blue: stations.filter(s => s.line === 'blue'),
  tvarbanan: stations.filter(s => s.line === 'tvarbanan'),
  'sparvag-city': stations.filter(s => s.line === 'sparvag-city'),
};

watch(winner, async(w) => {
  winnerJustAdded.value = false;
  if (!w) return;
  const { default: confetti } = await import('canvas-confetti');
  confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.3 } }), 300);
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.7 } }), 500);
});

function handleReset() {
  reset();
}

function addWinnerToVisited() {
  if (!winner.value) return;
  markVisited(winner.value.id);
  winnerJustAdded.value = true;
}
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-50">
    <div class="flex-1 min-h-0 min-h-[50vh] md:min-h-0">
      <BingoMap
        :stations="stations"
        :highlighted-id="currentHighlight"
        :winner-id="winner?.id ?? null"
        :animation-target="animationTarget"
        :vehicles="vehicles"
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

      <div class="flex gap-1 p-1 bg-gray-100 rounded-lg">
        <button
          class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="activeTab === 'bingo' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'bingo'"
        >
          Bingo
        </button>
        <button
          class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="activeTab === 'settings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'settings'"
        >
          Inställningar
        </button>
      </div>

      <!-- Bingo tab -->
      <div v-if="activeTab === 'bingo'" class="flex flex-col gap-4 flex-1">
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
            class="flex flex-col gap-3"
          >
            <UButton
              size="xl"
              block
              :disabled="!mapReady || eligibleStations.length === 0"
              class="text-xl font-bold py-4"
              @click="startBingo"
            >
              🎰 Bingo!
            </UButton>
            <p v-if="!mapReady" class="text-xs text-gray-400 text-center">
              Laddar karta...
            </p>
            <p v-else-if="eligibleStations.length === 0" class="text-xs text-gray-400 text-center">
              Alla stationer är besökta! Avmarkera i Inställningar.
            </p>
          </div>

          <div
            v-else-if="animationState === 'spinning'"
            key="spinning"
            class="flex flex-col items-center gap-3 py-4"
          >
            <div class="text-4xl animate-bounce">🎲</div>
            <p class="text-lg font-semibold text-gray-700 animate-pulse">
              Drar lott...
            </p>
          </div>

          <div
            v-else-if="animationState === 'complete' && winner"
            key="complete"
            class="flex flex-col gap-3"
          >
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
              v-if="!winnerJustAdded"
              variant="soft"
              block
              size="sm"
              @click="addWinnerToVisited"
            >
              ✓ Markera som besökt
            </UButton>
            <p v-else class="text-xs text-center text-gray-400">
              ✓ Tillagd i besökta stationer
            </p>

            <UButton
              variant="outline"
              block
              @click="handleReset">
              Spela igen
            </UButton>
          </div>
        </Transition>
      </div>

      <!-- Settings tab -->
      <div v-else class="flex flex-col gap-5">
        <div>
          <p class="text-sm font-medium text-gray-900">
            Besökta stationer
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            Besökta stationer utesluts ur lottningen.
            {{ visitedSet.size }} av {{ stations.length }} besökta.
          </p>
        </div>

        <div v-for="line in (['red', 'green', 'blue', 'tvarbanan', 'sparvag-city'] as TbanaLine[])" :key="line">
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: LINE_COLORS[line] }" />
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ LINE_LABELS[line] }}</span>
            <span class="text-xs text-gray-400 ml-auto">
              {{ stationsByLine[line].filter(s => visitedSet.has(s.id)).length }}/{{ stationsByLine[line].length }}
            </span>
          </div>
          <div
            v-for="station in stationsByLine[line]"
            :key="station.id"
            class="py-0.5"
          >
            <UCheckbox
              :model-value="visitedSet.has(station.id)"
              :label="station.name"
              @update:model-value="toggle(station.id)"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-x-3 gap-y-1 justify-center pt-2">
        <div
          v-for="(color, line) in LINE_COLORS"
          :key="line"
          class="flex items-center gap-1.5"
        >
          <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: color }" />
          <span class="text-xs text-gray-500">{{ LINE_LABELS[line] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
