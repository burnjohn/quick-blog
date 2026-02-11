---
name: backend-testing
description: "Use when writing, reviewing, or planning tests for Express controllers, routes, middleware, validators, and Mongoose models in server/. Covers Vitest, Supertest, mongodb-memory-server, auth testing, and project-specific conventions."
---

# Backend Testing

Testing conventions for Express API code in `server/`. Uses Vitest as the runner, Supertest for HTTP testing, and mongodb-memory-server for isolated database tests.

## Severity Levels

- **CRITICAL** — Tests will be flaky, misleading, or fail for wrong reasons
- **HIGH** — Tests will be hard to maintain or miss real bugs
- **MEDIUM** — Tests will be less readable or less useful

---

## Tooling

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner (or `jest` if already configured) |
| `supertest` | HTTP endpoint testing against Express app |
| `mongodb-memory-server` | In-memory MongoDB for fast, isolated tests |
| `jsonwebtoken` | Generate test tokens for auth-protected routes |

---

## Core Principle: Test the HTTP Interface (CRITICAL)

- Test endpoints via Supertest requests, NOT by calling controller functions directly
- The `app` (Express instance) must be exported separately from `server.listen()` for Supertest
- Test the full middleware chain: parsing → validation → auth → controller → response
- This catches integration issues that unit tests miss

---

## Database Setup (HIGH)

### In-Memory MongoDB

- Use `mongodb-memory-server` for each test suite — fast and isolated
- Connect before all tests, disconnect after all tests
- Clear relevant collections between tests to avoid state leakage

### Alternatives

- **Mock Mongoose models**: Faster but less realistic — use for unit-testing controller logic in isolation
- **Real test database**: More realistic but slower and requires cleanup — use for integration/E2E suites

---

## Import Rules (CRITICAL)

- Import `describe`, `it`, `expect`, `vi`, `beforeAll`, `afterAll`, `beforeEach` from `vitest`
- NEVER import from `jest` — use `vi.fn()`, `vi.spyOn()`, `vi.mock()`
- Import `request` from `supertest` — NOT from `axios` or `node-fetch`
- Import `app` (not the listening server) for Supertest

---

## What to Test (HIGH)

### DO Test

- **API responses**: Status codes, response body shape, success/error flags
- **Validation**: Malformed input returns 400 with clear error messages
- **Auth behavior**: Protected routes reject without token, accept with valid token
- **Business logic outcomes**: Created records exist, deleted records are gone
- **Error paths**: Non-existent resources return 404, server errors return 500

### DO NOT Test

- Mongoose internals (schema validation is tested by Mongoose itself)
- Express framework behavior (routing, middleware chaining)
- External service responses (mock those — Gemini AI, file system)
- Exact error message wording (test structure and status codes instead)

---

## Test Organization (HIGH)

### Structure per Endpoint

For each route, test:
1. **Happy path** — valid request returns expected response
2. **Validation error** — invalid/missing input returns 400
3. **Not found** — non-existent resource returns 404
4. **Auth required** — missing token returns 401 (if protected)
5. **Auth invalid** — bad token returns 401 (if protected)

### Grouping

- One `describe` block per route (`GET /api/blogs`, `POST /api/blogs`)
- Group related routes in one test file per controller
- Use `beforeEach` for per-test setup (seed data, reset mocks)

---

## Auth Testing (HIGH)

### Generate Test Tokens

```
const validToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
```

### What to Check

- Request without `Authorization` header → 401
- Request with `Bearer invalid-token` → 401
- Request with expired token → 401
- Request with valid token → proceeds to controller
- Protected route returns `req.user` data correctly

---

## Response Shape Testing (HIGH)

Verify the project's consistent response format:

```
// Success: { success: true, message: "...", ...data }
// Error:   { success: false, message: "..." }
// List:    { success: true, count: N, ...data }
```

- Check `res.body.success` is boolean
- Check `res.body.message` exists on errors
- Check data fields match expected shape (not exact values for timestamps, IDs)

---

## Mocking External Services (HIGH)

- Mock Gemini AI, file system, email services — anything outside your codebase
- Use `vi.mock()` at the module level for consistent mocking
- Reset mocks in `beforeEach` with `vi.clearAllMocks()`
- NEVER mock the database if you're using mongodb-memory-server — test against real queries

---

## Security Testing (MEDIUM)

- Test that protected routes enforce auth middleware
- Test that validation rejects NoSQL injection patterns (e.g., `{ "$ne": "" }` in body)
- Test that file upload endpoints reject invalid file types
- Test rate limiting returns 429 after threshold (if configured)

---

## Coverage Strategy (MEDIUM)

- **Always cover:** Happy path, one validation error, auth check (if protected)
- **Cover if present:** Pagination, filtering, sorting, edge cases for business rules
- **Skip:** Mongoose middleware hooks, external service detailed responses

Aim for: ~3-5 tests per controller action, ~2-3 per middleware, ~3-5 per validator.

---

## Test File Conventions (MEDIUM)

- Place test next to source: `blogController.js` → `blogController.test.js`
- Use `.test.js` extension (not `.spec.js`)
- Export `app` from a test-friendly entry point (not the listening server)

---

## Anti-Patterns (CRITICAL)

- Calling controller functions directly instead of using Supertest
- Starting a real server (`app.listen()`) in tests — use Supertest with the `app` instance
- Sharing database state between tests without cleanup
- Mocking the database when mongodb-memory-server is available
- Testing exact error messages instead of status codes and structure
- Not testing auth on protected routes
- Importing from `jest` when using Vitest
