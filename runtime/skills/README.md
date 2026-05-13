# Runtime Skills

This directory hosts reusable implementation skills. Each skill is a
single `SKILL.md` documenting the rules an agent should follow when
implementing a specific kind of work.

## Directory layout

```txt
.ai/runtime/skills/
├── _template/
│   └── SKILL.md                          # template — copy from here
├── <stack>/                              # tech-stack-scoped
│   └── <skill-name>/
│       └── SKILL.md
└── <domain>/                             # domain-scoped (when stack-agnostic)
    └── <skill-name>/
        └── SKILL.md
```

Naming:

- `<stack>` examples: `node-express`, `python-fastapi`, `react`,
  `drizzle`. Use lowercase kebab-case.
- `<domain>` examples: `security`, `migrations`, `observability`.
- `<skill-name>` is a short noun phrase, lowercase kebab-case
  (`express-endpoint`, `auth-token-rotation`).

## When to create a skill

A new skill is worth authoring when ANY of:

- the same pattern has appeared in 3+ specs and would benefit from
  consolidation,
- a new tech stack is being adopted and its conventions differ from
  existing skills,
- a single complex pattern (e.g. atomic refresh-token rotation) is
  spec-relevant across multiple specs.

Do NOT create a skill for:

- a one-off implementation detail,
- a project-specific convention (those belong in
  `.ai/project/memory/`),
- a pure documentation pointer (a link in `INDEX.md` is enough).

## How skills get loaded

There are three loading paths, in decreasing order of strength:

1. **Workflow file** — `.ai/runtime/workflows/feature-development.md`
   tells executors to load "relevant skills". Strongest: the executor
   agent decides which skill is relevant.
2. **Context-loading rule** — `.ai/runtime/memory/runtime/context-loading.md`
   lists "related skills" under "Feature Implementation". Weaker:
   relies on the agent reading the rule and recognizing the match.
3. **Frontmatter signals (declarative)** — the skill's YAML
   frontmatter (`priority` / `pathPatterns` / `bashPatterns` /
   `promptSignals`) is read by the agent during context-loading.
   No runtime tooling reads or enforces it; it exists to help the
   agent judge relevance. Weakest of the three paths.

A spec whose work falls under an existing skill should reference the
skill in its §2 Scope, so reviewers can confirm the executor loaded
the right rules.

## Authoring a new skill — the workflow

1. **Open a spec** under `.ai/project/specs/YYYY-MM-DD-<name>/` whose
   §2 Scope lists the new skill's path (this is a runtime-scoped
   governance change per `SAFETY.md` § Runtime Tree Protection).
2. **Copy the template**: `cp .ai/runtime/skills/_template/SKILL.md
   .ai/runtime/skills/<stack>/<skill-name>/SKILL.md`. Make the
   target directories first.
3. **Fill in the frontmatter and the body sections.** Remove any
   optional body sections that don't apply. Pick a `priority`
   proportional to how stack-specific the trigger is. Frontmatter
   fields are declarative (see "How skills get loaded" path 3) —
   they describe when the skill applies; they do not auto-load
   anything.
4. **Register the skill** by adding a bullet to `INDEX.md`'s
   `## Skills` section.
5. **Add tests if applicable** — if the skill makes assertions that
   can be checked statically (e.g. "all routes return JSON"),
   consider adding a check script under `scripts/`.
6. **Verify**: `npm run verify` plus any skill-specific assertions.
7. **Review**: standard review file at
   `.ai/project/reviews/YYYY-MM-DD-<name>-review.md`.

## Modifying an existing skill

Same as authoring: a runtime-scoped spec, with §2 Scope listing the
modified SKILL.md path. If the modification changes how the skill is
applied to existing code (not just clarifying language), include in
the spec a note about whether existing code following the old skill
needs updating.
