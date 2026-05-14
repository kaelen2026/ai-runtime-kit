# Feature Spec: TDD Workflow Step

## Status

APPROVED

## Parent Feature

`.ai/project/features/2026-05-14-tdd-workflow-step/feature.md`

## Goal

Implement F3 — TDD workflow step — per the approved feature doc
at `.ai/project/features/2026-05-14-tdd-workflow-step/feature.md`
(parent PRD:
`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`).

The feature doc locked the structural goal (insert TDD as an
explicit workflow step + add `TDD-applies` field to task
template + wire `tdd-writer.md`). This spec answers HOW: step
numbering, field placement, F3's own compliance with its own
rule, and version bump.

This is a **runtime-scoped governance change** per
`.ai/runtime/SAFETY.md` § Runtime Tree Protection. The
`pre-executor/runtime-scoped-preflight` hook fires at the
Planner → Executor transition.

## Scope

<!-- RUNTIME-SCOPED. 2 runtime paths in §Includes.
     Acknowledged. -->

Includes:

- **runtime/** (governance-protected):
  - `runtime/workflows/feature-development.md` — insert
    **Step 1.5: TDD Phase** between current Step 1 (Define
    Spec) and Step 2 (Execute with Claude Code). Numbering
    chosen for symmetry with Step 0.5 (Slice into Features).
    The step body:
    - Names trigger: any task with `TDD-applies: true`.
    - Specifies required artifact: a failing-test commit at a
      distinct commit hash, preceding the corresponding
      implementation commit's timestamp.
    - Documents skip rule: tasks with `TDD-applies: false`
      skip the step (skip recorded on the task itself per
      `## TDD-Applies` section — no implicit skipping).
    - References `runtime/agents/tdd-writer.md` as the role
      file for this step.
    - Defines "behavior-changing" boundary per parent PRD
      OOS4: behavior-changing = true; doc /
      refactor-no-behavior / config-only = false.
  - Step 2 body amended to note Step 1.5 is a per-task
    prerequisite when applicable (the step doesn't disappear
    into one big monolithic phase — TDD happens per-task,
    interleaved with implement).
  - `runtime/tasks/_template.md` — add a `## TDD-Applies`
    section in the trailing metadata cluster (after Status,
    before/after Owner). Allowed values: `true | false`.
    Includes a one-line guidance comment about the
    behavior-changing rule.

- **Kit code**:
  - `test/init.test.js` — extend to assert the updated
    template still lands via init (existing assertion already
    covers `.ai/runtime/tasks/_template.md`; no new assertion
    needed unless we add structural content checks).

Excludes:

- **F4** (traceability link encoding) — F3 produces test
  commits but does not formalize link conventions.
- **Plan + Task workflow steps as separately numbered items**
  (feature explicitly excluded; punt to F4 or follow-up).
- **CI / automated enforcement** of test-first ordering (PRD
  OOS2).
- **Universal TDD application** (PRD OOS4).
- **Changes to `tdd-writer.md`** — F2 shipped it; F3 only
  references it from the workflow side.
- **Self-applied TDD for this feature's own implementation**
  — per Q3 decision, F3's own impl is doc-only (template
  field addition); the F3 rule applied to F3 itself returns
  `TDD-applies: false`. Spec documents this for self-audit
  traceability.

## Requirements

1. **`runtime/workflows/feature-development.md` Step 1.5
   inserted** with heading `### 1.5. TDD Phase (per task,
   when applicable)`. Step body must:
   - State the trigger (task's `TDD-applies` is `true`).
   - State the required artifact (separate failing-test
     commit; verify red before declaring done).
   - State the skip rule (`TDD-applies: false` → skipped;
     skip is explicit on the task).
   - Reference `.ai/runtime/agents/tdd-writer.md`.
   - Cross-reference parent PRD OOS4 for the
     behavior-changing boundary definition.
   - Note that the step is **per-task**, not a single
     workflow-wide pause: it runs for each TDD-applicable
     task immediately before that task's implementation
     commit lands.

2. **`runtime/workflows/feature-development.md` Step 2
   updated** with a one-paragraph note acknowledging Step
   1.5 as a per-task prerequisite when applicable. Step 2's
   existing scope (plan / task / implement / verify under
   one umbrella) is not restructured.

3. **`runtime/tasks/_template.md` updated** with a new
   `## TDD-Applies` section, placed after `## Status` /
   `## Owner`. Body:
   - Value (default `false`, line stating allowed values
     `true | false`).
   - One-line guidance comment about the boundary
     (behavior-changing → `true`; doc /
     refactor-no-behavior / config-only → `false`).

4. **F3's own implementation TDD-applies = false.** Document
   in spec § Open Questions Resolved (Q3) the reasoning
   chain: template field addition is doc-only per PRD OOS4 →
   TDD-applies returns false. No self-test required, but the
   reasoning is recorded for audit (target user D from the
   PRD).

## Acceptance Criteria

- `runtime/workflows/feature-development.md` has explicit
  `### 1.5. TDD Phase` heading and body matching Req. 1.
- Step 2's body acknowledges Step 1.5 as a per-task
  prerequisite (Req. 2).
- `runtime/tasks/_template.md` has `## TDD-Applies` section
  with allowed values + guidance comment (Req. 3).
- All existing tests pass (18/18).
- `upgrade` from v0.7.0 fixture reports the 2 REPLACEs
  (workflow + task template) cleanly.
- F3's own impl follows the documented compliance trace
  (no self-test required, justified in spec § Open
  Questions; visible in the spec's audit chain).

## Test Checklist

- [ ] Unit: existing init test still passes (covers
      `runtime/tasks/_template.md` presence).
- [ ] Manual: workflow doc reads cleanly end-to-end —
      Steps 0 → 0.5 → 1 → 1.5 → 2 flow without confusion
      about where Plan and Task happen (acknowledged gap).
- [ ] Manual: task template's new `## TDD-Applies` section
      doesn't break existing references to the template.
- [ ] Manual: `npm pack --dry-run` shows updated files; size
      diff modest (≤300 bytes added).

## Verification Commands

```bash
npm test
node bin/cli.js init --cwd "$(mktemp -d)"
node bin/cli.js upgrade --yes --no-diff
npm pack --dry-run | grep -E 'tasks/_template|feature-development'
```

## Rollback Plan

1. Revert the commits on
   `chore/runtime-tdd-workflow-step` branch (or main if
   merged).
2. `npm test` passes on prior tree.
3. No data migration: 2 doc edits revert cleanly. Existing
   task instances under `.ai/project/tasks/` don't break —
   they simply lack the new `## TDD-Applies` section, which
   the workflow text gracefully defaults to interpreting
   as `false` (skip TDD step).
4. Consumer impact: v0.7.x consumers who upgraded see the 2
   doc revisions revert. No API or schema breakage.

## Open Questions

PRD-level + feature-level questions resolved during this
spec drafting:

**Resolved here:**

- **Q1 — Step numbering.** **Decision: Step 1.5.** Symmetric
  with Step 0.5 (Slice into Features). Alternative
  "renumber existing Step 2 to make room" rejected — F3
  feature explicitly excluded Plan/Task workflow renumbering,
  and Step 1.5 is the minimum-disruption insertion.
- **Q2 — `TDD-applies` field placement.** **Decision:
  `## TDD-Applies` section in `runtime/tasks/_template.md`'s
  trailing metadata cluster (alongside Status, Owner, Blocked
  By, Review Required).** Matches the kit's existing
  markdown-section convention for task metadata. Rejected:
  YAML frontmatter (departs from kit's existing style; only
  hooks and skills use YAML, and those are declarative-only).
- **Q3 — F3 self-bootstrap discipline.** **Decision: F3's
  own impl has `TDD-applies: false`.** Reasoning chain
  (recorded for audit):
    - F3's impl is `runtime/tasks/_template.md` field
      addition + `runtime/workflows/feature-development.md`
      Step text insertion.
    - Both are documentation changes — they modify how
      template consumers / workflow readers interpret the
      kit, but they don't change any runtime *behavior*
      (no code path executes the template content; no
      function reads the workflow doc programmatically).
    - PRD OOS4 explicitly excludes documentation updates
      from TDD-applies.
    - Therefore the F3 rule applied to F3 itself returns
      `false`. No self-test required.
    - This recursive application of the rule is recorded
      here, in the spec's audit chain, so future reviewers
      can trace the decision.
- **Q4 — Plan/Task workflow numbering gap.** **Decision:
  NOT done in F3.** Feature explicitly excluded this; spec
  holds the line. The workflow's existing Spec → (silent
  Plan / Task) → TDD → Execute jump remains a documented
  gap, recorded in §Suggested follow-ups below.

**Deferred to implementation (small mechanics):**

- Exact wording of the new `## TDD-Applies` section
  (template-level guidance comment vs. inline rule
  pointer to the workflow doc).
- Whether to include an example block in Step 1.5's body
  (e.g. "Example: task X has TDD-applies: true; test
  commit precedes implement commit by ≥1 commit hash").
  Add if it fits naturally; skip otherwise.

## Suggested follow-ups

- **F4 (traceability) becomes the next planned slice.** F3
  produces the test-commit artifacts; F4 formalizes how
  those commits link back to their parent task → plan →
  spec → feature → PRD.
- **Plan / Task as numbered workflow steps.** Either fold
  into F4 (workflow restructure naturally pairs with
  traceability) or open as a separate fast-follow PRD/feature
  if F4 stays narrowly about link encoding.
- **Architect grep audit** carries over from v0.7.0 review;
  still pending.
- **`spec-writer.md` size-budget rule** carries over from
  v0.7.0 review.
- **README walkthrough debt** continues to accumulate.

## Process notes

- Branch: `chore/runtime-tdd-workflow-step`.
- Preflight hook fires at Planner → Executor with 2 runtime
  paths to verify.
- Commit structure (mirrors v0.6.0 / v0.7.0):
  - **Commit A**: 2 runtime/** changes + spec status flip.
  - **Commit B**: kit code (test, no real changes expected
    since existing assertion already covers the template)
    + version bump v0.7.0 → v0.8.0 + README + CHANGELOG.
  - **Commit C**: review file.
- Version: **v0.8.0** (MINOR). Adds an explicit workflow step
  + task template field. Pre-stable v0.x; purely additive
  for the workflow (existing Step 2 unchanged in semantics,
  only adds a prerequisite note) and additive-with-default
  for the task template (existing tasks default to
  `TDD-applies: false` when reading the new section).
