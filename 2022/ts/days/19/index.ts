import { readFileSync } from 'node:fs';

type OreBot = {
  ore: number;
};

type ClayBot = {
  ore: number;
};

type ObsidianBot = {
  ore: number;
  clay: number;
};

type GeodeBot = {
  ore: number;
  obsidian: number;
};

type Blueprint = {
  oreBot: OreBot;
  clayBot: ClayBot;
  obsidianBot: ObsidianBot;
  geodeBot: GeodeBot;
};

type Resources = {
  [key: string]: number;
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
  oreBots: number;
  clayBots: number;
  obsidianBots: number;
  geodeBots: number;
};

const regex =
  /Blueprint \d+: Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.*/gm;
const input = readFileSync('input.txt', 'utf-8').trim();
const matches = [...input.matchAll(regex)];
const blueprints: Blueprint[] = [];
for (const match of matches) {
  const [, oreBotOre, clayBotOre, obsidianBotOre, obsidianBotClay, geodeBotOre, geodeBotObsidian] =
    match;

  const blueprint: Blueprint = {
    oreBot: {
      ore: parseInt(oreBotOre, 10),
    },
    clayBot: {
      ore: parseInt(clayBotOre, 10),
    },
    obsidianBot: {
      ore: parseInt(obsidianBotOre, 10),
      clay: parseInt(obsidianBotClay, 10),
    },
    geodeBot: {
      ore: parseInt(geodeBotOre, 10),
      obsidian: parseInt(geodeBotObsidian, 10),
    },
  };
  blueprints.push(blueprint);
}

type BuildAction = {
  type: 'ore' | 'clay' | 'obsidian' | 'geode';
  ready: number;
};

class Simulation {
  blueprint: Blueprint;
  time: number;
  resources: Resources;
  currentTime: number;
  private actionQueue: BuildAction[];
  constructor(blueprint: Blueprint, resources: Resources, time: number) {
    this.blueprint = blueprint;
    this.time = time;
    this.resources = resources;
    this.actionQueue = [];
    this.currentTime = 0;
  }
  tick() {
    this.currentTime++;
    if (this.actionQueue.length > 0) {
      const action = this.actionQueue[0];
      if (action.ready === this.currentTime) {
        this.actionQueue.shift();
        this.resources[`${action.type}Bots`] += 1;
      }
    }
    for (const [resource, amount] of Object.entries(this.resources)) {
      if (resource.endsWith('Bots')) {
        this.resources[resource.slice(0, resource.length - 4)] += amount;
      }
    }
  }
  build(type: 'ore' | 'clay' | 'obsidian' | 'geode') {
    const blueprint = this.blueprint[`${type}Bot`];
    const resources = this.resources;
    const ready = this.currentTime + 2;

    for (const [resource, amount] of Object.entries(blueprint)) {
      resources[resource] -= amount;
    }
    this.actionQueue.push({ type, ready });
  }
  canBuild(type: 'ore' | 'clay' | 'obsidian' | 'geode') {
    const blueprint = this.blueprint[`${type}Bot`];
    const resources = this.resources;
    for (const [resource, amount] of Object.entries(blueprint)) {
      if (resources[resource] < amount) {
        return false;
      }
    }
    return true;
  }
  perMinute(type: 'ore' | 'clay' | 'obsidian' | 'geode') {
    const resources = this.resources;
    const bots = resources[`${type}Bots`];
    return bots;
  }
  perRemain(type: 'ore' | 'clay' | 'obsidian' | 'geode') {
    const perMinute = this.perMinute(type);
    const time = this.time;
    return perMinute * time;
  }
}

const startingResources: Resources = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
  oreBots: 1,
  clayBots: 0,
  obsidianBots: 0,
  geodeBots: 0,
};

// simulate simulations
// at each branch, randomly decide the path
// print the simulation that produces the most geodes
// part 1
// const scores: number[] = [];

// for (const [bpIndex, bp] of blueprints.entries()) {
//   const simulations: Simulation[] = [];
//   for (let i = 0; i < 200_000; i++) {
//     const sim = new Simulation(bp, { ...startingResources }, 24);
//     while (sim.currentTime < sim.time) {
//       sim.tick();
//       if (sim.canBuild('geode')) {
//         sim.build('geode');
//       } else if (sim.canBuild('obsidian') && Math.random() < 0.5) {
//         sim.build('obsidian');
//       } else if (sim.canBuild('clay') && Math.random() < 0.4) {
//         sim.build('clay');
//       } else if (sim.canBuild('ore') && Math.random() < 0.5) {
//         sim.build('ore');
//       }
//     }
//     if (i % 50_000 === 0) console.log(`Simulation: ${i} complete!`);
//     simulations.push(sim);
//   }

//   const best = simulations.reduce((best, sim) => {
//     if (sim.resources.geode > best.resources.geode) {
//       return sim;
//     }
//     return best;
//   });
//   scores.push(best.resources.geode * (bpIndex + 1));
//   console.log(`BP: ${bpIndex} Geodes: ${best.resources.geode}`);
// }

// console.log(scores.reduce((sum, val) => sum + val, 0));

// part 2
let max = 0;
const scores: number[] = [];
for (const [bpIndex, bp] of blueprints.slice(0, 1).entries()) {
  const simulations: Simulation[] = [];
  for (let i = 0; i < 5_000_000; i++) {
    const sim = new Simulation(bp, { ...startingResources }, 32);
    while (sim.currentTime < sim.time) {
      sim.tick();
      if (sim.canBuild('geode')) {
        sim.build('geode');
      } else if (sim.canBuild('obsidian') && Math.random() < 0.5) {
        sim.build('obsidian');
      } else if (sim.canBuild('clay') && Math.random() < 0.4) {
        sim.build('clay');
      } else if (sim.canBuild('ore') && Math.random() < 0.5) {
        sim.build('ore');
      }
    }
    if (i % 500_000 === 0) console.log(`Simulation: ${i} complete!`);
    if (sim.resources.geode > max) {
      max = sim.resources.geode;
      console.log(`New max: ${max}`);
    }
  }
  scores.push(max);
  console.log(`BP: ${bpIndex} Geodes: ${max}`);
  max = 0;
}

console.log(scores.reduce((product, val) => product * val, 1));

// 10
// 54
// 37
