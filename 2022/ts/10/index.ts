import { readFileSync } from 'fs';

const input = readFileSync('input.txt', 'utf8').trim().split('\n');

type Instruction = {
  op: 'noop' | 'addx';
  value?: number;
};

type QueueItem = {
  instruction: Instruction;
  remaining: number;
};

const instructions: Instruction[] = [];

for (const line of input) {
  const split = line.split(' ');
  const instruction: Instruction = {
    op: split[0] as 'noop' | 'addx',
    value: split[1] ? parseInt(split[1]) : undefined,
  };
  instructions.push(instruction);
}

let queue: QueueItem[] = [];

for (const instruction of instructions) {
  switch (instruction.op) {
    case 'noop':
      queue.push({ instruction, remaining: 1 });
      break;
    case 'addx':
      queue.push({ instruction, remaining: 2 });
      break;
  }
}

let register = 1;
let cycle = 1;

const execute = (instruction: Instruction) => {
  switch (instruction.op) {
    case 'noop':
      break;
    case 'addx':
      register += instruction.value ?? 0;
      break;
  }
};

const values = new Map<number, number>();

while (queue.length > 0) {
  const next = queue.shift();
  if (!next) break;

  while (next.remaining > 0) {
    values.set(cycle, register);
    cycle++;
    next.remaining--;
  }
  execute(next.instruction);
}

const cycleSum = () => {
  const cycle20 = values.get(20)!;
  const cycle60 = values.get(60)!;
  const cycle100 = values.get(100)!;
  const cycle140 = values.get(140)!;
  const cycle180 = values.get(180)!;
  const cycle220 = values.get(220)!;

  const sum =
    cycle20 * 20 + cycle60 * 60 + cycle100 * 100 + cycle140 * 140 + cycle180 * 180 + cycle220 * 220;
  return sum;
};

console.log(cycleSum());

// part 2
queue = [];

// reload queue
for (const instruction of instructions) {
  switch (instruction.op) {
    case 'noop':
      queue.push({ instruction, remaining: 1 });
      break;
    case 'addx':
      queue.push({ instruction, remaining: 2 });
      break;
  }
}

register = 1;
cycle = 1;

let draw = '';

const threePixels = (register: number) => {
  return [register - 1, register, register + 1];
};

const drawPixel = (cycle: number, register: number) => {
  cycle = cycle - 1;
  if (cycle % 40 === 0) draw += '\n';
  if (threePixels(register).includes(cycle % 40)) {
    draw += '#';
  } else {
    draw += '.';
  }
};

while (queue.length > 0) {
  const next = queue.shift();
  if (!next) break;

  while (next.remaining > 0) {
    values.set(cycle, register);
    drawPixel(cycle, register);
    cycle++;
    next.remaining--;
  }
  execute(next.instruction);
}

console.log(draw);
