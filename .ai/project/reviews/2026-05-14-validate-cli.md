# Review: Validate CLI (v0.10.0)

## Parent Spec

`.ai/project/specs/2026-05-14-validate-cli/spec.md`

---

PRD: `.ai/project/prds/2026-05-14-validate-command/prd.md`
Feature: `.ai/project/features/2026-05-14-validate-cli/feature.md`
Spec: `.ai/project/specs/2026-05-14-validate-cli/spec.md`
Branch: `feat/validate-cli`
Commits: 7 on the branch (`61c2cdb` retrofit, `1829a2e` T1-test,
`28bbd64` T1-impl, `f9d0f44` T2-test, `daddb5b` T2-impl,
`763fdb3` ship metadata, this review = C6).

## Summary

Kit's **first `src/**` feature shipped under the v0.6.0+
PRD → Feature → Spec → Plan → Task → TDD → Implement → Verify
→ Review pipeline** with `TDD-Applies: true` tasks. Two TDD
pairs (test-commit-before-impl-commit) at **100% test-first
ordering** — producing the kit's **first concrete M4 data
point**.

The `validate` command checks `.ai/project/` tree structural
integrity: every artifact carries its required
`## Parent <Type>` section per v0.9.0 INDEX § Traceability;
every cited parent path resolves to a real file on disk; every
`Status` value is in the allowed set. Reports errors and
warnings; exits 0 on clean, 1 on any error. `--json` for
machine-parseable output.

Validator's first run on this repo's own `.ai/` tree returned
**PASS** (after the C0 retrofit of 14 historical artifacts).
VM1 satisfied live on first ship.

## M4 Audit (the headline data point)

Per spec § Process notes, the M4 audit verifies the
test-commit timestamp precedes the corresponding
implementation-commit timestamp for each `TDD-Applies: true`
task.

| Task | Test commit | Impl commit | Δ | Test-first? |
|---|---|---|---|---|
| T1 (`src/validate.js`) | `1829a2e` 16:07:26 | `28bbd64` 16:08:21 | +55s | ✓ |
| T2 (`bin/cli.js`)      | `f9d0f44` 16:09:47 | `daddb5b` 16:11:53 | +2m6s | ✓ |

**M4 score: 2/2 = 100% test-first ordering on this feature.**

Method (reproducible):
```bash
git log --pretty='%ai %h %s' feat/validate-cli
# Visually verify T1-test timestamp < T1-impl timestamp,
# T2-test timestamp < T2-impl timestamp.
```

This is the first time the kit has empirically demonstrated
the v0.6.0 PRD's M4 metric on real `src/**` code. Until this
ship, M4 was a theoretical commitment; from this ship onward
it has a baseline.

## Verification

- `npm test` → **24/24 pass** (18 prior + 6 new tests in
  `test/validate.test.js`).
- `npm pack --dry-run` → 53 files / 57.9 kB; `src/validate.js`
  (7.3 kB) shipped in tarball.
- `node bin/cli.js validate` against this repo's tree:
  ```
  prds 3 / features 5 / specs 9 / plans 0 / tasks 0 / reviews 8
  Errors: none. Warnings: none. Result: PASS (clean tree).
  ```
  **VM1 satisfied live.**
- VM2 (broken-tree fail) satisfied by tests T2 + T3.
- VM3 (test-first ordering ≥90%) satisfied at 100% per M4
  audit above.

**Not runtime-scoped.** Branch was `feat/validate-cli`, not
`chore/runtime-*`. Preflight hook did not fire (correctly —
no `runtime/**` paths in scope). First non-runtime-scoped
feature shipped under the v0.6.0+ pipeline; demonstrates the
workflow correctly distinguishes governance-scoped from
kit-code-scoped work.

## Acceptance Criteria

- [x] `src/validate.js` exports `validate(projectRoot, options)`
      with documented return shape.
- [x] `bin/cli.js validate --help` prints documented usage.
- [x] Live dogfood: `validate` on this repo's `.ai/` tree
      exits 0 (VM1).
- [x] Synthetic broken fixture: `validate` exits 1 with
      detailed error report (VM2, via tests).
- [x] `--json` produces parseable JSON matching the schema
      (T5).
- [x] All tests pass (24/24).
- [x] `npm pack --dry-run` shows new files in tarball.
- [x] VM3 (M4): 2/2 test-first pairs at 100% — audit table
      above.

## Blocking Issues

None.

## Non-blocking Issues

- **`TASK_STATUS.md` exclusion is hard-coded.** The validator
  uses `EXCLUDED_FILENAMES = Set('TASK_STATUS.md')` as a
  one-element blocklist. If the kit ever adds another
  status-tracker file (e.g. a future `RUNTIME_STATUS.md` or
  similar), the set needs updating. A more elegant solution
  would be artifact-type-aware filtering at the spec level
  (e.g. only files matching `<slug>/task.md` are task
  instances). Watch-item; current implementation is
  good-enough for v1.
