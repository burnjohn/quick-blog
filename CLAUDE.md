@AGENTS.md

## Claude Code specifics

- Nested rules: `client/AGENTS.md`, `server/AGENTS.md`, `docs/AGENTS.md`, `specs/AGENTS.md`
  apply when you work in those folders — read the one for the folder you are editing.
- Skills (`.claude/skills/`), subagents (`.claude/agents/`) and slash commands
  (`.claude/commands/`) are catalogued in each folder's `README.md`. Load the matching
  skill before writing code: `react-best-practices` for `client/`, `express-best-practices`
  for `server/`, `security` for auth/uploads/input handling, the testing skills for tests.
- Always use `/commit` for commits and `/create-pr` for pull requests; never run raw
  `git commit` or `gh pr create`.
