# Feature Spec: Post-v0.8 Doc Tidy

## Status

APPROVED

## Parent Feature

(none — engineering-only)

## Goal

Bundled cleanup of three carryover follow-ups recorded in the
v0.7.0 and v0.8.0 review files:

1. **Architect grep audit** (recorded in
   `.ai/project/reviews/2026-05-14-agent-roster-completion.md`
   § Non-blocking Issues) — INDEX.md has two stale references
   to the old 5-phase pipeline that name `Architect` as a
   role. v0.7.0 updated the `## Agents` section's diagram but
   missed the standalone `## Recommended Agent Flow` section
   at the bottom and a 5-phase mention in the `## Hooks`
   section's prose.
2. **`spec-writer.md` size-budget rule** (recorded in
   v0.7.0 review § Suggested Fixes) — promote the lesson
   "spec size budgets are easy to under-estimate; use ranges
   or prototype first" from review observation to a `## Must
   Not` bullet on the agent file itself, so future
   spec-writer invocations self-police.
3. **README walkthrough debt** (recorded in v0.5.0 / v0.6.0 /
   v0.7.0 / v0.8.0 reviews) — accumulating across four
   releases. Add a new Walkthrough 3 showing the v0.8.0
   end-to-end flow (PRD → Feature → Spec → Plan → Task with
   TDD-Applies → Implement → Verify → Review). Existing
   Walkthroughs 1 and 2 stay.

Engineering-only — no PRD or feature parent. Step 0 / 0.5
skipped per workflow rules for non-product-driven changes.

## Scope

<!-- RUNTIME-SCOPED. 2 runtime/** paths enumerated below
     trigger pre-executor/runtime-scoped-preflight. The
     README.md edit is project-root and outside the
     governance perimeter. -->

Includes:

- **runtime/** (governance-protected):
  - `runtime/INDEX.md` — 2 stale Architect references:
    - L151 area: `(Architect → Planner → Executor → Verifier
      → Reviewer)` in the `## Hooks` section's prose →
      rewrite to the current 8-phase chain.
    - L385–397: `## Recommended Agent Flow` block currently
      shows 5-phase; update to the same 8-phase chain
      already present in `## Agents`.
  - `runtime/agents/spec-writer.md` — add one `## Must Not`
    bullet: "Set hard byte-budget ceilings on new template /
    role files without prototyping first (use ranges or
    revisit during impl — see size-ceiling drift in v0.5.1
    and v0.7.0 reviews)."

- **Project-root** (not governance-protected):
  - `README.md` — add Walkthrough 3 showing the v0.8.0 PRD →
    Feature → Spec → Plan/Task → TDD → Implement → Verify →
    Review flow with concrete commands and file paths.
    Existing Walkthroughs 1 + 2 unchanged.

Excludes:

- **F4** (traceability link encoding) — separate spec, larger
  scope.
