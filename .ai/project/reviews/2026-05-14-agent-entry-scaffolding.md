# Review: Agent entry-point scaffolding in `init` (v0.4.0)

Spec: `.ai/project/specs/2026-05-14-agent-entry-scaffolding/spec.md`
Commits: `4a429f8` (dogfood scaffold), `9768bad` (feat v0.4.0)


## Parent Spec

`.ai/project/specs/2026-05-14-agent-entry-scaffolding/spec.md`

## Summary

Closed the discovery gap surfaced during dogfood of this repo:
after `init` ran, `.ai/runtime/BOOTSTRAP.md` existed on disk but no
agent knew to read it because nothing at the repo root pointed
there. `init` now writes a project-root `CLAUDE.md` agent entry
file as part of the standard scaffold. The file is project-owned
(never touched by `upgrade`) and opt-out-able via
`--no-agent-entry`.

Shipped in one session: gap noticed → spec drafted → APPROVED →
implementation → two commits. Dogfood loop proved end-to-end usable
(the spec, generated CLAUDE.md, and this review all live under
`.ai/project/` exactly as the kit's workflows expect).

## Verification

- `npm test` → **15/15 pass** (was 10/10 before; +5 new cases).
- Manual sanity: `node bin/cli.js init --help` shows the new
  `--no-agent-entry` flag and the updated refuse-overwrite copy.
- Dogfood verification: deleted the hand-written CLAUDE.md, ran
  `init --migrate` in this repo, the regenerated file matched the
  `agentEntryClaudeMd()` template byte-for-byte (confirmed via
  Edit harness's intentional-change reminder).
- No runtime-scoped governance: spec §2 Scope confirmed no edits
  under `.ai/runtime/**`, so the `pre-executor/runtime-scoped-
  preflight` hook is not exercised.

## Acceptance Criteria

- [x] `init` in a clean `mkdtemp` fixture creates `CLAUDE.md` at
      the fixture root with the documented template body.
      *(test/init.test.js: "init: writes CLAUDE.md agent entry at
      project root")*
- [x] `init` twice in the same dir still fails the second time;
      error message mentions `CLAUDE.md` when that's the only
      conflict. *(test/init.test.js: "init: refuses when CLAUDE.md
      already exists at project root")*
- [x] `init --migrate` with a pre-existing `CLAUDE.md` succeeds
      and leaves it byte-for-byte unchanged.
      *(test/init.test.js: "init --migrate: tolerates pre-existing
      CLAUDE.md")*
- [x] `init --no-agent-entry` skips `CLAUDE.md` creation; rest of
      scaffold unaffected; exit 0. *(test/init.test.js:
      "init --no-agent-entry: skips CLAUDE.md creation")*
- [x] `upgrade` after the new init never modifies the project's
      `CLAUDE.md`. *(test/upgrade.test.js: "upgrade: never touches
      project-root CLAUDE.md")*
- [x] All existing tests still pass. *(10/10 prior + 5 new = 15/15)*

## Blocking Issues

None.

## Non-blocking Issues

- **No migration path for v0.3.x consumers.** Existing kit users
  (e.g. ai-workflow-demo on v0.2.0) won't gain `CLAUDE.md` from
  `upgrade` — only `init` writes it, by design (it's project-
  owned, not kit-managed). Documented as an Excludes item in the
  spec. Recovery: those consumers must hand-author or copy from
  `src/templates.js`'s `agentEntryClaudeMd()` output.
- **Single-agent assumption.** Only Claude Code's entry convention
  (`CLAUDE.md` in cwd) is supported. Other agents (Cursor,
  Aider, Continue, …) have different entry-file conventions and
  will still need manual setup. Spec §2 Excludes flagged this for
  a follow-up.
- **Dogfood asymmetry.** This repo's CLAUDE.md is now the pure
  template — no "this repo IS the kit source" note. That note
  would be useful for human contributors reading the repo root.
  Acceptable because contributors should read `README.md` for
  that context, not `CLAUDE.md`.

## Suggested Fixes

- **Follow-up spec — multi-agent entry files.** Generalize the
  agent-entry concept: `init` could write a small set
  (`CLAUDE.md`, `.cursorrules`, `CONVENTIONS.md`, …) all pointing
  at the same BOOTSTRAP. Gate each behind a flag; default to all
  on. Pre-existing files always skipped.
- **Follow-up — v0.3.x → v0.4.x migration helper.** Either a
  `ai-runtime-kit migrate-agent-entry` one-shot, or a documented
  one-liner in the README upgrade section.
- **Polish — README "Walkthrough 1".** The walkthrough still
  reads as if `STATE.md` is the only thing to fill in after
  `init`. Should mention that `CLAUDE.md` is also generated and
  is the place to add repo-specific stack/conventions notes.

## Open Questions resolved

The spec listed three Open Questions; resolutions:

1. **Template depth** — went minimal (heading + bootstrap pointer
   + loading order + "this is project-owned" note). No
   how-to-extend block; the reader can follow the BOOTSTRAP link.
2. **Flag name** — chose `--no-agent-entry` (forward-compatible
   with future multi-agent support) over `--no-claude-md`.
3. **Version bump** — MINOR (`v0.4.0`). Additive, `init`-only,
   doesn't break v0.3.x consumers (they keep working; they just
   don't gain the new file from `upgrade`).

## Verdict

Approved. Ready to publish v0.4.0.
