<script setup lang="ts">
import { getCityBySlug } from '~/data/cities';
import type { CityId } from '~/types/city';

const route = useRoute();
const slug = route.params.city as string;
const cityConfig = getCityBySlug(slug);

if (!cityConfig) {
  await navigateTo('/');
}
</script>

<template>
  <BingoGame v-if="cityConfig" :city-id="(cityConfig.id as CityId)" />
</template>
