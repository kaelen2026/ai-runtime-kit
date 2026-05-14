# AI Runtime Index

## Purpose

This file is the entry point for the local AI engineering workflow system.

AI agents should use this file to understand:

- project structure
- workflow structure
- governance rules
- artifact locations

---

## Workflow Overview

The kit ships a 9-step pipeline for product-driven features
(engineering-only changes skip Steps 0 and 0.5). Each step
has a kit-shipped role-definition file under
`.ai/runtime/agents/` and produces a structurally-linked
artifact in `.ai/project/`.

### Pipeline

```txt
Step 0    PRD          (optional · product-driven only)
   ↓
Step 0.5  Feature      (mandatory if Step 0 ran; N features per PRD)
   ↓
Step 1    Spec         (1 per feature; engineering details)
   ↓
Step 1.5  TDD          (per task with TDD-Applies: true)
   ↓
Step 2    Execute      (plan + task + implementation umbrella)
   ↓
Step 3    Verify
   ↓
Step 4    Review
   ↓
Steps 5+6 Fix + Commit
```

### Agents and artifacts per phase

| Step | Agent (role file) | Artifact (project path) |
|---|---|---|
| 0     | `prd-writer`     | `.ai/project/prds/<slug>/prd.md` |
| 0.5   | `feature-writer` | `.ai/project/features/<slug>/feature.md` |
| 1     | `spec-writer`    | `.ai/project/specs/<slug>/spec.md` |
| 2-plan| `planner`        | `.ai/project/plans/<slug>/plan.md` |
| 2-task| `planner`        | `.ai/project/tasks/<slug>/...` |
| 1.5   | `tdd-writer`     | failing-test git commit |
| 2-impl| `executor`       | implementation git commit |
| 3     | `verifier`       | (verification report, usually inline) |
| 4     | `reviewer`       | `.ai/project/reviews/<slug>.md` |

Notes: `task` is a transition concept consumed by the next
role, not a separate authoring role; `architect` is replaced
by `spec-writer` (see § Agents below).

### Traceability chain

Every artifact carries a structural upward-citation link in a
`## Parent <Type>` section:

```txt
commit → task → plan → spec → feature → PRD
```

For per-artifact required sections and the
`(none — <reason>)` rendering convention for skipped paths,
see § Traceability.

### Governance boundary

Which changes require what depends on which paths they touch:

| Touched paths | Branch convention | Preflight hook | Spec required |
|---|---|---|---|
| `runtime/**` | `chore/runtime-<topic>` | **GATE** fires (3 preconditions) | yes, §2 Scope enumerates each path |
| `src/`, `test/`, `bin/` (kit code) | `feat/<topic>` / `fix/<topic>` | does not fire | yes (or simple feature workflow) |
| `.ai/project/**` (project tree) | any | does not fire | depends on complexity |
| `README` / `CHANGELOG` / `package.json` | any | does not fire | typically bundled with ship metadata |

Per `branching.md § Governance Rule Branches`, runtime/
governance changes MUST NOT be combined with feature code in
the same commit — split into separate commits even on the
same branch.

### Where to read more

- § Agents — the 8 role files and what each does.
- § Traceability — the `## Parent <Type>` rules per artifact.
- § Workflows — the canonical
  `.ai/runtime/workflows/feature-development.md` step-by-step
  (this Overview is a synthesis; the workflow doc is the
  source of truth for the steps).
- § Recommended Agent Flow — the same 8 roles listed as a
  pipeline (separate from this Overview for readers arriving
  at INDEX.md from a different entry point).
- § Hooks — the `pre-executor/runtime-scoped-preflight` GATE
  and other agent-transition hooks.

---

## Agents

Location:

```txt
.ai/runtime/agents/
```

Role files in this location:

- prd-writer
- feature-writer
- spec-writer
- planner
- tdd-writer
- executor
- verifier
- reviewer

The runtime framework defines an 8-phase agent pipeline that
covers the full feature-development workflow. Every phase has
a corresponding role-definition file under
`.ai/runtime/agents/`. Recommended Agent Flow:

```txt
PRD-Writer
  → Feature-Writer
  → Spec-Writer
  → Planner
  → TDD-Writer (for TDD-applicable tasks)
  → Executor
  → Verifier
  → Reviewer
```

Notes on phases without their own files:

- **Task** is a transition concept, not a role. Tasks are
  authored by `planner` and consumed by `tdd-writer` /
  `executor`. No dedicated `task-creator.md` ships
  (decision recorded in
  `.ai/project/specs/2026-05-14-agent-roster-completion/spec.md`
  § Open Questions Q2).
- `architect` is replaced by `spec-writer` in the agent
  vocabulary (decision recorded in the same spec § Q3).
