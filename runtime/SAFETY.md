# Runtime Safety Rules

## Purpose

Define repository safety boundaries for AI agents.

AI agents must follow these rules before modifying the repository.

---

## Safe Operations

Allowed without additional approval:

- additive feature work
- behavior-preserving refactors
- test additions
- review additions
- documentation updates
- task status updates
- plan updates
- review updates

---

## Protected Operations

Require explicit review or approval:

- contract changes
- breaking API changes
- runtime governance changes
- bootstrap changes
- priority system changes
- task lifecycle changes
- runtime mode changes
- verification policy changes

---

### Runtime Tree Protection

The path scope `.ai/runtime/**` is a protected zone. It holds reusable
framework content (protocols, schemas, role definitions, generic
memory, workflows, templates) that other projects consume verbatim
once Phase 2 of the runtime extraction ships
(`ai-runtime-kit`).

#### What counts as a runtime edit

Any of the following actions targeting `.ai/runtime/**`:

- modifying an existing file
- adding a new file
- renaming or moving a file
- deleting a file

#### Rule

Runtime edits are governance changes. Each runtime edit requires:

- a spec under `.ai/project/specs/YYYY-MM-DD-<name>/` whose §2 Scope
  lists the touched runtime paths explicitly, and
- a review file under `.ai/project/reviews/`.

Runtime edits MUST NOT be folded into feature work whose scope is a
project module (e.g. `src/modules/auth/`).

#### Exemptions

- The Phase 2 `ai-runtime-kit init` / `upgrade` flow operates outside
  this rule — those commands materialize or replace the entire
  `.ai/runtime/` subtree as a unit and are the canonical source of
  truth. They do not constitute "edits" in the sense above.
- Pure read access (any agent loading a runtime file as context) is
  unconstrained.

#### Why

- Phase 2 upgrades reset `.ai/runtime/` to the kit's canonical state;
  edits made outside the spec-driven flow are lost.
- Project-specific knowledge that leaks into `runtime/` makes the
  framework non-reusable across other projects.
- Spec-driven flow is how the rest of this governance system catches
  regressions; runtime edits must use the same path.

---

## High-Risk Operations

Require ADR approval:

- deleting public APIs
- changing API response shapes
- removing contracts
- changing runtime architecture
- changing verification requirements
- removing governance artifacts
- changing task graph semantics

---

## Forbidden Operations

AI agents must NOT:

- bypass verification
- skip governance rules
- ignore contract violations
- silently change runtime behavior
- delete `.ai/` runtime structure
- remove reviews/verifications without reason
- execute destructive repository operations without approval

---

## Verification Safety

Before marking work DONE:

- verification must pass
- contracts must remain valid
- reviews must exist if required
- runtime health must not degrade

---

## Runtime Protection Priority

Priority order:

```txt
Safety
↓
Governance
↓
Contracts
↓
Verification
↓
Execution Speed
```

Safety always overrides convenience.

---

## Runtime Philosophy

The runtime should prefer:

- safe incremental change
- explicit governance
- observable workflow state
- reversible operations
- minimal surprise
