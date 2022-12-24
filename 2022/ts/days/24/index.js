import { readFileSync } from 'fs';

// shamerfully ripped from https://github.com/leyanlo/advent-of-code/blob/main/2022/day-24.js
const input = readFileSync('input.txt', 'utf8').trim();

const dirs = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
  [0, 0],
];

const gcd = (...nums) => {
  const _gcd = (a, b) => {
    return !b ? a : gcd(b, a % b);
  };
  return nums.reduce((acc, n) => _gcd(acc, n));
};

const lcm = (...nums) => {
  return nums.reduce((acc, n) => (acc * n) / gcd(acc, n));
};

const mod = (a, b) => {
  while (a < 0) a += b;
  return a % b;
};

const timeStep = (start, end, tStart, maps) => {
  const [yS, xS] = start;
  const [yE, xE] = end;
  const queue = [[yS, xS, tStart]];
  const seen = {};
  while (queue.length) {
    const [y, x, t] = queue.shift();
    if (seen[[y, x, t % maps.length].join()]) {
      continue;
    }
    seen[[y, x, t % maps.length].join()] = 1;

    if (y === yE && x === xE) {
      return t;
    }

    for (const [dy, dx] of dirs) {
      if (maps[(t + 1) % maps.length][y + dy]?.[x + dx] === 0) {
        queue.push([y + dy, x + dx, t + 1]);
      }
    }
  }
};

const solve = input => {
  const map = input.split('\n').map(line => line.split(''));

  const height = map.length - 2;
  const width = map[0].length - 2;
  const nMaps = lcm(height, width);
  const maps = [...Array(nMaps)].map(() =>
    map.map(line => line.map(char => (char === '#' ? 1 : 0))),
  );

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      switch (map[y][x]) {
        case '^':
          for (let i = 0; i < nMaps; i++) maps[i][mod(y - 1 - i, height) + 1][x] = 1;
          break;
        case '>':
          for (let i = 0; i < nMaps; i++) maps[i][y][mod(x - 1 + i, width) + 1] = 1;
          break;
        case 'v':
          for (let i = 0; i < nMaps; i++) maps[i][mod(y - 1 + i, height) + 1][x] = 1;
          break;
        case '<':
          for (let i = 0; i < nMaps; i++) maps[i][y][mod(x - 1 - i, width) + 1] = 1;
          break;
      }
    }
  }

  let start = [0, map[0].indexOf('.')];
  let end = [map.length - 1, map[map.length - 1].indexOf('.')];
  let t = timeStep(start, end, 0, maps);
  console.log(t);

  t = timeStep(end, start, t, maps);
  t = timeStep(start, end, t, maps);
  console.log(t);
};
solve(input);
