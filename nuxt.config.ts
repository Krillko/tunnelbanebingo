// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
  },
  runtimeConfig: {
    trafiklabApiKey: process.env.TRAFIKLAB_API_KEY ?? '',
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
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
