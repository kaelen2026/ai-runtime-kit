# Runtime Health

## Purpose

Define current runtime health state and required operational behavior.

---

## Health Levels

### GREEN

Meaning:

- runtime stable
- governance consistent
- verification passing
- safe to continue feature work

Allowed:

- feature work
- refactors
- task expansion
- runtime evolution

---

### YELLOW

Meaning:

- governance drift exists
- runtime inconsistencies detected
- maintenance required

Behavior:

- prioritize runtime maintenance
- prioritize governance repair
- reduce risky changes

Allowed:

- small features
- low-risk refactors
- workflow repair

Avoid:

- large migrations
- high-risk architectural changes

---

### RED

Meaning:

- verification failing
- runtime integrity compromised
- contract violations active
- runtime instability

Behavior:

- stop feature work
- prioritize recovery
- prioritize verification
- prioritize rollback safety

Allowed:

- fixes only
- recovery operations
- governance repair

Forbidden:

- major feature work
- large refactors
- runtime expansion

---

<!-- Current health values, drivers, and recovery goals live in
     .ai/project/STATE.md under ## Health. -->
