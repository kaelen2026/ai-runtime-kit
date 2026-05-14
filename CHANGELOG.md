# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the project is on `v0.x`, breaking changes can land at any
minor release; pin to a specific minor in CI if you depend on the
kit.

## [Unreleased]

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
