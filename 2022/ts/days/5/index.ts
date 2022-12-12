import { readFileSync } from 'node:fs';

const [stackInput, stepInput] = readFileSync('./days/5/input.txt', 'utf-8')
  .replaceAll('\r', '')
  .split('\n\n');

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
  .reduce((stacks: string[][], stack: string[]) => {
    for (let i = 0; i < stack.length; i++) {
      if (!stacks[i]) stacks[i] = [];
      if (stack[i] === '-') continue;
      stacks[i].push(stack[i]);
    }
    return stacks;
  }, []);
const stacks2: string[][] = JSON.parse(JSON.stringify(stacks));

stepInput
  .split('\n')
  .map((line) => line.match(/move (\d+) from (\d+) to (\d+)/))
  .filter((match) => match !== null)
  // @ts-ignore
  .map(([, quantity, from, to]) => ({
    quantity: Number(quantity),
    from: Number(from - 1),
    to: Number(to - 1),
  }))
  .forEach((step) => {
    const { quantity, from, to } = step;
    for (let i = 0; i < quantity; i++) {
      const crate = stacks[from].shift();
      stacks[to].unshift(crate!);
    }
    const crates = stacks2[from].splice(0, quantity);
    stacks2[to].unshift(...crates);
  });

const answer = {
  part1: stacks.map((stack) => stack[0]).join(''),
  part2: stacks2.map((stack) => stack[0]).join(''),
  day: 5,
};

export default answer;
