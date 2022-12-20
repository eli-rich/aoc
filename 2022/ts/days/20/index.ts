import { readFileSync } from 'node:fs';

const input = readFileSync('input.txt', 'utf8').trim();

const nums = input
  .split('\n')
  .map(Number)
  .map((n, i) => {
    return {
      value: n,
      index: i,
    };
  });

for (let i = 0; i < nums.length; i++) {
  const index = nums.findIndex(v => v.index === i);
  const [n] = nums.splice(index, 1);
  nums.splice((index + n.value) % nums.length, 0, n);
}

const zero = nums.findIndex(v => v.value === 0);

const sum = [1000, 2000, 3000]
  .map(x => nums[(zero + x) % nums.length].value)
  .reduce((sum, val) => sum + val, 0);

console.log(sum);

const key = 811589153;

const nums2 = input
  .split('\n')
  .map(Number)
  .map((n, i) => {
    return {
      value: n * key,
      index: i,
    };
  });

for (let i = 0; i < nums2.length * 10; i++) {
  const index = nums2.findIndex(v => v.index === i % nums2.length);
  const [n] = nums2.splice(index, 1);
  nums2.splice((index + n.value) % nums2.length, 0, n);
}

const zero2 = nums2.findIndex(v => v.value === 0);

const sum2 = [1000, 2000, 3000]
  .map(x => nums2[(zero2 + x) % nums2.length].value)
  .reduce((sum, val) => sum + val, 0);

console.log(sum2);
