// "Install as app" support, which looks completely different per platform:
//
// - Chrome/Edge fire `beforeinstallprompt`, which we stash and replay from a
//   button click. That is the only way to show the real install dialog.
// - iOS Safari has no API at all. The only route is Share → Add to Home Screen,
//   so all we can do is detect iOS and show the steps.
//
// Either way the whole section disappears once the app already runs standalone.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  // `navigator.standalone` is the iOS-only flag; the media query covers the rest.
  return window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function detectIos(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  // iPadOS 13+ claims to be a Mac, so a touch-capable "Macintosh" counts too.
  return /iPhone|iPad|iPod/.test(ua)
    || (/Macintosh/.test(ua) && window.navigator.maxTouchPoints > 1);
}

let _deferredPrompt: Ref<BeforeInstallPromptEvent | null> | null = null;
let _isStandalone: Ref<boolean> | null = null;

function init() {
  _deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
  _isStandalone = ref(detectStandalone());

  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (event) => {
    // Suppress Chrome's own mini-infobar so the button in Settings is the
    // single place this happens.
    event.preventDefault();
    _deferredPrompt!.value = event as BeforeInstallPromptEvent;
  });

  window.addEventListener('appinstalled', () => {
    _deferredPrompt!.value = null;
  });

  window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
    _isStandalone!.value = e.matches;
  });
}

export function useInstallApp() {
  if (!_deferredPrompt || !_isStandalone) init();

  const deferredPrompt = _deferredPrompt!;
  const isStandalone = _isStandalone!;
  const isIos = detectIos();

  const canPrompt = computed(() => deferredPrompt.value !== null);
  // Something to show: either a working install button or the iOS walkthrough.
  const canInstall = computed(() => !isStandalone.value && (canPrompt.value || isIos));

  async function install(): Promise<boolean> {
    const event = deferredPrompt.value;
    if (!event) return false;
    await event.prompt();
    const { outcome } = await event.userChoice;
    // The event is single-use — Chrome re-fires it later if the user declined.
    deferredPrompt.value = null;
    return outcome === 'accepted';
  }

  return {
    isStandalone: readonly(isStandalone),
    isIos,
    canPrompt,
    canInstall,
    install,
  };
}
