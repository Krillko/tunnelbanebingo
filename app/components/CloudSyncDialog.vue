<script setup lang="ts">
const PROMPTED_KEY = 'tunnelbanebingo-cloud-prompted';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const { t } = useI18n();
const { signInWithGoogle, syncStatus, syncError } = useCloudSync();

const isSigningIn = computed(() => syncStatus.value === 'signing-in' || syncStatus.value === 'syncing');

function dismiss() {
  localStorage.setItem(PROMPTED_KEY, '1');
  emit('update:open', false);
}

async function handleGoogleSignIn() {
  await signInWithGoogle();
  if (syncStatus.value === 'synced') {
    localStorage.setItem(PROMPTED_KEY, '1');
    emit('update:open', false);
  }
}
</script>

<template>
  <UModal
    :open="props.open"
    :title="t('cloudDialog.title')"
    @update:open="(v) => { if (!v) dismiss(); }"
  >
    <template #body>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ t('cloudDialog.description') }}
      </p>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {{ t('cloudDialog.note') }}
      </p>
      <p v-if="syncError" class="text-xs text-red-500 mt-2">
        {{ syncError }}
      </p>
    </template>
    <template #footer>
      <div class="flex flex-col gap-2 w-full">
        <UButton
          block
          :loading="isSigningIn"
          :disabled="isSigningIn"
          leading-icon="i-logos-google-icon"
          @click="handleGoogleSignIn"
        >
          {{ t('cloudDialog.signIn') }}
        </UButton>
        <UButton
          block
          variant="ghost"
          color="neutral"
          :disabled="isSigningIn"
          @click="dismiss"
        >
          {{ t('cloudDialog.dismiss') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
