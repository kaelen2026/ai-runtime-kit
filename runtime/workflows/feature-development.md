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

### 0. Define PRD (optional — product-driven features)

For features driven by product intent (new capabilities, UX
changes, user-visible behavior shifts), draft a PRD first under:

```txt
.ai/project/prds/YYYY-MM-DD-<slug>/prd.md
```

Use `.ai/runtime/prds/_template.md` as the starting point. The
PRD answers **what & why** — Problem, Target Users, Success
Metrics, User Stories, Out of Scope, Open Questions,
Stakeholders. Engineering details (architecture, data flow, code
contracts) belong in the downstream spec, not the PRD.

Skip this step when:

- the change is corrective (use `bug-fix.md` instead — bug fixes
  don't need PRDs),
- the change is engineering-only (refactor, dependency bump, test
  coverage, governance maintenance),
- the scope is small enough that the spec alone communicates
  intent.

PRD lifecycle mirrors specs: `DRAFT → APPROVED → REJECTED →
SUPERSEDED`. An APPROVED PRD authorizes spec drafting. The
downstream spec MUST reference its PRD by path in §1 Goal so
review can verify the spec satisfies the PRD.

### 1. Define Spec

Create a feature spec under:

```txt
.ai/project/specs/YYYY-MM-DD-feature-name/spec.md
```

If the spec is downstream of a PRD (Step 0), §1 Goal must cite
the PRD path so reviewers can check that the spec covers the
PRD's requirements without quietly expanding scope.

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
- relevant skill files from **both** `.ai/runtime/skills/**`
  (kit-shipped, framework-generic) **and** `.ai/project/skills/**`
  (project-shipped, project-specific). Project-side files take
  precedence on path collision.
- feature spec

If the spec itself authors or modifies a kit-shipped skill under
`.ai/runtime/skills/**`, follow `.ai/runtime/skills/README.md` and
treat the spec as runtime-scoped governance per
`.ai/runtime/SAFETY.md` § Runtime Tree Protection. Authoring a
project-side skill at `.ai/project/skills/**` is not governance-
protected (project owns its tree); it still follows the structural
convention from `.ai/runtime/skills/README.md`.

If the spec authors or modifies a kit-shipped rule under
`.ai/runtime/rules/**`, follow `.ai/runtime/rules/README.md` and
treat the spec as runtime-scoped governance per `.ai/runtime/SAFETY.md`
§ Runtime Tree Protection. Authoring a project-side rule at
`.ai/project/rules/**` is not governance-protected.

When the executor touches files in a rule's scope (e.g. a `.ts`
file when a TypeScript rule exists), it must load the relevant
rules from **both** `.ai/runtime/rules/<language>/*.md` (kit) and
`.ai/project/rules/<language>/*.md` (project) before writing code.
Project-side rules take precedence on path collision.

If the spec authors or modifies a kit-shipped hook under
`.ai/runtime/hooks/**`, follow `.ai/runtime/hooks/README.md` and
treat the spec as runtime-scoped governance per `.ai/runtime/SAFETY.md`
§ Runtime Tree Protection. Authoring a project-side hook at
`.ai/project/hooks/**` is not governance-protected.

At each agent-pipeline transition (Architect → Planner → Executor
→ Verifier → Reviewer), the active agent must load hooks attached
to its phase from **both** `.ai/runtime/hooks/<phase>-<agent>/*/HOOK.md`
(kit) and `.ai/project/hooks/<phase>-<agent>/*/HOOK.md` (project)
whose `appliesWhen` matches the current spec, diff, or runtime
mode. Project-side hooks take precedence on path collision. GATE
and MUTATION hooks block the transition until their action
completes; ADVISORY hooks log into the review file.

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
