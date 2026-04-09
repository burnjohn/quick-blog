# Quick Blog — Project Overview

Full-stack blog demo (React + Express + MongoDB). Works with both **Claude Code** and **Cursor**.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Client | React 19, Vite 6, Tailwind CSS 4, React Router 7, Axios |
| Server | Express 5, MongoDB (Mongoose 8), JWT (jsonwebtoken), bcryptjs |
| Auth | JWT-based; admin panel with login |
| Features | Blog CRUD, comments, AI content generation (Google Gemini), file uploads (Multer) |
| Database | MongoDB via Docker Compose; migrate-mongo for migrations |
| Build | ES Modules (`"type": "module"`) everywhere |

## Key Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| `npm run dev` | client/ | Vite dev server |
| `npm run build` | client/ | Production build |
| `npm run dev` | server/ | Start DB + nodemon |
| `npm run server` | server/ | Nodemon only |
| `npm run seed` | server/ | Seed database |
| `npm run setup` | server/ | Start DB + seed |
| `npm run db:start` | server/ | Start MongoDB via Docker |

## Git Workflow

- Always use `/commit` for commits — it loads the `git-workflow` skill for consistent conventional commits
- Always use `/create-pr` for pull requests — it formats title, description, and labels per project conventions
- Never run raw `git commit` or `gh pr create` directly — the skills enforce team conventions that are easy to miss manually

## Do Not

- Mix client and server code; keep `client/` and `server/` strictly separate
- Use `require()`; use ES module `import`/`export` only
- Put business logic in route files; keep routes thin and delegate to controllers/models
- Hardcode secrets or environment-specific URLs; use `.env` files

## AI Configuration Layout

```
.claude/                 # Canonical location (Claude Code)
├── skills/              # On-demand domain knowledge (10 skills)
├── agents/              # Specialized subagents (8 agents)
└── commands/            # Slash commands (/commit, /plan, etc.)

.cursor/                 # Cursor-specific config + symlinks
├── rules/               # Always-on conventions (.mdc files)
├── commands → ../.claude/commands   # Symlink
├── skills → ../.claude/skills       # Symlink
└── agents → ../.claude/agents       # Symlink
```
