# ai-runtime-kit

Reusable AI engineering runtime: BOOTSTRAP, workflows, safety, hooks,
and templates for software projects driven by AI agents.

```bash
npx ai-runtime-kit init      # new project
npx ai-runtime-kit upgrade   # existing kit consumer
```

## Status

**v0.10.0** — Adds the **`validate` command** — checks
`.ai/project/` tree structural integrity (every artifact carries
its required `## Parent <Type>` section; every cited parent path
resolves on disk; Status values are valid). Reports errors and
warnings; exits 0 on clean / 1 on errors; `--json` for machine
output. **First `src/**` feature shipped under the v0.6.0+
PRD → Feature → Spec → Plan → Task → TDD → Implement → Verify
→ Review pipeline; first M4 data point — 2/2 TDD pairs at
100% test-first ordering.**

**v0.9.0** — Formalizes the **`## Parent <Type>` traceability
convention** across all artifact templates. Every kit artifact
(spec / plan / task / review) now carries a structural
upward-citation link to its direct parent, assembling the chain
`commit → task → plan → spec → feature → PRD`. New
`## Traceability` section in `runtime/INDEX.md` documents the
convention. F4 of the nine-phase-workflow PRD — **the last
slice**; shipping v0.9.0 completes the kit's first fully-
delivered multi-feature PRD and validates framework A end-to-end.

**v0.8.0** — Wires TDD into the workflow as **Step 1.5**: for
each task with `TDD-Applies: true`, a failing-test commit must
precede the implementation commit. Adds `## TDD-Applies` to
the task template. F3 of the nine-phase-workflow PRD; F4
(traceability) is the last remaining slice. Makes M4 (≥90%
test-first ordering) measurable for the first time.

**v0.7.0** — Completes the 8-phase agent roster. Adds 5 new
role files (`feature-writer`, `spec-writer`, `planner`,
`tdd-writer`, `reviewer`) under `runtime/agents/`. INDEX.md's
"Recommended Agent Flow" rewritten as the full chain:
PRD-Writer → Feature-Writer → Spec-Writer → Planner →
TDD-Writer → Executor → Verifier → Reviewer. F2 of the
nine-phase-workflow PRD; F3 (TDD step in workflow) + F4
(traceability conventions) follow.

**v0.6.0** — Adds the **feature artifact** between PRD and spec
— first slice (F1) of the nine-phase-workflow PRD. New
`runtime/features/_template.md`, new workflow Step 0.5
("Slice into Features," mandatory after Step 0), `init`
scaffolds `.ai/project/features/`. Specs now cite their parent
**feature** in §1 Goal (which cites the PRD); the chain
assembles upward. F2 (agent files), F3 (TDD), F4 (traceability)
follow as parallel features.

**v0.5.1** — Adds the `prd-writer` agent at
`runtime/agents/prd-writer.md`, closing the v0.5.0 gap where
Step 0 (define PRD) had no canonical role file. Parallel to
`executor.md` and `verifier.md`; concept lattice is
**agent = WHO, skill = HOW** (the elicit-then-write procedure
remains in a project-side skill). First end-to-end PRD-then-spec
run on this kit shipped this release.

**v0.5.0** — PRDs become a first-class workflow artifact upstream
of specs. New `runtime/prds/_template.md` (Problem / Target Users
/ Success Metrics / User Stories / Out of Scope / Open Questions
/ Stakeholders); new optional Step 0 in feature-development
workflow; `init` now scaffolds `.ai/project/prds/`. Bug fixes and
engineering-only changes still skip PRDs and go straight to a
spec. Kit still ships zero concrete skills — the `write-a-prd`
skill referenced in this repo's dogfood lives project-side.

**v0.4.1** — `init` now hints when `.ai/runtime/` is gitignored,
so clones won't silently miss the runtime tree. Print is
suppressed when the path is tracked (normal case) and in non-git
directories. Surfaced during dogfood: the kit's own repo
gitignores `.ai/runtime/` because it's a snapshot of `./runtime/`.

**v0.4.0** — `init` now also writes a project-root `CLAUDE.md`
agent entry file pointing Claude Code at
`.ai/runtime/BOOTSTRAP.md`, so the runtime is actually
discoverable on first run. The file is project-owned (never
touched by `upgrade`) and skippable via `--no-agent-entry`.
Surfaced and fixed during dogfood of this repo itself.

