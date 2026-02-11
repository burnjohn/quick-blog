# commit

Generate a commit message based on the current staged changes.

## Prerequisites

Read the git-workflow skill at `.cursor/skills/git-workflow/SKILL.md` for commit format, types, and conventions.

## Critical Rules

- **DO NOT commit unless explicitly asked** — only run `git commit` when the user specifically requests it
- **If asked to commit — do it only ONCE** — never retry or repeat commit attempts

## Instructions

1. **Extract ticket from branch:**
   ```bash
   git branch --show-current
   ```

2. **Get staged changes:**
   ```bash
   git diff --staged --stat
   git diff --staged
   ```

3. **Analyze and determine:**
   - The commit type (from git-workflow skill conventions)
   - The ticket number (from branch name or ask user)
   - A concise description of the change

4. **Generate the commit command:**
   ```bash
   git commit -m "<type>(<TICKET>): <description>"
   ```

## Output

1. **Suggested commit message** in the exact format
2. **Commit command** ready to copy
3. **Alternative suggestions** if the change could be categorized differently

## Notes

- If changes span multiple concerns, suggest splitting into multiple commits
- The PR number (e.g., `#427`) is added automatically by GitHub when merging — don't include it
- Follow push policy from the skill: never push unless explicitly asked
