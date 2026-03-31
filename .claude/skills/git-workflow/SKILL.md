---
name: git-workflow
description: "Git workflow conventions for branches, commits, and PRs. Use when creating branches, generating commit messages, creating pull requests, or any Git operation that needs to follow project conventions. Covers conventional commits, branch naming, PR formatting, ticket extraction, and pre-push build checks."
---

# Git Workflow

Conventions for Git operations in this project.

For complete examples of commits, PRs, and branches, see [examples.md](references/examples.md).

## CRITICAL: Commit & Push Policy

- **NEVER commit or push unless the user EXPLICITLY and DIRECTLY asks for it**
- **ONE commit or push per explicit request** — do not batch, retry, or repeat
- After making code changes, WAIT for the user to say "commit" or "push"
- This applies in ALL scenarios: bug fixes, PR review comments, feature work, refactors
- If a commit fails (e.g., pre-commit hook), fix the issue and WAIT for the user to ask again
- NEVER auto-commit as part of completing a task

## Conventional Commit Types

| Type | Use for |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, semicolons, etc. |
| `refactor` | No feature/fix, code restructuring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance, dependencies |
| `ci` | CI/CD changes |
| `build` | Build system changes |

## Message Format

All commits, PR titles, and related messages use:

```
<type>(<TICKET>): <short description>
```

- Ticket in scope is **required** when available (e.g., `BLOG-123`)
- Scope must match: `[A-Z]+-\d+`
- Description: imperative mood, under 72 chars, no trailing period
- Keep to 1 line (2 max) — no bullet-point lists in commit messages

Examples:
- `feat(BLOG-68): add title grouping for blog posts`
- `fix(BLOG-42): clear error message on modal close`
- `refactor(BLOG-100): simplify blog filtering logic`

## Branch Naming

**With ticket:** `<type>/<TICKET>/<kebab-description>`
**Without ticket:** `<type>/<kebab-description>`

Branch types: `feature`, `feat`, `fix`, `improvement`, `refactor`, `chore`, `docs`, `test`

Examples:
- `feature/BLOG-68/blog-categories`
- `fix/BLOG-42/fix-comment-validation`
- `docs/add-readme`

## Ticket Extraction

Extract ticket from branch name:

```bash
git branch --show-current
# e.g., "feature/BLOG-68/blog-categories" → ticket is "BLOG-68"
```

If no ticket found in branch name, ask the user.

## PR Description Format

Every PR description follows this structure. Sections marked *(conditional)* are only included when applicable.

```markdown
## What was done

- <Action verb> <specific change> in `<filename>`
- <Action verb> <specific change>

**Logic:** +<src_ins> −<src_del> | **Tests:** +<test_ins> −<test_del>

**Why `<approach>` over alternatives:** *(optional — only if complex, ASK the user first)*

- **<Alternative 1>** — why it doesn't work or was rejected
- **<Alternative 2>** — why it doesn't work or was rejected
- **<Chosen approach>** — why this was selected, how it works

## Tests *(conditional — only if PR includes test changes)*

`<TestFile.test.jsx>` (N tests):
- <What the tests cover>
- <Key scenarios tested>

`<AnotherTestFile.test.js>` (N tests):
- <What the tests cover>

## Ticket

BLOG-<number>
```

### Section Rules

**What was done:**
- Be file-specific — mention actual file/component names
- Start with action verbs: Added, Removed, Fixed, Updated, Refactored, Created
- One change per bullet, max 5-7 bullets
- Use backticks for file names and code references

**Why (alternatives) section:**
- Include ONLY when the PR involves a non-trivial design decision
- Before writing this section, **ASK the user** whether they want to document alternatives and the reasoning
- List rejected approaches with short explanations of why they don't apply
- End with the chosen approach and its benefits
- Use bold for approach names, em-dash for explanations

**Tests section:**
- Include when the PR adds or modifies test files
- List each test file with the number of tests in parentheses
- Under each file, summarize what's tested (not individual test names)

**Ticket section:**
- Always include the ticket number extracted from the branch name

### Change Stats

When creating the PR, compute line-level change stats split by source vs test code:

```bash
# Total stats
git diff main...HEAD --stat | tail -1

# Test file stats (*.test.* and *.spec.*)
git diff main...HEAD -- '*.test.*' '*.spec.*' --stat | tail -1

# Source = total minus test
```

Include a summary line after "What was done" bullets:

```markdown
**Logic:** +280 −78 | **Tests:** +67 −11
```

- **Logic** = lines changed in non-test files (features, fixes, refactors)
- **Tests** = lines changed in `*.test.*` and `*.spec.*` files
- If no test files changed, show only Logic: `**Logic:** +347 −89`

## GitHub Operations

- **Use the GitHub MCP tools as the primary method** for all GitHub operations (creating PRs, listing PRs, adding comments, etc.)
- Fall back to the `gh` CLI only if MCP tools are unavailable or fail

## Push Policy

- **NEVER push changes unless the user explicitly asks to push**
- Before pushing, always ask the user for confirmation first
- If the user asks to push, run the build first to catch errors:

```bash
# For client changes
cd client && npm run build

# For server changes — check for syntax errors
cd server && node --check server.js
```

Only push if the build succeeds. The IDE may not show all errors.
