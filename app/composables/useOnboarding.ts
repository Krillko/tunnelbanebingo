const LEGACY_KEY = 'tunnelbanebingo-onboarded';

function storageKey(cityId: string) {
  return `tunnelbanebingo-onboarded-${cityId}`;
}

export function useOnboarding(cityId = 'stockholm') {
  function checkStorage(): boolean {
    if (localStorage.getItem(storageKey(cityId))) return true;
    // Migrate Stockholm from legacy keyless storage
    if (cityId === 'stockholm' && localStorage.getItem(LEGACY_KEY)) return true;
    return false;
  }

  const hasOnboarded = ref<boolean>(checkStorage());

  function markOnboarded(): void {
    localStorage.setItem(storageKey(cityId), '1');
    hasOnboarded.value = true;
  }

  return { hasOnboarded: readonly(hasOnboarded), markOnboarded };
}
