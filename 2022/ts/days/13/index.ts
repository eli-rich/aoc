import { readFileSync } from 'node:fs';

const chunks = readFileSync('./days/13/input.txt', 'utf-8').trim().split('\n\n');

const packets = chunks.map((chunk) => chunk.split('\n').map((l) => JSON.parse(l)));

type AnyDepth = Array<AnyDepth | number>;
type Packet = AnyDepth | number;

enum Result {
  True = 1,
  False = -1,
  Continue = 0,
}

const compare = (left: Packet, right: Packet): Result | undefined => {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) return Result.True;
    if (left > right) return Result.False;
    return Result.Continue;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length; i++) {
      if (right[i] === undefined) return Result.False;
      const result = compare(left[i], right[i]);
      if (result !== Result.Continue) return result;
    }
    if (left.length < right.length) return Result.True;
    else return Result.Continue;
  }
  if (typeof left === 'number') return compare([left], right);
  if (typeof right === 'number') return compare(left, [right]);
};

let sum = 0;

for (const packet of packets) {
  const left = packet[0];
  const right = packet[1];
  const result = compare(left, right);
  if (result === 1) sum += packets.findIndex((p) => p === packet) + 1;
}

// part 2
const input = readFileSync('./days/13/input.txt', 'utf-8')
  .trim()
  .split('\n')
  .filter((i) => i !== '')
  .map((i) => JSON.parse(i));

input.push([[6]]);
input.push([[2]]);

const sortedPackets = input.sort((a: Packet, b: Packet) => compare(b, a)!);

const divider1 = sortedPackets.findIndex((p) => JSON.stringify(p) === JSON.stringify([[6]])) + 1;
const divider2 = sortedPackets.findIndex((p) => JSON.stringify(p) === JSON.stringify([[2]])) + 1;

const answer = {
  part1: sum,
  part2: divider1 * divider2,
  day: 13,
};

export default answer;
