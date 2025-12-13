// Husky v10-compatible Node pre-commit hook
const { execSync } = require('child_process');
const fs = require('fs');

function safeExec(cmd, opts = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', ...opts }).toString();
  } catch (e) {
    const out = e.stdout ? e.stdout.toString() : '';
    const err = e.stderr ? e.stderr.toString() : '';
    return out + err;
  }
}

function log(msg) { process.stdout.write(msg + '\n'); }

const HUSKY_BLOCK = process.env.HUSKY_BLOCK === '1';

log('[husky] Gathering staged files...');
const staged = safeExec('git diff --cached --name-only --diff-filter=ACM')
  .split(/\r?\n/)
  .filter(Boolean);

const eslintFiles = staged.filter(f => /(\.jsx?|\.tsx?)$/.test(f));
const prettierFiles = staged.filter(f => /(\.jsx?|\.tsx?|\.json|\.css|\.md)$/.test(f));

try { fs.mkdirSync('.husky', { recursive: true }); } catch {}

let eslintStatus = 0;
if (eslintFiles.length) {
  log('[husky] Running ESLint on staged files:');
  log(eslintFiles.join('\n'));
  const eslintJsonLog = '.husky/eslint-report.json';
  const jsonOut = safeExec(`npx eslint --format json ${eslintFiles.join(' ')}`);
  try { fs.writeFileSync(eslintJsonLog, jsonOut); log(`[husky] ESLint JSON log saved to: ${eslintJsonLog}`); } catch {}
  try {
    execSync(`npx eslint --format stylish ${eslintFiles.join(' ')}`, { stdio: 'inherit' });
  } catch (e) {
    eslintStatus = 1;
  }
} else {
  log('[husky] No staged JS/TS files for ESLint.');
}

if (prettierFiles.length) {
  log('[husky] Running Prettier --write on staged files:');
  log(prettierFiles.join('\n'));
  const prettierLog = '.husky/prettier-report.txt';
  const out = safeExec(`npx prettier --write ${prettierFiles.join(' ')}`);
  try { fs.writeFileSync(prettierLog, out); log(`[husky] Prettier log saved to: ${prettierLog}`); } catch {}
} else {
  log('[husky] No staged files for Prettier.');
}

if (HUSKY_BLOCK && eslintStatus !== 0) {
  log('[husky] ESLint reported errors. Commit aborted (HUSKY_BLOCK=1).');
  process.exit(1);
}

process.exit(0);