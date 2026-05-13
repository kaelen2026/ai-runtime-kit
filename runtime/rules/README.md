# Runtime Rules

This directory hosts language- and scope-scoped rules. Each rule is
a single `RULE.md` describing one always-on convention an agent
should follow when touching code in scope.

## Rules vs Skills

| | Skill | Rule |
| --- | --- | --- |
| Trigger | Task type (Express endpoint, Drizzle migration) | Language / file scope (`.ts`, `.sql`) |
| Loaded when | The current task matches the skill's purpose | The current task touches a file in scope |
| Example | "How to add an Express endpoint" | "Use `interface` for exported object types" |

If a guideline is task-conditional, it belongs in `skills/`. If it
applies to all code in a language, it belongs in `rules/`.

## Directory layout

```txt
.ai/runtime/rules/
├── _template/
│   └── RULE.md                       # template — copy from here
├── <language>/                       # e.g. typescript, sql, python
│   ├── README.md                     # index of rules for this language
│   └── <topic>.md                    # one rule per file
└── <scope>/                          # non-language scopes (e.g. http-api)
    └── <topic>.md
```

Naming:

- `<language>` and `<scope>` use lowercase kebab-case.
- `<topic>` is a short noun phrase (`types.md`, `exports.md`,
  `error-handling.md`).
- One rule per file. If a topic has multiple sub-rules, split into
  multiple files; do not stuff a single file.

## When to create a rule

A new rule is worth authoring when:

- a review repeatedly catches the same violation across 2+ PRs, OR
- a new language / framework is adopted and its idioms need
  capturing, OR
- a Biome rule does not encode a convention the project wants
  enforced (semantic vs syntactic).

Do NOT create a rule for:

- something Biome already enforces (cite the Biome rule in the
  config instead — keep the source of truth in `biome.json`),
- a project-specific convention tied to this codebase only (those
  belong in `.ai/project/memory/engineering/conventions.md`),
- a one-off architectural preference (those belong in
  `.ai/runtime/memory/architecture/principles.md` or in an ADR).

## How rules get loaded

Two loading paths, mirroring the skills system:

1. **Workflow file** — `.ai/runtime/workflows/feature-development.md`
   tells executors to load language rules matching modified files.
   Strongest.
2. **Context-loading rule** —
   `.ai/runtime/memory/runtime/context-loading.md` lists language
   rules under Feature Implementation. Weakest.

A spec whose work touches code in a rule's scope should let the
executor agent discover the rule automatically via path 1 or 2. No
explicit reference required in §2 Scope unless the spec ALSO
authors or modifies the rule itself.

## Severity convention

- **MUST** — violation blocks merge. Reviewer rejects.
- **SHOULD** — strong default. Requires explicit justification in
  the PR description / review file to deviate.
- **MAY** — preference. Apply when convenient; document in the
  review file when applied.

## Authoring a new rule — the workflow

1. **Open a spec** under `.ai/project/specs/YYYY-MM-DD-<name>/` whose
   §2 Scope lists the new rule's path. Runtime-scoped governance
   per `SAFETY.md` § Runtime Tree Protection.
2. **Copy the template**: `cp .ai/runtime/rules/_template/RULE.md
   .ai/runtime/rules/<language>/<topic>.md`. Create parent dirs.
3. **Fill in template** sections. Cite a concrete "why" with at
   least one incident or anti-pattern.
4. **Register** by adding a line to `INDEX.md`'s `## Rules`
   section listing the new rule + its severity.
5. **Verify**: `npm run verify`.
6. **Review**: standard review file under
   `.ai/project/reviews/`.

## Modifying an existing rule

Same as authoring. If severity changes (e.g. SHOULD → MUST), the
spec must list which existing code if any needs to be brought into
compliance and budget for that work.
