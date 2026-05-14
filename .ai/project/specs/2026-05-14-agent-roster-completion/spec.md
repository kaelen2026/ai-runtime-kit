# Feature Spec: Agent Roster Completion

## Status

DRAFT

## Goal

Implement F2 — agent roster completion — per the approved
feature doc at
`.ai/project/features/2026-05-14-agent-roster-completion/feature.md`
(parent PRD:
`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`).

The feature doc locked the structural goal (ship 5 new role
files: feature-writer / spec-writer / planner / tdd-writer /
reviewer; complete the 8-phase pipeline alongside existing
prd-writer / executor / verifier). This spec answers HOW: each
file's content shape, INDEX restructure, existing-agent
cross-references, and version bump.

This is a **runtime-scoped governance change** per
`.ai/runtime/SAFETY.md` § Runtime Tree Protection. The
`pre-executor/runtime-scoped-preflight` hook fires at the
Planner → Executor transition.

## Scope

<!-- RUNTIME-SCOPED. 9 runtime paths in §Includes (5 new + 1
     INDEX + 3 existing edits). Acknowledged. -->

Includes:

- **runtime/agents/** (governance-protected, NEW files):
  - `runtime/agents/feature-writer.md` — Role for Step 0.5
    (slicing PRD into features).
  - `runtime/agents/spec-writer.md` — Role for Step 1 (drafting
    spec from APPROVED feature).
  - `runtime/agents/planner.md` — Role for plan + task
    authorship (folds the "task" phase per Q2 decision).
  - `runtime/agents/tdd-writer.md` — Role for the failing-test
    phase. (Workflow Step that invokes this is F3's scope.)
  - `runtime/agents/reviewer.md` — Role for post-impl review
    authoring.
  - Each file ≤1500 bytes (matches v0.5.1 `prd-writer.md`
    precedent; sections: Role / Responsibilities / Inputs /
    Outputs / Must Not / Reference).

- **runtime/agents/** (governance-protected, EXISTING edits):
  - `runtime/agents/executor.md` — adds a `## Reference`
    section pointing at upstream (`tdd-writer`) and downstream
    (`verifier`) roles. 1-2 lines.
  - `runtime/agents/verifier.md` — adds a `## Reference`
    section pointing at upstream (`executor`) and downstream
    (`reviewer`). 1-2 lines.
  - `runtime/agents/prd-writer.md` — adds downstream pointer
    to `feature-writer` in its existing `## Reference`. 1 line.

- **runtime/INDEX.md** (governance-protected):
  - `## Agents` role-files list expands from 3 to 8 entries.
  - "Transition-only concepts" prose retires for the 5 phases
    that now have files; remaining transition-only phases
    explicitly named (Architect collapses into Spec-Writer, so
    Architect is no longer a phase; "Task" gets a one-line
    transition-concept note saying "consumed by tdd-writer /
    executor").
  - "Recommended Agent Flow" updates from
    `Architect → Planner → Executor → Verifier → Reviewer` to
    the new 8-phase chain: `PRD-Writer → Feature-Writer →
    Spec-Writer → Planner → TDD-Writer → Executor → Verifier
    → Reviewer`.

- **Kit code** (not governance-protected — separate commit per
  branching.md):
  - `test/init.test.js` — extend fresh-init assertions to
    cover all 5 new agent files.

Excludes:

- **F3** (TDD workflow step between task and implement). F2
  ships only the `tdd-writer.md` role file; the workflow text
  that invokes it is F3's responsibility.
- **F4** (traceability link encoding). F2 agents may reference
  upstream/downstream by path, but no frontmatter or formal
  link convention is introduced.
- Renaming `executor.md` → `implementer.md` (Q1 = keep
  executor).
- Splitting `task-creator.md` off from `planner.md` (Q2 =
  fold).
- Renaming `spec-writer.md` to `architect.md` (Q3 = spec-
  writer).
- Major rewrites of `feature-development.md` to weave new
  agents into Step text — F2 only adjusts INDEX. The workflow
  rewrites land with F3.
- Retrofit of v0.5.x reviews to reference the new agent files.

## Requirements

1. **5 new agent files exist** under `runtime/agents/`, each
   following the kit's role-file pattern (`# <Name> Agent` /
   `## Role` / `## Responsibilities` / `## Inputs` / `## Outputs`
   / `## Must Not` / `## Reference`), each ≤1500 bytes total.

   Per-file role summaries:

   - **feature-writer.md** — Authors feature docs from an
     APPROVED PRD. Outputs `.ai/project/features/YYYY-MM-DD-<slug>/feature.md`
     per the canonical template. Must not write engineering
     content (that's spec); must not skip mandatory feature
     doc creation when a PRD exists.
   - **spec-writer.md** — Authors specs from an APPROVED
     feature. Outputs `.ai/project/specs/YYYY-MM-DD-<slug>/spec.md`.
     §1 Goal must cite the parent feature. Must not expand
     scope beyond feature's `## Includes`.
   - **planner.md** — Authors plan and concrete task docs from
     an APPROVED spec. Outputs `.ai/project/plans/...` +
     `.ai/project/tasks/...`. Must not generate tasks for
     work outside spec scope; must not skip the TDD-applies
     determination on each task.
   - **tdd-writer.md** — For a given task with TDD applicable,
     writes a failing test. Outputs a test file commit that
     fails when run. Must not write implementation code;
     must not write tests that already pass (verify red first).
   - **reviewer.md** — Authors review files post-implementation.
     Outputs `.ai/project/reviews/...`. Reads spec / feature /
     PRD / plan / tasks / verification output. Must not bypass
     blocking issues; must explicitly map back to PRD success
     metrics.

2. **3 existing agent files** gain minimal `## Reference`
   cross-references:
   - `executor.md` — prev: `tdd-writer.md`, next: `verifier.md`.
   - `verifier.md` — prev: `executor.md`, next: `reviewer.md`.
   - `prd-writer.md` — its existing `## Reference` adds a
     "downstream" pointer to `feature-writer.md`.

3. **`runtime/INDEX.md` § Agents updates**:
   - role-files list: 8 entries
     (executor / verifier / prd-writer / feature-writer /
     spec-writer / planner / tdd-writer / reviewer).
   - "transition-only concepts" prose: remove `architect`,
     `planner`, `reviewer` from the list (now have files).
     Replace with note about `task` being consumed by
     downstream roles.
   - "Recommended Agent Flow" line: rewrite to 8-phase chain
     `PRD-Writer → Feature-Writer → Spec-Writer → Planner →
     TDD-Writer → Executor → Verifier → Reviewer`.

4. **`test/init.test.js` extension**: assert each of the 5
   new agent files lands under `.ai/runtime/agents/` via a
   fresh init.

## Acceptance Criteria

- 5 new agent files exist with all 6 required sections; each
  ≤1500 bytes.
- 3 existing agent files have `## Reference` neighbor pointers
  (executor / verifier each have prev + next; prd-writer has
  downstream).
- `runtime/INDEX.md` § Agents lists 8 role files; "Recommended
  Agent Flow" reflects the 8-phase chain; `architect` /
  `planner` / `reviewer` removed from transition-only list;
  `task` explicit-as-transition note added.
- All existing tests pass; extended init test asserts the 5
  new files.
- `npm pack --dry-run` shows all 5 new files in the tarball.
- `upgrade` from v0.6.0 fixture reports 5 ADDs (new agent
  files) + 1 REPLACE (INDEX) + 3 REPLACEs (existing agents),
  no special-case logic needed.

## Test Checklist

- [ ] Unit (extend `test/init.test.js`): assert all 5 new
      agent files present under `.ai/runtime/agents/`.
- [ ] Manual: each new file structurally consistent with
      `prd-writer.md` (1.4 KB v0.5.1 reference).
- [ ] Manual: read INDEX § Agents — flow makes sense end-to-end.
- [ ] Manual: `npm pack --dry-run` includes 5 new files.

## Verification Commands

```bash
npm test
node bin/cli.js init --cwd "$(mktemp -d)"
node bin/cli.js upgrade --yes --no-diff
npm pack --dry-run | grep -E 'feature-writer|spec-writer|planner|tdd-writer|reviewer'
```

## Rollback Plan

1. Revert the commits on `chore/runtime-agent-roster-completion`
   branch (or main if merged).
2. `npm test` passes on prior tree.
3. No data migration: 5 new files are purely additive; the 3
   edits to existing agents are appends (revert removes the
   appended `## Reference` sections); INDEX edits roll back
   cleanly.
4. Consumer impact: v0.6.x consumers who already upgraded see
   the 5 new files disappear and INDEX revert. No breakage
   since no APIs change.

## Open Questions

PRD-level questions resolved. Feature-level questions resolved
during this spec drafting:

**Resolved here:**

- **Q1 — `executor.md` vs. `implementer.md` rename.**
  **Decision: KEEP `executor.md`.** Workflow already uses
  the verb "execute"; the user's word "implement" in the PRD
  elicitation was a synonym, not a directive to rename.
  Rename would break references in v0.4.x/v0.5.x/v0.6.x
  specs and reviews for marginal benefit.
- **Q2 — `task-creator.md` separate file or fold into
  `planner.md`.**
  **Decision: FOLD into planner.md.** The "task" phase is
  artifact-processing, not authoring. Planner writes plan +
  tasks; downstream roles (tdd-writer, executor) consume
  tasks. INDEX explicitly notes task as a transition-only
  concept.
- **Q3 — `spec-writer.md` vs. `architect.md`.**
  **Decision: `spec-writer.md`.** Matches the kit's
  `<artifact>-writer` naming family (prd-writer,
  feature-writer, reviewer-as-author). INDEX's "Recommended
  Agent Flow" updates to replace "Architect" with
  "Spec-Writer".
- **Q4 — Cross-reference existing 3 agents to new
  neighbors.**
  **Decision: YES, minimal.** Each existing file gains a
  `## Reference` section with prev/next pointers (1-2 lines
  each). Pipeline navigation value > scope-growth cost.

**Deferred to implementation (small mechanics):**

- Exact `## Reference` text for cross-references — match
  prose style across the 3 edited files for symmetry.
- Whether `## Reference` in new agent files should mention
  the parent artifact location (e.g., feature-writer mentions
  PRD path convention; spec-writer mentions feature path) —
  yes, brief.

## Process notes

- Branch:
  `chore/runtime-agent-roster-completion`.
- Preflight hook fires at Planner → Executor transition with
  9 runtime paths to verify (5 new + 1 INDEX + 3 edits).
- Commit structure (mirrors v0.6.0):
  - **Commit A**: 9 runtime/** changes + spec status flip.
  - **Commit B**: kit code (test extension) + version bump
    v0.6.0 → v0.7.0 + README + CHANGELOG.
  - **Commit C**: review file.
- Version: **v0.7.0** (MINOR). Five new agent files + INDEX
  restructure is a meaningful expansion; pre-stable v0.x
  allows it as MINOR.
