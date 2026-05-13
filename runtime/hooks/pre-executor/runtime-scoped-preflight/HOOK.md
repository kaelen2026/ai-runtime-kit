---
name: runtime-scoped-preflight
description: Pre-Executor GATE — when a spec touches .ai/runtime/**, verify branch, scope, and spec path preconditions before code edits begin.
metadata:
  phase: pre
  agent: executor
  gate: GATE
  appliesWhen:
    pathPatterns:
      - ".ai/runtime/**"
    specSignals:
      - "runtime-scoped"
      - "Runtime Tree Protection"
    runtimeModes:
      - FEATURE_DEVELOPMENT
      - BUG_FIX
      - REFACTOR
      - GOVERNANCE_RECOVERY
---

# Runtime-Scoped Preflight

At the `Planner → Executor` transition, if the spec's §2 Scope
lists any path under `.ai/runtime/**`, the Executor MUST verify
three preconditions before applying any file edit. Failing the
check blocks the transition; the Executor stops and surfaces the
failure to the operator.

This hook is the agent-pipeline complement to `SAFETY.md` §
Runtime Tree Protection. Where SAFETY.md states the rule,
this hook makes the rule observable at the moment of
violation — i.e. before any change is written.

## Trigger

- **Phase**: pre
- **Agent transition**: `Planner → Executor`
- **Applies when**: the spec's §2 Scope lists at least one path
  matching `.ai/runtime/**`. Examples of qualifying scope
  entries:
  - `.ai/runtime/SAFETY.md`
  - `.ai/runtime/workflows/feature-development.md`
  - any new file under `.ai/runtime/hooks/`, `rules/`,
    `skills/`, or `specs/_template/`.

## Action

Before the Executor opens an edit tool, confirm ALL three:

1. **Scope contract.** Every runtime path the task will touch
   appears verbatim in §2 Scope's `Includes` list (not just in
   `§3 Requirements`). Implicit touches via subdirectory
   wildcards (`.ai/runtime/**`) are not sufficient; each file
   must be named.
2. **Branch name.** The current branch name starts with
   `chore/runtime-` per
   `.ai/runtime/workflows/branching.md` § Governance Rule
   Branches. Bare descriptive names (`fix/x`,
   `feat/x`) do not satisfy this.
3. **Spec home.** A spec file exists at
   `.ai/project/specs/YYYY-MM-DD-<name>/spec.md` whose §2 Scope
   was the source of (1). Out-of-band edits to runtime/ (no
   spec, no review) are not permitted.

If ANY check fails, STOP. Do not write files. Report the failed
precondition to the operator and request remediation.

## Gate behavior

**GATE**. A failed precondition blocks the transition. The
Executor MUST NOT start. The operator must either:

- correct the precondition (rename branch, expand §2 Scope, or
  add the missing spec), or
- record in the spec's §11 Resolved Decisions why the
  precondition does not apply (rare — almost always indicates
  the change should not be made here).

Manual override requires the spec's §11 to explicitly cite this
hook by path (`.ai/runtime/hooks/pre-executor/runtime-scoped-preflight/HOOK.md`).
Silent override is forbidden and constitutes a Forbidden
Operation under `SAFETY.md`.

## Inputs

- The spec file's §2 Scope content (§ Includes specifically).
- Current `git rev-parse --abbrev-ref HEAD` value.
- Existence of the spec file on disk at the named path.

## Outputs

Advisory note recorded in the review file under
`.ai/project/reviews/<spec-name>-review.md`'s § Verification
subsection, even on success, of the form:

```
Runtime-scoped preflight (HOOK pre-executor/runtime-scoped-preflight):
  - Scope contract: PASS — listed paths: <paths>
  - Branch name: PASS — `<branch-name>`
  - Spec home: PASS — `<spec-path>`
```

On failure: no review file is written (the Executor blocked
before reaching the Review phase). The operator's response
appears in the spec body itself.

## Failure mode

GATE failure halts the pipeline. The Executor must:

1. State which of the three preconditions failed and why.
2. Surface the relevant rule citation (SAFETY.md § Runtime
   Tree Protection, branching.md § Governance Rule Branches).
3. Wait for operator remediation. No silent retry.

If the operator chooses to override via §11 Resolved Decisions,
the override block must:

- name this hook by path,
- name the specific precondition being bypassed,
- justify why the bypass is safer than the bypassed
  precondition.

## Why

`SAFETY.md` § Runtime Tree Protection is one of the most-cited
governance rules in this repo. Multiple specs land per day that
touch runtime/. Without an observable handoff contract, the
rule depends entirely on each Executor invocation remembering
to check.

Specific anti-patterns this hook prevents:

- **Runtime edits in project-scoped branches.** A feature-spec
  branch like `feat/notes-module` quietly edits `RUNTIME_MODE.md`
  because the executor noticed a tangentially related drift.
  No spec authorisation, no review, no governance trail.
  `2026-05-12-workflow-maintenance` (the retrospective)
  documents the kind of out-of-band edit this pattern produces.
- **Wildcard scope.** A spec lists `.ai/runtime/**` in §2 Scope
  to mean "I might touch a few files here" — and then the
  executor touches a dozen. The hook forces enumeration.
- **Missing spec.** A direct edit to `.ai/runtime/BOOTSTRAP.md`
  with no spec at all. The hook fails check (3).

`feedback_governance_bootstrap_order` (this repo's lived
memory note: "write the rule on trunk before applying it") is
strengthened by check (1) and (3) acting before any code is
written.

## Examples

### When this hook fires

Spec `2026-05-13-add-bug-fix-mode` lists in §2 Scope:

```
- `.ai/runtime/RUNTIME_MODE.md` — modify ...
- `.ai/runtime/BOOTSTRAP.md` — modify ...
- `.ai/runtime/RUNTIME_TRANSITIONS.md` — modify ...
```

Three runtime paths. The hook fires at `pre-executor`. The
Executor verifies:

1. ✅ Scope contract — all three paths listed by name.
2. ✅ Branch — `chore/runtime-bug-fix-mode`.
3. ✅ Spec home — exists.

Pass. Executor proceeds.

### When this hook does not fire

Spec `2026-05-13-claudemd-runtime-paths` lists in §2 Scope only
`CLAUDE.md` and `.ai/project/...` files. No `.ai/runtime/**`
path appears. The hook's `appliesWhen.pathPatterns` does not
match. The hook does not fire; the Executor proceeds without
preflight.

### Near-miss: the bypass case

Spec body says "as a one-time exception, also patch
`.ai/runtime/CAPABILITIES.md` to align labels." But §2 Scope
only lists project files. The hook fires anyway because
the **intent** (visible in §3 Requirements or §11 narrative)
touches runtime/. Check (1) fails on "not in Includes list".
The Executor must either move the runtime touch into §2 Scope
formally (running the proper spec workflow) or split it into a
follow-up spec.
