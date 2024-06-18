import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import signale from "signale";

import { PrismaResetExecutorSchema } from "./schema";

const rootDir = path.resolve(__dirname, "../../../../../");
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

export default async function runExecutor(_options: PrismaResetExecutorSchema) {
  const removeDirs = ["libs/generated/src/graphql", "prisma/migrations", "prisma/seeds"];
  signale.start("Resetting Prisma...");

  await Promise.all(
    removeDirs.map(async (dir) => {
      try {
        await removeDirAsync(path.resolve(rootDir, dir));
        signale.success(`Removed ${dir}`);
      } catch (e: unknown) {
        signale.error(`Remove directory error: ${e instanceof Error ? e.message : e}`);
      }
    }),
  );

  // create prisma/seeds directory
  try {
    const seedsPath = path.resolve(rootDir, "prisma/seeds");
    await createDirAsync(seedsPath);
  } catch (e) {
    signale.error(`${e}`);
  }

  signale.start("Running prisma generate...");
  try {
    execSync("npx prisma generate", { stdio: "inherit" });
  } catch (_e) {
    signale.error("Error running prisma generate");
    return { success: false };
  }

  return {
    success: true,
  };
}
