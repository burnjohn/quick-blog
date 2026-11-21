# server/ — agent guide

Express 5 + Mongoose 8 API, ES modules only (`"type": "module"`). Human overview: [README.md](./README.md). Reference docs: [docs/](./docs/README.md).

## Folder map

| Path | Contents |
|------|----------|
| `server.js` | runtime entry: `connectDB()`, CORS, Helmet, JSON, `apiLimiter`, static `/uploads`, `httpLogger`, routers, error handlers, `listen()` |
| `src/app.js` | test app: the same routers and error handlers, without DB connect, `apiLimiter` or logger. **Keep it in sync with `server.js`** |
| `src/routes/` | `appRoutes` (`/`), `adminRoutes` (`/api/admin`), `blogRoutes` (`/api/blog`) |
| `src/controllers/` | `appController`, `adminController`, `blogController` |
| `src/models/` | `User`, `Blog`, `Comment` |
| `src/middleware/` | `auth`, `errorHandler` (`notFound`, `errorHandler`), `multer`, `rateLimiter` |
| `src/validators/` | `blogValidator` (`validateBlogInput`, `validateComment`) |
| `src/helpers/` | `asyncHandler`, `response` |
| `src/utils/` | `httpLogger`, `dbLogger`, `imageUrl` |
| `src/configs/` | `db.js`, `gemini.js` |
| `src/constants/messages.js` | `SUCCESS_MESSAGES`, `ERROR_MESSAGES`, `HTTP_STATUS` (not imported by any route code yet) |
| `fixtures/`, `scripts/seed.js` | seed data and seeder. `scripts/gen-covers.mjs` regenerates SVG covers |
| `migrations/` | migrate-mongo (currently cannot load; see docs/data-model.md) |
| `init-scripts/` | Docker first-run validators and indexes |
| `uploads/` | `blogs/` (runtime, git-ignored), `seed/` (committed demo covers) |
| `tests/` | Vitest + Supertest + mongodb-memory-server |

## Commands

Run from `server/`:

| Task | Command |
|------|---------|
| Start DB + API | `npm run dev` |
| API only (nodemon) | `npm run server` |
| Seed (wipes data) | `npm run seed` |
| First-time setup | `npm run setup` |
| Tests | `npm test` · `npm run test:watch` · `npx vitest run tests/<file>.test.js` |
| DB containers | `npm run db:start` · `db:stop` · `db:restart` · `db:logs` · `db:clean` (deletes volume) |
| Migrations | `npm run migrate:status` · `migrate:up` · `migrate:down` · `migrate:create <name>` |
| Regenerate SVG covers | `node scripts/gen-covers.mjs uploads/seed` |

There is no lint or build step for the server. Before finishing a change, run `npm test`.

## Conventions

### Layers
- Routes declare path, middleware and handler only. No logic. Business logic goes in controllers, or in `src/helpers/` when it is reusable or heavy.
- Declare static paths before param paths (`/all` before `/:blogId`).
- Mount new routers in **both** `server.js` and `src/app.js`.
- Protected routes go after `router.use(auth)` in the route file. `auth` sets `req.user = { userId, email, name, role }`. No role middleware exists yet; if you need role checks, add one rather than checking inline.

### Async and errors
- Wrap every async controller in `asyncHandler` from `helpers/asyncHandler.js`. Do not add try/catch just to forward errors.
- `errorHandler` (mounted last) answers `err.statusCode || 500` with `{ success: false, message }`. To return a specific status from a throw, set `err.statusCode`.
- Response helpers in `helpers/response.js` (actual signatures):
  - `sendSuccess(res, data = {}, message = 'Success', statusCode = 200)` returns `{ success: true, message, ...data }`
  - `sendError(res, message = 'Error', statusCode = 400)` returns `{ success: false, message }`
  - `sendData(res, data, count = null)` returns `{ success: true, count?, ...data }`
- Use the helpers in new code. The existing controllers (`blogController`, `adminController`) call `res.status().json()` inline and the helpers are only exercised by `tests/response.test.js`; leave those handlers unless you are already changing them.
- Keep the envelope flat: payload keys sit next to `success`, not under `data`. `count` accompanies lists.

### Validation
- Validators live in `src/validators/` as middleware that respond 400 or call `next()`.
- Accept only expected types: reject arrays and objects, coerce explicitly, check bounds, then attach parsed values to `req` for the controller. The existing `blogValidator.js` checks presence and length only, so do not copy it as-is.
- Validate body, query and params before touching the database. Malformed ObjectIds currently become 500s, so validate ids in new endpoints.

### Data
- Models are PascalCase singular files with `timestamps: true`. Declare defaults, enums and indexes in the schema, and add a migration for indexes on existing collections.
- Store image paths relative (`/uploads/...`) and convert them with `transformBlogImage(s)` from `utils/imageUrl.js` in every response that includes a post.
- Hash passwords only through `save()` or `create()` (the `pre('save')` hook). Never return `password`.

### Security
- Helmet and CORS are configured in `server.js`. Allowed origins are the localhost dev ports plus comma-separated `CLIENT_URL`.
- Rate limiters live in `middleware/rateLimiter.js`. `apiLimiter` allows 100/min on `/api`; `loginLimiter` 5 per 15 min; `commentLimiter` 5/min; `generateLimiter` 3/min. Add a dedicated limiter to any new public write endpoint.
- Secrets come only from `.env`, and new variables go into `.env.example`. Do not commit keys.
- Never log `Authorization` headers, tokens or passwords.

### Uploads
- Use `middleware/multer.js` (`upload.single('image')`): images only, 5 MB, written to `uploads/blogs/`.

### Messages and logging
- Put new user-facing strings in `constants/messages.js` (the existing controllers still hardcode theirs).
- Use `utils/httpLogger.js` (request/response) and `utils/dbLogger.js` (DB events). Avoid new `console.log` calls in request paths.

### Style
- `import`/`export` only, never `require()`. The one exception is `migrations/migrate-mongo-config.cjs`, which migrate-mongo requires.
- `async`/`await`, not `.then()` chains.
- camelCase file names, PascalCase models.
- Aim for files of about 200 lines or fewer.
- Keep server code in `server/`. Never import server modules from `client/`, or the other way round.

## Docs to read before changing X

| Changing | Read first |
|----------|-----------|
| Any route, controller or response shape | [docs/api.md](./docs/api.md) |
| Models, indexes, migrations | [docs/data-model.md](./docs/data-model.md) |
| Auth, CORS, Helmet, rate limits, validators, error handling, logging | [docs/auth-and-security.md](./docs/auth-and-security.md) |
| Multer, `uploads/`, image URLs | [docs/uploads-and-images.md](./docs/uploads-and-images.md) |
| Seed script, fixtures, demo content, covers, Docker | [docs/seeding-and-fixtures.md](./docs/seeding-and-fixtures.md) |
| Tests or test setup | [docs/testing.md](./docs/testing.md) |
| Public site behaviour | [../specs/public/](../specs/public/) |
| Admin panel behaviour | [../specs/admin/](../specs/admin/) |

Update the matching docs page in the same change when behaviour changes. If you find a defect, add it to that page's "Known gaps" rather than describing it as a feature.
