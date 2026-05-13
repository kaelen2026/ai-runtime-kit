# <Rule Name>

## Severity

MUST | SHOULD | MAY
<!-- MUST = lint-level violation; review must reject.
     SHOULD = strong default; require justification to deviate.
     MAY = preference; document when applied. -->

## When this rule applies

- Language: `<language>` (e.g. TypeScript, SQL, Python).
- File scope: `<glob>` (e.g. `src/**/*.ts`, `**/*.sql`).
- Trigger: any time a task modifies a file matching the scope.

Unlike skills, rules are NOT task-conditional — if a task touches a
file in scope, the rule applies.

---

## Rule

State the rule in one sentence. Imperative form.

Example: "Use `interface` for object types that are part of a
module's exported surface; use `type` for unions, intersections, or
type-level computation."

---

## Why

Why this rule exists. Cite a concrete failure mode or prior incident
where ignoring the rule would have caused a problem. Without a
documented "why", the rule has no defense when a future contributor
challenges it.

---

## Examples

### Compliant

```ts
// example of code that follows the rule
```

### Violating

```ts
// example of code that violates the rule
```

State briefly what's wrong with the violating example.

---

## Detection

How a reviewer (human or agent) catches a violation:

- Biome rule: `<rule-name>` (if applicable)
- grep / AST pattern (if no lint encoding exists)
- Manual: "reviewer reads diff and flags"

If the rule is fully mechanically enforced by Biome, note that and
keep this file as the human-readable rationale.

---

## Exceptions

(Optional.) Situations where the rule should not apply, with
justification. Each exception must be reproducible — vague "edge
cases may exist" is not an exception.
