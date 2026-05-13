# Runtime Priorities

## Purpose

Define engineering priorities for AI workflow orchestration.

---

## Priority Levels

### P0

Critical:

- production breakage
- verification failure
- contract violation
- broken build
- security issue

Must be handled immediately.

---

### P1

High priority:

- blocked execution path
- broken workflow governance
- missing critical reviews
- architecture inconsistency
- major refactor coordination

Should be handled before new feature work.

---

### P2

Normal feature work:

- additive features
- refactors
- improvements
- non-critical maintenance

Default priority.

---

### P3

Low priority:

- cleanup
- optional improvements
- cosmetic refactors
- documentation polish

---

## Prioritization Rules

- P0 overrides all other work.
- BLOCKED tasks causing dependency chain failures become P1.
- Governance inconsistencies may become P1 if they affect execution safety.
- Refactors should not interrupt P0/P1 work.
- Prefer tasks that unblock future execution paths.

---

## Runtime Health Rules

If runtime health is:

- RED → prioritize governance/verification recovery
- YELLOW → prioritize workflow maintenance before large features
- GREEN → feature work may continue

---

<!-- Current runtime state and priority focus live in
     .ai/project/STATE.md under ## Priorities. -->
