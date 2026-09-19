# Architecture Decision Records

This directory records important technical or domain decisions whose reasoning should survive beyond the original conversation.

## Why

Code shows what the system does.

An Architecture Decision Record (ADR) explains why an important choice was made, what alternatives were considered, and what consequences were accepted.

Use ADRs for decisions that would otherwise make a future developer ask:

> Why did we build it this way?

## Suggested naming

- `0001-short-decision-name.md`
- `0002-short-decision-name.md`

## Suggested format

```md
# ADR NNNN — Decision title

## Status
Proposed | Accepted | Superseded

## Context
What problem or constraint requires a decision?

## Decision
What did we decide?

## Alternatives considered
What other reasonable options were considered?

## Consequences
What becomes easier, harder, safer, or more constrained?

## Evidence / assumptions
What facts, requirements, or assumptions support the decision?

## When to revisit
What future condition would justify reconsidering it?
```

## Current decisions not yet written as ADRs

The following project directions are captured in the main docs but may deserve individual ADRs once implementation makes them concrete:

- MM-14 as the first-machine scope
- SetupRun as a first-class historical record
- shared production-run identity across Mimir Metals systems
- separation of approved standards from actuals and suggestions
- machine-specific adapters behind an integration boundary
- QC, ShopBrain, tooling, and maintenance responsibility boundaries
- heat/coil traceability without turning SetPoint into inventory
