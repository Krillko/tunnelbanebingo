const STORAGE_KEY = 'tunnelbanebingo-onboarded';

export function useOnboarding() {
  const hasOnboarded = ref<boolean>(!!localStorage.getItem(STORAGE_KEY));

  function markOnboarded(): void {
    localStorage.setItem(STORAGE_KEY, '1');
    hasOnboarded.value = true;
  }

  return { hasOnboarded: readonly(hasOnboarded), markOnboarded };
}
