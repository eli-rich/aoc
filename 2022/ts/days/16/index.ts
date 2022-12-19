import { readFileSync } from 'fs';

type Valve = {
  name: string;
  flowRate: number;
  tunnel: string[];
};

type Valves = Map<string, Valve>;
// Parse the input to create a graph of valves and their flow rates
const input = readFileSync('input.txt', 'utf-8').trim();
const lines = input.split('\n');
const valves = new Map<string, Valve>();

for (const line of lines) {
  const segments = line.split(' ');
  const name = segments[1];
  const flowRate = parseInt(segments[4].split('=')[1]);
  const tunnelNames = segments.slice(9).map((s) => s.replace(/[,;]/g, ''));
  const valve: Valve = { name, flowRate, tunnel: tunnelNames };
  valves.set(name, valve);
}

const randInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

type ValveState = {
  valve: Valve;
  open: boolean;
  flowRate: number;
  minutesRemaining: number;
};

class Path {
  valves: Valves;
  pathway: ValveState[];
  minutes: number;

  constructor(valves: Valves, minutes: number) {
    this.valves = valves;
    this.minutes = minutes - 1;
    this.pathway = [];
  }
  generatePath() {
    const startValve = this.valves.get('AA');
    if (!startValve) throw new Error('No start valve');
    let currentValve = startValve;
    const visited = new Set<string>();
    const opened = new Set<string>();
    while (this.minutes > 0) {
      visited.add(currentValve.name);
      // decide whether or not to open the current valve
      if (currentValve.flowRate !== 0 && !opened.has(currentValve.name) && randInt(0, 2) === 0) {
        this.open();
        this.pathway.push({
          valve: currentValve,
          open: true,
          flowRate: currentValve.flowRate,
          minutesRemaining: this.minutes,
        });
        opened.add(currentValve.name);
      } else {
        this.pathway.push({
          valve: currentValve,
          open: false,
          flowRate: currentValve.flowRate,
          minutesRemaining: this.minutes,
        });
      }

      // decide whether or not to travel to the next valve

      if (currentValve.tunnel.length > 0) {
        this.travel();
        // choose the next valve
        // prioritize valves that have not been visited
        const notVisited = currentValve.tunnel.filter((v) => !visited.has(v));
        let nextValve = '';
        if (notVisited.length > 0) {
          for (const v of notVisited) {
            const valve = this.valves.get(v)!;
            if (valve.flowRate !== 0) {
              nextValve = v;
              break;
            }
          }
        }
        if (nextValve === '')
          nextValve = currentValve.tunnel[randInt(0, currentValve.tunnel.length)];

        currentValve = this.valves.get(nextValve)!;
      }
    }
  }
  open() {
    this.minutes -= 1;
  }
  travel() {
    this.minutes -= 1;
  }
  fitness() {
    let fitness = 0;
    for (const valve of this.pathway) {
      if (valve.open) {
        fitness += valve.flowRate * valve.minutesRemaining;
      }
    }
    return fitness;
  }
  mutate() {
    const index = randInt(0, this.pathway.length);
    const valve = this.pathway[index];
    if (valve.open && randInt(0, 100) < 10) {
      valve.open = false;
      // shift all minutes remaining

      for (let i = index; i < this.pathway.length; i++) {
        this.pathway[i].minutesRemaining += 1;
        // and open the next occurrence of the valve
        const next = this.pathway.findIndex((v, j) => j > i && v.valve.name === valve.valve.name);
        if (next !== -1) {
          this.pathway[next].open = true;
          // reshift all minutes remaining
          for (let j = next; j < this.pathway.length; j++) {
            this.pathway[j].minutesRemaining -= 1;
          }
          break;
        }
      }
    }
  }
}

const populationSize = 1_000_000;

const population: Path[] = [];

for (let i = 0; i < populationSize; i++) {
  const path = new Path(valves, 30);
  path.generatePath();
  population.push(path);
}

// mutate the population
for (let i = 0; i < populationSize; i++) {
  const path = population[i];
  path.mutate();
}

population.sort((a, b) => b.fitness() - a.fitness());
const bestPath = population[0];
console.log(bestPath.pathway.map((v) => v.valve.name));
console.log(bestPath.fitness());
