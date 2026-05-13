# AI Runtime Bootstrap

## Purpose

This file defines how AI agents should initialize and operate within the repository runtime.

All AI execution should begin here.

---

## Bootstrap Sequence

### Step 1: Read Runtime Index

Read:

```txt
.ai/runtime/INDEX.md
```

Understand:

- runtime structure
- governance model
- workflow organization

---

### Step 2: Read Runtime Capabilities

Read:

```txt
.ai/runtime/CAPABILITIES.md
```

Determine:

- supported operations
- unsupported operations
- runtime constraints

### Step 3: Read Runtime Mode

Read:

```txt
.ai/runtime/RUNTIME_MODE.md
```

Determine:

- current operating mode
- execution behavior expectations

---

### Step 4: Read Safety Rules

Read:

```txt
.ai/runtime/SAFETY.md
```

Determine:

- protected operations
- forbidden operations
- approval requirements

### Step 5: Read Priorities

Read:

```txt
.ai/runtime/PRIORITIES.md
```

Determine:

- current priority focus
- runtime urgency

---

### Step 6: Read Runtime Health

Read:

```txt
.ai/runtime/RUNTIME_HEALTH.md
```

Determine:

- current runtime stability
- allowed operation types
- runtime recovery priorities

### Step 7: Read Runtime Transitions

Read:

```txt

.ai/runtime/RUNTIME_TRANSITIONS.md
```

Determine:

- allowed runtime transitions
- escalation behavior
- recovery behavior

### Step 8: Read Context Loading Strategy

Read:

```txt
.ai/runtime/memory/runtime/context-loading.md
```

Determine:

- which memory layers to load
- which context to avoid loading

---

### Step 9: Read Active Workflow

Read the workflow file matching the current runtime mode:

| Runtime Mode | Workflow file |
| --- | --- |
| FEATURE_DEVELOPMENT | `.ai/runtime/workflows/feature-development.md` |
| BUG_FIX | `.ai/runtime/workflows/bug-fix.md` |
| GOVERNANCE_RECOVERY | `.ai/runtime/workflows/feature-development.md` (until a recovery-specific workflow exists) |
| REFACTOR | `.ai/runtime/workflows/feature-development.md` |
| INCIDENT | (no workflow file required; follow `SAFETY.md` only) |

Always also read `.ai/runtime/workflows/branching.md` regardless of mode — it
owns git-level rules (ref naming, branch tiers, merge gates) that apply
to every change.

Determine:

- spec lifecycle rules (`DRAFT → APPROVED → REJECTED → SUPERSEDED`)
- branch tiering rules
- merge gates

---

### Step 10: Load Relevant Memory

Examples:

#### Feature Work

Load:

- memory/core/
- memory/engineering/
- memory/product/

#### Refactor Work

Load:

- memory/architecture/
- memory/engineering/
- memory/runtime/

#### Governance Work

Load:

- memory/governance/
- memory/runtime/

---

### Step 11: Determine Workflow State

Read:

- task status system
- relevant tasks
- relevant plans
- relevant specs

Determine:

- executable tasks
- blocked tasks
- dependency chains
- workflow health

---

### Step 12: Execute Safely

Rules:

- preserve contracts
- preserve verification integrity
- preserve governance rules
- avoid unrelated changes
- stop on runtime tree edits

#### Runtime tree edits

If task execution requires modifying anything under `.ai/runtime/**`
and no authorizing runtime-scoped spec is present in the task's
referenced spec, STOP. Surface the situation to the user — runtime
edits are governance changes per `.ai/runtime/SAFETY.md` § Runtime
Tree Protection.

---

## Runtime Principles

- Prefer narrow context.
- Prefer incremental execution.
- Preserve workflow consistency.
- Preserve runtime health.
- Verification is mandatory.
- Contracts override convenience.
- Governance overrides speed.
