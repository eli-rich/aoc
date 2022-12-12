import { readFileSync } from 'node:fs';

const input = readFileSync('./days/7/input.txt', 'utf-8')
  .trim()
  .split('$')
  .filter((line) => line.length > 0)
  .map((line) => line.trim())
  .map((line) => line.split('\n'));

let currentDir = '';
const files = new Map();

input.shift();

for (const line of input) {
  if (line[0].startsWith('cd')) {
    const path = line[0].split(' ')[1].trim();
    if (path === '..') {
      const pathArr = currentDir.split('/');
      pathArr.pop();
      currentDir = pathArr.join('/');
    } else {
      currentDir = currentDir + '/' + path;
    }
  }
  if (line[0] === 'ls') {
    const filesInDir = line.slice(1, line.length);
    files.set(currentDir, filesInDir);
  }
}

files.set('/', files.get(''));
files.delete('');

const calculateSum = (currentDir: string) => {
  let sum = 0;
  const filesInDir = files.get(currentDir);
  for (const file of filesInDir) {
    if (file.startsWith('dir')) {
      let subDir = file.split(' ')[1];
      if (currentDir !== '/') subDir = currentDir + '/' + subDir;
      else subDir = '/' + subDir;
      sum += calculateSum(subDir);
    } else {
      sum += parseInt(file.split(' ')[0]);
    }
  }
  return sum;
};

const result = [];

for (const [dir, _] of files) {
  result.push(calculateSum(dir));
}

const MAX_FS_SIZE = 70000000;
const NEED_UNUSED = 30000000;

const sizes = new Map();
for (const [dir, _] of files) {
  sizes.set(dir, calculateSum(dir));
}

const diff = MAX_FS_SIZE - sizes.get('/');
const needed = NEED_UNUSED - diff;

// get dir with smallest size that is over needed
const smallestDir = [...sizes.entries()]
  .filter(([dir, size]) => size > needed)
  .sort((a, b) => a[1] - b[1])[0];

const answer = {
  part1: result.filter((val) => val <= 100000).reduce((sum, val) => sum + val, 0),
  part2: smallestDir[1],
  day: 7,
};

export default answer;
