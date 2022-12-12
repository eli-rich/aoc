import { readdir } from 'node:fs/promises';

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
console.log(files);
console.log(files.length);
