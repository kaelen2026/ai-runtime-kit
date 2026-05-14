# Bug Fix Spec: <Short Name>

## Status

DRAFT
<!-- Allowed: DRAFT | APPROVED | REJECTED | SUPERSEDED.
     See .ai/runtime/workflows/bug-fix.md for lifecycle rules. -->

## Parent Feature

(none — bug-fix workflow)
<!-- Bug-fix workflow skips Step 0.5 (no feature slicing) — the
     fix is corrective, not a sliced PRD feature. Override with
     a real path only if the bug fix happens to be part of a
     larger PRD-driven effort. See .ai/runtime/INDEX.md
     § Traceability for the full chain. -->

## 1. Goal

Describe the corrective outcome in one paragraph. Focus on what
behavior changes, not how. Reference the affected user or system
behavior, not the implementation.

## 2. Scope

<!-- If any in-scope path is under .ai/runtime/**, this is a
     runtime-scoped governance change. Flag it explicitly and
     follow .ai/runtime/SAFETY.md § Runtime Tree Protection. -->

### In scope

-

### Out of scope

-

## 3. Root Cause

Name the underlying defect, not the symptom.

- **Cause:** <smallest accurate description of why the bug occurred>
- **Origin:** <commit hash, spec path, or design decision that
  introduced the cause; "unknown" if not traceable>
- **Locality:** local | systemic
  <!-- Systemic causes require a follow-up spec; link in §10. -->

If the root cause is genuinely unknown after investigation, write
"Unknown — best hypothesis: <X>" and state what evidence would
confirm or refute it.

## 4. Reproduction

Minimum steps a reviewer can run to observe the bug BEFORE the fix.

### Preconditions

-

### Steps

```bash
# exact commands or HTTP calls
```

### Observed (wrong) output

```
```

### Expected (correct) output

```
```

If the bug only reproduces in production, document the
trace/log/event ID and the time window here, and state explicitly
that local reproduction is not available.

## 5. Regression Test

The test that fails before the fix and passes after.

- **File:** `<path>` (new | modified)
- **Test name(s):** `<test name>`
- **Catching assertion:** <one line: which assertion fails before
  the fix>
- **Red proof:** <paste failing output OR link the commit that
  demonstrates red state>

Exception: pure documentation fixes (no behavior change) may write
"No regression test — documentation fix; §Acceptance Criteria greps
serve as the regression check".

## 6. Fix Strategy

One paragraph. The minimal change that addresses §3 Root Cause,
not the symptom.

## 7. Risks

-

## 8. Acceptance Criteria

- Regression test from §5 is present in the diff and passes.
- §4 Reproduction steps no longer reproduce the bug after the fix
  is applied.
- `npm run verify` passes.

## 9. Verification Commands

```bash
npm run verify
# plus any spec-specific assertions
```

## 10. Related Specs

-

## 11. Related ADRs

-

## 12. Rollback Plan

1.
2.
