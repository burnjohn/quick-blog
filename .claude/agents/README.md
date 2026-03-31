# Agents

Specialized AI agents for specific development workflows. Works with both **Cursor** and **Claude Code**.

## Dual-Tool Setup

All skills, agents, and commands live in `.claude/` (single source of truth). Symlinks in `.cursor/` provide Cursor compatibility:

```
.claude/skills/          ← canonical (10 skills)
.claude/agents/          ← canonical (8 agents)
.claude/commands/        ← canonical (5 commands)
.cursor/skills → ../.claude/skills     ← symlink
.cursor/agents → ../.claude/agents     ← symlink
.cursor/commands → ../.claude/commands ← symlink
.cursor/rules/           ← Cursor-only (.mdc files)
```

**Claude Code** uses:
- `skills:` frontmatter field to auto-load skills into agent context
- `tools:` frontmatter field to restrict available tools per agent

**Cursor** uses:
- Body instructions that reference `.claude/skills/*/SKILL.md` file paths
- Ignores unknown frontmatter fields (`tools`, `skills`)

To verify the setup is working: use the `verify-setup` agent.

## Catalog

| Agent | Scope | Description |
|-------|-------|-------------|
| [implementor](implementor.md) | Full-stack | Main implementation agent — detects frontend/backend and loads appropriate skills |
| [react-reviewer](react-reviewer.md) | Frontend | Skeptical React architecture reviewer — flags anti-patterns |
| [backend-reviewer](backend-reviewer.md) | Backend | Skeptical Express/API reviewer — flags security and pattern issues |
| [requirements-planner](requirements-planner.md) | Full-stack | Creates structured feature requirements through iterative questions |
| [plan-verifier](plan-verifier.md) | Full-stack | Validates completed implementations against plans and standards |
| [test-writer](test-writer.md) | Full-stack | Writes tests for components, hooks, controllers, and middleware |
| [refactoring-planner](refactoring-planner.md) | Full-stack | Creates structured refactoring plans with risk assessment |
| [verify-setup](verify-setup.md) | Config | Verifies dual-tool setup (Cursor + Claude Code) is working |

## Usage

### implementor

The primary agent for building features. Automatically detects whether work is in `client/` (frontend) or `server/` (backend) and loads the right skill. Use when:
- Implementing features from a plan
- Building new components or API endpoints
- Following an implementation plan from `docs/plans/`

### react-reviewer

Use after modifying React components, hooks, or state management. It will:
- Load `react-best-practices` skill
- Check for derived state, render factories, useEffect misuse
- Output Critical / Warning / Suggestion findings

### backend-reviewer

Use after modifying Express controllers, routes, middleware, or models. It will:
- Load `express-best-practices` skill
- Check for security issues, missing validation, error handling gaps
- Output Critical / Warning / Suggestion findings

### requirements-planner

Use when starting a new feature. It will:
- Ask structured questions across 6 categories
- Create a requirements document focused on WHAT, not HOW
- Cover all states: loading, error, empty, success

### plan-verifier

Use after claiming a feature is complete. It will:
- Compare implementation against the original plan
- Check project standards (Tailwind, Express patterns)
- Report incomplete or missing steps

### test-writer

Use when you need tests for existing or new files. It will:
- Detect frontend vs backend context
- Use Vitest + RTL for frontend, Vitest + supertest for backend
- Write focused, behavior-driven tests
