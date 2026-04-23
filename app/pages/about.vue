<script setup lang="ts">
const { t, locale, setLocale } = useI18n();
const colorMode = useColorMode();

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
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center py-12 px-6">
    <div class="w-full max-w-lg">
      <div class="flex items-center justify-between mb-8">
        <NuxtLink to="/" class="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {{ t('about.back') }}
        </NuxtLink>
        <div class="flex items-center gap-0.5">
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

      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {{ t('about.title') }}
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
        {{ t('about.intro') }}
      </p>

      <div class="flex flex-col gap-8">
        <section>
          <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">
            {{ t('about.dataSources') }}
          </h2>
          <ul class="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ t('about.stationData') }}</span><br>
              <i18n-t keypath="about.stationDataText" tag="span">
                <template #osm>
                  <a
                    href="https://www.openstreetmap.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline"
                  >OpenStreetMap</a>
                </template>
              </i18n-t>
            </li>
            <li>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ t('about.mapTiles') }}</span><br>
              <i18n-t keypath="about.mapTilesText" tag="span">
                <template #carto>
                  <a
                    href="https://carto.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline"
                  >CARTO</a>
                </template>
                <template #osm>
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline"
                  >OpenStreetMap</a>
                </template>
                <template #leaflet>
                  <a
                    href="https://leafletjs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline"
                  >Leaflet</a>
                </template>
              </i18n-t>
            </li>
            <li>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ t('about.venues') }}</span><br>
              <i18n-t keypath="about.venuesText" tag="span">
                <template #osm>
                  <a
                    href="https://www.openstreetmap.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline"
                  >OpenStreetMap</a>
                </template>
                <template #overpass>
                  <a
                    href="https://overpass-api.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline"
                  >Overpass API</a>
                </template>
              </i18n-t>
            </li>
          </ul>
        </section>

        <USeparator />

        <section>
          <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">
            {{ t('about.openSource') }}
          </h2>
          <i18n-t
            keypath="about.openSourceText"
            tag="p"
            class="text-sm text-gray-600 dark:text-gray-400">
            <template #github>
              <a
                href="https://github.com/Krillko/tunnelbanebingo"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline"
              >GitHub</a>
            </template>
          </i18n-t>
        </section>
      </div>
    </div>
  </div>
</template>
