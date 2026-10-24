<script setup lang="ts">
const { app } = useRuntimeConfig();

// GitHub Pages serves the site from /tunnelbanebingo/, so anything in public/
// has to be addressed through the configured base URL or it 404s in production.
const asset = (path: string) => `${app.baseURL}${path}`.replace(/\/{2,}/g, '/');

useSeoMeta({
  ogType: 'website',
});

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: asset('favicon/favicon.ico') },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: asset('favicon/favicon-32x32.png') },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: asset('favicon/favicon-16x16.png') },
    { rel: 'apple-touch-icon', sizes: '180x180', href: asset('favicon/apple-touch-icon.png') },
    { rel: 'manifest', href: asset('manifest.webmanifest') },
  ],
  meta: [
    // iOS has no install prompt: these are what turn an "Add to Home Screen"
    // bookmark into a standalone, chrome-less app window.
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'T-bingo' },
    { name: 'theme-color', content: '#f9fafb', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#030712', media: '(prefers-color-scheme: dark)' },
  ],
});
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
