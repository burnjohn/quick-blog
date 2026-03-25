---
name: brainstorming
description: "Use when starting creative work — new features, architectural changes, or significant modifications. Activates BEFORE any code is written to refine ideas through structured questions and present designs for validation."
---

# Brainstorming

Refine rough ideas into clear, validated designs before writing any code.

## When This Activates

Before any creative work: new features, new components, architectural changes, significant modifications. If the user jumps straight to "build X", pause and brainstorm first.

## Core Principles

1. **One question at a time.** Never dump a list of questions. Ask one, wait for the answer, then ask the next.
2. **Multiple choice when possible.** Give 2-3 concrete options instead of open-ended questions.
3. **YAGNI (You Aren't Gonna Need It).** Don't add features that aren't requested. Push back on unnecessary complexity.
4. **Alternatives before decisions.** Always present at least 2 approaches with trade-offs before committing.
5. **Small chunks.** Present design in 200-300 word sections. Get validation on each before continuing.

## Workflow

### Phase 1: Understand the Project

Before proposing anything, understand the current state:

1. Read the project structure and key files
2. Identify what exists and what's relevant to the request
3. Summarize your understanding back to the user in 2-3 sentences

### Phase 2: Explore the Idea

Ask questions to understand what the user really wants:

1. "What problem does this solve for the user?"
2. "Who uses this?" (public visitors, admin, both?)
3. "What's the simplest version that would be useful?"
4. "Is there anything similar already in the codebase?"

Ask ONE question at a time. Wait for the answer.

### Phase 3: Propose Approaches

Present 2-3 approaches with clear trade-offs:

```
**Approach A: [Name]**
- How it works: [1-2 sentences]
- Pros: [list]
- Cons: [list]

**Approach B: [Name]**
- How it works: [1-2 sentences]
- Pros: [list]
- Cons: [list]

Which approach fits your needs better? Or should I explore a different direction?
```

### Phase 4: Design in Chunks

Once an approach is chosen, present the design in digestible sections:

1. **Data model** — What data is needed? Where does it come from?
2. **User flow** — What does the user see and do, step by step?
3. **Component/API structure** — How is it organized? (frontend, backend, or both)
4. **Edge cases** — What could go wrong? How is it handled?

Present each section separately. Wait for the user to validate or suggest changes before moving on.

### Phase 5: Write the Design Document

After all sections are validated, write a summary to `docs/plans/YYYY-MM-DD-<name>-design.md`:

```markdown
# Feature: <Name>

## Summary
<1-2 sentences>

## Approach
<Chosen approach and why>

## Data Model
<What was agreed>

## User Flow
<Step by step>

## Component/API Structure
<Agreed structure>

## Edge Cases
<What was discussed>

## Open Questions
<Anything unresolved>
```

## Anti-Patterns

- **Jumping to code.** Design first, code second.
- **Asking too many questions at once.** One at a time.
- **Proposing only one approach.** Always offer alternatives.
- **Giant design docs.** Keep sections short and focused.
- **Gold-plating.** Build the simplest version first. Iterate.

## Remember

- The goal is a clear design that both you and the user agree on
- It's OK to push back on ideas that add unnecessary complexity
- Simple > clever, every time
- The user knows their product better than you — ask, don't assume
