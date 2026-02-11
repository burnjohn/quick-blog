# Agents

Specialized AI agents for specific development workflows. Invoked via the Task tool or directly referenced in Cursor chat.

## Catalog

| Agent | Scope | Description |
|-------|-------|-------------|
| [implementor](implementor.md) | Full-stack | Main implementation agent — detects frontend/backend and loads appropriate skills |
| [react-reviewer](react-reviewer.md) | Frontend | Skeptical React architecture reviewer — flags anti-patterns |
| [backend-reviewer](backend-reviewer.md) | Backend | Skeptical Express/API reviewer — flags security and pattern issues |
| [requirements-planner](requirements-planner.md) | Full-stack | Creates structured feature requirements through iterative questions |
| [plan-verifier](plan-verifier.md) | Full-stack | Validates completed implementations against plans and standards |
| [test-writer](test-writer.md) | Full-stack | Writes tests for components, hooks, controllers, and middleware |

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
