import getInput from '../../inputManager.js';

const input = await getInput(6);

let l4 = [];
let result1 = 0;
let result2 = 0;
for (let i = 0; i < input.length; i++) {
  l4.push(input[i]);
  if (l4.length > 4) {
    l4.shift();
  }
  if (new Set(l4).size === 4) {
    result1 = i + 1;
    break;
  }
}
let l14 = [];
for (let i = 0; i < input.length; i++) {
  l14.push(input[i]);
  if (l14.length > 14) {
    l14.shift();
  }
  if (new Set(l14).size === 14) {
    result2 = i + 1;
    break;
  }
}

const answer = {
  part1: result1,
  part2: result2,
  day: 6,
};

export default answer;
