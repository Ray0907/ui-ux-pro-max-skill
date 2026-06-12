#!/usr/bin/env node

import { createHash } from 'node:crypto';
import {
  access,
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
} from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const sourceRoot = join(repoRoot, 'src', 'ui-ux-pro-max');
const assetRoot = join(repoRoot, 'cli', 'assets');
const dirsToSync = ['data', 'scripts', 'templates'];
const checkOnly = process.argv.includes('--check');

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function assertInsideRepo(path) {
  const resolvedPath = resolve(path);
  if (!resolvedPath.startsWith(repoRoot)) {
    throw new Error(`Refusing to modify path outside repository: ${resolvedPath}`);
  }
  return resolvedPath;
}

async function listFiles(root) {
  const files = [];

  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        files.push(relative(root, fullPath).replaceAll('\\', '/'));
      }
    }
  }

  await walk(root);
  return files.sort();
}

async function fileHash(path) {
  const content = await readFile(path);
  return createHash('sha256').update(content).digest('hex');
}

async function checkAssets() {
  const drift = [];

  for (const dir of dirsToSync) {
    const sourceDir = join(sourceRoot, dir);
    const targetDir = join(assetRoot, dir);

    if (!(await exists(sourceDir))) {
      drift.push(`missing source directory: ${relative(repoRoot, sourceDir)}`);
      continue;
    }
    if (!(await exists(targetDir))) {
      drift.push(`missing asset directory: ${relative(repoRoot, targetDir)}`);
      continue;
    }

    const sourceFiles = await listFiles(sourceDir);
    const targetFiles = await listFiles(targetDir);
    const allFiles = [...new Set([...sourceFiles, ...targetFiles])].sort();

    for (const file of allFiles) {
      const sourcePath = join(sourceDir, file);
      const targetPath = join(targetDir, file);

      if (!sourceFiles.includes(file)) {
        drift.push(`extra asset file: ${dir}/${file}`);
      } else if (!targetFiles.includes(file)) {
        drift.push(`missing asset file: ${dir}/${file}`);
      } else if ((await fileHash(sourcePath)) !== (await fileHash(targetPath))) {
        drift.push(`stale asset file: ${dir}/${file}`);
      }
    }
  }

  if (drift.length > 0) {
    console.error('CLI assets are out of sync with src/ui-ux-pro-max:');
    for (const item of drift) {
      console.error(`  - ${item}`);
    }
    console.error('\nRun: npm run sync:assets');
    process.exit(1);
  }

  console.log('CLI assets are in sync.');
}

async function syncAssets() {
  assertInsideRepo(assetRoot);
  await mkdir(assetRoot, { recursive: true });

  for (const dir of dirsToSync) {
    const sourceDir = join(sourceRoot, dir);
    const targetDir = assertInsideRepo(join(assetRoot, dir));

    if (!(await exists(sourceDir))) {
      throw new Error(`Source directory does not exist: ${sourceDir}`);
    }

    if (await exists(targetDir)) {
      await rm(targetDir, { recursive: true, force: true });
    }
    await cp(sourceDir, targetDir, { recursive: true });
  }

  console.log('Synced CLI assets from src/ui-ux-pro-max.');
}

if (checkOnly) {
  await checkAssets();
} else {
  await syncAssets();
}
