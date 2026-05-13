#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');

const HELP = `ai-runtime-kit ${pkg.version}

Usage: ai-runtime-kit <command>

Commands:
  init        Initialize .ai/ runtime in a new project. NOT YET IMPLEMENTED
              (owned by Phase 2 sub-spec S2).
  upgrade     Upgrade .ai/runtime/ to the kit's current version. NOT YET
              IMPLEMENTED (owned by Phase 2 sub-spec S2).
  --help, -h  Show this help.
  --version   Show kit version.

This is the S1 skeleton of ai-runtime-kit. The runtime/ snapshot is in
place; init / upgrade command implementations land under S2.

Design spec:
  .ai/project/specs/2026-05-13-phase-2-ai-runtime-kit-extraction/spec.md
  (in the kit's home project, ai-workflow-demo).`;

const cmd = process.argv[2];

switch (cmd) {
  case undefined:
  case '--help':
  case '-h':
    console.log(HELP);
    break;
  case '--version':
  case '-v':
    console.log(pkg.version);
    break;
  case 'init':
  case 'upgrade':
    console.error(
      `'${cmd}' is not yet implemented in this skeleton (v${pkg.version}).`,
    );
    console.error(`Owned by Phase 2 sub-spec S2.`);
    process.exit(2);
  default:
    console.error(`ai-runtime-kit: unknown command '${cmd}'`);
    console.error('');
    console.error(HELP);
    process.exit(1);
}