- `prd-writer` is a **pre-pipeline role** active at workflow
  Step 0; the other 7 form the in-pipeline chain
  (Steps 0.5 through Review). See
  `.ai/runtime/workflows/feature-development.md`.

---

## Traceability

Every kit artifact carries a structural **upward-citation link**
to its direct parent, assembling a complete audit chain from any
commit back to the originating PRD. The chain:

```txt
commit
  → task              (## Parent Spec + ## Parent Plan)
  → plan              (## Parent Spec)
  → spec              (## Parent Feature)
  → feature           (## Parent PRD)
  → PRD
```

### `## Parent <Type>` convention

Each artifact template carries one or more `## Parent <Type>`
sections naming the direct upstream artifact by path. Required
field; value is a single path string (not a bullet list).

| Artifact | Required sections |
|---|---|
| PRD       | (root of the chain; no parent) |
| Feature   | `## Parent PRD` |
| Spec      | `## Parent Feature` |
| Plan      | `## Parent Spec` |
| Task      | `## Parent Spec` + `## Parent Plan` |
| Review    | `## Parent Spec` |

### `(none — <reason>)` rendering

Some workflow paths skip an upstream artifact. Each artifact's
template documents the rendering:

- **Engineering-only spec** (no PRD/feature path; e.g.
  documentation tidy) → `## Parent Feature: (none — engineering-only)`.
- **Bug-fix spec** (workflow skips Step 0 / 0.5) →
  `## Parent Feature: (none — bug-fix workflow)`.
- **Hot-fix task** (created outside the normal plan-first
  flow) → `## Parent Plan: (none — direct task)`.

Empty / blank values are never valid. The `(none — <reason>)`
rendering keeps the audit chain explicit even where steps are
skipped.

### Why structural

The convention motivates **M3** (traceability chain) from the
v0.6.0 nine-phase-workflow PRD: a future audit walks the
sections to verify that shipped work satisfies stated intent,
without parsing prose. Prose remains in `§Goal` and elsewhere
for human readability — see `.ai/runtime/workflows/feature-development.md`
for the per-phase rationale.

This kit does NOT ship tooling that validates link resolution
in this release; the convention exists at the doc level so
future tooling (if needed) has a stable structure to read.

---

## Skills

Location:

```txt
.ai/runtime/skills/
```

Defines reusable implementation patterns. See
`.ai/runtime/skills/README.md` for the directory layout, when to
create a skill, and how skills get loaded.

Current skills:

None ship with the kit. Add project-specific skills under
`.ai/project/skills/<stack-or-domain>/<skill-name>/SKILL.md` and
register them in your project's INDEX.md.

Authoring a new skill follows the workflow in
`.ai/runtime/skills/README.md`.

---

## Rules

Location:

```txt
.ai/runtime/rules/
```

Defines language- and scope-scoped conventions that apply whenever
a task touches files in scope. Unlike skills (task-triggered), rules
are always-on for their scope. See `.ai/runtime/rules/README.md`
for the rule lifecycle, severity convention, and how rules get
loaded.

Current rules:

None ship with the kit. Add project-specific rules under
`.ai/project/rules/<language>/<topic>.md` (or
`.ai/project/rules/<topic>.md` for cross-language rules) and
register them in your project's INDEX.md.

Authoring a new rule follows the workflow in
`.ai/runtime/rules/README.md`.

---

## Workflows

Location:

```txt
.ai/runtime/workflows/
```

Current workflows:

- `feature-development.md` — owns the spec / plan / task / review
  lifecycle, including the spec lifecycle (`DRAFT → APPROVED → REJECTED
  → SUPERSEDED`).
- `bug-fix.md` — owns the corrective-change lifecycle. Strict
  superset of feature-development.md with three required spec
  sections (Root Cause, Reproduction, Regression Test) and a
  regression-test-first executor order.
- `branching.md` — owns git ref naming, branch tiering, and merge gates.

BOOTSTRAP Step 9 loads the workflow file matching the current runtime
mode.

---

## Hooks

Location:

```txt
.ai/runtime/hooks/
```

Defines agent-pipeline transition hooks — declarative boundary
contracts between two agents in the recommended flow
(PRD-Writer → Feature-Writer → Spec-Writer → Planner →
TDD-Writer → Executor → Verifier → Reviewer). Unlike skills
(task-triggered) and rules (file-scope-triggered), hooks
trigger on **agent transitions**. Unrelated to the Husky git hooks
documented in `ADR-0006`. See `.ai/runtime/hooks/README.md` for the
hook lifecycle, trigger taxonomy, gate behavior, and loading paths.

Current hooks:

- `pre-executor/runtime-scoped-preflight` (GATE) — when a spec
  touches `.ai/runtime/**`, verify §2 Scope enumerates each
  runtime path, the branch is `chore/runtime-<topic>`, and a
  spec file exists, before any edit is written. Pre-Executor
  complement to `SAFETY.md` § Runtime Tree Protection. This is
  the only hook that ships with the kit, since the rule it
  enforces is intrinsic to kit governance.

