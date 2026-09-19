# SetPoint Architecture

## Status

Architecture principles are defined. Technology selections are not final.

Do not treat this document as approval for a particular web framework, database, cloud platform, machine protocol, or deployment model until those decisions are recorded.

## Architectural goal

Build the simplest application that reliably supports an operator setting up MM-14 while keeping the core manufacturing domain clean enough to integrate with future Mimir Metals systems and additional machines.

## Principle 1 — Single machine first

SetPoint v1 targets MM-14.

Do not build plant-wide infrastructure simply because future machines may be added.

The core domain should avoid assumptions that make a second machine require a rewrite.

## Principle 2 — Domain logic is separate from machine communication

The manufacturing domain should understand concepts such as:

- Machine
- Part / PartRevision
- SetupStandard
- SetupRun
- ProductionRun identity
- MaterialHeat
- CoilUsage
- tooling references
- setup parameters
- actual values
- adjustments
- setup result

It should not care whether a machine communicates through OPC UA, PLC APIs, an IoT gateway, files, manual entry, or another future interface.

## Principle 3 — Machine adapters

Future machine connectivity should be introduced through a defined adapter/integration boundary.

Conceptually:

```text
SetPoint domain
  -> machine integration interface
     -> MM-14 adapter
     -> future machine adapter
```

This is integration-ready design, not a claim that all machines are plug-and-play.

Each machine may require its own capability mapping, protocol implementation, security review, and configuration.

No machine adapter is required for the repository foundation phase.

## Principle 4 — Manual-first, automation-ready provenance

V1 may begin with operator-entered or repository-supplied setup information.

The data model should later be able to distinguish manually entered values from automatically collected values.

Future machine/sensor data should enter through a controlled integration layer rather than bypassing domain rules.

## Principle 5 — Shared manufacturing identity

Mimir Metals is expected to evolve toward connected applications.

A shared `production_run_id` should eventually make it possible to correlate information across:

- SetPoint
- QC Log
- tooling systems
- heat/coil records
- scrap
- machine data
- ShopBrain / maintenance

SetPoint should participate in that identity model without becoming the owner of every connected workflow.

## Principle 6 — Traceability over destructive convenience

Approved setup information, historical actuals, current actuals, suggestions, and machine readings are different kinds of data.

Architecture must preserve those distinctions.

Completed manufacturing history should not be casually overwritten.

## Principle 7 — System boundaries before integrations

Cross-system integration should normally exchange identifiers and facts rather than copying whole application responsibilities.

Examples:

- SetPoint references tooling ID; tooling inventory owns quantity/location.
- SetPoint references first-piece acceptance; QC owns detailed measurements.
- SetPoint references heat/coil; material systems may own inventory.
- SetPoint consumes machine status; ShopBrain/maintenance owns condition analysis.

## Principle 8 — No premature distributed architecture

Do not introduce microservices, brokers, streaming platforms, service meshes, or distributed databases without a concrete operational requirement.

A modular application is preferred over distributed complexity for v1.

## Principle 9 — Operator UX is an architectural constraint

The runtime architecture must support a fast, simple, touchscreen-friendly operator experience.

The UI should not depend on office-style workflow or excessive navigation.

## Principle 10 — Failure must preserve trust

If a database, integration, or external system becomes unavailable, SetPoint must fail clearly.

The system must not substitute guessed setup data or silently present stale/untrusted information as current approved truth.

## Future machine and IoT direction

Long term, Mimir Metals wants the ability to connect:

- machine speed/status/counters
- PLC or controller data where accessible
- IoT gateways
- microphones/acoustic monitoring
- vibration or other condition sensors
- preventive/predictive maintenance intelligence

Condition monitoring and predictive-maintenance intelligence belong primarily to ShopBrain / maintenance.

SetPoint may consume relevant machine state while preserving its setup-focused responsibility.

## Architecture decisions still required

Before application implementation, or when the relevant feature is reached, record decisions for:

- runtime/application stack
- database
- local vs hosted deployment
- authentication/operator identity
- offline/network behavior
- API boundaries
- `production_run_id` ownership
- document/image storage
- machine adapter contract
- deployment and update strategy
- backup/recovery
- security model

Use `docs/decisions/` for decisions whose tradeoffs matter enough to remember.
