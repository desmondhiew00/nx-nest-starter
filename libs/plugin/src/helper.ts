import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

/**
 * Get all the directories in a given path
 * @returns {Promise<string[]>} - An array of strings representing the directories in the given path
 */
export const getDirectories = async (srcPath: string, excludes: string[]): Promise<string[]> => {
  const values = [];
  await fs.promises.readdir(srcPath).then(async (files) => {
    for (const file of files) {
      const filePath = path.join(srcPath, file);
      await fs.promises.stat(filePath).then((stat) => {
        if (stat.isDirectory()) {
          if (!excludes.includes(file)) values.push(file);
        }
      });
    }
  });
  return values;
};

export const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();

export const execAsync = async (cmd: string) => {
  const execPromise = util.promisify(exec);
  const { stdout } = await execPromise(cmd);
  return stdout.trim();
};
