# Feature Spec: Workflow Overview in INDEX.md

## Status

APPROVED
<!-- Self-approved per user "写进 INDEX.md 作为 Workflow
     Overview" direction. Engineering-only doc addition; no
     PRD/feature parent. -->

## Parent Feature

(none — engineering-only)

## Goal

Promote the session's synthesis of "how the v0.10.1 workflow
fits together" from chat output into a permanent
`## Workflow Overview` section in `runtime/INDEX.md`. The
section gives any agent reading the kit a single-place
big-picture orientation — currently INDEX.md lists individual
sections (Agents, Traceability, Workflows, etc.) but doesn't
synthesize them into a pipeline view.

## Scope

<!-- RUNTIME-SCOPED. Single runtime/** path. Preflight applies.
     -->

Includes:

- `runtime/INDEX.md` — insert a new `## Workflow Overview`
  section immediately after `## Purpose` and before
  `## Agents`. Content:
  - 9-step pipeline diagram (Step 0 PRD → 0.5 Feature → 1
    Spec → 1.5 TDD → 2 Execute → 3 Verify → 4 Review → 5 Fix
    → 6 Commit).
  - Per-phase agent + artifact path table.
  - Traceability chain summary
    (`commit → task → plan → spec → feature → PRD`) with
    `## Parent <Type>` per artifact (cross-ref existing
    `## Traceability` section for detail).
  - Governance boundary summary (runtime/ vs src/ vs
    .ai/project/) with branch-naming + preflight implications.
  - Cross-references to `## Agents`, `## Traceability`,
    `## Workflows`, `## Recommended Agent Flow`, and
    `runtime/workflows/feature-development.md`.

Excludes:

- Restructuring existing sections of INDEX.md.
- Adding new artifact types or agent roles.
- Modifying `## Recommended Agent Flow` (already current
  post-v0.7.0).
- Cross-references in OTHER files
  (e.g. BOOTSTRAP.md, README.md) — those are doc-tidy
  follow-ups, not in this spec's scope.
- The metrics-summary / current-gaps / operator-command-chain
  sections from the chat synthesis — those belong in review
  files or README walkthroughs, not in the agent-facing
  INDEX.md.

## Requirements

1. **`## Workflow Overview` section** placed between
   `## Purpose` (ends at line ~14) and `## Agents` (starts
   at line ~16). Heading style matches sibling sections.

2. **Pipeline diagram** as a fenced text block showing 9
   steps with arrows.

3. **Agent / artifact path table** — 8 rows for the
   in-pipeline phases; identifies which agent produces which
   artifact at which path.

4. **Traceability chain summary** — 1-2 lines pointing readers
   at the existing `## Traceability` section below.

5. **Governance boundary table** — 4 rows distinguishing
   runtime / src / .ai/project / docs by branch convention
   and preflight trigger.

6. **Cross-references** at the end pointing to the deeper
   sections (Agents, Traceability, Recommended Agent Flow,
   Workflows).

7. **Section size** ≤ ~120 lines of markdown body (a single
   readable screen on most devices; INDEX.md is large
   already and this section needs to feel like an overview,
   not a deep dive).

## Acceptance Criteria

- `runtime/INDEX.md` has a `## Workflow Overview` section in
  the documented position with all 5 content elements
  (pipeline diagram + agent table + traceability summary +
  governance table + cross-references).
- Section ≤ 120 lines of markdown.
- `node bin/cli.js validate` against this repo's tree still
  returns PASS (the doc edit shouldn't break any structural
  rule).
- All existing tests pass (24/24).
- `npm pack --dry-run` shows updated INDEX.md.

## Test Checklist

- [ ] `npm test` clean.
- [ ] `node bin/cli.js validate` → PASS.
- [ ] Manual: INDEX.md reads cleanly Purpose → Workflow
      Overview → Agents → ...

## Verification Commands

```bash
npm test
node bin/cli.js validate
wc -l runtime/INDEX.md  # verify modest growth
```

## Rollback Plan

1. Revert commits on `chore/runtime-workflow-overview`.
2. Tests still 24/24; validate still PASS.
3. No consumer impact — pure additive doc content.

## Process notes

- Branch: `chore/runtime-workflow-overview`.
- Preflight hook fires at Planner → Executor with **1
  runtime path** (smallest scope this session;
  preflight has fired on counts ranging 1-9 across the
  session).
- Commit structure:
  - **Commit A**: 1 runtime/** change + spec (this file).
  - **Commit B**: version bump v0.10.1 → v0.10.2 + CHANGELOG
    (no README change; the workflow synthesis isn't a
    user-facing feature, just internal doc).
  - **Commit C**: review.
- Version: **v0.10.2** (PATCH; doc-only).
