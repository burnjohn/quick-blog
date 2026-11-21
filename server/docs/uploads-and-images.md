# Uploads and images

Cover images are stored on the local filesystem under `server/uploads/` and served by Express. There is no cloud storage.

## Directory layout

```
server/uploads/
├── .gitignore          # ignores blogs/* (keeps .gitkeep)
├── blogs/              # admin uploads via POST /api/blog/add (git-ignored)
│   └── .gitkeep
└── seed/               # committed seed covers, referenced by fixtures/
    ├── blog_pic_1.png … blog_pic_10.png    # legacy covers (fixtures use 1–6)
    ├── cover_<cat>_NN.svg                  # 24 generated SVG covers (tech 8, life 6, startup 5, fin 5)
    └── photos/<slug>.jpg                   # 42 photo covers, one per seeded post
```

How the seed picks between these is described in [seeding-and-fixtures.md](./seeding-and-fixtures.md#cover-images).

## Multer configuration (`src/middleware/multer.js`)

| Setting | Value |
|---------|-------|
| Storage | `multer.diskStorage` |
| Destination | `path.join(__dirname, '../../uploads/blogs')`, which is `server/uploads/blogs`. Created with `mkdirSync({ recursive: true })` on import and again before each write |
| Filename | `blog-<Date.now()>-<random 0..1e9><original extension>`, for example `blog-1732140000000-123456789.jpg` |
| Allowed MIME types | `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp` |
| Size limit | 5 MB (`limits.fileSize`) |
| Field | `upload.single('image')` on `POST /api/blog/add` |

A rejected type raises `Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')`, and an oversized file raises a `MulterError` (`File too large`). Neither sets a status code, so both reach `errorHandler` as 500.

## What is stored and what is returned

- `blogController.addBlog` stores `image` as the relative path `/uploads/blogs/<filename>`.
- Seed fixtures store `/uploads/seed/...` paths.
- Responses never return the stored path as is. `src/utils/imageUrl.js` makes it absolute:

| Function | Behaviour |
|----------|-----------|
| `getServerBaseUrl(req)` | `process.env.SERVER_URL` if set, otherwise `${req.protocol}://${req.get('host')}` |
| `toFullImageUrl(path, req)` | returns a falsy path unchanged; returns `http://`/`https://` URLs unchanged; otherwise prefixes the base URL |
| `transformBlogImage(blog, req)` | calls `toObject()` on Mongoose docs, then replaces `image` |
| `transformBlogsImages(blogs, req)` | maps the above |

These run in `getAllBlogs`, `getBlogById`, `addBlog`, `getAllBlogsAdmin`, `getDashboard` (recent posts) and `getAllComments` (populated blog).

### `SERVER_URL`

- Optional. It is not listed in `.env.example`.
- If unset, the base URL comes from the request's `Host` header. With direct calls to `localhost:5001`, that gives `http://localhost:5001/uploads/...`.
- Set it when the API is behind a proxy or CDN, or when the public hostname differs from `Host`. No `trust proxy` is configured, so `req.protocol` is `http` behind a TLS-terminating proxy.
- Covered by `tests/imageUrl.test.js`.

## Static serving

`server.js` line 59: `app.use('/uploads', express.static(path.join(__dirname, 'uploads')))`.

- Mounted outside `/api`: no rate limit, no `httpLogger`, no auth.
- Helmet sets `Cross-Origin-Resource-Policy: cross-origin` so the client on another origin can embed the images.
- In development the no-cache middleware runs after the static handler, so static responses use Express's default caching headers (ETag, Last-Modified).
- `src/app.js` (the test app) mounts the same directory via `path.join(__dirname, '..', 'uploads')`.

## Deleting images

`blogController.deleteBlogById` calls `deleteImageFile(blog.image)`:

1. Strips any `http(s)://host` prefix and keeps the last path segment (the filename).
2. Builds `path.join(process.cwd(), 'uploads', 'blogs', filename)`.
3. Unlinks it if it exists. Errors are logged, not thrown.

Because only `uploads/blogs/` is checked, deleting a seeded post never removes a file from `uploads/seed/`.

## Known gaps

- **Delete and upload resolve paths differently.** `deleteImageFile` uses `process.cwd()`, Multer uses the module directory. Deletion works only when the process starts from `server/` (true for every npm script).
- **Orphaned uploads.** When `validateBlogInput` rejects a request, the file Multer already wrote stays in `uploads/blogs/`.
- **Upload errors return 500** instead of 400 or 413.
- **MIME type is trusted.** The check uses the client-declared `mimetype`, not the file contents, and the saved extension comes from the original filename.
- **Storage is not durable on serverless hosts.** `vercel.json` deploys `server.js` as a serverless function, where the filesystem is ephemeral, so uploads would not persist there.
- **`SERVER_URL` is undocumented** in `.env.example`.
