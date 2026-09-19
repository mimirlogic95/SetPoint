# MimirLogic Python Engineering Standard

**Version:** 1.0  
**Purpose:** Build Python systems that are understandable, testable, maintainable, and safe to change.

This is not a style guide for looking professional. It is a working standard for building software that other people — including future us — can understand and trust.

---

## 1. Core Rule: Understand What We Ship

AI may help write code, but we do not ship code only because it runs.

Before a feature is considered done, we should be able to explain:

- What problem the code solves
- Where the important logic lives
- What data goes in
- What comes out
- What can fail
- How failures are handled
- How we test it

### Why

Code that works once is not the same as code we can maintain.

Our goal is not to memorize every line of Python. Our goal is to understand the structure and intent of the system.

---

## 2. Keep Responsibilities Separate

Do not put the entire application in one giant file.

Prefer clear areas for different responsibilities.

Example:

```text
project/
├── pyproject.toml
├── src/
│   └── app/
│       ├── main.py
│       ├── models/
│       ├── services/
│       ├── repositories/
│       ├── integrations/
│       └── config/
└── tests/
```

Typical responsibilities:

- `models/` — defines the shape of data
- `services/` — contains business logic
- `repositories/` — reads and writes stored data
- `integrations/` — talks to external systems
- `config/` — application settings
- `main.py` — connects the pieces together
- `tests/` — proves behavior

### Why

When responsibilities are separated, bugs are easier to find and changes are less likely to break unrelated features.

---

## 3. Validate Data at Boundaries

Use typed models, such as Pydantic models, for important incoming data.

Example:

```python
from pydantic import BaseModel, Field


class AfterHoursRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=7, max_length=30)
    urgency: str
```

Validate data when it enters the application rather than trusting random dictionaries or form values throughout the system.

### Why

Bad data should be rejected early instead of causing a strange failure later.

---

## 4. Use Type Hints

Use type hints for function inputs, outputs, and important variables.

Example:

```python
def calculate_total(quantity: int, price: float) -> float:
    return quantity * price
```

### Why

Type hints make code easier for humans, editors, static analyzers, and AI tools to understand.

They also expose mistakes earlier.

---

## 5. Make Dependencies Explicit

A function or class should not secretly create every outside service it needs.

Prefer passing important dependencies into the component.

Example:

```python
class SetupService:
    def __init__(self, repository: SetupRepository):
        self.repository = repository
```

Instead of hiding the database connection inside `SetupService`.

### Why

Explicit dependencies make components easier to test, replace, and understand.

This is called **dependency injection**.

You do not need to memorize the name yet. Remember the idea:

> A component should clearly show what it depends on.

---

## 6. Keep Business Logic Out of Routes and UI Code

API routes, buttons, and user-interface handlers should coordinate work, not contain the entire business process.

Prefer:

```text
UI / API
   ↓
Service
   ↓
Repository / Integration
```

### Why

Business rules should still work if we later replace the web interface, touchscreen interface, database, or API.

---

## 7. Handle Errors Deliberately

Do not use broad error handling such as:

```python
try:
    ...
except:
    pass
```

Do not silently ignore failures.

Catch errors you understand and either:

- recover safely,
- return a useful error,
- or log the failure and stop the operation.

Example:

```python
try:
    setup = repository.get_setup(part_number)
except DatabaseUnavailableError as exc:
    logger.exception("Unable to load setup", extra={"part_number": part_number})
    raise SetupUnavailableError("Setup information is temporarily unavailable") from exc
```

### Why

Silent errors create systems that appear to work while losing data or behaving incorrectly.

---

## 8. External Calls Must Have Timeouts

Network requests must not wait forever.

This includes:

- APIs
- AI services
- databases over a network
- email services
- HTTP requests
- other machines or services

Example:

```python
response = client.get(url, timeout=10)
```

### Why

A shop-floor application or customer-facing site should fail predictably instead of hanging indefinitely.

---

## 9. Log Useful Context

Logging should help us reconstruct what happened.

Useful context may include:

- operation name
- part number
- machine identifier
- request ID
- station number
- feature
- error type

Example:

```python
logger.info(
    "Setup loaded",
    extra={
        "part_number": part_number,
        "machine_id": machine_id,
    },
)
```

Never log:

- passwords
- API keys
- access tokens
- secrets
- unnecessary personal information

### Why

Logs are one of the first tools used to diagnose a production problem.

---

## 10. Secrets Do Not Belong in Code

Never hard-code:

- API keys
- passwords
- database credentials
- access tokens
- private URLs containing credentials

Use environment variables or an appropriate secret-management system.

Example:

```python
import os

api_key = os.environ["SERVICE_API_KEY"]
```

Do not commit `.env` files containing real secrets.

### Why

Git remembers history. A deleted secret may still exist in previous commits.

---

## 11. Test Behavior, Including Failure Paths

Do not test only the perfect scenario.

For important features, test:

