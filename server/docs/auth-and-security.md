# Auth and security

This page covers authentication, the security middleware, validation, error handling and logging, as implemented in `server.js` and `src/`.

## Middleware order (`server.js`)

| # | Middleware | Scope |
|---|-----------|-------|
| 1 | `cors(...)` with an origin allowlist | all |
| 2 | `helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false })` | all |
| 3 | `express.json({ limit: '10mb' })` | all |
| 4 | `apiLimiter` | `/api` |
| 5 | `express.static(uploads)` | `/uploads` |
| 6 | No-cache headers (`Cache-Control: no-store…`, `Pragma`, `Expires: 0`) | all, only when `NODE_ENV=development` |
| 7 | `httpLogger` | all except static files, which are answered at step 5 |
| 8 | Routers: `/`, `/api/admin`, `/api/blog` | |
| 9 | `notFound`, then `errorHandler` | last |

`src/app.js` builds a second, reduced app for tests. It has open `cors()`, the same helmet and JSON settings, static uploads, routers and error handlers, but no `apiLimiter`, no `httpLogger` and no no-cache headers. Route-level limiters (login, comment, generate) still apply in tests because they live in the route files. The two app definitions must be kept in sync by hand. See [testing.md](./testing.md).

## Authentication (JWT)

### Login

`POST /api/admin/login` (`src/controllers/adminController.js`):

1. `User.findOne({ email, isActive: true })`.
2. `user.comparePassword(password)` (bcryptjs).
3. On success, sign `{ userId, email, name, role }` with `process.env.JWT_SECRET`, `expiresIn: '7d'`, using the default HS256 algorithm.
4. Respond `{ success, token, user: { name, email, role } }`.

Unknown email, wrong password and inactive user all return the same 401 `Invalid Credentials`.

### `auth` middleware (`src/middleware/auth.js`)

- Reads `req.headers.authorization`. If it is missing, returns 401 `No token provided`.
- Strips a leading `Bearer `. A raw token is also accepted, for backwards compatibility.
- `jwt.verify(token, JWT_SECRET)`. `TokenExpiredError` returns 401 `Token expired`; any other failure returns 401 `Invalid token`.
- On success sets `req.user = { userId, email, name, role, iat, exp }`.

The middleware does not reload the user, so a token stays valid for its full 7 days even after the user is deactivated. There is no refresh, logout or revocation.

Where it applies:

- `adminRouter.use(auth)` covers every `/api/admin/*` route after `/login`.
- `blogRouter.use(auth)` covers `/api/blog/add`, `/delete`, `/publish`, `/unpublish` and `/generate`.

### Roles

`User.role` is `admin` or `author` and is embedded in the token, but no middleware or controller reads it. In practice both seeded accounts have identical API permissions.

## Password storage

`src/models/User.js` hashes with `bcrypt.genSalt(10)` plus `bcrypt.hash` in `pre('save')`, and `toJSON` removes `password`. Seed passwords pass through `User.create`, so they are hashed.

## CORS (`server.js`)

- Allowed origins: `http://localhost:5173`, `http://localhost:5174`, `http://localhost:5175`, plus every comma-separated entry in `CLIENT_URL`. The localhost entries are allowed in every environment, production included.
- Requests with no `Origin` header (curl, server-to-server) are allowed.
- `credentials: true`. Methods `GET, POST, PUT, DELETE, OPTIONS`. Allowed headers `Content-Type, Authorization`.
- A rejected origin logs to the console and calls back with `new Error('Not allowed by CORS')`. That error reaches `errorHandler`, which answers 500.

## Helmet

Default Helmet headers apply (HSTS, `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: no-referrer` and the rest), with two changes:

- `Cross-Origin-Resource-Policy: cross-origin`, so the client on another port can load `/uploads/*` images.
- `contentSecurityPolicy: false`, so no CSP header is sent.

## Rate limiting

`src/middleware/rateLimiter.js` (express-rate-limit 8, in-memory store, keyed by `req.ip`, standard `RateLimit-*` headers, legacy headers off). All limiters return 429 with a JSON body.

| Limiter | Window | Max | Applied to | Message |
|---------|--------|-----|-----------|---------|
| `apiLimiter` | 1 min | 100 | everything under `/api` (`server.js`) | `Too many requests. Please slow down.` |
| `loginLimiter` | 15 min | 5 | `POST /api/admin/login` | `Too many login attempts. Please try again after 15 minutes.` |
| `commentLimiter` | 1 min | 5 | `POST /api/blog/add-comment` | `Too many comments submitted. Please wait a moment.` |
| `generateLimiter` | 1 min | 3 | `POST /api/blog/generate` | `Too many generation requests. Please wait a moment.` |

