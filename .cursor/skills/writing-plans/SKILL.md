---
name: writing-plans
description: "Use when you have an approved design or feature spec and need to create a step-by-step implementation plan. Activates after brainstorming/design approval. Breaks work into small, verifiable tasks."
---

# Writing Implementation Plans

Create detailed, step-by-step implementation plans from approved designs or feature specs.

## When This Activates

After a design is approved (from brainstorming skill or user-provided spec) and before implementation begins. Also use when the user says "plan this" or "break this into tasks."

## Core Principles

1. **Audience:** Write for an enthusiastic junior engineer with no project context. Be explicit about everything.
2. **Task size:** Each task should take 2-5 minutes. If it takes longer, split it.
3. **Verifiable:** Every task has a verification step — how do you know it's done?
4. **Sequential:** Tasks are ordered so each builds on the previous one. No forward references.
5. **Complete:** Include exact file paths, function signatures, and code patterns. No ambiguity.

## Plan Structure

Write the plan to `docs/plans/YYYY-MM-DD-<name>.md`:

```markdown
# Implementation Plan: <Feature Name>

## Goal
<1-2 sentence summary of what we're building>

## Architecture Overview
<Brief description of how the pieces fit together>

### Files to Create
- `path/to/new/file.js` — purpose

### Files to Modify
- `path/to/existing/file.js` — what changes

---

## Tasks

### Task 1: <Short descriptive title>

**File:** `path/to/file.js`

**What to do:**
1. Step-by-step instructions
2. Include exact code to write or change
3. Reference existing patterns in the codebase

**Verification:**
- [ ] How to verify this task is complete
- [ ] What to check (e.g., "server starts without errors")

---

### Task 2: <Short descriptive title>

...
```

## Task Writing Rules

### Be Explicit
- Include the exact file path
- Show the code to write (not "add a function that does X")
- Reference existing patterns ("follow the same pattern as `blogController.js`")
- Specify imports that are needed

### Be Small
Each task should be ONE of:
- Create a single file with a clear purpose
- Add a single function or component
- Modify one section of an existing file
- Write a failing test, then make it pass (TDD pair)

If a task requires changing multiple files, split it into separate tasks.

### Be Verifiable
Every task needs a way to verify completion:
- "Run `npm run dev` — server starts on port 5001"
- "Visit `http://localhost:5173/` — new component renders"
- "Run `npm test` — all tests pass"
- "Check the API response at `GET /api/blogs` — returns filtered results"
- "Verify no console errors in browser dev tools"

### Task Types

**Backend tasks (server/):**
1. Model/schema changes
2. Controller functions
3. Route definitions
4. Middleware additions
5. Validation logic
6. Migration/seed data

**Frontend tasks (client/):**
1. API functions (`api/`)
2. Custom hooks (`hooks/`)
3. Components
4. Page integration
5. Constants/config updates
6. Styling/layout

### Ordering

For full-stack features, order tasks as:

1. **Backend model** — schema, migration, seed data
2. **Backend controller** — business logic
3. **Backend routes** — wire up endpoints
4. **Backend validation** — input checks
5. **Frontend API** — Axios calls
6. **Frontend hooks** — data fetching/mutation hooks
7. **Frontend components** — UI elements
8. **Frontend pages** — page-level integration
9. **Polish** — error handling, loading states, edge cases

## Anti-Patterns

- **Vague tasks:** "Implement the feature" is not a task. Be specific.
- **Giant tasks:** If a task has more than 5 steps, split it.
- **Missing paths:** Always include exact file paths.
- **No verification:** Every task needs a way to check it's done.
- **Forward references:** Task 3 should not depend on Task 5.
- **Mixing concerns:** One task = one file = one concept.

## Example

```markdown
### Task 3: Create blog API endpoint

**File:** `server/src/controllers/blogController.js`

**What to do:**
1. Add a new `getBlogsByCategory` function following the existing `getAllBlogs` pattern
2. Accept `category` from `req.query`
3. Use `Blog.find({ category }).sort({ createdAt: -1 }).lean()`
4. Return results with `sendData(res, { blogs }, blogs.length)`

**Verification:**
- [ ] `GET /api/blogs?category=Technology` returns only Technology blogs
- [ ] `GET /api/blogs` (no category) returns all blogs
- [ ] Invalid category returns empty array, not an error
```

## Remember

- Plans are living documents — update them as implementation reveals issues
- A good plan makes implementation nearly mechanical
- If you're unsure about a detail, note it as an open question rather than guessing
- The plan should be complete enough that someone new to the project can follow it
