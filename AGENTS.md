# SetPoint Agent Instructions

## Purpose

SetPoint is the dedicated machine setup application for Mimir Metals.

Its purpose is to help a cold-heading operator correctly and consistently set up a machine for a specific part by presenting trustworthy setup information, required tooling, station-by-station setup data, approved starting information, previous successful setup history, and relevant setup actuals.

SetPoint is shop-floor software. It is not an office dashboard, ERP, plant-wide MES, QC system, maintenance system, tooling inventory system, or general manufacturing chatbot.

Initial production scope:

- Company: Mimir Metals
- Machine: MM-14
- Machine model: Jern Yao JBF-30B4SUL
- Process: cold heading
- Primary user: operator / setup person
- Initial machine count: one

## Read before editing

Before meaningful changes:

1. Read `PYTHON_ENGINEERING_STANDARD.md`.
2. Read `docs/PRODUCT.md`.
3. Read the documentation relevant to the task.
4. Inspect the existing implementation before modifying it.
5. Understand current behavior before replacing or restructuring it.

Relevant documentation includes:

- `docs/OPERATOR-WORKFLOW.md`
- `docs/DOMAIN-MODEL.md`
- `docs/SAFETY-RULES.md`
- `docs/ARCHITECTURE.md`
- `docs/decisions/`

Repository documentation is the project source of truth. Do not use an old AI conversation as a requirement unless the decision has been captured here.

## Current phase

The project is still defining the operator workflow and domain model.

Do not invent missing workflow steps merely to make the documentation look complete.

Do not select a major framework, database, deployment model, or machine-integration protocol unless the task explicitly calls for that decision.

## Engineering standard

All Python work must follow `PYTHON_ENGINEERING_STANDARD.md`.

Prefer:

- clear responsibilities
- typed domain concepts
- validated data boundaries
- explicit dependencies
- readable code
- deliberate error handling
- meaningful tests
- small focused changes
- documented assumptions

Avoid:

- giant files
- hidden dependencies
- speculative abstractions
- unnecessary packages
- broad rewrites
- clever code that obscures intent

## SetPoint owns

SetPoint owns setup-related behavior such as:

- part setup information
- part and setup revisions
- required setup tooling references
- station progression
- approved starting setup information
- current setup actuals
- setup adjustments
- SetupRun history
- previous successful setup information
- setup completion status
- first-piece setup acceptance status

## System boundaries

### QC Log owns

Do not implement full production QC inside SetPoint.

QC Log owns recurring inspections, dimensional measurements, tolerance evaluation, visual production inspections, production QC history, quality trending, and ongoing production inspection failures.

SetPoint may reference first-piece or setup acceptance when needed.

### ShopBrain owns

Do not implement broad ShopBrain functionality inside SetPoint.

ShopBrain may own or coordinate manufacturing AI assistance, troubleshooting, manuals, procedures, machine knowledge, maintenance knowledge, condition monitoring, microphone and sensor analysis, and cross-system manufacturing intelligence.

Future IoT, acoustic, vibration, and predictive-maintenance analysis belongs primarily to ShopBrain / maintenance systems. SetPoint may consume relevant machine state through an integration boundary.

### Tooling inventory owns

SetPoint may identify which tooling a setup requires.

Do not turn SetPoint into the tooling inventory lifecycle system. Quantity on hand, storage, checkout, reorder thresholds, purchasing, lifecycle, and inventory audits belong elsewhere.

### Production planning and ERP

SetPoint may eventually reference a traveler, work order, production run, or scheduling identifier.

Do not make SetPoint responsible for scheduling, purchasing, shipping, quoting, customer management, or ERP behavior.

## Manufacturing authority

Never invent production information.

Do not invent:

- machine settings
- tooling dimensions
- tooling requirements
- approved setup parameters
- tolerances
- material requirements
- quality acceptance criteria
- machine limits
- setup sequences

If required manufacturing information is missing, identify what is missing rather than guessing.

## Data authority and provenance

Keep these concepts distinct:

