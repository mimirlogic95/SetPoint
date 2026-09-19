# SetPoint Safety and Manufacturing Authority Rules

## Purpose

SetPoint supports an experienced operator during machine setup.

It must preserve trustworthy manufacturing information without presenting software or AI as manufacturing authority.

## Rule 1 — Never invent manufacturing truth

SetPoint and any AI working on SetPoint must not invent:

- machine settings
- approved setup parameters
- tooling requirements
- tooling dimensions
- tolerances
- material requirements
- machine limits
- quality acceptance criteria
- setup sequences

Missing manufacturing information must be identified as missing.

## Rule 2 — Approved is not the same as successful

A historical setup may have worked.

That does not automatically make its values the approved standard.

Keep approved standards and historical actuals distinct.

## Rule 3 — Actual is not automatically approved

An operator may adjust a setting during a SetupRun.

Recording that actual value must not silently update the approved setup standard.

An approval/revision process may be added later only after it is explicitly designed.

## Rule 4 — Suggestions must be labeled

AI, operator, or software suggestions that are not approved must remain visibly unapproved.

AI must not silently write a suggested value into the approved setup standard.

## Rule 5 — No automatic machine control in v1

SetPoint v1 is a setup-information and setup-history application.

It does not automatically command MM-14, write machine settings, bypass interlocks, or replace machine controls.

Future machine integrations require their own documented safety review and authority model.

## Rule 6 — Preserve provenance

Important values should be able to distinguish whether they came from:

- approved documentation
- current operator entry
- historical setup data
- imported external system
- machine/sensor collection
- unapproved suggestion

When provenance is unknown, do not present the value as authoritative.

## Rule 7 — Preserve history

Do not destructively overwrite completed SetupRuns merely because newer runs exist.

History is manufacturing evidence.

Corrections to historical data should be traceable if editing is allowed later.

## Rule 8 — Validate important inputs

Validate units, required relationships, identifiers, and ranges where the approved domain provides those constraints.

Do not create fake ranges merely to satisfy validation.

## Rule 9 — Fail clearly

Missing or unavailable setup data must not silently fall back to guessed values.

If SetPoint cannot determine trustworthy setup information, tell the operator what is missing.

## Rule 10 — Respect system boundaries

SetPoint must not become the hidden owner of QC, maintenance, tooling inventory, condition monitoring, scheduling, or ERP behavior.

Cross-system integration should exchange identifiers and relevant facts while preserving responsibility boundaries.

## Rule 11 — Minimize unnecessary operator input

Safety and traceability matter, but excessive typing encourages bypass behavior and bad data.

Capture only information that creates meaningful setup, traceability, quality, or integration value.

## Rule 12 — Machine integration must be isolated

Future PLC, OPC UA, gateway, IoT, sensor, or similar interfaces must sit behind a defined integration boundary.

Machine-specific communication failures must not corrupt approved setup information.

## Rule 13 — Sensor and condition data are not SetPoint authority

Microphones, vibration sensors, temperature data, and other predictive-maintenance inputs belong primarily to ShopBrain / maintenance systems.

SetPoint may consume relevant status but must not become the primary condition-monitoring system.

## Rule 14 — Human manufacturing authority remains explicit

SetPoint can organize, compare, calculate, and surface information.

It does not replace the qualified people and documented standards responsible for approving manufacturing requirements, tooling, quality criteria, or machine operation.
