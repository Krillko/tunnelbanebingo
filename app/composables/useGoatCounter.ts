declare global {
  interface Window {
    goatcounter?: {
      count: (opts: { path: string; title?: string; event?: boolean }) => void
    }
  }
}

export function useGoatCounter() {
  useScript(
    {
      src: 'https://gc.zgo.at/count.js',
      'data-goatcounter': 'https://tunnelbanebingo.goatcounter.com/count',
    },
    { defer: true }
  );

  function trackEvent(path: string, title?: string) {
    window.goatcounter?.count({ path, title, event: true });
  }

  return { trackEvent };
}
