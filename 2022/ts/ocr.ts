import { readFileSync } from 'fs';
interface CharMap {
  [key: string]: string;
}

const charMap: CharMap = {
  '.##.\n#..#\n#..#\n####\n#..#\n#..#': 'A',
  '###.\n#..#\n###.\n#..#\n#..#\n###.': 'B',
  '.##.\n#..#\n#...\n#...\n#..#\n.##.': 'C',
  '####\n#...\n###.\n#...\n#...\n####': 'E',
  '####\n#...\n###.\n#...\n#...\n#...': 'F',
  '.##.\n#..#\n#...\n#.##\n#..#\n.###': 'G',
  '#..#\n#..#\n####\n#..#\n#..#\n#..#': 'H',
  '.###\n..#.\n..#.\n..#.\n..#.\n.###': 'I',
  '..##\n...#\n...#\n...#\n#..#\n.##.': 'J',
  '#..#\n#.#.\n##..\n#.#.\n#.#.\n#..#': 'K',
  '#...\n#...\n#...\n#...\n#...\n####': 'L',
  '.##.\n#..#\n#..#\n#..#\n#..#\n.##.': 'O',
  '###.\n#..#\n#..#\n###.\n#...\n#...': 'P',
  '###.\n#..#\n#..#\n###.\n#.#.\n#..#': 'R',
  '.###\n#...\n#...\n.##.\n...#\n###.': 'S',
  '#..#\n#..#\n#..#\n#..#\n#..#\n.##.': 'U',
  '#...\n#...\n.#.#\n..#.\n..#.\n..#.': 'Y',
  '####\n...#\n..#.\n.#..\n#...\n####': 'Z',
};

const input = readFileSync('out.txt', 'utf8').trim();
const lines = input.split('\n');

// split into 4x6 blocks
const blocks: string[] = [];
for (let i = 0; i < lines.length; i += 6) {
  for (let j = 0; j < lines[i].length; j += 5) {
    blocks.push(
      lines
        .slice(i, i + 6)
        .map((line) => line.slice(j, j + 5))
        .join('\n'),
    );
  }
}

const letters = blocks.map((block) =>
  block
    .split('\n')
    .map((line) => line.slice(0, line.length - 1))
    .join('\n'),
);

const output = letters.map((letter) => charMap[letter]).join('');

console.log(output);
