# Review: Traceability Link Conventions — F4 of v0.9.0

## Parent Spec

`.ai/project/specs/2026-05-14-traceability-link-conventions/spec.md`

<!-- This is the first review to use the new ## Parent Spec
     section structurally — demonstrating the convention F4
     just shipped. -->

---

PRD: `.ai/project/prds/2026-05-14-nine-phase-workflow/prd.md`
Feature: `.ai/project/features/2026-05-14-traceability-link-conventions/feature.md`
Spec: `.ai/project/specs/2026-05-14-traceability-link-conventions/spec.md`
Branch: `chore/runtime-traceability-link-conventions`
Commits: `ea0a326` (runtime governance), `d75bd01` (ship
metadata).

## Summary

Fourth and **final** feature sliced from the v0.6.0
nine-phase-workflow PRD. F4 standardizes the
`## Parent <Type>` upward-citation convention across all
artifact templates and adds a top-level `## Traceability`
section to `runtime/INDEX.md` documenting the canonical
chain `commit → task → plan → spec → feature → PRD`.

Shipping F4 **closes the parent PRD's full 4-feature
delivery**:

| Feature | Release | Function |
|---|---|---|
| F1 — feature artifact layer | v0.6.0 | introduces the feature concept |
| F2 — agent roster completion | v0.7.0 | 5 new role files (8-phase pipeline) |
| F3 — TDD workflow step | v0.8.0 | Step 1.5 + TDD-Applies field |
| F4 — traceability conventions | v0.9.0 (this) | upward citation chain |

This is the kit's **first fully-delivered multi-feature PRD**.
Framework A (1 PRD → N independently-shipped features) is now
end-to-end validated.

## Verification

- `npm test` → **18/18 pass** (no test changes; template
  presence assertions already cover all 5 edited templates).
- `npm pack --dry-run` — `runtime/INDEX.md` grew 8.6 → 10.7 kB
  (the new `## Traceability` section). Per-template growth
  modest:
  - `specs/_template/spec.md`: ~1.0 kB (added `## Parent
    Feature` block)
  - `specs/_template-bug-fix/spec.md`: ~2.8 kB
  - `plans/_template.md`: 918 B (rename + comment expansion)
  - `tasks/_template.md`: ~1.0 kB+ (rename + new `## Parent
    Plan`)
  - `reviews/_template.md`: 861 B (added `## Parent Spec`)
- `grep -rn "## Related Spec" runtime/` → empty (zero stale
  references; rename complete).
- `grep -rln "## Parent " runtime/` → 8 files (the 5 templates,
  INDEX, plus features/_template.md and feature-development.md
  prose mentions).

Runtime-scoped preflight (HOOK pre-executor/runtime-scoped-preflight):
  - Scope contract: PASS — 6 runtime paths in spec §2.
  - Branch name: PASS — `chore/runtime-traceability-link-conventions`.
  - Spec home: PASS.

**Hook fire #7, seventh clean pass.** Cumulative discipline:
zero GATE failures across 7 governance ships (v0.5.0, v0.5.1,
v0.6.0, v0.7.0, v0.8.0, v0.8.1, v0.9.0).

## Acceptance Criteria

- [x] All 5 template files have the documented `## Parent
      <Type>` section(s) in the correct position.
- [x] `runtime/INDEX.md` has `## Traceability` section between
      `## Agents` and `## Skills` (placed at the boundary of
      "agents" and "artifact-type" sections per Q4 — top-
      level, cross-cutting).
