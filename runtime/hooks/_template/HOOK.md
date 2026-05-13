<!--
  Hook template. Copy this file to
  `.ai/runtime/hooks/<phase>-<agent>/<hook-name>/HOOK.md` and fill it
  in. <phase> is `pre` or `post`; <agent> is one of architect /
  planner / executor / verifier / reviewer.

  The YAML frontmatter below is DECLARATIVE: no runtime tool reads or
  enforces it. Agents read it during context-loading to judge whether
  this hook applies. See `.ai/runtime/hooks/README.md` § "How hooks
  get loaded" for the loading paths.
-->
---
name: <hook-name-kebab-case>
description: <one sentence: which transition this attaches to and what it enforces>
metadata:
  phase: pre | post
  agent: architect | planner | executor | verifier | reviewer
  gate: ADVISORY | GATE | MUTATION
  appliesWhen:
    pathPatterns:
      - "<glob: e.g. .ai/runtime/**>"
    specSignals:
      - "<phrase that appears in spec §2 Scope, e.g. 'contract change'>"
    runtimeModes:
      - "<FEATURE_DEVELOPMENT | REFACTOR | INCIDENT | GOVERNANCE_RECOVERY>"
---

# <Hook Name>

<One paragraph stating the transition contract: at this transition,
under these conditions, this action must happen.>

## Trigger

- **Phase**: pre | post
- **Agent transition**: e.g. `Planner → Executor` (for `pre-executor`)
- **Applies when**: <condition that activates the hook — e.g. spec
  §2 Scope lists `.ai/runtime/**`, or the diff touches a contract>

## Action

What the activating agent (or operator) must do when the hook fires.
Imperative form. Concrete enough to be checkable.

## Gate behavior

One of:

- **ADVISORY** — log the action's outcome; do not block the transition.
- **GATE** — if the action fails or is skipped, the transition is
  blocked. The downstream agent MUST NOT start.
- **MUTATION** — the action produces a required artifact (file, log,
  status update). The transition is blocked until the artifact exists.

State which one and why.

## Inputs

What the hook reads: spec sections, prior agent outputs, git diff,
contracts, etc.

## Outputs

What the hook produces: artifact path, status field update, log line,
or "advisory note only".

## Failure mode

What happens if the action cannot be completed. For ADVISORY: how the
failure is recorded. For GATE / MUTATION: who is notified and what
manual override looks like (e.g. spec §11 Resolved Decisions note).

## Why

Cite a concrete failure mode or prior incident the hook prevents.
Without a documented "why", the hook has no defense when a future
contributor challenges it.

## Examples

### When this hook fires

<a short scenario where the hook's `appliesWhen` matches>

### When this hook does not fire

<a near-miss scenario showing the boundary>
