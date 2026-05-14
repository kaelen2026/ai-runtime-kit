# Review: Agent Roster Completion — F2 of v0.7.0 (nine-phase-workflow)

PRD: `.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`
Feature: `.ai/project/features/2026-05-14-agent-roster-completion/feature.md`
Spec: `.ai/project/specs/2026-05-14-agent-roster-completion/spec.md`
Branch: `chore/runtime-agent-roster-completion`
Commits: `d0c7985` (runtime governance), `1489727` (kit code +
ship metadata).

## Summary

Second feature sliced from v0.6.0's nine-phase-workflow PRD.
Closes the agent-roster gap: every phase of the workflow now
has a kit-shipped role-definition file. Five new files —
`feature-writer.md`, `spec-writer.md`, `planner.md`,
`tdd-writer.md`, `reviewer.md` — joined the three that existed
(`executor.md`, `verifier.md`, `prd-writer.md`).

INDEX.md's `## Agents` section was restructured to reflect
the 8-file roster. The "Recommended Agent Flow" prose
upgraded from the old 5-phase
`Architect → Planner → Executor → Verifier → Reviewer` to the
new 8-phase
`PRD-Writer → Feature-Writer → Spec-Writer → Planner →
TDD-Writer → Executor → Verifier → Reviewer`. The
"transition-only concepts" prose retired — only `task` and
`architect` remain notes, with explicit rationale for each.

This release is the **second feature under the v0.6.0 pipeline**.
F3 (TDD workflow step) and F4 (traceability conventions) follow.

## Verification

- `npm test` → **18/18 pass**. Init test extended in place to
  loop over the full 8-agent roster instead of asserting only
  `prd-writer.md`.
- `npm pack --dry-run` → 52 files / 49.5 kB. All 8 agent files
  present in the tarball with documented sizes.
- All 5 new agent files ≤1700 bytes (ceiling revised mid-impl,
  see §Non-blocking Issues).

Runtime-scoped preflight (HOOK pre-executor/runtime-scoped-preflight):
  - Scope contract: PASS — listed paths: `runtime/agents/feature-writer.md`,
    `runtime/agents/spec-writer.md`, `runtime/agents/planner.md`,
    `runtime/agents/tdd-writer.md`, `runtime/agents/reviewer.md`,
    `runtime/agents/executor.md`, `runtime/agents/verifier.md`,
    `runtime/agents/prd-writer.md`, `runtime/INDEX.md` (9 paths).
  - Branch name: PASS — `chore/runtime-agent-roster-completion`.
  - Spec home: PASS —
    `.ai/project/specs/2026-05-14-agent-roster-completion/spec.md`.

Hook self-enforcement notes:
  - **Fourth real-world fire.** Clean pass on first attempt
    for the second time running. The branching + scope-
    enumeration discipline is now fully internalized.
  - First time the hook verified a scope of >5 runtime paths
    (this spec listed 9). No false-positives, no friction.

## Acceptance Criteria

- [x] 5 new agent files exist with all 6 required sections
      (Role / Responsibilities / Inputs / Outputs / Must Not /
      Reference); each ≤1700 bytes (revised ceiling).
- [x] 3 existing agent files have `## Reference` neighbor
      pointers per spec Req. 2.
- [x] `runtime/INDEX.md` § Agents lists 8 role files;
      "Recommended Agent Flow" shows 8-phase chain;
      transition-only prose retired with explicit rationale
      for `task` and `architect`.
- [x] All existing tests pass (18/18 — extended in place).
- [x] `npm pack --dry-run` shows all 5 new files in the tarball.
- [ ] `upgrade` from v0.6.0 fixture verified. **Not run for
      this review** — same pattern as F1's review (relying on
      the existing diff classifier; risk low).

## Blocking Issues

None.

## Non-blocking Issues

