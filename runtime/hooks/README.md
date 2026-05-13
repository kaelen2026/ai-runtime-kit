# Runtime Hooks

This directory hosts **agent-pipeline transition hooks**. Each hook
is a single `HOOK.md` describing one boundary contract between two
agents in the recommended agent flow
(`INDEX.md` § "Recommended Agent Flow").

## Hooks vs Skills vs Rules vs Events

| | Skill | Rule | Event | Hook |
| --- | --- | --- | --- | --- |
| Trigger | Task type | File scope | Runtime state change | Agent transition |
| Loaded when | Task matches the skill's purpose | Task touches files in scope | Something happened | Pipeline reaches a transition matching `appliesWhen` |
| Tense | "How to do X" | "Always do X in scope Y" | "X just happened" | "Before/after agent N runs, do X if condition" |
| Example | "How to add an Express endpoint" | "Never use `any` in `.ts` files" | `VERIFICATION_FAILED` | "Before Executor starts on a runtime-scoped spec, snapshot baseline tests" |

If a guideline is task-conditional, it's a `skill`.
If it applies whenever code in a language is touched, it's a `rule`.
If it's a post-fact narration of state change, it's an `event`.
If it gates the handoff between two agents, it's a `hook`.

## Hooks vs Git hooks

This directory is **unrelated** to the Husky pre-commit / pre-push /
commit-msg hooks documented in `ADR-0006` and
`.ai/project/memory/core/tech-stack.md`. Those are git-level
toolchain hooks; these are agent-pipeline orchestration hooks. The
two systems do not interact.

## Directory layout

```txt
.ai/runtime/hooks/
├── _template/
│   └── HOOK.md                                # template — copy from here
├── pre-architect/    <hook-name>/HOOK.md
├── post-architect/   <hook-name>/HOOK.md
├── pre-planner/      <hook-name>/HOOK.md
├── post-planner/     <hook-name>/HOOK.md
├── pre-executor/     <hook-name>/HOOK.md
├── post-executor/    <hook-name>/HOOK.md
├── pre-verifier/     <hook-name>/HOOK.md
├── post-verifier/    <hook-name>/HOOK.md
├── pre-reviewer/     <hook-name>/HOOK.md
└── post-reviewer/    <hook-name>/HOOK.md
```

Naming:

- `<hook-name>` is a short noun phrase in lowercase kebab-case
  (`baseline-snapshot`, `contract-change-followup`,
  `runtime-edit-followup`).
- One hook per directory; one `HOOK.md` per hook. If a transition
  has multiple distinct concerns, split into multiple hook
  directories under the same `<phase>-<agent>/` parent.
- Phase-agent directories are created lazily — do not pre-seed empty
  directories.

## Trigger taxonomy

A hook attaches to exactly one transition. Transitions are:

| Phase | Agent | Meaning |
| --- | --- | --- |
| `pre` | architect | Before spec drafting begins |
| `post` | architect | After spec is drafted but before plan |
| `pre` | planner | Before task graph is produced |
| `post` | planner | After plan exists but before execution |
| `pre` | executor | Before code edits begin |
| `post` | executor | After edits but before verification |
| `pre` | verifier | Before verification commands run |
| `post` | verifier | After verification result is known |
| `pre` | reviewer | Before review file is written |
| `post` | reviewer | After review file is written |

There are no hooks for `INCIDENT` or `GOVERNANCE_RECOVERY` agents
because those modes follow `SAFETY.md` directly and bypass the
recommended flow; introducing hooks for them is out of scope here.

## Gate behavior

Three levels, in increasing strictness:

- **ADVISORY** — the hook's action runs; its outcome is logged in
  the review file. The transition proceeds regardless.
- **GATE** — if the action fails or is skipped, the downstream
  agent MUST NOT start. The blocking condition must be recorded in
  the review file (or, if review is downstream of this hook, in the
  task/spec file).
- **MUTATION** — the action produces a required artifact (file,
  status update, log). The transition is blocked until the artifact
  exists. The artifact path is named in the hook's `## Outputs`
  section.

Pick the weakest level that captures the contract. Inflation to GATE
or MUTATION requires a documented incident or contract risk.

## When to create a hook

A new hook is worth authoring when ANY of:

- a review has caught the same boundary-handoff mistake across 2+
  specs (e.g. "Executor began before Verifier captured a baseline"),
- a runtime-protection rule (`SAFETY.md`) needs a checkable handoff
  contract to actually be observable in practice,
- a recurring agent-orchestration pattern emerges that is too
  structural to live in a workflow file's prose.

Do NOT create a hook for:

- a one-off boundary concern (note it in the spec's §11 Resolved
  Decisions instead),
- something a workflow file's prose already enforces clearly
  (`feature-development.md` § "Verify"),
- a project-specific convention (those belong in
  `.ai/project/memory/`),
- a code-pattern concern (that's a skill or rule).

## How hooks get loaded

Three loading paths, mirroring the skills system:

1. **Workflow file** — `.ai/runtime/workflows/feature-development.md`
   tells each agent step to load relevant hooks for its phase.
   Strongest current path.
2. **Context-loading rule** —
   `.ai/runtime/memory/runtime/context-loading.md` lists hooks under
   Feature Implementation and Review.
3. **Frontmatter signals (declarative)** — the hook's
   `appliesWhen.pathPatterns` / `specSignals` / `runtimeModes` are
   read by the agent during context-loading to judge applicability.
   No runtime tooling reads or enforces these; they exist to help
   agents filter. Weakest path.

A spec whose work falls into a hook's `appliesWhen` does NOT need to
reference the hook in §2 Scope explicitly — context-loading paths 1
and 2 handle discovery. A spec that AUTHORS or MODIFIES a hook MUST
list the hook's path in §2 Scope (runtime-scoped governance per
`SAFETY.md` § Runtime Tree Protection).

## Authoring a new hook — the workflow

1. **Open a spec** under `.ai/project/specs/YYYY-MM-DD-<name>/` whose
   §2 Scope lists the new hook's path. Runtime-scoped governance
   per `SAFETY.md` § Runtime Tree Protection.
2. **Copy the template**: `cp .ai/runtime/hooks/_template/HOOK.md
   .ai/runtime/hooks/<phase>-<agent>/<hook-name>/HOOK.md`. Create
   parent dirs.
3. **Fill in frontmatter and body sections.** Pick the weakest gate
   level that captures the contract. Cite a concrete "why" with at
   least one incident or anti-pattern.
4. **Register the hook** by adding a bullet to `INDEX.md`'s
   `## Hooks` section.
5. **Verify**: `npm run verify`.
6. **Review**: standard review file under
   `.ai/project/reviews/`.

## Modifying an existing hook

Same as authoring: a runtime-scoped spec, with §2 Scope listing the
modified `HOOK.md` path. If the modification changes gate behavior
(e.g. ADVISORY → GATE), the spec must list which in-flight specs
would have been blocked by the new gate and budget for that impact.
