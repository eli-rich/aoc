import { readFileSync } from 'node:fs';

const input = readFileSync('./days/14/input.txt', 'utf-8').trim();

type Point = {
  x: number;
  y: number;
  sand?: boolean;
  segment?: boolean;
};

type Line = {
  start: Point;
  end: Point;
};

type Grid = Point[][];

const segments = input
  .split('\n')
  .map((line) => line.split('->').map((pair) => pair.split(',').map((n) => Number(n))))
  .map((pairs) => pairs.map(([x, y]) => ({ x: x, y: -y })))
  .reduce((seg, points) => {
    for (let i = 0; i < points.length - 1; i++) {
      seg.push({
        start: points[i],
        end: points[i + 1],
      });
    }
    return seg;
  }, [] as Line[]);

const grid: Grid = [];
// find smallest x and y
const minX =
  segments.reduce((min, { start, end }) => {
    if (start.x < min) min = start.x;
    if (end.x < min) min = end.x;
    return min;
  }, Infinity) - 154;

const maxX =
  segments.reduce((max, { start, end }) => {
    if (start.x > max) max = start.x;
    if (end.x > max) max = end.x;
    return max;
  }, -Infinity) + 154;

const minY =
  segments.reduce((min, { start, end }) => {
    if (start.y < min) min = start.y;
    if (end.y < min) min = end.y;
    return min;
  }, Infinity) - 2;

const maxY =
  segments.reduce((max, { start, end }) => {
    if (start.y > max) max = start.y;
    if (end.y > max) max = end.y;
    return max;
  }, -Infinity) + 2;

segments.push({
  start: {
    x: minX,
    y: minY,
  },
  end: {
    x: maxX,
    y: minY,
  },
});
// fill grid with points from min to max
for (let j = Math.min(minY, 0); j <= Math.max(maxY, 0); j++) {
  for (let i = Math.min(minX, 500); i <= Math.max(maxX, 500); i++) {
    if (grid[j] === undefined) grid[j] = [];
    grid[j][i] = { x: i, y: j };
  }
}

const drawSegments = (segments: Line[], grid: Grid) => {
  for (let i = 0; i < segments.length; i++) {
    const { start, end } = segments[i];
    let x1 = start.x;
    let y1 = start.y;
    const x2 = end.x;
    const y2 = end.y;
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    let e2;
    while (true) {
      const point = grid[y1][x1];
      if (point) point.segment = true;
      if (x1 === x2 && y1 === y2) break;
      e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }
};

const draw = (grid: Grid) => {
  let str = '';
  for (let j = minY; j <= maxY; j++) {
    for (let i = minX; i <= maxX; i++) {
      const point = grid[j][i];
      if (point === undefined) continue;
      if (point.segment) str += '#';
      else if (point.sand) str += 'o';
      else str += ' ';
    }
    str += '\n';
  }
  // reverse y axis
  const lines = str.split('\n');
  lines.reverse();
  return lines.join('\n');
};

drawSegments(segments, grid);

const belowOccupied = (grid: Grid, point: Point) => {
  const below = grid[point.y - 1];
  const bLeft = below[point.x - 1];
  const bRight = below[point.x + 1];
  const bCenter = below[point.x];
  if (
    (bLeft.sand || bLeft.segment) &&
    (bRight.sand || bRight.segment) &&
    (bCenter.sand || bCenter.segment)
  )
    return true;
  return false;
};

let abyss = false;
const fall = (grid: Grid, sand: Point) => {
  while (true) {
    if (sand.y === minY + 1) abyss = true;
    const below = grid[sand.y - 1];
    if (sand.x === 500 && sand.y === 0 && belowOccupied(grid, sand)) {
      return true;
    }
    if (!below[sand.x].sand && !below[sand.x].segment) {
      sand.y -= 1;
    } else if (below[sand.x].sand || below[sand.x].segment) {
      // check left
      if (!below[sand.x - 1].sand && !below[sand.x - 1].segment) {
        sand.y -= 1;
        sand.x -= 1;
      } else if (!below[sand.x + 1].sand && !below[sand.x + 1].segment) {
        // check right
        sand.y -= 1;
        sand.x += 1;
      } else {
        grid[sand.y][sand.x].sand = true;
        break;
      }
    }
  }
};

const spawn = { x: 500, y: 0, sand: true };
let p1 = 0;
let p2 = 0;
let echoed = false;
for (let i = 0; i < 100_000; i++) {
  let isFilled = fall(grid, { ...spawn });
  if (abyss && !echoed) {
    p1 = i;
    echoed = true;
  }
  if (isFilled) {
    p2 = i + 1;
    break;
  }
}

const answer = {
  part1: p1,
  part2: p2,
  day: 14,
};

export default answer;
