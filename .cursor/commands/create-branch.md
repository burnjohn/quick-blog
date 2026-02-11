# create-branch

Create a new Git branch following the project's naming conventions.

## Prerequisites

Read the git-workflow skill at `.cursor/skills/git-workflow/SKILL.md` for branch naming conventions and types.

## Input Parameters

- **Type**: {{type}} (e.g., feature, fix, improvement, docs)
- **Ticket Number**: {{ticket}} (e.g., BLOG-1234, leave empty if none)
- **Description**: {{description}} (brief kebab-case description)

## Instructions

1. Convert description to kebab-case (lowercase, hyphens)
2. Keep description concise (max 30 characters recommended)
3. Ticket number should be uppercase
4. For bug fixes with tickets, use `fix` (not `bug`)
5. If no ticket provided, omit the ticket segment

## Command

```bash
git checkout -b <generated-branch-name>
```

## Output

Confirm:
- Branch name created
- Current branch status
- Ready for development
