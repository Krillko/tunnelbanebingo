const STORAGE_KEY = 'tunnelbanebingo-visited';

function loadFromStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function useVisitedStations() {
  const visitedIds = ref<string[]>(loadFromStorage());
  const visitedSet = computed(() => new Set(visitedIds.value));

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedIds.value));
  }

  function toggle(id: string) {
    const next = new Set(visitedIds.value);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    visitedIds.value = [...next];
    persist();
  }

  function markVisited(id: string) {
    if (visitedSet.value.has(id)) return;
    visitedIds.value = [...visitedIds.value, id];
    persist();
  }

  return { visitedSet, toggle, markVisited };
}
