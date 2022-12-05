import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf-8');
const lines = input.split('\n');

const stacks = [
  [...'QHCTNSVB'],
  [...'GBDQ'],
  [...'BQSTRWF'],
  [...'NDJZSWGL'],
  [...'FVDPM'],
  [...'JWF'],
  [...'VJBQNL'],
  [...'NSQJCRTG'],
  [...'MDWCQSJ'],
];

const stacks2 = [
  [...'QHCTNSVB'],
  [...'GBDQ'],
  [...'BQSTRWF'],
  [...'NDJZSWGL'],
  [...'FVDPM'],
  [...'JWF'],
  [...'VJBQNL'],
  [...'NSQJCRTG'],
  [...'MDWCQSJ'],
];

const steps = lines
  .map((line) => line.match(/move (\d+) from (\d+) to (\d+)/))
  .filter((match) => match != null)
  .map(([, quantity, from, to]) => ({
    quantity: Number(quantity),
    from: Number(from - 1),
    to: Number(to - 1),
  }));

for (const step of steps) {
  const { quantity, from, to } = step;
  for (let i = 0; i < quantity; i++) {
    const crate = stacks[from].shift();
    stacks[to].unshift(crate);
  }
}
let output = '';
for (const stack of stacks) {
  output += stack.shift();
}

for (const step of steps) {
  const { quantity, from, to } = step;
  const crates = stacks2[from].splice(0, quantity);
  stacks2[to].unshift(...crates);
}
let output2 = '';
for (const stack of stacks2) {
  output2 += stack.shift();
}

console.log(output);
console.log(output2);
