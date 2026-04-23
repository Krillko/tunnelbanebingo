const LEGACY_KEY = 'tunnelbanebingo-trams-included';

function storageKey(cityId: string) {
  return `tunnelbanebingo-trams-included-${cityId}`;
}

function loadFromStorage(cityId: string): boolean {
  const key = storageKey(cityId);
  const data = localStorage.getItem(key);
  if (data !== null) return data === '1';
  // Migrate Stockholm from legacy keyless storage
  if (cityId === 'stockholm') {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy !== null) {
      localStorage.setItem(key, legacy);
      return legacy === '1';
    }
  }
  return true;
}

const _tramsByCity = new Map<string, Ref<boolean>>();

function getCityRef(cityId: string): Ref<boolean> {
  if (!_tramsByCity.has(cityId)) {
    _tramsByCity.set(cityId, ref(loadFromStorage(cityId)));
  }
  return _tramsByCity.get(cityId)!;
}

export function useTramsIncluded(cityId = 'stockholm') {
  const _tramsIncluded = getCityRef(cityId);

  function setTramsIncluded(value: boolean): void {
    _tramsIncluded.value = value;
    localStorage.setItem(storageKey(cityId), value ? '1' : '0');
  }

  return { tramsIncluded: readonly(_tramsIncluded), setTramsIncluded };
}
