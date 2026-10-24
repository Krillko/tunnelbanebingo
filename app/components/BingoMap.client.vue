<script setup lang="ts">
import L from 'leaflet';
import '@maplibre/maplibre-gl-leaflet';
// Adds the `offset` polyline option, applied in screen pixels and recomputed
// on zoom. Baking the offset into the coordinates instead would make the lanes
// invisible at city zoom (8 m is a third of a pixel at z12).
import 'leaflet-polylineoffset';
import type { Station } from '~/types/station';
import type { Vehicle } from '~/composables/useVehiclePositions';
import type { Route } from '~/data/routes';
import type { TrackCorridor } from '~/types/track';

const props = defineProps<{
  stations: Station[];
  routes: Route[];
  tracks: TrackCorridor[];
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

// Trains on a cancelled or added trip are the only ones the feed names a line
// for, so most dots fall back to neutral dark grey.
function vehicleStyle(line: Vehicle['line']): L.CircleMarkerOptions {
  return {
    radius: 4,
    fillColor: (line && props.lineColors[line]) || '#1F2937',
    color: '#fff',
    weight: 1.5,
    fillOpacity: 0.9,
    interactive: false,
  };
}

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

const STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/positron';
const STYLE_DARK = 'https://tiles.openfreemap.org/styles/dark';

const mapEl = useTemplateRef<HTMLDivElement>('mapEl');
let map: L.Map;
let glLayer: L.MaplibreGL | null = null;
const markerMap = new Map<string, L.CircleMarker>();
// A poll hands us a train's position every 15 s, and Leaflet would snap the
// dot straight to it. Keeping the previous position lets each dot glide to the
// new one instead, which reads as movement rather than as a redraw.
const VEHICLE_GLIDE_MS = 2000;
interface VehicleTrack {
  marker: L.CircleMarker;
  from: L.LatLngLiteral;
  to: L.LatLngLiteral;
  start: number;
}
const vehicleMarkers = new Map<string, VehicleTrack>();
let vehicleFrame: number | null = null;
const checkmarkMarkers = new Map<string, L.Marker>();
const tramPolylines: L.Polyline[] = [];

const tramLineSet = computed(() => new Set(props.tramLineIds));

const FIT_PADDING = L.point(28, 28);
const FIT_MAX_ZOOM = 15;

let homeView: { center: L.LatLng; zoom: number } | null = null;
let programmaticMove = false;
let userMoved = false;
let resizeObserver: ResizeObserver | null = null;

function visibleBounds(): L.LatLngBounds | null {
  const points = props.stations
    .filter(s => !tramLineSet.value.has(s.line) || props.tramsIncluded)
    .map(s => [s.lat, s.lng] as [number, number]);
  return points.length ? L.latLngBounds(points) : null;
}

// Zoom in as far as the viewport allows while every station stays visible.
function fitToStations(animate = false) {
  const bounds = visibleBounds();
  if (!bounds) return;
  homeView = {
    center: bounds.getCenter(),
    zoom: Math.min(map.getBoundsZoom(bounds, false, FIT_PADDING), FIT_MAX_ZOOM),
  };
  programmaticMove = true;
  map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: FIT_MAX_ZOOM, animate });
}

function flyHome() {
  if (!homeView) return;
  programmaticMove = true;
  map.flyTo(homeView.center, homeView.zoom, { duration: 1 });
}

// Sideways gap between two lines sharing a stretch of track, in screen pixels.
const LANE_PX = 4;

function addPolyline(polyline: L.Polyline, lines: string[]) {
  if (lines.every(l => tramLineSet.value.has(l))) {
    tramPolylines.push(polyline);
    if (props.tramsIncluded) polyline.addTo(map);
  } else {
    polyline.addTo(map);
  }
}

