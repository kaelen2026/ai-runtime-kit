# Task Status System

## Purpose

Define task lifecycle states for local AI engineering workflow.

## Status Values

### TODO

Task is defined but not started.

### IN_PROGRESS

Task is currently being implemented.

### BLOCKED

Task cannot proceed because it needs clarification, dependency completion, or external input.

### IN_REVIEW

Implementation is complete and waiting for review.

### DONE

Task is implemented, verified, reviewed if needed, and committed.

## Status Rules

- New tasks start as TODO.
- Executor changes TODO to IN_PROGRESS before implementation.
- Executor changes IN_PROGRESS to IN_REVIEW after implementation and verification.
- Reviewer changes IN_REVIEW to DONE after approval.
- If verification fails, task remains IN_PROGRESS.
- If scope is unclear, task becomes BLOCKED.

## Required Task Fields

Each task should include:

- Goal
- Related Spec
- Related Plan
- Dependencies
- Files Likely Affected
- Constraints
- Acceptance Criteria
- Verification
- Status

## Dependency Rules

- A task cannot start until all dependencies are DONE.
- BLOCKED tasks must explain the blocking dependency.
- Parallelizable tasks may run independently if they do not modify overlapping files.

<!-- Active task-set tables live in .ai/project/tasks/TASK_STATUS.md. -->
