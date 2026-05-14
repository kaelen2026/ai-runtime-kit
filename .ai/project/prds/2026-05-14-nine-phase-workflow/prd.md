# PRD: Nine-Phase Workflow with Feature Slicing + TDD

## Status

APPROVED

## Problem

The current kit workflow (post-v0.5.1) has PRDs, specs, plans,
tasks, executor implementation, verifier checks, and reviews —
but it has **four observable gaps** that this PRD addresses
together:

- **P1 — Missing feature layer.** A PRD like "user authentication"
  realistically covers multiple discrete capabilities
  (login / signup / forgot-password / SSO). Today the choice is
  either a giant spec (hard to scope, review, or roll back per
  capability) or multiple PRDs that re-state Problem / Target
  Users / Success Metrics for each capability. There is no
  intermediate **feature** artifact that slices one PRD into N
  scoped capabilities, each then driving its own spec.

- **P2 — TDD is not an explicit workflow step.** Today task
  templates list "tests" as a bullet, but the workflow has no
  required ordering of test-first → implement → verify. A task
  can ship code without a corresponding test commit preceding it.

- **P3 — Audit chain is broken.** Given a recent commit, walking
  back to "which PRD success metric did this satisfy" requires
  manual archaeology. Tasks don't carry references to their
  parent plan; plans don't carry references to their parent
  feature; features don't exist as artifacts; reviews look at
  specs in isolation. No documented link conventions span the
  PRD → feature → spec → plan → task → commit chain.

- **P4 — Declared agent roster ≠ shipped reality.** Workflow docs
  and `INDEX.md` describe a 5-phase pipeline
  (Architect → Planner → Executor → Verifier → Reviewer) but the
  kit only ships 3 agent files (executor, verifier, plus
  prd-writer added in v0.5.1). Three phases are labeled
  "transition concepts" with no role-definition file. Operators
  reading the workflow see "be the Planner now" without a
  Planner.md to step into.

Evidence is structural and observed during dogfood, not external
user complaints — this kit has one external consumer
(ai-workflow-demo) and self-dogfood. The gaps showed up
explicitly when authoring three back-to-back features
(v0.5.0/v0.5.1) using the kit on itself.

## Target Users

- **A — Kit users authoring and shipping features.** PM /
  founder / engineer using the kit on a real project. Pain
  point: needs to ship a multi-faceted product change, current
  workflow forces them to either oversize a spec or
  copy-paste PRD context across multiple narrow PRDs. Felt
  during Step 0 → Step 1 transition every time a PRD is bigger
  than one obvious spec.
- **D — Future reviewers / auditors of this kit (or any kit
  consumer's project).** Includes the original author (kaelen,
  next year), collaborators, or anyone reviewing whether
  shipped work matches stated PRD intent. Pain point: today
  cannot answer "did we deliver M2 from PRD 2026-05-14-X?"
  without manually opening every commit and review file and
  re-deriving the link. Felt at every retrospective or
  third-party code review.

## Success Metrics

- **M1 — Agent roster consistency (structural, ship-time).** The
  workflow names exactly N phases and `runtime/agents/` ships
  exactly N role files (or explicitly marks phases as
  transition-concept-only with the rationale). Target: 100%
  match. Checkable at the ship commit with no usage window.
- **M2 — Multi-feature PRD slicing (usage, 60-day).** Within 60
  days of ship, **≥1 multi-feature PRD** is authored in this
  repo and demonstrates zero PRD-level context duplication
  (Problem / Target Users / Success Metrics appear only in the
  PRD, not in the derived feature docs; features reference
  upward by path). Spot-check the PRD + its features manually.
- **M3 — Traceability chain (usage, 60-day).** Pick **3 random
  recent tasks** completed under the new workflow. Each task
  must be traceable through documented references to its plan,
  feature, PRD, and at least one PRD success metric, without
  manual archaeology. Target: 3/3.
- **M4 — Test-first ordering (usage, 60-day).** Among completed
  tasks where TDD applies (excluding doc-only, refactor-only,
  config-only — see OOS4), **≥90% have a test commit whose
  timestamp precedes the corresponding implementation commit**.
  Measured by parsing `git log` for each task's SHA range.

## User Stories

- **S1 (A — slicing).** As a kit user authoring a multi-faceted
  feature, I want to write one PRD that covers strategic intent,
  then slice it into N discrete features each with their own
  spec, so that I don't have to either write a giant
  unsplittable spec or duplicate PRD-level context across
  multiple PRDs.
- **S2 (A — TDD).** As a kit user implementing a task, I want
  the workflow to require a failing-test commit before the
  implementation commit, so that I can't accidentally ship code
  without test-first coverage.
- **S3 (D — traceability).** As a future auditor of this kit's
  shipped work, I want to pick any commit and walk a documented
  chain to its task → feature → PRD → success metric, so that I
  can verify "did we actually deliver what we said" without
  manual archaeology.
- **S4 (A — agent roster).** As a kit user reading the workflow
  doc, I want every named phase in the pipeline to have a
  corresponding agent file (or be explicitly marked as a
  transition concept with a rationale), so that I'm never
  confused about which role I'm currently in.

## Out of Scope

