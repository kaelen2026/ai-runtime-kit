# Feature: Traceability Link Conventions

## Status

DRAFT

## Parent PRD

`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`

## Goal

Formalize **structural upward-citation links** across the kit's
artifact chain so traceability is consistent, parseable, and
audit-ready. Today PRD ↔ feature is fully structured
(`## Parent PRD` / `## Downstream Spec`), but spec → feature is
prose-only ("§1 Goal cites feature"), and downstream
(plan / task / review) uses inconsistent naming
(`## Related Spec`, prose mentions in review preamble).

F4 completes the chain by standardizing every artifact
template to carry a structural `## Parent <Upstream>` section.
This is the **last slice** of the v0.6.0 nine-phase-workflow
PRD; shipping F4 closes the framework-A multi-feature PRD
fully delivered.

Modest scope: this feature defines the **convention** and
**templates**. It does NOT introduce tooling, automation,
commit-message rules, or workflow step numbering changes —
those are future features that can build on this layer.

## PRD Metrics Contributed

- **M1** (agent roster consistency) — **not contributed**.
  No new agent files (F2 already shipped them).
- **M2** (multi-feature PRD slicing) — **not contributed
  directly**, but completing F4 means the parent PRD has
  delivered all 4 of its candidate features (F1/F2/F3/F4).
  At that point M2 has its first complete data point — a
  PRD whose 4 features each have a structurally-citable
  parent.
- **M3** (traceability chain) — **primary**. F4 is the
  metric's enabling feature. Before F4 the chain works but
  is informal; after F4 a future tool / human auditor can
  walk the chain by reading structured fields rather than
  parsing prose.
- **M4** (TDD test-first ordering) — **not contributed**.
  F3's territory.

## Scope

### Includes

- **runtime/** (governance-protected):
  - `runtime/specs/_template/spec.md` — add `## Parent
    Feature` section near the top (after Status). Required;
    path format `.ai/project/features/YYYY-MM-DD-<slug>/feature.md`.
    Existing §1 Goal language stays but no longer doubles as
    the only citation; spec's §1 may reference the parent
    feature naturally in prose but the structural link is in
    `## Parent Feature`.
  - `runtime/specs/_template-bug-fix/spec.md` — same
    treatment. Bug-fix specs skip the feature layer (per
    workflow Step 0 / 0.5 skip rules) — `## Parent Feature`
    is allowed to read `(none — bug-fix workflow)` for
    these.
  - `runtime/plans/_template.md` — rename `## Related Spec`
    to `## Parent Spec`; document path format.
  - `runtime/tasks/_template.md` — rename `## Related Spec`
    to `## Parent Spec`; add `## Parent Plan` section.
  - `runtime/reviews/_template.md` — add `## Parent Spec`
    section near the top (after Summary). Review walks
    upstream through spec → feature → PRD via the chain;
    only direct-parent (spec) is required to be
    structurally-cited here.
  - `runtime/INDEX.md` — new `## Traceability` section
    documenting the canonical upward-citation chain
    (`commit → task → plan → spec → feature → PRD`) and the
    `## Parent <Type>` convention.

### Excludes

- **Tooling / automation / scripts** to validate, parse, or
  enforce link resolution. Per parent PRD OOS2.
- **Commit message conventions** for the `task → commit`
  segment of the chain. Defer to a future feature; for now
  the chain is documented at the doc level, not the git-log
  level.
- **Plan/Task workflow step numbering** — F3 explicitly
  excluded this. F4 inherits the exclusion. The workflow
  doc's Steps 0/0.5/1/1.5/2 stay as-is. Plan and Task remain
  implicit phases inside Step 2's umbrella, even though
  their *templates* gain explicit `## Parent <Upstream>`
  fields under this feature.
- **YAML frontmatter** on artifact files. F4 stays with the
  kit's existing markdown-section convention (consistent
  with templates like task / plan / review which already use
  sections). YAML frontmatter remains reserved for declarative
  hook / skill / rule files where the kit already uses it.
- **Retrofitting v0.5.x – v0.8.x artifacts** to the new
  template shape. Existing PRDs / features / specs / plans /
  tasks / reviews stay as authored. Forward work uses the
  new sections.
- **Renaming any existing artifact-type concept** (no
  spec → tech-spec rename, no feature → epic, etc.).

## Acceptance

This feature is DONE when:

- Spec template (regular + bug-fix variant) has
  `## Parent Feature` section in the documented position.
- Plan template's `## Related Spec` is renamed to
  `## Parent Spec` and documents a path-format expectation.
- Task template's `## Related Spec` is renamed to
  `## Parent Spec`; new `## Parent Plan` section added.
- Review template has `## Parent Spec` section near the top.
- INDEX.md has a `## Traceability` section documenting the
  canonical chain and the `## Parent <Type>` convention.
- All existing tests pass.
- F4 itself follows its own conventions: this feature doc
  cites the parent PRD via `## Parent PRD` (already does);
  the downstream spec for F4 will cite this feature via the
  new `## Parent Feature` section when written.

## Open Questions

Feature-level open questions; mechanics deferred to spec.

- **Spec template's existing §1 Goal citation language** —
  should it be stripped out (replaced entirely by the
  `## Parent Feature` section) or kept as redundant prose for
  human readability? Lean: keep prose, add structural section
  on top — humans skim, tooling reads structure. (deferred to
  spec)
- **`## Parent Feature: (none)` rendering for engineering-
  only specs** — exact wording for specs without an upstream
  feature (engineering-only, like v0.8.1). Options:
  `(none — engineering-only)`, `(N/A)`, just leave empty.
  Lean: `(none — engineering-only)` for clarity. (deferred to
  spec)
- **Whether `## Parent Plan` on the task template is
  *required* or *optional*** — tasks generated outside the
  normal plan-first workflow (rare but possible for hot
  fixes) might not have a parent plan. Lean: required; for
  hot fixes the value reads `(none — direct task)`.
  (deferred to spec)
- **INDEX.md `## Traceability` placement** — where in the
  doc? After `## Reviews` (so it sits with the artifact-type
  list) or as a new top-level concept (with `## Agents` /
  `## PRDs` etc.)? Lean: top-level since it's a cross-cutting
  concern. (deferred to spec)

## Downstream Spec

`.ai/project/specs/2026-05-14-traceability-link-conventions/spec.md`
(pending)
