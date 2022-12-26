import { readFileSync } from 'node:fs';
const pipe =
  (...fns) =>
  v =>
    fns.reduce((a, f) => f(a), v);

const parse = input => {
  const g = input.split('\n\n');
  const map = g[0].split('\n').map(line => line.split('').map(c => c.trim()));
  const instr = [...('R' + g[1]).matchAll(/(([LR])(\d+))/g)]
    .map(([, , a, b]) => [a, b])
    .map(([a, b]) => [a === 'L' ? -1 : 1, Number(b)]);
  return [map, instr, [[map[0].findIndex(c => c === '.'), 0], -1], [map[0].length, map.length]];
};

const score = ([[col, row], facing]) => 1000 * (row + 1) + 4 * (col + 1) + facing;

// prettier-ignore
const DIR = [[1, 0],[0, 1],[-1, 0],[0, -1]];

const walk_flat_earth = ([map, instr, start, dim]) =>
  instr.reduce(([p, f], [turn, steps]) => {
    f = (f + 4 + turn) % 4;
    let pos, c;
    while ((c = map[p[1]][p[0]]) !== '#' && steps >= 0) {
      if (c) {
        pos = p;
        steps--;
      }
      p = DIR[f].map((d, i) => (p[i] + d + dim[i]) % dim[i]);
    }
    return [pos, f];
  }, start);

const Inf = Infinity;
const [R, D, L, U] = [0, 1, 2, 3];
// prettier-ignore
const wrapping_rules = [
[// R
  [[Inf,  50], ([x,y]) => [[99,  149 - y], L]],
  [[Inf, 100], ([x,y]) => [[y + 50,   49], U]],
  [[Inf, 150], ([x,y]) => [[149,   149-y], L]],
  [[Inf, 200], ([x,y]) => [[y - 100, 149], U]]
],
[ // D
  [[50,  Inf], ([x,y]) => [[x + 100,   0], D]],
  [[100, Inf], ([x,y]) => [[49,  x + 100], L]],
  [[150, Inf], ([x,y]) => [[99,   x - 50], L]]
],
[ // L
  [[Inf,  50], ([x,y]) => [[0,   149 - y], R]],
  [[Inf, 100], ([x,y]) => [[y - 50,  100], D]],
  [[Inf, 150], ([x,y]) => [[50,  149 - y], R]],
  [[Inf, 200], ([x,y]) => [[y - 100,   0], D]],
],
[ // U
  [[50,  Inf], ([x,y]) => [[50,   x + 50], R]],
  [[100, Inf], ([x,y]) => [[0,   x + 100], R]],
  [[150, Inf], ([x,y]) => [[x - 100, 199], U]],
]];

const walk_cubic_earth = ([map, instr, start]) =>
  instr.reduce(([p, f], [turn, steps]) => {
    let facing = (f = (f + 4 + turn) % 4);
    let pos, c;
    while ((c = map[p[1]]?.[p[0]]) !== '#' && steps >= 0) {
      if (c) {
        pos = p;
        facing = f;
        steps--;
        p = DIR[facing].map((d, i) => d + p[i]);
      } else {
        [p, f] = wrapping_rules[facing].find(([b]) => p.every((c, i) => c < b[i]))[1](p);
      }
    }
    return [pos, facing];
  }, start);

const part1 = pipe(parse, walk_flat_earth, score);
const part2 = pipe(parse, walk_cubic_earth, score);
const input = readFileSync('input.txt', 'utf8');
console.log(part1(input));
console.log(part2(input));
