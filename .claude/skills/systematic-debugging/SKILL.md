---
name: systematic-debugging
description: "Use when investigating bugs, errors, or unexpected behavior. Activates when something is broken and needs diagnosis. Enforces root-cause analysis before any fix attempt."
---

# Systematic Debugging

A structured approach to finding and fixing bugs. No guessing, no random changes.

## Core Rule

**No fixes without root cause first.** If you can't explain WHY the bug happens, you don't understand it well enough to fix it.

> **Tip:** For bugs that need runtime instrumentation (race conditions, timing issues, memory leaks), also consider Cursor's Debug Mode (`Cmd+.` → Debug). This skill defines the *reasoning process*; Debug Mode provides the *runtime tooling*.

## When This Activates

- Something is broken or behaving unexpectedly
- Tests are failing
- An error appears in the console, logs, or UI
- The user reports a bug
- A fix attempt hasn't worked

## Phase 1: Gather Evidence

Before forming any hypothesis, collect facts:

### Read Error Messages
- Read the FULL error message, including stack traces
- Identify the exact file and line number
- Note the error type (TypeError, SyntaxError, 404, 500, etc.)

### Reproduce the Bug
- Find the exact steps to reproduce
- Note: does it happen every time or intermittently?
- Note: does it happen in dev, production, or both?

### Check Recent Changes
```bash
git log --oneline -10
git diff HEAD~1
```
- What changed recently? Did this work before?
- Did a dependency update break something?

### Read Relevant Code
- Read the file where the error occurs
- Read the callers (what invokes this code?)
- Read the dependencies (what does this code depend on?)

### Check Logs
- Browser console (frontend)
- Server terminal output (backend)
- Database logs (`npm run db:logs`)
- Network tab in browser dev tools (API responses)

## Phase 2: Analyze Patterns

Look for patterns in the evidence:

- **When** does it fail? (Always? Only on certain input? Only after another action?)
- **Where** does it fail? (Client? Server? Database? Network?)
- **What** changed? (Code? Data? Environment? Dependencies?)
- **Who** is affected? (All users? Just admin? Just specific browsers?)

### Common Patterns

| Pattern | Likely Cause |
|---------|-------------|
| Works locally, fails in production | Environment variable or build config issue |
| Works on first load, fails on navigation | Client-side routing or state issue |
| Intermittent failures | Race condition, timing, or network issue |
| Works for some data, fails for others | Data validation or edge case |
| Error after dependency update | Breaking API change in dependency |
| 401/403 on API calls | JWT token expired or missing auth middleware |
| CORS errors | Server CORS config doesn't match client origin |
| MongoDB connection errors | Docker not running or connection string wrong |

## Phase 3: Form and Test Hypotheses

Based on evidence, form a specific hypothesis:

**Template:** "The bug occurs because [specific cause] which results in [observed behavior] when [trigger condition]."

### Test the Hypothesis

- Add targeted logging/instrumentation to verify
- Check if the hypothesis explains ALL observed symptoms
- If the hypothesis is wrong, go back to Phase 1 and gather more evidence

### Rules for Hypothesis Testing

1. **One change at a time.** Never change multiple things simultaneously.
2. **Verify before AND after.** Confirm the bug exists, then confirm the fix works.
3. **Check side effects.** Does the fix break anything else?
4. **Understand, don't guess.** If you can't explain why the fix works, you haven't found the root cause.

## Phase 4: Fix and Verify

### Implement the Fix

1. Make the minimal change that fixes the root cause
2. Don't fix symptoms — fix the cause
3. Add defensive code if appropriate (input validation, null checks)
4. Consider: should we add a test that catches this regression?

### Verify the Fix

- [ ] The original bug no longer reproduces
- [ ] No new errors in console/logs
- [ ] Related functionality still works (manual test or run tests)
- [ ] Edge cases are handled

### Document the Fix

In your commit message or PR description, include:
- What was broken
- What caused it (root cause)
- What was changed to fix it

## Escalation Rules

### After 3 Failed Fix Attempts

Stop and reassess:

1. Am I solving the right problem?
2. Is my understanding of the system correct?
3. Should I read more code or logs?
4. Is this an architecture issue, not a bug?
5. Should I ask the user for more context?

### When to Step Back

- If you've been debugging for more than 15 minutes without progress
- If the fix keeps breaking something else
- If you can't reproduce the bug consistently
- If the code path is too complex to reason about

In these cases: simplify, add logging, and gather more evidence.

## Anti-Patterns

- **Shotgun debugging:** Making random changes hoping one works
- **Cargo cult fixes:** Copying a fix from Stack Overflow without understanding it
- **Symptom fixing:** Adding a null check instead of finding why it's null
- **Silent swallowing:** Wrapping in try-catch with empty catch block
- **"Works on my machine":** Dismissing the bug because you can't reproduce it locally

## Remember

- Bugs are information — they tell you something about the system you didn't know
- The fix should be proportional to the bug — a one-line bug usually has a one-line fix
- If the fix is complex, question whether you've found the real root cause
- Always verify the fix. "It should work" is not verification.
