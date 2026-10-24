<script setup lang="ts">
// The service worker precaches the app shell, which means a deployed update
// does not reach anyone until the waiting worker takes over. Rather than
// swapping the app out mid-game, ask — `registerType: 'prompt'` in
// nuxt.config.ts is what leaves the new worker waiting for this.
const { t } = useI18n();
const { $pwa } = useNuxtApp();

function reload() {
  $pwa?.updateServiceWorker(true);
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="$pwa?.needRefresh"
      class="fixed inset-x-0 bottom-4 z-[2000] flex justify-center px-4 pointer-events-none"
    >
      <div class="pointer-events-auto flex items-center gap-3 rounded-lg bg-white dark:bg-gray-900 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-3">
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ t('pwa.updateAvailable') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('pwa.updateHint') }}
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UButton size="xs" @click="reload">
            {{ t('pwa.reload') }}
          </UButton>
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            @click="$pwa?.cancelPrompt()"
          >
            {{ t('pwa.later') }}
          </UButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
