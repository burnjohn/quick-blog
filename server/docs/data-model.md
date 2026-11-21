# Data model

Mongoose 8 models in `src/models/`. All three use `{ timestamps: true }`, so every document has `createdAt` and `updatedAt`. Collection names are Mongoose defaults: `users`, `blogs`, `comments`.

## Relations

```
User 1 ──< Blog        Blog.author → User._id   (Blog.authorName is a denormalized copy of User.name)
Blog 1 ──< Comment     Comment.blog → Blog._id
```

- `authorName` is copied from the JWT when a post is created (`blogController.addBlog`) and never updated afterwards.
- Cascade on delete is done by hand in `blogController.deleteBlogById`. It deletes the post's comments.
- No controller calls `populate('author')`. `adminController.getAllComments` populates `blog`.

## User (`src/models/User.js`)

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | yes | – | `trim` |
| `email` | String | yes | – | `unique`, `lowercase`, `trim` |
| `password` | String | yes | – | `minlength: 6`. Hashed with bcrypt (10 salt rounds) in a `pre('save')` hook |
| `role` | String | no | `'author'` | enum `['admin', 'author']` |
| `bio` | String | no | `''` | |
| `avatar` | String | no | `''` | not used by any route |
| `isActive` | Boolean | no | `true` | login requires `isActive: true` |

Methods:

- `comparePassword(candidate)`: `bcrypt.compare` against the stored hash.
- `toJSON()`: removes `password` from serialized output.

The hash runs only on `save()` or `create()`. `findOneAndUpdate` / `updateOne` with a new password would store it in plain text. No route currently updates users.

Indexes declared in the schema: unique `email` (from `unique: true`).

## Blog (`src/models/Blog.js`)

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `title` | String | yes | – | validator requires at least 3 characters on create |
| `subTitle` | String | no | – | |
| `description` | String | yes | – | HTML body (seed content and the admin editor produce HTML) |
| `category` | String | yes | – | free text in the schema. The seed and the client category filters assume `Technology`, `Startup`, `Lifestyle`, `Finance` |
| `author` | ObjectId → `User` | yes | – | set from `req.user.userId` |
| `authorName` | String | yes | – | denormalized |
| `image` | String | yes | – | stored as a relative path (`/uploads/blogs/...` or `/uploads/seed/...`). Made absolute at response time |
| `isPublished` | Boolean | no | `false` | |

Indexes declared in the schema: none. See [Database-level indexes and validators](#database-level-indexes-and-validators).

## Comment (`src/models/Comment.js`)

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `blog` | ObjectId → `Blog` | yes | – | |
| `name` | String | yes | – | commenter display name, free text |
| `content` | String | yes | – | plain text |
| `isApproved` | Boolean | no | `false` | only approved comments are public |

Indexes declared in the schema: none.

## Database-level indexes and validators

Indexes and collection validators come from two places outside Mongoose. They overlap, and they disagree in places.

### `init-scripts/init-db.sh` (runs once, on a fresh Docker volume)

Creates `users`, `blogs` and `comments` with `$jsonSchema` validators that mirror the required fields above (`users.role` is limited to `admin`/`author`). It also creates these indexes:

| Collection | Index |
|------------|-------|
| users | `{ email: 1 }` unique, `{ role: 1 }` |
| blogs | text `{ title, description }`, `{ category: 1 }`, `{ author: 1 }`, `{ createdAt: -1 }`, `{ author: 1, createdAt: -1 }` |
| comments | `{ blog: 1 }`, `{ createdAt: -1 }`, `{ blog: 1, createdAt: -1 }` |

The tests run against `mongodb-memory-server`, which has none of these validators or indexes.

### `migrations/` (migrate-mongo)

Config: `migrations/migrate-mongo-config.cjs`. It uses `MONGODB_URI` (with a local default), `moduleSystem: 'esm'` and changelog collection `changelog`. Commands are listed in [../README.md](../README.md#scripts).

| File | Up | Down |
|------|----|------|
| `20241014000001-add-blog-indexes.js` | named indexes on `blogs`: text title+description, category, createdAt, author+createdAt | drops those indexes |
| `20241014000002-add-comment-indexes.js` | indexes on `comments.blogId` and `createdAt`, plus `blogId`+`createdAt` | drops them |
| `20241014000003-add-users-collection.js` | unique email, role, isActive indexes on `users` | drops them |

`npm run migrate:status` currently reports all three as `PENDING` against the local database.

## Known gaps

- **Migrations cannot load.** Every migration imports `../utils/dbLogger.js`, which resolves to `server/utils/dbLogger.js`. The file lives at `server/src/utils/dbLogger.js`, so `migrate:up` fails with `ERR_MODULE_NOT_FOUND`. Checked by importing a migration file directly.
- **The comment migration indexes the wrong field.** It indexes `blogId`, but the schema field is `blog`.
- **Init script and migration 1 would likely conflict.** Both create the same key patterns on `blogs`, the init script with default names and the migration with custom names. MongoDB rejects an identical key pattern under a different name, so migration 1 would probably fail on a database built by `init-db.sh`. Not run, because the migrations cannot load (see above).
- **No schema-level indexes on Blog or Comment.** Databases not created through Docker (for example a hosted MongoDB) get no indexes on `comments.blog` or `blogs.createdAt` unless someone creates them by hand.
- **`category` is unconstrained in the schema.** Any string is stored, while the seed and the client filters know only the four seeded categories.
- **`authorName` goes stale** if a user is renamed.
