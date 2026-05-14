# Feature Spec: Feature Artifact Layer

## Status

APPROVED

## Parent Feature

`.ai/project/features/2026-05-14-feature-artifact-layer/feature.md`

## Goal

Implement F1 — the **feature artifact** — per the approved
feature doc at
`.ai/project/features/2026-05-14-feature-artifact-layer/feature.md`
(parent PRD:
`.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`).

The feature doc answered "what slice of the PRD does this
satisfy and what does done look like." This spec answers HOW:
file paths, template content, workflow integration, INDEX
placement, kit-code skeleton update.

This is a **runtime-scoped governance change** per
`.ai/runtime/SAFETY.md` § Runtime Tree Protection. The
`pre-executor/runtime-scoped-preflight` hook will fire at the
Planner → Executor transition.

## Scope

<!-- RUNTIME-SCOPED. Includes paths under runtime/**.
     Acknowledged. -->

Includes:

- **runtime/** (governance-protected):
  - `runtime/features/_template.md` — NEW. Canonical feature
    template. Sections (in order): Status / Parent PRD / Goal /
    PRD Metrics Contributed / Scope (Includes + Excludes) /
    Acceptance / Open Questions / Downstream Spec. Promotes the
    ad-hoc shape used by this feature's own DRAFT doc into the
    formal template.
  - `runtime/INDEX.md` — add `## Features` section between
    `## PRDs` (added in v0.5.0) and `## Specs`. Mirrors the PRD
    section's structure (Location block + lifecycle list + skip
    criteria summary).
  - `runtime/workflows/feature-development.md` — insert **Step
    0.5 "Slice into Features"** between current Step 0 (PRD)
    and current Step 1 (Spec). Step 0.5 is mandatory whenever
    Step 0 ran (i.e. follow-on to PRD). Step 1's spec-citation
    rule updates: spec §1 Goal cites its parent **feature**
    path (which in turn cites the PRD); spec no longer cites
    the PRD directly.

- **Kit code** (not governance-protected — separate commit
  per `branching.md § Governance Rule Branches`):
  - `src/init.js` `PROJECT_SKELETON_DIRS` — add `'features'`.
  - `test/init.test.js` — extend existing init test to assert
    both `.ai/project/features/` (project skeleton) and
    `.ai/runtime/features/_template.md` (runtime snapshot)
    land via fresh init.

- **Project-side dogfood** (no commit-structure constraint):
  - The existing F1 feature doc at
    `.ai/project/features/2026-05-14-feature-artifact-layer/feature.md`
    is **migrated post-template-ship** to match the new
    canonical shape. Migration is part of this spec's
    implementation: after the template lands, the F1 doc is
    rewritten to use the same section names/order. The doc
    keeps a one-line BOOTSTRAP NOTE acknowledging it was
    authored before the template existed.

Excludes (carry from feature doc §Excludes + spec-phase
restatements):

- **F2** (agent files for 9 phases — feature-writer,
  spec-writer, planner, tdd-writer, reviewer). Depends on F1
  shipping first; separate spec.
- **F3** (TDD step in workflow between task and implement).
  Independent of F1 but separate scope.
- **F4** (traceability link conventions across artifacts).
  Depends on F1 (feature artifact must exist to link from).
- **No** retrofit of v0.5.x specs to reference a feature.
- **No** automated check that "every PRD has ≥1 feature"
  (tooling is F4's territory at earliest; PRD OOS2 says no
  CI checks in this PRD's scope).
- **No** rename of existing `executor.md`. F2 decides naming
  alignment.

## Requirements

1. **`runtime/features/_template.md` exists** with the following
   structure (sections, in order):
   - `# Feature: <Name>` heading.
   - `## Status` — value `DRAFT`. Comment lists allowed values
     (`DRAFT | APPROVED | REJECTED | SUPERSEDED`).
   - `## Parent PRD` — path to the parent PRD; required.
   - `## Goal` — 1–2 paragraphs. What slice of the PRD this
     satisfies.
   - `## PRD Metrics Contributed` — bullet list mapping this
     feature to specific Ms in the parent PRD's
     `## Success Metrics`. Each bullet states "primary",
     "partial", or "not contributed" with one-line reason.
   - `## Scope`
     - `### Includes` — sub-bullets per touched path / artifact.
     - `### Excludes` — carry from parent PRD's OOS + own
       additions.
   - `## Acceptance` — when **this feature** is done. Narrower
     than spec acceptance criteria (no test checklist, no
     verification commands here); broader than tasks.
   - `## Open Questions` — feature-level only; spec-phase
     questions get marked "(deferred to spec)".
   - `## Downstream Spec` — path to the spec implementing this
     feature; `(pending)` until the spec is drafted.

2. **`runtime/INDEX.md` § Features added.** Place between
   `## PRDs` and `## Specs`. Structure matches `## PRDs`
   (Location block + lifecycle list + skip-criteria summary).
   Cross-reference Step 0.5 in `feature-development.md`.

3. **`runtime/workflows/feature-development.md` Step 0.5
   inserted** with:
   - Heading: `### 0.5. Slice into Features`.
   - Body: explains MANDATORY whenever Step 0 ran. Same skip
     criteria as Step 0 (bug-fix workflow / engineering-only
     changes skip Step 0 entirely → skip 0.5).
   - Path convention named:
     `.ai/project/features/YYYY-MM-DD-<slug>/feature.md`.
   - Single-feature PRD handling: still mandatory to author one
     feature doc; full template sections present; sections may
     contain "see parent PRD" pointer if content is fully
     captured upstream (no 5-line-stub allowance).
   - Updated Step 1 spec-citation rule: spec §1 Goal cites its
     parent feature; feature already cites the parent PRD;
     chain assembles upward.

4. **Kit code skeleton update.** `src/init.js`
   `PROJECT_SKELETON_DIRS` includes `'features'`, alphabetically
   placed after `'contracts'` and before `'hooks'` (preserving
   existing ordering pattern).

5. **Test extension.** `test/init.test.js`'s existing fresh-init
   test asserts:
   - `.ai/project/features/` exists (empty dir).
   - `.ai/runtime/features/_template.md` exists with non-zero
     size.

6. **Bootstrap doc migration.** After the canonical template
   exists in `runtime/features/_template.md`, the F1 feature
   doc at `.ai/project/features/2026-05-14-feature-artifact-layer/feature.md`
   is rewritten to match the template's section order /
   naming. The BOOTSTRAP NOTE comment is retained as a one-line
   marker (file was authored before the template existed).

## Acceptance Criteria

- `runtime/features/_template.md` exists; all 7 body sections
  present in documented order (Status / Parent PRD / Goal /
  PRD Metrics Contributed / Scope / Acceptance / Open
  Questions / Downstream Spec).
- `runtime/INDEX.md` has `## Features` section between
  `## PRDs` and `## Specs`. Cross-reference to Step 0.5 present.
- `runtime/workflows/feature-development.md` has `### 0.5.
  Slice into Features` between Step 0 and Step 1. Step 1's
  spec citation rule updated to cite feature path (not PRD
  path) in §1 Goal. Skip criteria mirror Step 0's.
- `src/init.js` `PROJECT_SKELETON_DIRS` includes `'features'`.
- Fresh `init` in a `mkdtemp` fixture creates
  `.ai/project/features/` AND `.ai/runtime/features/_template.md`.
- All existing tests still pass.
- `upgrade` from a v0.5.1 fixture (downgraded KIT_VERSION +
  --allow-dirty) reports `features/_template.md` as ADD and
  `INDEX.md` + `feature-development.md` as REPLACEs.
- F1 feature doc migrated to canonical template shape; the
  BOOTSTRAP NOTE one-liner remains.
- `npm pack --dry-run` shows `runtime/features/_template.md`
  in the tarball.

## Test Checklist

- [ ] Unit (extend `test/init.test.js`): assert
      `.ai/project/features/` + `.ai/runtime/features/_template.md`
      both land via init.
- [ ] Manual: read `runtime/features/_template.md` against the
      F1 feature doc — confirm structural match after migration.
- [ ] Manual: `npm pack --dry-run` shows the new template file.
- [ ] Manual: `upgrade` from synthetic v0.5.1-shaped fixture
      reports new file as ADD; INDEX.md + feature-development.md
      as REPLACEs; no special-case logic added.

## Verification Commands

```bash
npm test
node bin/cli.js init --cwd "$(mktemp -d)"
node bin/cli.js upgrade --yes --no-diff
npm pack --dry-run | grep features/_template.md
```

## Rollback Plan

1. Revert the implementation commits on
   `chore/runtime-feature-artifact-layer` branch (or on `main`
   if already merged).
2. `npm test` passes on the prior tree.
3. No data migration required: the feature template is purely
   additive. Existing PRDs / specs / reviews are unaffected.
   The F1 feature doc reverts to its DRAFT pre-migration shape
   automatically (it's part of the commits being reverted).
4. The `.ai/project/features/` dir, once created in a
   consumer's project by `init`, persists across rollback
   (rollback doesn't touch `.ai/project/`). That's correct
   per the kit's "project tree is sovereign" rule.

## Open Questions

PRD-level questions all resolved. Feature-level questions
resolved as follows during spec drafting:

**Resolved here:**

- **Feature doc location** — `.ai/project/features/YYYY-MM-DD-<slug>/feature.md`.
  Top-level directory parallel to specs/plans/tasks/reviews.
  Rejected: nesting feature.md inside the spec dir
  (`.ai/project/specs/.../feature.md`) — physical pairing
  with spec creates coupling that breaks if one feature → 2+
  specs in the future.
- **Slug naming convention** — `<feature-semantic-name>` only.
  No `f1`/`f2` ordering prefix (brittle if features reorder),
  no parent-PRD-slug prefix (creates long paths). The
  Downstream Spec path in the feature doc carries the upward
  link; F4 will formalize the link encoding.
- **Single-feature PRD doc length** — full template sections
  required, but content may be terse / pointer-only when the
  PRD upstream already says it. Rejected: a 5-line stub
  allowance — inconsistent shape across features hurts M3
  (traceability) tooling and audit clarity.

**Deferred to implementation (small mechanics, not blocking):**

- Exact `## Features` section wording in INDEX.md — match the
  prose voice of `## PRDs` for symmetry.
- Whether the Step 0.5 heading uses `### 0.5.` or
  `### 1.0 (Slice into Features)` numerically — `### 0.5.`
  keeps Step 1 stable; preferred unless renumbering reads
  cleaner during impl.

## Process notes

- Branch required for implementation:
  `chore/runtime-feature-artifact-layer` (per
  `runtime/workflows/branching.md` § Governance Rule
  Branches).
- Preflight hook firing expected at the
  Planner → Executor transition (3 runtime paths in §2 Scope).
- Commit structure (mirroring v0.5.0 / v0.5.1 pattern):
  - **Commit A**: runtime/** changes only (template + INDEX +
    workflow) + spec status DRAFT→APPROVED. Includes the F1
    feature doc migration to canonical shape (project-side
    edit, but cleanly co-located with the runtime change
    since they're conceptually a single act).
  - **Commit B**: kit code (`src/init.js`) + tests + version
    bump to v0.6.0 + README + CHANGELOG.
  - **Commit C**: review file.
  - Then merge / push / tag / (optional) publish.
- Version bump: **MINOR** (`v0.6.0`). Adds a new top-level
  runtime artifact type (parallel to v0.5.0's `prds/`
  introduction). Pre-stable kit allows breaking changes at
  any minor, but this is purely additive — no existing
  consumer artifact changes shape.
- This will be the **first spec that cites its parent
  feature instead of its parent PRD** (Req. 3). That's the
  v0.6.0 workflow contract taking effect on itself, retroactively
  applied: this spec's §1 Goal already references the feature
  path (which references the PRD).
