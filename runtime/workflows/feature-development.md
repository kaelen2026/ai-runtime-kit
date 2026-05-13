# Feature Development Workflow

## Purpose

Use this workflow to ship one small feature safely with AI assistance.

> If the change is corrective (a bug fix), use
> `.ai/runtime/workflows/bug-fix.md` instead. That workflow is a
> strict superset of this one with three additional required spec
> sections (Root Cause, Reproduction, Regression Test) and a
> regression-test-first executor order.

## Roles

- ChatGPT: define, design, review, summarize
- Claude Code: implement, refactor, verify

## Spec Lifecycle

Specs should use one of:

```txt
DRAFT
APPROVED
REJECTED
SUPERSEDED
```

Rules:

- New specs start as DRAFT.
- Approved specs may generate plans/tasks.
- Rejected specs must not generate executable tasks.
- Superseded specs should reference the replacement spec.

## Workflow

### 1. Define Spec

Create a feature spec under:

```txt
.ai/project/specs/YYYY-MM-DD-feature-name/spec.md
```

Spec must include:

- Goal
- Scope
- Requirements
- Acceptance Criteria
- Test Checklist
- Verification Commands
- Rollback Plan

### 2. Execute with Claude Code

Claude Code must read:

- `.ai/runtime/agents/executor.md`
- `.ai/project/memory/core/tech-stack.md`
- `.ai/runtime/workflows/feature-development.md`
- `.ai/runtime/memory/engineering/principles.md`
- related `.ai/project/contracts/**` files if the feature touches public APIs
- relevant `.ai/runtime/skills/**` files should also be provided to Claude Code.
- feature spec

If the spec itself authors or modifies a skill under
`.ai/runtime/skills/**`, follow `.ai/runtime/skills/README.md` and
treat the spec as runtime-scoped governance per
`.ai/runtime/SAFETY.md` § Runtime Tree Protection.

If the spec authors or modifies a rule under `.ai/runtime/rules/**`,
follow `.ai/runtime/rules/README.md` and treat the spec as
runtime-scoped governance per `.ai/runtime/SAFETY.md` § Runtime
Tree Protection.

When the executor touches files in a rule's scope (e.g. a `.ts`
file when a TypeScript rule exists), it must load the relevant
rules from `.ai/runtime/rules/<language>/*.md` before writing code.

If the spec authors or modifies a hook under `.ai/runtime/hooks/**`,
follow `.ai/runtime/hooks/README.md` and treat the spec as
runtime-scoped governance per `.ai/runtime/SAFETY.md` § Runtime
Tree Protection.

At each agent-pipeline transition (Architect → Planner → Executor
→ Verifier → Reviewer), the active agent must load hooks attached
to its phase from `.ai/runtime/hooks/<phase>-<agent>/*/HOOK.md`
whose `appliesWhen` matches the current spec, diff, or runtime
mode. GATE and MUTATION hooks block the transition until their
action completes; ADVISORY hooks log into the review file.

Claude Code must return:

- Changed files
- Implementation summary
- Test result
- Build result
- Unresolved risks

### 3. Verify

Verification should include:

- `.ai/runtime/agents/verifier.md`
- related `.ai/project/contracts/**`
- existing tests
- build integrity
- backward compatibility

Verification results should be saved under `.ai/project/verifications/` when:

- verification fails
- a contract violation is detected
- a breaking change is proposed
- the feature is a complex refactor
- explicit audit trail is required

For simple successful features, verification results may be recorded in the review file instead.

At minimum, run:

```bash
npm run verify
```

Local verification must use `npm run verify` as the canonical verification command.
If the project has lint/typecheck commands, run them too.

### 4. Review

Create review file under:

```txt
.ai/project/reviews/YYYY-MM-DD-feature-name-review.md
```

Review must include:

- Summary
- Blocking issues
- Non-blocking issues
- Suggested fixes
- Verdict

### 5. Fix

If review finds issues, Claude Code must:

- Read the review
- Fix blocking issues
- Re-run verification
- Report final result

### 6. Commit

Use conventional commits:

```txt
feat: ...
fix: ...
test: ...
refactor: ...
docs: ...
```

## Definition of Done

A feature is done only when:

- Spec exists
- Code is implemented
- Tests pass
- Build passes
- Review exists
- Changes are committed

## Task Status Lifecycle

Tasks should follow:

```txt
TODO → IN_PROGRESS → IN_REVIEW → DONE
```

If blocked:

```txt
TODO or IN_PROGRESS → BLOCKED
```

Task status must be updated when execution state changes.
