import { readFileSync } from 'fs';
const input = readFileSync('input.txt', 'utf-8');
const [mapInput, directions] = input.split('\n\n');

type Square = {
  row: number;
  col: number;
  type: 'open' | 'wall' | 'empty';
};

const map = mapInput
  .split('\n')
  .map((row, rowN) => {
    const sqrs = row.split('');
    return sqrs.map((sqr, col) => {
      return {
        row: rowN + 1,
        col: col + 1,
        type: sqr === '.' ? 'open' : sqr === '#' ? 'wall' : 'empty',
      };
    });
  })
  .flat() as Square[];

type Facing = '>' | '<' | '^' | 'v';

type Player = {
  row: number;
  col: number;
  facing: Facing;
};

type Direction = 'R' | 'L';

const dirs = directions.split(/\d/).filter(s => s !== '');
const steps = directions.split(/[^\d]/).filter(s => s !== '');

const instructions: Array<Direction | number> = [];

for (let i = 0; i < steps.length; i++) {
  instructions.push(Number(steps[i]));
  if (dirs[i]) instructions.push(dirs[i] as Direction);
}

const moveMap = new Map<string, Facing>();

const render = (map: Square[], player: Player) => {
  let result = '';
  for (const square of map) {
    if (square.row === player.row && square.col === player.col) {
      result += 'X';
      continue;
    }

    if (square.col === 1 && square.row !== 1) result += '\n';
    if (moveMap.has(`${square.row},${square.col}`)) {
      result += moveMap.get(`${square.row},${square.col}`);
      continue;
    }
    if (square.type === 'empty') {
      result += ' ';
    } else {
      result += square.type === 'open' ? '.' : '#';
    }
  }
  return result;
};

let player = {
  row: 1,
  col: map.find(s => s.type === 'open' && s.row === 1)!.col,
  facing: '>',
} as Player;

const follow = (instructions: Array<Direction | number>, player: Player) => {
  // player follows the instructions
  // cannot move through walls
  // if player goes off the map, they wrap to the next row/column that is not empty
  for (const instruction of instructions) {
    if (typeof instruction === 'number') {
      // move
      for (let i = 0; i < instruction; i++) {
        moveMap.set(`${player.row},${player.col}`, player.facing);

        let nextRow = player.row;
        let nextCol = player.col;
        if (player.facing === '>') nextCol++;
        else if (player.facing === 'v') nextRow++;
        else if (player.facing === '<') nextCol--;
        else if (player.facing === '^') nextRow--;

        let nextSquare = map.find(s => s.row === nextRow && s.col === nextCol);
        if (nextSquare === undefined || nextSquare.type === 'empty') {
          // wrap
          if (player.facing === '>') {
            const legalSquares = map.filter(s => s.row === player.row && s.type !== 'empty');
            nextSquare = legalSquares[0];
          } else if (player.facing === '<') {
            const legalSquares = map.filter(s => s.row === player.row && s.type !== 'empty');
            nextSquare = legalSquares[legalSquares.length - 1];
          } else if (player.facing === 'v') {
            const legalSquares = map.filter(s => s.col === player.col && s.type !== 'empty');
            nextSquare = legalSquares[0];
          } else if (player.facing === '^') {
            const legalSquares = map.filter(s => s.col === player.col && s.type !== 'empty');
            nextSquare = legalSquares[legalSquares.length - 1];
          }
        }
        if (nextSquare!.type === 'wall') break;
        player.row = nextSquare!.row;
        player.col = nextSquare!.col;
      }
    } else {
      // turn
      if (instruction === 'R') {
        if (player.facing === '>') player.facing = 'v';
        else if (player.facing === 'v') player.facing = '<';
        else if (player.facing === '<') player.facing = '^';
        else if (player.facing === '^') player.facing = '>';
      } else {
        if (player.facing === '>') player.facing = '^';
        else if (player.facing === '^') player.facing = '<';
        else if (player.facing === '<') player.facing = 'v';
        else if (player.facing === 'v') player.facing = '>';
      }
    }
  }
};

follow(instructions, player);
// console.log(render(map, player));

const faceScore = {
  '>': 0,
  v: 1,
  '<': 2,
  '^': 3,
};

const score = player.row * 1000 + player.col * 4 + faceScore[player.facing];
console.log('row:', player.row, 'col:', player.col, 'facing:', player.facing, 'score:', score);

// part 2
// https://gist.github.com/p-a/1bcbeb838bd98e9db3b8b0ba3287d0a0

const [R, D, L, U] = [0, 1, 2, 3];

const wrapper = [
  [
    // R
    [[Infinity, 50], ([x, y]) => [[99, 149 - y], L]],
    [[Infinity, 100], ([x, y]) => [[y + 50, 49], U]],
    [[Infinity, 150], ([x, y]) => [[149, 149 - y], L]],
    [[Infinity, 200], ([x, y]) => [[y - 100, 149], U]],
  ],
  [
    // D
    [[50, Infinity], ([x, y]) => [[x + 100, 0], D]],
    [[100, Infinity], ([x, y]) => [[49, x + 100], L]],
    [[150, Infinity], ([x, y]) => [[99, x - 50], L]],
  ],
  [
    // L
    [[Infinity, 50], ([x, y]) => [[0, 149 - y], R]],
    [[Infinity, 100], ([x, y]) => [[y - 50, 100], D]],
    [[Infinity, 150], ([x, y]) => [[50, 149 - y], R]],
    [[Infinity, 200], ([x, y]) => [[y - 100, 0], D]],
  ],
  [
    // U
    [[50, Infinity], ([x, y]) => [[50, x + 50], R]],
    [[100, Infinity], ([x, y]) => [[0, x + 100], R]],
    [[150, Infinity], ([x, y]) => [[x - 100, 199], U]],
  ],
];

const DIR = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const pipe =
  (...fns) =>
  v =>
    fns.reduce((a, f) => f(a), v);

const parse = (input: string) => {
  const g = input.split('\n\n');
  const map = g[0].split('\n').map(line => line.split('').map(c => c.trim()));
  const instr = [...('R' + g[1]).matchAll(/(([LR])(\d+))/g)]
    .map(([, , a, b]) => [a, b])
    .map(([a, b]) => [a === 'L' ? -1 : 1, Number(b)]);
  return [map, instr, [[map[0].findIndex(c => c === '.'), 0], -1], [map[0].length, map.length]];
};

const followCube = ([map, instr, start]) =>
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
        [p, f] = wrapper[facing].find(([b]) => p.every((c, i) => c < b[i]))[1](p);
      }
    }
    return [pos, facing];
  }, start);

const scorer = ([[col, row], facing]) => 1000 * (row + 1) + 4 * (col + 1) + facing;
const score2 = pipe(parse, followCube, scorer);

console.log(score2(input));
