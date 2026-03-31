# Backend Testing — Code Examples

Good/bad patterns for each rule in [SKILL.md](SKILL.md).

---

## Test Setup with In-Memory MongoDB

```javascript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../server.js';
import Blog from '../src/models/Blog.js';
import User from '../src/models/User.js';

let mongoServer;
let testUser;
let authToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  testUser = await User.create({ name: 'Admin', email: 'admin@test.com', password: 'hashed' });
  authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Blog.deleteMany({});
});

// Helpers — keep Supertest calls DRY
const authedPost = (url, body) =>
  request(app).post(url).set('Authorization', `Bearer ${authToken}`).send(body);

const authedPut = (url, body) =>
  request(app).put(url).set('Authorization', `Bearer ${authToken}`).send(body);

const authedDelete = (url) =>
  request(app).delete(url).set('Authorization', `Bearer ${authToken}`);
```

---

## Fewer, Longer Tests — CRUD Endpoints

### BAD: Too many tiny tests

```javascript
// 8 tests for one endpoint — most add little confidence
describe('POST /api/blogs', () => {
  it('returns 201', async () => { /* ... */ });
  it('returns success true', async () => { /* ... */ });
  it('returns the blog title', async () => { /* ... */ });
  it('returns the blog category', async () => { /* ... */ });
  it('saves to database', async () => { /* ... */ });
  it('returns 400 for missing title', async () => { /* ... */ });
  it('returns 400 for missing content', async () => { /* ... */ });
  it('returns 400 for invalid category', async () => { /* ... */ });
});
```

### GOOD: 3 tests covering all scenarios

```javascript
describe('POST /api/blogs', () => {
  it('creates blog with valid data and verifies persistence', async () => {
    const res = await authedPost('/api/blogs', {
      title: 'New Blog', content: 'Content here', category: 'Technology',
    });

    // Response is correct
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.blog).toMatchObject({
      title: 'New Blog',
      category: 'Technology',
    });
    expect(res.body.blog).toHaveProperty('_id');
    expect(res.body.blog).toHaveProperty('createdAt');

    // Actually persisted in DB
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

  it('rejects invalid data with clear error response', async () => {
    // Missing title
    const res1 = await authedPost('/api/blogs', { content: 'Content', category: 'Technology' });
    expect(res1.status).toBe(400);
    expect(res1.body.success).toBe(false);
    expect(res1.body).toHaveProperty('message');

    // Invalid category
    const res2 = await authedPost('/api/blogs', {
      title: 'Blog', content: 'Content', category: 'InvalidCat',
    });
    expect(res2.status).toBe(400);
  });
});
```

---

## Auth Middleware Tests

### BAD: Testing every auth edge case on every endpoint

```javascript
// These 4 tests are duplicated across EVERY protected endpoint
describe('POST /api/blogs — auth', () => {
  it('rejects without header', ...);
  it('rejects malformed token', ...);
  it('rejects expired token', ...);
  it('accepts valid token', ...);
});
describe('PUT /api/blogs/:id — auth', () => {
  it('rejects without header', ...);  // same test, different URL
  it('rejects malformed token', ...);
  it('rejects expired token', ...);
  it('accepts valid token', ...);
});
```

### GOOD: Test middleware once, then test 401 per-endpoint

```javascript
// Test auth edge cases ONCE against any protected endpoint
describe('Auth middleware', () => {
  const protectedUrl = '/api/blogs';
  const validBody = { title: 'Test', content: 'Content', category: 'Technology' };

  it('rejects malformed and expired tokens', async () => {
    // No header
    const res1 = await request(app).post(protectedUrl).send(validBody);
    expect(res1.status).toBe(401);

    // Malformed token
    const res2 = await request(app)
      .post(protectedUrl)
      .set('Authorization', 'Bearer garbage')
      .send(validBody);
    expect(res2.status).toBe(401);

    // Expired token
    const expiredToken = jwt.sign({ id: 'user1' }, process.env.JWT_SECRET, { expiresIn: '0s' });
    const res3 = await request(app)
      .post(protectedUrl)
      .set('Authorization', `Bearer ${expiredToken}`)
      .send(validBody);
    expect(res3.status).toBe(401);
  });
});

// Then in each endpoint test, just verify 401 without token (one line)
describe('POST /api/blogs', () => {
  it('rejects unauthenticated request', async () => {
    const res = await request(app).post('/api/blogs').send({...});
    expect(res.status).toBe(401);
  });
  // ... other tests
});
```

