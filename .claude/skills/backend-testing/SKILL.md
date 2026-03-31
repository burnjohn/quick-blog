---
name: backend-testing
description: "Use when writing, reviewing, or planning tests for Express controllers, routes, middleware, validators, and Mongoose models in server/. Covers Vitest, Supertest, mongodb-memory-server, auth testing, and project-specific conventions."
---

# Backend Testing

Testing conventions for Express API code in `server/`. Uses Vitest as the runner, Supertest for HTTP testing, and mongodb-memory-server for isolated database tests.

## Philosophy: Fewer Tests, Real Scenarios

> "Write tests. Not too many. Mostly integration." — Kent C. Dodds

1. **Use-case coverage > code coverage** — aim for 100% use-case coverage, not 100% line coverage. Think about what API consumers can DO, not what the code does internally.
2. **Write fewer, longer tests** — one test that walks through a full request lifecycle (seed → request → verify response → verify side effects) beats six isolated assertions.
3. **Test the HTTP interface, not functions** — assert on status codes, response bodies, and database state. Never call controller functions directly.
4. **Mock at boundaries only** — mock external services (Gemini AI, email, file uploads). Never mock your own database or models when mongodb-memory-server is available.
5. **Each test must justify its existence** — if removing a test wouldn't reduce your confidence that the API works, delete it.

### The Testing Trophy (what to invest in)

```
       E2E          ← Few: critical multi-endpoint workflows (seed → create → update → verify)
  Integration (API)  ← MOST tests: Supertest through the full middleware chain
    Unit             ← Some: complex validators, formatters, pure business logic
  Static Analysis    ← Always: TypeScript/JSDoc, ESLint
```

---

## Test Tiers for CI

Organize tests by speed and criticality to keep CI fast.

| Tier | What | When to Run | Target Speed |
|------|------|-------------|-------------|
| **Fast** | Unit tests for validators, utils, pure functions | Every commit | <5s |
| **Core** | Supertest integration for CRUD + auth on critical endpoints | Every PR / merge | <30s |
| **Extended** | Security tests, edge cases, full multi-endpoint workflows | Nightly / scheduled | <2min |

---

## Tooling

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner (or `jest` if already configured) |
| `supertest` | HTTP endpoint testing against Express app |
| `mongodb-memory-server` | In-memory MongoDB for fast, isolated tests |
| `jsonwebtoken` | Generate test tokens for auth-protected routes |

---

## Test Scenarios by Endpoint Type

Before writing tests, identify the endpoint type and pick scenarios from this matrix. Write **2-4 tests per endpoint** — each test covers a full request lifecycle, not a single assertion.

### GET /resources (list)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Returns list with seeded data, correct shape** | Happy path, response shape, data presence |
| 2 | **Returns empty array when none exist** | Zero-data handling |
| 3 | **Pagination/filtering works** | Only if the endpoint supports it |

### GET /resources/:id (detail)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Returns resource by ID with correct shape** | Happy path, data integrity |
| 2 | **404 for non-existent ID** | Missing resource handling |
| 3 | **400 for malformed ID** | Input validation |

### POST /resources (create, protected)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Creates with valid data + auth, verifies persistence** | Auth, validation, creation, DB write |
| 2 | **401 without auth token** | Auth middleware |
| 3 | **400 for invalid/missing fields** | Validation |

### PUT /resources/:id (update, protected)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Updates with valid data, verifies changes persist** | Auth, update logic, DB write |
| 2 | **404 for non-existent resource** | Missing resource handling |
| 3 | **403 for wrong owner** | Authorization (if applicable) |

### DELETE /resources/:id (delete, protected)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Deletes and confirms resource is gone** | Auth, deletion, DB state |
| 2 | **404 for non-existent resource** | Missing resource handling |
| 3 | **403 for wrong owner** | Authorization (if applicable) |

### Auth Endpoints (login, register)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Successful login returns token and user data** | Happy path, token generation |
| 2 | **Invalid credentials return 401** | Auth failure |
| 3 | **Missing fields return 400** | Validation |

---

## Complete Spec Template

This is what a well-structured test file looks like. Each test is a full request lifecycle.

