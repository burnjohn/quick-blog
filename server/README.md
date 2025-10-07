## Server — QuickBlog API

Express server providing blog CRUD, comments, admin auth, ImageKit uploads, and Gemini content generation.

### Tech
- Express 5, Mongoose 8, Multer, JWT, ImageKit SDK, Google GenAI

### Environment
Copy `.env.example` to `.env` and fill:

```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

Notes
- MongoDB database used: `quickblog` (appended in code)
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` are used for admin login
- `JWT_SECRET` secures tokens; keep it strong

### Run
```
cd server
npm install
npm run server
```

### REST API

Auth (Admin)
- `POST /api/admin/login` — body: `{ email, password }` → `{ token }`

Admin (JWT required)
- `GET /api/admin/blogs` — list all blogs
- `GET /api/admin/comments` — list all comments
- `POST /api/admin/delete-comment` — body: `{ id }`
- `POST /api/admin/approve-comment` — body: `{ id }`
- `GET /api/admin/dashboard` — counts + recent blogs

Public Blog
- `GET /api/blog/all` — published blogs
- `GET /api/blog/:blogId` — blog by id
- `POST /api/blog/add-comment` — body: `{ blog, name, content }`
- `POST /api/blog/comments` — body: `{ blogId }` → approved comments

Blog Management (JWT required)
- `POST /api/blog/add` — multipart form fields:
  - `blog` (JSON string: `{ title, subTitle, description, category, isPublished }`)
  - `image` (file)
- `POST /api/blog/delete` — body: `{ id }`
- `POST /api/blog/toggle-publish` — body: `{ id }`
- `POST /api/blog/generate` — body: `{ prompt }` → AI‑generated HTML content

### Uploads & Media
- Multer stores temp file; ImageKit receives the buffer
- Transformations: auto quality, webp, width=1280

### Error handling
- Consistent `{ success, message }` on errors; `{ success, ... }` on success


