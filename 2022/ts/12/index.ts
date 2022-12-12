import { readFileSync } from 'node:fs';

const input = readFileSync('input.txt', 'utf-8').trim().split('\n');

const alphabet = 'abcdefghijklmnopqrstuvwxyzE';
const grid = input.map((line) => line.split('').map((c) => alphabet.indexOf(c)));

type State = {
  x: number;
  y: number;
  steps: number;
};

type Pos = {
  x: number;
  y: number;
};

const getNeighbors = (x: number, y: number) => {
  const neighbors = [];
  if (x > 0) neighbors.push({ x: x - 1, y });
  if (x < grid[0].length - 1) neighbors.push({ x: x + 1, y });
  if (y > 0) neighbors.push({ x, y: y - 1 });
  if (y < grid.length - 1) neighbors.push({ x, y: y + 1 });
  return neighbors;
};

const getValue = (x: number, y: number) => grid[y][x];

const target = alphabet.indexOf('E');
const start: State = { x: 0, y: 0, steps: 0 };

const canVisit = (from: Pos, to: Pos) => {
  const fromValue = getValue(from.x, from.y);
  const toValue = getValue(to.x, to.y);
  return toValue - fromValue < 2;
};

const path = (start: State, target: number): State | undefined => {
  const queue = [start];
  const visited = new Set<string>();
  while (queue.length) {
    const { x, y, steps } = queue.shift()!;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (getValue(x, y) === target) return { x, y, steps };
    getNeighbors(x, y)
      .filter((pos) => canVisit({ x, y }, pos))
      .forEach((pos) => queue.push({ ...pos, steps: steps + 1 }));
  }
};

const result = path(start, target);
console.log(result!.steps - 2);

// get all positions with a value of 0
const positions = grid.flatMap((row, y) =>
  row.flatMap((value, x) => (value === 0 ? { x, y } : [])),
);

// find the best position to start from
const best = positions
  .map((pos) => path({ ...pos, steps: 0 }, target))
  .filter((pos) => pos !== undefined)
  .sort((a, b) => a!.steps - b!.steps)[0];

console.log(best!.steps);
