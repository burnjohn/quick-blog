---
name: express-best-practices
description: "Express.js and MongoDB/Mongoose best practices and anti-pattern catalog. Use when writing, reviewing, or refactoring Express controllers, middleware, routes, Mongoose models, or API endpoints. Covers MVC patterns, error handling, security, validation, and code organization."
---

# Express Best Practices & Anti-Patterns

Modern Express 5 + Mongoose 8 conventions. Covers what to do and what to avoid. For code examples, see [examples.md](examples.md).

## Severity Levels

- **CRITICAL** — Will cause bugs, security vulnerabilities, or data loss
- **HIGH** — Will cause reliability issues or scaling problems
- **MEDIUM** — Will hurt maintainability or developer experience

---

## Route Design (HIGH)

- Routes ONLY define endpoints and attach middleware — no business logic
- Use `asyncHandler` wrapper on ALL async route handlers
- Group routes by resource: `/api/blogs`, `/api/comments`, `/api/admin`
- Use proper HTTP methods: GET for reads, POST for creates, PUT/PATCH for updates, DELETE for deletes
- Return appropriate status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

## Controller Design (HIGH)

- Controllers handle request/response only — delegate business logic to models/helpers
- Use response helpers (`sendSuccess`, `sendError`, `sendData`) for ALL responses
- Never use raw `res.status().json()` — go through the response helpers
- Keep controllers thin: extract complex logic to helper functions
- One controller file per resource (blogController, commentController, adminController)

## Error Handling (CRITICAL)

- ALWAYS use `asyncHandler` — never write manual try-catch in route handlers
- Let errors propagate to the centralized `errorHandler` middleware
- Do NOT catch errors only to rethrow them — let the middleware chain handle it
- Throw errors with meaningful messages using `constants/messages.js`
- The errorHandler middleware MUST be mounted last

### Error Anti-Patterns
- NEVER swallow errors silently (empty catch blocks)
- NEVER send raw error objects to the client (security risk)
- NEVER use `console.log` for error logging — use the project loggers

## Mongoose Models (HIGH)

### Schema Design
- Define explicit types, required fields, and defaults for every field
- Use `timestamps: true` for automatic `createdAt`/`updatedAt`
- Add indexes for fields used in queries (especially in `find` filters and sorts)
- Use `enum` for fields with fixed value sets
- Set `trim: true` on string fields to avoid whitespace issues

### Query Patterns
- Use `.lean()` for read-only queries (returns plain objects, faster)
- Use `.select()` to return only needed fields
- Use `.populate()` sparingly — prefer denormalization for frequently accessed data
- Paginate ALL list queries — never return unbounded results
- Use `.countDocuments()` for counts, not `.find().length`

### Model Anti-Patterns
- NEVER store derived data that can be computed from other fields
- NEVER skip validation by using `{ validateBeforeSave: false }`
- NEVER use `findOneAndUpdate` without `{ new: true }` if you need the updated document

## Middleware (HIGH)

### Design Principles
- Single responsibility: one concern per middleware file
- Middleware should be pure functions that transform `req` or enforce policies
- Order matters — security before parsing before auth before routes before errors

### Auth Middleware
- Verify JWT token from `Authorization: Bearer <token>` header
- Attach decoded user to `req.user` for downstream handlers
- Return 401 for missing/invalid tokens — never silently skip
- Protect admin routes; leave public routes unprotected

### Validation Middleware
- Validate ALL user input before it reaches the controller
- Return 400 with clear error messages for invalid input
- Validate body, query params, and URL params separately

## Security (CRITICAL)

- **Helmet**: Always use for security headers
- **CORS**: Restrict to known origins; never use `cors({ origin: '*' })` in production
- **Rate Limiting**: Apply to auth endpoints and public APIs
- **Password Hashing**: Always use bcryptjs; NEVER store plain-text passwords
- **JWT**: Use short expiration times; store secrets in environment variables
- **Input Sanitization**: Never trust user input; validate and sanitize everything
- **File Uploads**: Validate file type and size; never allow arbitrary file execution

## API Response Format (MEDIUM)

Maintain consistent response shapes:

```
Success: { success: true, message: "...", ...data }
Error:   { success: false, message: "..." }
List:    { success: true, count: N, ...data }
```

