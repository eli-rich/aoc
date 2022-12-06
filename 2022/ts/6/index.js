import { readFileSync } from 'node:fs';

const input = readFileSync('input.txt', 'utf8');

let l4 = [];
for (let i = 0; i < input.length; i++) {
  l4.push(input[i]);
  if (l4.length > 4) {
    l4.shift();
  }
  if (new Set(l4).size === 4) {
    console.log(i + 1);
    break;
  }
}
let l14 = [];
for (let i = 0; i < input.length; i++) {
  l14.push(input[i]);
  if (l14.length > 14) {
    l14.shift();
  }
  if (new Set(l14).size === 14) {
    console.log(i + 1);
    break;
  }
}
