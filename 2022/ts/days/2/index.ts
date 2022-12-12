import { readFileSync } from 'node:fs';

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
const input = readFileSync('./days/2/input.txt', 'utf-8');
const lines = input.split('\n');

const elfWins = (elf: Stone, me: Stone) => {
  if (elf === 'Rock' && me === 'Scissors') return true;
  if (elf === 'Paper' && me === 'Rock') return true;
  if (elf === 'Scissors' && me === 'Paper') return true;
  return false;
};

// part one
let score1 = 0;
for (const line of lines) {
  const elf = convert[line.split(' ')[0] as Elf] as Stone;
  const me = convert[line.split(' ')[1] as Me] as Stone;
  if (elf === me) {
    score1 += 3 + scoreConvert[me];
  } else if (elfWins(elf, me)) {
    score1 += scoreConvert[me];
  } else {
    score1 += 6 + scoreConvert[me];
  }
}

// part two
const getMatch = (elf: Stone, win: boolean): Stone => {
  if (elf === 'Rock') return win ? 'Paper' : 'Scissors';
  if (elf === 'Paper') return win ? 'Scissors' : 'Rock';
  if (elf === 'Scissors') return win ? 'Rock' : 'Paper';
  return 'Rock';
};

let score2 = 0;
for (const line of lines) {
  const elf = convert[line.split(' ')[0] as Elf] as Stone;
  const me = line.split(' ')[1] as Me;
  if (me === 'Y') {
    // draw
    score2 += 3 + scoreConvert[elf];
  } else if (me === 'X') {
    // lose
    score2 += scoreConvert[getMatch(elf, false)];
  } else if (me === 'Z') {
    // win
    score2 += 6 + scoreConvert[getMatch(elf, true)];
  }
}

const answer = {
  part1: score1,
  part2: score2,
  day: 2,
};

export default answer;
