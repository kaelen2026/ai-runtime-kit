# Feature Spec: PRD template + write-a-prd dogfood skill

## Status

APPROVED

## Parent Feature

(none — pre-feature-layer)

## Goal

Introduce a Product Requirements Document (PRD) as a first-class
upstream artifact in the kit's workflow. Engineering specs answer
"how"; PRDs answer "what & why" for substantial product changes.
Today the kit collapses both into the engineering spec template,
which under-serves product-driven features.

Ship two pieces:

1. **Kit-shipped PRD template** at `runtime/prds/_template.md`
   (peer to `specs/`, `plans/`, `tasks/`, `reviews/`).
2. **Dogfood `write-a-prd` skill** at
   `.ai/project/skills/product/write-a-prd/SKILL.md` (this repo
   only — preserves the kit's "zero concrete skills" promise).

## Scope

<!-- This spec is RUNTIME-SCOPED. Includes paths under
     runtime/**, so the pre-executor/runtime-scoped-preflight
     gate applies per .ai/runtime/SAFETY.md § Runtime Tree
     Protection. Acknowledged. -->

Includes:

- **runtime/** (governance-protected):
  - `runtime/prds/_template.md` — new template, DRAFT/APPROVED/
    REJECTED/SUPERSEDED lifecycle mirroring specs.
  - `runtime/INDEX.md` — add `## PRDs` section immediately
    BEFORE `## Specs`, reflecting workflow chronology
    (PRD → Spec → Plan → Tasks → Review).
  - `runtime/workflows/feature-development.md` — add a "Step 0:
    Define PRD (optional, for product-driven features)" preceding
    the existing "1. Define Spec". Bug-fix workflow untouched (PRDs
    don't apply to corrective work).
- **Kit code** (not governance-protected):
  - `src/init.js` `PROJECT_SKELETON_DIRS` — add `'prds'` so
    `.ai/project/prds/` is created during fresh init.
  - `test/init.test.js` — assert `.ai/project/prds/` is created.
- **Project-side** (this repo's dogfood only):
  - `.ai/project/skills/product/write-a-prd/SKILL.md` — skill that
    triggers when the user wants to draft a PRD; instructs the
    agent to copy the template, fill it in, and place it under
    `.ai/project/prds/YYYY-MM-DD-<slug>/prd.md`.

Excludes:

- Making PRDs mandatory upstream of specs (kept optional —
  prescription is premature without consumer feedback).
- Promoting `write-a-prd` to a kit-shipped skill (would break v0.x
  "zero concrete skills" promise; revisit in v1.0 if multiple
  consumers want it).
- Migration for existing v0.4.x consumers (the new `prds/` dir is
  additive; `upgrade` will ADD it via standard snapshot diff with
  no special-casing needed — verified during impl).
- A `write-a-prd` slash command / Claude-Code-skill installation.
  The project-side SKILL.md is loaded by the kit's own convention
  (agent reads `.ai/project/skills/**` during context loading per
  feature-development.md). Cross-platform agent integrations are
  out of scope for this spec.

## Requirements

1. `runtime/prds/_template.md` exists with the following sections:
   - YAML-ish frontmatter or top-of-file `## Status` block
     supporting DRAFT/APPROVED/REJECTED/SUPERSEDED (match the
     existing spec template's `## Status` style for consistency).
   - **Problem** — what user/business problem is being solved.
   - **Target users** — who feels this and how often.
   - **Success metrics** — observable signals that the PRD has
     been satisfied post-ship (not "the code compiles" — actual
     product-level metrics or qualitative outcomes).
   - **User stories** — at least two "as a X, I want Y, so that
     Z" entries.
   - **Out of scope** — explicit non-goals.
   - **Open questions** — unresolved decisions blocking sign-off.
   - **Stakeholders** — owner, reviewer(s), consumer(s) of the
     output.
   - No engineering details (architecture, data flow, code
     contracts) — those belong in the downstream spec.
2. `runtime/INDEX.md` has a `## PRDs` section placed immediately
   BEFORE Specs (PRDs precede specs in workflow order), pointing
   to `runtime/prds/_template.md` and `.ai/project/prds/`
   (instance).
3. `runtime/workflows/feature-development.md` has a new Step 0
   that:
   - Is explicitly optional ("for product-driven features").
   - Names the project-side path:
     `.ai/project/prds/YYYY-MM-DD-<slug>/prd.md`.
   - Notes that the downstream spec should reference the PRD by
     path (so review can verify the spec satisfies its PRD).
   - Does NOT change the spec / plan / task / review pipeline
     downstream.
4. `src/init.js` adds `'prds'` to `PROJECT_SKELETON_DIRS`. Init
   tests cover the new dir.
5. `.ai/project/skills/product/write-a-prd/SKILL.md` follows the
   kit's `runtime/skills/_template/SKILL.md` format:
   - Frontmatter: `name: write-a-prd`, `description`, `priority`,
     `promptSignals.phrases` including phrases like
     "write a PRD", "draft a PRD", "需求文档", etc.
   - Body: workflow steps — copy template, generate slug, fill
     fields conversationally, save to
     `.ai/project/prds/YYYY-MM-DD-<slug>/prd.md`, leave Status as
     DRAFT.

## Acceptance Criteria

- `runtime/prds/_template.md` exists; `cat` shows all 7 required
  sections.
- `runtime/INDEX.md` has `## PRDs` section placed immediately
  BEFORE Specs;
  paths resolve.
- `runtime/workflows/feature-development.md` has Step 0; subsequent
  step numbers remain consistent (or use 1a/1b style).
- Fresh `init` in a `mkdtemp` fixture creates
  `.ai/project/prds/` as an empty directory.
- `upgrade` from v0.4.1 → v0.5.0 in a fixture reports the new
  files as ADDs in the diff (no special-case logic needed in the
  diff classifier — verifies the existing diff machinery handles
  new top-level dirs cleanly).
- `.ai/project/skills/product/write-a-prd/SKILL.md` exists in this
  repo and matches the skill template format.
- All existing tests pass.

## Test Checklist

- [ ] Unit: init creates `.ai/project/prds/`.
- [ ] Unit: PRD template file exists in the kit snapshot
      (file-existence smoke check).
- [ ] Integration: upgrade from synthetic v0.4.1-shaped fixture
      reports PRD template as an ADD.
- [ ] Manual: read the dogfood SKILL.md alongside
      `runtime/skills/_template/SKILL.md` — confirm format match.
- [ ] Manual: invoke the skill conversationally ("write a PRD for
      X") and confirm the agent produces a file at the documented
      path with all sections filled.

## Verification Commands

```bash
npm test
node bin/cli.js init --cwd "$(mktemp -d)"  # check .ai/project/prds/ exists
node bin/cli.js upgrade --yes --no-diff    # refresh local snapshot
```

## Rollback Plan

1. Revert the implementation commit(s).
2. `npm test` should pass on the prior tree (v0.4.1).
3. No data migration: `runtime/prds/` removal cascades through
   `upgrade` (existing consumers who already ran the upgrade get
   the dir REMOVEd on revert-then-upgrade; their `.ai/project/prds/`
   is preserved because upgrade never touches the project tree).
4. The dogfood SKILL.md can be deleted independently (project-
   side, not coupled to the kit's snapshot).

## Open Questions

- **Lifecycle states for PRDs**: should PRDs support the same 4
  states as specs (DRAFT/APPROVED/REJECTED/SUPERSEDED)? Lean YES
  — same pattern, same reviewer mental model. Recorded in
  Requirement #1.
- **Does upgrade need a callout for the new dir?** Probably not —
  the existing ADD/REPLACE/DELETE diff already surfaces it. If
  consumer confusion shows up in the v0.5.0 dogfood, revisit.
- **Version bump**: MINOR (`v0.5.0`). New top-level runtime dir
  + workflow change is meaningful enough to bump past v0.4.x.
- **Should the kit ALSO ship a stub `runtime/skills/product/`
  directory** to make the dogfood skill's path-shape easier to
  copy? Lean NO — empty dirs aren't tracked by git anyway, and the
  consumer already gets a `.ai/project/skills/` to mirror.
