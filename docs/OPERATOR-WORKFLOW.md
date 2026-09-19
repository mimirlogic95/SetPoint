# MM-14 Operator Workflow

## Status

Discovery in progress.

This document must reflect the actual operator workflow. Do not fill missing sections from assumption, generic manufacturing practice, or AI invention.

The first discovery scenario intentionally starts with an empty MM-14 so the baseline setup process can be observed without mixing teardown/changeover behavior into the same workflow.

A separate changeover workflow can be documented later.

## Scenario 001 — Empty machine to production-ready setup

### Starting condition

Known starting assumptions:

- Machine: MM-14
- Model: Jern Yao JBF-30B4SUL
- Machine has no previous job/tooling that must first be torn down
- No setup sequence has yet been documented in this file
- Operator is assigned the next part and quantity

### Known job information

At the operator's current workplace, the normal starting information is:

- part number
- quantity

A traveler may identify:

- quantity
- next phase of the manufacturing process

Other manufacturers may use different job/work-order/router systems. That variability is a future integration concern, not a reason to complicate the first Mimir Metals workflow.

### Known material context

Heat numbers are important.

Coil count/usage is important for later material and scrap accounting.

The exact point in the operator workflow where heat and coil data become available has not yet been documented.

### Workflow discovery

The detailed sequence below is intentionally blank until it is reconstructed with the operator.

#### Step 1 — Job received
To discover:
- what the operator is physically handed or shown
- what must be checked first
- where part/quantity information comes from
- whether traveler information is used during setup

#### Step 2 — Pending discovery
Do not invent.

#### Step 3 — Pending discovery
Do not invent.

#### Step 4 — Pending discovery
Do not invent.

#### Step 5 — Pending discovery
Do not invent.

### Setup completion

The exact definition of setup completion is still under discovery.

Known product direction:

- actual setup information should be preservable
- adjustments should be traceable
- first-piece setup acceptance should be represented
- successful setup history should remain available to later operators

### Production handoff

The point where SetPoint ends and normal production/QC workflow begins is still being defined.

Detailed recurring production inspections belong to QC Log, not SetPoint.

### Related workflows to document later

- changeover from an existing running job
- unsuccessful/abandoned setup
- tooling substitution
- material/heat change during a run
- coil change during a run
- setup requiring correction after first-piece rejection
- traveler/work-order integration
- broader production handoff
- skid-tag workflow only if a future boundary decision says SetPoint must participate

## Discovery rule

Whenever the operator says phrases such as:

- I just know...
- I usually remember...
- I grab...
- I check...
- I look at the old...
- somebody tells me...
- we write down...

pause and determine whether that represents:

- required setup data
- approved standard
- historical knowledge
- tooling information
- material context
- quality checkpoint
- operator-only judgment
- unnecessary data entry

Do not convert tribal knowledge into software logic without validating what it means.