---

## Workflow Test (Full CRUD Lifecycle)

One test that catches integration bugs across the entire resource lifecycle:

```javascript
describe('Blog CRUD workflow', () => {
  it('create → read → update → delete lifecycle', async () => {
    // CREATE
    const createRes = await authedPost('/api/blogs', {
      title: 'Lifecycle Blog', content: 'Original', category: 'Technology',
    });
    expect(createRes.status).toBe(201);
    const blogId = createRes.body.blog._id;

    // READ — verify creation
    const readRes = await request(app).get(`/api/blogs/${blogId}`);
    expect(readRes.status).toBe(200);
    expect(readRes.body.blog.title).toBe('Lifecycle Blog');

    // UPDATE
    const updateRes = await authedPut(`/api/blogs/${blogId}`, {
      title: 'Updated Blog', content: 'Updated content',
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.blog.title).toBe('Updated Blog');

    // VERIFY UPDATE persisted
    const verifyRes = await request(app).get(`/api/blogs/${blogId}`);
    expect(verifyRes.body.blog.content).toBe('Updated content');

    // DELETE
    const deleteRes = await authedDelete(`/api/blogs/${blogId}`);
    expect(deleteRes.status).toBe(200);

    // VERIFY DELETION
    const goneRes = await request(app).get(`/api/blogs/${blogId}`);
    expect(goneRes.status).toBe(404);
  });
});
```

---

## Mocking External Services

```javascript
// BAD: Mocking Mongoose (hides real query issues)
vi.mock('mongoose');

// GOOD: Mock only external services, use real DB for data access
vi.mock('../../configs/gemini.js', () => ({
  generateContent: vi.fn(() =>
    Promise.resolve({ response: { text: () => 'Generated content' } })
  ),
}));

describe('POST /api/blogs/generate', () => {
  it('generates content and handles API failure', async () => {
    // Happy path
    const res = await authedPost('/api/blogs/generate', { topic: 'AI in 2026' });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Generated content');

    // Simulate API failure
    const { generateContent } = await import('../../configs/gemini.js');
    vi.mocked(generateContent).mockRejectedValueOnce(new Error('API down'));

    const errorRes = await authedPost('/api/blogs/generate', { topic: 'AI in 2026' });
    expect(errorRes.status).toBe(500);
    expect(errorRes.body.success).toBe(false);
  });
});
```

---

## Response Shape Testing

```javascript
// BAD: Testing exact values (brittle, breaks on any change)
expect(res.body).toEqual({
  success: true,
  message: 'Blog created successfully',
  blog: { _id: '507f1f77...', title: 'Test', ... },
});

// GOOD: Testing shape and key fields
expect(res.body.success).toBe(true);
expect(res.body.blog).toMatchObject({
  title: 'Test',
  category: 'Technology',
});
expect(res.body.blog).toHaveProperty('_id');
expect(res.body.blog).toHaveProperty('createdAt');
```

---

## Security Tests (Extended Tier)

```javascript
describe('Security — extended tier', () => {
  it('rejects NoSQL injection and invalid file types', async () => {
    // NoSQL injection attempt
    const injectionRes = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@test.com', password: { $ne: '' } });
    expect(injectionRes.status).toBe(400);

    // Invalid file type upload
    const uploadRes = await authedPost('/api/blogs')
      .attach('image', Buffer.from('fake-script'), {
        filename: 'malicious.js',
        contentType: 'application/javascript',
      })
      .field('title', 'Test')
      .field('content', 'Content')
      .field('category', 'Technology');
    expect(uploadRes.status).toBe(400);
  });
});
```

---

## Supertest Setup Pattern

```javascript
// BAD: Starting real server in tests
import { server } from '../server.js';
// server.listen() is already called — causes port conflicts

// GOOD: Export app separately for Supertest
// server.js
export const app = express();
// ... configure app ...
// Only listen when not in test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT);
}

// test file
import { app } from '../server.js';
import request from 'supertest';
// Supertest manages its own server instance
const res = await request(app).get('/api/blogs');
```
