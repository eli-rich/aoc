import chalk from 'chalk';
import { readdir } from 'node:fs/promises';

import { table } from 'table';

import ocrRead from './ocr.js';

type Answer = {
  part1: string;
  part2: string;
  day: number;
  time?: number;
};

const dirs = await readdir('./days');
const filesToImport = async () => {
  const files = await Promise.all(
    dirs.map(async (dir) => {
      const files = (await readdir(`./days/${dir}`)).filter((file) => file.endsWith('.ts'));
      return files.map((file) => `./days/${dir}/${file}`);
    }),
  );
  return files.flat();
};

const files = await filesToImport();

const importMap = new Map<number, Answer>();

for (const file of files) {
  const { default: answer } = await import(file);
  importMap.set(answer.day, answer);
}

const answers = [...importMap.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([, answer]) => answer)
  .map((answer) => {
    const { part1, part2 } = answer;
    if (part1.length > 25) answer.part1 = ocrRead(part1.trim());
    if (part2.length > 25) answer.part2 = ocrRead(part2.trim());
    return answer;
  });

const t = table([
  [chalk.green('Day'), 'Part 1', 'Part 2'],
  ...answers.map(({ day, part1, part2 }) => [day, part1, part2]),
]);

console.log(t);
