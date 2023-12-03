import { readFile } from 'node:fs/promises';
const input = (await readFile('test.txt', 'utf8')).toLowerCase().trim();

const lines = input.split('\n');

const DIGITS: { [key: string]: number } = {
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

const toNum = (digit: string): number => {
  if (!isNaN(Number(digit))) return Number(digit);
  return DIGITS[digit];
};

const calibrationValues = <number[]>[];
const regex = new RegExp(`(${Object.keys(DIGITS).join('|')})|\\d`, 'g');
for (const line of lines) {
  const digits = line.match(regex);
  if (!digits) continue;
  if (digits.length === 0) continue;
  if (digits.length === 1)
    calibrationValues.push(Number(toNum(digits[0]).toString() + toNum(digits[0]).toString()));
  else
    calibrationValues.push(
      Number(toNum(digits[0]).toString() + toNum(digits[digits.length - 1]).toString()),
    );
}

const sum = calibrationValues.reduce((acc, curr) => acc + curr, 0);
console.log(sum);
