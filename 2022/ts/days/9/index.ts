import { readFileSync } from 'fs';

const input = readFileSync('input.txt', 'utf8').split('\n');

type Pos = {
  x: number;
  y: number;
};

const head: Pos = {
  x: 0,
  y: 0,
};

const tail: Pos = {
  x: 0,
  y: 0,
};

const positions: Pos[] = [];

const getTouching = (pos: Pos): Pos[] => {
  return [
    { x: pos.x + 1, y: pos.y },
    { x: pos.x - 1, y: pos.y },
    { x: pos.x, y: pos.y + 1 },
    { x: pos.x, y: pos.y - 1 },
    { x: pos.x + 1, y: pos.y + 1 },
    { x: pos.x - 1, y: pos.y - 1 },
    { x: pos.x + 1, y: pos.y - 1 },
    { x: pos.x - 1, y: pos.y + 1 },
  ];
};

const moveOneAtATime = (dir: string, dist: number) => {
  for (let i = 0; i < dist; i++) {
    switch (dir) {
      case 'U':
        head.y++;
        break;
      case 'D':
        head.y--;
        break;
      case 'L':
        head.x--;
        break;
      case 'R':
        head.x++;
        break;
    }
    // if the tail no longer touches the head, including diagonals
    // move the tail forward
    if (!getTouching(head).some((pos) => pos.x === tail.x && pos.y === tail.y)) {
      // move tail to touch head, prefer diagonal if needed
      if (head.x > tail.x) tail.x++;
      if (head.x < tail.x) tail.x--;
      if (head.y > tail.y) tail.y++;
      if (head.y < tail.y) tail.y--;
    }
    // if the tail is not already in the list of positions
    // add it to the list
    if (!positions.some((pos) => pos.x === tail.x && pos.y === tail.y)) {
      positions.push({ x: tail.x, y: tail.y });
    }
  }
};

for (const line of input) {
  const split = line.split(' ');
  const dir = split[0];
  const dist = parseInt(split[1], 10);
  moveOneAtATime(dir, dist);
}
console.log(positions.length);

const positions2: Pos[] = [];
const nodes: Pos[] = Array.from({ length: 10 }, () => ({ x: 0, y: 0 }));
const head2 = nodes[0];
const tail2 = nodes[nodes.length - 1];

const updateNode = (node: Pos, next: Pos) => {
  if (!getTouching(node).some((pos) => pos.x === next.x && pos.y === next.y)) {
    // move tail to touch head, prefer diagonal if needed
    if (next.x > node.x) node.x++;
    if (next.x < node.x) node.x--;
    if (next.y > node.y) node.y++;
    if (next.y < node.y) node.y--;
  }
};

for (const line of input) {
  const split = line.split(' ');
  const dir = split[0];
  const dist = parseInt(split[1], 10);
  for (let i = 0; i < dist; i++) {
    switch (dir) {
      case 'U':
        head2.y++;
        break;
      case 'D':
        head2.y--;
        break;
      case 'L':
        head2.x--;
        break;
      case 'R':
        head2.x++;
        break;
    }
    for (let j = 0; j < nodes.length - 1; j++) {
      updateNode(nodes[j + 1], nodes[j]);
    }
    // add the tail to the list of positions
    if (!positions2.some((pos) => pos.x === tail2.x && pos.y === tail2.y)) {
      positions2.push({ x: tail2.x, y: tail2.y });
    }
  }
}

console.log(positions2.length);
