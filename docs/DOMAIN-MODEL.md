# SetPoint Domain Model

## Status

Conceptual model under discovery.

This document describes manufacturing concepts and relationships. It is not yet a final database schema.

Do not convert every concept below directly into a database table until implementation requirements justify it.

## Modeling principle

Model the manufacturing world first, then choose storage technology.

The domain should preserve meaning, history, authority, and provenance.

## Core concepts

### Machine

Represents a machine that can perform a setup/run.

Initial instance:

- machine identity: MM-14
- model: Jern Yao JBF-30B4SUL
- process: cold heading

The domain should not embed MM-14 communication logic throughout business logic.

### Part

Stable identity for a manufactured part.

A part may have revisions.

### PartRevision

Represents a specific revision of a part.

Setup standards and production records should be able to reference the revision that was actually used.

### SetupStandard

Represents approved setup information for a machine/part context.

A SetupStandard is not the same thing as a historical successful SetupRun.

Approved information must remain distinguishable from actual values.

### SetupRun

Represents one specific setup event.

A SetupRun should eventually be able to reference:

- machine
- part
- part revision
- applicable SetupStandard
- operator
- production context
- heat/material context
- coil usage
- actual settings
- adjustments
- tooling used or referenced
- setup result
- first-piece acceptance status
- timestamps
- broader `production_run_id` when available

SetupRun history should not be destructively overwritten.

### ProductionRun identity

Mimir Metals intends to use a shared production-run identity across applications.

A production-run identity may eventually connect:

- SetPoint setup data
- QC records
- heat/coil information
- tooling context
- scrap
- machine readings
- maintenance/condition events

SetPoint does not need to own all production-run behavior.

Until a shared production service exists, the implementation strategy for `production_run_id` remains undecided.

### Operator

Represents the person performing or recording a setup.

Operator identity should be sufficient for traceability without collecting unnecessary personal information.

### Station

Represents a logical forming station or other machine setup position where station-specific information is required.

The exact MM-14 station model must be confirmed through workflow discovery.

### ToolingRequirement

Represents tooling required by a SetupStandard or station.

SetPoint references tooling requirements. It does not own tooling inventory lifecycle.

### ActualTooling

Represents the tooling actually used during a SetupRun when that distinction matters.

An actual tooling record must not silently change the approved tooling requirement.

### SetupParameterDefinition

Represents the meaning, unit, valid context, or other metadata for a setup parameter.

The final parameter set must come from documented MM-14/operator requirements.

### ApprovedSetupValue

Represents an approved starting value within a SetupStandard.

### ActualSetupValue

Represents what was physically used during a SetupRun.

Actual does not automatically mean approved.

### Adjustment

Represents a meaningful change made during a SetupRun.

Where useful, an adjustment should preserve before/after context and who/what supplied the value.

### MaterialHeat

Represents the heat number or equivalent material traceability identity associated with a run.

Heat identity is important manufacturing context.

### Coil

Represents a coil identity when coil-level traceability is available.

The exact identity scheme is not yet defined.

### CoilUsage

Represents use of a coil during a production context.

Potential future information may include:

- coil identity
- heat
- sequence used
- issued/starting weight if known
- ending/remaining weight if known
- pieces associated with use
- scrap context

Exact steel-accounting rules are not defined yet.

### PieceWeight

Part-level or revision-level piece weight may support material estimates.

Future derived values may include:

`estimated good weight = good quantity × piece weight`

Do not implement scrap calculations until units, source of piece weight, issued/consumed steel definitions, and reconciliation rules are documented.

### SetupResult

Represents the outcome of a setup event.

Potential states may include in-progress, accepted, failed, or abandoned, but final status vocabulary must be confirmed.

### FirstPieceAcceptance

Represents whether the setup reached an acceptable first piece.

SetPoint needs enough quality context to know the setup outcome.

Detailed inspection measurements belong to QC Log.

### DataProvenance

Important values should eventually be capable of identifying their source category, such as:

- approved standard
- operator-entered current actual
- historical actual
- imported system value
- machine/sensor reading
- unapproved suggestion

Provenance is essential when multiple applications and automated data sources are connected later.

## Conceptual relationships

A simplified direction is:

```text
Factory
  -> Machine
  -> ProductionRun
     -> SetupRun
        -> SetupStandard
        -> ActualSetupValues
        -> Adjustments
        -> ActualTooling
        -> MaterialHeat / CoilUsage
        -> FirstPieceAcceptance

Part
  -> PartRevision
     -> SetupStandard
```

This is conceptual only. Cardinality and persistence rules remain to be designed.

## Boundary relationships

### QC Log

May share `production_run_id`, `machine_id`, part/revision identity, heat context, and first-piece/quality status without making SetPoint the QC owner.

### Tooling Inventory

May share tooling IDs and metadata without making SetPoint the inventory owner.

### ShopBrain / Maintenance

May consume machine/run context and condition data without making SetPoint the condition-monitoring owner.

## Open domain questions

- exact station model for MM-14
- approved setup revision lifecycle
- exact setup parameter definitions
- operator identity/authentication approach
- traveler/work-order relationship
- coil identity and weight-accounting rules
- scrap definitions and reconciliation
- first-piece acceptance interface with QC
- ownership and generation of `production_run_id`
- machine adapter configuration model
