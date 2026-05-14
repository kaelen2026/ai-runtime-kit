# PRD: `validate` command

## Status

APPROVED
<!-- APPROVED by kaelen via "1" reply to the post-DRAFT
     options prompt; the 5 default decisions in §Open Questions
     accepted as written. Section content (Problem / Target
     Users / Success Metrics / User Stories / Out of Scope)
     accepted as drafted. -->



<!-- ELICIT NOTE: This PRD was drafted by proposal rather than
     turn-by-turn elicitation, after the user picked C
     ("validate command") from a 3-option menu following v0.9.0
     ship. The Problem / Target Users / Success Metrics / User
     Stories / Out of Scope sections below are claude-proposed.
     Status stays DRAFT until the user reviews and APPROVES; any
     section the user disagrees with edits cleanly. -->

## Problem

v0.9.0 made the audit chain structural — every artifact carries
a `## Parent <Type>` section pointing at its direct upstream
parent. But the kit has **no automated check** that artifacts
actually carry their required sections, or that the cited
parent paths resolve to real files. Drift is silent: a freshly
authored spec missing `## Parent Feature` looks fine until
someone tries to walk the chain manually months later, by
which point the trail is cold.

As the kit accumulates more artifacts (and especially as
external consumers adopt the convention), the surface area for
silent drift grows linearly. The cost of detection without
tooling grows worse than linearly — a broken link in a 50-
artifact tree is 50x harder to find than in a 5-artifact tree.

Concrete evidence is structural rather than reported:

- v0.6.0 spec drift (INDEX placement) wasn't caught until
  impl-time grep.
- v0.7.0 size-ceiling drift wasn't caught until impl
  exceeded budget.
- v0.7.0 → v0.8.0 had two stale Architect references in
  INDEX.md that survived a full ship cycle until v0.8.1
  doc tidy caught them via grep.

These are all "would have been caught by a tree-walker that
parses structure." Building one is overdue.

## Target Users

- **A — Kit consumers about to commit work.** They run
  `validate` as a pre-commit / pre-merge check; want fast
  feedback on "did I forget to add `## Parent Spec` on my new
  task?" before review-time catches it.
- **B — Auditors / future maintainers** (including kaelen
  next year). They land in an unfamiliar `.ai/` tree and want
  a quick "is this tree structurally healthy" verdict, with
  a detailed report when something is off.
- **C — CI / hook authors** (downstream consumers). They want
  a non-zero exit code on broken trees so a pre-merge gate can
  block bad shape. Out of scope to ship the hooks themselves
  in this PRD, but the command must be hook-friendly.

## Success Metrics

- **VM1 — Clean-tree pass.** `validate` exits **0** when run
  against this kit's own `.ai/` tree post-v0.9.0 (which is
  known-clean by construction). Observable at ship time.
- **VM2 — Broken-tree fail.** `validate` exits **non-zero**
  and prints a detailed report listing each broken artifact
  + reason when run against a synthetic broken tree (e.g.
  spec missing `## Parent Feature`, plan citing a non-
  existent spec path). Verified by unit test.
- **VM3 — TDD test-first ordering for this feature's own
  src/ tasks ≥90%.** This PRD's downstream feature(s) touch
  `src/**` (new `src/validate.js` + `bin/cli.js` wiring),
  which makes them **TDD-Applies: true** tasks. Their
  implementation must follow workflow Step 1.5 — failing-
  test commit lands before implementation commit. **This is
  the kit-level M4 metric (from the v0.6.0 PRD) being
  exercised on a real `src/**` feature for the first time.**

## User Stories

- **As a kit consumer** about to commit changes to `.ai/`,
  **I want** to run `npx ai-runtime-kit validate` and see
  either `PASS` or a list of specific structural issues with
  per-artifact reasons, **so that** I catch missing or broken
  `## Parent <Type>` references before review time.
