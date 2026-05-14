# Feature: Feature Artifact Layer

<!-- BOOTSTRAP NOTE — originally authored before
     runtime/features/_template.md existed; migrated to the
     canonical template shape as part of this feature's own
     implementation (v0.6.0). -->

## Status

APPROVED

## Parent PRD

`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`

## Goal

Introduce the **feature** artifact between PRD and spec. This
is **F1** in the parent PRD's candidate slice list: the
keystone that has to ship before F2 (agent files), F3 (TDD
step), or F4 (traceability links) can build on it.

Concretely: kit ships `runtime/features/_template.md` (canonical
template), `init` scaffolds `.ai/project/features/`, the
workflow gains Step 0.5 between PRD and spec, and INDEX.md
documents the new artifact alongside specs/plans/tasks/reviews.

## PRD Metrics Contributed

- **M1** (agent roster consistency) — **not contributed**.
  Adds the feature *artifact*, not agent *files*. F2 owns
  agent additions; the feature-writer agent depends on this
  feature layer existing first.
- **M2** (multi-feature PRD with no PRD-level duplication) —
  **primary**. M2 is unmeasurable until this feature ships
  (no feature artifact = no slicing to spot-check). After
  ship, the parent PRD itself becomes the first M2 sample
  (4 features sliced from 1 PRD).
- **M3** (traceability chain) — **partial**. Adds the
  feature ↔ PRD link layer; full chain requires F4 to encode
  the link format consistently across artifacts.
- **M4** (TDD test-first) — **not contributed**. F3 owns the
  TDD phase insertion.

## Scope

### Includes

- **runtime/** (governance-protected):
  - `runtime/features/_template.md` (NEW)
  - `runtime/INDEX.md` — `## Features` section between PRDs
    and Specs
  - `runtime/workflows/feature-development.md` — Step 0.5 +
    Step 1 citation rule update
- **Kit code**:
  - `src/init.js` — `'features'` added to
    `PROJECT_SKELETON_DIRS`
  - `test/init.test.js` — assert new dir + template land
- **Project-side dogfood**:
  - This feature doc migrated to canonical shape (the bootstrap
    note above is the visible scar)

### Excludes

Carry from parent PRD's §Out of Scope (OOS1 / OOS2 / OOS3 /
OOS4) + own feature-level additions:

- **F2** (agent files for 9 phases) — depends on F1, separate
  spec
- **F3** (TDD step insertion) — independent of F1
- **F4** (traceability link encoding) — depends on F1
- No rename of `executor.md` (F2's call)
- No retrofit of v0.5.x specs to reference a feature

## Acceptance

This feature is DONE when:

- `runtime/features/_template.md` ships with the documented
  sections.
- `runtime/INDEX.md` has `## Features` positioned between
  `## PRDs` and `## Specs`.
- `runtime/workflows/feature-development.md` has Step 0.5
  with mandatory + skip-criteria text, and Step 1's citation
  rule references feature path (not PRD path) in §1 Goal.
- Fresh `init` creates `.ai/project/features/` AND
  `.ai/runtime/features/_template.md`.
- This feature doc itself is migrated to the canonical shape
  (sanity: dogfood doc and template agree).
- All existing tests pass.

## Open Questions

Resolved during spec drafting (recorded in F1 spec's
§Open Questions). None remain blocking.

## Downstream Spec

`.ai/project/specs/2026-05-14-feature-artifact-layer/spec.md`
