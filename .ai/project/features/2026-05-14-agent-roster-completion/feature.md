# Feature: Agent Roster Completion

## Status

APPROVED

## Parent PRD

`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`

## Goal

Ship the remaining kit-managed agent role-definition files so
that every phase in the v0.6.0+ workflow has a corresponding
`runtime/agents/<role>.md`. This is **F2** in the parent PRD's
candidate slice list.

Current shipped roster (post-v0.6.0): `executor.md`,
`verifier.md`, `prd-writer.md` (3 files). Workflow names many
more phases — Step 0.5 (slice into features), Step 1 (define
spec), Step 2+ (plan / tasks / TDD / verify / review). The PRD's
**Q2 decision (a) — ALL** says every named phase ships an agent
file (or earns an explicit "transition-concept-only" note with
rationale). F2 closes that gap.

## PRD Metrics Contributed

- **M1** (agent roster consistency) — **primary**. F2 is the
  feature that directly moves M1 from "3 of N phases have
  files" to "100% match." Whether N is 8 or 9 depends on
  F2-spec resolutions (see §Open Questions).
- **M2** (multi-feature PRD slicing) — **partial**. F2 is one
  of 4 features sliced from the parent PRD; together F1/F2/F3/F4
  prove framework A works on a real multi-feature PRD.
- **M3** (traceability chain) — **not contributed**. F4 owns the
  link encoding; F2 only ships role files.
- **M4** (TDD test-first) — **partial**. F2 ships the
  `tdd-writer.md` agent file, but the TDD workflow *step* is
  F3. M4 needs both ingredients to be measurable.

## Scope

### Includes

- **runtime/agents/** (governance-protected):
  - `runtime/agents/feature-writer.md` — NEW. Role for Step
    0.5 (slicing a PRD into feature docs).
  - `runtime/agents/spec-writer.md` — NEW. Role for Step 1
    (drafting a spec from an APPROVED feature). Naming
    alternative `architect.md` deferred to spec.
  - `runtime/agents/planner.md` — NEW. Role for plan +
    task-list authorship.
  - `runtime/agents/tdd-writer.md` — NEW. Role for the
    failing-test phase before implementation. (The TDD
    workflow step itself is F3, but the role file ships here
    so F3 can reference it.)
  - `runtime/agents/reviewer.md` — NEW. Role for post-impl
    review authoring.
- **runtime/INDEX.md** — `## Agents` section's role-files list
  expands from 3 entries to 8 (or 9 if a `task-creator.md` is
  added; F2-spec decides). The "transition-only concepts" note
  retires for the phases that now have files; rationale for any
  remaining transition-only phases is preserved.
- **Kit code**:
  - `test/init.test.js` — extend to assert each new agent file
    lands via init.

### Excludes

Carry from parent PRD §Out of Scope + own:

- **F1** content (feature artifact layer) — already shipped in
  v0.6.0.
- **F3** (workflow Step for TDD between task and implement) —
  separate feature. F2 only ships `tdd-writer.md`; the workflow
  step that invokes it is F3's responsibility.
- **F4** (traceability link encoding) — separate feature. F2's
  agent files may reference upstream/downstream artifacts by
  documented path conventions, but the formal link encoding
  (frontmatter? markdown links?) waits for F4.
- **Renaming `executor.md` → `implementer.md`** — open
  question, deferred to F2-spec. If renamed, that's a
  governance-touched change; if kept, no edit.
- **Updates to the existing 3 agent files** (executor,
  verifier, prd-writer) to cross-reference the new neighbors —
  optional polish, F2-spec decides.
- **Workflow text changes beyond the bare minimum** —
  significant rewrites of `feature-development.md` to weave
  the new agents in are F3+ territory. F2 ships role files and
  INDEX updates only.

## Acceptance

This feature is DONE when:

- 5 new agent files exist under `runtime/agents/` with the
  canonical role-file structure (Role / Responsibilities /
  Inputs / Outputs / Must Not / Reference where applicable),
  each ≤1500 bytes per the v0.5.1 spec ceiling precedent.
- `runtime/INDEX.md` § Agents lists every new file, and the
  "transition-only" prose is updated to reflect what's now
  shipped vs what genuinely remains a transition concept.
- `init` in a clean fixture creates all new agent files under
  `.ai/runtime/agents/`.
- Existing tests pass; `test/init.test.js` extended to cover
  the new files.
- The 5 new role files cross-reference each other where
  pipeline-relevant (e.g. `planner.md` mentions `tdd-writer.md`
  as the next role).
- One new role file (the spec author chooses which) is
  reviewed against the v0.5.1 `prd-writer.md` as a stylistic
  reference to ensure consistency with kit conventions.

## Open Questions

Feature-level open questions; spec-phase mechanics carry the
"(deferred to spec)" marker.

- **`executor.md` vs. `implementer.md` naming** — (deferred to
  spec). User's workflow nomenclature says "implement"; existing
  file is "executor." Options: rename (governance churn but
  cleaner), keep + alias, or update workflow to say "executor"
  instead of "implement."
- **`task-creator.md` file or fold into `planner.md`** —
  (deferred to spec). Affects whether the new file count is 5
  or 6, which affects M1 (8 vs 9 phases mapped).
- **`spec-writer.md` vs. `architect.md`** — (deferred to spec).
  The PRD's "Recommended Agent Flow" lists "Architect" as a
  phase. F2-spec picks the canonical name.
- **Should existing files be updated** to reference new
  neighbors? — (deferred to spec). E.g., `verifier.md` could
  point at `reviewer.md` as the next phase. Polish, not
  blocking.

## Downstream Spec

`.ai/project/specs/2026-05-14-agent-roster-completion/spec.md`
(pending)
