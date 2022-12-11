import { readFileSync } from 'node:fs';

const input = readFileSync('input.txt', 'utf-8').trim().split('\n\n');

type Operation = string;

type Test = {
  number: bigint;
  true: number;
  false: number;
};

type Monkey = {
  id: number;
  inspections: number;
  items: bigint[];
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
    .filter((x) => !isNaN(x))
    .map((x) => BigInt(x));
  let opValue = lines[2].split(' ').slice(5, 8).join(' ');
  const operation: Operation = opValue;
  const test: Test = {
    number: lines[3]
      .split(' ')
      .map((x) => parseInt(x))
      .filter((x) => !isNaN(x))
      .map((x) => BigInt(x))[0],
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

const MOD = monkeys.map((monkey) => monkey.test.number).reduce((a, b) => a * b);

const evalExpr = (expr: string, worry: bigint): bigint => {
  let old = worry;
  let newWorry = 0n;
  const [, op, value] = expr.split(' ');
  if (!isNaN(parseInt(value))) {
    newWorry = BigInt(parseInt(value));
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
  return -1n;
};

const inspect = (monkey: Monkey, itemIndex: number) => {
  monkey.inspections += 1;
  monkey.items[itemIndex] = evalExpr(monkey.operation, monkey.items[itemIndex]);
};

const test = (monkey: Monkey, itemIndex: number) => {
  const item = monkey.items[itemIndex];
  return item % monkey.test.number === 0n;
};

const throwItem = (to: number, item: bigint) => {
  const monkey = monkeys.find((monkey) => monkey.id === to)!;
  monkey.items.push(item % MOD);
};

const getTop2 = (monkeys: Monkey[]) => {
  const sorted = monkeys.sort((a, b) => b.inspections - a.inspections);
  return [sorted[0], sorted[1]];
};

const ROUND_NUMBER = 10_000;

for (let i = 0; i < ROUND_NUMBER; i++) {
  for (const monkey of monkeys) {
    while (monkey.items.length > 0) {
      inspect(monkey, 0);
      const item = monkey.items[0];
      if (test(monkey, 0)) throwItem(monkey.test.true, item);
      else throwItem(monkey.test.false, item);
      monkey.items.shift();
    }
  }
}

const [top1, top2] = getTop2(monkeys);

export default top1.inspections * top2.inspections;
