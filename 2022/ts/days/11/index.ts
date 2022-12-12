import { readFileSync } from 'node:fs';

const input = readFileSync('./days/11/input.txt', 'utf-8').trim().split('\n\n');

type Operation = string;

type Test = {
  number: number;
  true: number;
  false: number;
};

type Monkey = {
  id: number;
  inspections: number;
  items: number[];
  operation: Operation;
  test: Test;
};

// parse input
const monkeys: Monkey[] = [];

for (const chunk of input) {
  const lines = chunk.split('\n');
  const id = parseInt(lines[0].split(' ')[1]);
  const startItems = lines[1]
    .split(' ')
    .map((x) => parseInt(x))
    .filter((x) => !isNaN(x));
  const operation: Operation = lines[2].split(' ').slice(5, 8).join(' ');
  const test: Test = {
    number: lines[3]
      .split(' ')
      .map((x) => parseInt(x))
      .filter((x) => !isNaN(x))[0],
    true: lines[4]
      .split(' ')
      .map((x) => parseInt(x))
      .filter((x) => !isNaN(x))[0],
    false: lines[5]
      .split(' ')
      .map((x) => parseInt(x))
      .filter((x) => !isNaN(x))[0],
  };
  monkeys.push({ id, items: startItems, operation, test, inspections: 0 });
}

const clonedMonkeys: Monkey[] = JSON.parse(JSON.stringify(monkeys));

const MOD = monkeys.map((monkey) => monkey.test.number).reduce((a, b) => a * b);

const evalExpr = (expr: string, worry: number): number => {
  let old = worry;
  let newWorry = 0;
  const [, op, value] = expr.split(' ');
  if (!isNaN(parseInt(value))) {
    newWorry = parseInt(value);
    switch (op) {
      case '+':
        return old + newWorry;
      case '*':
        return old * newWorry;
    }
  }
  switch (op) {
    case '+':
      return old + worry;
    case '*':
      return old * worry;
  }
  return -1;
};

const inspect = (monkey: Monkey, itemIndex: number, divideThree: boolean = true) => {
  monkey.inspections++;
  monkey.items[itemIndex] = evalExpr(monkey.operation, monkey.items[itemIndex]);
  if (divideThree) monkey.items[itemIndex] = Math.floor(monkey.items[itemIndex] / 3);
};

const test = (monkey: Monkey, itemIndex: number) => {
  const item = monkey.items[itemIndex];
  return item % monkey.test.number === 0;
};

const throwItem = (to: number, item: number, monkeys: Monkey[]) => {
  const monkey = monkeys.find((monkey) => monkey.id === to)!;
  monkey.items.push(item % MOD);
};

const getTop2 = (monkeys: Monkey[]) => {
  const sorted = monkeys.sort((a, b) => b.inspections - a.inspections);
  return [sorted[0], sorted[1]];
};

const ROUND_NUMBER = 20;

for (let i = 0; i < ROUND_NUMBER; i++) {
  for (const monkey of monkeys) {
    while (monkey.items.length > 0) {
      inspect(monkey, 0);
      const item = monkey.items[0];
      if (test(monkey, 0)) throwItem(monkey.test.true, item, monkeys);
      else throwItem(monkey.test.false, item, monkeys);
      monkey.items.shift();
    }
  }
}
const [top1, top2] = getTop2(monkeys);

const ROUND_NUMBER2 = 10_000;

for (let i = 0; i < ROUND_NUMBER2; i++) {
  for (const monkey of clonedMonkeys) {
    while (monkey.items.length > 0) {
      inspect(monkey, 0, false);
      const item = monkey.items[0];
      if (test(monkey, 0)) throwItem(monkey.test.true, item, clonedMonkeys);
      else throwItem(monkey.test.false, item, clonedMonkeys);
      monkey.items.shift();
    }
  }
}

const [secondTop1, secondTop2] = getTop2(clonedMonkeys);

const answer = {
  part1: top1.inspections * top2.inspections,
  part2: secondTop1.inspections * secondTop2.inspections,
  day: 11,
};

export default answer;
