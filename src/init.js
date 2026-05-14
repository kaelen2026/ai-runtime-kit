'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');

const { copyKitRuntimeTo, dirHasFiles, removeDir } = require('./snapshot');
const { writeProjectKitVersion, KIT_VERSION } = require('./version');
const { projectStateMd, projectTaskStatusMd, agentEntryClaudeMd } = require('./templates');
const { isPathGitignored } = require('./git');

const PROJECT_SKELETON_DIRS = [
  'prds',
  'features',
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
        'no-agent-entry': { type: 'boolean', default: false },
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
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');

  // Detect "real" presence — empty-only directory tree counts as
  // absent so `init --migrate` post `git rm` doesn't have to be
  // chased with a manual `rm -rf` (kit v0.3.0 fix).
  const runtimeHasFiles = dirHasFiles(runtimeDir);
  const projectHasFiles = dirHasFiles(projectDir);
  const runtimeEmptyButPresent = fs.existsSync(runtimeDir) && !runtimeHasFiles;
  const projectEmptyButPresent = fs.existsSync(projectDir) && !projectHasFiles;
  const claudeMdExists = fs.existsSync(claudeMdPath);
  const writeAgentEntry = !parsed.values['no-agent-entry'];

  if (!parsed.values.migrate) {
    if (runtimeHasFiles || projectHasFiles) {
      console.error('init: .ai/runtime/ or .ai/project/ already exists.');
      console.error('If you intended to bootstrap an existing-.ai/project/ repo, pass --migrate.');
      console.error('To upgrade an installed runtime, use: ai-runtime-kit upgrade');
      process.exit(1);
    }
    if (writeAgentEntry && claudeMdExists) {
      console.error('init: CLAUDE.md already exists at the project root.');
      console.error('Pass --no-agent-entry to skip CLAUDE.md generation, or --migrate to keep the existing file.');
      process.exit(1);
    }
  } else {
    if (runtimeHasFiles) {
      console.error('init --migrate: .ai/runtime/ already has content; refusing to overwrite.');
      console.error('Move it aside or use: ai-runtime-kit upgrade');
      process.exit(1);
    }
    // In --migrate mode .ai/project/ MAY already exist with content;
    // we only lay down .ai/runtime/ and skip any pre-existing
    // project skeleton files.
  }

  // Empty parent dirs (e.g. left by `git rm -r .ai/runtime/`) are
  // removed here so copyKitRuntimeTo can re-create the tree cleanly.
  if (runtimeEmptyButPresent) {
    removeDir(runtimeDir);
  }
  // For --migrate (or fresh init), only remove an empty .ai/project/
  // if it has no content — otherwise it stays untouched.
  if (!parsed.values.migrate && projectEmptyButPresent) {
    removeDir(projectDir);
  }

  fs.mkdirSync(aiDir, { recursive: true });
  copyKitRuntimeTo(runtimeDir);
  writeProjectKitVersion(cwd, KIT_VERSION);

  if (!projectHasFiles) {
    fs.mkdirSync(projectDir, { recursive: true });
    for (const d of PROJECT_SKELETON_DIRS) {
      fs.mkdirSync(path.join(projectDir, d), { recursive: true });
    }
    fs.writeFileSync(path.join(projectDir, 'STATE.md'), projectStateMd());
    fs.writeFileSync(path.join(projectDir, 'tasks', 'TASK_STATUS.md'), projectTaskStatusMd());
  }

  let agentEntryWritten = false;
  if (writeAgentEntry && !claudeMdExists) {
    fs.writeFileSync(claudeMdPath, agentEntryClaudeMd());
    agentEntryWritten = true;
  }

  console.log(`ai-runtime-kit ${KIT_VERSION}: initialized .ai/ at ${cwd}`);
  console.log('  - .ai/runtime/  (kit-managed; do not hand-edit)');
  if (!projectHasFiles) {
    console.log('  - .ai/project/  (project-owned; STATE.md and tasks/TASK_STATUS.md scaffolded)');
  } else {
    console.log('  - .ai/project/  (pre-existing; not modified)');
  }
  console.log(`  - .ai/runtime/KIT_VERSION = ${KIT_VERSION}`);
  if (agentEntryWritten) {
    console.log('  - CLAUDE.md     (agent entry; project-owned, never touched by upgrade)');
  } else if (claudeMdExists) {
    console.log('  - CLAUDE.md     (pre-existing; not modified)');
  } else {
    console.log('  - CLAUDE.md     (skipped via --no-agent-entry)');
  }

  if (isPathGitignored('.ai/runtime', cwd) === true) {
    console.log('');
    console.log('Note: .ai/runtime/ is gitignored. Clones of this repo will not');
    console.log('      contain the runtime tree; they will need to run');
    console.log('      `ai-runtime-kit init` or `upgrade` to regenerate it.');
  }
}

function printHelp() {
  console.log(`ai-runtime-kit init [options]

Lay down .ai/runtime/, a .ai/project/ skeleton (if absent), and a
project-root CLAUDE.md (if absent) in the current directory.

Options:
  --cwd <dir>         Target directory (default: process.cwd())
  --migrate           Allow pre-existing .ai/project/ and/or
                      CLAUDE.md (for bootstrapping an existing repo
                      into kit-consumer mode). Still refuses if
                      .ai/runtime/ already exists.
  --no-agent-entry    Skip CLAUDE.md generation entirely.
  -h, --help          Show this help.

Refuses (without --migrate) if .ai/runtime/, .ai/project/, or
CLAUDE.md already exists. To upgrade an installed runtime, use the
upgrade command instead. CLAUDE.md is project-owned and never
modified by upgrade.`);
}

module.exports = { run, printHelp };
