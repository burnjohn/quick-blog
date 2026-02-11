---
name: git-workflow
description: "Git workflow conventions for branches, commits, and PRs. Use when creating branches, generating commit messages, creating pull requests, or any Git operation that needs to follow project conventions."
---

# Git Workflow

Conventions for Git operations in this project.

For complete examples of commits, PRs, and branches, see [examples.md](examples.md).

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
<type>(<scope>): <short description>
```

- Scope is optional; use ticket number if available (e.g., `BLOG-123`)
- Description: imperative mood, under 72 chars, no trailing period
- Keep to 1 line (2 max) — no bullet-point lists in commit messages

Examples:
- `feat(BLOG-68): add title grouping for blog posts`
- `fix: clear error message on modal close`
- `refactor(api): simplify blog filtering logic`

## Branch Naming

**With ticket:** `<type>/<TICKET>/<kebab-description>`
**Without ticket:** `<type>/<kebab-description>`

Branch types: `feature`, `feat`, `fix`, `improvement`, `refactor`, `chore`, `docs`, `test`

Examples:
- `feature/BLOG-68/blog-categories`
- `fix/comment-validation`
- `docs/add-readme`

## Ticket Extraction

Extract ticket from branch name:

```bash
git branch --show-current
# e.g., "feature/BLOG-68/blog-categories" → ticket is "BLOG-68"
```

If no ticket found in branch name, ask the user.

## PR Description Format

```markdown
## What was done

- <Action verb> <specific change> in `<filename>`
- <Action verb> <specific change>
```

Rules:
- Be file-specific — mention actual file/component names
- Start with action verbs: Added, Removed, Fixed, Updated, Refactored, Created
- One change per bullet, max 5-7 bullets
- Use backticks for file names and code references

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

Only push if the build succeeds.
