'use strict';

// Project-side templates instantiated by `init` into .ai/project/.

function projectStateMd() {
  return `# Project Runtime State

This file holds the current instance values for runtime metadata
whose definitions live in \`.ai/runtime/\`. Reading this file plus
the corresponding runtime file is equivalent to reading the
single-file version.

## Mode

FEATURE_DEVELOPMENT

### Runtime Intent

Current focus:

- (fill me in: what this project is currently optimizing for)

## Health

GREEN

### Health Drivers

Reasons:

- (fill me in: what is currently true that justifies GREEN)

### Recovery Goals

(fill me in: what would degrade health, and how to recover)

## Priorities

Current runtime health:

- GREEN

Current priority focus:

- (fill me in)
`;
}

function projectTaskStatusMd() {
  return `# Task Status — Active Sets

Active task lifecycle state for this project. Lifecycle schema is
defined in \`.ai/runtime/tasks/TASK_STATUS.md\`.

---

## Active Task Sets

(empty — populate as task sets are opened)
`;
}

function agentEntryClaudeMd() {
  return `# CLAUDE.md

This repository uses an \`.ai/\` runtime managed by
[ai-runtime-kit](https://github.com/kaelen2026/ai-runtime-kit).

## On task start

When the user asks you to do engineering work in this repo:

1. **Read the workflow overview** at \`.ai/runtime/INDEX.md\` —
   the \`## Workflow Overview\` section near the top gives the
   9-phase pipeline (PRD → Feature → Spec → TDD → Execute →
   Verify → Review → Fix → Commit) and points at the per-phase
   agent role files.
2. **Read the project's current state** at
   \`.ai/project/STATE.md\` (mode / health / priorities).
3. **Identify the workflow step** and read the matching role
   file at \`.ai/runtime/agents/<role>.md\` before producing
   that step's artifact:
   - \`prd-writer.md\` — Step 0 (PRD)
   - \`feature-writer.md\` — Step 0.5 (Feature)
   - \`spec-writer.md\` — Step 1 (Spec)
   - \`planner.md\` — Step 2 plan + tasks
   - \`tdd-writer.md\` — Step 1.5 (failing test)
   - \`executor.md\` — Step 2 implementation
   - \`verifier.md\` — Step 3
   - \`reviewer.md\` — Step 4
4. **Honor the traceability chain.** Every artifact you
   produce must carry the required \`## Parent <Type>\`
   section per INDEX § Traceability. Use
   \`(none — <reason>)\` when an upstream is genuinely
   skipped.
5. **Respect governance.** Edits to \`.ai/runtime/**\` require
   a spec + governance branch \`chore/runtime-<topic>\` +
   §2 Scope enumeration; the
   \`pre-executor/runtime-scoped-preflight\` hook will block
   you otherwise. Project-side and kit-code edits don't
   need the governance branch.
6. **Verify before declaring done.** Run \`npm test\` (or
   this project's verification commands), then
   \`ai-runtime-kit validate\` — it audits the structural
   integrity of \`.ai/project/\`.

## Editing this file

This file is **project-owned**. \`ai-runtime-kit upgrade\`
never touches it. Add repo-specific notes (stack,
conventions, gotchas) below — they will be preserved across
kit upgrades.
`;
}

module.exports = { projectStateMd, projectTaskStatusMd, agentEntryClaudeMd };
