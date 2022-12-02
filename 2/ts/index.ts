import { readFile } from 'node:fs/promises';

const convert = {
  A: 'Rock',
  B: 'Paper',
  C: 'Scissors',
  Y: 'Paper',
  X: 'Rock',
  Z: 'Scissors',
};

const scoreConvert = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

type Elf = 'A' | 'B' | 'C';
type Me = 'X' | 'Y' | 'Z';
type Stone = 'Rock' | 'Paper' | 'Scissors';
const input = await readFile('input.txt', 'utf-8');
const lines = input.split('\n');

const elfWins = (elf: Stone, me: Stone) => {
  if (elf === 'Rock' && me === 'Scissors') return true;
  if (elf === 'Paper' && me === 'Rock') return true;
  if (elf === 'Scissors' && me === 'Paper') return true;
  return false;
};

// part one
let score = 0;
for (const line of lines) {
  const elf = convert[line.split(' ')[0] as Elf] as Stone;
  const me = convert[line.split(' ')[1] as Me] as Stone;
  if (elf === me) {
    score += 3 + scoreConvert[me];
  } else if (elfWins(elf, me)) {
    score += scoreConvert[me];
  } else {
    score += 6 + scoreConvert[me];
  }
}

console.log(`Part 1: ${score}`);

// part two
const getMatch = (elf: Stone, win: boolean): Stone => {
  if (elf === 'Rock') return win ? 'Paper' : 'Scissors';
  if (elf === 'Paper') return win ? 'Scissors' : 'Rock';
  if (elf === 'Scissors') return win ? 'Rock' : 'Paper';
  return 'Rock';
};

score = 0;
for (const line of lines) {
  const elf = convert[line.split(' ')[0] as Elf] as Stone;
  const me = line.split(' ')[1] as Me;
  if (me === 'Y') {
    // draw
    score += 3 + scoreConvert[elf];
  } else if (me === 'X') {
    // lose
    score += scoreConvert[getMatch(elf, false)];
  } else if (me === 'Z') {
    // win
    score += 6 + scoreConvert[getMatch(elf, true)];
  }
}

console.log(`Part 2: ${score}`);
