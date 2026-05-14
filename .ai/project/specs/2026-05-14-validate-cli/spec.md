# Feature Spec: Validate CLI

## Status

DRAFT

## Parent Feature

`.ai/project/features/2026-05-14-validate-cli/feature.md`
(parent PRD:
`.ai/project/prds/2026-05-14-validate-command/prd.md`)

## Goal

Implement the `validate` CLI command per the approved feature
cited above. This is the kit's **first src/** feature shipped
under the v0.6.0+ PRD → Feature → Spec → ... workflow**, and
the **first feature whose tasks are TDD-Applies: true** —
exercising workflow Step 1.5 (failing-test-commit-before-
implementation-commit) on real `src/**` code for the first
time on this kit. Producing the first concrete data point for
the v0.6.0 PRD's M4 metric.

**Not runtime-scoped.** All edits live in `src/`, `bin/`, and
`test/`; zero `runtime/**` touches. Branch follows the regular
feature convention (`feat/validate-cli`), not the governance
`chore/runtime-*` form. No `pre-executor/runtime-scoped-
preflight` GATE in scope.

## Scope

Includes:

- **Kit code**:
  - `src/validate.js` (NEW) — pure function module. Exports
    `validate(projectRoot, options = {})` returning
    `{ errors, warnings, summary }`.
  - `bin/cli.js` — extends the dispatcher with a `validate`
    case. Reads `--cwd <dir>`, `--json`, `--help`. Calls
    `src/validate.js`; formats output; exits 0 on no errors,
    1 on any error.
  - `test/validate.test.js` (NEW) — `node:test` unit tests
    covering the validator's behavior plus CLI integration.

Excludes (carry from feature §Excludes):

- Prose/semantic content validation.
- `--fix` auto-repair.
- Downstream-direction validation.
- Validating `runtime/**` files themselves.
- Validating non-chain artifacts (contracts / ADRs /
  verifications / memory / rules / skills / hooks).
- Performance optimization.
- CI/CD integration scripts themselves.
- Documentation updates to `runtime/INDEX.md` or workflows
  about the new command. Doc-only follow-up (small) once the
  command stabilizes.

## Requirements

1. **`src/validate.js` module**:
   - Exports a single function:
     `validate(projectRoot, options = {})`.
   - Returns synchronously:
     ```js
     {
       errors:   [{ artifact, file, type, message }, ...],
       warnings: [{ artifact, file, type, message }, ...],
       summary:  { prds, features, specs, plans, tasks, reviews } // counts
     }
     ```
   - Walks `${projectRoot}/.ai/project/{prds,features,specs,plans,tasks,reviews}/**/*.md`.
     Recursive; depth unlimited within each top-level dir.
   - Per artifact type, checks required `## Parent <Type>`
     sections per the v0.9.0 INDEX § Traceability table:
     - PRD: no parent required.
     - Feature: requires `## Parent PRD`.
     - Spec: requires `## Parent Feature` (may render
       `(none — engineering-only)` / `(none — bug-fix
       workflow)`).
     - Plan: requires `## Parent Spec`.
     - Task: requires both `## Parent Spec` and
       `## Parent Plan` (the latter may render `(none —
       direct task)`).
     - Review: requires `## Parent Spec`.
   - **Errors** raised when:
     - A required `## Parent <Type>` section is missing.
     - A cited parent path (non-`(none — ...)`) doesn't
       resolve to an existing file on disk.
   - **Warnings** raised when:
     - `## Status` value is not in the allowed set for that
       artifact type (DRAFT/APPROVED/REJECTED/SUPERSEDED for
       upstream artifacts; TODO/IN_PROGRESS/IN_REVIEW/DONE
       for tasks).
     - An optional section is present but empty.
     - An artifact's parent status is `REJECTED` while this
       artifact is not (potential orphan).
   - Parsing approach: **regex-based**, zero new dependencies
     (per feature Q2 default). Specifically:
     - `^## Parent ([A-Za-z]+)\s*$` matches section header;
       next non-empty content line is the value.
     - `^## Status\s*$` followed by next non-empty content
       line yields the status value.
     - Use a simple line-by-line walk; do not import a
       markdown parser.

