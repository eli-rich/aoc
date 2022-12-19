import { readFileSync } from 'fs';

const input = readFileSync('test.txt', 'utf-8').trim();

const shapes = [
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
];

const WIDTH = 7;
const HEIGHT = 15;

const draw = (grid: number[][]) => {
  // if occupied, draw a #, otherwise a .
  return grid.map((row) => row.map((cell) => (cell === 1 ? '#' : '.')).join('')).join('\n');
};

const placeShape = (grid: number[][], shape: number[][], x: number, y: number) => {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      grid[y + i][x + j] = shape[i][j];
    }
  }
  // return the left, right, top, and bottom edges of the shape
  return {
    left: x,
    right: x + Math.max(...shape.map((row) => row.length)) - 1,
    top: y,
    bottom: y + shape.length - 1,
  };
};

const checkLeft = (grid: number[][], shape: number[][], x: number, y: number) => {
  // check if the shape can move left
  // return false if out of bounds
  // or if there is a collision
  if (x === 0) return false;
  for (let i = 0; i < shape.length; i++) {
    if (grid[y + i][x - 1] === 1) return false;
  }
  return true;
};

const checkRight = (grid: number[][], shape: number[][], x: number, y: number) => {
  // check if the shape can move right
  // return false if out of bounds
  // or if there is a collision
  if (x === WIDTH - shape[0].length) return false;
  for (let i = 0; i < shape.length; i++) {
    if (grid[y + i][x + shape[0].length] === 1) return false;
  }
  return true;
};

const checkDown = (grid: number[][], shape: number[][], x: number, y: number) => {
  // check if the shape can move down
  for (let i = 0; i < shape.at(-1)!.length; i++) {
    if (grid[y + shape.length][x + i] === 1) {
      console.log(grid[y + shape.length]);
      console.log(x, i);
      return false;
    }
  }
  return true;
};

const moveLeft = (grid: number[][], shape: number[][], x: number, y: number) => {
  // move the shape left

  // if the shape can move left
  if (checkLeft(grid, shape, x, y)) {
    // clear the shape
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        grid[y + i][x + j] = 0;
      }
    }
    // draw the shape at the new position
    placeShape(grid, shape, x - 1, y);
    return {
      left: x - 1,
      right: x + Math.max(...shape.map((row) => row.length)) - 2,
      top: y,
      bottom: y + shape.length - 1,
    };
  }
  // otherwise, return the same bounds
  return {
    left: x,
    right: x + Math.max(...shape.map((row) => row.length)) - 1,
    top: y,
    bottom: y + shape.length - 1,
  };
};

const moveRight = (grid: number[][], shape: number[][], x: number, y: number) => {
  // move the shape right

  // if the shape can move right
  if (checkRight(grid, shape, x, y)) {
    // clear the shape
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        grid[y + i][x + j] = 0;
      }
    }
    // draw the shape at the new position
    placeShape(grid, shape, x + 1, y);
    return {
      left: x + 1,
      right: x + shape[0].length,
      top: y,
      bottom: y + shape.length - 1,
    };
  }
  return {
    left: x,
    right: x + shape[0].length - 1,
    top: y,
    bottom: y + shape.length - 1,
  };
};

const moveDown = (grid: number[][], shape: number[][], x: number, y: number) => {
  // move the shape down

  // if the shape can move down
  if (checkDown(grid, shape, x, y)) {
    // clear the shape
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        grid[y + i][x + j] = 0;
      }
    }
    // draw the shape at the new position
    placeShape(grid, shape, x, y + 1);
    return {
      left: x,
      right: x + shape[0].length - 1,
      top: y + 1,
      bottom: y + shape.length,
    };
  }
  return {
    left: x,
    right: x + shape[0].length - 1,
    top: y,
    bottom: y + shape.length - 1,
  };
};

const wind = input;

type Bound = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

// set the floor of the grid to be all 1
const grid = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => 0));

for (let i = 0; i < WIDTH; i++) {
  grid[HEIGHT - 1][i] = 1;
}

const simulate = (grid: number[][], rounds: number) => {
  let shapeIndex = 0;
  let windIndex = 0;
  let bounds: Bound | undefined;

  while (rounds > 0) {
    if (!bounds) bounds = placeShape(grid, shapes[shapeIndex], 2, HEIGHT - 5);
    else bounds = placeShape(grid, shapes[shapeIndex], bounds.left, bounds.top - 6);
    while (checkDown(grid, shapes[shapeIndex], bounds.left, bounds.top)) {
      console.log(draw(grid));
      console.log('-------');
      switch (wind[windIndex % wind.length]) {
        case '<':
          bounds = moveLeft(grid, shapes[shapeIndex], bounds.left, bounds.top);
          break;
        case '>':
          bounds = moveRight(grid, shapes[shapeIndex], bounds.left, bounds.top);
          break;
      }
      windIndex++;
      bounds = moveDown(grid, shapes[shapeIndex], bounds.left, bounds.top);
    }
    switch (wind[windIndex % wind.length]) {
      case '<':
        bounds = moveLeft(grid, shapes[shapeIndex], bounds.left, bounds.top);
        break;
      case '>':
        bounds = moveRight(grid, shapes[shapeIndex], bounds.left, bounds.top);
        break;
    }
    windIndex++;
    rounds--;
    shapeIndex++;
  }
};

simulate(grid, 3);

console.log(draw(grid));
