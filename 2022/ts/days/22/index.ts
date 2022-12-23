import { Dir, readFileSync } from 'fs';

const [mapInput, directions] = readFileSync('input.txt', 'utf-8').split('\n\n');

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

const player = {
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
