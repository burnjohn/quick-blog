---
name: safe-ui-refactoring
description: "Safe, incremental refactoring of React UI applications. Use when restructuring components, extracting hooks, migrating state management, reorganizing file structure, or reducing technical debt in React code. Enforces behavior preservation, baby-step execution, and verification at every step."
---

# Safe UI Refactoring

Structured approach to refactoring React applications without breaking existing behavior. Every change is small, verified, and reversible.

For the full list of sources and articles behind these guidelines, see [RESOURCES.md](RESOURCES.md).

## Core Rule

**Behavior must be identical before and after every refactoring step.** If you cannot prove the output is unchanged, the step is not complete.

> Refactoring is not a special task — it is part of day-to-day programming. Small, behavior-preserving transformations that keep the system working after each change. — Martin Fowler

## When This Activates

- Restructuring or splitting React components
- Extracting custom hooks from component bodies
- Migrating state management (Redux → Context, class → hooks, etc.)
- Reorganizing file/folder structure
- Removing dead code or reducing duplication
- Upgrading React versions or replacing deprecated APIs
- Reducing component size (>200 lines) or prop count (>7 props)
- Addressing code smells flagged by the `react-best-practices` skill

---

## Phase 1: Assess Before Touching Code

Before any refactoring, establish a clear picture of what exists.

### Identify the Refactoring Target

1. **Read the code** — understand what it does, not just what it looks like
2. **Map dependencies** — what imports this? what does it import?
3. **Check test coverage** — are there tests? do they pass? what do they cover?
4. **Capture current behavior** — document inputs, outputs, side effects, rendered UI

### Decide Whether to Refactor

Refactoring is justified when:
- Code changes frequently AND is hard to modify (high churn + high complexity)
- A new feature would be easier to add after restructuring
- Multiple developers struggle to understand the module
- Code smells accumulate (see catalog below)

Refactoring is NOT justified when:
- Code works, is rarely touched, and is well-tested
- You're under a tight deadline with no safety net
- The "improvement" is purely aesthetic with no measurable benefit

### Establish a Safety Net

Before the first change:

- [ ] All existing tests pass (`npm test`)
- [ ] Baseline behavior is documented or screenshots captured
- [ ] Git working tree is clean (commit or stash unrelated changes)
- [ ] You know how to verify the refactoring didn't break anything

If test coverage is insufficient, **write characterization tests first** — tests that capture current behavior, even if imperfect. These are your safety net.

---

## Phase 2: Plan in Baby Steps

**Every refactoring is a sequence of tiny, independently verifiable steps.** Never combine multiple structural changes in one step.

### Baby Step Rules

1. **One structural change per step** — extract one hook OR rename one file OR split one component. Never combine.
2. **Each step must compile and pass tests** — if it doesn't, the step is too big.
3. **Each step should be summarizable in one sentence** — if you need a paragraph, split it further.
4. **Commit after each successful step** — creates a reversible checkpoint.
5. **Verify behavior after EVERY step** — not just at the end.

### Planning Template

Before starting, write out the step sequence:

```
Refactoring: [target component/module]
Goal: [what the end state looks like]

Steps:
1. [one-sentence description] → verify: [how to confirm behavior unchanged]
2. [one-sentence description] → verify: [how to confirm behavior unchanged]
3. [one-sentence description] → verify: [how to confirm behavior unchanged]
...
```

### Step Sizing Guide

| Step size | Example | Correct? |
|-----------|---------|----------|
| Extract one function to a helper | `formatPrice()` moved to `utils/` | Yes |
| Extract one hook from a component | `useFormState()` extracted | Yes |
| Rename a file and update imports | `List.jsx` → `BlogList.jsx` | Yes |
| Extract hook + rename + split component | Three things at once | **No — split into 3 steps** |
| Rewrite entire module from scratch | "Let me just redo this" | **No — incremental only** |

---

## Phase 3: Execute the Refactoring

### Verification Protocol

After EVERY baby step, run this checklist:

- [ ] **Tests pass** — `npm test` (or the relevant subset)
- [ ] **No new lint errors** — check with ReadLints
- [ ] **UI renders the same** — visual comparison if applicable
- [ ] **No console errors/warnings** — check browser console
- [ ] **Behavior is identical** — same inputs produce same outputs, same side effects fire

### Pre/Post Behavior Comparison

For each refactoring step, explicitly verify:

| Check | Before | After | Match? |
|-------|--------|-------|--------|
| Rendered output | [describe/screenshot] | [describe/screenshot] | Must match |
| Event handlers | [list handlers] | [list handlers] | Must match |
| API calls | [list calls + params] | [list calls + params] | Must match |
| State transitions | [describe flow] | [describe flow] | Must match |
| Side effects | [list effects] | [list effects] | Must match |

If ANY row doesn't match, **stop and fix before proceeding.**

### When Something Breaks

1. **Revert the last step** — `git checkout .` or `git stash`
2. **Analyze why** — was the step too large? did you miss a dependency?
3. **Break the step into smaller sub-steps**
4. **Try again** with the smaller steps

Never push forward with broken behavior hoping to "fix it later."

---

## Phase 4: Refactoring Catalog

Specific techniques ordered from safest/simplest to most involved.

