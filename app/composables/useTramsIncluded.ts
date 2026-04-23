const STORAGE_KEY = 'tunnelbanebingo-trams-included';

const stored = localStorage.getItem(STORAGE_KEY);
const _tramsIncluded = ref<boolean>(stored === null ? true : stored === '1');

export function useTramsIncluded() {
  function setTramsIncluded(value: boolean): void {
    _tramsIncluded.value = value;
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  }

  return { tramsIncluded: readonly(_tramsIncluded), setTramsIncluded };
}
