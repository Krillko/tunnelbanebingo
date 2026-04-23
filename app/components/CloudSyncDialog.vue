<script setup lang="ts">
const PROMPTED_KEY = 'tunnelbanebingo-cloud-prompted';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

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
    title="Stationen sparades!"
    @update:open="(v) => { if (!v) dismiss(); }"
  >
    <template #body>
      <p class="text-sm text-gray-600">
        Men bara lokalt i den här webbläsaren. Vill du synka till molnet så att dina stationer sparas mellan enheter?
      </p>
      <p class="text-xs text-gray-400 mt-2">
        Dina data lagras i din egna Google Drive. Inga externa servrar.
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
          Logga in med Google
        </UButton>
        <UButton
          block
          variant="ghost"
          color="neutral"
          :disabled="isSigningIn"
          @click="dismiss"
        >
          Nej tack, behåll lokalt
        </UButton>
      </div>
    </template>
  </UModal>
</template>
