'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { listFilesUnder, KIT_RUNTIME_DIR } = require('./snapshot');

function computeRuntimeDiff(projectRuntimeDir) {
  const kitFiles = new Set(listFilesUnder(KIT_RUNTIME_DIR));
  const projectFiles = new Set(listFilesUnder(projectRuntimeDir).filter((f) => f !== 'KIT_VERSION'));

  const added = [];
  const removed = [];
  const replaced = [];
  const unchanged = [];

  for (const f of kitFiles) {
    if (!projectFiles.has(f)) {
      added.push(f);
    } else {
      const a = fs.readFileSync(path.join(KIT_RUNTIME_DIR, f));
      const b = fs.readFileSync(path.join(projectRuntimeDir, f));
      if (a.equals(b)) unchanged.push(f);
      else replaced.push(f);
    }
  }
  for (const f of projectFiles) {
    if (!kitFiles.has(f)) removed.push(f);
  }

  added.sort();
  removed.sort();
  replaced.sort();
  unchanged.sort();

  return { added, removed, replaced, unchanged };
}

function printDiffSummary(diff) {
  const { added, removed, replaced, unchanged } = diff;
  console.log('Upgrade preview:');
  console.log(`  ${added.length} file(s) to ADD`);
  console.log(`  ${replaced.length} file(s) to REPLACE`);
  console.log(`  ${removed.length} file(s) to DELETE`);
  console.log(`  ${unchanged.length} file(s) UNCHANGED`);
  console.log('');
  if (added.length) {
    console.log('ADD:');
    for (const f of added) console.log(`  + ${f}`);
    console.log('');
  }
  if (replaced.length) {
    console.log('REPLACE:');
    for (const f of replaced) console.log(`  ~ ${f}`);
    console.log('');
  }
  if (removed.length) {
    console.log('DELETE:');
    for (const f of removed) console.log(`  - ${f}`);
    console.log('');
  }
}

function printPerFileDiff(diff, projectRuntimeDir, out = process.stdout) {
  const writeLine = (line) => out.write(`${line}\n`);
  for (const f of diff.replaced) {
    const a = path.join(projectRuntimeDir, f);
    const b = path.join(KIT_RUNTIME_DIR, f);
    writeLine(`--- a/.ai/runtime/${f}`);
    writeLine(`+++ b/.ai/runtime/${f} (kit)`);
    const r = spawnSync('diff', ['-u', a, b], { encoding: 'utf8' });
    if (r.stdout) {
      const body = r.stdout.split('\n').slice(2).join('\n');
      out.write(body);
    }
    writeLine('');
  }
}

module.exports = { computeRuntimeDiff, printDiffSummary, printPerFileDiff };
