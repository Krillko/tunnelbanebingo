const STORAGE_KEY = 'tunnelbanebingo-home';

const _homeStationId = ref<string | null>(localStorage.getItem(STORAGE_KEY));

export function useHomeStation() {
  function setHome(id: string | null): void {
    _homeStationId.value = id;
    if (id === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, id);
    }
  }

  return { homeStationId: readonly(_homeStationId), setHome };
}
