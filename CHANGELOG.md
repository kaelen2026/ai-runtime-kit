# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the project is on `v0.x`, breaking changes can land at any
minor release; pin to a specific minor in CI if you depend on the
kit.

## [Unreleased]

## [0.8.0] - 2026-05-14

Third feature shipped under the v0.6.0 PRD → Feature → Spec
pipeline. F3 of the nine-phase-workflow PRD; F4 (traceability
conventions) is the last remaining slice.

### Added
- **Workflow Step 1.5: TDD Phase (per task, when applicable)**
  in `runtime/workflows/feature-development.md`. Wires up
  `tdd-writer.md` (shipped in v0.7.0) into the workflow. For
  any task with `TDD-Applies: true`, a failing-test commit
  must land before the implementation commit. Per-task
  semantics: N TDD-applicable tasks fire Step 1.5 N times,
  interleaved with implementation.
- **`## TDD-Applies` section** in `runtime/tasks/_template.md`'s
  trailing metadata cluster. Default `false`; allowed values
  `true | false`. Inline guidance documents the
  behavior-changing boundary rule (behavior-changing → true;
  doc / refactor-no-behavior / config-only → false; matches
  parent PRD OOS4).

### Changed
- Step 2 (Execute with Claude Code) body amended with a note
  acknowledging Step 1.5 as a per-task prerequisite. Step 2's
  scope unchanged otherwise.

### Process
- Fifth real-world fire of `pre-executor/runtime-scoped-preflight`
  hook; clean pass on first attempt (2 runtime paths in spec §2).
- **First feature whose own implementation was traced through
  its own rule before impl began.** F3 defines TDD-Applies for
  tasks; F3's own impl is doc-only (workflow text + template
  field) per PRD OOS4, so the rule applied to F3 returns
  `TDD-Applies: false`. Recursion handled cleanly; trace
  recorded in F3 spec §Open Questions Q3.
- F3 ships with **no new tests** — spec confirmed existing init
  test's template-presence assertion already covers
  `runtime/tasks/_template.md`. Modest tarball-size delta
  (~400 bytes).
- M4 (test-first commit ordering ≥90%, 60d) becomes
  measurable post-v0.8.0. Before F3, the workflow had no step
  to comply with; from now on, future tasks with
  `TDD-Applies: true` can be audited against the rule.

## [0.7.0] - 2026-05-14

Second feature shipped under the v0.6.0 PRD → Feature → Spec
pipeline. F2 of the nine-phase-workflow PRD; F1 was v0.6.0
(feature artifact layer). F3 (TDD step) and F4 (traceability)
follow.

### Added
- **`runtime/agents/feature-writer.md`** — role for Step 0.5
  (slicing PRD into features).
- **`runtime/agents/spec-writer.md`** — role for Step 1
  (drafting spec from APPROVED feature).
- **`runtime/agents/planner.md`** — role for plan + task
  authoring (the "task" phase consumes tasks downstream;
  no separate task-creator file ships).
- **`runtime/agents/tdd-writer.md`** — role for the
  failing-test phase. Workflow wire-up arrives with F3.
- **`runtime/agents/reviewer.md`** — role for post-impl
  review authoring.

### Changed
- `runtime/INDEX.md` § Agents restructured: 8 role files
  enumerated (3 existing + 5 new); "Recommended Agent Flow"
  rewritten as 8-phase chain PRD-Writer → Feature-Writer →
  Spec-Writer → Planner → TDD-Writer → Executor → Verifier →
  Reviewer; "transition-only concepts" prose retired —
  replaced with explicit notes on task (no file) and architect
  (renamed to spec-writer).
- `runtime/agents/executor.md` — gains `## Reference` section
  with prev/next pointers (tdd-writer → executor → verifier).
- `runtime/agents/verifier.md` — gains `## Reference` section
  (executor → verifier → reviewer).
- `runtime/agents/prd-writer.md` — `## Reference` now includes
  a downstream pointer to feature-writer.

### Process
- Spec amended mid-implementation: agent-file size ceiling
  revised 1500 → 1700 bytes (5 files landed 1509–1681). Same
  drift pattern as v0.5.1's prd-writer.md (1200 → 1500). Spec
  budgets remain hard to estimate pre-content.
- Fourth real-world fire of `pre-executor/runtime-scoped-preflight`
  hook; clean pass on first attempt (9 runtime paths enumerated).
