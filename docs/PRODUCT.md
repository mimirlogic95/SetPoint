# SetPoint Product Definition

## Purpose

SetPoint is the dedicated machine setup application for Mimir Metals.

Its job is to help a cold-heading operator correctly and consistently set up a machine for a specific part by presenting the approved and historical information needed at the machine and by preserving what actually happened during the setup.

SetPoint is designed for the shop-floor operator, not office staff.

## Initial production scope

- Company: Mimir Metals
- Machine: MM-14
- Machine model: Jern Yao JBF-30B4SUL
- Process: cold heading
- Primary user: operator / setup person
- Initial machine count: one

MM-14 is the only required machine for the first production release.

The system should be designed so additional machines can be added later without rewriting the core manufacturing domain.

## Core problem

Important setup knowledge can be spread across setup sheets, tooling information, operator memory, previous runs, notes, and tribal knowledge.

SetPoint brings trustworthy setup information together so the operator can quickly answer:

> What do I need to correctly set up this part on this machine, what is the approved starting point, and what worked during previous successful setups?

It should preserve useful setup history instead of allowing successful knowledge to disappear into operator memory.

## Product principles

SetPoint should be:

- fast
- simple
- touchscreen-friendly
- minimal-input
- readable beside a machine
- focused on setup execution
- clear about where data came from
- conservative about manufacturing authority

SetPoint should not be an office dashboard.

## Known operator inputs

For the initial Mimir Metals workflow, the operator is typically given:

- part number
- quantity

A traveler may also accompany the work and may identify the next phase of the process and quantity.

Other manufacturers may use work orders, routers, travelers, or similar identifiers. SetPoint should be capable of referencing those concepts later without requiring them for Mimir Metals v1.

Skid-tag printing exists in the broader production workflow but is not automatically a SetPoint responsibility.

## SetupRun

A SetupRun represents a specific setup event.

It is expected to connect a part, machine, operator, manufacturing context, approved setup information, actual settings, adjustments, and setup result without overwriting history.

A SetupRun should eventually be capable of linking to a broader production-run identifier shared across Mimir Metals applications.

## Material context

Heat numbers are important and should be traceable to the setup/run.

Coil usage is also important.

Future material calculations may use:

- production quantity
- piece weight
- heat
- coils used
- estimated good steel weight
- material consumed
- setup scrap
- production scrap

Exact scrap and material-accounting rules are not yet defined and must not be invented.

## Core workflow direction

The expected high-level workflow is:

1. identify/select the part and production context
2. load the correct approved setup information
3. review required tooling and station information
4. review approved starting setup information
5. perform the physical setup
6. record relevant actual values and adjustments
7. establish an acceptable first piece
8. preserve the completed SetupRun
9. make successful history available to future setups

The detailed operator workflow is still under discovery. `docs/OPERATOR-WORKFLOW.md` is authoritative for observed steps.

## SetPoint owns

SetPoint owns setup-related concepts including:

- part setup information
- part revisions
- setup revisions
- required setup tooling references
- station progression
- approved starting setup information
- actual setup values
- setup adjustments
- SetupRun history
- previous successful setup information
- setup completion status
- first-piece setup acceptance status

## SetPoint does not own

### QC Log

Detailed ongoing production inspection belongs to QC Log, including recurring inspections, dimensional measurements, tolerance evaluation, visual production checks, quality history, and quality trending.

### ShopBrain

Broad manufacturing intelligence belongs to ShopBrain, including troubleshooting, manuals, procedures, AI manufacturing assistance, maintenance knowledge, condition monitoring, and cross-system knowledge.

### Tooling inventory

SetPoint may reference tooling required by a setup, but does not own quantity on hand, storage, checkout, purchasing, or tooling inventory lifecycle.

### Maintenance

Preventive maintenance, breakdown work, repair history, spare parts, and condition-monitoring workflows do not belong in SetPoint.

### Planning / ERP

Scheduling, purchasing, shipping, quoting, and customer management do not belong in SetPoint.

## Future connected-manufacturing direction

SetPoint should remain independently useful for MM-14 while participating cleanly in a wider Mimir Metals manufacturing data ecosystem.

Future integrations may connect SetPoint data with:

- QC
- tooling
- material/heat/coil records
- production-run identity
- machine data
- PLC or IoT gateways
- sensor systems
- maintenance and ShopBrain

This future direction must not be used as an excuse to add plant-wide complexity to v1.

## V1 success

SetPoint v1 is successful when an operator can walk up to MM-14, identify the part/run context, and quickly understand:

- what setup information applies
- what tooling is required
- how the stations are configured
- what approved starting information should be used
- what worked during a previous successful setup
- what changes are being made now
- whether the setup reached an acceptable first piece

It should do this with as little unnecessary operator input as possible.
