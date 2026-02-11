# Backend Testing — Code Examples

Good/bad patterns for each rule in [SKILL.md](SKILL.md).

---

## Test Setup with In-Memory MongoDB

```javascript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../server.js';
import Blog from '../src/models/Blog.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Blog.deleteMany({});
});
```

---

## CRUD Endpoint Tests

```javascript
describe('GET /api/blogs', () => {
  it('returns all published blogs', async () => {
    // Seed test data
    await Blog.create([
      { title: 'Blog 1', content: 'Content 1', category: 'Technology', author: userId },
      { title: 'Blog 2', content: 'Content 2', category: 'Startup', author: userId },
    ]);

    const res = await request(app).get('/api/blogs');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blogs).toHaveLength(2);
    expect(res.body.blogs[0]).toHaveProperty('title');
    expect(res.body.blogs[0]).toHaveProperty('category');
  });

  it('returns empty array when no blogs exist', async () => {
    const res = await request(app).get('/api/blogs');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.blogs).toHaveLength(0);
  });
});

describe('GET /api/blogs/:id', () => {
  it('returns a blog by ID', async () => {
    const blog = await Blog.create({
      title: 'Test Blog', content: 'Content', category: 'Technology', author: userId,
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

  it('returns 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/blogs/not-a-valid-id');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/blogs', () => {
  it('creates a blog with valid data', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ title: 'New Blog', content: 'Content here', category: 'Technology' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.blog.title).toBe('New Blog');

    // Verify it was actually saved
    const saved = await Blog.findById(res.body.blog._id);
    expect(saved).not.toBeNull();
  });

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ title: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
```

---

## Auth Middleware Tests

```javascript
import jwt from 'jsonwebtoken';

describe('Auth middleware', () => {
  const protectedUrl = '/api/admin/dashboard';

  it('rejects requests without Authorization header', async () => {
    const res = await request(app).get(protectedUrl);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects requests with malformed token', async () => {
    const res = await request(app)
      .get(protectedUrl)
      .set('Authorization', 'Bearer invalid-token-here');
    expect(res.status).toBe(401);
  });

  it('rejects requests with expired token', async () => {
    const expiredToken = jwt.sign(
      { id: 'user1' },
      process.env.JWT_SECRET,
      { expiresIn: '0s' },
    );

    const res = await request(app)
      .get(protectedUrl)
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });

  it('allows requests with valid token', async () => {
    const token = jwt.sign({ id: 'user1' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get(protectedUrl)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
```

---

## Validation Tests

```javascript
describe('POST /api/blogs — validation', () => {
  const post = (body) =>
    request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(body);

  it('rejects empty title', async () => {
    const res = await post({ title: '', content: 'Content', category: 'Technology' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/title/i);
  });

  it('rejects missing content', async () => {
    const res = await post({ title: 'Title', category: 'Technology' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/content/i);
  });

  it('rejects invalid category', async () => {
    const res = await post({ title: 'Title', content: 'Content', category: 'InvalidCat' });
    expect(res.status).toBe(400);
  });

  it('rejects title exceeding max length', async () => {
    const res = await post({ title: 'A'.repeat(201), content: 'Content', category: 'Technology' });
    expect(res.status).toBe(400);
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
  it('returns AI-generated content', async () => {
    const res = await request(app)
      .post('/api/blogs/generate')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ topic: 'AI in 2026' });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Generated content');
  });

  it('handles Gemini API failure gracefully', async () => {
    const { generateContent } = await import('../../configs/gemini.js');
    vi.mocked(generateContent).mockRejectedValueOnce(new Error('API down'));

    const res = await request(app)
      .post('/api/blogs/generate')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ topic: 'AI in 2026' });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});
```

---

## Security Tests

```javascript
describe('Security', () => {
  it('rejects NoSQL injection in login', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({
        email: 'admin@test.com',
        password: { $ne: '' },  // NoSQL injection attempt
      });

    // Should reject, not authenticate
    expect(res.status).toBe(400);
  });

  it('rejects file upload with invalid type', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .attach('image', Buffer.from('fake-script'), {
        filename: 'malicious.js',
        contentType: 'application/javascript',
      })
      .field('title', 'Test')
      .field('content', 'Content')
      .field('category', 'Technology');

    expect(res.status).toBe(400);
  });
});
```

---

## Testing Response Shape

```javascript
// BAD: Testing exact values (brittle)
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
