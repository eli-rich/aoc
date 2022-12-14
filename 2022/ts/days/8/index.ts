import getInput from '../../inputManager.js';

const input = await getInput(8);

const trees = input.split('\n').map((line) => line.split('').map((ch) => parseInt(ch)));

let visible = 0;
// a tree is visible if it is greater than any number between it and any edge
const checkVisible = (i: number, j: number) => {
  let notleft = false;
  let notright = false;
  let nottop = false;
  let notbottom = false;
  if (i === 0 || i === trees.length - 1 || j === 0 || j === trees[i].length - 1) {
    return true;
  }

  // check left
  for (let k = 0; k < j; k++) {
    if (trees[i][k] >= trees[i][j]) {
      notleft = true;
    }
  }
  // check right
  for (let k = j + 1; k < trees[i].length; k++) {
    if (trees[i][k] >= trees[i][j]) {
      notright = true;
    }
  }
  // check top
  for (let k = 0; k < i; k++) {
    if (trees[k][j] >= trees[i][j]) {
      nottop = true;
    }
  }
  // check bottom
  for (let k = i + 1; k < trees.length; k++) {
    if (trees[k][j] >= trees[i][j]) {
      notbottom = true;
    }
  }

  if (notleft && notright && nottop && notbottom) {
    return false;
  } else {
    return true;
  }
};

for (let i = 0; i < trees.length; i++) {
  for (let j = 0; j < trees[i].length; j++) {
    if (checkVisible(i, j)) {
      visible++;
    }
  }
}

// calculate scenic score

/*
A tree's scenic score is found by multiplying together its viewing distance in each of the four directions.
 For this tree, this is 4 (found by multiplying 1 * 1 * 2 * 2).
*/

const calculateScenic = (i: number, j: number) => {
  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;

  // check left
  for (let k = j - 1; k >= 0; k--) {
    if (trees[i][k] >= trees[i][j]) {
      left++;
      break;
    }
    left++;
  }
  // check right
  for (let k = j + 1; k < trees[i].length; k++) {
    if (trees[i][k] >= trees[i][j]) {
      right++;
      break;
    }
    right++;
  }
  // check top
  for (let k = i - 1; k >= 0; k--) {
    if (trees[k][j] >= trees[i][j]) {
      top++;
      break;
    }
    top++;
  }
  // check bottom
  for (let k = i + 1; k < trees.length; k++) {
    if (trees[k][j] >= trees[i][j]) {
      bottom++;
      break;
    }
    bottom++;
  }
  if (left === 0) left = 1;
  if (right === 0) right = 1;
  if (top === 0) top = 1;
  if (bottom === 0) bottom = 1;

  return left * right * top * bottom;
};

let max = 0;
for (let i = 0; i < trees.length; i++) {
  for (let j = 0; j < trees[i].length; j++) {
    const score = calculateScenic(i, j);
    if (score > max) {
      max = score;
    }
  }
}

const answer = {
  part1: visible,
  part2: max,
  day: 8,
  time: 0,
};

export default answer;
