<script setup lang="ts">
import L from 'leaflet';
import type { Station } from '~/types/station';
import type { Vehicle } from '~/composables/useVehiclePositions';
import type { Route } from '~/data/routes';

const props = defineProps<{
  stations: Station[];
  routes: Route[];
  lineColors: Record<string, string>;
  tramLineIds: string[];
  center: [number, number];
  zoom: number;
  highlightedId: string | null;
  winnerId: string | null;
  animationTarget: { lat: number; lng: number } | null;
  vehicles: Vehicle[];
  tramsIncluded: boolean;
  darkMode: boolean;
  visitedIds: Set<string>;
}>();

const emit = defineEmits<{
  ready: [];
  toggleVisited: [id: string];
}>();

const { t } = useI18n();

function normalStyle(line: string): L.CircleMarkerOptions {
  return { radius: 6, fillColor: props.lineColors[line] ?? '#888', color: '#fff', weight: 2, fillOpacity: 0.9, interactive: true };
}

function winnerStyle(line: string): L.CircleMarkerOptions {
  return { radius: 14, fillColor: props.lineColors[line] ?? '#888', color: '#FFD700', weight: 4, fillOpacity: 1, interactive: true };
}

const vehicleStyle: L.CircleMarkerOptions = {
  radius: 4,
  fillColor: '#1F2937',
  color: '#fff',
  weight: 1.5,
  fillOpacity: 0.9,
  interactive: false,
};

function buildStationPopup(station: Station, marker: L.CircleMarker): HTMLElement {
  const wrapper = document.createElement('div');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'station-popup-btn';
  btn.textContent = props.visitedIds.has(station.id) ? t('map.unmarkVisited') : t('map.markVisited');
  btn.addEventListener('click', () => {
    emit('toggleVisited', station.id);
    marker.closePopup();
  });
  wrapper.appendChild(btn);
  return wrapper;
}

function checkmarkIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: '<div style="width:12px;height:12px;border-radius:50%;background:#16a34a;border:1.5px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>',
    iconSize: [12, 12],
    iconAnchor: [-2, 14],
  });
}

const TILE_URL_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_URL_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

const mapEl = useTemplateRef<HTMLDivElement>('mapEl');
let map: L.Map;
let tileLayer: L.TileLayer | null = null;
const markerMap = new Map<string, L.CircleMarker>();
const vehicleMarkers = new Map<string, L.CircleMarker>();
const checkmarkMarkers = new Map<string, L.Marker>();
const tramPolylines: L.Polyline[] = [];

const tramLineSet = computed(() => new Set(props.tramLineIds));

