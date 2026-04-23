<script setup lang="ts">
import { cityConfigs, getCityStations, getCityRoutes } from '~/data/cities';
import { createTravelTimeGraph } from '~/utils/travelTime';
import type { CityId } from '~/types/city';

const props = defineProps<{
  cityId: CityId;
}>();

const { t, locale, setLocale } = useI18n();
const colorMode = useColorMode();

const cityConfig = computed(() => cityConfigs[props.cityId]);
const cityStations = computed(() => getCityStations(props.cityId));
const cityRoutes = computed(() => getCityRoutes(props.cityId));

const lineColors = computed<Record<string, string>>(() =>
  Object.fromEntries(cityConfig.value.lines.map(l => [l.id, l.color]))
);

// Build city-specific travel-time graph (memoized per city change)
const travelTimesFromFn = computed(() =>
  createTravelTimeGraph(cityStations.value, cityRoutes.value)
);

const { visitedSet, toggle, markVisited } = useVisitedStations(props.cityId);
const { homeStationId, setHome } = useHomeStation(props.cityId);
const { hasOnboarded, markOnboarded } = useOnboarding(props.cityId);
const { tramsIncluded, setTramsIncluded } = useTramsIncluded(props.cityId);
const { vehicles } = useVehiclePositions();

const tramLineSet = computed(() => new Set(cityConfig.value.tramLineIds));

const eligibleStations = computed(() =>
  cityStations.value.filter(s =>
    !visitedSet.value.has(s.id) &&
    s.id !== homeStationId.value &&
    (tramsIncluded.value || !tramLineSet.value.has(s.line))
  )
);

const { animationState, currentHighlight, winner, animationTarget, startBingo, reset } =
  useBingoAnimation(eligibleStations, homeStationId, travelTimesFromFn.value);

const { venues, loading: venuesLoading, fetchVenues, clear: clearVenues } = useNearbyVenues();

watch(winner, (w) => {
  if (w) fetchVenues(w.lat, w.lng);
  else clearVenues();
});

type HomeSelectItem = { label: string; value: string };
const homeStationSelectItems = computed<HomeSelectItem[]>(() =>
  cityStations.value
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
    .map(s => ({ label: s.name, value: s.id }))
);

const selectedHomeStation = computed<HomeSelectItem | null>({
  get: () => homeStationSelectItems.value.find(i => i.value === homeStationId.value) ?? null,
  set: (item: HomeSelectItem | null) => setHome(item?.value ?? null),
});

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

const LINE_LABELS = computed<Record<string, string>>(() =>
  Object.fromEntries(cityConfig.value.lines.map(l => [l.id, t(l.nameKey)]))
);

const stationsByLine = computed(() => {
  const result: Record<string, typeof cityStations.value> = {};
  for (const line of cityConfig.value.lines) {
    result[line.id] = cityStations.value.filter(s => s.line === line.id);
  }
  return result;
});

const visibleLines = computed(() =>
  cityConfig.value.hasTramToggle && !tramsIncluded.value
    ? cityConfig.value.lines.filter(l => !tramLineSet.value.has(l.id))
    : cityConfig.value.lines
);

const visibleStations = computed(() =>
  cityStations.value.filter(s => !tramLineSet.value.has(s.line) || tramsIncluded.value)
);

const visitedCount = computed(() =>
  visibleStations.value.filter(s => visitedSet.value.has(s.id)).length
);

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

const lastSyncedText = computed(() => {
  if (!lastSyncedAt.value) return null;
  const loc = (locale.value === 'en') ? 'en-GB' : 'sv-SE';
  return lastSyncedAt.value.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
});

const colorModeIcon = computed(() => {
  if (colorMode.preference === 'dark') return 'i-heroicons-moon';
  if (colorMode.preference === 'light') return 'i-heroicons-sun';
  return colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun';
});

function cycleColorMode() {
  if (colorMode.preference === 'system') {
    colorMode.preference = 'light';
  } else if (colorMode.preference === 'light') {
    colorMode.preference = 'dark';
  } else {
    colorMode.preference = 'system';
  }
}

function toggleLocale() {
  setLocale(locale.value === 'sv' ? 'en' : 'sv');
}

const isDark = computed(() => colorMode.value === 'dark');