- expected successful behavior
- missing input
- invalid input
- unavailable dependency
- duplicate actions
- unexpected external responses
- boundary values

Example questions for SetPoint:

- What if the part number does not exist?
- What if required setup data is missing?
- What if the database cannot be reached?
- What if the operator presses Save twice?
- What if a value is outside its allowed range?

### Why

Real systems usually fail at the edges, not in the demo path.

---

## 12. Prefer Small, Focused Functions

A function should have one understandable job.

If a function validates data, queries a database, sends email, calculates values, writes a file, and formats UI output, it is probably doing too much.

### Why

Small functions are easier to test, reuse, replace, and reason about.

---

## 13. Avoid Clever Code

Prefer readable code over compressed or impressive-looking code.

Bad goal:

> Use the fewest possible lines.

Better goal:

> Make the behavior obvious to the next person reading it.

### Why

Most software is read more often than it is written.

---

## 14. Name Things by Meaning

Prefer:

```python
approved_setup
machine_id
load_setup_history()
```

over:

```python
data
thing
x
do_it()
```

### Why

Good names reduce the amount of explanation code needs.

---

## 15. Use `pyproject.toml`

Python projects should declare their configuration and dependencies in a standard project file.

Where appropriate, `pyproject.toml` should define:

- Python version requirements
- application dependencies
- development dependencies
- test configuration
- formatting/linting configuration
- type-checking configuration

### Why

A project should be reproducible on another machine.

---

## 16. Pin or Constrain Important Dependencies

Do not blindly install whatever newest version exists forever.

Dependency versions should be intentionally managed.

### Why

A dependency update can change behavior or break working software.

Upgrades should be deliberate and tested.

---

## 17. Use Git as a Safety System

Changes should be small enough to understand.

Before committing:

- inspect changed files
- run relevant tests
- ensure secrets were not added
- confirm unrelated files were not changed

Commit messages should describe the completed change.

Example:

```text
Add validated after-hours request model
```

### Why

Git is not just cloud storage. It is our history, rollback system, and record of engineering decisions.

---

## 18. Do Not Change Working Behavior Casually

If an existing feature is in use, avoid silently changing its behavior.

When replacing something:

1. understand the existing behavior
2. create the replacement
3. test the replacement
4. migrate callers or data
5. verify the new path
6. remove the old path only when safe

### Why

A cleaner implementation is not useful if it unexpectedly breaks users.

---

## 19. Comments Explain Why

Do not write comments that merely repeat the code.

Bad:

```python
# Add one to count
count += 1
```

Useful:

```python
# Station numbers shown to operators begin at 1,
# while the internal list is zero-indexed.
station_index = station_number - 1
```

### Why

Code usually shows **what** is happening. Comments should explain non-obvious **why**.

---

## 20. AI Coding Rules

AI-generated code follows the same standard as human-written code.

When using Codex, ChatGPT, Claude, Gemini, or another coding assistant:

### The AI should

- explain major architectural decisions
- preserve existing behavior unless asked to change it
- inspect relevant existing code before modifying it
- use existing project patterns when reasonable
- add or update tests
- handle realistic failure cases
- avoid unnecessary dependencies
- avoid unnecessary rewrites
- state important assumptions
- never invent successful test results
- never claim something works without verifying it when verification is possible

### We should

- understand the purpose of major files and components
- review important changes
- ask why when a pattern is unfamiliar
- run tests
- inspect failures rather than repeatedly prompting the AI to “fix it”
- learn from each significant change

### Why

AI makes code generation cheap.

It does not make bad architecture, bad assumptions, or production failures cheap.

---

# Definition of Done

A feature is not done merely because it appears to work.

For meaningful Python features, ask:

- [ ] Does the behavior match the requirement?
- [ ] Is incoming data validated?
- [ ] Are responsibilities reasonably separated?
- [ ] Are types clear?
- [ ] Are external dependencies explicit?
- [ ] Are errors handled intentionally?
- [ ] Do external calls have timeouts?
- [ ] Are useful events and failures logged?
- [ ] Are secrets kept out of source code?
- [ ] Are successful and failure paths tested?
- [ ] Did the relevant tests pass?
- [ ] Is the code understandable without the original AI conversation?
- [ ] Can we explain the major pieces in plain English?
- [ ] Did we inspect the Git diff before committing?

If important answers are “no,” the work is not finished yet.

---

# Learning Rule

When we encounter an unfamiliar engineering concept, use this sequence:

## WHAT

What is this concept?

## WHY

What problem does it solve?

## HOW

How are we using it in this project?

## PRACTICE

Make one small decision or change using the concept.

We are not trying to memorize the entire Python language.

We are learning to recognize good software structure, understand system behavior, diagnose failures, and make sound engineering decisions.

---

# MimirLogic Principle

> **Generate quickly. Understand deliberately. Test before trusting.**

AI can help us move faster.

Engineering discipline determines whether what we build is worth keeping.