- **OOS1 — Retrofitting v0.5.x history to the new model.** The
  kit's existing v0.4.x and v0.5.x PRDs / specs / reviews stay
  as authored. They won't be backfilled with feature docs or
  re-linked into the new traceability chain. Audit of historical
  work continues to rely on commit + review context. Forward
  work follows the new pipeline.
- **OOS2 — Automated enforcement tooling.** No CI checks that
  validate "feature doc exists for this commit," no scripts
  that parse test-first ordering, no static checker for
  traceability link resolution. This release defines the
  *workflow* and *templates*. Tooling that mechanizes the
  discipline is a separate future PRD.
- **OOS3 — Auto-generation of feature docs from a PRD.** "Given
  a PRD, generate N feature docs automatically" is **not** in
  scope. Slicing decisions are human-authored — they require
  product sense the kit shouldn't try to encode in code.
- **OOS4 — Universal TDD application.** TDD applies only to
  **behavior-changing** tasks (code that adds or modifies
  runtime behavior). Tasks that are purely:
  - documentation updates (README, CHANGELOG, ADR, docs/),
  - refactors with no observable behavior change,
  - configuration / packaging / metadata changes (package.json
    fields, .gitignore, tooling configs),

  do **not** require test-first ordering. The downstream spec
  must define the boundary precisely (likely path-pattern-based
  or task-frontmatter-flag-based).

## Open Questions

PRD-elicit-phase questions all resolved during conversation;
recorded here for traceability. Spec-phase questions are listed
with **(deferred to spec)** marker so the spec author has a
clear backlog.

**Resolved during elicit:**

- **Q1 — Feature layer mandatory or optional?**
  **Decision: (a) MANDATORY.** Every PRD authored under the new
  workflow must produce **≥1 feature** doc, even when only one
  feature obviously satisfies the PRD. Justification: M3
  (traceability) requires the chain link to exist for every
  task; allowing an "implicit / unwritten" feature layer
  creates a hole. Cost: a one-feature PRD pays the tax of one
  short feature doc. Benefit: chain is uniform and audit-ready.
  Decided by: kaelen (during PRD elicit, 2026-05-14).

- **Q2 — Agent files: all 9 phases or subset?**
  **Decision: (a) ALL.** The kit ships role-definition files
  for every phase in the workflow (or, if a phase genuinely
  has no role-distinct work like "task" which may be an
  artifact rather than a role, the spec resolves whether it
  gets a file or an explicit "concept-only" note). Net result:
  M1's 100% match is achievable. Existing files (prd-writer,
  executor, verifier) stay; new files (feature-writer,
  spec-writer / architect, planner, tdd-writer, reviewer)
  ship. Decided by: kaelen.

**Deferred to spec (not PRD-blocking):**

- Naming alignment — `executor.md` vs. `implementer.md`. User's
  workflow says "implement"; existing file is "executor". Spec
  decides whether to rename, alias, or stop calling the phase
  "implement" in the workflow.
- Whether the "task" phase has a dedicated agent file
  (`task-creator`?) or is folded into `planner.md`'s
  responsibilities. Affects M1 count (8 vs 9 files).
- Concrete file paths and templates: where does the feature
  artifact live? `.ai/project/features/`? `.ai/project/specs/`
  with a `_feature/` prefix? Spec settles directory layout.
- How traceability links are encoded — YAML frontmatter fields?
  Inline markdown links? Both? Affects whether tooling can
  later parse the chain (OOS2 future PRD).
- Spec → "tech-spec" rename, or keep "spec." Affects every
  existing reference; large doc impact if renamed. Spec author
  decides based on disambiguation need.
- Whether the existing 3 `.ai/runtime/agents/` files
  (executor, verifier, prd-writer) need content updates to
  cross-reference the new neighbor roles, or stay as-is.

## Stakeholders

- **Owner**: kaelen
- **Reviewer(s)**: kaelen
- **Consumer(s) of the output**:
  - downstream spec author (currently kaelen) — slices this PRD
    into ≥1 feature doc, then writes a spec per feature
  - AI agents reading the kit during context-loading — read the
    updated workflow + new agent files when assigned PRD /
    feature / spec / TDD / verify / review work
  - future auditors of this kit's shipped output (target user
    group D) — read this PRD's success metrics and walk the
    audit chain to verify delivery

## Downstream Spec

This PRD is multi-feature per its **Decision Q1 (mandatory
feature layer)**. The downstream artifacts are therefore:

1. ≥1 feature doc per problem-aligned slice. Candidate slices
   (spec author refines):
   - **Feature F1**: Add `feature` artifact (template + dir +
     workflow Step 1.5 between PRD and spec). Addresses P1
     primarily, P3 partially. Powers M1 (partial), M2.
   - **Feature F2**: Add agent files for the remaining phases
     (feature-writer, spec-writer / architect, planner,
     tdd-writer, reviewer). Addresses P4. Powers M1.
   - **Feature F3**: Add TDD phase between task and implement
     (workflow step, task-frontmatter rules for "applies",
     tdd-writer agent if not in F2). Addresses P2. Powers M4.
   - **Feature F4**: Add traceability link conventions across
     all artifacts (frontmatter or markdown links from
     task → plan → feature → PRD). Addresses P3. Powers M3.

`.ai/project/features/2026-05-14-<slug>/feature.md` (pending —
template doesn't exist yet; F1 creates it).

`.ai/project/specs/2026-05-14-<slug>/spec.md` (pending per
feature).
