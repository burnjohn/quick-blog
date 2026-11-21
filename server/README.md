# QuickBlog server

The Express 5 API behind QuickBlog. It handles blog posts, comments with moderation, JWT admin login, local image uploads and AI drafting with Google Gemini, on top of MongoDB (Mongoose 8) running in Docker.

Detailed docs live in [docs/](./docs/README.md). Conventions for coding agents are in [AGENTS.md](./AGENTS.md).

## Quick start

Requires Node.js 20 or later (Vitest 4 needs it) and Docker with the `docker-compose` command, which the npm scripts call.

```bash
cd server
npm install
cp .env.example .env        # then set JWT_SECRET and GEMINI_API_KEY
npm run setup               # start MongoDB in Docker, then seed demo data
npm run server              # API on http://localhost:5001 (nodemon)
```

Check it with `curl http://localhost:5001/`, which returns `{"success":true,"message":"API is Working",...}`.

Demo logins created by the seed:

| Role | Email | Password |
|------|-------|----------|
| admin | `admin@quickblog.com` | `admin123` |
| author | `sarah@quickblog.com` | `sarah123` |

Mongo Express (database web UI) runs at `http://localhost:8081` and uses the Mongo user and password as basic-auth credentials.

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `db:start` + `server` | start MongoDB, then the API with nodemon |
| `npm run server` | `NODE_ENV=development nodemon server.js` | API only, auto-reload |
| `npm start` | `NODE_ENV=production node server.js` | production start |
| `npm run setup` | `db:start`, wait 5 s, `seed` | first-time setup |
| `npm run seed` | `node scripts/seed.js` | **wipes** users, blogs and comments, then reseeds |
| `npm test` | `vitest run` | run the test suite once (in-memory MongoDB) |
| `npm run test:watch` | `vitest` | tests in watch mode |
| `npm run db:start` / `db:stop` / `db:restart` | `docker-compose up -d` / `down` / `restart` | manage containers |
| `npm run db:logs` | `docker-compose logs -f mongodb` | follow database logs |
| `npm run db:clean` | `docker-compose down -v` | remove containers **and data volume** |
| `npm run migrate:status` / `migrate:up` / `migrate:down` / `migrate:create` | `migrate-mongo … -f migrations/migrate-mongo-config.cjs` | migrations. `up` is currently broken; see [docs/data-model.md](./docs/data-model.md#known-gaps) |

## Environment variables

From `.env.example`:

| Variable | Example | Used by |
|----------|---------|---------|
| `MONGODB_USER` | `quickblog` | Docker Compose (root user, mongo-express) |
| `MONGODB_PASSWORD` | `quickblog123` | Docker Compose |
| `MONGODB_DATABASE` | `quickblog` | Docker Compose |
| `MONGODB_URI` | `mongodb://quickblog:quickblog123@localhost:27017/quickblog` | `src/configs/db.js`, seed, migrations. Required: the server exits without it |
| `PORT` | `5001` | `server.js` |
| `CLIENT_URL` | `http://localhost:5173` | CORS allowlist, comma-separated, added to the built-in localhost origins |
| `NODE_ENV` | `development` | set by the npm scripts. `development` adds stack traces to error responses and disables caching |
| `JWT_SECRET` | – | signing and verifying tokens. Required for login |
| `GEMINI_API_KEY` | – | `src/configs/gemini.js` (`POST /api/blog/generate`) |

Not in `.env.example`, but read by the code:

| Variable | Used by |
|----------|---------|
| `SERVER_URL` | optional base for absolute image URLs (`src/utils/imageUrl.js`). See [docs/uploads-and-images.md](./docs/uploads-and-images.md#server_url) |

## Layout

```
server/
├── server.js            # runtime entry: connects DB, middleware, routes, listen()
├── src/app.js           # same app without DB connect, logger or global limiter (used by tests)
├── src/                 # routes, controllers, models, middleware, validators, helpers, utils, configs
├── fixtures/            # seed data (users, blogs + archive/, comments)
├── scripts/             # seed.js, gen-covers.mjs
├── migrations/          # migrate-mongo
├── init-scripts/        # Docker first-run DB init
├── uploads/             # blogs/ (admin uploads), seed/ (demo covers)
├── tests/               # vitest + supertest
└── docs/                # reference docs
```

## Documentation

- [API reference](./docs/api.md)
- [Data model](./docs/data-model.md)
- [Auth and security](./docs/auth-and-security.md)
- [Uploads and images](./docs/uploads-and-images.md)
- [Seeding and fixtures](./docs/seeding-and-fixtures.md)
- [Testing](./docs/testing.md)
