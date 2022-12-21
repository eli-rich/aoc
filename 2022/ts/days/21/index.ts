import { readFileSync } from 'fs';

type Operation = {
  op?: '+' | '*' | '/' | '-';
  left?: string;
  right?: string;
  base?: number;
};

type Monkey = {
  name: string;
  resolvedValue: number | null;
  operation: Operation;
};

const input = readFileSync('input.txt', 'utf-8').trim();

const monkeys: Monkey[] = input.split('\n').map(line => {
  const spaces = line.split(' ');
  const name = spaces[0].slice(0, -1);
  let left: string | undefined;
  let right: string | undefined;
  let op: '+' | '*' | '/' | '-' | undefined;
  let base: string | undefined;
  if (spaces.length !== 2) {
    left = spaces[1];
    op = spaces[2] as '+' | '*' | '/' | '-';
    right = spaces[3];
  } else {
    base = spaces[1];
  }
  let operation: Operation;
  if (op && left && right) {
    operation = {
      op,
      left,
      right,
    };
  } else {
    operation = {
      base: parseInt(base!),
    };
  }
  return {
    name,
    resolvedValue: null,
    operation,
  } satisfies Monkey;
});

const monkeyMap = new Map<string, number>();

for (const monkey of monkeys) {
  // resolve base values
  if (monkey.operation.base !== undefined) {
    monkey.resolvedValue = monkey.operation.base;
    monkeyMap.set(monkey.name, monkey.resolvedValue);
  }
}

const resolve = (monkey: Monkey) => {
  if (monkeyMap.has(monkey.name)) return monkeyMap.get(monkey.name)!;

  let left = monkey.operation.left!;
  let right = monkey.operation.right!;
  let leftVal: number | undefined;
  let rightVal: number | undefined;
  if (monkeyMap.has(left)) leftVal = monkeyMap.get(left)!;
  else leftVal = resolve(monkeys.find(m => m.name === monkey.operation.left)!);
  if (monkeyMap.has(right)) rightVal = monkeyMap.get(right)!;
  else rightVal = resolve(monkeys.find(m => m.name.trim() === monkey.operation.right)!);
  switch (monkey.operation.op) {
    case '+':
      monkey.resolvedValue = leftVal! + rightVal!;
      break;
    case '-':
      monkey.resolvedValue = leftVal! - rightVal!;
      break;
    case '*':
      monkey.resolvedValue = leftVal! * rightVal!;
      break;
    case '/':
      monkey.resolvedValue = leftVal! / rightVal!;
      break;
  }
  monkeyMap.set(monkey.name, monkey.resolvedValue!);
  return monkey.resolvedValue!;
};

const rootVal = resolve(monkeys.find(m => m.name === 'root')!);
console.log(rootVal);

// part 2
// reset monkey map
for (const monkey of monkeys) {
  // resolve base values
  if (monkey.operation.base !== undefined) {
    monkey.resolvedValue = monkey.operation.base;
    monkeyMap.set(monkey.name, monkey.resolvedValue);
  }
}

const root = monkeys.find(m => m.name === 'root')!;
// get chain of monkeys that depend on 'humn'
const dependChain = new Set<string>();
dependChain.add('humn');
while (!dependChain.has(root.name)) {
  for (const monkey of monkeys) {
    if (dependChain.has(monkey.name)) continue;
    if (monkey.operation.left && dependChain.has(monkey.operation.left)) {
      dependChain.add(monkey.name);
    }
    if (monkey.operation.right && dependChain.has(monkey.operation.right)) {
      dependChain.add(monkey.name);
    }
  }
}
dependChain.delete('root');
dependChain.delete('humn');

// calculate values that arent in the depend chain
const nonChainVals = new Map<string, number>();
const nonDependChain = monkeys.filter(m => !dependChain.has(m.name));
for (const monkey of nonDependChain) {
  nonChainVals.set(monkey.name, resolve(monkey));
}

const side = dependChain.has(root.operation.left!) ? 'left' : 'right';

const unstableMonkey = monkeys.find(m => m.name === root.operation[side])!;
const stableMonkey = monkeys.find(
  m => m.name === root.operation[side === 'left' ? 'right' : 'left'],
)!;

const stableVal = resolve(stableMonkey);

// find the value of humn that makes stableVal === unstableVal
const unstableResolver = (val: number) => {
  monkeyMap.set('humn', val);
  // update depend chain
  for (const monkey of monkeys) {
    if (dependChain.has(monkey.name)) {
      monkey.resolvedValue = null;
      monkeyMap.delete(monkey.name);
    }
  }
  for (const monkey of monkeys) {
    if (dependChain.has(monkey.name)) {
      resolve(monkey);
    }
  }
  // update non depend chain
  for (const [name, val] of nonChainVals) {
    monkeyMap.set(name, val);
  }

  return resolve(unstableMonkey);
};

let min = Number.MIN_SAFE_INTEGER;
let max = Number.MAX_SAFE_INTEGER;
let mid = 0;
while (true) {
  mid = Math.floor((min + max) / 2);
  const val = unstableResolver(mid);
  if (val === stableVal) break;
  if (val > stableVal) {
    min = mid;
  } else {
    max = mid;
  }
}

console.log(mid);