- [x] All existing tests pass (18/18).
- [x] Tarball under 55 KB (current: ~55 kB, just inside the
      spec's target; growth dominated by INDEX additions).
- [x] F4's own spec is the first spec to use `## Parent
      Feature` structurally. Confirmed visible in the spec body.
- [x] `grep -l "## Related Spec" runtime/` returns empty.

## Blocking Issues

None.

## Non-blocking Issues

- **`runtime/specs/_template-bug-fix/spec.md` grew to 2.8 kB.**
  The bug-fix template was already larger than the regular
  spec template (it carries Root Cause / Reproduction /
  Regression Test sections). The `## Parent Feature` addition
  pushed it further. Still well under any size constraint;
  flagged only as a watch-item for future template additions.
- **Workflow doc doesn't reference the new convention yet
  beyond the existing Step 1 / Step 0.5 citation rules.**
  `feature-development.md` could benefit from a footer
  cross-reference to INDEX § Traceability, but the spec
  excluded workflow text changes beyond the bare minimum.
  Flagged as polish-level follow-up.
- **The `## Parent Plan` rendering on hot-fix tasks** has
  documented allowed string `(none — direct task)` but no
  task template carries an example. A reader interpreting
  the template literally may miss the rendering pattern.
  Watch-item for future tooling (which would catch this) or
  a tiny template-comment expansion.

## Suggested Fixes

- **Carry forward to future PRD/feature**: real
  TDD-applicable feature ship for M4 60-day metric. This
  release (F4) is doc-only, so it doesn't produce M4 data
  on its own. The kit needs a `src/**`-touching feature
  with `TDD-Applies: true` tasks for that.
- **Carry forward**: tooling layer that *parses* the
  `## Parent <Type>` chain — explicitly out of scope for
  F4, but the natural next territory. Could land as v0.10.0
  or later.
- **Workflow doc cross-reference** to INDEX § Traceability —
  small polish; bundle into a future doc-tidy ship.
- **`(none — direct task)` example in task template** — same
  bundle.
- **Walkthrough 3 in README** could expand to show the
  `## Parent <Type>` chain when describing each step — small
  enhancement; ship next time README touches.

## Open Questions resolved

All 4 feature-level open questions resolved in the spec
phase (Q1 keep prose alongside structure; Q2 explicit
`(none — engineering-only)`; Q3 `## Parent Plan` required;
Q4 INDEX placement top-level). Two impl-mechanics decisions
resolved during implementation (placement of `## Traceability`
in INDEX — chose between `## Agents` and `## Skills` rather
than between `## Agents` and `## PRDs` since several
non-PRD sections appear in between; final placement
preserves the spirit of "high in the doc, before artifact-
type sections").

## Process notes (dogfood reflections)

- **First fully-delivered multi-feature PRD on this kit.**
  v0.6.0 → v0.9.0 took 4 governance ships across F1/F2/F3/F4,
  each independent enough to merit its own version bump and
  ship cycle. Framework A's promise — "1 PRD slices into N
  features, each shippable independently" — is now real
  rather than theoretical.
- **First review to use `## Parent Spec` structurally.**
  This review body cites the parent spec via the new
  section. The whole chain
  `review → spec → feature → PRD` is now structurally
  walkable from any artifact downstream of v0.9.0.
- **Hook fire #7, clean pass.** Seven consecutive successes
  with zero GATE failures across all runtime-scoped ships
  this session. Preflight discipline is now invisible
  infrastructure — present, useful, no friction.
- **F4 was the second-longest impl run on this kit** after
  F2 (which had 9 runtime paths). F4 had 6 paths, all edits
  to existing files; spec → Commit C took ~20 minutes.
- **Recursive rule application held**: F4's own impl is
  doc-only, so TDD-Applies = false per F3's rule (PRD OOS4).
  No self-test. Pattern is now familiar.
- **M3 (traceability) is no longer "theoretical."** A future
  audit can walk `## Parent <Type>` sections from any
  artifact post-v0.9.0 back to its PRD; the kit's own
  v0.9.0 spec is itself the first such-walkable artifact.

## Verdict

Approved. Ready to merge into `main`, push, tag `v0.9.0`,
and optionally publish to npm.

**Closing milestone**: the v0.6.0 nine-phase-workflow PRD is
now **fully delivered**. M2 metric (multi-feature PRD with no
context duplication) has its first complete data point — the
parent PRD's 4 features each have their own feature doc, each
cites the parent PRD by `## Parent PRD` path, and none
duplicate the PRD's Problem / Target Users / Success Metrics
content.
