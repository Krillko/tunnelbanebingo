const LEGACY_KEY = 'tunnelbanebingo-visited';

function storageKey(cityId: string) {
  return `tunnelbanebingo-visited-${cityId}`;
}

function loadFromStorage(cityId: string): string[] {
  try {
    const key = storageKey(cityId);
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data) as string[];
    // Migrate Stockholm from legacy keyless storage
    if (cityId === 'stockholm') {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        localStorage.setItem(key, legacy);
        return JSON.parse(legacy) as string[];
      }
    }
    return [];
  } catch {
    return [];
  }
}

const _visitedByCity = new Map<string, Ref<string[]>>();

function getCityRef(cityId: string): Ref<string[]> {
  if (!_visitedByCity.has(cityId)) {
    _visitedByCity.set(cityId, ref(loadFromStorage(cityId)));
  }
  return _visitedByCity.get(cityId)!;
}

export function useVisitedStations(cityId = 'stockholm') {
  const _visitedIds = getCityRef(cityId);
  const visitedSet = computed(() => new Set(_visitedIds.value));

  function persist() {
    localStorage.setItem(storageKey(cityId), JSON.stringify(_visitedIds.value));
  }

  function toggle(id: string) {
    const next = new Set(_visitedIds.value);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    _visitedIds.value = [...next];
    persist();
  }

  function markVisited(id: string) {
    if (visitedSet.value.has(id)) return;
    _visitedIds.value = [..._visitedIds.value, id];
    persist();
  }

  return { visitedSet, toggle, markVisited };
}
