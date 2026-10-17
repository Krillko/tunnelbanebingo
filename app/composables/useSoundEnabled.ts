const STORAGE_KEY = 'tunnelbanebingo-sound-enabled';

function loadFromStorage(): boolean {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data !== null) return data === '1';
  return true;
}

let _soundEnabled: Ref<boolean> | null = null;

export function useSoundEnabled() {
  if (!_soundEnabled) _soundEnabled = ref(loadFromStorage());
  const soundEnabled = _soundEnabled;

  function setSoundEnabled(value: boolean): void {
    soundEnabled.value = value;
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  }

  return { soundEnabled: readonly(soundEnabled), setSoundEnabled };
}