`apiLimiter` is mounted only in `server.js`, so the Supertest app (`src/app.js`) has no global limit. `/uploads` and `/` are not rate limited.

## Validation

Validators in `src/validators/` are Express middleware. They either respond 400 or call `next()`.

| Validator | Used by | Error shape |
|-----------|---------|-------------|
| `validateBlogInput` | `POST /api/blog/add` (after Multer) | `{ success: false, message: 'Validation failed', errors: [...] }` |
| `validateComment` | `POST /api/blog/add-comment` | same |

Both validators check presence and minimum length only; they do not check types. New validators should accept only strings (rejecting arrays and objects), parse values and attach them to `req` for the controller. Express 5's default `simple` query parser already prevents `?a[$gt]=1` from becoming an object, but JSON bodies can still carry objects.

## Error handling and response helpers

- `src/helpers/asyncHandler.js`: `asyncHandler(fn)` wraps an async controller and forwards rejections to `next`. Every async controller uses it.
- `src/middleware/errorHandler.js`:
  - `notFound` returns 404 `{ success: false, message: 'Route not found: <METHOD> <url>' }`.
  - `errorHandler` logs with `console.error`, then responds with status `err.statusCode || 500` and `{ success: false, message: err.message || 'Internal Server Error' }`, adding `stack` when `NODE_ENV === 'development'`.
- `src/helpers/response.js`:

| Helper | Signature | Output |
|--------|-----------|--------|
| `sendSuccess` | `(res, data = {}, message = 'Success', statusCode = 200)` | `{ success: true, message, ...data }` |
| `sendError` | `(res, message = 'Error', statusCode = 400)` | `{ success: false, message }` |
| `sendData` | `(res, data, count = null)` | `{ success: true, count?, ...data }`, status 200 |

No controller uses these helpers yet; only `tests/response.test.js` exercises them. The blog and admin controllers call `res.status(...).json(...)` directly with inline strings. `src/constants/messages.js` (`SUCCESS_MESSAGES`, `ERROR_MESSAGES`, `HTTP_STATUS`) is not imported anywhere.

## Logging

| Logger | File | What it records |
|--------|------|-----------------|
| `src/utils/httpLogger.js` | `logs/http.log` and stdout | each request (method, URL, IP, User-Agent), the JSON body with top-level `password` and `token` masked as `***`, and each response (status, duration, `count`/`success` when the body is JSON) |
| `src/utils/dbLogger.js` | `logs/db-changes.log` and stdout | `logCreate`, `logUpdate`, `logDelete`, `logMigration`, `logEvent`, `logError`. Used by `configs/db.js`, the seed script and migrations |

Both use synchronous `fs.appendFileSync` and create `logs/` on import. `logs/` is git-ignored. `configs/db.js` logs the host part of `MONGODB_URI` (the text after `@`), not the credentials.

## Secrets and configuration

All runtime secrets come from `.env` (`dotenv/config` in `server.js`): `JWT_SECRET`, `MONGODB_URI`, `GEMINI_API_KEY`. The full variable list is in [../README.md](../README.md#environment-variables).

## Known gaps

- **No authorization by role.** Authors have full admin API access.
- **Tokens cannot be revoked.** They last 7 days, deactivating a user does not invalidate existing tokens, and there is no logout.
- **No startup check for `JWT_SECRET`.** If it is unset, `jwt.sign` throws, so login answers 500, and every protected request answers 401 `Invalid token`.
- **Login body is not type-checked.** `email` goes straight into `findOne`, so a JSON object such as `{ "$ne": null }` is accepted as a query operator. bcrypt still has to match that user's password, but the input should be validated as a string.
- **Localhost origins are always allowed,** even when `NODE_ENV=production`.
- **CORS rejections return 500** instead of 403.
- **Error messages leak internals.** `err.message` is returned for every 500, including Mongoose cast messages, and the stack is added in development (`npm run server` sets `NODE_ENV=development`).
- **No `trust proxy` setting.** Behind a reverse proxy (`vercel.json` targets Vercel), `req.ip` is the proxy address, so all clients share one rate-limit bucket. `req.protocol` reports `http`, which also affects image URLs.
- **HTTP logs hold personal data.** They store request bodies, including login emails and comment text, in plain text. Masking covers only top-level `password` and `token` keys.
- **Logging blocks the event loop.** Synchronous file writes run on every request.
- **No CSP.** Helmet's CSP is disabled.
