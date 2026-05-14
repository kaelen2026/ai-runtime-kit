# Project Runtime State

This file holds the current instance values for runtime metadata
whose definitions live in `.ai/runtime/`. Reading this file plus
the corresponding runtime file is equivalent to reading the
single-file version.

## Mode

FEATURE_DEVELOPMENT

### Runtime Intent

Current focus:

- Stabilize v0.x CLI surface (`init`, `upgrade`) ahead of first npm publish.
- Dogfood the kit against itself so feedback loops on `runtime/` changes are immediate.
- Keep the `runtime/` snapshot lean: zero concrete rules/skills/hooks except the
  one safety-intrinsic `pre-executor/runtime-scoped-preflight` gate.

## Health

GREEN

### Health Drivers

Reasons:

- All 8 smoke tests in `test/` pass (`node --test test/*.test.js`).
- Working tree clean at v0.3.0 tag; both S3-discovered quirks (`init --migrate`
  tolerating empty `.ai/runtime/`, `upgrade --pager`) are fixed and covered.
- First external dogfood consumer (ai-workflow-demo) successfully migrated to
  v0.2.0 via the documented `init --migrate` path.
- Kit MAJOR is locked to runtime v1 and runtime v1 is Frozen, so the
  upgrade contract is stable within v0.x.

### Recovery Goals

Degraders → recovery:

- Smoke tests fail → drop to YELLOW; fix in `test/` before any `runtime/` change.
- A breaking change to `runtime/` (file removed/renamed in a way that breaks
  existing consumers) lands without a kit MAJOR bump → RED; revert or ship the
  MAJOR before another release.
- `init` or `upgrade` produces a divergent `.ai/runtime/` vs the source
  `runtime/` (snapshot drift) → YELLOW; re-run `upgrade` against a clean
  fixture and reconcile.
- Published npm version diverges from `package.json` / `runtime/RUNTIME_VERSION.md`
  → YELLOW; cut a patch release that re-aligns.

## Priorities

Current runtime health:

- GREEN

Current priority focus:

- Prepare and execute first npm publish (`npm publish --access public`); switch
  README walkthroughs from `npm link` to `npx ai-runtime-kit@<version>`.
- Watch the dogfood loop here and in ai-workflow-demo for v0.3.x quirks; fold
  fixes into the next patch.
- Defer runtime v2 work until a concrete consumer need surfaces — runtime v1
  stays Frozen.