// Real track geometry, drawn once per line sharing each corridor and fanned
// out into parallel lanes — otherwise the lines that run together through
// central Göteborg would stack exactly and only the topmost colour would show.
function drawTracks() {
  props.tracks.forEach(corridor => {
    const lanes = corridor.lines.length;
    corridor.lines.forEach((line, i) => {
      addPolyline(L.polyline(corridor.coords, {
        color: props.lineColors[line] ?? '#888',
        weight: 4,
        opacity: 0.65,
        offset: (i - (lanes - 1) / 2) * LANE_PX,
        interactive: false,
      } as L.PolylineOptions), [line]);
    });
  });

  // Fall back to the old straight station-to-station line for anything the
  // generated data does not cover, so a failed regeneration degrades instead
  // of blanking the map.
  const covered = new Set(props.tracks.flatMap(c => c.lines));
  const stationById = new Map(props.stations.map(s => [s.id, s]));
  props.routes.forEach(route => {
    if (covered.has(route.line)) return;
    const coords = route.stationIds
      .map(id => stationById.get(id))
      .filter((s): s is Station => !!s)
      .map(s => [s.lat, s.lng] as [number, number]);
    if (coords.length < 2) return;
    addPolyline(L.polyline(coords, {
      color: props.lineColors[route.line] ?? '#888',
      weight: 4,
      opacity: 0.65,
      interactive: false,
    }), [route.line]);
  });
}

onMounted(async() => {
  await nextTick();
  if (!mapEl.value) return;
  map = L.map(mapEl.value, {
    center: props.center,
    zoom: props.zoom,
    zoomControl: true,
    maxZoom: 19,
    zoomSnap: 0.25,
  });

  map.on('moveend zoomend', () => { programmaticMove = false; });
  map.on('movestart zoomstart', () => { if (!programmaticMove) userMoved = true; });

  map.attributionControl.addAttribution(
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://openfreemap.org/">OpenFreeMap</a>'
  );

  glLayer = L.maplibreGL({
    style: props.darkMode ? STYLE_DARK : STYLE_LIGHT,
    attributionControl: false,
  }).addTo(map);

  drawTracks();

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

  fitToStations();

  // The map lives in a flex layout — keep the untouched view optimally framed as it resizes.
  resizeObserver = new ResizeObserver(() => {
    programmaticMove = true;
    map.invalidateSize();
    if (!userMoved && !props.winnerId) fitToStations();
    else programmaticMove = false;
  });
  resizeObserver.observe(mapEl.value);

  syncVehicles(props.vehicles);

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
  glLayer?.getMaplibreMap().setStyle(dark ? STYLE_DARK : STYLE_LIGHT);
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
  if (!userMoved && !props.winnerId) fitToStations(true);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  checkmarkMarkers.clear();
  if (vehicleFrame !== null) cancelAnimationFrame(vehicleFrame);
  vehicleMarkers.clear();
  map?.remove();
});

function stepVehicles(now: number) {
  let moving = false;
  vehicleMarkers.forEach(track => {
    const t = Math.min(1, (now - track.start) / VEHICLE_GLIDE_MS);
    const eased = t * (2 - t);
    track.marker.setLatLng([
      track.from.lat + (track.to.lat - track.from.lat) * eased,
      track.from.lng + (track.to.lng - track.from.lng) * eased,
    ]);
    if (t < 1) moving = true;
  });
  vehicleFrame = moving ? requestAnimationFrame(stepVehicles) : null;
}

function syncVehicles(newVehicles: Vehicle[]) {
  if (!map) return;

  const seen = new Set<string>();
  const now = performance.now();

  newVehicles.forEach(v => {
    seen.add(v.id);
    const existing = vehicleMarkers.get(v.id);
    if (existing) {
      existing.from = existing.marker.getLatLng();
      existing.to = { lat: v.lat, lng: v.lng };
      existing.start = now;
      existing.marker.setStyle(vehicleStyle(v.line));
    } else {
      const marker = L.circleMarker([v.lat, v.lng], vehicleStyle(v.line)).addTo(map);
      const at = { lat: v.lat, lng: v.lng };
      vehicleMarkers.set(v.id, { marker, from: at, to: at, start: now });
    }
  });

  vehicleMarkers.forEach((track, id) => {
    if (!seen.has(id)) {
      track.marker.remove();
      vehicleMarkers.delete(id);
    }
  });

  if (vehicleFrame === null) vehicleFrame = requestAnimationFrame(stepVehicles);
}

watch(() => props.vehicles, syncVehicles);

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
    programmaticMove = true;
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
      programmaticMove = true;
      map.flyTo([s.lat, s.lng], 14, { duration: 1.2 });
    }
  } else {
    flyHome();
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