const cityTitle = computed(() => t(cityConfig.value.titleKey));
const citySubtitle = computed(() => t(cityConfig.value.subtitleKey));
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-950">
    <UModal
      v-model:open="showOnboarding"
      :title="t('onboarding.title')"
      :dismissible="false"
      :close="false"
    >
      <template #body>
        <div class="flex justify-end -mt-1 mb-3">
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            @click="toggleLocale"
          >
            {{ locale === 'sv' ? '🇸🇪' : '🇬🇧' }}
          </UButton>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ t('onboarding.intro') }}
        </p>
        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-5">
          {{ t('onboarding.homeStationTitle') }}
        </p>
        <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">
          {{ t('onboarding.description') }}
        </p>
        <USelectMenu
          v-model="dialogStation"
          :items="homeStationSelectItems"
          by="value"
          :placeholder="t('onboarding.stationPlaceholder')"
          class="mt-3 w-full"
        />
        <UCheckbox
          v-if="cityConfig.hasTramToggle"
          :model-value="tramsIncluded"
          :label="t('onboarding.includeRailways')"
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
            {{ t('onboarding.confirm') }}
          </UButton>
          <UButton
            block
            variant="ghost"
            color="neutral"
            @click="skipOnboarding"
          >
            {{ t('onboarding.skip') }}
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
              {{ t('app.signInGoogle') }}
            </UButton>
          </template>
        </div>
      </template>
    </UModal>
    <CloudSyncDialog v-if="cloudSyncAvailable" v-model:open="showCloudDialog" />

    <div class="flex-1 min-h-0 min-h-[50vh] md:min-h-0">
      <BingoMap
        :stations="cityStations"
        :routes="cityRoutes"
        :line-colors="lineColors"
        :tram-line-ids="cityConfig.tramLineIds"
        :center="cityConfig.center"
        :zoom="cityConfig.zoom"
        :highlighted-id="currentHighlight"
        :winner-id="winner?.id ?? null"
        :animation-target="animationTarget"
        :vehicles="vehicles"
        :trams-included="tramsIncluded"
        :dark-mode="isDark"
        @ready="mapReady = true"
      />
    </div>

    <div class="w-full md:w-72 flex-shrink-0 flex flex-col gap-4 p-6 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {{ cityTitle }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ citySubtitle }}
          </p>

          <!-- City switcher -->
          <div class="flex gap-1 mt-2">
            <NuxtLink
              to="/"
              class="text-xs px-2 py-0.5 rounded-full border transition-colors"
              :class="cityId === 'stockholm'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              Stockholm
            </NuxtLink>
            <NuxtLink
              to="/gothenburg"
              class="text-xs px-2 py-0.5 rounded-full border transition-colors"
              :class="cityId === 'gothenburg'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              Göteborg
            </NuxtLink>
          </div>

          <template v-if="cloudSyncAvailable">
            <div v-if="signedInEmail" class="flex items-center gap-1.5 mt-2">
              <span class="size-1.5 rounded-full bg-green-500 shrink-0" />
              <span class="text-xs text-gray-400 dark:text-gray-500 truncate">{{ signedInEmail }}</span>
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
              {{ t('app.signInGoogle') }}
            </UButton>
          </template>
        </div>
        <div class="flex items-center gap-0.5 shrink-0 pt-1">
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            class="font-medium"
            @click="toggleLocale"
          >
            {{ locale === 'sv' ? '🇸🇪' : '🇬🇧' }}
          </UButton>
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            :icon="colorModeIcon"
            @click="cycleColorMode"
          />
        </div>
      </div>

      <USeparator />

      <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="activeTab === 'bingo' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
          @click="activeTab = 'bingo'"
        >
          {{ t('tabs.bingo') }}
        </button>
        <button
          class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="activeTab === 'settings' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
          @click="activeTab = 'settings'"
        >
          {{ t('tabs.settings') }}
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
              {{ t('bingo.button') }}
            </UButton>
            <p v-if="!mapReady" class="text-xs text-gray-400 dark:text-gray-500 text-center">
              {{ t('bingo.loadingMap') }}
            </p>
            <p v-else-if="eligibleStations.length === 0" class="text-xs text-gray-400 dark:text-gray-500 text-center">
              {{ t('bingo.allVisited') }}
            </p>
          </div>

          <div
            v-else-if="animationState === 'spinning'"
            key="spinning"
            class="flex flex-col items-center gap-3 py-4"
          >
            <div class="text-4xl animate-bounce">🎲</div>
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
              {{ t('bingo.spinning') }}
            </p>
          </div>

          <div
            v-else-if="animationState === 'complete' && winner"
            key="complete"
            class="flex flex-col gap-3"
          >
            <div class="rounded-xl border-2 p-5 text-center" :style="{ borderColor: lineColors[winner.line] ?? '#888' }">
              <div class="text-5xl mb-3">🏆</div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {{ winner.name }}
              </h2>
              <span
                class="inline-block px-3 py-1 rounded-full text-white text-sm font-semibold"
                :style="{ backgroundColor: lineColors[winner.line] ?? '#888' }"
              >
                {{ LINE_LABELS[winner.line] ?? winner.line }}
              </span>

              <div v-if="venuesLoading || venues.length" class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                  {{ t('bingo.nearStation') }}
                </p>
                <div v-if="venuesLoading" class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <UIcon name="i-heroicons-arrow-path" class="animate-spin size-3 shrink-0" />
                  {{ t('bingo.searchingPlaces') }}
                </div>
                <div v-else class="flex flex-col gap-1.5">
                  <a
                    v-for="venue in venues"
                    :key="venue.id"
                    :href="venue.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-between gap-2 text-sm rounded-md px-2 py-1 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span class="truncate text-gray-800 dark:text-gray-200">{{ venue.name }}</span>
                    <span class="shrink-0 text-xs text-gray-400 dark:text-gray-500">{{ venue.distanceM }} m</span>
                  </a>
                  <p v-if="venues.length" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {{ t('bingo.disclaimer') }}
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
              {{ t('bingo.markVisited') }}
            </UButton>
            <p v-else class="text-xs text-center text-gray-400 dark:text-gray-500">
              {{ t('bingo.markedVisited') }}
            </p>

            <UButton
              variant="outline"
              block
              @click="handleReset"
            >
              {{ t('bingo.playAgain') }}
            </UButton>
          </div>
        </Transition>
      </div>

      <!-- Settings tab -->
      <div v-else class="flex flex-col gap-5">
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ t('settings.homeStation') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('settings.homeStationHint') }}
          </p>
          <USelectMenu
            v-model="selectedHomeStation"
            :items="homeStationSelectItems"
            by="value"
            :clear="true"
            :placeholder="t('settings.homeStationPlaceholder')"
            class="mt-2 w-full"
          />
        </div>

        <USeparator />

        <!-- Cloud sync section -->
        <template v-if="cloudSyncAvailable">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ t('settings.cloudSync') }}
            </p>

            <template v-if="!signedInEmail">
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ t('settings.cloudSyncHint') }}
              </p>
              <UButton
                size="sm"
                variant="outline"
                leading-icon="i-logos-google-icon"
                class="mt-2"
                :loading="syncStatus === 'signing-in' || syncStatus === 'syncing'"
                @click="signInWithGoogle"
              >
                {{ t('settings.signInGoogle') }}
              </UButton>
              <p v-if="syncError" class="text-xs text-red-500 mt-1.5">
                {{ syncError }}
              </p>
            </template>

            <template v-else-if="syncStatus === 'syncing'">
              <div class="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin size-3 shrink-0" />
                {{ t('settings.syncing') }}
              </div>
            </template>

            <template v-else>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {{ signedInEmail }}
              </p>
              <p v-if="lastSyncedText" class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {{ t('settings.lastSynced', { time: lastSyncedText }) }}
              </p>
              <p v-if="syncError" class="text-xs text-red-500 mt-0.5">
                {{ syncError }}
              </p>
              <div class="flex gap-2 mt-2">
                <UButton
                  size="xs"
                  variant="outline"
                  @click="syncNow"
                >
                  {{ t('settings.syncNow') }}
                </UButton>
                <UButton
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  @click="signOut"
                >
                  {{ t('settings.signOut') }}
                </UButton>
              </div>
            </template>
          </div>

          <USeparator />
        </template>

        <!-- Tram toggle (Stockholm only) -->
        <template v-if="cityConfig.hasTramToggle">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ t('settings.railways') }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ t('settings.railwaysHint') }}
            </p>
            <UCheckbox
              :model-value="tramsIncluded"
              :label="t('settings.includeRailways')"
              class="mt-2"
              @update:model-value="setTramsIncluded"
            />
          </div>

          <USeparator />
        </template>

        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ t('settings.visitedStations') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('settings.visitedHint') }}
            {{ t('settings.visitedCount', { visited: visitedCount, total: visibleStations.length }) }}
          </p>
        </div>

        <div v-for="line in visibleLines" :key="line.id">
          <div class="flex items-center gap-1.5 mb-2">
            <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: line.color }" />
            <span class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{{ LINE_LABELS[line.id] }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto">
              {{ (stationsByLine[line.id] ?? []).filter(s => visitedSet.has(s.id)).length }}/{{ (stationsByLine[line.id] ?? []).length }}
            </span>
          </div>
          <div
            v-for="station in (stationsByLine[line.id] ?? [])"
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
          v-for="line in cityConfig.lines"
          :key="line.id"
          class="flex items-center gap-1.5"
        >
          <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: line.color }" />
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ LINE_LABELS[line.id] }}</span>
        </div>
      </div>
      <div class="text-center">
        <NuxtLink to="/about" class="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {{ t('footer.about') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
