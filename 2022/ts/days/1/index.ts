import getInput from '../../inputManager.js';

const input = await getInput(1);
const chunks = input
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
