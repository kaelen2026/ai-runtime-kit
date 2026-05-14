# Review: CLAUDE.md template orientation upgrade (v0.11.0)

## Parent Spec

`.ai/project/specs/2026-05-14-claude-md-orientation/spec.md`

---

Spec: `.ai/project/specs/2026-05-14-claude-md-orientation/spec.md`
Branch: `feat/claude-md-orientation`
Commits: `1b1bad5` (C1 test, RED), `2a48119` (C2 impl, GREEN),
`4de4330` (C3 ship metadata), this review = C4.

## Summary

Closes a real-world gap surfaced during the `example-todo`
walkthrough: a fresh agent landing on a kit-initialized
project couldn't orient from the v0.4.0-era CLAUDE.md
template. The template pointed only at `runtime/BOOTSTRAP.md`
and hadn't been touched as the kit grew through v0.5.x–v0.10.x
(9-phase pipeline, 8 agent role files, `## Parent <Type>`
traceability, governance branches, `validate` command).

v0.11.0 ships a new `agentEntryClaudeMd()` template with 6
numbered "On task start" steps. A fresh agent reading the
generated CLAUDE.md gets enough to start work without manual
per-phase orientation prompting.

## Verification

- `npm test` → **24/24 pass** (in-place CLAUDE.md test
  extension; existing test count unchanged).
- `node bin/cli.js init --cwd <tmpdir>` — generated CLAUDE.md
  contains all 6 numbered steps + 8 agent role file list.
  Manual smoke confirmed.
- `node bin/cli.js validate` on this repo's tree → PASS.

**Not runtime-scoped.** Branch `feat/claude-md-orientation`;
preflight hook did NOT fire (correct — no `runtime/**`
paths). First src/-touching feature since v0.10.0.

## M4 Audit (single TDD pair)

| Task | Test commit | Impl commit | Δ | Test-first? |
|---|---|---|---|---|
| Template orientation | `1b1bad5` 17:11:12 | `2a48119` 17:11:52 | +40s | ✓ |

**M4 score for this feature: 1/1 = 100% test-first ordering.**

Method:
```bash
git log --pretty='%ai %h %s' feat/claude-md-orientation
```

Cumulative session M4: 3/3 TDD pairs across v0.10.0 +
v0.11.0, 100% test-first.

## Acceptance Criteria

- [x] `agentEntryClaudeMd()` returns content matching Req. 1
      (6 numbered steps, 8 agent files, governance, validate).
- [x] `test/init.test.js` passes against new template.
- [x] `npm test` → 24/24.
- [x] Manual fresh-init smoke: CLAUDE.md carries new
      orientation content.
- [x] `validate` on this repo still PASS.
- [x] TDD audit: test-commit timestamp precedes impl-commit
      timestamp.

## Blocking Issues

None.

## Non-blocking Issues

- **This kit's own `CLAUDE.md` retains v0.4.0-era content**
  (per spec Req. 5 — deferred). The kit's CLAUDE.md has
  dogfood-specific notes ("this repo IS the kit source")
  that the generic template doesn't carry. Merging the two
  views needs design thought; flagged for v0.11.x.
- **Existing v0.10.x consumers don't auto-upgrade their
  CLAUDE.md.** `upgrade` never touches project-owned files;
  picking up the new orientation requires the consumer to
  manually replace their CLAUDE.md (or re-init in a tmpdir
  and copy). Documented in CHANGELOG § Process. A future
  `migrate-claude-md` subcommand could automate this if
  consumer demand surfaces.
- **The `## On task start` orientation duplicates content
  that also lives in `runtime/INDEX.md` § Workflow Overview**
  (added v0.10.2). Intentional duplication: CLAUDE.md is
  cwd-auto-loaded by Claude Code; INDEX.md requires a deliberate
  read. Both serve distinct entry points. Watch-item: if
  the lists drift apart, agents may get conflicting
  guidance. Future tooling could detect cross-file drift,
  but not in scope here.

## Suggested Fixes

- **Follow-up — `migrate-claude-md` subcommand** for existing
  consumers to pick up template changes without re-init.
  Defer until a consumer hits the friction (this kit's own
  example-todo is the first such case; will be manually
  migrated post-ship).
- **Follow-up — merge dogfood notes back into the kit's
  own CLAUDE.md.** Either by editing the kit's CLAUDE.md
  to include the new generic orientation block alongside
  the existing dogfood block, or by establishing a
  convention that consumers append project-specific notes
  below the generated block. v0.11.x candidate.
- **Carry forward** the v0.10.1 lesson (promote
  "size budgets are ranges, not hard caps") — still
  pending. v0.11.x or v0.12.0.

## Open Questions resolved

All 4 spec-stage questions resolved (engineering-only spec;
range 1500–3000 bytes for template body; BOOTSTRAP de-emphasis
in favor of INDEX § Workflow Overview; kit's own CLAUDE.md
deferred). One impl-stage decision made: kept code-fenced
examples out of the template (length-friendly).

## Process notes (dogfood reflections)

- **Real bug surfaced from real walkthrough.** The user
  started a new-session walkthrough of `example-todo`,
  hit the verbose orientation prompts, and immediately
  flagged that CLAUDE.md should carry that content. Direct
  consumer feedback in <30 seconds; spec drafted and shipped
  within ~20 minutes. The kit's own meta-dogfood loop
  worked: the kit was used → friction encountered →
  improvement spec'd and shipped in the same session.
- **Non-runtime-scoped TDD feature, second of the session**
  (after v0.10.0's validate-cli). The TDD discipline +
  feature branch convention scaled cleanly to the smaller
  scope (1 TDD pair vs validate-cli's 2).
- **Tenth governance/feature ship of the session.** Eight
  governance branches plus two feature branches (validate-cli,
  claude-md-orientation). Cumulative preflight: 9 fires,
  0 GATE failures (preflight does not fire on feature
  branches; correctly).
- **Run time**: ~12 minutes spec → Commit C4. Comparable to
  v0.10.2's 6-minute record but longer due to template-text
  drafting + assertion crafting.

## Verdict

Approved. Ready to merge into `main`, push, tag `v0.11.0`,
optionally publish to npm.

**Next step for `example-todo` walkthrough**: after v0.11.0
ships, manually overwrite `example-todo/CLAUDE.md` with the
new template content (copy from a fresh `init` in a tmpdir),
then resume the walkthrough with the tightened Step 0 prompt
("Read CLAUDE.md and confirm you're ready.").
