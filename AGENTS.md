# AGENTS.md — QuickBlog

Instructions for AI coding agents working in this repository. This is the canonical
rules file: `CLAUDE.md` imports it, and the nested `client/AGENTS.md`,
`server/AGENTS.md`, `docs/AGENTS.md` and `specs/AGENTS.md` add rules for their folders.
When rules conflict, the file closest to the code you are editing wins.

## What this project is

A full-stack demo blog with an editorial ("Ink & Signal") design: a public magazine-style
front page and article pages, plus an admin "Editor's desk" for writing, publishing and
moderating. It is used for live demos of AI-assisted development (see `docs/demos/`).

| Layer | Stack |
|-------|-------|
| Client (`client/`) | React 19, Vite 6, Tailwind CSS 4, React Router 7, motion/react, Axios, Quill |
| Server (`server/`) | Express 5, Mongoose 8, JWT (jsonwebtoken), bcryptjs, Multer, Helmet, express-rate-limit, Google Gemini (`@google/genai`) |
| Database | MongoDB 7 in Docker Compose (+ Mongo Express on :8081), migrate-mongo |
| Tests | Vitest everywhere; React Testing Library + MSW (client); Supertest + mongodb-memory-server (server) |
| Modules | ES Modules (`"type": "module"`) in both packages |

## Repository map

```
quick-blog/
├── AGENTS.md / CLAUDE.md / README.md
├── client/      React SPA            → client/AGENTS.md, client/docs/
├── server/      Express API          → server/AGENTS.md, server/docs/
├── specs/       Feature specs (EARS) → specs/AGENTS.md, specs/README.md
├── docs/        Cross-cutting docs   → docs/AGENTS.md, docs/README.md
│   ├── architecture.md, getting-started.md
│   ├── design/  image-generation prompts
│   ├── demos/   workshop walkthroughs
│   └── flows/   end-to-end sequence diagrams
├── .claude/     Claude Code skills, agents, slash commands
└── .github/     CI (DevDigest PR review)
```

## Commands

| Task | Command |
|------|---------|
| First run | `cd server && npm i && cp .env.example .env && npm run setup` then `cd client && npm i && cp .env.example .env` |
| Start API (:5001) | `cd server && npm run dev` (DB + nodemon) or `npm run server` (nodemon only) |
| Start client (:5173) | `cd client && npm run dev` |
| Re-seed demo data | `cd server && npm run seed` |
| Tests | `npm test` in `client/` or `server/` |
| Lint / build client | `cd client && npm run lint && npm run build` |

Seeded logins: `admin@quickblog.com` / `admin123` (admin), `sarah@quickblog.com` / `sarah123` (author).

## Workflow rules

1. **Spec first.** Every feature has a spec in `specs/`. Before changing behavior, read
   the spec; when behavior changes, update the spec's acceptance criteria in the same
   change. New features get a new spec (format in `specs/AGENTS.md`).
2. **Docs follow code.** A change that makes a doc in `client/docs/`, `server/docs/` or
   `docs/` wrong must update that doc in the same change.
3. **Keep the layers separate.** `client/` never imports from `server/` and vice versa.
   Shared contracts are described in specs, not shared code.
4. **ES modules only.** No `require()` (except the `.cjs` migrate-mongo config).
5. **Thin routes.** Server routes wire middleware to controllers; logic lives in
   controllers, helpers and models.
6. **No secrets in code.** Configuration comes from `.env`; document new variables in
   the matching `.env.example`.
7. **Design system is binding.** UI changes follow `client/docs/design-system.md` and
   `client/docs/motion.md` (no rounded corners, hard offset shadows, reduced-motion safe).
8. **Git.** Use `/commit` and `/create-pr` (they load the `git-workflow` skill:
   conventional commits, branch naming, PR format). Never push unless asked.

## Feature status

| Area | Status | Spec |
|------|--------|------|
| Public front page, article page, comments, newsletter | Shipped | `specs/public/` |
| Admin auth, shell, dashboard, authoring, blog list, comment moderation | Shipped | `specs/admin/` |

## Where to look

| You are changing… | Read first |
|-------------------|-----------|
| Any UI | `client/AGENTS.md`, `client/docs/design-system.md`, `client/docs/components.md` |
| Data fetching / API calls in the client | `client/docs/data-layer.md`, `server/docs/api.md` |
| An endpoint, model or middleware | `server/AGENTS.md`, `server/docs/api.md`, `server/docs/data-model.md` |
| Auth, uploads, rate limits | `server/docs/auth-and-security.md`, `server/docs/uploads-and-images.md` |
| Seed / demo content | `server/docs/seeding-and-fixtures.md` |
| A feature's behavior | the matching file in `specs/` |
| System overview | `docs/architecture.md` |
