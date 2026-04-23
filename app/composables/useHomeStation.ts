const STORAGE_KEY = 'tunnelbanebingo-home';

function loadFromStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useHomeStation() {
  const homeStationId = ref<string | null>(loadFromStorage());

  function setHome(id: string | null): void {
    homeStationId.value = id;
    if (id === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, id);
    }
  }

  return { homeStationId: readonly(homeStationId), setHome };
}
