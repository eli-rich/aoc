import { readFile } from 'node:fs/promises';

const input = (await readFile('test.txt', 'utf-8')).trim();

const lines = input.split('\n');

const grid: string[][] = [];

for (const line of lines) {
  grid.push(line.split(''));
}

const getNeighbors = (x: number, y: number): string[] => {
  // dear lord this is so ugly
  return [
    grid[y - 1]?.[x - 1],
    grid[y - 1]?.[x],
    grid[y - 1]?.[x + 1],
    grid[y]?.[x - 1],
    grid[y]?.[x + 1],
    grid[y + 1]?.[x - 1],
    grid[y + 1]?.[x],
    grid[y + 1]?.[x + 1],
  ].filter(x => x !== undefined);
};

const isSymbol = (cell: string): boolean => isNaN(Number(cell)) && cell !== '.';

const parts: number[] = [];
for (let i = 0; i < grid.length; i++) {
  const row = grid[i];
  for (let j = 0; j < row.length; j++) {
    const cell = row[j];
    if (!isNaN(Number(cell))) {
      // check if it's adjacent to a symbol
      const surrounding = getNeighbors(j, i);
      if (surrounding.some(isSymbol)) {
        // it's a part, consume full number (forwards and backwards) and add to parts
        let part = '';
        // backwards
        let k = j - 1;
        while (!isNaN(Number(row[k]))) {
          part = row[k] + part;
          k--;
          if (k < 0) break;
        }
        // forwards
        k = j;
        while (!isNaN(Number(row[k]))) {
          part += row[k];
          k++;
          if (k >= row.length) break;
        }
        // add to parts
        parts.push(Number(part));
        // set j to the end of the part
        j = k;
      }
    }
  }
}

const sum = parts.reduce((acc, curr) => acc + curr, 0);
console.log(parts);
console.log(sum);
