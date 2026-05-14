# Review: PRD template + write-a-prd dogfood skill (v0.5.0)

Spec: `.ai/project/specs/2026-05-14-prd-template-and-skill/spec.md`
Branch: `chore/runtime-prd-template`
Commits: `f4d2da7` (runtime), `81796dc` (kit code + v0.5.0),
`8b6c1c0` (dogfood skill).


## Parent Spec

`.ai/project/specs/2026-05-14-prd-template-and-skill/spec.md`

## Summary

Promoted PRDs to a first-class workflow artifact upstream of
specs. New `runtime/prds/_template.md` covers Problem / Target
Users / Success Metrics / User Stories / Out of Scope / Open
Questions / Stakeholders / Downstream Spec. New optional Step 0
in `runtime/workflows/feature-development.md` formalizes when to
write a PRD and when to skip. `init` scaffolds
`.ai/project/prds/` as part of the standard skeleton; existing
v0.4.x consumers will see this as a clean ADD via `upgrade`.

The `write-a-prd` skill lives at
`.ai/project/skills/product/write-a-prd/SKILL.md` for this repo's
own dogfood — kit still ships zero concrete skills per the v0.x
promise.

## Verification

- `npm test` → **18/18 pass** (no test count delta vs v0.4.1;
  init test extended in-place to cover the new `prds/` dir +
  runtime PRD template).
- `node bin/cli.js upgrade --yes --no-diff` from a v0.4.1
  fixture → reports `1 ADD (prds/_template.md) + 2 REPLACEs
  (INDEX.md, feature-development.md)` with no special-case
  logic. Confirms existing diff machinery handles new top-level
  runtime dirs cleanly.
- Local snapshot refreshed to v0.5.0; `.ai/runtime/prds/_template.md`
  exists in the dogfood tree.

Runtime-scoped preflight (HOOK pre-executor/runtime-scoped-preflight):
  - Scope contract: PASS — listed paths: `runtime/prds/_template.md`,
    `runtime/INDEX.md`, `runtime/workflows/feature-development.md`.
  - Branch name: PASS — `chore/runtime-prd-template`.
  - Spec home: PASS — `.ai/project/specs/2026-05-14-prd-template-and-skill/spec.md`.

Hook self-enforcement notes:
  - The Executor caught the GATE failure on first attempt
    (was on `main`), reported it before any edit, and remediated
    by creating the governance branch before proceeding. This is
    the hook's first real-world fire in this repo — it worked
    exactly as specified in
    `runtime/hooks/pre-executor/runtime-scoped-preflight/HOOK.md`.
  - `branching.md § Governance Rule Branches` also constrained
    commit structure: runtime/ change and kit code change were
    split into separate commits even though both serve the same
    feature.

## Acceptance Criteria

- [x] `runtime/prds/_template.md` exists with all 7 required
      sections (Problem, Target Users, Success Metrics, User
      Stories, Out of Scope, Open Questions, Stakeholders) +
      Status + Downstream Spec.
- [x] `runtime/INDEX.md` has `## PRDs` section. **Placement
      drift from spec text**: spec literally said "between Specs
      upstream and Plans downstream" (i.e. after Specs), but
      workflow chronology made BEFORE Specs the correct
      placement (PRD → Spec → Plan). Documented under
      Non-blocking Issues.
- [x] `runtime/workflows/feature-development.md` has new Step 0
      with explicit "skip when" criteria and PRD-citation
      requirement on downstream specs.
- [x] Fresh `init` creates `.ai/project/prds/` empty dir.
      Covered by extended init.test.js case.
- [x] `upgrade` v0.4.1 → v0.5.0 reports new files as ADDs.
      Confirmed manually against this repo's own snapshot.
- [x] `.ai/project/skills/product/write-a-prd/SKILL.md` exists,
      follows `runtime/skills/_template/SKILL.md` format
      (frontmatter + 目标 + 输入/输出 + 工作方式 + 推荐输出结构
      + 约束 + 完成标准).
- [x] All existing tests pass (18/18).

## Blocking Issues

None.

## Non-blocking Issues