**v0.3.0** — kit skeleton, runtime snapshot, `init` + `upgrade`
CLI, documentation, and the two S3-discovered quirks fixed:
`init --migrate` now tolerates an empty-only `.ai/runtime/` left
by `git rm`, and `upgrade --pager <cmd>` pipes the per-file diff
through a pager when stdout is a TTY. ai-workflow-demo migrated
to consume this kit at v0.2.0 (the first dogfood consumer).

The design spec is at:

```text
ai-workflow-demo/.ai/project/specs/2026-05-13-phase-2-ai-runtime-kit-extraction/spec.md
```

The S1–S3 completion records (kit skeleton, init/upgrade impl,
ai-workflow-demo migration) live at
`ai-workflow-demo/.ai/project/reviews/2026-05-1{3,4}-phase-2-s*.md`.

---

## What this is

A package that provides the reusable framework half of an
`.ai/` engineering runtime — the same content that lives under
`.ai/runtime/` in projects that adopt this system. Project-specific
content (concrete rules, skills, hooks, project memory, ADRs, specs,
plans, tasks, reviews) lives in `.ai/project/` and is **not** part
of the kit.

```text
your-project/
├── .ai/
│   ├── runtime/    ← kit-managed (read-only between upgrades)
│   │   ├── BOOTSTRAP.md
│   │   ├── INDEX.md
│   │   ├── KIT_VERSION       (e.g. 0.2.1)
│   │   ├── workflows/
│   │   ├── hooks/
│   │   ├── rules/             ← README + _template (no concrete rules)
│   │   ├── skills/            ← README + _template (no concrete skills)
│   │   └── ...
│   └── project/    ← project-owned
│       ├── rules/             ← your project's concrete rules
│       ├── skills/            ← your project's concrete skills
│       ├── hooks/             ← your project's concrete hooks
│       ├── specs/ plans/ tasks/ reviews/ ...
│       ├── STATE.md
│       └── ...
└── src/ ...
```

Agents loading rules / skills / hooks read from **both** trees;
project-side files take precedence on path collision. The kit ships
zero concrete rules/skills/hooks (apart from the one safety-intrinsic
`pre-executor/runtime-scoped-preflight` hook), so collisions are
impossible in v0.x.

---

## What ships in `runtime/`

- Top-level docs: `BOOTSTRAP.md`, `INDEX.md`, `CAPABILITIES.md`,
  `SAFETY.md`, `PRIORITIES.md`, `RUNTIME_HEALTH.md`,
  `RUNTIME_MODE.md`, `RUNTIME_TRANSITIONS.md`, `RUNTIME_VERSION.md`.
- `workflows/` — feature-development, bug-fix, branching.
- `agents/` — `executor.md` and `verifier.md` role definitions.
  (Architect, planner, reviewer are transition-only concepts
  referenced by workflows and hooks; no file required.)
- `hooks/` — framework hook README + `_template/` + the one generic
  governance hook:
  `pre-executor/runtime-scoped-preflight` (GATE — enforces the
  Runtime Tree Protection rule in `SAFETY.md`).
- `rules/` — framework README + `_template/`. **No concrete rules
  ship**; projects author their own under `.ai/project/rules/`.
- `skills/` — framework README + `_template/`. Same convention.
- Templates: `specs/_template/`, `specs/_template-bug-fix/`,
  `plans/_template.md`, `reviews/_template.md`, `tasks/_template.md`,
  `adr/0000-template.md`.
- `memory/runtime/context-loading.md`,
  `memory/architecture/principles.md`,
  `memory/engineering/principles.md`.
- `tasks/TASK_STATUS.md` (schema only — instance state lives
  project-side).

---

## `init` — initialize a fresh project

```bash
npx ai-runtime-kit init                # in cwd
npx ai-runtime-kit init --cwd /path    # somewhere else
npx ai-runtime-kit init --help
```