Project-specific hooks live under
`.ai/project/hooks/<phase>/<name>/HOOK.md`. Authoring a new hook
follows the workflow in `.ai/runtime/hooks/README.md`.

---

## PRDs

Location:

```txt
.ai/project/prds/  (instance)
.ai/runtime/prds/_template.md  (template)
```

Defines product requirements ("what & why") for product-driven
features. PRDs are upstream of specs: a PRD answers the problem,
target users, and success metrics; the downstream spec answers
how to build it. Optional — bug fixes and small engineering-only
changes do not require a PRD. See
`.ai/runtime/workflows/feature-development.md` § Step 0.

PRD lifecycle:

```txt
DRAFT
→ APPROVED
→ REJECTED
→ SUPERSEDED
```

---

## Features

Location:

```txt
.ai/project/features/  (instance)
.ai/runtime/features/_template.md  (template)
```

Defines one discrete capability sliced from a parent PRD. One
PRD typically produces N features; one feature drives one (or
occasionally more) downstream spec. Features answer "what
specific slice of the PRD does this satisfy, and what does done
look like for this slice." Engineering details (architecture,
contracts, test plan) belong in the downstream spec, not the
feature. See
`.ai/runtime/workflows/feature-development.md` § Step 0.5.

Mandatory whenever Step 0 (PRD) ran; same skip criteria as
Step 0 (bug fixes and engineering-only changes skip both).

Feature lifecycle:

```txt
DRAFT
→ APPROVED
→ REJECTED
→ SUPERSEDED
```

---

## Specs

Location:

```txt
.ai/project/specs/  (instance)
.ai/runtime/specs/_template/  (template)
```

Defines feature requirements.

---

## Plans

Location:

```txt
.ai/project/plans/  (instance)
.ai/runtime/plans/_template.md  (template)
```

Defines implementation strategy and task graph.

---

## Tasks

Location:

```txt
.ai/project/tasks/  (instance)
.ai/runtime/tasks/  (schema + template)
```

Defines executable engineering work units.

Task lifecycle:

```txt
TODO
→ IN_PROGRESS
→ IN_REVIEW
→ DONE
```

---

## Contracts

Location:

```txt
.ai/project/contracts/
```

Defines public API boundaries and compatibility rules.

---

## Reviews

Location:

```txt
.ai/project/reviews/  (instance)
.ai/runtime/reviews/_template.md  (template)
```

Stores feature and refactor reviews.

---

## Verifications

Location:

```txt
.ai/project/verifications/
```

Verification files are required for:

- failed verification
- blocked or rejected specs
- contract violations
- breaking changes
- complex refactors

Simple successful feature verification may be recorded in the related review file.

---

## ADRs

Location:

```txt
.ai/project/adr/  (instance)
.ai/runtime/adr/0000-template.md  (template)
```

Stores architecture decision records.

---

## Memory

Location:

```txt
.ai/runtime/memory/  (generic)
.ai/project/memory/  (instance)
```

Hierarchy:

- core/
- architecture/
- engineering/
- governance/
- product/
- runtime/

Use context-loading strategy to determine which memory layers to load.

---

## Verification Rules

Minimum required verification:

```bash
npm run verify
```

---

## Governance Rules

- Public API changes require contract updates.
- Breaking changes require ADR approval.
- Features are not DONE until:
  - implementation complete
  - verification complete
  - review exists
  - task status updated

---

<!-- Current architecture tree and tech stack live in
     .ai/project/STATE.md under ## Architecture and ## Tech Stack. -->

## Recommended Agent Flow

```txt
PRD-Writer
↓
Feature-Writer
↓
Spec-Writer
↓
Planner
↓
TDD-Writer  (for TDD-applicable tasks; see workflow Step 1.5)
↓
Executor
↓
Verifier
↓
Reviewer
```

## Priorities

Location:

```txt
.ai/runtime/PRIORITIES.md
```

Defines runtime prioritization and execution ordering rules.


## Runtime Mode

Location:

```txt
.ai/runtime/RUNTIME_MODE.md
```

Defines current engineering operating mode and AI behavior expectations.

## Bootstrap

Location:

```txt
.ai/runtime/BOOTSTRAP.md
```

Defines runtime initialization protocol for AI agents.

## Capabilities

Location:

```txt
.ai/runtime/CAPABILITIES.md
```

Describes supported runtime behaviors and engineering capabilities.

## Safety

Location:

```txt
.ai/runtime/SAFETY.md
```

Defines runtime safety boundaries and protected operations.

## Runtime Transitions

Location:

```txt
.ai/runtime/RUNTIME_TRANSITIONS.md
```
Defines runtime state transition rules and adaptive behavior changes.