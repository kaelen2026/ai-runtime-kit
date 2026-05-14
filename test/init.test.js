'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const init = require('../src/init');
const { KIT_VERSION } = require('../src/version');

function makeTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'arkit-init-'));
}

test('init: fresh project lays down .ai/runtime/ and .ai/project/ skeleton', () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);

  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/BOOTSTRAP.md')), 'runtime BOOTSTRAP.md');
  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/INDEX.md')), 'runtime INDEX.md');
  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/SAFETY.md')), 'runtime SAFETY.md');
  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/KIT_VERSION')), 'KIT_VERSION');
  const v = fs.readFileSync(path.join(cwd, '.ai/runtime/KIT_VERSION'), 'utf8').trim();
  assert.equal(v, KIT_VERSION, 'KIT_VERSION content matches kit version');

  for (const d of ['prds', 'specs', 'plans', 'tasks', 'reviews', 'verifications', 'adr', 'contracts', 'memory', 'rules', 'skills', 'hooks']) {
    assert.ok(fs.existsSync(path.join(cwd, '.ai/project', d)), `project/${d}`);
  }
  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/prds/_template.md')), 'runtime PRD template');
  assert.ok(fs.existsSync(path.join(cwd, '.ai/project/STATE.md')), 'STATE.md');
  assert.ok(fs.existsSync(path.join(cwd, '.ai/project/tasks/TASK_STATUS.md')), 'project TASK_STATUS.md');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init: refuses when .ai/runtime/ already exists', () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);

  const r = require('node:child_process').spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'init', '--cwd', cwd],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 1, 'init exits 1 on existing runtime');
  assert.match(r.stderr, /already exists/i);

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init --migrate: tolerates empty .ai/runtime/ left by git rm (v0.3.0 fix)', () => {
  const cwd = makeTmp();
  // Simulate post-`git rm` state: empty runtime parent dirs only.
  fs.mkdirSync(path.join(cwd, '.ai/runtime/hooks/pre-reviewer'), { recursive: true });
  fs.mkdirSync(path.join(cwd, '.ai/runtime/rules/typescript'), { recursive: true });
  fs.mkdirSync(path.join(cwd, '.ai/project/specs'), { recursive: true });
  fs.writeFileSync(path.join(cwd, '.ai/project/STATE.md'), 'existing\n');

  init.run(['--cwd', cwd, '--migrate']);

  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/BOOTSTRAP.md')), 'runtime laid down');
  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/KIT_VERSION')), 'KIT_VERSION written');
  assert.equal(
    fs.readFileSync(path.join(cwd, '.ai/project/STATE.md'), 'utf8'),
    'existing\n',
    'pre-existing project state preserved',
  );

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init --migrate: allows pre-existing .ai/project/ but refuses if .ai/runtime/ exists', () => {
  const cwd = makeTmp();
  fs.mkdirSync(path.join(cwd, '.ai/project'), { recursive: true });
  fs.writeFileSync(path.join(cwd, '.ai/project/PRE_EXISTING.md'), 'hi');

  init.run(['--cwd', cwd, '--migrate']);
  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/BOOTSTRAP.md')), 'runtime created');
  assert.ok(fs.existsSync(path.join(cwd, '.ai/project/PRE_EXISTING.md')), 'pre-existing project file kept');
  assert.ok(!fs.existsSync(path.join(cwd, '.ai/project/STATE.md')), 'pre-existing project => no STATE.md overwritten/added');

  // Second --migrate run should refuse (.ai/runtime/ now has content)
  const r = require('node:child_process').spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'init', '--cwd', cwd, '--migrate'],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 1, 'second --migrate exits 1');
  assert.match(r.stderr, /has content/i);

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init: writes CLAUDE.md agent entry at project root', () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);

  const claudeMd = path.join(cwd, 'CLAUDE.md');
  assert.ok(fs.existsSync(claudeMd), 'CLAUDE.md exists');
  const body = fs.readFileSync(claudeMd, 'utf8');
  assert.match(body, /# CLAUDE\.md/, 'has heading');
  assert.match(body, /\.ai\/runtime\/BOOTSTRAP\.md/, 'points to BOOTSTRAP');
  assert.match(body, /\.ai\/project\/STATE\.md/, 'mentions STATE.md');
  assert.doesNotMatch(body, /this repo is the kit source/i, 'no dogfood-specific content');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init --no-agent-entry: skips CLAUDE.md creation', () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd, '--no-agent-entry']);

  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/BOOTSTRAP.md')), 'runtime still laid down');
  assert.ok(!fs.existsSync(path.join(cwd, 'CLAUDE.md')), 'CLAUDE.md skipped');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init: refuses when CLAUDE.md already exists at project root', () => {
  const cwd = makeTmp();
  fs.writeFileSync(path.join(cwd, 'CLAUDE.md'), 'pre-existing\n');

  const r = require('node:child_process').spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'init', '--cwd', cwd],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 1, 'exits 1 on existing CLAUDE.md');
  assert.match(r.stderr, /CLAUDE\.md already exists/i);
  assert.equal(
    fs.readFileSync(path.join(cwd, 'CLAUDE.md'), 'utf8'),
    'pre-existing\n',
    'pre-existing CLAUDE.md untouched',
  );
  assert.ok(!fs.existsSync(path.join(cwd, '.ai')), 'no .ai/ written on refusal');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init: hints when .ai/runtime/ is gitignored (v0.4.1)', () => {
  const cwd = makeTmp();
  const { spawnSync } = require('node:child_process');
  spawnSync('git', ['init', '-q', '-b', 'main'], { cwd });
  fs.writeFileSync(path.join(cwd, '.gitignore'), '.ai/runtime/\n');

  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'init', '--cwd', cwd],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 0, `init exits 0; stderr=${r.stderr}`);
  assert.match(r.stdout, /\.ai\/runtime\/ is gitignored/, 'prints gitignore hint');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init: silent when .ai/runtime/ is NOT gitignored', () => {
  const cwd = makeTmp();
  const { spawnSync } = require('node:child_process');
  spawnSync('git', ['init', '-q', '-b', 'main'], { cwd });
  // No .gitignore — runtime is tracked.

  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'init', '--cwd', cwd],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 0, `init exits 0; stderr=${r.stderr}`);
  assert.doesNotMatch(r.stdout, /gitignored/, 'no gitignore hint in normal case');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init: silent in non-git directory (no gitignore hint)', () => {
  const cwd = makeTmp();
  // No git init.

  const r = require('node:child_process').spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'init', '--cwd', cwd],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 0, `init exits 0; stderr=${r.stderr}`);
  assert.doesNotMatch(r.stdout, /gitignored/, 'no gitignore hint in non-git case');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('init --migrate: tolerates pre-existing CLAUDE.md', () => {
  const cwd = makeTmp();
  fs.writeFileSync(path.join(cwd, 'CLAUDE.md'), 'hand-written\n');

  init.run(['--cwd', cwd, '--migrate']);

  assert.ok(fs.existsSync(path.join(cwd, '.ai/runtime/BOOTSTRAP.md')), 'runtime laid down');
  assert.equal(
    fs.readFileSync(path.join(cwd, 'CLAUDE.md'), 'utf8'),
    'hand-written\n',
    'pre-existing CLAUDE.md preserved byte-for-byte',
  );

  fs.rmSync(cwd, { recursive: true, force: true });
});