```javascript
// blogController.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../server.js';
import Blog from '../src/models/Blog.js';
import User from '../src/models/User.js';

// --- Test infrastructure ---
let mongoServer;
let testUser;
let authToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create a test user for auth
  testUser = await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'hashedpassword',
  });
  authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Blog.deleteMany({});
});

// --- Helper ---
const authedPost = (url, body) =>
  request(app).post(url).set('Authorization', `Bearer ${authToken}`).send(body);

const authedPut = (url, body) =>
  request(app).put(url).set('Authorization', `Bearer ${authToken}`).send(body);

const authedDelete = (url) =>
  request(app).delete(url).set('Authorization', `Bearer ${authToken}`);

// --- Tests ---
describe('GET /api/blogs', () => {
  it('returns all blogs with correct shape', async () => {
    await Blog.create([
      { title: 'Post 1', content: 'Content 1', category: 'Technology', author: testUser._id },
      { title: 'Post 2', content: 'Content 2', category: 'Startup', author: testUser._id },
    ]);

    const res = await request(app).get('/api/blogs');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blogs).toHaveLength(2);
    expect(res.body.blogs[0]).toMatchObject({
      title: expect.any(String),
      category: expect.any(String),
    });
    expect(res.body.blogs[0]).toHaveProperty('_id');
    expect(res.body.blogs[0]).toHaveProperty('createdAt');
  });

  it('returns empty array when no blogs exist', async () => {
    const res = await request(app).get('/api/blogs');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blogs).toHaveLength(0);
  });
});

describe('GET /api/blogs/:id', () => {
  it('returns blog by ID', async () => {
    const blog = await Blog.create({
      title: 'Test Blog', content: 'Content', category: 'Technology', author: testUser._id,
    });

    const res = await request(app).get(`/api/blogs/${blog._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blog.title).toBe('Test Blog');
  });

  it('returns 404 for non-existent blog', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/blogs/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/blogs', () => {
  it('creates blog with valid data and verifies persistence', async () => {
    const res = await authedPost('/api/blogs', {
      title: 'New Blog', content: 'Content here', category: 'Technology',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.blog.title).toBe('New Blog');

    // Verify it actually persisted
    const saved = await Blog.findById(res.body.blog._id);
    expect(saved).not.toBeNull();
    expect(saved.title).toBe('New Blog');
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .send({ title: 'New Blog', content: 'Content', category: 'Technology' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid data with clear errors', async () => {
    const res = await authedPost('/api/blogs', { title: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });
});
```

### Workflow Test (Extended Tier)

Test a full CRUD lifecycle in a single test for high-confidence regression catching:

```javascript
describe('Blog CRUD workflow', () => {
  it('create → read → update → delete lifecycle', async () => {
    // Create
    const createRes = await authedPost('/api/blogs', {
      title: 'Lifecycle Blog', content: 'Original content', category: 'Technology',
    });
    expect(createRes.status).toBe(201);
    const blogId = createRes.body.blog._id;

    // Read
    const readRes = await request(app).get(`/api/blogs/${blogId}`);
    expect(readRes.status).toBe(200);
    expect(readRes.body.blog.title).toBe('Lifecycle Blog');

    // Update
    const updateRes = await authedPut(`/api/blogs/${blogId}`, {
      title: 'Updated Blog', content: 'Updated content',
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.blog.title).toBe('Updated Blog');

    // Verify update persisted
    const verifyRes = await request(app).get(`/api/blogs/${blogId}`);
    expect(verifyRes.body.blog.title).toBe('Updated Blog');

    // Delete
    const deleteRes = await authedDelete(`/api/blogs/${blogId}`);
    expect(deleteRes.status).toBe(200);

    // Verify deletion
    const goneRes = await request(app).get(`/api/blogs/${blogId}`);
    expect(goneRes.status).toBe(404);
  });
});
```

---

## Severity Levels

- **CRITICAL** — Tests will be flaky, misleading, or fail for wrong reasons
- **HIGH** — Tests will be hard to maintain or miss real bugs
- **MEDIUM** — Tests will be less readable or less useful

---

## Import Rules (CRITICAL)

- Import `describe`, `it`, `expect`, `vi`, `beforeAll`, `afterAll`, `beforeEach` from `vitest`
- NEVER import from `jest` — use `vi.fn()`, `vi.spyOn()`, `vi.mock()`
- Import `request` from `supertest` — NOT from `axios` or `node-fetch`
- Import `app` (not the listening server) for Supertest

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

## Auth Testing (HIGH)

### Generate Test Tokens

```
const validToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
```

### What to Check

For **each protected endpoint**, include auth rejection in the same test file:

- Request without `Authorization` header → 401
- Request with valid token → proceeds to controller

Only test these edge cases **once per auth middleware** (not per endpoint):
- Malformed token → 401
- Expired token → 401

---

## Response Shape Testing (HIGH)

Verify the project's consistent response format:

```
// Success: { success: true, message: "...", ...data }
// Error:   { success: false, message: "..." }
// List:    { success: true, count: N, ...data }
```

- Use `toMatchObject` for shape, not `toEqual` for exact values
- Check `res.body.success` is boolean
- Check data fields match expected shape (not exact values for timestamps, IDs)

---

## Mocking External Services (HIGH)

- Mock Gemini AI, file system, email services — anything outside your codebase
- Use `vi.mock()` at the module level for consistent mocking
- Reset mocks in `beforeEach` with `vi.clearAllMocks()`
- NEVER mock the database if you're using mongodb-memory-server — test against real queries

---

## Security Testing (Extended Tier)

Test these in the extended/nightly test tier:

- NoSQL injection patterns (e.g., `{ "$ne": "" }` in body)
- File upload with invalid file types
- Rate limiting returns 429 after threshold (if configured)
- Cross-user access (user A cannot modify user B's resources)

---

## Test File Conventions (MEDIUM)

- Place test next to source: `blogController.js` → `blogController.test.js`
- Use `.test.js` extension (not `.spec.js`)
- Export `app` from a test-friendly entry point (not the listening server)
- One `describe` per route group (`GET /api/blogs`, `POST /api/blogs`)
- Test names describe the scenario: `"creates blog with valid data and verifies persistence"`
- **2-4 tests per endpoint** (full request lifecycles), not 5+ tiny assertions

---

## Anti-Patterns (CRITICAL)

| Anti-Pattern | Fix |
|-------------|-----|
| Many tiny tests with one assertion each | Combine into fewer lifecycle tests (seed → request → verify response → verify DB) |
| Calling controller functions directly | Use Supertest through the full middleware chain |
| Starting a real server (`app.listen()`) in tests | Use Supertest with the `app` instance |
| Sharing database state between tests | Clear collections in `beforeEach` |
| Mocking the database when mongodb-memory-server is available | Test against real queries |
| Testing exact error message strings | Test status codes + response shape instead |
| Not testing auth on protected routes | Include 401 test for each protected endpoint |
| Importing from `jest` when using Vitest | Use `vi.fn()`, `vi.mock()` from vitest |
| Testing auth edge cases on every endpoint | Test malformed/expired tokens once per middleware, not per route |
| Testing Mongoose internals | Test through the HTTP interface |
