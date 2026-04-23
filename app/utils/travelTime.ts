import { routes } from '~/data/routes';
import { stations } from '~/data/stations';
import type { TbanaLine } from '~/types/station';

// NodeKey = `${stationId}::${line}` — tracks which line you're currently on,
// so transfers between lines incur a penalty rather than being free.
type NodeKey = string;

const TBANA_LINES = new Set<TbanaLine>(['blue', 'red', 'green']);
const TBANA_TRANSFER_MIN = 5;
const LIGHT_RAIL_TRANSFER_MIN = 7;
const AVG_SPEED_KMH = 30;

const stationLookup = new Map(stations.map(s => [s.id, s]));

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

function edgeMinutes(idA: string, idB: string): number {
  const a = stationLookup.get(idA);
  const b = stationLookup.get(idB);
  if (!a || !b) return 3;
  return (haversineKm(a.lat, a.lng, b.lat, b.lng) / AVG_SPEED_KMH) * 60;
}

function transferCost(lineA: TbanaLine, lineB: TbanaLine): number {
  return TBANA_LINES.has(lineA) && TBANA_LINES.has(lineB) ? TBANA_TRANSFER_MIN : LIGHT_RAIL_TRANSFER_MIN;
}

// Build adjacency list and station→nodes index from routes.ts.
// Line membership comes from routes (not station.line), so Tvärbanan stations
// like 'alvik' and 'gullmarsplan' get tvarbanan nodes even though station.line = 'green'.
const adj = new Map<NodeKey, Array<{ cost: number; to: NodeKey }>>();
const stationToNodes = new Map<string, NodeKey[]>();

function addEdge(from: NodeKey, to: NodeKey, cost: number): void {
  const edges = adj.get(from) ?? [];
  edges.push({ cost, to });
  adj.set(from, edges);
}

const stationLineSet = new Map<string, Set<TbanaLine>>();
for (const route of routes) {
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
    const set = stationLineSet.get(id) ?? new Set<TbanaLine>();
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

export function travelTimesFrom(sourceId: string): Map<string, number> {
  const sourceNodes = stationToNodes.get(sourceId);
  if (!sourceNodes?.length) return new Map();

  const dist = new Map<NodeKey, number>();
  // Sorted array used as a simple priority queue — graph is small (~250 nodes)
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

  // Collapse NodeKey distances to per-station minimums
  const result = new Map<string, number>();
  for (const [key, d] of dist) {
    const stationId = key.split('::')[0];
    if (!stationId) continue;
    const existing = result.get(stationId);
    if (existing === undefined || d < existing) result.set(stationId, d);
  }
  return result;
}
