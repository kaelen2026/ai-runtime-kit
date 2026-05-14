'use strict';

const { spawnSync } = require('node:child_process');

function gitStatusPorcelain(targetPath, cwd) {
  const r = spawnSync('git', ['status', '--porcelain', '--', targetPath], {
    cwd,
    encoding: 'utf8',
  });
  if (r.status === 128) {
    return { ok: false, error: 'not a git repository' };
  }
  if (r.status !== 0) {
    return { ok: false, error: r.stderr.trim() || `git exited ${r.status}` };
  }
  const lines = r.stdout.split('\n').filter(Boolean);
  return { ok: true, lines };
}

function isGitRepo(cwd) {
  const r = spawnSync('git', ['rev-parse', '--git-dir'], { cwd, encoding: 'utf8' });
  return r.status === 0;
}

module.exports = { gitStatusPorcelain, isGitRepo };