## Express 5 Specifics (HIGH)

- `req.body` is `undefined` (not `{}`) when no body is sent — always use optional chaining: `req.body?.title`
- Async route handlers auto-propagate errors to `next(err)` — `asyncHandler` still recommended for consistency
- Path syntax changed: `/foo*` → `/foo(.*)`, `/:file.:ext?` → `/:file{.:ext}`

## Mongoose 8 Specifics (HIGH)

- `rawResult` is removed — use `includeResultMetadata()` for `findOneAndUpdate` metadata
- `doc.deleteOne()` returns a Query, not a Promise — call `.exec()` or `await` it explicitly
- `findOneAndRemove()` is removed — use `findOneAndDelete()` only
- `count()` is removed — use `countDocuments()` or `estimatedDocumentCount()`

## NoSQL Injection Prevention (CRITICAL)

- NEVER pass raw `req.body` or `req.query` values as Mongoose query operators
- A client can send `{ "password": { "$ne": "" } }` to bypass auth — always validate input types
- Avoid `$where` (executes arbitrary JS), `$regex` with untrusted input, and `$expr` with user data
- Sanitize or reject any input containing `$` prefixed keys

## Prototype Pollution Prevention (CRITICAL)

- NEVER use `Object.assign({}, userInput)` or spread untrusted objects without validation
- Reject or strip `__proto__`, `constructor`, and `prototype` keys from user input
- Prefer explicit field extraction: `const { title, content } = req.body`

## Graceful Shutdown (HIGH)

- Handle `SIGTERM` and `SIGINT` signals
- Stop accepting new connections with `server.close()`
- Close database connection with `mongoose.connection.close()`
- Set a forced shutdown timeout (e.g., 10 seconds) as a safety net
- Finish in-flight requests before exiting

## Database Connection Resilience (HIGH)

- Use explicit connection options: `serverSelectionTimeoutMS`, `retryWrites`, `maxPoolSize`
- Handle connection errors and reconnection gracefully
- Close connections on process shutdown — don't leave orphaned connections

## MongoDB Indexing Strategy (HIGH)

- Follow the **ESR rule** for compound indexes: Equality → Sort → Range
- A compound index supports prefix subsets (e.g., `{ status: 1, createdAt: -1 }` covers `status`-only queries)
- Use `.explain("executionStats")` to verify index usage in development
- Avoid low-cardinality-only indexes (e.g., boolean fields alone) — combine with other fields

## Structured Logging (MEDIUM)

- Use JSON-formatted logs with context fields (userId, requestId, durationMs)
- NEVER log passwords, tokens, API keys, or PII
- Use log levels appropriately: `error` for failures, `warn` for recoverable issues, `info` for request lifecycle
- In production, use structured loggers (Pino/Winston) — not `console.log`

## JWT Best Practices (HIGH)

- Use short-lived access tokens (15-60 min) and longer-lived refresh tokens (7-14 days)
- Rotate refresh tokens on each use (issue new, invalidate old)
- For token revocation: maintain a blacklist of token IDs (`jti`) with TTL matching token expiry
- Prefer HttpOnly cookies for token storage when the client is same-origin

## File Upload Security (HIGH)

- Validate file content by magic bytes (not just extension or MIME type — those are spoofable)
- Treat SVGs as potential XSS vectors (can contain `<script>` tags)
- Generate random filenames server-side — never trust user-provided filenames
- Store uploads outside the webroot or use a dedicated storage service
- Strip EXIF and metadata when possible

## Performance (MEDIUM)

- Use `compression` middleware for API responses (or handle at reverse proxy level)
- Set appropriate `Cache-Control` headers for static assets and GET endpoints
- Use `ETag` headers to enable `304 Not Modified` responses
- For heavy computation, offload to worker threads — don't block the event loop

## Code Organization (MEDIUM)

- camelCase for file names (blogController.js, asyncHandler.js)
- PascalCase for model files (Blog.js, Comment.js, User.js)
- Keep constants in `constants/messages.js` — no hardcoded strings
- Use project loggers (`dbLogger`, `httpLogger`) instead of `console.log`
- Max ~200 lines per file — extract helpers if larger
- ES Modules only — no `require()`
