'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const init = require('../src/init');
const upgrade = require('../src/upgrade');
const { computeRuntimeDiff } = require('../src/diff');
const { KIT_VERSION } = require('../src/version');

function makeTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'arkit-upgrade-'));
}

function gitInit(cwd) {
  spawnSync('git', ['init', '-q', '-b', 'main'], { cwd });
  spawnSync('git', ['config', 'user.email', 'test@test'], { cwd });
  spawnSync('git', ['config', 'user.name', 'test'], { cwd });
  spawnSync('git', ['add', '-A'], { cwd });
  spawnSync('git', ['commit', '-qm', 'init'], { cwd });
}

test('upgrade: no-op when KIT_VERSION already matches kit version', async () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);
  gitInit(cwd);

  const logs = [];
  const origLog = console.log;
  console.log = (...args) => { logs.push(args.join(' ')); };
  try {
    await upgrade.run(['--cwd', cwd, '--yes']);
  } finally {
    console.log = origLog;
  }
  assert.ok(logs.some((l) => /Already on kit/.test(l)), 'announces no-op');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('upgrade: refuses when .ai/runtime/ is dirty (git porcelain non-empty)', () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);
  gitInit(cwd);

  // Make .ai/runtime/ dirty: edit a file
  fs.appendFileSync(path.join(cwd, '.ai/runtime/SAFETY.md'), '\n<!-- local edit -->\n');
  // Also need a kit-version mismatch to trigger an upgrade attempt rather than no-op.
  fs.writeFileSync(path.join(cwd, '.ai/runtime/KIT_VERSION'), '0.0.1\n');

  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'upgrade', '--cwd', cwd, '--yes'],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 1, 'exits 1');
  assert.match(r.stderr, /uncommitted changes/i);

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('upgrade: refuses downgrade unless --allow-downgrade', () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);
  gitInit(cwd);

  // Mark project as installed at a fake-future version
  fs.writeFileSync(path.join(cwd, '.ai/runtime/KIT_VERSION'), '99.0.0\n');
  spawnSync('git', ['commit', '-qam', 'bump'], { cwd });

  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'upgrade', '--cwd', cwd, '--yes'],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 1, 'exits 1');
  assert.match(r.stderr, /refusing downgrade/i);

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('upgrade: applies replace when version is older and --yes is given', async () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);
  gitInit(cwd);

  // Downgrade KIT_VERSION + edit a file so the diff is non-empty
  fs.writeFileSync(path.join(cwd, '.ai/runtime/KIT_VERSION'), '0.0.1\n');
  fs.writeFileSync(path.join(cwd, '.ai/runtime/SAFETY.md'), '# old SAFETY\n');
  spawnSync('git', ['commit', '-qam', 'pretend older'], { cwd });

  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'bin', 'cli.js'), 'upgrade', '--cwd', cwd, '--yes', '--no-diff'],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 0, 'exits 0');
  assert.match(r.stdout, /Done. Kit upgraded/);

  // KIT_VERSION should now match KIT_VERSION value
  const v = fs.readFileSync(path.join(cwd, '.ai/runtime/KIT_VERSION'), 'utf8').trim();
  assert.equal(v, KIT_VERSION);

  // SAFETY.md restored from kit canonical
  const safety = fs.readFileSync(path.join(cwd, '.ai/runtime/SAFETY.md'), 'utf8');
  assert.match(safety, /Runtime Safety Rules/);

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('upgrade --pager: spawns the pager process when stdout is a TTY (smoke)', () => {
  // Can't easily exercise the TTY branch in node:test (stdout is a pipe).
  // The non-TTY branch should still work: --pager is silently ignored
  // when stdout is not a TTY, and the existing direct-write path runs.
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);
  gitInit(cwd);
  fs.writeFileSync(path.join(cwd, '.ai/runtime/KIT_VERSION'), '0.0.1\n');
  fs.writeFileSync(path.join(cwd, '.ai/runtime/SAFETY.md'), '# placeholder for diff\n');
  spawnSync('git', ['commit', '-qam', 'pretend older'], { cwd });

  const r = spawnSync(
    process.execPath,
    [
      path.join(__dirname, '..', 'bin', 'cli.js'),
      'upgrade',
      '--cwd', cwd,
      '--yes',
      '--pager', 'cat',
    ],
    { encoding: 'utf8' },
  );
  // Without TTY, --pager is bypassed; upgrade still applies normally.
  assert.equal(r.status, 0, 'exits 0');
  assert.match(r.stdout, /Done. Kit upgraded/);

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('computeRuntimeDiff: detects ADD / REPLACE / DELETE', () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);

  // Vanilla just-init'd project: diff against kit should be all UNCHANGED
  let diff = computeRuntimeDiff(path.join(cwd, '.ai/runtime'));
  assert.equal(diff.added.length, 0, 'no added');
  assert.equal(diff.removed.length, 0, 'no removed');
  assert.equal(diff.replaced.length, 0, 'no replaced');
  assert.ok(diff.unchanged.length > 20, 'most files unchanged');

  // Modify, add, and delete a file
  fs.writeFileSync(path.join(cwd, '.ai/runtime/SAFETY.md'), 'modified');
  fs.writeFileSync(path.join(cwd, '.ai/runtime/EXTRA.md'), 'added');
  fs.unlinkSync(path.join(cwd, '.ai/runtime/BOOTSTRAP.md'));

  diff = computeRuntimeDiff(path.join(cwd, '.ai/runtime'));
  assert.ok(diff.replaced.includes('SAFETY.md'), 'detects replace');
  assert.ok(diff.removed.includes('EXTRA.md'), 'detects remove (extra-in-project)');
  assert.ok(diff.added.includes('BOOTSTRAP.md'), 'detects add (missing-in-project)');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('upgrade: never touches project-root CLAUDE.md', () => {
  const cwd = makeTmp();
  init.run(['--cwd', cwd]);
  gitInit(cwd);

  // Tamper with CLAUDE.md so we can detect any rewrite.
  const claudeMd = path.join(cwd, 'CLAUDE.md');
  fs.writeFileSync(claudeMd, 'TAMPERED\n');

  // Force-downgrade KIT_VERSION so upgrade has work to do.
  fs.writeFileSync(path.join(cwd, '.ai/runtime/KIT_VERSION'), '0.0.1');

  const r = spawnSync(
    process.execPath,
    [
      path.join(__dirname, '..', 'bin', 'cli.js'),
      'upgrade',
      '--cwd', cwd,
      '--yes',
      '--no-diff',
      '--allow-dirty',
    ],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 0, `upgrade exits 0; stderr=${r.stderr}`);
  assert.equal(
    fs.readFileSync(claudeMd, 'utf8'),
    'TAMPERED\n',
    'CLAUDE.md untouched by upgrade',
  );

  fs.rmSync(cwd, { recursive: true, force: true });
});
