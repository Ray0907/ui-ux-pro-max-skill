import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import ora from 'ora';
import { getLatestRelease } from '../utils/github.js';
import { logger } from '../utils/logger.js';
import { initCommand } from './init.js';
import type { AIType } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface UpdateOptions {
  ai?: AIType;
}

async function getPackageVersion(): Promise<string> {
  const packagePath = join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(await readFile(packagePath, 'utf-8')) as { version: string };
  return pkg.version;
}

function normalizeTagVersion(tagName: string): string {
  return tagName.replace(/^v/i, '');
}

export async function updateCommand(options: UpdateOptions): Promise<void> {
  logger.title('UI/UX Pro Max Updater');

  const spinner = ora('Checking for updates...').start();

  try {
    const release = await getLatestRelease();
    const currentVersion = await getPackageVersion();
    const latestVersion = normalizeTagVersion(release.tag_name);
    spinner.succeed(`Latest version: ${chalk.cyan(release.tag_name)}`);

    if (currentVersion !== latestVersion) {
      console.log();
      logger.warn(`Installed CLI package is ${chalk.cyan(currentVersion)}, but latest release is ${chalk.cyan(release.tag_name)}.`);
      logger.info(`Update the CLI package first: ${chalk.cyan(`npm install -g @ray0907/uipro-cli@${latestVersion}`)}`);
      logger.info('Then rerun: uipro init --ai <platform>');
      return;
    }

    console.log();
    logger.info('Refreshing installed skill files from this CLI package...');
    console.log();

    await initCommand({
      ai: options.ai,
      force: true,
    });
  } catch (error) {
    spinner.fail('Update check failed');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
}
