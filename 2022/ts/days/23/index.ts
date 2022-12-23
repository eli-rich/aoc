import { readFileSync } from 'node:fs';

const input = readFileSync('input.txt', 'utf-8').trim().split('\n');

type Point = {
  x: number;
  y: number;
};

type Proposal = {
  point: Point;
  elves: Elf[];
};

type Elf = {
  point: Point;
  proposal: Proposal | null;
};

let minX = 0;
let maxX = input[0].length - 1;
let minY = 0;
let maxY = input.length - 1;

let grid: string[][] = input.map(line => line.split(''));

let elves: Elf[] = [];
let proposals: Proposal[] = [];

for (let y = minY; y <= maxY; y++) {
  for (let x = minX; x <= maxX; x++) {
    if (grid[y][x] === '#') {
      elves.push({
        point: { x, y },
        proposal: null,
      });
      grid[y][x] = '#';
    }
  }
}

const update = (grid: string[][]) => {
  // move the '#' in the grid to the correct elf position
  for (const row of grid) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '#') {
        row[i] = '.';
      }
    }
  }
  for (const elf of elves) {
    grid[elf.point.y][elf.point.x] = '#';
  }
};

const render = (grid: string[][]) => {
  console.log(grid.map(row => row.join('')).join('\n'));
};

const getNeighbors = (point: Point): Point[] => {
  return [
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x, y: point.y - 1 },
    { x: point.x, y: point.y + 1 },
    { x: point.x - 1, y: point.y - 1 },
    { x: point.x + 1, y: point.y - 1 },
    { x: point.x - 1, y: point.y + 1 },
    { x: point.x + 1, y: point.y + 1 },
  ];
};

const tryNorth = (neighbors: Point[]) => {
  const northNeighbors = [neighbors[2], neighbors[4], neighbors[5]];

  for (const neighbor of northNeighbors) {
    // make sure no other elf is in the way
    if (elves.find(elf => elf.point.x === neighbor.x && elf.point.y === neighbor.y)) {
      return false;
    }
  }
  return true;
};

const trySouth = (neighbors: Point[]) => {
  const southNeighbors = [neighbors[3], neighbors[6], neighbors[7]];
  for (const neighbor of southNeighbors) {
    // make sure no other elf is in the way
    if (elves.find(elf => elf.point.x === neighbor.x && elf.point.y === neighbor.y)) {
      return false;
    }
  }
  return true;
};

const tryWest = (neighbors: Point[]) => {
  const westNeighbors = [neighbors[0], neighbors[4], neighbors[6]];

  for (const neighbor of westNeighbors) {
    // make sure no other elf is in the way
    if (elves.find(elf => elf.point.x === neighbor.x && elf.point.y === neighbor.y)) {
      return false;
    }
  }
  return true;
};

const tryEast = (neighbors: Point[]) => {
  const eastNeighbors = [neighbors[1], neighbors[5], neighbors[7]];

  for (const neighbor of eastNeighbors) {
    // make sure no other elf is in the way
    if (elves.find(elf => elf.point.x === neighbor.x && elf.point.y === neighbor.y)) {
      return false;
    }
  }
  return true;
};

const tryOrder = [
  {
    name: 'north',
    func: tryNorth,
  },
  {
    name: 'south',
    func: trySouth,
  },
  {
    name: 'west',
    func: tryWest,
  },
  {
    name: 'east',
    func: tryEast,
  },
];

const noNeighbors = (neighbors: Point[]) => {
  for (const neighbor of neighbors) {
    if (elves.find(elf => elf.point.x === neighbor.x && elf.point.y === neighbor.y)) {
      return false;
    }
  }
  return true;
};

const half1 = () => {
  for (const elf of elves) {
    let propDir = '';
    const neighbors = getNeighbors(elf.point);
    // check north, north east, and north west
    if (noNeighbors(neighbors)) continue;
    for (const tryDir of tryOrder) {
      if (tryDir.func(neighbors)) {
        propDir = tryDir.name;
        break;
      }
    }

    if (propDir === '') continue;

    const proposal: Proposal = {
      point: { x: -Infinity, y: -Infinity },
      elves: [],
    };
    switch (propDir) {
      case 'north':
        proposal.point = { x: elf.point.x, y: elf.point.y - 1 };
        break;
      case 'south':
        proposal.point = { x: elf.point.x, y: elf.point.y + 1 };
        break;
      case 'west':
        proposal.point = { x: elf.point.x - 1, y: elf.point.y };
        break;
      case 'east':
        proposal.point = { x: elf.point.x + 1, y: elf.point.y };
        break;
    }
    const prop = proposals.find(
      prop => prop.point.x === proposal.point.x && prop.point.y === proposal.point.y,
    );
    if (prop) {
      prop.elves.push(elf);
      elf.proposal = prop;
      continue;
    }
    proposal.elves.push(elf);
    elf.proposal = proposal;
    proposals.push(proposal);
  }
};

const half2 = () => {
  let someMoved = false;
  for (const proposal of proposals) {
    if (proposal.elves.length === 1) {
      someMoved = true;
      proposal.elves[0].point = { ...proposal.point };
    }
  }
  // grow grid around elves if needed
  // must account for negative numbers
  const minX = Math.min(...elves.map(elf => elf.point.x));
  const minY = Math.min(...elves.map(elf => elf.point.y));

  if (minX < 0) {
    for (const row of grid) {
      row.unshift('.');
    }
    for (const elf of elves) {
      elf.point.x += 1;
    }
  }
  if (minY < 0) {
    const newRow = new Array(grid[0].length).fill('.');
    grid.unshift(newRow);
    for (const elf of elves) {
      elf.point.y += 1;
    }
  }
  const maxX = Math.max(...elves.map(elf => elf.point.x));
  const maxY = Math.max(...elves.map(elf => elf.point.y));
  if (maxX >= grid[0].length) {
    for (const row of grid) {
      row.push('.');
    }
  }
  if (maxY >= grid.length) {
    const newRow = new Array(grid[0].length).fill('.');
    grid.push(newRow);
  }
  return someMoved;
};

const countEmpty = (grid: string[][]) => {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === '.') count++;
    }
  }
  return count;
};

let rounds = 10;
for (let i = 0; i < rounds; i++) {
  // start round
  half1();
  half2();
  proposals = [];
  const tried = tryOrder.shift()!;
  tryOrder.push(tried);
  // end round
  update(grid);
  // console.log('');
  // render(grid);
  // console.log('');
}

console.log(countEmpty(grid));

// part 2

// find the first round where the grid is the same as a previous round
let round = 1;
while (true) {
  round++;
  // start round
  half1();
  const someMoved = half2();
  if (someMoved === false) {
    break;
  }
  proposals = [];
  const tried = tryOrder.shift()!;
  tryOrder.push(tried);
  // end round
  update(grid);
}

console.log(round + 9);
