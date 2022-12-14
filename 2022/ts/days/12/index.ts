import getInput from '../../inputManager.js';

const input = (await getInput(12)).trim().split('\n');

type State = {
  x: number;
  y: number;
  steps: number;
};

type Pos = {
  x: number;
  y: number;
};

const alphabet = 'abcdefghijklmnopqrstuvwxyzE';
const grid = input.map((line) => line.split('').map((c) => alphabet.indexOf(c)));

// get start position
const start: State = grid.flatMap((row, y) =>
  row.flatMap((value, x) => (value === -1 ? { x, y, steps: 0 } : [])),
)[0];

// get target position
const target1: State = grid.flatMap((row, y) =>
  row.flatMap((value, x) => (value === 26 ? { x, y, steps: 0 } : [])),
)[0];

const target2 = 0;

const getNeighbors = (x: number, y: number) => {
  const neighbors = [];
  if (x > 0) neighbors.push({ x: x - 1, y });
  if (x < grid[0].length - 1) neighbors.push({ x: x + 1, y });
  if (y > 0) neighbors.push({ x, y: y - 1 });
  if (y < grid.length - 1) neighbors.push({ x, y: y + 1 });
  return neighbors;
};

const getValue = (x: number, y: number) => grid[y][x];

const canVisit = (from: Pos, to: Pos, reverse: boolean = false) => {
  const fromValue = getValue(from.x, from.y);
  const toValue = getValue(to.x, to.y);
  return fromValue - toValue < 2;
};

const answers = new Map<string, number>();

const path = (start: State, target1: State, target2: number): Map<string, number> => {
  const queue = [start];
  const visited = new Set<string>();
  while (queue.length) {
    const { x, y, steps } = queue.shift()!;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (x === target1.x && y === target1.y) {
      if (!answers.has('p1')) answers.set('p1', steps);
      if (answers.has('p2')) return answers;
    }
    if (getValue(x, y) === target2) {
      if (!answers.has('p2')) answers.set('p2', steps);
      if (answers.has('p1')) return answers;
    }
    getNeighbors(x, y)
      .filter((pos) => canVisit({ x, y }, pos))
      .forEach((pos) => queue.push({ ...pos, steps: steps + 1 }));
  }
  return answers;
};

const parts = path(target1, start, target2);

const answer = {
  part1: parts.get('p1'),
  part2: parts.get('p2'),
  day: 12,
};

export default answer;
