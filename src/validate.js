'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');

// Per v0.9.0 INDEX § Traceability:
//   PRD     — no parent required (chain root)
//   Feature — ## Parent PRD
//   Spec    — ## Parent Feature
//   Plan    — ## Parent Spec
//   Task    — ## Parent Spec + ## Parent Plan
//   Review  — ## Parent Spec
const ARTIFACT_RULES = {
  prds:     { dir: 'prds',     required: [] },
  features: { dir: 'features', required: ['Parent PRD'] },
  specs:    { dir: 'specs',    required: ['Parent Feature'] },
  plans:    { dir: 'plans',    required: ['Parent Spec'] },
  tasks:    { dir: 'tasks',    required: ['Parent Spec', 'Parent Plan'] },
  reviews:  { dir: 'reviews',  required: ['Parent Spec'] },
};

const VALID_STATUSES = {
  prds:     ['DRAFT', 'APPROVED', 'REJECTED', 'SUPERSEDED'],
  features: ['DRAFT', 'APPROVED', 'REJECTED', 'SUPERSEDED'],
  specs:    ['DRAFT', 'APPROVED', 'REJECTED', 'SUPERSEDED'],
  plans:    ['PLANNED', 'IN_PROGRESS', 'DONE'],
  tasks:    ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'],
};

// Files within an artifact dir that are NOT instances of that
// artifact type. TASK_STATUS.md is a top-level status tracker
// produced by `init`, not a per-task instance.
const EXCLUDED_FILENAMES = new Set(['TASK_STATUS.md']);

function walkMd(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_FILENAMES.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMd(p));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function parseSections(content) {
  // Returns { sectionName: bodyString }.
  // Sections are top-level `## ` headings.
  const lines = content.split('\n');
  const sections = {};
  let cur = null;
  let buf = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (cur !== null) sections[cur] = buf.join('\n').trim();
      cur = m[1].trim();
      buf = [];
    } else if (cur !== null) {
      buf.push(line);
    }
  }
  if (cur !== null) sections[cur] = buf.join('\n').trim();
  return sections;
}

function firstValueLine(body) {
  // Returns first non-empty, non-comment line; strips surrounding backticks.
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('<!--')) continue;
    return line.replace(/^`/, '').replace(/`$/, '');
  }
  return null;
}

function isNoneRendering(value) {
  return value !== null && value.startsWith('(none');
}

function validate(projectRoot, _options = {}) {
  const errors = [];
  const warnings = [];
  const summary = { prds: 0, features: 0, specs: 0, plans: 0, tasks: 0, reviews: 0 };

  const aiProject = path.join(projectRoot, '.ai', 'project');
  if (!fs.existsSync(aiProject)) {
    return { errors, warnings, summary };
  }

  for (const [artifact, rule] of Object.entries(ARTIFACT_RULES)) {
    const dir = path.join(aiProject, rule.dir);
    const files = walkMd(dir);
    summary[artifact] = files.length;

    for (const file of files) {
      const relFile = path.relative(projectRoot, file);
      const content = fs.readFileSync(file, 'utf8');
      const sections = parseSections(content);

      for (const parentName of rule.required) {
        const sectionBody = sections[parentName];
        if (sectionBody === undefined) {
          errors.push({
            artifact,
            file: relFile,
            type: 'missing-parent',
            message: `Missing required ## ${parentName} section`,
          });
          continue;
        }
        const value = firstValueLine(sectionBody);
        if (value === null) {
          errors.push({
            artifact,
            file: relFile,
            type: 'empty-parent',
            message: `## ${parentName} section is empty`,
          });
          continue;
        }
        if (isNoneRendering(value)) continue;
        const resolved = path.join(projectRoot, value);
        if (!fs.existsSync(resolved)) {
          errors.push({
            artifact,
            file: relFile,
            type: 'unresolved-parent',
            message: `## ${parentName} points to non-existent path: ${value}`,
          });
        }
      }

      const allowedStatuses = VALID_STATUSES[artifact];
      if (allowedStatuses && sections.Status !== undefined) {
        const statusValue = firstValueLine(sections.Status);
        if (statusValue !== null && !allowedStatuses.includes(statusValue)) {
          warnings.push({
            artifact,
            file: relFile,
            type: 'unexpected-status',
            message: `Status "${statusValue}" not in allowed values: ${allowedStatuses.join(', ')}`,
          });
        }
      }
    }
  }

  return { errors, warnings, summary };
}

function run(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: {
        cwd: { type: 'string' },
        json: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
      strict: true,
      allowPositionals: false,
    });
  } catch (e) {
    console.error(`validate: ${e.message}`);
    process.exit(1);
  }

  if (parsed.values.help) {
    printHelp();
    return;
  }

  const cwd = path.resolve(parsed.values.cwd ?? process.cwd());
  const result = validate(cwd);
  const status = result.errors.length === 0 ? 'PASS' : 'FAIL';

  if (parsed.values.json) {
    console.log(JSON.stringify({ ...result, result: status }, null, 2));
  } else {
    console.log(`Validating .ai/project/ at ${cwd}\n`);
    for (const [name, count] of Object.entries(result.summary)) {
      console.log(`  ${name.padEnd(10)} ${count}`);
    }
    console.log('');
    if (result.errors.length > 0) {
      console.log(`Errors: ${result.errors.length}`);
      for (const e of result.errors) {
        console.log(`  - ${e.file}: ${e.type}: ${e.message}`);
      }
    } else {
      console.log('Errors:   none');
    }
    if (result.warnings.length > 0) {
      console.log(`Warnings: ${result.warnings.length}`);
      for (const w of result.warnings) {
        console.log(`  - ${w.file}: ${w.type}: ${w.message}`);
      }
    } else {
      console.log('Warnings: none');
    }
    console.log('');
    console.log(
      `Result: ${status === 'PASS' ? 'PASS (clean tree)' : `FAIL (${result.errors.length} errors)`}`,
    );
  }

  process.exit(result.errors.length === 0 ? 0 : 1);
}

function printHelp() {
  console.log(`ai-runtime-kit validate [options]

Validate the .ai/project/ tree's structural integrity. Walks
every artifact and checks that:

  - Required ## Parent <Type> sections are present per the
    v0.9.0 INDEX § Traceability rules.
  - Cited parent paths resolve to real files on disk.
  - Status values are in the allowed set per artifact type.

Options:
  --cwd <dir>   Target project root (default: process.cwd())
  --json        Output structured JSON instead of human text
  -h, --help    Show this help

Exits 0 on no errors (warnings allowed and printed); 1 on any
error. See .ai/runtime/INDEX.md § Traceability for the rules.`);
}

module.exports = { validate, run, printHelp };
