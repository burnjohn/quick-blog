# Testing

The server tests use Vitest 4, Supertest 7 and `mongodb-memory-server` 11. No Docker or running database is needed.

## Running

```bash
cd server
npm test              # vitest run (single pass)
npm run test:watch    # vitest (watch mode)
npx vitest run tests/blogCrud.test.js   # one file
```

Current state: 14 files, 59 tests, all passing (about 12 s locally). The first run downloads a MongoDB binary for `mongodb-memory-server`, so it needs network access once.

## Configuration (`vitest.config.js`)

| Option | Value | Why |
|--------|-------|-----|
| `globals` | `true` | `describe`, `it` and `expect` are available without import (most files import them anyway) |
| `environment` | `node` | |
| `testTimeout` / `hookTimeout` | 15000 ms | starting the in-memory Mongo can be slow |
| `setupFiles` | `./tests/setup.js` | |
| `fileParallelism` | `false` | files run one after another, so a single connection and per-test cleanup are safe |

## Setup (`tests/setup.js`)

- `beforeAll`: start a `MongoMemoryServer`, set `process.env.JWT_SECRET = 'test-secret-key'` and `NODE_ENV = 'test'`, then `mongoose.connect(uri)`.
- `afterEach`: `deleteMany({})` on every collection, so each test starts empty.
- `afterAll`: disconnect and stop the server.

The in-memory database has none of the Docker init validators or indexes. Only indexes declared in Mongoose schemas exist (unique `User.email`).

## The app under test

HTTP tests import `src/app.js`, not `server.js`. `server.js` connects to the real database and calls `listen()` at import time. `src/app.js` is a reduced copy of the middleware stack: no `apiLimiter`, no `httpLogger`, open `cors()`. Route-level limiters (login, comments, generate) are still active.

When you add a router or app-level middleware to `server.js`, add it to `src/app.js` as well, or the tests will not exercise it.

## Helpers (`tests/fixtures.js`)

| Helper | Purpose |
|--------|---------|
| `createTestUser(overrides)` | creates an active `admin` user (`admin@test.com` / `password123`) |
| `generateToken(user)` | signs a 1-hour JWT with the same payload shape as login |
| `createTestBlog(user, overrides)` | creates a published Technology post |
| `authHeader(token)` | `{ Authorization: 'Bearer <token>' }` for `.set(...)` |

## Test files

| File | Covers |
|------|--------|
| `healthCheck.test.js` | `GET /` shape and ISO timestamp |
| `errorHandler.test.js` | 404 shape. Asserts that a malformed blog id returns 500 |
| `auth.test.js` | `auth` middleware: valid, missing, invalid and expired tokens |
| `adminLogin.test.js` | login success, wrong email, wrong password, inactive user |
| `adminDashboard.test.js` | dashboard counts, admin blog list including drafts, 401 without a token |
| `blogCrud.test.js` | `/all`, `/:blogId`, `/delete` (cascades comments), `/publish`, `/unpublish`, 401 on protected routes |
| `comments.test.js` | add comment (unapproved), public list returns approved only, approve, delete |
| `blogModel.test.js`, `commentModel.test.js`, `userModel.test.js` | required fields, defaults, password hashing, `comparePassword`, `toJSON` |
| `blogValidator.test.js` | `validateComment` unit tests |
| `imageUrl.test.js` | `SERVER_URL` handling and URL transforms |
| `response.test.js` | `sendSuccess`, `sendError`, `sendData` |
| `asyncHandler.test.js` | promise rejection goes to `next` |

## Conventions

- Arrange data through models or the `tests/fixtures.js` helpers, call the endpoint through `request(app)`, and assert on `status` plus `body`.
- Do not depend on order between files. Collections are wiped after each test.
- Put pure helpers (validators, `imageUrl`) in unit tests that pass mock `req`/`res`/`next` objects.
- The project's `backend-testing` skill has more detailed patterns.

## Known gaps

- **Untested endpoints.** No tests cover `POST /api/blog/add` (Multer and `validateBlogInput`), `POST /api/blog/generate` (Gemini), `unapprove-comment`, `GET /api/admin/comments` or the rate limiters.
- **The app used in tests differs from production.** Because `src/app.js` and `server.js` are separate, CORS, `apiLimiter` and logging behaviour are not tested.
- **One test locks in a defect.** `errorHandler.test.js` asserts the 500 for a malformed id. It will need updating if CastError is mapped to 400.
- **Noisy output.** CastError stack traces are printed to the console during the run.
