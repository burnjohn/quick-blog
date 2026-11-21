# REST API reference

Every route the server exposes today, read from `src/routes/*.js` and the controllers they call. Base URL in local development is `http://localhost:5001`.

## Conventions

| Topic | Behaviour | Source |
|-------|-----------|--------|
| Mounting | `/` goes to `appRoutes`, `/api/admin` to `adminRoutes`, `/api/blog` to `blogRoutes` | `server.js`, `src/app.js` |
| Body format | JSON (`express.json`, 10 MB limit). `POST /api/blog/add` is the only `multipart/form-data` route | `server.js` |
| Auth | `Authorization: Bearer <jwt>`. A raw token without the `Bearer ` prefix is also accepted | `src/middleware/auth.js` |
| Global rate limit | 100 requests per minute per IP on everything under `/api` (`server.js` only; the test app has none) | `src/middleware/rateLimiter.js` (`apiLimiter`) |
| Success envelope | `{ "success": true, ... }`. Payload keys sit at the top level, not under `data` | controllers |
| Error envelope | `{ "success": false, "message": "..." }`. Validators add `errors: string[]`. In `NODE_ENV=development` the error handler adds `stack` | `src/middleware/errorHandler.js` |
| Image URLs | Every `image` field in a response is absolute (`SERVER_URL` or `protocol://host` + stored path) | `src/utils/imageUrl.js` |
| IDs | MongoDB ObjectIds as 24-char hex strings. A malformed id fails with a 500 (CastError), not a 400 | see [Known gaps](#known-gaps) |

Most write operations use `POST` with the id in the JSON body (`{ "id": "..." }`) instead of `PUT`/`DELETE` with the id in the path.

### Common error responses

| Status | When | Body |
|--------|------|------|
| 400 | Validator rejected input | `{ success: false, message: "Validation failed", errors: [...] }` (blog and comment validators) |
| 401 | Missing, invalid or expired token on a protected route | `message`: `No token provided`, `Invalid token` or `Token expired` |
| 404 | Unknown route | `message`: `Route not found: <METHOD> <url>` |
| 404 | Blog id is well formed but no document exists | `message`: `Blog not found` |
| 429 | Rate limiter tripped | `message` from the limiter (see [auth-and-security.md](./auth-and-security.md#rate-limiting)); `RateLimit-*` headers are set |
| 500 | Any thrown error: CastError, Multer error, Gemini error, CORS rejection | `message` is `err.message` |

## Health

### `GET /`

| | |
|-|-|
| Auth | none |
| Rate limit | none (not under `/api`) |
| Controller | `appController.healthCheck` |

Response 200:

```json
{ "success": true, "message": "API is Working", "version": "1.0.0", "timestamp": "2026-11-20T22:51:34.255Z" }
```

## Public blog

### `GET /api/blog/all`

Lists published posts (`isPublished: true`).

| | |
|-|-|
| Auth | none |
| Rate limit | `apiLimiter` only |
| Validator | none |
| Query | none. There is no pagination, filtering or explicit sort |
| Controller | `blogController.getAllBlogs` |

Response 200:

```json
{
  "success": true,
  "count": 34,
  "blogs": [
    {
      "_id": "...", "title": "...", "subTitle": "...", "description": "<p>HTML…</p>",
      "category": "Lifestyle", "author": "<userId>", "authorName": "Michael Brown",
      "image": "http://localhost:5001/uploads/seed/photos/<slug>.jpg",
      "isPublished": true, "createdAt": "...", "updatedAt": "...", "__v": 0
    }
  ]
}
```

`description` is the full HTML body. Clients that render cards build their own excerpt.

### `GET /api/blog/:blogId`

Returns one post by id.

| | |
|-|-|
| Auth | none |
| Params | `blogId`: ObjectId |
| Controller | `blogController.getBlogById` |

- 200 `{ success: true, blog: { ...same shape as above } }`
- 404 `{ success: false, message: "Blog not found" }`
- 500 when `blogId` is not a valid ObjectId (CastError)

This route does not check `isPublished`, so drafts can be read by anyone who knows the id. See [Known gaps](#known-gaps).

## Comments

### `POST /api/blog/add-comment`

Submits a comment. It is stored with `isApproved: false` and stays hidden until an admin approves it.

| | |
|-|-|
| Auth | none |
| Rate limit | `commentLimiter`: 5 per minute per IP, plus `apiLimiter` |
| Validator | `validateComment` (`src/validators/blogValidator.js`) |
| Controller | `blogController.addComment` |

Body:

| Field | Type | Rule |
|-------|------|------|
| `blog` | ObjectId string | required |
| `name` | string | required, at least 2 characters after trim |
| `content` | string | required, at least 5 characters after trim |

Only these three fields are read, so a client cannot set `isApproved`.

- 201 `{ success: true, message: "Comment added for review" }`
- 400 `{ success: false, message: "Validation failed", errors: ["Blog ID is required", "Name must be at least 2 characters", "Content must be at least 5 characters"] }`
- 429 `Too many comments submitted. Please wait a moment.`
- 500 if `blog` is not a valid ObjectId, or if `name`/`content` is not a string (`.trim()` throws)

The controller does not check that the blog exists or is published.

### `POST /api/blog/comments`

Returns approved comments for one post, newest first. It uses `POST` with a JSON body even though it only reads.

| | |
|-|-|
| Auth | none |
| Validator | none |
| Body | `{ "blogId": "<ObjectId>" }` |
| Controller | `blogController.getBlogComments` |

Response 200:

```json
{ "success": true, "count": 3, "comments": [ { "_id": "...", "blog": "<blogId>", "name": "Emma L.", "content": "...", "isApproved": true, "createdAt": "...", "updatedAt": "...", "__v": 0 } ] }
```

## Admin

All `/api/admin/*` routes except `/login` sit behind `auth` (`adminRouter.use(auth)` in `src/routes/adminRoutes.js`). No route checks `role`, so any active user can call them, including the seeded `author` account.

### `POST /api/admin/login`

| | |
|-|-|
| Auth | none |
| Rate limit | `loginLimiter`: 5 attempts per 15 minutes per IP, plus `apiLimiter` |
| Validator | none |
| Body | `{ "email": "admin@quickblog.com", "password": "admin123" }` |
| Controller | `adminController.adminLogin` |

Looks up `{ email, isActive: true }`, compares the password with bcrypt and signs a 7-day JWT.

- 200 `{ success: true, token: "<jwt>", user: { name, email, role } }`
- 401 `{ success: false, message: "Invalid Credentials" }` for an unknown email, wrong password or inactive user
- 429 `Too many login attempts. Please try again after 15 minutes.`

### `GET /api/admin/dashboard`

| | |
|-|-|
| Auth | JWT |
| Controller | `adminController.getDashboard` |

Response 200:

```json
{
  "success": true,
  "dashboardData": {
    "blogs": 42, "comments": 230, "drafts": 8,
    "blogsThisMonth": 6, "publishedThisMonth": 5,
    "recentBlogs": [ { "...blog fields": "", "image": "<absolute url>", "commentsCount": 4 } ],
    "recentComments": [ { "_id": "...", "blog": "<blogId>", "name": "...", "content": "...", "isApproved": false, "createdAt": "..." } ]
  }
}
```

- `recentBlogs`: the 6 newest posts of any status. `commentsCount` counts all comments, approved or not (one `countDocuments` per post).
- `recentComments`: the 6 newest comments. `blog` is not populated.
- "This month" starts on the 1st at 00:00 in the server's local time zone.

### `GET /api/admin/blogs`

All posts, drafts included, sorted by `createdAt` desc. Response `{ success, count, blogs }`. Images are absolute URLs.

### `GET /api/admin/comments`

All comments sorted by `createdAt` desc, with `blog` populated as the full post document (image made absolute). Response `{ success, count, comments }`. If the post was deleted, `blog` is `null`.

### `POST /api/admin/approve-comment`, `POST /api/admin/unapprove-comment`, `POST /api/admin/delete-comment`

| | |
|-|-|
| Auth | JWT |
| Body | `{ "id": "<commentId>" }` |
| Controllers | `approveCommentById`, `unapproveCommentById`, `deleteCommentById` |

Responses: 200 `{ success: true, message: "Comment approved successfully" | "Comment unapproved successfully" | "Comment deleted successfully" }`. The response is 200 even when no comment matches the id. A malformed id returns 500.

## Blog management (authenticated)

These routes live under `/api/blog` after `blogRouter.use(auth)` in `src/routes/blogRoutes.js`. The API has no update or edit endpoint for a post's content; only publish state can change.

### `POST /api/blog/add`

Creates a post with a cover image.

| | |
|-|-|
| Auth | JWT |
| Content type | `multipart/form-data` |
| Middleware | `upload.single('image')` (Multer), then `validateBlogInput` |
| Controller | `blogController.addBlog` |

Form fields:

| Field | Type | Rule |
|-------|------|------|
| `image` | file | required. JPEG, PNG, GIF or WebP, up to 5 MB |
| `blog` | JSON string | `{ title, subTitle?, description, category, isPublished? }` |

Validator rules (on the parsed `blog`): `title` at least 3 characters, `description` at least 10 characters, `category` present, file present. `author` and `authorName` come from the JWT (`req.user.userId`, `req.user.name`), never from the body. `category` is free text at the model level.

- 201 `{ success: true, message: "Blog added successfully", blog: { ... } }`
- 400 `{ success: false, message: "Validation failed", errors: [...] }`
- 500 for an invalid file type (`Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.`), a file over 5 MB (`File too large`), or a `blog` field that is not valid JSON

File storage is covered in [uploads-and-images.md](./uploads-and-images.md).

### `POST /api/blog/delete`

Body `{ "id": "<blogId>" }`. Deletes the image file if it lives in `uploads/blogs/`, then the post, then all of its comments.

- 200 `{ success: true, message: "Blog deleted successfully" }`
- 404 `Blog not found`

### `POST /api/blog/publish`, `POST /api/blog/unpublish`

Body `{ "id": "<blogId>" }`. Sets `isPublished` to `true` or `false`.

- 200 `{ success: true, message: "Blog published successfully" | "Blog unpublished successfully" }`
- 404 `Blog not found`

## AI generation

### `POST /api/blog/generate`

| | |
|-|-|
| Auth | JWT |
| Rate limit | `generateLimiter`: 3 per minute per IP, plus `apiLimiter` |
| Body | `{ "prompt": "Ten tips for remote teams" }` |
| Controller | `blogController.generateContent` calling `src/configs/gemini.js` |

Sends `prompt + " Generate a blog content for this topic in simple text format"` to Gemini model `gemini-2.0-flash` through `@google/genai`, with the key from `GEMINI_API_KEY`.

- 200 `{ success: true, content: "<model text>" }`. The prompt asks for "simple text" but models often return Markdown; the server does not post-process it.
- 400 `{ success: false, message: "Prompt is required" }` when `prompt` is missing or blank
- 429 `Too many generation requests. Please wait a moment.`
- 500 for upstream Gemini errors (bad or missing key, quota) and for a non-string `prompt`

## Uploads and static files

### `GET /uploads/<path>`

`express.static` over `server/uploads/`. It is mounted outside `/api`, so no rate limit applies. It serves `uploads/blogs/*` (admin uploads) and `uploads/seed/*` (seed covers). See [uploads-and-images.md](./uploads-and-images.md).

## Route summary

| Method | Path | Auth | Extra limiter | Validator |
|--------|------|------|---------------|-----------|
| GET | `/` | – | – | – |
| GET | `/api/blog/all` | – | – | – |
| GET | `/api/blog/:blogId` | – | – | – |
| POST | `/api/blog/add-comment` | – | `commentLimiter` | `validateComment` |
| POST | `/api/blog/comments` | – | – | – |
| POST | `/api/blog/add` | JWT | – | Multer + `validateBlogInput` |
| POST | `/api/blog/delete` | JWT | – | – |
| POST | `/api/blog/publish` | JWT | – | – |
| POST | `/api/blog/unpublish` | JWT | – | – |
| POST | `/api/blog/generate` | JWT | `generateLimiter` | inline `prompt` check |
| POST | `/api/admin/login` | – | `loginLimiter` | – |
| GET | `/api/admin/dashboard` | JWT | – | – |
| GET | `/api/admin/blogs` | JWT | – | – |
| GET | `/api/admin/comments` | JWT | – | – |
| POST | `/api/admin/approve-comment` | JWT | – | – |
| POST | `/api/admin/unapprove-comment` | JWT | – | – |
| POST | `/api/admin/delete-comment` | JWT | – | – |
| GET | `/uploads/*` | – | none (outside `/api`) | – |

`apiLimiter` covers every `/api` row.

## Known gaps

- **Malformed ids return 500.** Mongoose `CastError` is not mapped to 400 or 404, and in development the response includes the stack trace (`errorHandler.js`). `tests/errorHandler.test.js` asserts the 500.
- **Drafts are publicly readable.** `GET /api/blog/:blogId` does not filter on `isPublished`.
- **No role checks.** `role` is in the JWT, but no middleware enforces it, so an `author` can moderate comments and delete any post.
- **No input validation** on `/api/admin/login`, `/api/blog/comments`, `/delete`, `/publish`, `/unpublish` or the comment moderation routes. Non-string or missing ids fall through to Mongoose.
- **Comments are not checked against their post.** `add-comment` accepts any well-formed ObjectId, including deleted or unpublished posts.
- **Moderation routes always return success,** even when nothing matched.
- **Multer errors surface as 500** instead of 400 or 413. A file Multer has already written stays on disk when `validateBlogInput` then rejects the request.
- **`/api/blog/all` has no pagination or sort** and returns full HTML bodies.
- **Reads via POST.** `/api/blog/comments` is a read, but it uses `POST`.