- F2's spec author (claude) resolved all 4 feature-level open
  questions during spec drafting — first time on this kit
  that the spec phase converged feature-level decisions
  without escalating to user.

## [0.6.0] - 2026-05-14

First feature shipped under the new **PRD → Feature → Spec**
pipeline (the parent PRD itself slices into F1–F4; this release
delivers F1, the keystone).

### Added
- **`runtime/features/_template.md`** — canonical feature
  template, new top-level runtime artifact between PRDs and
  specs. Sections: Status / Parent PRD / Goal / PRD Metrics
  Contributed / Scope / Acceptance / Open Questions /
  Downstream Spec. Lifecycle: DRAFT → APPROVED → REJECTED →
  SUPERSEDED, mirroring PRDs and specs.
- **Workflow Step 0.5** in
  `runtime/workflows/feature-development.md` — "Slice into
  Features." Mandatory whenever Step 0 (PRD) ran; same skip
  criteria as Step 0. One PRD → ≥1 feature docs. Single-feature
  PRDs still produce one feature doc with full template
  structure (no stub allowance).
- `init` scaffolds `.ai/project/features/` as part of the
  standard project skeleton.
- `runtime/INDEX.md` gains a `## Features` section positioned
  between `## PRDs` and `## Specs`.

### Changed
- **Spec citation rule.** Specs whose work derives from a PRD
  now cite their parent **feature** in §1 Goal (which in turn
  cites the PRD), instead of citing the PRD directly. The chain
  assembles upward: spec → feature → PRD. Existing v0.5.x specs
  are not retrofitted (per PRD OOS1).

### Process
- First multi-feature PRD authored on this kit
  (`2026-05-14-nine-phase-workflow`). This release delivers
  feature **F1 (feature artifact layer)**; F2 (agent files),
  F3 (TDD phase), and F4 (traceability conventions) follow as
  parallel features.
- Third real-world fire of `pre-executor/runtime-scoped-preflight`
  hook — all preconditions PASS on first attempt.
- First time the kit's own dogfood feature doc was migrated to
  match a template it created in the same release (canonical
  bootstrap, BOOTSTRAP NOTE comment retained as the visible
  scar).

## [0.5.1] - 2026-05-14

### Added
- **`runtime/agents/prd-writer.md`** — new kit-shipped agent role
  for PRD authoring at workflow Step 0. Parallel to `executor.md`
  and `verifier.md`; closes the agent-vocabulary gap where v0.5.0's
  Step 0 demanded an upstream document producer with no canonical
  role file. Sections: Role / Responsibilities / Inputs / Outputs
  / Must Not / Reference. Concept lattice: agent = WHO,
  skill = HOW (the procedural 11-step depth stays in this repo's
  project-side `write-a-prd` skill, referenced from the agent file).

### Changed
- `runtime/INDEX.md` — adds `prd-writer` to the role-files list
  and clarifies it as a **pre-pipeline role** (Step 0), not part
  of the Architect → Planner → Executor → Verifier → Reviewer
  transition phases.
- `runtime/workflows/feature-development.md` Step 0 — now points
  agents at `runtime/agents/prd-writer.md` alongside the existing
  template pointer.
- Package tarball now includes `CHANGELOG.md` (added to the
  `files` allowlist in v0.5.0's [Unreleased]; first release where
  this takes effect is v0.5.1).

### Process
- First PRD-then-spec end-to-end run on this kit. PRD authored
  conversationally via the project-side `write-a-prd` skill,
  10 user turns from "start" to file written (M2 budget exact).
- Second real-world fire of the
  `pre-executor/runtime-scoped-preflight` hook — all three
  preconditions passed on first attempt (branch created
  proactively, scope enumerated, spec home in place).

## [0.5.0] - 2026-05-14

First npm release. `npm view ai-runtime-kit` returned 404 prior
to this version; earlier `v0.x` versions existed only as
`package.json` bumps and git history.

### Added
- **PRDs as a first-class workflow artifact.** New
  `runtime/prds/_template.md` template covering Problem, Target
  Users, Success Metrics, User Stories, Out of Scope, Open
  Questions, Stakeholders, and Downstream Spec. PRDs follow the
  same `DRAFT → APPROVED → REJECTED → SUPERSEDED` lifecycle as
  specs.
