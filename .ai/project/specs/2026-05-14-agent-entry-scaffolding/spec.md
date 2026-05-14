# Feature Spec: Agent entry-point scaffolding in `init`

## Status

APPROVED

## Goal

Make `ai-runtime-kit init` produce a working agent entry point so that
AI agents (Claude Code first, others later) automatically discover and
load `.ai/runtime/BOOTSTRAP.md` without the consumer having to
hand-author a bridge file.

Surfaced by the v0.3.0 dogfood of this repo: after `init` ran, the
loaded `.ai/` tree was invisible to Claude Code because no
`CLAUDE.md` at the repo root pointed to `.ai/runtime/BOOTSTRAP.md`.
The fix had to be hand-written, which means every future consumer
will hit the same dead-end on first run.

## Scope

<!-- This change modifies kit source under `src/` and adds template
     content. It does NOT modify `runtime/` (the kit's canonical
     framework snapshot), so it is NOT runtime-scoped governance. -->

Includes:

- `src/init.js` and `src/templates.js`: add an agent-entry template
  body and write it during `init`.
- `bin/cli.js` flag plumbing if a `--no-agent-entry` opt-out is added.
- `test/init.test.js`: smoke test for the new file's presence and
  content shape.
- `README.md`: document the new file in the `init` walkthrough.

Excludes:

- Multi-agent entry files (`.cursorrules`, `CONVENTIONS.md`, etc.) —
  defer to a follow-up spec once Claude Code path is proven.
- A migration path for existing kit consumers stuck on v0.3.x without
  `CLAUDE.md` — defer; either documented manual step or a separate
  one-shot `migrate-agent-entry` command.
- Changes to `.ai/runtime/BOOTSTRAP.md` itself.

## Requirements

1. After `ai-runtime-kit init` runs in a fresh repo, the project must
   contain a `CLAUDE.md` at the **repo root** (not under `.ai/`) that
   points Claude Code to `.ai/runtime/BOOTSTRAP.md`.
2. The file must be classified as **project-owned**, not kit-managed.
   Once written, `upgrade` must never touch it. (Mechanism: it lives
   outside `.ai/runtime/`, so the existing upgrade `rm -rf .ai/runtime/`
   semantics already protect it. No new exclusion logic needed.)
3. If a `CLAUDE.md` already exists at the target path, `init` must
   refuse to overwrite it (same posture as the existing
   `.ai/runtime/` / `.ai/project/` guards). `--migrate` mode should
   tolerate a pre-existing `CLAUDE.md` and skip it (matching how
   `--migrate` tolerates a pre-existing `.ai/project/`).
4. The generated `CLAUDE.md` content must:
   - Identify the file as an agent entry point.
   - Instruct the agent to read `.ai/runtime/BOOTSTRAP.md` before
     engineering work.
   - Mention `.ai/project/STATE.md` as the instance-state source.
   - NOT contain repo-specific notes (e.g. "this repo IS the kit
     source") — those are dogfood-only and belong to manual edits.
5. An opt-out (`init --no-agent-entry`) should exist for users who
   manage their own entry files.

## Acceptance Criteria

- `node bin/cli.js init` in a clean `mkdtemp` fixture creates
  `CLAUDE.md` at the fixture root with the documented template body.
- `node bin/cli.js init` twice in the same dir still fails the second
  time (existing refuse-to-overwrite behavior intact); error message
  mentions `CLAUDE.md` if that's the only conflict.
- `node bin/cli.js init --migrate` in a fixture with a pre-existing
  `CLAUDE.md` succeeds and leaves the existing `CLAUDE.md`
  byte-for-byte unchanged.
- `node bin/cli.js init --no-agent-entry` skips `CLAUDE.md` creation;
  exit 0; rest of the scaffold unaffected.
- `node bin/cli.js upgrade` after the new init never modifies the
  project's `CLAUDE.md`.
- All existing tests still pass.

## Test Checklist

- [ ] Unit: new init writes `CLAUDE.md` with expected content.
- [ ] Unit: init refuses overwrite of existing `CLAUDE.md`.
- [ ] Unit: `--migrate` tolerates pre-existing `CLAUDE.md`.
- [ ] Unit: `--no-agent-entry` skips creation.
- [ ] Unit: `upgrade` does not touch `CLAUDE.md`.
- [ ] Manual: dogfood — `rm CLAUDE.md` in this repo, re-run init in a
      temp clone, confirm the new file matches the hand-written one in
      spirit (close enough that the hand-written one can be deleted in
      favor of the generated one).

## Verification Commands

```bash
npm test
node bin/cli.js init --cwd "$(mktemp -d)"
node bin/cli.js init --cwd "$(mktemp -d)" --no-agent-entry
```

## Rollback Plan

1. Revert the commit(s) implementing this spec.
2. `npm test` should pass on the prior tree.
3. No data migration needed — the only artifact is a single file
   each consumer can keep or delete by hand. Existing v0.3.x
   consumers are unaffected because they never had this file
   generated for them.

## Open Questions

- Should the template include a small "How to extend" comment block
  pointing at `.ai/project/STATE.md` and the spec/plan/task dirs, or
  stay minimal? (Lean: minimal — the consumer can read BOOTSTRAP.)
- Path of opt-out flag: `--no-agent-entry` vs `--no-claude-md`?
  First is forward-compatible if we add other agents' entry files
  later.
- Version bump: this is additive and `init`-only, so a MINOR bump
  (v0.4.0) seems right. Confirm against the "v0.x pre-stable, breaking
  changes allowed at any minor" policy in README.
