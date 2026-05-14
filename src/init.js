'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');

const { copyKitRuntimeTo } = require('./snapshot');
const { writeProjectKitVersion, KIT_VERSION } = require('./version');
const { projectStateMd, projectTaskStatusMd } = require('./templates');

const PROJECT_SKELETON_DIRS = [
  'specs',
  'plans',
  'tasks',
  'reviews',
  'verifications',
  'adr',
  'contracts',
  'memory',
  'rules',
  'skills',
  'hooks',
];

function run(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: {
        cwd: { type: 'string' },
        migrate: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
      strict: true,
      allowPositionals: false,
    });
  } catch (e) {
    console.error(`init: ${e.message}`);
    console.error('Try: ai-runtime-kit init --help');
    process.exit(1);
  }

  if (parsed.values.help) {
    printHelp();
    return;
  }

  const cwd = path.resolve(parsed.values.cwd ?? process.cwd());
  const aiDir = path.join(cwd, '.ai');
  const runtimeDir = path.join(aiDir, 'runtime');
  const projectDir = path.join(aiDir, 'project');

  const runtimeExists = fs.existsSync(runtimeDir);
  const projectExists = fs.existsSync(projectDir);

  if (!parsed.values.migrate) {
    if (runtimeExists || projectExists) {
      console.error('init: .ai/runtime/ or .ai/project/ already exists.');
      console.error('If you intended to bootstrap an existing-.ai/project/ repo, pass --migrate.');
      console.error('To upgrade an installed runtime, use: ai-runtime-kit upgrade');
      process.exit(1);
    }
  } else {
    if (runtimeExists) {
      console.error('init --migrate: .ai/runtime/ already exists; refusing to overwrite.');
      console.error('Move it aside or use: ai-runtime-kit upgrade');
      process.exit(1);
    }
    // In --migrate mode .ai/project/ MAY already exist; we only lay down
    // .ai/runtime/ and skip any pre-existing project skeleton files.
  }

  fs.mkdirSync(aiDir, { recursive: true });
  copyKitRuntimeTo(runtimeDir);
  writeProjectKitVersion(cwd, KIT_VERSION);

  if (!projectExists) {
    fs.mkdirSync(projectDir);
    for (const d of PROJECT_SKELETON_DIRS) {
      fs.mkdirSync(path.join(projectDir, d));
    }
    fs.writeFileSync(path.join(projectDir, 'STATE.md'), projectStateMd());
    fs.writeFileSync(path.join(projectDir, 'tasks', 'TASK_STATUS.md'), projectTaskStatusMd());
  }

  console.log(`ai-runtime-kit ${KIT_VERSION}: initialized .ai/ at ${cwd}`);
  console.log('  - .ai/runtime/  (kit-managed; do not hand-edit)');
  if (!projectExists) {
    console.log('  - .ai/project/  (project-owned; STATE.md and tasks/TASK_STATUS.md scaffolded)');
  } else {
    console.log('  - .ai/project/  (pre-existing; not modified)');
  }
  console.log(`  - .ai/runtime/KIT_VERSION = ${KIT_VERSION}`);
}

function printHelp() {
  console.log(`ai-runtime-kit init [options]

Lay down .ai/runtime/ and (if absent) a .ai/project/ skeleton in
the current directory.

Options:
  --cwd <dir>   Target directory (default: process.cwd())
  --migrate     Allow pre-existing .ai/project/ (for bootstrapping
                an existing repo into kit-consumer mode). Still
                refuses if .ai/runtime/ already exists.
  -h, --help    Show this help.

Refuses if .ai/runtime/ or .ai/project/ already exists unless
--migrate is passed. To upgrade an installed runtime, use the
upgrade command instead.`);
}

module.exports = { run, printHelp };
