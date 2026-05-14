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

## Agent entry point

Before doing engineering work in this repo, read the runtime bootstrap:

\`\`\`
.ai/runtime/BOOTSTRAP.md
\`\`\`

That file defines the read sequence (INDEX → CAPABILITIES → RUNTIME_MODE
→ SAFETY → PRIORITIES → workflows). Project-instance state — current
mode, health, priorities — lives at \`.ai/project/STATE.md\`.

## Loading order

1. This file (\`CLAUDE.md\`), auto-loaded by Claude Code from cwd.
2. \`.ai/runtime/BOOTSTRAP.md\` — explicitly read on task start.
3. \`.ai/project/STATE.md\` — current instance state.
4. Task-relevant runtime and project files per BOOTSTRAP's read sequence.

## Editing this file

This file is **project-owned**. \`ai-runtime-kit upgrade\` never
touches it. Add repo-specific notes (stack, conventions, gotchas)
below — they will be preserved across kit upgrades.
`;
}

module.exports = { projectStateMd, projectTaskStatusMd, agentEntryClaudeMd };
