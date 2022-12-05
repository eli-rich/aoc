import { readFile } from 'node:fs/promises';

const input = await readFile('test.txt', 'utf8');

console.log(input);
