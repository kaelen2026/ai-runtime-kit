#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');

const HELP = `ai-runtime-kit ${pkg.version}

Usage: ai-runtime-kit <command> [options]

Commands:
  init        Initialize .ai/ runtime in the current directory.
  upgrade     Upgrade .ai/runtime/ to the kit's current version.
  validate    Check .ai/project/ tree structural integrity.
  --help, -h  Show this help.
  --version   Show kit version.

Run \`ai-runtime-kit <command> --help\` for command-specific options.

Design spec:
  ai-workflow-demo/.ai/project/specs/2026-05-13-phase-2-ai-runtime-kit-extraction/spec.md`;

async function main() {
  const cmd = process.argv[2];
  const rest = process.argv.slice(3);

  switch (cmd) {
    case undefined:
    case '--help':
    case '-h':
      console.log(HELP);
      return;
    case '--version':
    case '-v':
      console.log(pkg.version);
      return;
    case 'init':
      require('../src/init').run(rest);
      return;
    case 'upgrade':
      await require('../src/upgrade').run(rest);
      return;
    case 'validate':
      require('../src/validate').run(rest);
      return;
    default:
      console.error(`ai-runtime-kit: unknown command '${cmd}'`);
      console.error('');
      console.error(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`ai-runtime-kit: ${err.message ?? err}`);
  process.exit(1);
});
