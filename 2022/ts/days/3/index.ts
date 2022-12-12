import { readFile } from 'node:fs/promises';

const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const input = await readFile('./days/3/input.txt', 'utf-8');
const lines = input.split('\n');

const findItems = (first: string, second: string) => {
  const items: string[] = [];
  for (const letter of first) {
    if (second.includes(letter)) {
      items.push(letter);
    }
  }
  return Array.from(new Set(items));
};

const priorities: string[] = [];
for (const line of lines) {
  const first = line.slice(0, line.length / 2);
  const second = line.slice(line.length / 2, line.length);
  const p = findItems(first, second)[0];
  priorities.push(p);
}

const result = priorities.reduce((sum, p) => {
  if (p.toLowerCase() === p) {
    return sum + lower.indexOf(p) + 1;
  }
  return sum + upper.indexOf(p) + 27;
}, 0);

const findItems2 = (groups: string[]) => {
  const first = groups[0];
  const second = groups[1];
  const third = groups[2];

  const items: string[] = [];
  // iterate over group with most items by length
  const longest = [first, second, third].sort((a, b) => b.length - a.length)[0];
  for (const letter of longest) {
    if (second.includes(letter) && third.includes(letter) && first.includes(letter)) {
      items.push(letter);
    }
  }
  return Array.from(new Set(items));
};

const priorities2: string[] = [];
for (let i = 0; i < lines.length; i++) {
  const group = [lines[i], lines[i + 1], lines[i + 2]];
  i += 2;
  const p = findItems2(group)[0];
  priorities2.push(p);
}

const result2 = priorities2.reduce((sum, p) => {
  if (p.toLowerCase() === p) {
    return sum + lower.indexOf(p) + 1;
  }
  return sum + upper.indexOf(p) + 27;
}, 0);

const answer = {
  part1: result,
  part2: result2,
  day: 3,
};

export default answer;
