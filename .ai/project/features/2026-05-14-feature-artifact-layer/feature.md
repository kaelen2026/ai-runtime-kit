# Feature: Feature Artifact Layer

<!-- BOOTSTRAP NOTE — this feature doc uses an ad-hoc shape
     because the canonical template (runtime/features/_template.md)
     does not yet exist; it is created by this feature's own
     spec. The shape below will be refined into that template.
     Per the PRD's Q1 decision (MANDATORY feature layer), every
     PRD downstream must produce ≥1 feature doc — including the
     PRD that creates the feature layer itself. Self-bootstrap is
     intentional. -->

## Status

DRAFT

## Parent PRD

`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`

## Goal

Introduce the **feature** artifact between PRD and spec.
Specifically:

- Add `runtime/features/_template.md` (kit-shipped feature
  template, canonical structure).
- Add `.ai/project/features/` to `PROJECT_SKELETON_DIRS` in
  `src/init.js` so fresh init scaffolds the dir.
- Insert **workflow Step 0.5 (Slice into Features)** in
  `runtime/workflows/feature-development.md` between Step 0
  (PRD) and Step 1 (Spec). Spec citation rule updates: spec §1
  Goal cites its feature (which cites the PRD), not the PRD
  directly.
- Update `runtime/INDEX.md` to add `## Features` section
  between `## PRDs` and `## Specs`, mirroring workflow position.

This is **F1** in the parent PRD's candidate slice list; the
keystone for F2 / F3 / F4 (those depend on the feature
artifact existing).

## PRD Metrics Contributed

From parent PRD's `## Success Metrics`:

- **M1 (agent roster consistency)** — partial. This feature
  doesn't add agent files (that is F2's job); it adds the
  feature *artifact*. The feature-writer *agent* depends on
  this layer existing first.
- **M2 (multi-feature PRD with no PRD-level duplication)** —
  primary contributor. M2 is **unmeasurable** until this
  feature ships (no feature artifact = no slicing to spot-check).
  After this feature ships, the parent PRD itself becomes the
  first M2 sample (4 features sliced from 1 PRD, no
  Problem/Users/Metrics duplication).
- **M3 (traceability chain)** — partial. Adds the
  feature ↔ PRD link layer; full chain requires F4
  (traceability conventions) to encode link format
  consistently.
- **M4 (TDD test-first)** — not contributed by this feature
  (F3 owns).

## Scope

### Includes

- **runtime/** (governance-protected per `SAFETY.md` § Runtime
  Tree Protection — runtime-scoped spec needed):
  - `runtime/features/_template.md` — NEW canonical template.
    Promotes the ad-hoc shape used in this very feature doc
    into the formal template.
  - `runtime/INDEX.md` — add `## Features` section between
    `## PRDs` and `## Specs`.
  - `runtime/workflows/feature-development.md` — add Step 0.5
    "Slice into Features"; update Step 1's spec-citation rule
    to point spec at feature path instead of (or in addition
    to) PRD path.
- **Kit code**:
  - `src/init.js` `PROJECT_SKELETON_DIRS` — add `'features'`.
  - `test/init.test.js` — assert `.ai/project/features/` and
    `.ai/runtime/features/_template.md` land via init.

### Excludes (this feature)

Carry-from-PRD-OOS + own:

- Auto-generation of feature docs from PRDs (PRD OOS3).
- Retrofitting v0.5.x history with feature docs (PRD OOS1).
- Feature-writer agent file — that is **F2's** scope, depends
  on this feature shipping first.
- TDD-step workflow insertion — that is **F3's** scope.
- Traceability link encoding (frontmatter vs markdown link
  conventions) — that is **F4's** scope; F1 establishes the
  *artifact* existing, F4 establishes the *links between
  artifacts*.
- Renaming `executor.md` → `implementer.md` or any other
  agent file rename — F2's call.
- Updating existing v0.5.1 specs to retroactively reference a
  feature — explicit OOS per PRD OOS1.

## Acceptance (this feature)

This feature is **DONE** when:

- `runtime/features/_template.md` exists with all sections
  visible to authors: Status, Parent PRD, Goal, PRD Metrics
  Contributed, Scope (Includes/Excludes), Acceptance, Open
  Questions, Downstream Spec.
- `runtime/INDEX.md` has a `## Features` section,
  positioned between `## PRDs` and `## Specs`.
- `runtime/workflows/feature-development.md` has explicit Step
  0.5 with skip criteria mirroring Step 0's: PRDs that
  decompose into exactly one feature still create one feature
  doc (per PRD Q1 = MANDATORY); engineering-only / bug-fix
  workflows skip Step 0 entirely and therefore skip Step 0.5.
- `init` in a clean fixture creates `.ai/project/features/`
  empty dir AND `.ai/runtime/features/_template.md`.
- `upgrade` from v0.5.x in a fixture reports the new template
  as ADD and the two doc edits as REPLACEs with no
  special-case logic.
- All existing tests still pass.
- This bootstrap feature doc itself is migrated to the
  canonical template shape once the template exists (sanity
  check: the dogfood doc and the template agree).

## Open Questions

Feature-level open questions (PRD-level resolved in parent).
None block downstream spec drafting; all are spec-phase
mechanics.

- **Feature doc location** — `.ai/project/features/...` is the
  proposed path; spec confirms or revises. Alternative:
  `.ai/project/specs/YYYY-MM-DD-<slug>/feature.md` (sibling to
  spec.md within the same dated dir) — keeps feature + spec
  physically together; tradeoff is conceptual clarity vs
  filesystem ergonomics. Spec decides.
- **Slug naming convention** — `2026-05-14-<slug>/` or
  `<parent-prd-slug>-f1/` for explicit parent linkage? Spec
  decides; F4 (traceability conventions) may revise.
- **Mandatory single-feature feature doc text length** — when
  a PRD obviously has only one feature, should the feature doc
  be allowed to be a 5-line stub (just citing the PRD and
  pointing at the spec)? Or should it carry the full template
  shape with most sections marked "see PRD"? Spec decides;
  shorter is friendlier to small PRDs but creates
  inconsistency.

## Downstream Spec

`.ai/project/specs/2026-05-14-feature-artifact-layer/spec.md`
(pending)