- **As an auditor** landing in an unfamiliar `.ai/` tree,
  **I want** `validate` to report a one-line summary plus
  per-artifact-type counts (e.g. "PRDs: 4 ✓; features: 9 ✓ /
  1 missing parent"), **so that** I can grok tree health in a
  glance before deciding whether to dig deeper.
- **As a CI hook author**, **I want** `validate` to exit
  non-zero on any structural problem and to print
  machine-parseable output on `--json`, **so that** I can wire
  it into a pre-merge gate without parsing prose.

## Out of Scope

- **Validating prose content** of artifacts (e.g., "is your
  PRD's Problem section meaningful?"). Validate is
  structural-only; semantic review remains human work.
- **Auto-fixing** detected issues. No `validate --fix`. If a
  spec is missing `## Parent Feature`, the human author adds
  it; the tool reports, not repairs.
- **Cross-artifact reference validation beyond direct
  parents.** A PRD's `## Downstream Spec` section may list
  candidate features that don't yet exist (intentional — the
  PRD predates the features); this is not a validation
  failure. Validate walks **upstream** (parent direction),
  not downstream.
- **Performance optimization** for huge `.ai/` trees. The
  kit's design assumes O(100) artifacts max per project; if
  a consumer hits scaling issues, it's a future PRD.
- **CI/CD pipeline integration scripts** themselves (Github
  Actions, etc.). The command must be hook-friendly (clear
  exit code + optional JSON), but shipping concrete GitHub
  workflow files is out of scope.
- **Validating runtime/** files (the kit's own canonical
  snapshot). Those are managed by `upgrade`; if `runtime/`
  is malformed, the upgrade should fail, not validate.

## Open Questions

Author-proposed defaults below; user resolves at APPROVE time.

- **Q1 — Output format default.** Human-readable text (with
  optional `--json` flag for machine output) vs. JSON-by-default
  with `--human` flag. **Default: human-readable, with
  `--json` opt-in.** Matches the kit's existing CLI voice
  (init / upgrade are human-output-first).
- **Q2 — Error vs warning distinction.**
  - **Error** (exit non-zero): missing required `## Parent
    <Type>` section; cited parent path doesn't exist on disk.
  - **Warning** (exit 0 but printed): missing optional
    sections (e.g. `## Open Questions` empty on a PRD); status
    field has unexpected value.
  **Default: yes, two levels.** Reviewers will want to
  block on errors but tolerate warnings during in-progress
  work.
- **Q3 — Should `validate` walk `## Status` values?** E.g.
  flag a spec with `## Status: REJECTED` whose downstream
  has artifacts. **Default: yes, as warnings.** Useful for
  catching orphaned downstream work.
- **Q4 — Scope of validation in v1.** Just the 5 artifact
  types touched by the v0.9.0 traceability work (PRD,
  feature, spec, plan, task, review), or also include
  contracts / verifications / ADRs / memory / rules / skills
  / hooks? **Default: just the 6 chain artifacts.** Other
  directories have their own conventions; v1 stays focused.
- **Q5 — Slug for the downstream feature.** This PRD will
  slice into ≥1 features per Q1 (mandatory feature layer).
  Likely one feature only since the v1 scope is tight.
  **Default: single feature `validate-command-v1` or
  similar.** Spec-phase decides exact name.

## Stakeholders

- **Owner**: kaelen
- **Reviewer(s)**: kaelen
- **Consumer(s) of the output**:
  - Downstream feature/spec authors (likely kaelen + this
    agent) — slice the PRD into feature(s), draft spec.
  - AI agents reading the kit during context-loading.
  - Future auditors using the command on this kit's own
    `.ai/` tree (target user B; also the M4 demo audience).

## Downstream Spec

Pending. Per Q1 decision (mandatory feature layer), at least
one feature doc will be authored at:

- `.ai/project/features/2026-05-14-validate-command-v1/feature.md`
  (or similar slug per Q5).

Downstream spec subsequently at
`.ai/project/specs/2026-05-14-<feature-slug>/spec.md`. Tasks
in the spec's plan will carry `## TDD-Applies: true` for any
src/** touches, demonstrating workflow Step 1.5 on a real
behavior-changing feature — first such demonstration on this
kit.
