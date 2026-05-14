# Feature: Validate CLI

## Status

DRAFT

## Parent PRD

`.ai/project/prds/2026-05-14-validate-command/prd.md`

## Goal

Ship the `validate` CLI command per the parent PRD. Single
feature for the PRD — the PRD's scope is tight enough that
slicing further would create artificial seams. Implementation
adds a new `src/validate.js` module and a CLI dispatcher entry
in `bin/cli.js`.

This is the kit's **first src/** feature** to ship under the
v0.6.0+ PRD → Feature → Spec → Plan → Task → TDD →
Implement → Verify → Review workflow. Tasks touching `src/`
will carry `## TDD-Applies: true` and **must** follow workflow
Step 1.5 (failing-test commit before implementation commit) —
producing the kit's first real data point for the v0.6.0 PRD's
M4 metric.

## PRD Metrics Contributed

- **VM1** (clean-tree pass) — **primary**. `validate` exits 0
  on this kit's own `.ai/` tree post-v0.9.0; this feature is
  what produces that behavior.
- **VM2** (broken-tree fail) — **primary**. `validate` exits
  non-zero with a detailed report on synthetic broken
  fixtures; this feature ships the detection + reporting.
- **VM3** (test-first commit ordering ≥90% for this feature's
  src/** tasks) — **primary**. The TDD discipline is exercised
  on this feature's implementation; commits demonstrate
  test-before-impl ordering per task.

## Scope

### Includes

- **Kit code** (not governance-protected; no runtime/** edits
  in v1):
  - `src/validate.js` (NEW) — pure-module validator.
    Exports a function that takes a project root path and
    returns a structured result (errors[], warnings[],
    summary counts per artifact type).
    - Walks `.ai/project/{prds,features,specs,plans,tasks,reviews}/**`.
    - For each file, parses the markdown to extract the
      required `## Parent <Type>` section(s) per the
      artifact type (rules per the v0.9.0 INDEX § Traceability
      table).
    - Reports missing required sections as **errors**.
    - Reports cited parent paths that don't resolve on disk
      as **errors**.
    - Reports anomalies (unexpected Status value, empty
      optional section, REJECTED upstream with non-terminal
      downstream) as **warnings**.
  - `bin/cli.js` — adds `validate` to the dispatcher; reads
    flags `--cwd <dir>` and `--json`; calls `src/validate.js`;
    formats output (human-readable default; JSON on `--json`);
    exits 0 on clean, non-zero on any error.
  - `test/validate.test.js` (NEW) — unit tests for the
    validator covering: clean fixture passes; broken fixture
    fails with specific error; missing parent section detected;
    broken parent path detected; warning-only cases exit 0;
    JSON output structurally correct.

### Excludes

Carry from parent PRD §Out of Scope + own:

- **Prose / semantic content** validation. Validate is
  structural only.
- **`--fix` auto-repair.** PRD OOS.
- **Downstream-direction validation** (PRD's `## Downstream
  Spec` section, feature's listed candidate features, etc.).
  Validate walks upstream parents, not downstream lists.
- **Validating runtime/** files** themselves. The kit's
  canonical snapshot is managed by `upgrade`; if `runtime/`
  is malformed the kit ships broken, which is a different
  failure mode.
- **Validating non-chain artifacts** (contracts /
  verifications / ADRs / memory / rules / skills / hooks).
  v1 scope = 6 chain artifact types only, per parent PRD Q4.
- **Performance optimization.** No benchmarking; if a huge
  `.ai/` tree slows the command, that's a future PRD.
- **CI/CD integration scripts** themselves.

## Acceptance

This feature is DONE when:

- `src/validate.js` exists and is unit-tested.
- `bin/cli.js` exposes a `validate` subcommand with the
  documented flags.
- Running `npx ai-runtime-kit validate` against this kit's own
  `.ai/` tree exits 0 (VM1 satisfied — the kit is the first
  clean-tree fixture).
- Running it against a synthetic broken-tree mkdtemp fixture
  exits non-zero with a per-artifact-error report (VM2
  satisfied).
- `validate --json` outputs valid JSON with the documented
  shape (errors[], warnings[], summary).
- Implementation tasks with `TDD-Applies: true` have their
  failing-test commit landed at an earlier timestamp than
  their corresponding implementation commit (VM3 — workflow
  Step 1.5 satisfied; producing the kit's first M4 data
  point).
- `npm test` passes.
- `npm pack --dry-run` shows the new files in the tarball.

## Open Questions

Feature-level open questions; spec-phase mechanics carry the
"(deferred to spec)" marker.

- **Exact task decomposition** for the implementation —
  one task per src file or one task per behavior? Lean:
  two tasks — Task 1 for `src/validate.js` (logic + unit
  tests); Task 2 for `bin/cli.js` wiring (integration tests).
  Both `TDD-Applies: true`. (deferred to spec)
- **Markdown parsing approach** — regex-based (no deps,
  brittle on edge cases) vs. small dependency (e.g., a
  parser like `remark`). Lean: regex — kit has zero runtime
  dependencies today; adding one for validate is significant.
  Spec confirms. (deferred to spec)
- **Branch naming** — this feature does NOT touch `runtime/**`
  in scope; therefore not subject to `chore/runtime-*`
  convention. Use `feat/validate-cli` instead. (deferred to
  spec implementation notes)
- **Version bump target** — v0.9.0 → v0.10.0 (MINOR; new
  command, additive). (deferred to spec)

## Downstream Spec

`.ai/project/specs/2026-05-14-validate-cli/spec.md` (pending)
