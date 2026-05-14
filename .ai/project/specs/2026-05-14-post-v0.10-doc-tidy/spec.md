# Feature Spec: Post-v0.10 Doc Tidy

## Status

APPROVED
<!-- Self-approved per user "抢收剩余 follow-ups" direction
     after v0.10.0 ship. Same pattern as v0.8.1 doc tidy:
     bundled cleanup of doc-only follow-ups recorded in prior
     reviews; engineering-only, no PRD/feature parent. -->

## Parent Feature

(none — engineering-only)

## Goal

Bundled cleanup of four doc-only follow-ups recorded in v0.9.0
(F4) and v0.10.0 (validate-cli) reviews:

1. **Workflow cross-ref to INDEX § Traceability**
   (v0.9.0 review § Non-blocking — "Workflow doc doesn't
   reference the new convention beyond existing citation
   rules").
2. **Hot-fix example in task template**
   (v0.9.0 review § Non-blocking — "`(none — direct task)`
   rendering has no example in the task template").
3. **Walkthrough 3 expansion** showing `## Parent <Type>`
   chain in step descriptions
   (v0.9.0 review § Suggested Fixes).
4. **`spec-writer.md` Must Not bullet** promoting the
   v0.5.1/v0.7.0/v0.10.0 "spec amended mid-impl when
   acceptance asserts on unverified state" pattern from
   review observation to agent self-rule
   (v0.10.0 review § Suggested Fixes).

## Scope

<!-- RUNTIME-SCOPED. 3 runtime/** paths trigger preflight.
     README.md is project-root and outside the governance
     perimeter. Acknowledged. -->

Includes:

- **runtime/** (governance-protected):
  - `runtime/workflows/feature-development.md` — add a
    short cross-reference paragraph near Step 0.5 / Step 1
    pointing readers at `.ai/runtime/INDEX.md § Traceability`
    for the canonical chain and `## Parent <Type>` convention.
  - `runtime/tasks/_template.md` — add an HTML-comment
    example block in the `## Parent Plan` section showing
    the `(none — direct task)` rendering for hot-fix tasks.
  - `runtime/agents/spec-writer.md` — add one `## Must Not`
    bullet about metric reachability:
    > Approve specs whose acceptance criteria assert metrics
    > on state that doesn't yet exist (size-ceiling drift in
    > v0.5.1/v0.7.0, retrofit-required in v0.10.0 — verify
    > the dependencies are in place before approving).
    File size after edit: keep under 1900 bytes (revising
    the v0.7.0 ceiling — 4th time, pattern recognized; future
    spec should make this a range rather than a hard
    ceiling).

- **Project-root**:
  - `README.md` — Walkthrough 3's per-step bullets gain
    brief `## Parent <Type>` mentions (e.g., "Each feature
    cites the PRD via `## Parent PRD`...").

Excludes:

- New features (multi-agent entry, commit-message conventions,
  `--since/--diff` flag, `--check-downstream`, externalize
  `EXCLUDED_FILENAMES`). All in respective reviews' suggested
  fixes for future PRDs.
- Rewriting Walkthroughs 1 + 2 — still accurate.
- New tests — no behavior change.
- Retrofitting any historical artifact (v0.10.0 already did the
  big retrofit).
- Promoting the size-ceiling rule from a hard cap to a range
  (real fix but bigger scope; record as follow-up).

## Requirements

1. **`runtime/workflows/feature-development.md`** — insert a
   one-paragraph cross-ref after the Step 0.5 → Step 1
   transition explaining that the canonical
   `## Parent <Type>` rules per artifact type live in
   `.ai/runtime/INDEX.md § Traceability`.

2. **`runtime/tasks/_template.md`** — extend the existing
   HTML comment in the `## Parent Plan` section to show an
   example: `<!-- Example: (none — direct task) -->`.

3. **`runtime/agents/spec-writer.md`** — append one bullet
   to `## Must Not`. Bullet wording terse; file size kept
   ≤1900 bytes (acknowledging the 4th size-ceiling drift
   pattern in §Process notes).

4. **`README.md` Walkthrough 3** — each step line in the
   pseudocode block gains a parenthetical noting which
   `## Parent <Type>` field anchors the upward link (e.g.
   "(cites parent feature via ## Parent Feature)").

## Acceptance Criteria

- Workflow doc has the documented cross-ref paragraph.
- Task template has the example comment.
- `runtime/agents/spec-writer.md` ≤1900 bytes; contains the
  new bullet about metric reachability.
- README Walkthrough 3 has per-step `## Parent <Type>`
  annotations.
- `npm test` 24/24 still passing.
- `node bin/cli.js validate` on this repo's tree still
  returns PASS (the doc edits don't break any structural
  rule).

## Test Checklist

- [ ] `npm test` clean.
- [ ] `node bin/cli.js validate` → PASS.
- [ ] `wc -c runtime/agents/spec-writer.md` ≤ 1900.
- [ ] Manual: walkthroughs 1 + 2 + 3 read cleanly in
      sequence; no regressions.

## Verification Commands

```bash
npm test
node bin/cli.js validate
wc -c runtime/agents/spec-writer.md
```

## Rollback Plan

1. Revert commits on `chore/runtime-post-v0.10-doc-tidy`.
2. `npm test` and `node bin/cli.js validate` both still
   clean on prior tree.
3. No consumer impact — pure doc cleanup.

## Process notes

- Branch: `chore/runtime-post-v0.10-doc-tidy`.
- Preflight hook fires at Planner → Executor with 3 runtime
  paths.
- Commit structure (mirrors v0.8.1):
  - **Commit A**: 3 runtime/** changes + spec status flip
    (already APPROVED at top).
  - **Commit B**: README + version v0.10.0 → v0.10.1 +
    CHANGELOG.
  - **Commit C**: review.
- Version: **v0.10.1** (PATCH — pure doc cleanup).
- **4th size-ceiling drift**: spec-writer.md grew from 1537
  → 1680 (v0.8.1) and would now grow to ~1800. The hard
  cap pattern keeps failing. Recorded for future fix:
  promote "spec budgets are ranges, not hard caps" to a
  workflow rule.