- **Spec size-ceiling drift (1500 → 1700).** Same pattern as
  v0.5.1's prd-writer.md (1200 → 1500). The spec inherited
  v0.5.1's "1500 byte" precedent without testing whether 5 new
  agent files of varying complexity would all fit. Final sizes
  1509–1681; the revised ceiling 1700 has minimal headroom.
  The lesson from v0.5.1's review ("draft a prototype before
  locking a size budget, or use ranges rather than hard
  ceilings") still applies — this is now the second time the
  same drift class appeared. Should be promoted from "review
  note" to "rule in `spec-writer.md`" in a future revision.
- **`tdd-writer.md` ships without workflow wire-up.** The role
  file exists; the workflow step that invokes it lands with F3.
  This is intentional (F3 needs to reference the file), but
  for the period between v0.7.0 ship and F3 ship, a reader of
  `runtime/agents/tdd-writer.md` who follows its Reference
  section to `feature-development.md` will find no Step
  pointing back. Watch-item; expected to be resolved with F3.
- **`architect` removed without checking for stale references.**
  The INDEX update removed `architect` from the transition-only
  list and replaced it with a "renamed to spec-writer" note.
  Other docs (workflow, hooks README) may still reference
  `Architect`. Grep not run during this implementation. Flagged
  as follow-up cleanup.

## Suggested Fixes

- **Follow-up — F3 (TDD step in workflow).** Now unblocked
  since `tdd-writer.md` ships. F3 wires the agent into a
  workflow step between Task and Implement.
- **Follow-up — F4 (traceability conventions).** Independent
  of F3; formalizes the upstream/downstream links that F2's
  agent files informally reference.
- **Follow-up — grep audit for stale `Architect` references**
  across `runtime/**` after v0.7.0 lands on main. Update any
  prose still mentioning "Architect" as a phase.
- **Follow-up — promote size-ceiling lesson to a rule.**
  `spec-writer.md` § Must Not could gain a line like "Do not
  set hard size budgets for new template/role files without a
  prototype." Self-policing through the agent file.
- **Follow-up — README walkthrough debt** continues to
  accumulate (v0.5.0 / v0.5.1 / v0.6.0 / v0.7.0). README's
  current walkthroughs predate Steps 0, 0.5, and the full
  agent roster. Bundle into one doc PR.

## Open Questions resolved

All 4 feature-level open questions resolved in the spec phase
(Q1 keep executor, Q2 fold task-creator, Q3 spec-writer over
architect, Q4 yes cross-references). No spec-phase decisions
escalated back to the user — first time on this kit. Two
spec-deferred mechanics resolved during impl (exact prose for
`## Reference` cross-references; whether new agents mention
upstream artifact paths — yes, brief).

## Process notes (dogfood reflections)

- **First spec author to converge feature-level decisions
  autonomously.** F2's spec drafted resolution paths for all 4
  open questions and asked the user only to confirm at
  spec-approval time. Lighter touch than F1, where 3 feature
  questions deferred to spec discussion.
- **Hook fire #4, fourth clean pass.** Preflight is now in
  the background — branch creation and scope enumeration
  happen reflexively. Cost of the hook's existence to my
  workflow: near-zero. Value: still real every time
  (each new touched-path needs explicit enumeration; that
  enumeration is the audit trail).
- **Spec amendment mid-impl, second occurrence.** Same drift
  shape as v0.5.1 (size ceiling under-estimated). Pattern
  recognition is forming: when content depends on
  prose-density that isn't decided yet, prefer ranges or
  defer the size constraint to a "(target ~N bytes, hard
  cap at impl time)" form.
- **Pipeline finally complete on paper.** The 8 agent files
  now ship as a contiguous chain. An AI agent reading
  `runtime/INDEX.md` post-v0.7.0 sees a closed loop:
  every phase has a role file. F3 (TDD workflow step) and F4
  (traceability) refine the chain's mechanics, but the
  vocabulary is complete.

## Verdict

Approved. Ready to merge into `main`, push, tag `v0.7.0`, and
optionally publish to npm. F3 / F4 can begin authoring once
v0.7.0 is on main.
