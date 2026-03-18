import { rm } from 'node:fs/promises';

const target = process.argv[2];

if (!target) {
  console.error('Usage: node scripts/clean-dir.mjs <path>');
  process.exit(1);
}

await rm(target, { recursive: true, force: true });
