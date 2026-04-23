const LEGACY_KEY = 'tunnelbanebingo-home';

function storageKey(cityId: string) {
  return `tunnelbanebingo-home-${cityId}`;
}

function loadFromStorage(cityId: string): string | null {
  const key = storageKey(cityId);
  const data = localStorage.getItem(key);
  if (data !== null) return data;
  // Migrate Stockholm from legacy keyless storage
  if (cityId === 'stockholm') {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      localStorage.setItem(key, legacy);
      return legacy;
    }
  }
  return null;
}

const _homeByCity = new Map<string, Ref<string | null>>();

function getCityRef(cityId: string): Ref<string | null> {
  if (!_homeByCity.has(cityId)) {
    _homeByCity.set(cityId, ref(loadFromStorage(cityId)));
  }
  return _homeByCity.get(cityId)!;
}

export function useHomeStation(cityId = 'stockholm') {
  const _homeStationId = getCityRef(cityId);

  function setHome(id: string | null): void {
    _homeStationId.value = id;
    if (id === null) {
      localStorage.removeItem(storageKey(cityId));
    } else {
      localStorage.setItem(storageKey(cityId), id);
    }
  }

  return { homeStationId: readonly(_homeStationId), setHome };
}
