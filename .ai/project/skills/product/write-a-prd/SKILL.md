---
name: write-a-prd
description: Drafts a Product Requirements Document from the kit's PRD template when the user wants to define a product-driven feature before engineering work begins.
metadata:
  priority: 7
  pathPatterns:
    - ".ai/project/prds/**/*.md"
  promptSignals:
    phrases:
      - "write a PRD"
      - "draft a PRD"
      - "write a product requirements doc"
      - "let's PRD this"
      - "需求文档"
      - "产品需求文档"
      - "写一份 PRD"
    anyOf:
      - "PRD"
      - "product requirements"
      - "需求文档"
      - "what & why"
    minScore: 5
---

# write-a-prd

Produces a PRD at `.ai/project/prds/YYYY-MM-DD-<slug>/prd.md` by
filling in the kit's PRD template from a conversation with the
user about the product problem they want to solve.

## 目标

- One filled-in PRD per invocation, ready for the user to mark
  APPROVED once they sign off on the open questions.
- The PRD must answer **what & why** only. Engineering details
  (architecture, API shape, data flow, code contracts) stay out
  — those belong to the downstream spec.
- All 7 body sections present and non-empty. Empty sections are
  worse than admitting "to be filled" in Open Questions.

## 输入 / 输出

- **输入**:
  - User's description of the problem / feature / desired
    outcome (conversational).
  - The kit's template at `.ai/runtime/prds/_template.md` — read
    this first to learn the section structure.
  - Project context: `.ai/project/STATE.md` (current mode,
    health, priorities) so the PRD can be framed against
    current focus.
  - Any existing PRDs or specs in `.ai/project/prds/` and
    `.ai/project/specs/` that touch related scope — link or
    flag them in Stakeholders or Out of Scope.
- **输出**:
  - File at `.ai/project/prds/YYYY-MM-DD-<slug>/prd.md`.
  - Slug is lowercase-kebab-case, ≤6 words, derived from the
    feature's user-facing name (not the implementation
    detail).
  - Status starts as `DRAFT`. The PRD becomes `APPROVED` only
    when the user explicitly signs off.

## 工作方式

1. **Read the template.** Open `.ai/runtime/prds/_template.md`
   to confirm the section list. Do not rely on memory — the
   template is the source of truth.
2. **Read project state.** Skim `.ai/project/STATE.md` so the
   PRD's framing fits current mode/health/priorities.
3. **Elicit the problem.** Ask the user (if not already
   clear) to describe the user-facing or business problem in
   their own words. Probe for evidence: who has complained,
   what data shows the gap, what missed opportunity exists.
   Avoid jumping to solutions in this step.
4. **Elicit target users.** Be specific. Push back gently on
   "developers" / "users" — ask for the narrower group that
   actually feels the problem.
5. **Propose success metrics.** Offer 2–4 candidates. At least
   one should be observable post-ship (a number, a rate, a
   behavioral change). Let the user trim or swap.
6. **Draft user stories.** Write ≥2 in the "As a <role>, I
   want <capability>, so that <outcome>" shape. The stories
   should be tight enough that a downstream spec's
   Requirements section can be checked against them.
7. **Identify out of scope explicitly.** Name 2–4 adjacent
   problems the PRD is NOT solving. Items here often become
   future PRDs — flag candidates for follow-up.
8. **Capture open questions.** Anything blocking sign-off
   becomes an entry here. Name the decider where possible.
   Never silently resolve an ambiguity by guessing.
9. **Identify stakeholders.** Owner (who shepherds the PRD to
   APPROVED), Reviewer(s) (who sign off), Consumer(s) of the
   output (who reads the PRD and the downstream spec).
10. **Write the file.** Use the template body verbatim with
    sections filled. Leave the Downstream Spec section as
    `(pending)` — it gets filled when the spec is drafted.
11. **Report.** Tell the user: file path, status (DRAFT),
    which open questions still need their decision, and
    propose the next step (mark APPROVED + draft spec, vs.
    iterate on the PRD).

## 推荐输出结构

Use the template at `.ai/runtime/prds/_template.md` verbatim.
Replace each `<!-- ... -->` comment block with the elicited
content; do not delete the comments wholesale if the user might
want to see what the section is for.

## 约束

- **One PRD per invocation.** If the user describes multiple
  loosely-related problems, ask them to pick one and queue the
  others as future PRDs.
- **No engineering content.** If the user starts describing API
  shapes, data flow, or implementation choices, redirect:
  "that's spec territory — let's lock the PRD first."
- **No silent assumptions.** Every elicited field must come from
  the user. Inferred or guessed content goes into Open Questions
  with a note about who decides.
- **Path discipline.** The output path is fixed:
  `.ai/project/prds/YYYY-MM-DD-<slug>/prd.md`. Date is today's
  date (UTC). Do not deviate.
- **Status discipline.** PRDs start DRAFT. Only the user can
  promote to APPROVED.

## 完成标准

- File exists at `.ai/project/prds/YYYY-MM-DD-<slug>/prd.md`.
- All 7 body sections populated (Problem, Target Users, Success
  Metrics, User Stories, Out of Scope, Open Questions,
  Stakeholders).
- At least 2 user stories in the documented shape.
- At least 1 success metric is observable post-ship.
- Status is `DRAFT`.
- Downstream Spec section reads `(pending)` until a spec is
  drafted against this PRD.
- The agent has surfaced unresolved open questions to the user
  and proposed a next step.
