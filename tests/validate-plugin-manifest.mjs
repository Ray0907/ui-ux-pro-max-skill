import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(repoRoot, '.claude-plugin/plugin.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

assert.equal(
  typeof manifest.skills,
  'string',
  'plugin.json skills must be a string path to the parent skills directory'
);

assert.ok(
  manifest.skills.endsWith('/'),
  'plugin.json skills must point to a parent directory path ending with /'
);

const skillsPath = resolve(repoRoot, manifest.skills);

assert.ok(
  existsSync(skillsPath),
  `plugin.json skills path does not exist: ${manifest.skills}`
);

assert.ok(
  statSync(skillsPath).isDirectory(),
  `plugin.json skills path must be a directory: ${manifest.skills}`
);

