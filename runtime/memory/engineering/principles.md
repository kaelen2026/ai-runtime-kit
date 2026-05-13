# Engineering Principles

Generic engineering principles for projects using this runtime.
Project-specific conventions (Biome configuration, commit-message
contract, persistence patterns) live in
`.ai/project/memory/engineering/conventions.md`.

## General Principles

- Keep implementations simple.
- Prefer readability over cleverness.
- Preserve backward compatibility for public APIs.
- Avoid unnecessary dependencies.
- Prefer small focused changes.
- Tests are required for public API changes.

---

## Project Structure

The project structure pattern in this runtime follows a composition
root + entry separation:

- One file owns app construction and route registration.
- One file owns process startup only.

Do not place route logic inside the startup file.

---

## API Design

- Responses must be JSON.
- Public API changes require contract updates.
- Breaking API changes require ADR approval.
- Additive changes are preferred over destructive changes.

---

## Testing

Requirements:

- Tests must not bind real network ports.
- Tests should validate response structure.
- Existing tests must continue passing.

(Specific test framework choices belong in project conventions.)

---

## Verification

Minimum required checks:

```bash
npm test
npm run build
```

---

## Contracts

Before modifying public APIs:

- read `.ai/project/contracts/**`
- preserve required fields
- preserve field types
- preserve backward compatibility

---

## ADR Rules

Create ADRs for:

- architecture changes
- breaking API changes
- major dependency decisions
- structural refactors

---

## Review Expectations

Reviews should check:

- correctness
- maintainability
- compatibility
- testing coverage
- architecture consistency

---

## Preferred Engineering Style

- explicit over implicit
- modular over monolithic
- stable over clever
- testable over tightly coupled
