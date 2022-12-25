import { readFileSync } from 'node:fs';

const snafuToNum = (snafu: string): number => {
  let num = 0;
  for (let i = snafu.length - 1; i >= 0; i--) {
    switch (snafu[i]) {
      case '1':
        num += 1 * 5 ** (snafu.length - 1 - i);
        break;
      case '2':
        num += 2 * 5 ** (snafu.length - 1 - i);
        break;
      case '-':
        num += -1 * 5 ** (snafu.length - 1 - i);
        break;
      case '=':
        num += -2 * 5 ** (snafu.length - 1 - i);
        break;
    }
  }
  return num;
};

const numToSnafu = (num: number): string => {
  let snafu = '';
  const conv = '012=-'.split('');
  while (num !== 0) {
    const remainder = num % 5;
    snafu += conv[remainder];
    if (remainder > 2) num += 5;
    num = Math.floor(num / 5);
  }
  return [...snafu].reverse().join('');
};

const snafus = readFileSync('input.txt', 'utf-8').trim().split('\n');

const nums = snafus.map(snafuToNum);

const sum = nums.reduce((a, b) => a + b, 0);
console.log(sum);
console.log(numToSnafu(sum));
