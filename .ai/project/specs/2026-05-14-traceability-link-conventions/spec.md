# Feature Spec: Traceability Link Conventions

## Status

APPROVED

## Parent Feature

`.ai/project/features/2026-05-14-traceability-link-conventions/feature.md`
(parent PRD:
`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`)

<!-- Self-reference: this spec demonstrates the very convention
     it ships. Once the feature lands, all future specs cite
     their parent feature via this section. Existing v0.5.x –
     v0.8.x specs stay as authored per feature §Excludes. -->

## Goal

Implement F4 — traceability link conventions — per the
approved feature doc cited above. Last slice of the v0.6.0
nine-phase-workflow PRD; shipping F4 closes that PRD's full
4-feature delivery.

This spec answers HOW: which exact sections to add/rename in
each template, the wording of the new `## Traceability` block
in INDEX.md, and how engineering-only specs and hot-fix tasks
render their "no parent" cases.

This is a **runtime-scoped governance change** per
`.ai/runtime/SAFETY.md` § Runtime Tree Protection. The
`pre-executor/runtime-scoped-preflight` hook fires at the
Planner → Executor transition with 6 runtime paths.

## Scope

<!-- RUNTIME-SCOPED. 6 runtime/** paths in §Includes.
     Acknowledged. -->

Includes:

- **runtime/** (governance-protected):
  - `runtime/specs/_template/spec.md` — add a `## Parent
    Feature` section immediately after `## Status`. Required
    field; path format
    `.ai/project/features/YYYY-MM-DD-<slug>/feature.md`.
    Engineering-only specs (no upstream feature) render
    `(none — engineering-only)` per Q2.
  - `runtime/specs/_template-bug-fix/spec.md` — same
    treatment. Bug-fix specs default to `(none — bug-fix
    workflow)` since the bug-fix workflow skips Step 0.5.
  - `runtime/plans/_template.md` — rename `## Related Spec`
    to `## Parent Spec`; one-line guidance comment about path
    format (single path, not bullet list).
  - `runtime/tasks/_template.md` — rename `## Related Spec`
    to `## Parent Spec`; add new `## Parent Plan` section
    immediately after. Both required. Hot-fix tasks
    (no upstream plan) render `(none — direct task)` per Q3.
  - `runtime/reviews/_template.md` — add a `## Parent Spec`
    section immediately after `## Summary`. Required. Single
    direct-parent (spec); review walks upstream via the
    chain.
  - `runtime/INDEX.md` — add a new `## Traceability`
    section near the top, positioned between `## Agents` and
    `## PRDs`. Content:
    - Names the canonical upward chain:
      `commit → task → plan → spec → feature → PRD`.
    - Documents the `## Parent <Type>` section convention.
    - Lists the per-artifact required section name (spec ↦
      `## Parent Feature`; plan ↦ `## Parent Spec`; task ↦
      `## Parent Spec` + `## Parent Plan`; review ↦
      `## Parent Spec`).
    - Notes that engineering-only / hot-fix / bug-fix paths
      use `(none — <reason>)` rendering rather than blank.
    - Links to `runtime/workflows/feature-development.md`
      as the canonical lifecycle.

Excludes (carry from feature §Excludes + spec restatements):

- Tooling / scripts to validate link resolution.
- Commit-message conventions for the `task → commit`
  segment of the chain.
- YAML frontmatter (stays with markdown-section convention).
- Plan/Task workflow step numbering (still excluded;
  inherited from F3).
- Retrofitting v0.5.x – v0.8.x artifacts to the new section
  shape.
- Renaming any artifact concept (no spec → tech-spec rename;
  no feature → epic).

## Requirements

1. **`runtime/specs/_template/spec.md`** gains a `## Parent
   Feature` section after `## Status`:
   ```
   ## Parent Feature

   `.ai/project/features/YYYY-MM-DD-<slug>/feature.md`
   (or `(none — engineering-only)` / `(none — bug-fix workflow)`)
   ```
   Plus a brief HTML comment explaining the field. Existing
   §1 Goal prose may continue to mention the parent in
   natural language (Q1 decision: prose stays alongside
   structure for human readers; structure serves tooling).

2. **`runtime/specs/_template-bug-fix/spec.md`** — same
   `## Parent Feature` section with `(none — bug-fix
   workflow)` as the default value.

3. **`runtime/plans/_template.md`** — rename `## Related
   Spec` → `## Parent Spec`. Single path required; the
   section's body becomes a single path string + comment,
   not a bullet list. Comment notes "1 plan : 1 spec".

4. **`runtime/tasks/_template.md`** — rename `## Related
   Spec` → `## Parent Spec` (single path). Add `## Parent
   Plan` immediately after. Both required; hot-fix tasks
   render `(none — direct task)` per Q3.

5. **`runtime/reviews/_template.md`** — insert `## Parent
   Spec` after `## Summary`. Single path required. Comment
   notes review walks upstream via spec → feature → PRD
   chain; only direct parent (spec) is structurally cited
   on the review itself.

6. **`runtime/INDEX.md`** gains a top-level `## Traceability`
   section between `## Agents` and `## PRDs`:
   - Lists the canonical chain
     `commit → task → plan → spec → feature → PRD`.
   - Documents the `## Parent <Type>` convention per
     artifact-type.
   - Documents the `(none — <reason>)` rendering for the
     engineering-only / bug-fix / hot-fix / direct-task
     paths.
   - Cross-references `feature-development.md` for the
     workflow context.

## Acceptance Criteria

- All 5 template files have the documented `## Parent <Type>`
  section(s) in the correct position with correct comments.
- `runtime/INDEX.md` has `## Traceability` section between
  `## Agents` and `## PRDs` with all documented content.
- All existing tests pass (18/18).
- `npm pack --dry-run` shows updated files; modest size
  delta.
- F4's own spec (this file) is the first spec ever to use
  the new `## Parent Feature` section structurally. Sanity:
  this file's §Parent Feature reads correctly post-impl.
- The 6 paths grep clean for the old section names where
  applicable: `grep -l "## Related Spec" runtime/` returns
  empty after impl.

## Test Checklist

- [ ] Unit: existing init test still passes (covers presence
      of all 5 affected templates).
- [ ] Manual: each new/renamed section renders consistently
      across template files (same comment style, same path
      format guidance).
- [ ] Manual: `runtime/INDEX.md` reads cleanly with the new
      `## Traceability` section in position.
- [ ] Manual: `grep -rn "## Related Spec" runtime/` returns
      no matches.
- [ ] Manual: `npm pack --dry-run` shows updated files;
      tarball size stays under 55 KB.

## Verification Commands

```bash
npm test
grep -rn "## Related Spec" runtime/
grep -rn "## Parent " runtime/
node bin/cli.js upgrade --yes --no-diff
npm pack --dry-run | grep -E "INDEX|_template|total"
```

## Rollback Plan

1. Revert the commits on
   `chore/runtime-traceability-link-conventions` branch (or
   main if merged).
2. `npm test` passes on prior tree.
3. No data migration: all changes are template / doc additions
   or renames. Existing v0.5.x – v0.8.x artifacts unaffected
   (explicit no-retrofit per OOS).
4. Consumer impact on v0.8.x users who upgraded:
   templates revert to prior section names; any artifacts
   they authored using the new section names continue to
   work (the doc structure is just markdown — no enforcement
   tool reads it programmatically in this release).

## Open Questions

PRD-level + feature-level questions all resolved.

**Resolved here:**

- **Q1 — Keep §1 Goal prose citation alongside `## Parent
  Feature`?** **Decision: YES.** Prose serves human readers
  who skim §1 for context; structural section serves tooling
  and audit. Different audiences, complementary roles. The
  spec template's existing §1 Goal language stays unchanged
  except for an editorial pointer to the new `## Parent
  Feature` section.
- **Q2 — Engineering-only spec rendering for "no parent
  feature".** **Decision: `(none — engineering-only)`** as
  the literal rendered string. Bug-fix specs render
  `(none — bug-fix workflow)`. Both forms are explicit and
  audit-readable. Empty / `N/A` rejected as ambiguous.
- **Q3 — Is `## Parent Plan` required on task template?**
  **Decision: REQUIRED.** Hot-fix tasks (no upstream plan)
  render `(none — direct task)`. Matches kit's "no implicit
  anything" pattern (e.g. v0.8.0's `## TDD-Applies`
  required + explicit boolean).
- **Q4 — `## Traceability` placement in INDEX.md.**
  **Decision: top-level, between `## Agents` and `## PRDs`.**
  Cross-cutting concern; readers see the chain concept early
  before diving into per-artifact-type details. Alternative
  (after `## Reviews`, grouped with artifact-type sections)
  rejected — places the chain too far down.

**Deferred to implementation (small mechanics):**

- Exact comment wording for each `## Parent <Type>` section
  — match prose style across files for consistency.
- Exact wording of `## Traceability` section's intro
  paragraph — should reference the v0.6.0 PRD's M3 metric
  as the motivation.
- Whether the new `## Parent Feature` section in spec
  template comes before or after a potential `## Status`
  comment — placement immediately after `## Status` is
  spec'd; subsection ordering details (e.g. `## Status` +
  `## Parent Feature` followed by `## Goal`) confirmed
  during impl.

## Process notes

- Branch:
  `chore/runtime-traceability-link-conventions`.
- Preflight hook fires at Planner → Executor with **6
  runtime paths** (largest count so far on this kit; previous
  high was F2's 9 paths but those were mostly new files,
  this is mostly edits to existing).
- Commit structure (mirrors prior governance ships):
  - **Commit A**: 6 runtime/** changes + spec status flip.
  - **Commit B**: kit code (no test changes expected; spec
    template presence already covered) + version bump
    v0.8.1 → v0.9.0 + README + CHANGELOG.
  - **Commit C**: review file.
- Version: **v0.9.0** (MINOR). Adds structural fields to
  templates + restructures INDEX. Pre-stable v0.x allows the
  MINOR bump; this release is purely additive with safe
  defaults (`(none — ...)` rendering for paths without
  upstream).
- Recursive rule application: F4's own impl is doc-only
  (template edits + INDEX restructure). By F3's rule
  (TDD-Applies = false for doc-only), F4 self-impl
  satisfies PRD OOS4 with `false`. No self-test required;
  pattern matches F3.
- **Closing significance**: shipping F4 completes the v0.6.0
  nine-phase-workflow PRD's 4-feature delivery. First fully-
  delivered multi-feature PRD on this kit. M2 metric (PRD
  slicing with no duplication) has its first complete data
  point.
