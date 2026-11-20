# Getting started

Run QuickBlog locally: a MongoDB container, the Express API on `:5001` and the Vite
client on `:5173`.

## Prerequisites

- Node.js 18+ and npm
- Docker (running) — MongoDB 7 and Mongo Express run in containers

## First run

Start the server first: it boots the database and seeds the demo content.

```bash
# 1. API + database
cd server
npm install
cp .env.example .env
npm run setup        # docker-compose up -d, wait, seed demo data
npm run server       # nodemon on http://localhost:5001

# 2. Client (new terminal)
cd client
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

| URL | What |
|-----|------|
| http://localhost:5173 | Public front page |
| http://localhost:5173/admin | Editor's desk (admin) |
| http://localhost:8081 | Mongo Express (`quickblog` / `quickblog123`) |

Seeded accounts:

| Role | Email | Password |
|------|-------|----------|
| admin | `admin@quickblog.com` | `admin123` |
| author | `sarah@quickblog.com` | `sarah123` |

What the seed creates (posts, archive stories, comments, generated covers) is described in
[`server/docs/seeding-and-fixtures.md`](../server/docs/seeding-and-fixtures.md).

## Environment

### `server/.env`

| Variable | Default in `.env.example` | Purpose |
|----------|---------------------------|---------|
| `MONGODB_USER` / `MONGODB_PASSWORD` / `MONGODB_DATABASE` | `quickblog` / `quickblog123` / `quickblog` | Used by `docker-compose.yml` to create the database user |
| `MONGODB_URI` | `mongodb://quickblog:quickblog123@localhost:27017/quickblog` | Connection string |
| `PORT` | `5001` | API port |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | `development` | Set by the npm scripts too |
| `JWT_SECRET` | placeholder | Signs admin tokens — change it outside local dev |
| `GEMINI_API_KEY` | placeholder | Optional; enables "AI draft" in the editor |

Optional: `SERVER_URL` overrides the host used to build absolute image URLs (see
[`server/docs/uploads-and-images.md`](../server/docs/uploads-and-images.md)).

### `client/.env`

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_BASE_URL` | `http://localhost:5001` | API base URL |

## Database commands (`server/`)

| Command | Effect |
|---------|--------|
| `npm run db:start` / `db:stop` / `db:restart` | Manage containers (data persists in a volume) |
| `npm run db:logs` | Follow MongoDB logs |
| `npm run db:clean` | Stop containers **and delete all data** |
| `npm run seed` | Wipe and re-seed demo data |
| `npm run migrate:status` / `migrate:up` / `migrate:down` | migrate-mongo |

## Tests and checks

```bash
cd client && npm test && npm run lint && npm run build
cd server && npm test
```

Details: [`client/docs/testing.md`](../client/docs/testing.md),
[`server/docs/testing.md`](../server/docs/testing.md).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Images don't load | API must run on `:5001`; check `VITE_BASE_URL` in `client/.env`; check `ls server/uploads/seed/` |
| `MongoServerError` / connection refused | `docker ps`; then `cd server && npm run db:clean && npm run setup` |
| Port already in use | `lsof -ti:5001 \| xargs kill -9` (or `:5173`), or change `PORT` |
| Admin pages redirect to login | Token expired or DB re-seeded — log in again |
| "AI draft" fails | Set a real `GEMINI_API_KEY` in `server/.env` and restart the API |
