# Runtime Transition Rules

## Purpose

Define how runtime state changes in response to governance conditions.

---

## Health Transitions

### GREEN → YELLOW

Trigger conditions:

- governance drift detected
- stale runtime metadata
- missing review coverage
- inconsistent lifecycle state
- runtime audit warnings

Behavior changes:

- prioritize maintenance
- reduce risky changes
- increase governance focus

---

### YELLOW → RED

Trigger conditions:

- verification failure
- active contract violation
- failing build
- runtime instability
- broken bootstrap

Behavior changes:

- stop feature expansion
- prioritize recovery
- minimize execution scope

---

### RED → YELLOW

Trigger conditions:

- verification restored
- runtime stable
- critical failures resolved

Behavior changes:

- allow governance repair
- continue limited execution

---

### YELLOW → GREEN

Trigger conditions:

- governance stabilized
- runtime consistency restored
- verification healthy
- no active runtime drift

Behavior changes:

- allow feature development
- allow runtime evolution
- reduce governance overhead

---

## Mode Transitions

### FEATURE_DEVELOPMENT → GOVERNANCE_RECOVERY

Trigger conditions:

- runtime audit detects governance drift
- workflow inconsistencies accumulate
- verification coverage degrades

---

### GOVERNANCE_RECOVERY → FEATURE_DEVELOPMENT

Trigger conditions:

- governance stabilized
- runtime health GREEN
- workflow consistency restored

---

### FEATURE_DEVELOPMENT → BUG_FIX

Trigger conditions:

- a defect is observed in shipped behavior
- the change is corrective, not additive
- production incident has NOT been declared

---

### BUG_FIX → FEATURE_DEVELOPMENT

Trigger conditions:

- the fix is DONE per `bug-fix.md` § Definition of done
- no further corrective work is queued
- runtime health is GREEN

---

### Any Mode → INCIDENT

Trigger conditions:

- RED runtime health
- contract breach
- failed verification
- runtime instability

---

## Runtime Principle

Runtime state should evolve conservatively.

Prefer:

- gradual escalation
- explicit recovery
- observable transitions
- reversible operations
