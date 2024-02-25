/* eslint-disable @typescript-eslint/no-var-requires */
import { readdirSync } from 'fs';
import { join } from 'path';

const inquirer = require('inquirer');

export default async function runExecutor() {
  const dirPath = '../../../../../prisma/seeds';
  const seedDir = join(__dirname, dirPath);
  const files = readdirSync(seedDir).filter((file) => file.endsWith('.ts'));

  const { seedFile } = await inquirer.prompt([
    {
      type: 'list',
      name: 'seedFile',
      message: 'Which seed file would you like to run?',
      choices: files
    }
  ]);

  const { execSync } = require('child_process');
  execSync(`npx ts-node ${join(seedDir, seedFile)}`, { stdio: 'inherit' });
  return { success: true };
}
