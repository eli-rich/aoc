import fs from 'fs';

const range = (start, end) => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

const contains = (range1, range2) => {
  const [start1, end1] = range1.split('-').map(Number);
  const [start2, end2] = range2.split('-').map(Number);
  const set1 = new Set(range(start1, end1));
  const set2 = new Set(range(start2, end2));
  return new Set([...set1].filter((x) => set2.has(x))).size === set1.size;
};

const fullContains = (range1, range2) => {
  const [start1, end1] = range1.split('-').map(Number);
  const [start2, end2] = range2.split('-').map(Number);
  const set1 = new Set(range(start1, end1));
  const set2 = new Set(range(start2, end2));
  return new Set([...set1].filter((x) => set2.has(x))).size > 0;
};

const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n');

const count = input.reduce(
  (scores, line) => {
    const [range1, range2] = line.split(',');
    if (contains(range1, range2) || contains(range2, range1)) scores.part1++;
    if (fullContains(range1, range2)) scores.part2++;
    return scores;
  },
  { part1: 0, part2: 0 },
);

console.log(count);