- New optional **Step 0** in
  `runtime/workflows/feature-development.md` — when to draft a
  PRD (product-driven features) and when to skip (bug fixes,
  engineering-only changes). Downstream specs must cite their
  PRD path in §1 Goal when one exists.
- `init` scaffolds `.ai/project/prds/` as part of the standard
  project skeleton.
- `runtime/INDEX.md` reorganized — new `## PRDs` section
  precedes `## Specs` to reflect workflow chronology (PRD →
  Spec → Plan → Tasks → Review).

### Dogfood
- Project-side `write-a-prd` skill at
  `.ai/project/skills/product/write-a-prd/SKILL.md` (this repo
  only; kit still ships zero concrete skills per the `v0.x`
  promise). Consumers who want the same trigger can copy the
  file into their own `.ai/project/skills/` tree.

### Process
- First runtime-scoped change shipped under the kit's own
  governance rules. The `pre-executor/runtime-scoped-preflight`
  hook fired on a real GATE event (initial attempt was on
  `main`), and the remediation flow (create
  `chore/runtime-prd-template`, re-attempt) worked end-to-end.

## [0.4.1] - 2026-05-14

### Added
- `init` now hints when `.ai/runtime/` is gitignored: clones
  won't silently miss the runtime tree if the path is ignored
  by the consumer's repo.
- New helper `isPathGitignored` in `src/git.js` (wraps `git
  check-ignore`).

### Notes
- Hint is silent when `.ai/runtime/` is tracked (normal kit-
  consumer case) and in non-git directories. Only fires when
  the path is definitively ignored.

## [0.4.0] - 2026-05-14

### Added
- **`init` now scaffolds a project-root `CLAUDE.md`** — agent
  entry point for Claude Code pointing at
  `.ai/runtime/BOOTSTRAP.md`. Without this file the runtime
  tree existed on disk but no agent knew to read it.
- `CLAUDE.md` is project-owned: `upgrade` never touches it.
- New flag `--no-agent-entry` to skip the file's generation
  entirely.
- `init --migrate` tolerates a pre-existing `CLAUDE.md`
  (skip-write).
- `init` refuses to overwrite an existing `CLAUDE.md` (same
  posture as the existing `.ai/runtime/` / `.ai/project/`
  guards).

### Process
- First feature surfaced and fixed via dogfood of this repo
  against the kit itself.

## [0.3.0] - 2026-05-14

### Fixed
- `init --migrate` tolerates an empty-only `.ai/runtime/` left
  by `git rm` — detects "exists but contains zero regular
  files" and treats as absent. Real content under
  `.ai/runtime/` still triggers the refuse-to-overwrite guard.
- `upgrade --pager <cmd>` pipes the per-file `diff -u` through
  a pager when stdout is a TTY. Also configurable via the
  `AI_RUNTIME_KIT_PAGER` environment variable. CI / scripted
  use keeps the direct-write behavior.

### Process
- Both quirks surfaced during S3 dogfood by ai-workflow-demo
  (first external consumer).

## [0.2.1] - 2026-05-14

### Changed
- Comprehensive README — install, `init`, `upgrade`, versioning,
  walkthroughs for new projects and adding project-side rules.

## [0.2.0] - 2026-05-14

### Added
- **Dual-tree loading.** Agents now load rules / skills / hooks
  from **both** `.ai/runtime/` (kit, framework-shipped) and
  `.ai/project/` (project-shipped). Project-side files take
  precedence on path collision. The kit ships zero concrete
  rules/skills/hooks (apart from the safety-intrinsic
  `pre-executor/runtime-scoped-preflight` hook), so collisions
  are impossible in v0.x.

### Process
- ai-workflow-demo migrated to consume this kit at v0.2.0 (the
  first dogfood consumer).

---

## Conventions

- **Versioning**: `MAJOR.MINOR.PATCH`. Kit MAJOR is locked to
  `runtime/RUNTIME_VERSION.md`; a future runtime v2 would require
  a kit MAJOR bump.
- **Pre-stable**: `v0.x` allows breaking changes at any minor.
  Pin if you depend on it.
- **Downgrade**: `upgrade` refuses by default;
  `--allow-downgrade` is explicit-only for intentional rollback.
- **Tags**: only `v0.3.0` is currently tagged in git. Earlier
  and later versions are reachable via the commit history but
  not labeled. Tagging older versions retroactively is a
  follow-up.
