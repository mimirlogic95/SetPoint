# SetPoint

**Operator-focused machine setup software for cold heading**

SetPoint is a manufacturing setup assistant designed around the needs of the person actually standing at the machine.

Its purpose is simple:

> Help an operator quickly understand what is required to set up a part, what the approved starting information is, what worked during previous successful setups, and what changed during the current setup.

SetPoint is being developed around a fictional factory environment called **Mimir Metals** so realistic manufacturing workflows can be modeled without exposing employer, customer, or proprietary production information.

---

## Demo Environment

**Company:** Mimir Metals  
**Machine:** MM-14  
**Machine Model:** Jern Yao JBF-30B4SUL  
**Process:** Cold heading / bolt forming  
**Primary User:** Operator / setup person

Mimir Metals is fictional.

The public demo and repository use fictionalized manufacturing data created to model realistic cold-heading workflows.

No employer production data, customer prints, proprietary part numbers, confidential machine settings, or other private workplace information are intended to be included in this project.

---

## Why SetPoint Exists

Manufacturing setup knowledge is often spread across several places:

- engineering prints
- progression drawings
- setup sheets
- tooling information
- previous run records
- handwritten notes
- operator adjustments
- tribal knowledge
- experienced people’s memory

That makes an otherwise routine setup harder than it needs to be.

SetPoint brings those pieces together into one operator-focused workflow.

The goal is not to replace operator experience.

The goal is to make trustworthy information easier to find, compare, and preserve.

---

## What SetPoint Helps the Operator Answer

For a selected part and machine, SetPoint is designed to help answer:

- What part am I setting up?
- What approved information applies?
- What tooling is required?
- How are the forming stations configured?
- What machine settings are relevant?
- What worked during previous successful setups?
- What adjustments were made?
- Did the setup reach an acceptable first piece?
- What should be preserved for the next run?

---

## Current Features

### Part and Setup Information

Operators can identify a part and review the information needed for setup.

Depending on the part and machine, this may include:

- blueprint / engineering drawing
- progression print
- tooling requirements
- station-by-station configuration
- approved starting information
- previous successful setup history

---

### Tooling by Station

SetPoint can organize required tooling across the machine’s forming stations.

Tooling references may include items such as:

- dies
- punches
- punch pins
- spacers
- knockout pins
- transfer fingers
- related setup tooling

SetPoint may reference tooling requirements, but it does not own tooling inventory lifecycle management.

---

### Previous Setup History

Operators can compare previous successful runs and see what was physically used during those setups.

Historical values are treated as evidence, not automatic truth.

A previous successful setup does **not** automatically become the approved standard.

---

### SetupRun History

A `SetupRun` represents a specific setup event.

A SetupRun is intended to preserve:

- machine
- part
- setup context
- approved starting information
- actual values used
- operator adjustments
- setup notes
- setup result
- first-piece acceptance state

Completed setup history should remain traceable rather than being overwritten by newer runs.

---

### End-of-Run Logging

Operators can preserve what actually happened during a setup so useful knowledge does not disappear after the shift.

The interface includes a **Clone from Previous Run** workflow to reduce unnecessary typing when a previous setup is a useful starting point.

Cloned values still represent current operator-entered actuals and do not automatically become approved standards.

---

## Machine Setup Parameters

SetPoint is designed to support machine-specific setup parameters rather than assuming every cold header uses the exact same controls.

Current modeled fields may include:

- die knockout values
- punch wedge positions
- feed
- stopper
- feed roll pressure
- finger clamp pressure
- cutoff length
- transfer finger timing
- operator notes
- other machine-specific parameters

### Punch / Die Gap

Punch / die gap is supported as an optional machine-specific setup concept for equipment that uses it.

The current MM-14 workflow does not rely on punch / die gap as a primary setup control.

Machine-specific fields should be enabled only where they accurately represent that machine’s actual setup process.

---

## Manufacturing Authority Model

SetPoint is intentionally conservative about manufacturing authority.

The application distinguishes between several types of information.

### Approved Standard

Officially accepted setup information.

### Historical Actual

What was physically used during a previous setup or run.

### Current Actual

What the operator is physically using during the current setup.

### Suggestion

An operator, software, or AI recommendation that has not been approved.

### Machine / Sensor Reading

A value collected automatically from equipment or sensors.

These categories should never be silently converted into one another.

---

## Safety Principles

SetPoint supports qualified manufacturing personnel.

It does not replace them.

The system must not invent:

- machine settings
- tooling requirements
- tooling dimensions
- tolerances
- material requirements
- machine limits
- quality acceptance criteria
- setup sequences

Missing information should be shown as missing rather than guessed.

### No Automatic Machine Control in V1

SetPoint v1 does not:

- command MM-14
- write machine settings
- bypass machine interlocks
- automatically control equipment

Any future machine integration would require its own documented safety and authority model.

---

## Human Authority Remains Explicit

SetPoint can:

- organize information
- compare previous runs
- preserve history
- calculate where approved rules exist
- surface relevant setup data
- support operator decision-making

SetPoint does not replace the qualified people and documented standards responsible for manufacturing approval, machine operation, tooling, or quality decisions.

---

## Product Boundaries

SetPoint is intentionally narrow.

It is a machine setup application.

It is **not** intended to become an ERP, MES, maintenance platform, QC platform, tooling inventory system, or general-purpose manufacturing chatbot.

### QC

Detailed recurring production inspection belongs in a separate QC system.

### Maintenance

Preventive maintenance, repairs, spare parts, condition monitoring, and predictive maintenance belong outside SetPoint.

### Tooling Inventory

SetPoint may reference which tooling is required, but storage, checkout, purchasing, and inventory quantities belong to a dedicated tooling system.

### Planning / ERP

Scheduling, purchasing, shipping, quoting, and customer management are outside SetPoint’s responsibility.

### Broader Manufacturing AI

Cross-system troubleshooting, manuals, procedures, maintenance intelligence, vision assistance, and plant-wide AI belong in a broader manufacturing platform rather than inside SetPoint itself.

---

## Future Direction

SetPoint should remain useful as a standalone machine setup tool while also being able to participate in a broader connected-manufacturing environment.

Possible future integrations may include:

- QC records
- tooling systems
- heat and coil traceability
- production run identity
- PLC / machine data
- IoT gateways
- sensor systems
- maintenance systems
- broader manufacturing knowledge tools

Future integration should not be used as an excuse to overcomplicate the first working product.

---

## V1 Success Criteria

SetPoint v1 is successful when an operator can walk up to the machine, identify the part or production context, and quickly understand:

- what setup information applies
- what tooling is required
- how the stations are configured
- what approved starting information should be used
- what worked during previous successful setups
- what changes are being made now
- whether the setup reached an acceptable first piece

The workflow should require as little unnecessary operator input as possible.

---

## Technology

Current implementation uses:

- React
- JavaScript
- Vite
- Tailwind CSS
- Node.js
- Express
- browser `localStorage` for static-demo persistence
- Netlify for public demo deployment

The project also includes backend-oriented development paths for future local or production deployments.

---

## Running Locally

### Install dependencies

```bash
npm install