### Approved Standard
Official currently accepted setup information.

### Historical Actual
What was physically used during a previous setup or run.

### Current Actual
What the operator is physically using during the current setup.

### Suggestion
An operator, software, or AI recommendation that has not been approved.

### Machine/Sensor Reading
A value collected automatically from an equipment interface, PLC, gateway, sensor, or other machine data source.

Do not silently convert one category into another.

Every important value should eventually be capable of carrying enough provenance to explain where it came from.

## SetupRun and shared manufacturing identity

SetupRun is a first-class SetPoint concept.

A setup event must remain traceable rather than being overwritten by newer setup data.

SetPoint should also be capable of linking a SetupRun to a broader production-run identity used by other Mimir Metals systems.

Future shared identifiers may connect:

- machine
- part
- part revision
- SetupRun
- production run
- heat
- coil usage
- tooling
- QC records
- scrap
- machine readings
- maintenance or condition-monitoring events

Do not prematurely merge all of these responsibilities into SetPoint.

## Material traceability

Heat numbers and coil usage are important manufacturing context.

SetPoint may reference heat and coil information associated with a SetupRun.

Future calculations may use quantity and piece weight to estimate good steel weight and compare material usage or scrap, but exact accounting rules must be documented before implementation.

SetPoint should not silently become the material inventory system.

## Machine integration principle

SetPoint should be machine-integratable without hard-coding machine communication throughout the domain logic.

Future machine communication should be isolated behind a defined integration or adapter boundary.

Different machines may expose different technologies or protocols. Do not assume all machines communicate the same way.

Do not implement PLC, OPC UA, IoT gateway, sensor, or other machine adapters until a real integration requirement and interface are known.

SetPoint v1 does not automatically control machine settings.

## Operator authority

The operator may record actual setup information and adjustments.

The normal operator workflow must not casually overwrite approved setup standards.

Do not invent an approval workflow before one is defined.

## Operator UX

SetPoint is used beside a cold header.

Favor:

- large readable controls
- touchscreen-friendly interaction
- minimal typing
- fast part lookup
- clear station-by-station information
- previous successful setup visibility
- obvious distinction between approved and historical values
- clear missing-data warnings
- short, no-nonsense workflows

Avoid:

- executive dashboards
- decorative analytics
- management KPI clutter
- excessive forms
- repetitive entry
- unnecessary confirmations
- unnecessary animation
- office-oriented navigation

## Architecture

Prefer the simplest architecture that supports the requirements and can evolve safely.

Do not introduce microservices, message brokers, event streaming, distributed infrastructure, or other complexity without a concrete requirement.

The current target is one machine. Future machine support must be possible without forcing v1 to behave like a plant-wide platform.

## History and data integrity

Preserve meaningful manufacturing history.

Do not destructively overwrite historical setup data merely because a newer setup exists.

Schema changes must consider migration and traceability.

## Testing and verification

Meaningful behavior changes require tests.

Consider:

- successful behavior
- invalid input
- missing data
- duplicate actions
- unavailable dependencies
- boundary values
- authority rules
- preservation of history
- provenance of important values

Never claim tests or checks passed unless they were actually run.

## Working method

Before coding a meaningful task:

1. Inspect relevant files.
2. Read relevant documentation.
3. Identify existing patterns.
4. State important assumptions.
5. Briefly explain the proposed approach.
6. Implement the smallest coherent change.

After coding:

1. Run relevant tests.
2. Run configured linting and type checks when available.
3. Inspect changed files.
4. Confirm unrelated behavior was not changed.
5. Confirm no secrets were introduced.
6. Update documentation when project truth changed.

## Completion report

After meaningful implementation work, summarize:

- what changed
- why it changed
- important files changed
- architectural decisions
- assumptions
- tests or checks run
- results
- unresolved issues

## Core question

When considering a SetPoint feature, ask:

> Does this help the operator correctly perform or understand the machine setup, preserve trustworthy setup knowledge, or cleanly connect that setup record to the wider manufacturing system?

If not, it probably belongs somewhere else.
