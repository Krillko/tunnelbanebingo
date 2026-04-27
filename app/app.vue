<script setup lang="ts">
useSeoMeta({
  ogType: 'website',
});

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
  ],
});
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
