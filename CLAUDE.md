# CLAUDE.md

This repository uses an `.ai/` runtime managed by
[ai-runtime-kit](https://github.com/kaelen2026/ai-runtime-kit).

## Agent entry point

Before doing engineering work in this repo, read the runtime bootstrap:

```
.ai/runtime/BOOTSTRAP.md
```

That file defines the read sequence (INDEX → CAPABILITIES → RUNTIME_MODE
→ SAFETY → PRIORITIES → workflows). Project-instance state — current
mode, health, priorities — lives at `.ai/project/STATE.md`.

## Loading order

1. This file (`CLAUDE.md`), auto-loaded by Claude Code from cwd.
2. `.ai/runtime/BOOTSTRAP.md` — explicitly read on task start.
3. `.ai/project/STATE.md` — current instance state.
4. Task-relevant runtime and project files per BOOTSTRAP's read sequence.

## Editing this file

This file is **project-owned**. `ai-runtime-kit upgrade` never
touches it. Add repo-specific notes (stack, conventions, gotchas)
below — they will be preserved across kit upgrades.
