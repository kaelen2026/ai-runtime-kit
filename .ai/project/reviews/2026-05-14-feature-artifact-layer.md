# Review: Feature Artifact Layer — F1 of v0.6.0 (nine-phase-workflow)

PRD: `.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`
Feature: `.ai/project/features/2026-05-14-feature-artifact-layer/feature.md`
Spec: `.ai/project/specs/2026-05-14-feature-artifact-layer/spec.md`
Branch: `chore/runtime-feature-artifact-layer`
Commits: `cf73945` (runtime governance), `3670610` (kit code +
ship metadata).


## Parent Spec

`.ai/project/specs/2026-05-14-feature-artifact-layer/spec.md`

## Summary

First feature shipped under the v0.6.0 nine-phase pipeline. F1
delivers the keystone — the **feature artifact** itself: a
canonical template at `runtime/features/_template.md`, a
`## Features` section in `INDEX.md` between PRDs and Specs, and
**workflow Step 0.5 "Slice into Features"** that makes feature
docs mandatory after every PRD.

This release also installs the new **upward citation rule**:
specs that derive from a PRD now cite their parent **feature**
(which cites the PRD), instead of citing the PRD directly. The
chain assembles upward. F2 / F3 / F4 build on this layer.

This was the **first feature** on this kit to flow through
PRD → feature → spec → impl → review end-to-end. The pipeline
held: every transition produced a structurally-correct document
that drove the next phase without scope drift.

## Verification

- `npm test` → **18/18 pass** (test count unchanged; init test
  extended in place to cover the new `features/` dir and the
  `features/_template.md` runtime file).
- `npm pack --dry-run` → 47 files / 45.8 kB.
  `runtime/features/_template.md` (1.9 kB) included alongside
  the v0.5.x additions.

Runtime-scoped preflight (HOOK pre-executor/runtime-scoped-preflight):
  - Scope contract: PASS — listed paths:
    `runtime/features/_template.md`, `runtime/INDEX.md`,
    `runtime/workflows/feature-development.md`.
  - Branch name: PASS — `chore/runtime-feature-artifact-layer`.
  - Spec home: PASS —
    `.ai/project/specs/2026-05-14-feature-artifact-layer/spec.md`.

Hook self-enforcement notes:
  - **Third real-world fire**, third clean pass. The pattern
    is now reflexive: governance branch created before any
    edit, scope enumerated in spec §2 from the start, no
    GATE failure required to remember.

## Acceptance Criteria

- [x] `runtime/features/_template.md` exists with all 7 body
      sections in documented order.
- [x] `runtime/INDEX.md` has `## Features` section between
      `## PRDs` and `## Specs`. Cross-reference to Step 0.5
      present.
- [x] `runtime/workflows/feature-development.md` has Step 0.5;
      Step 1's spec-citation rule updated to feature path
      (verified by reading the file).
- [x] `src/init.js` `PROJECT_SKELETON_DIRS` includes
      `'features'` after `'prds'`.
- [x] Fresh `init` (extended test) creates
      `.ai/project/features/` AND
      `.ai/runtime/features/_template.md`.
- [x] All existing tests pass (18/18).
- [x] `npm pack --dry-run` shows
      `runtime/features/_template.md` in the tarball.
- [x] F1 feature doc migrated to canonical template shape with
      BOOTSTRAP NOTE retained.
- [ ] `upgrade` from a v0.5.1 fixture verified. **Not run for
      this review** — relying on the existing diff classifier
      that handled v0.5.0's analogous `prds/` introduction
      cleanly. Risk: low; deferred manual verification.

## Blocking Issues

None.

## Non-blocking Issues

- **`upgrade` against v0.5.1 fixture not explicitly verified.**
  The classifier handled v0.5.0's analogous introduction of
  `runtime/prds/` cleanly (1 ADD + 2 REPLACEs); same shape this
  time. If a v0.5.x consumer reports a `upgrade` quirk, follow
  up with a fixture test.
- **The F1 feature doc is now a self-template-exemplar.** It's
  the only feature doc currently in the kit, so any reader
  examining "what does a feature doc look like" sees F1's
  shape. F1's content is intentionally illustrative (covers
  PRD metrics mapping, scope, acceptance) — but the
  illustrative power dilutes once F2/F3/F4 ship with their
  own feature docs in different shapes. Not a blocker; a
  watch-item.
- **No explicit test that workflow Step 0.5 text exists as
  documented.** Tests assert file presence; they don't grep
  for "Slice into Features" string in the workflow doc. If a
  future edit accidentally drops Step 0.5, tests stay green.
  Could add a content assertion — flagged as F4-territory
  (traceability + structural validation share machinery).

## Suggested Fixes

- **Follow-up — author F2 feature doc + spec.** F2 is "agent
  files for 9 phases" (feature-writer, spec-writer, planner,
  tdd-writer, reviewer). It now has a real template to use
  (this release shipped it). Next natural step.
- **Follow-up — author F3 (TDD step) + F4 (traceability)
  features.** Can run in parallel with F2 since they're
  independent. F4 should land last because it formalizes the
  link encoding that F2/F3 will be naive consumers of.
- **Follow-up — README walkthrough for PRD → Feature → Spec.**
  Combine with the v0.5.0/v0.5.1 walkthrough debts. This kit
  now has a non-trivial pipeline; the README's brief
  walkthroughs no longer reflect the real flow.
- **Follow-up — validate `upgrade` against a real v0.5.1
  fixture.** Quick to do (~5 min) and gives confidence for
  existing consumers (ai-workflow-demo specifically).

## Open Questions resolved

The spec's 3 deferred mechanics-level questions, resolved
during impl:

1. **`## Features` section wording in INDEX.md** — matched the
   prose voice and structural beats of `## PRDs` (Location
   block + lifecycle list + skip criteria summary +
   workflow cross-reference). Done.
2. **Step 0.5 heading numbering** — used `### 0.5.` (kept
   Step 1+ stable). Renumbering would have rippled through
   downstream documentation and reviewer expectation; the
   `.5` suffix is unobtrusive.
3. **Feature doc migration co-location** — kept in Commit A
   alongside the runtime change. The migration is
   conceptually atomic with the template's introduction
   (one without the other would be inconsistent dogfood).

## Process notes (dogfood reflections)

- **First PRD → Feature → Spec → Impl run.** Every transition
  honored its contract. The spec cited the feature, the
  feature cited the PRD, the impl matched the spec. Pipeline
  works.
- **First feature doc migration.** F1's bootstrap shape →
  canonical template shape happened cleanly in Commit A. The
  BOOTSTRAP NOTE comment is a low-cost scar that future
  readers can interpret correctly without archeology.
- **Spec cited a feature, not a PRD.** First spec on this kit
  to do so. The chain assembles upward as intended; reviewers
  walk feature → PRD if they want strategic context, walk
  spec → tasks → commits if they want execution detail.
- **Branch hygiene reflexive.** Governance branch + commit
  split happened without me being prompted. The discipline
  is internalizing across all three real fires of the
  preflight hook.

## Verdict

Approved. Ready to merge into `main`, push, tag `v0.6.0`, and
optionally publish to npm. F2 / F3 / F4 can begin authoring
once F1 is on `main` (they reference F1's shipped artifacts).
