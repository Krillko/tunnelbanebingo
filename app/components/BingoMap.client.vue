<script setup lang="ts">
import L from 'leaflet';
import type { Station, TbanaLine } from '~/types/station';
import { routes } from '~/data/routes';

const props = defineProps<{
  stations: Station[];
  highlightedId: string | null;
  winnerId: string | null;
  animationTarget: { lat: number; lng: number } | null;
}>();

const emit = defineEmits<{
  ready: [];
}>();

const LINE_COLORS: Record<TbanaLine, string> = {
  red: '#E4000F',
  green: '#00873E',
  blue: '#005DA0',
  tvarbanan: '#E07B39',
  'sparvag-city': '#8B5CF6',
};

function normalStyle(line: TbanaLine): L.CircleMarkerOptions {
  return { radius: 6, fillColor: LINE_COLORS[line], color: '#fff', weight: 2, fillOpacity: 0.9, interactive: true };
}

function highlightStyle(): L.CircleMarkerOptions {
  return { radius: 11, fillColor: '#FFD700', color: '#fff', weight: 3, fillOpacity: 1, interactive: true };
}

function winnerStyle(line: TbanaLine): L.CircleMarkerOptions {
  return { radius: 14, fillColor: LINE_COLORS[line], color: '#FFD700', weight: 4, fillOpacity: 1, interactive: true };
}

const mapEl = useTemplateRef<HTMLDivElement>('mapEl');
let map: L.Map;
const markerMap = new Map<string, L.CircleMarker>();

onMounted(async() => {
  await nextTick();
  if (!mapEl.value) return;
  map = L.map(mapEl.value, {
    center: [59.332, 18.065],
    zoom: 11,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  const stationById = new Map(props.stations.map(s => [s.id, s]));
  routes.forEach(route => {
    const coords = route.stationIds
      .map(id => stationById.get(id))
      .filter((s): s is Station => !!s)
      .map(s => [s.lat, s.lng] as [number, number]);
    if (coords.length >= 2) {
      L.polyline(coords, {
        color: LINE_COLORS[route.line],
        weight: 4,
        opacity: 0.65,
        interactive: false,
      }).addTo(map);
    }
  });

  props.stations.forEach(station => {
    const marker = L.circleMarker([station.lat, station.lng], normalStyle(station.line));
    marker.bindTooltip(station.name, { permanent: false, direction: 'top', offset: [0, -8] });
    marker.addTo(map);
    markerMap.set(station.id, marker);
  });

  emit('ready');
});

onUnmounted(() => {
  map?.remove();
});

watch(() => props.highlightedId, (newId, oldId) => {
  if (oldId && oldId !== props.winnerId) {
    const s = props.stations.find(st => st.id === oldId);
    if (s) markerMap.get(oldId)?.setStyle(normalStyle(s.line));
  }
  if (newId) {
    markerMap.get(newId)?.setStyle(highlightStyle());
  }
});

watch(() => props.animationTarget, (target) => {
  if (target) {
    // Slowly zoom toward the winner while the animation runs — "not all the way"
    map.flyTo([target.lat, target.lng], 12, { duration: 4, easeLinearity: 0.5 });
  }
});

watch(() => props.winnerId, (newId, oldId) => {
  if (oldId) {
    const s = props.stations.find(st => st.id === oldId);
    if (s) markerMap.get(oldId)?.setStyle(normalStyle(s.line));
  }
  if (newId) {
    const s = props.stations.find(st => st.id === newId);
    if (s) {
      markerMap.get(newId)?.setStyle(winnerStyle(s.line));
      map.flyTo([s.lat, s.lng], 14, { duration: 1.2 });
    }
  } else {
    map.flyTo([59.332, 18.065], 11, { duration: 1 });
  }
});
</script>

<template>
  <div ref="mapEl" class="w-full h-full" />
</template>
