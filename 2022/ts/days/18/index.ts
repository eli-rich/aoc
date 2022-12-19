import { readFileSync } from 'fs';

const cubes = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((l: string) => l.split(',').map(Number));

const sides = (x: number, y: number, z: number) => [
  [x + 1, y, z],
  [x - 1, y, z],
  [x, y + 1, z],
  [x, y - 1, z],
  [x, y, z + 1],
  [x, y, z - 1],
];

const cubeSet = new Set(cubes.map((c) => c.join(',')));
let sum = 0;
for (const cube of cubes) {
  const s = sides(cube[0], cube[1], cube[2]);
  s.forEach((side) => {
    if (!cubeSet.has(side.join(','))) sum++;
  });
}
console.log(sum);

// part 2

const minX = Math.min(...cubes.map((c) => c[0]));
const maxX = Math.max(...cubes.map((c) => c[0]));
const minY = Math.min(...cubes.map((c) => c[1]));
const maxY = Math.max(...cubes.map((c) => c[1]));
const minZ = Math.min(...cubes.map((c) => c[2]));
const maxZ = Math.max(...cubes.map((c) => c[2]));

const xRange = [...Array.from({ length: maxX + 1 }, (_, i) => i + minX)];
const yRange = [...Array.from({ length: maxY + 1 }, (_, i) => i + minY)];
const zRange = [...Array.from({ length: maxZ + 1 }, (_, i) => i + minZ)];

let ext = new Set();

const isExt = (x: number, y: number, z: number) => {
  if (cubeSet.has([x, y, z].join(','))) return false;
  const checked = new Set<string>();
  const todo = [[x, y, z]];
  while (todo.length) {
    const [x, y, z] = todo.pop()!;
    if (checked.has([x, y, z].join(','))) continue;
    checked.add([x, y, z].join(','));
    if (ext.has([x, y, z].join(','))) {
      const data = [...checked].filter((c) => !cubeSet.has(c));
      ext = new Set([...data]);
      return true;
    }
    // check if x, y, z, is not in range
    if (!xRange.includes(x) || !yRange.includes(y) || !zRange.includes(z)) {
      const data = [...checked].filter((c) => !cubeSet.has(c));
      ext = new Set([...data]);
      return true;
    }
    if (!cubeSet.has([x, y, z].join(','))) {
      todo.push(...sides(x, y, z));
    }
  }
};

let sum2 = 0;

for (const [x, y, z] of cubes) {
  for (const n of sides(x, y, z)) {
    if (isExt(n[0], n[1], n[2])) {
      sum2++;
    }
  }
}

console.log(sum2);
