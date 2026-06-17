import assert from 'node:assert/strict';
import { existsSync, lstatSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillRoot = resolve(repoRoot, '.claude/skills/ui-ux-pro-max');

for (const name of ['data', 'scripts']) {
  const path = resolve(skillRoot, name);

  assert.ok(existsSync(path), `${name} must exist in the packaged Claude skill`);
  assert.ok(!lstatSync(path).isSymbolicLink(), `${name} must be a real directory, not a symlink`);
  assert.ok(statSync(path).isDirectory(), `${name} must be a directory`);
  assert.ok(readdirSync(path).length > 0, `${name} must not be empty`);
}
