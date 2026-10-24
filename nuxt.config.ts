// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
  },
  runtimeConfig: {
    trafiklabApiKey: process.env.TRAFIKLAB_API_KEY ?? '',
    public: {
      trafiklabEnabled: !!process.env.TRAFIKLAB_API_KEY,
      googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
    },
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/i18n', '@nuxt/scripts', '@vite-pwa/nuxt'],
  i18n: {
    defaultLocale: 'sv',
    locales: [
      { code: 'sv', name: 'Svenska' },
      { code: 'en', name: 'English' },
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: 'sv',
      redirectOn: 'no prefix',
    },
    vueI18n: 'i18n.config.ts',
  },
  ssr: false,
  pwa: {
    // 'prompt' instead of 'autoUpdate': a cached shell on GitHub Pages would
    // otherwise swap under the user mid-spin. PwaUpdatePrompt asks first.
    registerType: 'prompt',
    manifest: {
      name: 'Tunnelbanebingo',
      // iOS truncates the home-screen label at ~12 characters.
      short_name: 'T-bingo',
      description: 'Slumpa fram en station du inte besökt än.',
      lang: 'sv',
      // Relative to the manifest itself, so this survives the /tunnelbanebingo/
      // base URL on GitHub Pages without being hardcoded to it.
      id: './',
      start_url: './',
      scope: './',
      display: 'standalone',
      background_color: '#f9fafb',
      theme_color: '#f9fafb',
      icons: [
        { src: 'favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      // @vite-pwa/nuxt strips .html from precache URLs (200.html becomes
      // /200), which GitHub Pages answers with a 404 — and a single failed
      // precache request aborts the whole install, leaving no offline mode at
      // all. The SPA shell plus navigateFallback covers these routes anyway.
      globIgnores: ['**/{200,404}.html', 'about/index.html'],
      // The station, track and venue data is bundled into the JS, and maplibre
      // is large — the 2 MiB default would silently skip the main chunks.
      maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      runtimeCaching: [
        {
          // Vector tiles are immutable per planet build, so cache-first with a
          // cap: whatever stretch of town you have looked at stays available.
          urlPattern: /^https:\/\/tiles\.openfreemap\.org\/.*\.pbf$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'openfreemap-tiles',
            expiration: { maxEntries: 800, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Style JSON, sprites and glyphs: small, few, and they do change.
          urlPattern: /^https:\/\/tiles\.openfreemap\.org\//i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'openfreemap-style',
            expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    devOptions: {
      // Off by default: a service worker in front of the Vite dev server makes
      // HMR confusing, so `npm run dev` serves no worker and no manifest —
      // which also means the install button stays hidden there. Run
      // `PWA_DEV=1 npm run dev` to work on the worker or the install flow.
      enabled: !!process.env.PWA_DEV,
      suppressWarnings: true,
      type: 'module',
    },
  },
  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css', 'maplibre-gl/dist/maplibre-gl.css'],
  devServer: {
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
    port: 3011,
  },
  vite: {
    optimizeDeps: {
      include: ['canvas-confetti', 'leaflet'],
    },
  },
});
