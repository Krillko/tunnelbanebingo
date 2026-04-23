<script setup lang="ts">
import { stations } from '~/data/stations';
import { useBingoAnimation } from '~/composables/useBingoAnimation';
import { useVisitedStations } from '~/composables/useVisitedStations';
import { useHomeStation } from '~/composables/useHomeStation';
import { useOnboarding } from '~/composables/useOnboarding';
import type { TbanaLine } from '~/types/station';

const { visitedSet, toggle, markVisited } = useVisitedStations();
const { homeStationId, setHome } = useHomeStation();
const { hasOnboarded, markOnboarded } = useOnboarding();
const { tramsIncluded, setTramsIncluded } = useTramsIncluded();
const { vehicles } = useVehiclePositions();

const TRAM_LINES = new Set(['tvarbanan', 'sparvag-city']);

const eligibleStations = computed(() =>
  stations.filter(s =>
    !visitedSet.value.has(s.id) &&
    s.id !== homeStationId.value &&
    (tramsIncluded.value || !TRAM_LINES.has(s.line))
  )
);

const { animationState, currentHighlight, winner, animationTarget, startBingo, reset } =
  useBingoAnimation(eligibleStations, homeStationId);

const { venues, loading: venuesLoading, fetchVenues, clear: clearVenues } = useNearbyVenues();

watch(winner, (w) => {
  if (w) fetchVenues(w.lat, w.lng);
  else clearVenues();
});

type HomeSelectItem = { label: string; value: string };
const homeStationSelectItems = stations
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
  .map<HomeSelectItem>(s => ({ label: s.name, value: s.id }));

const selectedHomeStation = computed<HomeSelectItem | null>({
  get: () => homeStationSelectItems.find(i => i.value === homeStationId.value) ?? null,
  set: (item: HomeSelectItem | null) => setHome(item?.value ?? null),
});

// Onboarding dialog — local selection committed only on confirm, not on select
const showOnboarding = ref(!hasOnboarded.value);
const dialogStation = ref<HomeSelectItem | null>(null);

function confirmOnboarding() {
  if (dialogStation.value) setHome(dialogStation.value.value);
  markOnboarded();
  showOnboarding.value = false;
}

function skipOnboarding() {
  markOnboarded();
  showOnboarding.value = false;
}

async function onboardingGoogleSignIn() {
  await signInWithGoogle();
  if (syncStatus.value === 'synced') {
    markOnboarded();
    showOnboarding.value = false;
  }
}

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

const METRO_LINES = ['red', 'green', 'blue'] as const;
const TRAM_LINES_LIST = ['tvarbanan', 'sparvag-city'] as const;
const ALL_LINES = [...METRO_LINES, ...TRAM_LINES_LIST] as TbanaLine[];

const stationsByLine: Record<TbanaLine, typeof stations> = {
  red: stations.filter(s => s.line === 'red'),
  green: stations.filter(s => s.line === 'green'),
  blue: stations.filter(s => s.line === 'blue'),
  tvarbanan: stations.filter(s => s.line === 'tvarbanan'),
  'sparvag-city': stations.filter(s => s.line === 'sparvag-city'),
};

const visibleLines = computed<TbanaLine[]>(() =>
  tramsIncluded.value ? ALL_LINES : [...METRO_LINES]
);

const visibleStations = computed(() =>
  stations.filter(s => tramsIncluded.value || !TRAM_LINES.has(s.line))
);

// Worker-based confetti instance — runs particle physics off the main thread
// so it doesn't compete with Leaflet's animation frame loop
let confettiFn: ((opts: object) => void) | null = null;
async function fire(opts: object) {
  if (!confettiFn) {
    const { default: confetti } = await import('canvas-confetti');
    confettiFn = confetti.create(undefined, { useWorker: true, resize: true });
  }
  confettiFn(opts);
}

watch(winner, (w) => {
  winnerJustAdded.value = false;
  if (!w) return;
  fire({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
  setTimeout(() => fire({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.3 } }), 300);
  setTimeout(() => fire({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.7 } }), 500);
});