- **Retrofit was a mid-implementation spec amendment.**
  Third occurrence on this kit (v0.5.1, v0.7.0, now
  v0.10.0). Pattern: a spec excludes some prep work that
  turns out to be required for the metric to be reachable.
  Recorded the lesson in v0.7.0; clearly not yet internalized.
  Consider promoting "test the metric pre-impl" to a
  `spec-writer.md` Must Not bullet (similar to the
  size-budget rule from v0.8.1).
- **`(none — pre-feature-layer)` is a new rendering string**
  introduced by C0 retrofit. The v0.9.0 spec listed
  `(none — engineering-only)`, `(none — bug-fix workflow)`,
  and `(none — direct task)` as examples but said the
  general form was `(none — <reason>)` — so adding a fourth
  reason for retrofit is consistent. The validator's
  `isNoneRendering` check is `value.startsWith('(none')`
  which accepts any reason string. No spec amendment needed
  for this; just noting that the renderings have grown.
- **No human-readable output snapshot test.** The validator's
  human-readable output format (the per-artifact summary
  block + Errors/Warnings sections) is not asserted against
  by tests — only the JSON format is. A snapshot test could
  catch prose regressions, but introduces test fragility.
  Lean: skip; human output is for humans, structural
  guarantees via JSON.

## Suggested Fixes

- **Follow-up — `validate --since <commit>` or `--diff`**
  scoped validation. Useful for pre-commit / pre-merge hooks
  that only want to validate artifacts touched in the current
  change. Future feature.
- **Follow-up — `validate --check-downstream`** that walks
  PRD `## Downstream Spec` lists and feature `## Downstream
  Spec` paths to verify they resolve. Currently the validator
  is upstream-only.
- **Follow-up — externalize `EXCLUDED_FILENAMES`** to a
  config file (e.g. `.ai/project/.validate-ignore`) so
  consumers can extend without forking. Low priority unless
  a consumer hits a real need.
- **Carry forward** the v0.7.0 lesson (size-budget rule for
  `spec-writer.md`) PLUS now: **add a Must Not bullet to
  `spec-writer.md` about pre-flight verifying that
  acceptance criteria are achievable.** Three specs now
  amended mid-impl for this same class of issue (assuming
  the kit's state allows the metric without verifying).

## Open Questions resolved

All 4 feature-level open questions resolved in the spec
phase (Q1 tasks=2; Q2 regex; Q3 feat/* branch; Q4 v0.10.0).
Two implementation-mechanics decisions also resolved during
impl:
- Error/warning message format: `<file>: <type>: <details>`
- `EXCLUDED_FILENAMES` hardcoded with `TASK_STATUS.md` as
  the lone entry (rather than introducing config).

One new spec amendment recorded mid-impl: include retrofit
of 14 historical artifacts (7 specs + 7 reviews) so VM1
is reachable on this kit's tree. Recorded in spec §Status
with explanatory HTML comment.

## Process notes (dogfood reflections)

- **Kit's first src/** TDD-applicable feature.** The PRD →
  Feature → Spec → C0 retrofit → C1 test → C2 impl → C3 test
  → C4 impl → C5 ship → C6 review sequence took ~45 minutes
  end-to-end. Each TDD pair was decisively test-first by
  design (`git commit` for the test, run `npm test` to
  observe RED, then `git commit` for the impl, run to
  observe GREEN).
- **First non-runtime-scoped feature.** No preflight hook
  fire (the hook's `appliesWhen` correctly did not match —
  no `runtime/**` paths in scope). This validates that the
  governance hook isn't a friction tax on all kit-code
  work, only on governance changes.
- **Validator caught a real bug in itself during dogfood.**
  C4 included a fix for `TASK_STATUS.md` being mis-classified
  as a task instance. Without the live dogfood test (T6),
  this would have shipped broken. Test 6's role as
  "validate the tool against the real tree" produced value
  beyond synthetic fixtures.
- **C0 retrofit was the right call.** Without it, the
  validator would have reported 14 errors on its first
  dogfood run, even though the underlying convention
  (## Parent <Type>) was correct — those artifacts simply
  predated it. The honest fix was to retrofit, not to
  weaken the validator. Recorded in the spec amendment.
- **Third mid-impl spec amendment of the session.** Pattern
  is now clear: when a spec asserts a metric without
  verifying the necessary prep is in place, mid-impl
  amendment is the correction. Documented in §Suggested
  Fixes for promotion to spec-writer.md rule.

## Verdict

Approved. Ready to merge into `main`, push, tag `v0.10.0`,
and optionally publish to npm.

**Headline milestone**: first M4 data point shipped. The
v0.6.0 PRD's commitment to test-first ordering is no longer
aspirational — it has a baseline (100% on this feature) and
a reproducible audit method.
