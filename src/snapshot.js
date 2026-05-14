'use strict';

const fs = require('node:fs');
const path = require('node:path');

const KIT_RUNTIME_DIR = path.resolve(__dirname, '..', 'runtime');

function copyKitRuntimeTo(targetRuntimeDir) {
  if (fs.existsSync(targetRuntimeDir)) {
    throw new Error(`copyKitRuntimeTo: target already exists: ${targetRuntimeDir}`);
  }
  fs.cpSync(KIT_RUNTIME_DIR, targetRuntimeDir, { recursive: true });
}

function listKitRuntimeFiles() {
  const out = [];
  walk(KIT_RUNTIME_DIR, '');
  function walk(absDir, relDir) {
    const entries = fs.readdirSync(absDir, { withFileTypes: true });
    for (const entry of entries) {
      const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(absDir, entry.name), rel);
      } else {
        out.push(rel);
      }
    }
  }
  return out.sort();
}

function listFilesUnder(absDir) {
  if (!fs.existsSync(absDir)) return [];
  const out = [];
  walk(absDir, '');
  function walk(dir, relDir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), rel);
      } else {
        out.push(rel);
      }
    }
  }
  return out.sort();
}

function removeDir(absDir) {
  if (fs.existsSync(absDir)) {
    fs.rmSync(absDir, { recursive: true, force: true });
  }
}

module.exports = {
  KIT_RUNTIME_DIR,
  copyKitRuntimeTo,
  listKitRuntimeFiles,
  listFilesUnder,
  removeDir,
};
