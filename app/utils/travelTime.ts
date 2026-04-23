import type { Station } from '~/types/station';
import type { Route } from '~/data/routes';

type NodeKey = string;

const AVG_SPEED_KMH = 30;
const METRO_TRANSFER_MIN = 5;
const TRAM_TRANSFER_MIN = 7;
const TRAM_ONLY_TRANSFER_MIN = 3;

const METRO_LINES = new Set(['blue', 'red', 'green']);

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function createTravelTimeGraph(
  cityStations: Station[],
  cityRoutes: Route[],
): (sourceId: string) => Map<string, number> {
  const stationLookup = new Map(cityStations.map(s => [s.id, s]));

  function edgeMinutes(idA: string, idB: string): number {
    const a = stationLookup.get(idA);
    const b = stationLookup.get(idB);
    if (!a || !b) return 3;
    return (haversineKm(a.lat, a.lng, b.lat, b.lng) / AVG_SPEED_KMH) * 60;
  }

  function transferCost(lineA: string, lineB: string): number {
    const aMetro = METRO_LINES.has(lineA);
    const bMetro = METRO_LINES.has(lineB);
    if (aMetro && bMetro) return METRO_TRANSFER_MIN;
    if (aMetro || bMetro) return TRAM_TRANSFER_MIN;
    return TRAM_ONLY_TRANSFER_MIN;
  }

  const adj = new Map<NodeKey, Array<{ cost: number; to: NodeKey }>>();
  const stationToNodes = new Map<string, NodeKey[]>();

  function addEdge(from: NodeKey, to: NodeKey, cost: number): void {
    const edges = adj.get(from) ?? [];
    edges.push({ cost, to });
    adj.set(from, edges);
  }

  const stationLineSet = new Map<string, Set<string>>();
  for (const route of cityRoutes) {
    const { line, stationIds: ids } = route;
    for (let i = 0; i < ids.length - 1; i++) {
      const idA = ids[i];
      const idB = ids[i + 1];
      if (!idA || !idB) continue;
      const nodeA = `${idA}::${line}`;
      const nodeB = `${idB}::${line}`;
      const cost = edgeMinutes(idA, idB);
      addEdge(nodeA, nodeB, cost);
      addEdge(nodeB, nodeA, cost);
    }
    for (const id of ids) {
      const set = stationLineSet.get(id) ?? new Set<string>();
      set.add(line);
      stationLineSet.set(id, set);
    }
  }

  for (const [stationId, lineSet] of stationLineSet) {
    const lineArr = [...lineSet];
    const nodeKeys = lineArr.map(l => `${stationId}::${l}`);
    stationToNodes.set(stationId, nodeKeys);
    for (let i = 0; i < lineArr.length; i++) {
      for (let j = i + 1; j < lineArr.length; j++) {
        const from = nodeKeys[i];
        const to = nodeKeys[j];
        const la = lineArr[i];
        const lb = lineArr[j];
        if (!from || !to || !la || !lb) continue;
        const cost = transferCost(la, lb);
        addEdge(from, to, cost);
        addEdge(to, from, cost);
      }
    }
  }

  return function travelTimesFrom(sourceId: string): Map<string, number> {
    const sourceNodes = stationToNodes.get(sourceId);
    if (!sourceNodes?.length) return new Map();

    const dist = new Map<NodeKey, number>();
    const heap: Array<[number, NodeKey]> = [];

    const push = (cost: number, node: NodeKey): void => {
      heap.push([cost, node]);
      heap.sort((a, b) => a[0] - b[0]);
    };

    for (const node of sourceNodes) {
      dist.set(node, 0);
      push(0, node);
    }

    while (heap.length > 0) {
      const entry = heap.shift();
      if (!entry) break;
      const [d, u] = entry;
      if (d > (dist.get(u) ?? Infinity)) continue;
      for (const { cost, to } of (adj.get(u) ?? [])) {
        const nd = d + cost;
        if (nd < (dist.get(to) ?? Infinity)) {
          dist.set(to, nd);
          push(nd, to);
        }
      }
    }

    const result = new Map<string, number>();
    for (const [key, d] of dist) {
      const stationId = key.split('::')[0];
      if (!stationId) continue;
      const existing = result.get(stationId);
      if (existing === undefined || d < existing) result.set(stationId, d);
    }
    return result;
  };
}

// Default Stockholm instance (backwards compatibility)
import { stations } from '~/data/stations';
import { routes } from '~/data/routes';
export const travelTimesFrom = createTravelTimeGraph(stations, routes);
