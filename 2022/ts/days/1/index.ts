import { readFileSync } from 'node:fs';

const chunks = readFileSync('./days/1/input.txt', 'utf8')
  .trim()
  .split('\n\n')
  .map((chunk) =>
    chunk.split('\n').reduce((sum, val) => {
      const value = parseInt(val);
      return sum + value;
    }, 0),
  )
  .sort((a, b) => b - a);

const answer = {
  part1: chunks[0],
  part2: chunks[0] + chunks[1] + chunks[2],
  day: 1,
};

export default answer;
