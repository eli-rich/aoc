import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf-8');

const lines = input.split('\n');

let horizontal = 0;
let depth = 0;

for (const line of lines) {
  const [command, value] = line.split(' ');
  const val = parseInt(value);
  switch (command) {
    case 'forward':
      horizontal += val;
      break;
    case 'down':
      depth += val;
      break;
    case 'up':
      depth -= val;
      break;
  }
}

let horizontal2 = 0;
let depth2 = 0;
let aim = 0;

for (const line of lines) {
  const [command, value] = line.split(' ');
  const val = parseInt(value);
  switch (command) {
    case 'forward':
      horizontal2 += val;
      depth2 += aim * val;
      break;
    case 'down':
      aim += val;
      break;
    case 'up':
      aim -= val;
      break;
  }
}

console.log(horizontal * depth);

console.log(horizontal2 * depth2);
