import { readFileSync } from 'fs';

type Valve = {
  name: string;
  flowRate: number;
  tunnel: string[];
  open: boolean;
};

type Valves = Map<string, Valve>;
// Parse the input to create a graph of valves and their flow rates
const input = readFileSync('test.txt', 'utf-8').trim();
const lines = input.split('\n');
const valves = new Map<string, Valve>();

for (const line of lines) {
  const segments = line.split(' ');
  const name = segments[1];
  const flowRate = parseInt(segments[4].split('=')[1]);
  const tunnelNames = segments.slice(9).map(s => s.replace(/[,;]/g, ''));
  const valve: Valve = { name, flowRate, tunnel: tunnelNames, open: false };
  valves.set(name, valve);
}

type Action = {
  type: 'open' | 'travel';
  to: string;
  done: number;
};

class Simulation {
  public valves: Valves;
  public currentValve: string;
  public time: number;
  public maxTime: number;
  public actionQueue: Action[];
  public pressure: number;
  constructor(valves: Valves, currentValve: string, maxTime: number) {
    this.valves = valves;
    this.currentValve = currentValve;
    this.time = 0;
    this.maxTime = maxTime;
    this.actionQueue = [];
    this.pressure = 0;
  }
  tick() {
    this.time++;
    if (this.actionQueue.length !== 0 && this.actionQueue[0].done === this.time) {
      const action = this.actionQueue.shift()!;
      if (action.done === this.time) {
        if (action.type === 'open') {
          const valve = this.valves.get(action.to)!;
          valve.open = true;
          this.pressure += valve.flowRate * (this.maxTime - this.time);
        } else {
          this.currentValve = action.to;
        }
      }
    }
  }
  open(valve: string) {
    // add action to open valve that resolves in 1 minute
    this.actionQueue.push({ type: 'open', to: valve, done: this.time + 1 });
  }
  travel(valve: string) {
    // add action to travel to valve that resolves in 1 minute
    this.actionQueue.push({ type: 'travel', to: valve, done: this.time + 1 });
  }
}

// get distances between all valves
const distances = new Map<string, Map<string, number>>();
for (const [name, valve] of valves) {
  const distanceMap = new Map<string, number>();
  const queue = valve.tunnel.map(t => ({ name: t, distance: 1 }));
  while (queue.length !== 0) {
    const { name, distance } = queue.shift()!;
    if (!distanceMap.has(name)) {
      distanceMap.set(name, distance);
      const nextValve = valves.get(name)!;
      for (const tunnel of nextValve.tunnel) {
        queue.push({ name: tunnel, distance: distance + 1 });
      }
    }
  }
  distances.set(name, distanceMap);
}