- **Spec drift on INDEX.md placement.** The spec body said "add
  `## PRDs` section between `## Specs` upstream and `## Plans`
  downstream" — literal reading places PRDs AFTER Specs, but
  workflow chronology (PRD → Spec) demanded BEFORE Specs.
  Implementation chose BEFORE; spec text was ambiguous-not-wrong.
  Fix forward: update the spec text in a follow-up to match
  reality, or leave as a lesson in "spec wording precision."
- **No migration helper for v0.4.x consumers' `.ai/project/`.**
  Existing consumers will get `runtime/prds/_template.md` via
  `upgrade`, but their `.ai/project/prds/` dir won't be auto-
  created by `upgrade` (upgrade never touches project tree).
  They'll need to `mkdir .ai/project/prds` by hand. Documented
  under spec § Excludes; if it becomes a friction point in
  consumer dogfood, add an `upgrade --ensure-project-dirs` flag.
- **No CHANGELOG.** This kit doesn't maintain one yet. Three
  consecutive releases (v0.4.0, v0.4.1, v0.5.0) have happened
  without one. README "Status" section is doing CHANGELOG duty
  but won't scale.
- **`write-a-prd` skill is single-agent.** Only readable by
  agents that consume `.ai/project/skills/**` per the kit's
  loading convention. Cross-tool integration (Claude Code
  slash command, Cursor skill, etc.) is deferred.

## Suggested Fixes

- **Tiny spec patch** — clarify the INDEX.md placement language
  in the spec (s/"between Specs upstream and Plans downstream"/
  "immediately before Specs, since PRDs precede specs in
  workflow order"/). Self-contained, ~3 lines, no governance
  weight.
- **Follow-up spec — CHANGELOG.md.** Establish a CHANGELOG
  convention now while only 3 releases need backfilling. Use
  Keep-a-Changelog format. Project-side (CHANGELOG.md at repo
  root), not runtime. Maintenance becomes part of the ship
  workflow.
- **Follow-up spec — runtime PRD lifecycle assertions.** Add a
  small structural check (script or test) that runtime PRDs in
  `runtime/prds/` (template) have valid `Status` values and that
  project PRDs reference a `Downstream Spec` path or `(pending)`.
  Cheap to write, catches drift.
- **Polish — README walkthrough.** Walkthrough 2 currently
  shows adding a project-side rule. Add a Walkthrough 3 for
  authoring the first PRD with the template (use this review's
  same vocabulary).

## Open Questions resolved

The spec listed 4 Open Questions; resolutions:

1. **Lifecycle states for PRDs** — confirmed YES. Template
   ships with the 4-state lifecycle (DRAFT/APPROVED/REJECTED/
   SUPERSEDED) matching specs.
2. **Upgrade callout for new dir** — not needed. The diff
   reported the ADD cleanly; consumers reading the upgrade
   preview will see it.
3. **Version bump** — confirmed MINOR. v0.5.0 reflects the new
   top-level runtime artifact and workflow expansion.
4. **Stub `runtime/skills/product/` dir** — NO. Empty dirs
   aren't tracked by git; the consumer's
   `.ai/project/skills/` is the right place to mirror the
   structure when needed.

## Process notes (dogfood reflections)

- This is the first runtime-scoped change shipped under the
  kit's own rules. The `pre-executor/runtime-scoped-preflight`
  hook caught a real GATE failure (wrong branch on first
  attempt) and the remediation flow (create governance branch,
  re-attempt) worked end-to-end.
- The "never combined with feature code in the same commit"
  rule from `branching.md § Governance Rule Branches` forced
  the 3-commit split (runtime / kit code / dogfood skill).
  This adds friction but produces a cleaner audit trail —
  worth it for runtime changes; would be too heavy for daily
  feature work, which is consistent with the rule's
  applicability scope (runtime-only).
- Two `runtime/` files were touched (INDEX.md,
  feature-development.md) for a doc-only governance change.
  No code execution path changed; no rollback risk beyond
  reverting the commit.

## Verdict

Approved. Ready to merge into `main` after the spec text patch
(suggested fix #1) if you want a clean record, or merge as-is
and patch in a follow-up.
