import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const __dirname = dirname(new URL(import.meta.url).pathname);

const getInput = async (day: number) => {
  const input = await readFile(`${__dirname}/inputs/${day}.txt`, 'utf-8');
  return input;
};

export default getInput;