onMounted(async() => {
  await nextTick();
  if (!mapEl.value) return;
  map = L.map(mapEl.value, {
    center: props.center,
    zoom: props.zoom,
    zoomControl: true,
  });

  tileLayer = L.tileLayer(props.darkMode ? TILE_URL_DARK : TILE_URL_LIGHT, {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  const stationById = new Map(props.stations.map(s => [s.id, s]));
  props.routes.forEach(route => {
    const coords = route.stationIds
      .map(id => stationById.get(id))
      .filter((s): s is Station => !!s)
      .map(s => [s.lat, s.lng] as [number, number]);
    if (coords.length >= 2) {
      const color = props.lineColors[route.line] ?? '#888';
      const polyline = L.polyline(coords, {
        color,
        weight: 4,
        opacity: 0.65,
        interactive: false,
      });
      if (tramLineSet.value.has(route.line)) {
        tramPolylines.push(polyline);
        if (props.tramsIncluded) polyline.addTo(map);
      } else {
        polyline.addTo(map);
      }
    }
  });

  props.stations.forEach(station => {
    const marker = L.circleMarker([station.lat, station.lng], normalStyle(station.line));
    marker.bindTooltip(station.name, { permanent: false, direction: 'top', offset: [0, -8] });
    marker.bindPopup(() => buildStationPopup(station, marker), { closeButton: false, offset: [0, -4] });
    markerMap.set(station.id, marker);
    if (!tramLineSet.value.has(station.line) || props.tramsIncluded) {
      marker.addTo(map);
    }
  });

  props.stations.forEach(station => {
    if (props.visitedIds.has(station.id) && (!tramLineSet.value.has(station.line) || props.tramsIncluded)) {
      addCheckmark(station);
    }
  });

  emit('ready');
});

function addCheckmark(station: Station) {
  if (checkmarkMarkers.has(station.id)) return;
  const marker = L.marker([station.lat, station.lng], { icon: checkmarkIcon(), interactive: false });
  marker.addTo(map);
  checkmarkMarkers.set(station.id, marker);
}

function removeCheckmark(id: string) {
  checkmarkMarkers.get(id)?.remove();
  checkmarkMarkers.delete(id);
}

watch(() => props.visitedIds, (newSet, oldSet) => {
  if (!map) return;
  const stationById = new Map(props.stations.map(s => [s.id, s]));
  newSet.forEach(id => {
    if (oldSet?.has(id)) return;
    const station = stationById.get(id);
    if (station && (!tramLineSet.value.has(station.line) || props.tramsIncluded)) {
      addCheckmark(station);
    }
  });
  oldSet?.forEach(id => {
    if (!newSet.has(id)) removeCheckmark(id);
  });
});

watch(() => props.darkMode, (dark) => {
  tileLayer?.setUrl(dark ? TILE_URL_DARK : TILE_URL_LIGHT);
});

watch(() => props.tramsIncluded, (included) => {
  if (!map) return;
  props.stations.filter(s => tramLineSet.value.has(s.line)).forEach(s => {
    const marker = markerMap.get(s.id);
    if (!marker) return;
    if (included) marker.addTo(map);
    else marker.remove();

    if (props.visitedIds.has(s.id)) {
      if (included) addCheckmark(s);
      else removeCheckmark(s.id);
    }
  });
  tramPolylines.forEach(poly => {
    if (included) poly.addTo(map);
    else poly.remove();
  });
});

onUnmounted(() => {
  checkmarkMarkers.clear();
  map?.remove();
});

watch(() => props.vehicles, (newVehicles) => {
  if (!map) return;

  const seen = new Set<string>();

  newVehicles.forEach(v => {
    seen.add(v.id);
    const existing = vehicleMarkers.get(v.id);
    if (existing) {
      existing.setLatLng([v.lat, v.lng]);
    } else {
      const m = L.circleMarker([v.lat, v.lng], vehicleStyle).addTo(map);
      vehicleMarkers.set(v.id, m);
    }
  });

  vehicleMarkers.forEach((marker, id) => {
    if (!seen.has(id)) {
      marker.remove();
      vehicleMarkers.delete(id);
    }
  });
});

watch(() => props.highlightedId, (newId, oldId) => {
  if (oldId && oldId !== props.winnerId) {
    const el = markerMap.get(oldId)?.getElement();
    const s = props.stations.find(st => st.id === oldId);
    if (el && s) {
      const ns = normalStyle(s.line);
      el.setAttribute('r', String(ns.radius));
      el.setAttribute('fill', ns.fillColor!);
      el.setAttribute('stroke', ns.color!);
      el.setAttribute('stroke-width', String(ns.weight));
      el.setAttribute('fill-opacity', String(ns.fillOpacity));
    }
  }
  if (newId) {
    const el = markerMap.get(newId)?.getElement();
    if (el) {
      el.setAttribute('r', '11');
      el.setAttribute('fill', '#FFD700');
      el.setAttribute('stroke', '#fff');
      el.setAttribute('stroke-width', '3');
      el.setAttribute('fill-opacity', '1');
    }
  }
});

watch(() => props.animationTarget, (target) => {
  if (target) {
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
    map.flyTo(props.center, props.zoom, { duration: 1 });
  }
});
</script>

<template>
  <div
    ref="mapEl"
    class="w-full h-full"
    style="will-change: transform;" />
</template>

<style scoped>
:deep(.leaflet-popup-content-wrapper) {
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.leaflet-popup-content) {
  margin: 0;
}

:deep(.station-popup-btn) {
  display: block;
  width: 100%;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  color: #111827;
}

:deep(.station-popup-btn:hover) {
  background: #f3f4f6;
}
</style>
