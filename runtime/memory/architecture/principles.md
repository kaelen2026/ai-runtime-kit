# Architecture Principles

Generic architectural guidance for projects using this runtime.
Project-specific conventions (concrete `src/` tree, ADR references,
persistence stack) live in
`.ai/project/memory/architecture/conventions.md`.

## Goals

- maintainability
- modularity
- testability
- backward compatibility

---

## Preferred Structure (general shape)

Recommended top-level layering:

- composition root (app construction)
- entry point (process startup only)
- feature modules (vertical, owning a domain end-to-end)
- cross-module middleware
- shared infrastructure
- framework-agnostic shared helpers

Concrete directory layout for this project lives in
`.ai/project/memory/architecture/conventions.md`.

---

## App Structure

- composition root file:
  - middleware registration
  - route registration

- entry file:
  - process startup only

---

## Module Rules

A feature module owns a feature end-to-end. Conventional files inside
a module:

- routes file — HTTP boundary
- service file — orchestration / use cases (optional)
- repository file — persistence access (optional)
- module-private domain helpers
- co-located tests

Module internals are private. A module's public surface is what the
composition root (and any other consuming module) imports — prefer a
small set of exports.

---

## Layer Rules

- **shared layer** — pure helpers, framework-agnostic. Depends on
  nothing else inside the source tree.
- **infrastructure layer** — shared runtime infrastructure (DB pool,
  schema, migrations). Depends only on shared.
- **middleware layer** — cross-module HTTP middleware. Depends on
  infrastructure and shared.
- **module layer** — feature modules. May depend on middleware,
  infrastructure, shared, and the *public surface* of another module.
  Must not reach into another module's internal files.
- **composition root** — wires everything; the only place that imports
  every module.

Forbidden:

- infrastructure importing from modules.
- shared importing from anywhere inside source.
- A module reaching into another module's internal files.

---

## Refactor Principles

- prefer behavior-preserving refactors
- prefer small migrations
- avoid large rewrites
- preserve contracts

---

## Service Design

- services should avoid HTTP concerns
- routes should remain thin
- utilities should remain pure

---

## Middleware Design

- middleware should be composable
- avoid hidden side effects
- prefer explicit registration
- middleware that only serves one module belongs inside that module;
  only middleware shared across modules lives in the cross-module
  middleware layer
