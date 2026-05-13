# Runtime Mode

## Purpose

Define the current engineering operating mode.

AI agents should adapt behavior based on runtime mode.

---

## Available Modes

### FEATURE_DEVELOPMENT

Focus:

- feature delivery
- execution speed
- additive work

Behavior:

- prioritize executable feature tasks
- prefer small incremental changes
- preserve contracts

---

### BUG_FIX

Focus:

- corrective change (observed vs documented behavior)
- minimal scope
- regression-test-first execution

Behavior:

- follow `.ai/runtime/workflows/bug-fix.md` strictly
- require Root Cause / Reproduction / Regression Test sections in spec
- write the regression test before the fix; confirm red → green
- prefer the smallest fix that addresses the named root cause
- preserve contracts; treat fixes as additive when possible

This mode is for non-incident corrective work. Production
incidents escalate to `INCIDENT` per
`RUNTIME_TRANSITIONS.md` § Any Mode → INCIDENT.

---

### GOVERNANCE_RECOVERY

Focus:

- workflow consistency
- verification coverage
- contract integrity
- runtime health

Behavior:

- prioritize maintenance tasks
- prioritize review coverage
- prioritize workflow repair

---

### REFACTOR

Focus:

- architecture consistency
- module boundaries
- technical debt reduction

Behavior:

- prioritize safe migrations
- minimize behavior changes
- prefer small refactor tasks

---

### INCIDENT

Focus:

- runtime stability
- rollback safety
- production recovery

Behavior:

- avoid unnecessary changes
- prioritize verification
- minimize scope
- avoid refactors

---

## Runtime Health Interaction

Runtime mode should adapt to runtime health.

Examples:

- YELLOW health limits risky refactors.
- RED health pauses feature expansion.
- GREEN health allows normal feature development.
