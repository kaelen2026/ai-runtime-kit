# Runtime Capabilities

## Purpose

Describe the capabilities currently supported by the AI engineering runtime.

AI agents should use this file to:

- discover runtime features
- understand supported workflows
- avoid unsupported operations

---

## Supported Capabilities

### Feature Development

Supported:

- spec-driven development
- plan-driven execution
- task-based implementation
- verification workflow
- review workflow

Status:

- stable

---

### Governance

Supported:

- contract verification
- review coverage
- task lifecycle management
- spec lifecycle management
- runtime health audit

Status:

- stable

---

### Refactor Work

Supported:

- behavior-preserving refactors
- incremental migrations
- module extraction
- runtime-safe restructuring

Status:

- stable

---

### Runtime Orchestration

Supported:

- task discovery
- dependency analysis
- runtime prioritization
- runtime mode behavior
- runtime bootstrap

Status:

- experimental

Note: bootstrap loading and runtime-mode behavior are
deterministic; task discovery, dependency analysis, and
prioritization remain agent-judgement.

---

### Verification

Supported:

- build verification
- test verification
- contract verification
- runtime audit

Status:

- stable

---

### Memory System

Supported:

- hierarchical runtime memory
- context-aware loading
- runtime context strategy

Status:

- stable

---

## Unsupported Capabilities

Currently unsupported:

- parallel task execution
- automatic task scheduling
- automatic PR generation
- automatic ADR approval
- automatic dependency graph visualization
- runtime persistence outside repository

---

## Runtime Constraints

- Runtime is repository-local.
- Governance requires explicit artifacts.
- Verification is mandatory.
- Contracts override implementation convenience.
- Runtime health should remain GREEN whenever possible.

---

## Recommended Execution Model

```txt
Spec
↓
Plan
↓
Task Graph
↓
Execution
↓
Verification
↓
Review
↓
Commit
```

### Safety Model

Supported:

- governance-aware execution

- protected operation detection

- runtime safety boundaries

Status:

- stable