function handleReset() {
  reset();
}

function addWinnerToVisited() {
  if (!winner.value) return;
  markVisited(winner.value.id);
  winnerJustAdded.value = true;
}

const { cloudSyncAvailable, signedInEmail, syncStatus, lastSyncedAt, syncError, signInWithGoogle, syncNow, debouncedSync, signOut } = useCloudSync();

const showCloudDialog = ref(false);
const cloudPrompted = ref(!!localStorage.getItem('tunnelbanebingo-cloud-prompted'));

watch(() => visitedSet.value.size, (newSize, oldSize) => {
  if (newSize === 1 && (oldSize ?? 0) === 0 && !cloudPrompted.value && !signedInEmail.value && cloudSyncAvailable.value && syncStatus.value === 'idle') {
    showCloudDialog.value = true;
    cloudPrompted.value = true;
    localStorage.setItem('tunnelbanebingo-cloud-prompted', '1');
  }
});

watch([visitedSet, homeStationId, tramsIncluded], () => {
  debouncedSync();
});

const lastSyncedText = computed(() =>
  lastSyncedAt.value?.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) ?? null
);
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-50">
    <UModal
      v-model:open="showOnboarding"
      title="Välj din hemstation"
      :dismissible="false"
      :close="false"
    >
      <template #body>
        <p class="text-sm text-gray-500">
          Stationer nära hemmet lottas oftare — långt bort är fortfarande möjligt, bara ovanligare.
          Du kan ändra detta när som helst i Inställningar.
        </p>
        <USelectMenu
          v-model="dialogStation"
          :items="homeStationSelectItems"
          by="value"
          placeholder="Sök station…"
          class="mt-3 w-full"
        />
        <UCheckbox
          :model-value="tramsIncluded"
          label="Inkludera spårvägar (Tvärbanan & Spårväg City)"
          class="mt-4"
          @update:model-value="setTramsIncluded"
        />
      </template>
      <template #footer>
        <div class="flex flex-col gap-2 w-full">
          <UButton
            block
            :disabled="!dialogStation"
            @click="confirmOnboarding"
          >
            Välj hemstation
          </UButton>
          <UButton
            block
            variant="ghost"
            color="neutral"
            @click="skipOnboarding"
          >
            Gör det senare (i Inställningar)
          </UButton>
          <template v-if="cloudSyncAvailable && !signedInEmail">
            <USeparator class="my-1" />
            <UButton
              block
              variant="ghost"
              color="neutral"
              leading-icon="i-logos-google-icon"
              :loading="syncStatus === 'signing-in' || syncStatus === 'syncing'"
              @click="onboardingGoogleSignIn"
            >
              Logga in med Google
            </UButton>
          </template>
        </div>
      </template>
    </UModal>
    <CloudSyncDialog v-if="cloudSyncAvailable" v-model:open="showCloudDialog" />

    <div class="flex-1 min-h-0 min-h-[50vh] md:min-h-0">
      <BingoMap
        :stations="stations"
        :highlighted-id="currentHighlight"
        :winner-id="winner?.id ?? null"
        :animation-target="animationTarget"
        :vehicles="vehicles"
        :trams-included="tramsIncluded"
        @ready="mapReady = true"
      />
    </div>

    <div class="w-full md:w-72 flex-shrink-0 flex flex-col gap-4 p-6 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 bg-white">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          Tunnelbana<br>Bingo
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Slumpa en station på Stockholms tunnelbana / Spårvägar
        </p>
        <template v-if="cloudSyncAvailable">
          <div v-if="signedInEmail" class="flex items-center gap-1.5 mt-2">
            <span class="size-1.5 rounded-full bg-green-500 shrink-0" />
            <span class="text-xs text-gray-400 truncate">{{ signedInEmail }}</span>
          </div>
          <UButton
            v-else
            size="xs"
            variant="ghost"
            color="neutral"
            leading-icon="i-logos-google-icon"
            class="mt-2 -ml-1.5"
            :loading="syncStatus === 'signing-in' || syncStatus === 'syncing'"
            @click="signInWithGoogle"
          >
            Logga in med Google
          </UButton>
        </template>
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

              <div v-if="venuesLoading || venues.length" class="mt-3 pt-3 border-t border-gray-100">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Nära stationen
                </p>
                <div v-if="venuesLoading" class="flex items-center gap-1.5 text-xs text-gray-400">
                  <UIcon name="i-heroicons-arrow-path" class="animate-spin size-3 shrink-0" />
                  Letar efter ställen…
                </div>
                <div v-else class="flex flex-col gap-1.5">
                  <a
                    v-for="venue in venues"
                    :key="venue.id"
                    :href="venue.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-between gap-2 text-sm rounded-md px-2 py-1 -mx-2 hover:bg-gray-50 transition-colors"
                  >
                    <span class="truncate text-gray-800">{{ venue.name }}</span>
                    <span class="shrink-0 text-xs text-gray-400">{{ venue.distanceM }} m</span>
                  </a>
                  <p v-if="venues.length" class="text-xs text-gray-400 mt-1">
                    Resultaten är varken sponsrade eller granskade.
                  </p>
                </div>
              </div>
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
            Hemstation
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            Stationer nära hemmet lottas mer sannolikt.
          </p>
          <USelectMenu
            v-model="selectedHomeStation"
            :items="homeStationSelectItems"
            by="value"
            :clear="true"
            placeholder="Välj hemstation…"
            class="mt-2 w-full"
          />
        </div>

        <USeparator />

        <!-- Cloud sync section — only shown when GOOGLE_CLIENT_ID is configured -->
        <template v-if="cloudSyncAvailable">
          <div>
            <p class="text-sm font-medium text-gray-900">
              Molnsynk
            </p>

            <!-- Not signed in -->
            <template v-if="!signedInEmail">
              <p class="text-xs text-gray-500 mt-0.5">
                Spara dina stationer i Google Drive och synka mellan enheter.
              </p>
              <UButton
                size="sm"
                variant="outline"
                leading-icon="i-logos-google-icon"
                class="mt-2"
                :loading="syncStatus === 'signing-in' || syncStatus === 'syncing'"
                @click="signInWithGoogle"
              >
                Logga in med Google
              </UButton>
              <p v-if="syncError" class="text-xs text-red-500 mt-1.5">
                {{ syncError }}
              </p>
            </template>

            <!-- Syncing -->
            <template v-else-if="syncStatus === 'syncing'">
              <div class="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin size-3 shrink-0" />
                Synkar…
              </div>
            </template>

            <!-- Signed in -->
            <template v-else>
              <p class="text-xs text-gray-500 mt-0.5 truncate">
                {{ signedInEmail }}
              </p>
              <p v-if="lastSyncedText" class="text-xs text-gray-400 mt-0.5">
                Senast synkat: {{ lastSyncedText }}
              </p>
              <p v-if="syncError" class="text-xs text-red-500 mt-0.5">
                {{ syncError }}
              </p>
              <div class="flex gap-2 mt-2">
                <UButton
                  size="xs"
                  variant="outline"
                  @click="syncNow">
                  Synka nu
                </UButton>
                <UButton
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  @click="signOut">
                  Logga ut
                </UButton>
              </div>
            </template>
          </div>

          <USeparator />
        </template>

        <div>
          <p class="text-sm font-medium text-gray-900">
            Spårvägar
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            Inkludera Tvärbanan och Spårväg City i lottningen.
          </p>
          <UCheckbox
            :model-value="tramsIncluded"
            label="Inkludera spårvägar"
            class="mt-2"
            @update:model-value="setTramsIncluded"
          />
        </div>

        <USeparator />

        <div>
          <p class="text-sm font-medium text-gray-900">
            Besökta stationer
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            Besökta stationer utesluts ur lottningen.
            {{ visibleStations.filter(s => visitedSet.has(s.id)).length }} av {{ visibleStations.length }} besökta.
          </p>
        </div>

        <div v-for="line in visibleLines" :key="line">
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
      <div class="text-center">
        <NuxtLink to="/about" class="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Om appen &amp; datakällor
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
