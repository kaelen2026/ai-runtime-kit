# Feature: TDD Workflow Step

## Status

DRAFT

## Parent PRD

`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`

## Goal

Make TDD an **explicit step** in
`runtime/workflows/feature-development.md` between the task
phase and the implementation phase. F3 wires up
`runtime/agents/tdd-writer.md` (already shipped in F2 / v0.7.0)
into the workflow so the role finally has somewhere to be
invoked from.

The step formalizes the rule "for any task where
`TDD-applies = true`, a failing-test commit lands before any
implementation commit." This is the **process** half of P2 from
the parent PRD; the **measurement** half (M4 = ≥90% test-first
commit ordering) becomes meaningful once the step is named and
operators / agents follow it.

This is **F3** in the parent PRD's candidate slice list.

## PRD Metrics Contributed

- **M1** (agent roster consistency) — **not contributed**. F2
  already shipped `tdd-writer.md`; M1 is already counted.
  F3 only adds the workflow Step that *invokes* the role.
- **M2** (multi-feature PRD slicing) — **partial**. F3 is one
  of 4 features sliced from the parent PRD; together with F1 /
  F2 / F4 it demonstrates framework A.
- **M3** (traceability chain) — **partial**. The TDD step
  produces test commits that downstream link conventions (F4)
  will reference. F3 makes those commits exist; F4 encodes the
  link.
- **M4** (TDD test-first ordering ≥90%, 60 days) — **primary**.
  Before F3, M4 is unmeasurable: there is no documented step
  to comply with, so commit ordering is incidental rather
  than discipline. F3 is the gate.

## Scope

### Includes

- **runtime/** (governance-protected):
  - `runtime/workflows/feature-development.md` — insert an
    explicit TDD step between the task and execute phases.
    Numbering is a spec-phase decision (Step 2.5 vs renumber
    existing). The step body specifies:
    - Trigger condition (TDD-applies = true on the task).
    - Required artifact: failing-test commit at a separate
      commit hash, distinct from the implementation commit.
    - Verification expectation: `git log` shows test-commit
      timestamp preceding implement-commit timestamp.
    - Skip rule (TDD-applies = false): step skipped; recorded
      explicitly on the task itself (no implicit skipping).
  - `runtime/tasks/_template.md` — add a **`TDD-applies`**
    field to the task template, with allowed values
    (`true | false`) and rule guidance for choosing
    (behavior-changing = true; doc / refactor-no-behavior /
    config-only = false per parent PRD OOS4).

### Excludes

Carry from parent PRD §Out of Scope + own:

- **CI / automated enforcement** of test-first ordering
  (PRD OOS2 — tooling that mechanizes the rule is future).
- **Universal TDD** (PRD OOS4 — TDD only applies to
  behavior-changing tasks; doc / refactor-no-behavior /
  config-only skip).
- **F4** (traceability link encoding) — F3 produces the
  artifacts (test commits) but does not formalize the link
  format.
- **Adding workflow steps for the Plan and Task phases as
  separately numbered items.** The current workflow jumps
  Step 1 (Spec) → Step 2 (Execute); Plan and Task are
  implicit between them. F3 inserts the TDD step but does
  not restructure the broader workflow numbering — that
  remains an outstanding gap. May be folded into F4 or
  handled as a follow-up.
- **Changing `tdd-writer.md`** — F2 shipped it; F3 only wires
  it in from the workflow side.

## Acceptance

This feature is DONE when:

- `runtime/workflows/feature-development.md` has an explicit
  TDD step that names the trigger, the required artifact
  (separate failing-test commit), and the skip rule.
- The TDD step's text references `runtime/agents/tdd-writer.md`
  by path so the role is reachable from the workflow.
- `runtime/tasks/_template.md` has a `TDD-applies` field with
  documented allowed values and selection rule.
- The skip criteria for the TDD step match parent PRD OOS4
  (behavior-changing → true; doc / refactor-no-behavior /
  config-only → false).
- `git log` parsing the kit's own next post-F3 task confirms
  the test-first commit ordering pattern is followable
  (sanity dogfood on this feature's own implementation:
  the spec test for `runtime/tasks/_template.md` field
  should land before the template edit).
- All existing tests still pass.

## Open Questions

Feature-level open questions; spec-phase mechanics carry the
"(deferred to spec)" marker.

- **Step numbering**: insert as `### 2.5. TDD Phase` (keeps
  Step 2 stable) or renumber existing Steps so TDD becomes
  Step 3 with Execute → Step 4 / Verify → Step 5 / Review →
  Step 6? (deferred to spec). Lean: 2.5 — minimal disruption.
- **`TDD-applies` placement**: as a top-of-file field in
  `runtime/tasks/_template.md`, or as YAML frontmatter? Or as
  a Status-block-adjacent line? (deferred to spec).
- **Sanity dogfood ordering**: F3's own implementation
  touches `runtime/tasks/_template.md` (template content) —
  this is itself behavior-changing for the template's
  consumers. Does F3 require a failing test for "template
  has TDD-applies field" before adding it? (deferred to spec).
  Probably yes, since this is the first feature whose own
  delivery would be subject to its own rule.
- **Plan and Task workflow steps**: F3 explicitly excludes
  renumbering. But if reviewers find the workflow's
  Spec → (silent Plan/Task) → TDD → Execute jump too
  confusing, this might block. (deferred to spec; if
  blocking, becomes a fast-follow patch.)

## Downstream Spec

`.ai/project/specs/2026-05-14-tdd-workflow-step/spec.md`
(pending)
