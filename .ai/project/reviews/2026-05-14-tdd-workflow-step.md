# Review: TDD Workflow Step — F3 of v0.8.0 (nine-phase-workflow)

PRD: `.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`
Feature: `.ai/project/features/2026-05-14-tdd-workflow-step/feature.md`
Spec: `.ai/project/specs/2026-05-14-tdd-workflow-step/spec.md`
Branch: `chore/runtime-tdd-workflow-step`
Commits: `d7a797c` (runtime governance), `96828b4` (ship
metadata).

## Summary

Third feature sliced from v0.6.0's nine-phase-workflow PRD.
Closes P2 (TDD discipline silent) by inserting **Step 1.5: TDD
Phase** into `feature-development.md` and adding a
`## TDD-Applies` field to `runtime/tasks/_template.md`. The
field defaults to `false`; tasks that introduce or modify
runtime behavior set it to `true`, triggering Step 1.5 (failing-
test commit before implementation commit) for that task.

`tdd-writer.md` shipped in v0.7.0 finally has a workflow step
that invokes it. F4 (traceability) is the last remaining slice
from the parent PRD.

## Verification

- `npm test` → **18/18 pass**. No test changes (spec confirmed
  existing init-test template-presence assertion already
  covers both touched runtime files).
- `npm pack --dry-run` → 52 files / 51.1 kB. Updated files
  shown with new sizes:
  `runtime/tasks/_template.md` 858 B (was ~400 B);
  `runtime/workflows/feature-development.md` 9.6 kB (was
  ~9.0 kB).

Runtime-scoped preflight (HOOK pre-executor/runtime-scoped-preflight):
  - Scope contract: PASS — listed paths:
    `runtime/workflows/feature-development.md`,
    `runtime/tasks/_template.md`.
  - Branch name: PASS — `chore/runtime-tdd-workflow-step`.
  - Spec home: PASS —
    `.ai/project/specs/2026-05-14-tdd-workflow-step/spec.md`.

Hook self-enforcement notes:
  - **Fifth real-world fire, fifth clean pass.** The protocol is
    fully internalized. Branch + scope + spec-home triplet now
    feels obvious rather than checklist-worthy.

## Acceptance Criteria

- [x] `runtime/workflows/feature-development.md` has explicit
      `### 1.5. TDD Phase (per task, when applicable)` heading
      with Trigger / Required artifact / Skip rule /
      Per-task semantics blocks (Req. 1).
- [x] Step 2 body acknowledges Step 1.5 as a per-task
      prerequisite (Req. 2).
- [x] `runtime/tasks/_template.md` has `## TDD-Applies` section
      after `## Owner` with `false` default and inline guidance
      comment (Req. 3).
- [x] All existing tests pass (18/18).
- [x] F3's own implementation TDD-Applies = false reasoning
      chain documented in spec § Open Questions Q3 (Req. 4).
- [ ] `upgrade` from v0.7.0 fixture verified. **Not run** —
      same pattern as F1/F2 reviews; risk low (2 REPLACE-only
      changes; diff classifier already proven on this shape).

## Blocking Issues

None.

## Non-blocking Issues

- **Plan/Task workflow numbering gap remains.** F3 explicitly
  excluded restructuring the Spec → (silent Plan/Task) →
  TDD → Execute jump. Step 1.5 sits in this awkward place by
  design. A reader of the workflow doc post-v0.8.0 sees
  Steps 0 → 0.5 → 1 → 1.5 → 2 with Plan and Task implicit
  inside Step 2's umbrella. Flagged for F4 or a follow-up.
- **M4 measurability deferred to real use.** The metric
  becomes *possible* post-F3 but only *real* once a feature
  with TDD-applicable tasks actually ships. F4 followed by a
  fourth real impl feature (any v0.9.x candidate) is the
  earliest M4 data point.
- **F3 self-impl was TDD-Applies = false by recursion, not
  by direct test.** This is correct per the rule, but a future
  reader auditing M4 should know F3's own impl doesn't count
  toward the test-first metric (the metric measures
  TDD-applicable tasks; F3 was inapplicable). Document
  prominently in F4's traceability work so the audit chain
  surfaces this trace, not just the verdict.

## Suggested Fixes

- **Follow-up — F4 (traceability link encoding)** is the next
  natural slice. Formalizes upstream/downstream links across
  PRD / feature / spec / task / commit. Pairs naturally with
  the Plan/Task numbering question above.
- **Follow-up — exercise Step 1.5 on a real
  TDD-applicable feature** within the M4 60-day window. F4 is
  doc-only, so it would itself be `TDD-Applies: false`. A
  realistic candidate is the next feature touching `src/**`
  (e.g. an `upgrade --check` flag or similar pure-behavior
  add). Without such an exercise the metric stays theoretical.
- **Carryover follow-ups from v0.7.0:** Architect grep audit,
  `spec-writer.md` size-budget rule promotion, README
  walkthrough rewrite. All still pending.

## Open Questions resolved

All 4 feature-level open questions resolved in F3's spec
phase autonomously (Q1 Step 1.5 numbering; Q2 `## TDD-Applies`
trailing metadata cluster; Q3 F3 self-impl TDD-Applies =
false by recursion; Q4 Plan/Task workflow numbering left as
follow-up). Two impl-mechanics decisions resolved during
implementation (template guidance comment voice; Step 1.5
example block omitted — fit naturally without it).

## Process notes (dogfood reflections)

- **First recursive rule application.** F3's rule applied to
  F3's own impl returned `false` and was documented as such.
  This pattern — applying a feature's rule to its own impl
  and recording the trace — is reusable. F4 will face a
  similar question (does F4's impl carry traceability links
  itself?). Worth elevating to a kit convention.
- **Hook fire #5, fifth clean pass.** Preflight discipline
  is now reflexive across:
    - branch naming (chore/runtime-* before any edit),
    - scope enumeration (spec §2 lists every path before
      edits begin),
    - spec home (always at .ai/project/specs/YYYY-MM-DD-<slug>/).
  Five fires gives high confidence the discipline is
  internalized rather than memorized.
- **No new tests this release.** Decided in spec; no
  surprise during impl. The existing init-test's
  template-presence assertion covers both touched files.
  Polish-level structural assertions (e.g. "workflow doc
  contains string 'Step 1.5'") are deferred — they'd be
  test-for-test's-sake. M3 (traceability) and a future
  enforcement tool will give the real coverage.
- **F3 was the shortest impl pass on this kit.** 2 runtime
  paths, ~50 line diff, no test changes, no kit-code
  changes. Roughly ~15 minutes from spec APPROVED to
  Commit C, fastest yet. The smaller a feature's scope, the
  cleaner the dogfood signal.

## Verdict

Approved. Ready to merge into `main`, push, tag `v0.8.0`, and
optionally publish to npm. F4 is the natural next, completing
the nine-phase-workflow PRD's downstream features.
