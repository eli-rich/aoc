import { calories } from './input.js';

const calculate = (calories: string) => {
  const groups: string[][] = [];
  const caloriesArray = calories.split('\n');
  let currentGroup = [];
  for (const line of caloriesArray) {
    if (line === '') {
      groups.push(currentGroup);
      currentGroup = [];
      continue;
    }
    currentGroup.push(line);
  }
  const flattened = groups.map((group) => {
    const sum = group.reduce((s, val) => {
      s += parseInt(val);
      return s;
    }, 0);
    return sum;
  });
  const sorted = flattened.sort((a, b) => b - a);
  const result = sorted[0] + sorted[1] + sorted[2];
  return result;
};

console.log(calculate(calories));
