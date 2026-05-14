'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');

const { copyKitRuntimeTo, removeDir } = require('./snapshot');
const {
  KIT_VERSION,
  readProjectKitVersion,
  writeProjectKitVersion,
  compareSemver,
} = require('./version');
const { computeRuntimeDiff, printDiffSummary, printPerFileDiff } = require('./diff');
const { gitStatusPorcelain, isGitRepo } = require('./git');
const { confirm } = require('./prompt');

async function run(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: {
        cwd: { type: 'string' },
        yes: { type: 'boolean', short: 'y', default: false },
        'no-diff': { type: 'boolean', default: false },
        'allow-dirty': { type: 'boolean', default: false },
        'allow-downgrade': { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
      strict: true,
      allowPositionals: false,
    });
  } catch (e) {
    console.error(`upgrade: ${e.message}`);
    console.error('Try: ai-runtime-kit upgrade --help');
    process.exit(1);
  }

  if (parsed.values.help) {
    printHelp();
    return;
  }

  const cwd = path.resolve(parsed.values.cwd ?? process.cwd());
  const runtimeDir = path.join(cwd, '.ai', 'runtime');

  if (!fs.existsSync(runtimeDir)) {
    console.error(`upgrade: ${runtimeDir} does not exist.`);
    console.error('Run `ai-runtime-kit init` first.');
    process.exit(1);
  }

  const installedVersion = readProjectKitVersion(cwd);
  if (!installedVersion) {
    console.error('upgrade: .ai/runtime/KIT_VERSION not found.');
    console.error('Either re-run init in --migrate mode or write KIT_VERSION manually.');
    process.exit(1);
  }

  const cmp = compareSemver(KIT_VERSION, installedVersion);
  if (cmp === 0) {
    console.log(`Already on kit ${KIT_VERSION}. No upgrade needed.`);
    return;
  }
  if (cmp < 0) {
    if (!parsed.values['allow-downgrade']) {
      console.error(`upgrade: refusing downgrade — installed ${installedVersion} > kit ${KIT_VERSION}.`);
      console.error('Pass --allow-downgrade to override.');
      process.exit(1);
    }
    console.warn(`Warning: downgrading from ${installedVersion} to ${KIT_VERSION}.`);
  }

  // Git dirty check
  if (!parsed.values['allow-dirty']) {
    if (isGitRepo(cwd)) {
      const status = gitStatusPorcelain('.ai/runtime', cwd);
      if (!status.ok) {
        console.error(`upgrade: git status check failed: ${status.error}`);
        console.error('Pass --allow-dirty to skip the git check.');
        process.exit(1);
      }
      if (status.lines.length) {
        console.error('upgrade: .ai/runtime/ has uncommitted changes:');
        for (const line of status.lines) console.error(`  ${line}`);
        console.error('Commit or stash them, or pass --allow-dirty.');
        process.exit(1);
      }
    } else {
      console.warn(`upgrade: ${cwd} is not a git repository — skipping dirty check.`);
    }
  }

  // Compute and print diff
  const diff = computeRuntimeDiff(runtimeDir);
  console.log(`Upgrading kit ${installedVersion} → ${KIT_VERSION}`);
  console.log('');
  printDiffSummary(diff);

  if (
    diff.added.length === 0 &&
    diff.removed.length === 0 &&
    diff.replaced.length === 0
  ) {
    console.log('No file-level changes. Updating KIT_VERSION only.');
    writeProjectKitVersion(cwd, KIT_VERSION);
    return;
  }

  if (!parsed.values['no-diff']) {
    printPerFileDiff(diff, runtimeDir);
  }

  // Confirm
  let ok;
  if (parsed.values.yes) {
    ok = true;
    console.log('--yes passed; proceeding without prompt.');
  } else {
    ok = await confirm('Apply this upgrade?', { defaultYes: false });
  }

  if (!ok) {
    console.log('Aborted. No changes made.');
    process.exit(2);
  }

  removeDir(runtimeDir);
  copyKitRuntimeTo(runtimeDir);
  writeProjectKitVersion(cwd, KIT_VERSION);
  console.log(`Done. Kit upgraded to ${KIT_VERSION}.`);
  console.log('Changes are unstaged; review with `git diff .ai/runtime/` and commit when ready.');
}

function printHelp() {
  console.log(`ai-runtime-kit upgrade [options]

Replace .ai/runtime/ with the kit's current canonical snapshot.

Process:
  1. Verify .ai/runtime/KIT_VERSION exists.
  2. Verify .ai/runtime/ has no uncommitted git changes.
  3. Show file-level ADD / REPLACE / DELETE summary + per-file diff.
  4. Prompt: Apply this upgrade? (y/N).
  5. On y: rm -rf .ai/runtime/, lay down new snapshot, update KIT_VERSION.

Never touches .ai/project/.

Options:
  --cwd <dir>          Target directory (default: process.cwd())
  --yes, -y            Skip the y/N prompt (apply immediately)
  --no-diff            Skip the per-file diff preview (still shows summary)
  --allow-dirty        Skip the git dirty check
  --allow-downgrade    Permit installing an older kit version
  -h, --help           Show this help.`);
}

module.exports = { run, printHelp };
