import { readFileSync as r } from 'node:fs';

const [stackInput, stepInput] = r('./input.txt', 'utf-8').replaceAll('\r', '').split('\n\n');

// THANK YOU LEBSTER
const stacks = stackInput
  .split('\n')
  .slice(0, -1)
  .map((line) =>
    line
      .replaceAll('    ', '-')
      .replaceAll(' ', '')
      .replaceAll('[', '')
      .replaceAll(']', '')
      .split(''),
  )
  .reduce((stacks, stack) => {
    for (let i = 0; i < stack.length; i++) {
      if (!stacks[i]) stacks[i] = [];
      if (stack[i] === '-') continue;
      stacks[i].push(stack[i]);
    }
    return stacks;
  }, []);
const stacks2 = JSON.parse(JSON.stringify(stacks));

const result = stepInput
  .split('\n')
  .map((line) => line.match(/move (\d+) from (\d+) to (\d+)/))
  .filter((match) => match != null)
  .map(([, quantity, from, to]) => ({
    quantity: Number(quantity),
    from: Number(from - 1),
    to: Number(to - 1),
  }))
  .forEach((step) => {
    const { quantity, from, to } = step;
    for (let i = 0; i < quantity; i++) {
      const crate = stacks[from].shift();
      stacks[to].unshift(crate);
    }
    const crates = stacks2[from].splice(0, quantity);
    stacks2[to].unshift(...crates);
  });

console.log(stacks.map((stack) => stack[0]).join(''));
console.log(stacks2.map((stack) => stack[0]).join(''));
