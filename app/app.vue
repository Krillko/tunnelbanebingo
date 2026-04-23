<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: 'TunnelbaneBingo',
  description: () => t('meta.description'),
  ogTitle: 'TunnelbaneBingo',
  ogDescription: () => t('meta.description'),
  ogType: 'website',
});
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
