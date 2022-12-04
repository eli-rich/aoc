import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf-8');

const lines = input.trim().split('\n');

const ranges = lines.map((line) => line.split(',').map((range) => range.split('-').map(Number)));

const part1 = ranges.reduce((count, [left, right]) => {
  const [leftStart, leftEnd] = left;
  const [rightStart, rightEnd] = right;
  if (
    (leftStart <= rightStart && leftEnd >= rightEnd) ||
    (rightStart <= leftStart && rightEnd >= leftEnd)
  ) {
    count++;
  }
  return count;
}, 0);

const part2 = ranges.reduce((count, [left, right]) => {
  const [leftStart, leftEnd] = left;
  const [rightStart, rightEnd] = right;
  if (
    (leftStart <= rightEnd && leftEnd >= rightStart) ||
    (rightStart <= leftEnd && rightEnd >= leftStart)
  ) {
    count++;
  }
  return count;
}, 0);

console.log(part1);
console.log(part2);
