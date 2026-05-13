# Bug Fix Workflow

## Purpose

Use this workflow to ship one corrective change safely with AI
assistance. A "bug fix" here means a change whose primary intent is
to bring observed behavior in line with documented or expected
behavior, not to extend functionality.

## When this workflow applies

This workflow applies when ANY of the following is true:

- the spec directory is named `YYYY-MM-DD-fix-<name>/`,
- the spec includes a `## Root Cause` section,
- the change is committed with a `fix:` prefix per
  `feature-development.md` § Commit conventions.

When in doubt, prefer this workflow over `feature-development.md`.
Production incidents (`INCIDENT` runtime mode) are out of scope;
follow `SAFETY.md` for those.

## Roles

Same as `feature-development.md`:

- ChatGPT: define, design, review, summarize
- Claude Code: implement, refactor, verify

## Spec lifecycle

Same lifecycle as feature specs (`DRAFT → APPROVED → REJECTED →
SUPERSEDED`). Use the bug-fix-specific template at
`.ai/runtime/specs/_template-bug-fix/spec.md`, which augments the
feature spec shape with three required sections (see §Required spec
sections below).

## Required spec sections

A bug-fix spec MUST include all sections of the feature spec
template, PLUS the following three sections:

### `## Root Cause`

Name the underlying defect, not the symptom. Required content:

- the smallest accurate description of why the bug occurred (e.g.
  "validator middleware ran after the route handler that threw"),
- the commit, spec, or design decision that introduced the cause
  if knowable (link the commit hash or spec path),
- whether the cause is local (one module) or systemic (pattern
  repeated across modules) — systemic causes require a follow-up
  spec and must be linked in `## 10. Related Specs`.

If the root cause is genuinely unknown after investigation, write
"Unknown — best hypothesis: <X>" and explain what evidence would
confirm or refute it. Do not skip the section.

### `## Reproduction`

The minimal steps a reviewer can run to observe the bug BEFORE the
fix is applied. Required content:

- preconditions (env vars, fixtures, branch),
- exact commands or HTTP calls,
- the observed (wrong) output,
- the expected (correct) output.

If the bug only reproduces in production, document the
trace/log/event ID and the time window instead of commands, and
state explicitly that local reproduction is not available.

### `## Regression Test`

The test that fails before the fix and passes after. Required
content:

- the test file path (new or modified),
- the test name(s) added,
- a one-line statement of which assertion catches the bug,
- proof that the test was red before the fix (paste the failing
  output, or note the commit that demonstrates the red state).

Exception: pure documentation fixes (no behavior change) may state
"No regression test — documentation fix; spec §Acceptance Criteria
greps serve as the regression check" and rely on the spec's grep
assertions instead.

## Workflow

### 1. Define spec

Copy `.ai/runtime/specs/_template-bug-fix/spec.md` into
`.ai/project/specs/YYYY-MM-DD-fix-<name>/spec.md`. Fill in every
required section, including the three above.

Pick the spec name to describe the cause when possible, not the
symptom (`fix-validator-after-handler`, not `fix-500-on-login`).

### 2. Plan

Same as `feature-development.md` § Workflow. Bug-fix plans are
typically smaller (1–2 tasks) but the structure is identical.

### 3. Execute with Claude Code

Claude Code must read the same context as feature work
(`feature-development.md` § Execute), plus:

- the spec's `## Root Cause` section (drives the fix shape),
- the spec's `## Reproduction` (drives the regression test shape),
- the spec's `## Regression Test` (drives the test file edit).

Executor order:

1. Write the regression test first; confirm it fails.
2. Apply the minimal fix that addresses the named root cause.
3. Re-run the test; confirm it passes.
4. Run `npm run verify`.

This order is mandatory unless the spec's `## Regression Test`
invokes the documentation exception above.

### 4. Verify

Same as `feature-development.md` § Verify, plus:

- the new regression test must be present in the diff and passing,
- the spec's `## Reproduction` steps must no longer reproduce the
  bug (reviewer confirms by re-running them post-fix).

### 5. Review

Same as `feature-development.md` § Review. The review file MUST
explicitly state whether the three required sections (Root Cause,
Reproduction, Regression Test) are present and adequate.

### 6. Commit

Use `fix:` as the conventional commit prefix.

## Definition of done

A bug fix is done only when:

- spec exists with all three required sections filled,
- regression test exists and passes,
- fix is implemented,
- `npm run verify` passes,
- review exists and confirms the three required sections,
- changes are committed with `fix:` prefix.

## Branching

Same as `branching.md`. No bug-fix-specific tier; the existing Tier
1 / Tier 2 / Tier 3 / Governance rules apply unchanged.

## Relationship to feature-development.md

This workflow is a strict superset of `feature-development.md` for
the spec/plan/task/review pipeline. Differences are limited to:

- spec template (bug-fix template adds three required sections),
- executor order (regression test first),
- review file must explicitly check the three required sections,
- commit prefix (`fix:` instead of `feat:`).

For any topic not covered here, defer to
`feature-development.md`.
