# Branching Workflow

## Purpose

Define when feature work must be done on a branch and how branches map onto the spec / plan / task / ADR lifecycle.

This workflow exists because `feature-development.md` previously specified commit conventions but said nothing about branching. The `user-system` feature exposed the gap: roadmap-scale features need long-lived branches and per-spec sub-branches to keep `main` deployable and reviewable.

---

## Branching Rules

Pick the smallest tier that fits the work.

### Tier 1 — Commit directly on `main`

Allowed for:

- ~20 lines of additive code or fewer
- no new dependencies
- no public API surface change beyond a single new additive route or field
- no ADR required
- no contract change beyond an additive endpoint section
- runtime mode does not change

Examples: `feat(readyz)`, `docs: ...`, `chore: ...` that touches only runtime metadata.

### Tier 2 — Single feature branch

Required for:

- any spec whose plan has more than one task
- any spec that introduces a new dependency
- any spec that changes existing response shapes
- any spec that requires an ADR (see Tier 3 if the ADR itself introduces architecture)
- any refactor that touches more than one module

Branch naming:

```
feat/<spec-id>
fix/<spec-id>
refactor/<spec-id>
chore/runtime-<topic>
```

`<spec-id>` is the spec directory name without the date prefix when unambiguous, or the full spec directory name when ambiguous.

Workflow:

1. Open the branch from latest `main`.
2. Commit per task or per coherent unit (executor + verifier + reviewer chain stays intact).
3. Merge to `main` only when all of the following are DONE: tasks, plan, review file, contract updates, `npm run verify`.
4. Use `--no-ff` merges so the feature boundary is preserved.

### Tier 3 — Roadmap feature with sub-spec branches

Required for any **roadmap spec** (a spec that decomposes into multiple child specs).

Structure:

```
main
 └── feat/<roadmap-id>                          ← long-lived branch
      ├── feat/<roadmap-id>--<sub-spec-1>       ← sub-branch, merges into long-lived
      ├── feat/<roadmap-id>--<sub-spec-2>
      └── feat/<roadmap-id>--<sub-spec-N>
```

**Sub-branch naming uses `--` (double dash) as the separator between the roadmap id and the sub-spec id**, not `/`. Git stores refs hierarchically: once `feat/<roadmap-id>` exists as a branch (a file under `.git/refs/heads/`), creating `feat/<roadmap-id>/<sub>` would require the same name to also be a directory, which git rejects with `cannot lock ref … exists`. The `--` separator keeps the visual hierarchy without colliding with the ref store.

Workflow:

1. Open `feat/<roadmap-id>` from latest `main`. The roadmap spec, the ADRs that justify the roadmap, and the roadmap plan land here as the first commit.
2. For each child spec, open `feat/<roadmap-id>--<sub-spec>` from the long-lived branch.
3. Each child sub-branch follows the full Spec → Plan → Tasks → Execute → Verify → Review → Commit lifecycle from `feature-development.md`.
4. Merge child branches into the long-lived branch with `--no-ff`. The long-lived branch must always pass `npm run verify`.
5. Merge the long-lived branch into `main` only when every child spec is DONE and the roadmap spec itself is marked DONE (or SUPERSEDED if scope evolved).
6. Rebase the long-lived branch on `main` if `main` advances during the roadmap, to keep history linear.

---

## Governance Rule Branches

Changes to `.ai/runtime/**` files (mode, health, workflows, capabilities, safety, priorities, lifecycle, agents, commands, templates, generic memory) are governance changes per `SAFETY.md` § Runtime Tree Protection. These must:

- live on a branch named `chore/runtime-<topic>`
- include a review file under `.ai/project/reviews/`
- be authorized by a spec under `.ai/project/specs/YYYY-MM-DD-<name>/` whose §2 Scope explicitly lists the touched `.ai/runtime/**` paths
- if introducing a new constraint, land on `main` BEFORE any feature work that relies on the new constraint
- never be combined with feature code in the same commit

Exception: trivial typo or wording fixes inside a single doc file may be Tier 1.

---

## Branch Hygiene

- Never force-push `main`.
- Never force-push a long-lived roadmap branch shared with other contributors.
- Force-push within an unmerged single-author feature branch is allowed if it improves review.
- Do not skip pre-commit or pre-push hooks unless explicitly authorized.
- Delete sub-spec branches after merge into the long-lived branch.
- Delete feature branches after merge into `main`.

---

## Mapping to runtime artifacts

| Branch tier | Required artifacts before merge |
|---|---|
| Tier 1 | conventional commit; updated task/plan/spec statuses if applicable |
| Tier 2 | spec APPROVED · plan DONE · all tasks DONE · review file · contracts updated · `npm run verify` passes |
| Tier 3 — sub-branch | same as Tier 2 |
| Tier 3 — long-lived | every child spec DONE; roadmap spec DONE or SUPERSEDED; aggregated review file optional |
| Governance branch | review file |

---

## Verification

`npm run verify` must pass:

- before merging any branch into `main`
- before merging any sub-spec branch into the long-lived roadmap branch
- on the long-lived branch after every sub-spec merge

If verification fails on the long-lived branch after a sub-spec merge, runtime health transitions to YELLOW or RED per `RUNTIME_TRANSITIONS.md`, and no further sub-spec merges are allowed until recovery.
