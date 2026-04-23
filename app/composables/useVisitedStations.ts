const STORAGE_KEY = 'tunnelbanebingo-visited';

function loadFromStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

const _visitedIds = ref<string[]>(loadFromStorage());
const visitedSet = computed(() => new Set(_visitedIds.value));

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(_visitedIds.value));
}

export function useVisitedStations() {
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