2. **`bin/cli.js` extension**:
   - Adds case `'validate'` to the `switch (cmd)` dispatcher.
   - Help text included in the main `HELP` constant.
   - Parses flags using existing `parseArgs` pattern:
     `{ cwd: { type: 'string' }, json: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' } }`.
   - Calls `require('../src/validate').run(rest)`. The `run`
     function in `validate.js` orchestrates: parseArgs →
     call validate() → format output → process.exit.
   - **Exit code**: 0 if `errors.length === 0` (warnings
     allowed and printed); 1 if `errors.length > 0`.

3. **Output formats**:
   - **Human** (default):
     ```
     Validating .ai/project/... at <projectRoot>

     PRDs:     2 ✓
     Features: 5 ✓ (all parents resolve)
     Specs:    9 ✓
     ...
     Reviews:  10 ✓

     Errors:   <N> (or none)
     <bulleted per-error list with file + reason>
     Warnings: <N> (or none)
     <bulleted per-warning list with file + reason>

     Result: PASS (clean tree) | FAIL (<N> errors)
     ```
   - **JSON** (on `--json`): single JSON object matching the
     return shape of `validate()` plus `result: "PASS"|"FAIL"`.
     Pretty-printed with 2-space indent.

4. **`test/validate.test.js`**:
   - Each test creates an isolated `mkdtemp` fixture and writes
     synthetic artifacts to exercise specific cases.
   - **Test 1** (VM1, clean-tree pass): build a minimal valid
     tree (1 PRD, 1 feature citing it, 1 spec citing the
     feature). `validate(fixture)` returns `{ errors: [],
     warnings: [], summary: { prds:1, features:1, specs:1,
     plans:0, tasks:0, reviews:0 } }`.
   - **Test 2** (VM2, missing-parent error): build a tree
     where the spec is missing `## Parent Feature`. Assert
     `result.errors` contains an entry with `type:
     'missing-parent'` and the right file path; exit code 1
     from CLI invocation.
   - **Test 3** (broken parent path): spec has
     `## Parent Feature: <invalid path>`. Assert
     `type: 'unresolved-parent'` error.
   - **Test 4** (warnings-only exits 0): tree has an empty
     optional section but no errors. Assert
     `errors.length === 0`, `warnings.length > 0`, CLI exit
     code 0.
   - **Test 5** (`--json` output shape): run CLI with
     `--json` on a clean fixture. Parse stdout as JSON;
     assert shape `{ errors, warnings, summary, result }`.
   - **Test 6** (dogfood smoke): run `validate` against this
     repo's own `.ai/` tree (resolved relative to the
     project root). Assert `result.errors.length === 0`.
     This is VM1 satisfied on the live tree.

## Acceptance Criteria

- `src/validate.js` exports `validate(projectRoot, options)`
  with the documented return shape.
- `bin/cli.js validate --help` prints documented usage.
- `node bin/cli.js validate` against this repo's `.ai/` tree
  exits 0 with no errors (VM1 live).
- `node bin/cli.js validate --cwd <broken-fixture>` exits 1
  with the documented error report (VM2 live).
- `--json` produces parseable JSON matching the schema.
- `npm test` passes (18 prior + 6 new = **24 tests**).
- `npm pack --dry-run` shows `src/validate.js` and lists 9
  src files instead of 8.
- VM3 satisfied: the implementation commit log for this spec
  shows test-commit timestamps preceding implementation-commit
  timestamps for the two TDD-applicable tasks. Verified
  manually post-impl via `git log`.

## Test Checklist

- [ ] Tests 1–6 added per Req. 4 and passing.
- [ ] CLI `--help` lists `validate` in main HELP + dedicated
      `validate --help` works.
