# create-pr

Create a GitHub Pull Request with a concise, file-specific description.

## Prerequisites

Read the git-workflow skill at `.cursor/skills/git-workflow/SKILL.md` for PR title format and description conventions.

## Instructions

1. **Extract ticket from branch:**
   ```bash
   git branch --show-current
   ```

2. **Analyze all changes on the branch:**
   ```bash
   git log main..HEAD --oneline
   git diff main...HEAD --stat
   ```

3. **Create the PR:**
   - Extract ticket number from branch name
   - Determine the type (fix, feat, refactor, etc.)
   - Write concise, file-specific bullet points

4. **Run build check before pushing:**
   ```bash
   # For client changes
   cd client && npm run build

   # For server changes
   cd server && node --check server.js
   ```

5. **Push and create PR using gh CLI:**
   ```bash
   git push -u origin HEAD
   gh pr create --title "<type>(<TICKET>): <description>" --body "$(cat <<'EOF'
   ## What was done

   - <bullet points>
   EOF
   )"
   ```

## Output

1. **PR title** in the exact format
2. **PR description** with concise bullet points
3. **Ready-to-run command** to create the PR
4. **PR URL** after creation

## Notes

- Always push the branch before creating the PR
- If branch is already pushed, skip the push step
- Keep the description scannable — reviewers should understand changes in 10 seconds
