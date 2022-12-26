import { readFileSync } from 'node:fs';
// https://github.com/LebsterFace/AdventOfCode-2022/blob/master/solutions/day17/common.ts
const input = [...readFileSync('input.txt', 'utf-8').trim()] as Array<'<' | '>'>;

const WIDTH = 7;

const grid: boolean[][] = [Array(WIDTH).fill(true)];

const SHAPE_DEFINITIONS = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`;

const shapes = SHAPE_DEFINITIONS.split('\n\n').map(s =>
  s
    .split('\n')
    .reverse()
    .map(r => Array.from(r, c => c === '#')),
);

let shapeIndex = 0;

const next = (): { shape: boolean[][]; x: number; y: number } => {
  if (shapeIndex >= shapes.length) shapeIndex = 0;
  return {
    shape: shapes[shapeIndex++],
    x: 2,
    y: 3,
  };
};

let current = next();

const place = () => {
  while (grid.length < grid.length + current.y + current.shape.length) {
    grid.push(Array(WIDTH).fill(false));
    current.y--;
  }
  const curAbsY = grid.length + current.y;
  for (let y = grid.length - 1; y >= 0; y--) {
    const row = grid[y];
    for (let x = 0; x < WIDTH; x++) {
      const atSign =
        y >= curAbsY &&
        y < curAbsY + current.shape.length &&
        current.shape[y - curAbsY][x - current.x];

      row[x] ||= atSign;
    }
  }
};

const rockCollide = () => {
  const curAbsY = grid.length + current.y;

  for (let y = curAbsY + current.shape.length - 1; y >= curAbsY; y--) {
    for (let x = 0; x < WIDTH; x++) {
      if (grid[y]?.[x] && current.shape[y - curAbsY][x - current.x]) return true;
    }
  }
  return false;
};

const floorCollide = () => grid.length + current.y <= 0;

const wallCollide = () => {
  if (current.x < 0) return true;
  for (const row of current.shape) {
    for (let x = 0; x < row.length; x++) {
      if (current.x + x >= WIDTH) return true;
    }
  }
  return false;
};

let windIndex = 0;
const wind = () => {
  const ogx = current.x;
  if (windIndex >= input.length) windIndex = 0;
  if (input[windIndex] === '>') current.x++;
  if (input[windIndex] === '<') current.x--;
  windIndex++;
  if (wallCollide() || rockCollide() || floorCollide()) current.x = ogx;
};

const fall = () => {
  current.y--;

  if (floorCollide() || rockCollide()) {
    current.y++;
    place();
    current = next();
    return true;
  }
  return false;
};

// part 1
// let rocks = 0;
// while (rocks < 2022) {
//   wind();
//   if (fall()) rocks++;
// }

// console.log(grid.length - 1);

// part 2
let rocks = 0;
windIndex = 0;
shapeIndex = 1;
let height = 0;

type StateName = `${string},${string}`;
type State = {
  gainedRocks: number;
  gainedHeight: number;
  nextName: StateName;
};

const cache = new Map<StateName, State>();

const currentStateName = (): StateName => `${windIndex},${shapeIndex}`;

let lastName = currentStateName();
let lastH = grid.length - 1;
let lastR = rocks;

let cycle = false;
const target = 1_000_000_000_000;

while (rocks < target) {
  wind();
  if (fall()) {
    rocks++;

    const lastIndex = grid.findIndex((row, i) => i > 0 && row.every(c => c));
    if (lastIndex !== -1) {
      const { length: removed } = grid.splice(0, lastIndex);
      height += removed;

      if (cycle === true) continue;

      const curState: State = {
        gainedHeight: height - lastH,
        gainedRocks: rocks - lastR,
        nextName: currentStateName(),
      };

      if (!cache.has(lastName)) {
        cache.set(lastName, curState);
        lastName = curState.nextName;
        lastH = height;
        lastR = rocks;
        continue;
      }

      const queue: StateName[] = [];
      let cur = lastName;
      while (cache.get(cur)) {
        queue.push(cur);
        const currentState = cache.get(cur)!;
        if (!queue.includes(currentState.nextName)) {
          cur = currentState.nextName;
          continue;
        }

        const index = queue.indexOf(currentState.nextName);
        let summedHeight = 0;
        let summedRocks = 0;
        for (const S of queue.slice(index)) {
          const { gainedHeight, gainedRocks } = cache.get(S)!;
          summedHeight += gainedHeight;
          summedRocks += gainedRocks;
        }
        const remainingRocks = target - rocks;
        const cycles = Math.floor(remainingRocks / summedRocks);

        rocks += cycles * summedRocks;
        height += cycles * summedHeight;

        cycle = true;
        break;
      }
    }
  }
}
height += grid.length - 1;
console.log(height);
