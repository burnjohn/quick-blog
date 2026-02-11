# Skills

Reusable AI skills that provide specialized knowledge and workflows. Installed to `.cursor/skills/` and shared with the team via version control.

## Catalog

| Skill | Scope | Description |
|-------|-------|-------------|
| [git-workflow](git-workflow/SKILL.md) | Shared | Conventional commits, branch naming, PR formatting |
| [react-best-practices](react-best-practices/SKILL.md) | Frontend | React anti-patterns, state management, hooks rules, Tailwind |
| [express-best-practices](express-best-practices/SKILL.md) | Backend | Express patterns, middleware, error handling, Mongoose |
| [brainstorming](brainstorming/SKILL.md) | Shared | Feature ideation workflow — design before code |
| [writing-plans](writing-plans/SKILL.md) | Shared | Step-by-step implementation planning |
| [systematic-debugging](systematic-debugging/SKILL.md) | Shared | Root-cause debugging methodology |
| [frontend-testing](frontend-testing/SKILL.md) | Frontend | Vitest, React Testing Library, userEvent, MSW, accessible queries |
| [backend-testing](backend-testing/SKILL.md) | Backend | Vitest, Supertest, mongodb-memory-server, auth and security testing |

## What Are Skills?

Skills are modular packages that extend the AI agent with specialized knowledge and workflows. Unlike rules (always applied) or agents (invoked for specific tasks), skills are loaded on-demand when the agent determines they're relevant.

### Skills vs Rules vs Commands vs Agents

| Type | Scope | Loaded | Purpose |
|------|-------|--------|---------|
| **Rules** (`.mdc`) | Project conventions | Always or by file pattern | Persistent guardrails |
| **Commands** (`.md`) | User actions | On `/command` invocation | Slash commands |
| **Skills** (`.md`) | Domain knowledge | On-demand by agent | Specialized knowledge |
| **Agents** (`.md`) | Workflows | Via Task tool | Subagent orchestration |

## Creating New Skills

Each skill has:

- `SKILL.md` — Main skill file with rules and conventions (required)
- `examples.md` — Code examples showing good/bad patterns (recommended)
- `references.md` — Sources and rationale (optional)
