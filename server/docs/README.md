# Server documentation

Reference docs for the QuickBlog API (`server/`). Each page describes the code as it is and lists its defects under "Known gaps".

| Page | Read it when you need |
|------|-----------------------|
| [api.md](./api.md) | every REST endpoint: auth, rate limits, validators, request and response shapes, errors |
| [data-model.md](./data-model.md) | Mongoose models, relations, indexes, Docker init validators, migrations |
| [auth-and-security.md](./auth-and-security.md) | JWT flow, `auth` middleware, roles, CORS, Helmet, rate limiters, validation, error handling, logging |
| [uploads-and-images.md](./uploads-and-images.md) | Multer, upload directories, static serving, absolute image URLs, `SERVER_URL` |
| [seeding-and-fixtures.md](./seeding-and-fixtures.md) | Docker Compose, init scripts, seed script, fixtures, demo content, cover images, demo credentials |
| [testing.md](./testing.md) | Vitest, Supertest and `mongodb-memory-server` setup, helpers, what is covered |

Related:

- [../README.md](../README.md): quick start, scripts, environment variables
- [../AGENTS.md](../AGENTS.md): folder map and conventions for coding agents
- Product specs: [../../specs/public/](../../specs/public/), [../../specs/admin/](../../specs/admin/)
