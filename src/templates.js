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

module.exports = { projectStateMd, projectTaskStatusMd };
