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
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/i18n', '@nuxt/scripts'],
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
  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css'],
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
