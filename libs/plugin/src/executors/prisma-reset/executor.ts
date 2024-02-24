import { PrismaResetExecutorSchema } from './schema';
import * as fs from 'fs';
import signale from 'signale';
import { exec, execSync } from 'child_process';
import * as path from 'path';

const rootDir = path.resolve(__dirname, '../../../../../');
const removeDirAsync = (dir: string) => {
  return new Promise((resolve, reject) => {
    fs.rm(dir, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const createDirAsync = (dir: string) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const execAsync = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        signale.error(`exec error: ${error}`)
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve(true);
    });
  });
};

export default async function runExecutor(options: PrismaResetExecutorSchema) {
  const removeDirs = ['libs/db/src/graphql/generated', 'prisma/migrations', 'prisma/seeds'];
  signale.start('Resetting Prisma...');

  await Promise.all(
    removeDirs.map(async (dir) => {
      try {
        await removeDirAsync(path.resolve(rootDir, dir));
        signale.success(`Removed ${dir}`);
      } catch (e) {
        signale.error(`Remove directory error: ${e.message}`);
      }
    })
  );

  // create prisma/seeds directory
  try {
    const seedsPath = path.resolve(rootDir, 'prisma/seeds');
    await createDirAsync(seedsPath);
  } catch (e) {
    signale.error(`${e}`);
  }

  signale.start('Running prisma generate...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
  } catch (e) {
    signale.error('Error running prisma generate');
    return { success: false };
  }

  return {
    success: true
  };
}
