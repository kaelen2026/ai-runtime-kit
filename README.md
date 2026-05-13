# ai-runtime-kit

Reusable AI engineering runtime: BOOTSTRAP, workflows, safety, hooks,
and templates for software projects driven by AI agents.

## Status

**v0.1.0 — S1 skeleton.** The canonical `runtime/` snapshot is in
place; the `init` / `upgrade` CLI commands are not yet implemented
(owned by Phase 2 sub-spec S2).

The design spec lives in the kit's home project:

```text
ai-workflow-demo/.ai/project/specs/2026-05-13-phase-2-ai-runtime-kit-extraction/spec.md
```

## What this is

A package that provides the reusable framework half of an
`.ai/` engineering runtime — the same content that lives under
`.ai/runtime/` in projects that adopt this system. Project-specific
content (concrete rules, skills, hooks, project memory, ADRs, specs,
plans, tasks, reviews) lives in `.ai/project/` and is **not** part of
the kit.

```text
your-project/
├── .ai/
│   ├── runtime/    ← managed by the kit (read-only between upgrades)
│   └── project/    ← owned by your project
└── ...
```

## What ships in `runtime/`

- Top-level docs: `BOOTSTRAP.md`, `INDEX.md`, `CAPABILITIES.md`,
  `SAFETY.md`, `PRIORITIES.md`, `RUNTIME_HEALTH.md`, `RUNTIME_MODE.md`,
  `RUNTIME_TRANSITIONS.md`, `RUNTIME_VERSION.md`.
- `workflows/` — feature-development, bug-fix, branching.
- `agents/` — `executor.md` and `verifier.md` role definitions
  (the two roles that load a definition file; `architect`, `planner`,
  `reviewer` exist as transition concepts in workflows and hooks).
- `hooks/` — framework hook README + `_template/` + the one generic
  hook intrinsic to runtime governance:
  `pre-executor/runtime-scoped-preflight`. Project-specific hooks
  live under `.ai/project/hooks/`.
- `rules/` — framework README + `_template/`. No concrete rules
  ship; projects author their own under `.ai/project/rules/`.
- `skills/` — framework README + `_template/`. Same convention.
- Templates: `specs/_template/`, `specs/_template-bug-fix/`,
  `plans/_template.md`, `reviews/_template.md`, `tasks/_template.md`,
  `adr/0000-template.md`.
- `memory/runtime/context-loading.md`,
  `memory/architecture/principles.md`,
  `memory/engineering/principles.md`.
- `tasks/TASK_STATUS.md` (schema only).

## Usage (planned)

```bash
# Fresh project — lays down .ai/runtime/ and .ai/project/ skeleton
npx ai-runtime-kit init

# Existing project — upgrades .ai/runtime/ to the kit's current version
npx ai-runtime-kit upgrade

# Inspect
ai-runtime-kit --help
ai-runtime-kit --version
```

`init` and `upgrade` are **not yet implemented**. Until S2 lands,
the only working invocations are `--help` and `--version`.

## Versioning

Kit MAJOR is locked to the runtime version recorded in
`runtime/RUNTIME_VERSION.md`. Kit `1.x` adapts to runtime `v1`. A
kit MAJOR bump requires a `RUNTIME_VERSION.md` MAJOR bump (and an
unfreeze, since the runtime is currently Frozen at v1).

The pre-1.0 `0.x` versions are pre-publish; do not use them in
production projects.

## Local development

```bash
git clone <kit-repo>
cd ai-runtime-kit
npm link              # makes `ai-runtime-kit` available globally
ai-runtime-kit --help # verify
```

## License

MIT — see `LICENSE`.
