# Seeding and fixtures

How the local database is created and filled with the demo content the public site and admin panel show.

## Local MongoDB (`docker-compose.yml`)

| Service | Image | Port | Notes |
|---------|-------|------|-------|
| `mongodb` (`quickblog-mongodb`) | `mongo:7.0` | 27017 | Root user from `MONGODB_USER`/`MONGODB_PASSWORD` (defaults `quickblog`/`quickblog123`), database `MONGODB_DATABASE` (default `quickblog`). Volumes `mongodb_data` and `mongodb_config`. Healthcheck pings with `mongosh` |
| `mongo-express` (`quickblog-mongo-express`) | `mongo-express:latest` | 8081 | Web UI at `http://localhost:8081`. Basic auth reuses the Mongo user and password. Starts after `mongodb` is healthy |

`./init-scripts` is mounted at `/docker-entrypoint-initdb.d`. MongoDB runs those scripts only when the data volume is empty (first start or after `npm run db:clean`):

- `init-db.sh` creates `users`, `blogs` and `comments` with `$jsonSchema` validators and indexes (listed in [data-model.md](./data-model.md#database-level-indexes-and-validators)).
- `init-user.sh` creates a `readWrite` user in the app database with the same name and password as the root user.

Commands: `npm run db:start | db:stop | db:restart | db:logs | db:clean`. `db:clean` runs `docker-compose down -v`, which deletes the volume.

## Seed script (`scripts/seed.js`)

Run with `npm run seed` (sets `NODE_ENV=development`), or `npm run setup`, which runs `db:start`, waits 5 seconds and then seeds. The script connects with `MONGODB_URI` from `.env`.

**Destructive.** It first runs `deleteMany({})` on `users`, `blogs` and `comments`.

Steps:

1. **Users.** `User.create(fixtures/users.js)`, so passwords are hashed. The credentials are printed to the console.
2. **Blogs.** One `Blog.create` per fixture, in order:
   - `author` alternates between the two users (`i % 2`). Even indexes go to Michael Brown, odd indexes to Sarah Johnson.
   - `isPublished` is `fixture.isPublished ?? true`.
   - `createdAt` comes from `spreadDate(i, total)`: posts are spaced evenly over the last ~180 days (6 × 30), oldest first, with up to half an interval of random jitter. The newest post therefore lands within the last few days.
3. **Comments.** A random target between 200 and 260 (`commentConfig.total`). Each comment picks a random published post, then a template:
   - Topic-specific templates (`forTitle` equal to the post title) are chosen 60% of the time while unused ones remain; otherwise an unused generic template.
   - A template is not reused on the same post until that post's pool runs out.
   - `isApproved` comes from the template. `createdAt` is uniformly random between the post's `createdAt` and now.
4. Logs each create to `logs/db-changes.log` via `dbLogger`, closes the connection and exits.

Each run is random (comment counts, approval mix per post), so numbers on the site change after every reseed. Titles, bodies, authors, categories and covers stay the same.

## Admin credentials (`fixtures/users.js`)

| Role | Name | Email | Password |
|------|------|-------|----------|
| admin | Michael Brown | `admin@quickblog.com` | `admin123` |
| author | Sarah Johnson | `sarah@quickblog.com` | `sarah123` |

Both can log in to the admin panel and, because roles are not enforced, both have the same API permissions (see [auth-and-security.md](./auth-and-security.md#roles)). These are demo credentials only.

## Fixtures

| File | Exports | Content |
|------|---------|---------|
| `fixtures/users.js` | `users` | the 2 accounts above, with bios |
| `fixtures/blogs.js` | `blogs`, `slugify` | 18 original posts plus 24 archive posts = 42 |
| `fixtures/archive/technology.js` | `technologyPosts` | 8 posts |
| `fixtures/archive/lifestyle.js` | `lifestylePosts` | 6 posts |
| `fixtures/archive/startup.js` | `startupPosts` | 5 posts |
| `fixtures/archive/finance.js` | `financePosts` | 5 posts |
| `fixtures/comments.js` | `comments`, `commentConfig` | 85 comment templates (67 topic-specific with `forTitle`, 18 generic); 71 approved, 14 pending |

### What the demo content looks like

The redesigned public site shows these 42 posts, 34 of them published:

| Category | Total | Published | Drafts |
|----------|-------|-----------|--------|
| Technology | 13 | 11 | 2 |
| Lifestyle | 11 | 9 | 2 |
| Startup | 9 | 7 | 2 |
| Finance | 9 | 7 | 2 |
| **All** | **42** | **34** | **8** |

- **Original posts (18)** come from the initial design mockups: six long-form guides ("A detailed step by step guide to manage your lifestyle", "How to create an effective startup roadmap or ideas", "Learning new technology to boost your career in software" and others), followed by 12 shorter posts across all four categories. Four of the 12 are drafts ("WebAssembly: The future of web performance?", "Digital detox: Unplugging without guilt", "Bootstrapping vs VC: Making the right choice", "Understanding credit scores").
- **Archive posts (24)** are longer editorial pieces: essays, case studies, interviews with fictional people at fictional companies, and numbered lists. Examples: "The quiet cost of flaky tests", "Postgres or MongoDB? The decision memo we actually used", "Interview: a ceramicist on the value of slowness", "Your first ten customers will not come from ads", "A plain-language guide to compound interest". The last post in each archive file is a draft (4 drafts in total).
- `fixtures/blogs.js` interleaves the archive lists round-robin by category (Tech, Lifestyle, Startup, Finance, Tech, …). Since `createdAt` follows array order, the categories alternate along the timeline. The original 18 posts take the oldest dates and the archive posts the newest.
- Bodies are HTML (`<p>`, `<h2>`, `<ul>`, `<ol>`, `<strong>`, `<em>`, `<code>`).
- Comment names are first name plus initial ("Emma L.", "Daniel M."). Pending templates include obvious spam ("Check out my channel for crypto tips!!!") so moderation has something to reject.

## Cover images

Each fixture declares a fallback `image`:

- Original posts: `/uploads/seed/blog_pic_1.png` … `blog_pic_6.png` (reused in rotation).
- Archive posts: `/uploads/seed/cover_<cat>_NN.svg`.

`fixtures/blogs.js` then applies `withPhotoCover`. If `uploads/seed/photos/<slugify(title)>.{webp,jpg,jpeg,png}` exists, it replaces `image` with that path. All 42 posts currently have a matching `.jpg`, so every seeded post uses a photo cover and the PNG/SVG fallbacks are unused. `slugify` lowercases, collapses non-alphanumerics to `-`, trims dashes and caps at 60 characters.

The prompts and the workflow for producing the photos are in [../../docs/design/image-prompts.md](../../docs/design/image-prompts.md). To add a photo, save it as `server/uploads/seed/photos/<slug>.jpg` and rerun the seed.

### `scripts/gen-covers.mjs`

Regenerates the 24 SVG fallback covers in the "Ink & Signal" style (1200×900; paper `#F4F1EA`, ink `#111111`, signal yellow `#FFCE00`; serif plus mono type; halftone, grid and stripe patterns). It uses a seeded PRNG, so output is deterministic. Each cover carries a `QUICK BLOG / <CATEGORY>` label and an issue number.

```bash
cd server
node scripts/gen-covers.mjs uploads/seed
```

The output directory argument is required. The script has no npm alias.

## Known gaps

- **Seeding wipes everything.** There is no confirmation prompt and no guard against running it on a non-local `MONGODB_URI`.
- **Results are not reproducible.** Post dates (jitter) and comment generation use `Math.random()`.
- **Seeding bypasses migrations.** It does not run them, and on a database not created by Docker no indexes or validators exist.
- **The `setup` script waits a fixed 5 seconds** (`sleep 5`) instead of waiting for the healthcheck.
- **Docker credentials are shared.** `init-user.sh` reuses the root username and password for the app user. mongo-express uses the same credentials and the `latest` tag.
- **Four legacy covers are unused.** `blog_pic_7.png` to `blog_pic_10.png` are not referenced by any fixture.
