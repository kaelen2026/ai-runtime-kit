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

  for (const d of ['specs', 'plans', 'tasks', 'reviews', 'verifications', 'adr', 'contracts', 'memory', 'rules', 'skills', 'hooks']) {
    assert.ok(fs.existsSync(path.join(cwd, '.ai/project', d)), `project/${d}`);
  }
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