### Tier 1 — Rename & Reorganize (lowest risk)

**Rename for clarity** — Change variable, function, or file names to express intent. Use IDE rename refactoring to update all references automatically.

**Move file to correct location** — Relocate a file to match feature-based structure. Update all imports. One file per step.

**Remove dead code** — Delete unused imports, unreachable branches, commented-out code. Verify nothing breaks.

### Tier 2 — Extract (medium risk)

**Extract helper function** — Move pure computation out of component body to module scope or a `utils/` file. Function must be pure (same input → same output, no side effects).

**Extract custom hook** — Move stateful logic (`useState`, `useEffect`, event handlers) into a named custom hook. The component should call the hook and receive return values.

**Extract sub-component** — Split a section of JSX + its local state into a child component. Pass data via props. The parent's behavior must remain identical.

**Extract constants** — Move magic strings, numbers, configuration objects to `constants/` files.

### Tier 3 — Restructure (higher risk)

**Replace prop drilling with composition** — Use `children` prop or compound component pattern instead of passing props through intermediate layers.

**Replace state duplication with derivation** — Remove `useState` + `useEffect` sync patterns. Compute derived values inline during render.

**Consolidate related state** — Replace multiple `useState` calls with `useReducer` when states change together.

**Introduce layering** — Separate view logic (JSX, styles) from domain logic (business rules, data transforms) from data access (API calls, storage). Follow Fowler's Presentation-Domain-Data pattern.

### Tier 4 — Migrate (highest risk, requires feature flags)

**State management migration** — Moving from Redux → Context, class state → hooks, etc. Use Branch by Abstraction: introduce an abstraction layer, migrate consumers one by one, remove old implementation.

**Component library swap** — Replacing one UI library with another. Use the Strangler Fig pattern: wrap new components behind the same interface, migrate page by page.

**React version upgrade** — Use official codemods (`react-codemod`) for automated transforms. Apply one codemod at a time, verify between each.

---

## Phase 5: Validate Completion

After ALL steps are done:

- [ ] Full test suite passes
- [ ] No new lint errors or warnings
- [ ] Visual regression check (manual or automated) confirms UI unchanged
- [ ] No console errors in browser
- [ ] Bundle size hasn't increased unexpectedly
- [ ] Performance hasn't degraded (no new unnecessary re-renders)
- [ ] Code is easier to understand than before (the whole point)
- [ ] All temporary scaffolding / feature flags are cleaned up

---

## Code Smells That Signal Refactoring Need

| Smell | Typical Fix |
|-------|-------------|
| Component > 200 lines | Extract sub-components and hooks |
| > 7 props on a component | Split component or use composition |
| > 3 `useState` in one component | `useReducer` or extract hook |
| `useEffect` for derived state | Remove effect, compute inline |
| Prop drilling > 2 levels deep | Composition, Context, or restructure |
| Copy-pasted JSX blocks | Extract shared component |
| `renderThing()` functions returning JSX | Convert to `<Thing />` component |
| Boolean prop explosion (`isX`, `isY`, `isZ`) | Consolidate into variant/status enum |
| Inline anonymous functions in JSX props | Extract to named handler or `useCallback` |
| God component (fetch + transform + render) | Layer into container + presenter + hook |

---

## Safe Migration Patterns

### Branch by Abstraction

For replacing an implementation without long-lived branches:

1. Create an abstraction (interface/wrapper) over the old code
2. Migrate all consumers to use the abstraction
3. Build the new implementation behind the same abstraction
4. Switch consumers one by one to the new implementation
5. Remove old implementation once fully migrated

### Strangler Fig

For gradually replacing legacy pages or large modules:

1. Identify a self-contained page or feature to migrate first
2. Build the replacement alongside the legacy version
3. Route traffic to the new version (feature flag or URL-based)
4. Monitor for errors and performance regressions
5. Repeat for next page/feature until legacy is fully replaced

### Codemods for Bulk Changes

For repetitive, mechanical transforms across many files:

1. Identify the pattern with concrete before/after examples
2. Write test fixtures (input.js → output.js pairs)
3. Use `jscodeshift` to build the AST transform
4. Dry-run across the codebase, review diff
5. Apply, commit, verify tests pass

---

## Anti-Patterns

- **Big Bang rewrite** — Rewriting from scratch instead of incrementally. Fails ~70% of the time.
- **Refactoring without tests** — No safety net means no confidence. Write characterization tests first.
- **Combining refactoring with feature work** — Separate commits: refactor first, then build the feature on the clean code.
- **Skipping verification steps** — "It's just a rename" — until it breaks an import path.
- **Premature abstraction** — Don't create "reusable" components/hooks before you have 2+ real consumers.
- **Refactoring rarely-touched code** — Focus on high-churn, high-complexity modules. Leave stable code alone.
- **"I'll fix the tests later"** — Tests must pass after EVERY step, not just at the end.

---

## Remember

- Refactoring changes structure, NEVER behavior
- If behavior changed, it's not refactoring — it's rewriting
- Baby steps feel slow but finish faster than heroic rewrites
- Every step needs a verification checkpoint
- Commit early, commit often — each passing step is a safe rollback point
- The goal is code that's easier to understand and change, not "perfect" code
