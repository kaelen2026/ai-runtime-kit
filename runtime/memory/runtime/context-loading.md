# Context Loading Strategy

## Purpose

Define what context AI agents should load for different workflow actions.

## Always Load

- `.ai/runtime/INDEX.md`
- `.ai/runtime/memory/engineering/principles.md`
- `.ai/project/memory/engineering/conventions.md`
- `.ai/project/memory/core/tech-stack.md`
- `.ai/project/STATE.md`

## Feature Implementation

Load:

- relevant feature spec
- relevant plan
- relevant task
- related contracts
- related skills from BOTH `.ai/runtime/skills/**` (kit) and
  `.ai/project/skills/**` (project)
- related rules from BOTH `.ai/runtime/rules/<language>/*.md`
  (kit) and `.ai/project/rules/<language>/*.md` (project), for
  any language whose files the task touches
- related hooks from BOTH `.ai/runtime/hooks/<phase>-<agent>/*/HOOK.md`
  (kit) and `.ai/project/hooks/<phase>-<agent>/*/HOOK.md`
  (project), matching the current agent transition and
  `appliesWhen`
- executor agent

Project-side files take precedence on path collision.

Avoid loading unrelated specs, plans, or completed tasks.

## Review

Load:

- feature spec
- plan if available
- related contracts
- git diff
- verification result
- reviewer agent
- `pre-reviewer/*` and `post-reviewer/*` hooks from BOTH
  `.ai/runtime/hooks/` (kit) and `.ai/project/hooks/` (project)
  matching the spec's `appliesWhen`

## Verification

Load:

- verifier agent
- related contracts
- verification command result
- changed files summary

## Task Discovery

Load:

- `.ai/runtime/INDEX.md`
- `.ai/project/tasks/TASK_STATUS.md`
- task files only when needed
- related plans/specs only for candidate TODO tasks

## Rules

- Prefer narrow context over broad context.
- Do not load all `.ai/**` unless doing repository-wide workflow audit.
- Load contracts before modifying public APIs.
- Load ADRs before reversing architecture decisions.

## Memory Layer Loading

### Feature Development

Load:

- core/
- engineering/
- product/

### Refactor Work

Load:

- architecture/
- engineering/
- runtime/

### Governance Work

Load:

- governance/
- runtime/

### Runtime Maintenance

Load:

- runtime/
- governance/
