import { readFile } from 'node:fs/promises';

const input = await readFile('./input.txt', 'utf-8');
const lines = input.split('\n');

let prev = -1;
let increments = 0;

for (const line of lines) {
  const cur = parseInt(line.trim());
  if (prev === -1) {
    prev = cur;
    continue;
  }
  if (cur > prev) {
    increments++;
  }
  prev = cur;
}

let prev2 = -1;
let increments2 = 0;
for (let i = 0; i < lines.length; i++) {
  const window = [lines[i], lines[i + 1], lines[i + 2]]
    .filter((line) => line !== undefined)
    .map((line) => parseInt(line.trim()))
    .reduce((a, s) => (a += s), 0);
  if (prev2 === -1) {
    prev2 = window;
    continue;
  }
  if (window > prev2) {
    increments2++;
  }
  prev2 = window;
}

console.log(increments);
console.log(increments2);
