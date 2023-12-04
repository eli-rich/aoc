import { readFile } from 'node:fs/promises';
const input = (await readFile('input.txt', 'utf8')).toLowerCase().trim();

const lines = input.split('\n');

const DIGITS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const toNum = (input: string): number => {
  return input in DIGITS ? DIGITS[input] : Number(input);
};

const values = <number[]>[];
// thanks to https://github.com/LebsterFace for the idea

for (const line of lines) {
  const matches = <string[]>[];
  for (let i = 0; i < line.length; i++) {
    if (!isNaN(parseInt(line[i]))) {
      matches.push(line[i]);
    } else {
      const digit = Object.keys(DIGITS).find(d => line.startsWith(d, i));
      if (!digit) continue;
      matches.push(DIGITS[digit].toString());
    }
  }
  values.push(Number(matches[0] + matches[matches.length - 1]));
}

const sum = values.reduce((a, b) => a + b, 0);
console.log(sum);
