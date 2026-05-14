'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const validate = require('../src/validate');

function makeTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'arkit-validate-'));
}

function writeArtifact(cwd, relPath, body) {
  const full = path.join(cwd, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, body);
}

// Minimal artifact bodies used by clean-tree fixture.
const PRD_BODY = `# PRD: x

## Status

DRAFT
`;

const FEATURE_BODY = `# Feature: x

## Status

DRAFT

## Parent PRD

\`.ai/project/prds/2026-05-14-x/prd.md\`
`;

const SPEC_BODY = `# Spec: x

## Status

DRAFT

## Parent Feature

\`.ai/project/features/2026-05-14-x/feature.md\`
`;

test('validate: clean tree returns no errors and accurate summary', () => {
  const cwd = makeTmp();
  writeArtifact(cwd, '.ai/project/prds/2026-05-14-x/prd.md', PRD_BODY);
  writeArtifact(cwd, '.ai/project/features/2026-05-14-x/feature.md', FEATURE_BODY);
  writeArtifact(cwd, '.ai/project/specs/2026-05-14-x/spec.md', SPEC_BODY);

  const result = validate.validate(cwd);

  assert.deepEqual(result.errors, [], 'no errors');
  assert.equal(result.summary.prds, 1, 'prd count');
  assert.equal(result.summary.features, 1, 'feature count');
  assert.equal(result.summary.specs, 1, 'spec count');
  assert.equal(result.summary.plans, 0, 'plan count');
  assert.equal(result.summary.tasks, 0, 'task count');
  assert.equal(result.summary.reviews, 0, 'review count');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('validate: spec missing ## Parent Feature is a missing-parent error', () => {
  const cwd = makeTmp();
  writeArtifact(
    cwd,
    '.ai/project/specs/2026-05-14-x/spec.md',
    `# Spec: x\n\n## Status\n\nDRAFT\n\n## Goal\n\nDescribe.\n`,
  );

  const result = validate.validate(cwd);

  assert.equal(result.errors.length, 1, 'one error');
  assert.equal(result.errors[0].type, 'missing-parent', 'error type');
  assert.match(result.errors[0].message, /Parent Feature/, 'message mentions Parent Feature');
  assert.match(result.errors[0].file, /spec\.md$/, 'file is the spec');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('validate: cited parent path that does not exist is an unresolved-parent error', () => {
  const cwd = makeTmp();
  writeArtifact(
    cwd,
    '.ai/project/features/2026-05-14-x/feature.md',
    `# Feature: x\n\n## Status\n\nDRAFT\n\n## Parent PRD\n\n\`.ai/project/prds/2026-05-14-nonexistent/prd.md\`\n`,
  );

  const result = validate.validate(cwd);

  assert.equal(result.errors.length, 1, 'one error');
  assert.equal(result.errors[0].type, 'unresolved-parent', 'error type');
  assert.match(result.errors[0].message, /nonexistent/, 'message names the missing path');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('validate: (none — ...) rendering bypasses parent-path resolution', () => {
  const cwd = makeTmp();
  writeArtifact(
    cwd,
    '.ai/project/specs/2026-05-14-x/spec.md',
    `# Spec: x\n\n## Status\n\nDRAFT\n\n## Parent Feature\n\n(none — engineering-only)\n`,
  );

  const result = validate.validate(cwd);

  assert.equal(result.errors.length, 0, 'no errors — (none — ...) is valid');
  assert.equal(result.summary.specs, 1, 'spec counted');

  fs.rmSync(cwd, { recursive: true, force: true });
});

const { spawnSync } = require('node:child_process');

const CLI = path.join(__dirname, '..', 'bin', 'cli.js');

test('validate CLI: --json outputs valid JSON with documented shape', () => {
  const cwd = makeTmp();
  writeArtifact(cwd, '.ai/project/prds/2026-05-14-x/prd.md', PRD_BODY);

  const r = spawnSync(process.execPath, [CLI, 'validate', '--cwd', cwd, '--json'], {
    encoding: 'utf8',
  });

  assert.equal(r.status, 0, `expected exit 0 on clean tree; stderr=${r.stderr}`);
  const parsed = JSON.parse(r.stdout);
  assert.ok(Array.isArray(parsed.errors), 'errors is array');
  assert.ok(Array.isArray(parsed.warnings), 'warnings is array');
  assert.ok(parsed.summary && typeof parsed.summary === 'object', 'summary is object');
  assert.equal(parsed.result, 'PASS', 'result is PASS');

  fs.rmSync(cwd, { recursive: true, force: true });
});

test('validate CLI: dogfood — runs against this repo .ai/ tree and exits 0', () => {
  const repoRoot = path.join(__dirname, '..');

  const r = spawnSync(process.execPath, [CLI, 'validate', '--cwd', repoRoot], {
    encoding: 'utf8',
  });

  assert.equal(
    r.status,
    0,
    `expected exit 0 on this kit's tree; stderr=${r.stderr}\nstdout=${r.stdout}`,
  );
  assert.match(r.stdout, /Result: PASS/, 'human output shows PASS verdict');
});
