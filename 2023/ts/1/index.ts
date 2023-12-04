import { readFile } from 'node:fs/promises';
const input = (await readFile('input.txt', 'utf8')).toLowerCase().trim();

type Match = {
  digit: number;
  index: number;
};

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

const regexDigits = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

const toNum = (digit: string): number => {
  if (!isNaN(Number(digit))) return Number(digit);
  return DIGITS[digit];
};

const calibrationValues = <number[]>[];
const regexes = <RegExp[]>[];

for (const digit of regexDigits) {
  const regex = new RegExp(digit);
  regexes.push(regex);
}

for (const line of lines) {
  const digits = <Match[]>[];
  for (const regex of regexes) {
    const matches = regex.exec(line);
    if (matches) {
      digits.push({ digit: toNum(matches[0]), index: matches.index });
    }
  }
  const sortedDigits = digits.toSorted((a, b) => a.index - b.index);
  const firstDigit = sortedDigits[0].digit;
  const lastDigit = sortedDigits[sortedDigits.length - 1].digit;
  const calibrationValue = Number(firstDigit.toString() + lastDigit.toString());
  calibrationValues.push(calibrationValue);
}

const sum = calibrationValues.reduce((a, b) => a + b, 0);
console.log(calibrationValues);
console.log(sum);