- Plan/Task workflow numbering — punt to F4 or own follow-up.
- Real TDD-applicable feature ship (the "test the metric"
  follow-up from v0.8.0 review) — that needs a real src/**
  feature; this spec is doc-only.
- Renaming any existing file.
- Rewriting Walkthroughs 1 + 2 — they're still accurate.
- Adding ADRs or migration notes for the changes (the
  follow-ups are doc-only; no consumer impact).

## Requirements

1. **`runtime/INDEX.md` Architect references updated:**
   - In the `## Hooks` section, replace the parenthetical
     `(Architect → Planner → Executor → Verifier → Reviewer)`
     with the current 8-phase chain `(PRD-Writer →
     Feature-Writer → Spec-Writer → Planner → TDD-Writer →
     Executor → Verifier → Reviewer)` and update surrounding
     prose if needed.
   - The standalone `## Recommended Agent Flow` section's
     ASCII block (`Architect ↓ Planner ↓ ...`) rewritten to
     the 8-phase chain in the same arrow style. Match the
     style currently used in `## Agents`'s diagram.

2. **`runtime/agents/spec-writer.md` `## Must Not` extension:**
   add a bullet:
   > Set hard byte-budget ceilings on new template / role
   > files without prototyping first. Use a range or revisit
   > during impl (size-ceiling drift hit v0.5.1's prd-writer
   > and v0.7.0's agent roster — pattern recognized; rule
   > recorded here).
   File stays ≤1700 bytes (current ceiling). Verify after
   edit.

3. **README.md Walkthrough 3 added:**
   - Section header: `## Walkthrough 3 — full feature lifecycle
     (v0.8.0+)`.
   - Body shows: invoke prd-writer, slice into features,
     draft spec, plan/tasks, mark TDD-Applies on each task,
     run Step 1.5 for applicable tasks, execute, verify,
     review.
   - Concrete file paths (`.ai/project/prds/...`,
     `.ai/project/features/...`, `.ai/project/specs/...`,
     `.ai/project/tasks/...`, `.ai/project/reviews/...`)
     using `<feature-slug>` placeholders.
   - Reference to `runtime/workflows/feature-development.md`
     as the canonical lifecycle source.
   - Length budget: ~50–80 lines of markdown body (Walkthroughs
     1 + 2 are ~25 lines each; Walkthrough 3 needs more for
     the longer lifecycle but should not balloon).

## Acceptance Criteria

- `runtime/INDEX.md` has no remaining `Architect` references
  in the *role-name* sense (architecture-the-practice
  mentions stay). `grep -n "Architect" runtime/INDEX.md`
  returns only architectural-decision-record /
  architecture-the-concept context.
- `runtime/agents/spec-writer.md` file size ≤1700 bytes after
  the bullet addition.
- `README.md` has `## Walkthrough 3 — full feature lifecycle`
  section between Walkthrough 2 and `## Local development`.
- All existing tests pass (18/18).
- `npm pack --dry-run` shows updated files; no size regression
  beyond a few kB (mainly README which doesn't ship anyway in
  `runtime/` — README itself ships per files allowlist).

## Test Checklist

- [ ] Unit: existing init test still passes (no template
      structure changes that would break presence assertions).
- [ ] Manual: re-grep `runtime/` for Architect after change —
      only architectural concept mentions remain.
- [ ] Manual: read README's three walkthroughs in sequence —
      Walkthrough 3 reads cleanly after Walkthrough 2 and
      before `## Local development`.
- [ ] Manual: `wc -c runtime/agents/spec-writer.md` confirms
      ≤1700.

## Verification Commands

```bash
npm test
grep -n "Architect" runtime/INDEX.md
wc -c runtime/agents/spec-writer.md
```

## Rollback Plan

1. Revert the commits on
   `chore/runtime-post-v0.8-doc-tidy` branch.
2. `npm test` passes on prior tree.
3. No data migration. All edits are doc-only and additive
   (or replacing stale prose with accurate prose).

## Open Questions

Minimal — this is doc cleanup. No PRD/feature-level questions.

**Resolved here:**

- Architect grep already executed pre-spec to determine exact
  scope: 2 sites (INDEX.md hooks-section L151 + standalone
  `## Recommended Agent Flow` L385).
- Walkthrough 3 placement decided: between Walkthrough 2 and
  `## Local development`. Alternative (replace Walkthrough 1
  with the new flow) rejected — existing Walkthroughs 1/2 are
  still accurate and serve different audiences (fresh-project
  init vs project-side rule authoring).

**Deferred to implementation:**

- Exact wording of the spec-writer Must Not bullet (style
  match to existing bullets).
- Exact Walkthrough 3 length within the 50–80 line budget.

## Process notes

- Branch: `chore/runtime-post-v0.8-doc-tidy`.
- Preflight hook fires at Planner → Executor with 2 runtime
  paths (INDEX.md, spec-writer.md). README.md is project-root
  and not subject to preflight.
- Commit structure:
  - **Commit A**: 2 runtime/** changes + spec status flip.
  - **Commit B**: README.md + version bump v0.8.0 → v0.8.1 +
    CHANGELOG.
  - **Commit C**: review (lighter than feature reviews;
    documents the 3 cleanups in one place).
- Version: **v0.8.1** (PATCH). Pure doc cleanup. No
  behavioral change. No template/schema change.
