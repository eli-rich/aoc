import { readFileSync } from 'fs';

type Valve = {
  name: string;
  flowRate: number;
  tunnel: string[];
  open: boolean;
};

// Parse the input to create a graph of valves and their flow rates
const input = readFileSync('input.txt', 'utf-8').trim();
const lines = input.split('\n');
const valves = new Map<string, Valve>();
const bit: Record<string, bigint> = {};
let bitIndex = 0n;
for (const line of lines) {
  const segments = line.split(' ');
  const name = segments[1];
  const flowRate = parseInt(segments[4].split('=')[1]);
  const tunnelNames = segments.slice(9).map(s => s.replace(/[,;]/g, ''));
  const valve: Valve = { name, flowRate, tunnel: tunnelNames, open: false };
  valves.set(name, valve);
  if (valve.flowRate > 0) bit[name] = 1n << bitIndex++;
}

const vertices: string[] = [];
for (const valve of valves.values()) {
  vertices.push(valve.name);
}

const objectFromKeys = <T>(keys: string[], valueFn: (key: string) => T) =>
  Object.fromEntries(keys.map(k => [k, valueFn(k)]));

let distances: Record<string, Record<string, number>> = objectFromKeys(vertices, () =>
  objectFromKeys(vertices, () => Infinity),
);

for (const vertex of vertices) {
  distances[vertex][vertex] = 0;
  for (const neighbor of valves.get(vertex)!.tunnel) {
    distances[neighbor][vertex] = 1;
  }
}

for (const k of vertices) {
  for (const i of vertices) {
    for (const j of vertices) {
      if (distances[i][j] > distances[i][k] + distances[k][j]) {
        distances[i][j] = distances[i][k] + distances[k][j];
      }
    }
  }
}

for (const [from, map] of Object.entries(distances)) {
  for (const to of Object.keys(map)) {
    if (to === from || valves.get(to)!.flowRate === 0) delete map[to];
  }
}

// Run DFS to find the best path

const cache = new Map<string, number>();

const dfs = (time: number, valve: string, open: bigint): number => {
  const key = `${time}-${valve}-${open}`;
  const cVal = cache.get(key);
  if (cVal !== undefined) return cVal;

  let max = 0;
  for (const [neighbor, dist] of Object.entries(distances[valve])) {
    if (open & bit[neighbor]) continue;
    const remaining = time - 1 - dist;
    if (remaining <= 0) continue;
    const best = dfs(remaining, neighbor, open | bit[neighbor]);
    max = Math.max(max, best + valves.get(neighbor)!.flowRate * remaining);
  }
  cache.set(key, max);
  return max;
};

// part 1
console.log(dfs(30, 'AA', 0n));

// part 2
// now there are two people
// both start at AA
// both have 26 minutes
// find the max flow rate
const ALL_OPEN = 2n ** bitIndex - 1n;
let max = -Infinity;
for (let i = 0n; i < ALL_OPEN; i++) {
  const v = dfs(26, 'AA', i) + dfs(26, 'AA', ALL_OPEN ^ i);
  max = Math.max(max, v);
}

console.log(max);
