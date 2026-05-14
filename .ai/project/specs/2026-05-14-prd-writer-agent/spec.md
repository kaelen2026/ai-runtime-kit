# Feature Spec: prd-writer agent

## Status

APPROVED

## Parent Feature

(none — pre-feature-layer)

## Goal

Implement the `prd-writer` agent per the approved PRD at
`.ai/project/prds/2026-05-14-prd-writer-agent/prd.md`. The PRD
locked the structural decision (**R2 — coexist**: kit-shipped
agent file = WHO; project-side skill = HOW). This spec answers
HOW: file contents, INDEX placement, workflow integration, and
agent file depth.

This is a runtime-scoped governance change per
`.ai/runtime/SAFETY.md` § Runtime Tree Protection. The
`pre-executor/runtime-scoped-preflight` hook will fire at the
Planner → Executor transition.

## Scope

<!-- RUNTIME-SCOPED. Includes paths under runtime/**.
     Acknowledged. -->

Includes:

- **runtime/** (governance-protected):
  - `runtime/agents/prd-writer.md` — NEW file. Verifier-style
    depth (richer than `executor.md`'s ~150 chars, less than the
    skill's full 11-step procedure). Sections: Role,
    Responsibilities, Inputs, Outputs, Must Not, Reference (cites
    the project-side skill at
    `.ai/project/skills/product/write-a-prd/SKILL.md`).
  - `runtime/INDEX.md` — append `prd-writer` to the `## Agents`
    section's role-files list. Flat list (no subsection). Update
    surrounding prose if it implies only executor + verifier
    have files.
  - `runtime/workflows/feature-development.md` — Step 0 gains a
    one-line "Read `runtime/agents/prd-writer.md` to anchor the
    role." pointer alongside the existing template reference.

- **Kit code & project-side**: none in this spec.

Excludes (carried from PRD § Out of Scope; restated for executor
preflight enumeration):

- Other writer-family agents (`spec-writer`, `review-writer`,
  `changelog-writer`). Parallel agents come when needed.
- Cross-agent tool integration (slash commands, IDE modes).
- PRD lifecycle enforcement (mandatory PRDs, gating, auto-
  promotion).
- PRD template content changes.
- Updating `runtime/INDEX.md`'s "transition-only concepts" note
  (architect / planner / reviewer). `prd-writer` is a
  pre-pipeline role (Step 0), not part of the
  Architect → Planner → Executor → Verifier → Reviewer flow —
  so the note remains accurate. If "Recommended Agent Flow"
  needs to mention Step 0 explicitly, that is a follow-up spec.

## Requirements

1. **`runtime/agents/prd-writer.md` exists** with the following
   sections (in order):
   - `# PRD-Writer Agent` heading
   - `## Role` — one short paragraph: "You author PRDs from user
     descriptions. Upstream of the spec/plan/task/review
     pipeline. You do NOT design, implement, or verify."
   - `## Responsibilities` — bullet list: read the PRD template,
     read project STATE.md, elicit problem/users/metrics/
     stories from the user, draft the file, leave Status as
     DRAFT.
   - `## Inputs` — bullets naming `runtime/prds/_template.md`
     (template), `.ai/project/STATE.md` (project context),
     conversational user description.
   - `## Outputs` — single file at
     `.ai/project/prds/YYYY-MM-DD-<slug>/prd.md` with all 7
     template sections populated, Status = DRAFT.
   - `## Must Not` — bullet list: write engineering content
     (defer to spec), invent unprovided facts (use Open
     Questions instead), skip user sign-off on APPROVED state,
     deviate from the documented output path.
   - `## Reference` — single sentence pointing at
     `.ai/project/skills/product/write-a-prd/SKILL.md` for the
     full 11-step elicit-then-write procedure.

2. **`runtime/INDEX.md` § Agents updated**:
   - The "Role files in this location:" list adds a `prd-writer`
     bullet.
   - The trailing prose currently says "The runtime framework
     defines five role concepts in its agent-pipeline
     transitions (Architect → Planner → Executor → Verifier →
     Reviewer; ...) The `architect`, `planner`, and `reviewer`
     phases exist as transition concepts referenced by workflow
     and hook docs but have no dedicated role-definition file in
     `.ai/runtime/agents/` today."
   - Add a sentence clarifying `prd-writer` is a **pre-pipeline
     role** (active at workflow Step 0), not part of the five
     transition phases.

3. **`runtime/workflows/feature-development.md` Step 0 updated**:
   - Add one line after the existing "Use
     `.ai/runtime/prds/_template.md` as the starting point."
     paragraph:
     > Read `.ai/runtime/agents/prd-writer.md` to anchor the
     > role — it scopes the agent's responsibilities, inputs,
     > outputs, and constraints. The procedural depth (11-step
     > elicit-then-write) lives in a project-side skill — the
     > agent file points there.
   - Do NOT change downstream Steps 1+ in this spec.

4. **Kit code**: no changes. The new file ships via the existing
   `runtime/` snapshot copy in `snapshot.js`; no allowlist edits
   needed (the entire `runtime/` tree is already included by
   `package.json` `files` field).

## Acceptance Criteria

- `runtime/agents/prd-writer.md` exists with all 6 required
  sections in order; total file size ≤1500 bytes. (Original
  spec ceiling was 1200 matching verifier.md's total size; during
  implementation the Reference section pointing at the project-
  side skill (Req. 1f) and the multi-bullet Inputs/Outputs/Must
  Not sections proved harder to compress than anticipated.
  Adjusted to 1500 with note for traceability — content reduction
  alternatives would have dropped the skill path pointer or
  collapsed Must Not bullets in ways that hurt the role's
  clarity.)
- `runtime/INDEX.md` § Agents lists `prd-writer` and the
  "pre-pipeline role" clarification sentence appears.
- `runtime/workflows/feature-development.md` Step 0 references
  `prd-writer.md` by the documented path.
- All existing tests pass.
- `npm pack --dry-run` confirms `runtime/agents/prd-writer.md` is
  in the tarball.
- `upgrade` from a v0.5.x fixture (KIT_VERSION rolled back +
  --allow-dirty) reports the new file as an ADD and the two
  edits as REPLACEs in the diff classifier, with no special-case
  logic added.

## Test Checklist

- [ ] Unit (extend `test/init.test.js`): assert
      `.ai/runtime/agents/prd-writer.md` lands in a fresh init
      target.
- [ ] Manual: read `prd-writer.md` alongside `executor.md` and
      `verifier.md` — confirm tonal/structural consistency.
- [ ] Manual: re-run the dogfood elicit (e.g. write a throwaway
      PRD for a fake feature) while consulting `prd-writer.md`
      to confirm the role file actually anchors behavior.
- [ ] Manual: `npm pack --dry-run` includes the new file.

## Verification Commands

```bash
npm test
node bin/cli.js init --cwd "$(mktemp -d)"   # confirm new agent file lands
node bin/cli.js upgrade --yes --no-diff      # refresh local snapshot
```

## Rollback Plan

1. Revert the implementation commit(s) on the
   `chore/runtime-prd-writer-agent` branch (or on `main` if
   already merged).
2. `npm test` passes on the prior tree.
3. No data migration: the agent file is purely additive; rollback
   removes it cleanly. Project PRDs already authored under
   `.ai/project/prds/` are unaffected (they don't depend on the
   agent file existing).

## Open Questions

All PRD-elicit-phase questions resolved (see PRD § Open
Questions). The spec-phase decisions deferred from the PRD are
resolved here:

- **Agent file depth**: **verifier-style richer**, not
  executor-style minimal. Justification: prd-writer has
  meaningful Inputs/Outputs/Constraints sections to document;
  executor.md's 5-bullet brevity would compress those flat.
  Original word budget was ≤1200 bytes (matching verifier.md
  total); revised to ≤1500 during implementation (see § Acceptance
  Criteria revision note).
- **INDEX.md placement**: flat append to existing role-files
  list. Three agents (executor / verifier / prd-writer) still
  fit a flat enumeration; no subsection needed.
- **"Transition-only concepts" note**: untouched. `prd-writer`
  is pre-pipeline, not a pipeline role, so the existing note
  about architect/planner/reviewer remains accurate. A small
  clarifying sentence is added (see Req. 2) instead of
  restructuring the note.

## Process notes

- Branch required for implementation:
  `chore/runtime-prd-writer-agent` (per
  `runtime/workflows/branching.md` § Governance Rule Branches).
- Preflight hook firing expected at the implementation
  transition (3 runtime paths in §2 Scope).
- Commit structure (per branching rule "never combined with
  feature code in the same commit"): single runtime commit is
  fine here because there is **no** kit-code change in scope —
  the implementation is all in `runtime/`.
- Version bump: PATCH (`v0.5.1`). Additive role file +
  doc/workflow update; no breaking interface change.
