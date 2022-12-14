import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const __dirname = dirname(new URL(import.meta.url).pathname);

const getInput = (day: number) => {
  return inputs.get(day)!;
};

const fetchInput = async (day: number) => {
  const input = await readFile(`${__dirname}/inputs/${day}.txt`, 'utf-8');
  return input;
};

const inputs = new Map<number, string>();

export const loadInput = async (currentDay: number) => {
  for (let i = 1; i <= currentDay; i++) {
    inputs.set(i, await fetchInput(i));
  }
};

export default getInput;
