'use strict';

const fs = require('node:fs');
const path = require('node:path');

const KIT_PKG = require('../package.json');

const KIT_VERSION = KIT_PKG.version;

function kitVersionFilePath(projectRoot) {
  return path.join(projectRoot, '.ai', 'runtime', 'KIT_VERSION');
}

function readProjectKitVersion(projectRoot) {
  const f = kitVersionFilePath(projectRoot);
  if (!fs.existsSync(f)) return null;
  return fs.readFileSync(f, 'utf8').trim();
}

function writeProjectKitVersion(projectRoot, version) {
  fs.writeFileSync(kitVersionFilePath(projectRoot), `${version}\n`);
}

// Returns 1 / 0 / -1 if a is newer / equal / older than b. Pre-release tags
// ignored (we don't need full semver here — v0.x and v1.x suffice).
function compareSemver(a, b) {
  const norm = (s) => s.replace(/^v/, '').split('-')[0].split('.').map(Number);
  const [aMaj, aMin, aPat] = norm(a);
  const [bMaj, bMin, bPat] = norm(b);
  if (aMaj !== bMaj) return aMaj > bMaj ? 1 : -1;
  if (aMin !== bMin) return aMin > bMin ? 1 : -1;
  if (aPat !== bPat) return aPat > bPat ? 1 : -1;
  return 0;
}

module.exports = {
  KIT_VERSION,
  kitVersionFilePath,
  readProjectKitVersion,
  writeProjectKitVersion,
  compareSemver,
};
