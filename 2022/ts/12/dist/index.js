import { readFileSync } from 'node:fs';
const input = readFileSync('test.txt', 'utf-8').trim().split('\n');
const grid = input.map((line) => line.split(''));
console.log(grid);
//# sourceMappingURL=index.js.map