- [ ] Dogfood smoke (Test 6) passes against this repo's
      actual `.ai/` tree.
- [ ] `npm pack --dry-run` shows new files and modest size
      delta.
- [ ] M4 audit: `git log feat/validate-cli` shows for each
      `TDD-Applies: true` task, the test commit's timestamp
      ≤ the corresponding impl commit's timestamp.

## Verification Commands

```bash
npm test
node bin/cli.js validate                      # dogfood live
node bin/cli.js validate --json | head        # JSON shape
node bin/cli.js validate --cwd "$(mktemp -d)" # empty-tree case
git log --pretty='%ai %h %s' feat/validate-cli # M4 trace
```

## Rollback Plan

1. Revert the implementation commits on `feat/validate-cli`
   branch (4 commits per Req. 4: 2 tests + 2 impls).
2. `npm test` passes on prior tree (18/18 baseline restored).
3. No data migration. No `runtime/**` touched; no upgrade-
   triggered consumer impact.
4. If a published v0.10.0 needs to be rolled back: standard
   npm process (deprecate the version + publish a v0.10.1
   with reverted code).

## Open Questions

Feature-level questions resolved during this spec drafting:

**Resolved here:**

- **Q1 — Task decomposition.** **Decision: 2 tasks.**
  - **Task 1**: `src/validate.js` module + unit tests
    (Tests 1–5 of Req. 4). `TDD-Applies: true`.
  - **Task 2**: `bin/cli.js` wiring + dogfood smoke test
    (Test 6). `TDD-Applies: true`.
  Tasks run sequentially (Task 2 depends on Task 1's
  module existing).
- **Q2 — Markdown parsing approach.** **Decision: regex,
  zero new deps.** Spec details the specific patterns in
  Req. 1.
- **Q3 — Branch naming.** **Decision: `feat/validate-cli`.**
  Non-runtime-scoped; standard feature branch convention.
- **Q4 — Version bump.** **Decision: v0.9.0 → v0.10.0**
  (MINOR; new command, fully additive).

**Deferred to implementation (small mechanics):**

- Exact wording of error / warning messages — keep terse,
  one line each, format `<file>: <type>: <details>`.
- Specific JSON field naming for error/warning records —
  match camelCase project convention (already used in
  other src/* files).
- Whether tests use `node:test` test files or extend
  `init.test.js` — use a new `validate.test.js` for clarity.

## Process notes

- Branch: `feat/validate-cli`.
- **Not** runtime-scoped → preflight hook does not fire.
- Commit structure (M4 demonstration!):
  - **Commit 1 (T1-test)**: `test(validate): unit tests for
    src/validate.js (red)` — the test file exists; running
    asserts fail because src/validate.js doesn't exist yet.
  - **Commit 2 (T1-impl)**: `feat(validate): src/validate.js
    module (green)` — module added; T1 tests pass.
  - **Commit 3 (T2-test)**: `test(cli): integration test for
    validate subcommand (red)` — integration tests fail (CLI
    doesn't route to validate yet).
  - **Commit 4 (T2-impl)**: `feat(cli): wire validate
    subcommand (green)` — dispatcher updated; all tests pass.
  - **Commit 5**: `chore: v0.10.0 — validate command (ship
    metadata)` — version + README + CHANGELOG bump.
  - **Commit 6**: `docs(review): v0.10.0 validate CLI —
    APPROVED` — review file (includes M4 audit table).
- **M4 audit method**: after Commit 4, run `git log
  --pretty='%ai %h %s' feat/validate-cli` and confirm Commit
  1 timestamp < Commit 2 timestamp, Commit 3 timestamp <
  Commit 4 timestamp. Two test-first pairs = 2 data points,
  100% test-first ordering for this feature. Audit recorded
  in Commit 6's review.
- Version: v0.9.0 → **v0.10.0**.