Lays down `.ai/runtime/` (from the kit's canonical snapshot) and
`.ai/project/` (a skeleton with empty `specs/`, `plans/`, `tasks/`,
`reviews/`, `verifications/`, `adr/`, `contracts/`, `memory/`,
`rules/`, `skills/`, `hooks/` directories plus `STATE.md` and
`tasks/TASK_STATUS.md` from fill-the-blanks templates). Writes
`.ai/runtime/KIT_VERSION` recording the installed kit version. Also
writes a project-root `CLAUDE.md` (the Claude Code agent entry
point) pointing at `.ai/runtime/BOOTSTRAP.md`; pass
`--no-agent-entry` to skip it.

**Refuses** if `.ai/runtime/`, `.ai/project/`, or `CLAUDE.md`
already exists. Use `--migrate` if you're bootstrapping an existing
project that already has its own `.ai/project/` content or its own
`CLAUDE.md` (this is the path ai-workflow-demo took during S3).
`CLAUDE.md` is project-owned — `upgrade` never touches it.

---

## `upgrade` — update an existing kit consumer

```bash
npx ai-runtime-kit upgrade                       # interactive
npx ai-runtime-kit upgrade --yes                 # skip y/N prompt
npx ai-runtime-kit upgrade --no-diff              # skip per-file diff
npx ai-runtime-kit upgrade --allow-dirty          # skip git porcelain check
npx ai-runtime-kit upgrade --allow-downgrade      # install an older kit
npx ai-runtime-kit upgrade --help
```

Sequence:

1. Verifies `.ai/runtime/KIT_VERSION` exists.
2. Refuses if the installed version is newer than the kit
   (`--allow-downgrade` overrides).
3. If the project is a git repo: `git status --porcelain .ai/runtime/`
   must be empty. (`--allow-dirty` overrides; non-git projects skip
   this check with a warning.)
4. Computes a file-level diff (ADD / REPLACE / DELETE) of the kit's
   canonical snapshot vs your current `.ai/runtime/`.
5. Prints the summary, then a `diff -u` per REPLACEd file (unless
   `--no-diff`).
6. Prompts `Apply this upgrade? (y/N)` — default `N`. (`--yes`
   bypasses.)
7. On yes: `rm -rf .ai/runtime/`, lays down the new snapshot,
   updates KIT_VERSION. Never touches `.ai/project/`. Changes are
   unstaged — review with `git diff .ai/runtime/` and commit when
   ready.

---

## Versioning

- Kit version is stored at `.ai/runtime/KIT_VERSION` (a single-line
  semver string).
- Kit MAJOR is locked to `runtime/RUNTIME_VERSION.md`. v0.x and v1.x
  both adapt to runtime `v1` (current, Frozen). A future runtime
  `v2` would require a kit MAJOR bump.
- v0.x is pre-stable. Breaking changes can occur at any minor.
  Pin to a specific minor in CI if you depend on the kit.
- The upgrade flow refuses downgrades by default (the kit treats
  this as a likely mistake; the `--allow-downgrade` flag exists for
  intentional rollback).

---

## Walkthrough 1 — fresh project from scratch

Assuming you've cloned the kit and `npm link`ed it:

```bash
mkdir my-project && cd my-project
git init -b main
npx ai-runtime-kit init
# .ai/runtime/ and .ai/project/ are now laid down; KIT_VERSION = current
git add -A && git commit -m "chore: init .ai/ runtime + project skeleton"
```

Edit `.ai/project/STATE.md` — replace each `(fill me in)` placeholder
with values specific to your project (mode, health drivers, recovery
goals, current priority focus).

Edit `.ai/project/memory/core/tech-stack.md` (if you put one there)
with your stack details. Initially this file doesn't exist; create
it when you have something to record.

Open `.ai/runtime/BOOTSTRAP.md` and skim it — it's the agent-side
entry point describing the runtime contract.

You're ready to use this with any AI agent that knows how to read
`.ai/runtime/INDEX.md`.

---

## Walkthrough 2 — adding a project-side rule

Project-side rules live at `.ai/project/rules/<language>/<name>.md`
(or `.ai/project/rules/<name>.md` for cross-language rules). The
kit's framework `rules/README.md` and `rules/_template/RULE.md`
describe the format; copy the template:

```bash
mkdir -p .ai/project/rules/typescript
cp .ai/runtime/rules/_template/RULE.md \
   .ai/project/rules/typescript/my-rule.md
```

Edit `.ai/project/rules/typescript/my-rule.md`:

- Set the YAML frontmatter (`name`, `description`, `severity`, etc.)
- Fill in the body sections (the rule, the reason, examples,
  exceptions).

That's it — no registration step required in v0.x. The kit's
canonical loading paths (workflows + context-loading) instruct
agents to scan **both** `.ai/runtime/rules/<lang>/` (kit, empty by
design) and `.ai/project/rules/<lang>/` (your project) at task time.
Your new rule applies automatically whenever the agent touches a
file in its scope.

Same shape for skills (`.ai/project/skills/<stack>/<name>/SKILL.md`)
and hooks (`.ai/project/hooks/<phase>/<name>/HOOK.md`). See the
kit's `skills/README.md` and `hooks/README.md` for the formats.

---

## Walkthrough 3 — full feature lifecycle (v0.8.0+)

For product-driven features, the kit runs an 8-phase pipeline.
Each phase produces a kit-shipped artifact; each artifact cites
its upstream parent. The chain assembles upward:

```txt
commit → task → plan → spec → feature → PRD
```

Quick lifecycle, with the agent roles invoked at each step:

```bash
# Step 0 — author a PRD (prd-writer)
#   .ai/project/prds/YYYY-MM-DD-<slug>/prd.md
#   Problem / Target Users / Success Metrics / User Stories /
#   Out of Scope / Open Questions / Stakeholders

# Step 0.5 — slice the PRD into ≥1 features (feature-writer)
#   .ai/project/features/YYYY-MM-DD-<feature-slug>/feature.md
#   Each cites the parent PRD; maps to PRD success metrics.
#   Mandatory whenever Step 0 ran.

# Step 1 — draft an engineering spec per feature (spec-writer)
#   .ai/project/specs/YYYY-MM-DD-<feature-slug>/spec.md
#   §1 Goal cites the parent feature path.
#   §2 Scope enumerates every touched runtime/** path (preflight).

# Step 1.5 — TDD phase (tdd-writer, per applicable task)
#   For tasks with TDD-Applies: true, commit a failing test
#   before the implementation commit.

# Step 2 — plan, tasks, implementation (planner + executor)
#   .ai/project/plans/...
#   .ai/project/tasks/...   (each task carries TDD-Applies)
#   Implementation lands on a chore/runtime-<slug> branch if
#   the spec touches runtime/**; otherwise a feature branch.

# Step 3 — verify (verifier)
#   Run npm test + manual verification commands from the spec.

# Step 4 — review (reviewer)
#   .ai/project/reviews/YYYY-MM-DD-<slug>.md
#   Maps PRD success metrics to delivered artifacts.

# Then: merge, push, tag, optionally npm publish.
```

For each step, the corresponding kit-shipped agent role file
lives under `.ai/runtime/agents/<role>.md` (PRD-writer,
feature-writer, spec-writer, planner, tdd-writer, executor,
verifier, reviewer). The canonical lifecycle source is
`.ai/runtime/workflows/feature-development.md`.

Engineering-only changes (bug fixes, refactors, doc tidy)
skip Steps 0 and 0.5 and start directly at the spec — see
`.ai/runtime/workflows/bug-fix.md` for the corrective-work
variant.

---

## Local development

```bash
git clone <kit-repo>            # currently local-only
cd ai-runtime-kit
npm link                        # makes `ai-runtime-kit` globally available
npm test                        # 8/8 smoke tests in test/
ai-runtime-kit --help           # verify
ai-runtime-kit --version
```

Layout:

```text
ai-runtime-kit/
├── bin/cli.js          # dispatcher: --help, --version, init, upgrade
├── src/
│   ├── init.js         # init command
│   ├── upgrade.js      # upgrade command
│   ├── snapshot.js     # kit→target copy + file walk
│   ├── git.js          # porcelain dirty check
│   ├── version.js      # KIT_VERSION read/write + semver compare
│   ├── diff.js         # ADD/REPLACE/DELETE classifier + diff -u
│   ├── prompt.js       # readline-based y/N
│   └── templates.js    # STATE.md + project TASK_STATUS.md bodies
├── runtime/            # canonical framework snapshot
└── test/               # node:test smoke tests
```

`npm test` exercises both commands against `mkdtemp`'d fixture
projects.

---

## v0.3.0 quirk fixes

Both v0.2.x quirks discovered during the S3 dogfood are fixed:

- **`init --migrate` now tolerates empty `.ai/runtime/`.** If `git
  rm -r .ai/runtime/` left empty parent directories behind, the
  v0.3.0 `init` detects "exists but contains zero regular files"
  and treats it as absent (cleans up the stale dirs and proceeds).
  Real content under `.ai/runtime/` still triggers the refuse-to-
  overwrite guard.
- **`upgrade --pager <cmd>` pipes per-file diff through a pager.**
  Pass `--pager 'less -R'` (or set the env var
  `AI_RUNTIME_KIT_PAGER`) and the per-file `diff -u` output is
  spawned through the pager. Only applied when stdout is a TTY
  (CI / scripted use keeps the direct-write behavior).

---

## License

MIT — see `LICENSE`.
