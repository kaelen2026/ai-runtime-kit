# Feature Spec: CLAUDE.md template orientation upgrade

## Status

APPROVED
<!-- Self-approved per user "B" reply during example-todo
     walkthrough. Engineering-only; surfaced when a fresh
     agent in example-todo could not orient from the v0.4.0-era
     CLAUDE.md template (which didn't mention v0.5.x–v0.10.x
     additions like the 9-phase pipeline, agent role files,
     ## Parent <Type> chain, validate command). -->

## Parent Feature

(none — engineering-only)

## Goal

Update `src/templates.js`'s `agentEntryClaudeMd()` so that
fresh `ai-runtime-kit init` consumers receive a CLAUDE.md that
actually orients an agent to the kit's current (v0.10.2)
workflow without requiring per-task manual orientation prompts.

The current template (last meaningfully updated in v0.4.0)
points at `runtime/BOOTSTRAP.md` and `.ai/project/STATE.md` but
does not mention: the 9-phase pipeline; the 8 agent role files
under `runtime/agents/`; the `## Parent <Type>` traceability
chain; the runtime-scoped governance branch rule; or the
`ai-runtime-kit validate` command. A fresh agent reading the
current CLAUDE.md doesn't get enough to act — the operator has
to feed each phase's orientation manually.

## Scope

<!-- NOT runtime-scoped. Edits live in src/, test/, README,
     CHANGELOG, package.json. No runtime/** paths. Preflight
     hook does NOT fire. Branch: feat/claude-md-orientation. -->

Includes:

- **Kit code (TDD-Applies: true)**:
  - `src/templates.js` — `agentEntryClaudeMd()` returns a
    new template with 6 numbered "On task start" steps
    covering: workflow overview read, STATE.md read, role
    file selection, `## Parent <Type>` discipline, governance
    rule, verify-before-done. Plus a brief "Editing this
    file" footer preserving the existing project-owned note.
  - `test/init.test.js` — extend the existing "writes
    CLAUDE.md agent entry at project root" test to assert
    new content phrases (Workflow Overview, role files,
    governance branch, validate command). Drop or revise
    the BOOTSTRAP assertion since the new template
    de-emphasizes that single-pointer in favor of the broader
    orientation; keep one phrase asserting the file still
    points readers at the runtime tree somehow.

- **Ship metadata**:
  - `package.json` — version 0.10.2 → 0.11.0.
  - `CHANGELOG.md` — v0.11.0 entry.
  - `README.md` — Status section gains v0.11.0 lead.

Excludes:

- **Retrofitting CLAUDE.md in this kit's own repo.** The
  kit's own CLAUDE.md is dogfood and includes repo-specific
  notes ("this repo is the kit source"); replacing it with
  the new template would erase those. The kit's CLAUDE.md
  is updated **only if it brings net value** — see Req. 5.
- **Migrating example-todo's CLAUDE.md.** Out of this spec;
  user will overwrite manually after v0.11.0 ships, or via
  a separate one-shot.
- **A `migrate-claude-md` CLI subcommand.** Future feature
  if consumer demand surfaces.
- **Changing `runtime/**` files.** No runtime changes in
  scope.

## Requirements

1. **`agentEntryClaudeMd()` returns a template containing**:
   - `# CLAUDE.md` heading.
   - Opening paragraph naming `ai-runtime-kit`.
   - `## On task start` section with 6 numbered steps:
     1. Read `.ai/runtime/INDEX.md` § Workflow Overview.
     2. Read `.ai/project/STATE.md`.
     3. Identify workflow step + pick role file under
        `.ai/runtime/agents/<role>.md`; lists all 8 role
        files with their phase.
     4. Honor `## Parent <Type>` traceability per INDEX §
        Traceability; cite `(none — <reason>)` when an
        upstream is skipped.
     5. Respect governance: `chore/runtime-<topic>` branch
        + scope enumeration when editing `runtime/**`;
        `pre-executor/runtime-scoped-preflight` hook will
        block otherwise.
     6. Verify: `npm test` + `ai-runtime-kit validate`.
   - `## Editing this file` footer preserving the existing
     project-owned + upgrade-doesn't-touch note.

2. **Template body length** between ~1500 and ~3000 bytes
   (range, not hard cap — per v0.10.1 review's
   to-be-promoted lesson; the function returns a template
   string, not an agent role file, so the
   v0.5.1/v0.7.0/v0.10.1 ceilings don't apply).

3. **Existing init.test.js assertion for BOOTSTRAP** must be
   revised. The new template no longer points solely at
   BOOTSTRAP — it points at INDEX.md as the primary entry.
   The test should assert the template references the
   `.ai/runtime/` tree somehow (`runtime/INDEX.md` or
   `runtime/agents/` etc.) rather than checking for the
   specific string "BOOTSTRAP".

4. **TDD discipline**: this task's tasks are
   `TDD-Applies: true`. The test extension lands as a
   separate commit (RED — old template doesn't have new
   content) before the impl commit (GREEN — updated
   template). Single TDD pair.

5. **Kit's own `CLAUDE.md` retrofit** — defer. The kit
   repo's `CLAUDE.md` includes repo-specific dogfood notes
   (e.g. "this repo IS the kit source") that the generic
   template doesn't have. The trade-off (orient agents
   fully vs. preserve dogfood notes) needs a separate
   decision. Leave kit's CLAUDE.md untouched; spec author
   may revisit in v0.11.x.

## Acceptance Criteria

- `agentEntryClaudeMd()` returns content matching Req. 1.
- `test/init.test.js` passes against the new template.
- `npm test` → 24/24 (existing test count unchanged; the
  CLAUDE.md test extends in place).
- `npm pack --dry-run` shows updated `src/templates.js`.
- Manual: run `node bin/cli.js init --cwd $(mktemp -d)`;
  inspect the generated CLAUDE.md to confirm it carries
  the 6 numbered orientation steps + agent role file list.
- `node bin/cli.js validate` against this repo still
  returns PASS.
- TDD audit: test-commit timestamp precedes
  implementation-commit timestamp (`git log
  --pretty='%ai %h %s' feat/claude-md-orientation`).

## Test Checklist

- [ ] Init test extended in place; 24/24 still.
- [ ] Manual fresh-init smoke (mkdtemp).
- [ ] Manual: `validate` against this kit's tree still PASS.
- [ ] M4 audit: test commit < impl commit timestamp.

## Verification Commands

```bash
npm test
node bin/cli.js init --cwd "$(mktemp -d)"
node bin/cli.js validate
git log --pretty='%ai %h %s' feat/claude-md-orientation
```

## Rollback Plan

1. Revert commits on `feat/claude-md-orientation`.
2. Tests still 24/24; validate still PASS.
3. Consumer impact: v0.10.x users keep the old CLAUDE.md
   (which is project-owned — `upgrade` never touched it
   anyway); no breakage. New `init` consumers get the
   pre-v0.11.0 minimal template back.

## Open Questions

Resolved during spec drafting:

- **PRD vs engineering-only**: engineering-only. Scope is
  one template string + test extension; user surfaced the
  gap via direct feedback in conversation rather than
  through a product elicit.
- **Template length budget**: range 1500–3000 bytes (per
  v0.10.1 lesson; ranges, not hard caps).
- **BOOTSTRAP de-emphasis**: yes. INDEX.md § Workflow
  Overview (added in v0.10.2) is the better entry point;
  BOOTSTRAP still exists but the agent gets there via the
  INDEX read in step 1.
- **Kit's own CLAUDE.md retrofit**: deferred (see Req. 5).

**Deferred to implementation**:

- Exact wording of each numbered step (kept close to the
  draft proposed in conversation; may tighten during edit).
- Whether to include a code-fenced example of one
  `## Parent <Type>` section in the template body for
  illustration — likely skip to keep length down.

## Process notes

- Branch: `feat/claude-md-orientation`.
- Not runtime-scoped; preflight hook does NOT fire.
- Commit structure (TDD demonstration):
  - **C1 (test, RED)**: `test(templates): update CLAUDE.md
    assertions for new orientation content`. Test fails
    against current `agentEntryClaudeMd()`.
  - **C2 (impl, GREEN)**: `feat(templates): orient
    CLAUDE.md to 9-phase workflow (v0.11.0)`. Updated
    `agentEntryClaudeMd()` makes the test pass.
  - **C3 (ship metadata)**: version + CHANGELOG + README.
  - **C4 (review)**: this spec's review file with M4 audit
    note (1 TDD pair).
- Version: **v0.11.0** (MINOR — CLAUDE.md template changes
  user-visible output of `init`; additive for existing
  v0.10.x consumers whose CLAUDE.md is project-owned and
  untouched by upgrade).
- TDD-Applies trace: task class is "modify template string
  → init's output changes." That changes observable
  behavior for new consumers, so TDD-Applies = true (matches
  the F3 rule per parent-PRD OOS4's behavior-change
  definition).
