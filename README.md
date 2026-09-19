# SetPoint

SetPoint is the operator-focused cold-heading machine setup system for the fictional manufacturer Mimir Metals.

## Current scope

The first production scope is intentionally narrow:

- Company: Mimir Metals
- Machine: MM-14
- Machine model: Jern Yao JBF-30B4SUL
- Process: cold heading
- Primary user: operator / setup person
- Initial machine count: one

SetPoint is being built as real application software, not as a prototype or demo.

## Purpose

SetPoint helps an operator answer:

> What do I need to correctly set up this part on this machine, what is the approved starting point, and what worked during previous successful setups?

The application is intended to provide trustworthy setup information, station-by-station tooling and setup data, approved starting parameters, setup actuals, adjustments, and setup history without burying the operator in office-style workflow.

## Project status

The repository is currently in the discovery and foundation phase.

Application architecture, runtime stack, database technology, and deployment details are not final until the operator workflow and domain model are sufficiently understood.

Do not treat placeholder documentation as finalized manufacturing truth.

## Repository guide

- `AGENTS.md` — instructions for AI coding agents working in this repository
- `PYTHON_ENGINEERING_STANDARD.md` — MimirLogic-wide Python engineering standard
- `docs/PRODUCT.md` — SetPoint purpose, scope, and product boundaries
- `docs/OPERATOR-WORKFLOW.md` — observed operator workflow; currently under discovery
- `docs/DOMAIN-MODEL.md` — manufacturing concepts and relationships
- `docs/SAFETY-RULES.md` — manufacturing authority, safety, and data-trust rules
- `docs/ARCHITECTURE.md` — architectural principles and future integration boundaries
- `docs/decisions/README.md` — process for recording important architecture decisions

## Source-of-truth rule

Important project knowledge must live in this repository rather than only inside an AI conversation.

When implementation changes an important product rule, domain relationship, workflow, safety rule, or architecture decision, update the relevant documentation.

## Engineering principle

> Generate quickly. Understand deliberately. Test before trusting.
